// frontend/src/routes/ProtectedRoute.jsx
// ============================================
// SALUSVITA TECH - Rota Protegida por Permissão
// Desenvolvido por FerMax Solution
// ============================================
// CORRIGIDO: Redireciona com state de "sem permissão"
// para que o Dashboard mostre um alerta ao usuário.
// ============================================

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ permissao }) {
  const { carregando, temPermissao } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="loading-global">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Se uma permissão específica é exigida e o usuário não tem
  if (permissao && !temPermissao(permissao)) {
    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          semPermissao: true,
          rotaBloqueada: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}