import React, { useState, useEffect, useCallback } from 'react';
import { listarPrescricoes, deletarPrescricao, atualizarPrescricao } from '../../services/api';
import { exportarParaExcel, exportarParaPDF, exportarRelatorioDetalhado } from '../../services/relatorios';
import ModalEditarPrescricao from '../../components/forms/ModalEditarPrescricao';
import { abrirJanelaImpressao } from '../../utils/gerarImpressaoEtiquetas';
import './Prescricoes.css';

function Prescricoes({ voltar, nucleos, dietas }) {
  const [prescricoes, setPrescricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  
  const [filtros, setFiltros] = useState({
    busca: '',
    dataInicio: '',
    dataFim: '',
    setor: '',
    dieta: '',
    leito: ''
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
      dieta: '',
      leito: ''
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

  // NOVA FUNÇÃO: Imprimir etiquetas em massa
  const handleImprimirEtiquetas = async () => {
    if (prescricoes.length === 0) {
      alert('Nenhuma prescrição encontrada para imprimir.');
      return;
    }

    const confirmar = window.confirm(
      `Você vai imprimir ${prescricoes.length} etiqueta(s) filtrada(s).\n\nDeseja continuar?`
    );

    if (!confirmar) return;

    try {
      const params = { ...filtros, limit: 1000 };
      const resposta = await listarPrescricoes(params);

      if (!resposta.sucesso || resposta.prescricoes.length === 0) {
        alert('Nenhuma prescrição encontrada para imprimir.');
        return;
      }

      const todasPrescricoes = resposta.prescricoes.map(p => ({
        ...p,
        restricoes: p.restricoes ? JSON.parse(p.restricoes) : []
      }));

      // 👉 USA O UTILITÁRIO CENTRALIZADO
      abrirJanelaImpressao(todasPrescricoes);

    } catch (erro) {
      console.error('Erro ao preparar impressão:', erro);
      alert('Erro ao preparar etiquetas para impressão.');
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
    <div className="prescricoes-container">
      <div className="prescricoes-header">
        <h1>Prescrições de Alimentação</h1>
        <button className="btn-voltar" onClick={voltar}>
          Voltar ao Menu
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>Buscar</label>
          <input
            type="text"
            placeholder="Nome, CPF..."
            value={filtros.busca}
            onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
          />
        </div>

        <div className="filtro-grupo">
          <label>Leito</label>
          <input
            type="text"
            placeholder="Ex: 601"
            value={filtros.leito}
            onChange={(e) => setFiltros({ ...filtros, leito: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && aplicarFiltros()}
          />
        </div>

        <div className="filtro-grupo">
          <label>Data Início</label>
          <input
            type="date"
            value={filtros.dataInicio}
            onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
          />
        </div>

        <div className="filtro-grupo">
          <label>Data Fim</label>
          <input
            type="date"
            value={filtros.dataFim}
            onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
          />
        </div>

        <div className="filtro-grupo">
          <label>Setor</label>
          <select
            value={filtros.setor}
            onChange={(e) => setFiltros({ ...filtros, setor: e.target.value })}
          >
            <option value="">Todos</option>
            <option value="INTERNAÇÃO">INTERNAÇÃO</option>
            <option value="UTI PEDIÁTRICA">UTI PEDIÁTRICA</option>
            <option value="UTI ADULTO">UTI ADULTO</option>
            <option value="UDT">UDT</option>
            <option value="TMO">TMO</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Dieta</label>
          <select
            value={filtros.dieta}
            onChange={(e) => setFiltros({ ...filtros, dieta: e.target.value })}
          >
            <option value="">Todas</option>
            <option value="NORMAL">NORMAL</option>
            <option value="LIQUIDA">LIQUIDA</option>
            <option value="PASTOSA">PASTOSA</option>
            <option value="LIQUIDA PASTOSA">LIQUIDA PASTOSA</option>
          </select>
        </div>

        <div className="filtro-acoes">
          <button className="btn-filtrar" onClick={aplicarFiltros}>
            Filtrar
          </button>
          <button className="btn-limpar-filtros" onClick={limparFiltros}>
            Limpar
          </button>
        </div>
      </div>

      {/* Barra de Ações */}
      {!carregando && prescricoes.length > 0 && (
        <div className="acoes-exportacao">
          <div className="info-exportacao">
            <span>{prescricoes.length} prescrição(ões) encontrada(s)</span>
          </div>
          <div className="botoes-exportacao">
            <button 
              className="btn-exportar imprimir" 
              onClick={handleImprimirEtiquetas} 
              title="Imprimir todas as etiquetas filtradas"
            >
              Imprimir Etiquetas
            </button>
            <button className="btn-exportar excel" onClick={handleExportarExcel}>
              Exportar Excel
            </button>
            <button className="btn-exportar pdf" onClick={handleExportarPDF}>
              Exportar PDF
            </button>
            <button className="btn-exportar detalhado" onClick={handleExportarDetalhado}>
              PDF Detalhado
            </button>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {erro && (
        <div className="mensagem-erro">
          {erro}
        </div>
      )}

      {/* Loading */}
      {carregando ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando prescrições...</p>
        </div>
      ) : prescricoes.length === 0 ? (
        <div className="sem-resultados">
          <h3>Nenhuma prescrição encontrada</h3>
          <p>Tente ajustar os filtros ou criar uma nova prescrição.</p>
        </div>
      ) : (
        <>
          {/* Tabela de Prescrições */}
          <div className="tabela-container">
            <table className="tabela-prescricoes">
              <thead>
                <tr>
                  <th>Expand</th>
                  <th>Paciente</th>
                  <th>CPF</th>
                  <th>Leito</th>
                  <th>Setor</th>
                  <th>Dieta</th>
                  <th>Refeição</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {prescricoes.map((prescricao) => (
                  <React.Fragment key={prescricao.id}>
                    <tr className="linha-principal">
                      <td>
                        <button 
                          className="btn-expandir"
                          onClick={() => toggleExpandir(prescricao.id)}
                        >
                          {linhaExpandida === prescricao.id ? '▼' : '▶'}
                        </button>
                      </td>
                      <td>{prescricao.nome_paciente}</td>
                      <td>{prescricao.cpf}</td>
                      <td>{prescricao.leito}</td>
                      <td>{prescricao.nucleo}</td>
                      <td>{prescricao.dieta}</td>
                      <td>{prescricao.tipo_alimentacao}</td>
                      <td>{formatarData(prescricao.data_prescricao)}</td>
                      <td>{formatarHora(prescricao.data_prescricao)}</td>
                      <td>
                        <span className={`status-badge ${prescricao.status.toLowerCase()}`}>
                          {prescricao.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-acao-editar" 
                          onClick={() => handleEditar(prescricao.id)}
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-acao-excluir" 
                          onClick={() => handleExcluir(prescricao.id)}
                          title="Excluir"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                    
                    {linhaExpandida === prescricao.id && (
                      <tr className="linha-expandida">
                        <td colSpan="11">
                          <div className="detalhes-prescricao">
                            <h4>Detalhes da Prescrição</h4>
                            <div className="detalhes-grid">
                              <div className="detalhe-item">
                                <strong>Nome da Mãe:</strong>
                                <span>{prescricao.nome_mae}</span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Data de Nascimento:</strong>
                                <span>{formatarData(prescricao.data_nascimento)}</span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Idade:</strong>
                                <span>{prescricao.idade} anos</span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Código Atendimento:</strong>
                                <span>{prescricao.codigo_atendimento}</span>
                              </div>
                              <div className="detalhe-item">
                                <strong>Convênio:</strong>
                                <span>{prescricao.convenio}</span>
                              </div>
                              {prescricao.restricoes && prescricao.restricoes.length > 0 && (
                                <div className="detalhe-item full-width">
                                  <strong>Restrições:</strong>
                                  <span>{prescricao.restricoes.join(', ')}</span>
                                </div>
                              )}
                              {prescricao.sem_principal && (
                                <div className="detalhe-item full-width">
                                  <strong>Sem Principal:</strong>
                                  <span>{prescricao.descricao_sem_principal}</span>
                                </div>
                              )}
                              {prescricao.obs_exclusao && (
                                <div className="detalhe-item full-width">
                                  <strong>Observação Exclusão:</strong>
                                  <span>{prescricao.obs_exclusao}</span>
                                </div>
                              )}
                              {prescricao.obs_acrescimo && (
                                <div className="detalhe-item full-width">
                                  <strong>Observação Acréscimo:</strong>
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

          {/* Paginação */}
          <div className="paginacao">
            <div className="paginacao-info">
              Página {paginacao.pagina} de {paginacao.totalPaginas} | Total: {paginacao.total} prescrição(ões)
            </div>
            <div className="paginacao-botoes">
              <button 
                onClick={paginaAnterior} 
                disabled={paginacao.pagina === 1}
              >
                Anterior
              </button>
              <span>Página {paginacao.pagina}</span>
              <button 
                onClick={proximaPagina} 
                disabled={paginacao.pagina >= paginacao.totalPaginas}
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de Edição */}
      {modalEdicaoAberto && (
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