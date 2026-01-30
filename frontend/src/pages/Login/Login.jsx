// frontend/src/pages/Login/Login.jsx
import React, { useState } from 'react';
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
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🏥 Sistema de Etiquetas</h1>
          <p>Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {erro && (
            <div className="login-erro">
              ⚠️ {erro}
            </div>
          )}

          <div className="login-campo">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              autoFocus
              disabled={carregando}
            />
          </div>

          <div className="login-campo">
            <label>Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••"
              disabled={carregando}
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-ajuda">
            <strong>Usuários de teste:</strong><br/>
            <code>admin@hospital.com</code> - Admin<br/>
            <code>nutri1@hospital.com</code> - Nutricionista<br/>
            Senha para todos: <code>123456</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;