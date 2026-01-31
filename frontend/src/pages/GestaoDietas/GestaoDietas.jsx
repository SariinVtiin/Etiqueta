import React, { useState, useEffect } from 'react';
import { listarDietas, criarDieta, atualizarDieta, toggleDietaAtiva } from '../../services/api';
import './GestaoDietas.css';

function GestaoDietas({ voltar }) {
  const [dietas, setDietas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('todos'); // todos, ativos, inativos
  const [modalAberto, setModalAberto] = useState(null); // 'criar', 'editar', null
  const [dietaSelecionada, setDietaSelecionada] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    descricao: ''
  });

  useEffect(() => {
    carregarDietas();
  }, []);

  const carregarDietas = async () => {
    try {
      setCarregando(true);
      const resposta = await listarDietas();
      if (resposta.sucesso) {
        setDietas(resposta.dietas);
      }
    } catch (erro) {
      console.error('Erro ao carregar dietas:', erro);
      alert('❌ Erro ao carregar dietas: ' + erro.message);
    } finally {
      setCarregando(false);
    }
  };

  const dietasFiltradas = dietas.filter(dieta => {
    // Filtro de busca
    const passaBusca = busca === '' || 
      dieta.nome.toLowerCase().includes(busca.toLowerCase()) ||
      dieta.codigo.toLowerCase().includes(busca.toLowerCase()) ||
      (dieta.descricao && dieta.descricao.toLowerCase().includes(busca.toLowerCase()));

    // Filtro de status
    const passaStatus = 
      filtroAtivo === 'todos' ||
      (filtroAtivo === 'ativos' && dieta.ativa) ||
      (filtroAtivo === 'inativos' && !dieta.ativa);

    return passaBusca && passaStatus;
  });

  const abrirModalCriar = () => {
    setFormData({ nome: '', codigo: '', descricao: '' });
    setModalAberto('criar');
  };

  const abrirModalEditar = (dieta) => {
    setDietaSelecionada(dieta);
    setFormData({
      nome: dieta.nome,
      codigo: dieta.codigo,
      descricao: dieta.descricao || ''
    });
    setModalAberto('editar');
  };

  const fecharModal = () => {
    setModalAberto(null);
    setDietaSelecionada(null);
    setFormData({ nome: '', codigo: '', descricao: '' });
  };

  const handleCriarDieta = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.codigo) {
      alert('⚠️ Nome e código são obrigatórios!');
      return;
    }

    try {
      const resposta = await criarDieta(formData);
      if (resposta.sucesso) {
        alert('✅ ' + resposta.mensagem);
        fecharModal();
        carregarDietas();
      }
    } catch (erro) {
      alert('❌ Erro ao criar dieta: ' + erro.message);
    }
  };

  const handleEditarDieta = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.codigo) {
      alert('⚠️ Nome e código são obrigatórios!');
      return;
    }

    try {
      const resposta = await atualizarDieta(dietaSelecionada.id, formData);
      if (resposta.sucesso) {
        alert('✅ ' + resposta.mensagem);
        fecharModal();
        carregarDietas();
      }
    } catch (erro) {
      alert('❌ Erro ao editar dieta: ' + erro.message);
    }
  };

  const handleToggleAtivo = async (dieta) => {
    const acao = dieta.ativa ? 'desativar' : 'ativar';
    
    if (!window.confirm(`Tem certeza que deseja ${acao} a dieta "${dieta.nome}"?`)) {
      return;
    }

    try {
      const resposta = await toggleDietaAtiva(dieta.id, !dieta.ativa);
      if (resposta.sucesso) {
        alert('✅ ' + resposta.mensagem);
        carregarDietas();
      }
    } catch (erro) {
      alert(`❌ Erro ao ${acao} dieta: ` + erro.message);
    }
  };

  const estatisticas = {
    total: dietas.length,
    ativas: dietas.filter(d => d.ativa).length,
    inativas: dietas.filter(d => !d.ativa).length
  };

  return (
    <div className="gestao-dietas-container">
      <div className="gestao-header">
        <h1>🍽️ Gestão de Dietas</h1>
        <button className="btn-voltar" onClick={voltar}>
          ← Voltar
        </button>
      </div>

      {/* Estatísticas */}
      <div className="dietas-stats">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-label">Total</span>
            <span className="stat-value">{estatisticas.total}</span>
          </div>
        </div>
        <div className="stat-card ativas">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-label">Ativas</span>
            <span className="stat-value">{estatisticas.ativas}</span>
          </div>
        </div>
        <div className="stat-card inativas">
          <div className="stat-icon">🚫</div>
          <div className="stat-info">
            <span className="stat-label">Inativas</span>
            <span className="stat-value">{estatisticas.inativas}</span>
          </div>
        </div>
      </div>

      {/* Barra de ações */}
      <div className="dietas-acoes">
        <div className="busca-filtros">
          <input
            type="text"
            placeholder="🔍 Buscar por nome, código ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-busca"
          />
          <div className="filtros-status">
            <button 
              className={`btn-filtro ${filtroAtivo === 'todos' ? 'ativo' : ''}`}
              onClick={() => setFiltroAtivo('todos')}
            >
              Todos
            </button>
            <button 
              className={`btn-filtro ${filtroAtivo === 'ativos' ? 'ativo' : ''}`}
              onClick={() => setFiltroAtivo('ativos')}
            >
              Ativos
            </button>
            <button 
              className={`btn-filtro ${filtroAtivo === 'inativos' ? 'ativo' : ''}`}
              onClick={() => setFiltroAtivo('inativos')}
            >
              Inativos
            </button>
          </div>
        </div>
        <button className="btn-criar-dieta" onClick={abrirModalCriar}>
          ➕ Nova Dieta
        </button>
      </div>

      {/* Lista de dietas */}
      {carregando ? (
        <div className="loading-dietas">
          <div className="loading-spinner"></div>
          <p>Carregando dietas...</p>
        </div>
      ) : dietasFiltradas.length === 0 ? (
        <div className="sem-dietas">
          <h3>📭 Nenhuma dieta encontrada</h3>
          <p>
            {busca || filtroAtivo !== 'todos' 
              ? 'Tente ajustar os filtros de busca.' 
              : 'Crie a primeira dieta clicando no botão acima.'}
          </p>
        </div>
      ) : (
        <div className="dietas-grid">
          {dietasFiltradas.map((dieta) => (
            <div 
              key={dieta.id} 
              className={`dieta-card ${!dieta.ativa ? 'inativa' : ''}`}
            >
              <div className="dieta-header">
                <div className="dieta-titulo">
                  <h3>{dieta.nome}</h3>
                  <span className="dieta-codigo">#{dieta.codigo}</span>
                </div>
                <span className={`badge-status ${dieta.ativa ? 'ativo' : 'inativo'}`}>
                  {dieta.ativa ? '✅ Ativa' : '🚫 Inativa'}
                </span>
              </div>
              
              {dieta.descricao && (
                <p className="dieta-descricao">{dieta.descricao}</p>
              )}
              
              <div className="dieta-acoes">
                <button
                  className="btn-acao editar"
                  onClick={() => abrirModalEditar(dieta)}
                  title="Editar"
                >
                  ✏️ Editar
                </button>
                <button
                  className={`btn-acao ${dieta.ativa ? 'desativar' : 'ativar'}`}
                  onClick={() => handleToggleAtivo(dieta)}
                  title={dieta.ativa ? 'Desativar' : 'Ativar'}
                >
                  {dieta.ativa ? '🚫 Desativar' : '✅ Ativar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Criar Dieta */}
      {modalAberto === 'criar' && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>➕ Nova Dieta</h2>
            <form onSubmit={handleCriarDieta}>
              <div className="form-group">
                <label>Nome da Dieta *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Dieta Geral"
                />
              </div>
              <div className="form-group">
                <label>Código *</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ex: DG"
                  maxLength="20"
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição detalhada da dieta (opcional)"
                  rows="3"
                />
              </div>
              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  Criar Dieta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Dieta */}
      {modalAberto === 'editar' && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>✏️ Editar Dieta</h2>
            <form onSubmit={handleEditarDieta}>
              <div className="form-group">
                <label>Nome da Dieta *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Código *</label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  maxLength="20"
                />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirmar">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoDietas;