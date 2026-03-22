// backend/routes/logsLogin.js
// Rotas para relatório de logs de login (apenas admin)

const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { autenticar, verificarPermissao } = require('./auth');
const { consultarLogsLogin, gerarEstatisticas, listarUsuariosParaFiltro } = require('../services/logsLogin');

// ============================================
// CORES DO SISTEMA (paleta teal/emerald)
// ============================================
const CORES = {
  headerBg: 'FF0D9488',      // Teal principal
  headerFont: 'FFFFFFFF',    // Branco
  sucesso: 'FFD1FAE5',       // Verde claro bg
  sucessoFont: 'FF065F46',   // Verde escuro texto
  falha: 'FFFEE2E2',         // Vermelho claro bg
  falhaFont: 'FF991B1B',     // Vermelho escuro texto
  logout: 'FFDBEAFE',        // Roxo claro bg
  logoutFont: 'FF5B21B6',    // Roxo escuro texto
  rateLimit: 'FFFEF3C7',     // Amarelo claro bg
  rateLimitFont: 'FF92400E',  // Amarelo escuro texto
  resumoBg: 'FFF0FDFA',      // Teal muito claro
  resumoBorda: 'FF0D9488',   // Teal
  zebraPar: 'FFF8FAFC',      // Cinza muito claro
  bordaCelula: 'FFE2E8F0',   // Cinza borda
};

/**
 * GET /api/logs-login/exportar - Gerar relatório Excel
 * Query params: dataInicio, dataFim, usuarioId, tipoEvento
 */
