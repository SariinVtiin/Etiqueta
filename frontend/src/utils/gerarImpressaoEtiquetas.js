/**
 * ========================================
 * UTILITÁRIO DE IMPRESSÃO DE ETIQUETAS
 * ========================================
 * 
 * Este arquivo centraliza a geração de HTML/CSS para impressão.
 * Edite AQUI para mudar o layout de TODAS as etiquetas do sistema.
 */

/**
 * Gera o CSS para impressão de etiquetas
 * 👉 EDITE AQUI PARA MUDAR O LAYOUT VISUAL
 */
const gerarCSSImpressao = () => `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
    padding: 10mm;
    background: #f0f0f0;
  }
  
  /* ========== DIMENSÕES DA ETIQUETA ========== */
  .etiqueta-visual {
    width: 10cm;
    height: 8cm;
    background: white;
    padding: 2px 4mm;           /* 👈 PADDING REDUZIDO */
    margin-bottom: 5mm;
    page-break-after: always;
    border: 1px solid #ccc;
    display: flex;
    flex-direction: column;
  }
  
  /* ========== CABEÇALHO ========== */
  .etiqueta-empresa {
    text-align: center;
    font-size: 12px;            /* 👈 TAMANHO FONTE TÍTULO */
    font-weight: bold;
    color: #333;
    padding-bottom: 2px;        /* 👈 ESPAÇO ABAIXO */
    border-bottom: 2px solid #000;
    margin-bottom: 2px;         /* 👈 ESPAÇO ABAIXO */
  }
  
  /* ========== LINHA PRINCIPAL (Nome + Idade) ========== */
  .etiqueta-linha-principal {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;         /* 👈 ESPAÇO ABAIXO */
    padding-bottom: 2px;
    border-bottom: 2px solid #333;
  }
  
  .etiqueta-nome {
    font-size: 11px;            /* 👈 TAMANHO FONTE NOME */
    font-weight: bold;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .etiqueta-idade {
    font-size: 9px;             /* 👈 TAMANHO FONTE IDADE */
    font-weight: bold;
    background: #000;
    color: #fff;
    padding: 1px 4px;           /* 👈 PADDING REDUZIDO */
    border-radius: 3px;
    margin-left: 6px;
    white-space: nowrap;
  }
  
  /* ========== DESTAQUE SEM PRINCIPAL ========== */
  .etiqueta-sem-principal-destaque {
    background: #fff3cd;
    padding: 2px 4px;           /* 👈 PADDING REDUZIDO */
    margin-bottom: 2px;         /* 👈 ESPAÇO ABAIXO */
    border-radius: 3px;
    border-left: 3px solid #ffc107;
    display: flex;
    font-size: 8px;             /* 👈 TAMANHO FONTE */
    font-weight: bold;
  }
  
  .etiqueta-label-destaque {
    color: #856404;
    margin-right: 4px;
    white-space: nowrap;
  }
  
  .etiqueta-valor-destaque {
    color: #856404;
    flex: 1;
  }
  
  /* ========== GRID DE INFORMAÇÕES ========== */
  .etiqueta-grid {
    display: grid;
    grid-template-columns: auto 1fr;  /* Label auto, valor ocupa resto */
    gap: 0px 3px;               /* 👈 SEM GAP VERTICAL! */
    font-size: 8px;             /* 👈 TAMANHO FONTE GERAL */
    line-height: 0.9;           /* 👈 ALTURA DA LINHA REDUZIDA */
    flex: 1;
  }
  
  .etiqueta-label {
    font-weight: bold;
    white-space: nowrap;
    align-self: start;
    padding: 0;
    margin: 0;
  }
  
  .etiqueta-valor {
    word-wrap: break-word;
    align-self: start;
    padding: 0;
    margin: 0;
  }
  
  /* Itens destacados */
  .etiqueta-label.destaque,
  .etiqueta-valor.destaque {
    font-weight: bold;
  }
  
  /* Itens de linha inteira */
  .etiqueta-label.full-width,
  .etiqueta-valor.full-width {
    grid-column: 1 / -1;
    margin-top: 1px;            /* 👈 PEQUENO ESPAÇO ANTES DE ITENS FULL-WIDTH */
  }
  
  /* ========== PREVIEW (botões) ========== */
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
  
  /* ========== IMPRESSÃO ========== */
  @media print {
    .preview-container { 
      display: none; 
    }
    .etiqueta-visual {
      margin-bottom: 0;
    }
  }
</style>
`;

/**
 * Gera o HTML de uma etiqueta individual
 * @param {Object} prescricao - Dados da prescrição
 */
