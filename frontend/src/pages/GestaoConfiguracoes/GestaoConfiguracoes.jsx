// frontend/src/pages/GestaoConfiguracoes/GestaoConfiguracoes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buscarConfiguracoes, atualizarConfiguracao } from "../../services/api";
import "./GestaoConfiguracoes.css";

function GestaoConfiguracoes() {
  const navigate = useNavigate();

  const [horaCorte, setHoraCorte] = useState("12:00");
  const [horaCorteOriginal, setHoraCorteOriginal] = useState("12:00");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null); // { tipo: 'sucesso'|'erro', texto }

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    setCarregando(true);
    try {
      const resposta = await buscarConfiguracoes();
      if (resposta.sucesso) {
        const cfg = resposta.configuracoes.find(
          (c) => c.chave === "hora_corte",
        );
        if (cfg) {
          setHoraCorte(cfg.valor);
          setHoraCorteOriginal(cfg.valor);
        }
      }
    } catch (erro) {
      console.error("Erro ao carregar configurações:", erro);
      setMensagem({ tipo: "erro", texto: "Erro ao carregar configurações." });
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvar = async () => {
    if (salvando) return;

    // Validar formato HH:MM
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(horaCorte)) {
      setMensagem({
        tipo: "erro",
        texto: "Formato inválido. Use HH:MM (ex: 12:00)",
      });
      return;
    }

    setSalvando(true);
    setMensagem(null);
    try {
      await atualizarConfiguracao("hora_corte", horaCorte);
      setHoraCorteOriginal(horaCorte);
      setMensagem({
        tipo: "sucesso",
        texto: `Hora de corte atualizada para ${horaCorte} com sucesso!`,
      });
    } catch (erro) {
      setMensagem({
        tipo: "erro",
        texto: erro.message || "Erro ao salvar configuração.",
      });
    } finally {
      setSalvando(false);
    }
  };

  const horaAlterada = horaCorte !== horaCorteOriginal;

  return (
    <div className="gcfg-container">
      <div className="gcfg-header">
        <div className="gcfg-header-left">
          <button
            className="gcfg-btn-voltar"
            onClick={() => navigate("/admin/cadastros")}
          >
            ← Voltar
          </button>
          <div>
            <h1 className="gcfg-titulo">⚙️ Configurações do Sistema</h1>
            <p className="gcfg-subtitulo">Parâmetros gerais de funcionamento</p>
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="gcfg-loading">Carregando configurações...</div>
      ) : (
        <div className="gcfg-cards">
          {/* Card: Hora de Corte */}
          <div className="gcfg-card">
            <div className="gcfg-card-header">
              <span className="gcfg-card-icone">🕐</span>
              <div>
                <h2 className="gcfg-card-titulo">Horário de Corte</h2>
                <p className="gcfg-card-desc">
                  Define até que horas as prescrições do dia seguem o fluxo
                  padrão.
                </p>
              </div>
            </div>

            <div className="gcfg-card-body">
              <div className="gcfg-campo">
                <label htmlFor="hora-corte">Hora de corte</label>
                <input
                  id="hora-corte"
                  type="time"
                  value={horaCorte}
                  onChange={(e) => {
                    setHoraCorte(e.target.value);
                    setMensagem(null);
                  }}
                  className="gcfg-input-hora"
                />
              </div>

              {/* Explicação visual do impacto */}
              <div className="gcfg-explicacao">
                <h4>Como funciona com o horário atual ({horaCorte}):</h4>
                <div className="gcfg-fluxo">
                  <div className="gcfg-fluxo-grupo">
                    <strong>Prescrições até {horaCorte}:</strong>
                    <div className="gcfg-fluxo-itens">
                      <span className="gcfg-tag dia-atual">
                        Merenda / Jantar / Ceia → Hoje
                      </span>
                      <span className="gcfg-tag dia-proximo">
                        Desjejum / Colação / Almoço → Amanhã
                      </span>
                    </div>
                  </div>
                  <div className="gcfg-fluxo-grupo">
                    <strong>Prescrições após {horaCorte}:</strong>
                    <div className="gcfg-fluxo-itens">
                      <span className="gcfg-tag dia-atual">
                        Merenda / Jantar / Ceia → Amanhã
                      </span>
                      <span className="gcfg-tag dia-proximo">
                        Desjejum / Colação / Almoço → Depois de amanhã
                      </span>
                    </div>
                  </div>
                </div>
                <p className="gcfg-obs">
                  * Os grupos "Dia Atual" e "Dia Seguinte" são configurados em
                  cada tipo de refeição individualmente.
                </p>
              </div>

              {mensagem && (
                <div className={`gcfg-mensagem gcfg-mensagem-${mensagem.tipo}`}>
                  {mensagem.tipo === "sucesso" ? "✅" : "❌"} {mensagem.texto}
                </div>
              )}

              <div className="gcfg-acoes">
                <button
                  className="gcfg-btn-salvar"
                  onClick={handleSalvar}
                  disabled={salvando || !horaAlterada}
                >
                  {salvando ? "⏳ Salvando..." : "💾 Salvar Alterações"}
                </button>
                {horaAlterada && (
                  <button
                    className="gcfg-btn-cancelar"
                    onClick={() => {
                      setHoraCorte(horaCorteOriginal);
                      setMensagem(null);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoConfiguracoes;
