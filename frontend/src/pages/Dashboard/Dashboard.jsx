import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { listarPrescricoes } from '../../services/api';
import './Dashboard.css';

function Dashboard({ irParaPrescricoes, irParaNovaPrescricao }) {
  const { usuario } = useAuth();
  const [estatisticas, setEstatisticas] = useState({
    totalHoje: 0,
    totalSemana: 0,
    totalMes: 0,
    porSetor: {},
    porDieta: {},
    ultimasPrescricoes: []
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      setCarregando(true);

      // Data de hoje
      const hoje = new Date();
      const hojeStr = hoje.toISOString().split('T')[0];

      // Data de início da semana (domingo)
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - hoje.getDay());
      const inicioSemanaStr = inicioSemana.toISOString().split('T')[0];

      // Data de início do mês
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const inicioMesStr = inicioMes.toISOString().split('T')[0];

      // Buscar prescrições de hoje
      const respostaHoje = await listarPrescricoes({
        dataInicio: hojeStr,
        dataFim: hojeStr,
        limit: 100
      });

      // Buscar prescrições da semana
      const respostaSemana = await listarPrescricoes({
        dataInicio: inicioSemanaStr,
        limit: 100
      });

      // Buscar prescrições do mês
      const respostaMes = await listarPrescricoes({
        dataInicio: inicioMesStr,
        limit: 100
      });

      // Buscar últimas prescrições para a lista
      const respostaRecentes = await listarPrescricoes({
        limit: 5
      });

      // Calcular estatísticas por setor
      const porSetor = {};
      respostaMes.prescricoes?.forEach(p => {
        const setor = p.nucleo || 'Sem setor';
        porSetor[setor] = (porSetor[setor] || 0) + 1;
      });

      // Calcular estatísticas por dieta
      const porDieta = {};
      respostaMes.prescricoes?.forEach(p => {
        const dieta = p.dieta || 'Sem dieta';
        porDieta[dieta] = (porDieta[dieta] || 0) + 1;
      });

      setEstatisticas({
        totalHoje: respostaHoje.paginacao?.total || 0,
        totalSemana: respostaSemana.paginacao?.total || 0,
        totalMes: respostaMes.paginacao?.total || 0,
        porSetor,
        porDieta,
        ultimasPrescricoes: respostaRecentes.prescricoes || []
      });

    } catch (erro) {
      console.error('Erro ao carregar estatísticas:', erro);
    } finally {
      setCarregando(false);
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

  if (carregando) {
    return (
      <div className="dashboard-container">
        <div className="loading-dashboard">
          <div className="loading-spinner"></div>
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-header">
        <h1>👋 Bem-vindo(a), {usuario.nome}!</h1>
        <p className="welcome-subtitle">
          Sistema de Etiquetas Hospitalares - {usuario.role === 'admin' ? 'Administrador' : 'Nutricionista'}
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="stats-cards">
        <div className="stat-card hoje">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Hoje</h3>
            <p className="stat-number">{estatisticas.totalHoje}</p>
            <span className="stat-label">prescrições</span>
          </div>
        </div>

        <div className="stat-card semana">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Esta Semana</h3>
            <p className="stat-number">{estatisticas.totalSemana}</p>
            <span className="stat-label">prescrições</span>
          </div>
        </div>

        <div className="stat-card mes">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Este Mês</h3>
            <p className="stat-number">{estatisticas.totalMes}</p>
            <span className="stat-label">prescrições</span>
          </div>
        </div>
      </div>

      {/* Cards de Ação */}
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={irParaPrescricoes}>
          <div className="card-icon">📋</div>
          <h3>Prescrições</h3>
          <p>Visualizar e gerenciar todas as prescrições de alimentação</p>
          <button className="card-button">Acessar</button>
        </div>

        <div className="dashboard-card" onClick={irParaNovaPrescricao}>
          <div className="card-icon">➕</div>
          <h3>Nova Prescrição</h3>
          <p>Criar uma nova prescrição de alimentação para paciente</p>
          <button className="card-button">Criar</button>
        </div>
      </div>

      {/* Seção com Gráficos e Listas */}
      <div className="dashboard-bottom">
        {/* Distribuição por Setor */}
        <div className="dashboard-chart-card">
          <h3>📊 Prescrições por Setor (Este Mês)</h3>
          <div className="chart-bars">
            {Object.entries(estatisticas.porSetor)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([setor, quantidade]) => (
                <div key={setor} className="chart-bar-item">
                  <div className="chart-bar-label">{setor}</div>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar-fill"
                      style={{ 
                        width: `${(quantidade / estatisticas.totalMes) * 100}%` 
                      }}
                    >
                      <span className="chart-bar-value">{quantidade}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Distribuição por Dieta */}
        <div className="dashboard-chart-card">
          <h3>🍽️ Prescrições por Dieta (Este Mês)</h3>
          <div className="chart-bars">
            {Object.entries(estatisticas.porDieta)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([dieta, quantidade]) => (
                <div key={dieta} className="chart-bar-item">
                  <div className="chart-bar-label">{dieta}</div>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar-fill dieta"
                      style={{ 
                        width: `${(quantidade / estatisticas.totalMes) * 100}%` 
                      }}
                    >
                      <span className="chart-bar-value">{quantidade}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Últimas Prescrições */}
        <div className="dashboard-list-card">
          <h3>🕐 Últimas Prescrições</h3>
          <div className="prescricoes-recentes">
            {estatisticas.ultimasPrescricoes.length === 0 ? (
              <p className="sem-prescricoes">Nenhuma prescrição cadastrada ainda.</p>
            ) : (
              estatisticas.ultimasPrescricoes.map(prescricao => (
                <div key={prescricao.id} className="prescricao-recente-item">
                  <div className="prescricao-recente-info">
                    <strong>{prescricao.nome_paciente}</strong>
                    <span className="prescricao-recente-detalhes">
                      Leito {prescricao.leito} • {prescricao.dieta} • {prescricao.tipo_alimentacao}
                    </span>
                  </div>
                  <div className="prescricao-recente-data">
                    <span>{formatarData(prescricao.data_prescricao)}</span>
                    <span className="prescricao-recente-hora">{formatarHora(prescricao.data_prescricao)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="dashboard-info">
        <div className="info-card">
          <h4>ℹ️ Informações Importantes</h4>
          <ul>
            <li>Prescrições podem ser editadas e excluídas até 9h do dia seguinte</li>
            <li>Todas as etiquetas são impressas pelo administrador</li>
            <li>Use filtros para encontrar prescrições específicas rapidamente</li>
            <li>Verifique diariamente as prescrições pendentes de impressão</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;