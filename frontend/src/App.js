// frontend/src/App.js - ARQUIVO COMPLETO ATUALIZADO
import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import NovaPrescricao from './pages/NovaPrescricao/NovaPrescricao';
import Prescricoes from './pages/Prescricoes/Prescricoes';
import Cadastros from './pages/Cadastros/Cadastros';
import GestaoUsuarios from './pages/GestaoUsuarios/GestaoUsuarios';
import GestaoDietas from './pages/GestaoDietas/GestaoDietas';
import GestaoRestricoes from './pages/GestaoRestricoes/GestaoRestricoes';
import { listarLeitos, listarDietas, listarRestricoes } from './services/api';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [autenticado, setAutenticado] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState(null);

  const [etiquetas, setEtiquetas] = useState(() => {
    const saved = localStorage.getItem('etiquetas');
    return saved ? JSON.parse(saved) : [];
  });

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

  // Buscar leitos, dietas E RESTRIÇÕES do BD ao carregar (somente quando autenticado)
  useEffect(() => {
    if (!autenticado) return;

    const carregarDadosBD = async () => {
      try {
        // Carregar Leitos
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

        // Carregar Dietas
        const respostaDietas = await listarDietas();
        if (respostaDietas.sucesso) {
          setDietas(respostaDietas.dietas);
          console.log('✅ Dietas carregadas do BD:', respostaDietas.dietas);
        }

        // Carregar Restrições
        const respostaRestricoes = await listarRestricoes();
        if (respostaRestricoes.sucesso) {
          setRestricoes(respostaRestricoes.restricoes);
          console.log('✅ Restrições carregadas do BD:', respostaRestricoes.restricoes);
        }
      } catch (erro) {
        console.error('❌ Erro ao carregar dados do BD:', erro);
        // Fallback para leitos
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
  const irParaGestaoRestricoes = () => {
    if (!isAdmin()) {
      alert('Acesso negado! Apenas administradores podem gerenciar restrições.');
      return;
    }
    setTelaAtual('gestaoRestricoes');
  };

  // Callbacks para atualizar estado quando novas dietas/restrições são criadas
  const handleDietasCriadas = async () => {
    try {
      const resposta = await listarDietas();
      if (resposta.sucesso) {
        setDietas(resposta.dietas);
        console.log('✅ Dietas atualizadas:', resposta.dietas);
      }
    } catch (erro) {
      console.error('❌ Erro ao atualizar dietas:', erro);
    }
  };

  const handleRestricoesCriadas = async () => {
    try {
      const resposta = await listarRestricoes();
      if (resposta.sucesso) {
        setRestricoes(resposta.restricoes);
        console.log('✅ Restrições atualizadas:', resposta.restricoes);
      }
    } catch (erro) {
      console.error('❌ Erro ao atualizar restrições:', erro);
    }
  };

  // Funções de etiquetas
  const adicionarEtiqueta = (novaEtiqueta) => {
    setEtiquetas([...etiquetas, { ...novaEtiqueta, id: Date.now() }]);
  };

  const removerEtiqueta = (id) => {
    setEtiquetas(etiquetas.filter((etiqueta) => etiqueta.id !== id));
  };

  const editarEtiqueta = (id, etiquetaEditada) => {
    setEtiquetas(
      etiquetas.map((etiqueta) =>
        etiqueta.id === id ? { ...etiqueta, ...etiquetaEditada } : etiqueta
      )
    );
  };

  // Função de autenticação
  const handleLoginSucesso = (usuario) => {
    setUsuarioAtual(usuario);
    setAutenticado(true);
    setTelaAtual('dashboard');
  };

  // Função de logout
  const handleLogout = () => {
    const confirmar = window.confirm('Deseja realmente sair?');
    if (confirmar) {
      setAutenticado(false);
      setUsuarioAtual(null);
      setTelaAtual('login');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('usuario');
    }
  };

  // Verificar se é admin
  const isAdmin = () => {
    return usuarioAtual?.nivel === 'admin';
  };

  if (!autenticado) {
    return <Login onLoginSucesso={handleLoginSucesso} />;
  }

  return (
    <div className="app">
      {telaAtual === 'dashboard' && (
        <Dashboard
          usuario={usuarioAtual}
          irParaNovaPrescricao={irParaNovaPrescricao}
          irParaPrescricoes={irParaPrescricoes}
          irParaCadastros={irParaCadastros}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />
      )}

      {telaAtual === 'novaPrescricao' && (
        <NovaPrescricao
          voltar={irParaDashboard}
          adicionarEtiqueta={adicionarEtiqueta}
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
          etiquetas={etiquetas}
          removerEtiqueta={removerEtiqueta}
          editarEtiqueta={editarEtiqueta}
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
    </div>
  );
}

export default App;