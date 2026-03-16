const ExcelJS = require("exceljs");
const { pool } = require("../config/database");

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.]/g, " ")
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function parseJsonArray(rawValue) {
  if (!rawValue) return [];

  if (Array.isArray(rawValue)) return rawValue;

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return String(rawValue)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function toPositiveNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatDateToSql(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getPeriodosAtuais() {
  const agora = new Date();

  const hoje = new Date(agora);
  hoje.setHours(0, 0, 0, 0);

  const diaSemana = hoje.getDay(); // 0=domingo, 1=segunda...
  const diffInicioSemana = diaSemana === 0 ? -6 : 1 - diaSemana; // semana começa na segunda
  const inicioSemana = addDays(hoje, diffInicioSemana);
  const fimSemana = addDays(inicioSemana, 6);

  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  const inicioAno = new Date(hoje.getFullYear(), 0, 1);
  const fimAno = new Date(hoje.getFullYear(), 11, 31);

  return {
    hoje: formatDateToSql(hoje),
    inicioSemana: formatDateToSql(inicioSemana),
    fimSemana: formatDateToSql(fimSemana),
    inicioMes: formatDateToSql(inicioMes),
    fimMes: formatDateToSql(fimMes),
    inicioAno: formatDateToSql(inicioAno),
    fimAno: formatDateToSql(fimAno),
  };
}

async function buscarPrescricaoPorId(prescricaoId) {
  const [rows] = await pool.query("SELECT * FROM prescricoes WHERE id = ?", [
    prescricaoId,
  ]);
  return rows[0] || null;
}

async function buscarProximaVersao(prescricaoId) {
  const [[row]] = await pool.query(
    "SELECT COALESCE(MAX(versao), 0) AS ultima_versao FROM faturamento_itens WHERE prescricao_id = ?",
    [prescricaoId],
  );

  return Number(row?.ultima_versao || 0) + 1;
}

async function buscarTipoRefeicaoPorNome(nome) {
  const [rows] = await pool.query(
    "SELECT id, nome FROM tipos_refeicao WHERE UPPER(nome) = UPPER(?) LIMIT 1",
    [nome],
  );

  return rows[0] || null;
}

async function resolverChaveDieta(dietaNome) {
  if (!dietaNome) return null;

  const [rows] = await pool.query(
    "SELECT alias_faturamento FROM dietas WHERE nome = ? LIMIT 1",
    [dietaNome],
  );

  const alias = rows[0]?.alias_faturamento;
  if (alias && String(alias).trim()) {
    return alias.trim();
  }

  const normalizada = normalizeText(dietaNome);

  if (normalizada.includes("LIQ") && normalizada.includes("PAST")) {
    return "LIQUIDA PASTOSA";
  }

  if (normalizada.includes("PEDIATR")) {
    return "NORMAL PEDIATRICA";
  }

  if (normalizada.includes("LIQ")) {
    return "LIQUIDA";
  }

  if (normalizada.includes("NORMAL")) {
    return "NORMAL ADULTO";
  }

  return dietaNome;
}

async function buscarPrecoRefeicao({
  categoria,
  chaveDieta,
  tipoRefeicaoNome,
}) {
  const [rows] = await pool.query(
    `SELECT tpr.id, tpr.categoria, tpr.chave_dieta, tpr.valor, tr.nome AS tipo_refeicao_nome
       FROM tabela_precos_refeicao tpr
       JOIN tipos_refeicao tr ON tr.id = tpr.tipo_refeicao_id
      WHERE tpr.ativo = 1
        AND tpr.categoria = ?`,
    [categoria],
  );

  const chaveNormalizada = normalizeText(chaveDieta);
  const refeicaoNormalizada = normalizeText(tipoRefeicaoNome);

  return (
    rows.find(
      (row) =>
        normalizeText(row.chave_dieta) === chaveNormalizada &&
        normalizeText(row.tipo_refeicao_nome) === refeicaoNormalizada,
    ) || null
  );
}

function montarBaseItem(prescricao, versao) {
  return {
    prescricao_id: prescricao.id,
    versao,
    data_consumo: prescricao.data_prescricao,
    paciente_nome: prescricao.nome_paciente,
    paciente_cpf: prescricao.cpf,
    codigo_atendimento: prescricao.codigo_atendimento,
    convenio: prescricao.convenio,
    nucleo: prescricao.nucleo,
    leito: prescricao.leito,
    dieta_original: prescricao.dieta || null,
  };
}

function criarLinhaFaturamento(base, overrides = {}) {
  const quantidade = toPositiveNumber(overrides.quantidade || 1);
  const valorUnitario = toPositiveNumber(overrides.valor_unitario || 0);
  const valorTotal = Number((quantidade * valorUnitario).toFixed(4));
  const status =
    overrides.status || (valorUnitario > 0 ? "cobrado" : "pendente_preco");

  return {
    ...base,
    tipo_item: overrides.tipo_item,
    tipo_refeicao: overrides.tipo_refeicao || null,
    chave_dieta: overrides.chave_dieta || null,
    referencia_id: overrides.referencia_id || null,
    referencia_nome: overrides.referencia_nome,
    quantidade,
    valor_unitario: valorUnitario,
    valor_total: status === "cobrado" ? valorTotal : 0,
    status,
    detalhe_json: JSON.stringify(overrides.detalhe_json || {}),
  };
}

async function montarItensFaturamento(prescricao, versao) {
  const itens = [];
  const base = montarBaseItem(prescricao, versao);

  if (
    normalizeText(prescricao.tipo_alimentacao) !==
    normalizeText("Form. Enteral")
  ) {
    const chaveDieta = await resolverChaveDieta(prescricao.dieta);
    const precoBase = await buscarPrecoRefeicao({
      categoria: "paciente",
      chaveDieta,
      tipoRefeicaoNome: prescricao.tipo_alimentacao,
    });

    itens.push(
      criarLinhaFaturamento(base, {
        tipo_item: "refeicao_paciente",
        tipo_refeicao: prescricao.tipo_alimentacao,
        chave_dieta: chaveDieta,
        referencia_nome: `Refeição paciente - ${prescricao.tipo_alimentacao}`,
        valor_unitario: precoBase?.valor || 0,
        status: precoBase ? "cobrado" : "pendente_preco",
        detalhe_json: {
          origem: "tabela_precos_refeicao",
          tabela_preco_id: precoBase?.id || null,
          dieta_original: prescricao.dieta || null,
        },
      }),
    );
  }

  const acrescimosIds = [
    ...new Set(
      parseJsonArray(prescricao.acrescimos_ids)
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id)),
    ),
  ];

  if (acrescimosIds.length > 0) {
    const [acrescimos] = await pool.query(
      `SELECT id, nome_item, tipo_medida, quantidade_referencia, valor
         FROM acrescimos
        WHERE id IN (${acrescimosIds.map(() => "?").join(",")})`,
      acrescimosIds,
    );

    acrescimos.forEach((item) => {
      itens.push(
        criarLinhaFaturamento(base, {
          tipo_item: "acrescimo",
          tipo_refeicao: prescricao.tipo_alimentacao,
          chave_dieta: null,
          referencia_id: item.id,
          referencia_nome: item.nome_item,
          valor_unitario: item.valor || 0,
          detalhe_json: {
            tipo_medida: item.tipo_medida || null,
            quantidade_referencia: item.quantidade_referencia || null,
          },
        }),
      );
    });
  }

  const itensEspeciaisIds = [
    ...new Set(
      parseJsonArray(prescricao.itens_especiais_ids)
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id)),
    ),
  ];

  if (itensEspeciaisIds.length > 0) {
    const [itensLactario] = await pool.query(
      `SELECT ie.id, ie.produto, ie.gramatura, ie.valor, tr.nome AS tipo_refeicao_nome
         FROM itens_refeicao_especial ie
         LEFT JOIN tipos_refeicao tr ON tr.id = ie.refeicao_id
        WHERE ie.id IN (${itensEspeciaisIds.map(() => "?").join(",")})`,
      itensEspeciaisIds,
    );

    itensLactario.forEach((item) => {
      itens.push(
        criarLinhaFaturamento(base, {
          tipo_item: "lactario",
          tipo_refeicao: item.tipo_refeicao_nome || prescricao.tipo_alimentacao,
          chave_dieta: "LACTARIO",
          referencia_id: item.id,
          referencia_nome: item.produto,
          valor_unitario: item.valor || 0,
          detalhe_json: {
            gramatura: item.gramatura || null,
          },
        }),
      );
    });
  }

  const acompanhanteRefeicoes = [
    ...new Set(
      parseJsonArray(prescricao.acompanhante_refeicoes)
        .map((item) => String(item || "").trim())
        .filter(Boolean),
    ),
  ];
  if (prescricao.tem_acompanhante && acompanhanteRefeicoes.length > 0) {
    for (const refeicao of acompanhanteRefeicoes) {
      const precoAcompanhante = await buscarPrecoRefeicao({
        categoria: "acompanhante",
        chaveDieta: "NORMAL ACOMPANHANTE",
        tipoRefeicaoNome: refeicao,
      });

      itens.push(
        criarLinhaFaturamento(base, {
          tipo_item: "acompanhante",
          tipo_refeicao: refeicao,
          chave_dieta: "NORMAL ACOMPANHANTE",
          referencia_nome: `Acompanhante - ${refeicao}`,
          valor_unitario: precoAcompanhante?.valor || 0,
          status: precoAcompanhante ? "cobrado" : "pendente_preco",
          detalhe_json: {
            tipo_acompanhante: prescricao.tipo_acompanhante || null,
            tabela_preco_id: precoAcompanhante?.id || null,
          },
        }),
      );
    }
  }

  return itens;
}

