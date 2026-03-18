import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  listarPrescricoes,
  deletarPrescricao,
  atualizarPrescricao,
} from "../../services/api";
import {
  exportarParaExcel,
  exportarParaPDF,
  exportarRelatorioDetalhado,
  gerarMapaRefeicao,
} from "../../services/relatorios";
import ModalEditarPrescricao from "../../components/forms/ModalEditarPrescricao";
import "./Prescricoes.css";
import Toast from "../../components/common/Toast/Toast";
import ModalAlerta from "../../components/common/ModalAlerta/ModalAlerta";
import { useLocation, useOutletContext } from "react-router-dom";

function Prescricoes() {
  const location = useLocation();

  const {
    nucleos = {},
    dietas = [],
    restricoes = [],
    tiposAlimentacao = [],
    convenios = [],
  } = useOutletContext() || {};

  const [prescricoes, setPrescricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [filtros, setFiltros] = useState({
    busca: "",
    dataInicio: "",
    dataFim: "",
    setor: "",
    refeicao: "",
    leito: "",
  });

  const [paginacao, setPaginacao] = useState({
    pagina: 1,
    limite: 20,
    total: 0,
    totalPaginas: 0,
  });

  const [linhaExpandida, setLinhaExpandida] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [prescricaoEditando, setPrescricaoEditando] = useState(null);

  // Toast customizado
  const [toast, setToast] = useState({
    visivel: false,
    mensagem: "",
    tipo: "",
  });

  // Modal de alerta/confirmação
  const [modalAlerta, setModalAlerta] = useState({
    visivel: false,
    titulo: "",
    mensagem: "",
    tipo: "info",
    onConfirmar: null,
  });

  // ============================================
  // CARREGAR PRESCRIÇÕES
  // ============================================
  const carregarPrescricoes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const params = {
        ...filtros,
        page: paginacao.pagina,
        limit: paginacao.limite,
      };

      const resposta = await listarPrescricoes(params);

      if (resposta.sucesso) {
        const prescricoesFormatadas = (resposta.prescricoes || []).map((p) => ({
          ...p,
          restricoes: p.restricoes ? JSON.parse(p.restricoes) : [],
        }));

        setPrescricoes(prescricoesFormatadas);
        setPaginacao((prev) => ({
          ...prev,
          total: resposta.paginacao?.total || 0,
          totalPaginas: resposta.paginacao?.totalPaginas || 0,
        }));
      } else {
        setPrescricoes([]);
        setPaginacao((prev) => ({ ...prev, total: 0, totalPaginas: 0 }));
      }
    } catch (erro) {
      console.error("Erro ao carregar prescrições:", erro);
      setErro("Erro ao carregar prescrições. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, [filtros, paginacao.pagina, paginacao.limite]);

  useEffect(() => {
    carregarPrescricoes();
  }, [carregarPrescricoes, location.key]);

  // ============================================
  // FILTROS
  // ============================================
  const aplicarFiltros = () => {
    setPaginacao((prev) => ({ ...prev, pagina: 1 }));
    carregarPrescricoes();
  };

  const limparFiltros = () => {
    setFiltros({
      busca: "",
      dataInicio: "",
      dataFim: "",
      setor: "",
      refeicao: "",
      leito: "",
    });
    setPaginacao((prev) => ({ ...prev, pagina: 1 }));
    setTimeout(() => carregarPrescricoes(), 100);
  };

  // ============================================
  // PAGINAÇÃO
  // ============================================
  const toggleExpandir = (id) => {
    setLinhaExpandida(linhaExpandida === id ? null : id);
  };

  const paginaAnterior = () => {
    if (paginacao.pagina > 1) {
      setPaginacao((prev) => ({ ...prev, pagina: prev.pagina - 1 }));
    }
  };

  const proximaPagina = () => {
    if (paginacao.pagina < paginacao.totalPaginas) {
      setPaginacao((prev) => ({ ...prev, pagina: prev.pagina + 1 }));
    }
  };

  // ============================================
  // TOAST E MODAL
  // ============================================
  const mostrarToast = (mensagem, tipo = "sucesso") => {
    setToast({ visivel: true, mensagem, tipo });
    setTimeout(() => {
      setToast({ visivel: false, mensagem: "", tipo: "" });
    }, 4000);
  };

  const fecharToast = () => {
    setToast({ visivel: false, mensagem: "", tipo: "" });
  };

  const mostrarConfirmacao = (titulo, mensagem, onConfirmar, tipo = "info") => {
    setModalAlerta({
      visivel: true,
      titulo,
      mensagem,
      tipo,
      onConfirmar: () => {
        setModalAlerta((prev) => ({ ...prev, visivel: false }));
        onConfirmar();
      },
    });
  };

  // ============================================
  // CRUD
  // ============================================
  const handleExcluir = (id) => {
    mostrarConfirmacao(
      "Excluir Prescrição",
      "Tem certeza que deseja excluir esta prescrição?\nEsta ação não pode ser desfeita.",
      async () => {
        try {
          const resposta = await deletarPrescricao(id);
          if (resposta.sucesso) {
            mostrarToast("Prescrição excluída com sucesso!", "sucesso");
            carregarPrescricoes();
          }
        } catch (erro) {
          console.error("Erro ao excluir prescrição:", erro);
          mostrarToast("Erro ao excluir prescrição: " + erro.message, "erro");
        }
      },
      "perigo",
    );
  };

  const handleEditar = (prescricao) => {
    setPrescricaoEditando(prescricao);
    setModalEdicaoAberto(true);
  };

  const handleSalvarEdicao = async (dadosAtualizados) => {
    try {
      const resposta = await atualizarPrescricao(
        prescricaoEditando.id,
        dadosAtualizados,
      );

      if (resposta.sucesso) {
        mostrarToast("Prescrição atualizada com sucesso!", "sucesso");
        setModalEdicaoAberto(false);
        setPrescricaoEditando(null);
        carregarPrescricoes();
      }
    } catch (erro) {
      console.error("Erro ao atualizar prescrição:", erro);
      mostrarToast("Erro ao atualizar prescrição: " + erro.message, "erro");
    }
  };

  // ============================================
  // EXPORTAÇÕES
  // ============================================
  const handleExportarExcel = () => {
    if (prescricoes.length === 0) {
      mostrarToast("Nenhuma prescrição para exportar.", "aviso");
      return;
    }
    const resultado = exportarParaExcel(prescricoes);
    if (resultado.sucesso) {
      mostrarToast(resultado.mensagem, "sucesso");
    } else {
      mostrarToast(resultado.erro, "erro");
    }
  };

  const handleExportarPDF = () => {
    if (prescricoes.length === 0) {
      mostrarToast("Nenhuma prescrição para exportar.", "aviso");
      return;
    }
    const resultado = exportarParaPDF(prescricoes, filtros);
    if (resultado.sucesso) {
      mostrarToast(resultado.mensagem, "sucesso");
    } else {
      mostrarToast(resultado.erro, "erro");
    }
  };

  const handleRelatorioDetalhado = () => {
    if (prescricoes.length === 0) {
      mostrarToast("Nenhuma prescrição para gerar relatório.", "aviso");
      return;
    }
    const resultado = exportarRelatorioDetalhado(prescricoes);
    if (resultado.sucesso) {
      mostrarToast(resultado.mensagem, "sucesso");
    } else {
      mostrarToast(resultado.erro, "erro");
    }
  };

  const handleGerarMapa = () => {
    if (prescricoes.length === 0) {
      mostrarToast("Nenhuma prescrição encontrada para gerar mapa.", "aviso");
      return;
    }

    mostrarConfirmacao(
      "Gerar Mapa de Refeição",
      `Será gerado o mapa de refeição com base nos filtros atuais.\nTotal de registros filtrados: ${paginacao.total}\n\nDeseja continuar?`,
      async () => {
        try {
          const params = {
            ...filtros,
            limit: 5000,
          };

          const resposta = await listarPrescricoes(params);

          if (
            !resposta.sucesso ||
            !resposta.prescricoes ||
            resposta.prescricoes.length === 0
          ) {
            mostrarToast(
              "Nenhuma prescrição encontrada para gerar mapa.",
              "aviso",
            );
            return;
          }

          const todasPrescricoes = resposta.prescricoes.map((p) => ({
            ...p,
            restricoes: p.restricoes ? JSON.parse(p.restricoes) : [],
          }));

          const resultado = gerarMapaRefeicao(todasPrescricoes, filtros);
          if (resultado.sucesso) {
            mostrarToast(resultado.mensagem, "sucesso");
          } else {
            mostrarToast(resultado.erro, "erro");
          }
        } catch (erro) {
          console.error("Erro ao gerar mapa:", erro);
          mostrarToast("Erro ao gerar mapa de refeição.", "erro");
        }
      },
    );
  };

  // ============================================
  // SISTEMA DE IMPRESSÃO DE ETIQUETAS - COMPLETO
  // ============================================
  const handleImprimirEtiquetas = () => {
    if (prescricoes.length === 0) {
      mostrarToast("Nenhuma prescrição encontrada para imprimir.", "aviso");
      return;
    }

    mostrarConfirmacao(
      "Imprimir Etiquetas",
      `Você vai imprimir ${prescricoes.length} etiqueta(s) filtrada(s).\n\nDeseja continuar?`,
      async () => {
        try {
          const params = {
            ...filtros,
            limit: 1000,
          };

          const resposta = await listarPrescricoes(params);

          if (!resposta.sucesso || resposta.prescricoes.length === 0) {
            mostrarToast(
              "Nenhuma prescrição encontrada para imprimir.",
              "aviso",
            );
            return;
          }

          const todasPrescricoes = resposta.prescricoes.map((p) => ({
            ...p,
            restricoes: p.restricoes ? JSON.parse(p.restricoes) : [],
          }));

          const janelaImpressao = window.open("", "", "width=800,height=600");
          janelaImpressao.document.write(gerarHTMLEtiquetas(todasPrescricoes));
          janelaImpressao.document.close();
        } catch (erro) {
          console.error("Erro ao preparar impressão:", erro);
          mostrarToast("Erro ao preparar etiquetas para impressão.", "erro");
        }
      },
    );
  };

  const gerarHTMLEtiquetas = (prescricoesParaImprimir) => {
    const dataFormatada = new Date().toLocaleDateString("pt-BR");

    const estilos = `
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: Arial, sans-serif; padding: 10mm; background:#f5f5f5; }

      .etiqueta {
        width:10cm;
        height:8cm;
        background:white;
        padding:6mm;
        margin-bottom:5mm;
        page-break-after:always;
        border:2px solid #333;
        display:flex;
        flex-direction:column;
        position:relative;
      }
      .etiqueta:last-child { page-break-after:auto; }

      .etiqueta-empresa {
        text-align:center;
        font-size:12px;
        font-weight:bold;
        color:#333;
        padding-bottom:4px;
        margin-bottom:4px;
        border-bottom:2px solid #333;
      }

      .etiqueta-linha-principal {
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:5px;
        padding-bottom:4px;
        border-bottom:2px solid #333;
      }

      .etiqueta-nome {
        font-size:13px;
        font-weight:bold;
        flex:1;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        color:#000;
      }

      .etiqueta-idade {
        font-size:11px;
        font-weight:bold;
        background:#000;
        color:#fff;
        padding:2px 6px;
        border-radius:3px;
        margin-left:8px;
        white-space:nowrap;
      }

      .etiqueta-sem-principal {
        background:#fff3cd;
        padding:4px 6px;
        margin-bottom:5px;
        border-radius:3px;
        border-left:3px solid #ffc107;
        display:flex;
        font-size:9px;
        font-weight:bold;
        align-items:center;
      }

      .etiqueta-sem-principal-label { color:#856404; margin-right:4px; white-space:nowrap; }
      .etiqueta-sem-principal-valor { color:#856404; flex:1; overflow:hidden; text-overflow:ellipsis; }

      .etiqueta-grid {
        display:grid;
        font-weight:bold;
        grid-template-columns: 1fr 1fr;
        gap:3px 6px;
        flex:1;
      }

      .etiqueta-item { display:flex; font-weight:bold; font-size:9px; line-height:1.3; }
      .etiqueta-item.full-width { grid-column: 1 / -1; }
      .etiqueta-item.destaque { font-weight:bold; }

      .etiqueta-label { font-weight:bold; min-width:50px; flex-shrink:0; color:#333; }
      .etiqueta-valor { flex:1; word-wrap:break-word; color:#000; }

      .preview-container {
        margin:20px 0;
        padding:20px;
        background:white;
        border-radius:8px;
        box-shadow:0 2px 8px rgba(0,0,0,0.1);
        text-align:center;
      }

      .btn-preview {
        padding:12px 24px;
        font-size:16px;
        cursor:pointer;
        border:none;
        border-radius:6px;
        margin:0 5px;
        font-weight:600;
        transition:all 0.3s;
      }
      .btn-imprimir { background:#0d9488; color:white; }
      .btn-imprimir:hover { background:#0f766e; transform:translateY(-2px); box-shadow:0 4px 12px rgba(13,148,136,0.3); }
      .btn-fechar { background:#6c757d; color:white; }
      .btn-fechar:hover { background:#5a6268; transform:translateY(-2px); box-shadow:0 4px 12px rgba(108,117,125,0.3); }

      @media print {
        body { padding:0; background:white; }
        .preview-container { display:none; }
        .etiqueta { margin:0; border:2px solid #000; }
        .etiqueta:last-child { page-break-after:auto; }
        @page { size:10cm 8cm; margin:0; }
      }
    </style>
    `;

    let html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Etiquetas de Alimentação - ${dataFormatada}</title>
        ${estilos}
      </head>
      <body>
        <div class="preview-container">
          <h3>Preview de Impressão</h3>
          <p>Total de <strong>${prescricoesParaImprimir.length}</strong> etiqueta(s) | Data: <strong>${dataFormatada}</strong></p>
          <p>Tamanho: <strong>10cm x 8cm</strong> cada etiqueta</p>
          <button onclick="window.print()" class="btn-preview btn-imprimir">Imprimir</button>
          <button onclick="window.close()" class="btn-preview btn-fechar">Fechar</button>
        </div>
    `;

    prescricoesParaImprimir.forEach((prescricao) => {
      html += `
        <div class="etiqueta">
          <div class="etiqueta-empresa">Maxima Facility</div>

          <div class="etiqueta-linha-principal">
            <div class="etiqueta-nome">${prescricao.nome_paciente || "Paciente"}</div>
            <div class="etiqueta-idade">${prescricao.idade || "0"} anos</div>
          </div>

          ${
            prescricao.sem_principal
              ? `<div class="etiqueta-sem-principal">
                  <span class="etiqueta-sem-principal-label">SEM PRINCIPAL:</span>
                  <span class="etiqueta-sem-principal-valor">${prescricao.descricao_sem_principal || "Sem prato principal"}</span>
                </div>`
              : ""
          }

          <div class="etiqueta-grid">
            <div class="etiqueta-item destaque">
              <span class="etiqueta-label">Setor:</span>
              <span class="etiqueta-valor">${prescricao.nucleo || ""}</span>
            </div>
            <div class="etiqueta-item destaque">
              <span class="etiqueta-label">Leito:</span>
              <span class="etiqueta-valor">${prescricao.leito || ""}</span>
            </div>
            <div class="etiqueta-item full-width destaque">
              <span class="etiqueta-label">Refeição:</span>
              <span class="etiqueta-valor">${prescricao.tipo_alimentacao || ""}</span>
            </div>
            <div class="etiqueta-item full-width destaque">
              <span class="etiqueta-label">Dieta:</span>
              <span class="etiqueta-valor">${prescricao.dieta || ""}</span>
            </div>
            ${
              prescricao.restricoes && prescricao.restricoes.length > 0
                ? `<div class="etiqueta-item full-width">
                    <span class="etiqueta-label">Cond.:</span>
                    <span class="etiqueta-valor">${prescricao.restricoes.join(", ")}</span>
                  </div>`
                : ""
            }
            ${
              prescricao.obs_exclusao
                ? `<div class="etiqueta-item full-width">
                    <span class="etiqueta-label">Exclusão:</span>
                    <span class="etiqueta-valor">${prescricao.obs_exclusao}</span>
                  </div>`
                : ""
            }
            ${
              prescricao.obs_acrescimo
                ? `<div class="etiqueta-item full-width">
                    <span class="etiqueta-label">Acréscimo:</span>
                    <span class="etiqueta-valor">${prescricao.obs_acrescimo}</span>
                  </div>`
                : ""
            }
          </div>
        </div>
      `;

      // Etiquetas do acompanhante
      if (prescricao.tem_acompanhante && prescricao.acompanhante_refeicoes) {
        let refeicoes = [];
        try {
          refeicoes =
            typeof prescricao.acompanhante_refeicoes === "string"
              ? JSON.parse(prescricao.acompanhante_refeicoes)
              : prescricao.acompanhante_refeicoes;
        } catch (e) {
          refeicoes = [];
        }

        let restricoesAcomp = [];
        try {
          const ids =
            typeof prescricao.acompanhante_restricoes_ids === "string"
              ? JSON.parse(prescricao.acompanhante_restricoes_ids)
              : prescricao.acompanhante_restricoes_ids || [];
          restricoesAcomp = ids;
        } catch (e) {
          restricoesAcomp = [];
        }

        refeicoes.forEach((refeicao) => {
          const dietaTexto =
            restricoesAcomp.length > 0
              ? "Dieta Normal p/ Acompanhante"
              : "Dieta Normal";

          html += `
            <div class="etiqueta">
              <div class="etiqueta-empresa">Maxima Facility</div>

              <div class="etiqueta-linha-principal">
                <div class="etiqueta-nome">ACOMPANHANTE - Leito ${prescricao.leito || ""}</div>
                <div class="etiqueta-idade" style="background:#f59e0b;color:#000;font-size:10px;">ACOMP.</div>
              </div>

              <div class="etiqueta-grid">
                <div class="etiqueta-item destaque">
                  <span class="etiqueta-label">Setor:</span>
                  <span class="etiqueta-valor">${prescricao.nucleo || ""}</span>
                </div>
                <div class="etiqueta-item destaque">
                  <span class="etiqueta-label">Leito:</span>
                  <span class="etiqueta-valor">${prescricao.leito || ""}</span>
                </div>
                <div class="etiqueta-item full-width destaque">
                  <span class="etiqueta-label">Refeição:</span>
                  <span class="etiqueta-valor">${refeicao}</span>
                </div>
                <div class="etiqueta-item full-width destaque">
                  <span class="etiqueta-label">Dieta:</span>
                  <span class="etiqueta-valor">${dietaTexto}</span>
                </div>
                ${
                  prescricao.acompanhante_obs_livre
                    ? `<div class="etiqueta-item full-width">
                        <span class="etiqueta-label">Obs:</span>
                        <span class="etiqueta-valor">${prescricao.acompanhante_obs_livre}</span>
                      </div>`
                    : ""
                }
                <div class="etiqueta-item full-width">
                  <span class="etiqueta-label">Paciente:</span>
                  <span class="etiqueta-valor">${prescricao.nome_paciente || ""}</span>
                </div>
              </div>
            </div>
          `;
        });
      }
    });

    html += `
      </body>
      </html>
    `;

    return html;
  };

  // ============================================
  // HELPERS
  // ============================================
  //
  // POR QUE timeZone: "UTC"?
  // ─────────────────────────
  // Campos DATE do MySQL (ex: data_nascimento) chegam como "2026-03-17".
  // O JavaScript interpreta como meia-noite UTC: 2026-03-17T00:00:00Z
  // No Brasil (UTC-3), isso vira 2026-03-16T21:00:00 = DIA ANTERIOR!
  //
  // Usando timeZone:"UTC" na formatação, forçamos a exibir o dia correto.
  // Para campos DATETIME (ex: data_prescricao), a data continua correta
  // porque prescrições são criadas em horário comercial (nunca perto de meia-noite).
  //
  const formatarData = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "-";
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  // formatarHora NÃO usa UTC — queremos a hora local real
  const formatarHora = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "-";
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ============================================
  // ESTATÍSTICAS
  // ============================================
  const estatisticas = useMemo(() => {
    const setoresUnicos = new Set(
      prescricoes
        .map((p) => p.nucleo)
        .filter((v) => v && String(v).trim() !== ""),
    );

    const comAcomp = prescricoes.filter((p) => !!p.tem_acompanhante).length;

    const dietasUnicas = new Set(
      prescricoes
        .map((p) => p.dieta)
        .filter((v) => v && String(v).trim() !== ""),
    );

    return {
      totalGeral: paginacao.total,
      setores: setoresUnicos.size,
      comAcompanhante: comAcomp,
      dietasDistintas: dietasUnicas.size,
    };
  }, [prescricoes, paginacao.total]);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="presc-page">
      {/* Header */}
      <header className="presc-header">
        <div>
          <h1>Prescrições</h1>
          <p>
            Gerencie as prescrições de alimentação, exporte relatórios e imprima
            etiquetas.
          </p>
        </div>
      </header>

      {/* Stats */}
      <section className="presc-stats">
        <div className="presc-stat-card">
          <span className="presc-stat-label">Total de prescrições</span>
          <strong className="presc-stat-value">
            {estatisticas.totalGeral}
          </strong>
        </div>
        <div className="presc-stat-card">
          <span className="presc-stat-label">Setores ativos</span>
          <strong className="presc-stat-value">{estatisticas.setores}</strong>
        </div>
        <div className="presc-stat-card">
          <span className="presc-stat-label">Com acompanhante</span>
          <strong className="presc-stat-value">
            {estatisticas.comAcompanhante}
          </strong>
        </div>
        <div className="presc-stat-card">
          <span className="presc-stat-label">Dietas distintas</span>
          <strong className="presc-stat-value">
            {estatisticas.dietasDistintas}
          </strong>
        </div>
      </section>

      {/* Toolbar / Filtros */}
      <section className="presc-toolbar">
        <div className="presc-filters-row">
          <div className="presc-filter-group">
            <label>Buscar</label>
            <input
              type="text"
              placeholder="Nome, CPF, leito..."
              value={filtros.busca}
              onChange={(e) =>
                setFiltros({ ...filtros, busca: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && aplicarFiltros()}
            />
          </div>

          <div className="presc-filter-group">
            <label>Data início</label>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) =>
                setFiltros({ ...filtros, dataInicio: e.target.value })
              }
            />
          </div>

          <div className="presc-filter-group">
            <label>Data fim</label>
            <input
              type="date"
              value={filtros.dataFim}
              onChange={(e) =>
                setFiltros({ ...filtros, dataFim: e.target.value })
              }
            />
          </div>

          <div className="presc-filter-group">
            <label>Setor</label>
            <select
              value={filtros.setor}
              onChange={(e) =>
                setFiltros({ ...filtros, setor: e.target.value })
              }
            >
              <option value="">Todos</option>
              {Object.keys(nucleos).map((nucleo) => (
                <option key={nucleo} value={nucleo}>
                  {nucleo}
                </option>
              ))}
            </select>
          </div>

          <div className="presc-filter-group">
            <label>Refeição</label>
            <select
              value={filtros.refeicao}
              onChange={(e) =>
                setFiltros({ ...filtros, refeicao: e.target.value })
              }
            >
              <option value="">Todas</option>
              {tiposAlimentacao.map((tipo) => (
                <option key={tipo.id} value={tipo.nome}>
                  {tipo.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="presc-filter-actions">
            <button
              className="presc-btn presc-btn-primary"
              onClick={aplicarFiltros}
            >
              Buscar
            </button>
            <button
              className="presc-btn presc-btn-secondary"
              onClick={limparFiltros}
            >
              Limpar
            </button>
          </div>
        </div>
      </section>

      {/* Barra de Ações */}
      <section className="presc-actions-bar">
        <div className="presc-actions-info">
          Total de registros: <strong>{paginacao.total}</strong>
        </div>
        <div className="presc-actions-buttons">
          <button
            className="presc-btn-action imprimir"
            onClick={handleImprimirEtiquetas}
          >
            Imprimir Etiquetas
          </button>
          <button
            className="presc-btn-action excel"
            onClick={handleExportarExcel}
          >
            Exportar Excel
          </button>
          <button
            className="presc-btn-action pdf"
            onClick={handleExportarPDF}
          >
            Exportar PDF
          </button>
          <button
            className="presc-btn-action detalhado"
            onClick={handleRelatorioDetalhado}
          >
            Rel. Detalhado
          </button>
          <button
            className="presc-btn-action mapa"
            onClick={handleGerarMapa}
          >
            Gerar Mapa
          </button>
        </div>
      </section>

      {/* Erro */}
      {erro && <div className="presc-alert presc-alert-error">{erro}</div>}

      {/* Tabela */}
      <section className="presc-table-wrapper">
        {carregando ? (
          <div className="presc-spinner-wrapper">
            <div className="presc-spinner"></div>
            <p>Carregando prescrições...</p>
          </div>
        ) : prescricoes.length === 0 ? (
          <div className="presc-empty">
            <h3>Nenhuma prescrição encontrada</h3>
            <p>Tente ajustar os filtros ou criar uma nova prescrição.</p>
          </div>
        ) : (
          <table className="presc-table">
            <thead>
              <tr>
                <th></th>
                <th>Paciente</th>
                <th>Leito</th>
                <th>Setor</th>
                <th>Dieta</th>
                <th>Refeição</th>
                <th>Acomp.</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {prescricoes.map((prescricao) => (
                <React.Fragment key={prescricao.id}>
                  {/* Linha principal */}
                  <tr>
                    <td>
                      <button
                        className="presc-btn-link"
                        onClick={() => toggleExpandir(prescricao.id)}
                      >
                        {linhaExpandida === prescricao.id ? "▾" : "▸"}
                      </button>
                    </td>
                    <td>
                      <div className="presc-main-cell">
                        <strong>{prescricao.nome_paciente}</strong>
                        <span>{prescricao.cpf}</span>
                      </div>
                    </td>
                    <td>{prescricao.leito || "-"}</td>
                    <td>{prescricao.nucleo || "-"}</td>
                    <td>{prescricao.dieta || "-"}</td>
                    <td>{prescricao.tipo_alimentacao || "-"}</td>
                    <td>
                      {prescricao.tem_acompanhante ? (
                        <span className="presc-badge presc-badge-acomp">
                          Sim
                        </span>
                      ) : (
                        <span className="presc-badge-sem-acomp">—</span>
                      )}
                    </td>
                    <td>{formatarData(prescricao.data_prescricao)}</td>
                    <td>{formatarHora(prescricao.criado_em || prescricao.data_prescricao)}</td>
                    <td>
                      <div className="presc-row-actions">
                        <button
                          className="presc-btn-edit"
                          onClick={() => handleEditar(prescricao)}
                        >
                          Editar
                        </button>
                        <button
                          className="presc-btn-delete"
                          onClick={() => handleExcluir(prescricao.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Linha expandida */}
                  {linhaExpandida === prescricao.id && (
                    <tr className="presc-expand-row">
                      <td colSpan="10">
                        <div className="presc-expand-content">
                          <div className="presc-detail-grid">
                            <div className="presc-detail-card">
                              <label>Convênio</label>
                              <span>{prescricao.convenio || "-"}</span>
                            </div>
                            <div className="presc-detail-card">
                              <label>Cód. Atendimento</label>
                              <span>
                                {prescricao.codigo_atendimento || "-"}
                              </span>
                            </div>
                            <div className="presc-detail-card">
                              <label>Nome da Mãe</label>
                              <span>{prescricao.nome_mae || "-"}</span>
                            </div>
                            <div className="presc-detail-card">
                              <label>Idade</label>
                              <span>
                                {prescricao.idade
                                  ? `${prescricao.idade} anos`
                                  : "-"}
                              </span>
                            </div>
                            <div className="presc-detail-card">
                              <label>Data Nascimento</label>
                              <span>
                                {formatarData(prescricao.data_nascimento)}
                              </span>
                            </div>
                            <div className="presc-detail-card">
                              <label>Núcleo</label>
                              <span>{prescricao.nucleo || "-"}</span>
                            </div>

                            {prescricao.restricoes &&
                              prescricao.restricoes.length > 0 && (
                                <div className="presc-detail-card full-width">
                                  <label>Cond. Nutricionais</label>
                                  <span>
                                    {prescricao.restricoes.join(", ")}
                                  </span>
                                </div>
                              )}

                            {prescricao.sem_principal && (
                              <div className="presc-detail-card full-width">
                                <label>Sem Principal</label>
                                <span>
                                  {prescricao.descricao_sem_principal}
                                </span>
                              </div>
                            )}

                            {prescricao.obs_exclusao && (
                              <div className="presc-detail-card full-width">
                                <label>Exclusões</label>
                                <span>{prescricao.obs_exclusao}</span>
                              </div>
                            )}

                            {prescricao.obs_acrescimo && (
                              <div className="presc-detail-card full-width">
                                <label>Acréscimos</label>
                                <span>{prescricao.obs_acrescimo}</span>
                              </div>
                            )}

                            {/* Seção Acompanhante */}
                            {prescricao.tem_acompanhante && (
                              <div className="presc-acomp-section">
                                <h5 className="presc-acomp-title">
                                  Acompanhante
                                </h5>
                                <div className="presc-detail-grid">
                                  <div className="presc-detail-card">
                                    <label>Tipo</label>
                                    <span>
                                      {prescricao.acompanhante_tipo || "-"}
                                    </span>
                                  </div>
                                  <div className="presc-detail-card">
                                    <label>Refeições</label>
                                    <span>
                                      {prescricao.acompanhante_refeicoes ||
                                        "-"}
                                    </span>
                                  </div>

                                  {prescricao.acompanhante_restricoes && (
                                    <div className="presc-detail-card full-width">
                                      <label>Restrições</label>
                                      <span>
                                        {prescricao.acompanhante_restricoes}
                                      </span>
                                    </div>
                                  )}

                                  {prescricao.acompanhante_obs_livre && (
                                    <div className="presc-detail-card full-width">
                                      <label>Obs. Acompanhante</label>
                                      <span>
                                        {prescricao.acompanhante_obs_livre}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Paginação */}
      <footer className="presc-pagination">
        <div className="presc-pagination-info">
          Mostrando {prescricoes.length} de {paginacao.total} · Página{" "}
          {paginacao.pagina} de {Math.max(paginacao.totalPaginas || 1, 1)}
        </div>
        <div className="presc-pagination-actions">
          <button
            className="presc-btn presc-btn-secondary"
            onClick={paginaAnterior}
            disabled={paginacao.pagina <= 1}
          >
            Anterior
          </button>
          <button
            className="presc-btn presc-btn-secondary"
            onClick={proximaPagina}
            disabled={
              paginacao.totalPaginas === 0 ||
              paginacao.pagina >= paginacao.totalPaginas
            }
          >
            Próxima
          </button>
        </div>
      </footer>

      {/* Modal de Edição */}
      {modalEdicaoAberto && prescricaoEditando && (
        <ModalEditarPrescricao
          prescricao={prescricaoEditando}
          onCancelar={() => {
            setModalEdicaoAberto(false);
            setPrescricaoEditando(null);
          }}
          onSalvar={handleSalvarEdicao}
          nucleos={nucleos}
          dietas={dietas}
          convenios={convenios}
          restricoes={restricoes}
          tiposAlimentacao={tiposAlimentacao}
        />
      )}

      {/* Toast */}
      <Toast
        visivel={toast.visivel}
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={fecharToast}
      />

      {/* Modal Alerta */}
      <ModalAlerta
        visivel={modalAlerta.visivel}
        titulo={modalAlerta.titulo}
        mensagem={modalAlerta.mensagem}
        tipo={modalAlerta.tipo}
        onConfirmar={modalAlerta.onConfirmar}
        onCancelar={() =>
          setModalAlerta((prev) => ({ ...prev, visivel: false }))
        }
      />
    </div>
  );
}

export default Prescricoes;