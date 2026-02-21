// backend/routes/tiposRefeicaoRoutes.js
// VERSÃO ATUALIZADA: suporte a listas personalizadas com import Excel + versioning

const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ====================================
// LISTAR REFEIÇÕES
// GET /api/refeicoes?incluirInativas=true
// ====================================
router.get('/', autenticar, async (req, res) => {
  try {
    const incluirInativas = req.query.incluirInativas === 'true';
    const query = incluirInativas
      ? 'SELECT * FROM tipos_refeicao ORDER BY ordem ASC, nome ASC'
      : 'SELECT * FROM tipos_refeicao WHERE ativa = 1 ORDER BY ordem ASC, nome ASC';

    const [refeicoes] = await pool.query(query);
    res.json({ sucesso: true, refeicoes });
  } catch (erro) {
    console.error('Erro ao listar refeições:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar tipos de refeição' });
  }
});

// ====================================
// CRIAR REFEIÇÃO (SOMENTE ADMIN)
// POST /api/refeicoes
// ====================================
router.post('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { nome, descricao, ordem } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ sucesso: false, erro: 'Nome da refeição é obrigatório' });
    }

    const [existente] = await pool.query('SELECT id FROM tipos_refeicao WHERE nome = ?', [nome.trim()]);
    if (existente.length > 0) {
      return res.status(400).json({ sucesso: false, erro: 'Já existe uma refeição com este nome' });
    }

    const grupoDia = req.body.grupo_dia === 'atual' ? 'atual' : 'proximo';

    const [resultado] = await pool.query(
      'INSERT INTO tipos_refeicao (nome, descricao, ordem, ativa, tem_lista_personalizada, grupo_dia) VALUES (?, ?, ?, 1, 0, ?)',
      [nome.trim(), descricao?.trim() || null, ordem || 999, grupoDia]
    );

    const [nova] = await pool.query('SELECT * FROM tipos_refeicao WHERE id = ?', [resultado.insertId]);
    res.status(201).json({ sucesso: true, mensagem: 'Refeição criada com sucesso', refeicao: nova[0] });
  } catch (erro) {
    console.error('Erro ao criar refeição:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao criar tipo de refeição' });
  }
});

// ====================================
// ATUALIZAR REFEIÇÃO (SOMENTE ADMIN)
// PUT /api/refeicoes/:id
// ====================================
router.put('/:id', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, ordem } = req.body;

    const [existe] = await pool.query('SELECT id FROM tipos_refeicao WHERE id = ?', [id]);
    if (existe.length === 0) return res.status(404).json({ sucesso: false, erro: 'Refeição não encontrada' });

    if (!nome || nome.trim() === '') return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });

    const [duplicado] = await pool.query('SELECT id FROM tipos_refeicao WHERE nome = ? AND id != ?', [nome.trim(), id]);
    if (duplicado.length > 0) return res.status(400).json({ sucesso: false, erro: 'Já existe outra refeição com este nome' });

    const grupoDia = req.body.grupo_dia === 'atual' ? 'atual' : 'proximo';

    await pool.query(
      'UPDATE tipos_refeicao SET nome = ?, descricao = ?, ordem = ?, grupo_dia = ? WHERE id = ?',
      [nome.trim(), descricao?.trim() || null, ordem || 999, grupoDia, id]
    );

    const [atualizada] = await pool.query('SELECT * FROM tipos_refeicao WHERE id = ?', [id]);
    res.json({ sucesso: true, mensagem: 'Refeição atualizada com sucesso', refeicao: atualizada[0] });
  } catch (erro) {
    console.error('Erro ao atualizar refeição:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar tipo de refeição' });
  }
});

