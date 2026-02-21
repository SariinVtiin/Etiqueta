// backend/routes/prescricoes.js
// VERSÃO ATUALIZADA: Com cálculo automático de data de consumo por refeição

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar } = require('./auth');
const { buscarHoraCorte } = require('./configuracoes');

/**
 * FUNÇÃO: Calcular data de consumo da prescrição
 * 
 * Lógica:
 *   Se criado até hora_corte:
 *     grupo 'atual'   → hoje
 *     grupo 'proximo' → amanhã
 *   Se criado após hora_corte:
 *     grupo 'atual'   → amanhã
 *     grupo 'proximo' → depois de amanhã
 * 
 * @param {string} tipoAlimentacao - Nome do tipo de refeição
 * @returns {string} Data no formato YYYY-MM-DD
 */
async function calcularDataConsumo(tipoAlimentacao) {
  try {
    // Buscar grupo_dia da refeição
    const [[refeicao]] = await pool.query(
      'SELECT grupo_dia FROM tipos_refeicao WHERE nome = ? AND ativa = 1',
      [tipoAlimentacao]
    );

    const grupoDia = refeicao ? refeicao.grupo_dia : 'proximo';

    // Buscar hora de corte configurada
    const horaCorteStr = await buscarHoraCorte();
    const [horaCorteH, horaCorteM] = horaCorteStr.split(':').map(Number);

    // Data e hora atual (horário do servidor)
    const agora = new Date();
    const horaAtual = agora.getHours();
    const minAtual = agora.getMinutes();

    const dentroDoCOrte = (horaAtual < horaCorteH) ||
      (horaAtual === horaCorteH && minAtual <= horaCorteM);

    // Calcular offset de dias
    let offsetDias;
    if (dentroDoCOrte) {
      offsetDias = grupoDia === 'atual' ? 0 : 1;
    } else {
      offsetDias = grupoDia === 'atual' ? 1 : 2;
    }

    const dataConsumo = new Date(agora);
    dataConsumo.setDate(dataConsumo.getDate() + offsetDias);

    // Formatar como YYYY-MM-DD
    const ano = dataConsumo.getFullYear();
    const mes = String(dataConsumo.getMonth() + 1).padStart(2, '0');
    const dia = String(dataConsumo.getDate()).padStart(2, '0');

    const dataFormatada = `${ano}-${mes}-${dia}`;

    console.log(`📅 Data de consumo calculada:
      Refeição: ${tipoAlimentacao} (grupo: ${grupoDia})
      Hora atual: ${horaAtual}:${String(minAtual).padStart(2,'0')} | Corte: ${horaCorteStr}
      Dentro do corte: ${dentroDoCOrte} | Offset: +${offsetDias} dia(s)
      Data consumo: ${dataFormatada}`);

    return dataFormatada;

  } catch (erro) {
    console.error('❌ Erro ao calcular data de consumo:', erro);
    // Fallback: data de hoje
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,'0')}-${String(hoje.getDate()).padStart(2,'0')}`;
  }
}

/**
 * FUNÇÃO AUXILIAR: Salvar ou Atualizar Paciente
 */
async function salvarOuAtualizarPaciente(dados) {
  const {
    cpf,
    codigoAtendimento,
    convenio,
    nomePaciente,
    nomeMae,
    dataNascimento,
    idade
  } = dados;

  const cpfLimpo = cpf.replace(/\D/g, '');

  try {
    const [codigoExistente] = await pool.query(
      `SELECT cpf, nome_paciente FROM pacientes 
       WHERE codigo_atendimento = ? 
       AND REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") != ?`,
      [codigoAtendimento, cpfLimpo]
    );

    if (codigoExistente.length > 0) {
      throw new Error(`Código de atendimento ${codigoAtendimento} já está em uso pelo paciente: ${codigoExistente[0].nome_paciente}`);
    }

    const [pacientesExistentes] = await pool.query(
      'SELECT id, nome_paciente FROM pacientes WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?',
      [cpfLimpo]
    );

    if (pacientesExistentes.length > 0) {
      console.log(`🔄 Atualizando paciente existente: ${pacientesExistentes[0].nome_paciente} (CPF: ${cpfLimpo})`);
      await pool.query(
        `UPDATE pacientes SET 
          codigo_atendimento = ?,
          convenio = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [codigoAtendimento, convenio, pacientesExistentes[0].id]
      );
      return pacientesExistentes[0].id;
    }

    console.log(`🆕 Criando novo paciente: ${nomePaciente} (CPF: ${cpfLimpo})`);
    const [resultado] = await pool.query(
      `INSERT INTO pacientes (
        cpf, codigo_atendimento, convenio, nome_paciente, 
        nome_mae, data_nascimento, idade
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cpfLimpo, codigoAtendimento, convenio, nomePaciente, nomeMae, dataNascimento, idade]
    );

    console.log(`✅ Novo paciente criado! ID: ${resultado.insertId}`);
    return resultado.insertId;

  } catch (erro) {
    console.error(`❌ Erro ao salvar paciente:`, erro);
    throw erro;
  }
}

