// backend/routes/usuarios.js
// SEGURANÇA: Senha mínima de 8 caracteres
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth');

/**
 * GET /api/usuarios - Listar todos os usuários (apenas admin)
 */
router.get('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { busca } = req.query;
    
    let query = 'SELECT id, nome, email, role, ativo FROM usuarios WHERE 1=1';
    const params = [];

    if (busca) {
      query += ' AND (nome LIKE ? OR email LIKE ?)';
      const buscaParam = `%${busca}%`;
      params.push(buscaParam, buscaParam);
    }

    query += ' ORDER BY id DESC';

    const [usuarios] = await pool.query(query, params);
    
    res.json({ 
      sucesso: true, 
      total: usuarios.length,
      usuarios 
    });
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/usuarios - Criar novo usuário (apenas admin)
 */
router.post('/', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { nome, email, senha, role } = req.body;
    
    // Validações
    if (!nome || !email || !senha || !role) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Todos os campos são obrigatórios' 
      });
    }

    if (!['admin', 'nutricionista'].includes(role)) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Role inválido. Use: admin ou nutricionista' 
      });
    }

    // SEGURANÇA: Senha mínima de 8 caracteres
    if (senha.length < 8) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'A senha deve ter no mínimo 8 caracteres' 
      });
    }

    // Verificar se email já existe
    const [usuariosExistentes] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ 
        sucesso: false, 
        erro: 'Email já cadastrado no sistema' 
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // Inserir usuário
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, role]
    );
    
    res.status(201).json({ 
      sucesso: true, 
      mensagem: 'Usuário criado com sucesso',
      usuario: { id: result.insertId, nome, email, role }
    });
  } catch (erro) {
    console.error('Erro ao criar usuário:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * PUT /api/usuarios/:id - Atualizar usuário (apenas admin)
 */
router.put('/:id', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, role } = req.body;
    
    if (!nome || !email || !role) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Nome, email e role são obrigatórios' 
      });
    }

    // Verificar se email já existe para outro usuário
    const [emailExistente] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ? AND id != ?',
      [email, id]
    );

    if (emailExistente.length > 0) {
      return res.status(409).json({ 
        sucesso: false, 
        erro: 'Email já está sendo usado por outro usuário' 
      });
    }

    const [result] = await pool.query(
      'UPDATE usuarios SET nome = ?, email = ?, role = ? WHERE id = ?',
      [nome, email, role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Usuário não encontrado' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Usuário atualizado com sucesso' 
    });
  } catch (erro) {
    console.error('Erro ao atualizar usuário:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/usuarios/:id/desativar - Desativar usuário (apenas admin)
 */
router.post('/:id/desativar', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'UPDATE usuarios SET ativo = FALSE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Usuário não encontrado' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Usuário desativado com sucesso' 
    });
  } catch (erro) {
    console.error('Erro ao desativar usuário:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/usuarios/:id/resetar-senha - Resetar senha (apenas admin)
 */
router.post('/:id/resetar-senha', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { novaSenha } = req.body;
    
    // SEGURANÇA: Senha mínima de 8 caracteres
    if (!novaSenha || novaSenha.length < 8) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Nova senha deve ter pelo menos 8 caracteres' 
      });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    
    const [result] = await pool.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [senhaHash, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Usuário não encontrado' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Senha resetada com sucesso' 
    });
  } catch (erro) {
    console.error('Erro ao resetar senha:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/usuarios/:id/ativar - Reativar usuário (apenas admin)
 */
router.post('/:id/ativar', autenticar, verificarRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query(
      'UPDATE usuarios SET ativo = TRUE WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Usuário não encontrado' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Usuário reativado com sucesso' 
    });
  } catch (erro) {
    console.error('Erro ao ativar usuário:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

module.exports = router;