// backend/config/permissoes.js
// ============================================
// SALUSVITA TECH - Constantes de Permissões
// Desenvolvido por FerMax Solution
// ============================================
// Este arquivo é a ÚNICA fonte de verdade para
// chaves de permissão válidas no sistema.
// ============================================

/**
 * Lista completa de permissões válidas (whitelist)
 * Qualquer chave fora desta lista será rejeitada pelo backend.
 */
const PERMISSOES_VALIDAS = [
  // --- Páginas principais ---
  'dashboard',
  'prescricoes',
  'nova_prescricao',
  'pacientes',

  // --- Hub de cadastros (acesso ao menu) ---
  'cadastros',

  // --- Sub-páginas de cadastros ---
  'cadastros_usuarios',
  'cadastros_leitos',
  'cadastros_dietas',
  'cadastros_condicoes',
  'cadastros_condicoes_acompanhante',
  'cadastros_refeicoes',
  'cadastros_acrescimos',
  'cadastros_configuracoes',
  'cadastros_convenios',
  'cadastros_logs',
];

/**
 * Perfil padrão ao criar nutricionista
 * Admin pode customizar depois, mas estas vêm pré-marcadas
 */
const PERFIL_PADRAO_NUTRICIONISTA = [
  'dashboard',
  'prescricoes',
  'nova_prescricao',
  'pacientes',
  'cadastros',
  'cadastros_leitos',
  'cadastros_dietas',
];

/**
 * Labels amigáveis para exibição no frontend
 * Mapeamento chave → nome legível
 */
const PERMISSOES_LABELS = {
  dashboard:                       'Início (Dashboard)',
  prescricoes:                     'Prescrições',
  nova_prescricao:                 'Nova Prescrição',
  pacientes:                       'Pacientes',
  cadastros:                       'Cadastros (menu)',
  cadastros_usuarios:              'Gestão de Usuários',
  cadastros_leitos:                'Setores e Leitos',
  cadastros_dietas:                'Tipos de Dieta',
  cadastros_condicoes:             'Condição Nutricional',
  cadastros_condicoes_acompanhante:'Cond. Nutricional Acompanhante',
  cadastros_refeicoes:             'Tipos de Refeição',
  cadastros_acrescimos:            'Acréscimos',
  cadastros_configuracoes:         'Configurações',
  cadastros_convenios:             'Convênios',
  cadastros_logs:                  'Logs de Login',
};

/**
 * Agrupamento por categoria (para organizar os checkboxes no frontend)
 */
const PERMISSOES_GRUPOS = {
  'Páginas Principais': [
    'dashboard',
    'prescricoes',
    'nova_prescricao',
    'pacientes',
  ],
  'Cadastros e Configurações': [
    'cadastros',
    'cadastros_usuarios',
    'cadastros_leitos',
    'cadastros_dietas',
    'cadastros_condicoes',
    'cadastros_condicoes_acompanhante',
    'cadastros_refeicoes',
    'cadastros_acrescimos',
    'cadastros_configuracoes',
    'cadastros_convenios',
    'cadastros_logs',
  ],
};

/**
 * Valida e filtra um array de permissões contra a whitelist
 * Remove qualquer chave que não exista na lista válida
 * @param {string[]} permissoes - Array de chaves recebidas
 * @returns {string[]} - Array filtrado (só chaves válidas)
 */
function filtrarPermissoesValidas(permissoes) {
  if (!Array.isArray(permissoes)) return [];
  return [...new Set(permissoes.filter(p => PERMISSOES_VALIDAS.includes(p)))];
}

/**
 * Regex para validação de CRN
 * Formatos aceitos: CRN-1 12345, CRN-2 98765, CRN-11 12345
 * O número da região vai de 1 a 11
 */
const CRN_REGEX = /^CRN-([1-9]|1[0-1])\s?\d{4,6}$/i;

/**
 * Valida formato do CRN
 * @param {string} crn - CRN a validar
 * @returns {boolean}
 */
function validarCRN(crn) {
  if (!crn || typeof crn !== 'string') return false;
  return CRN_REGEX.test(crn.trim());
}

module.exports = {
  PERMISSOES_VALIDAS,
  PERFIL_PADRAO_NUTRICIONISTA,
  PERMISSOES_LABELS,
  PERMISSOES_GRUPOS,
  filtrarPermissoesValidas,
  validarCRN,
  CRN_REGEX,
};