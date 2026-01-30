import React from 'react';
import './LayoutEtiqueta.css';

function LayoutEtiqueta({ etiqueta, modoPreview = false }) {
  return (
    <div className={`etiqueta-visual ${modoPreview ? 'modo-preview' : ''}`}>
      <div className="etiqueta-empresa">Maxima Facility</div>
      
      <div className="etiqueta-linha-principal">
        <div className="etiqueta-nome">{etiqueta.nomePaciente}</div>
        <div className="etiqueta-idade">{etiqueta.idade} anos</div>
      </div>

      {etiqueta.semPrincipal && (
        <div className="etiqueta-sem-principal-destaque">
          <span className="etiqueta-label-destaque">⚠️ SEM PRINCIPAL:</span>
          <span className="etiqueta-valor-destaque">{etiqueta.descricaoSemPrincipal}</span>
        </div>
      )}

      <div className="etiqueta-grid">
        <div className="etiqueta-item">
          <span className="etiqueta-label">Mãe:</span>
          <span className="etiqueta-valor">{etiqueta.nomeMae}</span>
        </div>
        
        <div className="etiqueta-item">
          <span className="etiqueta-label">Atend:</span>
          <span className="etiqueta-valor">{etiqueta.codigoAtendimento}</span>
        </div>
        
        <div className="etiqueta-item">
          <span className="etiqueta-label">Convênio:</span>
          <span className="etiqueta-valor">{etiqueta.convenio}</span>
        </div>
        
        <div className="etiqueta-item">
          <span className="etiqueta-label">Leito:</span>
          <span className="etiqueta-valor">{etiqueta.leito}</span>
        </div>
        
        <div className="etiqueta-item destaque">
          <span className="etiqueta-label">Refeição:</span>
          <span className="etiqueta-valor">{etiqueta.tipoAlimentacao}</span>
        </div>
        
        <div className="etiqueta-item destaque">
          <span className="etiqueta-label">Dieta:</span>
          <span className="etiqueta-valor">{etiqueta.dieta}</span>
        </div>
        
        {etiqueta.restricoes && etiqueta.restricoes.length > 0 && (
          <div className="etiqueta-item full-width">
            <span className="etiqueta-label">Restrição:</span>
            <span className="etiqueta-valor">{etiqueta.restricoes.join(', ')}</span>
          </div>
        )}
        
        {etiqueta.obsExclusao && (
          <div className="etiqueta-item full-width">
            <span className="etiqueta-label">Exclusão:</span>
            <span className="etiqueta-valor">{etiqueta.obsExclusao}</span>
          </div>
        )}
        
        {etiqueta.obsAcrescimo && (
          <div className="etiqueta-item full-width">
            <span className="etiqueta-label">Acréscimo:</span>
            <span className="etiqueta-valor">{etiqueta.obsAcrescimo}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LayoutEtiqueta;