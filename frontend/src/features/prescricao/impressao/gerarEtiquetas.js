// ============================================
// SALUSVITA TECH - GERAÇÃO DE ETIQUETAS
// Desenvolvido por FerMax Solution
// Extraído de Prescricoes.jsx
// ============================================

export function gerarHTMLEtiquetas(prescricoesParaImprimir) {
  const dataFormatada = new Date().toLocaleDateString("pt-BR");

  const estilos = `
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: Arial, sans-serif; padding: 10mm; background:#f5f5f5; }

    .etiqueta {
      width:10cm;
      height:8cm;
      background:white;
      padding:6mm;
      margin-bottom:5mm;
      page-break-after:always;
      border:2px solid #333;
      display:flex;
      flex-direction:column;
      position:relative;
    }
    .etiqueta:last-child { page-break-after:auto; }

    .etiqueta-empresa {
      text-align:center;
      font-size:12px;
      font-weight:bold;
      color:#333;
      padding-bottom:4px;
      margin-bottom:4px;
      border-bottom:2px solid #333;
    }

    .etiqueta-linha-principal {
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:5px;
      padding-bottom:4px;
      border-bottom:2px solid #333;
    }

    .etiqueta-nome {
      font-size:13px;
      font-weight:bold;
      flex:1;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      color:#000;
    }

    .etiqueta-idade {
      font-size:11px;
      font-weight:bold;
      background:#000;
      color:#fff;
      padding:2px 6px;
      border-radius:3px;
      margin-left:8px;
      white-space:nowrap;
    }

    .etiqueta-sem-principal {
      background:#fff3cd;
      padding:4px 6px;
      margin-bottom:5px;
      border-radius:3px;
      border-left:3px solid #ffc107;
      display:flex;
      font-size:9px;
      font-weight:bold;
      align-items:center;
    }

    .etiqueta-sem-principal-label { color:#856404; margin-right:4px; white-space:nowrap; }
    .etiqueta-sem-principal-valor { color:#856404; flex:1; overflow:hidden; text-overflow:ellipsis; }

    .etiqueta-grid {
      display:grid;
      font-weight:bold;
      grid-template-columns: 1fr 1fr;
      gap:3px 6px;
      flex:1;
    }

    .etiqueta-item { display:flex; font-weight:bold; font-size:9px; line-height:1.3; }
    .etiqueta-item.full-width { grid-column: 1 / -1; }
    .etiqueta-item.destaque { font-weight:bold; }

    .etiqueta-label { font-weight:bold; min-width:50px; flex-shrink:0; color:#333; }
    .etiqueta-valor { flex:1; word-wrap:break-word; color:#000; }

    .preview-container {
      margin:20px 0;
      padding:20px;
      background:white;
      border-radius:8px;
      box-shadow:0 2px 8px rgba(0,0,0,0.1);
      text-align:center;
    }

    .btn-preview {
      padding:12px 24px;
      font-size:16px;
      cursor:pointer;
      border:none;
      border-radius:6px;
      margin:0 5px;
      font-weight:600;
      transition:all 0.3s;
    }
    .btn-imprimir { background:#0d9488; color:white; }
    .btn-imprimir:hover { background:#0f766e; transform:translateY(-2px); box-shadow:0 4px 12px rgba(13,148,136,0.3); }
    .btn-fechar { background:#6c757d; color:white; }
    .btn-fechar:hover { background:#5a6268; transform:translateY(-2px); box-shadow:0 4px 12px rgba(108,117,125,0.3); }

    @media print {
      body { padding:0; background:white; }
      .preview-container { display:none; }
      .etiqueta { margin:0; border:2px solid #000; }
      .etiqueta:last-child { page-break-after:auto; }
      @page { size:10cm 8cm; margin:0; }
    }
  </style>
  `;

  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Etiquetas de Alimentação - ${dataFormatada}</title>
      ${estilos}
    </head>
    <body>
      <div class="preview-container">
        <h3>Preview de Impressão</h3>
        <p>Total de <strong>${prescricoesParaImprimir.length}</strong> etiqueta(s) | Data: <strong>${dataFormatada}</strong></p>
        <p>Tamanho: <strong>10cm x 8cm</strong> cada etiqueta</p>
        <button onclick="window.print()" class="btn-preview btn-imprimir">Imprimir</button>
        <button onclick="window.close()" class="btn-preview btn-fechar">Fechar</button>
      </div>
  `;

  prescricoesParaImprimir.forEach((prescricao) => {
    html += `
      <div class="etiqueta">
        <div class="etiqueta-empresa">Maxima Facility</div>

        <div class="etiqueta-linha-principal">
          <div class="etiqueta-nome">${prescricao.nome_paciente || "Paciente"}</div>
          <div class="etiqueta-idade">${prescricao.idade || "0"} anos</div>
        </div>

        ${
          prescricao.sem_principal
            ? `<div class="etiqueta-sem-principal">
                <span class="etiqueta-sem-principal-label">SEM PRINCIPAL:</span>
                <span class="etiqueta-sem-principal-valor">${prescricao.descricao_sem_principal || "Sem prato principal"}</span>
              </div>`
            : ""
        }

        <div class="etiqueta-grid">
          <div class="etiqueta-item destaque">
            <span class="etiqueta-label">Setor:</span>
            <span class="etiqueta-valor">${prescricao.nucleo || ""}</span>
          </div>
          <div class="etiqueta-item destaque">
            <span class="etiqueta-label">Leito:</span>
            <span class="etiqueta-valor">${prescricao.leito || ""}</span>
          </div>
          <div class="etiqueta-item full-width destaque">
            <span class="etiqueta-label">Refeição:</span>
            <span class="etiqueta-valor">${prescricao.tipo_alimentacao || ""}</span>
          </div>
          <div class="etiqueta-item full-width destaque">
            <span class="etiqueta-label">Dieta:</span>
            <span class="etiqueta-valor">${prescricao.dieta || ""}</span>
          </div>
          ${
            prescricao.restricoes && prescricao.restricoes.length > 0
              ? `<div class="etiqueta-item full-width">
                  <span class="etiqueta-label">Cond.:</span>
                  <span class="etiqueta-valor">${prescricao.restricoes.join(", ")}</span>
                </div>`
              : ""
          }
          ${
            prescricao.obs_exclusao
              ? `<div class="etiqueta-item full-width">
                  <span class="etiqueta-label">Exclusão:</span>
                  <span class="etiqueta-valor">${prescricao.obs_exclusao}</span>
                </div>`
              : ""
          }
          ${
            prescricao.obs_acrescimo
              ? `<div class="etiqueta-item full-width">
                  <span class="etiqueta-label">Acréscimo:</span>
                  <span class="etiqueta-valor">${prescricao.obs_acrescimo}</span>
                </div>`
              : ""
          }
        </div>
      </div>
    `;

    // Etiquetas do acompanhante
    if (prescricao.tem_acompanhante && prescricao.acompanhante_refeicoes) {
      let refeicoes = [];
      try {
        refeicoes =
          typeof prescricao.acompanhante_refeicoes === "string"
            ? JSON.parse(prescricao.acompanhante_refeicoes)
            : prescricao.acompanhante_refeicoes;
      } catch (e) {
        refeicoes = [];
      }

      let restricoesAcomp = [];
      try {
        const ids =
          typeof prescricao.acompanhante_restricoes_ids === "string"
            ? JSON.parse(prescricao.acompanhante_restricoes_ids)
            : prescricao.acompanhante_restricoes_ids || [];
        restricoesAcomp = ids;
      } catch (e) {
        restricoesAcomp = [];
      }

      refeicoes.forEach((refeicao) => {
        const dietaTexto =
          restricoesAcomp.length > 0
            ? "Dieta Normal p/ Acompanhante"
            : "Dieta Normal";

        html += `
          <div class="etiqueta">
            <div class="etiqueta-empresa">Maxima Facility</div>

            <div class="etiqueta-linha-principal">
              <div class="etiqueta-nome">ACOMPANHANTE - Leito ${prescricao.leito || ""}</div>
              <div class="etiqueta-idade" style="background:#f59e0b;color:#000;font-size:10px;">ACOMP.</div>
            </div>

            <div class="etiqueta-grid">
              <div class="etiqueta-item destaque">
                <span class="etiqueta-label">Setor:</span>
                <span class="etiqueta-valor">${prescricao.nucleo || ""}</span>
              </div>
              <div class="etiqueta-item destaque">
                <span class="etiqueta-label">Leito:</span>
                <span class="etiqueta-valor">${prescricao.leito || ""}</span>
              </div>
              <div class="etiqueta-item full-width destaque">
                <span class="etiqueta-label">Refeição:</span>
                <span class="etiqueta-valor">${refeicao}</span>
              </div>
              <div class="etiqueta-item full-width destaque">
                <span class="etiqueta-label">Dieta:</span>
                <span class="etiqueta-valor">${dietaTexto}</span>
              </div>
              ${
                prescricao.acompanhante_obs_livre
                  ? `<div class="etiqueta-item full-width">
                      <span class="etiqueta-label">Obs:</span>
                      <span class="etiqueta-valor">${prescricao.acompanhante_obs_livre}</span>
                    </div>`
                  : ""
              }
              <div class="etiqueta-item full-width">
                <span class="etiqueta-label">Paciente:</span>
                <span class="etiqueta-valor">${prescricao.nome_paciente || ""}</span>
              </div>
            </div>
          </div>
        `;
      });
    }
  });

  html += `
    </body>
    </html>
  `;

  return html;
}