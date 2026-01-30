// backend/routes/dietas.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

/**
 * GET /api/dietas - Listar todas as dietas
 */
router.get('/', async (req, res) => {
  try {
    const [dietas] = await pool.query(
      'SELECT * FROM dietas WHERE ativa = TRUE ORDER BY nome'
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [dietas] = await pool.query(
      'SELECT * FROM dietas WHERE id = ? AND ativa = TRUE',
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

module.exports = router;