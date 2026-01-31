// EXEMPLO: Como adicionar auditoria às rotas de prescrições
// Arquivo: backend/routes/prescricoes.js

// 1. Adicionar import do serviço de auditoria no topo do arquivo:
const { registrarLog } = require('../services/auditoria');

// 2. Na rota POST /api/prescricoes (criar prescrição), após criar com sucesso:
router.post('/', autenticar, async (req, res) => {
  try {
    // ... código de validação e criação ...
    
    const [result] = await pool.query(
      'INSERT INTO prescricoes ...',
      [/* params */]
    );

    // ADICIONAR AUDITORIA AQUI:
    await registrarLog({
      usuario: req.usuario,
      acao: 'CREATE',
      entidade: 'prescricao',
      entidadeId: result.insertId,
      descricao: `Criou prescrição para paciente ${req.body.nomePaciente}, leito ${req.body.leito}`,
      dadosDepois: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ sucesso: true, id: result.insertId });
  } catch (erro) {
    // ... tratamento de erro ...
  }
});

// 3. Na rota PUT /api/prescricoes/:id (atualizar prescrição):
router.put('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    // BUSCAR DADOS ANTES DA ATUALIZAÇÃO:
    const [prescricoesAntes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?',
      [id]
    );
    const dadosAntes = prescricoesAntes[0];

    // ... código de validação e atualização ...
    
    await pool.query('UPDATE prescricoes SET ... WHERE id = ?', [/* params */, id]);

    // ADICIONAR AUDITORIA AQUI:
    await registrarLog({
      usuario: req.usuario,
      acao: 'UPDATE',
      entidade: 'prescricao',
      entidadeId: parseInt(id),
      descricao: `Atualizou prescrição #${id} do paciente ${req.body.nomePaciente}`,
      dadosAntes: dadosAntes,
      dadosDepois: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ sucesso: true });
  } catch (erro) {
    // ... tratamento de erro ...
  }
});

// 4. Na rota DELETE /api/prescricoes/:id (deletar prescrição):
router.delete('/:id', autenticar, async (req, res) => {
  try {
    const { id } = req.params;
    
    // BUSCAR DADOS ANTES DA EXCLUSÃO:
    const [prescricoesAntes] = await pool.query(
      'SELECT * FROM prescricoes WHERE id = ?',
      [id]
    );
    const dadosAntes = prescricoesAntes[0];

    // ... código de validação e exclusão ...
    
    await pool.query('DELETE FROM prescricoes WHERE id = ?', [id]);

    // ADICIONAR AUDITORIA AQUI:
    await registrarLog({
      usuario: req.usuario,
      acao: 'DELETE',
      entidade: 'prescricao',
      entidadeId: parseInt(id),
      descricao: `Deletou prescrição #${id} do paciente ${dadosAntes.nome_paciente}`,
      dadosAntes: dadosAntes,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ sucesso: true });
  } catch (erro) {
    // ... tratamento de erro ...
  }
});

// ==================================================
// EXEMPLO: Auditoria em rotas de usuários
// Arquivo: backend/routes/usuarios.js
// ==================================================

// POST /api/usuarios (criar usuário):
await registrarLog({
  usuario: req.usuario,
  acao: 'CREATE',
  entidade: 'usuario',
  entidadeId: result.insertId,
  descricao: `Criou usuário ${req.body.nome} (${req.body.email}) com perfil ${req.body.role}`,
  dadosDepois: { nome: req.body.nome, email: req.body.email, role: req.body.role },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});

// DELETE /api/usuarios/:id (desativar usuário):
await registrarLog({
  usuario: req.usuario,
  acao: 'DESATIVAR',
  entidade: 'usuario',
  entidadeId: parseInt(id),
  descricao: `Desativou usuário ${dadosAntes.nome} (${dadosAntes.email})`,
  dadosAntes: dadosAntes,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});

// POST /api/usuarios/:id/resetar-senha:
await registrarLog({
  usuario: req.usuario,
  acao: 'RESET_SENHA',
  entidade: 'usuario',
  entidadeId: parseInt(id),
  descricao: `Resetou senha do usuário ${usuarioAlvo.nome}`,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});

// ==================================================
// IMPORTANTE:
// - Sempre registrar APÓS a operação ser bem-sucedida
// - Incluir dados relevantes em dadosAntes/dadosDepois
// - Usar descrições claras e informativas
// - Capturar IP e User-Agent quando possível
// ==================================================