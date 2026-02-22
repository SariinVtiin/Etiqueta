// backend/server.js - ARQUIVO COMPLETO ATUALIZADO
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
const restricoesRouter = require('./routes/condicoesRoutes');  
const etiquetasRouter = require('./routes/etiquetas');
const acrescimosRouter = require('./routes/acrescimos');
const logsLoginRouter = require('./routes/logsLogin'); 
const tiposRefeicaoRoutes = require('./routes/tiposRefeicaoRoutes');
const { router: configuracoesRouter } = require('./routes/configuracoes');
const restricoesAcompanhanteRouter = require('./routes/restricoesAcompanhante');
// ============================================
// REGISTRAR ROTAS
// ============================================
app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/prescricoes', prescricoesRouter);
app.use('/api/auditoria', auditoriaRouter);
app.use('/api/pacientes', pacientesRouter);
app.use('/api/leitos', leitosRouter);
app.use('/api/dietas', dietasRouter);
app.use('/api/restricoes', restricoesRouter);  
app.use('/api/etiquetas', etiquetasRouter);
app.use('/api/acrescimos', acrescimosRouter);
app.use('/api/logs-login', logsLoginRouter);
app.use('/api/refeicoes', tiposRefeicaoRoutes);
app.use('/api/configuracoes', configuracoesRouter);
app.use('/api/restricoes-acompanhante', restricoesAcompanhanteRouter);

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
    const [restricoes] = await pool.query('SELECT COUNT(*) AS total FROM condicoes_nutricionais WHERE ativa = TRUE');  // ← NOVO
    
    res.json({
      sucesso: true,
      status: 'online',
      banco: bancoOk ? 'conectado' : 'desconectado',
      estatisticas: {
        pacientes_ativos: pacientes[0].total,
        leitos_cadastrados: leitos[0].total,
        dietas_disponiveis: dietas[0].total,
        restricoes_disponiveis: restricoes[0].total  // ← NOVO
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
  console.log('='.repeat(50));
  console.log('');
  console.log('🎉 Sistema pronto para uso!');
  console.log('');
});