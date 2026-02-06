// backend/routes/pacientes.js
// ARQUIVO COMPLETO - Use este arquivo completo

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar } = require('./auth');

/**
 * GET /api/pacientes/buscar/:cpf - Buscar paciente por CPF para auto-completar
 * IMPORTANTE: Esta rota DEVE ficar ANTES das outras rotas com /:cpf
 */
router.get('/buscar/:cpf', autenticar, async (req, res) => {
  try {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/\D/g, '');

    console.log('Buscando paciente por CPF:', cpfLimpo);

    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE cpf = ?',
      [cpfLimpo]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Paciente não encontrado'
      });
    }

    const paciente = pacientes[0];

    // Formatar data de nascimento para DD/MM/AAAA
    let dataFormatada = '';
    if (paciente.data_nascimento) {
      const data = new Date(paciente.data_nascimento);
      const dia = String(data.getDate() + 1).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      dataFormatada = `${dia}/${mes}/${ano}`;
    }

    console.log('Paciente encontrado:', paciente.nome_paciente);

    res.json({
      sucesso: true,
      paciente: {
        cpf: paciente.cpf,
        nome_paciente: paciente.nome_paciente,
        nome_mae: paciente.nome_mae,
        data_nascimento: dataFormatada,
        idade: paciente.idade,
        codigo_atendimento: paciente.codigo_atendimento,
        convenio: paciente.convenio
      }
    });

  } catch (erro) {
    console.error('Erro ao buscar paciente por CPF:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar paciente'
    });
  }
});

/**
 * GET /api/pacientes - Listar todos os pacientes
 */
router.get('/', autenticar, async (req, res) => {
  try {
    const { busca, page = 1, limit = 20 } = req.query;

    let query = 'SELECT * FROM pacientes WHERE 1=1';
    const params = [];

    if (busca) {
      query += ' AND (nome_paciente LIKE ? OR cpf LIKE ?)';
      const buscaParam = `%${busca}%`;
      params.push(buscaParam, buscaParam);
    }

    query += ' ORDER BY data_atualizacao DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [pacientes] = await pool.query(query, params);

    let countQuery = 'SELECT COUNT(*) as total FROM pacientes WHERE 1=1';
    const countParams = params.slice(0, -2);

    if (busca) {
      countQuery += ' AND (nome_paciente LIKE ? OR cpf LIKE ?)';
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      sucesso: true,
      pacientes,
      paginacao: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPaginas: Math.ceil(total / limit)
      }
    });

  } catch (erro) {
    console.error('Erro ao listar pacientes:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar pacientes'
    });
  }
});

/**
 * GET /api/pacientes/:cpf - Buscar paciente por CPF
 */
router.get('/:cpf', autenticar, async (req, res) => {
  try {
    const { cpf } = req.params;

    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE cpf = ?',
      [cpf]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Paciente não encontrado'
      });
    }

    res.json({
      sucesso: true,
      paciente: pacientes[0]
    });

  } catch (erro) {
    console.error('Erro ao buscar paciente:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar paciente'
    });
  }
});

/**
 * GET /api/pacientes/:cpf/prescricoes - Listar prescrições de um paciente
 */
router.get('/:cpf/prescricoes', autenticar, async (req, res) => {
  try {
    const { cpf } = req.params;

    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE cpf = ?',
      [cpf]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Paciente não encontrado'
      });
    }

    const [prescricoes] = await pool.query(
      'SELECT * FROM prescricoes WHERE cpf = ? ORDER BY data_prescricao DESC',
      [cpf]
    );

    res.json({
      sucesso: true,
      paciente: pacientes[0],
      prescricoes: prescricoes,
      total_prescricoes: prescricoes.length
    });

  } catch (erro) {
    console.error('Erro ao buscar prescrições do paciente:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar prescrições do paciente'
    });
  }
});

module.exports = router;