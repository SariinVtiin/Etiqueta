import { Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Prescricoes from "../pages/Prescricoes/Prescricoes";
import NovaPrescricao from "../pages/NovaPrescricao/NovaPrescricao";

import Cadastros from "../pages/Cadastros/Cadastros";
import GestaoUsuarios from "../pages/GestaoUsuarios/GestaoUsuarios";
import GestaoDietas from "../pages/GestaoDietas/GestaoDietas";
import GestaoLeitos from "../pages/GestaoLeitos/GestaoLeitos";
import GestaoRefeicoes from "../pages/GestaoRefeicoes/GestaoRefeicoes";
import GestaoConfiguracoes from "../pages/GestaoConfiguracoes/GestaoConfiguracoes";

import GestaoCondicoes from "../pages/GestaoCondicoes/GestaoCondicoes";
import GestaoCondicoesAcompanhante from "../pages/GestaoCondicoesAcompanhante/GestaoCondicoesAcompanhante";

import RequireAuth from "./RequireAuth";
import RequireAdmin from "./RequireAdmin";
import AppShell from "../layouts/AppShell";

export const routes = [
  { path: "/login", element: <Login /> },

  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },

          { path: "/dashboard", element: <Dashboard /> },
          { path: "/prescricoes", element: <Prescricoes /> },
          { path: "/nova-prescricao", element: <NovaPrescricao /> },

          {
            element: <RequireAdmin />,
            children: [
              {
                path: "/admin",
                element: <Navigate to="/admin/cadastros" replace />,
              },

              { path: "/admin/cadastros", element: <Cadastros /> },
              { path: "/admin/usuarios", element: <GestaoUsuarios /> },
              { path: "/admin/dietas", element: <GestaoDietas /> },
              { path: "/admin/leitos", element: <GestaoLeitos /> },
              { path: "/admin/refeicoes", element: <GestaoRefeicoes /> },
              {
                path: "/admin/configuracoes",
                element: <GestaoConfiguracoes />,
              },

              { path: "/admin/condicoes", element: <GestaoCondicoes /> },
              {
                path: "/admin/condicoes-acompanhante",
                element: <GestaoCondicoesAcompanhante />,
              },

              {
                path: "/admin/restricoes",
                element: <Navigate to="/admin/condicoes" replace />,
              },
              {
                path: "/admin/restricoes-acompanhante",
                element: (
                  <Navigate to="/admin/condicoes-acompanhante" replace />
                ),
              },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <Navigate to="/dashboard" replace /> },
];