router.get('/exportar', autenticar, verificarPermissao("faturamento"), async (req, res) => {
  try {
    const { dataInicio, dataFim, usuarioId, tipoEvento } = req.query;

    // Validar período obrigatório
    if (!dataInicio || !dataFim) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Período (dataInicio e dataFim) é obrigatório'
      });
    }

    const filtros = { dataInicio, dataFim, usuarioId, tipoEvento };

    // Buscar dados e estatísticas em paralelo
    const [dadosLogs, estatisticas] = await Promise.all([
      consultarLogsLogin(filtros),
      gerarEstatisticas(filtros)
    ]);

    const logs = dadosLogs.logs;

    // ============================================
    // CRIAR WORKBOOK EXCEL
    // ============================================
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ETIQUETA 1 - Sistema de Nutrição';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Logs de Login', {
      properties: { defaultColWidth: 18 },
      pageSetup: {
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0
      }
    });

    // ============================================
    // ESTILOS BASE
    // ============================================
    const fontTitulo = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF0F766E' } };
    const fontSubtitulo = { name: 'Arial', size: 10, color: { argb: 'FF475569' } };
    const fontResumoLabel = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF334155' } };
    const fontResumoValor = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF0D9488' } };
    const fontHeader = { name: 'Arial', size: 10, bold: true, color: { argb: CORES.headerFont } };
    const fontDados = { name: 'Arial', size: 9 };
    const bordaFina = {
      top: { style: 'thin', color: { argb: CORES.bordaCelula } },
      left: { style: 'thin', color: { argb: CORES.bordaCelula } },
      bottom: { style: 'thin', color: { argb: CORES.bordaCelula } },
      right: { style: 'thin', color: { argb: CORES.bordaCelula } }
    };

    // ============================================
    // SEÇÃO 1: CABEÇALHO DO RELATÓRIO
    // ============================================
    let linhaAtual = 1;

    // Título
    sheet.mergeCells(`A${linhaAtual}:J${linhaAtual}`);
    const celTitulo = sheet.getCell(`A${linhaAtual}`);
    celTitulo.value = 'RELATÓRIO DE LOGS DE LOGIN';
    celTitulo.font = fontTitulo;
    celTitulo.alignment = { horizontal: 'left', vertical: 'middle' };
    sheet.getRow(linhaAtual).height = 28;
    linhaAtual++;

    // Subtítulo com período e filtros
    sheet.mergeCells(`A${linhaAtual}:J${linhaAtual}`);
    const celSub = sheet.getCell(`A${linhaAtual}`);
    let textoFiltros = `Período: ${formatarData(dataInicio)} a ${formatarData(dataFim)}`;
    if (tipoEvento) textoFiltros += ` | Tipo: ${traduzirTipoEvento(tipoEvento)}`;
    if (usuarioId) textoFiltros += ` | Usuário ID: ${usuarioId}`;
    celSub.value = textoFiltros;
    celSub.font = fontSubtitulo;
    linhaAtual++;

    // Data de geração
    sheet.mergeCells(`A${linhaAtual}:J${linhaAtual}`);
    const celData = sheet.getCell(`A${linhaAtual}`);
    celData.value = `Gerado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
    celData.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF94A3B8' } };
    linhaAtual += 2;

    // ============================================
    // SEÇÃO 2: RESUMO ESTATÍSTICO
    // ============================================
    sheet.mergeCells(`A${linhaAtual}:D${linhaAtual}`);
    const celResumoTitulo = sheet.getCell(`A${linhaAtual}`);
    celResumoTitulo.value = 'RESUMO';
    celResumoTitulo.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF0F766E' } };
    linhaAtual++;

    // Linha: Total de Eventos
    adicionarLinhaResumo(sheet, linhaAtual, 'Total de Eventos:', estatisticas.total, fontResumoLabel, fontResumoValor, CORES.resumoBg);
    linhaAtual++;

    // Linha: Usuários Únicos
    adicionarLinhaResumo(sheet, linhaAtual, 'Usuários Únicos Logados:', estatisticas.usuariosUnicosLogados, fontResumoLabel, fontResumoValor, CORES.resumoBg);
    linhaAtual++;

    // Linhas por tipo de evento
    if (estatisticas.porTipo && estatisticas.porTipo.length > 0) {
      for (const tipo of estatisticas.porTipo) {
        const label = traduzirTipoEvento(tipo.tipo_evento) + ':';
        const corBg = obterCorFundo(tipo.tipo_evento);
        adicionarLinhaResumo(sheet, linhaAtual, label, tipo.total, fontResumoLabel, fontResumoValor, corBg);
        linhaAtual++;
      }
    }

    // IPs suspeitos
    if (estatisticas.ipsSuspeitos && estatisticas.ipsSuspeitos.length > 0) {
      linhaAtual++;
      sheet.getCell(`A${linhaAtual}`).value = 'IPs com 3+ Falhas:';
      sheet.getCell(`A${linhaAtual}`).font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFDC2626' } };
      linhaAtual++;
      for (const ip of estatisticas.ipsSuspeitos) {
        sheet.getCell(`A${linhaAtual}`).value = ip.ip_address || 'N/A';
        sheet.getCell(`A${linhaAtual}`).font = fontDados;
        sheet.getCell(`B${linhaAtual}`).value = `${ip.total_falhas} falhas`;
        sheet.getCell(`B${linhaAtual}`).font = { name: 'Arial', size: 9, color: { argb: 'FFDC2626' } };
        linhaAtual++;
      }
    }

    linhaAtual += 2;

    // ============================================
    // SEÇÃO 3: CABEÇALHO DA TABELA DE DADOS
    // ============================================
    const colunas = [
      { header: '#', key: 'id', width: 8 },
      { header: 'Data/Hora', key: 'criado_em', width: 20 },
      { header: 'Tipo Evento', key: 'tipo_evento', width: 22 },
      { header: 'Email Tentado', key: 'email_tentado', width: 28 },
      { header: 'Usuário', key: 'usuario_nome', width: 25 },
      { header: 'Motivo', key: 'motivo', width: 35 },
      { header: 'IP', key: 'ip_address', width: 18 },
      { header: 'Navegador/Dispositivo', key: 'user_agent_resumido', width: 30 },
    ];

    // Header da tabela
    const linhaHeader = linhaAtual;
    colunas.forEach((col, idx) => {
      const celula = sheet.getCell(linhaAtual, idx + 1);
      celula.value = col.header;
      celula.font = fontHeader;
      celula.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CORES.headerBg } };
      celula.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      celula.border = bordaFina;
      sheet.getColumn(idx + 1).width = col.width;
    });
    sheet.getRow(linhaAtual).height = 24;
    linhaAtual++;

    // ============================================
    // SEÇÃO 4: DADOS (uma linha por evento)
    // ============================================
    logs.forEach((log, idx) => {
      const isPar = idx % 2 === 0;
      const corLinha = obterCorFundo(log.tipo_evento);
      const corFonte = obterCorFonte(log.tipo_evento);

      const valores = [
        log.id,
        formatarDataHora(log.criado_em),
        traduzirTipoEvento(log.tipo_evento),
        log.email_tentado || '',
        log.usuario_nome || '—',
        log.motivo || '—',
        log.ip_address || 'N/A',
        resumirUserAgent(log.user_agent)
      ];

      valores.forEach((valor, colIdx) => {
        const celula = sheet.getCell(linhaAtual, colIdx + 1);
        celula.value = valor;
        celula.font = { ...fontDados };
        celula.border = bordaFina;
        celula.alignment = { vertical: 'middle', wrapText: colIdx === 5 || colIdx === 7 };

        // Destaque visual baseado no tipo
        if (colIdx === 2) {
          // Coluna "Tipo Evento" - cor de fundo destacada
          celula.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: corLinha } };
          celula.font = { ...fontDados, bold: true, color: { argb: corFonte } };
          celula.alignment = { horizontal: 'center', vertical: 'middle' };
        } else if (isPar) {
          // Zebra striping nas linhas pares
          celula.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CORES.zebraPar } };
        }
      });

      linhaAtual++;
    });

    // Mensagem se não houver dados
    if (logs.length === 0) {
      sheet.mergeCells(`A${linhaAtual}:H${linhaAtual}`);
      const celVazio = sheet.getCell(`A${linhaAtual}`);
      celVazio.value = 'Nenhum registro encontrado para os filtros selecionados.';
      celVazio.font = { name: 'Arial', size: 11, italic: true, color: { argb: 'FF94A3B8' } };
      celVazio.alignment = { horizontal: 'center' };
    }

    // ============================================
    // AUTO-FILTRO na tabela de dados
    // ============================================
    if (logs.length > 0) {
      sheet.autoFilter = {
        from: { row: linhaHeader, column: 1 },
        to: { row: linhaHeader + logs.length, column: colunas.length }
      };
    }

    // ============================================
    // CONGELAR PAINÉIS (header fixo ao rolar)
    // ============================================
    sheet.views = [
      { state: 'frozen', ySplit: linhaHeader, activeCell: `A${linhaHeader + 1}` }
    ];

    // ============================================
    // GERAR E ENVIAR ARQUIVO
    // ============================================
    const nomeArquivo = `logs_login_${dataInicio}_a_${dataFim}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);

    await workbook.xlsx.write(res);
    res.end();

    console.log(`[LOG-LOGIN] Relatório Excel gerado: ${logs.length} registros | ${nomeArquivo}`);
  } catch (erro) {
    console.error('[LOG-LOGIN] Erro ao gerar relatório:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar relatório de logs de login'
    });
  }
});

