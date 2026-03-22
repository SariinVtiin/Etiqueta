// frontend/src/routes/route.js
// ============================================
// SALUSVITA TECH - Rotas do Sistema
// Desenvolvido por FerMax Solution
// ============================================
// NOVO: Cada rota protegida por permissão individual
// RequireAdmin removido (substituído por ProtectedRoute)
// Admin: acesso total automático via temPermissao()
// ============================================

import { Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Prescricoes from "../pages/Prescricoes/Prescricoes";
import NovaPrescricao from "../pages/NovaPrescricao/NovaPrescricao";

import Pacientes from "../pages/Pacientes/Pacientes";
import Cadastros from "../pages/Cadastros/Cadastros";
import GestaoUsuarios from "../pages/GestaoUsuarios/GestaoUsuarios";
import GestaoDietas from "../pages/GestaoDietas/GestaoDietas";
import GestaoLeitos from "../pages/GestaoLeitos/GestaoLeitos";
import GestaoRefeicoes from "../pages/GestaoRefeicoes/GestaoRefeicoes";
import GestaoConfiguracoes from "../pages/GestaoConfiguracoes/GestaoConfiguracoes";

import GestaoCondicoes from "../pages/GestaoCondicoes/GestaoCondicoes";
import GestaoCondicoesAcompanhante from "../pages/GestaoCondicoesAcompanhante/GestaoCondicoesAcompanhante";

import GestaoImportacao from "../pages/GestaoImportacao/GestaoImportacao";
import GestaoConvenios from "../pages/GestaoConvenios/GestaoConvenios";

import RequireAuth from "./RequireAuth";
import ProtectedRoute from "./ProtectedRoute";
import AppShell from "../layouts/AppShell";

import Faturamento from "../pages/Faturamento/Faturamento";
import GestaoTabelaPrecos from "../pages/GestaoTabelaPrecos/GestaoTabelaPrecos";

import GestaoSubstituicaoPrincipal from "../pages/GestaoSubstituicaoPrincipal/GestaoSubstituicaoPrincipal";

export const routes = [
  { path: "/login", element: <Login /> },

  {
    // RequireAuth: precisa estar logado
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },

          // --- Páginas principais (protegidas por permissão) ---
          {
            element: <ProtectedRoute permissao="dashboard" />,
            children: [{ path: "/dashboard", element: <Dashboard /> }],
          },

          {
            element: <ProtectedRoute permissao="prescricoes" />,
            children: [{ path: "/prescricoes", element: <Prescricoes /> }],
          },

          {
            element: <ProtectedRoute permissao="pacientes" />,
            children: [{ path: "/pacientes", element: <Pacientes /> }],
          },

          {
            element: <ProtectedRoute permissao="faturamento" />,
            children: [{ path: "/faturamento", element: <Faturamento /> }],
          },

          {
            element: <ProtectedRoute permissao="nova_prescricao" />,
            children: [
              { path: "/nova-prescricao", element: <NovaPrescricao /> },
            ],
          },

          // --- Hub de Cadastros (precisa de qualquer permissão de cadastro) ---
          {
            element: <ProtectedRoute permissao="cadastros" />,
            children: [
              {
                path: "/admin",
                element: <Navigate to="/admin/cadastros" replace />,
              },
              { path: "/admin/cadastros", element: <Cadastros /> },
            ],
          },

          // --- Sub-páginas de Cadastros (cada uma com sua permissão) ---
          {
            element: <ProtectedRoute permissao="cadastros_usuarios" />,
            children: [
              { path: "/admin/usuarios", element: <GestaoUsuarios /> },
            ],
          },

          {
            element: <ProtectedRoute permissao="cadastros_dietas" />,
            children: [{ path: "/admin/dietas", element: <GestaoDietas /> }],
          },

          {
            element: <ProtectedRoute permissao="cadastros_leitos" />,
            children: [{ path: "/admin/leitos", element: <GestaoLeitos /> }],
          },

          {
            element: <ProtectedRoute permissao="cadastros_acrescimos" />,
            children: [
              { path: "/admin/acrescimos", element: <GestaoImportacao /> },
            ],
          },

          {
            element: <ProtectedRoute permissao="cadastros_convenios" />,
            children: [
              { path: "/admin/convenios", element: <GestaoConvenios /> },
            ],
          },

          {
            element: <ProtectedRoute permissao="cadastros_tabela_precos" />,
            children: [
              { path: "/admin/tabela-precos", element: <GestaoTabelaPrecos /> },
            ],
          },

          {
            element: <ProtectedRoute permissao="cadastros_refeicoes" />,
            children: [
              { path: "/admin/refeicoes", element: <GestaoRefeicoes /> },
            ],
          },

          {
            element: <ProtectedRoute permissao="cadastros_configuracoes" />,
            children: [
              {
                path: "/admin/configuracoes",
                element: <GestaoConfiguracoes />,
              },
            ],
          },
          
          {
            element: <ProtectedRoute permissao="cadastros_condicoes" />,
            children: [
              { path: "/admin/condicoes", element: <GestaoCondicoes /> },
            ],
          },

          
          {
            element: <ProtectedRoute permissao="Gestao_Substituicao_Principal" />,
            children: [
              { path: "/admin/substituicao-principal", element: <GestaoSubstituicaoPrincipal /> },
            ],
          },

          {
            element: (
              <ProtectedRoute permissao="cadastros_condicoes_acompanhante" />
            ),
            children: [
              {
                path: "/admin/condicoes-acompanhante",
                element: <GestaoCondicoesAcompanhante />,
              },
            ],
          },

          // --- Redirects de compatibilidade ---
          {
            path: "/admin/restricoes",
            element: <Navigate to="/admin/condicoes" replace />,
          },
          {
            path: "/admin/restricoes-acompanhante",
            element: <Navigate to="/admin/condicoes-acompanhante" replace />,
          },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/dashboard" replace /> },
];
