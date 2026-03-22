const express = require("express");
const router = express.Router();
const { autenticar, verificarPermissao } = require("./auth");
const {
  exportarFaturamentoExcel,
  listarAnaliticoFaturamento,
  obterResumoFaturamento,
  reprocessarHistoricoFaturamento,
  listarOpcoesFiltroFaturamento,
  sincronizarFaturamentoPrescricao,
} = require("../services/faturamento");

router.get(
  "/resumo",
  autenticar,
  verificarPermissao("faturamento"),
  async (req, res) => {
    try {
      const resumo = await obterResumoFaturamento(req.query);
      res.json({ sucesso: true, ...resumo });
    } catch (erro) {
      console.error("Erro ao buscar resumo de faturamento:", erro);
      res
        .status(500)
        .json({ sucesso: false, erro: "Erro ao buscar resumo de faturamento" });
    }
  },
);

router.get(
  "/analitico",
  autenticar,
  verificarPermissao("faturamento"),
  async (req, res) => {
    try {
      const analitico = await listarAnaliticoFaturamento(req.query);
      res.json({ sucesso: true, ...analitico });
    } catch (erro) {
      console.error("Erro ao listar faturamento analítico:", erro);
      res
        .status(500)
        .json({ sucesso: false, erro: "Erro ao listar faturamento analítico" });
    }
  },
);

router.get(
  "/opcoes-filtro",
  autenticar,
  verificarPermissao("faturamento"),
  async (req, res) => {
    try {
      const opcoes = await listarOpcoesFiltroFaturamento();
      res.json({ sucesso: true, opcoes });
    } catch (erro) {
      console.error("Erro ao listar opções de filtro do faturamento:", erro);
      res
        .status(500)
        .json({ sucesso: false, erro: "Erro ao listar opções de filtro" });
    }
  },
);

router.get(
  "/exportar",
  autenticar,
  verificarPermissao("faturamento"),
  async (req, res) => {
    try {
      const buffer = await exportarFaturamentoExcel(req.query);
      const nomeArquivo = `faturamento_${new Date().toISOString().slice(0, 10)}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${nomeArquivo}"`,
      );
      res.send(Buffer.from(buffer));
    } catch (erro) {
      console.error("Erro ao exportar faturamento:", erro);
      res
        .status(500)
        .json({ sucesso: false, erro: "Erro ao exportar faturamento" });
    }
  },
);

router.post(
  "/reprocessar/:prescricaoId",
  autenticar,
  verificarPermissao("faturamento"),
  async (req, res) => {
    try {
      const { prescricaoId } = req.params;
      const resultado = await sincronizarFaturamentoPrescricao(prescricaoId);
      res.json({ sucesso: true, resultado });
    } catch (erro) {
      console.error("Erro ao reprocessar prescrição no faturamento:", erro);
      res.status(500).json({
        sucesso: false,
        erro: "Erro ao reprocessar faturamento da prescrição",
      });
    }
  },
);

router.post(
  "/reprocessar-historico",
  autenticar,
  verificarPermissao("faturamento"),
  async (_req, res) => {
    try {
      const resultado = await reprocessarHistoricoFaturamento();
      res.json({ sucesso: true, resultado });
    } catch (erro) {
      console.error("Erro ao reprocessar histórico de faturamento:", erro);
      res.status(500).json({
        sucesso: false,
        erro: "Erro ao reprocessar histórico de faturamento",
      });
    }
  },
);

module.exports = router;
