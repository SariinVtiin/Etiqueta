// backend/routes/prescricoes.js
// VERSÃO ATUALIZADA: Com cálculo automático de data de consumo por refeição

const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");
const { autenticar } = require("./auth");
const { buscarHoraCorte } = require("./configuracoes");
const {
  cancelarFaturamentoPrescricao,
  sincronizarFaturamentoPrescricao,
} = require("../services/faturamento");
/**
 * FUNÇÃO: Calcular data de consumo da prescrição
 *
 * Lógica:
 *   Se criado até hora_corte:
 *     grupo 'atual'   → hoje
 *     grupo 'proximo' → amanhã
 *   Se criado após hora_corte:
 *     grupo 'atual'   → amanhã
 *     grupo 'proximo' → depois de amanhã
 *
 * @param {string} tipoAlimentacao - Nome do tipo de refeição
 * @returns {string} Data no formato YYYY-MM-DD
 */
async function calcularDataConsumo(tipoAlimentacao) {
  try {
    // Buscar grupo_dia da refeição
    const [[refeicao]] = await pool.query(
      "SELECT grupo_dia FROM tipos_refeicao WHERE nome = ? AND ativa = 1",
      [tipoAlimentacao],
    );

    const grupoDia = refeicao ? refeicao.grupo_dia : "proximo";

    // Buscar hora de corte configurada
    const horaCorteStr = await buscarHoraCorte();
    const [horaCorteH, horaCorteM] = horaCorteStr.split(":").map(Number);

    // Data e hora atual (horário do servidor)
    const agora = new Date();
    const horaAtual = agora.getHours();
    const minAtual = agora.getMinutes();

    const dentroDoCOrte =
      horaAtual < horaCorteH ||
      (horaAtual === horaCorteH && minAtual <= horaCorteM);

    // Calcular offset de dias
    let offsetDias;
    if (dentroDoCOrte) {
      offsetDias = grupoDia === "atual" ? 0 : 1;
    } else {
      offsetDias = grupoDia === "atual" ? 1 : 2;
    }

    const dataConsumo = new Date(agora);
    dataConsumo.setDate(dataConsumo.getDate() + offsetDias);

    // Formatar como YYYY-MM-DD
    const ano = dataConsumo.getFullYear();
    const mes = String(dataConsumo.getMonth() + 1).padStart(2, "0");
    const dia = String(dataConsumo.getDate()).padStart(2, "0");

    const dataFormatada = `${ano}-${mes}-${dia}`;

    console.log(`📅 Data de consumo calculada:
      Refeição: ${tipoAlimentacao} (grupo: ${grupoDia})
      Hora atual: ${horaAtual}:${String(minAtual).padStart(2, "0")} | Corte: ${horaCorteStr}
      Dentro do corte: ${dentroDoCOrte} | Offset: +${offsetDias} dia(s)
      Data consumo: ${dataFormatada}`);

    return dataFormatada;
  } catch (erro) {
    console.error("❌ Erro ao calcular data de consumo:", erro);
    // Fallback: data de hoje
    const hoje = new Date();
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
  }
}