async function inserirItensFaturamento(itens) {
  if (!itens.length) return;

  const values = itens.map((item) => [
    item.prescricao_id,
    item.versao,
    1,
    item.data_consumo,
    item.paciente_nome,
    item.paciente_cpf,
    item.codigo_atendimento,
    item.convenio,
    item.nucleo,
    item.leito,
    item.tipo_item,
    item.tipo_refeicao,
    item.dieta_original,
    item.chave_dieta,
    item.referencia_id,
    item.referencia_nome,
    item.quantidade,
    item.valor_unitario,
    item.valor_total,
    item.status,
    item.detalhe_json,
  ]);

  await pool.query(
    `INSERT INTO faturamento_itens (
      prescricao_id, versao, ativo, data_consumo,
      paciente_nome, paciente_cpf, codigo_atendimento, convenio, nucleo, leito,
      tipo_item, tipo_refeicao, dieta_original, chave_dieta,
      referencia_id, referencia_nome, quantidade, valor_unitario, valor_total,
      status, detalhe_json
    ) VALUES ?`,
    [values],
  );
}

async function sincronizarFaturamentoPrescricao(prescricaoId) {
  const prescricao = await buscarPrescricaoPorId(prescricaoId);
  if (!prescricao) {
    throw new Error("Prescrição não encontrada para faturamento");
  }

  const versao = await buscarProximaVersao(prescricaoId);

  await pool.query(
    `UPDATE faturamento_itens
        SET ativo = 0,
            status = 'cancelado',
            cancelado_em = NOW(),
            motivo_cancelamento = 'Reprocessado após alteração da prescrição'
      WHERE prescricao_id = ?
        AND ativo = 1`,
    [prescricaoId],
  );

  const itens = await montarItensFaturamento(prescricao, versao);
  await inserirItensFaturamento(itens);

  return {
    prescricaoId,
    versao,
    itensGerados: itens.length,
    itensPendentes: itens.filter((item) => item.status === "pendente_preco")
      .length,
  };
}

async function cancelarFaturamentoPrescricao(
  prescricaoId,
  motivo = "Prescrição removida",
) {
  await pool.query(
    `UPDATE faturamento_itens
        SET ativo = 0,
            status = 'cancelado',
            cancelado_em = NOW(),
            motivo_cancelamento = ?
      WHERE prescricao_id = ?
        AND ativo = 1`,
    [motivo, prescricaoId],
  );
}

function construirWhereFiltros(filtros = {}) {
  const where = ["ativo = 1"];
  const params = [];

  if (filtros.dataInicio) {
    where.push("DATE(data_consumo) >= ?");
    params.push(filtros.dataInicio);
  }

  if (filtros.dataFim) {
    where.push("DATE(data_consumo) <= ?");
    params.push(filtros.dataFim);
  }

  if (filtros.paciente) {
    where.push("paciente_nome LIKE ?");
    params.push(`%${filtros.paciente}%`);
  }

  if (filtros.cpf) {
    where.push(
      "REPLACE(REPLACE(REPLACE(paciente_cpf, '.', ''), '-', ''), ' ', '') LIKE ?",
    );
    params.push(`%${String(filtros.cpf).replace(/\D/g, "")}%`);
  }

  if (filtros.codigoAtendimento) {
    where.push("codigo_atendimento LIKE ?");
    params.push(`%${filtros.codigoAtendimento}%`);
  }

  if (filtros.convenio) {
    where.push("convenio = ?");
    params.push(filtros.convenio);
  }

  if (filtros.nucleo) {
    where.push("nucleo = ?");
    params.push(filtros.nucleo);
  }

  if (filtros.leito) {
    where.push("leito = ?");
    params.push(filtros.leito);
  }

  if (filtros.tipoRefeicao) {
    where.push("tipo_refeicao = ?");
    params.push(filtros.tipoRefeicao);
  }

  if (filtros.dieta) {
    where.push("(dieta_original = ? OR chave_dieta = ?)");
    params.push(filtros.dieta, filtros.dieta);
  }

  if (filtros.tipoItem) {
    where.push("tipo_item = ?");
    params.push(filtros.tipoItem);
  }

  if (filtros.status) {
    where.push("status = ?");
    params.push(filtros.status);
  }

  return {
    whereSql: where.length ? `WHERE ${where.join(" AND ")}` : "",
    params,
  };
}

