import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarSubstituicoesPrincipal,
  criarCategoriaSubstituicao,
  atualizarCategoriaSubstituicao,
  toggleCategoriaSubstituicao,
  criarItemSubstituicao,
  atualizarItemSubstituicao,
  toggleItemSubstituicao,
} from "../../services/api";
import "./GestaoSubstituicaoPrincipal.css";

import ModalAlerta from "../../components/common/ModalAlerta/ModalAlerta";
import useModalAlerta from "../../hooks/useModalAlerta";

function GestaoSubstituicaoPrincipal() {
  const navigate = useNavigate();

  // Estado principal
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  // Estado do modal
  const [modalAberto, setModalAberto] = useState(null); // 'criarCategoria' | 'editarCategoria' | 'criarItem' | 'editarItem'
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  // Estado do expandir/colapsar categorias
  const [categoriasExpandidas, setCategoriasExpandidas] = useState({});

  // Form data
  const [formCategoria, setFormCategoria] = useState({ nome: "", ordem: "" });
  const [formItem, setFormItem] = useState({
    categoria_id: "",
    nome: "",
    ordem: "",
  });

  const {
    modal,
    fecharModal: fecharModalAlerta,
    mostrarAlerta,
    mostrarConfirmacao,
  } = useModalAlerta();

  // ====================================
  // CARREGAR DADOS
  // ====================================

  const carregarDados = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await listarSubstituicoesPrincipal(true);
      if (resposta.sucesso) {
        const cats = resposta.categorias.map((c) => ({
          ...c,
          ativa: !!c.ativa,
          itens: (c.itens || []).map((i) => ({ ...i, ativo: !!i.ativo })),
        }));
        setCategorias(cats);

        const expandidas = {};
        cats.forEach((c) => {
          expandidas[c.id] = true;
        });
        setCategoriasExpandidas(expandidas);
      }
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
      mostrarAlerta({
        titulo: "Erro ao carregar dados",
        mensagem: "Erro ao carregar dados: " + erro.message,
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  }, [mostrarAlerta]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);
  // ====================================
  // FILTROS
  // ====================================
  const categoriasFiltradas = categorias.filter((cat) => {
    const passaStatus =
      filtroAtivo === "todos" ||
      (filtroAtivo === "ativos" && cat.ativa) ||
      (filtroAtivo === "inativos" && !cat.ativa);

    if (!passaStatus) return false;

    if (busca === "") return true;

    const buscaLower = busca.toLowerCase();
    const catMatch = cat.nome.toLowerCase().includes(buscaLower);
    const itemMatch = (cat.itens || []).some((item) =>
      `${cat.nome} ${item.nome}`.toLowerCase().includes(buscaLower),
    );

    return catMatch || itemMatch;
  });

  // ====================================
  // TOGGLE EXPANDIR/COLAPSAR
  // ====================================
  const toggleExpandir = (catId) => {
    setCategoriasExpandidas((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const expandirTodas = () => {
    const expandidas = {};
    categorias.forEach((c) => {
      expandidas[c.id] = true;
    });
    setCategoriasExpandidas(expandidas);
  };

  const colapsarTodas = () => {
    setCategoriasExpandidas({});
  };

  // ====================================
  // MODAIS
  // ====================================
  const abrirModalCriarCategoria = () => {
    setFormCategoria({ nome: "", ordem: "" });
    setModalAberto("criarCategoria");
  };

  const abrirModalEditarCategoria = (cat) => {
    setCategoriaSelecionada(cat);
    setFormCategoria({ nome: cat.nome, ordem: cat.ordem || "" });
    setModalAberto("editarCategoria");
  };

  const abrirModalCriarItem = (cat) => {
    setCategoriaSelecionada(cat);
    setFormItem({ categoria_id: cat.id, nome: "", ordem: "" });
    setModalAberto("criarItem");
  };

  const abrirModalEditarItem = (item, cat) => {
    setCategoriaSelecionada(cat);
    setItemSelecionado(item);
    setFormItem({
      categoria_id: item.categoria_id,
      nome: item.nome,
      ordem: item.ordem || "",
    });
    setModalAberto("editarItem");
  };

  const fecharModal = () => {
    setModalAberto(null);
    setCategoriaSelecionada(null);
    setItemSelecionado(null);
    setFormCategoria({ nome: "", ordem: "" });
    setFormItem({ categoria_id: "", nome: "", ordem: "" });
  };

  // ====================================
  // HANDLERS - CATEGORIAS
  // ====================================
  const handleSubmitCategoria = async (e) => {
    e.preventDefault();

    if (!formCategoria.nome.trim()) {
      mostrarAlerta({
        titulo: "Campo obrigatório",
        mensagem: "Nome da categoria é obrigatório!",
        tipo: "erro",
      });
      return;
    }

    try {
      if (modalAberto === "criarCategoria") {
        const resposta = await criarCategoriaSubstituicao({
          nome: formCategoria.nome,
          ordem: formCategoria.ordem ? parseInt(formCategoria.ordem) : 999,
        });

        if (resposta.sucesso) {
          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: resposta.mensagem,
            tipo: "sucesso",
          });
          fecharModal();
          carregarDados();
        }
      } else if (modalAberto === "editarCategoria" && categoriaSelecionada) {
        const resposta = await atualizarCategoriaSubstituicao(
          categoriaSelecionada.id,
          {
            nome: formCategoria.nome,
            ordem: formCategoria.ordem ? parseInt(formCategoria.ordem) : 999,
          },
        );

        if (resposta.sucesso) {
          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: resposta.mensagem,
            tipo: "sucesso",
          });
          fecharModal();
          carregarDados();
        }
      }
    } catch (erro) {
      mostrarAlerta({
        titulo: "Erro",
        mensagem: "Erro: " + erro.message,
        tipo: "erro",
      });
    }
  };

  const handleToggleCategoria = (cat) => {
    const msg = cat.ativa
      ? `Desativar a categoria "${cat.nome}"? Todos os itens desta categoria também serão desativados.`
      : `Ativar a categoria "${cat.nome}"?`;

    mostrarConfirmacao({
      titulo: cat.ativa ? "Desativar categoria" : "Ativar categoria",
      mensagem: msg,
      tipo: cat.ativa ? "perigo" : "confirmar",
      textoBotaoConfirmar: cat.ativa ? "Desativar" : "Ativar",
      textoBotaoCancelar: "Cancelar",
      onConfirmar: async () => {
        try {
          const resposta = await toggleCategoriaSubstituicao(
            cat.id,
            !cat.ativa,
          );
          if (resposta.sucesso) {
            mostrarAlerta({
              titulo: "Sucesso",
              mensagem: resposta.mensagem,
              tipo: "sucesso",
            });
            carregarDados();
          }
        } catch (erro) {
          mostrarAlerta({
            titulo: "Erro",
            mensagem: "Erro: " + erro.message,
            tipo: "erro",
          });
        }
      },
    });
  };

  // ====================================
  // HANDLERS - ITENS
  // ====================================
  const handleSubmitItem = async (e) => {
    e.preventDefault();

    if (!formItem.nome.trim()) {
      mostrarAlerta({
        titulo: "Campo obrigatório",
        mensagem: "Nome do item é obrigatório!",
        tipo: "erro",
      });
      return;
    }

    try {
      if (modalAberto === "criarItem") {
        const resposta = await criarItemSubstituicao({
          categoria_id: formItem.categoria_id,
          nome: formItem.nome,
          ordem: formItem.ordem ? parseInt(formItem.ordem) : 999,
        });

        if (resposta.sucesso) {
          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: resposta.mensagem,
            tipo: "sucesso",
          });
          fecharModal();
          carregarDados();
        }
      } else if (modalAberto === "editarItem" && itemSelecionado) {
        const resposta = await atualizarItemSubstituicao(itemSelecionado.id, {
          nome: formItem.nome,
          categoria_id: formItem.categoria_id,
          ordem: formItem.ordem ? parseInt(formItem.ordem) : 999,
        });

        if (resposta.sucesso) {
          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: resposta.mensagem,
            tipo: "sucesso",
          });
          fecharModal();
          carregarDados();
        }
      }
    } catch (erro) {
      mostrarAlerta({
        titulo: "Erro",
        mensagem: "Erro: " + erro.message,
        tipo: "erro",
      });
    }
  };

  const handleToggleItem = (item) => {
    const nomeCompleto = `${
      categorias.find((c) => c.id === item.categoria_id)?.nome || ""
    } ${item.nome}`;
    const acao = item.ativo ? "desativar" : "ativar";

    mostrarConfirmacao({
      titulo: acao === "desativar" ? "Desativar item" : "Ativar item",
      mensagem: `${acao === "desativar" ? "Desativar" : "Ativar"} "${nomeCompleto}"?`,
      tipo: acao === "desativar" ? "perigo" : "confirmar",
      textoBotaoConfirmar: acao === "desativar" ? "Desativar" : "Ativar",
      textoBotaoCancelar: "Cancelar",
      onConfirmar: async () => {
        try {
          const resposta = await toggleItemSubstituicao(item.id, !item.ativo);
          if (resposta.sucesso) {
            mostrarAlerta({
              titulo: "Sucesso",
              mensagem: resposta.mensagem,
              tipo: "sucesso",
            });
            carregarDados();
          }
        } catch (erro) {
          mostrarAlerta({
            titulo: "Erro",
            mensagem: "Erro: " + erro.message,
            tipo: "erro",
          });
        }
      },
    });
  };

  // ====================================
  // STATS
  // ====================================
  const stats = {
    totalCategorias: categorias.length,
    categoriasAtivas: categorias.filter((c) => c.ativa).length,
    totalItens: categorias.reduce((acc, c) => acc + (c.itens || []).length, 0),
    itensAtivos: categorias.reduce(
      (acc, c) => acc + (c.itens || []).filter((i) => i.ativo).length,
      0,
    ),
  };

  // ====================================
  // RENDER
  // ====================================
  return (
    <div className="gsp-page">
      {/* Header */}
      <header className="gsp-header">
        <div className="gsp-header-left">
          <button
            className="gsp-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            ← Voltar
          </button>
          <div className="gsp-header-text">
            <h1>🍲 Substituição de Principal</h1>
            <p className="gsp-subtitulo">
              Gerencie categorias e itens de substituição do prato principal
            </p>
          </div>
        </div>
        <div className="gsp-header-actions">
          <button
            className="gsp-btn-novo-item"
            onClick={abrirModalCriarCategoria}
          >
            + Nova Categoria
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="gsp-stats">
        <div className="gsp-stat-card">
          <div className="gsp-stat-icon gsp-stat-total">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="gsp-stat-info">
            <span className="gsp-stat-value">{stats.totalCategorias}</span>
            <span className="gsp-stat-label">Categorias</span>
          </div>
        </div>
        <div className="gsp-stat-card">
          <div className="gsp-stat-icon gsp-stat-ativas">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="gsp-stat-info">
            <span className="gsp-stat-value">{stats.categoriasAtivas}</span>
            <span className="gsp-stat-label">Cat. Ativas</span>
          </div>
        </div>
        <div className="gsp-stat-card">
          <div className="gsp-stat-icon gsp-stat-itens">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>
          <div className="gsp-stat-info">
            <span className="gsp-stat-value">{stats.totalItens}</span>
            <span className="gsp-stat-label">Total Itens</span>
          </div>
        </div>
        <div className="gsp-stat-card">
          <div className="gsp-stat-icon gsp-stat-itens-ativos">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="gsp-stat-info">
            <span className="gsp-stat-value">{stats.itensAtivos}</span>
            <span className="gsp-stat-label">Itens Ativos</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="gsp-toolbar">
        <div className="gsp-toolbar-left">
          <div className="gsp-search-wrapper">
            <svg
              className="gsp-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="gsp-search"
              placeholder="Buscar categoria ou item..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="gsp-filters">
            {["todos", "ativos", "inativos"].map((filtro) => (
              <button
                key={filtro}
                className={`gsp-filter-btn ${filtroAtivo === filtro ? "ativo" : ""}`}
                onClick={() => setFiltroAtivo(filtro)}
              >
                {filtro === "todos"
                  ? "Todos"
                  : filtro === "ativos"
                    ? "Ativos"
                    : "Inativos"}
              </button>
            ))}
          </div>
        </div>
        <div className="gsp-toolbar-right">
          <button className="gsp-btn-expandir" onClick={expandirTodas}>
            Expandir Todas
          </button>
          <button className="gsp-btn-expandir" onClick={colapsarTodas}>
            Colapsar Todas
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      {carregando ? (
        <div className="gsp-loading">
          <div className="gsp-spinner"></div>
          <p>Carregando...</p>
        </div>
      ) : categoriasFiltradas.length === 0 ? (
        <div className="gsp-vazio">
          <p>📭 Nenhuma categoria encontrada</p>
          <button
            className="gsp-btn-novo-item"
            onClick={abrirModalCriarCategoria}
          >
            + Cadastrar Primeira Categoria
          </button>
        </div>
      ) : (
        <div className="gsp-lista">
          {categoriasFiltradas.map((cat) => (
            <div
              key={cat.id}
              className={`gsp-categoria-card ${!cat.ativa ? "gsp-inativa" : ""}`}
            >
              {/* Header da categoria */}
              <div
                className="gsp-categoria-header"
                onClick={() => toggleExpandir(cat.id)}
              >
                <div className="gsp-categoria-info">
                  <span className="gsp-chevron">
                    {categoriasExpandidas[cat.id] ? "▼" : "▶"}
                  </span>
                  <h3 className="gsp-categoria-nome">{cat.nome}</h3>
                  <span
                    className={`gsp-status ${cat.ativa ? "ativa" : "inativa"}`}
                  >
                    {cat.ativa ? "Ativa" : "Inativa"}
                  </span>
                  <span className="gsp-badge-count">
                    {(cat.itens || []).length}{" "}
                    {(cat.itens || []).length === 1 ? "item" : "itens"}
                  </span>
                </div>
                <div
                  className="gsp-categoria-acoes"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="gsp-btn-acao gsp-btn-add-item"
                    onClick={() => abrirModalCriarItem(cat)}
                    title="Adicionar item"
                  >
                    +
                  </button>
                  <button
                    className="gsp-btn-acao gsp-btn-editar"
                    onClick={() => abrirModalEditarCategoria(cat)}
                    title="Editar categoria"
                  >
                    ✏️
                  </button>
                  <button
                    className={`gsp-btn-acao gsp-btn-toggle ${cat.ativa ? "desativar" : "ativar"}`}
                    onClick={() => handleToggleCategoria(cat)}
                    title={cat.ativa ? "Desativar" : "Ativar"}
                  >
                    {cat.ativa ? "🔴" : "🟢"}
                  </button>
                </div>
              </div>

              {/* Lista de itens (expandível) */}
              {categoriasExpandidas[cat.id] && (cat.itens || []).length > 0 && (
                <div className="gsp-itens-lista">
                  <table className="gsp-itens-tabela">
                    <thead>
                      <tr>
                        <th>Ordem</th>
                        <th>Nome Completo</th>
                        <th>Preparo</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(cat.itens || []).map((item) => (
                        <tr
                          key={item.id}
                          className={!item.ativo ? "gsp-item-inativo" : ""}
                        >
                          <td className="gsp-col-ordem">{item.ordem}</td>
                          <td className="gsp-col-nome-completo">
                            {cat.nome} {item.nome}
                          </td>
                          <td className="gsp-col-preparo">{item.nome}</td>
                          <td>
                            <span
                              className={`gsp-status-item ${item.ativo ? "ativa" : "inativa"}`}
                            >
                              {item.ativo ? "✓ Ativo" : "✗ Inativo"}
                            </span>
                          </td>
                          <td>
                            <div className="gsp-acoes-linha">
                              <button
                                className="gsp-btn-acao gsp-btn-editar"
                                onClick={() => abrirModalEditarItem(item, cat)}
                                title="Editar item"
                              >
                                ✏️
                              </button>
                              <button
                                className={`gsp-btn-acao gsp-btn-toggle ${item.ativo ? "desativar" : "ativar"}`}
                                onClick={() => handleToggleItem(item)}
                                title={item.ativo ? "Desativar" : "Ativar"}
                              >
                                {item.ativo ? "🔴" : "🟢"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mensagem se não tem itens */}
              {categoriasExpandidas[cat.id] &&
                (cat.itens || []).length === 0 && (
                  <div className="gsp-sem-itens">
                    <p>Nenhum item cadastrado nesta categoria</p>
                    <button
                      className="gsp-btn-add-primeiro"
                      onClick={() => abrirModalCriarItem(cat)}
                    >
                      + Adicionar primeiro item
                    </button>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* ====================================
          MODAL - CATEGORIA
          ==================================== */}
      {(modalAberto === "criarCategoria" ||
        modalAberto === "editarCategoria") && (
        <div className="gsp-modal-overlay" onClick={fecharModal}>
          <div className="gsp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gsp-modal-header">
              <h2>
                {modalAberto === "criarCategoria"
                  ? "➕ Nova Categoria"
                  : "✏️ Editar Categoria"}
              </h2>
              <button className="gsp-modal-fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitCategoria} className="gsp-modal-form">
              <div className="gsp-campo">
                <label>Nome da Categoria *</label>
                <input
                  type="text"
                  value={formCategoria.nome}
                  onChange={(e) =>
                    setFormCategoria({ ...formCategoria, nome: e.target.value })
                  }
                  placeholder="Ex: Arroz, Feijão, Carne, Frango, Peixe..."
                  maxLength={100}
                  autoFocus
                  required
                />
              </div>
              <div className="gsp-campo">
                <label>Ordem de Exibição (opcional)</label>
                <input
                  type="number"
                  value={formCategoria.ordem}
                  onChange={(e) =>
                    setFormCategoria({
                      ...formCategoria,
                      ordem: e.target.value,
                    })
                  }
                  placeholder="Ex: 1, 2, 3..."
                  min={0}
                />
                <small>Menor número aparece primeiro na lista</small>
              </div>
              <div className="gsp-modal-acoes">
                <button
                  type="button"
                  className="gsp-btn-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="gsp-btn-salvar">
                  {modalAberto === "criarCategoria"
                    ? "Criar Categoria"
                    : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================
          MODAL - ITEM/PREPARO
          ==================================== */}
      {(modalAberto === "criarItem" || modalAberto === "editarItem") && (
        <div className="gsp-modal-overlay" onClick={fecharModal}>
          <div className="gsp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gsp-modal-header">
              <h2>
                {modalAberto === "criarItem"
                  ? `➕ Novo Item — ${categoriaSelecionada?.nome}`
                  : `✏️ Editar Item — ${categoriaSelecionada?.nome}`}
              </h2>
              <button className="gsp-modal-fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitItem} className="gsp-modal-form">
              <div className="gsp-campo">
                <label>Categoria</label>
                <input
                  type="text"
                  value={categoriaSelecionada?.nome || ""}
                  disabled
                  className="gsp-input-disabled"
                />
              </div>
              <div className="gsp-campo">
                <label>Tipo de Preparo / Nome *</label>
                <input
                  type="text"
                  value={formItem.nome}
                  onChange={(e) =>
                    setFormItem({ ...formItem, nome: e.target.value })
                  }
                  placeholder="Ex: cozida, grelhada, assada, branco, integral..."
                  maxLength={100}
                  autoFocus
                  required
                />
                <small>
                  Resultado:{" "}
                  <strong>
                    {categoriaSelecionada?.nome} {formItem.nome || "..."}
                  </strong>
                </small>
              </div>
              <div className="gsp-campo">
                <label>Ordem de Exibição (opcional)</label>
                <input
                  type="number"
                  value={formItem.ordem}
                  onChange={(e) =>
                    setFormItem({ ...formItem, ordem: e.target.value })
                  }
                  placeholder="Ex: 1, 2, 3..."
                  min={0}
                />
                <small>Menor número aparece primeiro na lista</small>
              </div>
              <div className="gsp-modal-acoes">
                <button
                  type="button"
                  className="gsp-btn-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="gsp-btn-salvar">
                  {modalAberto === "criarItem"
                    ? "Criar Item"
                    : "Salvar Alterações"}
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

export default GestaoSubstituicaoPrincipal;
