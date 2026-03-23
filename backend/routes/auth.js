// backend/routes/auth.js
// ============================================
// SALUSVITA TECH - Autenticação e Autorização
// Desenvolvido por FerMax Solution
// ============================================
// SEGURANÇA:
// - JWT contém APENAS { id, email } — dados imutáveis
// - Middleware autenticar consulta BD a cada request (dados frescos)
// - verificarPermissao() valida permissões granulares do BD
// - JWT_SECRET obrigatório (crash se não definido)
// - Rate limiting no login com keyGenerator correto para IIS
// ============================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { registrarLogLogin } = require('../services/logsLogin');
const rateLimit = require('express-rate-limit');

// ============================================
// VARIÁVEIS DE AMBIENTE (sem fallbacks perigosos)
// ============================================

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Crash intencional se JWT_SECRET não estiver definido
if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET não definido no .env');
  console.error('   O servidor NÃO pode iniciar sem uma chave secreta.');
  process.exit(1);
}

// ============================================
// RATE LIMITING PARA LOGIN
// ============================================

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  // ✅ ipKeyGenerator trata IPv6 corretamente + mantém fallback pro IIS
  keyGenerator: (req) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip;
    return ipKeyGenerator(ip);
  },

  // handler: resposta customizada quando rate limit é atingido
  handler: async (req, res) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    try {
      await registrarLogLogin({
        emailTentado: req.body?.email || 'N/A',
        tipoEvento: 'LOGIN_FALHA_RATE_LIMIT',
        motivo: 'Muitas tentativas de login. IP bloqueado por 15 minutos.',
        ipAddress: ip,
        userAgent
      });
    } catch (e) {
      console.error('[LOG-LOGIN] Erro ao registrar rate limit:', e.message);
    }

    res.status(429).json({
      sucesso: false,
      erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    });
  }
});

// ============================================
// HELPERS
// ============================================

function extrairDadosReq(req) {
  return {
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || null,
    userAgent: req.headers['user-agent'] || null
  };
}

// ============================================
// POST /api/auth/login
// ============================================

router.post('/login', loginLimiter, async (req, res) => {
  const { ip, userAgent } = extrairDadosReq(req);

  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário completo
    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    // Email não encontrado
    if (usuarios.length === 0) {
      await registrarLogLogin({
        emailTentado: email,
        tipoEvento: 'LOGIN_FALHA_EMAIL',
        motivo: 'Email não encontrado no sistema.',
        ipAddress: ip,
        userAgent
      });

      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais inválidas'
      });
    }

    const usuario = usuarios[0];

    // Usuário inativo
    if (!usuario.ativo) {
      await registrarLogLogin({
        usuarioId: usuario.id,
        usuarioNome: usuario.nome,
        usuarioEmail: usuario.email,
        emailTentado: email,
        tipoEvento: 'LOGIN_FALHA_INATIVO',
        motivo: 'Conta de usuário desativada.',
        ipAddress: ip,
        userAgent
      });

      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      await registrarLogLogin({
        usuarioId: usuario.id,
        usuarioNome: usuario.nome,
        usuarioEmail: usuario.email,
        emailTentado: email,
        tipoEvento: 'LOGIN_FALHA_SENHA',
        motivo: 'Senha incorreta.',
        ipAddress: ip,
        userAgent
      });

      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais inválidas'
      });
    }

    // ✅ JWT LEVE: apenas id e email (dados que não mudam)
    // Role e permissões vêm do BD a cada request via middleware
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Atualizar último login
    await pool.query(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?',
      [usuario.id]
    );

    // Registrar log de sucesso
    await registrarLogLogin({
      usuarioId: usuario.id,
      usuarioNome: usuario.nome,
      usuarioEmail: usuario.email,
      emailTentado: email,
      tipoEvento: 'LOGIN_SUCESSO',
      motivo: null,
      ipAddress: ip,
      userAgent
    });

    // Parse seguro do JSON de permissões
    let permissoes = null;
    try {
      permissoes = typeof usuario.permissoes === 'string'
        ? JSON.parse(usuario.permissoes)
        : usuario.permissoes;
    } catch (e) {
      permissoes = null;
    }

    // Retornar dados (sem senha, COM permissões e crn)
    res.json({
      sucesso: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        crn: usuario.crn || null,
        permissoes: permissoes || []
      }
    });

  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro interno do servidor'
    });
  }
});

