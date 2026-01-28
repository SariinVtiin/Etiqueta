// config/database.js
const mysql = require('mysql2/promise');

// Pool de conexões para melhor performance
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'SARIIN072409',
  database: process.env.DB_DATABASE || 'etiquetas_hospital',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Testar conexão com o banco
 */
async function testarConexao() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexão com banco de dados estabelecida!');
    connection.release();
    return true;
  } catch (erro) {
    console.error('❌ Erro ao conectar no banco de dados:');
    console.error('   Mensagem:', erro.message);
    console.error('   Código:', erro.code);
    console.error('');
    console.error('⚠️  Verifique:');
    console.error('   1. Se o MySQL está rodando');
    console.error('   2. Se as credenciais no .env estão corretas');
    console.error('   3. Se o banco de dados foi criado');
    console.error('');
    return false;
  }
}

module.exports = { pool, testarConexao };