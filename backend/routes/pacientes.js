// backend/routes/pacientes.js
// ✅ VERSÃO FINAL: Busca por CPF + Verificação de código de atendimento

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

    console.log('🔍 Buscando paciente por CPF:', cpfLimpo);

    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?',
      [cpfLimpo]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Paciente não encontrado'
      });
    }

    const paciente = pacientes[0];

    // Buscar o ÚLTIMO código de atendimento usado nas prescrições
    const [ultimaPrescricao] = await pool.query(
      `SELECT codigo_atendimento FROM prescricoes 
       WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?
       ORDER BY data_prescricao DESC, id DESC 
       LIMIT 1`,
      [cpfLimpo]
    );

    const ultimoCodigoAtendimento = ultimaPrescricao.length > 0 
      ? ultimaPrescricao[0].codigo_atendimento 
      : paciente.codigo_atendimento;

    // Formatar data de nascimento para DD/MM/AAAA
    let dataFormatada = '';
    if (paciente.data_nascimento) {
      const data = new Date(paciente.data_nascimento);
      const dia = String(data.getUTCDate()).padStart(2, '0');
      const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
      const ano = data.getUTCFullYear();
      dataFormatada = `${dia}/${mes}/${ano}`;
    }

    console.log('✅ Paciente encontrado:', paciente.nome_paciente, '| Último código:', ultimoCodigoAtendimento);

    res.json({
      sucesso: true,
      paciente: {
        cpf: paciente.cpf,
        nome_paciente: paciente.nome_paciente,
        nome_mae: paciente.nome_mae,
        data_nascimento: dataFormatada,
        idade: paciente.idade,
        codigo_atendimento: ultimoCodigoAtendimento,
        convenio: paciente.convenio
      }
    });

  } catch (erro) {
    console.error('❌ Erro ao buscar paciente por CPF:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar paciente' });
  }
});

/**
 * GET /api/pacientes/verificar-codigo/:codigo - Verificar se código de atendimento já existe
 * Retorna se o código já está em uso e por qual CPF
 */
router.get('/verificar-codigo/:codigo', autenticar, async (req, res) => {
  try {
    const { codigo } = req.params;
    const cpfAtual = req.query.cpf ? req.query.cpf.replace(/\D/g, '') : null;

    console.log('🔍 Verificando código de atendimento:', codigo, '| CPF atual:', cpfAtual);

    // Verificar na tabela pacientes
    const [pacientes] = await pool.query(
      `SELECT cpf, nome_paciente FROM pacientes 
       WHERE codigo_atendimento = ? 
       AND REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") != ?`,
      [codigo, cpfAtual || '']
    );

    if (pacientes.length > 0) {
      console.log('⚠️ Código já usado por:', pacientes[0].nome_paciente);
      return res.json({
        sucesso: true,
        disponivel: false,
        mensagem: `Código já utilizado pelo paciente: ${pacientes[0].nome_paciente}`
      });
    }

    // Verificar também na tabela prescrições (caso o pacientes tenha sido atualizado)
    const [prescricoes] = await pool.query(
      `SELECT cpf, nome_paciente FROM prescricoes 
       WHERE codigo_atendimento = ? 
       AND REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") != ?
       LIMIT 1`,
      [codigo, cpfAtual || '']
    );

    if (prescricoes.length > 0) {
      console.log('⚠️ Código já usado em prescrição por:', prescricoes[0].nome_paciente);
      return res.json({
        sucesso: true,
        disponivel: false,
        mensagem: `Código já utilizado pelo paciente: ${prescricoes[0].nome_paciente}`
      });
    }

    console.log('✅ Código disponível:', codigo);
    res.json({
      sucesso: true,
      disponivel: true
    });

  } catch (erro) {
    console.error('❌ Erro ao verificar código:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao verificar código' });
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
      query += ' AND (nome_paciente LIKE ? OR cpf LIKE ? OR REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") LIKE ?)';
      const buscaParam = `%${busca}%`;
      params.push(buscaParam, buscaParam, buscaParam);
    }

    query += ' ORDER BY updated_at DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [pacientes] = await pool.query(query, params);

    let countQuery = 'SELECT COUNT(*) as total FROM pacientes WHERE 1=1';
    const countParams = [];
    if (busca) {
      countQuery += ' AND (nome_paciente LIKE ? OR cpf LIKE ? OR REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") LIKE ?)';
      const buscaParam = `%${busca}%`;
      countParams.push(buscaParam, buscaParam, buscaParam);
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
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar pacientes' });
  }
});

/**
 * GET /api/pacientes/:cpf - Buscar paciente por CPF
 */
router.get('/:cpf', autenticar, async (req, res) => {
  try {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/\D/g, '');

    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?',
      [cpfLimpo]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Paciente não encontrado' });
    }

    res.json({ sucesso: true, paciente: pacientes[0] });

  } catch (erro) {
    console.error('Erro ao buscar paciente:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar paciente' });
  }
});

/**
 * GET /api/pacientes/:cpf/prescricoes - Listar prescrições de um paciente
 */
router.get('/:cpf/prescricoes', autenticar, async (req, res) => {
  try {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/\D/g, '');

    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?',
      [cpfLimpo]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Paciente não encontrado' });
    }

    const [prescricoes] = await pool.query(
      'SELECT * FROM prescricoes WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ? ORDER BY data_prescricao DESC',
      [cpfLimpo]
    );

    res.json({
      sucesso: true,
      paciente: pacientes[0],
      prescricoes,
      total_prescricoes: prescricoes.length
    });

  } catch (erro) {
    console.error('Erro ao buscar prescrições do paciente:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar prescrições do paciente' });
  }
});

module.exports = router;