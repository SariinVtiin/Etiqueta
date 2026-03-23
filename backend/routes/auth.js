// backend/routes/auth.js
// ============================================
// SALUSVITA TECH - AutenticaÃ§Ã£o e AutorizaÃ§Ã£o
// Desenvolvido por FerMax Solution
// ============================================
// SEGURANÃ‡A:
// - JWT contÃ©m APENAS { id, email } â€” dados imutÃ¡veis
// - Middleware autenticar consulta BD a cada request (dados frescos)
// - verificarPermissao() valida permissÃµes granulares do BD
// - JWT_SECRET obrigatÃ³rio (crash se nÃ£o definido)
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
// VARIÃVEIS DE AMBIENTE (sem fallbacks perigosos)
// ============================================

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Crash intencional se JWT_SECRET nÃ£o estiver definido
if (!JWT_SECRET) {
  console.error('âŒ FATAL: JWT_SECRET nÃ£o definido no .env');
  console.error('   O servidor NÃƒO pode iniciar sem uma chave secreta.');
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

  keyGenerator: (req) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket?.remoteAddress || req.ip || 'unknown';
    return ip.replace('::ffff:', '');
  },

  // handler: resposta customizada quando rate limit Ã© atingido
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
        erro: 'Email e senha sÃ£o obrigatÃ³rios'
      });
    }

    // Buscar usuÃ¡rio completo
    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    // Email nÃ£o encontrado
    if (usuarios.length === 0) {
      await registrarLogLogin({
        emailTentado: email,
        tipoEvento: 'LOGIN_FALHA_EMAIL',
        motivo: 'Email nÃ£o encontrado no sistema.',
        ipAddress: ip,
        userAgent
      });

      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais invÃ¡lidas'
      });
    }

    const usuario = usuarios[0];

    // UsuÃ¡rio inativo
    if (!usuario.ativo) {
      await registrarLogLogin({
        usuarioId: usuario.id,
        usuarioNome: usuario.nome,
        usuarioEmail: usuario.email,
        emailTentado: email,
        tipoEvento: 'LOGIN_FALHA_INATIVO',
        motivo: 'Conta de usuÃ¡rio desativada.',
        ipAddress: ip,
        userAgent
      });

      return res.status(401).json({
        sucesso: false,
        erro: 'Credenciais invÃ¡lidas'
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
        erro: 'Credenciais invÃ¡lidas'
      });
    }

    // âœ… JWT LEVE: apenas id e email (dados que nÃ£o mudam)
    // Role e permissÃµes vÃªm do BD a cada request via middleware
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Atualizar Ãºltimo login
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

    // Parse seguro do JSON de permissÃµes
    let permissoes = null;
    try {
      permissoes = typeof usuario.permissoes === 'string'
        ? JSON.parse(usuario.permissoes)
        : usuario.permissoes;
    } catch (e) {
      permissoes = null;
    }

    // Retornar dados (sem senha, COM permissÃµes e crn)
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
// GET /api/auth/me - Verificar sessÃ£o atual
// ============================================

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Token nÃ£o fornecido'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar dados ATUAIS do BD (nÃ£o confiar no JWT)
    const [usuarios] = await pool.query(
      'SELECT id, nome, email, role, crn, permissoes FROM usuarios WHERE id = ? AND ativo = TRUE',
      [decoded.id]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        sucesso: false,
        erro: 'UsuÃ¡rio nÃ£o encontrado ou desativado'
      });
    }

    const usuario = usuarios[0];

    // Parse seguro do JSON de permissÃµes
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
      erro: 'Token invÃ¡lido ou expirado'
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
        // Token invÃ¡lido/expirado â€” registrar logout mesmo assim
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
// - UsuÃ¡rio desativado Ã© bloqueado imediatamente
// - MudanÃ§as de role/permissÃµes valem na prÃ³xima request
// - NÃ£o dependemos de dados stale no token
// ============================================

const autenticar = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        sucesso: false,
        erro: 'NÃ£o autenticado'
      });
    }

    // Decodifica JWT (sÃ³ tem id e email)
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar dados ATUAIS do BD
    const [usuarios] = await pool.query(
      'SELECT id, nome, email, role, crn, permissoes, ativo FROM usuarios WHERE id = ?',
      [decoded.id]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        sucesso: false,
        erro: 'UsuÃ¡rio nÃ£o encontrado'
      });
    }

    const usuario = usuarios[0];

    // Verificar se estÃ¡ ativo
    if (!usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        erro: 'Conta desativada'
      });
    }

    // Parse seguro do JSON de permissÃµes
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
    // jwt.verify falhou (token expirado, invÃ¡lido, etc.)
    res.status(401).json({
      sucesso: false,
      erro: 'Token invÃ¡lido ou expirado'
    });
  }
};

// ============================================
// MIDDLEWARE: verificarRole
// ============================================
// Checa se o role do usuÃ¡rio (do BD) estÃ¡ na lista permitida
// Usar DEPOIS de autenticar (req.usuario jÃ¡ tem dados frescos)
// ============================================

const verificarRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({
        sucesso: false,
        erro: 'Sem permissÃ£o para acessar este recurso'
      });
    }
    next();
  };
};

// ============================================
// MIDDLEWARE: verificarPermissao
// ============================================
// Checa se o usuÃ¡rio tem uma permissÃ£o especÃ­fica.
// - Admin: SEMPRE passa (acesso total automÃ¡tico)
// - Nutricionista: checa se a chave estÃ¡ no array permissoes
// Usar DEPOIS de autenticar (req.usuario jÃ¡ tem dados frescos)
//
// Uso: router.post('/', autenticar, verificarPermissao('cadastros_leitos'), ...)
// ============================================

const verificarPermissao = (permissaoNecessaria) => {
  return (req, res, next) => {
    // Admin tem acesso total â€” passa direto
    if (req.usuario.role === 'admin') {
      return next();
    }

    // Nutricionista â€” checar array de permissÃµes do BD
    const permissoesUsuario = req.usuario.permissoes || [];

    if (!permissoesUsuario.includes(permissaoNecessaria)) {
      return res.status(403).json({
        sucesso: false,
        erro: 'VocÃª nÃ£o tem permissÃ£o para acessar este recurso'
      });
    }

    next();
  };
};

module.exports = { router, autenticar, verificarRole, verificarPermissao };