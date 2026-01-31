// backend/routes/dietas.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth');

/**
 * GET /api/dietas - Listar todas as dietas
 */
router.get('/', autenticar, async (req, res) => {
  try {
    const [dietas] = await pool.query(
      'SELECT * FROM dietas ORDER BY nome'
    );
    
    res.json({ 
      sucesso: true, 
      total: dietas.length,
      dietas 
    });
  } catch (erro) {
    console.error('Erro ao buscar dietas:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/dietas/:id - Buscar dieta por ID
 */
router.get('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [dietas] = await pool.query(
      'SELECT * FROM dietas WHERE id = ?',
      [id]
    );
    
    if (dietas.length === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Dieta não encontrada' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      dieta: dietas[0] 
    });
  } catch (erro) {
    console.error('Erro ao buscar dieta:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/dietas - Criar nova dieta (apenas admin)
 */
router.post('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { nome, codigo, descricao } = req.body;
    
    if (!nome || !codigo) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Nome e código são obrigatórios' 
      });
    }

    // Verificar se código já existe
    const [dietasExistentes] = await pool.query(
      'SELECT id FROM dietas WHERE codigo = ?',
      [codigo]
    );

    if (dietasExistentes.length > 0) {
      return res.status(409).json({ 
        sucesso: false, 
        erro: 'Código já cadastrado' 
      });
    }

    // Inserir dieta
    const [result] = await pool.query(
      'INSERT INTO dietas (nome, codigo, descricao, ativa) VALUES (?, ?, ?, TRUE)',
      [nome, codigo, descricao || null]
    );
    
    res.status(201).json({ 
      sucesso: true, 
      mensagem: 'Dieta criada com sucesso',
      id: result.insertId
    });
  } catch (erro) {
    console.error('Erro ao criar dieta:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * PUT /api/dietas/:id - Atualizar dieta (apenas admin)
 */
router.put('/:id', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, codigo, descricao } = req.body;
    
    if (!nome || !codigo) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Nome e código são obrigatórios' 
      });
    }

    // Verificar se código já existe em outra dieta
    const [codigoExistente] = await pool.query(
      'SELECT id FROM dietas WHERE codigo = ? AND id != ?',
      [codigo, id]
    );

    if (codigoExistente.length > 0) {
      return res.status(409).json({ 
        sucesso: false, 
        erro: 'Código já cadastrado para outra dieta' 
      });
    }

    // Atualizar dieta
    const [result] = await pool.query(
      'UPDATE dietas SET nome = ?, codigo = ?, descricao = ? WHERE id = ?',
      [nome, codigo, descricao || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Dieta não encontrada' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Dieta atualizada com sucesso' 
    });
  } catch (erro) {
    console.error('Erro ao atualizar dieta:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * PATCH /api/dietas/:id/toggle - Ativar/Desativar dieta (apenas admin)
 */
router.patch('/:id/toggle', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { ativa } = req.body;
    
    if (typeof ativa !== 'boolean') {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Status ativo deve ser true ou false' 
      });
    }

    const [result] = await pool.query(
      'UPDATE dietas SET ativa = ? WHERE id = ?',
      [ativa, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Dieta não encontrada' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: `Dieta ${ativa ? 'ativada' : 'desativada'} com sucesso` 
    });
  } catch (erro) {
    console.error('Erro ao alterar status da dieta:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

module.exports = router;