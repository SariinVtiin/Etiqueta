// backend/routes/prescricoes.js
// VERSÃO CORRIGIDA: COM SUPORTE COMPLETO A ACRÉSCIMOS

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar } = require('./auth');

/**
 * FUNÇÃO AUXILIAR: Salvar ou Atualizar Paciente
 * ✅ VERSÃO FINAL:
 *   - CPF SEMPRE salvo SEM formatação
 *   - Se CPF existe → ATUALIZA o codigo_atendimento (pode mudar entre internações)
 *   - Se CPF não existe → INSERE novo paciente
 *   - Valida se o código não pertence a outro CPF antes de salvar
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
    // PASSO 1: Verificar se o código de atendimento já pertence a OUTRO paciente
    const [codigoExistente] = await pool.query(
      `SELECT cpf, nome_paciente FROM pacientes 
       WHERE codigo_atendimento = ? 
       AND REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") != ?`,
      [codigoAtendimento, cpfLimpo]
    );

    if (codigoExistente.length > 0) {
      throw new Error(`Código de atendimento ${codigoAtendimento} já está em uso pelo paciente: ${codigoExistente[0].nome_paciente}`);
    }

    // PASSO 2: Verificar se o paciente já existe
    const [pacientesExistentes] = await pool.query(
      'SELECT id, nome_paciente FROM pacientes WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?',
      [cpfLimpo]
    );

    if (pacientesExistentes.length > 0) {
      // ✅ Paciente EXISTE → Atualizar código de atendimento e convênio
      console.log(`🔄 Atualizando paciente existente: ${pacientesExistentes[0].nome_paciente} (CPF: ${cpfLimpo})`);
      
      await pool.query(
        `UPDATE pacientes SET 
          codigo_atendimento = ?,
          convenio = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [codigoAtendimento, convenio, pacientesExistentes[0].id]
      );

      console.log(`✅ Código atualizado para: ${codigoAtendimento}`);
      return pacientesExistentes[0].id;
    }

    // PASSO 3: Paciente NÃO existe → Criar novo com CPF limpo
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
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar prescrições'
    });
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
      return res.status(404).json({
        sucesso: false,
        erro: 'Prescrição não encontrada'
      });
    }

    res.json({
      sucesso: true,
      prescricao: prescricoes[0]
    });

  } catch (erro) {
    console.error('Erro ao buscar prescrição:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar prescrição'
    });
  }
});

/**
 * POST /api/prescricoes - Criar nova prescrição
 * ✅ CORRIGIDO: Agora salva acrescimosIds
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
      acrescimosIds  // ✅ ADICIONADO
    } = req.body;

    // Validações
    if (!cpf || !codigoAtendimento || !nomePaciente || !nomeMae || !leito || !tipoAlimentacao || !dieta) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Campos obrigatórios faltando'
      });
    }

    // Log para debug
    console.log('📦 Dados recebidos:', {
      cpf,
      nomePaciente,
      dieta,
      acrescimosIds: acrescimosIds ? `[${acrescimosIds.length} itens]` : 'nenhum'
    });

    // PASSO 1: Salvar/Atualizar paciente
    await salvarOuAtualizarPaciente({
      cpf,
      codigoAtendimento,
      convenio,
      nomePaciente,
      nomeMae,
      dataNascimento,
      idade
    });

    // PASSO 2: Criar prescrição (COM acrescimos_ids)
    const [resultado] = await pool.query(
      `INSERT INTO prescricoes (
        cpf, codigo_atendimento, convenio, nome_paciente, nome_mae,
        data_nascimento, idade, nucleo, leito, tipo_alimentacao, dieta,
        restricoes, sem_principal, descricao_sem_principal,
        obs_exclusao, obs_acrescimo, acrescimos_ids, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        acrescimosIds ? JSON.stringify(acrescimosIds) : null,  // ✅ ADICIONADO
        req.usuario.id
      ]
    );

    console.log(`✅ Prescrição criada com sucesso! ID: ${resultado.insertId}`);
    
    if (acrescimosIds && acrescimosIds.length > 0) {
      console.log(`📝 Acréscimos salvos: ${acrescimosIds.join(', ')}`);
    }

    res.status(201).json({
      sucesso: true,
      mensagem: 'Prescrição criada com sucesso',
      id: resultado.insertId
    });

  } catch (erro) {
    console.error('Erro ao criar prescrição:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar prescrição: ' + erro.message
    });
  }
});

/**
 * PUT /api/prescricoes/:id - Atualizar prescrição
 * ✅ CORRIGIDO: Agora atualiza acrescimosIds
 */
router.put('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar prescrição
    const [prescricoes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?',
      [id]
    );

    if (prescricoes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Prescrição não encontrada'
      });
    }

    const prescricao = prescricoes[0];

    // Validar se pode editar
    if (!podeEditarOuExcluir(prescricao.data_prescricao)) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Prescrição não pode mais ser editada. Limite: 9h do dia seguinte.'
      });
    }

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
      acrescimosIds  // ✅ ADICIONADO
    } = req.body;

    await pool.query(
      `UPDATE prescricoes SET
        cpf = ?, codigo_atendimento = ?, convenio = ?, nome_paciente = ?,
        nome_mae = ?, data_nascimento = ?, idade = ?, nucleo = ?, leito = ?,
        tipo_alimentacao = ?, dieta = ?, restricoes = ?, sem_principal = ?,
        descricao_sem_principal = ?, obs_exclusao = ?, obs_acrescimo = ?,
        acrescimos_ids = ?
      WHERE id = ?`,
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
        acrescimosIds ? JSON.stringify(acrescimosIds) : null,  // ✅ ADICIONADO
        id
      ]
    );

    console.log(`✅ Prescrição ${id} atualizada com sucesso!`);

    res.json({
      sucesso: true,
      mensagem: 'Prescrição atualizada com sucesso'
    });

  } catch (erro) {
    console.error('Erro ao atualizar prescrição:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar prescrição'
    });
  }
});

/**
 * DELETE /api/prescricoes/:id - Deletar prescrição
 */
router.delete('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [prescricoes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?',
      [id]
    );

    if (prescricoes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Prescrição não encontrada'
      });
    }

    const prescricao = prescricoes[0];

    if (!podeEditarOuExcluir(prescricao.data_prescricao)) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Prescrição não pode mais ser excluída. Limite: 9h do dia seguinte.'
      });
    }

    await pool.query('DELETE FROM prescricoes WHERE id = ?', [id]);

    res.json({
      sucesso: true,
      mensagem: 'Prescrição excluída com sucesso'
    });

  } catch (erro) {
    console.error('Erro ao excluir prescrição:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao excluir prescrição'
    });
  }
});

module.exports = router;