// backend/routes/usuarios.js
// ============================================
// SALUSVITA TECH - Gestão de Usuários
// Desenvolvido por FerMax Solution
// ============================================
// PERMISSÃO: Todas as rotas requerem 'cadastros_usuarios'
// SEGURANÇA: Erros internos não vazam para o cliente
// NOVO: CRN, confirmarSenha, permissões granulares
// ============================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { autenticar, verificarPermissao } = require('./auth');
const {
  PERMISSOES_VALIDAS,
  PERFIL_PADRAO_NUTRICIONISTA,
  PERMISSOES_LABELS,
  PERMISSOES_GRUPOS,
  filtrarPermissoesValidas,
  validarCRN,
} = require('../config/permissoes');

// ============================================
// HELPERS
// ============================================

/**
 * Parse seguro do JSON de permissões
 */
function parsePermissoes(valor) {
  if (!valor) return [];
  try {
    const parsed = typeof valor === 'string' ? JSON.parse(valor) : valor;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Formatar usuário para resposta (sem senha, com permissões parseadas)
 */
function formatarUsuario(u) {
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    role: u.role,
    crn: u.crn || null,
    permissoes: parsePermissoes(u.permissoes),
    ativo: u.ativo,
  };
}

// ============================================
// GET /api/usuarios/permissoes-config
// Retorna constantes de permissão para o frontend
// Qualquer autenticado pode acessar (precisa pra montar a UI)
// ============================================
router.get('/permissoes-config', autenticar, async (req, res) => {
  res.json({
    sucesso: true,
    permissoesValidas: PERMISSOES_VALIDAS,
    perfilPadrao: PERFIL_PADRAO_NUTRICIONISTA,
    labels: PERMISSOES_LABELS,
    grupos: PERMISSOES_GRUPOS,
  });
});

// ============================================
// GET /api/usuarios - Listar todos os usuários
// Requer permissão: cadastros_usuarios
// ============================================
router.get('/', autenticar, verificarPermissao('cadastros_usuarios'), async (req, res) => {
  try {
    const { busca } = req.query;

    let query = 'SELECT id, nome, email, role, crn, permissoes, ativo FROM usuarios WHERE 1=1';
    const params = [];

    if (busca) {
      query += ' AND (nome LIKE ? OR email LIKE ? OR crn LIKE ?)';
      const buscaParam = `%${busca}%`;
      params.push(buscaParam, buscaParam, buscaParam);
    }

    query += ' ORDER BY id DESC';

    const [usuarios] = await pool.query(query, params);

    res.json({
      sucesso: true,
      total: usuarios.length,
      usuarios: usuarios.map(formatarUsuario),
    });
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

// ============================================
// POST /api/usuarios - Criar novo usuário
// Requer permissão: cadastros_usuarios
// ============================================
router.post('/', autenticar, verificarPermissao('cadastros_usuarios'), async (req, res) => {
  try {
    const { nome, email, senha, confirmarSenha, role, crn, permissoes } = req.body;

    // --- Validações básicas ---
    if (!nome || !email || !senha || !role) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome, email, senha e perfil são obrigatórios',
      });
    }

    if (!['admin', 'nutricionista'].includes(role)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Perfil inválido. Use: admin ou nutricionista',
      });
    }

    // --- Validação de senha ---
    if (senha.length < 8) {
      return res.status(400).json({
        sucesso: false,
        erro: 'A senha deve ter no mínimo 8 caracteres',
      });
    }

    if (senha !== confirmarSenha) {
      return res.status(400).json({
        sucesso: false,
        erro: 'As senhas não coincidem',
      });
    }

    // --- Validação de CRN (obrigatório para nutricionista) ---
    if (role === 'nutricionista') {
      if (!crn || !crn.trim()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'CRN é obrigatório para nutricionistas',
        });
      }

      if (!validarCRN(crn)) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Formato de CRN inválido. Use: CRN-X XXXXX (ex: CRN-1 12345)',
        });
      }
    }

    // --- Verificar email duplicado ---
    const [usuariosExistentes] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email],
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({
        sucesso: false,
        erro: 'Email já cadastrado no sistema',
      });
    }

    // --- Verificar CRN duplicado ---
    if (crn && crn.trim()) {
      const [crnExistente] = await pool.query(
        'SELECT id FROM usuarios WHERE crn = ?',
        [crn.trim().toUpperCase()],
      );

      if (crnExistente.length > 0) {
        return res.status(409).json({
          sucesso: false,
          erro: 'CRN já cadastrado para outro usuário',
        });
      }
    }

    // --- Processar permissões ---
    let permissoesFinais = null;

    if (role === 'nutricionista') {
      // Se não enviou permissões, usa o perfil padrão
      if (!permissoes || !Array.isArray(permissoes) || permissoes.length === 0) {
        permissoesFinais = PERFIL_PADRAO_NUTRICIONISTA;
      } else {
        // Filtra pela whitelist (remove chaves inválidas)
        permissoesFinais = filtrarPermissoesValidas(permissoes);
      }
    }
    // Admin: permissões = null (acesso total automático no código)

    // --- Hash da senha ---
    const senhaHash = await bcrypt.hash(senha, 10);

    // --- Inserir ---
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, role, crn, permissoes) VALUES (?, ?, ?, ?, ?, ?)',
      [
        nome.trim(),
        email.trim().toLowerCase(),
        senhaHash,
        role,
        role === 'nutricionista' ? (crn ? crn.trim().toUpperCase() : null) : null,
        permissoesFinais ? JSON.stringify(permissoesFinais) : null,
      ],
    );

    console.log(`✅ Usuário criado: ${nome} (${role}) - ID: ${result.insertId}`);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      usuario: {
        id: result.insertId,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        role,
        crn: role === 'nutricionista' ? (crn ? crn.trim().toUpperCase() : null) : null,
        permissoes: permissoesFinais || [],
      },
    });
  } catch (erro) {
    console.error('Erro ao criar usuário:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

// ============================================
// PUT /api/usuarios/:id - Atualizar usuário
// Requer permissão: cadastros_usuarios
// ============================================
router.put('/:id', autenticar, verificarPermissao('cadastros_usuarios'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, role, crn, permissoes } = req.body;

    // --- Validações básicas ---
    if (!nome || !email || !role) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome, email e perfil são obrigatórios',
      });
    }

    if (!['admin', 'nutricionista'].includes(role)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Perfil inválido. Use: admin ou nutricionista',
      });
    }

    // --- Validação de CRN (obrigatório para nutricionista) ---
    if (role === 'nutricionista') {
      if (!crn || !crn.trim()) {
        return res.status(400).json({
          sucesso: false,
          erro: 'CRN é obrigatório para nutricionistas',
        });
      }

      if (!validarCRN(crn)) {
        return res.status(400).json({
          sucesso: false,
          erro: 'Formato de CRN inválido. Use: CRN-X XXXXX (ex: CRN-1 12345)',
        });
      }
    }

    // --- Verificar email duplicado ---
    const [emailExistente] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? AND id != ?',
      [email.trim().toLowerCase(), id],
    );

    if (emailExistente.length > 0) {
      return res.status(409).json({
        sucesso: false,
        erro: 'Email já está sendo usado por outro usuário',
      });
    }

    // --- Verificar CRN duplicado ---
    if (crn && crn.trim()) {
      const [crnExistente] = await pool.query(
        'SELECT id FROM usuarios WHERE crn = ? AND id != ?',
        [crn.trim().toUpperCase(), id],
      );

      if (crnExistente.length > 0) {
        return res.status(409).json({
          sucesso: false,
          erro: 'CRN já está sendo usado por outro usuário',
        });
      }
    }

    // --- Processar permissões ---
    let permissoesFinais = null;

    if (role === 'nutricionista') {
      if (Array.isArray(permissoes)) {
        permissoesFinais = filtrarPermissoesValidas(permissoes);
      } else {
        // Manter permissões atuais se não foram enviadas
        const [atual] = await pool.query(
          'SELECT permissoes FROM usuarios WHERE id = ?',
          [id],
        );
        if (atual.length > 0) {
          permissoesFinais = parsePermissoes(atual[0].permissoes);
        }
      }
    }
    // Admin: permissões = null

    // --- Atualizar ---
    const [result] = await pool.query(
      'UPDATE usuarios SET nome = ?, email = ?, role = ?, crn = ?, permissoes = ? WHERE id = ?',
      [
        nome.trim(),
        email.trim().toLowerCase(),
        role,
        role === 'nutricionista' ? (crn ? crn.trim().toUpperCase() : null) : null,
        permissoesFinais ? JSON.stringify(permissoesFinais) : null,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Usuário não encontrado',
      });
    }

    console.log(`✅ Usuário atualizado: ${nome} (ID: ${id})`);

    res.json({
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso',
    });
  } catch (erro) {
    console.error('Erro ao atualizar usuário:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

// ============================================
// POST /api/usuarios/:id/desativar - Desativar usuário
// Requer permissão: cadastros_usuarios
// ============================================
router.post('/:id/desativar', autenticar, verificarPermissao('cadastros_usuarios'), async (req, res) => {
  try {
    const { id } = req.params;

    // Impedir desativar a si mesmo
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Você não pode desativar sua própria conta',
      });
    }

    const [result] = await pool.query(
      'UPDATE usuarios SET ativo = FALSE WHERE id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Usuário não encontrado',
      });
    }

    console.log(`⚠️ Usuário desativado (ID: ${id}) por ${req.usuario.nome}`);

    res.json({
      sucesso: true,
      mensagem: 'Usuário desativado com sucesso',
    });
  } catch (erro) {
    console.error('Erro ao desativar usuário:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

// ============================================
// POST /api/usuarios/:id/ativar - Reativar usuário
// Requer permissão: cadastros_usuarios
// ============================================
router.post('/:id/ativar', autenticar, verificarPermissao('cadastros_usuarios'), async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'UPDATE usuarios SET ativo = TRUE WHERE id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Usuário não encontrado',
      });
    }

    console.log(`✅ Usuário reativado (ID: ${id}) por ${req.usuario.nome}`);

    res.json({
      sucesso: true,
      mensagem: 'Usuário reativado com sucesso',
    });
  } catch (erro) {
    console.error('Erro ao ativar usuário:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

// ============================================
// POST /api/usuarios/:id/resetar-senha - Resetar senha
// Requer permissão: cadastros_usuarios
// ============================================
router.post('/:id/resetar-senha', autenticar, verificarPermissao('cadastros_usuarios'), async (req, res) => {
  try {
    const { id } = req.params;
    const { novaSenha, confirmarSenha } = req.body;

    // --- Validação de senha ---
    if (!novaSenha || novaSenha.length < 8) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nova senha deve ter pelo menos 8 caracteres',
      });
    }

    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({
        sucesso: false,
        erro: 'As senhas não coincidem',
      });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    const [result] = await pool.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [senhaHash, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        sucesso: false,
        erro: 'Usuário não encontrado',
      });
    }

    console.log(`🔑 Senha resetada para usuário (ID: ${id}) por ${req.usuario.nome}`);

    res.json({
      sucesso: true,
      mensagem: 'Senha resetada com sucesso',
    });
  } catch (erro) {
    console.error('Erro ao resetar senha:', erro);
    res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
  }
});

module.exports = router;