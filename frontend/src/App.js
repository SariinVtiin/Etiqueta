import React, { useState, useEffect } from 'react';
import MapaAlimentacao from './MapaAlimentacao';
import FilaImpressao from './FilaImpressao';
import Cadastros from './Cadastros';
import PreviewEtiquetas from './PreviewEtiquetas';
import TesteConexao from './TesteConexao';

function App() {
  const [telaAtual, setTelaAtual] = useState('coleta');
  
  const [etiquetas, setEtiquetas] = useState(() => {
    const saved = localStorage.getItem('etiquetas');
    return saved ? JSON.parse(saved) : [];
  });

  // Estrutura de núcleos com seus leitos
  const nucleos = {
    'INTERNAÇÃO': Array.from({ length: 61 }, (_, i) => (601 + i).toString()),
    'UTI PEDIÁTRICA': Array.from({ length: 15 }, (_, i) => (501 + i).toString()),
    'UTI ADULTO': Array.from({ length: 16 }, (_, i) => (541 + i).toString()),
    'UDT': Array.from({ length: 18 }, (_, i) => (1 + i).toString()),
    'TMO': Array.from({ length: 14 }, (_, i) => (301 + i).toString())
  };

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

  return (
    <div className="App">
      <TesteConexao />
      {telaAtual === 'coleta' && (
        <MapaAlimentacao
          nucleos={nucleos}
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