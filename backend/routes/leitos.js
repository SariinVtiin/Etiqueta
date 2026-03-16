// backend/routes/leitos.js
// ============================================
// SALUSVITA TECH - Gestão de Leitos
// Desenvolvido por FerMax Solution
// ============================================
// PROTEGIDO: Autenticação JWT em todas as rotas
// PERMISSÃO: Escrita requer 'cadastros_leitos'
// SEGURANÇA: Erros internos não vazam para o cliente
// ============================================

const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { autenticar, verificarPermissao } = require("./auth");

// Tudo em /api/leitos exige login
router.use(autenticar);

/**
 * GET /api/leitos - Listar leitos
 * Qualquer usuário autenticado pode ver (alimenta dropdowns de prescrição)
 */
router.get("/", async (req, res) => {
  try {
    const todas = req.query.todas === "true";
    const query = todas
      ? "SELECT * FROM leitos ORDER BY setor, CAST(numero AS UNSIGNED), numero"
      : "SELECT * FROM leitos WHERE ativo = TRUE ORDER BY setor, CAST(numero AS UNSIGNED), numero";

    const [leitos] = await pool.query(query);

    res.json({
      sucesso: true,
      total: leitos.length,
      leitos,
    });
  } catch (erro) {
    console.error("Erro ao buscar leitos:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro interno do servidor" });
  }
});

/**
 * GET /api/leitos/setores - Listar setores únicos
 */
router.get("/setores", async (req, res) => {
  try {
    const [setores] = await pool.query(
      "SELECT DISTINCT setor FROM leitos WHERE ativo = TRUE ORDER BY setor",
    );
    res.json({
      sucesso: true,
      setores: setores.map((s) => s.setor),
    });
  } catch (erro) {
    console.error("Erro ao buscar setores:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro interno do servidor" });
  }
});

/**
 * GET /api/leitos/disponiveis - Listar leitos disponíveis
 * IMPORTANTE: Esta rota DEVE ficar ANTES de /:id
 */
router.get("/disponiveis", async (req, res) => {
  try {
    const [leitos] = await pool.query(`
      SELECT l.* 
      FROM leitos l
      LEFT JOIN pacientes p ON l.id = p.leito_id 
        AND p.ativo = TRUE 
        AND p.data_alta IS NULL
      WHERE l.ativo = TRUE 
        AND p.id IS NULL
      ORDER BY l.setor, CAST(l.numero AS UNSIGNED), l.numero
    `);

    res.json({
      sucesso: true,
      total: leitos.length,
      leitos,
    });
  } catch (erro) {
    console.error("Erro ao buscar leitos disponíveis:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro interno do servidor" });
  }
});

/**
 * GET /api/leitos/:id - Buscar leito por ID
 */
router.get("/:id", async (req, res) => {
  try {
    const [leitos] = await pool.query("SELECT * FROM leitos WHERE id = ?", [
      req.params.id,
    ]);

    if (leitos.length === 0) {
      return res
        .status(404)
        .json({ sucesso: false, erro: "Leito não encontrado" });
    }

    res.json({ sucesso: true, leito: leitos[0] });
  } catch (erro) {
    console.error("Erro ao buscar leito:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro interno do servidor" });
  }
});

/**
 * POST /api/leitos - Criar leito individual
 * Requer permissão: cadastros_leitos
 */
router.post("/", verificarPermissao('cadastros_leitos'), async (req, res) => {
  try {
    const { numero, setor, andar } = req.body;

    if (!numero || !setor) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Número e setor são obrigatórios" });
    }

    const [existente] = await pool.query(
      "SELECT id FROM leitos WHERE numero = ? AND setor = ? AND ativo = TRUE",
      [numero, setor.toUpperCase()],
    );

    if (existente.length > 0) {
      return res.status(409).json({
        sucesso: false,
        erro: `Leito ${numero} já existe no setor ${setor}`,
      });
    }

    const [result] = await pool.query(
      "INSERT INTO leitos (numero, setor, andar, ativo) VALUES (?, ?, ?, TRUE)",
      [numero, setor.toUpperCase(), andar || null],
    );

    res.status(201).json({
      sucesso: true,
      mensagem: `Leito ${numero} criado no setor ${setor}`,
      id: result.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar leito:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro interno do servidor" });
  }
});

/**
 * POST /api/leitos/lote - Criar leitos em lote
 * Requer permissão: cadastros_leitos
 */
router.post("/lote", verificarPermissao('cadastros_leitos'), async (req, res) => {
  try {
    const { setor, inicio, fim, andar } = req.body;

    if (!setor || !inicio || !fim) {
      return res.status(400).json({
        sucesso: false,
        erro: "Setor, início e fim são obrigatórios",
      });
    }

    let criados = 0;
    let duplicados = 0;

    for (let i = parseInt(inicio); i <= parseInt(fim); i++) {
      const numero = i.toString();

      const [existente] = await pool.query(
        "SELECT id FROM leitos WHERE numero = ? AND setor = ? AND ativo = TRUE",
        [numero, setor.toUpperCase()],
      );

      if (existente.length === 0) {
        await pool.query(
          "INSERT INTO leitos (numero, setor, andar, ativo) VALUES (?, ?, ?, TRUE)",
          [numero, setor.toUpperCase(), andar || null],
        );
        criados++;
      } else {
        duplicados++;
      }
    }

    res.status(201).json({
      sucesso: true,
      mensagem: `${criados} leito(s) criado(s) no setor ${setor}${duplicados > 0 ? ` (${duplicados} já existiam)` : ""}`,
      criados,
      duplicados,
    });
  } catch (erro) {
    console.error("Erro ao criar leitos em lote:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro interno do servidor" });
  }
});

/**
 * PUT /api/leitos/:id - Atualizar leito
 * Requer permissão: cadastros_leitos
 */
router.put("/:id", verificarPermissao('cadastros_leitos'), async (req, res) => {
  try {
    const { numero, setor, andar } = req.body;

    if (!numero || !setor) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Número e setor são obrigatórios" });
    }

    const [existente] = await pool.query(
      "SELECT id FROM leitos WHERE numero = ? AND setor = ? AND ativo = TRUE AND id != ?",
      [numero, setor.toUpperCase(), req.params.id],
    );

    if (existente.length > 0) {
      return res.status(409).json({
        sucesso: false,
        erro: `Leito ${numero} já existe no setor ${setor}`,
      });
    }

    await pool.query(
      "UPDATE leitos SET numero = ?, setor = ?, andar = ? WHERE id = ?",
      [numero, setor.toUpperCase(), andar || null, req.params.id],
    );

    res.json({
      sucesso: true,
      mensagem: `Leito ${numero} atualizado com sucesso`,
    });
  } catch (erro) {
    console.error("Erro ao atualizar leito:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro interno do servidor" });
  }
});

/**
 * PATCH /api/leitos/:id/toggle - Ativar/Desativar leito
 * Requer permissão: cadastros_leitos
 */
router.patch("/:id/toggle", verificarPermissao('cadastros_leitos'), async (req, res) => {
  try {
    const { ativo } = req.body;

    await pool.query("UPDATE leitos SET ativo = ? WHERE id = ?", [
      ativo,
      req.params.id,
    ]);

    res.json({
      sucesso: true,
      mensagem: `Leito ${ativo ? "ativado" : "desativado"} com sucesso`,
    });
  } catch (erro) {
    console.error("Erro ao alterar status do leito:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro interno do servidor" });
  }
});

module.exports = router;