const gerarHTMLEtiqueta = (prescricao) => {
  return `
    <div class="etiqueta-visual">
      <!-- Cabeçalho -->
      <div class="etiqueta-empresa">Maxima Facility</div>
      
      <!-- Linha Principal: Nome + Idade -->
      <div class="etiqueta-linha-principal">
        <span class="etiqueta-nome">${prescricao.nome_paciente || ''}</span>
        <span class="etiqueta-idade">${prescricao.idade || ''} anos</span>
      </div>

      <!-- Destaque SEM PRINCIPAL (se existir) -->
      ${prescricao.sem_principal ? `
        <div class="etiqueta-sem-principal-destaque">
          <span class="etiqueta-label-destaque">⚠️ SEM PRINCIPAL:</span>
          <span class="etiqueta-valor-destaque">${prescricao.descricao_sem_principal || ''}</span>
        </div>
      ` : ''}

      <!-- Grid de Informações -->
      <div class="etiqueta-grid">
        <!-- Mãe e Atendimento -->
        <span class="etiqueta-label">Mãe:</span>
        <span class="etiqueta-valor">${prescricao.nome_mae || ''}</span>
        <span class="etiqueta-label">Atend:</span>
        <span class="etiqueta-valor">${prescricao.codigo_atendimento || ''}</span>
        
        <!-- Convênio e Leito -->
        <span class="etiqueta-label">Convênio:</span>
        <span class="etiqueta-valor">${prescricao.convenio || ''}</span>
        <span class="etiqueta-label">Leito:</span>
        <span class="etiqueta-valor">${prescricao.leito || ''}</span>
        
        <!-- Refeição e Dieta -->
        <span class="etiqueta-label destaque">Refeição:</span>
        <span class="etiqueta-valor destaque">${prescricao.tipo_alimentacao || ''}</span>
        <span class="etiqueta-label destaque">Dieta:</span>
        <span class="etiqueta-valor destaque">${prescricao.dieta || ''}</span>
        
        <!-- Restrições (linha inteira - se existir) -->
        ${prescricao.restricoes && prescricao.restricoes.length > 0 ? `
          <span class="etiqueta-label full-width">Restrição:</span>
          <span class="etiqueta-valor full-width">${prescricao.restricoes.join(', ')}</span>
        ` : ''}
        
        <!-- Exclusão (linha inteira - se existir) -->
        ${prescricao.obs_exclusao ? `
          <span class="etiqueta-label full-width">Exclusão:</span>
          <span class="etiqueta-valor full-width">${prescricao.obs_exclusao}</span>
        ` : ''}
        
        <!-- Acréscimo (linha inteira - se existir) -->
        ${prescricao.obs_acrescimo ? `
          <span class="etiqueta-label full-width">Acréscimo:</span>
          <span class="etiqueta-valor full-width">${prescricao.obs_acrescimo}</span>
        ` : ''}
      </div>
    </div>
  `;
};

/**
 * Gera HTML completo para impressão de múltiplas etiquetas
 * @param {Array} prescricoes - Array de prescrições
 * @returns {string} HTML completo pronto para window.open
 */
export const gerarHTMLImpressao = (prescricoes) => {
  const dataFormatada = new Date().toLocaleDateString('pt-BR');
  const css = gerarCSSImpressao();
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Etiquetas de Alimentação - ${dataFormatada}</title>
      ${css}
    </head>
    <body>
      <!-- Preview com botões -->
      <div class="preview-container">
        <h3>Preview de Impressão</h3>
        <p>Total de ${prescricoes.length} etiqueta(s) - Data: ${dataFormatada}</p>
        <button onclick="window.print()" class="btn-preview btn-imprimir-preview">
          🖨️ Imprimir
        </button>
        <button onclick="window.close()" class="btn-preview btn-fechar-preview">
          ✕ Fechar
        </button>
      </div>
      
      <!-- Etiquetas -->
  `;

  // Adicionar cada etiqueta
  prescricoes.forEach(prescricao => {
    html += gerarHTMLEtiqueta(prescricao);
  });

  html += `
    </body>
    </html>
  `;

  return html;
};

/**
 * Abre janela de impressão com as etiquetas
 * @param {Array} prescricoes - Array de prescrições
 */
export const abrirJanelaImpressao = (prescricoes) => {
  const html = gerarHTMLImpressao(prescricoes);
  const janela = window.open('', '', 'width=800,height=600');
  janela.document.write(html);
  janela.document.close();
  janela.focus();
};


/* ========================================
   📌 GUIA DE AJUSTES RÁPIDOS
   ========================================
   
   🔧 ONDE MUDAR OS ESPAÇAMENTOS:
   Linha 36:  padding: 2px 4mm        → Margem interna geral
   Linha 48:  margin-bottom: 2px      → Após título empresa
   Linha 57:  margin-bottom: 2px      → Após nome paciente
   Linha 82:  margin-bottom: 2px      → Após caixa amarela
   Linha 102: gap: 0px 3px            → Entre linhas do grid (0px = SEM ESPAÇO VERTICAL!)
   
   📝 ONDE MUDAR AS FONTES:
   Linha 44:  font-size: 12px         → Título empresa
   Linha 62:  font-size: 11px         → Nome paciente
   Linha 71:  font-size: 9px          → Idade
   Linha 87:  font-size: 8px          → Caixa amarela
   Linha 103: font-size: 8px          → Informações gerais
   
   🎨 ESTRUTURA:
   Linha 101: grid-template-columns   → Layout do grid
   Linha 104: line-height: 0.9        → Altura das linhas (MUITO REDUZIDA!)
   
   ⚡ PARA COMPACTAR AINDA MAIS:
   - Reduzir padding linha 36: 2px → 1px
   - Reduzir line-height linha 104: 0.9 → 0.85
   - Reduzir fontes em 1px cada
   - Já está com gap 0px (sem espaço vertical entre linhas)
   
   ======================================== */