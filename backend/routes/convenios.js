// backend/routes/convenios.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth');

/**
 * GET /api/convenios - Listar convênios (ativos ou todos)
 */
router.get('/', autenticar, async (req, res) => {
  try {
    const { incluirInativas } = req.query;
    const where = incluirInativas === 'true' ? '' : 'WHERE ativa = 1';
    
    const [convenios] = await pool.query(
      `SELECT * FROM convenios ${where} ORDER BY ordem ASC, nome ASC`
    );

    res.json({ sucesso: true, convenios });
  } catch (erro) {
    console.error('Erro ao listar convênios:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar convênios' });
  }
});

/**
 * POST /api/convenios - Criar convênio
 */
router.post('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { nome, descricao, ordem } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });
    }

    // Verificar duplicata
    const [existente] = await pool.query(
      'SELECT id FROM convenios WHERE LOWER(nome) = LOWER(?)', [nome.trim()]
    );
    if (existente.length > 0) {
      return res.status(400).json({ sucesso: false, erro: 'Já existe um convênio com esse nome' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO convenios (nome, descricao, ordem) VALUES (?, ?, ?)',
      [nome.trim(), descricao || null, ordem || 0]
    );

    res.status(201).json({
      sucesso: true,
      mensagem: 'Convênio criado com sucesso',
      id: resultado.insertId
    });
  } catch (erro) {
    console.error('Erro ao criar convênio:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao criar convênio' });
  }
});

/**
 * PUT /api/convenios/:id - Atualizar convênio
 */
router.put('/:id', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, ordem } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });
    }

    // Verificar duplicata (excluindo o próprio)
    const [existente] = await pool.query(
      'SELECT id FROM convenios WHERE LOWER(nome) = LOWER(?) AND id != ?', [nome.trim(), id]
    );
    if (existente.length > 0) {
      return res.status(400).json({ sucesso: false, erro: 'Já existe outro convênio com esse nome' });
    }

    await pool.query(
      'UPDATE convenios SET nome = ?, descricao = ?, ordem = ? WHERE id = ?',
      [nome.trim(), descricao || null, ordem || 0, id]
    );

    res.json({ sucesso: true, mensagem: 'Convênio atualizado com sucesso' });
  } catch (erro) {
    console.error('Erro ao atualizar convênio:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar convênio' });
  }
});

/**
 * PATCH /api/convenios/:id/toggle - Ativar/Desativar
 */
router.patch('/:id/toggle', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { ativa } = req.body;

    await pool.query('UPDATE convenios SET ativa = ? WHERE id = ?', [ativa ? 1 : 0, id]);

    res.json({
      sucesso: true,
      mensagem: `Convênio ${ativa ? 'ativado' : 'desativado'} com sucesso`
    });
  } catch (erro) {
    console.error('Erro ao alterar status:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao alterar status do convênio' });
  }
});

module.exports = router;