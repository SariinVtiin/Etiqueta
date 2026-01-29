const express = require('express');
const cors = require('cors');
const net = require('net');
const { pool, testarConexao } = require('./config/database');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ============================================
// IMPORTAR ROTAS DE AUTENTICAÇÃO
// ============================================
const { router: authRouter } = require('./routes/auth');

// ============================================
// REGISTRAR ROTAS
// ============================================
app.use('/api/auth', authRouter);

// Testar conexão ao iniciar
testarConexao();

// CONFIGURAÇÃO DA IMPRESSORA - Carrega do .env
const IMPRESSORA_IP = process.env.IMPRESSORA_IP || '192.168.1.100';
const IMPRESSORA_PORTA = process.env.IMPRESSORA_PORTA || 9100;

console.log(`🖨️  Impressora configurada: ${IMPRESSORA_IP}:${IMPRESSORA_PORTA}`);

/**
 * Gerar comando ZPL para a etiqueta
 */
function gerarZPL(dados) {
  const zpl = `
^XA

^FO20,20^ADN,25,15^FDLeito: ${dados.leito}^FS
^FO20,55^GB380,2,2^FS

^FO20,70^ADN,30,18^FDDieta: ${dados.dieta}^FS

${dados.obs1 ? `^FO20,115^ADN,20,12^FD${dados.obs1}^FS` : ''}
${dados.obs2 ? `^FO20,145^ADN,20,12^FD${dados.obs2}^FS` : ''}
${dados.obs3 ? `^FO20,175^ADN,20,12^FD${dados.obs3}^FS` : ''}

^FO20,210^GB380,2,2^FS

${dados.merenda ? `^FO20,225^ADN,20,12^FDMerenda: ${dados.merenda}^FS` : ''}
${dados.jantar ? `^FO20,250^ADN,20,12^FDJantar: ${dados.jantar}^FS` : ''}

^XZ
`;
  
  return zpl;
}

/**
 * Enviar para impressora Zebra
 */
function enviarParaZebra(zpl) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    
    client.connect(IMPRESSORA_PORTA, IMPRESSORA_IP, () => {
      console.log('🔌 Conectado à impressora Zebra');
      client.write(zpl);
      client.end();
    });

    client.on('close', () => {
      console.log('✅ Impressão enviada');
      resolve();
    });

    client.on('error', (err) => {
      console.error('❌ Erro ao conectar:', err.message);
      reject(err);
    });

    client.setTimeout(5000, () => {
      client.destroy();
      reject(new Error('Timeout ao conectar com impressora'));
    });
  });
}

// ============================================
// ENDPOINTS - PACIENTES
// ============================================

/**
 * GET /api/pacientes - Listar todos os pacientes ativos
 */