/**
 * GET /api/logs-login/usuarios - Lista de usuários para filtro
 */
router.get('/usuarios', autenticar, verificarPermissao("faturamento"), async (req, res) => {
  try {
    const usuarios = await listarUsuariosParaFiltro();
    res.json({ sucesso: true, usuarios });
  } catch (erro) {
    console.error('[LOG-LOGIN] Erro ao listar usuários:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar usuários' });
  }
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function formatarData(dataStr) {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarDataHora(data) {
  if (!data) return '';
  return new Date(data).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function traduzirTipoEvento(tipo) {
  const mapa = {
    'LOGIN_SUCESSO': '✅ Login Sucesso',
    'LOGIN_FALHA_SENHA': '❌ Senha Incorreta',
    'LOGIN_FALHA_EMAIL': '❌ Email Não Encontrado',
    'LOGIN_FALHA_INATIVO': '⚠️ Usuário Inativo',
    'LOGIN_FALHA_RATE_LIMIT': '🚫 Rate Limit (Bloqueado)',
    'LOGOUT': '🚪 Logout'
  };
  return mapa[tipo] || tipo;
}

function obterCorFundo(tipo) {
  if (tipo === 'LOGIN_SUCESSO') return CORES.sucesso;
  if (tipo === 'LOGOUT') return CORES.logout;
  if (tipo === 'LOGIN_FALHA_RATE_LIMIT') return CORES.rateLimit;
  if (tipo?.startsWith('LOGIN_FALHA')) return CORES.falha;
  return 'FFFFFFFF';
}

function obterCorFonte(tipo) {
  if (tipo === 'LOGIN_SUCESSO') return CORES.sucessoFont;
  if (tipo === 'LOGOUT') return CORES.logoutFont;
  if (tipo === 'LOGIN_FALHA_RATE_LIMIT') return CORES.rateLimitFont;
  if (tipo?.startsWith('LOGIN_FALHA')) return CORES.falhaFont;
  return 'FF334155';
}

function resumirUserAgent(ua) {
  if (!ua) return 'N/A';
  // Extrair navegador e SO de forma simplificada
  let navegador = 'Desconhecido';
  let so = '';

  if (ua.includes('Chrome') && !ua.includes('Edg')) navegador = 'Chrome';
  else if (ua.includes('Firefox')) navegador = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) navegador = 'Safari';
  else if (ua.includes('Edg')) navegador = 'Edge';
  else if (ua.includes('Opera') || ua.includes('OPR')) navegador = 'Opera';

  if (ua.includes('Windows')) so = 'Windows';
  else if (ua.includes('Mac OS')) so = 'macOS';
  else if (ua.includes('Linux')) so = 'Linux';
  else if (ua.includes('Android')) so = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) so = 'iOS';

  return so ? `${navegador} / ${so}` : navegador;
}

function adicionarLinhaResumo(sheet, linha, label, valor, fontLabel, fontValor, corBg) {
  sheet.getCell(`A${linha}`).value = label;
  sheet.getCell(`A${linha}`).font = fontLabel;
  sheet.getCell(`B${linha}`).value = valor;
  sheet.getCell(`B${linha}`).font = fontValor;
  if (corBg) {
    sheet.getCell(`A${linha}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: corBg } };
    sheet.getCell(`B${linha}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: corBg } };
  }
}

module.exports = router;