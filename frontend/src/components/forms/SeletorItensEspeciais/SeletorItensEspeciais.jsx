// frontend/src/components/forms/SeletorItensEspeciais/SeletorItensEspeciais.jsx
import React, { useState, useEffect } from 'react';
import { listarItensRefeicao } from '../../../services/api';
import './SeletorItensEspeciais.css';

function SeletorItensEspeciais({ refeicaoId, itensSelecionados = [], onChange }) {
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [semItens, setSemItens] = useState(false);

  useEffect(() => {
    if (refeicaoId) carregarItens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refeicaoId]);

  const carregarItens = async () => {
    try {
      setCarregando(true);
      const resposta = await listarItensRefeicao(refeicaoId);
      if (resposta.sucesso) {
        setItens(resposta.itens || []);
        setSemItens((resposta.itens || []).length === 0);
      }
    } catch (erro) {
      console.error('Erro ao carregar itens:', erro);
      setSemItens(true);
    } finally {
      setCarregando(false);
    }
  };

  const handleToggle = (itemId) => {
    const novaSelecao = itensSelecionados.includes(itemId)
      ? itensSelecionados.filter(id => id !== itemId)
      : [...itensSelecionados, itemId];
    onChange(novaSelecao);
  };

  const itensFiltrados = itens.filter(item =>
    item.produto.toLowerCase().includes(busca.toLowerCase()) ||
    (item.gramatura && item.gramatura.toLowerCase().includes(busca.toLowerCase()))
  );

  const itensSelecionadosObj = itens.filter(item => itensSelecionados.includes(item.id));

  if (carregando) {
    return (
      <div className="sie-loading">
        <div className="sie-spinner"></div>
        <span>Carregando produtos...</span>
      </div>
    );
  }

  if (semItens) {
    return (
      <div className="sie-sem-itens">
        <span>⚠️</span>
        <p>Nenhum produto importado para esta refeição.</p>
        <small>Um administrador deve importar a planilha em Cadastros → Tipos de Refeição.</small>
      </div>
    );
  }

  return (
    <div className="sie-container">
      {/* Busca */}
      <div className="sie-busca">
        <input
          type="text"
          placeholder="🔍 Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="sie-input-busca"
        />
      </div>

      {/* Lista */}
      <div className="sie-lista">
        {itensFiltrados.length === 0 ? (
          <div className="sie-sem-resultado">
            {busca ? '🔍 Nenhum produto encontrado' : '📭 Lista vazia'}
          </div>
        ) : (
          itensFiltrados.map(item => (
            <label key={item.id} className={`sie-item ${itensSelecionados.includes(item.id) ? 'sie-item-selecionado' : ''}`}>
              <input
                type="checkbox"
                checked={itensSelecionados.includes(item.id)}
                onChange={() => handleToggle(item.id)}
              />
              <div className="sie-item-info">
                <span className="sie-produto">{item.produto}</span>
                {item.gramatura && (
                  <span className="sie-gramatura">{item.gramatura}</span>
                )}
              </div>
            </label>
          ))
        )}
      </div>

      {/* Resumo */}
      {itensSelecionadosObj.length > 0 && (
        <div className="sie-resumo">
          <div className="sie-resumo-header">
            <strong>Selecionados ({itensSelecionadosObj.length}):</strong>
            <button type="button" className="sie-btn-limpar" onClick={() => onChange([])}>
              Limpar tudo
            </button>
          </div>
          <div className="sie-tags">
            {itensSelecionadosObj.map(item => (
              <div key={item.id} className="sie-tag">
                <span>{item.produto}</span>
                {item.gramatura && <span className="sie-tag-gramatura">{item.gramatura}</span>}
                <button type="button" className="sie-tag-remover" onClick={() => handleToggle(item.id)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sie-info-total">{itens.length} produtos disponíveis</div>
    </div>
  );
}

export default SeletorItensEspeciais;