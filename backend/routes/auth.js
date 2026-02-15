// backend/routes/auth.js
// ATUALIZADO - Com registro de logs de login
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { registrarLogLogin } = require('../services/logsLogin');

// ===== RATE LIMITING PARA LOGIN =====
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    sucesso: false,
    erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  },
  // ✅ NOVO: Registrar log quando rate limit é atingido
  handler: (req, res) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    registrarLogLogin({
      emailTentado: req.body?.email || 'N/A',
      tipoEvento: 'LOGIN_FALHA_RATE_LIMIT',
      motivo: 'Muitas tentativas de login. IP bloqueado por 15 minutos.',
      ipAddress: ip,
      userAgent
    });

    res.status(429).json({
      sucesso: false,
      erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
    });
  }
});

// Chave secreta JWT
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui_mude_em_producao';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Helper para extrair IP e User-Agent da request
 */
function extrairDadosReq(req) {
  return {
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || null,
    userAgent: req.headers['user-agent'] || null
  };
}

/**
 * POST /api/auth/login - Login (com rate limiting e LOG)
 */
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

    // Buscar usuário
    const [usuarios] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    // ❌ Email não encontrado
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

    // ⚠️ Usuário inativo
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
    
    // ❌ Senha incorreta
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

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Atualizar último login
    await pool.query(
      'UPDATE usuarios SET ultimo_login = NOW() WHERE id = ?',
      [usuario.id]
    );

    // ✅ Login com sucesso
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

    // Retornar dados (sem senha)
    res.json({ 
      sucesso: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });

  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: 'Erro ao fazer login' 
    });
  }
});

/**
 * GET /api/auth/me - Verificar usuário logado
 */
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

    const [usuarios] = await pool.query(
      'SELECT id, nome, email, role FROM usuarios WHERE id = ? AND ativo = TRUE',
      [decoded.id]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ 
        sucesso: false, 
        erro: 'Usuário não encontrado' 
      });
    }

    res.json({ 
      sucesso: true,
      usuario: usuarios[0]
    });

  } catch (erro) {
    console.error('Erro ao verificar token:', erro);
    res.status(401).json({ 
      sucesso: false, 
      erro: 'Token inválido ou expirado' 
    });
  }
});

/**
 * POST /api/auth/logout - Logout (com LOG)
 */
router.post('/logout', async (req, res) => {
  const { ip, userAgent } = extrairDadosReq(req);

  try {
    // Tentar extrair dados do token para o log
    const token = req.headers.authorization?.replace('Bearer ', '');
    let usuarioId = null;
    let usuarioNome = null;
    let usuarioEmail = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        usuarioId = decoded.id;
        usuarioEmail = decoded.email;

        // Buscar nome do usuário
        const [usuarios] = await pool.query(
          'SELECT nome FROM usuarios WHERE id = ?',
          [decoded.id]
        );
        if (usuarios.length > 0) {
          usuarioNome = usuarios[0].nome;
        }
      } catch (e) {
        // Token inválido/expirado, registrar logout mesmo assim
      }
    }

    // 🚪 Registrar logout
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
    // Não quebrar o logout por causa do log
    console.error('[LOG-LOGIN] Erro ao registrar logout:', e.message);
  }

  res.json({ 
    sucesso: true,
    mensagem: 'Logout realizado com sucesso' 
  });
});

/**
 * Middleware de autenticação
 */
const autenticar = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        sucesso: false, 
        erro: 'Não autenticado' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();

  } catch (erro) {
    res.status(401).json({ 
      sucesso: false, 
      erro: 'Token inválido ou expirado' 
    });
  }
};

/**
 * Middleware de verificação de role
 */
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

module.exports = { router, autenticar, verificarRole };