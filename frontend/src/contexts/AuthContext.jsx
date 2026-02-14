// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext({});

const API_URL = process.env.REACT_APP_API_URL || 'http://177.207.236.78:9091/api';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Ref para evitar execução dupla no StrictMode
  const verificacaoIniciada = useRef(false);

  // Verificar token ao carregar (apenas uma vez)
  useEffect(() => {
    if (verificacaoIniciada.current) return;
    verificacaoIniciada.current = true;

    const verificarToken = async () => {
      const tokenSalvo = localStorage.getItem('token');

      if (!tokenSalvo) {
        setCarregando(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${tokenSalvo}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data.usuario);
          setToken(tokenSalvo);
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setUsuario(null);
        }
      } catch (erro) {
        console.error('Erro ao verificar token:', erro);
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarToken();
  }, []);

  const login = useCallback(async (email, senha) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao fazer login');
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUsuario(data.usuario);

      return { sucesso: true, usuario: data.usuario };
    } catch (erro) {
      console.error('Erro no login:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }, []);

  const isAdmin = useCallback(() => {
    return usuario?.role === 'admin';
  }, [usuario]);

  const isNutricionista = useCallback(() => {
    return usuario?.role === 'nutricionista';
  }, [usuario]);

  const valorContexto = {
    usuario,
    token,
    carregando,
    login,
    logout,
    isAdmin,
    isNutricionista,
    autenticado: !!usuario
  };

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};