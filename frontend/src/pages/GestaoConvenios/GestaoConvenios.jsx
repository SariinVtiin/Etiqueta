// frontend/src/pages/GestaoConvenios/GestaoConvenios.jsx
// SalusVita Tech - Gestão de Convênios
// Desenvolvido por FerMax Solution
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  listarConvenios,
  criarConvenio,
  atualizarConvenio,
  toggleConvenioAtivo,
} from "../../services/api";
import "./GestaoConvenios.css";

function GestaoConvenios() {
  const navigate = useNavigate();
  const { refreshSystemData } = useOutletContext() || {};

  const [convenios, setConvenios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [convenioEditando, setConvenioEditando] = useState(null);
  const [filtro, setFiltro] = useState("ativas");

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ordem: "",
  });

  useEffect(() => {
    carregarConvenios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const carregarConvenios = async () => {
    setCarregando(true);
    try {
      const resposta = await listarConvenios(filtro === "todas");
      setConvenios(resposta.convenios || []);
    } catch (erro) {
      console.error("Erro ao carregar convênios:", erro);
      alert("Erro ao carregar convênios");
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalNovo = () => {
    setConvenioEditando(null);
    setFormData({ nome: "", descricao: "", ordem: "" });
    setMostrarModal(true);
  };

  const abrirModalEditar = (convenio) => {
    setConvenioEditando(convenio);
    setFormData({
      nome: convenio.nome,
      descricao: convenio.descricao || "",
      ordem: convenio.ordem || "",
    });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setConvenioEditando(null);
    setFormData({ nome: "", descricao: "", ordem: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert("Nome do convênio é obrigatório!");
      return;
    }

    try {
      if (convenioEditando) {
        await atualizarConvenio(convenioEditando.id, formData);
        alert("Convênio atualizado com sucesso!");
      } else {
        await criarConvenio(formData);
        alert("Convênio criado com sucesso!");
      }

      fecharModal();
      await carregarConvenios();

      if (refreshSystemData) await refreshSystemData();
    } catch (erro) {
      console.error("Erro ao salvar:", erro);
      alert(erro.message || "Erro ao salvar convênio");
    }
  };

  const handleToggleAtivo = async (convenio) => {
    const novoStatus = !convenio.ativa;
    const confirmacao = window.confirm(
      `Deseja realmente ${novoStatus ? "ativar" : "desativar"} o convênio "${convenio.nome}"?`
    );

    if (!confirmacao) return;

    try {
      await toggleConvenioAtivo(convenio.id, novoStatus);
      alert(`Convênio ${novoStatus ? "ativado" : "desativado"} com sucesso!`);

      await carregarConvenios();
      if (refreshSystemData) await refreshSystemData();
    } catch (erro) {
      console.error("Erro ao alterar status:", erro);
      alert(erro.message || "Erro ao alterar status");
    }
  };

  if (carregando) {
    return (
      <div className="gc-container">
        <div className="gc-header">
          <div className="gc-header-left">
            <button
              className="gc-btn-voltar"
              onClick={() => navigate("/admin/cadastros")}
            >
              ← Voltar
            </button>
            <div className="gc-header-text">
              <h1>🏦 Convênios</h1>
              <p className="gc-subtitulo">Gerenciar tipos de convênio disponíveis</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gc-container">
      <div className="gc-header">
        <div className="gc-header-left">
          <button
            className="gc-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            ← Voltar
          </button>
          <div className="gc-header-text">
            <h1>🏦 Convênios</h1>
            <p className="gc-subtitulo">Gerenciar tipos de convênio disponíveis</p>
          </div>
        </div>
      </div>

      <div className="gc-acoes">
        <button className="gc-btn-novo" onClick={abrirModalNovo}>
          + Novo Convênio
        </button>

        <div className="gc-filtros">
          <label>
            <input
              type="radio"
              value="ativas"
              checked={filtro === "ativas"}
              onChange={(e) => setFiltro(e.target.value)}
            />
            Apenas Ativos
          </label>
          <label>
            <input
              type="radio"
              value="todas"
              checked={filtro === "todas"}
              onChange={(e) => setFiltro(e.target.value)}
            />
            Todos
          </label>
        </div>
      </div>

      {convenios.length === 0 ? (
        <div className="gc-vazio">
          <p>Nenhum convênio cadastrado</p>
          <button className="gc-btn-novo" onClick={abrirModalNovo}>
            + Cadastrar Primeiro Convênio
          </button>
        </div>
      ) : (
        <div className="gc-tabela-container">
          <table className="gc-tabela">
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
              {convenios.map((convenio) => (
                <tr
                  key={convenio.id}
                  className={!convenio.ativa ? "gc-inativa" : ""}
                >
                  <td>{convenio.ordem || "-"}</td>
                  <td className="gc-nome">{convenio.nome}</td>
                  <td className="gc-descricao">{convenio.descricao || "-"}</td>
                  <td>
                    <span
                      className={`gc-status ${convenio.ativa ? "ativa" : "inativa"}`}
                    >
                      {convenio.ativa ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className="gc-acoes-linha">
                      <button
                        className="gc-btn-editar"
                        onClick={() => abrirModalEditar(convenio)}
                        title="Editar"
                      >
                        Editar
                      </button>
                      <button
                        className={`gc-btn-toggle ${convenio.ativa ? "desativar" : "ativar"}`}
                        onClick={() => handleToggleAtivo(convenio)}
                        title={convenio.ativa ? "Desativar" : "Ativar"}
                      >
                        {convenio.ativa ? "Desativar" : "Ativar"}
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
        <div className="gc-modal-overlay" onClick={fecharModal}>
          <div className="gc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gc-modal-header">
              <h2>
                {convenioEditando
                  ? "Editar Convênio"
                  : "Novo Convênio"}
              </h2>
              <button className="gc-modal-fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="gc-modal-form">
              <div className="gc-campo">
                <label>Nome do Convênio *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: SUS, Unimed, Amil..."
                  maxLength={100}
                  autoFocus
                  required
                />
              </div>

              <div className="gc-campo">
                <label>Descrição (opcional)</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Descrição ou observação sobre o convênio"
                  rows={3}
                />
              </div>

              <div className="gc-campo">
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

              <div className="gc-modal-acoes">
                <button
                  type="button"
                  className="gc-btn-cancelar"
                  onClick={fecharModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="gc-btn-salvar">
                  {convenioEditando ? "Salvar Alterações" : "Criar Convênio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoConvenios;