// frontend/src/pages/GestaoCondicoesAcompanhante/GestaoCondicoesAcompanhante.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  listarRestricoesAcompanhante,
  criarRestricaoAcompanhante,
  atualizarRestricaoAcompanhante,
  toggleRestricaoAcompanhanteAtiva,
} from "../../services/api";
import "./GestaoCondicoesAcompanhante.css";

function GestaoCondicoesAcompanhante() {
  const navigate = useNavigate();
  const { refreshSystemData } = useOutletContext() || {};

  const [restricoes, setRestricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [restricaoEditando, setRestricaoEditando] = useState(null);
  const [filtro, setFiltro] = useState("ativas");

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ordem: "",
  });

  useEffect(() => {
    carregarRestricoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const carregarRestricoes = async () => {
    setCarregando(true);
    try {
      const resposta = await listarRestricoesAcompanhante(filtro === "todas");
      setRestricoes(resposta.restricoes || []);
    } catch (erro) {
      console.error("Erro ao carregar condições do acompanhante:", erro);
      alert("Erro ao carregar condições nutricionais do acompanhante");
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalNovo = () => {
    setRestricaoEditando(null);
    setFormData({ nome: "", descricao: "", ordem: "" });
    setMostrarModal(true);
  };

  const abrirModalEditar = (restricao) => {
    setRestricaoEditando(restricao);
    setFormData({
      nome: restricao.nome,
      descricao: restricao.descricao || "",
      ordem: restricao.ordem || "",
    });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setRestricaoEditando(null);
    setFormData({ nome: "", descricao: "", ordem: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Nome da condição nutricional é obrigatório!");
      return;
    }

    try {
      if (restricaoEditando) {
        await atualizarRestricaoAcompanhante(restricaoEditando.id, formData);
        alert("Condição nutricional atualizada com sucesso!");
      } else {
        await criarRestricaoAcompanhante(formData);
        alert("Condição nutricional criada com sucesso!");
      }

      fecharModal();
      await carregarRestricoes();
      if (refreshSystemData) await refreshSystemData();
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      alert(erro.message || "Erro ao salvar condição nutricional");
    }
  };

  const handleToggleAtiva = async (restricao) => {
    const novoStatus = !restricao.ativa;
    const confirmacao = window.confirm(
      `Deseja realmente ${novoStatus ? "ativar" : "desativar"} a condição nutricional "${restricao.nome}"?`,
    );
    if (!confirmacao) return;

    try {
      await toggleRestricaoAcompanhanteAtiva(restricao.id, novoStatus);
      alert(
        `Condição nutricional ${novoStatus ? "ativada" : "desativada"} com sucesso!`,
      );
      await carregarRestricoes();
      if (refreshSystemData) await refreshSystemData();
    } catch (erro) {
      console.error("Erro ao alterar status:", erro);
      alert(erro.message || "Erro ao alterar status");
    }
  };

  if (carregando) {
    return (
      <div className="gra-container">
        <div className="gra-header">
          <div className="gra-header-left">
            <button className="gra-btn-voltar" onClick={() => navigate("/admin/cadastros")}>
              ← Voltar
            </button>
            <div className="gra-header-text">
              <h1>👤 Cond. Nutricionais do Acompanhante</h1>
              <p className="gra-subtitulo">Condições nutricionais específicas para acompanhantes</p>
            </div>
          </div>
        </div>
        <div className="gra-carregando">⏳ Carregando...</div>
      </div>
    );
  }

  return (
    <div className="gra-container">
      <div className="gra-header">
        <div className="gra-header-left">
          <button className="gra-btn-voltar" onClick={() => navigate("/admin/cadastros")}>
            ← Voltar
          </button>
          <div className="gra-header-text">
            <h1>👤 Cond. Nutricionais do Acompanhante</h1>
            <p className="gra-subtitulo">Condições nutricionais específicas para acompanhantes</p>
          </div>
        </div>
      </div>

      <div className="gra-info-box">
        <p>
          Cadastre aqui as condições nutricionais que podem ser atribuídas aos
          acompanhantes dos pacientes. Essas condições alteram a dieta exibida
          na etiqueta (ex: "Dieta Normal p/ Diabético").
        </p>
      </div>

      <div className="gra-acoes">
        <button className="gra-btn-novo" onClick={abrirModalNovo}>
          + Nova Condição Nutricional
        </button>

        <div className="gra-filtros">
          <label>
            <input
              type="radio"
              value="ativas"
              checked={filtro === "ativas"}
              onChange={(e) => setFiltro(e.target.value)}
            />
            Apenas Ativas
          </label>
          <label>
            <input
              type="radio"
              value="todas"
              checked={filtro === "todas"}
              onChange={(e) => setFiltro(e.target.value)}
            />
            Todas
          </label>
        </div>
      </div>

      {restricoes.length === 0 ? (
        <div className="gra-vazio">
          <p>📭 Nenhuma condição nutricional cadastrada</p>
          <button className="gra-btn-novo" onClick={abrirModalNovo}>
            + Cadastrar Primeira Condição
          </button>
        </div>
      ) : (
        <div className="gra-tabela-container">
          <table className="gra-tabela">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {restricoes.map((restricao) => (
                <tr
                  key={restricao.id}
                  className={!restricao.ativa ? "gra-inativa" : ""}
                >
                  <td>{restricao.ordem}</td>
                  <td className="gra-nome">{restricao.nome}</td>
                  <td className="gra-descricao">
                    {restricao.descricao || "-"}
                  </td>
                  <td>
                    <span
                      className={`gra-status ${restricao.ativa ? "ativa" : "inativa"}`}
                    >
                      {restricao.ativa ? "✅ Ativa" : "❌ Inativa"}
                    </span>
                  </td>
                  <td className="gra-acoes-celula">
                    <button
                      className="gra-btn-editar"
                      onClick={() => abrirModalEditar(restricao)}
                    >
                      ✏️
                    </button>
                    <button
                      className={`gra-btn-toggle ${restricao.ativa ? "desativar" : "ativar"}`}
                      onClick={() => handleToggleAtiva(restricao)}
                    >
                      {restricao.ativa ? "🔒" : "🔓"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="gra-modal-overlay" onClick={fecharModal}>
          <div className="gra-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gra-modal-header">
              <h2>
                {restricaoEditando
                  ? "✏️ Editar Condição Nutricional"
                  : "➕ Nova Condição Nutricional"}
              </h2>
              <button className="gra-modal-fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="gra-modal-campo">
                <label>Nome *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: Diabético, Sem Glúten..."
                  autoFocus
                />
              </div>

              <div className="gra-modal-campo">
                <label>Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descrição opcional"
                />
              </div>

              <div className="gra-modal-campo">
                <label>Ordem de exibição</label>
                <input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) =>
                    setFormData({ ...formData, ordem: e.target.value })
                  }
                  placeholder="1, 2, 3..."
                  min="1"
                />
              </div>

              <div className="gra-modal-botoes">
                <button
                  type="button"
                  className="gra-btn-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="gra-btn-salvar">
                  {restricaoEditando ? "Salvar Alterações" : "Criar Condição"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoCondicoesAcompanhante;
