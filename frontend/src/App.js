// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Prescricoes from './pages/Prescricoes';
import NovaPrescricao from './pages/NovaPrescricao';
import Cadastros from './pages/Cadastros';
import GestaoUsuarios from './pages/GestaoUsuarios';
import GestaoDietas from './pages/GestaoDietas';
import CentroNotificacoes from './components/common/CentroNotificacoes';
import { listarLeitos, listarDietas } from './services/api';
import './App.css';

// Ícones SVG
const Icons = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
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
  )
};

function AppContent() {
  const { autenticado, usuario, carregando: carregandoAuth, logout, isAdmin } = useAuth();
  const [telaAtual, setTelaAtual] = useState('dashboard');
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  
  const [etiquetas, setEtiquetas] = useState(() => {
    const saved = localStorage.getItem('etiquetas');
    return saved ? JSON.parse(saved) : [];
  });

  const [nucleos, setNucleos] = useState({});
  const [dietas, setDietas] = useState([]);
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

  // Buscar leitos e dietas do BD ao carregar (somente quando autenticado)
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
          console.log('✅ Leitos carregados do BD:', leitosPorNucleo);
        }

        const respostaDietas = await listarDietas();
        if (respostaDietas.sucesso) {
          setDietas(respostaDietas.dietas);
          console.log('✅ Dietas carregadas do BD:', respostaDietas.dietas);
        }
      } catch (erro) {
        console.error('❌ Erro ao carregar dados do BD:', erro);
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

  useEffect(() => {
    localStorage.setItem('etiquetas', JSON.stringify(etiquetas));
  }, [etiquetas]);

  // Funções de navegação
  const irParaDashboard = () => setTelaAtual('dashboard');
  const irParaPrescricoes = () => setTelaAtual('prescricoes');
  const irParaNovaPrescricao = () => setTelaAtual('novaPrescricao');
  const irParaCadastros = () => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem acessar os cadastros.');
      return;
    }
    setTelaAtual('cadastros');
  };
  const irParaGestaoUsuarios = () => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem gerenciar usuários.');
      return;
    }
    setTelaAtual('gestaoUsuarios');
  };
  const irParaGestaoDietas = () => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem gerenciar dietas.');
      return;
    }
    setTelaAtual('gestaoDietas');
  };
  const irParaPreview = () => setTelaAtual('preview');

  // Loading da autenticação
  if (carregandoAuth) {
    return (
      <div className="loading-global">
        <div className="loading-spinner"></div>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Tela de login se não estiver autenticado
  if (!autenticado) {
    return <Login />;
  }

  // Loading dos dados
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
      {/* Header com informações do usuário e menu */}
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
        
        {/* Menu de Navegação */}
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
              className={`menu-btn ${telaAtual === 'cadastros' ? 'active' : ''}`}
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
            {etiquetas.length > 0 && (
              <span className="notificacoes-badge">{etiquetas.length}</span>
            )}
          </button>
          
          <button className="btn-logout" onClick={logout}>
            {Icons.logout}
            <span>Sair</span>
          </button>
        </div>
      </header>
      
      {/* Centro de Notificações */}
      <CentroNotificacoes
        isOpen={notificacoesAbertas}
        onClose={() => setNotificacoesAbertas(false)}
        etiquetas={etiquetas}
      />
      
      {/* Renderizar tela de acordo com navegação */}
      {telaAtual === 'dashboard' && (
        <Dashboard
          irParaPrescricoes={irParaPrescricoes}
          irParaNovaPrescricao={irParaNovaPrescricao}
        />
      )}
      
      {telaAtual === 'prescricoes' && (
        <Prescricoes 
          voltar={irParaDashboard}
          nucleos={nucleos}
          dietas={dietas}
        />
      )}
      
      {telaAtual === 'novaPrescricao' && (
        <NovaPrescricao
          nucleos={nucleos}
          dietas={dietas}
          tiposAlimentacao={tiposAlimentacao}
          etiquetas={etiquetas}
          setEtiquetas={setEtiquetas}
        />
      )}
      
      {telaAtual === 'cadastros' && isAdmin() && (
        <Cadastros
          voltar={irParaDashboard}
          irParaGestaoUsuarios={irParaGestaoUsuarios}
          irParaGestaoDietas={irParaGestaoDietas}
          irParaPreview={irParaPreview}
        />
      )}

      {telaAtual === 'gestaoUsuarios' && isAdmin() && (
        <GestaoUsuarios
          voltar={irParaCadastros}
        />
      )}

      {telaAtual === 'gestaoDietas' && isAdmin() && (
        <GestaoDietas
          voltar={irParaCadastros}
        />
      )}

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;