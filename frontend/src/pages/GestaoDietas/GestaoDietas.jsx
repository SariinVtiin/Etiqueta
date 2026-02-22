import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  listarDietas,
  criarDieta,
  atualizarDieta,
  toggleDietaAtiva,
} from "../../services/api";
import "./GestaoDietas.css";

function GestaoDietas() {
  const navigate = useNavigate();
  const { refreshSystemData } = useOutletContext() || {};

  const [dietas, setDietas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [modalAberto, setModalAberto] = useState(null);
  const [dietaSelecionada, setDietaSelecionada] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    codigo: "",
    descricao: "",
  });

  useEffect(() => {
    carregarDietas();
  }, []);

  const carregarDietas = async () => {
    try {
      setCarregando(true);
      const resposta = await listarDietas();
      if (resposta.sucesso) {
        setDietas(resposta.dietas);
      }
    } catch (erro) {
      console.error("Erro ao carregar dietas:", erro);
      alert("Erro ao carregar dietas: " + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  const dietasFiltradas = dietas.filter((dieta) => {
    const passaBusca =
      busca === "" ||
      dieta.nome.toLowerCase().includes(busca.toLowerCase()) ||
      dieta.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      (dieta.descricao &&
        dieta.descricao.toLowerCase().includes(busca.toLowerCase()));

    const passaStatus =
      filtroAtivo === "todos" ||
      (filtroAtivo === "ativos" && dieta.ativa) ||
      (filtroAtivo === "inativos" && !dieta.ativa);

    return passaBusca && passaStatus;
  });

  const abrirModalCriar = () => {
    setFormData({ nome: "", codigo: "", descricao: "" });
    setModalAberto("criar");
  };

  const abrirModalEditar = (dieta) => {
    setDietaSelecionada(dieta);
    setFormData({
      nome: dieta.nome,
      codigo: dieta.codigo,
      descricao: dieta.descricao || "",
    });
    setModalAberto("editar");
  };

  const fecharModal = () => {
    setModalAberto(null);
    setDietaSelecionada(null);
    setFormData({ nome: "", codigo: "", descricao: "" });
  };

  const handleCriarDieta = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.codigo) {
      alert("Nome e código são obrigatórios!");
      return;
    }
    try {
      const resposta = await criarDieta(formData);
      if (resposta.sucesso) {
        alert(resposta.mensagem);
        fecharModal();
        carregarDietas();
      }
    } catch (erro) {
      alert("Erro ao criar dieta: " + erro.message);
    }
  };

  const handleEditarDieta = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.codigo) {
      alert("Nome e código são obrigatórios!");
      return;
    }
    try {
      const resposta = await atualizarDieta(dietaSelecionada.id, formData);
      if (resposta.sucesso) {
        alert(resposta.mensagem);
        fecharModal();
        carregarDietas();
      }
    } catch (erro) {
      alert("Erro ao editar dieta: " + erro.message);
    }
  };

  const handleToggleAtivo = async (dieta) => {
    const acao = dieta.ativa ? "desativar" : "ativar";
    if (
      !window.confirm(`Tem certeza que deseja ${acao} a dieta "${dieta.nome}"?`)
    ) {
      return;
    }
    try {
      const resposta = await toggleDietaAtiva(dieta.id, !dieta.ativa);
      if (resposta.sucesso) {
        alert(resposta.mensagem);
        carregarDietas();
      }
    } catch (erro) {
      alert(`Erro ao ${acao} dieta: ` + erro.message);
    }
  };

  const stats = {
    total: dietas.length,
    ativas: dietas.filter((d) => d.ativa).length,
    inativas: dietas.filter((d) => !d.ativa).length,
  };

  return (
    <div className="gd-page">
      {/* Header */}
      <header className="gd-header">
        <div className="gd-header-left">
          <button
            className="gd-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="gd-header-icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div className="gd-header-text">
            <h1>Gestão de Dietas</h1>
            <p>Gerencie os tipos de dietas do sistema</p>
          </div>
        </div>
        <button className="gd-btn-novo" onClick={abrirModalCriar}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nova Dieta
        </button>
      </header>

      {/* Stats */}
      <div className="gd-stats">
        <div className="gd-stat-card">
          <div className="gd-stat-icon gd-stat-total">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            </svg>
          </div>
          <div className="gd-stat-info">
            <span className="gd-stat-value">{stats.total}</span>
            <span className="gd-stat-label">Total</span>
          </div>
        </div>
        <div className="gd-stat-card">
          <div className="gd-stat-icon gd-stat-ativas">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="gd-stat-info">
            <span className="gd-stat-value">{stats.ativas}</span>
            <span className="gd-stat-label">Ativas</span>
          </div>
        </div>
        <div className="gd-stat-card">
          <div className="gd-stat-icon gd-stat-inativas">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          </div>
          <div className="gd-stat-info">
            <span className="gd-stat-value">{stats.inativas}</span>
            <span className="gd-stat-label">Inativas</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="gd-toolbar">
        <div className="gd-search">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome, código ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="gd-filters">
          <button
            className={`gd-filter-btn ${filtroAtivo === "todos" ? "active" : ""}`}
            onClick={() => setFiltroAtivo("todos")}
          >
            Todos
          </button>
          <button
            className={`gd-filter-btn ${filtroAtivo === "ativos" ? "active" : ""}`}
            onClick={() => setFiltroAtivo("ativos")}
          >
            Ativos
          </button>
          <button
            className={`gd-filter-btn ${filtroAtivo === "inativos" ? "active" : ""}`}
            onClick={() => setFiltroAtivo("inativos")}
          >
            Inativos
          </button>
        </div>
      </div>

      {/* Content */}
      {carregando ? (
        <div className="gd-loading">
          <div className="gd-spinner"></div>
          <p>Carregando dietas...</p>
        </div>
      ) : dietasFiltradas.length === 0 ? (
        <div className="gd-empty">
          <div className="gd-empty-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <h3>Nenhuma dieta encontrada</h3>
          <p>
            {busca || filtroAtivo !== "todos"
              ? "Tente ajustar os filtros de busca."
              : "Crie a primeira dieta clicando no botão acima."}
          </p>
        </div>
      ) : (
        <div className="gd-grid">
          {dietasFiltradas.map((dieta) => (
            <div
              key={dieta.id}
              className={`gd-card ${!dieta.ativa ? "gd-card-inactive" : ""}`}
            >
              <div className="gd-card-header">
                <div className="gd-card-icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  </svg>
                </div>
                <span
                  className={`gd-badge-status ${dieta.ativa ? "gd-status-ativo" : "gd-status-inativo"}`}
                >
                  {dieta.ativa ? "Ativa" : "Inativa"}
                </span>
              </div>

              <div className="gd-card-body">
                <h3 className="gd-card-title">{dieta.nome}</h3>
                <span className="gd-card-code">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  {dieta.codigo}
                </span>
                {dieta.descricao && (
                  <p className="gd-card-description">{dieta.descricao}</p>
                )}
              </div>

              <div className="gd-card-actions">
                <button
                  className="gd-action-btn gd-action-edit"
                  onClick={() => abrirModalEditar(dieta)}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Editar
                </button>
                {dieta.ativa ? (
                  <button
                    className="gd-action-btn gd-action-disable"
                    onClick={() => handleToggleAtivo(dieta)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                    Desativar
                  </button>
                ) : (
                  <button
                    className="gd-action-btn gd-action-enable"
                    onClick={() => handleToggleAtivo(dieta)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Ativar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Criar */}
      {modalAberto === "criar" && (
        <div className="gd-modal-overlay" onClick={fecharModal}>
          <div className="gd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gd-modal-header">
              <div className="gd-modal-icon gd-modal-icon-create">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                  <line x1="12" y1="5" x2="12" y2="1" />
                </svg>
              </div>
              <h2>Nova Dieta</h2>
              <button className="gd-modal-close" onClick={fecharModal}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCriarDieta}>
              <div className="gd-form-row">
                <div className="gd-form-group gd-form-flex">
                  <label>Nome da Dieta *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Ex: Dieta Geral"
                  />
                </div>
                <div className="gd-form-group gd-form-code">
                  <label>Código *</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        codigo: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="Ex: DG"
                    maxLength="20"
                  />
                </div>
              </div>
              <div className="gd-form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descrição detalhada da dieta (opcional)"
                  rows="3"
                />
              </div>
              <div className="gd-modal-actions">
                <button
                  type="button"
                  className="gd-btn-cancel"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="gd-btn-confirm">
                  Criar Dieta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalAberto === "editar" && (
        <div className="gd-modal-overlay" onClick={fecharModal}>
          <div className="gd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gd-modal-header">
              <div className="gd-modal-icon gd-modal-icon-edit">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h2>Editar Dieta</h2>
              <button className="gd-modal-close" onClick={fecharModal}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditarDieta}>
              <div className="gd-form-row">
                <div className="gd-form-group gd-form-flex">
                  <label>Nome da Dieta *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                  />
                </div>
                <div className="gd-form-group gd-form-code">
                  <label>Código *</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        codigo: e.target.value.toUpperCase(),
                      })
                    }
                    maxLength="20"
                  />
                </div>
              </div>
              <div className="gd-form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descrição detalhada da dieta (opcional)"
                  rows="3"
                />
              </div>
              <div className="gd-modal-actions">
                <button
                  type="button"
                  className="gd-btn-cancel"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="gd-btn-confirm">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoDietas;
