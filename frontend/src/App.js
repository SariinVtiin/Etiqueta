import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './Login';
import MapaAlimentacao from './MapaAlimentacao';
import FilaImpressao from './FilaImpressao';
import Cadastros from './Cadastros';
import PreviewEtiquetas from './PreviewEtiquetas';
import StatusIndicador from './components/StatusIndicador';
import { listarLeitos, listarDietas } from './services/api';
import './App.css';

function AppContent() {
  const { autenticado, usuario, carregando: carregandoAuth, logout, isAdmin } = useAuth();
  const [telaAtual, setTelaAtual] = useState('coleta');
  
  const [etiquetas, setEtiquetas] = useState(() => {
    const saved = localStorage.getItem('etiquetas');
    return saved ? JSON.parse(saved) : [];
  });

  const [nucleos, setNucleos] = useState({});
  const [dietas, setDietas] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(true);

  const [tiposAlimentacao, setTiposAlimentacao] = useState(() => {
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
    localStorage.setItem('tiposAlimentacao', JSON.stringify(tiposAlimentacao));
  }, [tiposAlimentacao]);

  useEffect(() => {
    localStorage.setItem('etiquetas', JSON.stringify(etiquetas));
  }, [etiquetas]);

  const irParaCadastros = () => {
    // Verificar se é admin
    if (!isAdmin()) {
      alert('⚠️ Acesso negado! Apenas administradores podem acessar os cadastros.');
      return;
    }
    setTelaAtual('cadastros');
  };

  const irParaImpressao = () => {
    setTelaAtual('impressao');
  };

  const irParaPreview = () => {
    setTelaAtual('preview');
  };

  const voltarParaColeta = () => {
    setTelaAtual('coleta');
  };

  // Loading da autenticação
  if (carregandoAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #007bff',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Carregando dados do sistema...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <StatusIndicador />
      
      {/* Header com informações do usuário */}
      <div className="user-header">
        <div className="user-info">
          <span className="user-name">👤 {usuario.nome}</span>
          <span className="user-role">
            {usuario.role === 'admin' ? '🔴 Administrador' : '🟢 Nutricionista'}
          </span>
        </div>
        <button className="btn-logout" onClick={logout}>
          🚪 Sair
        </button>
      </div>
      
      {telaAtual === 'coleta' && (
        <MapaAlimentacao
          nucleos={nucleos}
          dietas={dietas}
          tiposAlimentacao={tiposAlimentacao}
          etiquetas={etiquetas}
          setEtiquetas={setEtiquetas}
          irParaCadastros={irParaCadastros}
          irParaImpressao={irParaImpressao}
          irParaPreview={irParaPreview}
          isAdmin={isAdmin()}
        />
      )}
      
      {telaAtual === 'impressao' && (
        <FilaImpressao
          etiquetas={etiquetas}
          setEtiquetas={setEtiquetas}
          voltar={voltarParaColeta}
        />
      )}
      
      {telaAtual === 'cadastros' && isAdmin() && (
        <Cadastros
          tiposAlimentacao={tiposAlimentacao}
          setTiposAlimentacao={setTiposAlimentacao}
          voltar={voltarParaColeta}
        />
      )}

      {telaAtual === 'preview' && (
        <PreviewEtiquetas
          voltar={voltarParaColeta}
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