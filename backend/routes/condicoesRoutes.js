// backend/routes/condicoesRoutes.js - VERSÃO CORRIGIDA
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth'); // ← CAMINHO CORRIGIDO

// ====================================
// LISTAR TODAS AS CONDIÇÕES NUTRICIONAIS (ativas ou todas)
// ====================================
router.get('/', autenticar, async (req, res) => {
  try {
    const { todas } = req.query;
    
    let query = 'SELECT * FROM condicoes_nutricionais';
    
    // Se não for admin ou não pedir "todas", mostrar só ativas
    if (!todas || req.usuario.role !== 'admin') {
      query += ' WHERE ativa = TRUE';
    }
    
    query += ' ORDER BY ordem ASC, nome ASC';
    
    const [condicoes] = await pool.query(query);
    
    res.json({
      sucesso: true,
      restricoes: condicoes,
      total: condicoes.length
    });
  } catch (erro) {
    console.error('❌ Erro ao listar condições nutricionais:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar condições nutricionais'
    });
  }
});

// ====================================
// BUSCAR Condição nutricional POR ID
// ====================================
router.get('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [condicoes] = await pool.query(
      'SELECT * FROM condicoes_nutricionais WHERE id = ?',
      [id]
    );
    
    if (condicoes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Condição nutricional não encontrada'
      });
    }
    
    res.json({
      sucesso: true,
      restricao: condicoes[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao buscar Condição nutricional:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar Condição nutricional'
    });
  }
});

// ====================================
// CRIAR NOVA Condição nutricional (SOMENTE ADMIN)
// ====================================
router.post('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { nome, descricao, ordem } = req.body;
    
    // Validações
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome da condição nutricional é obrigatório'
      });
    }
    
    // Verificar duplicidade
    const [existente] = await pool.query(
      'SELECT id FROM condicoes_nutricionais WHERE nome = ?',
      [nome.trim()]
    );
    
    if (existente.length > 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Já existe uma condição nutricional com este nome'
      });
    }
    
    // Inserir
    const [resultado] = await pool.query(
      `INSERT INTO condicoes_nutricionais (nome, descricao, ordem, ativa) 
       VALUES (?, ?, ?, TRUE)`,
      [nome.trim(), descricao?.trim() || null, ordem || 999]
    );
    
    // Buscar Condição nutricional criada
    const [novaRestricao] = await pool.query(
      'SELECT * FROM condicoes_nutricionais WHERE id = ?',
      [resultado.insertId]
    );
    
    console.log(`✅ Condição nutricional criada: ${nome} (ID: ${resultado.insertId})`);
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Condição nutricional criada com sucesso',
      restricao: novaRestricao[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao criar Condição nutricional:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar condição nutricional'
    });
  }
});

// ====================================
// ATUALIZAR Condição nutricional (SOMENTE ADMIN)
// ====================================
router.put('/:id', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, ordem } = req.body;
    
    // Verificar se existe
    const [existe] = await pool.query(
      'SELECT id FROM condicoes_nutricionais WHERE id = ?',
      [id]
    );
    
    if (existe.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Condição nutricional não encontrada'
      });
    }
    
    // Validar nome
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome da Condição nutricional é obrigatório'
      });
    }
    
    // Verificar duplicidade (exceto a própria)
    const [duplicado] = await pool.query(
      'SELECT id FROM condicoes_nutricionais WHERE nome = ? AND id != ?',
      [nome.trim(), id]
    );
    
    if (duplicado.length > 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Já existe outra condição nutricional com este nome'
      });
    }
    
    // Atualizar
    await pool.query(
      `UPDATE condicoes_nutricionais 
       SET nome = ?, descricao = ?, ordem = ?
       WHERE id = ?`,
      [nome.trim(), descricao?.trim() || null, ordem || 999, id]
    );
    
    // Buscar Condição nutricional atualizada
    const [restricaoAtualizada] = await pool.query(
      'SELECT * FROM condicoes_nutricionais WHERE id = ?',
      [id]
    );
    
    console.log(`✅ Condição nutricional atualizada: ${nome} (ID: ${id})`);
    
    res.json({
      sucesso: true,
      mensagem: 'Condição nutricional atualizada com sucesso',
      restricao: restricaoAtualizada[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao atualizar Condição nutricional:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar Condição nutricional'
    });
  }
});

// ====================================
// ATIVAR/DESATIVAR Condição nutricional (SOMENTE ADMIN)
// ====================================
router.patch('/:id/toggle', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { ativa } = req.body;
    
    // Verificar se existe
    const [existe] = await pool.query(
      'SELECT id, nome FROM condicoes_nutricionais WHERE id = ?',
      [id]
    );
    
    if (existe.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Condição nutricional não encontrada'
      });
    }
    
    // Atualizar status
    await pool.query(
      'UPDATE condicoes_nutricionais SET ativa = ? WHERE id = ?',
      [ativa ? 1 : 0, id]
    );
    
    console.log(`✅ Condição nutricional ${ativa ? 'ativada' : 'desativada'}: ${existe[0].nome}`);
    
    res.json({
      sucesso: true,
      mensagem: `Condição nutricional ${ativa ? 'ativada' : 'desativada'} com sucesso`
    });
  } catch (erro) {
    console.error('❌ Erro ao alterar status:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao alterar status da condição nutricional'
    });
  }
});

// ====================================
// REORDENAR CONDIÇÕES NUTRICIONAIS (SOMENTE ADMIN)
// ====================================
router.post('/reordenar', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { condicoes } = req.body; // Array de { id, ordem }
    
    if (!Array.isArray(condicoes) || condicoes.length === 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Lista de condições inválida'
      });
    }
    
    // Atualizar ordem de cada Condição nutricional
    for (const restricao of condicoes) {
      await pool.query(
        'UPDATE condicoes_nutricionais SET ordem = ? WHERE id = ?',
        [restricao.ordem, restricao.id]
      );
    }
    
    console.log('✅ Ordem das condições nutricionais atualizada');
    
    res.json({
      sucesso: true,
      mensagem: 'Ordem atualizada com sucesso'
    });
  } catch (erro) {
    console.error('❌ Erro ao reordenar:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao reordenar condições nutricionais'
    });
  }
});

module.exports = router;