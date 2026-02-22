// frontend/src/components/common/ModalConfirmacao/ModalConfirmacao.jsx
// ATUALIZADO: Inclui dados do acompanhante + layout profissional sem emojis
import React from 'react';
import './ModalConfirmacao.css';

function ModalConfirmacao({ dados, onConfirmar, onCancelar }) {

  // Montar texto da dieta do acompanhante
  const getDietaAcompanhante = () => {
    // Se não tem restrições, dieta normal
    if (!dados.acompanhanteRestricoesIds || dados.acompanhanteRestricoesIds.length === 0) {
      return 'Dieta Normal';
    }
    return 'Dieta Normal (com restrições)';
  };

  const getTipoAcompanhanteLabel = (tipo) => {
    const labels = {
      adulto: 'Adulto (3 refeições)',
      crianca: 'Criança (6 refeições)',
      idoso: 'Idoso (6 refeições)'
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="mc-overlay">
      <div className="mc-container">

        {/* Header */}
        <div className="mc-header">
          <div className="mc-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <h2>Confirme os dados antes de salvar</h2>
          <p className="mc-header-sub">Revise todas as informações abaixo com atenção</p>
        </div>

        {/* Corpo */}
        <div className="mc-body">

          {/* SEÇÃO 1: Dados do Paciente */}
          <div className="mc-secao">
            <div className="mc-secao-titulo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Dados do Paciente</span>
            </div>

            <div className="mc-grid">
              <div className="mc-dado">
                <span className="mc-label">CPF</span>
                <span className="mc-valor">{dados.cpf}</span>
              </div>
              <div className="mc-dado">
                <span className="mc-label">Código Atendimento</span>
                <span className="mc-valor">{dados.codigoAtendimento}</span>
              </div>
              <div className="mc-dado">
                <span className="mc-label">Convênio</span>
                <span className="mc-valor">{dados.convenio}</span>
              </div>
              <div className="mc-dado">
                <span className="mc-label">Idade</span>
                <span className="mc-valor">{dados.idade} anos</span>
              </div>
              <div className="mc-dado mc-dado-full">
                <span className="mc-label">Nome do Paciente</span>
                <span className="mc-valor mc-valor-destaque">{dados.nomePaciente}</span>
              </div>
              <div className="mc-dado mc-dado-full">
                <span className="mc-label">Nome da Mãe</span>
                <span className="mc-valor">{dados.nomeMae}</span>
              </div>
              <div className="mc-dado">
                <span className="mc-label">Data de Nascimento</span>
                <span className="mc-valor">{dados.dataNascimento}</span>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: Localização */}
          <div className="mc-secao">
            <div className="mc-secao-titulo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Localização</span>
            </div>

            <div className="mc-grid">
              <div className="mc-dado">
                <span className="mc-label">Setor / Núcleo</span>
                <span className="mc-valor">{dados.nucleoSelecionado}</span>
              </div>
              <div className="mc-dado">
                <span className="mc-label">Leito</span>
                <span className="mc-valor mc-valor-destaque">{dados.leito}</span>
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: Refeições */}
          <div className="mc-secao">
            <div className="mc-secao-titulo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 010 8h-1"/>
                <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/>
                <line x1="10" y1="1" x2="10" y2="4"/>
                <line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
              <span>Refeições Prescritas</span>
              <span className="mc-badge">{dados.refeicoes?.length || 0}</span>
            </div>

            <div className="mc-refeicoes-lista">
              {dados.refeicoes?.map((ref, index) => (
                <div key={index} className={`mc-refeicao-card ${ref.isEspecial ? 'mc-refeicao-especial' : ''}`}>
                  <div className="mc-refeicao-header">
                    <span className="mc-refeicao-numero">{index + 1}</span>
                    <span className="mc-refeicao-nome">{ref.tipo}</span>
                    {ref.isEspecial && <span className="mc-tag-especial">Lista Personalizada</span>}
                  </div>

                  <div className="mc-refeicao-detalhes">
                    {ref.isEspecial ? (
                      <div className="mc-detalhe-linha">
                        <span className="mc-detalhe-label">Produtos</span>
                        <span className="mc-detalhe-valor">
                          {ref.itensEspeciaisIds?.length > 0
                            ? `${ref.itensEspeciaisIds.length} produto(s) selecionado(s)`
                            : 'Nenhum produto selecionado'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="mc-detalhe-linha">
                          <span className="mc-detalhe-label">Dieta</span>
                          <span className="mc-detalhe-valor mc-detalhe-destaque">{ref.dieta}</span>
                        </div>

                        {ref.restricoes?.length > 0 && (
                          <div className="mc-detalhe-linha">
                            <span className="mc-detalhe-label">Restrições</span>
                            <span className="mc-detalhe-valor">
                              {ref.restricoes.map((r, i) => (
                                <span key={i} className="mc-tag-restricao">{r}</span>
                              ))}
                            </span>
                          </div>
                        )}

                        {ref.semPrincipal && (
                          <div className="mc-detalhe-linha mc-detalhe-alerta">
                            <span className="mc-detalhe-label">Sem Principal</span>
                            <span className="mc-detalhe-valor">{ref.descricaoSemPrincipal || 'Sim'}</span>
                          </div>
                        )}

                        {ref.obsExclusao && (
                          <div className="mc-detalhe-linha">
                            <span className="mc-detalhe-label">Exclusão</span>
                            <span className="mc-detalhe-valor">{ref.obsExclusao}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO 4: Acompanhante (só mostra se tiver) */}
          {dados.temAcompanhante && (
            <div className="mc-secao mc-secao-acompanhante">
              <div className="mc-secao-titulo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
                <span>Acompanhante</span>
                <span className="mc-badge mc-badge-acomp">Incluso</span>
              </div>

              <div className="mc-grid">
                <div className="mc-dado">
                  <span className="mc-label">Tipo</span>
                  <span className="mc-valor mc-valor-destaque">
                    {getTipoAcompanhanteLabel(dados.tipoAcompanhante)}
                  </span>
                </div>
                <div className="mc-dado">
                  <span className="mc-label">Dieta</span>
                  <span className="mc-valor">{getDietaAcompanhante()}</span>
                </div>
                <div className="mc-dado mc-dado-full">
                  <span className="mc-label">Refeições do Acompanhante</span>
                  <span className="mc-valor">
                    {dados.acompanhanteRefeicoes?.length > 0 ? (
                      <span className="mc-tags-inline">
                        {dados.acompanhanteRefeicoes.map((r, i) => (
                          <span key={i} className="mc-tag-refeicao">{r}</span>
                        ))}
                      </span>
                    ) : (
                      'Nenhuma selecionada'
                    )}
                  </span>
                </div>

                {dados.acompanhanteRestricoesIds?.length > 0 && (
                  <div className="mc-dado mc-dado-full">
                    <span className="mc-label">Restrições do Acompanhante</span>
                    <span className="mc-valor">
                      {dados.acompanhanteRestricoesIds.length} restrição(ões) selecionada(s)
                    </span>
                  </div>
                )}

                {dados.acompanhanteObsLivre && (
                  <div className="mc-dado mc-dado-full">
                    <span className="mc-label">Observação</span>
                    <span className="mc-valor">{dados.acompanhanteObsLivre}</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer com botões */}
        <div className="mc-footer">
          <button className="mc-btn mc-btn-cancelar" onClick={onCancelar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Voltar e Editar
          </button>
          <button className="mc-btn mc-btn-confirmar" onClick={onConfirmar}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Confirmar Prescrição
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalConfirmacao;