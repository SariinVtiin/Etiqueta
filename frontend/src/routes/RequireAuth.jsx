import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth() {
  const { autenticado, carregando } = useAuth();
  const location = useLocation();

  if (carregando) {
    return (
      <div className="loading-global">
        <div className="loading-spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
