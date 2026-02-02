import React, { useState, useEffect } from 'react';
import { 
  listarEtiquetasPendentes, 
  marcarEtiquetaImpressa,
  imprimirEtiquetasLote,
  deletarEtiqueta 
} from '../../services/api';
import './FilaImpressao.css';

function FilaImpressao({ voltar }) {
  const [etiquetas, setEtiquetas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [selecionadas, setSelecionadas] = useState([]);
  const [imprimindo, setImprimindo] = useState(false);

  useEffect(() => {
    carregarFila();
    
    // Atualizar fila a cada 30 segundos
    const intervalo = setInterval(carregarFila, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const carregarFila = async () => {
    try {
      setCarregando(true);
      const resposta = await listarEtiquetasPendentes();
      
      if (resposta.sucesso) {
        setEtiquetas(resposta.etiquetas);
      }
    } catch (erro) {
      console.error('Erro ao carregar fila:', erro);
    } finally {
      setCarregando(false);
    }
  };

  const toggleSelecao = (id) => {
    if (selecionadas.includes(id)) {
      setSelecionadas(selecionadas.filter(i => i !== id));
    } else {
      setSelecionadas([...selecionadas, id]);
    }
  };

  const selecionarTodas = () => {
    if (selecionadas.length === etiquetas.length) {
      setSelecionadas([]);
    } else {
      setSelecionadas(etiquetas.map(e => e.id));
    }
  };

  const handleImprimirSelecionadas = async () => {
    if (selecionadas.length === 0) {
      alert('⚠️ Selecione pelo menos uma etiqueta!');
      return;
    }

    if (!window.confirm(`Imprimir ${selecionadas.length} etiqueta(s)?`)) {
      return;
    }

    try {
      setImprimindo(true);
      
      // Abrir janela de impressão
      abrirJanelaImpressao(selecionadas);
      
      // Aguardar um pouco
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Marcar como impressas
      const resposta = await imprimirEtiquetasLote(selecionadas);
      
      if (resposta.sucesso) {
        alert(`✅ ${resposta.total} etiqueta(s) impressa(s)!`);
        setSelecionadas([]);
        carregarFila();
      }
    } catch (erro) {
      console.error('Erro ao imprimir:', erro);
      alert('❌ Erro ao imprimir: ' + erro.message);
    } finally {
      setImprimindo(false);
    }
  };

  const handleImprimirIndividual = async (id) => {
    if (!window.confirm('Imprimir esta etiqueta?')) {
      return;
    }

    try {
      setImprimindo(true);
      
      // Abrir janela de impressão
      abrirJanelaImpressao([id]);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const resposta = await marcarEtiquetaImpressa(id);
      
      if (resposta.sucesso) {
        alert('✅ Etiqueta impressa!');
        carregarFila();
      }
    } catch (erro) {
      console.error('Erro ao imprimir:', erro);
      alert('❌ Erro ao imprimir: ' + erro.message);
    } finally {
      setImprimindo(false);
    }
  };

  const abrirJanelaImpressao = (ids) => {
    const etiquetasImprimir = etiquetas.filter(e => ids.includes(e.id));
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Impressão de Etiquetas</title>
        <style>
          @media print {
            @page { margin: 0; size: 10cm 5cm; }
            body { margin: 0; padding: 0; }
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
          }
          .etiqueta {
            width: 10cm;
            height: 5cm;
            border: 2px solid #000;
            padding: 10px;
            margin-bottom: 10px;
            page-break-after: always;
            box-sizing: border-box;
          }
          .etiqueta:last-child {
            page-break-after: auto;
          }
          .leito {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .dieta {
            font-size: 20px;
            margin-bottom: 8px;
          }
          .obs {
            font-size: 14px;
            margin: 5px 0;
          }
          .rodape {
            font-size: 10px;
            color: #666;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
    `;
    
    etiquetasImprimir.forEach(e => {
      html += `
        <div class="etiqueta">
          <div class="leito">🏥 LEITO: ${e.leito}</div>
          <div class="dieta">🍽️ ${e.dieta}</div>
          ${e.obs1 ? `<div class="obs">📝 ${e.obs1}</div>` : ''}
          ${e.obs2 ? `<div class="obs">📝 ${e.obs2}</div>` : ''}
          ${e.obs3 ? `<div class="obs">📝 ${e.obs3}</div>` : ''}
          <div class="rodape">
            ${new Date().toLocaleString('pt-BR')} | ${e.usuario}
          </div>
        </div>
      `;
    });
    
    html += '</body></html>';
    
    const janela = window.open('', '', 'width=800,height=600');
    janela.document.write(html);
    janela.document.close();
    janela.focus();
    
    setTimeout(() => {
      janela.print();
    }, 250);
  };

  const handleRemover = async (id) => {
    if (!window.confirm('Remover esta etiqueta da fila?')) {
      return;
    }

    try {
      const resposta = await deletarEtiqueta(id);
      
      if (resposta.sucesso) {
        alert('✅ Etiqueta removida!');
        setSelecionadas(selecionadas.filter(i => i !== id));
        carregarFila();
      }
    } catch (erro) {
      console.error('Erro ao remover:', erro);
      alert('❌ Erro ao remover: ' + erro.message);
    }
  };

  return (
    <div className="fila-impressao-container">
      {/* Header */}
      <div className="fila-header">
        <h1>🖨️ Fila de Impressão</h1>
        <button className="btn-voltar" onClick={voltar}>
          ← Voltar
        </button>
      </div>

      {/* Estatísticas */}
      <div className="fila-stats">
        <div className="stat-box">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-label">Na Fila</span>
            <span className="stat-value">{etiquetas.length}</span>
          </div>
        </div>
        <div className="stat-box selected">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-label">Selecionadas</span>
            <span className="stat-value">{selecionadas.length}</span>
          </div>
        </div>
      </div>

      {/* Ações */}
      {etiquetas.length > 0 && (
        <div className="fila-acoes">
          <button 
            className="btn-selecionar-todas"
            onClick={selecionarTodas}
          >
            {selecionadas.length === etiquetas.length ? '☑️ Desmarcar Todas' : '☐ Selecionar Todas'}
          </button>
          
          <button 
            className="btn-atualizar"
            onClick={carregarFila}
            disabled={carregando}
          >
            🔄 Atualizar
          </button>
          
          <button 
            className="btn-imprimir-selecionadas"
            onClick={handleImprimirSelecionadas}
            disabled={selecionadas.length === 0 || imprimindo}
          >
            {imprimindo ? '⏳ Imprimindo...' : `🖨️ Imprimir (${selecionadas.length})`}
          </button>
        </div>
      )}

      {/* Lista de Etiquetas */}
      {carregando && etiquetas.length === 0 ? (
        <div className="loading-fila">
          <div className="loading-spinner"></div>
          <p>Carregando fila...</p>
        </div>
      ) : etiquetas.length === 0 ? (
        <div className="fila-vazia">
          <div className="vazia-icon">📭</div>
          <h3>Fila Vazia</h3>
          <p>Não há etiquetas pendentes para impressão.</p>
          <button className="btn-nova-prescricao" onClick={voltar}>
            ➕ Nova Prescrição
          </button>
        </div>
      ) : (
        <div className="etiquetas-grid">
          {etiquetas.map((etiqueta) => (
            <div 
              key={etiqueta.id} 
              className={`etiqueta-card ${selecionadas.includes(etiqueta.id) ? 'selecionada' : ''}`}
            >
              {/* Checkbox */}
              <div className="card-checkbox">
                <input
                  type="checkbox"
                  checked={selecionadas.includes(etiqueta.id)}
                  onChange={() => toggleSelecao(etiqueta.id)}
                />
              </div>

              {/* Conteúdo */}
              <div className="card-conteudo" onClick={() => toggleSelecao(etiqueta.id)}>
                <div className="card-header">
                  <span className="leito-badge">🏥 Leito {etiqueta.leito}</span>
                  <span className="status-badge pendente">🟡 Pendente</span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="info-label">Dieta:</span>
                    <span className="info-value">{etiqueta.dieta}</span>
                  </div>
                  
                  {etiqueta.obs1 && (
                    <div className="info-row">
                      <span className="info-label">Obs:</span>
                      <span className="info-value">{etiqueta.obs1}</span>
                    </div>
                  )}

                  <div className="info-row meta">
                    <span className="info-meta">
                      👤 {etiqueta.usuario}
                    </span>
                    <span className="info-meta">
                      🕐 {new Date(etiqueta.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="card-acoes">
                <button
                  className="btn-acao imprimir"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImprimirIndividual(etiqueta.id);
                  }}
                  disabled={imprimindo}
                  title="Imprimir"
                >
                  🖨️
                </button>
                <button
                  className="btn-acao remover"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemover(etiqueta.id);
                  }}
                  title="Remover"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilaImpressao;