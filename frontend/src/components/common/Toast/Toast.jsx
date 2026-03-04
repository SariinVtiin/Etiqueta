// frontend/src/components/common/Toast/Toast.jsx
import React, { useEffect } from 'react';
import './Toast.css';

function Toast({ visivel, mensagem, tipo = 'sucesso', onFechar, duracao = 4000 }) {
  useEffect(() => {
    if (visivel && duracao > 0) {
      const timer = setTimeout(() => {
        onFechar && onFechar();
      }, duracao);
      return () => clearTimeout(timer);
    }
  }, [visivel, duracao, onFechar]);

  if (!visivel) return null;

  return (
    <div className={`toast-custom-container toast-custom-${tipo}`}>
      <div className="toast-custom-corpo">
        <div className="toast-custom-icone">
          {tipo === 'sucesso' ? '✓' : tipo === 'erro' ? '✕' : 'ℹ'}
        </div>

        <div className="toast-custom-texto">
          <div className="toast-custom-titulo">
            {tipo === 'sucesso' ? 'Sucesso!' : tipo === 'erro' ? 'Erro' : 'Aviso'}
          </div>
          <div className="toast-custom-mensagem">{mensagem}</div>
        </div>

        <button className="toast-custom-fechar" onClick={onFechar}>✕</button>
      </div>

      <div className="toast-custom-progresso-fundo">
        <div
          className="toast-custom-progresso-barra"
          style={{ animationDuration: `${duracao}ms` }}
        />
      </div>
    </div>
  );
}

export default Toast;