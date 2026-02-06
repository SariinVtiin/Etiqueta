// frontend/src/components/forms/SeletorAcrescimos.jsx
import React, { useState, useEffect } from 'react';
import { listarAcrescimos } from '../../services/api';
import './SeletorAcrescimos.css';

function SeletorAcrescimos({ acrescimosSelecionados = [], onChange, refeicao }) {
  const [acrescimos, setAcrescimos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarAcrescimos();
  }, []);

  const carregarAcrescimos = async () => {
    try {
      setCarregando(true);
      const resposta = await listarAcrescimos();
      if (resposta.sucesso) {
        setAcrescimos(resposta.acrescimos);
      }
    } catch (erro) {
      console.error('Erro ao carregar acréscimos:', erro);
      alert('Erro ao carregar lista de acréscimos');
    } finally {
      setCarregando(false);
    }
  };

  const handleToggle = (acrescimoId) => {
    const novaSelecao = acrescimosSelecionados.includes(acrescimoId)
      ? acrescimosSelecionados.filter(id => id !== acrescimoId)
      : [...acrescimosSelecionados, acrescimoId];
    
    onChange(novaSelecao);
  };

  const acrescimosFiltrados = acrescimos.filter(item =>
    item.nome_item.toLowerCase().includes(busca.toLowerCase())
  );

  const itensSelecionados = acrescimos.filter(item => 
    acrescimosSelecionados.includes(item.id)
  );

  if (carregando) {
    return (
      <div className="seletor-acrescimos-loading">
        <div className="spinner"></div>
        <span>Carregando acréscimos...</span>
      </div>
    );
  }

  return (
    <div className="seletor-acrescimos">
      {/* Busca */}
      <div className="seletor-busca">
        <input
          type="text"
          placeholder="🔍 Buscar item..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-busca-acrescimo"
        />
      </div>

      {/* Lista de acréscimos */}
      <div className="lista-acrescimos">
        {acrescimosFiltrados.length === 0 ? (
          <div className="sem-resultados">
            {busca ? '🔍 Nenhum item encontrado' : '📭 Nenhum acréscimo disponível'}
          </div>
        ) : (
          acrescimosFiltrados.map(item => {
            return (
              <label key={item.id} className="acrescimo-item">
                <input
                  type="checkbox"
                  checked={acrescimosSelecionados.includes(item.id)}
                  onChange={() => handleToggle(item.id)}
                />
                <span className="acrescimo-nome">
                  {item.nome_item}
                  {item.tipo_medida && item.quantidade_referencia && (
                    <span className="acrescimo-medida">
                      ({item.tipo_medida} {item.quantidade_referencia})
                    </span>
                  )}
                </span>
                {/* ← REMOVIDO: Não mostra mais o valor */}
              </label>
            );
          })
        )}
      </div>

      {/* Resumo da seleção */}
      {itensSelecionados.length > 0 && (
        <div className="resumo-selecao">
          <div className="resumo-header">
            <strong>Selecionados ({itensSelecionados.length}):</strong>
            <button
              type="button"
              className="btn-limpar"
              onClick={() => onChange([])}
            >
              Limpar tudo
            </button>
          </div>
          <div className="itens-selecionados">
            {itensSelecionados.map(item => (
              <div key={item.id} className="item-selecionado">
                <span>{item.nome_item}</span>
                <button
                  type="button"
                  className="btn-remover"
                  onClick={() => handleToggle(item.id)}
                  title="Remover"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {acrescimos.length > 0 && (
        <div className="info-total">
          {acrescimos.length} itens disponíveis
        </div>
      )}
    </div>
  );
}

export default SeletorAcrescimos;