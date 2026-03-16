// frontend/src/contexts/AuthContext.jsx
// ============================================
// SALUSVITA TECH - Contexto de Autenticação
// Desenvolvido por FerMax Solution
// ============================================
// SEGURANÇA: sessionStorage (expira ao fechar navegador)
// NOVO: temPermissao() para controle granular de acesso
// ============================================

import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext({});

const API_URL = process.env.REACT_APP_API_URL || 'http://177.207.236.78:9091/api';

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  // Ref para evitar execução dupla no StrictMode
  const verificacaoIniciada = useRef(false);

  // Verificar token ao carregar (apenas uma vez)
  useEffect(() => {
    if (verificacaoIniciada.current) return;
    verificacaoIniciada.current = true;

    const verificarToken = async () => {
      const tokenSalvo = sessionStorage.getItem('token');

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
          sessionStorage.removeItem('token');
          setToken(null);
          setUsuario(null);
        }
      } catch (erro) {
        console.error('Erro ao verificar token:', erro);
        sessionStorage.removeItem('token');
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

      sessionStorage.setItem('token', data.token);
      setToken(data.token);
      setUsuario(data.usuario);

      return { sucesso: true, usuario: data.usuario };
    } catch (erro) {
      console.error('Erro no login:', erro);
      return { sucesso: false, erro: erro.message };
    }
  }, []);

  const logout = useCallback(async () => {
    const tokenAtual = sessionStorage.getItem('token');
    if (tokenAtual) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenAtual}`
          }
        });
      } catch (e) {
        console.error('Erro ao registrar logout:', e);
      }
    }

    sessionStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  }, []);

  const isAdmin = useCallback(() => {
    return usuario?.role === 'admin';
  }, [usuario]);

  const isNutricionista = useCallback(() => {
    return usuario?.role === 'nutricionista';
  }, [usuario]);

  /**
   * Verifica se o usuário tem uma permissão específica.
   * - Admin: SEMPRE retorna true (acesso total)
   * - Nutricionista: checa o array de permissões
   * 
   * Uso: temPermissao('prescricoes') / temPermissao('cadastros_leitos')
   * 
   * NOTA: Isso é para UX (esconder/mostrar elementos).
   * A segurança REAL está no backend (middleware verificarPermissao).
   */
  const temPermissao = useCallback((permissao) => {
    if (!usuario) return false;
    if (usuario.role === 'admin') return true;
    
    const permissoes = usuario.permissoes || [];
    return permissoes.includes(permissao);
  }, [usuario]);

  /**
   * Verifica se o usuário tem PELO MENOS UMA das permissões informadas.
   * Útil para: mostrar o menu "Cadastros" se tem qualquer permissão de cadastro.
   * 
   * Uso: temAlgumaPermissao(['cadastros_leitos', 'cadastros_dietas', ...])
   */
  const temAlgumaPermissao = useCallback((permissoes) => {
    if (!usuario) return false;
    if (usuario.role === 'admin') return true;
    
    const permissoesUsuario = usuario.permissoes || [];
    return permissoes.some(p => permissoesUsuario.includes(p));
  }, [usuario]);

  const valorContexto = {
    usuario,
    token,
    carregando,
    login,
    logout,
    isAdmin,
    isNutricionista,
    temPermissao,
    temAlgumaPermissao,
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