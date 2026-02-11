import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext({});
const API_BASE = process.env.REACT_APP_API_URL; // ← usa .env, não hardcoded

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  }, []);

  useEffect(() => {
    const verificarToken = async () => {
      const tokenSalvo = localStorage.getItem('token');
      
      if (!tokenSalvo) {
        setCarregando(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          headers: { 'Authorization': `Bearer ${tokenSalvo}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data.usuario);
          setToken(tokenSalvo);
        } else {
          // Token inválido ou expirado → limpa e força novo login
          logout();
        }
      } catch (erro) {
        console.error('Erro ao verificar token:', erro);
        logout();
      } finally {
        setCarregando(false);
      }
    };

    verificarToken();
  }, [logout]);

  const login = async (email, senha) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.erro || 'Erro ao fazer login');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUsuario(data.usuario);
      return { sucesso: true };
    } catch (erro) {
      return { sucesso: false, erro: erro.message };
    }
  };

  const isAdmin = () => usuario?.role === 'admin';
  const isNutricionista = () => usuario?.role === 'nutricionista';

  return (
    <AuthContext.Provider value={{
      usuario, token, carregando, login, logout,
      isAdmin, isNutricionista, autenticado: !!usuario
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};