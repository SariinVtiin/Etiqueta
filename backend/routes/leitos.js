// backend/routes/leitos.js
// ✅ PROTEGIDO: Agora exige autenticação (JWT) em todas as rotas.
// ✅ ADMIN: CRUD (POST/PUT/PATCH) restrito a admin.

const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");

// ✅ Importa middlewares de autenticação/role
const { autenticar, verificarRole } = require("./auth");

// ✅ Tudo em /api/leitos agora exige login
router.use(autenticar);

/**
 * GET /api/leitos - Listar leitos (ativos por padrão, ?todas=true para todos)
 * Qualquer usuário autenticado pode ver.
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
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

/**
 * GET /api/leitos/setores - Listar setores únicos
 * Qualquer usuário autenticado pode ver.
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
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

/**
 * GET /api/leitos/disponiveis - Listar leitos disponíveis (sem paciente)
 * IMPORTANTE: Esta rota DEVE ficar ANTES de /:id
 * Qualquer usuário autenticado pode ver.
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
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

/**
 * GET /api/leitos/:id - Buscar leito por ID
 * Qualquer usuário autenticado pode ver.
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
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

/**
 * POST /api/leitos - Criar novo leito
 * ✅ Apenas admin
 */
router.post("/", verificarRole(["admin"]), async (req, res) => {
  try {
    const { numero, setor, andar } = req.body;

    if (!numero || !setor) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Número e setor são obrigatórios" });
    }

    // Verificar duplicata (mesmo numero + setor)
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

    const [resultado] = await pool.query(
      "INSERT INTO leitos (numero, setor, andar, ativo) VALUES (?, ?, ?, TRUE)",
      [numero, setor.toUpperCase(), andar || null],
    );

    res.status(201).json({
      sucesso: true,
      mensagem: `Leito ${numero} criado com sucesso no setor ${setor}`,
      leito: {
        id: resultado.insertId,
        numero,
        setor: setor.toUpperCase(),
        andar,
        ativo: true,
      },
    });
  } catch (erro) {
    console.error("Erro ao criar leito:", erro);
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

/**
 * POST /api/leitos/lote - Criar múltiplos leitos de uma vez
 * ✅ Apenas admin
 */
router.post("/lote", verificarRole(["admin"]), async (req, res) => {
  try {
    const { setor, andar, numeroInicio, numeroFim } = req.body;

    if (!setor || !numeroInicio || !numeroFim) {
      return res.status(400).json({
        sucesso: false,
        erro: "Setor, número inicial e número final são obrigatórios",
      });
    }

    const inicio = parseInt(numeroInicio);
    const fim = parseInt(numeroFim);

    if (isNaN(inicio) || isNaN(fim) || inicio > fim) {
      return res.status(400).json({
        sucesso: false,
        erro: "Intervalo de números inválido",
      });
    }

    if (fim - inicio > 100) {
      return res.status(400).json({
        sucesso: false,
        erro: "Máximo de 100 leitos por lote",
      });
    }

    let criados = 0;
    let duplicados = 0;

    for (let num = inicio; num <= fim; num++) {
      const numero = num.toString();
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
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

/**
 * PUT /api/leitos/:id - Atualizar leito
 * ✅ Apenas admin
 */
router.put("/:id", verificarRole(["admin"]), async (req, res) => {
  try {
    const { numero, setor, andar } = req.body;

    if (!numero || !setor) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Número e setor são obrigatórios" });
    }

    // Verificar duplicata (excluindo o próprio)
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
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

/**
 * PATCH /api/leitos/:id/toggle - Ativar/Desativar leito
 * ✅ Apenas admin
 */
router.patch("/:id/toggle", verificarRole(["admin"]), async (req, res) => {
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
    res.status(500).json({ sucesso: false, erro: erro.message });
  }
});

module.exports = router;
