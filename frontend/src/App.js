import React, { useState, useEffect } from 'react';
import MapaAlimentacao from './MapaAlimentacao';
import FilaImpressao from './FilaImpressao';
import Cadastros from './Cadastros';
import PreviewEtiquetas from './PreviewEtiquetas';
import StatusIndicador from './components/StatusIndicador';
import { listarLeitos, listarDietas } from './services/api';

function App() {
  const [telaAtual, setTelaAtual] = useState('coleta');
  
  const [etiquetas, setEtiquetas] = useState(() => {
    const saved = localStorage.getItem('etiquetas');
    return saved ? JSON.parse(saved) : [];
  });

  // Estados para dados do BD
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

  // Buscar leitos e dietas do BD ao carregar
  useEffect(() => {
    const carregarDadosBD = async () => {
      try {
        // Buscar leitos
        const respostaLeitos = await listarLeitos();
        if (respostaLeitos.sucesso) {
          // Organizar leitos por setor
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

        // Buscar dietas
        const respostaDietas = await listarDietas();
        if (respostaDietas.sucesso) {
          setDietas(respostaDietas.dietas);
          console.log('✅ Dietas carregadas do BD:', respostaDietas.dietas);
        }
      } catch (erro) {
        console.error('❌ Erro ao carregar dados do BD:', erro);
        // Fallback para dados locais se o BD falhar
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
  }, []);

  useEffect(() => {
    localStorage.setItem('tiposAlimentacao', JSON.stringify(tiposAlimentacao));
  }, [tiposAlimentacao]);

  useEffect(() => {
    localStorage.setItem('etiquetas', JSON.stringify(etiquetas));
  }, [etiquetas]);

  const irParaCadastros = () => {
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
        />
      )}
      
      {telaAtual === 'impressao' && (
        <FilaImpressao
          etiquetas={etiquetas}
          setEtiquetas={setEtiquetas}
          voltar={voltarParaColeta}
        />
      )}
      
      {telaAtual === 'cadastros' && (
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

export default App;