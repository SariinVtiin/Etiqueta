// frontend/src/pages/Prescricoes/Prescricoes.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { listarPrescricoes, deletarPrescricao, atualizarPrescricao } from '../../services/api';
import { exportarParaExcel, exportarParaPDF, exportarRelatorioDetalhado } from '../../services/relatorios';
import ModalEditarPrescricao from '../../components/forms/ModalEditarPrescricao';
import './Prescricoes.css';

// Ícones SVG
const Icons = {
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  building: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>
    </svg>
  ),
  utensils: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
      <path d="M7 2v20"/>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  fileSpreadsheet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="16" y2="17"/>
      <line x1="10" y1="9" x2="10" y2="9"/>
    </svg>
  ),
  filePdf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  fileText: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <line x1="10" y1="9" x2="8" y2="9"/>
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  chevronLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  clipboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  inbox: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  ),
  alertCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  bed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16"/>
      <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
      <path d="M2 17h20"/>
      <path d="M6 8v9"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
};

function Prescricoes({ voltar, nucleos, dietas }) {
  const [prescricoes, setPrescricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const [filtros, setFiltros] = useState({
    busca: '',
    dataInicio: '',
    dataFim: '',
    setor: '',
    dieta: ''
  });

  const [paginacao, setPaginacao] = useState({
    pagina: 1,
    limite: 20,
    total: 0,
    totalPaginas: 0
  });

  const [linhaExpandida, setLinhaExpandida] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [prescricaoEditando, setPrescricaoEditando] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const carregarPrescricoes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');

      const params = {
        ...filtros,
        page: paginacao.pagina,
        limit: paginacao.limite
      };

      const resposta = await listarPrescricoes(params);

      if (resposta.sucesso) {
        const prescricoesFormatadas = resposta.prescricoes.map(p => ({
          ...p,
          restricoes: p.restricoes ? JSON.parse(p.restricoes) : []
        }));

        setPrescricoes(prescricoesFormatadas);
        setPaginacao(prev => ({
          ...prev,
          total: resposta.paginacao.total,
          totalPaginas: resposta.paginacao.totalPaginas
        }));
      }
    } catch (erro) {
      console.error('Erro ao carregar prescrições:', erro);
      setErro('Erro ao carregar prescrições. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [filtros, paginacao.pagina, paginacao.limite]);

  useEffect(() => {
    carregarPrescricoes();
  }, [carregarPrescricoes]);

  const aplicarFiltros = () => {
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
    carregarPrescricoes();
  };

  const limparFiltros = () => {
    setFiltros({
      busca: '',
      dataInicio: '',
      dataFim: '',
      setor: '',
      dieta: ''
    });
    setPaginacao(prev => ({ ...prev, pagina: 1 }));
    setTimeout(() => carregarPrescricoes(), 100);
  };

  const toggleExpandir = (id) => {
    setLinhaExpandida(linhaExpandida === id ? null : id);
  };

  const paginaAnterior = () => {
    if (paginacao.pagina > 1) {
      setPaginacao(prev => ({ ...prev, pagina: prev.pagina - 1 }));
    }
  };

  const proximaPagina = () => {
    if (paginacao.pagina < paginacao.totalPaginas) {
      setPaginacao(prev => ({ ...prev, pagina: prev.pagina + 1 }));
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta prescrição?')) {
      return;
    }

    try {
      const resposta = await deletarPrescricao(id);
      
      if (resposta.sucesso) {
        alert('Prescrição excluída com sucesso!');
        carregarPrescricoes();
      }
    } catch (erro) {
      console.error('Erro ao excluir:', erro);
      alert(`Erro ao excluir prescrição: ${erro.message}`);
    }
  };

  const handleEditar = (id) => {
    const prescricao = prescricoes.find(p => p.id === id);
    if (prescricao) {
      setPrescricaoEditando(prescricao);
      setModalEdicaoAberto(true);
    }
  };

  const handleSalvarEdicao = async (id, dadosAtualizados) => {
    try {
      const resposta = await atualizarPrescricao(id, dadosAtualizados);
      
      if (resposta.sucesso) {
        alert('Prescrição atualizada com sucesso!');
        setModalEdicaoAberto(false);
        setPrescricaoEditando(null);
        carregarPrescricoes();
      }
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
      alert(`Erro ao atualizar prescrição: ${erro.message}`);
    }
  };

  const handleCancelarEdicao = () => {
    setModalEdicaoAberto(false);
    setPrescricaoEditando(null);
  };

  const handleExportarExcel = () => {
    if (prescricoes.length === 0) {
      alert('Não há prescrições para exportar.');
      return;
    }

    const resultado = exportarParaExcel(prescricoes, filtros);
    if (resultado.sucesso) {
      alert(resultado.mensagem);
    } else {
      alert(resultado.erro);
    }
  };

  const handleExportarPDF = () => {
    if (prescricoes.length === 0) {
      alert('Não há prescrições para exportar.');
      return;
    }

    const resultado = exportarParaPDF(prescricoes, filtros);
    if (resultado.sucesso) {
      alert(resultado.mensagem);
    } else {
      alert(resultado.erro);
    }
  };

  const handleExportarDetalhado = () => {
    if (prescricoes.length === 0) {
      alert('Não há prescrições para exportar.');
      return;
    }

    const resultado = exportarRelatorioDetalhado(prescricoes);
    if (resultado.sucesso) {
      alert(resultado.mensagem);
    } else {
      alert(resultado.erro);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const formatarHora = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`prescricoes-page ${mounted ? 'mounted' : ''}`}>
      {/* Header */}
      <header className="prescricoes-header">
        <div className="header-left">
          <button className="btn-voltar" onClick={voltar}>
            {Icons.arrowLeft}
            <span>Voltar</span>
          </button>
          <div className="header-title">
            <div className="title-icon">{Icons.clipboard}</div>
            <div>
              <h1>Prescrições</h1>
              <p>Gerencie todas as prescrições de alimentação</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros */}
      <section className="filtros-section">
        <div className="filtros-header">
          <div className="filtros-title">
            {Icons.filter}
            <span>Filtros</span>
          </div>
          <button className="btn-limpar" onClick={limparFiltros}>
            {Icons.x}
            <span>Limpar</span>
          </button>
        </div>
        
        <div className="filtros-grid">
          <div className="filtro-group">
            <label>
              {Icons.search}
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nome, CPF ou Leito..."
              value={filtros.busca}
              onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
            />
          </div>

          <div className="filtro-group">
            <label>
              {Icons.calendar}
              Data Início
            </label>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
            />
          </div>

          <div className="filtro-group">
            <label>
              {Icons.calendar}
              Data Fim
            </label>
            <input
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
            />
          </div>

          <div className="filtro-group">
            <label>
              {Icons.building}
              Setor
            </label>
            <select
              value={filtros.setor}
              onChange={(e) => setFiltros({ ...filtros, setor: e.target.value })}
            >
              <option value="">Todos os setores</option>
              {Object.keys(nucleos).map(setor => (
                <option key={setor} value={setor}>{setor}</option>
              ))}
            </select>
          </div>

          <div className="filtro-group">
            <label>
              {Icons.utensils}
              Dieta
            </label>
            <select
              value={filtros.dieta}
              onChange={(e) => setFiltros({ ...filtros, dieta: e.target.value })}
            >
              <option value="">Todas as dietas</option>
              {dietas.map(d => (
                <option key={d.id} value={d.nome}>{d.nome}</option>
              ))}
            </select>
          </div>

          <div className="filtro-action">
            <button className="btn-filtrar" onClick={aplicarFiltros}>
              {Icons.search}
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* Barra de Ações */}
      {!carregando && prescricoes.length > 0 && (
        <section className="acoes-section">
          <div className="acoes-info">
            <span className="total-badge">{paginacao.total}</span>
            <span>prescrições encontradas</span>
          </div>
          <div className="acoes-botoes">
            <button className="btn-exportar btn-excel" onClick={handleExportarExcel}>
              {Icons.fileSpreadsheet}
              <span>Excel</span>
            </button>
            <button className="btn-exportar btn-pdf" onClick={handleExportarPDF}>
              {Icons.filePdf}
              <span>PDF</span>
            </button>
            <button className="btn-exportar btn-detalhado" onClick={handleExportarDetalhado}>
              {Icons.fileText}
              <span>Detalhado</span>
            </button>
          </div>
        </section>
      )}

      {/* Erro */}
      {erro && (
        <div className="erro-mensagem">
          {Icons.alertCircle}
          <span>{erro}</span>
        </div>
      )}

      {/* Conteúdo Principal */}
      {carregando ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando prescrições...</p>
        </div>
      ) : prescricoes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{Icons.inbox}</div>
          <h3>Nenhuma prescrição encontrada</h3>
          <p>Tente ajustar os filtros ou criar uma nova prescrição</p>
        </div>
      ) : (
        <>
          {/* Tabela */}
          <section className="tabela-section">
            <div className="tabela-wrapper">
              <table className="tabela-prescricoes">
                <thead>
                  <tr>
                    <th className="col-expand"></th>
                    <th>Paciente</th>
                    <th>CPF</th>
                    <th>Leito</th>
                    <th>Setor</th>
                    <th>Dieta</th>
                    <th>Refeição</th>
                    <th>Data</th>
                    <th>Hora</th>
                    <th>Status</th>
                    <th className="col-acoes">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {prescricoes.map((prescricao) => (
                    <React.Fragment key={prescricao.id}>
                      <tr className={`linha-principal ${linhaExpandida === prescricao.id ? 'expandida' : ''}`}>
                        <td>
                          <button 
                            className="btn-expandir"
                            onClick={() => toggleExpandir(prescricao.id)}
                            aria-label={linhaExpandida === prescricao.id ? 'Recolher' : 'Expandir'}
                          >
                            {linhaExpandida === prescricao.id ? Icons.chevronDown : Icons.chevronRight}
                          </button>
                        </td>
                        <td className="col-paciente">
                          <div className="paciente-info">
                            <span className="paciente-nome">{prescricao.nome_paciente}</span>
                          </div>
                        </td>
                        <td>{prescricao.cpf}</td>
                        <td>
                          <span className="leito-badge">{prescricao.leito}</span>
                        </td>
                        <td>{prescricao.nucleo}</td>
                        <td>
                          <span className="dieta-tag">{prescricao.dieta}</span>
                        </td>
                        <td>{prescricao.tipo_alimentacao}</td>
                        <td>{formatarData(prescricao.data_prescricao)}</td>
                        <td>{formatarHora(prescricao.data_prescricao)}</td>
                        <td>
                          <span className={`status-badge ${prescricao.status?.toLowerCase()}`}>
                            {prescricao.status}
                          </span>
                        </td>
                        <td>
                          <div className="acoes-cell">
                            <button 
                              className="btn-acao btn-editar" 
                              onClick={() => handleEditar(prescricao.id)}
                              title="Editar prescrição"
                            >
                              {Icons.edit}
                            </button>
                            <button 
                              className="btn-acao btn-excluir" 
                              onClick={() => handleExcluir(prescricao.id)}
                              title="Excluir prescrição"
                            >
                              {Icons.trash}
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Detalhes Expandidos */}
                      {linhaExpandida === prescricao.id && (
                        <tr className="linha-expandida">
                          <td colSpan="11">
                            <div className="detalhes-container">
                              <h4>Detalhes da Prescrição</h4>
                              <div className="detalhes-grid">
                                <div className="detalhe-item">
                                  <label>Nome da Mãe</label>
                                  <span>{prescricao.nome_mae || '-'}</span>
                                </div>
                                <div className="detalhe-item">
                                  <label>Código Atendimento</label>
                                  <span>{prescricao.codigo_atendimento}</span>
                                </div>
                                <div className="detalhe-item">
                                  <label>Convênio</label>
                                  <span>{prescricao.convenio}</span>
                                </div>
                                <div className="detalhe-item">
                                  <label>Idade</label>
                                  <span>{prescricao.idade} anos</span>
                                </div>
                                <div className="detalhe-item">
                                  <label>Data de Nascimento</label>
                                  <span>{formatarData(prescricao.data_nascimento)}</span>
                                </div>
                                <div className="detalhe-item">
                                  <label>Restrições</label>
                                  <span>
                                    {prescricao.restricoes && prescricao.restricoes.length > 0
                                      ? prescricao.restricoes.join(', ')
                                      : 'Nenhuma'}
                                  </span>
                                </div>
                                <div className="detalhe-item">
                                  <label>Sem Principal</label>
                                  <span>{prescricao.sem_principal ? 'Sim' : 'Não'}</span>
                                </div>
                                {prescricao.sem_principal && prescricao.descricao_sem_principal && (
                                  <div className="detalhe-item full-width">
                                    <label>Descrição Sem Principal</label>
                                    <span>{prescricao.descricao_sem_principal}</span>
                                  </div>
                                )}
                                {prescricao.obs_exclusao && (
                                  <div className="detalhe-item full-width">
                                    <label>Observação Exclusão</label>
                                    <span>{prescricao.obs_exclusao}</span>
                                  </div>
                                )}
                                {prescricao.obs_acrescimo && (
                                  <div className="detalhe-item full-width">
                                    <label>Observação Acréscimo</label>
                                    <span>{prescricao.obs_acrescimo}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Paginação */}
          <section className="paginacao-section">
            <div className="paginacao-info">
              Mostrando <strong>{prescricoes.length}</strong> de <strong>{paginacao.total}</strong> prescrições
            </div>
            <div className="paginacao-controles">
              <button 
                className="btn-pagina"
                onClick={paginaAnterior}
                disabled={paginacao.pagina === 1}
              >
                {Icons.chevronLeft}
                Anterior
              </button>
              <span className="pagina-atual">
                Página {paginacao.pagina} de {paginacao.totalPaginas}
              </span>
              <button 
                className="btn-pagina"
                onClick={proximaPagina}
                disabled={paginacao.pagina >= paginacao.totalPaginas}
              >
                Próxima
                {Icons.chevronRight}
              </button>
            </div>
          </section>
        </>
      )}

      {/* Modal de Edição */}
      {modalEdicaoAberto && prescricaoEditando && (
        <ModalEditarPrescricao
          prescricao={prescricaoEditando}
          nucleos={nucleos}
          dietas={dietas}
          onSalvar={handleSalvarEdicao}
          onCancelar={handleCancelarEdicao}
        />
      )}
    </div>
  );
}

export default Prescricoes;