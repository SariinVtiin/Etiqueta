// backend/routes/configuracoes.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth');

/**
 * Função utilitária exportada para uso em outros módulos (ex: prescricoes.js)
 * Busca a hora de corte configurada no sistema
 */
async function buscarHoraCorte() {
  try {
    const [[config]] = await pool.query(
      "SELECT valor FROM configuracoes WHERE chave = 'hora_corte'"
    );
    return config ? config.valor : '12:00';
  } catch (_) {
    return '12:00'; // fallback seguro
  }
}

/**
 * GET /api/configuracoes - Listar todas as configurações
 */
router.get('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const [configs] = await pool.query(
      'SELECT chave, valor, descricao, atualizado_em FROM configuracoes ORDER BY chave'
    );
    res.json({ sucesso: true, configuracoes: configs });
  } catch (erro) {
    console.error('Erro ao listar configurações:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar configurações' });
  }
});

/**
 * PUT /api/configuracoes/:chave - Atualizar configuração
 */
router.put('/:chave', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { chave } = req.params;
    const { valor } = req.body;

    if (!valor || !String(valor).trim()) {
      return res.status(400).json({ sucesso: false, erro: 'Valor é obrigatório' });
    }

    // Validação específica para hora_corte
    if (chave === 'hora_corte') {
      const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!regex.test(String(valor).trim())) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Formato inválido para hora de corte. Use HH:MM (ex: 12:00)'
        });
      }
    }

    const [resultado] = await pool.query(
      'UPDATE configuracoes SET valor = ? WHERE chave = ?',
      [String(valor).trim(), chave]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Configuração não encontrada' });
    }

    console.log(`⚙️ Configuração "${chave}" atualizada para: ${valor}`);
    res.json({ sucesso: true, mensagem: 'Configuração atualizada com sucesso' });

  } catch (erro) {
    console.error('Erro ao atualizar configuração:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar configuração' });
  }
});

// ✅ EXPORTS CORRETOS: router separado da função utilitária
module.exports = { router, buscarHoraCorte };