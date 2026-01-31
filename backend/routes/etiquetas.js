// backend/routes/etiquetas.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar } = require('./auth');

/**
 * GET /api/etiquetas - Listar todas as etiquetas
 */
router.get('/', autenticar, async (req, res) => {
  try {
    const [etiquetas] = await pool.query(
      'SELECT * FROM etiquetas ORDER BY id DESC'
    );
    
    res.json({ 
      sucesso: true, 
      total: etiquetas.length,
      etiquetas 
    });
  } catch (erro) {
    console.error('Erro ao listar etiquetas:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/etiquetas/pendentes - Listar apenas pendentes
 */
router.get('/pendentes', autenticar, async (req, res) => {
  try {
    const [etiquetas] = await pool.query(
      "SELECT * FROM etiquetas WHERE status_impressao = 'pendente' ORDER BY id DESC"
    );
    
    res.json({ 
      sucesso: true, 
      total: etiquetas.length,
      etiquetas 
    });
  } catch (erro) {
    console.error('Erro ao buscar pendentes:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/etiquetas - Criar etiqueta
 */
router.post('/', autenticar, async (req, res) => {
  try {
    const { leito, dieta, obs1, obs2, obs3, usuario } = req.body;
    
    if (!leito || !dieta) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Leito e dieta são obrigatórios' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO etiquetas 
       (leito, dieta, obs1, obs2, obs3, usuario, status_impressao) 
       VALUES (?, ?, ?, ?, ?, ?, 'pendente')`,
      [leito, dieta, obs1 || null, obs2 || null, obs3 || null, usuario || 'Sistema']
    );
    
    res.status(201).json({ 
      sucesso: true, 
      mensagem: 'Etiqueta criada',
      id: result.insertId
    });
  } catch (erro) {
    console.error('Erro ao criar etiqueta:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * PATCH /api/etiquetas/:id/imprimir - Marcar como impressa
 */
router.patch('/:id/imprimir', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      `UPDATE etiquetas 
       SET status_impressao = 'impresso', 
           data_impressao = NOW()
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Etiqueta não encontrada' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Etiqueta impressa' 
    });
  } catch (erro) {
    console.error('Erro ao marcar impressão:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/etiquetas/imprimir-lote - Imprimir múltiplas
 */
router.post('/imprimir-lote', autenticar, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'IDs são obrigatórios' 
      });
    }

    const placeholders = ids.map(() => '?').join(',');
    
    const [result] = await pool.query(
      `UPDATE etiquetas 
       SET status_impressao = 'impresso',
           data_impressao = NOW()
       WHERE id IN (${placeholders})`,
      ids
    );
    
    res.json({ 
      sucesso: true, 
      mensagem: `${result.affectedRows} etiqueta(s) impressa(s)`,
      total: result.affectedRows
    });
  } catch (erro) {
    console.error('Erro ao imprimir lote:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * DELETE /api/etiquetas/:id - Deletar etiqueta
 */
router.delete('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'DELETE FROM etiquetas WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Etiqueta não encontrada' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Etiqueta removida' 
    });
  } catch (erro) {
    console.error('Erro ao deletar:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

module.exports = router;