// gerar_hash_senha.js
// Execute: node gerar_hash_senha.js

const bcrypt = require('bcryptjs');

const senha = '123456';
const hash = bcrypt.hashSync(senha, 10);

console.log('');
console.log('='.repeat(60));
console.log('HASH GERADO PARA A SENHA: 123456');
console.log('='.repeat(60));
console.log('');
console.log('Hash:');
console.log(hash);
console.log('');
console.log('='.repeat(60));
console.log('COPIE O HASH ACIMA E USE NO SQL ABAIXO');
console.log('='.repeat(60));
console.log('');
console.log('UPDATE usuarios SET senha = \'' + hash + '\' WHERE email = \'admin@hospital.com\';');
console.log('UPDATE usuarios SET senha = \'' + hash + '\' WHERE email = \'nutri1@hospital.com\';');
console.log('UPDATE usuarios SET senha = \'' + hash + '\' WHERE email = \'nutri2@hospital.com\';');
console.log('');