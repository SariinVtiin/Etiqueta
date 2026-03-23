// frontend/src/pages/GestaoUsuarios/GestaoUsuarios.jsx
// ============================================
// SALUSVITA TECH - Gestão de Usuários
// Desenvolvido por FerMax Solution
// ============================================
// NOVO: CRN, confirmarSenha, toggle ver senha,
//       grid de permissões, ModalAlerta padronizado
// ============================================

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarUsuarios,
  criarUsuario,
  atualizarUsuario,
  desativarUsuario,
  ativarUsuario,
  resetarSenhaUsuario,
  buscarPermissoesConfig,
} from "../../services/api";
import ModalAlerta from "../../components/common/ModalAlerta/ModalAlerta";
import "./GestaoUsuarios.css";

  // ============================================
  // COMPONENTE: Campo de senha com toggle
  // ============================================

  const CampoSenha = ({ label, value, onChange, mostrar, setMostrar, placeholder }) => (
    <div className="gu-form-group">
      <label>{label}</label>
      <div className="gu-senha-wrapper">
        <input
          type={mostrar ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Mínimo 8 caracteres"}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="gu-senha-toggle"
          onClick={() => setMostrar(!mostrar)}
          title={mostrar ? "Ocultar senha" : "Mostrar senha"}
        >
          {mostrar ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );


function GestaoUsuarios() {
  const navigate = useNavigate();

  // --- Estado principal ---
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  // --- Modais ---
  const [modalAberto, setModalAberto] = useState(null); // 'criar' | 'editar' | 'senha' | null
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // --- Form data ---
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    role: "nutricionista",
    crn: "",
    permissoes: [],
  });

  // --- Reset senha ---
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

  // --- Toggle visibilidade senha ---
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarNovaSenha, setMostrarConfirmarNovaSenha] = useState(false);

  // --- Config de permissões (vem do backend) ---
  const [permissoesConfig, setPermissoesConfig] = useState({
    labels: {},
    grupos: {},
    perfilPadrao: [],
  });

  // --- ModalAlerta padronizado ---
  const [modalAlerta, setModalAlerta] = useState({
    visivel: false,
    titulo: "",
    mensagem: "",
    tipo: "info",
    onConfirmar: null,
  });

  // ============================================
  // CARREGAR DADOS
  // ============================================

  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await listarUsuarios(busca);
      if (resposta.sucesso) {
        setUsuarios(resposta.usuarios);
      }
    } catch (erro) {
      console.error("Erro ao carregar usuários:", erro);
      mostrarAlerta("Erro", erro.message, "erro");
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  const carregarPermissoesConfig = useCallback(async () => {
    try {
      const resposta = await buscarPermissoesConfig();
      if (resposta.sucesso) {
        setPermissoesConfig({
          labels: resposta.labels || {},
          grupos: resposta.grupos || {},
          perfilPadrao: resposta.perfilPadrao || [],
        });
      }
    } catch (erro) {
      console.error("Erro ao carregar config de permissões:", erro);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
    carregarPermissoesConfig();
  }, [carregarUsuarios, carregarPermissoesConfig]);

  // ============================================
  // HELPERS DE MODAL ALERTA
  // ============================================

  const mostrarAlerta = (titulo, mensagem, tipo = "info") => {
    setModalAlerta({
      visivel: true,
      titulo,
      mensagem,
      tipo,
      onConfirmar: () => setModalAlerta((prev) => ({ ...prev, visivel: false })),
    });
  };

  const mostrarConfirmacao = (titulo, mensagem, onConfirmar, tipo = "confirmar") => {
    setModalAlerta({
      visivel: true,
      titulo,
      mensagem,
      tipo,
      onConfirmar: () => {
        setModalAlerta((prev) => ({ ...prev, visivel: false }));
        onConfirmar();
      },
    });
  };

  // ============================================
  // ABRIR/FECHAR MODAIS
  // ============================================

  const abrirModalCriar = () => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      role: "nutricionista",
      crn: "",
      permissoes: [...permissoesConfig.perfilPadrao],
    });
    setMostrarSenha(false);
    setMostrarConfirmarSenha(false);
    setModalAberto("criar");
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioSelecionado(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      senha: "",
      confirmarSenha: "",
      role: usuario.role,
      crn: usuario.crn || "",
      permissoes: usuario.permissoes || [],
    });
    setModalAberto("editar");
  };

  const abrirModalSenha = (usuario) => {
    setUsuarioSelecionado(usuario);
    setNovaSenha("");
    setConfirmarNovaSenha("");
    setMostrarNovaSenha(false);
    setMostrarConfirmarNovaSenha(false);
    setModalAberto("senha");
  };

  const fecharModal = () => {
    setModalAberto(null);
    setUsuarioSelecionado(null);
    setFormData({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      role: "nutricionista",
      crn: "",
      permissoes: [],
    });
    setNovaSenha("");
    setConfirmarNovaSenha("");
    setMostrarSenha(false);
    setMostrarConfirmarSenha(false);
    setMostrarNovaSenha(false);
    setMostrarConfirmarNovaSenha(false);
  };

  // ============================================
  // HANDLER: TROCA DE ROLE
  // ============================================

  const handleRoleChange = (novoRole) => {
    setFormData((prev) => ({
      ...prev,
      role: novoRole,
      crn: novoRole === "admin" ? "" : prev.crn,
      permissoes:
        novoRole === "nutricionista"
          ? prev.permissoes.length > 0
            ? prev.permissoes
            : [...permissoesConfig.perfilPadrao]
          : [],
    }));
  };

  // ============================================
  // HANDLER: TOGGLE PERMISSÃO
  // ============================================

  const togglePermissao = (chave) => {
    setFormData((prev) => {
      const novas = prev.permissoes.includes(chave)
        ? prev.permissoes.filter((p) => p !== chave)
        : [...prev.permissoes, chave];
      return { ...prev, permissoes: novas };
    });
  };

  const marcarTodas = () => {
    const todas = Object.values(permissoesConfig.grupos).flat();
    setFormData((prev) => ({ ...prev, permissoes: [...todas] }));
  };

  const desmarcarTodas = () => {
    setFormData((prev) => ({ ...prev, permissoes: [] }));
  };

  // ============================================
  // HANDLERS DE AÇÕES
  // ============================================

  const handleCriarUsuario = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email || !formData.senha) {
      mostrarAlerta("Campos obrigatórios", "Preencha nome, email e senha.", "erro");
      return;
    }

    if (formData.senha.length < 8) {
      mostrarAlerta("Senha fraca", "A senha deve ter no mínimo 8 caracteres.", "erro");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      mostrarAlerta("Senhas diferentes", "A senha e a confirmação não coincidem.", "erro");
      return;
    }

    if (formData.role === "nutricionista" && !formData.crn) {
      mostrarAlerta("CRN obrigatório", "Informe o CRN da nutricionista.", "erro");
      return;
    }

    try {
      const resposta = await criarUsuario(formData);
      if (resposta.sucesso) {
        mostrarAlerta("Sucesso", resposta.mensagem, "sucesso");
        fecharModal();
        carregarUsuarios();
      }
    } catch (erro) {
      mostrarAlerta("Erro ao criar", erro.message, "erro");
    }
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email) {
      mostrarAlerta("Campos obrigatórios", "Preencha nome e email.", "erro");
      return;
    }

    if (formData.role === "nutricionista" && !formData.crn) {
      mostrarAlerta("CRN obrigatório", "Informe o CRN da nutricionista.", "erro");
      return;
    }

    try {
      const resposta = await atualizarUsuario(usuarioSelecionado.id, {
        nome: formData.nome,
        email: formData.email,
        role: formData.role,
        crn: formData.crn,
        permissoes: formData.role === "nutricionista" ? formData.permissoes : null,
      });
      if (resposta.sucesso) {
        mostrarAlerta("Sucesso", resposta.mensagem, "sucesso");
        fecharModal();
        carregarUsuarios();
      }
    } catch (erro) {
      mostrarAlerta("Erro ao atualizar", erro.message, "erro");
    }
  };

  const handleResetarSenha = async (e) => {
    e.preventDefault();

    if (!novaSenha || novaSenha.length < 8) {
      mostrarAlerta("Senha fraca", "A nova senha deve ter no mínimo 8 caracteres.", "erro");
      return;
    }

    if (novaSenha !== confirmarNovaSenha) {
      mostrarAlerta("Senhas diferentes", "A senha e a confirmação não coincidem.", "erro");
      return;
    }

    mostrarConfirmacao(
      "Confirmar reset",
      `Confirma o reset de senha do usuário ${usuarioSelecionado.nome}?`,
      async () => {
        try {
          const resposta = await resetarSenhaUsuario(usuarioSelecionado.id, novaSenha, confirmarNovaSenha);
          if (resposta.sucesso) {
            mostrarAlerta("Sucesso", resposta.mensagem, "sucesso");
            fecharModal();
          }
        } catch (erro) {
          mostrarAlerta("Erro", erro.message, "erro");
        }
      },
    );
  };

  const handleDesativar = (usuario) => {
    mostrarConfirmacao(
      "Desativar usuário",
      `Tem certeza que deseja desativar o usuário ${usuario.nome}?`,
      async () => {
        try {
          const resposta = await desativarUsuario(usuario.id);
          if (resposta.sucesso) {
            mostrarAlerta("Sucesso", resposta.mensagem, "sucesso");
            carregarUsuarios();
          }
        } catch (erro) {
          mostrarAlerta("Erro", erro.message, "erro");
        }
      },
      "perigo",
    );
  };

  const handleAtivar = async (usuario) => {
    try {
      const resposta = await ativarUsuario(usuario.id);
      if (resposta.sucesso) {
        mostrarAlerta("Sucesso", resposta.mensagem, "sucesso");
        carregarUsuarios();
      }
    } catch (erro) {
      mostrarAlerta("Erro", erro.message, "erro");
    }
  };

  // ============================================
  // COMPONENTE: Grid de permissões
  // ============================================

  const GridPermissoes = () => (
    <div className="gu-permissoes-section">
      <div className="gu-permissoes-header">
        <label>Permissões de Acesso</label>
        <div className="gu-permissoes-acoes">
          <button type="button" className="gu-btn-mini" onClick={marcarTodas}>
            Marcar todas
          </button>
          <button type="button" className="gu-btn-mini" onClick={desmarcarTodas}>
            Desmarcar todas
          </button>
        </div>
      </div>

      {Object.entries(permissoesConfig.grupos).map(([grupo, chaves]) => (
        <div key={grupo} className="gu-permissoes-grupo">
          <h4>{grupo}</h4>
          <div className="gu-permissoes-grid">
            {chaves.map((chave) => (
              <label key={chave} className="gu-permissao-item">
                <input
                  type="checkbox"
                  checked={formData.permissoes.includes(chave)}
                  onChange={() => togglePermissao(chave)}
                />
                <span className="gu-permissao-check" />
                <span className="gu-permissao-label">
                  {permissoesConfig.labels[chave] || chave}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ============================================
  // STATS
  // ============================================

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter((u) => u.ativo).length,
    admins: usuarios.filter((u) => u.role === "admin").length,
    nutricionistas: usuarios.filter((u) => u.role === "nutricionista").length,
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="gu-page">
      {/* Header */}
      <header className="gu-header">
        <div className="gu-header-left">
          <button className="gu-btn-voltar" onClick={() => navigate("/admin/cadastros")}>
            ← Voltar
          </button>
          <div className="gu-header-text">
            <h1>👥 Gestão de Usuários</h1>
            <p>Criar, editar e gerenciar permissões dos usuários</p>
          </div>
        </div>
        <button className="gu-btn-novo" onClick={abrirModalCriar}>
          + Novo Usuário
        </button>
      </header>

      {/* Stats */}
      <div className="gu-stats">
        <div className="gu-stat-card">
          <div className="gu-stat-icon gu-stat-total">👥</div>
          <div>
            <div className="gu-stat-value">{stats.total}</div>
            <div className="gu-stat-label">Total</div>
          </div>
        </div>
        <div className="gu-stat-card">
          <div className="gu-stat-icon gu-stat-ativos">✅</div>
          <div>
            <div className="gu-stat-value">{stats.ativos}</div>
            <div className="gu-stat-label">Ativos</div>
          </div>
        </div>
        <div className="gu-stat-card">
          <div className="gu-stat-icon gu-stat-admins">🛡️</div>
          <div>
            <div className="gu-stat-value">{stats.admins}</div>
            <div className="gu-stat-label">Admins</div>
          </div>
        </div>
        <div className="gu-stat-card">
          <div className="gu-stat-icon gu-stat-nutris">🥗</div>
          <div>
            <div className="gu-stat-value">{stats.nutricionistas}</div>
            <div className="gu-stat-label">Nutricionistas</div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="gu-busca-container">
        <input
          type="text"
          className="gu-busca-input"
          placeholder="Buscar por nome, email ou CRN..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && carregarUsuarios()}
        />
        <button className="gu-btn-buscar" onClick={carregarUsuarios}>
          Buscar
        </button>
      </div>

      {/* Tabela */}
      {carregando ? (
        <div className="gu-loading">
          <div className="gu-spinner" />
          <p>Carregando usuários...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="gu-vazio">Nenhum usuário encontrado.</div>
      ) : (
        <div className="gu-table-container">
          <table className="gu-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>CRN</th>
                <th>Permissões</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className={!usuario.ativo ? "gu-row-inativo" : ""}>
                  <td className="gu-td-nome">{usuario.nome}</td>
                  <td className="gu-td-email">{usuario.email}</td>
                  <td>
                    <span className={`gu-badge-role gu-role-${usuario.role}`}>
                      {usuario.role === "admin" ? "Admin" : "Nutricionista"}
                    </span>
                  </td>
                  <td className="gu-td-crn">
                    {usuario.crn || <span className="gu-text-muted">—</span>}
                  </td>
                  <td>
                    {usuario.role === "admin" ? (
                      <span className="gu-badge-perm gu-perm-total">Acesso total</span>
                    ) : (
                      <span className="gu-badge-perm">
                        {(usuario.permissoes || []).length} permissão(ões)
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`gu-badge-status ${usuario.ativo ? "gu-status-ativo" : "gu-status-inativo"}`}>
                      {usuario.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="gu-td-acoes">
                    <button className="gu-btn-acao gu-btn-editar" onClick={() => abrirModalEditar(usuario)} title="Editar">
                      ✏️
                    </button>
                    <button className="gu-btn-acao gu-btn-senha" onClick={() => abrirModalSenha(usuario)} title="Resetar senha">
                      🔑
                    </button>
                    {usuario.ativo ? (
                      <button className="gu-btn-acao gu-btn-desativar" onClick={() => handleDesativar(usuario)} title="Desativar">
                        🚫
                      </button>
                    ) : (
                      <button className="gu-btn-acao gu-btn-ativar" onClick={() => handleAtivar(usuario)} title="Reativar">
                        ✅
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL: CRIAR USUÁRIO */}
      {/* ============================================ */}
      {modalAberto === "criar" && (
        <div className="gu-modal-overlay" onClick={fecharModal}>
          <div className="gu-modal gu-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="gu-modal-header">
              <div className="gu-modal-icon gu-modal-icon-create">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h2>Novo Usuário</h2>
              <button className="gu-modal-close" onClick={fecharModal}>✕</button>
            </div>

            <form onSubmit={handleCriarUsuario} className="gu-modal-body">
              {/* Nome */}
              <div className="gu-form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              {/* Email */}
              <div className="gu-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@hospital.com"
                />
              </div>

              {/* Perfil */}
              <div className="gu-form-group">
                <label>Perfil *</label>
                <div className="gu-role-selector">
                  <label className={`gu-role-option ${formData.role === "nutricionista" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="role-criar"
                      value="nutricionista"
                      checked={formData.role === "nutricionista"}
                      onChange={() => handleRoleChange("nutricionista")}
                    />
                    <span>🥗 Nutricionista</span>
                  </label>
                  <label className={`gu-role-option ${formData.role === "admin" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="role-criar"
                      value="admin"
                      checked={formData.role === "admin"}
                      onChange={() => handleRoleChange("admin")}
                    />
                    <span>🛡️ Administrador</span>
                  </label>
                </div>
              </div>

              {/* CRN (só nutricionista) */}
              {formData.role === "nutricionista" && (
                <div className="gu-form-group">
                  <label>CRN (Conselho Regional de Nutrição) *</label>
                  <input
                    type="text"
                    value={formData.crn}
                    onChange={(e) => setFormData({ ...formData, crn: e.target.value.toUpperCase() })}
                    placeholder="CRN-1 12345"
                    maxLength="20"
                  />
                  <span className="gu-form-hint">Formato: CRN-X XXXXX (ex: CRN-1 12345)</span>
                </div>
              )}

              {/* Senha */}
              <CampoSenha
                label="Senha *"
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                mostrar={mostrarSenha}
                setMostrar={setMostrarSenha}
                placeholder="Mínimo 8 caracteres"
              />

              {/* Confirmar Senha */}
              <CampoSenha
                label="Confirmar Senha *"
                value={formData.confirmarSenha}
                onChange={(e) => setFormData({ ...formData, confirmarSenha: e.target.value })}
                mostrar={mostrarConfirmarSenha}
                setMostrar={setMostrarConfirmarSenha}
                placeholder="Repita a senha"
              />

              {/* Indicador de match */}
              {formData.senha && formData.confirmarSenha && (
                <div className={`gu-senha-match ${formData.senha === formData.confirmarSenha ? "gu-match-ok" : "gu-match-erro"}`}>
                  {formData.senha === formData.confirmarSenha
                    ? "✓ Senhas coincidem"
                    : "✕ Senhas não coincidem"}
                </div>
              )}

              {/* Permissões (só nutricionista) */}
              {formData.role === "nutricionista" && <GridPermissoes />}

              {/* Ações */}
              <div className="gu-modal-actions">
                <button type="button" className="gu-btn-cancel" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="gu-btn-confirm">
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL: EDITAR USUÁRIO */}
      {/* ============================================ */}
      {modalAberto === "editar" && (
        <div className="gu-modal-overlay" onClick={fecharModal}>
          <div className="gu-modal gu-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="gu-modal-header">
              <div className="gu-modal-icon gu-modal-icon-edit">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h2>Editar Usuário</h2>
              <button className="gu-modal-close" onClick={fecharModal}>✕</button>
            </div>

            <form onSubmit={handleEditarUsuario} className="gu-modal-body">
              {/* Nome */}
              <div className="gu-form-group">
                <label>Nome Completo *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="gu-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Perfil */}
              <div className="gu-form-group">
                <label>Perfil *</label>
                <div className="gu-role-selector">
                  <label className={`gu-role-option ${formData.role === "nutricionista" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="role-editar"
                      value="nutricionista"
                      checked={formData.role === "nutricionista"}
                      onChange={() => handleRoleChange("nutricionista")}
                    />
                    <span>🥗 Nutricionista</span>
                  </label>
                  <label className={`gu-role-option ${formData.role === "admin" ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="role-editar"
                      value="admin"
                      checked={formData.role === "admin"}
                      onChange={() => handleRoleChange("admin")}
                    />
                    <span>🛡️ Administrador</span>
                  </label>
                </div>
              </div>

              {/* CRN (só nutricionista) */}
              {formData.role === "nutricionista" && (
                <div className="gu-form-group">
                  <label>CRN (Conselho Regional de Nutrição) *</label>
                  <input
                    type="text"
                    value={formData.crn}
                    onChange={(e) => setFormData({ ...formData, crn: e.target.value.toUpperCase() })}
                    placeholder="CRN-1 12345"
                    maxLength="20"
                  />
                  <span className="gu-form-hint">Formato: CRN-X XXXXX (ex: CRN-1 12345)</span>
                </div>
              )}

              {/* Permissões (só nutricionista) */}
              {formData.role === "nutricionista" && <GridPermissoes />}

              {/* Ações */}
              <div className="gu-modal-actions">
                <button type="button" className="gu-btn-cancel" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="gu-btn-confirm">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MODAL: RESETAR SENHA */}
      {/* ============================================ */}
      {modalAberto === "senha" && (
        <div className="gu-modal-overlay" onClick={fecharModal}>
          <div className="gu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gu-modal-header">
              <div className="gu-modal-icon gu-modal-icon-password">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h2>Resetar Senha</h2>
              <button className="gu-modal-close" onClick={fecharModal}>✕</button>
            </div>

            <form onSubmit={handleResetarSenha} className="gu-modal-body">
              <div className="gu-form-group">
                <label>Usuário</label>
                <input type="text" value={usuarioSelecionado?.nome || ""} disabled />
              </div>

              <CampoSenha
                label="Nova Senha *"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                mostrar={mostrarNovaSenha}
                setMostrar={setMostrarNovaSenha}
                placeholder="Mínimo 8 caracteres"
              />

              <CampoSenha
                label="Confirmar Nova Senha *"
                value={confirmarNovaSenha}
                onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                mostrar={mostrarConfirmarNovaSenha}
                setMostrar={setMostrarConfirmarNovaSenha}
                placeholder="Repita a nova senha"
              />

              {/* Indicador de match */}
              {novaSenha && confirmarNovaSenha && (
                <div className={`gu-senha-match ${novaSenha === confirmarNovaSenha ? "gu-match-ok" : "gu-match-erro"}`}>
                  {novaSenha === confirmarNovaSenha
                    ? "✓ Senhas coincidem"
                    : "✕ Senhas não coincidem"}
                </div>
              )}

              <div className="gu-modal-actions">
                <button type="button" className="gu-btn-cancel" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="gu-btn-confirm">
                  Resetar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Alerta Padronizado */}
      <ModalAlerta
        visivel={modalAlerta.visivel}
        titulo={modalAlerta.titulo}
        mensagem={modalAlerta.mensagem}
        tipo={modalAlerta.tipo}
        onConfirmar={modalAlerta.onConfirmar}
        onCancelar={() => setModalAlerta((prev) => ({ ...prev, visivel: false }))}
      />
    </div>
  );
}

export default GestaoUsuarios;