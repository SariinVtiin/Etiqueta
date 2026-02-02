// frontend/src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Animação de entrada
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    if (!formData.email || !formData.senha) {
      setErro('Preencha todos os campos');
      setCarregando(false);
      return;
    }

    const resultado = await login(formData.email, formData.senha);
    
    if (!resultado.sucesso) {
      setErro(resultado.erro);
    }
    
    setCarregando(false);
  };

  return (
    <div className="login-page">
      {/* Background com padrão animado */}
      <div className="login-background">
        <div className="bg-pattern"></div>
        <div className="bg-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <div className={`login-container ${mounted ? 'mounted' : ''}`}>
        {/* Lado esquerdo - Formulário */}
        <div className="login-form-section">
          <div className="login-form-wrapper">
            {/* Logo e Header */}
            <div className="login-header">
              <div className="logo-container">
                <img 
                  src="/logo-ictdf.png" 
                  alt="ICTDF Logo" 
                  className="login-logo"
                />
              </div>
              <div className="login-title-group">
                <h1 className="login-title">Sistema de Nutrição</h1>
                <p className="login-subtitle">Gestão de Prescrições</p>
              </div>
            </div>

            {/* Mensagem de boas-vindas */}
            <div className="welcome-message">
              <h2>Bem-vindo de volta!</h2>
              <p>Faça login para acessar o sistema</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="login-form">
              {/* Erro */}
              {erro && (
                <div className="login-error">
                  <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{erro}</span>
                </div>
              )}

              {/* Campo Email */}
              <div className="form-group">
                <label htmlFor="email">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  autoFocus
                  disabled={carregando}
                  autoComplete="email"
                />
              </div>

              {/* Campo Senha */}
              <div className="form-group">
                <label htmlFor="senha">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Senha
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    id="senha"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={carregando}
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    tabIndex={-1}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarSenha ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Botão de Login */}
              <button 
                type="submit" 
                className={`login-button ${carregando ? 'loading' : ''}`}
                disabled={carregando}
              >
                {carregando ? (
                  <>
                    <span className="spinner"></span>
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <svg className="button-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              <div className="footer-divider">
                <span>Esbagallayds - Equipe</span>
              </div>
              <p className="footer-text">
                Sistema de gestão de nutrição hospitalar
              </p>
            </div>
          </div>
        </div>

        {/* Lado direito - Visual/Branding */}
        <div className="login-visual-section">
          <div className="visual-content">
            <div className="visual-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/>
                <path d="M1 21h22"/>
                <path d="M9 7h6"/>
                <path d="M9 11h6"/>
                <path d="M9 15h4"/>
              </svg>
            </div>
            <h2 className="visual-title">Nutrição Hospitalar</h2>
            <p className="visual-description">
              Gerencie prescrições dietéticas, imprima etiquetas e organize 
              a alimentação dos pacientes de forma eficiente e segura.
            </p>
            
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <span>Prescrições</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                </div>
                <span>Etiquetas</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <span>Pacientes</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </div>
                <span>Gestão</span>
              </div>
            </div>

            <div className="visual-decoration">
              <div className="decoration-ring ring-1"></div>
              <div className="decoration-ring ring-2"></div>
              <div className="decoration-ring ring-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;