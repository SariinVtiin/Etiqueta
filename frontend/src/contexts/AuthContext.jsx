// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar token ao carregar
  useEffect(() => {
    const verificarToken = async () => {
      const tokenSalvo = localStorage.getItem('token');
      
      if (!tokenSalvo) {
        setCarregando(false);
        return;
      }

      try {
        const response = await fetch('http://192.167.0.10:3001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${tokenSalvo}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsuario(data.usuario);
          setToken(tokenSalvo);
        } else {
          // Token inválido
          localStorage.removeItem('token');
          setToken(null);
        }
      } catch (erro) {
        console.error('Erro ao verificar token:', erro);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarToken();
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await fetch('http://192.167.0.10:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao fazer login');
      }

      // Salvar token
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUsuario(data.usuario);

      return { sucesso: true };
    } catch (erro) {
      return { 
        sucesso: false, 
        erro: erro.message 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  const isAdmin = () => {
    return usuario?.role === 'admin';
  };

  const isNutricionista = () => {
    return usuario?.role === 'nutricionista';
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      carregando,
      login,
      logout,
      isAdmin,
      isNutricionista,
      autenticado: !!usuario
    }}>
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