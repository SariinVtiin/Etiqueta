import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  exportarFaturamentoExcel,
  listarAnaliticoFaturamento,
  listarOpcoesFiltroFaturamento,
  listarResumoFaturamento,
  reprocessarHistoricoFaturamento,
} from "../../services/api";
import "./Faturamento.css";
import ModalAlerta from "../../components/common/ModalAlerta/ModalAlerta";
import useModalAlerta from "../../hooks/useModalAlerta";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const itemLabels = {
  refeicao_paciente: "Refeição Paciente",
  acrescimo: "Acréscimo",
  lactario: "Lactário",
  acompanhante: "Acompanhante",
};

const statusLabels = {
  cobrado: "Cobrado",
  pendente_preco: "Preço pendente",
  cancelado: "Cancelado",
};

const filtrosIniciais = {
  paciente: "",
  cpf: "",
  codigoAtendimento: "",
  convenio: "",
  nucleo: "",
  leito: "",
  tipoRefeicao: "",
  dieta: "",
  tipoItem: "",
  status: "",
  dataInicio: "",
  dataFim: "",
};

function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function buildExportName(filters) {
  const from = filters.dataInicio || "inicio";
  const to = filters.dataFim || "atual";
  return `faturamento_${from}_${to}.xlsx`;
}

function normalizarListaOpcoes(lista = [], campo = "nome") {
  const valores = lista
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") return item[campo];
      return null;
    })
    .filter(Boolean);

  return [...new Set(valores)];
}

