// backend/routes/substituicoesPrincipal.js
// CRUD completo para Substituição de Principal (categorias + itens/preparos)

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { autenticar, verificarPermissao } = require('./auth');

// ====================================
// LISTAR TUDO (categorias + itens agrupados)
// ====================================
router.get('/', autenticar, async (req, res) => {
  try {
    const { todas } = req.query;

    let queryCat = 'SELECT * FROM categorias_substituicao_principal';
    let queryItens = `
      SELECT i.*, c.nome AS categoria_nome 
      FROM itens_substituicao_principal i
      JOIN categorias_substituicao_principal c ON c.id = i.categoria_id
    `;

    if (!todas || req.usuario.role !== 'admin') {
      queryCat += ' WHERE ativa = TRUE';
      queryItens += ' WHERE c.ativa = TRUE AND i.ativo = TRUE';
    }

    queryCat += ' ORDER BY ordem ASC, nome ASC';
    queryItens += ' ORDER BY c.ordem ASC, i.ordem ASC, i.nome ASC';

    const [categorias] = await pool.query(queryCat);
    const [itens] = await pool.query(queryItens);

    // Agrupar itens por categoria
    const categoriasComItens = categorias.map(cat => ({
      ...cat,
      itens: itens.filter(item => item.categoria_id === cat.id)
    }));

    res.json({
      sucesso: true,
      categorias: categoriasComItens,
      totalCategorias: categorias.length,
      totalItens: itens.length
    });
  } catch (erro) {
    console.error('❌ Erro ao listar substituições de principal:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar dados' });
  }
});

// ====================================
// LISTAR APENAS CATEGORIAS
// ====================================
router.get('/categorias', autenticar, async (req, res) => {
  try {
    const { todas } = req.query;
    let query = 'SELECT * FROM categorias_substituicao_principal';

    if (!todas || req.usuario.role !== 'admin') {
      query += ' WHERE ativa = TRUE';
    }

    query += ' ORDER BY ordem ASC, nome ASC';

    const [categorias] = await pool.query(query);

    res.json({ sucesso: true, categorias, total: categorias.length });
  } catch (erro) {
    console.error('❌ Erro ao listar categorias:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar categorias' });
  }
});

// ====================================
// CRIAR CATEGORIA (SOMENTE ADMIN)
// ====================================
router.post('/categorias', autenticar, verificarPermissao("faturamento"), async (req, res) => {
  try {
    const { nome, ordem } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });
    }

    // Verificar duplicidade
    const [existente] = await pool.query(
      'SELECT id FROM categorias_substituicao_principal WHERE nome = ?',
      [nome.trim()]
    );

    if (existente.length > 0) {
      return res.status(400).json({ sucesso: false, erro: 'Já existe uma categoria com este nome' });
    }

    const [resultado] = await pool.query(
      'INSERT INTO categorias_substituicao_principal (nome, ordem) VALUES (?, ?)',
      [nome.trim(), ordem || 999]
    );

    const [nova] = await pool.query(
      'SELECT * FROM categorias_substituicao_principal WHERE id = ?',
      [resultado.insertId]
    );

    console.log(`✅ Categoria criada: ${nome}`);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Categoria criada com sucesso',
      categoria: nova[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao criar categoria:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao criar categoria' });
  }
});

// ====================================
// ATUALIZAR CATEGORIA (SOMENTE ADMIN)
// ====================================
router.put('/categorias/:id', autenticar, verificarPermissao("faturamento"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, ordem } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });
    }

    // Verificar duplicidade (excluindo a própria)
    const [duplicado] = await pool.query(
      'SELECT id FROM categorias_substituicao_principal WHERE nome = ? AND id != ?',
      [nome.trim(), id]
    );

    if (duplicado.length > 0) {
      return res.status(400).json({ sucesso: false, erro: 'Já existe outra categoria com este nome' });
    }

    const [result] = await pool.query(
      'UPDATE categorias_substituicao_principal SET nome = ?, ordem = ? WHERE id = ?',
      [nome.trim(), ordem || 999, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Categoria não encontrada' });
    }

    console.log(`✅ Categoria atualizada: ${nome} (ID: ${id})`);

    res.json({ sucesso: true, mensagem: 'Categoria atualizada com sucesso' });
  } catch (erro) {
    console.error('❌ Erro ao atualizar categoria:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar categoria' });
  }
});

// ====================================
// ATIVAR/DESATIVAR CATEGORIA (SOMENTE ADMIN)
// ====================================
router.patch('/categorias/:id/toggle', autenticar, verificarPermissao("faturamento"), async (req, res) => {
  try {
    const { id } = req.params;
    const { ativa } = req.body;

    const [existe] = await pool.query(
      'SELECT id, nome FROM categorias_substituicao_principal WHERE id = ?',
      [id]
    );

    if (existe.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Categoria não encontrada' });
    }

    await pool.query(
      'UPDATE categorias_substituicao_principal SET ativa = ? WHERE id = ?',
      [ativa ? 1 : 0, id]
    );

    // Se desativar categoria, desativar todos os itens dela também
    if (!ativa) {
      await pool.query(
        'UPDATE itens_substituicao_principal SET ativo = 0 WHERE categoria_id = ?',
        [id]
      );
    }

    console.log(`✅ Categoria ${ativa ? 'ativada' : 'desativada'}: ${existe[0].nome}`);

    res.json({
      sucesso: true,
      mensagem: `Categoria ${ativa ? 'ativada' : 'desativada'} com sucesso`
    });
  } catch (erro) {
    console.error('❌ Erro ao alterar status da categoria:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao alterar status' });
  }
});

