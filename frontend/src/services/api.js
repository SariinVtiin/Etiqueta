// src/services/api.js
const API_URL = 'http://localhost:3001/api';

/**
 * Configuração padrão para fetch
 */
const fetchConfig = {
  headers: {
    'Content-Type': 'application/json',
  }
};

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
// ENDPOINTS - PACIENTES
// ============================================

export const listarPacientes = async () => {
  try {
    const response = await fetch(`${API_URL}/pacientes`);
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao listar pacientes:', erro);
    throw erro;
  }
};

export const buscarPaciente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/pacientes/${id}`);
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao buscar paciente:', erro);
    throw erro;
  }
};

export const cadastrarPaciente = async (paciente) => {
  try {
    const response = await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      ...fetchConfig,
      body: JSON.stringify(paciente)
    });
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao cadastrar paciente:', erro);
    throw erro;
  }
};

export const atualizarPaciente = async (id, paciente) => {
  try {
    const response = await fetch(`${API_URL}/pacientes/${id}`, {
      method: 'PUT',
      ...fetchConfig,
      body: JSON.stringify(paciente)
    });
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao atualizar paciente:', erro);
    throw erro;
  }
};

export const darAltaPaciente = async (id, dataAlta) => {
  try {
    const response = await fetch(`${API_URL}/pacientes/${id}/alta`, {
      method: 'POST',
      ...fetchConfig,
      body: JSON.stringify({ data_alta: dataAlta })
    });
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao dar alta:', erro);
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

export const listarLeitosDisponiveis = async () => {
  try {
    const response = await fetch(`${API_URL}/leitos/disponiveis`);
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao listar leitos disponíveis:', erro);
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
// ENDPOINTS - IMPRESSÃO
// ============================================

export const imprimirEtiquetas = async (etiquetas, usuario = 'Sistema') => {
  try {
    const response = await fetch(`${API_URL}/imprimir`, {
      method: 'POST',
      ...fetchConfig,
      body: JSON.stringify({ etiquetas, usuario })
    });
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao imprimir:', erro);
    throw erro;
  }
};

export const buscarHistoricoImpressoes = async (limite = 50, pagina = 1) => {
  try {
    const response = await fetch(`${API_URL}/historico-impressoes?limite=${limite}&pagina=${pagina}`);
    return handleResponse(response);
  } catch (erro) {
    console.error('Erro ao buscar histórico:', erro);
    throw erro;
  }
};

// ============================================
// FUNÇÕES AUXILIARES LOCALSTORAGE (TEMPORÁRIO)
// ============================================

/**
 * Essas funções mantêm compatibilidade com localStorage
 * até migrarmos totalmente para o backend
 */

export const salvarEtiquetasLocal = (etiquetas) => {
  try {
    localStorage.setItem('etiquetas', JSON.stringify(etiquetas));
  } catch (erro) {
    console.error('Erro ao salvar no localStorage:', erro);
  }
};

export const carregarEtiquetasLocal = () => {
  try {
    const saved = localStorage.getItem('etiquetas');
    return saved ? JSON.parse(saved) : [];
  } catch (erro) {
    console.error('Erro ao carregar do localStorage:', erro);
    return [];
  }
};

export const salvarTiposAlimentacaoLocal = (tipos) => {
  try {
    localStorage.setItem('tiposAlimentacao', JSON.stringify(tipos));
  } catch (erro) {
    console.error('Erro ao salvar tipos no localStorage:', erro);
  }
};

export const carregarTiposAlimentacaoLocal = () => {
  try {
    const saved = localStorage.getItem('tiposAlimentacao');
    return saved ? JSON.parse(saved) : [
      'Desjejum',
      'Colação',
      'Almoço',
      'Lanche',
      'Jantar',
      'Ceia'
    ];
  } catch (erro) {
    console.error('Erro ao carregar tipos do localStorage:', erro);
    return ['Desjejum', 'Colação', 'Almoço', 'Lanche', 'Jantar', 'Ceia'];
  }
};