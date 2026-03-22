import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  listarTiposAcompanhante,
  criarTipoAcompanhante,
  atualizarTipoAcompanhante,
  toggleTipoAcompanhante,
  listarRefeicoes,
} from "../../services/api";
import "./GestaoTiposAcompanhante.css";
import ModalAlerta from "../../components/common/ModalAlerta/ModalAlerta";
import useModalAlerta from "../../hooks/useModalAlerta";

const formInicial = {
  codigo: "",
  nome: "",
  descricao: "",
  emoji: "👤",
  ordem: "",
  ativo: true,
  refeicoesPermitidasIds: [],
};

function GestaoTiposAcompanhante() {
  const navigate = useNavigate();
  const { refreshSystemData } = useOutletContext() || {};

  const [tipos, setTipos] = useState([]);
  const [refeicoes, setRefeicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [filtro, setFiltro] = useState("ativos");
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState(formInicial);

  const {
    modal,
    fecharModal: fecharModalAlerta,
    mostrarAlerta,
    mostrarConfirmacao,
  } = useModalAlerta();

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const [respostaTipos, respostaRefeicoes] = await Promise.all([
        listarTiposAcompanhante(filtro === "todas"),
        listarRefeicoes(true),
      ]);

      setTipos(respostaTipos.tipos || []);
      setRefeicoes(
        (respostaRefeicoes.refeicoes || []).map((item) => ({
          ...item,
          ativa: !!item.ativa,
        })),
      );
    } catch (erro) {
      console.error("Erro ao carregar tipos de acompanhante:", erro);
      mostrarAlerta({
        titulo: "Erro ao carregar dados",
        mensagem: erro.message || "Erro ao carregar tipos de acompanhante",
        tipo: "erro",
      });
    } finally {
      setCarregando(false);
    }
  };

  const refeicoesAtivas = useMemo(
    () => refeicoes.filter((refeicao) => refeicao.ativa),
    [refeicoes],
  );

  const abrirModalNovo = () => {
    setTipoEditando(null);
    setFormData(formInicial);
    setMostrarModal(true);
  };

  const abrirModalEditar = (tipo) => {
    setTipoEditando(tipo);
    setFormData({
      codigo: tipo.codigo || "",
      nome: tipo.nome || "",
      descricao: tipo.descricao || "",
      emoji: tipo.emoji || "👤",
      ordem: tipo.ordem ?? "",
      ativo: !!tipo.ativo,
      refeicoesPermitidasIds: (tipo.refeicoesPermitidas || []).map((item) =>
        Number(item.id),
      ),
    });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    if (salvando) return;
    setMostrarModal(false);
    setTipoEditando(null);
    setFormData(formInicial);
  };

  const handleInputChange = (campo, valor) => {
    setFormData((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const handleCodigoChange = (valor) => {
    const normalizado = String(valor || "")
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_-]/g, "");

    handleInputChange("codigo", normalizado);
  };

  const handleToggleRefeicao = (refeicaoId) => {
    const id = Number(refeicaoId);

    setFormData((anterior) => {
      const jaExiste = anterior.refeicoesPermitidasIds.includes(id);
      return {
        ...anterior,
        refeicoesPermitidasIds: jaExiste
          ? anterior.refeicoesPermitidasIds.filter((item) => item !== id)
          : [...anterior.refeicoesPermitidasIds, id],
      };
    });
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      mostrarAlerta({
        titulo: "Campo obrigatório",
        mensagem: "Nome é obrigatório.",
        tipo: "erro",
      });
      return false;
    }

    if (!formData.codigo.trim()) {
      mostrarAlerta({
        titulo: "Campo obrigatório",
        mensagem: "Código é obrigatório.",
        tipo: "erro",
      });
      return false;
    }

    if (!/^[a-z0-9_-]+$/.test(formData.codigo.trim())) {
      mostrarAlerta({
        titulo: "Código inválido",
        mensagem: "Use apenas letras minúsculas, números, hífen ou underline.",
        tipo: "erro",
      });
      return false;
    }

    if (!formData.refeicoesPermitidasIds.length) {
      mostrarAlerta({
        titulo: "Campo obrigatório",
        mensagem: "Selecione ao menos uma refeição permitida.",
        tipo: "erro",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const payload = {
      codigo: formData.codigo.trim(),
      nome: formData.nome.trim(),
      descricao: formData.descricao.trim(),
      emoji: formData.emoji.trim() || "👤",
      ordem: formData.ordem === "" ? 0 : Number(formData.ordem),
      ativo: !!formData.ativo,
      refeicoesPermitidasIds: formData.refeicoesPermitidasIds,
    };

    setSalvando(true);
    try {
      if (tipoEditando) {
        await atualizarTipoAcompanhante(tipoEditando.id, payload);
        mostrarAlerta({
          titulo: "Sucesso",
          mensagem: "Tipo de acompanhante atualizado com sucesso!",
          tipo: "sucesso",
        });
      } else {
        await criarTipoAcompanhante(payload);
        mostrarAlerta({
          titulo: "Sucesso",
          mensagem: "Tipo de acompanhante criado com sucesso!",
          tipo: "sucesso",
        });
      }

      fecharModal();
      await carregarDados();
      if (refreshSystemData) await refreshSystemData();
    } catch (erro) {
      console.error("Erro ao salvar tipo de acompanhante:", erro);
      mostrarAlerta({
        titulo: "Erro ao salvar",
        mensagem: erro.message || "Erro ao salvar tipo de acompanhante",
        tipo: "erro",
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleToggleAtivo = (tipo) => {
    const novoStatus = !tipo.ativo;

    mostrarConfirmacao({
      titulo: novoStatus
        ? "Ativar tipo de acompanhante"
        : "Desativar tipo de acompanhante",
      mensagem: `Deseja realmente ${novoStatus ? "ativar" : "desativar"} o tipo de acompanhante "${tipo.nome}"?`,
      tipo: novoStatus ? "confirmar" : "perigo",
      textoBotaoConfirmar: novoStatus ? "Ativar" : "Desativar",
      textoBotaoCancelar: "Cancelar",
      onConfirmar: async () => {
        try {
          await toggleTipoAcompanhante(tipo.id, novoStatus);

          mostrarAlerta({
            titulo: "Sucesso",
            mensagem: `Tipo de acompanhante ${novoStatus ? "ativado" : "desativado"} com sucesso!`,
            tipo: "sucesso",
          });

          await carregarDados();
          if (refreshSystemData) await refreshSystemData();
        } catch (erro) {
          console.error("Erro ao alterar status:", erro);
          mostrarAlerta({
            titulo: "Erro ao alterar status",
            mensagem:
              erro.message || "Erro ao alterar status do tipo de acompanhante",
            tipo: "erro",
          });
        }
      },
    });
  };

  const renderResumoRefeicoes = (tipo) => {
    const lista = tipo.refeicoesPermitidas || [];
    if (!lista.length) return "-";
    return lista.map((item) => item.nome).join(", ");
  };

  if (carregando) {
    return (
      <div className="gta-container">
        <div className="gta-header">
          <div className="gta-header-left">
            <button
              className="gta-btn-voltar"
              onClick={() => navigate("/admin/cadastros")}
            >
              ← Voltar
            </button>
            <div className="gta-header-text">
              <h1>🧍 Tipos de Acompanhante</h1>
              <p className="gta-subtitulo">
                Gerencie os tipos de acompanhante e as refeições permitidas
              </p>
            </div>
          </div>
        </div>

        <div className="gta-carregando">⏳ Carregando...</div>
      </div>
    );
  }

  return (
    <div className="gta-container">
      <div className="gta-header">
        <div className="gta-header-left">
          <button
            className="gta-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            ← Voltar
          </button>
          <div className="gta-header-text">
            <h1>🧍 Tipos de Acompanhante</h1>
            <p className="gta-subtitulo">
              Gerencie os tipos de acompanhante e as refeições permitidas
            </p>
          </div>
        </div>
      </div>

      <div className="gta-info-box">
        <p>
          Use este cadastro para controlar quais tipos de acompanhante podem ser
          usados na prescrição. Você pode ativar, desativar e definir quais
          refeições cada tipo pode receber.
        </p>
      </div>

      <div className="gta-acoes">
        <button className="gta-btn-novo" onClick={abrirModalNovo}>
          + Novo Tipo
        </button>

        <div className="gta-filtros">
          <label>
            <input
              type="radio"
              value="ativos"
              checked={filtro === "ativos"}
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

      {tipos.length === 0 ? (
        <div className="gta-vazio">
          <p>📭 Nenhum tipo de acompanhante cadastrado.</p>
          <button className="gta-btn-novo" onClick={abrirModalNovo}>
            + Cadastrar Primeiro Tipo
          </button>
        </div>
      ) : (
        <div className="gta-tabela-container">
          <table className="gta-tabela">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Emoji</th>
                <th>Nome</th>
                <th>Código</th>
                <th>Refeições Permitidas</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => (
                <tr key={tipo.id} className={!tipo.ativo ? "gta-inativa" : ""}>
                  <td>{tipo.ordem ?? 0}</td>
                  <td>
                    <span className="gta-emoji-cell">{tipo.emoji || "👤"}</span>
                  </td>
                  <td className="gta-nome">{tipo.nome}</td>
                  <td>
                    <code className="gta-codigo">{tipo.codigo}</code>
                  </td>
                  <td>
                    <div className="gta-refeicoes-resumo">
                      <span className="gta-refeicoes-count">
                        {(tipo.refeicoesPermitidas || []).length} refeição(ões)
                      </span>
                      <span className="gta-refeicoes-texto">
                        {renderResumoRefeicoes(tipo)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`gta-status ${tipo.ativo ? "ativa" : "inativa"}`}
                    >
                      {tipo.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <div className="gta-acoes-linha">
                      <button
                        className="gta-btn-editar"
                        onClick={() => abrirModalEditar(tipo)}
                      >
                        Editar
                      </button>
                      <button
                        className={`gta-btn-toggle ${tipo.ativo ? "desativar" : "ativar"}`}
                        onClick={() => handleToggleAtivo(tipo)}
                      >
                        {tipo.ativo ? "Desativar" : "Ativar"}
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
        <div className="gta-modal-overlay" onClick={fecharModal}>
          <div className="gta-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gta-modal-header">
              <h2>
                {tipoEditando
                  ? "Editar Tipo de Acompanhante"
                  : "Novo Tipo de Acompanhante"}
              </h2>
              <button className="gta-modal-fechar" onClick={fecharModal}>
                ✕
              </button>
            </div>

            <form className="gta-modal-form" onSubmit={handleSubmit}>
              <div className="gta-form-grid gta-form-grid-2">
                <div className="gta-campo">
                  <label>Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Ex: Gestante"
                    maxLength={100}
                    required
                  />
                </div>

                <div className="gta-campo">
                  <label>Código *</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleCodigoChange(e.target.value)}
                    placeholder="Ex: gestante"
                    maxLength={50}
                    required
                  />
                  <small>
                    Use apenas letras minúsculas, números, hífen ou underline.
                  </small>
                </div>
              </div>

              <div className="gta-form-grid gta-form-grid-3">
                <div className="gta-campo">
                  <label>Emoji</label>
                  <input
                    type="text"
                    value={formData.emoji}
                    onChange={(e) => handleInputChange("emoji", e.target.value)}
                    placeholder="👤"
                    maxLength={20}
                  />
                </div>

                <div className="gta-campo">
                  <label>Ordem</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ordem}
                    onChange={(e) => handleInputChange("ordem", e.target.value)}
                    placeholder="0"
                  />
                </div>

                <div className="gta-campo gta-campo-checkbox-inline">
                  <label>Status inicial</label>
                  <label className="gta-switch-label">
                    <input
                      type="checkbox"
                      checked={!!formData.ativo}
                      onChange={(e) =>
                        handleInputChange("ativo", e.target.checked)
                      }
                    />
                    <span>{formData.ativo ? "Ativo" : "Inativo"}</span>
                  </label>
                </div>
              </div>

              <div className="gta-campo">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) =>
                    handleInputChange("descricao", e.target.value)
                  }
                  rows="3"
                  placeholder="Descrição opcional do tipo de acompanhante"
                  maxLength={150}
                />
              </div>

              <div className="gta-campo">
                <label>Refeições Permitidas *</label>
                {refeicoesAtivas.length === 0 ? (
                  <div className="gta-refeicoes-vazio">
                    Nenhuma refeição ativa disponível para vincular.
                  </div>
                ) : (
                  <div className="gta-refeicoes-grid">
                    {refeicoesAtivas.map((refeicao) => {
                      const selecionada =
                        formData.refeicoesPermitidasIds.includes(
                          Number(refeicao.id),
                        );

                      return (
                        <label
                          key={refeicao.id}
                          className={`gta-refeicao-item ${selecionada ? "selecionada" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={selecionada}
                            onChange={() => handleToggleRefeicao(refeicao.id)}
                          />
                          <div className="gta-refeicao-conteudo">
                            <span className="gta-refeicao-nome">
                              {refeicao.nome}
                            </span>
                            <span className="gta-refeicao-meta">
                              Ordem {refeicao.ordem ?? 0}
                              {refeicao.grupo_dia
                                ? ` • ${refeicao.grupo_dia === "atual" ? "Dia atual" : "Dia seguinte"}`
                                : ""}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="gta-modal-acoes">
                <button
                  type="button"
                  className="gta-btn-cancelar"
                  onClick={fecharModal}
                  disabled={salvando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="gta-btn-salvar"
                  disabled={salvando}
                >
                  {salvando
                    ? "Salvando..."
                    : tipoEditando
                      ? "Salvar Alterações"
                      : "Criar Tipo"}
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

export default GestaoTiposAcompanhante;
