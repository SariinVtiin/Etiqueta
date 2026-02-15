// backend/services/logsLogin.js
// Service para registro e consulta de logs de autenticação
// Separado da auditoria geral (logs_auditoria) por design

const { pool } = require('../config/database');

/**
 * Registrar evento de login/logout
 * Chamado silenciosamente - nunca quebra o fluxo principal
 */
async function registrarLogLogin({
  usuarioId = null,
  usuarioNome = null,
  usuarioEmail = null,
  emailTentado,
  tipoEvento,
  motivo = null,
  ipAddress = null,
  userAgent = null
}) {
  try {
    const query = `
      INSERT INTO logs_login 
      (usuario_id, usuario_nome, usuario_email, email_tentado, tipo_evento, motivo, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      usuarioId,
      usuarioNome,
      usuarioEmail,
      emailTentado,
      tipoEvento,
      motivo,
      ipAddress,
      userAgent
    ];

    await pool.query(query, params);

    console.log(`[LOG-LOGIN] ${tipoEvento} | Email: ${emailTentado} | IP: ${ipAddress || 'N/A'}`);
  } catch (erro) {
    // NUNCA propagar erro - log não pode quebrar o login
    console.error('[LOG-LOGIN] Erro ao registrar:', erro.message);
  }
}

/**
 * Consultar logs de login com filtros (para relatório Excel)
 */
async function consultarLogsLogin(filtros = {}) {
  try {
    let query = `
      SELECT 
        id,
        usuario_id,
        usuario_nome,
        usuario_email,
        email_tentado,
        tipo_evento,
        motivo,
        ip_address,
        user_agent,
        criado_em
      FROM logs_login
      WHERE 1=1
    `;

    const params = [];

    // Filtro por período (obrigatório no relatório)
    if (filtros.dataInicio) {
      query += ' AND criado_em >= ?';
      params.push(filtros.dataInicio + ' 00:00:00');
    }

    if (filtros.dataFim) {
      query += ' AND criado_em <= ?';
      params.push(filtros.dataFim + ' 23:59:59');
    }

    // Filtro por usuário específico
    if (filtros.usuarioId) {
      query += ' AND usuario_id = ?';
      params.push(filtros.usuarioId);
    }

    // Filtro por tipo de evento
    if (filtros.tipoEvento) {
      query += ' AND tipo_evento = ?';
      params.push(filtros.tipoEvento);
    }

    // Filtro por email tentado
    if (filtros.email) {
      query += ' AND email_tentado LIKE ?';
      params.push(`%${filtros.email}%`);
    }

    query += ' ORDER BY criado_em DESC';

    const [logs] = await pool.query(query, params);

    return { sucesso: true, logs, total: logs.length };
  } catch (erro) {
    console.error('[LOG-LOGIN] Erro ao consultar:', erro);
    throw erro;
  }
}

/**
 * Gerar estatísticas resumidas para o cabeçalho do Excel
 */
async function gerarEstatisticas(filtros = {}) {
  try {
    let whereClause = ' WHERE 1=1';
    const params = [];

    if (filtros.dataInicio) {
      whereClause += ' AND criado_em >= ?';
      params.push(filtros.dataInicio + ' 00:00:00');
    }
    if (filtros.dataFim) {
      whereClause += ' AND criado_em <= ?';
      params.push(filtros.dataFim + ' 23:59:59');
    }
    if (filtros.usuarioId) {
      whereClause += ' AND usuario_id = ?';
      params.push(filtros.usuarioId);
    }
    if (filtros.tipoEvento) {
      whereClause += ' AND tipo_evento = ?';
      params.push(filtros.tipoEvento);
    }

    // Total geral
    const [totalResult] = await pool.query(
      `SELECT COUNT(*) as total FROM logs_login ${whereClause}`, params
    );

    // Total por tipo
    const [porTipo] = await pool.query(
      `SELECT tipo_evento, COUNT(*) as total FROM logs_login ${whereClause} GROUP BY tipo_evento ORDER BY total DESC`,
      params
    );

    // Top IPs com falhas (sem filtro de tipo, apenas período)
    let wherePerido = ' WHERE tipo_evento LIKE "LOGIN_FALHA%"';
    const paramsIP = [];
    if (filtros.dataInicio) {
      wherePerido += ' AND criado_em >= ?';
      paramsIP.push(filtros.dataInicio + ' 00:00:00');
    }
    if (filtros.dataFim) {
      wherePerido += ' AND criado_em <= ?';
      paramsIP.push(filtros.dataFim + ' 23:59:59');
    }

    const [ipsSuspeitos] = await pool.query(
      `SELECT ip_address, COUNT(*) as total_falhas 
       FROM logs_login ${wherePerido}
       GROUP BY ip_address 
       HAVING total_falhas >= 3
       ORDER BY total_falhas DESC 
       LIMIT 10`,
      paramsIP
    );

    // Usuários únicos que logaram com sucesso
    let whereSucesso = ' WHERE tipo_evento = "LOGIN_SUCESSO"';
    const paramsSucesso = [];
    if (filtros.dataInicio) {
      whereSucesso += ' AND criado_em >= ?';
      paramsSucesso.push(filtros.dataInicio + ' 00:00:00');
    }
    if (filtros.dataFim) {
      whereSucesso += ' AND criado_em <= ?';
      paramsSucesso.push(filtros.dataFim + ' 23:59:59');
    }

    const [usuariosUnicos] = await pool.query(
      `SELECT COUNT(DISTINCT usuario_id) as total FROM logs_login ${whereSucesso}`,
      paramsSucesso
    );

    return {
      total: totalResult[0].total,
      porTipo,
      ipsSuspeitos,
      usuariosUnicosLogados: usuariosUnicos[0].total
    };
  } catch (erro) {
    console.error('[LOG-LOGIN] Erro ao gerar estatísticas:', erro);
    throw erro;
  }
}

/**
 * Buscar lista de usuários para o filtro do frontend
 */
async function listarUsuariosParaFiltro() {
  try {
    const [usuarios] = await pool.query(
      'SELECT id, nome, email FROM usuarios ORDER BY nome ASC'
    );
    return usuarios;
  } catch (erro) {
    console.error('[LOG-LOGIN] Erro ao listar usuários:', erro);
    throw erro;
  }
}

module.exports = {
  registrarLogLogin,
  consultarLogsLogin,
  gerarEstatisticas,
  listarUsuariosParaFiltro
};