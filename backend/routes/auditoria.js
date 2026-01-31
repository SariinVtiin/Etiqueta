// backend/routes/auditoria.js
const express = require('express');
const router = express.Router();
const { autenticar, verificarRole } = require('./auth');
const { listarLogs, obterEstatisticas } = require('../services/auditoria');

/**
 * GET /api/auditoria/logs - Listar logs de auditoria (apenas admin)
 */
router.get('/logs', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const filtros = {
      usuarioId: req.query.usuarioId,
      acao: req.query.acao,
      entidade: req.query.entidade,
      entidadeId: req.query.entidadeId,
      dataInicio: req.query.dataInicio,
      dataFim: req.query.dataFim,
      busca: req.query.busca,
      page: req.query.page,
      limit: req.query.limit
    };

    const resultado = await listarLogs(filtros);
    res.json(resultado);
  } catch (erro) {
    console.error('Erro ao listar logs:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/auditoria/estatisticas - Obter estatísticas de auditoria (apenas admin)
 */
router.get('/estatisticas', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const resultado = await obterEstatisticas();
    res.json(resultado);
  } catch (erro) {
    console.error('Erro ao obter estatísticas:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

module.exports = router;