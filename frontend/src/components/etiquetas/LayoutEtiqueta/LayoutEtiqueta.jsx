import React from 'react';
import './LayoutEtiqueta.css';

function LayoutEtiqueta({ etiqueta, modoPreview = false }) {
  return (
    <div className={`etiqueta-visual ${modoPreview ? 'modo-preview' : ''}`}>
      {/* CABEÇALHO: Nome da Empresa */}
      <div className="etiqueta-empresa">Maxima Facility</div>
      
      {/* LINHA PRINCIPAL: Nome + Idade */}
      <div className="etiqueta-linha-principal">
        <span className="etiqueta-nome">{etiqueta.nomePaciente}</span>
        <span className="etiqueta-idade">{etiqueta.idade} anos</span>
      </div>

      {/* DESTAQUE SEM PRINCIPAL (só aparece se existir) */}
      {etiqueta.semPrincipal && (
        <div className="etiqueta-sem-principal-destaque">
          <span className="etiqueta-label-destaque">⚠️ SEM PRINCIPAL:</span>
          <span className="etiqueta-valor-destaque">{etiqueta.descricaoSemPrincipal}</span>
        </div>
      )}

      {/* GRID DE INFORMAÇÕES - SPANS DIRETOS SEM DIVS EXTRAS */}
      <div className="etiqueta-grid">
        {/* Mãe e Atendimento */}
        <span className="etiqueta-label">Mãe:</span>
        <span className="etiqueta-valor">{etiqueta.nomeMae}</span>
        <span className="etiqueta-label">Atend:</span>
        <span className="etiqueta-valor">{etiqueta.codigoAtendimento}</span>
        
        {/* Convênio e Leito */}
        <span className="etiqueta-label">Convênio:</span>
        <span className="etiqueta-valor">{etiqueta.convenio}</span>
        <span className="etiqueta-label">Leito:</span>
        <span className="etiqueta-valor">{etiqueta.leito}</span>
        
        {/* Refeição e Dieta */}
        <span className="etiqueta-label destaque">Refeição:</span>
        <span className="etiqueta-valor destaque">{etiqueta.tipoAlimentacao}</span>
        <span className="etiqueta-label destaque">Dieta:</span>
        <span className="etiqueta-valor destaque">{etiqueta.dieta}</span>
        
        {/* Restrições (linha inteira - só se existir) */}
        {etiqueta.restricoes && etiqueta.restricoes.length > 0 && (
          <>
            <span className="etiqueta-label full-width">Restrição:</span>
            <span className="etiqueta-valor full-width">{etiqueta.restricoes.join(', ')}</span>
          </>
        )}
        
        {/* Exclusão (linha inteira - só se existir) */}
        {etiqueta.obsExclusao && (
          <>
            <span className="etiqueta-label full-width">Exclusão:</span>
            <span className="etiqueta-valor full-width">{etiqueta.obsExclusao}</span>
          </>
        )}
        
        {/* Acréscimo (linha inteira - só se existir) */}
        {etiqueta.obsAcrescimo && (
          <>
            <span className="etiqueta-label full-width">Acréscimo:</span>
            <span className="etiqueta-valor full-width">{etiqueta.obsAcrescimo}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default LayoutEtiqueta;