// backend/routes/pacientes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar } = require('./auth');

/**
 * GET /api/pacientes - Listar todos os pacientes
 */
router.get('/', autenticar, async (req, res) => {
  try {
    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE ativo = TRUE ORDER BY nome'
    );
    
    res.json({ 
      sucesso: true, 
      total: pacientes.length,
      pacientes 
    });
  } catch (erro) {
    console.error('Erro ao buscar pacientes:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/pacientes/:id - Buscar paciente por ID
 */
router.get('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE id = ? AND ativo = TRUE',
      [id]
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
      erro: erro.message 
    });
  }
});

/**
 * POST /api/pacientes - Cadastrar novo paciente
 */
router.post('/', autenticar, async (req, res) => {
  try {
    const { nome, cpf, leito_id, data_nascimento } = req.body;
    
    if (!nome || !cpf) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Nome e CPF são obrigatórios' 
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO pacientes (nome, cpf, leito_id, data_nascimento) VALUES (?, ?, ?, ?)',
      [nome, cpf, leito_id || null, data_nascimento || null]
    );
    
    res.status(201).json({ 
      sucesso: true, 
      mensagem: 'Paciente cadastrado com sucesso',
      id: result.insertId
    });
  } catch (erro) {
    console.error('Erro ao cadastrar paciente:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

module.exports = router;