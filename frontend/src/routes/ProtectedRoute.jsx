// frontend/src/routes/ProtectedRoute.jsx
// ============================================
// SALUSVITA TECH - Rota Protegida por Permissão
// Desenvolvido por FerMax Solution
// ============================================
// CORRIGIDO: Repassa o context do AppShell para os filhos
// para que useOutletContext() funcione em todas as páginas.
// ============================================

import React from "react";
import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ permissao }) {
  const { carregando, temPermissao } = useAuth();
  const location = useLocation();

  // ✅ CORREÇÃO: Pega o context que o AppShell passou via <Outlet context={...}>
  // e repassa para os filhos, mantendo a cadeia de contexto intacta.
  const outletContext = useOutletContext();

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

  // ✅ CORREÇÃO: Repassa o context do AppShell para os filhos
  return <Outlet context={outletContext} />;
}