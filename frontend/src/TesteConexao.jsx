import React, { useState, useEffect } from 'react';
import { testarConexao, buscarStatus } from './services/api';
import './TesteConexao.css';

function TesteConexao() {
  const [status, setStatus] = useState({
    conectado: false,
    carregando: true,
    erro: null,
    dados: null
  });

  const testar = async () => {
    setStatus({ ...status, carregando: true, erro: null });
    
    try {
      // Testar endpoint básico
      const teste = await testarConexao();
      console.log('✅ Teste básico:', teste);
      
      // Buscar status completo
      const statusCompleto = await buscarStatus();
      console.log('✅ Status:', statusCompleto);
      
      setStatus({
        conectado: true,
        carregando: false,
        erro: null,
        dados: statusCompleto
      });
    } catch (erro) {
      console.error('❌ Erro:', erro);
      setStatus({
        conectado: false,
        carregando: false,
        erro: erro.message,
        dados: null
      });
    }
  };

  useEffect(() => {
    testar();
  }, []);

  return (
    <div className="teste-conexao">
      <h2>🔌 Teste de Conexão com Backend</h2>
      
      {status.carregando && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Testando conexão...</p>
        </div>
      )}
      
      {!status.carregando && status.erro && (
        <div className="erro">
          <h3>❌ Erro de Conexão</h3>
          <p>{status.erro}</p>
          <p className="ajuda">
            <strong>Verifique:</strong><br/>
            • Backend está rodando? (node server.js)<br/>
            • Backend está em http://localhost:3001?<br/>
            • Banco de dados está conectado?
          </p>
          <button onClick={testar}>🔄 Tentar Novamente</button>
        </div>
      )}
      
      {!status.carregando && status.conectado && status.dados && (
        <div className="sucesso">
          <h3>✅ Conectado com Sucesso!</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="valor">{status.dados.status}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Banco:</span>
              <span className="valor">{status.dados.banco}</span>
            </div>
            
            <div className="info-item">
              <span className="label">Impressora:</span>
              <span className="valor">{status.dados.impressora}</span>
            </div>
          </div>
          
          {status.dados.estatisticas && (
            <div className="estatisticas">
              <h4>📊 Estatísticas</h4>
              <ul>
                <li>Pacientes ativos: <strong>{status.dados.estatisticas.pacientes_ativos}</strong></li>
                <li>Leitos cadastrados: <strong>{status.dados.estatisticas.leitos_cadastrados}</strong></li>
                <li>Dietas disponíveis: <strong>{status.dados.estatisticas.dietas_disponiveis}</strong></li>
              </ul>
            </div>
          )}
          
          <button onClick={testar} className="btn-secondary">🔄 Atualizar</button>
        </div>
      )}
    </div>
  );
}

export default TesteConexao;