// ====================================
// ATIVAR / DESATIVAR REFEIÇÃO
// PATCH /api/refeicoes/:id/toggle
// ====================================
router.patch('/:id/toggle', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { ativa } = req.body;

    const [existe] = await pool.query('SELECT id, nome FROM tipos_refeicao WHERE id = ?', [id]);
    if (existe.length === 0) return res.status(404).json({ sucesso: false, erro: 'Refeição não encontrada' });

    await pool.query('UPDATE tipos_refeicao SET ativa = ? WHERE id = ?', [ativa ? 1 : 0, id]);
    res.json({ sucesso: true, mensagem: `Refeição ${ativa ? 'ativada' : 'desativada'} com sucesso` });
  } catch (erro) {
    console.error('Erro ao alterar status da refeição:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao alterar status' });
  }
});

// ====================================
// TOGGLE LISTA PERSONALIZADA
// PATCH /api/refeicoes/:id/toggle-lista
// ====================================
router.patch('/:id/toggle-lista', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { tem_lista_personalizada } = req.body;

    const [existe] = await pool.query('SELECT id, nome FROM tipos_refeicao WHERE id = ?', [id]);
    if (existe.length === 0) return res.status(404).json({ sucesso: false, erro: 'Refeição não encontrada' });

    await pool.query(
      'UPDATE tipos_refeicao SET tem_lista_personalizada = ? WHERE id = ?',
      [tem_lista_personalizada ? 1 : 0, id]
    );

    console.log(`✅ Lista personalizada ${tem_lista_personalizada ? 'ativada' : 'desativada'} para refeição ID ${id}`);
    res.json({
      sucesso: true,
      mensagem: `Lista personalizada ${tem_lista_personalizada ? 'ativada' : 'desativada'}`
    });
  } catch (erro) {
    console.error('Erro ao alterar lista personalizada:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao alterar configuração' });
  }
});

// ====================================
// LISTAR ITENS ATIVOS DE UMA REFEIÇÃO
// GET /api/refeicoes/:id/itens
// ====================================
router.get('/:id/itens', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar versão ativa mais recente
    const [versoes] = await pool.query(
      'SELECT id FROM versoes_itens_refeicao WHERE refeicao_id = ? AND ativa = 1 ORDER BY id DESC LIMIT 1',
      [id]
    );

    if (versoes.length === 0) {
      return res.json({ sucesso: true, itens: [], total: 0 });
    }

    const versaoId = versoes[0].id;

    const [itens] = await pool.query(
      `SELECT id, produto, gramatura, valor 
       FROM itens_refeicao_especial 
       WHERE refeicao_id = ? AND versao_id = ? AND ativo = 1 
       ORDER BY produto ASC`,
      [id, versaoId]
    );

    res.json({ sucesso: true, itens, total: itens.length });
  } catch (erro) {
    console.error('Erro ao listar itens:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar itens da refeição' });
  }
});

// ====================================
// LISTAR ITENS POR IDs (para exibição no histórico)
// GET /api/refeicoes/itens/buscar/:ids
// ====================================
router.get('/itens/buscar/:ids', autenticar, async (req, res) => {
  try {
    const { ids } = req.params;
    const idsArray = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));

    if (idsArray.length === 0) return res.json({ sucesso: true, itens: [] });

    const placeholders = idsArray.map(() => '?').join(',');
    const [itens] = await pool.query(
      `SELECT id, produto, gramatura FROM itens_refeicao_especial WHERE id IN (${placeholders})`,
      idsArray
    );

    res.json({ sucesso: true, itens });
  } catch (erro) {
    console.error('Erro ao buscar itens por IDs:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar itens' });
  }
});

// ====================================
// IMPORTAR PLANILHA EXCEL (SOMENTE ADMIN)
// POST /api/refeicoes/:id/itens/importar
// ====================================
router.post('/:id/itens/importar', autenticar, verificarRole(['admin']), upload.single('arquivo'), async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se refeição existe e tem lista personalizada ativa
    const [refeicoes] = await pool.query('SELECT id, nome FROM tipos_refeicao WHERE id = ?', [id]);
    if (refeicoes.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Refeição não encontrada' });
    }

    if (!req.file) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum arquivo enviado' });
    }

    // Ler Excel
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const dados = xlsx.utils.sheet_to_json(worksheet);

    if (dados.length === 0) {
      return res.status(400).json({ sucesso: false, erro: 'Arquivo vazio ou sem dados válidos' });
    }

    // Validar se a primeira linha tem a coluna PRODUTO
    const primeiraLinha = dados[0];
    const temProduto = 'PRODUTO' in primeiraLinha || 'produto' in primeiraLinha || 'Produto' in primeiraLinha;
    if (!temProduto) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Coluna "PRODUTO" não encontrada. A planilha deve ter as colunas: PRODUTO, GRAMATURA, VALOR'
      });
    }

    // Normalizar nomes das colunas (aceita maiúsculas e minúsculas)
    const normalizar = (linha) => ({
      produto:   linha.PRODUTO   || linha.produto   || linha.Produto   || '',
      gramatura: linha.GRAMATURA || linha.gramatura || linha.Gramatura || null,
      valor:     linha.VALOR     || linha.valor     || linha.Valor     || 0
    });

    const itensNormalizados = dados
      .map(normalizar)
      .filter(item => item.produto.toString().trim() !== '');

    if (itensNormalizados.length === 0) {
      return res.status(400).json({ sucesso: false, erro: 'Nenhum item válido encontrado na planilha' });
    }

    // Transação: desativar versão antiga → criar nova versão → inserir itens
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Desativar versões anteriores desta refeição
      await connection.query(
        'UPDATE versoes_itens_refeicao SET ativa = 0 WHERE refeicao_id = ?',
        [id]
      );

      // 2. Criar nova versão
      const [novaVersao] = await connection.query(
        'INSERT INTO versoes_itens_refeicao (refeicao_id, nome_arquivo, total_itens, ativa) VALUES (?, ?, ?, 1)',
        [id, req.file.originalname, itensNormalizados.length]
      );
      const versaoId = novaVersao.insertId;

      // 3. Inserir itens da nova versão
      for (const item of itensNormalizados) {
        await connection.query(
          'INSERT INTO itens_refeicao_especial (refeicao_id, versao_id, produto, gramatura, valor, ativo) VALUES (?, ?, ?, ?, ?, 1)',
          [id, versaoId, item.produto.toString().trim(), item.gramatura, parseFloat(item.valor) || 0]
        );
      }

      // 4. Garantir que tem_lista_personalizada está ativo
      await connection.query(
        'UPDATE tipos_refeicao SET tem_lista_personalizada = 1 WHERE id = ?',
        [id]
      );

      await connection.commit();
      console.log(`✅ Importação concluída para refeição ${refeicoes[0].nome}: ${itensNormalizados.length} itens`);

      res.json({
        sucesso: true,
        mensagem: `Importação concluída com sucesso!`,
        detalhes: {
          refeicao: refeicoes[0].nome,
          versao_id: versaoId,
          total_importado: itensNormalizados.length,
          arquivo: req.file.originalname
        }
      });
    } catch (erro) {
      await connection.rollback();
      throw erro;
    } finally {
      connection.release();
    }
  } catch (erro) {
    console.error('Erro ao importar itens:', erro);
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

// ====================================
// ESTATÍSTICAS DE ITENS DE UMA REFEIÇÃO
// GET /api/refeicoes/:id/itens/estatisticas
// ====================================
router.get('/:id/itens/estatisticas', autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [stats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM itens_refeicao_especial ire
         JOIN versoes_itens_refeicao vir ON ire.versao_id = vir.id
         WHERE ire.refeicao_id = ? AND vir.ativa = 1 AND ire.ativo = 1) AS total_ativos,
        (SELECT criado_em FROM versoes_itens_refeicao WHERE refeicao_id = ? ORDER BY id DESC LIMIT 1) AS ultima_importacao,
        (SELECT nome_arquivo FROM versoes_itens_refeicao WHERE refeicao_id = ? ORDER BY id DESC LIMIT 1) AS ultimo_arquivo,
        (SELECT COUNT(*) FROM versoes_itens_refeicao WHERE refeicao_id = ?) AS total_versoes
    `, [id, id, id, id]);

    res.json({ sucesso: true, estatisticas: stats[0] });
  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar estatísticas' });
  }
});

module.exports = router;