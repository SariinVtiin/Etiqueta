// frontend/src/components/forms/SecaoAcompanhante/SecaoAcompanhante.jsx
// Componente reutilizável para a seção de acompanhante no formulário de prescrição
import React, { useState, useEffect } from "react";
import {
  listarRestricoesAcompanhante,
  listarTiposAcompanhante,
} from "../../../../services/api";
import "./SecaoAcompanhante.css";

function SecaoAcompanhante({ dados, onChange }) {
  const [restricoesDisponiveis, setRestricoesDisponiveis] = useState([]);

  const [tiposAcompanhante, setTiposAcompanhante] = useState([]);

  // Carregar condições nutricionais do acompanhante do BD
  useEffect(() => {
    const carregar = async () => {
      try {
        const resposta = await listarRestricoesAcompanhante();
        const [respostaRestricoes, respostaTipos] = await Promise.all([
          listarRestricoesAcompanhante(),
          listarTiposAcompanhante(),
        ]);

        if (respostaRestricoes.sucesso) {
          setRestricoesDisponiveis(respostaRestricoes.restricoes);
        }

        if (respostaTipos.sucesso) {
          setTiposAcompanhante(respostaTipos.tipos || []);
        }
        if (resposta.sucesso) {
          setRestricoesDisponiveis(resposta.restricoes);
        }
      } catch (erro) {
        console.error(
          "Erro ao carregar condições nutricionais do acompanhante:",
          erro,
        );
      }
    };
    carregar();
  }, []);

  // Determinar refeições disponíveis com base no tipo
  const tipoSelecionado = tiposAcompanhante.find(
    (t) => t.codigo === dados.tipoAcompanhante,
  );

  const refeicoesPermitidas = tipoSelecionado?.refeicoesPermitidas || [];

  // Handlers
  const handleToggleAcompanhante = () => {
    if (dados.temAcompanhante) {
      // Desligando: limpar tudo
      onChange({
        temAcompanhante: false,
        tipoAcompanhante: "",
        tipoAcompanhanteNome: "",
        acompanhanteRefeicoes: [],
        acompanhanteRestricoesIds: [],
        acompanhanteObsLivre: "",
      });
    } else {
      onChange({
        temAcompanhante: true,
        tipoAcompanhante: "",
        tipoAcompanhanteNome: "",
        acompanhanteRefeicoes: [],
        acompanhanteRestricoesIds: [],
        acompanhanteObsLivre: "",
      });
    }
  };

  const handleTipoChange = (tipoCodigo) => {
    const tipo = tiposAcompanhante.find((t) => t.codigo === tipoCodigo);
    const novasRefeicoesPermitidas = (tipo?.refeicoesPermitidas || []).map(
      (r) => r.nome,
    );
    const refeicoesFiltradas = (dados.acompanhanteRefeicoes || []).filter((r) =>
      novasRefeicoesPermitidas.includes(r),
    );

    onChange({
      ...dados,
      tipoAcompanhante: tipoCodigo,
      tipoAcompanhanteNome: tipo?.nome || tipoCodigo,
      acompanhanteRefeicoes: refeicoesFiltradas,
    });
  };

  const handleRefeicaoToggle = (refeicao) => {
    const atuais = dados.acompanhanteRefeicoes || [];
    const novas = atuais.includes(refeicao)
      ? atuais.filter((r) => r !== refeicao)
      : [...atuais, refeicao];

    onChange({
      ...dados,
      acompanhanteRefeicoes: novas,
    });
  };

  const handleRestricaoToggle = (restricaoId) => {
    const atuais = dados.acompanhanteRestricoesIds || [];
    const novas = atuais.includes(restricaoId)
      ? atuais.filter((id) => id !== restricaoId)
      : [...atuais, restricaoId];

    onChange({
      ...dados,
      acompanhanteRestricoesIds: novas,
    });
  };

  const handleObsLivreChange = (valor) => {
    onChange({
      ...dados,
      acompanhanteObsLivre: valor,
    });
  };

  // Montar texto da dieta para preview
  const getDietaTexto = () => {
    const restricoesSelecionadas = restricoesDisponiveis
      .filter((r) => (dados.acompanhanteRestricoesIds || []).includes(r.id))
      .map((r) => r.nome);

    if (restricoesSelecionadas.length === 0) return "Dieta Normal";
    return `Dieta Normal p/ ${restricoesSelecionadas.join(" + ")}`;
  };

  return (
    <div className="sa-container">
      {/* Toggle principal */}
      <div className="sa-toggle-container">
        <label className={`sa-toggle ${dados.temAcompanhante ? "ativo" : ""}`}>
          <input
            type="checkbox"
            checked={dados.temAcompanhante}
            onChange={handleToggleAcompanhante}
          />
          <span className="sa-toggle-slider"></span>
          <span className="sa-toggle-label">👤 Paciente tem acompanhante</span>
        </label>
      </div>

      {/* Seção expandida quando tem acompanhante */}
      {dados.temAcompanhante && (
        <div className="sa-detalhes">
          {/* Tipo de Acompanhante */}
          <div className="sa-campo">
            <label className="sa-label">TIPO DE ACOMPANHANTE *</label>
            <div className="sa-tipo-opcoes">
              {tiposAcompanhante.map((tipo) => (
                <label
                  key={tipo.id}
                  className={`sa-tipo-card ${dados.tipoAcompanhante === tipo.codigo ? "selecionado" : ""}`}
                >
                  <input
                    type="radio"
                    name="tipoAcompanhante"
                    value={tipo.codigo}
                    checked={dados.tipoAcompanhante === tipo.codigo}
                    onChange={() => handleTipoChange(tipo.codigo)}
                  />
                  <span className="sa-tipo-emoji">{tipo.emoji || "👤"}</span>
                  <span className="sa-tipo-texto">{tipo.nome}</span>
                  <span className="sa-tipo-desc">
                    {tipo.refeicoesPermitidas?.length || 0} refeições
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Refeições do Acompanhante - só mostra se tipo foi selecionado */}
          {dados.tipoAcompanhante && (
            <>
              <div className="sa-campo">
                <label className="sa-label">
                  REFEIÇÕES DO ACOMPANHANTE *
                  <span className="sa-label-dica">
                    (selecione quais refeições prescrever)
                  </span>
                </label>
                <div className="sa-refeicoes-grid">
                  {refeicoesPermitidas.map((refeicao) => (
                    <label
                      key={refeicao.id}
                      className={`sa-refeicao-check ${(dados.acompanhanteRefeicoes || []).includes(refeicao.nome) ? "selecionado" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={(dados.acompanhanteRefeicoes || []).includes(
                          refeicao.nome,
                        )}
                        onChange={() => handleRefeicaoToggle(refeicao.nome)}
                      />
                      <span>{refeicao.nome}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condições Nutricionais do Acompanhante */}
              <div className="sa-campo">
                <label className="sa-label">
                  CONDIÇÕES NUTRICIONAIS DO ACOMPANHANTE (opcional)
                </label>
                {restricoesDisponiveis.length > 0 ? (
                  <div className="sa-restricoes-grid">
                    {restricoesDisponiveis.map((restricao) => (
                      <label
                        key={restricao.id}
                        className={`sa-restricao-check ${(dados.acompanhanteRestricoesIds || []).includes(restricao.id) ? "selecionado" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={(
                            dados.acompanhanteRestricoesIds || []
                          ).includes(restricao.id)}
                          onChange={() => handleRestricaoToggle(restricao.id)}
                        />
                        <span>{restricao.nome}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="sa-aviso">
                    Nenhuma condição nutricional cadastrada. Cadastre em
                    Configurações &gt; Cond. Nutricionais do Acompanhante.
                  </p>
                )}
              </div>

              {/* Campo de texto livre */}
              <div className="sa-campo">
                <label className="sa-label">OBSERVAÇÃO LIVRE (opcional)</label>
                <input
                  type="text"
                  value={dados.acompanhanteObsLivre || ""}
                  onChange={(e) => handleObsLivreChange(e.target.value)}
                  placeholder="Ex: acompanhante precisa de alimentação pastosa"
                  className="sa-input-obs"
                />
              </div>

              {/* Preview da dieta */}
              <div className="sa-preview-dieta">
                <span className="sa-preview-label">Dieta na etiqueta:</span>
                <span className="sa-preview-valor">{getDietaTexto()}</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SecaoAcompanhante;
