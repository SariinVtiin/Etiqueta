// frontend/src/pages/Cadastros/Cadastros.jsx
// ATUALIZADO - Com card de Logs de Login
import React, { useState } from 'react';
import ImportarAcrescimos from '../../components/configuracoes/ImportarAcrescimos';
import RelatorioLogin from '../../components/RelatorioLogin/RelatorioLogin';
import './Cadastros.css';

function Cadastros({ voltar, irParaGestaoUsuarios, irParaGestaoDietas, irParaGestaoRestricoes, irParaGestaoLeitos, irParaGestaoRefeicoes, irParaGestaoRestricoesAcompanhante}) {
  const [mostrarImportacao, setMostrarImportacao] = useState(false);
  const [relatorioLoginAberto, setRelatorioLoginAberto] = useState(false);

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

        {/* Restrições Alimentares */}
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

        {/* Logs de Login */}
        <div className="cadastro-card" onClick={() => setRelatorioLoginAberto(true)}>
          <div className="card-icon">🔐</div>
          <h3>Logs de Login</h3>
          <p>Gerar relatório Excel com histórico de acessos ao sistema</p>
          <button className="card-button">Gerar Relatório</button>
        </div>

        {/* Tipos de Refeição */}
        <div className="cadastro-card" onClick={irParaGestaoRefeicoes}>
          <div className="card-icon">🍽️</div>
          <h3>Tipos de Refeição</h3>
          <p>Gerenciar refeições disponíveis (Desjejum, Almoço, Jantar...)</p>
          <button className="card-button">Acessar</button>
        </div>

        {/* Restrições do Acompanhante */}
        <div className="cadastro-card" onClick={irParaGestaoRestricoesAcompanhante}>
          <div className="card-icon">👤</div>
          <h3>Restrições do Acompanhante</h3>
          <p>Gerenciar restrições para acompanhantes (Diabético, Sem Lactose...)</p>
          <button className="card-button">Acessar</button>
        </div>

      </div>

      {/* Modal do Relatório de Logs de Login */}
      <RelatorioLogin
        isOpen={relatorioLoginAberto}
        onClose={() => setRelatorioLoginAberto(false)}
      />
    </div>
  );
}

export default Cadastros;