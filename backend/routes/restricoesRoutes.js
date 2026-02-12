// backend/routes/restricoesRoutes.js - VERSÃO CORRIGIDA
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth'); // ← CAMINHO CORRIGIDO

// ====================================
// LISTAR TODAS AS RESTRIÇÕES (ativas ou todas)
// ====================================
router.get('/', autenticar, async (req, res) => {
  try {
    const { todas } = req.query;
    
    let query = 'SELECT * FROM restricoes_alimentares';
    
    // Se não for admin ou não pedir "todas", mostrar só ativas
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
    console.error('❌ Erro ao listar restrições:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar restrições alimentares'
    });
  }
});

// ====================================
// BUSCAR RESTRIÇÃO POR ID
// ====================================
router.get('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [restricoes] = await pool.query(
      'SELECT * FROM restricoes_alimentares WHERE id = ?',
      [id]
    );
    
    if (restricoes.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Restrição não encontrada'
      });
    }
    
    res.json({
      sucesso: true,
      restricao: restricoes[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao buscar restrição:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar restrição'
    });
  }
});

// ====================================
// CRIAR NOVA RESTRIÇÃO (SOMENTE ADMIN)
// ====================================
router.post('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { nome, descricao, ordem } = req.body;
    
    // Validações
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome da restrição é obrigatório'
      });
    }
    
    // Verificar duplicidade
    const [existente] = await pool.query(
      'SELECT id FROM restricoes_alimentares WHERE nome = ?',
      [nome.trim()]
    );
    
    if (existente.length > 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Já existe uma restrição com este nome'
      });
    }
    
    // Inserir
    const [resultado] = await pool.query(
      `INSERT INTO restricoes_alimentares (nome, descricao, ordem, ativa) 
       VALUES (?, ?, ?, TRUE)`,
      [nome.trim(), descricao?.trim() || null, ordem || 999]
    );
    
    // Buscar restrição criada
    const [novaRestricao] = await pool.query(
      'SELECT * FROM restricoes_alimentares WHERE id = ?',
      [resultado.insertId]
    );
    
    console.log(`✅ Restrição criada: ${nome} (ID: ${resultado.insertId})`);
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Restrição criada com sucesso',
      restricao: novaRestricao[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao criar restrição:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar restrição alimentar'
    });
  }
});

// ====================================
// ATUALIZAR RESTRIÇÃO (SOMENTE ADMIN)
// ====================================
router.put('/:id', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, ordem } = req.body;
    
    // Verificar se existe
    const [existe] = await pool.query(
      'SELECT id FROM restricoes_alimentares WHERE id = ?',
      [id]
    );
    
    if (existe.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Restrição não encontrada'
      });
    }
    
    // Validar nome
    if (!nome || nome.trim() === '') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome da restrição é obrigatório'
      });
    }
    
    // Verificar duplicidade (exceto a própria)
    const [duplicado] = await pool.query(
      'SELECT id FROM restricoes_alimentares WHERE nome = ? AND id != ?',
      [nome.trim(), id]
    );
    
    if (duplicado.length > 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Já existe outra restrição com este nome'
      });
    }
    
    // Atualizar
    await pool.query(
      `UPDATE restricoes_alimentares 
       SET nome = ?, descricao = ?, ordem = ?
       WHERE id = ?`,
      [nome.trim(), descricao?.trim() || null, ordem || 999, id]
    );
    
    // Buscar restrição atualizada
    const [restricaoAtualizada] = await pool.query(
      'SELECT * FROM restricoes_alimentares WHERE id = ?',
      [id]
    );
    
    console.log(`✅ Restrição atualizada: ${nome} (ID: ${id})`);
    
    res.json({
      sucesso: true,
      mensagem: 'Restrição atualizada com sucesso',
      restricao: restricaoAtualizada[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao atualizar restrição:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar restrição'
    });
  }
});

// ====================================
// ATIVAR/DESATIVAR RESTRIÇÃO (SOMENTE ADMIN)
// ====================================
router.patch('/:id/toggle', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { ativa } = req.body;
    
    // Verificar se existe
    const [existe] = await pool.query(
      'SELECT id, nome FROM restricoes_alimentares WHERE id = ?',
      [id]
    );
    
    if (existe.length === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Restrição não encontrada'
      });
    }
    
    // Atualizar status
    await pool.query(
      'UPDATE restricoes_alimentares SET ativa = ? WHERE id = ?',
      [ativa ? 1 : 0, id]
    );
    
    console.log(`✅ Restrição ${ativa ? 'ativada' : 'desativada'}: ${existe[0].nome}`);
    
    res.json({
      sucesso: true,
      mensagem: `Restrição ${ativa ? 'ativada' : 'desativada'} com sucesso`
    });
  } catch (erro) {
    console.error('❌ Erro ao alterar status:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao alterar status da restrição'
    });
  }
});

// ====================================
// REORDENAR RESTRIÇÕES (SOMENTE ADMIN)
// ====================================
router.post('/reordenar', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { restricoes } = req.body; // Array de { id, ordem }
    
    if (!Array.isArray(restricoes) || restricoes.length === 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Lista de restrições inválida'
      });
    }
    
    // Atualizar ordem de cada restrição
    for (const restricao of restricoes) {
      await pool.query(
        'UPDATE restricoes_alimentares SET ordem = ? WHERE id = ?',
        [restricao.ordem, restricao.id]
      );
    }
    
    console.log('✅ Ordem das restrições atualizada');
    
    res.json({
      sucesso: true,
      mensagem: 'Ordem atualizada com sucesso'
    });
  } catch (erro) {
    console.error('❌ Erro ao reordenar:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao reordenar restrições'
    });
  }
});

module.exports = router;