async function obterResumoFaturamento(filtros = {}) {
  const { whereSql, params } = construirWhereFiltros(filtros);
  const periodos = getPeriodosAtuais();

  const [[totais]] = await pool.query(
    `SELECT
        COALESCE(SUM(CASE WHEN DATE(data_consumo) = ? AND status = 'cobrado' THEN valor_total ELSE 0 END), 0) AS total_hoje,
        COALESCE(SUM(CASE WHEN DATE(data_consumo) BETWEEN ? AND ? AND status = 'cobrado' THEN valor_total ELSE 0 END), 0) AS total_semana,
        COALESCE(SUM(CASE WHEN DATE(data_consumo) BETWEEN ? AND ? AND status = 'cobrado' THEN valor_total ELSE 0 END), 0) AS total_mes,
        COALESCE(SUM(CASE WHEN DATE(data_consumo) BETWEEN ? AND ? AND status = 'cobrado' THEN valor_total ELSE 0 END), 0) AS total_ano,
        COALESCE(SUM(CASE WHEN status = 'cobrado' THEN valor_total ELSE 0 END), 0) AS total_filtrado,
        COUNT(*) AS quantidade_itens,
        COUNT(DISTINCT paciente_cpf) AS quantidade_pacientes,
        SUM(CASE WHEN status = 'pendente_preco' THEN 1 ELSE 0 END) AS pendencias_preco
       FROM faturamento_itens
       ${whereSql}`,
    [
      periodos.hoje,
      periodos.inicioSemana,
      periodos.fimSemana,
      periodos.inicioMes,
      periodos.fimMes,
      periodos.inicioAno,
      periodos.fimAno,
      ...params,
    ],
  );

  const [mensal] = await pool.query(
    `SELECT
        DATE_FORMAT(data_consumo, '%Y-%m') AS referencia,
        COALESCE(SUM(CASE WHEN status = 'cobrado' THEN valor_total ELSE 0 END), 0) AS total
       FROM faturamento_itens
       ${whereSql} ${whereSql ? "AND" : "WHERE"} DATE(data_consumo) BETWEEN ? AND ?
       GROUP BY DATE_FORMAT(data_consumo, '%Y-%m')
       ORDER BY referencia`,
    [...params, periodos.inicioAno, periodos.fimAno],
  );

  return { totais, mensal };
}

