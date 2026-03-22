// frontend/src/pages/GestaoCondicoes/GestaoCondicoes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  listarRestricoes,
  criarRestricao,
  atualizarRestricao,
  toggleRestricaoAtiva,
} from "../../services/api";
import "./GestaoCondicoes.css";

import ModalAlerta from "../../components/common/ModalAlerta/ModalAlerta";
import useModalAlerta from "../../hooks/useModalAlerta";

function GestaoCondicoes() {
  const navigate = useNavigate();
  const { refreshSystemData } = useOutletContext() || {};

  const [restricoes, setRestricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [restricaoEditando, setRestricaoEditando] = useState(null);
  const [filtro, setFiltro] = useState("ativas"); // 'ativas' ou 'todas'

  const {
    modal,
    fecharModal: fecharModalAlerta,
    mostrarAlerta,
    mostrarConfirmacao,
  } = useModalAlerta();

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
      const resposta = await listarRestricoes(filtro === "todas");
      setRestricoes(resposta.restricoes || []);
    } catch (erro) {
      console.error("Erro ao carregar condições nutricionais:", erro);
      mostrarAlerta({
        titulo: "Erro ao carregar dados",
        mensagem: "Erro ao carregar Condições Nutricionais",
        tipo: "erro",
      });
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
      mostrarAlerta({
        titulo: "Campo obrigatório",
        mensagem: "Nome da Condição Nutricional é obrigatório!",
        tipo: "erro",
      });
      return;
    }

    try {
      if (restricaoEditando) {
        await atualizarRestricao(restricaoEditando.id, formData);
        mostrarAlerta({
          titulo: "Sucesso",
          mensagem: "Condição nutricional atualizada com sucesso!",
          tipo: "sucesso",
        });
      } else {
        await criarRestricao(formData);
        mostrarAlerta({
          titulo: "Sucesso",
          mensagem: "Condição nutricional criada com sucesso!",
          tipo: "sucesso",
        });
      }

      fecharModal();
      await carregarRestricoes();
      if (refreshSystemData) await refreshSystemData();
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      mostrarAlerta({
        titulo: "Erro ao salvar",
        mensagem: erro.message || "Erro ao salvar condição nutricional",
        tipo: "erro",
      });
    }
  };

  const handleToggleAtiva = (restricao) => {
    const novoStatus = !restricao.ativa;

    mostrarConfirmacao({
      titulo: novoStatus
        ? "Ativar condição nutricional"
        : "Desativar condição nutricional",
      mensagem: `Deseja realmente ${novoStatus ? "ativar" : "desativar"} a condição nutricional "${restricao.nome}"?`,
      tipo: novoStatus ? "confirmar" : "perigo",
      textoBotaoConfirmar: novoStatus ? "Ativar" : "Desativar",
      textoBotaoCancelar: "Cancelar",
      onConfirmar: async () => {
        try {
          await toggleRestricaoAtiva(restricao.id, novoStatus);

          await carregarRestricoes();
          if (refreshSystemData) await refreshSystemData();

          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: `Condição nutricional ${novoStatus ? "ativada" : "desativada"} com sucesso!`,
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

  if (carregando) {
    return (
      <div className="gr-container">
        <div className="gr-header">
          <div className="gr-header-left">
            <button
              className="gr-btn-voltar"
              onClick={() => navigate("/admin/cadastros")}
            >
              ← Voltar
            </button>
            <div className="gr-header-text">
              <h1>🩺 Condições Nutricionais</h1>
              <p className="gr-subtitulo">
                Gerenciar condições nutricionais para prescrições
              </p>
            </div>
          </div>
        </div>
        <div className="gr-carregando">⏳ Carregando...</div>
      </div>
    );
  }

  return (
    <div className="gr-container">
      <div className="gr-header">
        <div className="gr-header-left">
          <button
            className="gr-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            ← Voltar
          </button>
          <div className="gr-header-text">
            <h1>🩺 Condições Nutricionais</h1>
            <p className="gr-subtitulo">
              Gerenciar condições nutricionais para prescrições
            </p>
          </div>
        </div>
      </div>

      <div className="gr-acoes">
        <button className="gr-btn-novo" onClick={abrirModalNovo}>
          + Nova Condição Nutricional
        </button>

        <div className="gr-filtros">
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
        <div className="gr-vazio">
          <p>📭 Nenhuma condição nutricional cadastrada</p>
          <button className="gr-btn-novo" onClick={abrirModalNovo}>
            + Cadastrar Primeira Condição
          </button>
        </div>
      ) : (
        <div className="gr-tabela-container">
          <table className="gr-tabela">
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
                  className={!restricao.ativa ? "gr-inativa" : ""}
                >
                  <td>{restricao.ordem}</td>
                  <td className="gr-nome">{restricao.nome}</td>
                  <td className="gr-descricao">{restricao.descricao || "-"}</td>
                  <td>
                    <span
                      className={`gr-status ${restricao.ativa ? "ativa" : "inativa"}`}
                    >
                      {restricao.ativa ? "✓ Ativa" : "✗ Inativa"}
                    </span>
                  </td>
                  <td>
                    <div className="gr-acoes-linha">
                      <button
                        className="gr-btn-editar"
                        onClick={() => abrirModalEditar(restricao)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={`gr-btn-toggle ${restricao.ativa ? "desativar" : "ativar"}`}
                        onClick={() => handleToggleAtiva(restricao)}
                        title={restricao.ativa ? "Desativar" : "Ativar"}
                      >
                        {restricao.ativa ? "🔴" : "🟢"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="gr-modal-overlay" onClick={fecharModal}>
          <div className="gr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gr-modal-header">
              <h2>
                {restricaoEditando
                  ? "✏️ Editar Condição Nutricional"
                  : "➕ Nova Condição Nutricional"}
              </h2>
              <button className="gr-modal-fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="gr-modal-form">
              <div className="gr-campo">
                <label>Nome da Condição Nutricional *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: HPS, DM, IRC..."
                  maxLength={100}
                  required
                />
              </div>

              <div className="gr-campo">
                <label>Descrição (opcional)</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Ex: Hiposódica, Diabetes Mellitus..."
                  rows={3}
                />
              </div>

              <div className="gr-campo">
                <label>Ordem de Exibição (opcional)</label>
                <input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) =>
                    setFormData({ ...formData, ordem: e.target.value })
                  }
                  placeholder="Ex: 1, 2, 3..."
                  min={0}
                />
                <small>Menor número aparece primeiro na lista</small>
              </div>

              <div className="gr-modal-acoes">
                <button
                  type="button"
                  className="gr-btn-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="gr-btn-salvar">
                  {restricaoEditando ? "Salvar Alterações" : "Criar Condição"}
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

export default GestaoCondicoes;