app.get('/api/pacientes', async (req, res) => {
  try {
    const [pacientes] = await pool.query(`
      SELECT 
        p.id,
        p.nome,
        p.prontuario,
        l.numero AS leito,
        l.setor,
        l.andar,
        d.nome AS dieta,
        d.codigo AS dieta_codigo,
        p.data_internacao,
        DATEDIFF(CURRENT_DATE, p.data_internacao) AS dias_internacao,
        p.observacoes
      FROM pacientes p
      INNER JOIN leitos l ON p.leito_id = l.id
      LEFT JOIN dietas d ON p.dieta_id = d.id
      WHERE p.ativo = TRUE AND p.data_alta IS NULL
      ORDER BY l.numero
    `);
    
    res.json({ 
      sucesso: true, 
      total: pacientes.length,
      pacientes 
    });
  } catch (erro) {
    console.error('Erro ao buscar pacientes:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/pacientes/:id - Buscar um paciente específico
 */
app.get('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [pacientes] = await pool.query(`
      SELECT 
        p.*,
        l.numero AS leito,
        l.setor,
        l.andar,
        d.nome AS dieta,
        d.codigo AS dieta_codigo
      FROM pacientes p
      INNER JOIN leitos l ON p.leito_id = l.id
      LEFT JOIN dietas d ON p.dieta_id = d.id
      WHERE p.id = ?
    `, [id]);
    
    if (pacientes.length === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Paciente não encontrado' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      paciente: pacientes[0] 
    });
  } catch (erro) {
    console.error('Erro ao buscar paciente:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/pacientes - Cadastrar novo paciente
 */
app.post('/api/pacientes', async (req, res) => {
  try {
    const { nome, prontuario, cpf, leito_id, dieta_id, data_internacao, observacoes } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO pacientes (nome, prontuario, cpf, leito_id, dieta_id, data_internacao, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nome, prontuario, cpf, leito_id, dieta_id, data_internacao || new Date(), observacoes]
    );
    
    res.json({ 
      sucesso: true, 
      id: result.insertId,
      mensagem: 'Paciente cadastrado com sucesso' 
    });
  } catch (erro) {
    console.error('Erro ao cadastrar paciente:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * PUT /api/pacientes/:id - Atualizar paciente
 */
app.put('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, prontuario, cpf, leito_id, dieta_id, observacoes } = req.body;
    
    const [result] = await pool.query(
      `UPDATE pacientes 
       SET nome = ?, prontuario = ?, cpf = ?, leito_id = ?, dieta_id = ?, observacoes = ?
       WHERE id = ?`,
      [nome, prontuario, cpf, leito_id, dieta_id, observacoes, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Paciente não encontrado' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Paciente atualizado com sucesso' 
    });
  } catch (erro) {
    console.error('Erro ao atualizar paciente:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * POST /api/pacientes/:id/alta - Registrar alta do paciente
 */
app.post('/api/pacientes/:id/alta', async (req, res) => {
  try {
    const { id } = req.params;
    const { data_alta } = req.body;
    
    const [result] = await pool.query(
      `UPDATE pacientes SET data_alta = ? WHERE id = ?`,
      [data_alta || new Date(), id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        sucesso: false, 
        erro: 'Paciente não encontrado' 
      });
    }
    
    res.json({ 
      sucesso: true, 
      mensagem: 'Alta registrada com sucesso' 
    });
  } catch (erro) {
    console.error('Erro ao dar alta:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

// ============================================
// ENDPOINTS - LEITOS
// ============================================

/**
 * GET /api/leitos - Listar todos os leitos
 */
app.get('/api/leitos', async (req, res) => {
  try {
    const [leitos] = await pool.query(
      'SELECT * FROM leitos WHERE ativo = TRUE ORDER BY numero'
    );
    
    res.json({ 
      sucesso: true, 
      total: leitos.length,
      leitos 
    });
  } catch (erro) {
    console.error('Erro ao buscar leitos:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

/**
 * GET /api/leitos/disponiveis - Listar leitos disponíveis
 */
app.get('/api/leitos/disponiveis', async (req, res) => {
  try {
    const [leitos] = await pool.query(`
      SELECT l.* 
      FROM leitos l
      LEFT JOIN pacientes p ON l.id = p.leito_id 
        AND p.ativo = TRUE 
        AND p.data_alta IS NULL
      WHERE l.ativo = TRUE 
        AND p.id IS NULL
      ORDER BY l.numero
    `);
    
    res.json({ 
      sucesso: true, 
      total: leitos.length,
      leitos 
    });
  } catch (erro) {
    console.error('Erro ao buscar leitos disponíveis:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

// ============================================
// ENDPOINTS - DIETAS
// ============================================

/**
 * GET /api/dietas - Listar todas as dietas
 */
app.get('/api/dietas', async (req, res) => {
  try {
    const [dietas] = await pool.query(
      'SELECT * FROM dietas WHERE ativa = TRUE ORDER BY nome'
    );
    
    res.json({ 
      sucesso: true, 
      total: dietas.length,
      dietas 
    });
  } catch (erro) {
    console.error('Erro ao buscar dietas:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

// ============================================
// ENDPOINT - IMPRESSÃO DE ETIQUETAS
// ============================================

/**
 * POST /api/imprimir - Imprimir etiquetas
 */
app.post('/api/imprimir', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { etiquetas, usuario } = req.body;

    if (!etiquetas || etiquetas.length === 0) {
      return res.status(400).json({ 
        sucesso: false, 
        erro: 'Nenhuma etiqueta para imprimir' 
      });
    }

    await connection.beginTransaction();

    const etiquetasImpressas = [];

    for (const etiqueta of etiquetas) {
      const zpl = gerarZPL(etiqueta);
      
      const [result] = await connection.query(
        `INSERT INTO etiquetas 
         (paciente_id, leito, dieta, obs1, obs2, obs3, merenda, jantar, usuario, ip_impressora)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          etiqueta.paciente_id || null,
          etiqueta.leito,
          etiqueta.dieta,
          etiqueta.obs1 || null,
          etiqueta.obs2 || null,
          etiqueta.obs3 || null,
          etiqueta.merenda || null,
          etiqueta.jantar || null,
          usuario || 'Sistema',
          IMPRESSORA_IP
        ]
      );

      const etiquetaId = result.insertId;

      try {
        await enviarParaZebra(zpl);
        
        await connection.query(
          'UPDATE etiquetas SET status_impressao = ? WHERE id = ?',
          ['sucesso', etiquetaId]
        );

        etiquetasImpressas.push({ 
          id: etiquetaId, 
          leito: etiqueta.leito,
          status: 'sucesso' 
        });
        
      } catch (erroImpressao) {
        await connection.query(
          'UPDATE etiquetas SET status_impressao = ?, erro_mensagem = ? WHERE id = ?',
          ['erro', erroImpressao.message, etiquetaId]
        );

        etiquetasImpressas.push({ 
          id: etiquetaId, 
          leito: etiqueta.leito,
          status: 'erro', 
          erro: erroImpressao.message 
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await connection.commit();

    const sucessos = etiquetasImpressas.filter(e => e.status === 'sucesso').length;
    const erros = etiquetasImpressas.filter(e => e.status === 'erro').length;

    res.json({ 
      sucesso: true, 
      total: etiquetas.length,
      sucessos,
      erros,
      etiquetas: etiquetasImpressas
    });

  } catch (erro) {
    await connection.rollback();
    console.error('Erro ao imprimir:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  } finally {
    connection.release();
  }
});

/**
 * GET /api/historico-impressoes - Histórico de impressões
 */
app.get('/api/historico-impressoes', async (req, res) => {
  try {
    const { limite = 50, pagina = 1 } = req.query;
    const offset = (pagina - 1) * limite;
    
    const [historico] = await pool.query(`
      SELECT 
        e.id,
        e.leito,
        e.dieta,
        e.data_impressao,
        e.usuario,
        e.status_impressao,
        e.erro_mensagem,
        p.nome AS paciente_nome,
        p.prontuario
      FROM etiquetas e
      LEFT JOIN pacientes p ON e.paciente_id = p.id
      ORDER BY e.data_impressao DESC
      LIMIT ? OFFSET ?
    `, [parseInt(limite), parseInt(offset)]);
    
    const [total] = await pool.query(
      'SELECT COUNT(*) AS total FROM etiquetas'
    );
    
    res.json({ 
      sucesso: true, 
      historico,
      total: total[0].total,
      pagina: parseInt(pagina),
      limite: parseInt(limite)
    });
  } catch (erro) {
    console.error('Erro ao buscar histórico:', erro);
    res.status(500).json({ 
      sucesso: false, 
      erro: erro.message 
    });
  }
});

// ============================================
// ENDPOINT DE TESTE
// ============================================

app.get('/api/teste', (req, res) => {
  res.json({ 
    mensagem: 'Backend funcionando!',
    timestamp: new Date().toISOString(),
    impressora: `${IMPRESSORA_IP}:${IMPRESSORA_PORTA}`
  });
});

/**
 * GET /api/status - Status do sistema
 */
app.get('/api/status', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1');
    const bancoOk = result ? true : false;
    
    const [pacientes] = await pool.query(
      'SELECT COUNT(*) AS total FROM pacientes WHERE ativo = TRUE AND data_alta IS NULL'
    );
    const [leitos] = await pool.query('SELECT COUNT(*) AS total FROM leitos WHERE ativo = TRUE');
    const [dietas] = await pool.query('SELECT COUNT(*) AS total FROM dietas WHERE ativa = TRUE');
    
    res.json({
      sucesso: true,
      status: 'online',
      banco: bancoOk ? 'conectado' : 'desconectado',
      impressora: `${IMPRESSORA_IP}:${IMPRESSORA_PORTA}`,
      estatisticas: {
        pacientes_ativos: pacientes[0].total,
        leitos_cadastrados: leitos[0].total,
        dietas_disponiveis: dietas[0].total
      },
      timestamp: new Date().toISOString()
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      status: 'erro',
      erro: erro.message
    });
  }
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  console.log(`🖨️  Impressora: ${IMPRESSORA_IP}:${IMPRESSORA_PORTA}`);
  console.log('='.repeat(50));
  console.log('');
  console.log('Endpoints disponíveis:');
  console.log(`  POST /api/auth/login`);
  console.log(`  GET  /api/auth/me`);
  console.log(`  POST /api/auth/logout`);
  console.log(`  GET  /api/teste`);
  console.log(`  GET  /api/status`);
  console.log(`  GET  /api/pacientes`);
  console.log(`  POST /api/pacientes`);
  console.log(`  GET  /api/leitos`);
  console.log(`  GET  /api/dietas`);
  console.log(`  POST /api/imprimir`);
  console.log(`  GET  /api/historico-impressoes`);
  console.log('');
});