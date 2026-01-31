import React from 'react';
import './Cadastros.css';

function Cadastros({ voltar, irParaGestaoUsuarios, irParaGestaoDietas }) {
  return (
    <div className="cadastros-container">
      <div className="cadastros-header">
        <h1>⚙️ Configurações e Cadastros</h1>
        <button className="btn-voltar" onClick={voltar}>
          ← Voltar ao Menu
        </button>
      </div>

      <div className="cadastros-cards">
        <div className="cadastro-card" onClick={irParaGestaoUsuarios}>
          <div className="card-icon">👥</div>
          <h3>Gestão de Usuários</h3>
          <p>Criar, editar e gerenciar usuários do sistema</p>
          <button className="card-button">Acessar</button>
        </div>

        <div className="cadastro-card disabled">
          <div className="card-icon">🏥</div>
          <h3>Setores e Leitos</h3>
          <p>Gerenciar setores hospitalares e leitos</p>
          <button className="card-button" disabled>Em Breve</button>
        </div>

        <div className="cadastro-card" onClick={irParaGestaoDietas}>
          <div className="card-icon">🍽️</div>
          <h3>Tipos de Dieta</h3>
          <p>Configurar tipos de alimentação disponíveis</p>
          <button className="card-button">Acessar</button>
        </div>

        <div className="cadastro-card disabled">
          <div className="card-icon">📊</div>
          <h3>Relatórios</h3>
          <p>Configurações de relatórios e exportações</p>
          <button className="card-button" disabled>Em Breve</button>
        </div>
      </div>

      <div className="cadastros-info">
        <div className="info-card">
          <h4>ℹ️ Área Administrativa</h4>
          <ul>
            <li>Esta área é restrita a administradores do sistema</li>
            <li>Alterações aqui afetam todo o sistema</li>
            <li>Use com cuidado e responsabilidade</li>
            <li>Todas as ações são registradas em log</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cadastros;