/**
 * Validar se prescrição pode ser editada ou excluída
 * Regra: Até 9h do dia seguinte
 */
function podeEditarOuExcluir(dataPrescricao) {
  const agora = new Date();
  const prescricao = new Date(dataPrescricao);
  
  const limite = new Date(prescricao);
  limite.setDate(limite.getDate() + 1);
  limite.setHours(9, 0, 0, 0);
  
  return agora <= limite;
}

/**
 * GET /api/prescricoes - Listar prescrições com filtros
 */
router.get('/', autenticar, async (req, res) => {
  try {
    const { 
      busca, 
      dataInicio, 
      dataFim, 
      setor, 
      dieta,
      page = 1,
      limit = 20
    } = req.query;

    let query = 'SELECT * FROM prescricoes WHERE 1=1';
    const params = [];

    if (busca) {
      query += ' AND (nome_paciente LIKE ? OR cpf LIKE ? OR leito LIKE ?)';
      const buscaParam = `%${busca}%`;
      params.push(buscaParam, buscaParam, buscaParam);
    }

    if (dataInicio) {
      query += ' AND DATE(data_prescricao) >= ?';
      params.push(dataInicio);
    }

    if (dataFim) {
      query += ' AND DATE(data_prescricao) <= ?';
      params.push(dataFim);
    }

    if (setor) {
      query += ' AND nucleo = ?';
      params.push(setor);
    }

    if (dieta) {
      query += ' AND dieta = ?';
      params.push(dieta);
    }

    query += ' ORDER BY data_prescricao DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [prescricoes] = await pool.query(query, params);

    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM prescricoes WHERE 1=1'
    );

    res.json({
      sucesso: true,
      prescricoes,
      paginacao: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPaginas: Math.ceil(total / limit)
      }
    });

  } catch (erro) {
    console.error('Erro ao listar prescrições:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar prescrições' });
  }
});

/**
 * GET /api/prescricoes/:id - Buscar prescrição por ID
 */
router.get('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [prescricoes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?',
      [id]
    );

    if (prescricoes.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Prescrição não encontrada' });
    }

    res.json({ sucesso: true, prescricao: prescricoes[0] });

  } catch (erro) {
    console.error('Erro ao buscar prescrição:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar prescrição' });
  }
});

/**
 * POST /api/prescricoes - Criar nova prescrição
 * ✅ ATUALIZADO: Calcula data_prescricao automaticamente com base no grupo_dia da refeição
 */
