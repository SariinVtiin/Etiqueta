// frontend/src/pages/Dashboard/Dashboard.jsx
// ✅ MELHORADO: Visual profissional, dados mais relevantes, melhor UX
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { listarPrescricoes } from "../../services/api";
import "./Dashboard.css";

// Ícones SVG inline
const Icons = {
  calendar: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  trendingUp: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendingDown: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  barChart: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  clipboard: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  plus: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  arrowRight: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  clock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  building: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <line x1="8" y1="6" x2="8" y2="6" />
      <line x1="16" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" />
      <line x1="16" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" />
      <line x1="16" y1="14" x2="16" y2="14" />
    </svg>
  ),
  utensils: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  users: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  bed: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  ),
  info: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  alertTriangle: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  refresh: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
};

function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const irParaPrescricoes = () => navigate("/prescricoes");
  const irParaNovaPrescricao = () => navigate("/nova-prescricao");

  const [estatisticas, setEstatisticas] = useState({
    totalHoje: 0,
    totalOntem: 0,
    totalSemana: 0,
    totalMes: 0,
    porSetor: {},
    porDieta: {},
    porRefeicao: {},
    ultimasPrescricoes: [],
    pacientesUnicos: 0,
    setoresAtivos: 0,
  });
  const [carregando, setCarregando] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [atualizadoEm, setAtualizadoEm] = useState(null);

  useEffect(() => {
    setMounted(true);
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setCarregando(true);

      const hoje = new Date();
      const hojeStr = hoje.toISOString().split("T")[0];

      const ontem = new Date(hoje);
      ontem.setDate(hoje.getDate() - 1);
      const ontemStr = ontem.toISOString().split("T")[0];

      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioSemanaStr = inicioSemana.toISOString().split("T")[0];

      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const inicioMesStr = inicioMes.toISOString().split("T")[0];

      const [
        respostaHoje,
        respostaOntem,
        respostaSemana,
        respostaMes,
        respostaRecentes,
      ] = await Promise.all([
        listarPrescricoes({
          dataInicio: hojeStr,
          dataFim: hojeStr,
          limit: 100,
        }),
        listarPrescricoes({
          dataInicio: ontemStr,
          dataFim: ontemStr,
          limit: 100,
        }),
        listarPrescricoes({ dataInicio: inicioSemanaStr, limit: 100 }),
        listarPrescricoes({ dataInicio: inicioMesStr, limit: 100 }),
        listarPrescricoes({ limit: 8 }),
      ]);

      // Agrupar por setor
      const porSetor = {};
      respostaMes.prescricoes?.forEach((p) => {
        const setor = p.nucleo || "Sem setor";
        porSetor[setor] = (porSetor[setor] || 0) + 1;
      });

      // Agrupar por dieta
      const porDieta = {};
      respostaMes.prescricoes?.forEach((p) => {
        const dieta = p.dieta || "Sem dieta";
        porDieta[dieta] = (porDieta[dieta] || 0) + 1;
      });

      // Agrupar por refeição
      const porRefeicao = {};
      respostaMes.prescricoes?.forEach((p) => {
        const refeicao = p.tipo_alimentacao || "Outro";
        porRefeicao[refeicao] = (porRefeicao[refeicao] || 0) + 1;
      });

      // Pacientes únicos hoje
      const cpfsHoje = new Set();
      respostaHoje.prescricoes?.forEach((p) => cpfsHoje.add(p.cpf));

      setEstatisticas({
        totalHoje: respostaHoje.paginacao?.total || 0,
        totalOntem: respostaOntem.paginacao?.total || 0,
        totalSemana: respostaSemana.paginacao?.total || 0,
        totalMes: respostaMes.paginacao?.total || 0,
        porSetor,
        porDieta,
        porRefeicao,
        ultimasPrescricoes: respostaRecentes.prescricoes || [],
        pacientesUnicos: cpfsHoje.size,
        setoresAtivos: Object.keys(porSetor).length,
      });

      setAtualizadoEm(new Date());
    } catch (erro) {
      console.error("Erro ao carregar estatísticas:", erro);
    } finally {
      setCarregando(false);
    }
  };

  // ============================================
  // HELPERS
  // ============================================
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

  const getGreeting = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getPrimeiroNome = (nomeCompleto) => {
    return nomeCompleto.split(" ")[0];
  };

  const calcularVariacao = (atual, anterior) => {
    if (anterior === 0) return atual > 0 ? 100 : 0;
    return Math.round(((atual - anterior) / anterior) * 100);
  };

  const mediaDiaria = () => {
    const diasNoMes = new Date().getDate();
    return diasNoMes > 0 ? Math.round(estatisticas.totalMes / diasNoMes) : 0;
  };

  // ============================================
  // RENDER
  // ============================================
  if (carregando) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  const variacao = calcularVariacao(
    estatisticas.totalHoje,
    estatisticas.totalOntem,
  );

  return (
    <div className={`dashboard-page ${mounted ? "mounted" : ""}`}>
      {/* Header de Boas-vindas */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="greeting-section">
            <h1>
              {getGreeting()}, {getPrimeiroNome(usuario.nome)}
            </h1>
            <p className="header-subtitle">
              {usuario.role === "admin" ? "Administrador" : "Nutricionista"} ·
              Sistema de Nutrição Hospitalar
            </p>
          </div>
          <div className="header-right">
            <button
              className="btn-atualizar-dash"
              onClick={carregarEstatisticas}
              title="Atualizar dados"
            >
              {Icons.refresh}
            </button>
            <div className="header-date">
              <span className="date-icon">{Icons.calendar}</span>
              <span>
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Cards de Estatísticas Principais */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card stat-today">
            <div className="stat-icon-wrapper">{Icons.calendar}</div>
            <div className="stat-info">
              <span className="stat-label">Hoje</span>
              <span className="stat-value">{estatisticas.totalHoje}</span>
              <span className="stat-desc">prescrições</span>
            </div>
            {variacao !== 0 && (
              <div
                className={`stat-badge ${variacao >= 0 ? "badge-up" : "badge-down"}`}
              >
                {variacao >= 0 ? Icons.trendingUp : Icons.trendingDown}
                <span>
                  {variacao > 0 ? "+" : ""}
                  {variacao}%
                </span>
              </div>
            )}
          </div>

          <div className="stat-card stat-week">
            <div className="stat-icon-wrapper">{Icons.barChart}</div>
            <div className="stat-info">
              <span className="stat-label">Esta Semana</span>
              <span className="stat-value">{estatisticas.totalSemana}</span>
              <span className="stat-desc">prescrições</span>
            </div>
          </div>

          <div className="stat-card stat-month">
            <div className="stat-icon-wrapper">{Icons.trendingUp}</div>
            <div className="stat-info">
              <span className="stat-label">Este Mês</span>
              <span className="stat-value">{estatisticas.totalMes}</span>
              <span className="stat-desc">prescrições</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Cards - Métricas Secundárias */}
      <section className="mini-stats-section">
        <div className="mini-stats-grid">
          <div className="mini-stat-card">
            <div className="mini-stat-icon icon-pacientes">{Icons.users}</div>
            <div className="mini-stat-info">
              <span className="mini-stat-value">
                {estatisticas.pacientesUnicos}
              </span>
              <span className="mini-stat-label">Pacientes hoje</span>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon icon-setores">{Icons.building}</div>
            <div className="mini-stat-info">
              <span className="mini-stat-value">
                {estatisticas.setoresAtivos}
              </span>
              <span className="mini-stat-label">Setores ativos</span>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon icon-media">{Icons.barChart}</div>
            <div className="mini-stat-info">
              <span className="mini-stat-value">{mediaDiaria()}</span>
              <span className="mini-stat-label">Média/dia mês</span>
            </div>
          </div>
          <div className="mini-stat-card">
            <div className="mini-stat-icon icon-ontem">{Icons.clock}</div>
            <div className="mini-stat-info">
              <span className="mini-stat-value">{estatisticas.totalOntem}</span>
              <span className="mini-stat-label">Ontem</span>
            </div>
          </div>
        </div>
      </section>

      {/* Acesso Rápido */}
      <section className="actions-section">
        <h2 className="section-title">Acesso Rápido</h2>
        <div className="actions-grid">
          <button className="action-card" onClick={irParaPrescricoes}>
            <div className="action-icon">{Icons.clipboard}</div>
            <div className="action-content">
              <h3>Prescrições</h3>
              <p>Visualizar e gerenciar todas as prescrições de alimentação</p>
            </div>
            <div className="action-arrow">{Icons.arrowRight}</div>
          </button>

          <button
            className="action-card action-primary"
            onClick={irParaNovaPrescricao}
          >
            <div className="action-icon">{Icons.plus}</div>
            <div className="action-content">
              <h3>Nova Prescrição</h3>
              <p>Criar uma nova prescrição de alimentação para paciente</p>
            </div>
            <div className="action-arrow">{Icons.arrowRight}</div>
          </button>
        </div>
      </section>

      {/* Seção de Gráficos e Dados */}
      <section className="data-section">
        <div className="data-grid">
          {/* Gráfico por Setor */}
          <div className="data-card">
            <div className="data-card-header">
              <div className="data-card-icon">{Icons.building}</div>
              <h3>Por Setor</h3>
              <span className="data-card-period">Este mês</span>
            </div>
            <div className="chart-container">
              {Object.entries(estatisticas.porSetor).length === 0 ? (
                <div className="empty-chart">
                  <p>Nenhum dado disponível</p>
                </div>
              ) : (
                <div className="bar-chart">
                  {Object.entries(estatisticas.porSetor)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([setor, quantidade], index) => {
                      const maxValue = Math.max(
                        ...Object.values(estatisticas.porSetor),
                      );
                      const percentage = (quantidade / maxValue) * 100;
                      const percentTotal =
                        estatisticas.totalMes > 0
                          ? Math.round(
                              (quantidade / estatisticas.totalMes) * 100,
                            )
                          : 0;
                      return (
                        <div
                          key={setor}
                          className="bar-item"
                          style={{ "--delay": `${index * 0.1}s` }}
                        >
                          <div className="bar-header">
                            <div className="bar-label">{setor}</div>
                            <div className="bar-stats">
                              <span className="bar-count">{quantidade}</span>
                              <span className="bar-percent">
                                {percentTotal}%
                              </span>
                            </div>
                          </div>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{ "--width": `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Gráfico por Dieta */}
          <div className="data-card">
            <div className="data-card-header">
              <div className="data-card-icon">{Icons.utensils}</div>
              <h3>Por Dieta</h3>
              <span className="data-card-period">Este mês</span>
            </div>
            <div className="chart-container">
              {Object.entries(estatisticas.porDieta).length === 0 ? (
                <div className="empty-chart">
                  <p>Nenhum dado disponível</p>
                </div>
              ) : (
                <div className="bar-chart">
                  {Object.entries(estatisticas.porDieta)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([dieta, quantidade], index) => {
                      const maxValue = Math.max(
                        ...Object.values(estatisticas.porDieta),
                      );
                      const percentage = (quantidade / maxValue) * 100;
                      const percentTotal =
                        estatisticas.totalMes > 0
                          ? Math.round(
                              (quantidade / estatisticas.totalMes) * 100,
                            )
                          : 0;
                      return (
                        <div
                          key={dieta}
                          className="bar-item"
                          style={{ "--delay": `${index * 0.1}s` }}
                        >
                          <div className="bar-header">
                            <div className="bar-label">{dieta}</div>
                            <div className="bar-stats">
                              <span className="bar-count">{quantidade}</span>
                              <span className="bar-percent">
                                {percentTotal}%
                              </span>
                            </div>
                          </div>
                          <div className="bar-track">
                            <div
                              className="bar-fill bar-fill-secondary"
                              style={{ "--width": `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Distribuição por Refeição */}
          <div className="data-card">
            <div className="data-card-header">
              <div className="data-card-icon icon-refeicao">{Icons.clock}</div>
              <h3>Por Refeição</h3>
              <span className="data-card-period">Este mês</span>
            </div>
            <div className="chart-container">
              {Object.entries(estatisticas.porRefeicao).length === 0 ? (
                <div className="empty-chart">
                  <p>Nenhum dado disponível</p>
                </div>
              ) : (
                <div className="refeicao-grid">
                  {Object.entries(estatisticas.porRefeicao)
                    .sort((a, b) => b[1] - a[1])
                    .map(([refeicao, quantidade], index) => {
                      const percentTotal =
                        estatisticas.totalMes > 0
                          ? Math.round(
                              (quantidade / estatisticas.totalMes) * 100,
                            )
                          : 0;
                      const emojiMap = {
                        Desjejum: "🌅",
                        Colação: "🍎",
                        Almoço: "🍽️",
                        Lanche: "🥪",
                        Jantar: "🌙",
                        Ceia: "🌛",
                      };
                      return (
                        <div
                          key={refeicao}
                          className="refeicao-item"
                          style={{ "--delay": `${index * 0.08}s` }}
                        >
                          <div className="refeicao-emoji">
                            {emojiMap[refeicao] || "🍴"}
                          </div>
                          <div className="refeicao-info">
                            <span className="refeicao-nome">{refeicao}</span>
                            <span className="refeicao-count">{quantidade}</span>
                          </div>
                          <div className="refeicao-bar-mini">
                            <div
                              className="refeicao-bar-fill"
                              style={{ "--width": `${percentTotal}%` }}
                            />
                          </div>
                          <span className="refeicao-percent">
                            {percentTotal}%
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Atividade Recente */}
          <div className="data-card data-card-wide">
            <div className="data-card-header">
              <div className="data-card-icon">{Icons.clock}</div>
              <h3>Atividade Recente</h3>
              <button className="view-all-btn" onClick={irParaPrescricoes}>
                Ver todas
                {Icons.arrowRight}
              </button>
            </div>
            <div className="recent-list">
              {estatisticas.ultimasPrescricoes.length === 0 ? (
                <div className="empty-list">
                  <div className="empty-icon">{Icons.clipboard}</div>
                  <p>Nenhuma prescrição cadastrada ainda</p>
                  <button
                    className="empty-action"
                    onClick={irParaNovaPrescricao}
                  >
                    Criar primeira prescrição
                  </button>
                </div>
              ) : (
                estatisticas.ultimasPrescricoes.map((prescricao, index) => (
                  <div
                    key={prescricao.id}
                    className="recent-item"
                    style={{ "--delay": `${index * 0.05}s` }}
                  >
                    <div className="recent-avatar">
                      {prescricao.nome_paciente?.charAt(0).toUpperCase() || "P"}
                    </div>
                    <div className="recent-info">
                      <strong>{prescricao.nome_paciente}</strong>
                      <span className="recent-details">
                        Leito {prescricao.leito} · {prescricao.dieta} ·{" "}
                        {prescricao.tipo_alimentacao}
                      </span>
                    </div>
                    <div className="recent-meta">
                      {prescricao.nucleo && (
                        <span className="recent-setor">
                          {prescricao.nucleo}
                        </span>
                      )}
                      <div className="recent-time">
                        <span className="recent-date">
                          {formatarData(prescricao.data_prescricao)}
                        </span>
                        <span className="recent-hour">
                          {formatarHora(prescricao.data_prescricao)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Card de Informações */}
      <section className="info-section">
        <div className="info-card">
          <div className="info-header">
            <div className="info-icon">{Icons.info}</div>
            <h3>Informações Importantes</h3>
            {atualizadoEm && (
              <span className="info-atualizado">
                Atualizado{" "}
                {atualizadoEm.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
          <ul className="info-list">
            <li>
              <span className="info-check">{Icons.check}</span>
              Prescrições podem ser editadas até 9h do dia seguinte
            </li>
            <li>
              <span className="info-check">{Icons.check}</span>
              Etiquetas são impressas pela tela de prescrições
            </li>
            <li>
              <span className="info-check">{Icons.check}</span>
              Use os filtros para encontrar prescrições rapidamente
            </li>
            <li>
              <span className="info-check">{Icons.check}</span>
              Verifique diariamente as prescrições pendentes
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
