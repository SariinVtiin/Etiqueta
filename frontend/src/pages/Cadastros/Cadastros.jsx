import React from 'react';
import './Cadastros.css';

function Cadastros({ voltar, irParaGestaoUsuarios, irParaGestaoDietas }) {
  const menuItems = [
    {
      id: 'usuarios',
      titulo: 'Gestão de Usuários',
      descricao: 'Criar, editar e gerenciar usuários do sistema',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      cor: 'teal',
      ativo: true,
      onClick: irParaGestaoUsuarios
    },
    {
      id: 'leitos',
      titulo: 'Setores e Leitos',
      descricao: 'Gerenciar setores hospitalares e leitos',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 4v16"/>
          <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
          <path d="M2 17h20"/>
          <path d="M6 8v9"/>
        </svg>
      ),
      cor: 'blue',
      ativo: false,
      badge: 'Em Breve'
    },
    {
      id: 'dietas',
      titulo: 'Tipos de Dieta',
      descricao: 'Configurar tipos de alimentação disponíveis',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
          <path d="M7 2v20"/>
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/>
        </svg>
      ),
      cor: 'emerald',
      ativo: true,
      onClick: irParaGestaoDietas
    },
    {
      id: 'relatorios',
      titulo: 'Relatórios',
      descricao: 'Configurações de relatórios e exportações',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      cor: 'amber',
      ativo: false,
      badge: 'Em Breve'
    },
    {
      id: 'auditoria',
      titulo: 'Logs de Auditoria',
      descricao: 'Visualizar histórico de ações do sistema',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      ),
      cor: 'purple',
      ativo: false,
      badge: 'Em Breve'
    },
    {
      id: 'backup',
      titulo: 'Backup e Restauração',
      descricao: 'Gerenciar backups do banco de dados',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        </svg>
      ),
      cor: 'slate',
      ativo: false,
      badge: 'Em Breve'
    }
  ];

  return (
    <div className="cfg-page">
      {/* Header */}
      <header className="cfg-header">
        <div className="cfg-header-left">
          <button className="cfg-btn-voltar" onClick={voltar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="cfg-header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div className="cfg-header-text">
            <h1>Configurações</h1>
            <p>Gerencie os cadastros e configurações do sistema</p>
          </div>
        </div>
      </header>

      {/* Cards Grid */}
      <div className="cfg-grid">
        {menuItems.map(item => (
          <div 
            key={item.id}
            className={`cfg-card cfg-card-${item.cor} ${!item.ativo ? 'cfg-card-disabled' : ''}`}
            onClick={item.ativo ? item.onClick : undefined}
          >
            {item.badge && (
              <span className="cfg-badge">{item.badge}</span>
            )}
            <div className="cfg-card-icon">
              {item.icon}
            </div>
            <h3 className="cfg-card-title">{item.titulo}</h3>
            <p className="cfg-card-desc">{item.descricao}</p>
            <div className="cfg-card-footer">
              {item.ativo ? (
                <span className="cfg-card-link">
                  Acessar
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              ) : (
                <span className="cfg-card-soon">Disponível em breve</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Card */}
      <div className="cfg-info">
        <div className="cfg-info-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        <div className="cfg-info-content">
          <h4>Área Administrativa</h4>
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