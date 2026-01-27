// config/database.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha',
  database: 'nome_do_banco'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('✅ Conectado ao banco de dados!');
});

module.exports = connection;