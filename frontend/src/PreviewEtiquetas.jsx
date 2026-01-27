import React, { useState } from 'react';
import LayoutEtiqueta from './LayoutEtiqueta';
import './PreviewEtiquetas.css';

function PreviewEtiquetas({ voltar }) {
    const [etiquetaExemplo] = useState({
    nomePaciente: 'Maria da Silva Santos Oliveira',
    nomeMae: 'Ana Paula Santos Oliveira Costa',
    codigoAtendimento: '1234567',
    convenio: 'Convênio',
    idade: '65',
    leito: '601',
    tipoAlimentacao: 'Almoço',
    dieta: 'LIQUIDA PASTOSA',
    restricoes: ['HPS', 'DM', 'IRC'],
    semPrincipal: true,
    descricaoSemPrincipal: 'Arroz com frango grelhado',
    obsExclusao: 's/ leite, s/ açúcar',
    obsAcrescimo: 'c/ biscoito, c/ suco de laranja'
    });

  return (
    <div className="container">
      <div className="header-preview">
        <h1>Preview do Layout da Etiqueta</h1>
        <button className="btn-voltar" onClick={voltar}>
          ← Voltar
        </button>
      </div>

      <div className="preview-info">
        <p>📐 Este é o preview de como a etiqueta será impressa (10cm x 8cm)</p>
        <p>💡 Ajuste o CSS do arquivo <code>LayoutEtiqueta.css</code> para personalizar o layout</p>
      </div>

      <div className="preview-area">
        <LayoutEtiqueta etiqueta={etiquetaExemplo} modoPreview={true} />
      </div>

      <div className="preview-dicas">
        <h3>🎨 Dicas de Ajuste:</h3>
        <ul>
          <li><strong>Tamanho das fontes:</strong> Ajuste <code>font-size</code> nos elementos</li>
          <li><strong>Espaçamento:</strong> Ajuste <code>gap</code> no <code>.etiqueta-grid</code></li>
          <li><strong>Colunas:</strong> Mude <code>grid-template-columns</code> (ex: <code>1fr 1fr 1fr</code> para 3 colunas)</li>
          <li><strong>Margem lateral:</strong> Ajuste <code>padding: 8px 6mm</code> em <code>.etiqueta-visual</code></li>
        </ul>
      </div>
    </div>
  );
}

export default PreviewEtiquetas;