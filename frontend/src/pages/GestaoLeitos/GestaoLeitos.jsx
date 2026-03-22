// frontend/src/pages/GestaoLeitos/GestaoLeitos.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  listarLeitosCompleto,
  criarLeito,
  criarLeitosLote,
  atualizarLeito,
  toggleLeitoAtivo,
} from "../../services/api";
import "./GestaoLeitos.css";

import ModalAlerta from "../../components/common/ModalAlerta/ModalAlerta";
import useModalAlerta from "../../hooks/useModalAlerta";

function GestaoLeitos() {
  const navigate = useNavigate();
  const { refreshSystemData } = useOutletContext() || {};

  const [leitos, setLeitos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalLote, setMostrarModalLote] = useState(false);
  const [leitoEditando, setLeitoEditando] = useState(null);
  const [filtro, setFiltro] = useState("ativos"); // 'ativos' ou 'todos'
  const [filtroSetor, setFiltroSetor] = useState(""); // filtro por setor
  const [busca, setBusca] = useState("");

  const [formData, setFormData] = useState({
    numero: "",
    setor: "",
    andar: "",
  });

  const [formLote, setFormLote] = useState({
    setor: "",
    andar: "",
    numeroInicio: "",
    numeroFim: "",
  });
  const {
    modal,
    fecharModal: fecharModalAlerta,
    mostrarAlerta,
    mostrarConfirmacao,
  } = useModalAlerta();
  // ============================================
  // CARREGAR DADOS
  // ============================================
  const carregarLeitos = useCallback(async () => {
    setCarregando(true);
    try {
      const resposta = await listarLeitosCompleto(filtro === "todos");
      setLeitos(resposta.leitos || []);
    } catch (erro) {
      console.error("Erro ao carregar leitos:", erro);
      mostrarAlerta({
        titulo: "Erro ao carregar dados",
        mensagem: "Erro ao carregar leitos",
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  }, [filtro, mostrarAlerta]);

  useEffect(() => {
    carregarLeitos();
  }, [carregarLeitos]);

  // ============================================
  // SETORES ÚNICOS (extraídos dos leitos carregados)
  // ============================================
  const setoresUnicos = [...new Set(leitos.map((l) => l.setor))].sort();

  // ============================================
  // FILTROS
  // ============================================
  const leitosFiltrados = leitos.filter((leito) => {
    const passaSetor = !filtroSetor || leito.setor === filtroSetor;
    const passaBusca =
      !busca ||
      leito.numero.toLowerCase().includes(busca.toLowerCase()) ||
      leito.setor.toLowerCase().includes(busca.toLowerCase());
    return passaSetor && passaBusca;
  });

  // Agrupar por setor
  const leitosPorSetor = {};
  leitosFiltrados.forEach((leito) => {
    if (!leitosPorSetor[leito.setor]) {
      leitosPorSetor[leito.setor] = [];
    }
    leitosPorSetor[leito.setor].push(leito);
  });

  // Ordenar leitos dentro de cada setor naturalmente
  Object.keys(leitosPorSetor).forEach((setor) => {
    leitosPorSetor[setor].sort((a, b) => {
      const numA = parseInt(a.numero) || 0;
      const numB = parseInt(b.numero) || 0;
      return numA - numB || a.numero.localeCompare(b.numero);
    });
  });

  // ============================================
  // MODAIS
  // ============================================
  const abrirModalNovo = () => {
    setLeitoEditando(null);
    setFormData({ numero: "", setor: "", andar: "" });
    setMostrarModal(true);
  };

  const abrirModalEditar = (leito) => {
    setLeitoEditando(leito);
    setFormData({
      numero: leito.numero,
      setor: leito.setor,
      andar: leito.andar || "",
    });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setLeitoEditando(null);
    setFormData({ numero: "", setor: "", andar: "" });
  };

  const abrirModalLote = () => {
    setFormLote({ setor: "", andar: "", numeroInicio: "", numeroFim: "" });
    setMostrarModalLote(true);
  };

  const fecharModalLote = () => {
    setMostrarModalLote(false);
    setFormLote({ setor: "", andar: "", numeroInicio: "", numeroFim: "" });
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.numero.trim() || !formData.setor.trim()) {
      mostrarAlerta({
        titulo: "Campo obrigatório",
        mensagem: "Número e setor são obrigatórios!",
        tipo: "erro",
      });
      return;
    }

    try {
      if (leitoEditando) {
        await atualizarLeito(leitoEditando.id, formData);
        mostrarAlerta({
          titulo: "Sucesso",
          mensagem: "Leito atualizado com sucesso!",
          tipo: "sucesso",
        });
      } else {
        await criarLeito(formData);
        mostrarAlerta({
          titulo: "Sucesso",
          mensagem: "Leito criado com sucesso!",
          tipo: "sucesso",
        });
      }

      fecharModal();
      carregarLeitos();
      refreshSystemData && refreshSystemData();
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      mostrarAlerta({
        titulo: "Erro ao salvar",
        mensagem: erro.message || "Erro ao salvar leito",
        tipo: "erro",
      });
    }
  };

  const handleSubmitLote = (e) => {
    e.preventDefault();

    if (
      !formLote.setor.trim() ||
      !formLote.numeroInicio ||
      !formLote.numeroFim
    ) {
      mostrarAlerta({
        titulo: "Campo obrigatório",
        mensagem: "Setor, número inicial e número final são obrigatórios!",
        tipo: "erro",
      });
      return;
    }

    const inicio = parseInt(formLote.numeroInicio);
    const fim = parseInt(formLote.numeroFim);

    if (inicio > fim) {
      mostrarAlerta({
        titulo: "Intervalo inválido",
        mensagem: "Número inicial deve ser menor ou igual ao final!",
        tipo: "erro",
      });
      return;
    }

    const quantidade = fim - inicio + 1;

    mostrarConfirmacao({
      titulo: "Criar leitos em lote",
      mensagem: `Criar ${quantidade} leito(s) no setor "${formLote.setor.toUpperCase()}"?\n\nLeitos ${inicio} a ${fim}`,
      tipo: "confirmar",
      textoBotaoConfirmar: "Criar",
      textoBotaoCancelar: "Cancelar",
      onConfirmar: async () => {
        try {
          const resposta = await criarLeitosLote(formLote);
          fecharModalLote();
          carregarLeitos();
          refreshSystemData && refreshSystemData();

          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: resposta.mensagem || "Leitos criados com sucesso!",
            tipo: "sucesso",
          });
        } catch (erro) {
          console.error("Erro ao criar lote:", erro);
          mostrarAlerta({
            titulo: "Erro ao criar lote",
            mensagem: erro.message || "Erro ao criar leitos em lote",
            tipo: "erro",
          });
        }
      },
    });
  };

  const handleToggleAtivo = (leito) => {
    const novoStatus = !leito.ativo;

    mostrarConfirmacao({
      titulo: novoStatus ? "Ativar leito" : "Desativar leito",
      mensagem: `Deseja realmente ${novoStatus ? "ativar" : "desativar"} o leito ${leito.numero} (${leito.setor})?`,
      tipo: novoStatus ? "confirmar" : "perigo",
      textoBotaoConfirmar: novoStatus ? "Ativar" : "Desativar",
      textoBotaoCancelar: "Cancelar",
      onConfirmar: async () => {
        try {
          await toggleLeitoAtivo(leito.id, novoStatus);
          carregarLeitos();
          refreshSystemData && refreshSystemData();

          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: `Leito ${novoStatus ? "ativado" : "desativado"} com sucesso!`,
            tipo: "sucesso",
          });
        } catch (erro) {
          console.error("Erro ao alterar status:", erro);
          mostrarAlerta({
            titulo: "Erro ao alterar status",
            mensagem: erro.message || "Erro ao alterar status",
            tipo: "erro",
          });
        }
      },
    });
  };

  // ============================================
  // RENDER
  // ============================================
  if (carregando) {
    return (
      <div className="gl-header">
        <div className="gl-header-left">
          <button
            className="gl-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            ← Voltar
          </button>
          <div className="gl-header-text">
            <h1>🏥 Setores e Leitos</h1>
            <p className="gl-subtitulo">
              Gerenciar setores hospitalares e leitos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gl-container">
      {/* Header */}
      <div className="gl-header">
        <div className="gl-header-left">
          <button
            className="gl-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            ← Voltar
          </button>
          <div className="gl-header-text">
            <h1>🏥 Setores e Leitos</h1>
            <p className="gl-subtitulo">
              Gerenciar setores hospitalares e leitos
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Ações */}
      <div className="gl-acoes">
        <div className="gl-acoes-esquerda">
          <button className="gl-btn-novo" onClick={abrirModalNovo}>
            + Novo Leito
          </button>
          <button className="gl-btn-lote" onClick={abrirModalLote}>
            ++ Criar em Lote
          </button>
        </div>

        <div className="gl-acoes-direita">
          <input
            type="text"
            className="gl-busca"
            placeholder="🔍 Buscar leito ou setor..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <select
            className="gl-select-setor"
            value={filtroSetor}
            onChange={(e) => setFiltroSetor(e.target.value)}
          >
            <option value="">Todos os setores</option>
            {setoresUnicos.map((setor) => (
              <option key={setor} value={setor}>
                {setor}
              </option>
            ))}
          </select>

          <div className="gl-filtros">
            <label>
              <input
                type="radio"
                value="ativos"
                checked={filtro === "ativos"}
                onChange={(e) => setFiltro(e.target.value)}
              />
              Ativos
            </label>
            <label>
              <input
                type="radio"
                value="todos"
                checked={filtro === "todos"}
                onChange={(e) => setFiltro(e.target.value)}
              />
              Todos
            </label>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="gl-resumo">
        <div className="gl-resumo-item">
          <span className="gl-resumo-valor">{leitosFiltrados.length}</span>
          <span className="gl-resumo-label">Leitos exibidos</span>
        </div>
        <div className="gl-resumo-item">
          <span className="gl-resumo-valor">
            {Object.keys(leitosPorSetor).length}
          </span>
          <span className="gl-resumo-label">Setores</span>
        </div>
        <div className="gl-resumo-item">
          <span className="gl-resumo-valor">
            {leitos.filter((l) => l.ativo).length}
          </span>
          <span className="gl-resumo-label">Total ativos</span>
        </div>
      </div>

      {/* Lista por Setor */}
      {Object.keys(leitosPorSetor).length === 0 ? (
        <div className="gl-vazio">
          <p>📭 Nenhum leito encontrado</p>
          <button className="gl-btn-novo" onClick={abrirModalNovo}>
            + Cadastrar Primeiro Leito
          </button>
        </div>
      ) : (
        <div className="gl-setores-lista">
          {Object.entries(leitosPorSetor)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([setor, leitosSetor]) => (
              <div key={setor} className="gl-setor-card">
                <div className="gl-setor-header">
                  <div className="gl-setor-info">
                    <h3>{setor}</h3>
                    <span className="gl-setor-count">
                      {leitosSetor.length} leito(s)
                    </span>
                    {leitosSetor[0]?.andar && (
                      <span className="gl-setor-andar">
                        Andar {leitosSetor[0].andar}
                      </span>
                    )}
                  </div>
                </div>
                <div className="gl-leitos-grid">
                  {leitosSetor.map((leito) => (
                    <div
                      key={leito.id}
                      className={`gl-leito-chip ${!leito.ativo ? "gl-inativo" : ""}`}
                    >
                      <span className="gl-leito-numero">{leito.numero}</span>
                      <div className="gl-leito-acoes">
                        <button
                          className="gl-chip-btn gl-chip-editar"
                          onClick={() => abrirModalEditar(leito)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="gl-chip-btn gl-chip-toggle"
                          onClick={() => handleToggleAtivo(leito)}
                          title={leito.ativo ? "Desativar" : "Ativar"}
                        >
                          {leito.ativo ? "🔴" : "🟢"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL - Criar/Editar Leito Individual */}
      {/* ============================================ */}
      {mostrarModal && (
        <div className="gl-modal-overlay" onClick={fecharModal}>
          <div className="gl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gl-modal-header">
              <h2>{leitoEditando ? "✏️ Editar Leito" : "➕ Novo Leito"}</h2>
              <button className="gl-modal-fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="gl-modal-form">
              <div className="gl-campo">
                <label>Número do Leito *</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) =>
                    setFormData({ ...formData, numero: e.target.value })
                  }
                  placeholder="Ex: 601, 501A..."
                  maxLength={20}
                  required
                  autoFocus
                />
              </div>

              <div className="gl-campo">
                <label>Setor *</label>
                <input
                  type="text"
                  value={formData.setor}
                  onChange={(e) =>
                    setFormData({ ...formData, setor: e.target.value })
                  }
                  placeholder="Ex: INTERNAÇÃO, UTI ADULTO..."
                  list="setores-existentes"
                  required
                />
                <datalist id="setores-existentes">
                  {setoresUnicos.map((setor) => (
                    <option key={setor} value={setor} />
                  ))}
                </datalist>
                <small>
                  Digite para selecionar um setor existente ou criar novo
                </small>
              </div>

              <div className="gl-campo">
                <label>Andar (opcional)</label>
                <input
                  type="number"
                  value={formData.andar}
                  onChange={(e) =>
                    setFormData({ ...formData, andar: e.target.value })
                  }
                  placeholder="Ex: 1, 2, 3..."
                  min={0}
                  max={20}
                />
              </div>

              <div className="gl-modal-acoes">
                <button
                  type="button"
                  className="gl-btn-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="gl-btn-salvar">
                  {leitoEditando ? "Salvar Alterações" : "Criar Leito"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL - Criar Leitos em Lote */}
      {/* ============================================ */}
      {mostrarModalLote && (
        <div className="gl-modal-overlay" onClick={fecharModalLote}>
          <div className="gl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gl-modal-header">
              <h2>📦 Criar Leitos em Lote</h2>
              <button className="gl-modal-fechar" onClick={fecharModalLote}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitLote} className="gl-modal-form">
              <div className="gl-campo">
                <label>Setor *</label>
                <input
                  type="text"
                  value={formLote.setor}
                  onChange={(e) =>
                    setFormLote({ ...formLote, setor: e.target.value })
                  }
                  placeholder="Ex: INTERNAÇÃO, UTI ADULTO..."
                  list="setores-existentes-lote"
                  required
                  autoFocus
                />
                <datalist id="setores-existentes-lote">
                  {setoresUnicos.map((setor) => (
                    <option key={setor} value={setor} />
                  ))}
                </datalist>
              </div>

              <div className="gl-campo">
                <label>Andar (opcional)</label>
                <input
                  type="number"
                  value={formLote.andar}
                  onChange={(e) =>
                    setFormLote({ ...formLote, andar: e.target.value })
                  }
                  placeholder="Ex: 5"
                  min={0}
                  max={20}
                />
              </div>

              <div className="gl-campo-duplo">
                <div className="gl-campo">
                  <label>Número Inicial *</label>
                  <input
                    type="number"
                    value={formLote.numeroInicio}
                    onChange={(e) =>
                      setFormLote({ ...formLote, numeroInicio: e.target.value })
                    }
                    placeholder="Ex: 601"
                    required
                  />
                </div>
                <div className="gl-campo">
                  <label>Número Final *</label>
                  <input
                    type="number"
                    value={formLote.numeroFim}
                    onChange={(e) =>
                      setFormLote({ ...formLote, numeroFim: e.target.value })
                    }
                    placeholder="Ex: 661"
                    required
                  />
                </div>
              </div>

              {formLote.numeroInicio && formLote.numeroFim && (
                <div className="gl-lote-preview">
                  {parseInt(formLote.numeroFim) >=
                  parseInt(formLote.numeroInicio) ? (
                    <span>
                      Serão criados{" "}
                      <strong>
                        {parseInt(formLote.numeroFim) -
                          parseInt(formLote.numeroInicio) +
                          1}
                      </strong>{" "}
                      leitos ({formLote.numeroInicio} a {formLote.numeroFim})
                    </span>
                  ) : (
                    <span className="gl-lote-erro">
                      Número final deve ser maior que o inicial
                    </span>
                  )}
                </div>
              )}

              <div className="gl-modal-acoes">
                <button
                  type="button"
                  className="gl-btn-cancelar"
                  onClick={fecharModalLote}
                >
                  Cancelar
                </button>
                <button type="submit" className="gl-btn-salvar">
                  Criar Leitos em Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default GestaoLeitos;
