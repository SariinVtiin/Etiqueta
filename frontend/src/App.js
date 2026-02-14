// frontend/src/App.js
// ✅ LIMPO: Removido sistema legado de etiquetas/localStorage
import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import NovaPrescricao from './pages/NovaPrescricao/NovaPrescricao';
import Prescricoes from './pages/Prescricoes/Prescricoes';
import Cadastros from './pages/Cadastros/Cadastros';
import GestaoUsuarios from './pages/GestaoUsuarios/GestaoUsuarios';
import GestaoDietas from './pages/GestaoDietas/GestaoDietas';
import GestaoLeitos from './pages/GestaoLeitos/GestaoLeitos';
import GestaoRestricoes from './pages/GestaoRestricoes/GestaoRestricoes';
import CentroNotificacoes from './components/common/CentroNotificacoes/CentroNotificacoes';
import { listarLeitos, listarDietas, listarRestricoes } from './services/api';

// ===== ÍCONES SVG =====
const Icons = {
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
};

function App() {
  const { usuario, autenticado, carregando: carregandoAuth, logout, isAdmin } = useAuth();

  const [telaAtual, setTelaAtual] = useState('dashboard');
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

  // ✅ Removido: useState de etiquetas com localStorage
  // ✅ Removido: useEffect de sync etiquetas → localStorage

  const [nucleos, setNucleos] = useState({});
  const [dietas, setDietas] = useState([]);
  const [restricoes, setRestricoes] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const [tiposAlimentacao] = useState(() => {
    const saved = localStorage.getItem('tiposAlimentacao');
    return saved ? JSON.parse(saved) : [
      'Desjejum',
      'Colação',
      'Almoço',
      'Lanche',
      'Jantar',
      'Ceia'
    ];
  });

  // Buscar leitos, dietas e restrições do BD ao carregar (somente quando autenticado)
  useEffect(() => {
    if (!autenticado) return;

    const carregarDadosBD = async () => {
      try {
        const respostaLeitos = await listarLeitos();
        if (respostaLeitos.sucesso) {
          const leitosPorNucleo = {};
          respostaLeitos.leitos.forEach(leito => {
            const setor = leito.setor || 'SEM SETOR';
            if (!leitosPorNucleo[setor]) {
              leitosPorNucleo[setor] = [];
            }
            leitosPorNucleo[setor].push(leito.numero);
          });
          setNucleos(leitosPorNucleo);
        }

        const respostaDietas = await listarDietas();
        if (respostaDietas.sucesso) {
          setDietas(respostaDietas.dietas);
        }

        const respostaRestricoes = await listarRestricoes();
        if (respostaRestricoes.sucesso) {
          setRestricoes(respostaRestricoes.restricoes);
        }
      } catch (erro) {
        console.error('Erro ao carregar dados do BD:', erro);
        setNucleos({
          'INTERNAÇÃO': Array.from({ length: 61 }, (_, i) => (601 + i).toString()),
          'UTI PEDIÁTRICA': Array.from({ length: 15 }, (_, i) => (501 + i).toString()),
          'UTI ADULTO': Array.from({ length: 16 }, (_, i) => (541 + i).toString()),
          'UDT': Array.from({ length: 18 }, (_, i) => (1 + i).toString()),
          'TMO': Array.from({ length: 14 }, (_, i) => (301 + i).toString())
        });
      } finally {
        setCarregandoDados(false);
      }
    };

    carregarDadosBD();
  }, [autenticado]);

  // ============================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================
  const irParaDashboard = useCallback(() => setTelaAtual('dashboard'), []);
  const irParaPrescricoes = useCallback(() => setTelaAtual('prescricoes'), []);
  const irParaNovaPrescricao = useCallback(() => setTelaAtual('novaPrescricao'), []);

  const irParaCadastros = useCallback(() => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem acessar os cadastros.');
      return;
    }
    setTelaAtual('cadastros');
  }, [isAdmin]);

  const irParaGestaoUsuarios = useCallback(() => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem gerenciar usuários.');
      return;
    }
    setTelaAtual('gestaoUsuarios');
  }, [isAdmin]);

  const irParaGestaoDietas = useCallback(() => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem gerenciar dietas.');
      return;
    }
    setTelaAtual('gestaoDietas');
  }, [isAdmin]);

  const irParaGestaoRestricoes = useCallback(() => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem gerenciar restrições.');
      return;
    }
    setTelaAtual('gestaoRestricoes');
  }, [isAdmin]);

  const irParaGestaoLeitos = useCallback(() => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem gerenciar leitos.');
      return;
    }
    setTelaAtual('gestaoLeitos');
  }, [isAdmin]);

  // ============================================
  // CALLBACKS PARA ATUALIZAR DADOS
  // ============================================
  const handleDietasCriadas = async () => {
    try {
      const resposta = await listarDietas();
      if (resposta.sucesso) {
        setDietas(resposta.dietas);
      }
    } catch (erro) {
      console.error('Erro ao atualizar dietas:', erro);
    }
  };

  const handleRestricoesCriadas = async () => {
    try {
      const resposta = await listarRestricoes();
      if (resposta.sucesso) {
        setRestricoes(resposta.restricoes);
      }
    } catch (erro) {
      console.error('Erro ao atualizar restrições:', erro);
    }
  };

  const handleLeitosAlterados = async () => {
    try {
      const respostaLeitos = await listarLeitos();
      if (respostaLeitos.sucesso) {
        const leitosPorNucleo = {};
        respostaLeitos.leitos.forEach(leito => {
          const setor = leito.setor || 'SEM SETOR';
          if (!leitosPorNucleo[setor]) {
            leitosPorNucleo[setor] = [];
          }
          leitosPorNucleo[setor].push(leito.numero);
        });
        setNucleos(leitosPorNucleo);
      }
    } catch (erro) {
      console.error('Erro ao atualizar leitos:', erro);
    }
  };

  // Logout com confirmação
  const handleLogout = () => {
    const confirmar = window.confirm('Deseja realmente sair?');
    if (confirmar) {
      logout();
      setTelaAtual('dashboard');
    }
  };

  // ===== LOADING DA AUTENTICAÇÃO =====
  if (carregandoAuth) {
    return (
      <div className="loading-global">
        <div className="loading-spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // ===== TELA DE LOGIN =====
  if (!autenticado) {
    return <Login />;
  }

  // ===== LOADING DOS DADOS =====
  if (carregandoDados) {
    return (
      <div className="loading-global">
        <div className="loading-spinner"></div>
        <p>Carregando dados do sistema...</p>
      </div>
    );
  }

  // ===== APP AUTENTICADO COM NAVBAR =====
  return (
    <div className="App">
      {/* ===== NAVBAR / HEADER ===== */}
      <header className="user-header">
        <div className="user-info">
          <span className="user-name">
            {Icons.user}
            {usuario.nome}
          </span>
          <span className={`user-role ${usuario.role}`}>
            {usuario.role === 'admin' ? 'Administrador' : 'Nutricionista'}
          </span>
        </div>

        <nav className="menu-navegacao">
          <button
            className={`menu-btn ${telaAtual === 'dashboard' ? 'active' : ''}`}
            onClick={irParaDashboard}
          >
            {Icons.home}
            <span>Início</span>
          </button>
          <button
            className={`menu-btn ${telaAtual === 'prescricoes' ? 'active' : ''}`}
            onClick={irParaPrescricoes}
          >
            {Icons.clipboard}
            <span>Prescrições</span>
          </button>
          <button
            className={`menu-btn ${telaAtual === 'novaPrescricao' ? 'active' : ''}`}
            onClick={irParaNovaPrescricao}
          >
            {Icons.plus}
            <span>Nova Prescrição</span>
          </button>
          {isAdmin() && (
            <button
              className={`menu-btn ${telaAtual === 'cadastros' || telaAtual === 'gestaoUsuarios' || telaAtual === 'gestaoDietas' || telaAtual === 'gestaoRestricoes' || telaAtual === 'gestaoLeitos' ? 'active' : ''}`}
              onClick={irParaCadastros}
            >
              {Icons.settings}
              <span>Cadastros</span>
            </button>
          )}
        </nav>

        <div className="header-actions">
          {/* Botão de Notificações */}
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

      {/* Centro de Notificações */}
      <CentroNotificacoes
        isOpen={notificacoesAbertas}
        onClose={() => setNotificacoesAbertas(false)}
      />

      {/* ===== TELAS ===== */}
      {telaAtual === 'dashboard' && (
        <Dashboard
          irParaPrescricoes={irParaPrescricoes}
          irParaNovaPrescricao={irParaNovaPrescricao}
        />
      )}

      {telaAtual === 'novaPrescricao' && (
        <NovaPrescricao
          voltar={irParaDashboard}
          nucleos={nucleos}
          tiposAlimentacao={tiposAlimentacao}
          dietas={dietas}
          restricoes={restricoes}
          carregandoDados={carregandoDados}
        />
      )}

      {telaAtual === 'prescricoes' && (
        <Prescricoes
          voltar={irParaDashboard}
          nucleos={nucleos}
          tiposAlimentacao={tiposAlimentacao}
          dietas={dietas}
          restricoes={restricoes}
        />
      )}

      {telaAtual === 'cadastros' && (
        <Cadastros
          voltar={irParaDashboard}
          irParaGestaoUsuarios={irParaGestaoUsuarios}
          irParaGestaoDietas={irParaGestaoDietas}
          irParaGestaoRestricoes={irParaGestaoRestricoes}
          irParaGestaoLeitos={irParaGestaoLeitos}
        />
      )}

      {telaAtual === 'gestaoUsuarios' && (
        <GestaoUsuarios voltar={irParaCadastros} />
      )}

      {telaAtual === 'gestaoDietas' && (
        <GestaoDietas
          voltar={irParaCadastros}
          onDietasCriadas={handleDietasCriadas}
        />
      )}

      {telaAtual === 'gestaoRestricoes' && (
        <GestaoRestricoes
          voltar={irParaCadastros}
          onRestricoesCriadas={handleRestricoesCriadas}
        />
      )}

      {telaAtual === 'gestaoLeitos' && (
        <GestaoLeitos
          voltar={irParaCadastros}
          onLeitosAlterados={handleLeitosAlterados}
        />
      )}

    </div>
  );
}

export default App;