async function listarAnaliticoFaturamento(filtros = {}) {
  const page = Number(filtros.page || 1);
  const limit = Number(filtros.limit || 20);
  const offset = (page - 1) * limit;

  const { whereSql, params } = construirWhereFiltros(filtros);

  const [rows] = await pool.query(
    `SELECT *
       FROM faturamento_itens
       ${whereSql}
      ORDER BY data_consumo DESC, paciente_nome ASC, id DESC
      LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS total FROM faturamento_itens ${whereSql}`,
    params,
  );

  const [[totalRow]] = await pool.query(
    `SELECT COALESCE(SUM(CASE WHEN status = 'cobrado' THEN valor_total ELSE 0 END), 0) AS valor_total
       FROM faturamento_itens
       ${whereSql}`,
    params,
  );

  return {
    itens: rows,
    paginacao: {
      total: Number(countRow.total || 0),
      pagina: page,
      limite: limit,
      totalPaginas: Math.max(1, Math.ceil(Number(countRow.total || 0) / limit)),
    },
    totais: {
      valor_total: Number(totalRow.valor_total || 0),
    },
  };
}

async function exportarFaturamentoExcel(filtros = {}) {
  const { whereSql, params } = construirWhereFiltros(filtros);

  const [rows] = await pool.query(
    `SELECT *
       FROM faturamento_itens
       ${whereSql}
      ORDER BY data_consumo DESC, paciente_nome ASC, id DESC`,
    params,
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Faturamento");

  sheet.columns = [
    { header: "Data Consumo", key: "data_consumo", width: 14 },
    { header: "Paciente", key: "paciente_nome", width: 28 },
    { header: "CPF", key: "paciente_cpf", width: 18 },
    { header: "Atendimento", key: "codigo_atendimento", width: 16 },
    { header: "Convênio", key: "convenio", width: 18 },
    { header: "Núcleo", key: "nucleo", width: 18 },
    { header: "Leito", key: "leito", width: 12 },
    { header: "Tipo Item", key: "tipo_item", width: 18 },
    { header: "Refeição", key: "tipo_refeicao", width: 16 },
    { header: "Dieta Original", key: "dieta_original", width: 24 },
    { header: "Chave Faturamento", key: "chave_dieta", width: 22 },
    { header: "Referência", key: "referencia_nome", width: 28 },
    { header: "Qtd", key: "quantidade", width: 10 },
    { header: "Valor Unitário", key: "valor_unitario", width: 16 },
    { header: "Valor Total", key: "valor_total", width: 16 },
    { header: "Status", key: "status", width: 16 },
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0F8F87" },
  };

  rows.forEach((row) => {
    sheet.addRow({
      ...row,
      data_consumo: row.data_consumo ? new Date(row.data_consumo) : null,
    });
  });

  sheet.getColumn("data_consumo").numFmt = "dd/mm/yyyy";
  sheet.getColumn("valor_unitario").numFmt = "R$ #,##0.00";
  sheet.getColumn("valor_total").numFmt = "R$ #,##0.00";

  const total = rows
    .filter((row) => row.status === "cobrado")
    .reduce((acc, row) => acc + Number(row.valor_total || 0), 0);

  const totalRow = sheet.addRow({
    referencia_nome: "TOTAL GERAL",
    valor_total: total,
  });

  totalRow.font = { bold: true };
  totalRow.getCell("N").font = { bold: true };
  totalRow.getCell("O").numFmt = "R$ #,##0.00";

  const resumo = workbook.addWorksheet("Resumo");
  resumo.columns = [
    { header: "Filtro", key: "filtro", width: 24 },
    { header: "Valor", key: "valor", width: 40 },
  ];
  resumo.getRow(1).font = { bold: true };

  Object.entries({
    dataInicio: filtros.dataInicio || "Todos",
    dataFim: filtros.dataFim || "Todos",
    paciente: filtros.paciente || "Todos",
    cpf: filtros.cpf || "Todos",
    codigoAtendimento: filtros.codigoAtendimento || "Todos",
    convenio: filtros.convenio || "Todos",
    nucleo: filtros.nucleo || "Todos",
    leito: filtros.leito || "Todos",
    tipoRefeicao: filtros.tipoRefeicao || "Todos",
    dieta: filtros.dieta || "Todos",
    tipoItem: filtros.tipoItem || "Todos",
  }).forEach(([filtro, valor]) => resumo.addRow({ filtro, valor }));

  resumo.addRow({ filtro: "Itens exportados", valor: rows.length });
  resumo.addRow({ filtro: "Total cobrado", valor: total });
  resumo.getColumn("valor").numFmt = "R$ #,##0.00";
  resumo.getCell(`B${resumo.rowCount}`).numFmt = "R$ #,##0.00";

  return workbook.xlsx.writeBuffer();
}

async function reprocessarHistoricoFaturamento() {
  const [prescricoes] = await pool.query(
    "SELECT id FROM prescricoes ORDER BY id",
  );

  const resultado = {
    totalPrescricoes: prescricoes.length,
    processadas: 0,
    erros: [],
  };

  for (const prescricao of prescricoes) {
    try {
      await sincronizarFaturamentoPrescricao(prescricao.id);
      resultado.processadas += 1;
    } catch (error) {
      resultado.erros.push({
        prescricaoId: prescricao.id,
        erro: error.message,
      });
    }
  }

  return resultado;
}

async function listarOpcoesFiltroFaturamento() {
  const [convenios] = await pool.query(`
    SELECT DISTINCT convenio
      FROM faturamento_itens
     WHERE ativo = 1
       AND convenio IS NOT NULL
       AND TRIM(convenio) <> ''
     ORDER BY convenio
  `);

  const [nucleos] = await pool.query(`
    SELECT DISTINCT nucleo
      FROM faturamento_itens
     WHERE ativo = 1
       AND nucleo IS NOT NULL
       AND TRIM(nucleo) <> ''
     ORDER BY nucleo
  `);

  const [tiposRefeicao] = await pool.query(`
    SELECT DISTINCT tipo_refeicao
      FROM faturamento_itens
     WHERE ativo = 1
       AND tipo_refeicao IS NOT NULL
       AND TRIM(tipo_refeicao) <> ''
     ORDER BY tipo_refeicao
  `);

  const [dietas] = await pool.query(`
    SELECT DISTINCT dieta_original
      FROM faturamento_itens
     WHERE ativo = 1
       AND dieta_original IS NOT NULL
       AND TRIM(dieta_original) <> ''
     ORDER BY dieta_original
  `);

  return {
    convenios: convenios.map((row) => row.convenio),
    nucleos: nucleos.map((row) => row.nucleo),
    tiposRefeicao: tiposRefeicao.map((row) => row.tipo_refeicao),
    dietas: dietas.map((row) => row.dieta_original),
  };
}

module.exports = {
  cancelarFaturamentoPrescricao,
  exportarFaturamentoExcel,
  listarAnaliticoFaturamento,
  normalizeText,
  obterResumoFaturamento,
  listarOpcoesFiltroFaturamento,
  reprocessarHistoricoFaturamento,
  resolverChaveDieta,
  sincronizarFaturamentoPrescricao,
};
