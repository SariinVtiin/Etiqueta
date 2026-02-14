// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

// Obter URL da API da variável de ambiente
const API_URL = process.env.REACT_APP_API_URL || 'http://177.207.236.78:9091/api';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar token ao carregar
  useEffect(() => {
    const verificarToken = async () => {
      const tokenSalvo = localStorage.getItem('token');
      
      if (!tokenSalvo) {
        console.log('🔍 Nenhum token encontrado');
        setCarregando(false);
        return;
      }

      try {
        console.log('🔍 Verificando token...');
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${tokenSalvo}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Token válido, usuário:', data.usuario);
          setUsuario(data.usuario);
          setToken(tokenSalvo);
        } else {
          // Token inválido
          console.log('❌ Token inválido');
          localStorage.removeItem('token');
          setToken(null);
          setUsuario(null);
        }
      } catch (erro) {
        console.error('❌ Erro ao verificar token:', erro);
        localStorage.removeItem('token');
        setToken(null);
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    };

    verificarToken();
  }, []);

  const login = async (email, senha) => {
    try {
      console.log('🔐 Tentando fazer login...', { email, apiUrl: API_URL });
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();
      console.log('📡 Resposta do servidor:', { ok: response.ok, status: response.status, data });

      if (!response.ok) {
        throw new Error(data.erro || 'Erro ao fazer login');
      }

      // Salvar token e dados do usuário
      console.log('💾 Salvando token e dados do usuário...', data.usuario);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUsuario(data.usuario);

      console.log('✅ Login realizado com sucesso! Estado atualizado.');
      return { sucesso: true };
    } catch (erro) {
      console.error('❌ Erro no login:', erro);
      return { 
        sucesso: false, 
        erro: erro.message 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
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

  console.log('🔄 AuthContext - Estado atual:', {
    usuario: usuario?.nome || null,
    autenticado: !!usuario,
    carregando
  });

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