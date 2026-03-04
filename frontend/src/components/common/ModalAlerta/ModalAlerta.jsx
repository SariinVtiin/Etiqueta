// frontend/src/components/common/ModalAlerta/ModalAlerta.jsx
// Modal genérico para substituir alert() e window.confirm()
import React from 'react';
import './ModalAlerta.css';

function ModalAlerta({ 
  visivel, 
  titulo, 
  mensagem, 
  tipo = 'info',       // 'info' | 'sucesso' | 'erro' | 'confirmar' | 'perigo'
  textoBotaoConfirmar,
  textoBotaoCancelar,
  onConfirmar, 
  onCancelar 
}) {
  if (!visivel) return null;

  const isConfirmacao = tipo === 'confirmar' || tipo === 'perigo';

  const icones = {
    info: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
    ),
    sucesso: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    erro: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    confirmar: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    perigo: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
      </svg>
    ),
  };

  return (
    <div className="ma-overlay" onClick={onCancelar}>
      <div className={`ma-container ma-${tipo}`} onClick={(e) => e.stopPropagation()}>
        
        {/* Ícone */}
        <div className={`ma-icone-wrapper ma-icone-${tipo}`}>
          {icones[tipo] || icones.info}
        </div>

        {/* Título */}
        {titulo && <h3 className="ma-titulo">{titulo}</h3>}

        {/* Mensagem */}
        <div className="ma-mensagem">{mensagem}</div>

        {/* Botões */}
        <div className={`ma-botoes ${isConfirmacao ? 'ma-botoes-duplo' : ''}`}>
          {isConfirmacao && (
            <button className="ma-btn ma-btn-cancelar" onClick={onCancelar}>
              {textoBotaoCancelar || 'Cancelar'}
            </button>
          )}
          <button 
            className={`ma-btn ma-btn-${tipo === 'perigo' ? 'perigo' : tipo === 'erro' ? 'erro' : 'confirmar'}`}
            onClick={onConfirmar}
          >
            {textoBotaoConfirmar || (isConfirmacao ? 'Confirmar' : 'OK')}
          </button>
        </div>

      </div>
    </div>
  );
}

export default ModalAlerta;