export default function Faturamento() {
  const {
    nucleos = {},
    dietas = [],
    tiposAlimentacao = [],
    convenios = [],
  } = useOutletContext() || {};

  const {
    modal,
    fecharModal: fecharModalAlerta,
    mostrarAlerta,
    mostrarConfirmacao,
  } = useModalAlerta();

  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [filtrosAplicados, setFiltrosAplicados] = useState({});
  const [pagina, setPagina] = useState(1);

  const [resumo, setResumo] = useState(null);
  const [mensal, setMensal] = useState([]);
  const [itens, setItens] = useState([]);
  const [paginacao, setPaginacao] = useState({
    pagina: 1,
    totalPaginas: 1,
    total: 0,
  });
  const [totais, setTotais] = useState({ valor_total: 0 });

  const [opcoesFiltro, setOpcoesFiltro] = useState({
    convenios: [],
    nucleos: [],
    tiposRefeicao: [],
    dietas: [],
  });

  const [carregando, setCarregando] = useState(true);
  const [exportando, setExportando] = useState(false);
  const [reprocessando, setReprocessando] = useState(false);
  const [erro, setErro] = useState("");

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const filtrosConsulta = {
        ...filtrosAplicados,
        page: pagina,
        limit: 20,
      };

      const [resumoResp, analiticoResp] = await Promise.all([
        listarResumoFaturamento(filtrosAplicados),
        listarAnaliticoFaturamento(filtrosConsulta),
      ]);

      setResumo(resumoResp?.totais || null);
      setMensal(resumoResp?.mensal || []);
      setItens(analiticoResp?.itens || []);
      setPaginacao(
        analiticoResp?.paginacao || {
          pagina: 1,
          totalPaginas: 1,
          total: 0,
        },
      );
      setTotais(analiticoResp?.totais || { valor_total: 0 });
    } catch (error) {
      console.error("Erro ao carregar faturamento:", error);
      setErro(error.message || "Não foi possível carregar o faturamento.");
    } finally {
      setCarregando(false);
    }
  }, [filtrosAplicados, pagina]);

  const carregarOpcoesFiltro = useCallback(async () => {
    try {
      const resposta = await listarOpcoesFiltroFaturamento();

      setOpcoesFiltro(
        resposta?.opcoes || {
          convenios: [],
          nucleos: [],
          tiposRefeicao: [],
          dietas: [],
        },
      );
    } catch (error) {
      console.error("Erro ao carregar opções de filtro do faturamento:", error);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    carregarOpcoesFiltro();
  }, [carregarOpcoesFiltro]);

  const handleFiltroChange = (event) => {
    const { name, value } = event.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarFiltros = () => {
    setPagina(1);
    setFiltrosAplicados({ ...filtros });
  };

  const limparFiltros = () => {
    setFiltros(filtrosIniciais);
    setFiltrosAplicados({});
    setPagina(1);
  };

  const handleExportar = async () => {
    try {
      setExportando(true);
      const blob = await exportarFaturamentoExcel(filtrosAplicados);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = buildExportName(filtrosAplicados);

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar faturamento:", error);
      mostrarAlerta({
        titulo: "Erro ao exportar",
        mensagem: error.message || "Não foi possível exportar o relatório.",
        tipo: "erro",
      });
    } finally {
      setExportando(false);
    }
  };

  const handleReprocessarHistorico = () => {
    mostrarConfirmacao({
      titulo: "Reprocessar histórico",
      mensagem:
        "Isso vai recalcular o faturamento de todas as prescrições existentes. Deseja continuar?",
      tipo: "perigo",
      textoBotaoConfirmar: "Reprocessar",
      textoBotaoCancelar: "Cancelar",
      onConfirmar: async () => {
        try {
          setReprocessando(true);
          const resposta = await reprocessarHistoricoFaturamento();

          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: `Histórico reprocessado. Prescrições processadas: ${resposta.resultado.processadas}/${resposta.resultado.totalPrescricoes}`,
            tipo: "sucesso",
          });

          await Promise.all([carregarDados(), carregarOpcoesFiltro()]);
        } catch (error) {
          console.error("Erro ao reprocessar histórico:", error);
          mostrarAlerta({
            titulo: "Erro ao reprocessar",
            mensagem:
              error.message || "Não foi possível reprocessar o histórico.",
            tipo: "erro",
          });
        } finally {
          setReprocessando(false);
        }
      },
    });
  };

  const opcoesConvenios = useMemo(() => {
    if (opcoesFiltro.convenios.length > 0) return opcoesFiltro.convenios;
    return normalizarListaOpcoes(convenios, "nome");
  }, [opcoesFiltro.convenios, convenios]);

  const opcoesNucleos = useMemo(() => {
    if (opcoesFiltro.nucleos.length > 0) return opcoesFiltro.nucleos;
    return Object.keys(nucleos || {});
  }, [opcoesFiltro.nucleos, nucleos]);

  const opcoesTiposRefeicao = useMemo(() => {
    if (opcoesFiltro.tiposRefeicao.length > 0) {
      return opcoesFiltro.tiposRefeicao;
    }
    return normalizarListaOpcoes(tiposAlimentacao, "nome");
  }, [opcoesFiltro.tiposRefeicao, tiposAlimentacao]);

  const opcoesDietas = useMemo(() => {
    if (opcoesFiltro.dietas.length > 0) return opcoesFiltro.dietas;
    return normalizarListaOpcoes(dietas, "nome");
  }, [opcoesFiltro.dietas, dietas]);

  return (
    <div className="fat-page">
      <section className="fat-header">
        <div>
          <h1>Faturamento</h1>
          <p>
            Acompanhe o valor faturado por período e faça auditoria detalhada
            por paciente, setor, refeição, dieta e tipo de item.
          </p>
        </div>

        <div className="fat-header-actions">
          <button
            className="fat-btn fat-btn-secondary"
            onClick={handleReprocessarHistorico}
            disabled={reprocessando}
          >
            {reprocessando ? "Reprocessando..." : "Reprocessar histórico"}
          </button>

          <button
            className="fat-btn fat-btn-primary"
            onClick={handleExportar}
            disabled={exportando}
          >
            {exportando ? "Exportando..." : "Exportar Excel"}
          </button>
        </div>
      </section>

      <section className="fat-cards">
        <article className="fat-card">
          <span>Hoje</span>
          <strong>{formatCurrency(resumo?.total_hoje)}</strong>
        </article>

        <article className="fat-card">
          <span>Semana</span>
          <strong>{formatCurrency(resumo?.total_semana)}</strong>
        </article>

        <article className="fat-card">
          <span>Mês</span>
          <strong>{formatCurrency(resumo?.total_mes)}</strong>
        </article>

        <article className="fat-card">
          <span>Ano</span>
          <strong>{formatCurrency(resumo?.total_ano)}</strong>
        </article>
      </section>

      <section className="fat-insights">
        <div className="fat-insight-box">
          <span>Total filtrado</span>
          <strong>{formatCurrency(resumo?.total_filtrado)}</strong>
        </div>

        <div className="fat-insight-box">
          <span>Itens no filtro</span>
          <strong>{resumo?.quantidade_itens ?? 0}</strong>
        </div>

        <div className="fat-insight-box">
          <span>Pacientes</span>
          <strong>{resumo?.quantidade_pacientes ?? 0}</strong>
        </div>

        <div className="fat-insight-box fat-warning-box">
          <span>Pendências de preço</span>
          <strong>{resumo?.pendencias_preco ?? 0}</strong>
        </div>
      </section>

      <section className="fat-filters">
        <div className="fat-grid fat-grid-4">
          <label>
            <span>Paciente</span>
            <input
              name="paciente"
              value={filtros.paciente}
              onChange={handleFiltroChange}
              placeholder="Ex.: Lara"
            />
          </label>

          <label>
            <span>CPF</span>
            <input
              name="cpf"
              value={filtros.cpf}
              onChange={handleFiltroChange}
              placeholder="Somente números"
            />
          </label>

          <label>
            <span>Cód. Atendimento</span>
            <input
              name="codigoAtendimento"
              value={filtros.codigoAtendimento}
              onChange={handleFiltroChange}
              placeholder="Ex.: 9898989"
            />
          </label>

          <label>
            <span>Leito</span>
            <input
              name="leito"
              value={filtros.leito}
              onChange={handleFiltroChange}
              placeholder="Ex.: 615"
            />
          </label>

          <label>
            <span>Convênio</span>
            <select
              name="convenio"
              value={filtros.convenio}
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              {opcoesConvenios.map((convenio) => (
                <option key={convenio} value={convenio}>
                  {convenio}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Núcleo</span>
            <select
              name="nucleo"
              value={filtros.nucleo}
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              {opcoesNucleos.map((nucleo) => (
                <option key={nucleo} value={nucleo}>
                  {nucleo}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Tipo de refeição</span>
            <select
              name="tipoRefeicao"
              value={filtros.tipoRefeicao}
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              {opcoesTiposRefeicao.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Dieta</span>
            <select
              name="dieta"
              value={filtros.dieta}
              onChange={handleFiltroChange}
            >
              <option value="">Todas</option>
              {opcoesDietas.map((dieta) => (
                <option key={dieta} value={dieta}>
                  {dieta}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Tipo de item</span>
            <select
              name="tipoItem"
              value={filtros.tipoItem}
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              {Object.entries(itemLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Status</span>
            <select
              name="status"
              value={filtros.status}
              onChange={handleFiltroChange}
            >
              <option value="">Todos</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Data inicial</span>
            <input
              type="date"
              name="dataInicio"
              value={filtros.dataInicio}
              onChange={handleFiltroChange}
            />
          </label>

          <label>
            <span>Data final</span>
            <input
              type="date"
              name="dataFim"
              value={filtros.dataFim}
              onChange={handleFiltroChange}
            />
          </label>
        </div>

        <div className="fat-filter-actions">
          <button className="fat-btn fat-btn-primary" onClick={aplicarFiltros}>
            Aplicar filtros
          </button>

          <button className="fat-btn fat-btn-secondary" onClick={limparFiltros}>
            Limpar
          </button>
        </div>
      </section>

      {erro && <div className="fat-alert-error">{erro}</div>}

      <section className="fat-annual-box">
        <div className="fat-section-title">
          <h2>Visão anual</h2>
          <span>Totais por mês do ano corrente</span>
        </div>

        <div className="fat-month-grid">
          {mensal.length === 0 ? (
            <div className="fat-empty">
              Nenhum valor encontrado para o ano corrente.
            </div>
          ) : (
            mensal.map((item) => (
              <div key={item.referencia} className="fat-month-card">
                <span>{item.referencia}</span>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="fat-table-box">
        <div className="fat-section-title fat-table-title">
          <div>
            <h2>Rastreabilidade analítica</h2>
            <span>Total da listagem: {formatCurrency(totais.valor_total)}</span>
          </div>
        </div>

        {carregando ? (
          <div className="fat-empty">Carregando faturamento...</div>
        ) : itens.length === 0 ? (
          <div className="fat-empty">
            Nenhum item encontrado com os filtros atuais.
          </div>
        ) : (
          <div className="fat-table-wrapper">
            <table className="fat-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Paciente</th>
                  <th>Atendimento</th>
                  <th>Núcleo</th>
                  <th>Refeição</th>
                  <th>Tipo item</th>
                  <th>Referência</th>
                  <th>Status</th>
                  <th>Valor un.</th>
                  <th>Valor total</th>
                </tr>
              </thead>

              <tbody>
                {itens.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      item.status === "pendente_preco" ? "is-pending" : ""
                    }
                  >
                    <td>{formatDate(item.data_consumo)}</td>

                    <td>
                      <div className="fat-cell-main">
                        <strong>{item.paciente_nome}</strong>
                        <span>{item.paciente_cpf}</span>
                      </div>
                    </td>

                    <td>
                      <div className="fat-cell-main">
                        <strong>{item.codigo_atendimento || "-"}</strong>
                        <span>Leito {item.leito || "-"}</span>
                      </div>
                    </td>

                    <td>{item.nucleo || "-"}</td>

                    <td>
                      <div className="fat-cell-main">
                        <strong>{item.tipo_refeicao || "-"}</strong>
                        <span>
                          {item.dieta_original || item.chave_dieta || "-"}
                        </span>
                      </div>
                    </td>

                    <td>{itemLabels[item.tipo_item] || item.tipo_item}</td>
                    <td>{item.referencia_nome}</td>

                    <td>
                      <span className={`fat-badge fat-badge-${item.status}`}>
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>

                    <td>{formatCurrency(item.valor_unitario)}</td>
                    <td>{formatCurrency(item.valor_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="fat-pagination">
          <span>
            Página {paginacao.pagina || 1} de {paginacao.totalPaginas || 1} •{" "}
            {paginacao.total || 0} registros
          </span>

          <div className="fat-pagination-actions">
            <button
              className="fat-btn fat-btn-secondary"
              onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
              disabled={pagina <= 1}
            >
              Anterior
            </button>

            <button
              className="fat-btn fat-btn-secondary"
              onClick={() => setPagina((prev) => prev + 1)}
              disabled={pagina >= (paginacao.totalPaginas || 1)}
            >
              Próxima
            </button>
          </div>
        </div>
      </section>
      <ModalAlerta
        visivel={modal.visivel}
        titulo={modal.titulo}
        mensagem={modal.mensagem}
        tipo={modal.tipo}
        textoBotaoConfirmar={modal.textoBotaoConfirmar}
        textoBotaoCancelar={modal.textoBotaoCancelar}
        onConfirmar={modal.onConfirmar || fecharModalAlerta}
        onCancelar={modal.onCancelar || fecharModalAlerta}
      />
    </div>
  );
}
