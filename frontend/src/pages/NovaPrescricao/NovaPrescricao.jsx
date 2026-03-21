import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./NovaPrescricao.css";
import ModalConfirmacao from "../../components/common/ModalConfirmacao";
import FormularioPaciente from "../../components/forms/FormularioPaciente";
import SeletorAcrescimos from "../../features/prescricao/components/SeletorAcrescimos";
import { criarPrescricao } from "../../services/api";
import SeletorItensEspeciais from "../../features/prescricao/components/SeletorItensEspeciais/SeletorItensEspeciais";
import SecaoAcompanhante from "../../features/prescricao/components/SecaoAcompanhante/SecaoAcompanhante";

function NovaPrescricao() {
  const {
    nucleos = {},
    dietas = [],
    restricoes = [],
    tiposAlimentacao = [],
    convenios = [],
  } = useOutletContext() || {};

  const [formData, setFormData] = useState({
    cpf: "",
    codigoAtendimento: "",
    convenio: "",
    nomePaciente: "",
    nomeMae: "",
    dataNascimento: "",
    idade: "",
    nucleoSelecionado: "",
    leito: "",
    refeicoesSelecionadas: [],
    temAcompanhante: false,
    tipoAcompanhante: "",
    acompanhanteRefeicoes: [],
    acompanhanteRestricoesIds: [],
    acompanhanteObsLivre: "",
  });

  const [configRefeicoes, setConfigRefeicoes] = useState({});
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [dadosParaConfirmar, setDadosParaConfirmar] = useState(null);
  const [toast, setToast] = useState({
    visivel: false,
    mensagem: "",
    tipo: "",
  });

  // ============================================
  // TOAST CUSTOMIZADO
  // ============================================
  const mostrarToast = (mensagem, tipo = "sucesso") => {
    setToast({ visivel: true, mensagem, tipo });
    setTimeout(() => {
      setToast({ visivel: false, mensagem: "", tipo: "" });
    }, 4000);
  };

  // ============================================
  // FUNÇÃO DE ORDENAÇÃO NATURAL DE LEITOS
  // ============================================
  const ordenarLeitosNatural = (leitos) => {
    return [...leitos].sort((a, b) => {
      const regex = /(\d+)|(\D+)/g;
      const aParts = String(a).match(regex) || [];
      const bParts = String(b).match(regex) || [];

      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || "";
        const bPart = bParts[i] || "";

        const aNum = parseInt(aPart);
        const bNum = parseInt(bPart);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          if (aNum !== bNum) return aNum - bNum;
        } else {
          const comp = aPart.localeCompare(bPart);
          if (comp !== 0) return comp;
        }
      }
      return 0;
    });
  };

  // ============================================
  // HANDLERS DE FORMULÁRIO
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nucleoSelecionado") {
      setFormData((prev) => ({
        ...prev,
        nucleoSelecionado: value,
        leito: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRefeicaoToggle = (refeicao) => {
    const refeicoesAtuais = [...formData.refeicoesSelecionadas];
    const index = refeicoesAtuais.indexOf(refeicao);

    if (index > -1) {
      refeicoesAtuais.splice(index, 1);
      const novaConfig = { ...configRefeicoes };
      delete novaConfig[refeicao];
      setConfigRefeicoes(novaConfig);
    } else {
      refeicoesAtuais.push(refeicao);
      setConfigRefeicoes({
        ...configRefeicoes,
        [refeicao]: {
          dieta: "",
          restricoes: [],
          semPrincipal: false,
          descricaoSemPrincipal: "",
          obsExclusao: "",
          acrescimosIds: [],
          itensEspeciaisIds: [],
        },
      });
    }

    setFormData({
      ...formData,
      refeicoesSelecionadas: refeicoesAtuais,
    });
  };

  const handleDietaRefeicao = (refeicao, dieta) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        dieta: dieta,
      },
    });
  };

  const handleRestricaoRefeicao = (refeicao, restricao) => {
    const restricoesAtuais = configRefeicoes[refeicao].restricoes;
    const novasRestricoes = restricoesAtuais.includes(restricao)
      ? restricoesAtuais.filter((r) => r !== restricao)
      : [...restricoesAtuais, restricao];

    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        restricoes: novasRestricoes,
      },
    });
  };

  const handleSemPrincipalToggle = (refeicao) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        semPrincipal: !configRefeicoes[refeicao].semPrincipal,
        descricaoSemPrincipal: !configRefeicoes[refeicao].semPrincipal
          ? configRefeicoes[refeicao].descricaoSemPrincipal
          : "",
      },
    });
  };

  const handleDescricaoSemPrincipal = (refeicao, descricao) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        descricaoSemPrincipal: descricao,
      },
    });
  };

  const handleObsExclusao = (refeicao, obs) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        obsExclusao: obs,
      },
    });
  };

  const handleAcrescimosChange = (refeicao, acrescimosIds) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        acrescimosIds: acrescimosIds,
      },
    });
  };

  const handleItensEspeciaisChange = (refeicao, ids) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        itensEspeciaisIds: ids,
      },
    });
  };

  const handleAcompanhanteChange = (dadosAcompanhante) => {
    setFormData((prev) => ({
      ...prev,
      ...dadosAcompanhante,
    }));
  };

  // ============================================
  // VALIDAÇÃO E SUBMIT
  // ============================================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Bloquear se código de atendimento está duplicado
    const codigoErro = document.querySelector(
      '[style*="color: rgb(220, 38, 38)"]',
    );
    if (codigoErro && codigoErro.textContent.includes("Código já utilizado")) {
      alert(
        "O código de atendimento já está em uso por outro paciente! Corrija antes de continuar.",
      );
      return;
    }

    if (
      !formData.cpf ||
      !formData.codigoAtendimento ||
      !formData.convenio ||
      !formData.nomePaciente ||
      !formData.nomeMae ||
      !formData.dataNascimento ||
      !formData.nucleoSelecionado ||
      !formData.leito
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    if (formData.codigoAtendimento.length !== 7) {
      alert("O código de atendimento deve ter exatamente 7 dígitos!");
      return;
    }

    if (formData.refeicoesSelecionadas.length === 0) {
      alert("Selecione pelo menos uma refeição!");
      return;
    }

    for (const refeicao of formData.refeicoesSelecionadas) {
      const config = configRefeicoes[refeicao];
      const refeicaoObj = tiposAlimentacao.find(
        (t) => (typeof t === "string" ? t : t.nome) === refeicao,
      );
      const isEspecial = !!refeicaoObj?.tem_lista_personalizada;

      if (!isEspecial && !config?.dieta) {
        alert(`Selecione a dieta para ${refeicao}!`);
        return;
      }

      if (
        isEspecial &&
        (!config?.itensEspeciaisIds || config.itensEspeciaisIds.length === 0)
      ) {
        alert(`Selecione pelo menos um produto para ${refeicao}!`);
        return;
      }
    }

    const refeicoes = formData.refeicoesSelecionadas.map((refeicao) => {
      const refeicaoObj = tiposAlimentacao.find(
        (t) => (typeof t === "string" ? t : t.nome) === refeicao,
      );
      const isEspecial = refeicaoObj?.tem_lista_personalizada;
      const config = configRefeicoes[refeicao];

      return {
        tipo: refeicao,
        isEspecial: isEspecial || false,
        refeicaoId: refeicaoObj?.id || null,
        dieta: config?.dieta || "",
        restricoes: config?.restricoes || [],
        semPrincipal: config?.semPrincipal || false,
        descricaoSemPrincipal: config?.descricaoSemPrincipal || "",
        obsExclusao: config?.obsExclusao || "",
        acrescimosIds: config?.acrescimosIds || [],
        itensEspeciaisIds: config?.itensEspeciaisIds || [],
      };
    });

    setDadosParaConfirmar({
      ...formData,
      refeicoes: refeicoes,
    });

    setMostrarConfirmacao(true);
  };

  // ============================================
  // CONFIRMAR E SALVAR NO BD
  // ============================================
  const confirmarAdicao = async () => {
    try {
      const promessas = dadosParaConfirmar.refeicoes.map(async (refeicao) => {
        const partesData = dadosParaConfirmar.dataNascimento.split("/");
        const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

        const prescricao = {
          cpf: dadosParaConfirmar.cpf,
          codigoAtendimento: dadosParaConfirmar.codigoAtendimento,
          convenio: dadosParaConfirmar.convenio,
          nomePaciente: dadosParaConfirmar.nomePaciente,
          nomeMae: dadosParaConfirmar.nomeMae,
          dataNascimento: dataFormatada,
          idade: parseInt(dadosParaConfirmar.idade),
          nucleo: dadosParaConfirmar.nucleoSelecionado,
          leito: dadosParaConfirmar.leito,
          tipoAlimentacao: refeicao.tipo,
          dieta: refeicao.isEspecial ? null : refeicao.dieta,
          restricoes: refeicao.isEspecial ? [] : refeicao.restricoes,
          semPrincipal: refeicao.isEspecial
            ? false
            : refeicao.semPrincipal || false,
          descricaoSemPrincipal: refeicao.isEspecial
            ? ""
            : refeicao.descricaoSemPrincipal || "",
          obsExclusao: refeicao.isEspecial ? "" : refeicao.obsExclusao || "",
          acrescimosIds: refeicao.isEspecial
            ? []
            : refeicao.acrescimosIds || [],
          itensEspeciaisIds: refeicao.isEspecial
            ? refeicao.itensEspeciaisIds || []
            : [],
          temAcompanhante: dadosParaConfirmar.temAcompanhante || false,
          tipoAcompanhante: dadosParaConfirmar.tipoAcompanhante || null,
          acompanhanteRefeicoes: dadosParaConfirmar.acompanhanteRefeicoes || [],
          acompanhanteRestricoesIds:
            dadosParaConfirmar.acompanhanteRestricoesIds || [],
          acompanhanteObsLivre: dadosParaConfirmar.acompanhanteObsLivre || "",
        };

        return await criarPrescricao(prescricao);
      });

      await Promise.all(promessas);

      // Limpar formulário após sucesso
      setFormData({
        cpf: "",
        codigoAtendimento: "",
        convenio: "",
        nomePaciente: "",
        nomeMae: "",
        dataNascimento: "",
        idade: "",
        nucleoSelecionado: "",
        leito: "",
        refeicoesSelecionadas: [],
        temAcompanhante: false,
        tipoAcompanhante: "",
        acompanhanteRefeicoes: [],
        acompanhanteRestricoesIds: [],
        acompanhanteObsLivre: "",
      });
      setConfigRefeicoes({});
      setMostrarConfirmacao(false);
      setDadosParaConfirmar(null);

      mostrarToast(
        `${promessas.length} prescrição(ões) salva(s) com sucesso!`,
        "sucesso",
      );

      document.querySelector('input[name="cpf"]')?.focus();
    } catch (erro) {
      console.error("Erro:", erro);
      mostrarToast(`Erro: ${erro.message}`, "erro");
    }
  };

  const cancelarConfirmacao = () => {
    setMostrarConfirmacao(false);
    setDadosParaConfirmar(null);
  };

  // ============================================
  // LEITOS ORDENADOS
  // ============================================
  const leitosDisponiveis = formData.nucleoSelecionado
    ? ordenarLeitosNatural(nucleos[formData.nucleoSelecionado] || [])
    : [];

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="np-page">
      {/* Header */}
      <header className="np-header">
        <div>
          <h1>Nova Prescrição</h1>
          <p>
            Preencha os dados do paciente e configure as refeições desejadas.
          </p>
        </div>
      </header>

      {/* Formulário */}
      <form className="np-form" onSubmit={handleSubmit}>
        {/* Dados do Paciente (componente externo) */}
        <FormularioPaciente
          formData={formData}
          onChange={handleChange}
          convenios={convenios}
        />

        {/* Núcleo */}
        <div className="np-field">
          <label>Núcleo *</label>
          <select
            name="nucleoSelecionado"
            value={formData.nucleoSelecionado}
            onChange={handleChange}
          >
            <option value="">Selecione o núcleo</option>
            {Object.keys(nucleos).map((nucleo, index) => (
              <option key={index} value={nucleo}>
                {nucleo}
              </option>
            ))}
          </select>
        </div>

        {/* Leito */}
        <div className="np-field">
          <label>Leito *</label>
          <select
            name="leito"
            value={formData.leito}
            onChange={handleChange}
            disabled={!formData.nucleoSelecionado}
          >
            <option value="">Selecione o leito</option>
            {leitosDisponiveis.map((leito, index) => (
              <option key={index} value={leito}>
                {leito}
              </option>
            ))}
          </select>
          {!formData.nucleoSelecionado && (
            <small className="np-info-error">
              Selecione um núcleo primeiro
            </small>
          )}
        </div>

        {/* Refeições */}
        <div className="np-field">
          <label>Refeições * (selecione uma ou mais)</label>
          <div className="np-options-grid np-options-grid-meals">
            {tiposAlimentacao.map((tipo, index) => (
              <label
                key={index}
                className={`np-option ${formData.refeicoesSelecionadas.includes(tipo.nome) ? "selected" : ""} ${tipo.tem_lista_personalizada ? "np-option-special" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={formData.refeicoesSelecionadas.includes(tipo.nome)}
                  onChange={() => handleRefeicaoToggle(tipo.nome)}
                />
                <span>
                  {tipo.nome}
                  {tipo.tem_lista_personalizada ? " ✦" : ""}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Configuração individual de cada refeição */}
        {formData.refeicoesSelecionadas.map((refeicao) => {
          const refeicaoObj = tiposAlimentacao.find(
            (t) => t.nome === refeicao,
          );
          const isEspecial = refeicaoObj?.tem_lista_personalizada;

          return (
            <div
              key={refeicao}
              className={`np-meal-config ${isEspecial ? "np-meal-config-special" : ""}`}
            >
              <h3 className="np-meal-title">
                Configurar: {refeicao}
                {isEspecial && (
                  <span className="np-badge-special">
                    Lista Personalizada
                  </span>
                )}
              </h3>

              {isEspecial ? (
                /* MODO ESPECIAL */
                <div className="np-field">
                  <label>Produtos ({refeicao}) *</label>
                  <SeletorItensEspeciais
                    refeicaoId={refeicaoObj.id}
                    itensSelecionados={
                      configRefeicoes[refeicao]?.itensEspeciaisIds || []
                    }
                    onChange={(ids) =>
                      handleItensEspeciaisChange(refeicao, ids)
                    }
                  />
                </div>
              ) : (
                /* MODO PADRÃO */
                <>
                  {/* Dieta */}
                  <div className="np-field">
                    <label>Dieta * (para {refeicao})</label>
                    <div className="np-options-grid">
                      {dietas.map((dieta) => (
                        <label key={dieta.id} className="np-option">
                          <input
                            type="radio"
                            name={`dieta-${refeicao}`}
                            checked={
                              configRefeicoes[refeicao]?.dieta === dieta.nome
                            }
                            onChange={() =>
                              handleDietaRefeicao(refeicao, dieta.nome)
                            }
                          />
                          <span>{dieta.nome}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Condição Nutricional */}
                  <div className="np-field">
                    <label>Condição nutricional (para {refeicao})</label>
                    <div className="np-options-grid">
                      {restricoes.map((restricao) => (
                        <label key={restricao.id} className="np-option">
                          <input
                            type="checkbox"
                            checked={configRefeicoes[
                              refeicao
                            ]?.restricoes.includes(restricao.nome)}
                            onChange={() =>
                              handleRestricaoRefeicao(refeicao, restricao.nome)
                            }
                          />
                          <span>{restricao.nome}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sem Principal */}
                  <div className="np-field">
                    <label>Sem principal</label>
                    <div className="np-sem-principal-box">
                      <label className="np-option-highlight">
                        <input
                          type="checkbox"
                          checked={
                            configRefeicoes[refeicao]?.semPrincipal || false
                          }
                          onChange={() => handleSemPrincipalToggle(refeicao)}
                        />
                        <span>
                          Paciente NÃO quer o prato principal do cardápio
                        </span>
                      </label>
                    </div>
                    {configRefeicoes[refeicao]?.semPrincipal && (
                      <input
                        type="text"
                        value={
                          configRefeicoes[refeicao]?.descricaoSemPrincipal || ""
                        }
                        onChange={(e) =>
                          handleDescricaoSemPrincipal(refeicao, e.target.value)
                        }
                        placeholder="Descreva o que o paciente quer no lugar do principal"
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          padding: "11px 14px",
                          border: "1px solid #cbd5e1",
                          borderRadius: "12px",
                          fontSize: "0.95rem",
                          fontFamily: "var(--app-font-body)",
                          color: "#0f172a",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    )}
                  </div>

                  {/* Obs Exclusão */}
                  <div className="np-field">
                    <label>Obs exclusão (o que NÃO quer)</label>
                    <input
                      type="text"
                      value={configRefeicoes[refeicao]?.obsExclusao || ""}
                      onChange={(e) =>
                        handleObsExclusao(refeicao, e.target.value)
                      }
                      placeholder="Ex: s/ leite, s/ açúcar"
                    />
                  </div>

                  {/* Acréscimos */}
                  <div className="np-field">
                    <label>Acréscimos (o que quer ALÉM do cardápio)</label>
                    <SeletorAcrescimos
                      acrescimosSelecionados={
                        configRefeicoes[refeicao]?.acrescimosIds || []
                      }
                      onChange={(ids) => handleAcrescimosChange(refeicao, ids)}
                      refeicao={refeicao}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Seção Acompanhante */}
        <SecaoAcompanhante
          dados={formData}
          onChange={handleAcompanhanteChange}
        />

        {/* Botão Submit */}
        <button type="submit" className="np-btn-submit">
          + Criar Prescrição (Enter)
        </button>
      </form>

      {/* Modal de Confirmação */}
      {mostrarConfirmacao && dadosParaConfirmar && (
        <ModalConfirmacao
          dados={dadosParaConfirmar}
          onConfirmar={confirmarAdicao}
          onCancelar={cancelarConfirmacao}
        />
      )}

      {/* Toast */}
      {toast.visivel && (
        <div className={`np-toast-wrapper ${toast.tipo}`}>
          <div className={`np-toast-body ${toast.tipo}`}>
            <div className="np-toast-icon">
              {toast.tipo === "sucesso" ? "✓" : "✕"}
            </div>
            <div className="np-toast-text">
              <strong>
                {toast.tipo === "sucesso" ? "Sucesso!" : "Erro"}
              </strong>
              <span>{toast.mensagem}</span>
            </div>
            <button
              className="np-toast-close"
              onClick={() =>
                setToast({ visivel: false, mensagem: "", tipo: "" })
              }
            >
              ✕
            </button>
          </div>
          <div className="np-toast-progress-track">
            <div className={`np-toast-progress-bar ${toast.tipo}`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default NovaPrescricao;