// ====================================
// CRIAR ITEM/PREPARO (SOMENTE ADMIN)
// ====================================
router.post('/itens', autenticar, verificarPermissao("faturamento"), async (req, res) => {
  try {
    const { categoria_id, nome, ordem } = req.body;

    if (!categoria_id || !nome || nome.trim() === '') {
      return res.status(400).json({ sucesso: false, erro: 'Categoria e nome são obrigatórios' });
    }

    // Verificar se categoria existe
    const [categoria] = await pool.query(
      'SELECT id, nome FROM categorias_substituicao_principal WHERE id = ?',
      [categoria_id]
    );

    if (categoria.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Categoria não encontrada' });
    }

    // Verificar duplicidade dentro da categoria
    const [existente] = await pool.query(
      'SELECT id FROM itens_substituicao_principal WHERE categoria_id = ? AND nome = ?',
      [categoria_id, nome.trim()]
    );

    if (existente.length > 0) {
      return res.status(400).json({
        sucesso: false,
        erro: `Já existe o item "${nome.trim()}" na categoria "${categoria[0].nome}"`
      });
    }

    const [resultado] = await pool.query(
      'INSERT INTO itens_substituicao_principal (categoria_id, nome, ordem) VALUES (?, ?, ?)',
      [categoria_id, nome.trim(), ordem || 999]
    );

    const [novo] = await pool.query(
      'SELECT i.*, c.nome AS categoria_nome FROM itens_substituicao_principal i JOIN categorias_substituicao_principal c ON c.id = i.categoria_id WHERE i.id = ?',
      [resultado.insertId]
    );

    console.log(`✅ Item criado: ${categoria[0].nome} ${nome.trim()}`);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Item criado com sucesso',
      item: novo[0]
    });
  } catch (erro) {
    console.error('❌ Erro ao criar item:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao criar item' });
  }
});

// ====================================
// ATUALIZAR ITEM/PREPARO (SOMENTE ADMIN)
// ====================================
router.put('/itens/:id', autenticar, verificarPermissao("faturamento"), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, categoria_id, ordem } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ sucesso: false, erro: 'Nome é obrigatório' });
    }

    // Buscar item atual
    const [itemAtual] = await pool.query(
      'SELECT * FROM itens_substituicao_principal WHERE id = ?',
      [id]
    );

    if (itemAtual.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Item não encontrado' });
    }

    const catId = categoria_id || itemAtual[0].categoria_id;

    // Verificar duplicidade (excluindo o próprio)
    const [duplicado] = await pool.query(
      'SELECT id FROM itens_substituicao_principal WHERE categoria_id = ? AND nome = ? AND id != ?',
      [catId, nome.trim(), id]
    );

    if (duplicado.length > 0) {
      return res.status(400).json({ sucesso: false, erro: 'Já existe outro item com este nome nesta categoria' });
    }

    await pool.query(
      'UPDATE itens_substituicao_principal SET nome = ?, categoria_id = ?, ordem = ? WHERE id = ?',
      [nome.trim(), catId, ordem || 999, id]
    );

    console.log(`✅ Item atualizado: ${nome.trim()} (ID: ${id})`);

    res.json({ sucesso: true, mensagem: 'Item atualizado com sucesso' });
  } catch (erro) {
    console.error('❌ Erro ao atualizar item:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar item' });
  }
});

// ====================================
// ATIVAR/DESATIVAR ITEM (SOMENTE ADMIN)
// ====================================
router.patch('/itens/:id/toggle', autenticar, verificarPermissao("faturamento"), async (req, res) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body;

    const [existe] = await pool.query(
      'SELECT i.id, i.nome, c.nome AS categoria_nome FROM itens_substituicao_principal i JOIN categorias_substituicao_principal c ON c.id = i.categoria_id WHERE i.id = ?',
      [id]
    );

    if (existe.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Item não encontrado' });
    }

    await pool.query(
      'UPDATE itens_substituicao_principal SET ativo = ? WHERE id = ?',
      [ativo ? 1 : 0, id]
    );

    console.log(`✅ Item ${ativo ? 'ativado' : 'desativado'}: ${existe[0].categoria_nome} ${existe[0].nome}`);

    res.json({
      sucesso: true,
      mensagem: `Item ${ativo ? 'ativado' : 'desativado'} com sucesso`
    });
  } catch (erro) {
    console.error('❌ Erro ao alterar status do item:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao alterar status' });
  }
});

module.exports = router;