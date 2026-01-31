// backend/services/auditoria.js
const { pool } = require('../config/database');

/**
 * Registrar log de auditoria
 */
async function registrarLog({
  usuario,
  acao,
  entidade,
  entidadeId = null,
  descricao,
  dadosAntes = null,
  dadosDepois = null,
  ipAddress = null,
  userAgent = null
}) {
  try {
    const query = `
      INSERT INTO logs_auditoria 
      (usuario_id, usuario_nome, usuario_email, acao, entidade, entidade_id, descricao, dados_antes, dados_depois, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      usuario.id,
      usuario.nome,
      usuario.email,
      acao,
      entidade,
      entidadeId,
      descricao,
      dadosAntes ? JSON.stringify(dadosAntes) : null,
      dadosDepois ? JSON.stringify(dadosDepois) : null,
      ipAddress,
      userAgent
    ];

    await pool.query(query, params);
    
    console.log(`[AUDITORIA] ${acao} - ${entidade} - ${descricao} - Por: ${usuario.nome}`);
  } catch (erro) {
    console.error('Erro ao registrar log de auditoria:', erro);
    // Não propagar o erro para não quebrar a aplicação principal
  }
}

/**
 * Listar logs de auditoria com filtros
 */
async function listarLogs(filtros = {}) {
  try {
    let query = `
      SELECT 
        id,
        usuario_id,
        usuario_nome,
        usuario_email,
        acao,
        entidade,
        entidade_id,
        descricao,
        dados_antes,
        dados_depois,
        ip_address,
        criado_em
      FROM logs_auditoria
      WHERE 1=1
    `;
    
    const params = [];

    // Filtro por usuário
    if (filtros.usuarioId) {
      query += ' AND usuario_id = ?';
      params.push(filtros.usuarioId);
    }

    // Filtro por ação
    if (filtros.acao) {
      query += ' AND acao = ?';
      params.push(filtros.acao);
    }

    // Filtro por entidade
    if (filtros.entidade) {
      query += ' AND entidade = ?';
      params.push(filtros.entidade);
    }

    // Filtro por ID da entidade
    if (filtros.entidadeId) {
      query += ' AND entidade_id = ?';
      params.push(filtros.entidadeId);
    }

    // Filtro por data início
    if (filtros.dataInicio) {
      query += ' AND DATE(criado_em) >= ?';
      params.push(filtros.dataInicio);
    }

    // Filtro por data fim
    if (filtros.dataFim) {
      query += ' AND DATE(criado_em) <= ?';
      params.push(filtros.dataFim);
    }

    // Busca por texto na descrição
    if (filtros.busca) {
      query += ' AND (descricao LIKE ? OR usuario_nome LIKE ? OR usuario_email LIKE ?)';
      const buscaParam = `%${filtros.busca}%`;
      params.push(buscaParam, buscaParam, buscaParam);
    }

    // Ordenação
    query += ' ORDER BY criado_em DESC';

    // Paginação
    const page = parseInt(filtros.page) || 1;
    const limit = parseInt(filtros.limit) || 50;
    const offset = (page - 1) * limit;

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [logs] = await pool.query(query, params);

    // Contar total
    let countQuery = `SELECT COUNT(*) as total FROM logs_auditoria WHERE 1=1`;
    const countParams = [];

    if (filtros.usuarioId) {
      countQuery += ' AND usuario_id = ?';
      countParams.push(filtros.usuarioId);
    }
    if (filtros.acao) {
      countQuery += ' AND acao = ?';
      countParams.push(filtros.acao);
    }
    if (filtros.entidade) {
      countQuery += ' AND entidade = ?';
      countParams.push(filtros.entidade);
    }
    if (filtros.entidadeId) {
      countQuery += ' AND entidade_id = ?';
      countParams.push(filtros.entidadeId);
    }
    if (filtros.dataInicio) {
      countQuery += ' AND DATE(criado_em) >= ?';
      countParams.push(filtros.dataInicio);
    }
    if (filtros.dataFim) {
      countQuery += ' AND DATE(criado_em) <= ?';
      countParams.push(filtros.dataFim);
    }
    if (filtros.busca) {
      countQuery += ' AND (descricao LIKE ? OR usuario_nome LIKE ? OR usuario_email LIKE ?)';
      const buscaParam = `%${filtros.busca}%`;
      countParams.push(buscaParam, buscaParam, buscaParam);
    }

    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    return {
      sucesso: true,
      logs,
      paginacao: {
        pagina: page,
        limite: limit,
        total,
        totalPaginas: Math.ceil(total / limit)
      }
    };
  } catch (erro) {
    console.error('Erro ao listar logs:', erro);
    throw erro;
  }
}

/**
 * Obter estatísticas de auditoria
 */
async function obterEstatisticas() {
  try {
    // Total de logs
    const [totalLogs] = await pool.query('SELECT COUNT(*) as total FROM logs_auditoria');

    // Logs por ação
    const [logsPorAcao] = await pool.query(`
      SELECT acao, COUNT(*) as total 
      FROM logs_auditoria 
      GROUP BY acao 
      ORDER BY total DESC
    `);

    // Logs por entidade
    const [logsPorEntidade] = await pool.query(`
      SELECT entidade, COUNT(*) as total 
      FROM logs_auditoria 
      GROUP BY entidade 
      ORDER BY total DESC
    `);

    // Usuários mais ativos
    const [usuariosMaisAtivos] = await pool.query(`
      SELECT 
        usuario_id,
        usuario_nome,
        usuario_email,
        COUNT(*) as total_acoes
      FROM logs_auditoria 
      GROUP BY usuario_id, usuario_nome, usuario_email
      ORDER BY total_acoes DESC
      LIMIT 10
    `);

    // Logs das últimas 24 horas
    const [logsUltimas24h] = await pool.query(`
      SELECT COUNT(*) as total 
      FROM logs_auditoria 
      WHERE criado_em >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    `);

    return {
      sucesso: true,
      estatisticas: {
        totalLogs: totalLogs[0].total,
        logsPorAcao,
        logsPorEntidade,
        usuariosMaisAtivos,
        logsUltimas24h: logsUltimas24h[0].total
      }
    };
  } catch (erro) {
    console.error('Erro ao obter estatísticas:', erro);
    throw erro;
  }
}

module.exports = {
  registrarLog,
  listarLogs,
  obterEstatisticas
};