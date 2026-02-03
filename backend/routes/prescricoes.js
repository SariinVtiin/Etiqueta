// backend/routes/prescricoes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar } = require('./auth');

/**
 * FUNÇÃO AUXILIAR: Salvar ou Atualizar Paciente
 */
async function salvarOuAtualizarPaciente(dadosPaciente) {
  try {
    const {
      cpf,
      codigoAtendimento,
      convenio,
      nomePaciente,
      nomeMae,
      dataNascimento,
      idade
    } = dadosPaciente;

    // Verificar se o paciente já existe
    const [pacienteExistente] = await pool.query(
      'SELECT id FROM pacientes WHERE cpf = ?',
      [cpf]
    );

    if (pacienteExistente.length > 0) {
      // ATUALIZAR paciente existente
      await pool.query(
        `UPDATE pacientes SET 
          codigo_atendimento = ?,
          convenio = ?,
          nome_paciente = ?,
          nome_mae = ?,
          data_nascimento = ?,
          idade = ?,
          data_atualizacao = CURRENT_TIMESTAMP
        WHERE cpf = ?`,
        [
          codigoAtendimento,
          convenio,
          nomePaciente,
          nomeMae,
          dataNascimento,
          idade,
          cpf
        ]
      );
      console.log(`Paciente atualizado: ${nomePaciente} (CPF: ${cpf})`);
      return pacienteExistente[0].id;
    } else {
      // INSERIR novo paciente
      const [result] = await pool.query(
        `INSERT INTO pacientes (
          cpf, codigo_atendimento, convenio, nome_paciente, 
          nome_mae, data_nascimento, idade
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          cpf,
          codigoAtendimento,
          convenio,
          nomePaciente,
          nomeMae,
          dataNascimento,
          idade
        ]
      );
      console.log(`Novo paciente cadastrado: ${nomePaciente} (CPF: ${cpf})`);
      return result.insertId;
    }
  } catch (erro) {
    console.error('Erro ao salvar/atualizar paciente:', erro);
    throw erro;
  }
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
      leito,
      page = 1,
      limit = 20
    } = req.query;

    let query = 'SELECT * FROM prescricoes WHERE 1=1';
    const params = [];

    // Filtro de busca (nome, CPF ou leito)
    if (busca) {
      query += ' AND (nome_paciente LIKE ? OR cpf LIKE ? OR leito LIKE ?)';
      const buscaParam = `%${busca}%`;
      params.push(buscaParam, buscaParam, buscaParam);
    }

    // Filtro específico de leito
    if (leito) {
      query += ' AND leito LIKE ?';
      params.push(`%${leito}%`);
    }

    // Filtro de data
    if (dataInicio) {
      query += ' AND DATE(data_prescricao) >= ?';
      params.push(dataInicio);
    }

    if (dataFim) {
      query += ' AND DATE(data_prescricao) <= ?';
      params.push(dataFim);
    }

    // Filtro de setor
    if (setor) {
      query += ' AND nucleo = ?';
      params.push(setor);
    }

    // Filtro de dieta
    if (dieta) {
      query += ' AND dieta = ?';
      params.push(dieta);
    }

    // Ordenar por mais recentes
    query += ' ORDER BY data_prescricao DESC';

    // Paginação
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [prescricoes] = await pool.query(query, params);

    // Contar total para paginação
    let countQuery = 'SELECT COUNT(*) as total FROM prescricoes WHERE 1=1';
    const countParams = params.slice(0, -2); // Remove LIMIT e OFFSET

    if (busca) {
      countQuery += ' AND (nome_paciente LIKE ? OR cpf LIKE ? OR leito LIKE ?)';
    }
    if (leito) {
      countQuery += ' AND leito LIKE ?';
    }
    if (dataInicio) {
      countQuery += ' AND DATE(data_prescricao) >= ?';
    }
    if (dataFim) {
      countQuery += ' AND DATE(data_prescricao) <= ?';
    }
    if (setor) {
      countQuery += ' AND nucleo = ?';
    }
    if (dieta) {
      countQuery += ' AND dieta = ?';
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

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
 * ATUALIZADO: Agora também salva/atualiza o paciente
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
      obsAcrescimo
    } = req.body;

    // Validações
    if (!cpf || !nomePaciente || !nucleo || !leito || !tipoAlimentacao || !dieta) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Campos obrigatórios não preenchidos'
      });
    }

    // ========================================
    // PASSO 1: Salvar/Atualizar PACIENTE
    // ========================================
    await salvarOuAtualizarPaciente({
      cpf,
      codigoAtendimento,
      convenio,
      nomePaciente,
      nomeMae,
      dataNascimento,
      idade
    });

    // ========================================
    // PASSO 2: Salvar PRESCRIÇÃO
    // ========================================
    const restricoesJSON = JSON.stringify(restricoes || []);

    const [result] = await pool.query(
      `INSERT INTO prescricoes (
        cpf, codigo_atendimento, convenio, nome_paciente, nome_mae, 
        data_nascimento, idade, nucleo, leito, tipo_alimentacao, dieta, 
        restricoes, sem_principal, descricao_sem_principal, 
        obs_exclusao, obs_acrescimo, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ATIVO')`,
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
        restricoesJSON,
        semPrincipal || false,
        descricaoSemPrincipal || '',
        obsExclusao || '',
        obsAcrescimo || ''
      ]
    );

    res.status(201).json({
      sucesso: true,
      mensagem: 'Prescrição e paciente salvos com sucesso',
      id: result.insertId
    });

  } catch (erro) {
    console.error('Erro ao criar prescrição:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar prescrição'
    });
  }
});

