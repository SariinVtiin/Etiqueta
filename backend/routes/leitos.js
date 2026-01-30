// backend/routes/leitos.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

/**
 * GET /api/leitos - Listar todos os leitos
 */
router.get('/', async (req, res) => {
  try {
    const [leitos] = await pool.query(
      'SELECT * FROM leitos WHERE ativo = TRUE ORDER BY setor, numero'
    );
    
    res.json({ 
      sucesso: true, 
      total: leitos.length,
      leitos 
    });
  } catch (erro) {
    console.error('Erro ao buscar leitos:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/leitos/disponiveis - Listar leitos disponíveis
 */
router.get('/disponiveis', async (req, res) => {
  try {
    const [leitos] = await pool.query(`
      SELECT l.* 
      FROM leitos l
      LEFT JOIN pacientes p ON l.id = p.leito_id 
        AND p.ativo = TRUE 
        AND p.data_alta IS NULL
      WHERE l.ativo = TRUE 
        AND p.id IS NULL
      ORDER BY l.setor, l.numero
    `);
    
    res.json({ 
      sucesso: true, 
      total: leitos.length,
      leitos 
    });
  } catch (erro) {
    console.error('Erro ao buscar leitos disponíveis:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

module.exports = router;