// ============================================
// GET /api/auth/me - Verificar sessão atual
// ============================================

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar dados ATUAIS do BD (não confiar no JWT)
    const [usuarios] = await pool.query(
      'SELECT id, nome, email, role, crn, permissoes FROM usuarios WHERE id = ? AND ativo = TRUE',
      [decoded.id]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Usuário não encontrado ou desativado'
      });
    }

    const usuario = usuarios[0];

    // Parse seguro do JSON de permissões
    let permissoes = null;
    try {
      permissoes = typeof usuario.permissoes === 'string'
        ? JSON.parse(usuario.permissoes)
        : usuario.permissoes;
    } catch (e) {
      permissoes = null;
    }

    res.json({
      sucesso: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        crn: usuario.crn || null,
        permissoes: permissoes || []
      }
    });

  } catch (erro) {
    console.error('Erro ao verificar token:', erro);
    res.status(401).json({
      sucesso: false,
      erro: 'Token inválido ou expirado'
    });
  }
});

// ============================================
// POST /api/auth/logout
// ============================================

router.post('/logout', async (req, res) => {
  const { ip, userAgent } = extrairDadosReq(req);

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    let usuarioId = null;
    let usuarioNome = null;
    let usuarioEmail = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        usuarioId = decoded.id;
        usuarioEmail = decoded.email;

        const [usuarios] = await pool.query(
          'SELECT nome FROM usuarios WHERE id = ?',
          [decoded.id]
        );
        if (usuarios.length > 0) {
          usuarioNome = usuarios[0].nome;
        }
      } catch (e) {
        // Token inválido/expirado — registrar logout mesmo assim
      }
    }

    await registrarLogLogin({
      usuarioId,
      usuarioNome,
      usuarioEmail,
      emailTentado: usuarioEmail || 'N/A',
      tipoEvento: 'LOGOUT',
      motivo: null,
      ipAddress: ip,
      userAgent
    });
  } catch (e) {
    console.error('[LOG-LOGIN] Erro ao registrar logout:', e.message);
  }

  res.json({
    sucesso: true,
    mensagem: 'Logout realizado com sucesso'
  });
});

// ============================================
// MIDDLEWARE: autenticar
// ============================================
// Decodifica JWT, depois consulta o BD para dados FRESCOS.
// Isso garante que:
// - Usuário desativado é bloqueado imediatamente
// - Mudanças de role/permissões valem na próxima request
// - Não dependemos de dados stale no token
// ============================================

const autenticar = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Não autenticado'
      });
    }

    // Decodifica JWT (só tem id e email)
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar dados ATUAIS do BD
    const [usuarios] = await pool.query(
      'SELECT id, nome, email, role, crn, permissoes, ativo FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Usuário não encontrado'
      });
    }

    const usuario = usuarios[0];

    // Verificar se está ativo
    if (!usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Conta desativada'
      });
    }

    // Parse seguro do JSON de permissões
    let permissoes = null;
    try {
      permissoes = typeof usuario.permissoes === 'string'
        ? JSON.parse(usuario.permissoes)
        : usuario.permissoes;
    } catch (e) {
      permissoes = null;
    }

    // Setar req.usuario com dados FRESCOS do BD
    req.usuario = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      crn: usuario.crn || null,
      permissoes: Array.isArray(permissoes) ? permissoes : []
    };

    next();

  } catch (erro) {
    // jwt.verify falhou (token expirado, inválido, etc.)
    res.status(401).json({
      sucesso: false,
      erro: 'Token inválido ou expirado'
    });
  }
};

// ============================================
// MIDDLEWARE: verificarRole
// ============================================
// Checa se o role do usuário (do BD) está na lista permitida
// Usar DEPOIS de autenticar (req.usuario já tem dados frescos)
// ============================================

const verificarRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Sem permissão para acessar este recurso'
      });
    }
    next();
  };
};

// ============================================
// MIDDLEWARE: verificarPermissao
// ============================================
// Checa se o usuário tem uma permissão específica.
// - Admin: SEMPRE passa (acesso total automático)
// - Nutricionista: checa se a chave está no array permissoes
// Usar DEPOIS de autenticar (req.usuario já tem dados frescos)
//
// Uso: router.post('/', autenticar, verificarPermissao('cadastros_leitos'), ...)
// ============================================

const verificarPermissao = (permissaoNecessaria) => {
  return (req, res, next) => {
    // Admin tem acesso total — passa direto
    if (req.usuario.role === 'admin') {
      return next();
    }

    // Nutricionista — checar array de permissões do BD
    const permissoesUsuario = req.usuario.permissoes || [];

    if (!permissoesUsuario.includes(permissaoNecessaria)) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Você não tem permissão para acessar este recurso'
      });
    }

    next();
  };
};

module.exports = { router, autenticar, verificarRole, verificarPermissao };