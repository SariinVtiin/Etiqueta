import React, { useState, useEffect } from 'react';
import { listarUsuarios, criarUsuario, atualizarUsuario, desativarUsuario, ativarUsuario, resetarSenhaUsuario } from '../../services/api';
import './GestaoUsuarios.css';

function GestaoUsuarios({ voltar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'nutricionista'
  });
  const [novaSenha, setNovaSenha] = useState('');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setCarregando(true);
      const resposta = await listarUsuarios(busca);
      if (resposta.sucesso) {
        setUsuarios(resposta.usuarios);
      }
    } catch (erro) {
      console.error('Erro ao carregar usuários:', erro);
      alert('❌ Erro ao carregar usuários: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleBuscar = () => {
    carregarUsuarios();
  };

  const abrirModalCriar = () => {
    setFormData({
      nome: '',
      email: '',
      senha: '',
      role: 'nutricionista'
    });
    setModalAberto('criar');
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioSelecionado(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role
    });
    setModalAberto('editar');
  };

  const abrirModalSenha = (usuario) => {
    setUsuarioSelecionado(usuario);
    setNovaSenha('');
    setModalAberto('senha');
  };

  const fecharModal = () => {
    setModalAberto(null);
    setUsuarioSelecionado(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      role: 'nutricionista'
    });
    setNovaSenha('');
  };

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email || !formData.senha) {
      alert('⚠️ Preencha todos os campos!');
      return;
    }

    if (formData.senha.length < 6) {
      alert('⚠️ A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    try {
      const resposta = await criarUsuario(formData);
      if (resposta.sucesso) {
        alert('✅ ' + resposta.mensagem);
        fecharModal();
        carregarUsuarios();
      }
    } catch (erro) {
      alert('❌ Erro ao criar usuário: ' + erro.message);
    }
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      alert('⚠️ Preencha todos os campos!');
      return;
    }

    try {
      const resposta = await atualizarUsuario(usuarioSelecionado.id, {
        nome: formData.nome,
        email: formData.email,
        role: formData.role
      });
      if (resposta.sucesso) {
        alert('✅ ' + resposta.mensagem);
        fecharModal();
        carregarUsuarios();
      }
    } catch (erro) {
      alert('❌ Erro ao atualizar usuário: ' + erro.message);
    }
  };

  const handleResetarSenha = async (e) => {
    e.preventDefault();
    
    if (!novaSenha || novaSenha.length < 6) {
      alert('⚠️ A senha deve ter no mínimo 6 caracteres!');
      return;
    }

    if (!window.confirm(`Confirma o reset de senha do usuário ${usuarioSelecionado.nome}?`)) {
      return;
    }

    try {
      const resposta = await resetarSenhaUsuario(usuarioSelecionado.id, novaSenha);
      if (resposta.sucesso) {
        alert('✅ ' + resposta.mensagem);
        fecharModal();
      }
    } catch (erro) {
      alert('❌ Erro ao resetar senha: ' + erro.message);
    }
  };

  const handleDesativar = async (usuario) => {
    if (!window.confirm(`Tem certeza que deseja desativar o usuário ${usuario.nome}?`)) {
      return;
    }

    try {
      const resposta = await desativarUsuario(usuario.id);
      if (resposta.sucesso) {
        alert('✅ ' + resposta.mensagem);
        carregarUsuarios();
      }
    } catch (erro) {
      alert('❌ Erro ao desativar usuário: ' + erro.message);
    }
  };

  const handleAtivar = async (usuario) => {
    try {
      const resposta = await ativarUsuario(usuario.id);
      if (resposta.sucesso) {
        alert('✅ ' + resposta.mensagem);
        carregarUsuarios();
      }
    } catch (erro) {
      alert('❌ Erro ao ativar usuário: ' + erro.message);
    }
  };

  return (
    <div className="gestao-usuarios-container">
      <div className="gestao-header">
        <h1>👥 Gestão de Usuários</h1>
        <button className="btn-voltar" onClick={voltar}>
          ← Voltar
        </button>
      </div>

      <div className="usuarios-acoes">
        <div className="busca-container">
          <input
            type="text"
            placeholder="🔍 Buscar por nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
          />
          <button className="btn-buscar" onClick={handleBuscar}>
            Buscar
          </button>
        </div>
        <button className="btn-criar-usuario" onClick={abrirModalCriar}>
          ➕ Novo Usuário
        </button>
      </div>

      {carregando ? (
        <div className="loading-usuarios">
          <div className="loading-spinner"></div>
          <p>Carregando usuários...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="sem-usuarios">
          <h3>📭 Nenhum usuário encontrado</h3>
          <p>Crie o primeiro usuário clicando no botão acima.</p>
        </div>
      ) : (
        <div className="tabela-usuarios-container">
          <table className="tabela-usuarios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className={!usuario.ativo ? 'usuario-inativo' : ''}>
                  <td>#{usuario.id}</td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span className={`badge-role ${usuario.role}`}>
                      {usuario.role === 'admin' ? '🔴 Admin' : '🟢 Nutricionista'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status ${usuario.ativo ? 'ativo' : 'inativo'}`}>
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="acoes-usuario">
                      <button
                        className="btn-acao editar"
                        onClick={() => abrirModalEditar(usuario)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-acao senha"
                        onClick={() => abrirModalSenha(usuario)}
                        title="Resetar Senha"
                      >
                        🔑
                      </button>
                      {usuario.ativo ? (
                        <button
                          className="btn-acao desativar"
                          onClick={() => handleDesativar(usuario)}
                          title="Desativar"
                        >
                          🚫
                        </button>
                      ) : (
                        <button
                          className="btn-acao ativar"
                          onClick={() => handleAtivar(usuario)}
                          title="Ativar"
                        >
                          ✅
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modais (criar, editar, senha) - código mantido igual */}
      {modalAberto === 'criar' && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>➕ Novo Usuário</h2>
            <form onSubmit={handleCriarUsuario}>
              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ex: joao@hospital.com"
                />
              </div>
              <div className="form-group">
                <label>Senha *</label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="form-group">
                <label>Perfil *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="nutricionista">Nutricionista</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAberto === 'editar' && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Editar Usuário</h2>
            <form onSubmit={handleEditarUsuario}>
              <div className="form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Perfil *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="nutricionista">Nutricionista</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalAberto === 'senha' && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🔑 Resetar Senha</h2>
            <p>Usuário: <strong>{usuarioSelecionado?.nome}</strong></p>
            <form onSubmit={handleResetarSenha}>
              <div className="form-group">
                <label>Nova Senha *</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  Resetar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoUsuarios;