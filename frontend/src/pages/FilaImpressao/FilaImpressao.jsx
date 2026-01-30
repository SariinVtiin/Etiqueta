import React from 'react';
import './FilaImpressao.css';

function FilaImpressao({ etiquetas, setEtiquetas, voltar }) {
  const removerEtiqueta = (id) => {
    setEtiquetas(etiquetas.filter(e => e.id !== id));
  };

  const limparTodas = () => {
    if (window.confirm('Tem certeza que deseja limpar TODAS as etiquetas da fila?')) {
      setEtiquetas([]);
    }
  };

  const gerarHTMLImpressao = () => {
  const hoje = new Date();
  const dataFormatada = hoje.toLocaleDateString('pt-BR');
  
  const css = `
    @page { 
      size: 10cm 8cm; 
      margin: 0; 
    }
    
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 0; 
    }
    
    .etiqueta-visual {
      width: 10cm;
      height: 8cm;
      padding: 6px 6mm;
      box-sizing: border-box;
      border: 2px solid #000;
      background: white;
      page-break-after: always;
      margin-bottom: 5mm;
    }
    
    .etiqueta-visual:last-child {
      page-break-after: auto;
    }
    
    .etiqueta-empresa {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 5px;
      padding-bottom: 4px;
      border-bottom: 2px solid #000;
    }
    
    .etiqueta-linha-principal {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      padding-bottom: 5px;
      border-bottom: 2px solid #000;
    }
    
    .etiqueta-nome {
      font-size: 13px;
      font-weight: bold;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .etiqueta-idade {
      font-size: 12px;
      font-weight: bold;
      background: #000;
      color: #fff;
      padding: 2px 6px;
      border-radius: 3px;
      margin-left: 8px;
      white-space: nowrap;
    }
    
    .etiqueta-sem-principal-destaque {
      background: #fff3cd;
      padding: 5px 6px;
      margin-bottom: 6px;
      border-radius: 3px;
      border-left: 3px solid #ffc107;
      display: flex;
      font-size: 10px;
      font-weight: bold;
    }
    
    .etiqueta-label-destaque {
      color: #856404;
      margin-right: 5px;
      white-space: nowrap;
    }
    
    .etiqueta-valor-destaque {
      color: #856404;
      flex: 1;
    }
    
    .etiqueta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px 6px;
    }
    
    .etiqueta-item {
      display: flex;
      font-size: 10px;
      line-height: 1.2;
    }
    
    .etiqueta-item.full-width {
      grid-column: 1 / -1;
    }
    
    .etiqueta-item.destaque {
      font-weight: bold;
    }
    
    .etiqueta-label {
      font-weight: bold;
      min-width: 48px;
      flex-shrink: 0;
    }
    
    .etiqueta-valor {
      flex: 1;
      word-wrap: break-word;
    }
    
    .preview-container {
      margin: 20px;
      padding: 20px;
      background: #f0f0f0;
      border-radius: 5px;
    }
    
    .btn-preview {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      margin-right: 10px;
    }
    
    .btn-imprimir-preview {
      background: #007bff;
      color: white;
    }
    
    .btn-fechar-preview {
      background: #6c757d;
      color: white;
    }
    
    @media print {
      .preview-container { 
        display: none; 
      }
      .etiqueta-visual {
        margin-bottom: 0;
      }
    }
  `;
  
  let html = `
    <html>
    <head>
      <title>Mapa de Alimentação - ${dataFormatada}</title>
      <style>${css}</style>
    </head>
    <body>
      <div class="preview-container">
        <h3>Preview de Impressão</h3>
        <p>Total de ${etiquetas.length} etiqueta(s) - Data: ${dataFormatada}</p>
        <button onclick="window.print()" class="btn-preview btn-imprimir-preview">
          🖨️ Imprimir
        </button>
        <button onclick="window.close()" class="btn-preview btn-fechar-preview">
          ✕ Fechar
        </button>
      </div>
  `;
  
  etiquetas.forEach(etiqueta => {
    html += `
      <div class="etiqueta-visual">
        <div class="etiqueta-empresa">Maxima Facility</div>
        
        <div class="etiqueta-linha-principal">
          <div class="etiqueta-nome">${etiqueta.nomePaciente}</div>
          <div class="etiqueta-idade">${etiqueta.idade} anos</div>
        </div>

        ${etiqueta.semPrincipal ? `
        <div class="etiqueta-sem-principal-destaque">
          <span class="etiqueta-label-destaque">⚠️ SEM PRINCIPAL:</span>
          <span class="etiqueta-valor-destaque">${etiqueta.descricaoSemPrincipal}</span>
        </div>` : ''}

        <div class="etiqueta-grid">
          <div class="etiqueta-item">
            <span class="etiqueta-label">Mãe:</span>
            <span class="etiqueta-valor">${etiqueta.nomeMae}</span>
          </div>
          
          <div class="etiqueta-item">
            <span class="etiqueta-label">Atend:</span>
            <span class="etiqueta-valor">${etiqueta.codigoAtendimento}</span>
          </div>
          
          <div class="etiqueta-item">
            <span class="etiqueta-label">Convênio:</span>
            <span class="etiqueta-valor">${etiqueta.convenio}</span>
          </div>
          
          <div class="etiqueta-item">
            <span class="etiqueta-label">Leito:</span>
            <span class="etiqueta-valor">${etiqueta.leito}</span>
          </div>
          
          <div class="etiqueta-item destaque">
            <span class="etiqueta-label">Refeição:</span>
            <span class="etiqueta-valor">${etiqueta.tipoAlimentacao}</span>
          </div>
          
          <div class="etiqueta-item destaque">
            <span class="etiqueta-label">Dieta:</span>
            <span class="etiqueta-valor">${etiqueta.dieta}</span>
          </div>
          
          ${etiqueta.restricoes && etiqueta.restricoes.length > 0 ? `
          <div class="etiqueta-item full-width">
            <span class="etiqueta-label">Restrição:</span>
            <span class="etiqueta-valor">${etiqueta.restricoes.join(', ')}</span>
          </div>` : ''}
          
          ${etiqueta.obsExclusao ? `
          <div class="etiqueta-item full-width">
            <span class="etiqueta-label">Exclusão:</span>
            <span class="etiqueta-valor">${etiqueta.obsExclusao}</span>
          </div>` : ''}
          
          ${etiqueta.obsAcrescimo ? `
          <div class="etiqueta-item full-width">
            <span class="etiqueta-label">Acréscimo:</span>
            <span class="etiqueta-valor">${etiqueta.obsAcrescimo}</span>
          </div>` : ''}
        </div>
      </div>
    `;
  });
  
  html += '</body></html>';
  return html;
};

  const imprimirTodas = () => {
    if (etiquetas.length === 0) {
      alert('Nenhuma etiqueta na fila para imprimir!');
      return;
    }

    const janelaImpressao = window.open('', '', 'width=800,height=600');
    janelaImpressao.document.write(gerarHTMLImpressao());
    janelaImpressao.document.close();
  };

  return (
    <div className="container">
      <div className="header-fila">
        <h1>Fila de Impressão</h1>
        <button className="btn-voltar-fila" onClick={voltar}>
          ← Voltar
        </button>
      </div>

      {etiquetas.length === 0 ? (
        <div className="fila-vazia">
          <h2>📋 Nenhuma etiqueta na fila</h2>
          <p>Vá para "Adicionar Etiquetas" para começar a coletar dados.</p>
        </div>
      ) : (
        <div className="fila-impressao">
          <div className="fila-header">
            <h2>Total: {etiquetas.length} etiqueta(s)</h2>
            <button className="btn-limpar" onClick={limparTodas}>
              🗑️ Limpar Todas
            </button>
          </div>
          
          <div className="lista-etiquetas">
            {etiquetas.map((etiqueta) => (
              <div key={etiqueta.id} className="etiqueta-preview">
                <div className="etiqueta-info">
                  <strong>{etiqueta.nomePaciente}</strong> ({etiqueta.idade} anos)
                  <div>Mãe: {etiqueta.nomeMae} | CPF: {etiqueta.cpf}</div>
                  <div>Atend: {etiqueta.codigoAtendimento} | Convênio: {etiqueta.convenio}</div>
                  <div>Leito: {etiqueta.leito} | <strong>{etiqueta.tipoAlimentacao}</strong></div>
                  <div>Dieta: {etiqueta.dieta}</div>
                  {etiqueta.restricoes.length > 0 && <div>Restrição: {etiqueta.restricoes.join(', ')}</div>}
                  {etiqueta.semPrincipal && <div className="destaque-amarelo"> SEM PRINCIPAL: {etiqueta.descricaoSemPrincipal}</div>}
                  {etiqueta.obsExclusao && <div className="obs">Exclusão: {etiqueta.obsExclusao}</div>}
                  {etiqueta.obsAcrescimo && <div className="obs">Acréscimo: {etiqueta.obsAcrescimo}</div>}
                </div>
                <button 
                  type="button"
                  className="btn-remover"
                  onClick={() => removerEtiqueta(etiqueta.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button 
            type="button"
            className="btn-imprimir-grande"
            onClick={imprimirTodas}
          >
            🖨️ Imprimir {etiquetas.length} Etiquetas
          </button>
        </div>
      )}
    </div>
  );
}

export default FilaImpressao;