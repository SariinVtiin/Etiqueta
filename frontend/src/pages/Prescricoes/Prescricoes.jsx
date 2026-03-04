import React, { useState, useEffect, useCallback } from "react";
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
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";

function Prescricoes() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    nucleos = {},
    dietas = [],
    restricoes = [],
    tiposAlimentacao = [],
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
        "perigo"
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

  // Toast customizado
  const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "" });

  // Modal de alerta/confirmação
  const [modalAlerta, setModalAlerta] = useState({
    visivel: false,
    titulo: "",
    mensagem: "",
    tipo: "info",
    onConfirmar: null,
  });

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
              mostrarToast("Nenhuma prescrição encontrada para gerar mapa.", "aviso");
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
            console.error("Erro ao gerar mapa de refeição:", erro);
            mostrarToast("Erro ao gerar mapa de refeição.", "erro");
          }
        }
      );
    };

  const mostrarToast = (mensagem, tipo = "sucesso") => {
    setToast({ visivel: true, mensagem, tipo });
  };

  const fecharToast = () => {
    setToast({ visivel: false, mensagem: "", tipo: "" });
  };

  const mostrarAlerta = (titulo, mensagem, tipo = "info") => {
    setModalAlerta({
      visivel: true,
      titulo,
      mensagem,
      tipo,
      onConfirmar: () => setModalAlerta(prev => ({ ...prev, visivel: false })),
    });
  };

  const mostrarConfirmacao = (titulo, mensagem, onConfirmar, tipo = "confirmar") => {
    setModalAlerta({
      visivel: true,
      titulo,
      mensagem,
      tipo,
      onConfirmar: () => {
        setModalAlerta(prev => ({ ...prev, visivel: false }));
        onConfirmar();
      },
    });
  };

  // ============================================
  // SISTEMA DE IMPRESSÃO DE ETIQUETAS - CONSOLIDADO
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
            mostrarToast("Nenhuma prescrição encontrada para imprimir.", "aviso");
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
      }
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
          <h3>🏷️ Preview de Impressão</h3>
          <p>📊 Total de <strong>${prescricoesParaImprimir.length}</strong> etiqueta(s) | 📅 Data: <strong>${dataFormatada}</strong></p>
          <p>📏 Tamanho: <strong>10cm x 8cm</strong> cada etiqueta</p>
          <button onclick="window.print()" class="btn-preview btn-imprimir">🖨️ Imprimir</button>
          <button onclick="window.close()" class="btn-preview btn-fechar">✖️ Fechar</button>
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
              ? `
          <div class="etiqueta-sem-principal">
            <span class="etiqueta-sem-principal-label">⚠️ SEM PRINCIPAL:</span>
            <span class="etiqueta-sem-principal-valor">${prescricao.descricao_sem_principal || ""}</span>
          </div>
          `
              : ""
          }

          <div class="etiqueta-grid">
            <div class="etiqueta-item">
              <span class="etiqueta-label">Mãe:</span>
              <span class="etiqueta-valor">${prescricao.nome_mae || "-"}</span>
            </div>

            <div class="etiqueta-item">
              <span class="etiqueta-label">Atend:</span>
              <span class="etiqueta-valor">${prescricao.codigo_atendimento || "-"}</span>
            </div>

            <div class="etiqueta-item">
              <span class="etiqueta-label">Convênio:</span>
              <span class="etiqueta-valor">${prescricao.convenio || "-"}</span>
            </div>

            <div class="etiqueta-item">
              <span class="etiqueta-label">Leito:</span>
              <span class="etiqueta-valor">${prescricao.leito || "-"}</span>
            </div>

            <div class="etiqueta-item destaque">
              <span class="etiqueta-label">Refeição:</span>
              <span class="etiqueta-valor">${prescricao.tipo_alimentacao || "-"}</span>
            </div>

            <div class="etiqueta-item destaque">
              <span class="etiqueta-label">Dieta:</span>
              <span class="etiqueta-valor">${prescricao.dieta || "-"}</span>
            </div>

            ${
              prescricao.restricoes && prescricao.restricoes.length > 0
                ? `
            <div class="etiqueta-item full-width">
              <span class="etiqueta-label">Cond. Nutricional:</span>
              <span class="etiqueta-valor">${prescricao.restricoes.join(", ")}</span>
            </div>
            `
                : ""
            }

            ${
              prescricao.obs_exclusao
                ? `
            <div class="etiqueta-item full-width">
              <span class="etiqueta-label">Exclusão:</span>
              <span class="etiqueta-valor">${prescricao.obs_exclusao}</span>
            </div>
            `
                : ""
            }

            ${
              prescricao.obs_acrescimo
                ? `
            <div class="etiqueta-item full-width">
              <span class="etiqueta-label">Acréscimo:</span>
              <span class="etiqueta-valor">${prescricao.obs_acrescimo}</span>
            </div>
            `
                : ""
            }
          </div>
        </div>
      `;

      // ✅ Etiquetas do acompanhante (mantém a lógica do seu amigo)
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
              ? `Dieta Normal p/ Acompanhante`
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
                    ? `
                <div class="etiqueta-item full-width">
                  <span class="etiqueta-label">Obs:</span>
                  <span class="etiqueta-valor">${prescricao.acompanhante_obs_livre}</span>
                </div>
                `
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

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR");
  };

  const formatarHora = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="prescricoes-container">
      <div className="prescricoes-header">
        <h1>Prescrições de Alimentação</h1>
        <button className="btn-voltar" onClick={() => navigate("/dashboard")}>
          Voltar ao Menu
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>Buscar</label>
          <input
            type="text"
            placeholder="Nome, CPF..."
            value={filtros.busca}
            onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && aplicarFiltros()}
          />
        </div>

        <div className="filtro-grupo">
          <label>Leito</label>
          <input
            type="text"
            placeholder="Ex: 601"
            value={filtros.leito}
            onChange={(e) => setFiltros({ ...filtros, leito: e.target.value })}
            onKeyPress={(e) => e.key === "Enter" && aplicarFiltros()}
          />
        </div>

        <div className="filtro-grupo">
          <label>Data Início</label>
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) =>
              setFiltros({ ...filtros, dataInicio: e.target.value })
            }
          />
        </div>

        <div className="filtro-grupo">
          <label>Data Fim</label>
          <input
            type="date"
            value={filtros.dataFim}
            onChange={(e) =>
              setFiltros({ ...filtros, dataFim: e.target.value })
            }
          />
        </div>

        <div className="filtro-grupo">
          <label>Setor</label>
          <select
            value={filtros.setor}
            onChange={(e) => setFiltros({ ...filtros, setor: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="INTERNAÇÃO">INTERNAÇÃO</option>
            <option value="UTI PEDIÁTRICA">UTI PEDIÁTRICA</option>
            <option value="UTI ADULTO">UTI ADULTO</option>
            <option value="UDT">UDT</option>
            <option value="TMO">TMO</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Refeição</label>
          <select
            value={filtros.refeicao}
            onChange={(e) => setFiltros({ ...filtros, refeicao: e.target.value })}
          >
            <option value="">Todas</option>
            {tiposAlimentacao.map((tipo) => (
              <option key={tipo.id} value={tipo.nome}>
                {tipo.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-acoes">
          <button className="btn-filtrar" onClick={aplicarFiltros}>
            Filtrar
          </button>
          <button className="btn-limpar-filtros" onClick={limparFiltros}>
            Limpar
          </button>
        </div>
      </div>

      {/* Ações de Exportação */}
      <div className="acoes-exportacao">
        <div className="info-exportacao">
          Total de registros: <strong>{paginacao.total}</strong>
        </div>

        <div className="botoes-exportacao">
          <button
            className="btn-exportar imprimir"
            onClick={handleImprimirEtiquetas}
          >
            🖨️ Imprimir Etiquetas
          </button>
          <button className="btn-exportar excel" onClick={handleExportarExcel}>
            📊 Exportar Excel
          </button>
          <button className="btn-exportar pdf" onClick={handleExportarPDF}>
            📄 Exportar PDF
          </button>
          <button
            className="btn-exportar detalhado"
            onClick={handleRelatorioDetalhado}
          >
            📈 Relatório Detalhado
          </button>

          {/* ✅ VOLTOU: mapa */}
          <button className="btn-exportar mapa" onClick={handleGerarMapa}>
            🗺️ Gerar Mapa
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      {carregando ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando prescrições...</p>
        </div>
      ) : erro ? (
        <div className="mensagem-erro">{erro}</div>
      ) : prescricoes.length === 0 ? (
        <div className="sem-resultados">
          <h3>Nenhuma prescrição encontrada</h3>
          <p>Tente ajustar os filtros ou criar uma nova prescrição.</p>
        </div>
      ) : (
        <>
          {/* Tabela de Prescrições */}
          <div className="tabela-container">
            <table className="tabela-prescricoes">
              <thead>
                <tr>
                  <th>Expand</th>
                  <th>Paciente</th>
                  <th>CPF</th>
                  <th>Leito</th>
                  <th>Setor</th>
                  <th>Dieta</th>
                  <th>Refeição</th>
                  <th>Acomp.</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {prescricoes.map((prescricao) => (
                  <React.Fragment key={prescricao.id}>
                    <tr className="linha-principal">
                      <td>
                        <button
                          className="btn-expandir"
                          onClick={() => toggleExpandir(prescricao.id)}
                        >
                          {linhaExpandida === prescricao.id ? "▼" : "▶"}
                        </button>
                      </td>
                      <td>{prescricao.nome_paciente}</td>
                      <td>{prescricao.cpf}</td>
                      <td>{prescricao.leito}</td>
                      <td>{prescricao.nucleo}</td>
                      <td>{prescricao.dieta}</td>
                      <td>{prescricao.tipo_alimentacao}</td>
                      <td>
                        {prescricao.tem_acompanhante ? (
                          <span className="status-badge acompanhante">Sim</span>
                        ) : (
                          <span className="status-badge sem-acomp">-</span>
                        )}
                      </td>
                      <td>{formatarData(prescricao.data_prescricao)}</td>
                      <td>{formatarHora(prescricao.criado_em)}</td>
                      <td>
                        <span className="status-badge ativo">Ativo</span>
                      </td>
                      <td>
                        <button
                          className="btn-acao-editar"
                          onClick={() => handleEditar(prescricao)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-acao-excluir"
                          onClick={() => handleExcluir(prescricao.id)}
                          title="Excluir"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>

                    {linhaExpandida === prescricao.id && (
                      <tr className="linha-expandida">
                        <td colSpan="12">
                          <div className="detalhes-prescricao">
                            <h4>Detalhes Completos</h4>
                            <div className="detalhes-grid">
                              <div className="detalhe-item">
                                <strong>Código Atendimento:</strong>
                                <span>{prescricao.codigo_atendimento}</span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Convênio:</strong>
                                <span>{prescricao.convenio}</span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Nome da Mãe:</strong>
                                <span>{prescricao.nome_mae}</span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Idade:</strong>
                                <span>{prescricao.idade} anos</span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Data Nascimento:</strong>
                                <span>
                                  {formatarData(prescricao.data_nascimento)}
                                </span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Núcleo:</strong>
                                <span>{prescricao.nucleo}</span>
                              </div>

                              {prescricao.restricoes &&
                                prescricao.restricoes.length > 0 && (
                                  <div className="detalhe-item full-width">
                                    <strong>Cond. Nutricionais:</strong>
                                    <span>
                                      {prescricao.restricoes.join(", ")}
                                    </span>
                                  </div>
                                )}

                              {prescricao.sem_principal && (
                                <div className="detalhe-item full-width">
                                  <strong>Sem Principal:</strong>
                                  <span>
                                    {prescricao.descricao_sem_principal}
                                  </span>
                                </div>
                              )}

                              {prescricao.obs_exclusao && (
                                <div className="detalhe-item full-width">
                                  <strong>Exclusões:</strong>
                                  <span>{prescricao.obs_exclusao}</span>
                                </div>
                              )}

                              {prescricao.obs_acrescimo && (
                                <div className="detalhe-item full-width">
                                  <strong>Acréscimos:</strong>
                                  <span>{prescricao.obs_acrescimo}</span>
                                </div>
                              )}

                              <div className="detalhe-item">
                                <strong>Criado em:</strong>
                                <span>
                                  {formatarData(
                                    prescricao.data_cadastro ||
                                      prescricao.data_prescricao,
                                  )}{" "}
                                  às{" "}
                                  {formatarHora(
                                    prescricao.data_cadastro ||
                                      prescricao.data_prescricao,
                                  )}
                                </span>
                              </div>

                              <div className="detalhe-item">
                                <strong>Por:</strong>
                                <span>{prescricao.created_by_name}</span>
                              </div>

                              {prescricao.tem_acompanhante && (
                                <div className="detalhe-acompanhante">
                                  <h5>Acompanhante</h5>
                                  <div className="detalhes-grid">
                                    <div className="detalhe-item">
                                      <strong>Tipo:</strong>
                                      <span>
                                        {prescricao.tipo_acompanhante ===
                                          "adulto" && "Adulto (3 refeições)"}
                                        {prescricao.tipo_acompanhante ===
                                          "crianca" && "Criança (6 refeições)"}
                                        {prescricao.tipo_acompanhante ===
                                          "idoso" && "Idoso (6 refeições)"}
                                      </span>
                                    </div>
                                    <div className="detalhe-item">
                                      <strong>Dieta:</strong>
                                      <span>Dieta Normal</span>
                                    </div>
                                    <div className="detalhe-item full-width">
                                      <strong>Refeições:</strong>
                                      <span>
                                        {(() => {
                                          try {
                                            const refs =
                                              typeof prescricao.acompanhante_refeicoes ===
                                              "string"
                                                ? JSON.parse(
                                                    prescricao.acompanhante_refeicoes,
                                                  )
                                                : prescricao.acompanhante_refeicoes ||
                                                  [];
                                            return refs.join(", ") || "Nenhuma";
                                          } catch (e) {
                                            return "Nenhuma";
                                          }
                                        })()}
                                      </span>
                                    </div>
                                    {prescricao.acompanhante_obs_livre && (
                                      <div className="detalhe-item full-width">
                                        <strong>Obs. Acompanhante:</strong>
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
          </div>

          {/* Paginação */}
          <div className="paginacao">
            <div className="paginacao-info">
              Mostrando {prescricoes.length} de {paginacao.total} registros
              (Página {paginacao.pagina} de {paginacao.totalPaginas})
            </div>

            <div className="paginacao-botoes">
              <button
                onClick={paginaAnterior}
                disabled={paginacao.pagina === 1}
              >
                ← Anterior
              </button>

              <button
                onClick={proximaPagina}
                disabled={paginacao.pagina >= paginacao.totalPaginas}
              >
                Próxima →
              </button>
            </div>
          </div>
        </>
      )}

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
          restricoes={restricoes}
          tiposAlimentacao={tiposAlimentacao}
        />
      )}

      {/* Toast Customizado */}
      <Toast
        visivel={toast.visivel}
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={fecharToast}
      />

      {/* Modal de Alerta/Confirmação */}
      <ModalAlerta
        visivel={modalAlerta.visivel}
        titulo={modalAlerta.titulo}
        mensagem={modalAlerta.mensagem}
        tipo={modalAlerta.tipo}
        onConfirmar={modalAlerta.onConfirmar}
        onCancelar={() => setModalAlerta(prev => ({ ...prev, visivel: false }))}
      />

    </div>
  );
}

export default Prescricoes;
