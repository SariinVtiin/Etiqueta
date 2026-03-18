// frontend/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { listarPrescricoes } from "../../services/api";
import "./Dashboard.css";

// Ícones SVG inline
const Icons = {
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  trendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendingDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <line x1="8" y1="6" x2="8" y2="6" />
      <line x1="12" y1="6" x2="12" y2="6" />
      <line x1="16" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" />
      <line x1="12" y1="10" x2="12" y2="10" />
      <line x1="16" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="8" y2="14" />
      <line x1="12" y1="14" x2="12" y2="14" />
      <line x1="16" y1="14" x2="16" y2="14" />
    </svg>
  ),
  utensils: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  average: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
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
  const [atualizadoEm, setAtualizadoEm] = useState(null);

  useEffect(() => {
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

      const [respostaHoje, respostaOntem, respostaSemana, respostaMes, respostaRecentes] =
        await Promise.all([
          listarPrescricoes({ dataInicio: hojeStr, dataFim: hojeStr, limit: 100 }),
          listarPrescricoes({ dataInicio: ontemStr, dataFim: ontemStr, limit: 100 }),
          listarPrescricoes({ dataInicio: inicioSemanaStr, limit: 100 }),
          listarPrescricoes({ dataInicio: inicioMesStr, limit: 100 }),
          listarPrescricoes({ limit: 8 }),
        ]);

      const porSetor = {};
      respostaMes.prescricoes?.forEach((p) => {
        const setor = p.nucleo || "Sem setor";
        porSetor[setor] = (porSetor[setor] || 0) + 1;
      });

      const porDieta = {};
      respostaMes.prescricoes?.forEach((p) => {
        const dieta = p.dieta || "Sem dieta";
        porDieta[dieta] = (porDieta[dieta] || 0) + 1;
      });

      const porRefeicao = {};
      respostaMes.prescricoes?.forEach((p) => {
        const refeicao = p.tipo_alimentacao || "Outro";
        porRefeicao[refeicao] = (porRefeicao[refeicao] || 0) + 1;
      });

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
    if (!dataString) return "-";
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "-";
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const formatarHora = (dataString) => {
    if (!dataString) return "-";
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "-";
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const getGreeting = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getPrimeiroNome = (nomeCompleto) => nomeCompleto.split(" ")[0];

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
      <div className="dash-page">
        <div className="dash-loading">
          <div className="dash-spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  const variacao = calcularVariacao(estatisticas.totalHoje, estatisticas.totalOntem);

  return (
    <div className="dash-page">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-greeting">
          <h1>
            {getGreeting()}, {getPrimeiroNome(usuario.nome)}
          </h1>
          <p>
            {usuario.role === "admin" ? "Administrador" : "Nutricionista"} · SalusVita Tech
          </p>
        </div>
        <div className="dash-header-right">
          <button
            className="dash-btn-refresh"
            onClick={carregarEstatisticas}
            title="Atualizar dados"
          >
            {Icons.refresh}
          </button>
          <div className="dash-date">
            <span className="dash-date-icon">{Icons.calendar}</span>
            <span>
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Stats Principais */}
      <section className="dash-stats">
        <div className="dash-stat-card">
          <div className="dash-stat-icon today">{Icons.calendar}</div>
          <div className="dash-stat-info">
            <span className="dash-stat-label">Hoje</span>
            <span className="dash-stat-value">{estatisticas.totalHoje}</span>
            <span className="dash-stat-desc">prescrições</span>
          </div>
          {variacao !== 0 && (
            <div className={`dash-stat-badge ${variacao >= 0 ? "up" : "down"}`}>
              {variacao >= 0 ? Icons.trendingUp : Icons.trendingDown}
              <span>{variacao > 0 ? `+${variacao}%` : `${variacao}%`}</span>
            </div>
          )}
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon week">{Icons.barChart}</div>
          <div className="dash-stat-info">
            <span className="dash-stat-label">Esta semana</span>
            <span className="dash-stat-value">{estatisticas.totalSemana}</span>
            <span className="dash-stat-desc">prescrições</span>
          </div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-icon month">{Icons.clipboard}</div>
          <div className="dash-stat-info">
            <span className="dash-stat-label">Este mês</span>
            <span className="dash-stat-value">{estatisticas.totalMes}</span>
            <span className="dash-stat-desc">prescrições</span>
          </div>
        </div>
      </section>

      {/* Mini Stats */}
      <section className="dash-mini-stats">
        <div className="dash-mini-card">
          <div className="dash-mini-icon">{Icons.users}</div>
          <div className="dash-mini-info">
            <span className="dash-mini-value">{estatisticas.pacientesUnicos}</span>
            <span className="dash-mini-label">Pacientes hoje</span>
          </div>
        </div>
        <div className="dash-mini-card">
          <div className="dash-mini-icon">{Icons.layers}</div>
          <div className="dash-mini-info">
            <span className="dash-mini-value">{estatisticas.setoresAtivos}</span>
            <span className="dash-mini-label">Setores ativos</span>
          </div>
        </div>
        <div className="dash-mini-card">
          <div className="dash-mini-icon">{Icons.average}</div>
          <div className="dash-mini-info">
            <span className="dash-mini-value">{mediaDiaria()}</span>
            <span className="dash-mini-label">Média diária</span>
          </div>
        </div>
      </section>

      {/* Ações Rápidas */}
      <section className="dash-actions">
        <button className="dash-action-card" onClick={irParaPrescricoes}>
          <div className="dash-action-icon">{Icons.clipboard}</div>
          <div className="dash-action-content">
            <h3>Prescrições</h3>
            <p>Visualizar e gerenciar todas as prescrições</p>
          </div>
          <div className="dash-action-arrow">{Icons.arrowRight}</div>
        </button>

        <button className="dash-action-card primary" onClick={irParaNovaPrescricao}>
          <div className="dash-action-icon">{Icons.plus}</div>
          <div className="dash-action-content">
            <h3>Nova Prescrição</h3>
            <p>Criar nova prescrição de alimentação</p>
          </div>
          <div className="dash-action-arrow">{Icons.arrowRight}</div>
        </button>
      </section>

      {/* Gráficos */}
      <section className="dash-data-grid">
        {/* Por Setor */}
        <div className="dash-data-card">
          <div className="dash-data-header">
            <div className="dash-data-icon">{Icons.building}</div>
            <h3>Por Setor</h3>
            <span className="dash-data-period">Este mês</span>
          </div>
          {Object.entries(estatisticas.porSetor).length === 0 ? (
            <div className="dash-chart-empty">Nenhum dado disponível</div>
          ) : (
            <div className="dash-bar-chart">
              {Object.entries(estatisticas.porSetor)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([setor, quantidade]) => {
                  const maxValue = Math.max(...Object.values(estatisticas.porSetor));
                  const percentage = (quantidade / maxValue) * 100;
                  const percentTotal =
                    estatisticas.totalMes > 0
                      ? Math.round((quantidade / estatisticas.totalMes) * 100)
                      : 0;
                  return (
                    <div key={setor} className="dash-bar-item">
                      <div className="dash-bar-header">
                        <span className="dash-bar-label">{setor}</span>
                        <div className="dash-bar-stats">
                          <span className="dash-bar-count">{quantidade}</span>
                          <span className="dash-bar-percent">{percentTotal}%</span>
                        </div>
                      </div>
                      <div className="dash-bar-track">
                        <div
                          className="dash-bar-fill primary"
                          style={{ "--width": `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Por Dieta */}
        <div className="dash-data-card">
          <div className="dash-data-header">
            <div className="dash-data-icon">{Icons.utensils}</div>
            <h3>Por Dieta</h3>
            <span className="dash-data-period">Este mês</span>
          </div>
          {Object.entries(estatisticas.porDieta).length === 0 ? (
            <div className="dash-chart-empty">Nenhum dado disponível</div>
          ) : (
            <div className="dash-bar-chart">
              {Object.entries(estatisticas.porDieta)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([dieta, quantidade]) => {
                  const maxValue = Math.max(...Object.values(estatisticas.porDieta));
                  const percentage = (quantidade / maxValue) * 100;
                  const percentTotal =
                    estatisticas.totalMes > 0
                      ? Math.round((quantidade / estatisticas.totalMes) * 100)
                      : 0;
                  return (
                    <div key={dieta} className="dash-bar-item">
                      <div className="dash-bar-header">
                        <span className="dash-bar-label">{dieta}</span>
                        <div className="dash-bar-stats">
                          <span className="dash-bar-count">{quantidade}</span>
                          <span className="dash-bar-percent">{percentTotal}%</span>
                        </div>
                      </div>
                      <div className="dash-bar-track">
                        <div
                          className="dash-bar-fill secondary"
                          style={{ "--width": `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Por Refeição */}
        <div className="dash-data-card">
          <div className="dash-data-header">
            <div className="dash-data-icon accent">{Icons.clock}</div>
            <h3>Por Refeição</h3>
            <span className="dash-data-period">Este mês</span>
          </div>
          {Object.entries(estatisticas.porRefeicao).length === 0 ? (
            <div className="dash-chart-empty">Nenhum dado disponível</div>
          ) : (
            <div className="dash-refeicao-grid">
              {Object.entries(estatisticas.porRefeicao)
                .sort((a, b) => b[1] - a[1])
                .map(([refeicao, quantidade]) => {
                  const percentTotal =
                    estatisticas.totalMes > 0
                      ? Math.round((quantidade / estatisticas.totalMes) * 100)
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
                    <div key={refeicao} className="dash-refeicao-item">
                      <span className="dash-refeicao-emoji">
                        {emojiMap[refeicao] || "🍴"}
                      </span>
                      <div className="dash-refeicao-info">
                        <span className="dash-refeicao-nome">{refeicao}</span>
                        <span className="dash-refeicao-count">{quantidade}</span>
                      </div>
                      <div className="dash-refeicao-bar">
                        <div
                          className="dash-refeicao-bar-fill"
                          style={{ "--width": `${percentTotal}%` }}
                        />
                      </div>
                      <span className="dash-refeicao-pct">{percentTotal}%</span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Atividade Recente */}
        <div className="dash-data-card">
          <div className="dash-data-header">
            <div className="dash-data-icon">{Icons.clock}</div>
            <h3>Atividade Recente</h3>
            <button className="dash-view-all" onClick={irParaPrescricoes}>
              Ver todas {Icons.arrowRight}
            </button>
          </div>
          {estatisticas.ultimasPrescricoes.length === 0 ? (
            <div className="dash-recent-empty">Nenhuma prescrição recente</div>
          ) : (
            <div className="dash-recent-list">
              {estatisticas.ultimasPrescricoes.map((p, index) => (
                <div key={p.id || index} className="dash-recent-item">
                  <div className="dash-recent-avatar">
                    {(p.nome_paciente || "?")[0].toUpperCase()}
                  </div>
                  <div className="dash-recent-info">
                    <div className="dash-recent-name">
                      {p.nome_paciente || "Sem nome"}
                    </div>
                    <div className="dash-recent-detail">
                      {p.tipo_alimentacao || "-"} · {p.dieta || "-"} · Leito{" "}
                      {p.leito || "-"}
                    </div>
                  </div>
                  <div className="dash-recent-meta">
                    <span className="dash-recent-date">
                      {formatarData(p.data_prescricao)}
                    </span>
                    <span className="dash-recent-time">
                      {formatarHora(p.criado_em || p.data_prescricao)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info */}
      <section className="dash-info-card">
        <div className="dash-info-header">
          <div className="dash-data-icon">{Icons.info}</div>
          <h3>Informações do Sistema</h3>
          {atualizadoEm && (
            <span className="dash-info-updated">
              Atualizado{" "}
              {atualizadoEm.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <ul className="dash-info-list">
          <li>
            <span className="dash-info-check">{Icons.check}</span>
            Prescrições podem ser editadas até 9h do dia seguinte
          </li>
          <li>
            <span className="dash-info-check">{Icons.check}</span>
            Etiquetas são impressas pela tela de prescrições
          </li>
          <li>
            <span className="dash-info-check">{Icons.check}</span>
            Use os filtros para encontrar prescrições rapidamente
          </li>
          <li>
            <span className="dash-info-check">{Icons.check}</span>
            Verifique diariamente as prescrições pendentes
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;