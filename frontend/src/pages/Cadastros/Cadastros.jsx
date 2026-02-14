// frontend/src/pages/Cadastros/Cadastros.jsx
import React, { useState } from 'react';
import ImportarAcrescimos from '../../components/configuracoes/ImportarAcrescimos';
import './Cadastros.css';

function Cadastros({ voltar, irParaGestaoUsuarios, irParaGestaoDietas, irParaGestaoRestricoes, irParaGestaoLeitos }) {
  const [mostrarImportacao, setMostrarImportacao] = useState(false);

  if (mostrarImportacao) {
    return (
      <div className="cadastros-container">
        <div className="cadastros-header">
          <h1>📥 Importar Acréscimos</h1>
          <button className="btn-voltar" onClick={() => setMostrarImportacao(false)}>
            ← Voltar aos Cadastros
          </button>
        </div>
        <ImportarAcrescimos />
      </div>
    );
  }

  return (
    <div className="cadastros-container">
      <div className="cadastros-header">
        <h1>⚙️ Configurações e Cadastros</h1>
        <button className="btn-voltar" onClick={voltar}>
          ← Voltar ao Menu
        </button>
      </div>

      <div className="cadastros-cards">
        {/* Gestão de Usuários */}
        <div className="cadastro-card" onClick={irParaGestaoUsuarios}>
          <div className="card-icon">👥</div>
          <h3>Gestão de Usuários</h3>
          <p>Criar, editar e gerenciar usuários do sistema</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Setores e Leitos */}
        <div className="cadastro-card" onClick={irParaGestaoLeitos}>
          <div className="card-icon">🏥</div>
          <h3>Setores e Leitos</h3>     
          <p>Gerenciar setores hospitalares e leitos</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Tipos de Dieta */}
        <div className="cadastro-card" onClick={irParaGestaoDietas}>
          <div className="card-icon">🍽️</div>
          <h3>Tipos de Dieta</h3>
          <p>Configurar tipos de alimentação disponíveis</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* NOVO: Restrições Alimentares (substitui o antigo "Tipos de Dieta") */}
        <div className="cadastro-card" onClick={irParaGestaoRestricoes}>
          <div className="card-icon">🚫</div>
          <h3>Restrição Alimentar</h3>
          <p>Gerenciar restrições para prescrições (HPS, DM, IRC, etc.)</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Acréscimos */}
        <div className="cadastro-card" onClick={() => setMostrarImportacao(true)}>
          <div className="card-icon">📥</div>
          <h3>Acréscimos</h3>
          <p>Importar planilha de suplementos e acréscimos</p>
          <button className="card-button">Importar</button>
        </div>
      </div>
    </div>
  );
}

export default Cadastros;