router.post('/', autenticar, async (req, res) => {
  try {
    const {
      cpf,
      codigoAtendimento,
      convenio,
      nomePaciente,
      nomeMae,
      dataNascimento,
      idade,
      nucleo,
      leito,
      tipoAlimentacao,
      dieta,
      restricoes,
      semPrincipal,
      descricaoSemPrincipal,
      obsExclusao,
      obsAcrescimo,
      acrescimosIds,
      itensEspeciaisIds
    } = req.body;

    const temItensEspeciais = itensEspeciaisIds && itensEspeciaisIds.length > 0;
    if (!tipoAlimentacao || (!dieta && !temItensEspeciais) || !nomePaciente || !cpf) {
      return res.status(400).json({ sucesso: false, erro: 'Campos obrigatórios faltando' });
    }

    console.log('📦 Dados recebidos:', {
      cpf,
      nomePaciente,
      tipoAlimentacao,
      dieta,
      acrescimosIds: acrescimosIds ? `[${acrescimosIds.length} itens]` : 'nenhum'
    });

    // ✅ NOVO: Calcular data de consumo com base na refeição e hora de corte
    const dataConsumo = await calcularDataConsumo(tipoAlimentacao);

    // Salvar/Atualizar paciente
    await salvarOuAtualizarPaciente({
      cpf, codigoAtendimento, convenio, nomePaciente, nomeMae, dataNascimento, idade
    });

    // ✅ ATUALIZADO: data_prescricao agora recebe a data de consumo calculada
    const [resultado] = await pool.query(
      `INSERT INTO prescricoes (
        cpf, codigo_atendimento, convenio, nome_paciente, nome_mae,
        data_nascimento, idade, nucleo, leito, tipo_alimentacao, dieta,
        restricoes, sem_principal, descricao_sem_principal,
        obs_exclusao, obs_acrescimo, acrescimos_ids, itens_especiais_ids,
        data_prescricao, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cpf,
        codigoAtendimento,
        convenio,
        nomePaciente,
        nomeMae,
        dataNascimento,
        idade,
        nucleo,
        leito,
        tipoAlimentacao,
        dieta,
        restricoes ? JSON.stringify(restricoes) : null,
        semPrincipal || false,
        descricaoSemPrincipal || null,
        obsExclusao || null,
        obsAcrescimo || null,
        acrescimosIds ? JSON.stringify(acrescimosIds) : null,
        itensEspeciaisIds ? JSON.stringify(itensEspeciaisIds) : null,
        dataConsumo,   // ← data de consumo calculada (YYYY-MM-DD)
        req.usuario.id
      ]
    );

    console.log(`✅ Prescrição criada! ID: ${resultado.insertId} | Data consumo: ${dataConsumo}`);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Prescrição criada com sucesso',
      id: resultado.insertId,
      dataConsumo  // retornar para o frontend exibir confirmação se precisar
    });

  } catch (erro) {
    console.error('Erro ao criar prescrição:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao criar prescrição: ' + erro.message });
  }
});

/**
 * PUT /api/prescricoes/:id - Atualizar prescrição
 * NOTA: data_prescricao NÃO é recalculada na edição (mantém a data original de consumo)
 */
router.put('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [prescricoes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?', [id]
    );

    if (prescricoes.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Prescrição não encontrada' });
    }

    const prescricao = prescricoes[0];

    if (!podeEditarOuExcluir(prescricao.criado_em)) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Prescrição não pode mais ser editada. Limite: 9h do dia seguinte.'
      });
    }

    const {
      cpf, codigoAtendimento, convenio, nomePaciente, nomeMae,
      dataNascimento, idade, nucleo, leito, tipoAlimentacao, dieta,
      restricoes, semPrincipal, descricaoSemPrincipal,
      obsExclusao, obsAcrescimo, acrescimosIds, itensEspeciaisIds
    } = req.body;

    await pool.query(
      `UPDATE prescricoes SET
        cpf = ?, codigo_atendimento = ?, convenio = ?, nome_paciente = ?,
        nome_mae = ?, data_nascimento = ?, idade = ?, nucleo = ?, leito = ?,
        tipo_alimentacao = ?, dieta = ?, restricoes = ?, sem_principal = ?,
        descricao_sem_principal = ?, obs_exclusao = ?, obs_acrescimo = ?,
        acrescimos_ids = ?, itens_especiais_ids = ?
      WHERE id = ?`,
      [
        cpf, codigoAtendimento, convenio, nomePaciente, nomeMae,
        dataNascimento, idade, nucleo, leito, tipoAlimentacao, dieta,
        restricoes ? JSON.stringify(restricoes) : null,
        semPrincipal || false, descricaoSemPrincipal || null,
        obsExclusao || null, obsAcrescimo || null,
        acrescimosIds ? JSON.stringify(acrescimosIds) : null,
        itensEspeciaisIds ? JSON.stringify(itensEspeciaisIds) : null,
        id
      ]
    );

    console.log(`✅ Prescrição ${id} atualizada com sucesso!`);

    res.json({ sucesso: true, mensagem: 'Prescrição atualizada com sucesso' });

  } catch (erro) {
    console.error('Erro ao atualizar prescrição:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar prescrição' });
  }
});

/**
 * DELETE /api/prescricoes/:id - Deletar prescrição
 */
router.delete('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [prescricoes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?', [id]
    );

    if (prescricoes.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Prescrição não encontrada' });
    }

    const prescricao = prescricoes[0];

    if (!podeEditarOuExcluir(prescricao.criado_em)) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Prescrição não pode mais ser excluída. Limite: 9h do dia seguinte.'
      });
    }

    await pool.query('DELETE FROM prescricoes WHERE id = ?', [id]);

    res.json({ sucesso: true, mensagem: 'Prescrição excluída com sucesso' });

  } catch (erro) {
    console.error('Erro ao excluir prescrição:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao excluir prescrição' });
  }
});

module.exports = router;