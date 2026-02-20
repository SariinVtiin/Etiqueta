import React from 'react';
import './ModalConfirmacao.css';

function ModalConfirmacao({ dados, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>⚠️ Confirme os dados antes de adicionar</h2>
        
        <div className="dados-confirmacao">
          <div className="secao-dados">
            <h3>Dados do Paciente</h3>
            <div className="linha-dado">
              <strong>CPF:</strong> {dados.cpf}
            </div>
            <div className="linha-dado">
              <strong>Código de Atendimento:</strong> {dados.codigoAtendimento}
            </div>
            <div className="linha-dado">
              <strong>Convênio:</strong> {dados.convenio}
            </div>
            <div className="linha-dado">
              <strong>Nome:</strong> {dados.nomePaciente}
            </div>
            <div className="linha-dado">
              <strong>Mãe:</strong> {dados.nomeMae}
            </div>
            <div className="linha-dado">
              <strong>Data de Nascimento:</strong> {new Date(dados.dataNascimento).toLocaleDateString('pt-BR')}
            </div>
            <div className="linha-dado">
              <strong>Idade:</strong> {dados.idade} anos
            </div>
            <div className="linha-dado">
              <strong>Núcleo:</strong> {dados.nucleoSelecionado}
            </div>
            <div className="linha-dado">
              <strong>Leito:</strong> {dados.leito}
            </div>
          </div>

          <div className="secao-dados">
            <h3>Refeições e Configurações</h3>
            {dados.refeicoes.map((ref, index) => (
              <div key={index} className="refeicao-item">
                <div className="refeicao-titulo">{ref.tipo}</div>

                {ref.isEspecial ? (
                  // Refeição especial — mostra contagem de produtos
                  <div className="linha-dado">
                    <strong>Produtos selecionados:</strong>{' '}
                    {ref.itensEspeciaisIds?.length > 0
                      ? `${ref.itensEspeciaisIds.length} produto(s)`
                      : 'Nenhum produto selecionado'}
                  </div>
                ) : (
                  // Refeição normal — mostra campos padrão
                  <>
                    <div className="linha-dado">
                      <strong>Dieta:</strong> {ref.dieta}
                    </div>
                    {ref.restricoes?.length > 0 && (
                      <div className="linha-dado">
                        <strong>Restrições:</strong> {ref.restricoes.join(', ')}
                      </div>
                    )}
                    {ref.semPrincipal && (
                      <div className="linha-dado destaque-sem-principal">
                        <strong>⚠️ SEM PRINCIPAL:</strong> {ref.descricaoSemPrincipal}
                      </div>
                    )}
                    {ref.obsExclusao && (
                      <div className="linha-dado">
                        <strong>Exclusão:</strong> {ref.obsExclusao}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-acoes">
          <button className="btn-cancelar-modal" onClick={onCancelar}>
            ✏️ Cancelar e Editar
          </button>
          <button className="btn-confirmar-modal" onClick={onConfirmar}>
            ✅ Confirmar e Adicionar à Fila
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalConfirmacao;