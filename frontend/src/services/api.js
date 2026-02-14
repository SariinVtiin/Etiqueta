// frontend/src/services/api.js
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Obter token do localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Configuração padrão para fetch com autenticação
 */
const fetchConfigAuth = () => ({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
});

/**
 * Handler genérico de erros
 */
  const handleResponse = async (response) => {
    if (response.status === 401) {
      // Token expirado: limpa localStorage e redireciona para login
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    if (!response.ok) {
      const error = await response.json().catch(() => ({ erro: 'Erro na requisição' }));
      throw new Error(error.erro || 'Erro na requisição');
    }
    return response.json();
  };
// ============================================
// ENDPOINTS - TESTE E STATUS
// ============================================

export const testarConexao = async () => {
  try {
    const response = await fetch(`${API_URL}/api/teste`);
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao testar conexão:', erro);
    throw erro;
  }
};

export const buscarStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/status`);
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao buscar status:', erro);
    throw erro;
  }
};

// ============================================
// ENDPOINTS - LEITOS
// ============================================

export const listarLeitos = async () => {
  try {
    const response = await fetch(`${API_URL}/leitos`, fetchConfigAuth());
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao listar leitos:', erro);
    throw erro;
  }
};

// ============================================
// ENDPOINTS - PRESCRIÇÕES
// ============================================

/**
 * Listar prescrições com filtros
 */
export const listarPrescricoes = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.busca) params.append('busca', filtros.busca);
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.setor) params.append('setor', filtros.setor);
    if (filtros.dieta) params.append('dieta', filtros.dieta);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);
    
    const url = `${API_URL}/prescricoes?${params.toString()}`;
    const response = await fetch(url, fetchConfigAuth());
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao listar prescrições:', erro);
    throw erro;
  }
};

/**
 * Buscar prescrição por ID
 */
export const buscarPrescricao = async (id) => {
  try {
    const response = await fetch(`${API_URL}/prescricoes/${id}`, fetchConfigAuth());
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao buscar prescrição:', erro);
    throw erro;
  }
};

/**
 * Criar nova prescrição
 */
export const criarPrescricao = async (prescricao) => {
  try {
    const response = await fetch(`${API_URL}/prescricoes`, {
      method: 'POST',
      ...fetchConfigAuth(),
      body: JSON.stringify(prescricao)
    });
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao criar prescrição:', erro);
    throw erro;
  }
};

/**
 * Atualizar prescrição
 */
export const atualizarPrescricao = async (id, prescricao) => {
  try {
    const response = await fetch(`${API_URL}/prescricoes/${id}`, {
      method: 'PUT',
      ...fetchConfigAuth(),
      body: JSON.stringify(prescricao)
    });
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao atualizar prescrição:', erro);
    throw erro;
  }
};

/**
 * Deletar prescrição
 */
export const deletarPrescricao = async (id) => {
  try {
    const response = await fetch(`${API_URL}/prescricoes/${id}`, {
      method: 'DELETE',
      ...fetchConfigAuth()
    });
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao deletar prescrição:', erro);
    throw erro;
  }
};

// ====================================
// FUNÇÕES DE USUÁRIOS (ADMIN)
// ====================================

/**
 * Listar todos os usuários
 */
export const listarUsuarios = async (busca = '') => {
  const params = busca ? `?busca=${encodeURIComponent(busca)}` : '';
  const response = await fetch(`${API_URL}/usuarios${params}`, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao listar usuários');
  }
  return response.json();
};

/**
 * Criar novo usuário
 */
export const criarUsuario = async (usuario) => {
  const response = await fetch(`${API_URL}/usuarios`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify(usuario)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao criar usuário');
  }
  return response.json();
};

/**
 * Atualizar usuário
 */
export const atualizarUsuario = async (id, usuario) => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    ...fetchConfigAuth(),
    method: 'PUT',
    body: JSON.stringify(usuario)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao atualizar usuário');
  }
  return response.json();
};

/**
 * Desativar usuário
 */
export const desativarUsuario = async (id) => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    ...fetchConfigAuth(),
    method: 'DELETE'
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao desativar usuário');
  }
  return response.json();
};

/**
 * Ativar usuário
 */
export const ativarUsuario = async (id) => {
  const response = await fetch(`${API_URL}/usuarios/${id}/ativar`, {
    ...fetchConfigAuth(),
    method: 'POST'
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao ativar usuário');
  }
  return response.json();
};

/**
 * Resetar senha do usuário
 */
export const resetarSenhaUsuario = async (id, novaSenha) => {
  const response = await fetch(`${API_URL}/usuarios/${id}/resetar-senha`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify({ novaSenha })
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao resetar senha');
  }
  return response.json();
};

// ====================================
// FUNÇÕES DE AUDITORIA (ADMIN)
// ====================================

/**
 * Listar logs de auditoria
 */
export const listarLogsAuditoria = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.usuarioId) params.append('usuarioId', filtros.usuarioId);
  if (filtros.acao) params.append('acao', filtros.acao);
  if (filtros.entidade) params.append('entidade', filtros.entidade);
  if (filtros.entidadeId) params.append('entidadeId', filtros.entidadeId);
  if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
  if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
  if (filtros.busca) params.append('busca', filtros.busca);
  if (filtros.page) params.append('page', filtros.page);
  if (filtros.limit) params.append('limit', filtros.limit);

  const queryString = params.toString();
  const url = `${API_URL}/auditoria/logs${queryString ? '?' + queryString : ''}`;
  
  const response = await fetch(url, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao listar logs');
  }
  return response.json();
};

/**
 * Obter estatísticas de auditoria
 */
export const obterEstatisticasAuditoria = async () => {
  const response = await fetch(`${API_URL}/auditoria/estatisticas`, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao obter estatísticas');
  }
  return response.json();
};

// ====================================
// FUNÇÕES DE DIETAS
// ====================================

/**
 * Listar todas as dietas
 */
export const listarDietas = async () => {
  const response = await fetch(`${API_URL}/dietas`, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao listar dietas');
  }
  return response.json();
};

/**
 * Criar nova dieta
 */
export const criarDieta = async (dieta) => {
  const response = await fetch(`${API_URL}/dietas`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify(dieta)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao criar dieta');
  }
  return response.json();
};

/**
 * Atualizar dieta
 */
export const atualizarDieta = async (id, dieta) => {
  const response = await fetch(`${API_URL}/dietas/${id}`, {
    ...fetchConfigAuth(),
    method: 'PUT',
    body: JSON.stringify(dieta)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao atualizar dieta');
  }
  return response.json();
};

/**
 * Ativar/Desativar dieta
 */
export const toggleDietaAtiva = async (id, ativa) => {
  const response = await fetch(`${API_URL}/dietas/${id}/toggle`, {
    ...fetchConfigAuth(),
    method: 'PATCH',
    body: JSON.stringify({ ativa })
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao alterar status da dieta');
  }
  return response.json();
};

// ====================================
// FUNÇÕES DE ETIQUETAS (IMPRESSÃO)
// ====================================

/**
 * Listar todas as etiquetas
 */
export const listarEtiquetas = async () => {
  const response = await fetch(`${API_URL}/etiquetas`, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao listar etiquetas');
  }
  return response.json();
};

/**
 * Listar etiquetas pendentes
 */
export const listarEtiquetasPendentes = async () => {
  const response = await fetch(`${API_URL}/etiquetas/pendentes`, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao buscar pendentes');
  }
  return response.json();
};

/**
 * Criar etiqueta
 * 
 * @param {Object} etiqueta - Dados da etiqueta
 * @param {string} etiqueta.leito - Número do leito
 * @param {string} etiqueta.dieta - Nome da dieta
 * @param {string} [etiqueta.obs1] - Observação 1 (ex: restrições)
 * @param {string} [etiqueta.obs2] - Observação 2 (ex: exclusões)
 * @param {string} [etiqueta.obs3] - Observação 3 (ex: acréscimos)
 * @param {string} [etiqueta.usuario] - Nome do usuário que criou
 */
export const criarEtiqueta = async (etiqueta) => {
  const response = await fetch(`${API_URL}/etiquetas`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify(etiqueta)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao criar etiqueta');
  }
  return response.json();
};

/**
 * Marcar etiqueta como impressa
 */
export const marcarEtiquetaImpressa = async (id) => {
  const response = await fetch(`${API_URL}/etiquetas/${id}/imprimir`, {
    ...fetchConfigAuth(),
    method: 'PATCH'
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao marcar impressão');
  }
  return response.json();
};

/**
 * Imprimir múltiplas etiquetas
 */
export const imprimirEtiquetasLote = async (ids) => {
  const response = await fetch(`${API_URL}/etiquetas/imprimir-lote`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify({ ids })
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao imprimir lote');
  }
  return response.json();
};

// ============================================
// PACIENTES - FUNÇÃO NOVA
// ============================================

export const buscarPacientePorCPF = async (cpf) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const cpfLimpo = cpf.replace(/\D/g, '');

    const resposta = await fetch(`${API_URL}/api/pacientes/buscar/${cpfLimpo}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      if (resposta.status === 404) {
        return { sucesso: false, paciente: null };
      }
      throw new Error(dados.erro || 'Erro ao buscar paciente');
    }

    return dados;
  } catch (erro) {
    console.error('Erro na busca de paciente:', erro);
    throw erro;
  }
};

/**
 * Deletar etiqueta
 */
export const deletarEtiqueta = async (id) => {
  const response = await fetch(`${API_URL}/etiquetas/${id}`, {
    ...fetchConfigAuth(),
    method: 'DELETE'
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao deletar');
  }
  return response.json();
};

// frontend/src/services/api.js
// ADICIONAR ESTAS FUNÇÕES NO FINAL DO ARQUIVO

// ====================================
// FUNÇÕES DE ACRÉSCIMOS
// ====================================

/**
 * Listar acréscimos ativos
 */
export const listarAcrescimos = async () => {
  const response = await fetch(`${API_URL}/acrescimos`, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao listar acréscimos');
  }
  return response.json();
};

/**
 * Buscar acréscimos por IDs (para relatórios)
 */
export const buscarAcrescimosPorIds = async (ids) => {
  if (!ids || ids.length === 0) {
    return { sucesso: true, acrescimos: [] };
  }
  
  const idsString = Array.isArray(ids) ? ids.join(',') : ids;
  const response = await fetch(`${API_URL}/acrescimos/buscar/${idsString}`, fetchConfigAuth());
  
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao buscar acréscimos');
  }
  return response.json();
};

/**
 * Obter estatísticas de acréscimos
 */
export const obterEstatisticasAcrescimos = async () => {
  const response = await fetch(`${API_URL}/acrescimos/estatisticas`, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao obter estatísticas');
  }
  return response.json();
};

// Adicionar estas funções ao arquivo frontend/src/services/api.js

// ====================================
// FUNÇÕES DE RESTRIÇÕES ALIMENTARES
// ====================================

/**
 * Listar todas as restrições (ativas ou todas)
 */
export const listarRestricoes = async (todas = false) => {
  const url = todas ? `${API_URL}/restricoes?todas=true` : `${API_URL}/restricoes`;
  const response = await fetch(url, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao listar restrições');
  }
  return response.json();
};

/**
 * Buscar restrição por ID
 */
export const buscarRestricao = async (id) => {
  const response = await fetch(`${API_URL}/restricoes/${id}`, fetchConfigAuth());
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao buscar restrição');
  }
  return response.json();
};

/**
 * Criar nova restrição
 */
export const criarRestricao = async (restricao) => {
  const response = await fetch(`${API_URL}/restricoes`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify(restricao)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao criar restrição');
  }
  return response.json();
};

/**
 * Atualizar restrição
 */
export const atualizarRestricao = async (id, restricao) => {
  const response = await fetch(`${API_URL}/restricoes/${id}`, {
    ...fetchConfigAuth(),
    method: 'PUT',
    body: JSON.stringify(restricao)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao atualizar restrição');
  }
  return response.json();
};

/**
 * Ativar/Desativar restrição
 */
export const toggleRestricaoAtiva = async (id, ativa) => {
  const response = await fetch(`${API_URL}/restricoes/${id}/toggle`, {
    ...fetchConfigAuth(),
    method: 'PATCH',
    body: JSON.stringify({ ativa })
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao alterar status da restrição');
  }
  return response.json();
};

/**
 * Reordenar restrições
 */
export const reordenarRestricoes = async (restricoes) => {
  const response = await fetch(`${API_URL}/restricoes/reordenar`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify({ restricoes })
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao reordenar restrições');
  }
  return response.json();
};

// ====================================
// COLAR ESTAS FUNÇÕES NO FINAL DO api.js
// (antes do último export ou no final do arquivo)
// ====================================

// ====================================
// FUNÇÕES DE LEITOS - GESTÃO COMPLETA
// ====================================

/**
 * Listar leitos (ativos ou todos)
 * NOTA: a função listarLeitos() já existe. Substituir por esta versão que aceita parâmetro.
 */
export const listarLeitosCompleto = async (todas = false) => {
  const url = todas ? `${API_URL}/leitos?todas=true` : `${API_URL}/leitos`;
  const response = await fetch(url, fetchConfigAuth());
  return handleResponse(response);
};

/**
 * Listar setores únicos
 */
export const listarSetores = async () => {
  const response = await fetch(`${API_URL}/leitos/setores`, fetchConfigAuth());
  return handleResponse(response);
};

/**
 * Criar novo leito
 */
export const criarLeito = async (leito) => {
  const response = await fetch(`${API_URL}/leitos`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify(leito)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao criar leito');
  }
  return response.json();
};

/**
 * Criar leitos em lote
 */
export const criarLeitosLote = async (dados) => {
  const response = await fetch(`${API_URL}/leitos/lote`, {
    ...fetchConfigAuth(),
    method: 'POST',
    body: JSON.stringify(dados)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao criar leitos em lote');
  }
  return response.json();
};

/**
 * Atualizar leito
 */
export const atualizarLeito = async (id, leito) => {
  const response = await fetch(`${API_URL}/leitos/${id}`, {
    ...fetchConfigAuth(),
    method: 'PUT',
    body: JSON.stringify(leito)
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao atualizar leito');
  }
  return response.json();
};

/**
 * Ativar/Desativar leito
 */
export const toggleLeitoAtivo = async (id, ativo) => {
  const response = await fetch(`${API_URL}/leitos/${id}/toggle`, {
    ...fetchConfigAuth(),
    method: 'PATCH',
    body: JSON.stringify({ ativo })
  });
  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.erro || 'Erro ao alterar status do leito');
  }
  return response.json();
};