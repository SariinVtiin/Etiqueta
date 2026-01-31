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
  console.log('📋 Endpoints disponíveis:');
  console.log('');
  console.log('🔐 Autenticação:');
  console.log(`  POST /api/auth/login`);
  console.log(`  GET  /api/auth/me`);
  console.log(`  POST /api/auth/logout`);
  console.log('');
  console.log('📊 Sistema:');
  console.log(`  GET  /api/teste`);
  console.log(`  GET  /api/status`);
  console.log('');
  console.log('👥 Usuários (admin):');
  console.log(`  GET    /api/usuarios`);
  console.log(`  POST   /api/usuarios`);
  console.log(`  PUT    /api/usuarios/:id`);
  console.log(`  DELETE /api/usuarios/:id`);
  console.log(`  POST   /api/usuarios/:id/ativar`);
  console.log(`  POST   /api/usuarios/:id/resetar-senha`);
  console.log('');
  console.log('📋 Prescrições:');
  console.log(`  GET    /api/prescricoes`);
  console.log(`  POST   /api/prescricoes`);
  console.log(`  GET    /api/prescricoes/:id`);
  console.log(`  PUT    /api/prescricoes/:id`);
  console.log(`  DELETE /api/prescricoes/:id`);
  console.log('');
  console.log('🍽️  Dietas:');
  console.log(`  GET   /api/dietas`);
  console.log(`  POST  /api/dietas (admin)`);
  console.log(`  PUT   /api/dietas/:id (admin)`);
  console.log(`  PATCH /api/dietas/:id/toggle (admin)`);
  console.log('');
  console.log('🏥 Leitos:');
  console.log(`  GET  /api/leitos`);
  console.log(`  GET  /api/leitos/disponiveis`);
  console.log('');
  console.log('👨‍⚕️  Pacientes:');
  console.log(`  GET  /api/pacientes`);
  console.log(`  POST /api/pacientes`);
  console.log('');
  console.log('🖨️  Etiquetas (NOVO!):');
  console.log(`  GET    /api/etiquetas`);
  console.log(`  GET    /api/etiquetas/pendentes`);
  console.log(`  POST   /api/etiquetas`);
  console.log(`  PATCH  /api/etiquetas/:id/imprimir`);
  console.log(`  POST   /api/etiquetas/imprimir-lote`);
  console.log(`  DELETE /api/etiquetas/:id`);
  console.log('');
  console.log('📝 Auditoria (admin):');
  console.log(`  GET  /api/auditoria/logs`);
  console.log(`  GET  /api/auditoria/estatisticas`);
  console.log('');
  console.log('🎉 Sistema pronto para uso!');
  console.log('');
});