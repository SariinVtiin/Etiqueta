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
      alert('Erro ao carregar usuários: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleBuscar = () => {
    carregarUsuarios();
  };

  const abrirModalCriar = () => {
    setFormData({ nome: '', email: '', senha: '', role: 'nutricionista' });
    setModalAberto('criar');
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioSelecionado(usuario);
    setFormData({ nome: usuario.nome, email: usuario.email, role: usuario.role });
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
    setFormData({ nome: '', email: '', senha: '', role: 'nutricionista' });
    setNovaSenha('');
  };

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.senha) {
      alert('Preencha todos os campos!');
      return;
    }
    if (formData.senha.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres!');
      return;
    }
    try {
      const resposta = await criarUsuario(formData);
      if (resposta.sucesso) {
        alert(resposta.mensagem);
        fecharModal();
        carregarUsuarios();
      }
    } catch (erro) {
      alert('Erro ao criar usuário: ' + erro.message);
    }
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.email) {
      alert('Preencha todos os campos!');
      return;
    }
    try {
      const resposta = await atualizarUsuario(usuarioSelecionado.id, {
        nome: formData.nome,
        email: formData.email,
        role: formData.role
      });
      if (resposta.sucesso) {
        alert(resposta.mensagem);
        fecharModal();
        carregarUsuarios();
      }
    } catch (erro) {
      alert('Erro ao atualizar usuário: ' + erro.message);
    }
  };

  const handleResetarSenha = async (e) => {
    e.preventDefault();
    if (!novaSenha || novaSenha.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres!');
      return;
    }
    if (!window.confirm(`Confirma o reset de senha do usuário ${usuarioSelecionado.nome}?`)) {
      return;
    }
    try {
      const resposta = await resetarSenhaUsuario(usuarioSelecionado.id, novaSenha);
      if (resposta.sucesso) {
        alert(resposta.mensagem);
        fecharModal();
      }
    } catch (erro) {
      alert('Erro ao resetar senha: ' + erro.message);
    }
  };

  const handleDesativar = async (usuario) => {
    if (!window.confirm(`Tem certeza que deseja desativar o usuário ${usuario.nome}?`)) {
      return;
    }
    try {
      const resposta = await desativarUsuario(usuario.id);
      if (resposta.sucesso) {
        alert(resposta.mensagem);
        carregarUsuarios();
      }
    } catch (erro) {
      alert('Erro ao desativar usuário: ' + erro.message);
    }
  };

  const handleAtivar = async (usuario) => {
    try {
      const resposta = await ativarUsuario(usuario.id);
      if (resposta.sucesso) {
        alert(resposta.mensagem);
        carregarUsuarios();
      }
    } catch (erro) {
      alert('Erro ao ativar usuário: ' + erro.message);
    }
  };

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.ativo).length,
    admins: usuarios.filter(u => u.role === 'admin').length,
    nutricionistas: usuarios.filter(u => u.role === 'nutricionista').length
  };

  return (
    <div className="gu-page">
      {/* Header */}
      <header className="gu-header">
        <div className="gu-header-left">
          <button className="gu-btn-voltar" onClick={voltar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="gu-header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="gu-header-text">
            <h1>Gestão de Usuários</h1>
            <p>Gerencie os usuários do sistema</p>
          </div>
        </div>
        <button className="gu-btn-novo" onClick={abrirModalCriar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Usuário
        </button>
      </header>

      {/* Stats */}
      <div className="gu-stats">
        <div className="gu-stat-card">
          <div className="gu-stat-icon gu-stat-total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="gu-stat-info">
            <span className="gu-stat-value">{stats.total}</span>
            <span className="gu-stat-label">Total</span>
          </div>
        </div>
        <div className="gu-stat-card">
          <div className="gu-stat-icon gu-stat-ativos">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="gu-stat-info">
            <span className="gu-stat-value">{stats.ativos}</span>
            <span className="gu-stat-label">Ativos</span>
          </div>
        </div>
        <div className="gu-stat-card">
          <div className="gu-stat-icon gu-stat-admins">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="gu-stat-info">
            <span className="gu-stat-value">{stats.admins}</span>
            <span className="gu-stat-label">Admins</span>
          </div>
        </div>
        <div className="gu-stat-card">
          <div className="gu-stat-icon gu-stat-nutri">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="gu-stat-info">
            <span className="gu-stat-value">{stats.nutricionistas}</span>
            <span className="gu-stat-label">Nutricionistas</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="gu-toolbar">
        <div className="gu-search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
          />
          <button className="gu-btn-search" onClick={handleBuscar}>Buscar</button>
        </div>
      </div>

      {/* Content */}
      {carregando ? (
        <div className="gu-loading">
          <div className="gu-spinner"></div>
          <p>Carregando usuários...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="gu-empty">
          <div className="gu-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="17" y1="11" x2="23" y2="11"/>
            </svg>
          </div>
          <h3>Nenhum usuário encontrado</h3>
          <p>Crie o primeiro usuário clicando no botão acima.</p>
        </div>
      ) : (
        <div className="gu-table-container">
          <table className="gu-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className={!usuario.ativo ? 'gu-row-inactive' : ''}>
                  <td>
                    <div className="gu-user-cell">
                      <div className={`gu-avatar ${usuario.role}`}>
                        {usuario.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="gu-user-info">
                        <span className="gu-user-name">{usuario.nome}</span>
                        <span className="gu-user-id">#{usuario.id}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="gu-email">{usuario.email}</span></td>
                  <td>
                    <span className={`gu-badge-role gu-role-${usuario.role}`}>
                      {usuario.role === 'admin' ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          </svg>
                          Admin
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                          Nutricionista
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <span className={`gu-badge-status ${usuario.ativo ? 'gu-status-ativo' : 'gu-status-inativo'}`}>
                      {usuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="gu-actions">
                      <button className="gu-action-btn gu-action-edit" onClick={() => abrirModalEditar(usuario)} title="Editar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className="gu-action-btn gu-action-key" onClick={() => abrirModalSenha(usuario)} title="Resetar Senha">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                        </svg>
                      </button>
                      {usuario.ativo ? (
                        <button className="gu-action-btn gu-action-disable" onClick={() => handleDesativar(usuario)} title="Desativar">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                          </svg>
                        </button>
                      ) : (
                        <button className="gu-action-btn gu-action-enable" onClick={() => handleAtivar(usuario)} title="Ativar">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
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

      {/* Modal Criar */}
      {modalAberto === 'criar' && (
        <div className="gu-modal-overlay" onClick={fecharModal}>
          <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gu-modal-header">
              <div className="gu-modal-icon gu-modal-icon-create">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <h2>Novo Usuário</h2>
              <button className="gu-modal-close" onClick={fecharModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleCriarUsuario}>
              <div className="gu-form-group">
                <label>Nome Completo *</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: João Silva" />
              </div>
              <div className="gu-form-group">
                <label>Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Ex: joao@hospital.com" />
              </div>
              <div className="gu-form-group">
                <label>Senha *</label>
                <input type="password" value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="gu-form-group">
                <label>Perfil *</label>
                <div className="gu-role-selector">
                  <label className={`gu-role-option ${formData.role === 'nutricionista' ? 'selected' : ''}`}>
                    <input type="radio" name="role" value="nutricionista" checked={formData.role === 'nutricionista'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Nutricionista</span>
                  </label>
                  <label className={`gu-role-option ${formData.role === 'admin' ? 'selected' : ''}`}>
                    <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Administrador</span>
                  </label>
                </div>
              </div>
              <div className="gu-modal-actions">
                <button type="button" className="gu-btn-cancel" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="gu-btn-confirm">Criar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {modalAberto === 'editar' && (
        <div className="gu-modal-overlay" onClick={fecharModal}>
          <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gu-modal-header">
              <div className="gu-modal-icon gu-modal-icon-edit">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <h2>Editar Usuário</h2>
              <button className="gu-modal-close" onClick={fecharModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditarUsuario}>
              <div className="gu-form-group">
                <label>Nome Completo *</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} />
              </div>
              <div className="gu-form-group">
                <label>Email *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="gu-form-group">
                <label>Perfil *</label>
                <div className="gu-role-selector">
                  <label className={`gu-role-option ${formData.role === 'nutricionista' ? 'selected' : ''}`}>
                    <input type="radio" name="role" value="nutricionista" checked={formData.role === 'nutricionista'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>Nutricionista</span>
                  </label>
                  <label className={`gu-role-option ${formData.role === 'admin' ? 'selected' : ''}`}>
                    <input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Administrador</span>
                  </label>
                </div>
              </div>
              <div className="gu-modal-actions">
                <button type="button" className="gu-btn-cancel" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="gu-btn-confirm">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Resetar Senha */}
      {modalAberto === 'senha' && (
        <div className="gu-modal-overlay" onClick={fecharModal}>
          <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gu-modal-header">
              <div className="gu-modal-icon gu-modal-icon-key">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <h2>Resetar Senha</h2>
              <button className="gu-modal-close" onClick={fecharModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="gu-modal-user-info">
              <div className={`gu-avatar ${usuarioSelecionado?.role}`}>
                {usuarioSelecionado?.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <strong>{usuarioSelecionado?.nome}</strong>
                <span>{usuarioSelecionado?.email}</span>
              </div>
            </div>
            <form onSubmit={handleResetarSenha}>
              <div className="gu-form-group">
                <label>Nova Senha *</label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="gu-modal-actions">
                <button type="button" className="gu-btn-cancel" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="gu-btn-confirm gu-btn-warning">Resetar Senha</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoUsuarios;