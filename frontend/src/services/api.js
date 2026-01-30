// src/services/api.js
const API_URL = 'http://localhost:3001/api';

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
    const response = await fetch(`${API_URL}/teste`);
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
    const response = await fetch(`${API_URL}/leitos`);
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao listar leitos:', erro);
    throw erro;
  }
};

// ============================================
// ENDPOINTS - DIETAS
// ============================================

export const listarDietas = async () => {
  try {
    const response = await fetch(`${API_URL}/dietas`);
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao listar dietas:', erro);
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