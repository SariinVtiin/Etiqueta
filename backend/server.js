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
const usuariosRouter = require('./routes/usuarios');
const auditoriaRouter = require('./routes/auditoria');
const pacientesRouter = require('./routes/pacientes');
const leitosRouter = require('./routes/leitos');
const dietasRouter = require('./routes/dietas');
const etiquetasRouter = require('./routes/etiquetas');
const acrescimosRouter = require('./routes/acrescimos');

// ============================================
// REGISTRAR ROTAS (NOMES CORRETOS!)
// ============================================
app.use('/api/auth', authRouter);           // ← CORRIGIDO
app.use('/api/usuarios', usuariosRouter);   // ← CORRIGIDO
app.use('/api/prescricoes', prescricoesRouter); // ← CORRIGIDO
app.use('/api/auditoria', auditoriaRouter); // ← ADICIONADO
app.use('/api/pacientes', pacientesRouter); // ← CORRIGIDO (movido)
app.use('/api/leitos', leitosRouter);       // ← CORRIGIDO (movido)
app.use('/api/dietas', dietasRouter);       // ← CORRIGIDO (movido)
app.use('/api/etiquetas', etiquetasRouter); // ← CORRIGIDO
app.use('/api/acrescimos', acrescimosRouter);

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

// Rotas de pacientes
const pacientesRoutes = require('./routes/pacientes');
app.use('/api/pacientes', pacientesRoutes);

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
  console.log('🎉 Sistema pronto para uso!');
  console.log('');
});