/**
 * PUT /api/prescricoes/:id - Atualizar prescrição
 * ATUALIZADO: Agora também atualiza o paciente
 */
router.put('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
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
      obsAcrescimo
    } = req.body;

    // Verificar se prescrição existe
    const [prescricoesExistentes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?',
      [id]
    );

    if (prescricoesExistentes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Prescrição não encontrada'
      });
    }

    // Verificar se pode editar (antes das 9h do dia seguinte)
    const dataPrescricao = new Date(prescricoesExistentes[0].data_prescricao);
    const limite = new Date(dataPrescricao);
    limite.setDate(limite.getDate() + 1);
    limite.setHours(9, 0, 0, 0);

    if (new Date() > limite) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Prazo para edição expirado (até 9h do dia seguinte)'
      });
    }

    // ========================================
    // PASSO 1: Atualizar PACIENTE
    // ========================================
    await salvarOuAtualizarPaciente({
      cpf,
      codigoAtendimento,
      convenio,
      nomePaciente,
      nomeMae,
      dataNascimento,
      idade
    });

    // ========================================
    // PASSO 2: Atualizar PRESCRIÇÃO
    // ========================================
    const restricoesJSON = JSON.stringify(restricoes || []);

    await pool.query(
      `UPDATE prescricoes SET 
        cpf = ?, codigo_atendimento = ?, convenio = ?, nome_paciente = ?, 
        nome_mae = ?, data_nascimento = ?, idade = ?, nucleo = ?, leito = ?, 
        tipo_alimentacao = ?, dieta = ?, restricoes = ?, sem_principal = ?, 
        descricao_sem_principal = ?, obs_exclusao = ?, obs_acrescimo = ?
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
        restricoesJSON,
        semPrincipal || false,
        descricaoSemPrincipal || '',
        obsExclusao || '',
        obsAcrescimo || '',
        id
      ]
    );

    res.json({
      sucesso: true,
      mensagem: 'Prescrição e paciente atualizados com sucesso'
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
 * NOTA: NÃO deleta o paciente, apenas a prescrição
 */
router.delete('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se prescrição existe
    const [prescricoesExistentes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?',
      [id]
    );

    if (prescricoesExistentes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Prescrição não encontrada'
      });
    }

    // Verificar se pode excluir (antes das 9h do dia seguinte)
    const dataPrescricao = new Date(prescricoesExistentes[0].data_prescricao);
    const limite = new Date(dataPrescricao);
    limite.setDate(limite.getDate() + 1);
    limite.setHours(9, 0, 0, 0);

    if (new Date() > limite) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Prazo para exclusão expirado (até 9h do dia seguinte)'
      });
    }

    // Deletar prescrição (paciente permanece no banco)
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