const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { autenticar, verificarRole } = require("./auth");

router.get("/", autenticar, async (req, res) => {
  try {
    const incluirInativas = req.query.incluirInativas === "true";

    const [rows] = await pool.query(
      `SELECT
          tpr.*, tr.nome AS tipo_refeicao_nome
         FROM tabela_precos_refeicao tpr
         JOIN tipos_refeicao tr ON tr.id = tpr.tipo_refeicao_id
        ${incluirInativas ? "" : "WHERE tpr.ativo = 1"}
        ORDER BY tpr.categoria ASC, tpr.chave_dieta ASC, tr.ordem ASC, tr.nome ASC`,
    );

    res.json({ sucesso: true, precos: rows });
  } catch (erro) {
    console.error("Erro ao listar tabela de preços:", erro);
    res
      .status(500)
      .json({ sucesso: false, erro: "Erro ao listar tabela de preços" });
  }
});

router.post("/", autenticar, verificarRole(["admin"]), async (req, res) => {
  try {
    const { categoria, chave_dieta, tipo_refeicao_id, valor, observacao } =
      req.body;

    if (!categoria || !["paciente", "acompanhante"].includes(categoria)) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Categoria inválida" });
    }

    if (!chave_dieta || !String(chave_dieta).trim()) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Chave da dieta é obrigatória" });
    }

    if (!tipo_refeicao_id) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Tipo de refeição é obrigatório" });
    }

    const numeroValor = Number(valor);
    if (!Number.isFinite(numeroValor) || numeroValor < 0) {
      return res.status(400).json({ sucesso: false, erro: "Valor inválido" });
    }

    const [duplicado] = await pool.query(
      `SELECT id
         FROM tabela_precos_refeicao
        WHERE categoria = ?
          AND chave_dieta = ?
          AND tipo_refeicao_id = ?`,
      [categoria, String(chave_dieta).trim(), tipo_refeicao_id],
    );

    if (duplicado.length > 0) {
      return res.status(409).json({
        sucesso: false,
        erro: "Já existe um preço cadastrado para essa combinação",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO tabela_precos_refeicao (
        categoria, chave_dieta, tipo_refeicao_id, valor, observacao, ativo
      ) VALUES (?, ?, ?, ?, ?, 1)`,
      [
        categoria,
        String(chave_dieta).trim(),
        tipo_refeicao_id,
        numeroValor,
        observacao || null,
      ],
    );

    res.status(201).json({
      sucesso: true,
      mensagem: "Preço cadastrado com sucesso",
      id: result.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar preço:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro ao criar preço" });
  }
});

router.put("/:id", autenticar, verificarRole(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { categoria, chave_dieta, tipo_refeicao_id, valor, observacao } =
      req.body;

    if (!categoria || !["paciente", "acompanhante"].includes(categoria)) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Categoria inválida" });
    }

    if (!chave_dieta || !String(chave_dieta).trim()) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Chave da dieta é obrigatória" });
    }

    if (!tipo_refeicao_id) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Tipo de refeição é obrigatório" });
    }

    const numeroValor = Number(valor);
    if (!Number.isFinite(numeroValor) || numeroValor < 0) {
      return res.status(400).json({ sucesso: false, erro: "Valor inválido" });
    }

    const [duplicado] = await pool.query(
      `SELECT id
         FROM tabela_precos_refeicao
        WHERE categoria = ?
          AND chave_dieta = ?
          AND tipo_refeicao_id = ?
          AND id <> ?`,
      [categoria, String(chave_dieta).trim(), tipo_refeicao_id, id],
    );

    if (duplicado.length > 0) {
      return res.status(409).json({
        sucesso: false,
        erro: "Já existe outro preço cadastrado para essa combinação",
      });
    }

    const [result] = await pool.query(
      `UPDATE tabela_precos_refeicao
          SET categoria = ?,
              chave_dieta = ?,
              tipo_refeicao_id = ?,
              valor = ?,
              observacao = ?
        WHERE id = ?`,
      [
        categoria,
        String(chave_dieta).trim(),
        tipo_refeicao_id,
        numeroValor,
        observacao || null,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ sucesso: false, erro: "Preço não encontrado" });
    }

    res.json({ sucesso: true, mensagem: "Preço atualizado com sucesso" });
  } catch (erro) {
    console.error("Erro ao atualizar preço:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro ao atualizar preço" });
  }
});

router.patch(
  "/:id/toggle",
  autenticar,
  verificarRole(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { ativo } = req.body;

      await pool.query(
        "UPDATE tabela_precos_refeicao SET ativo = ? WHERE id = ?",
        [ativo ? 1 : 0, id],
      );

      res.json({
        sucesso: true,
        mensagem: `Preço ${ativo ? "ativado" : "desativado"} com sucesso`,
      });
    } catch (erro) {
      console.error("Erro ao alterar status do preço:", erro);
      res
        .status(500)
        .json({ sucesso: false, erro: "Erro ao alterar status do preço" });
    }
  },
);

module.exports = router;
