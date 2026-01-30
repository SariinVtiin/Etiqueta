// src/components/common/StatusIndicador/StatusIndicador.jsx
import React, { useState, useEffect } from 'react';
import { buscarStatus } from '../../../services/api';
import './StatusIndicador.css';

function StatusIndicador() {
  const [conectado, setConectado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const verificarConexao = async () => {
      try {
        await buscarStatus();
        setConectado(true);
      } catch (erro) {
        setConectado(false);
      } finally {
        setCarregando(false);
      }
    };

    verificarConexao();
    // Verificar a cada 30 segundos
    const intervalo = setInterval(verificarConexao, 30000);
    return () => clearInterval(intervalo);
  }, []);

  if (carregando) return null;

  return (
    <div className={`status-indicador ${conectado ? 'online' : 'offline'}`} title={conectado ? 'Backend conectado' : 'Backend desconectado'}>
      <span className="status-dot"></span>
      <span className="status-texto">{conectado ? 'Online' : 'Offline'}</span>
    </div>
  );
}

export default StatusIndicador;