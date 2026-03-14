import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listarPacientes, listarPrescricoesPaciente } from "../../services/api";
import "./Pacientes.css";

const formatarCPF = (cpf = "") => {
  const numeros = String(cpf).replace(/\D/g, "");
  if (numeros.length !== 11) return cpf || "-";
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatarData = (valor) => {
  if (!valor) return "-";

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "-";

  return data.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
};

const formatarDataHora = (valor) => {
  if (!valor) return "-";

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "-";

  return data.toLocaleString("pt-BR");
};

function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaAplicada, setBuscaAplicada] = useState("");

  const [paginacao, setPaginacao] = useState({
    pagina: 1,
    limite: 10,
    total: 0,
    totalPaginas: 0,
  });

  const [cpfExpandido, setCpfExpandido] = useState(null);
  const [historicoPorCpf, setHistoricoPorCpf] = useState({});
  const [carregandoHistorico, setCarregandoHistorico] = useState({});

  const carregarPacientes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await listarPacientes({
        busca: buscaAplicada,
        page: paginacao.pagina,
        limit: paginacao.limite,
      });

      if (resposta?.sucesso) {
        setPacientes(resposta.pacientes || []);
        setPaginacao((prev) => ({
          ...prev,
          total: resposta.paginacao?.total || 0,
          totalPaginas: resposta.paginacao?.totalPaginas || 0,
        }));
      } else {
        setPacientes([]);
      }
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
      setErro("Não foi possível carregar os pacientes.");
      setPacientes([]);
    } finally {
      setCarregando(false);
    }
  }, [buscaAplicada, paginacao.pagina, paginacao.limite]);

  useEffect(() => {
    carregarPacientes();
  }, [carregarPacientes]);

  const handleBuscar = () => {
    setPaginacao((prev) => ({ ...prev, pagina: 1 }));
    setBuscaAplicada(busca.trim());
  };

  const handleLimparBusca = () => {
    setBusca("");
    setBuscaAplicada("");
    setPaginacao((prev) => ({ ...prev, pagina: 1 }));
  };

  const carregarHistorico = async (cpf) => {
    try {
      setCarregandoHistorico((prev) => ({ ...prev, [cpf]: true }));

      const resposta = await listarPrescricoesPaciente(cpf);

      setHistoricoPorCpf((prev) => ({
        ...prev,
        [cpf]: resposta?.prescricoes || [],
      }));
    } catch (error) {
      console.error("Erro ao carregar histórico do paciente:", error);
      setHistoricoPorCpf((prev) => ({
        ...prev,
        [cpf]: [],
      }));
    } finally {
      setCarregandoHistorico((prev) => ({ ...prev, [cpf]: false }));
    }
  };

  const toggleExpandir = async (cpf) => {
    if (cpfExpandido === cpf) {
      setCpfExpandido(null);
      return;
    }

    setCpfExpandido(cpf);

    if (!historicoPorCpf[cpf]) {
      await carregarHistorico(cpf);
    }
  };

  const paginaAnterior = () => {
    if (paginacao.pagina > 1) {
      setPaginacao((prev) => ({ ...prev, pagina: prev.pagina - 1 }));
    }
  };

  const proximaPagina = () => {
    if (paginacao.pagina < paginacao.totalPaginas) {
      setPaginacao((prev) => ({ ...prev, pagina: prev.pagina + 1 }));
    }
  };

  const estatisticas = useMemo(() => {
    const conveniosUnicos = new Set(
      pacientes
        .map((p) => p.convenio)
        .filter((valor) => valor && String(valor).trim() !== ""),
    );

    const comNascimento = pacientes.filter((p) => !!p.data_nascimento).length;
    const comCodigo = pacientes.filter((p) => !!p.codigo_atendimento).length;

    return {
      totalGeral: paginacao.total,
      conveniosUnicos: conveniosUnicos.size,
      comNascimento,
      comCodigo,
    };
  }, [pacientes, paginacao.total]);

  return (
    <div className="pac-page">
      <header className="pac-header">
        <div>
          <h1>Pacientes</h1>
          <p>
            Consulte os pacientes cadastrados no sistema e visualize suas
            informações principais.
          </p>
        </div>
      </header>

      <section className="pac-stats">
        <div className="pac-stat-card">
          <span className="pac-stat-label">Total de pacientes</span>
          <strong className="pac-stat-value">{estatisticas.totalGeral}</strong>
        </div>

        <div className="pac-stat-card">
          <span className="pac-stat-label">Convênios distintos</span>
          <strong className="pac-stat-value">
            {estatisticas.conveniosUnicos}
          </strong>
        </div>

        <div className="pac-stat-card">
          <span className="pac-stat-label">Com data de nascimento</span>
          <strong className="pac-stat-value">
            {estatisticas.comNascimento}
          </strong>
        </div>

        <div className="pac-stat-card">
          <span className="pac-stat-label">Com cód. atendimento</span>
          <strong className="pac-stat-value">{estatisticas.comCodigo}</strong>
        </div>
      </section>

      <section className="pac-toolbar">
        <div className="pac-search-group">
          <input
            type="text"
            className="pac-search-input"
            placeholder="Buscar por nome ou CPF"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBuscar();
            }}
          />
          <button className="pac-btn pac-btn-primary" onClick={handleBuscar}>
            Buscar
          </button>
          <button
            className="pac-btn pac-btn-secondary"
            onClick={handleLimparBusca}
          >
            Limpar
          </button>
        </div>
      </section>

      {erro && <div className="pac-alert pac-alert-error">{erro}</div>}

      <section className="pac-table-wrapper">
        {carregando ? (
          <div className="pac-loading">Carregando pacientes...</div>
        ) : pacientes.length === 0 ? (
          <div className="pac-empty">
            Nenhum paciente encontrado para os filtros informados.
          </div>
        ) : (
          <table className="pac-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>CPF</th>
                <th>Cód. Atendimento</th>
                <th>Convênio</th>
                <th>Idade</th>
                <th>Data Nasc.</th>
                <th>Última atualização</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <React.Fragment key={paciente.id}>
                  <tr>
                    <td>
                      <div className="pac-main-cell">
                        <strong>{paciente.nome_paciente || "-"}</strong>
                        {/* <span>ID #{paciente.id}</span> */}
                      </div>
                    </td>
                    <td>{formatarCPF(paciente.cpf)}</td>
                    <td>{paciente.codigo_atendimento || "-"}</td>
                    <td>{paciente.convenio || "-"}</td>
                    <td>{paciente.idade ?? "-"}</td>
                    <td>{formatarData(paciente.data_nascimento)}</td>
                    <td>{formatarDataHora(paciente.updated_at)}</td>
                    <td>
                      <button
                        className="pac-btn-link"
                        onClick={() => toggleExpandir(paciente.cpf)}
                      >
                        {cpfExpandido === paciente.cpf ? "Ocultar" : "Detalhes"}
                      </button>
                    </td>
                  </tr>

                  {cpfExpandido === paciente.cpf && (
                    <tr className="pac-expand-row">
                      <td colSpan="8">
                        <div className="pac-expand-content">
                          <div className="pac-detail-grid">
                            <div className="pac-detail-card">
                              <span className="pac-detail-label">
                                Nome da mãe
                              </span>
                              <strong>{paciente.nome_mae || "-"}</strong>
                            </div>

                            <div className="pac-detail-card">
                              <span className="pac-detail-label">Cadastro</span>
                              <strong>
                                {formatarDataHora(paciente.created_at)}
                              </strong>
                            </div>

                            <div className="pac-detail-card">
                              <span className="pac-detail-label">
                                Data de atualização
                              </span>
                              <strong>
                                {formatarDataHora(
                                  paciente.data_atualizacao ||
                                    paciente.updated_at,
                                )}
                              </strong>
                            </div>

                            <div className="pac-detail-card">
                              <span className="pac-detail-label">CPF</span>
                              <strong>{paciente.cpf || "-"}</strong>
                            </div>
                          </div>

                          <div className="pac-history-block">
                            <div className="pac-history-header">
                              <h3>Histórico de prescrições</h3>
                            </div>

                            {carregandoHistorico[paciente.cpf] ? (
                              <p className="pac-history-loading">
                                Carregando histórico...
                              </p>
                            ) : (historicoPorCpf[paciente.cpf] || []).length ===
                              0 ? (
                              <p className="pac-history-empty">
                                Nenhuma prescrição encontrada para este
                                paciente.
                              </p>
                            ) : (
                              <div className="pac-history-list">
                                {historicoPorCpf[paciente.cpf].map(
                                  (prescricao) => (
                                    <div
                                      key={prescricao.id}
                                      className="pac-history-item"
                                    >
                                      <div>
                                        <strong>
                                          {prescricao.tipo_alimentacao ||
                                            "Refeição não informada"}
                                        </strong>
                                        <span>
                                          Prescrição #{prescricao.id} •{" "}
                                          {formatarDataHora(
                                            prescricao.criado_em ||
                                              prescricao.data_prescricao ||
                                              prescricao.created_at,
                                          )}
                                        </span>
                                      </div>

                                      <div className="pac-history-meta">
                                        <span>
                                          Leito: {prescricao.leito || "-"}
                                        </span>
                                        <span>
                                          Setor: {prescricao.nucleo || "-"}
                                        </span>
                                        <span>
                                          Dieta: {prescricao.dieta || "-"}
                                        </span>
                                      </div>
                                    </div>
                                  ),
                                )}
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
        )}
      </section>

      <footer className="pac-pagination">
        <div className="pac-pagination-info">
          Página {paginacao.pagina} de{" "}
          {Math.max(paginacao.totalPaginas || 1, 1)}
        </div>

        <div className="pac-pagination-actions">
          <button
            className="pac-btn pac-btn-secondary"
            onClick={paginaAnterior}
            disabled={paginacao.pagina <= 1}
          >
            Anterior
          </button>
          <button
            className="pac-btn pac-btn-secondary"
            onClick={proximaPagina}
            disabled={
              paginacao.totalPaginas === 0 ||
              paginacao.pagina >= paginacao.totalPaginas
            }
          >
            Próxima
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Pacientes;
