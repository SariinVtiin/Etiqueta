// frontend/src/pages/NovaPrescricao/NovaPrescricao.jsx
// ✅ LIMPO: Removido todo o sistema legado de etiquetas/localStorage
// Agora usa apenas BD via criarPrescricao()
import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./NovaPrescricao.css";
import ModalConfirmacao from "../../components/common/ModalConfirmacao";
import FormularioPaciente from "../../components/forms/FormularioPaciente";
import SeletorAcrescimos from "../../components/forms/SeletorAcrescimos";
import { criarPrescricao } from "../../services/api";
import SeletorItensEspeciais from "../../components/forms/SeletorItensEspeciais/SeletorItensEspeciais";
import SecaoAcompanhante from "../../components/forms/SecaoAcompanhante/SecaoAcompanhante";

function NovaPrescricao() {
  const navigate = useNavigate();
  const {
    nucleos = {},
    dietas = [],
    restricoes = [],
    tiposAlimentacao = [],
    carregandoDados,
    refreshSystemData,
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
          itensEspeciaisIds: [], // ← NOVO
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

    // ✅ NOVO: Bloquear se código de atendimento está duplicado
    // Buscar o status do código via DOM (verificamos pela mensagem de erro visível)
    const codigoErro = document.querySelector(
      '[style*="color: rgb(220, 38, 38)"]',
    );
    if (codigoErro && codigoErro.textContent.includes("Código já utilizado")) {
      alert(
        "❌ O código de atendimento já está em uso por outro paciente! Corrija antes de continuar.",
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
          dieta: refeicao.isEspecial ? null : refeicao.dieta, // ← null para especiais
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

      // ✅ Limpar formulário após sucesso
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
  // LEITOS ORDENADOS EM ORDEM CRESCENTE
  // ============================================
  const leitosDisponiveis = formData.nucleoSelecionado
    ? ordenarLeitosNatural(nucleos[formData.nucleoSelecionado] || [])
    : [];

  return (
    <div className="container">
      <div className="header-principal">
        <h1>Nova Prescrição</h1>
      </div>

      <form className="formulario" onSubmit={handleSubmit}>
        <FormularioPaciente formData={formData} onChange={handleChange} />

        <div className="campo">
          <label>NÚCLEO *</label>
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

        <div className="campo">
          <label>LEITO *</label>
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
            <small className="aviso-erro">
              ⚠️ Selecione um núcleo primeiro
            </small>
          )}
        </div>

        <div className="campo">
          <label>REFEIÇÕES * (selecione uma ou mais)</label>
          <div className="opcoes-check opcoes-check-refeicoes">
            {tiposAlimentacao.map((tipo, index) => (
              <label
                key={index}
                className={`opcao-check ${formData.refeicoesSelecionadas.includes(tipo.nome) ? "selecionado" : ""} ${tipo.tem_lista_personalizada ? "opcao-check-especial" : ""}`}
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

        {/* Configuração individual de cada refeição selecionada */}
        {formData.refeicoesSelecionadas.map((refeicao) => {
          // Verificar se esta refeição tem lista personalizada
          const refeicaoObj = tiposAlimentacao.find((t) => t.nome === refeicao);
          const isEspecial = refeicaoObj?.tem_lista_personalizada;

          return (
            <div
              key={refeicao}
              className={`config-refeicao ${isEspecial ? "config-refeicao-especial" : ""}`}
            >
              <h3 className="titulo-refeicao">
                ⚙️ Configurar: {refeicao}
                {isEspecial && (
                  <span className="badge-lista-especial">
                    ✦ Lista Personalizada
                  </span>
                )}
              </h3>

              {isEspecial ? (
                /* ── MODO ESPECIAL: só mostra seletor de itens ── */
                <div className="campo">
                  <label>PRODUTOS ({refeicao}) *</label>
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
                /* ── MODO PADRÃO: campos normais ── */
                <>
                  <div className="campo">
                    <label>DIETA * (para {refeicao})</label>
                    <div className="opcoes-check">
                      {dietas.map((dieta) => (
                        <label key={dieta.id} className="opcao-check">
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

                  <div className="campo">
                    <label>RESTRIÇÃO ALIMENTAR (para {refeicao})</label>
                    <div className="opcoes-check">
                      {restricoes.map((restricao) => (
                        <label key={restricao.id} className="opcao-check">
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

                  <div className="campo">
                    <label>SEM PRINCIPAL</label>
                    <div className="campo-sem-principal">
                      <label className="opcao-check-destaque">
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
                        style={{ marginTop: "10px" }}
                      />
                    )}
                  </div>

                  <div className="campo">
                    <label>OBS EXCLUSÃO (o que NÃO quer)</label>
                    <input
                      type="text"
                      value={configRefeicoes[refeicao]?.obsExclusao || ""}
                      onChange={(e) =>
                        handleObsExclusao(refeicao, e.target.value)
                      }
                      placeholder="Ex: s/ leite, s/ açúcar"
                    />
                  </div>

                  <div className="campo">
                    <label>ACRÉSCIMOS (o que quer ALÉM do cardápio)</label>
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

        {/* ===== SEÇÃO ACOMPANHANTE ===== */}
        <SecaoAcompanhante
          dados={formData}
          onChange={handleAcompanhanteChange}
        />

        <button type="submit" className="btn-adicionar">
          + Criar Prescrição (Enter)
        </button>
      </form>

      {mostrarConfirmacao && dadosParaConfirmar && (
        <ModalConfirmacao
          dados={dadosParaConfirmar}
          onConfirmar={confirmarAdicao}
          onCancelar={cancelarConfirmacao}
        />
      )}

      {/* ✅ Toast Customizado */}
      {toast.visivel && (
        <div
          style={{
            position: "fixed",
            top: "30px",
            right: "30px",
            zIndex: 9999,
            minWidth: "340px",
            maxWidth: "480px",
            padding: "0",
            borderRadius: "12px",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
            animation: "toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            border:
              toast.tipo === "sucesso"
                ? "1px solid #059669"
                : "1px solid #dc2626",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "18px 22px",
              background:
                toast.tipo === "sucesso"
                  ? "linear-gradient(135deg, #059669, #0d9488)"
                  : "linear-gradient(135deg, #dc2626, #b91c1c)",
              color: "#fff",
            }}
          >
            {/* Ícone */}
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "20px",
              }}
            >
              {toast.tipo === "sucesso" ? "✓" : "✕"}
            </div>

            {/* Texto */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "15px",
                  marginBottom: "2px",
                  letterSpacing: "0.3px",
                }}
              >
                {toast.tipo === "sucesso" ? "Sucesso!" : "Erro"}
              </div>
              <div
                style={{
                  fontSize: "13.5px",
                  opacity: 0.95,
                  lineHeight: "1.4",
                }}
              >
                {toast.mensagem}
              </div>
            </div>

            {/* Botão fechar */}
            <button
              onClick={() =>
                setToast({ visivel: false, mensagem: "", tipo: "" })
              }
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.35)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.2)")
              }
            >
              ✕
            </button>
          </div>

          {/* Barra de progresso */}
          <div
            style={{
              height: "4px",
              background:
                toast.tipo === "sucesso"
                  ? "rgba(5, 150, 105, 0.15)"
                  : "rgba(220, 38, 38, 0.15)",
            }}
          >
            <div
              style={{
                height: "100%",
                background: toast.tipo === "sucesso" ? "#059669" : "#dc2626",
                animation: "toastProgress 4s linear forwards",
                borderRadius: "0 0 0 4px",
              }}
            />
          </div>
        </div>
      )}

      {/* Animações do Toast */}
      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export default NovaPrescricao;
