// frontend/src/layouts/AppShell.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import CentroNotificacoes from "../components/common/CentroNotificacoes/CentroNotificacoes";

import {
  listarDietas,
  listarRestricoes,
  listarLeitos,
  listarRefeicoes,
  listarRestricoesAcompanhante,
} from "../services/api";

const Icons = {
  home: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  clipboard: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  plus: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  settings: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  bell: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  logout: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  user: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

export default function AppShell() {
  const { usuario, autenticado, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [nucleos, setNucleos] = useState({});
  const [dietas, setDietas] = useState([]);
  const [restricoes, setRestricoes] = useState([]);
  const [tiposAlimentacao, setTiposAlimentacao] = useState([]);
  const [restricoesAcompanhante, setRestricoesAcompanhante] = useState([]);

  // Evita dupla execução de fetch no StrictMode (dev)
  const loadOnceRef = useRef(false);

  const carregarDadosBD = useCallback(async () => {
    if (!autenticado) return;

    try {
      setCarregandoDados(true);

      const respostaLeitos = await listarLeitos();
      if (respostaLeitos?.sucesso) {
        const leitosPorNucleo = {};
        respostaLeitos.leitos.forEach((leito) => {
          const setor = leito.setor || "SEM SETOR";
          if (!leitosPorNucleo[setor]) leitosPorNucleo[setor] = [];
          leitosPorNucleo[setor].push(leito.numero);
        });
        setNucleos(leitosPorNucleo);
      }

      const respostaDietas = await listarDietas();
      if (respostaDietas?.sucesso) {
        setDietas(
          respostaDietas.dietas.filter(
            (d) => d.ativa === 1 || d.ativa === true,
          ),
        );
      }

      const respostaRestricoes = await listarRestricoes();
      if (respostaRestricoes?.sucesso) {
        setRestricoes(respostaRestricoes.restricoes);
      }

      const respostaRestAcomp = await listarRestricoesAcompanhante();
      if (respostaRestAcomp?.sucesso) {
        setRestricoesAcompanhante(respostaRestAcomp.restricoes);
      }

      const respostaRefeicoes = await listarRefeicoes();
      if (respostaRefeicoes?.sucesso) {
        setTiposAlimentacao(respostaRefeicoes.refeicoes);
      }
    } catch (erro) {
      console.error("Erro ao carregar dados do BD:", erro);

      setNucleos({
        INTERNAÇÃO: Array.from({ length: 61 }, (_, i) => (601 + i).toString()),
        "UTI PEDIÁTRICA": Array.from({ length: 15 }, (_, i) =>
          (501 + i).toString(),
        ),
        "UTI ADULTO": Array.from({ length: 16 }, (_, i) =>
          (541 + i).toString(),
        ),
        UDT: Array.from({ length: 18 }, (_, i) => (1 + i).toString()),
        TMO: Array.from({ length: 14 }, (_, i) => (301 + i).toString()),
      });
    } finally {
      setCarregandoDados(false);
    }
  }, [autenticado]);

  useEffect(() => {
    if (!autenticado) return;
    if (loadOnceRef.current) return;
    loadOnceRef.current = true;
    carregarDadosBD();
  }, [autenticado, carregarDadosBD]);

  const refreshSystemData = useCallback(async () => {
    // Único ponto para recarregar leitos/dietas/restrições/refeições
    await carregarDadosBD();
  }, [carregarDadosBD]);

  const handleLogout = async () => {
    const confirmar = window.confirm("Deseja realmente sair?");
    if (!confirmar) return;
    await logout();
    navigate("/login", { replace: true });
  };

  const isAdminSection = useMemo(
    () => location.pathname.startsWith("/admin"),
    [location.pathname],
  );

  if (carregandoDados) {
    return (
      <div className="loading-global">
        <div className="loading-spinner"></div>
        <p>Carregando dados do sistema...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="user-header">
        <div className="user-info">
          <span className="user-name">
            {Icons.user}
            {usuario?.nome}
          </span>
          <span className={`user-role ${usuario?.role}`}>
            {usuario?.role === "admin" ? "Administrador" : "Nutricionista"}
          </span>
        </div>

        <nav className="menu-navegacao">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `menu-btn ${isActive ? "active" : ""}`}
          >
            {Icons.home}
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/prescricoes"
            className={({ isActive }) => `menu-btn ${isActive ? "active" : ""}`}
          >
            {Icons.clipboard}
            <span>Prescrições</span>
          </NavLink>

          <NavLink
            to="/nova-prescricao"
            className={({ isActive }) => `menu-btn ${isActive ? "active" : ""}`}
          >
            {Icons.plus}
            <span>Nova Prescrição</span>
          </NavLink>

          {isAdmin() && (
            <NavLink
              to="/admin/cadastros"
              className={() => `menu-btn ${isAdminSection ? "active" : ""}`}
            >
              {Icons.settings}
              <span>Cadastros</span>
            </NavLink>
          )}
        </nav>

        <div className="header-actions">
          <button
            className="btn-notificacoes"
            onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
            title="Notificações"
          >
            {Icons.bell}
          </button>

          <button className="btn-logout" onClick={handleLogout}>
            {Icons.logout}
            <span>Sair</span>
          </button>
        </div>
      </header>

      <CentroNotificacoes
        isOpen={notificacoesAbertas}
        onClose={() => setNotificacoesAbertas(false)}
      />

      <Outlet
        context={{
          nucleos,
          dietas,
          restricoes,
          tiposAlimentacao,
          restricoesAcompanhante,
          carregandoDados,
          refreshSystemData,
        }}
      />
    </div>
  );
}
