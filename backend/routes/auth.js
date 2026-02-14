// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// ===== RATE LIMITING PARA LOGIN =====
// Proteção contra brute force: máx 5 tentativas por IP a cada 15 minutos
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                    // máx 5 tentativas por janela
  message: {
    sucesso: false,
    erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Identificar por IP
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }
});

// Chave secreta JWT
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui_mude_em_producao';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * POST /api/auth/login - Login (com rate limiting)
 */
router.post('/login', loginLimiter, async (req, res) => {
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
      'SELECT * FROM usuarios WHERE email = ? AND ativo = TRUE',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ 
        sucesso: false, 
        erro: 'Credenciais inválidas' 
      });
    }

    const usuario = usuarios[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
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

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar dados atualizados do usuário
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
 * POST /api/auth/logout - Logout
 */
router.post('/logout', (req, res) => {
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