// frontend/src/pages/GestaoRefeicoes/GestaoRefeicoes.jsx
// VERSÃO COMPLETA com suporte a listas personalizadas + import Excel
import React, { useState, useEffect } from 'react';
import {
  listarRefeicoes,
  criarRefeicao,
  atualizarRefeicao,
  toggleRefeicaoAtiva,
  toggleListaPersonalizada,
  importarItensRefeicao,
  buscarEstatisticasItensRefeicao
} from '../../services/api';
import './GestaoRefeicoes.css';

function GestaoRefeicoes({ voltar, onRefeicoesCriadas }) {
  const [refeicoes, setRefeicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [refeicaoEditando, setRefeicaoEditando] = useState(null);
  const [filtro, setFiltro] = useState('ativas');

  // Modal de importação
  const [modalImport, setModalImport] = useState(null); // { refeicao }
  const [arquivoImport, setArquivoImport] = useState(null);
  const [importando, setImportando] = useState(false);
  const [resultadoImport, setResultadoImport] = useState(null);
  const [estatisticas, setEstatisticas] = useState({}); // { [refeicaoId]: stats }

  const [formData, setFormData] = useState({ nome: '', descricao: '', ordem: '' });

  useEffect(() => {
    carregarRefeicoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro]);

  const carregarRefeicoes = async () => {
    setCarregando(true);
    try {
      const resposta = await listarRefeicoes(filtro === 'todas');
      const lista = resposta.refeicoes || [];
      setRefeicoes(lista);

      // Buscar estatísticas para refeições especiais
      const especiais = lista.filter(r => r.tem_lista_personalizada);
      const statsMap = {};
      await Promise.all(especiais.map(async (r) => {
        try {
          const st = await buscarEstatisticasItensRefeicao(r.id);
          if (st.sucesso) statsMap[r.id] = st.estatisticas;
        } catch (_) {}
      }));
      setEstatisticas(statsMap);
    } catch (erro) {
      console.error('Erro ao carregar refeições:', erro);
      alert('Erro ao carregar tipos de refeição');
    } finally {
      setCarregando(false);
    }
  };

  const notificarApp = () => { if (onRefeicoesCriadas) onRefeicoesCriadas(); };

  // ─── Modal CRUD ───────────────────────────────────────
  const abrirModalNovo = () => {
    setRefeicaoEditando(null);
    setFormData({ nome: '', descricao: '', ordem: '' });
    setMostrarModal(true);
  };

  const abrirModalEditar = (r) => {
    setRefeicaoEditando(r);
    setFormData({ nome: r.nome, descricao: r.descricao || '', ordem: r.ordem || '' });
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    setRefeicaoEditando(null);
    setFormData({ nome: '', descricao: '', ordem: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) { alert('Nome é obrigatório!'); return; }
    try {
      if (refeicaoEditando) {
        await atualizarRefeicao(refeicaoEditando.id, formData);
        alert('Refeição atualizada com sucesso!');
      } else {
        await criarRefeicao(formData);
        alert('Refeição criada com sucesso!');
      }
      notificarApp();
      fecharModal();
      carregarRefeicoes();
    } catch (erro) {
      alert(erro.message || 'Erro ao salvar');
    }
  };

  const handleToggleAtiva = async (r) => {
    const novoStatus = !r.ativa;
    if (!window.confirm(`Deseja ${novoStatus ? 'ativar' : 'desativar'} "${r.nome}"?`)) return;
    try {
      await toggleRefeicaoAtiva(r.id, novoStatus);
      notificarApp();
      carregarRefeicoes();
    } catch (erro) { alert(erro.message); }
  };

  const handleToggleLista = async (r) => {
    const novoStatus = !r.tem_lista_personalizada;

    if (novoStatus) {
      if (!window.confirm(
        `Ativar lista personalizada para "${r.nome}"?\n\nIsso vai substituir as opções padrão (Dieta, Restrições, etc.) por uma lista de produtos importada via planilha Excel.`
      )) return;
    } else {
      if (!window.confirm(
        `Desativar lista personalizada de "${r.nome}"?\n\nAs opções padrão voltarão a aparecer nas prescrições.`
      )) return;
    }

    try {
      await toggleListaPersonalizada(r.id, novoStatus);
      notificarApp();
      carregarRefeicoes();
    } catch (erro) { alert(erro.message); }
  };

  // ─── Modal IMPORTAÇÃO ─────────────────────────────────
  const abrirModalImport = (r) => {
    setModalImport(r);
    setArquivoImport(null);
    setResultadoImport(null);
  };

  const fecharModalImport = () => {
    setModalImport(null);
    setArquivoImport(null);
    setResultadoImport(null);
    setImportando(false);
  };

  const handleImportar = async () => {
    if (!arquivoImport) { alert('Selecione um arquivo!'); return; }
    setImportando(true);
    setResultadoImport(null);
    try {
      const resposta = await importarItensRefeicao(modalImport.id, arquivoImport);
      setResultadoImport({ tipo: 'sucesso', mensagem: resposta.mensagem, detalhes: resposta.detalhes });
      notificarApp();
      carregarRefeicoes();
    } catch (erro) {
      setResultadoImport({ tipo: 'erro', mensagem: erro.message });
    } finally {
      setImportando(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return 'Nunca';
    return new Date(data).toLocaleString('pt-BR');
  };

  // ─── RENDER ───────────────────────────────────────────
  return (
    <div className="gr-container">
      {/* HEADER */}
      <div className="gr-header">
        <div className="gr-header-left">
          <button className="gr-btn-voltar" onClick={voltar}>← Voltar</button>
          <div>
            <h1 className="gr-titulo">🍽️ Tipos de Refeição</h1>
            <p className="gr-subtitulo">Gerencie as refeições e configure listas personalizadas</p>
          </div>
        </div>
        <button className="gr-btn-novo" onClick={abrirModalNovo}>+ Nova Refeição</button>
      </div>

      {/* FILTROS */}
      <div className="gr-filtros">
        <button className={`gr-filtro-btn ${filtro === 'ativas' ? 'ativo' : ''}`} onClick={() => setFiltro('ativas')}>Ativas</button>
        <button className={`gr-filtro-btn ${filtro === 'todas' ? 'ativo' : ''}`} onClick={() => setFiltro('todas')}>Todas</button>
      </div>

      {/* LEGENDA */}
      <div className="gr-legenda">
        <span className="gr-legenda-item"><span className="gr-badge-normal">Padrão</span> opções normais (Dieta, Restrições, etc.)</span>
        <span className="gr-legenda-item"><span className="gr-badge-especial">Lista ✦</span> substitui tudo por produtos importados</span>
      </div>

      {/* LISTA */}
      <div className="gr-lista">
        {carregando ? (
          <div className="gr-loading">Carregando...</div>
        ) : refeicoes.length === 0 ? (
          <div className="gr-vazio">
            <p>Nenhuma refeição encontrada.</p>
            <button className="gr-btn-novo" onClick={abrirModalNovo}>+ Criar primeira refeição</button>
          </div>
        ) : (
          refeicoes.map((r) => (
            <div key={r.id} className={`gr-item ${!r.ativa ? 'gr-item-inativa' : ''} ${r.tem_lista_personalizada ? 'gr-item-especial' : ''}`}>
              <div className="gr-item-info">
                <div className="gr-item-nome">
                  {r.nome}
                  {r.tem_lista_personalizada && <span className="gr-badge-especial">Lista ✦</span>}
                  {!r.ativa && <span className="gr-badge-inativa">Inativa</span>}
                </div>
                {r.descricao && <div className="gr-item-descricao">{r.descricao}</div>}
                <div className="gr-item-meta">
                  <span>Ordem: {r.ordem}</span>
                  {r.tem_lista_personalizada && estatisticas[r.id] && (
                    <span className="gr-item-stats">
                      • {estatisticas[r.id].total_ativos || 0} produtos •{' '}
                      Última importação: {formatarData(estatisticas[r.id].ultima_importacao)}
                    </span>
                  )}
                </div>
              </div>

              <div className="gr-item-acoes">
                {/* Toggle lista personalizada */}
                <button
                  className={`gr-btn-lista ${r.tem_lista_personalizada ? 'lista-ativa' : 'lista-inativa'}`}
                  onClick={() => handleToggleLista(r)}
                  title={r.tem_lista_personalizada ? 'Desativar lista personalizada' : 'Ativar lista personalizada'}
                >
                  {r.tem_lista_personalizada ? '📋 Lista ON' : '📋 Lista OFF'}
                </button>

                {/* Botão importar (só se lista ativa) */}
                {r.tem_lista_personalizada && (
                  <button
                    className="gr-btn-importar"
                    onClick={() => abrirModalImport(r)}
                    title="Importar planilha de produtos"
                  >
                    📥 Importar
                  </button>
                )}

                <button className="gr-btn-editar" onClick={() => abrirModalEditar(r)}>✏️ Editar</button>
                <button
                  className={`gr-btn-toggle ${r.ativa ? 'desativar' : 'ativar'}`}
                  onClick={() => handleToggleAtiva(r)}
                >
                  {r.ativa ? '🔴 Desativar' : '🟢 Ativar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ─── MODAL CRUD ─────────────────────────────────── */}
      {mostrarModal && (
        <div className="gr-overlay" onClick={fecharModal}>
          <div className="gr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gr-modal-header">
              <h2>{refeicaoEditando ? 'Editar Refeição' : 'Nova Refeição'}</h2>
              <button className="gr-modal-fechar" onClick={fecharModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="gr-modal-form">
              <div className="gr-campo">
                <label>Nome *</label>
                <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Ex: Desjejum, Form. Enteral..." autoFocus />
              </div>
              <div className="gr-campo">
                <label>Descrição</label>
                <input type="text" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} placeholder="Opcional" />
              </div>
              <div className="gr-campo">
                <label>Ordem de exibição</label>
                <input type="number" value={formData.ordem} onChange={(e) => setFormData({ ...formData, ordem: e.target.value })} placeholder="Ex: 1, 2, 3..." min="1" />
              </div>
              <div className="gr-modal-acoes">
                <button type="button" className="gr-btn-cancelar" onClick={fecharModal}>Cancelar</button>
                <button type="submit" className="gr-btn-salvar">{refeicaoEditando ? 'Salvar Alterações' : 'Criar Refeição'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL IMPORTAÇÃO ───────────────────────────── */}
      {modalImport && (
        <div className="gr-overlay" onClick={fecharModalImport}>
          <div className="gr-modal gr-modal-import" onClick={(e) => e.stopPropagation()}>
            <div className="gr-modal-header gr-modal-header-import">
              <div>
                <h2>📥 Importar Planilha</h2>
                <p className="gr-modal-subtitulo">{modalImport.nome}</p>
              </div>
              <button className="gr-modal-fechar" onClick={fecharModalImport}>✕</button>
            </div>

            <div className="gr-modal-body">
              {/* Estatísticas atuais */}
              {estatisticas[modalImport.id] && (
                <div className="gr-stats-box">
                  <div className="gr-stat">
                    <span className="gr-stat-label">Produtos ativos</span>
                    <span className="gr-stat-valor">{estatisticas[modalImport.id].total_ativos || 0}</span>
                  </div>
                  <div className="gr-stat">
                    <span className="gr-stat-label">Versões importadas</span>
                    <span className="gr-stat-valor">{estatisticas[modalImport.id].total_versoes || 0}</span>
                  </div>
                  <div className="gr-stat">
                    <span className="gr-stat-label">Última importação</span>
                    <span className="gr-stat-valor gr-stat-data">{formatarData(estatisticas[modalImport.id].ultima_importacao)}</span>
                  </div>
                </div>
              )}

              {/* Upload */}
              <div className="gr-upload-area">
                <label className="gr-file-label">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => { setArquivoImport(e.target.files[0]); setResultadoImport(null); }}
                    disabled={importando}
                    className="gr-file-input"
                  />
                  <span className="gr-file-btn">📁 Selecionar planilha (.xlsx)</span>
                </label>
                {arquivoImport && (
                  <div className="gr-arquivo-info">
                    <span>📄 {arquivoImport.name}</span>
                    <span className="gr-arquivo-size">({(arquivoImport.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>

              {/* Botão importar */}
              <button
                className="gr-btn-importar-exec"
                onClick={handleImportar}
                disabled={!arquivoImport || importando}
              >
                {importando ? '⏳ Importando...' : '📥 Importar Planilha'}
              </button>

              {/* Resultado */}
              {resultadoImport && (
                <div className={`gr-resultado ${resultadoImport.tipo}`}>
                  <strong>{resultadoImport.tipo === 'sucesso' ? '✅' : '❌'} {resultadoImport.mensagem}</strong>
                  {resultadoImport.detalhes && (
                    <div className="gr-resultado-detalhes">
                      <p>• Produtos importados: {resultadoImport.detalhes.total_importado}</p>
                      <p>• Arquivo: {resultadoImport.detalhes.arquivo}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Instruções */}
              <div className="gr-instrucoes">
                <h4>📋 Formato da planilha</h4>
                <p>A planilha deve ter as colunas (maiúsculas ou minúsculas):</p>
                <div className="gr-colunas">
                  <span className="gr-coluna obrig">PRODUTO <small>obrigatório</small></span>
                  <span className="gr-coluna">GRAMATURA <small>opcional</small></span>
                  <span className="gr-coluna">VALOR <small>opcional</small></span>
                </div>
                <p className="gr-aviso">⚠️ A importação cria uma nova versão. O histórico de prescrições anteriores é preservado.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestaoRefeicoes;