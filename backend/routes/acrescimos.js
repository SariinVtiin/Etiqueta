// backend/routes/acrescimos.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const { pool } = require('../config/database');
const { autenticar, verificarRole } = require('./auth');

// Configurar multer para upload de arquivos
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/**
 * GET /api/acrescimos - Listar acréscimos ativos
 */
router.get('/', autenticar, async (req, res) => {
  try {
    const [acrescimos] = await pool.query(
      'SELECT * FROM acrescimos WHERE ativo = TRUE ORDER BY nome_item'
    );
    
    res.json({ 
      sucesso: true, 
      total: acrescimos.length,
      acrescimos 
    });
  } catch (erro) {
    console.error('Erro ao buscar acréscimos:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/acrescimos/buscar/:ids - Buscar acréscimos por IDs
 */
router.get('/buscar/:ids', autenticar, async (req, res) => {
  try {
    const { ids } = req.params;
    const idsArray = ids.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
    
    if (idsArray.length === 0) {
      return res.json({ 
        sucesso: true, 
        acrescimos: [] 
      });
    }

    const placeholders = idsArray.map(() => '?').join(',');
    const [acrescimos] = await pool.query(
      `SELECT * FROM acrescimos WHERE id IN (${placeholders})`,
      idsArray
    );
    
    res.json({ 
      sucesso: true, 
      acrescimos 
    });
  } catch (erro) {
    console.error('Erro ao buscar acréscimos por IDs:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/acrescimos/estatisticas - Obter estatísticas
 */
router.get('/estatisticas', autenticar, async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN ativo = TRUE THEN 1 ELSE 0 END) as ativos,
        SUM(CASE WHEN ativo = FALSE THEN 1 ELSE 0 END) as inativos,
        MAX(data_importacao) as ultima_importacao
      FROM acrescimos
    `);
    
    res.json({ 
      sucesso: true, 
      estatisticas: stats[0]
    });
  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/acrescimos/importar - Importar planilha de acréscimos (apenas admin)
 */
router.post('/importar', autenticar, upload.single('arquivo'), async (req, res) => {
  try {
    // ← VERIFICAÇÃO MELHORADA DO ROLE
    console.log('🔍 Verificando permissões...');
    console.log('Usuário:', req.usuario);
    console.log('Role:', req.usuario?.role);

    if (!req.usuario) {
      return res.status(401).json({ 
        sucesso: false, 
        erro: 'Usuário não autenticado' 
      });
    }

    if (req.usuario.role !== 'admin') {
      return res.status(403).json({ 
        sucesso: false, 
        erro: 'Acesso negado. Apenas administradores podem realizar esta ação.' 
      });
    }

    console.log('✅ Permissão concedida!');

    // Verificar se arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Nenhum arquivo foi enviado' 
      });
    }

    // Ler arquivo Excel
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const dados = xlsx.utils.sheet_to_json(worksheet);

    if (dados.length === 0) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Arquivo vazio ou inválido' 
      });
    }

    // Validar colunas obrigatórias
    const primeiraLinha = dados[0];
    if (!primeiraLinha.nome_item) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Coluna obrigatória não encontrada: nome_item' 
      });
    }

    // Iniciar transação
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Desativar todos os itens atuais
      const [resultDesativacao] = await connection.query(
        'UPDATE acrescimos SET ativo = FALSE WHERE ativo = TRUE'
      );

      console.log(`📊 Itens desativados: ${resultDesativacao.affectedRows}`);

      // 2. Inserir novos itens
      let inseridos = 0;
      const dataImportacao = new Date();

      for (const linha of dados) {
        await connection.query(
          `INSERT INTO acrescimos 
           (nome_item, tipo_medida, quantidade_referencia, valor, ativo, data_importacao) 
           VALUES (?, ?, ?, ?, TRUE, ?)`,
          [
            linha.nome_item,
            linha.tipo_medida || null,
            linha.quantidade_referencia || null,
            linha.valor || 0,
            dataImportacao
          ]
        );
        inseridos++;
      }

      // Commit da transação
      await connection.commit();
      console.log(`✅ Importação concluída: ${inseridos} itens`);

      res.json({ 
        sucesso: true, 
        mensagem: 'Importação realizada com sucesso!',
        detalhes: {
          desativados: resultDesativacao.affectedRows,
          inseridos: inseridos,
          data_importacao: dataImportacao
        }
      });

    } catch (erro) {
      // Rollback em caso de erro
      await connection.rollback();
      throw erro;
    } finally {
      connection.release();
    }

  } catch (erro) {
    console.error('❌ Erro ao importar:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

module.exports = router;