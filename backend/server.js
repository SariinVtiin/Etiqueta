const express = require('express');
const cors = require('cors');
const { pool, testarConexao } = require('./config/database');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ============================================
// IMPORTAR ROTAS
// ============================================
const { router: authRouter } = require('./routes/auth');
const prescricoesRouter = require('./routes/prescricoes');

// ============================================
// REGISTRAR ROTAS
// ============================================
app.use('/api/auth', authRouter);
app.use('/api/prescricoes', prescricoesRouter);

// Testar conexão ao iniciar
testarConexao();

/**
 * GET /api/teste - Endpoint de teste
 */
app.get('/api/teste', async (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'API funcionando!',
    timestamp: new Date().toISOString()
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

// Importar rotas antigas
const pacientesRouter = require('./routes/pacientes');
const leitosRouter = require('./routes/leitos');
const dietasRouter = require('./routes/dietas');

app.use('/api/pacientes', pacientesRouter);
app.use('/api/leitos', leitosRouter);
app.use('/api/dietas', dietasRouter);

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
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
  console.log(`  GET  /api/prescricoes`);
  console.log(`  POST /api/prescricoes`);
  console.log(`  PUT  /api/prescricoes/:id`);
  console.log(`  DELETE /api/prescricoes/:id`);
  console.log('');
});