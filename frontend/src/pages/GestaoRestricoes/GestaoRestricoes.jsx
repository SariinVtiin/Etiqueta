// frontend/src/pages/GestaoRestricoes/GestaoRestricoes.jsx
import React, { useState, useEffect } from 'react';
import {
  listarRestricoes,
  criarRestricao,
  atualizarRestricao,
  toggleRestricaoAtiva
} from '../../services/api';
import './GestaoRestricoes.css';

function GestaoRestricoes({ voltar, onRestricoesCriadas }) {
  const [restricoes, setRestricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [restricaoEditando, setRestricaoEditando] = useState(null);
  const [filtro, setFiltro] = useState('ativas'); // 'ativas' ou 'todas'
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ordem: ''
  });

  // Carregar restrições
  useEffect(() => {
    carregarRestricoes();
  }, [filtro]);

  const carregarRestricoes = async () => {
    setCarregando(true);
    try {
      const resposta = await listarRestricoes(filtro === 'todas');
      setRestricoes(resposta.restricoes || []);
    } catch (erro) {
      console.error('Erro ao carregar restrições:', erro);
      alert('Erro ao carregar restrições alimentares');
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalNovo = () => {
    setRestricaoEditando(null);
    setFormData({ nome: '', descricao: '', ordem: '' });
    setMostrarModal(true);
  };

  const abrirModalEditar = (restricao) => {
    setRestricaoEditando(restricao);
    setFormData({
      nome: restricao.nome,
      descricao: restricao.descricao || '',
      ordem: restricao.ordem || ''
    });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setRestricaoEditando(null);
    setFormData({ nome: '', descricao: '', ordem: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      alert('Nome da restrição é obrigatório!');
      return;
    }

    try {
      if (restricaoEditando) {
        // Atualizar
        await atualizarRestricao(restricaoEditando.id, formData);
        alert('Restrição atualizada com sucesso!');
      } else {
        // Criar
        const resposta = await criarRestricao(formData);
        alert('Restrição criada com sucesso!');
        
        // Notificar App.js para atualizar estado global
        if (onRestricoesCriadas) {
          onRestricoesCriadas();
        }
      }

      fecharModal();
      carregarRestricoes();
    } catch (erro) {
      console.error('Erro ao salvar:', erro);
      alert(erro.message || 'Erro ao salvar restrição');
    }
  };

  const handleToggleAtiva = async (restricao) => {
    const novoStatus = !restricao.ativa;
    const confirmacao = window.confirm(
      `Deseja realmente ${novoStatus ? 'ativar' : 'desativar'} a restrição "${restricao.nome}"?`
    );

    if (!confirmacao) return;

    try {
      await toggleRestricaoAtiva(restricao.id, novoStatus);
      alert(`Restrição ${novoStatus ? 'ativada' : 'desativada'} com sucesso!`);
      carregarRestricoes();
      
      // Notificar App.js para atualizar estado global
      if (onRestricoesCriadas) {
        onRestricoesCriadas();
      }
    } catch (erro) {
      console.error('Erro ao alterar status:', erro);
      alert(erro.message || 'Erro ao alterar status');
    }
  };

  if (carregando) {
    return (
      <div className="gr-container">
        <div className="gr-header">
          <h1>🍽️ Restrições Alimentares</h1>
          <button className="gr-btn-voltar" onClick={voltar}>
            ← Voltar
          </button>
        </div>
        <div className="gr-carregando">⏳ Carregando...</div>
      </div>
    );
  }

  return (
    <div className="gr-container">
      <div className="gr-header">
        <h1>🍽️ Restrições Alimentares</h1>
        <button className="gr-btn-voltar" onClick={voltar}>
          ← Voltar
        </button>
      </div>

      <div className="gr-acoes">
        <button className="gr-btn-novo" onClick={abrirModalNovo}>
          + Nova Restrição
        </button>

        <div className="gr-filtros">
          <label>
            <input
              type="radio"
              value="ativas"
              checked={filtro === 'ativas'}
              onChange={(e) => setFiltro(e.target.value)}
            />
            Apenas Ativas
          </label>
          <label>
            <input
              type="radio"
              value="todas"
              checked={filtro === 'todas'}
              onChange={(e) => setFiltro(e.target.value)}
            />
            Todas
          </label>
        </div>
      </div>

      {restricoes.length === 0 ? (
        <div className="gr-vazio">
          <p>📭 Nenhuma restrição cadastrada</p>
          <button className="gr-btn-novo" onClick={abrirModalNovo}>
            + Cadastrar Primeira Restrição
          </button>
        </div>
      ) : (
        <div className="gr-tabela-container">
          <table className="gr-tabela">
            <thead>
              <tr>
                <th>Ordem</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {restricoes.map((restricao) => (
                <tr key={restricao.id} className={!restricao.ativa ? 'gr-inativa' : ''}>
                  <td>{restricao.ordem}</td>
                  <td className="gr-nome">{restricao.nome}</td>
                  <td className="gr-descricao">{restricao.descricao || '-'}</td>
                  <td>
                    <span className={`gr-status ${restricao.ativa ? 'ativa' : 'inativa'}`}>
                      {restricao.ativa ? '✓ Ativa' : '✗ Inativa'}
                    </span>
                  </td>
                  <td>
                    <div className="gr-acoes-linha">
                      <button
                        className="gr-btn-editar"
                        onClick={() => abrirModalEditar(restricao)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={`gr-btn-toggle ${restricao.ativa ? 'desativar' : 'ativar'}`}
                        onClick={() => handleToggleAtiva(restricao)}
                        title={restricao.ativa ? 'Desativar' : 'Ativar'}
                      >
                        {restricao.ativa ? '🔴' : '🟢'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Criação/Edição */}
      {mostrarModal && (
        <div className="gr-modal-overlay" onClick={fecharModal}>
          <div className="gr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gr-modal-header">
              <h2>{restricaoEditando ? '✏️ Editar Restrição' : '➕ Nova Restrição'}</h2>
              <button className="gr-modal-fechar" onClick={fecharModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="gr-modal-form">
              <div className="gr-campo">
                <label>Nome da Restrição *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: HPS, DM, IRC..."
                  maxLength={100}
                  required
                />
              </div>

              <div className="gr-campo">
                <label>Descrição (opcional)</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Hiposódica, Diabetes Mellitus..."
                  rows={3}
                />
              </div>

              <div className="gr-campo">
                <label>Ordem de Exibição (opcional)</label>
                <input
                  type="number"
                  value={formData.ordem}
                  onChange={(e) => setFormData({ ...formData, ordem: e.target.value })}
                  placeholder="Ex: 1, 2, 3..."
                  min={0}
                />
                <small>Menor número aparece primeiro na lista</small>
              </div>

              <div className="gr-modal-acoes">
                <button type="button" className="gr-btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="gr-btn-salvar">
                  {restricaoEditando ? 'Salvar Alterações' : 'Criar Restrição'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoRestricoes;