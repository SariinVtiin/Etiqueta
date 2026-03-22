const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { autenticar, verificarPermissao } = require("./auth");

async function carregarRefeicoesPermitidasPorTipo(tipoAcompanhanteId) {
  const [rows] = await pool.query(
    `SELECT tr.id, tr.nome, tr.ordem, tr.grupo_dia
       FROM tipos_acompanhante_refeicoes tar
       JOIN tipos_refeicao tr ON tr.id = tar.tipo_refeicao_id
      WHERE tar.tipo_acompanhante_id = ?
        AND tr.ativa = 1
      ORDER BY tr.ordem ASC, tr.nome ASC`,
    [tipoAcompanhanteId],
  );

  return rows.map((r) => ({
    id: r.id,
    nome: r.nome,
    ordem: r.ordem,
    grupo_dia: r.grupo_dia,
  }));
}

async function listarTiposComRefeicoes({ incluirInativos = false } = {}) {
  const where = incluirInativos ? "" : "WHERE ta.ativo = 1";

  const [tipos] = await pool.query(
    `SELECT ta.*
       FROM tipos_acompanhante ta
       ${where}
      ORDER BY ta.ordem ASC, ta.nome ASC`,
  );

  const resultado = [];
  for (const tipo of tipos) {
    const refeicoesPermitidas = await carregarRefeicoesPermitidasPorTipo(
      tipo.id,
    );
    resultado.push({ ...tipo, refeicoesPermitidas });
  }

  return resultado;
}

router.get("/", autenticar, async (req, res) => {
  try {
    const incluirInativos =
      String(req.query.todas || "").toLowerCase() === "true";
    const tipos = await listarTiposComRefeicoes({ incluirInativos });
    res.json({ sucesso: true, tipos });
  } catch (erro) {
    console.error("Erro ao listar tipos de acompanhante:", erro);
    res
      .status(500)
      .json({ sucesso: false, erro: "Erro ao listar tipos de acompanhante" });
  }
});

router.get("/:codigo", autenticar, async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query(
      `SELECT * FROM tipos_acompanhante WHERE codigo = ? LIMIT 1`,
      [String(codigo || "").trim()],
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ sucesso: false, erro: "Tipo de acompanhante não encontrado" });
    }

    const tipo = rows[0];
    const refeicoesPermitidas = await carregarRefeicoesPermitidasPorTipo(
      tipo.id,
    );
    res.json({ sucesso: true, tipo: { ...tipo, refeicoesPermitidas } });
  } catch (erro) {
    console.error("Erro ao buscar tipo de acompanhante:", erro);
    res
      .status(500)
      .json({ sucesso: false, erro: "Erro ao buscar tipo de acompanhante" });
  }
});

router.post(
  "/",
  autenticar,
  verificarPermissao("cadastros_tipos_acompanhante"),
  async (req, res) => {
    const conn = await pool.getConnection();
    try {
      const {
        codigo,
        nome,
        descricao,
        emoji,
        ordem,
        ativo,
        refeicoesPermitidasIds = [],
      } = req.body;

      const codigoNorm = String(codigo || "")
        .trim()
        .toLowerCase();
      const nomeNorm = String(nome || "").trim();
      const ids = Array.isArray(refeicoesPermitidasIds)
        ? [
            ...new Set(
              refeicoesPermitidasIds.map(Number).filter(Number.isFinite),
            ),
          ]
        : [];

      if (!codigoNorm) {
        return res
          .status(400)
          .json({ sucesso: false, erro: "Código é obrigatório" });
      }
      if (!/^[a-z0-9_\-]+$/.test(codigoNorm)) {
        return res.status(400).json({
          sucesso: false,
          erro: "Código inválido. Use apenas letras minúsculas, números, hífen ou underline",
        });
      }
      if (!nomeNorm) {
        return res
          .status(400)
          .json({ sucesso: false, erro: "Nome é obrigatório" });
      }
      if (!ids.length) {
        return res.status(400).json({
          sucesso: false,
          erro: "Selecione ao menos uma refeição permitida",
        });
      }

      const [duplicadoCodigo] = await conn.query(
        "SELECT id FROM tipos_acompanhante WHERE codigo = ? LIMIT 1",
        [codigoNorm],
      );
      if (duplicadoCodigo.length) {
        return res.status(400).json({
          sucesso: false,
          erro: "Já existe um tipo de acompanhante com esse código",
        });
      }

      const [duplicadoNome] = await conn.query(
        "SELECT id FROM tipos_acompanhante WHERE LOWER(nome) = LOWER(?) LIMIT 1",
        [nomeNorm],
      );
      if (duplicadoNome.length) {
        return res.status(400).json({
          sucesso: false,
          erro: "Já existe um tipo de acompanhante com esse nome",
        });
      }

      await conn.beginTransaction();

      const [insertResult] = await conn.query(
        `INSERT INTO tipos_acompanhante (codigo, nome, descricao, emoji, ordem, ativo)
       VALUES (?, ?, ?, ?, ?, ?)`,
        [
          codigoNorm,
          nomeNorm,
          descricao || null,
          emoji || "👤",
          Number(ordem) || 0,
          ativo === false ? 0 : 1,
        ],
      );

      if (ids.length) {
        const values = ids.map((refeicaoId) => [
          insertResult.insertId,
          refeicaoId,
        ]);
        await conn.query(
          "INSERT INTO tipos_acompanhante_refeicoes (tipo_acompanhante_id, tipo_refeicao_id) VALUES ?",
          [values],
        );
      }

      await conn.commit();

      const tipos = await listarTiposComRefeicoes({ incluirInativos: true });
      const criado = tipos.find((t) => t.id === insertResult.insertId);

      res.status(201).json({
        sucesso: true,
        mensagem: "Tipo de acompanhante criado com sucesso",
        tipo: criado,
      });
    } catch (erro) {
      await conn.rollback();
      console.error("Erro ao criar tipo de acompanhante:", erro);
      res
        .status(500)
        .json({ sucesso: false, erro: "Erro ao criar tipo de acompanhante" });
    } finally {
      conn.release();
    }
  },
);

router.put(
  "/:id",
  autenticar,
  verificarPermissao("cadastros_tipos_acompanhante"),
  async (req, res) => {
    const conn = await pool.getConnection();
    try {
      const { id } = req.params;
      const {
        codigo,
        nome,
        descricao,
        emoji,
        ordem,
        ativo,
        refeicoesPermitidasIds = [],
      } = req.body;

      const codigoNorm = String(codigo || "")
        .trim()
        .toLowerCase();
      const nomeNorm = String(nome || "").trim();
      const ids = Array.isArray(refeicoesPermitidasIds)
        ? [
            ...new Set(
              refeicoesPermitidasIds.map(Number).filter(Number.isFinite),
            ),
          ]
        : [];

      if (!codigoNorm) {
        return res
          .status(400)
          .json({ sucesso: false, erro: "Código é obrigatório" });
      }
      if (!/^[a-z0-9_\-]+$/.test(codigoNorm)) {
        return res.status(400).json({
          sucesso: false,
          erro: "Código inválido. Use apenas letras minúsculas, números, hífen ou underline",
        });
      }
      if (!nomeNorm) {
        return res
          .status(400)
          .json({ sucesso: false, erro: "Nome é obrigatório" });
      }
      if (!ids.length) {
        return res.status(400).json({
          sucesso: false,
          erro: "Selecione ao menos uma refeição permitida",
        });
      }

      const [existe] = await conn.query(
        "SELECT id FROM tipos_acompanhante WHERE id = ? LIMIT 1",
        [id],
      );
      if (!existe.length) {
        return res.status(404).json({
          sucesso: false,
          erro: "Tipo de acompanhante não encontrado",
        });
      }

      const [duplicadoCodigo] = await conn.query(
        "SELECT id FROM tipos_acompanhante WHERE codigo = ? AND id != ? LIMIT 1",
        [codigoNorm, id],
      );
      if (duplicadoCodigo.length) {
        return res.status(400).json({
          sucesso: false,
          erro: "Já existe outro tipo com esse código",
        });
      }

      const [duplicadoNome] = await conn.query(
        "SELECT id FROM tipos_acompanhante WHERE LOWER(nome) = LOWER(?) AND id != ? LIMIT 1",
        [nomeNorm, id],
      );
      if (duplicadoNome.length) {
        return res
          .status(400)
          .json({ sucesso: false, erro: "Já existe outro tipo com esse nome" });
      }

      await conn.beginTransaction();

      await conn.query(
        `UPDATE tipos_acompanhante
          SET codigo = ?, nome = ?, descricao = ?, emoji = ?, ordem = ?, ativo = ?
        WHERE id = ?`,
        [
          codigoNorm,
          nomeNorm,
          descricao || null,
          emoji || "👤",
          Number(ordem) || 0,
          ativo === false ? 0 : 1,
          id,
        ],
      );

      await conn.query(
        "DELETE FROM tipos_acompanhante_refeicoes WHERE tipo_acompanhante_id = ?",
        [id],
      );

      const values = ids.map((refeicaoId) => [Number(id), refeicaoId]);
      await conn.query(
        "INSERT INTO tipos_acompanhante_refeicoes (tipo_acompanhante_id, tipo_refeicao_id) VALUES ?",
        [values],
      );

      await conn.commit();

      const tipos = await listarTiposComRefeicoes({ incluirInativos: true });
      const atualizado = tipos.find((t) => t.id === Number(id));

      res.json({
        sucesso: true,
        mensagem: "Tipo de acompanhante atualizado com sucesso",
        tipo: atualizado,
      });
    } catch (erro) {
      await conn.rollback();
      console.error("Erro ao atualizar tipo de acompanhante:", erro);
      res.status(500).json({
        sucesso: false,
        erro: "Erro ao atualizar tipo de acompanhante",
      });
    } finally {
      conn.release();
    }
  },
);

router.patch(
  "/:id/toggle",
  autenticar,
  verificarPermissao("cadastros_tipos_acompanhante"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      await pool.query("UPDATE tipos_acompanhante SET ativo = ? WHERE id = ?", [
        ativo ? 1 : 0,
        id,
      ]);

      res.json({
        sucesso: true,
        mensagem: `Tipo de acompanhante ${ativo ? "ativado" : "desativado"} com sucesso`,
      });
    } catch (erro) {
      console.error("Erro ao alterar status do tipo de acompanhante:", erro);
      res.status(500).json({
        sucesso: false,
        erro: "Erro ao alterar status do tipo de acompanhante",
      });
    }
  },
);

module.exports = router;
