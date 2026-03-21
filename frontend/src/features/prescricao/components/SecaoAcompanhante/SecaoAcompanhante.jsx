// frontend/src/components/forms/SecaoAcompanhante/SecaoAcompanhante.jsx
// Componente reutilizável para a seção de acompanhante no formulário de prescrição
import React, { useState, useEffect } from 'react';
import { listarRestricoesAcompanhante } from '../../../../services/api';
import './SecaoAcompanhante.css';

// Refeições permitidas por tipo de acompanhante
const REFEICOES_ADULTO = ['Desjejum', 'Almoço', 'Janta'];
const REFEICOES_CRIANCA_IDOSO = ['Desjejum', 'Colação', 'Almoço', 'Merenda', 'Janta', 'Ceia'];

function SecaoAcompanhante({ dados, onChange }) {
  const [restricoesDisponiveis, setRestricoesDisponiveis] = useState([]);

  // Carregar condições nutricionais do acompanhante do BD
  useEffect(() => {
    const carregar = async () => {
      try {
        const resposta = await listarRestricoesAcompanhante();
        if (resposta.sucesso) {
          setRestricoesDisponiveis(resposta.restricoes);
        }
      } catch (erro) {
        console.error('Erro ao carregar condições nutricionais do acompanhante:', erro);
      }
    };
    carregar();
  }, []);

  // Determinar refeições disponíveis com base no tipo
  const refeicoesPermitidas = dados.tipoAcompanhante === 'adulto'
    ? REFEICOES_ADULTO
    : REFEICOES_CRIANCA_IDOSO;

  // Handlers
  const handleToggleAcompanhante = () => {
    if (dados.temAcompanhante) {
      // Desligando: limpar tudo
      onChange({
        temAcompanhante: false,
        tipoAcompanhante: '',
        acompanhanteRefeicoes: [],
        acompanhanteRestricoesIds: [],
        acompanhanteObsLivre: ''
      });
    } else {
      onChange({
        temAcompanhante: true,
        tipoAcompanhante: '',
        acompanhanteRefeicoes: [],
        acompanhanteRestricoesIds: [],
        acompanhanteObsLivre: ''
      });
    }
  };

  const handleTipoChange = (tipo) => {
    // Ao mudar tipo, limpar refeições selecionadas que não são mais válidas
    const novasRefeicoesPermitidas = tipo === 'adulto' ? REFEICOES_ADULTO : REFEICOES_CRIANCA_IDOSO;
    const refeicoesFiltradas = (dados.acompanhanteRefeicoes || []).filter(r => novasRefeicoesPermitidas.includes(r));

    onChange({
      ...dados,
      tipoAcompanhante: tipo,
      acompanhanteRefeicoes: refeicoesFiltradas
    });
  };

  const handleRefeicaoToggle = (refeicao) => {
    const atuais = dados.acompanhanteRefeicoes || [];
    const novas = atuais.includes(refeicao)
      ? atuais.filter(r => r !== refeicao)
      : [...atuais, refeicao];

    onChange({
      ...dados,
      acompanhanteRefeicoes: novas
    });
  };

  const handleRestricaoToggle = (restricaoId) => {
    const atuais = dados.acompanhanteRestricoesIds || [];
    const novas = atuais.includes(restricaoId)
      ? atuais.filter(id => id !== restricaoId)
      : [...atuais, restricaoId];

    onChange({
      ...dados,
      acompanhanteRestricoesIds: novas
    });
  };

  const handleObsLivreChange = (valor) => {
    onChange({
      ...dados,
      acompanhanteObsLivre: valor
    });
  };

  // Montar texto da dieta para preview
  const getDietaTexto = () => {
    const restricoesSelecionadas = restricoesDisponiveis
      .filter(r => (dados.acompanhanteRestricoesIds || []).includes(r.id))
      .map(r => r.nome);

    if (restricoesSelecionadas.length === 0) return 'Dieta Normal';
    return `Dieta Normal p/ ${restricoesSelecionadas.join(' + ')}`;
  };

  return (
    <div className="sa-container">
      {/* Toggle principal */}
      <div className="sa-toggle-container">
        <label className={`sa-toggle ${dados.temAcompanhante ? 'ativo' : ''}`}>
          <input
            type="checkbox"
            checked={dados.temAcompanhante}
            onChange={handleToggleAcompanhante}
          />
          <span className="sa-toggle-slider"></span>
          <span className="sa-toggle-label">
            👤 Paciente tem acompanhante
          </span>
        </label>
      </div>

      {/* Seção expandida quando tem acompanhante */}
      {dados.temAcompanhante && (
        <div className="sa-detalhes">
          {/* Tipo de Acompanhante */}
          <div className="sa-campo">
            <label className="sa-label">TIPO DE ACOMPANHANTE *</label>
            <div className="sa-tipo-opcoes">
              {[
                { valor: 'adulto', emoji: '🧑', texto: 'Adulto', desc: '3 refeições' },
                { valor: 'crianca', emoji: '👶', texto: 'Criança', desc: '6 refeições' },
                { valor: 'idoso', emoji: '👴', texto: 'Idoso', desc: '6 refeições' }
              ].map(tipo => (
                <label
                  key={tipo.valor}
                  className={`sa-tipo-card ${dados.tipoAcompanhante === tipo.valor ? 'selecionado' : ''}`}
                >
                  <input
                    type="radio"
                    name="tipoAcompanhante"
                    value={tipo.valor}
                    checked={dados.tipoAcompanhante === tipo.valor}
                    onChange={() => handleTipoChange(tipo.valor)}
                  />
                  <span className="sa-tipo-emoji">{tipo.emoji}</span>
                  <span className="sa-tipo-texto">{tipo.texto}</span>
                  <span className="sa-tipo-desc">{tipo.desc}</span>
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
                  {refeicoesPermitidas.map(refeicao => (
                    <label
                      key={refeicao}
                      className={`sa-refeicao-check ${(dados.acompanhanteRefeicoes || []).includes(refeicao) ? 'selecionado' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={(dados.acompanhanteRefeicoes || []).includes(refeicao)}
                        onChange={() => handleRefeicaoToggle(refeicao)}
                      />
                      <span>{refeicao}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condições Nutricionais do Acompanhante */}
              <div className="sa-campo">
                <label className="sa-label">CONDIÇÕES NUTRICIONAIS DO ACOMPANHANTE (opcional)</label>
                {restricoesDisponiveis.length > 0 ? (
                  <div className="sa-restricoes-grid">
                    {restricoesDisponiveis.map(restricao => (
                      <label
                        key={restricao.id}
                        className={`sa-restricao-check ${(dados.acompanhanteRestricoesIds || []).includes(restricao.id) ? 'selecionado' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={(dados.acompanhanteRestricoesIds || []).includes(restricao.id)}
                          onChange={() => handleRestricaoToggle(restricao.id)}
                        />
                        <span>{restricao.nome}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="sa-aviso">Nenhuma condição nutricional cadastrada. Cadastre em Configurações &gt; Cond. Nutricionais do Acompanhante.</p>
                )}
              </div>

              {/* Campo de texto livre */}
              <div className="sa-campo">
                <label className="sa-label">OBSERVAÇÃO LIVRE (opcional)</label>
                <input
                  type="text"
                  value={dados.acompanhanteObsLivre || ''}
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