function normalizarTextoComparacao(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizarArrayTextoUnico(values = []) {
  const lista = Array.isArray(values) ? values : [];
  return [
    ...new Set(lista.map((item) => String(item || "").trim()).filter(Boolean)),
  ];
}

function normalizarArrayNumericoUnico(values = []) {
  const lista = Array.isArray(values) ? values : [];
  return [
    ...new Set(
      lista.map((item) => Number(item)).filter((item) => Number.isFinite(item)),
    ),
  ];
}

function filtrarRefeicoesAcompanhanteDaPrescricao(
  tipoAlimentacao,
  acompanhanteRefeicoes = [],
) {
  const alvo = normalizarTextoComparacao(tipoAlimentacao);
  return normalizarArrayTextoUnico(acompanhanteRefeicoes).filter(
    (item) => normalizarTextoComparacao(item) === alvo,
  );
}

/**
 * FUNÇÃO AUXILIAR: Salvar ou Atualizar Paciente
 */
async function salvarOuAtualizarPaciente(dados) {
  const {
    cpf,
    codigoAtendimento,
    convenio,
    nomePaciente,
    nomeMae,
    dataNascimento,
    idade,
  } = dados;

  const cpfLimpo = cpf.replace(/\D/g, "");

  try {
    // 1. Verificar se o código de atendimento pertence a OUTRO paciente
    const [codigoExistente] = await pool.query(
      `SELECT cpf, nome_paciente FROM pacientes 
       WHERE codigo_atendimento = ? 
       AND REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") != ?`,
      [codigoAtendimento, cpfLimpo],
    );

    if (codigoExistente.length > 0) {
      throw new Error(
        `Código de atendimento ${codigoAtendimento} já está em uso pelo paciente: ${codigoExistente[0].nome_paciente}`,
      );
    }

    // 2. Verificar se o paciente já existe pelo CPF
    const [pacientesExistentes] = await pool.query(
      'SELECT id, nome_paciente FROM pacientes WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?',
      [cpfLimpo],
    );

    if (pacientesExistentes.length > 0) {
      console.log(
        `🔄 Atualizando paciente existente: ${pacientesExistentes[0].nome_paciente} (CPF: ${cpfLimpo})`,
      );
      await pool.query(
        `UPDATE pacientes SET 
          codigo_atendimento = ?,
          convenio = ?,
          nome_paciente = ?,
          nome_mae = ?,
          data_nascimento = ?,
          idade = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          codigoAtendimento,
          convenio,
          nomePaciente,
          nomeMae,
          dataNascimento,
          idade,
          pacientesExistentes[0].id,
        ],
      );
      return pacientesExistentes[0].id;
    }

    // 3. Paciente novo — tentar INSERT
    console.log(`🆕 Criando novo paciente: ${nomePaciente} (CPF: ${cpfLimpo})`);
    const [resultado] = await pool.query(
      `INSERT INTO pacientes (
        cpf, codigo_atendimento, convenio, nome_paciente, 
        nome_mae, data_nascimento, idade
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cpfLimpo,
        codigoAtendimento,
        convenio,
        nomePaciente,
        nomeMae,
        dataNascimento,
        idade,
      ],
    );

    console.log(`✅ Novo paciente criado! ID: ${resultado.insertId}`);
    return resultado.insertId;
  } catch (erro) {
    // 4. RACE CONDITION: outra request já inseriu o mesmo CPF
    //    Trata o erro de duplicata fazendo UPDATE ao invés de falhar
    if (erro.code === "ER_DUP_ENTRY" && erro.sqlMessage?.includes(cpfLimpo)) {
      console.log(
        `⚡ Race condition detectada para CPF ${cpfLimpo} — fazendo UPDATE ao invés de INSERT`,
      );

      const [pacienteJaCriado] = await pool.query(
        'SELECT id FROM pacientes WHERE REPLACE(REPLACE(REPLACE(cpf, ".", ""), "-", ""), " ", "") = ?',
        [cpfLimpo],
      );

      if (pacienteJaCriado.length > 0) {
        await pool.query(
          `UPDATE pacientes SET 
            codigo_atendimento = ?,
            convenio = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [codigoAtendimento, convenio, pacienteJaCriado[0].id],
        );
        console.log(
          `✅ Paciente atualizado após race condition! ID: ${pacienteJaCriado[0].id}`,
        );
        return pacienteJaCriado[0].id;
      }
    }

    console.error(`❌ Erro ao salvar paciente:`, erro);
    throw erro;
  }
}

/**
 * Validar se prescrição pode ser editada ou excluída
 * Regra: Até 9h do dia seguinte
 */
function podeEditarOuExcluir(dataPrescricao) {
  const agora = new Date();
  const prescricao = new Date(dataPrescricao);

  const limite = new Date(prescricao);
  limite.setDate(limite.getDate() + 1);
  limite.setHours(9, 0, 0, 0);

  return agora <= limite;
}

/**
 * GET /api/prescricoes - Listar prescrições com filtros
 */
router.get("/", autenticar, async (req, res) => {
  try {
    const {
      busca,
      dataInicio,
      dataFim,
      setor,
      refeicao,
      page = 1,
      limit = 20,
    } = req.query;

    let query = "SELECT * FROM prescricoes WHERE 1=1";
    const params = [];

    if (busca) {
      query += " AND (nome_paciente LIKE ? OR cpf LIKE ? OR leito LIKE ?)";
      const buscaParam = `%${busca}%`;
      params.push(buscaParam, buscaParam, buscaParam);
    }

    if (dataInicio) {
      query += " AND DATE(data_prescricao) >= ?";
      params.push(dataInicio);
    }

    if (dataFim) {
      query += " AND DATE(data_prescricao) <= ?";
      params.push(dataFim);
    }

    if (setor) {
      query += " AND nucleo = ?";
      params.push(setor);
    }

    if (refeicao) {
      query += " AND tipo_alimentacao = ?";
      params.push(refeicao);
    }

    query += " ORDER BY data_prescricao DESC";

    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), parseInt(offset));

    const [prescricoes] = await pool.query(query, params);

    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) as total FROM prescricoes WHERE 1=1",
    );

    res.json({
      sucesso: true,
      prescricoes,
      paginacao: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPaginas: Math.ceil(total / limit),
      },
    });
  } catch (erro) {
    console.error("Erro ao listar prescrições:", erro);
    res
      .status(500)
      .json({ sucesso: false, erro: "Erro ao listar prescrições" });
  }
});

/**
 * GET /api/prescricoes/:id - Buscar prescrição por ID
 */
router.get("/:id", autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [prescricoes] = await pool.query(
      "SELECT * FROM prescricoes WHERE id = ?",
      [id],
    );

    if (prescricoes.length === 0) {
      return res
        .status(404)
        .json({ sucesso: false, erro: "Prescrição não encontrada" });
    }

    res.json({ sucesso: true, prescricao: prescricoes[0] });
  } catch (erro) {
    console.error("Erro ao buscar prescrição:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro ao buscar prescrição" });
  }
});

/**
 * POST /api/prescricoes - Criar nova prescrição
 * ✅ ATUALIZADO: Calcula data_prescricao automaticamente com base no grupo_dia da refeição
 */
router.post("/", autenticar, async (req, res) => {
  try {
    const {
      cpf,
      codigoAtendimento,
      convenio,
      nomePaciente,
      nomeMae,
      dataNascimento,
      idade,
      nucleo,
      leito,
      tipoAlimentacao,
      dieta,
      restricoes,
      semPrincipal,
      descricaoSemPrincipal,
      substituicaoPrincipalIds,
      obsExclusao,
      obsAcrescimo,
      acrescimosIds,
      itensEspeciaisIds,
      temAcompanhante,
      tipoAcompanhante,
      acompanhanteRefeicoes,
      acompanhanteRestricoesIds,
      acompanhanteObsLivre,
    } = req.body;

    const temItensEspeciais = itensEspeciaisIds && itensEspeciaisIds.length > 0;
    if (
      !tipoAlimentacao ||
      (!dieta && !temItensEspeciais) ||
      !nomePaciente ||
      !cpf
    ) {
      return res
        .status(400)
        .json({ sucesso: false, erro: "Campos obrigatórios faltando" });
    }

    console.log("📦 Dados recebidos:", {
      cpf,
      nomePaciente,
      tipoAlimentacao,
      dieta,
      temAcompanhante: temAcompanhante || false,
      tipoAcompanhante: tipoAcompanhante || null,
      acrescimosIds: acrescimosIds
        ? `[${acrescimosIds.length} itens]`
        : "nenhum",
    });

    // ✅ NOVO: Calcular data de consumo com base na refeição e hora de corte
    const dataConsumo = await calcularDataConsumo(tipoAlimentacao);

    // Salvar/Atualizar paciente
    await salvarOuAtualizarPaciente({
      cpf,
      codigoAtendimento,
      convenio,
      nomePaciente,
      nomeMae,
      dataNascimento,
      idade,
    });
    const acrescimosIdsNormalizados =
      normalizarArrayNumericoUnico(acrescimosIds);
    const itensEspeciaisIdsNormalizados =
      normalizarArrayNumericoUnico(itensEspeciaisIds);
    const acompanhanteRefeicoesNormalizadas =
      filtrarRefeicoesAcompanhanteDaPrescricao(
        tipoAlimentacao,
        acompanhanteRefeicoes,
      );
    const acompanhanteRestricoesIdsNormalizados = normalizarArrayNumericoUnico(
      acompanhanteRestricoesIds,
    );

    const temAcompanhanteNaPrescricao =
      Boolean(temAcompanhante) && acompanhanteRefeicoesNormalizadas.length > 0;
    // ✅ ATUALIZADO: INSERT com campos do acompanhante
    const [resultado] = await pool.query(
      `INSERT INTO prescricoes (
        cpf, codigo_atendimento, convenio, nome_paciente, nome_mae,
        data_nascimento, idade, nucleo, leito, tipo_alimentacao, dieta,
        restricoes, sem_principal, descricao_sem_principal,
        obs_exclusao, obs_acrescimo, acrescimos_ids, itens_especiais_ids,
        tem_acompanhante, tipo_acompanhante, acompanhante_refeicoes,
        acompanhante_restricoes_ids, acompanhante_obs_livre,
        data_prescricao, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cpf,
        codigoAtendimento,
        convenio,
        nomePaciente,
        nomeMae,
        dataNascimento,
        idade,
        nucleo,
        leito,
        tipoAlimentacao,
        dieta,
        restricoes ? JSON.stringify(restricoes) : null,
        semPrincipal || false,
        descricaoSemPrincipal || null,
        substituicaoPrincipalIds 
          ? JSON.stringify(substituicaoPrincipalIds) : null,
        obsExclusao || null,
        obsAcrescimo || null,
        acrescimosIdsNormalizados.length
          ? JSON.stringify(acrescimosIdsNormalizados)
          : null,
        itensEspeciaisIdsNormalizados.length
          ? JSON.stringify(itensEspeciaisIdsNormalizados)
          : null,
        temAcompanhanteNaPrescricao,
        temAcompanhanteNaPrescricao ? tipoAcompanhante || null : null,
        acompanhanteRefeicoesNormalizadas.length
          ? JSON.stringify(acompanhanteRefeicoesNormalizadas)
          : null,
        acompanhanteRestricoesIdsNormalizados.length
          ? JSON.stringify(acompanhanteRestricoesIdsNormalizados)
          : null,
        temAcompanhanteNaPrescricao ? acompanhanteObsLivre || null : null,
        dataConsumo,
        req.usuario.id,
      ],
    );

    let avisoFaturamento = null;

    try {
      await sincronizarFaturamentoPrescricao(resultado.insertId);
    } catch (erroFaturamento) {
      console.error(
        "Erro ao gerar faturamento da nova prescrição:",
        erroFaturamento,
      );
      avisoFaturamento =
        "Prescrição criada, mas o faturamento precisa ser reprocessado.";
    }

    console.log(
      `✅ Prescrição criada! ID: ${resultado.insertId} | Acompanhante: ${temAcompanhante ? "SIM" : "NÃO"}`,
    );

    res.status(201).json({
      sucesso: true,
      mensagem: "Prescrição criada com sucesso",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar prescrição:", erro);
    res.status(500).json({ sucesso: false, erro: "Erro ao criar prescrição" });
  }
});

/**
 * PUT /api/prescricoes/:id - Atualizar prescrição
 * NOTA: data_prescricao NÃO é recalculada na edição (mantém a data original de consumo)
 */
router.put("/:id", autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [prescricoes] = await pool.query(
      "SELECT * FROM prescricoes WHERE id = ?",
      [id],
    );

    if (prescricoes.length === 0) {
      return res
        .status(404)
        .json({ sucesso: false, erro: "Prescrição não encontrada" });
    }

    const prescricao = prescricoes[0];

    if (!podeEditarOuExcluir(prescricao.criado_em)) {
      return res.status(403).json({
        sucesso: false,
        erro: "Prescrição não pode mais ser editada. Limite: 9h do dia seguinte.",
      });
    }

    const {
      cpf,
      codigoAtendimento,
      convenio,
      nomePaciente,
      nomeMae,
      dataNascimento,
      idade,
      nucleo,
      leito,
      tipoAlimentacao,
      dieta,
      restricoes,
      semPrincipal,
      descricaoSemPrincipal,
      obsExclusao,
      obsAcrescimo,
      acrescimosIds,
      itensEspeciaisIds,
    } = req.body;

    await pool.query(
      `UPDATE prescricoes SET
        cpf = ?, codigo_atendimento = ?, convenio = ?, nome_paciente = ?,
        nome_mae = ?, data_nascimento = ?, idade = ?, nucleo = ?, leito = ?,
        tipo_alimentacao = ?, dieta = ?, restricoes = ?, sem_principal = ?,
        descricao_sem_principal = ?, substituicao_principal_ids = ?, obs_exclusao = ?, obs_acrescimo = ?,
        acrescimos_ids = ?, itens_especiais_ids = ?
      WHERE id = ?`,
      [
        cpf,
        codigoAtendimento,
        convenio,
        nomePaciente,
        nomeMae,
        dataNascimento,
        idade,
        nucleo,
        leito,
        tipoAlimentacao,
        dieta,
        restricoes ? JSON.stringify(restricoes) : null,
        semPrincipal || false,
        descricaoSemPrincipal || null,
        substituicaoPrincipalIds ? JSON.stringify(substituicaoPrincipalIds) : null,
        obsExclusao || null,
        obsAcrescimo || null,
        acrescimosIds ? JSON.stringify(acrescimosIds) : null,
        itensEspeciaisIds ? JSON.stringify(itensEspeciaisIds) : null,
        id,
      ],
    );

    let avisoFaturamento = null;

    try {
      await sincronizarFaturamentoPrescricao(id);
    } catch (erroFaturamento) {
      console.error(
        "Erro ao reprocessar faturamento da prescrição:",
        erroFaturamento,
      );
      avisoFaturamento =
        "Prescrição atualizada, mas o faturamento precisa ser reprocessado.";
    }

    console.log(`✅ Prescrição ${id} atualizada com sucesso!`);

    res.json({ sucesso: true, mensagem: "Prescrição atualizada com sucesso" });
  } catch (erro) {
    console.error("Erro ao atualizar prescrição:", erro);
    res
      .status(500)
      .json({ sucesso: false, erro: "Erro ao atualizar prescrição" });
  }
});

/**
 * DELETE /api/prescricoes/:id - Deletar prescrição
 */
router.delete("/:id", autenticar, async (req, res) => {
  try {
    const { id } = req.params;

    const [prescricoes] = await pool.query(
      "SELECT * FROM prescricoes WHERE id = ?",
      [id],
    );

    if (prescricoes.length === 0) {
      return res
        .status(404)
        .json({ sucesso: false, erro: "Prescrição não encontrada" });
    }

    const prescricao = prescricoes[0];

    if (!podeEditarOuExcluir(prescricao.criado_em)) {
      return res.status(403).json({
        sucesso: false,
        erro: "Prescrição não pode mais ser excluída. Limite: 9h do dia seguinte.",
      });
    }

    await cancelarFaturamentoPrescricao(id, "Prescrição excluída pelo usuário");

    await pool.query("DELETE FROM prescricoes WHERE id = ?", [id]);

    res.json({ sucesso: true, mensagem: "Prescrição excluída com sucesso" });
  } catch (erro) {
    console.error("Erro ao excluir prescrição:", erro);
    res
      .status(500)
      .json({ sucesso: false, erro: "Erro ao excluir prescrição" });
  }
});

module.exports = router;
