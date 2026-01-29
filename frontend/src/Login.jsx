// frontend/src/Login.jsx
import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
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
      <div className="login-layout">

        {/* LADO ESQUERDO */}
        <div className="login-side">
          <div className="login-card">

            <div className="login-header">
              <img
                src={`${process.env.PUBLIC_URL}/logo-ictdf.png`}
                alt="ICTDF"
                className="login-logo"
              />
              <h2>Acesso ao sistema</h2>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {erro && <div className="login-erro">{erro}</div>}

              <div className="login-campo">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
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

          </div>
        </div>

        {/* LADO DIREITO */}
        <div className="login-image" />

      </div>
    </div>
  );
}

export default Login;
