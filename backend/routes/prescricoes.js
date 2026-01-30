// backend/routes/prescricoes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar } = require('./auth');

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

    // Filtro de busca (nome, CPF ou leito)
    if (busca) {
      query += ' AND (nome_paciente LIKE ? OR cpf LIKE ? OR leito LIKE ?)';
      const buscaParam = `%${busca}%`;
      params.push(buscaParam, buscaParam, buscaParam);
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
    if (!cpf || !codigoAtendimento || !nomePaciente || !nomeMae || !leito || !tipoAlimentacao || !dieta) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Campos obrigatórios faltando'
      });
    }

    const [resultado] = await pool.query(
      `INSERT INTO prescricoes (
        cpf, codigo_atendimento, convenio, nome_paciente, nome_mae,
        data_nascimento, idade, nucleo, leito, tipo_alimentacao, dieta,
        restricoes, sem_principal, descricao_sem_principal,
        obs_exclusao, obs_acrescimo, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        req.usuario.id
      ]
    );

    res.status(201).json({
      sucesso: true,
      mensagem: 'Prescrição criada com sucesso',
      id: resultado.insertId
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

    // Validar se pode editar (até 9h do dia seguinte)
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
      obsAcrescimo
    } = req.body;

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
        restricoes ? JSON.stringify(restricoes) : null,
        semPrincipal || false,
        descricaoSemPrincipal || null,
        obsExclusao || null,
        obsAcrescimo || null,
        id
      ]
    );

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

    // Validar se pode excluir (até 9h do dia seguinte)
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

/**
 * Função auxiliar: Verificar se pode editar/excluir
 * Regra: Até 9h do dia seguinte
 */
function podeEditarOuExcluir(dataPrescricao) {
  const agora = new Date();
  const prescricao = new Date(dataPrescricao);
  
  // Criar data limite: 9h do dia seguinte
  const limite = new Date(prescricao);
  limite.setDate(limite.getDate() + 1);
  limite.setHours(9, 0, 0, 0);
  
  return agora <= limite;
}

module.exports = router;