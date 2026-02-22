// backend/routes/restricoesAcompanhante.js
// CRUD completo para restrições do condições nutricionais do acompanhante (cadastro próprio, separado das restrições de paciente)

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth');

// ====================================
// LISTAR condições nutricionais do acompanhante
// ====================================
router.get('/', autenticar, async (req, res) => {
  try {
    const { todas } = req.query;

    let query = 'SELECT * FROM condicoes_nutricionais_acompanhante';

    // Se não for admin ou não pedir "todas", só ativas
    if (!todas || req.usuario.role !== 'admin') {
      query += ' WHERE ativa = TRUE';
    }

    query += ' ORDER BY ordem ASC, nome ASC';

    const [restricoes] = await pool.query(query);

    res.json({
      sucesso: true,
      restricoes,
      total: restricoes.length
    });
  } catch (erro) {
    console.error('❌ Erro ao listar condições nutricionais do acompanhante:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar condições nutricionais do acompanhante' });
  }
});

// ====================================
// CRIAR condição nutricional (SOMENTE ADMIN)
// ====================================
router.post('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { nome, descricao, ordem } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });
    }

    // Verificar duplicidade
    const [existente] = await pool.query(
      'SELECT id FROM condicoes_nutricionais_acompanhante WHERE nome = ?',
      [nome.trim()]
    );

    if (existente.length > 0) {
      return res.status(400).json({ sucesso: false, erro: 'Já existe uma condição nutricional com este nome' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO condicoes_nutricionais_acompanhante (nome, descricao, ordem, ativa) VALUES (?, ?, ?, TRUE)',
      [nome.trim(), descricao?.trim() || null, ordem || 999]
    );

    const [nova] = await pool.query('SELECT * FROM condicoes_nutricionais_acompanhante WHERE id = ?', [resultado.insertId]);

    console.log(`✅ condição nutricional acompanhante criada: ${nome} (ID: ${resultado.insertId})`);

    res.status(201).json({
      sucesso: true,
      mensagem: 'condição nutricional do acompanhante criada com sucesso',
      restricao: nova[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao criar condição nutricional do acompanhante:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao criar condição nutricional' });
  }
});

// ====================================
// ATUALIZAR condição nutricional (SOMENTE ADMIN)
// ====================================
router.put('/:id', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, ordem } = req.body;

    const [existe] = await pool.query('SELECT id FROM condicoes_nutricionais_acompanhante WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'condição nutricional não encontrada' });
    }

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });
    }

    // Verificar duplicidade (excluindo a própria)
    const [duplicado] = await pool.query(
      'SELECT id FROM condicoes_nutricionais_acompanhante WHERE nome = ? AND id != ?',
      [nome.trim(), id]
    );

    if (duplicado.length > 0) {
      return res.status(400).json({ sucesso: false, erro: 'Já existe outra condição nutricional com este nome' });
    }

    await pool.query(
      'UPDATE condicoes_nutricionais_acompanhante SET nome = ?, descricao = ?, ordem = ? WHERE id = ?',
      [nome.trim(), descricao?.trim() || null, ordem || 999, id]
    );

    const [atualizada] = await pool.query('SELECT * FROM condicoes_nutricionais_acompanhante WHERE id = ?', [id]);

    console.log(`✅ condição nutricional acompanhante atualizada: ${nome} (ID: ${id})`);

    res.json({
      sucesso: true,
      mensagem: 'condição nutricional atualizada com sucesso',
      restricao: atualizada[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao atualizar condição nutricional do acompanhante:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar condição nutricional' });
  }
});

// ====================================
// ATIVAR/DESATIVAR condição nutricional (SOMENTE ADMIN)
// ====================================
router.patch('/:id/toggle', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { ativa } = req.body;

    const [existe] = await pool.query('SELECT id, nome FROM condicoes_nutricionais_acompanhante WHERE id = ?', [id]);
    if (existe.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Condição nutricional não encontrada' });
    }

    await pool.query('UPDATE condicoes_nutricionais_acompanhante SET ativa = ? WHERE id = ?', [ativa ? 1 : 0, id]);

    console.log(`✅ Condição nutricional acompanhante ${ativa ? 'ativada' : 'desativada'}: ${existe[0].nome}`);

    res.json({
      sucesso: true,
      mensagem: `Condição nutricional ${ativa ? 'ativada' : 'desativada'} com sucesso`
    });
  } catch (erro) {
    console.error('❌ Erro ao alterar status:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao alterar status' });
  }
});

module.exports = router;