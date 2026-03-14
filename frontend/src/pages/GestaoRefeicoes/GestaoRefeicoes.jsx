// frontend/src/pages/GestaoRefeicoes/GestaoRefeicoes.jsx
// VERSÃO ATUALIZADA: com suporte a grupo_dia (data de consumo)
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  listarRefeicoes,
  criarRefeicao,
  atualizarRefeicao,
  toggleRefeicaoAtiva,
  toggleListaPersonalizada,
  importarItensRefeicao,
  buscarEstatisticasItensRefeicao,
} from "../../services/api";
import "./GestaoRefeicoes.css";

function GestaoRefeicoes() {
  const navigate = useNavigate();
  const { refreshSystemData } = useOutletContext() || {};

  const [refeicoes, setRefeicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [refeicaoEditando, setRefeicaoEditando] = useState(null);
  const [filtro, setFiltro] = useState("ativas");

  const [modalImport, setModalImport] = useState(null);
  const [arquivoImport, setArquivoImport] = useState(null);
  const [importando, setImportando] = useState(false);
  const [resultadoImport, setResultadoImport] = useState(null);
  const [estatisticas, setEstatisticas] = useState({});

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ordem: "",
    grupo_dia: "proximo", // ← NOVO CAMPO
  });

  useEffect(() => {
    carregarRefeicoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const carregarRefeicoes = async () => {
    setCarregando(true);
    try {
      const resposta = await listarRefeicoes(filtro === "todas");
      const lista = (resposta.refeicoes || []).map((r) => ({
        ...r,
        ativa: !!r.ativa,
        tem_lista_personalizada: !!r.tem_lista_personalizada,
        grupo_dia: r.grupo_dia || "proximo",
      }));
      setRefeicoes(lista);

      const especiais = lista.filter((r) => r.tem_lista_personalizada);
      const statsMap = {};
      await Promise.all(
        especiais.map(async (r) => {
          try {
            const st = await buscarEstatisticasItensRefeicao(r.id);
            if (st.sucesso) statsMap[r.id] = st.estatisticas;
          } catch (_) {}
        }),
      );
      setEstatisticas(statsMap);
    } catch (erro) {
      console.error("Erro ao carregar refeições:", erro);
      alert("Erro ao carregar tipos de refeição");
    } finally {
      setCarregando(false);
    }
  };

  const notificarApp = () => {
    refreshSystemData && refreshSystemData();
  };

  // ─── Modal CRUD ───────────────────────────────────────
  const abrirModalNovo = () => {
    setRefeicaoEditando(null);
    setFormData({ nome: "", descricao: "", ordem: "", grupo_dia: "proximo" });
    setMostrarModal(true);
  };

  const abrirModalEditar = (r) => {
    setRefeicaoEditando(r);
    setFormData({
      nome: r.nome,
      descricao: r.descricao || "",
      ordem: r.ordem || "",
      grupo_dia: r.grupo_dia || "proximo",
    });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setRefeicaoEditando(null);
    setFormData({ nome: "", descricao: "", ordem: "", grupo_dia: "proximo" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      alert("Nome é obrigatório!");
      return;
    }
    try {
      if (refeicaoEditando) {
        await atualizarRefeicao(refeicaoEditando.id, formData);
        alert("Refeição atualizada com sucesso!");
      } else {
        await criarRefeicao(formData);
        alert("Refeição criada com sucesso!");
      }
      notificarApp();
      fecharModal();
      carregarRefeicoes();
    } catch (erro) {
      alert(erro.message || "Erro ao salvar");
    }
  };

  const handleToggleAtiva = async (r) => {
    const novoStatus = !r.ativa;
    if (
      !window.confirm(
        `Deseja ${novoStatus ? "ativar" : "desativar"} "${r.nome}"?`,
      )
    )
      return;
    try {
      await toggleRefeicaoAtiva(r.id, novoStatus);
      notificarApp();
      carregarRefeicoes();
    } catch (erro) {
      alert(erro.message);
    }
  };

  const handleToggleLista = async (r) => {
    const novoStatus = !r.tem_lista_personalizada;
    if (novoStatus) {
      if (
        !window.confirm(
          `Ativar lista personalizada para "${r.nome}"?\n\nIsso vai substituir as opções padrão por uma lista de produtos importada via planilha Excel.`,
        )
      )
        return;
    } else {
      if (
        !window.confirm(
          `Desativar lista personalizada de "${r.nome}"?\n\nAs opções padrão voltarão a aparecer nas prescrições.`,
        )
      )
        return;
    }
    try {
      await toggleListaPersonalizada(r.id, novoStatus);
      notificarApp();
      carregarRefeicoes();
    } catch (erro) {
      alert(erro.message);
    }
  };

  // ─── Modal IMPORTAÇÃO ─────────────────────────────────
  const abrirModalImport = (r) => {
    setModalImport(r);
    setArquivoImport(null);
    setResultadoImport(null);
  };

  const fecharModalImport = () => {
    setModalImport(null);
    setArquivoImport(null);
    setResultadoImport(null);
    setImportando(false);
  };

  const handleImportar = async () => {
    if (!arquivoImport) {
      alert("Selecione um arquivo!");
      return;
    }
    setImportando(true);
    setResultadoImport(null);
    try {
      const resposta = await importarItensRefeicao(
        modalImport.id,
        arquivoImport,
      );
      setResultadoImport({
        tipo: "sucesso",
        mensagem: resposta.mensagem,
        detalhes: resposta.detalhes,
      });
      notificarApp();
      carregarRefeicoes();
    } catch (erro) {
      setResultadoImport({ tipo: "erro", mensagem: erro.message });
    } finally {
      setImportando(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "Nunca";
    return new Date(data).toLocaleString("pt-BR");
  };

  const labelGrupoDia = (grupo) =>
    grupo === "atual" ? "📅 Dia Atual" : "📅 Dia Seguinte";

  // ─── RENDER ───────────────────────────────────────────
  return (
    <div className="grf-container">
      {/* HEADER */}
      <div className="grf-header">
        <div className="grf-header-left">
          <button
            className="grf-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            ← Voltar
          </button>
          <div>
            <h1 className="grf-titulo">🍽️ Tipos de Refeição</h1>
            <p className="grf-subtitulo">
              Gerencie as refeições e configure listas personalizadas
            </p>
          </div>
        </div>
        <button className="grf-btn-novo" onClick={abrirModalNovo}>
          + Nova Refeição
        </button>
      </div>

      {/* FILTROS */}
      <div className="grf-filtros">
        <button
          className={`grf-filtro-btn ${filtro === "ativas" ? "ativo" : ""}`}
          onClick={() => setFiltro("ativas")}
        >
          Ativas
        </button>
        <button
          className={`grf-filtro-btn ${filtro === "todas" ? "ativo" : ""}`}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>
      </div>

      {/* LEGENDA */}
      <div className="grf-legenda">
        <span className="grf-legenda-item">
          <span className="grf-badge-normal">Padrão</span> opções normais (Dieta,
          Restrições, etc.)
        </span>
        <span className="grf-legenda-item">
          <span className="grf-badge-especial">Lista ✦</span> substitui tudo por
          produtos importados
        </span>
        <span className="grf-legenda-item">
          <span className="grf-badge-dia-atual">Dia Atual</span> etiqueta sai com
          data de hoje
        </span>
        <span className="grf-legenda-item">
          <span className="grf-badge-dia-proximo">Dia Seguinte</span> etiqueta
          sai com data de amanhã
        </span>
      </div>

      {/* LISTA */}
      <div className="grf-lista">
        {carregando ? (
          <div className="grf-loading">Carregando...</div>
        ) : refeicoes.length === 0 ? (
          <div className="grf-vazio">
            <p>Nenhuma refeição encontrada.</p>
            <button className="grf-btn-novo" onClick={abrirModalNovo}>
              + Criar primeira refeição
            </button>
          </div>
        ) : (
          refeicoes.map((r) => (
            <div
              key={r.id}
              className={`grf-item ${!r.ativa ? "grf-item-inativa" : ""} ${r.tem_lista_personalizada ? "grf-item-especial" : ""}`}
            >
              <div className="grf-item-info">
                <div className="grf-item-nome">
                  {r.nome}
                  {r.tem_lista_personalizada && (
                    <span className="grf-badge-especial">Lista ✦</span>
                  )}
                  {!r.ativa && (
                    <span className="grf-badge-inativa">Inativa</span>
                  )}
                  {/* ← NOVO: badge do grupo do dia */}
                  <span
                    className={`grf-badge-grupo ${r.grupo_dia === "atual" ? "grf-badge-dia-atual" : "grf-badge-dia-proximo"}`}
                  >
                    {labelGrupoDia(r.grupo_dia)}
                  </span>
                </div>
                {r.descricao && (
                  <div className="grf-item-descricao">{r.descricao}</div>
                )}
                <div className="grf-item-meta">
                  <span>Ordem: {r.ordem}</span>
                  {r.tem_lista_personalizada && estatisticas[r.id] && (
                    <span className="grf-item-stats">
                      • {estatisticas[r.id].total_ativos || 0} produtos • Última
                      importação:{" "}
                      {formatarData(estatisticas[r.id].ultima_importacao)}
                    </span>
                  )}
                </div>
              </div>

              <div className="grf-item-acoes">
                <button
                  className={`grf-btn-lista ${r.tem_lista_personalizada ? "lista-ativa" : "lista-inativa"}`}
                  onClick={() => handleToggleLista(r)}
                  title={
                    r.tem_lista_personalizada
                      ? "Desativar lista personalizada"
                      : "Ativar lista personalizada"
                  }
                >
                  {r.tem_lista_personalizada ? "📋 Lista ON" : "📋 Lista OFF"}
                </button>

                {r.tem_lista_personalizada && (
                  <button
                    className="grf-btn-importar"
                    onClick={() => abrirModalImport(r)}
                    title="Importar planilha de produtos"
                  >
                    📥 Importar
                  </button>
                )}

                <button
                  className="grf-btn-editar"
                  onClick={() => abrirModalEditar(r)}
                >
                  ✏️ Editar
                </button>
                <button
                  className={`grf-btn-toggle ${r.ativa ? "desativar" : "ativar"}`}
                  onClick={() => handleToggleAtiva(r)}
                >
                  {r.ativa ? "🔴 Desativar" : "🟢 Ativar"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── MODAL CRUD ─────────────────────────────────── */}
      {mostrarModal && (
        <div className="grf-overlay" onClick={fecharModal}>
          <div className="grf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="grf-modal-header">
              <h2>{refeicaoEditando ? "Editar Refeição" : "Nova Refeição"}</h2>
              <button className="grf-modal-fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grf-modal-form">
              <div className="grf-campo">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: Desjejum, Merenda, Jantar..."
                  autoFocus
                />
              </div>
              <div className="grf-campo">
                <label>Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Opcional"
                />
              </div>
              <div className="grf-campo">
                <label>Ordem de exibição</label>
                <input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) =>
                    setFormData({ ...formData, ordem: e.target.value })
                  }
                  placeholder="Ex: 1, 2, 3..."
                  min="1"
                />
              </div>

              {/* ← NOVO CAMPO: grupo_dia */}
              <div className="grf-campo">
                <label>Data de consumo na etiqueta *</label>
                <div className="grf-grupo-dia-opcoes">
                  <label
                    className={`grf-radio-opcao ${formData.grupo_dia === "atual" ? "selecionado" : ""}`}
                  >
                    <input
                      type="radio"
                      name="grupo_dia"
                      value="atual"
                      checked={formData.grupo_dia === "atual"}
                      onChange={() =>
                        setFormData({ ...formData, grupo_dia: "atual" })
                      }
                    />
                    <div className="grf-radio-conteudo">
                      <span className="grf-radio-titulo">📅 Dia Atual</span>
                      <span className="grf-radio-desc">
                        Se prescrito até o corte: etiqueta sai com{" "}
                        <strong>hoje</strong>
                        <br />
                        Se prescrito após o corte: etiqueta sai com{" "}
                        <strong>amanhã</strong>
                      </span>
                    </div>
                  </label>
                  <label
                    className={`grf-radio-opcao ${formData.grupo_dia === "proximo" ? "selecionado" : ""}`}
                  >
                    <input
                      type="radio"
                      name="grupo_dia"
                      value="proximo"
                      checked={formData.grupo_dia === "proximo"}
                      onChange={() =>
                        setFormData({ ...formData, grupo_dia: "proximo" })
                      }
                    />
                    <div className="grf-radio-conteudo">
                      <span className="grf-radio-titulo">📅 Dia Seguinte</span>
                      <span className="grf-radio-desc">
                        Se prescrito até o corte: etiqueta sai com{" "}
                        <strong>amanhã</strong>
                        <br />
                        Se prescrito após o corte: etiqueta sai com{" "}
                        <strong>depois de amanhã</strong>
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grf-modal-acoes">
                <button
                  type="button"
                  className="grf-btn-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="grf-btn-salvar">
                  {refeicaoEditando ? "Salvar Alterações" : "Criar Refeição"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL IMPORTAÇÃO ───────────────────────────── */}
      {modalImport && (
        <div className="grf-overlay" onClick={fecharModalImport}>
          <div
            className="grf-modal grf-modal-import"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grf-modal-header grf-modal-header-import">
              <div>
                <h2>📥 Importar Planilha</h2>
                <p className="grf-modal-subtitulo">{modalImport.nome}</p>
              </div>
              <button className="grf-modal-fechar" onClick={fecharModalImport}>
                ✕
              </button>
            </div>

            <div className="grf-modal-body">
              {estatisticas[modalImport.id] && (
                <div className="grf-stats-box">
                  <div className="grf-stat">
                    <span className="grf-stat-label">Produtos ativos</span>
                    <span className="grf-stat-valor">
                      {estatisticas[modalImport.id].total_ativos || 0}
                    </span>
                  </div>
                  <div className="grf-stat">
                    <span className="grf-stat-label">Versões importadas</span>
                    <span className="grf-stat-valor">
                      {estatisticas[modalImport.id].total_versoes || 0}
                    </span>
                  </div>
                  <div className="grf-stat">
                    <span className="grf-stat-label">Última importação</span>
                    <span className="grf-stat-valor grf-stat-data">
                      {formatarData(
                        estatisticas[modalImport.id].ultima_importacao,
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="grf-upload-area">
                <label className="grf-file-label">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      setArquivoImport(e.target.files[0]);
                      setResultadoImport(null);
                    }}
                    disabled={importando}
                    className="grf-file-input"
                  />
                  <span className="grf-file-btn">
                    📁 Selecionar planilha (.xlsx)
                  </span>
                </label>
                {arquivoImport && (
                  <div className="grf-arquivo-info">
                    <span>📄 {arquivoImport.name}</span>
                    <span className="grf-arquivo-size">
                      ({(arquivoImport.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>

              <button
                className="grf-btn-importar-exec"
                onClick={handleImportar}
                disabled={!arquivoImport || importando}
              >
                {importando ? "⏳ Importando..." : "📥 Importar Planilha"}
              </button>

              {resultadoImport && (
                <div className={`grf-resultado ${resultadoImport.tipo}`}>
                  <strong>
                    {resultadoImport.tipo === "sucesso" ? "✅" : "❌"}{" "}
                    {resultadoImport.mensagem}
                  </strong>
                  {resultadoImport.detalhes && (
                    <div className="grf-resultado-detalhes">
                      <p>
                        • Produtos importados:{" "}
                        {resultadoImport.detalhes.total_importado}
                      </p>
                      <p>• Arquivo: {resultadoImport.detalhes.arquivo}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="grf-instrucoes">
                <h4>📋 Formato da planilha</h4>
                <p>
                  A planilha deve ter as colunas (maiúsculas ou minúsculas):
                </p>
                <div className="grf-colunas">
                  <span className="grf-coluna obrig">
                    PRODUTO <small>obrigatório</small>
                  </span>
                  <span className="grf-coluna">
                    GRAMATURA <small>opcional</small>
                  </span>
                  <span className="grf-coluna">
                    VALOR <small>opcional</small>
                  </span>
                </div>
                <p className="grf-aviso">
                  ⚠️ A importação cria uma nova versão. O histórico de
                  prescrições anteriores é preservado.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoRefeicoes;
