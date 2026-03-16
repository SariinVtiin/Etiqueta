// frontend/src/services/api.js
// ============================================
// SALUSVITA TECH - API Service
// Desenvolvido por FerMax Solution
// ============================================
// SEGURANÇA:
// - sessionStorage (expira ao fechar navegador)
// - TODAS as chamadas usam fetchAuth (interceptor 401 global)
// - fetchConfigAuth ELIMINADO (era bypass do interceptor)
// ============================================

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Obter token do sessionStorage
 */
const getToken = () => {
  return sessionStorage.getItem("token");
};

/**
 * Flag para evitar múltiplos redirects simultâneos
 */
let isRedirecting = false;

/**
 * Redireciona para login ao detectar sessão expirada
 */
const redirectToLogin = () => {
  if (isRedirecting) return;
  isRedirecting = true;
  sessionStorage.removeItem("token");
  window.location.href = "/login";
};

/**
 * Fetch centralizado com interceptação de 401
 * TODA chamada autenticada DEVE usar esta função
 */
const fetchAuth = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    redirectToLogin();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  return response;
};

/**
 * fetchAuth para uploads (FormData — sem Content-Type, o browser define)
 */
const fetchAuthUpload = async (url, options = {}) => {
  const config = {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    redirectToLogin();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  return response;
};

/**
 * Handler genérico de respostas
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ erro: "Erro na requisição" }));
    throw new Error(error.erro || "Erro na requisição");
  }
  return response.json();
};

// ============================================
// ENDPOINTS - TESTE E STATUS
// ============================================

export const testarConexao = async () => {
  const response = await fetch(`${API_URL}/teste`);
  return handleResponse(response);
};

export const buscarStatus = async () => {
  const response = await fetch(`${API_URL}/status`);
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - LEITOS
// ============================================

export const listarLeitos = async (todas = false) => {
  const url = todas ? `${API_URL}/leitos?todas=true` : `${API_URL}/leitos`;
  const response = await fetchAuth(url);
  return handleResponse(response);
};

export const listarSetores = async () => {
  const response = await fetchAuth(`${API_URL}/leitos/setores`);
  return handleResponse(response);
};

export const criarLeito = async (leito) => {
  const response = await fetchAuth(`${API_URL}/leitos`, {
    method: "POST",
    body: JSON.stringify(leito),
  });
  return handleResponse(response);
};

export const criarLeitosLote = async (dados) => {
  const response = await fetchAuth(`${API_URL}/leitos/lote`, {
    method: "POST",
    body: JSON.stringify(dados),
  });
  return handleResponse(response);
};

export const atualizarLeito = async (id, leito) => {
  const response = await fetchAuth(`${API_URL}/leitos/${id}`, {
    method: "PUT",
    body: JSON.stringify(leito),
  });
  return handleResponse(response);
};

export const toggleLeitoAtivo = async (id, ativo) => {
  const response = await fetchAuth(`${API_URL}/leitos/${id}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ ativo }),
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - PRESCRIÇÕES
// ============================================

export const listarPrescricoes = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.busca) params.append("busca", filtros.busca);
  if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
  if (filtros.dataFim) params.append("dataFim", filtros.dataFim);
  if (filtros.setor) params.append("setor", filtros.setor);
  if (filtros.refeicao) params.append("refeicao", filtros.refeicao);
  if (filtros.page) params.append("page", filtros.page);
  if (filtros.limit) params.append("limit", filtros.limit);

  const response = await fetchAuth(`${API_URL}/prescricoes?${params.toString()}`);
  return handleResponse(response);
};

export const buscarPrescricao = async (id) => {
  const response = await fetchAuth(`${API_URL}/prescricoes/${id}`);
  return handleResponse(response);
};

export const criarPrescricao = async (prescricao) => {
  const response = await fetchAuth(`${API_URL}/prescricoes`, {
    method: "POST",
    body: JSON.stringify(prescricao),
  });
  return handleResponse(response);
};

export const atualizarPrescricao = async (id, prescricao) => {
  const response = await fetchAuth(`${API_URL}/prescricoes/${id}`, {
    method: "PUT",
    body: JSON.stringify(prescricao),
  });
  return handleResponse(response);
};

export const deletarPrescricao = async (id) => {
  const response = await fetchAuth(`${API_URL}/prescricoes/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - ETIQUETAS
// ============================================

export const gerarEtiquetas = async (prescricaoId) => {
  const response = await fetchAuth(`${API_URL}/etiquetas/gerar/${prescricaoId}`, {
    method: "POST",
  });
  return handleResponse(response);
};

export const listarEtiquetas = async (prescricaoId) => {
  const response = await fetchAuth(`${API_URL}/etiquetas/prescricao/${prescricaoId}`);
  return handleResponse(response);
};

export const marcarEtiquetaImpressa = async (id) => {
  const response = await fetchAuth(`${API_URL}/etiquetas/${id}/imprimir`, {
    method: "PATCH",
  });
  return handleResponse(response);
};

export const imprimirEtiquetasLote = async (ids) => {
  const response = await fetchAuth(`${API_URL}/etiquetas/imprimir-lote`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  return handleResponse(response);
};

export const deletarEtiqueta = async (id) => {
  const response = await fetchAuth(`${API_URL}/etiquetas/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - PACIENTES
// ============================================

export const buscarPacientePorCpf = async (cpf) => {
  try {
    const cpfLimpo = String(cpf || "").replace(/\D/g, "");
    const response = await fetchAuth(`${API_URL}/pacientes/cpf/${cpfLimpo}`);
    const dados = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return { sucesso: false, paciente: null };
      }
      throw new Error(dados.erro || "Erro ao buscar paciente");
    }

    return dados;
  } catch (erro) {
    console.error("Erro na busca de paciente:", erro);
    if (
      erro.message &&
      (erro.message.includes("404") || erro.message.includes("Paciente"))
    ) {
      return { sucesso: false, paciente: null };
    }
    throw erro;
  }
};

export const listarPacientes = async ({ busca = "", page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  if (busca) params.append("busca", busca);
  params.append("page", page);
  params.append("limit", limit);

  const response = await fetchAuth(`${API_URL}/pacientes?${params.toString()}`);
  return handleResponse(response);
};

export const listarPrescricoesPaciente = async (cpf) => {
  const cpfLimpo = String(cpf || "").replace(/\D/g, "");
  const response = await fetchAuth(`${API_URL}/pacientes/${cpfLimpo}/prescricoes`);
  return handleResponse(response);
};

export const verificarCodigoAtendimento = async (codigo, cpfAtual) => {
  try {
    const cpfLimpo = cpfAtual ? cpfAtual.replace(/\D/g, "") : "";
    const response = await fetchAuth(
      `${API_URL}/pacientes/verificar-codigo/${codigo}?cpf=${cpfLimpo}`,
    );
    return await response.json();
  } catch (erro) {
    console.error("Erro ao verificar código:", erro);
    return { sucesso: false, disponivel: true };
  }
};

// ============================================
// ENDPOINTS - USUÁRIOS (ADMIN)
// ============================================

export const listarUsuarios = async (busca = "") => {
  const params = busca ? `?busca=${encodeURIComponent(busca)}` : "";
  const response = await fetchAuth(`${API_URL}/usuarios${params}`);
  return handleResponse(response);
};

export const criarUsuario = async (usuario) => {
  const response = await fetchAuth(`${API_URL}/usuarios`, {
    method: "POST",
    body: JSON.stringify(usuario),
  });
  return handleResponse(response);
};

export const atualizarUsuario = async (id, usuario) => {
  const response = await fetchAuth(`${API_URL}/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(usuario),
  });
  return handleResponse(response);
};

export const desativarUsuario = async (id) => {
  const response = await fetchAuth(`${API_URL}/usuarios/${id}/desativar`, {
    method: "POST",
  });
  return handleResponse(response);
};

export const ativarUsuario = async (id) => {
  const response = await fetchAuth(`${API_URL}/usuarios/${id}/ativar`, {
    method: "POST",
  });
  return handleResponse(response);
};

export const resetarSenhaUsuario = async (id, novaSenha) => {
  const response = await fetchAuth(`${API_URL}/usuarios/${id}/resetar-senha`, {
    method: "POST",
    body: JSON.stringify({ novaSenha }),
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - AUDITORIA (ADMIN)
// ============================================

export const listarLogsAuditoria = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.usuarioId) params.append("usuarioId", filtros.usuarioId);
  if (filtros.acao) params.append("acao", filtros.acao);
  if (filtros.entidade) params.append("entidade", filtros.entidade);
  if (filtros.entidadeId) params.append("entidadeId", filtros.entidadeId);
  if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
  if (filtros.dataFim) params.append("dataFim", filtros.dataFim);
  if (filtros.busca) params.append("busca", filtros.busca);
  if (filtros.page) params.append("page", filtros.page);
  if (filtros.limit) params.append("limit", filtros.limit);

  const queryString = params.toString();
  const response = await fetchAuth(
    `${API_URL}/auditoria/logs${queryString ? "?" + queryString : ""}`,
  );
  return handleResponse(response);
};

export const obterEstatisticasAuditoria = async () => {
  const response = await fetchAuth(`${API_URL}/auditoria/estatisticas`);
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - DIETAS
// ============================================

export const listarDietas = async () => {
  const response = await fetchAuth(`${API_URL}/dietas`);
  return handleResponse(response);
};

export const listarDietasAtivas = async () => {
  const response = await fetchAuth(`${API_URL}/dietas?apenasAtivas=true`);
  return handleResponse(response);
};

export const criarDieta = async (dieta) => {
  const response = await fetchAuth(`${API_URL}/dietas`, {
    method: "POST",
    body: JSON.stringify(dieta),
  });
  return handleResponse(response);
};

export const atualizarDieta = async (id, dieta) => {
  const response = await fetchAuth(`${API_URL}/dietas/${id}`, {
    method: "PUT",
    body: JSON.stringify(dieta),
  });
  return handleResponse(response);
};

export const toggleDietaAtiva = async (id, ativa) => {
  const response = await fetchAuth(`${API_URL}/dietas/${id}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ ativa }),
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - CONDIÇÕES NUTRICIONAIS
// ============================================

export const listarRestricoes = async (todas = false) => {
  const url = todas
    ? `${API_URL}/restricoes?todas=true`
    : `${API_URL}/restricoes`;
  const response = await fetchAuth(url);
  return handleResponse(response);
};

export const criarRestricao = async (restricao) => {
  const response = await fetchAuth(`${API_URL}/restricoes`, {
    method: "POST",
    body: JSON.stringify(restricao),
  });
  return handleResponse(response);
};

export const atualizarRestricao = async (id, restricao) => {
  const response = await fetchAuth(`${API_URL}/restricoes/${id}`, {
    method: "PUT",
    body: JSON.stringify(restricao),
  });
  return handleResponse(response);
};

export const toggleRestricaoAtiva = async (id, ativa) => {
  const response = await fetchAuth(`${API_URL}/restricoes/${id}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ ativa }),
  });
  return handleResponse(response);
};

export const reordenarRestricoes = async (condicoes) => {
  const response = await fetchAuth(`${API_URL}/restricoes/reordenar`, {
    method: "POST",
    body: JSON.stringify({ condicoes }),
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - CONDIÇÕES NUTRICIONAIS ACOMPANHANTE
// ============================================

export const listarRestricoesAcompanhante = async (todas = false) => {
  const url = todas
    ? `${API_URL}/restricoes-acompanhante?todas=true`
    : `${API_URL}/restricoes-acompanhante`;
  const response = await fetchAuth(url);
  return handleResponse(response);
};

export const criarRestricaoAcompanhante = async (restricao) => {
  const response = await fetchAuth(`${API_URL}/restricoes-acompanhante`, {
    method: "POST",
    body: JSON.stringify(restricao),
  });
  return handleResponse(response);
};

export const atualizarRestricaoAcompanhante = async (id, restricao) => {
  const response = await fetchAuth(`${API_URL}/restricoes-acompanhante/${id}`, {
    method: "PUT",
    body: JSON.stringify(restricao),
  });
  return handleResponse(response);
};

export const toggleRestricaoAcompanhanteAtiva = async (id, ativa) => {
  const response = await fetchAuth(`${API_URL}/restricoes-acompanhante/${id}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ ativa }),
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - CONVÊNIOS
// ============================================

export const listarConvenios = async (todas = false) => {
  const url = todas
    ? `${API_URL}/convenios?incluirInativas=true`
    : `${API_URL}/convenios`;
  const response = await fetchAuth(url);
  return handleResponse(response);
};

export const criarConvenio = async (convenio) => {
  const response = await fetchAuth(`${API_URL}/convenios`, {
    method: "POST",
    body: JSON.stringify(convenio),
  });
  return handleResponse(response);
};

export const atualizarConvenio = async (id, convenio) => {
  const response = await fetchAuth(`${API_URL}/convenios/${id}`, {
    method: "PUT",
    body: JSON.stringify(convenio),
  });
  return handleResponse(response);
};

export const toggleConvenioAtivo = async (id, ativa) => {
  const response = await fetchAuth(`${API_URL}/convenios/${id}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ ativa }),
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - REFEIÇÕES
// ============================================

export const listarRefeicoes = async (incluirInativas = false) => {
  const url = incluirInativas
    ? `${API_URL}/refeicoes?incluirInativas=true`
    : `${API_URL}/refeicoes`;
  const response = await fetchAuth(url);
  return handleResponse(response);
};

export const criarRefeicao = async (refeicao) => {
  const response = await fetchAuth(`${API_URL}/refeicoes`, {
    method: "POST",
    body: JSON.stringify(refeicao),
  });
  return handleResponse(response);
};

export const atualizarRefeicao = async (id, refeicao) => {
  const response = await fetchAuth(`${API_URL}/refeicoes/${id}`, {
    method: "PUT",
    body: JSON.stringify(refeicao),
  });
  return handleResponse(response);
};

export const toggleRefeicaoAtiva = async (id, ativa) => {
  const response = await fetchAuth(`${API_URL}/refeicoes/${id}/toggle`, {
    method: "PATCH",
    body: JSON.stringify({ ativa }),
  });
  return handleResponse(response);
};

export const toggleListaPersonalizada = async (id, tem_lista_personalizada) => {
  const response = await fetchAuth(`${API_URL}/refeicoes/${id}/toggle-lista`, {
    method: "PATCH",
    body: JSON.stringify({ tem_lista_personalizada }),
  });
  return handleResponse(response);
};

export const listarItensRefeicao = async (refeicaoId) => {
  const response = await fetchAuth(`${API_URL}/refeicoes/${refeicaoId}/itens`);
  return handleResponse(response);
};

export const buscarItensRefeicaoPorIds = async (ids) => {
  if (!ids || ids.length === 0) return { sucesso: true, itens: [] };
  const response = await fetchAuth(
    `${API_URL}/refeicoes/itens/buscar/${ids.join(",")}`,
  );
  return handleResponse(response);
};

/**
 * Importar planilha Excel (FormData — usa fetchAuthUpload sem Content-Type)
 */
export const importarItensRefeicao = async (refeicaoId, arquivo) => {
  const formData = new FormData();
  formData.append("arquivo", arquivo);

  const response = await fetchAuthUpload(
    `${API_URL}/refeicoes/${refeicaoId}/itens/importar`,
    {
      method: "POST",
      body: formData,
    },
  );
  return handleResponse(response);
};

export const buscarEstatisticasItensRefeicao = async (refeicaoId) => {
  const response = await fetchAuth(
    `${API_URL}/refeicoes/${refeicaoId}/itens/estatisticas`,
  );
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - ACRÉSCIMOS
// ============================================

export const listarAcrescimos = async () => {
  const response = await fetchAuth(`${API_URL}/acrescimos`);
  return handleResponse(response);
};

export const buscarAcrescimosPorIds = async (ids) => {
  if (!ids || ids.length === 0) return { sucesso: true, acrescimos: [] };
  const idsString = Array.isArray(ids) ? ids.join(",") : ids;
  const response = await fetchAuth(`${API_URL}/acrescimos/buscar/${idsString}`);
  return handleResponse(response);
};

export const obterEstatisticasAcrescimos = async () => {
  const response = await fetchAuth(`${API_URL}/acrescimos/estatisticas`);
  return handleResponse(response);
};

/**
 * Importar acréscimos via Excel (FormData)
 */
export const importarAcrescimos = async (arquivo) => {
  const formData = new FormData();
  formData.append("arquivo", arquivo);

  const response = await fetchAuthUpload(`${API_URL}/acrescimos/importar`, {
    method: "POST",
    body: formData,
  });
  return handleResponse(response);
};

export const desativarTodosAcrescimos = async () => {
  const response = await fetchAuth(`${API_URL}/acrescimos/desativar-todos`, {
    method: "POST",
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - CONFIGURAÇÕES
// ============================================

export const buscarConfiguracoes = async () => {
  const response = await fetchAuth(`${API_URL}/configuracoes`);
  return handleResponse(response);
};

export const atualizarConfiguracao = async (chave, valor) => {
  const response = await fetchAuth(`${API_URL}/configuracoes/${chave}`, {
    method: "PUT",
    body: JSON.stringify({ valor }),
  });
  return handleResponse(response);
};

// ============================================
// ENDPOINTS - LOGS DE LOGIN
// ============================================

export const exportarLogsLogin = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio);
  if (filtros.dataFim) params.append("dataFim", filtros.dataFim);
  if (filtros.usuarioId) params.append("usuarioId", filtros.usuarioId);
  if (filtros.tipoEvento) params.append("tipoEvento", filtros.tipoEvento);

  const queryString = params.toString();
  const url = `${API_URL}/logs-login/exportar${queryString ? "?" + queryString : ""}`;

  const response = await fetchAuth(url);

  if (!response.ok) {
    const erro = await response
      .json()
      .catch(() => ({ erro: "Erro ao gerar relatório" }));
    throw new Error(erro.erro || "Erro ao gerar relatório de logs");
  }

  // Baixar o arquivo Excel
  const blob = await response.blob();
  const urlBlob = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = urlBlob;

  const contentDisposition = response.headers.get("Content-Disposition");
  let nomeArquivo = `logs_login_${filtros.dataInicio}_a_${filtros.dataFim}.xlsx`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) nomeArquivo = match[1];
  }

  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(urlBlob);

  return { sucesso: true, mensagem: "Relatório baixado com sucesso!" };
};

export const listarUsuariosLogsLogin = async () => {
  const response = await fetchAuth(`${API_URL}/logs-login/usuarios`);
  return handleResponse(response);
};

export { buscarPacientePorCpf as buscarPacientePorCPF };
export { listarLeitos as listarLeitosCompleto };

// ============================================
// ENDPOINTS - PERMISSÕES (NOVO)
// ============================================

/**
 * Buscar constantes de permissões do backend
 * Retorna: labels, grupos, perfil padrão
 */
export const buscarPermissoesConfig = async () => {
  const response = await fetchAuth(`${API_URL}/usuarios/permissoes-config`);
  return handleResponse(response);
};