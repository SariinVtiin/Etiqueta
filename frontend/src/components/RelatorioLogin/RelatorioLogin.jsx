// frontend/src/components/RelatorioLogin/RelatorioLogin.jsx
// Modal para gerar relatório Excel de logs de login
// Acesso: apenas admin, via botão no menu

import React, { useState, useEffect } from 'react';
import { exportarLogsLogin, listarUsuariosLogsLogin } from '../../services/api';
import './RelatorioLogin.css';

function RelatorioLogin({ isOpen, onClose }) {
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    usuarioId: '',
    tipoEvento: ''
  });
  const [usuarios, setUsuarios] = useState([]);
  const [gerando, setGerando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  // Definir período padrão: últimos 30 dias
  useEffect(() => {
    if (isOpen) {
      const hoje = new Date();
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(hoje.getDate() - 30);

      setFiltros(prev => ({
        ...prev,
        dataInicio: trintaDiasAtras.toISOString().split('T')[0],
        dataFim: hoje.toISOString().split('T')[0]
      }));

      setMensagem(null);
      carregarUsuarios();
    }
  }, [isOpen]);

  const carregarUsuarios = async () => {
    try {
      const resposta = await listarUsuariosLogsLogin();
      if (resposta.sucesso) {
        setUsuarios(resposta.usuarios);
      }
    } catch (erro) {
      console.error('Erro ao carregar usuários:', erro);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setMensagem(null);
  };

  const handleGerar = async () => {
    // Validar período
    if (!filtros.dataInicio || !filtros.dataFim) {
      setMensagem({ tipo: 'erro', texto: 'Selecione o período (data início e data fim).' });
      return;
    }

    if (filtros.dataInicio > filtros.dataFim) {
      setMensagem({ tipo: 'erro', texto: 'A data início não pode ser posterior à data fim.' });
      return;
    }

    setGerando(true);
    setMensagem(null);

    try {
      const resultado = await exportarLogsLogin(filtros);
      setMensagem({ tipo: 'sucesso', texto: 'Relatório Excel gerado e baixado com sucesso!' });
    } catch (erro) {
      console.error('Erro ao gerar relatório:', erro);
      setMensagem({ tipo: 'erro', texto: erro.message || 'Erro ao gerar relatório.' });
    } finally {
      setGerando(false);
    }
  };

  // Atalhos de período
  const definirPeriodo = (dias) => {
    const hoje = new Date();
    const inicio = new Date();
    inicio.setDate(hoje.getDate() - dias);
    setFiltros(prev => ({
      ...prev,
      dataInicio: inicio.toISOString().split('T')[0],
      dataFim: hoje.toISOString().split('T')[0]
    }));
  };

  const definirMesAtual = () => {
    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    setFiltros(prev => ({
      ...prev,
      dataInicio: inicioMes.toISOString().split('T')[0],
      dataFim: hoje.toISOString().split('T')[0]
    }));
  };

  const definirMesAnterior = () => {
    const hoje = new Date();
    const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const fimMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    setFiltros(prev => ({
      ...prev,
      dataInicio: inicioMesAnterior.toISOString().split('T')[0],
      dataFim: fimMesAnterior.toISOString().split('T')[0]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="rl-overlay" onClick={onClose}>
      <div className="rl-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="rl-header">
          <div className="rl-header-info">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Relatório de Logs de Login
            </h2>
            <p>Gere um relatório Excel com o histórico de acessos ao sistema</p>
          </div>
          <button className="rl-btn-fechar" onClick={onClose} title="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="rl-body">
          {/* Atalhos de período */}
          <div className="rl-atalhos">
            <span className="rl-atalhos-label">Período rápido:</span>
            <button className="rl-atalho-btn" onClick={() => definirPeriodo(7)}>7 dias</button>
            <button className="rl-atalho-btn" onClick={() => definirPeriodo(15)}>15 dias</button>
            <button className="rl-atalho-btn" onClick={() => definirPeriodo(30)}>30 dias</button>
            <button className="rl-atalho-btn" onClick={definirMesAtual}>Mês atual</button>
            <button className="rl-atalho-btn" onClick={definirMesAnterior}>Mês anterior</button>
          </div>

          {/* Filtros */}
          <div className="rl-filtros">
            <div className="rl-filtro-grupo">
              <label htmlFor="rl-dataInicio">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Data Início *
              </label>
              <input
                type="date"
                id="rl-dataInicio"
                name="dataInicio"
                value={filtros.dataInicio}
                onChange={handleChange}
              />
            </div>

            <div className="rl-filtro-grupo">
              <label htmlFor="rl-dataFim">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Data Fim *
              </label>
              <input
                type="date"
                id="rl-dataFim"
                name="dataFim"
                value={filtros.dataFim}
                onChange={handleChange}
              />
            </div>

            <div className="rl-filtro-grupo">
              <label htmlFor="rl-usuarioId">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Usuário
              </label>
              <select
                id="rl-usuarioId"
                name="usuarioId"
                value={filtros.usuarioId}
                onChange={handleChange}
              >
                <option value="">Todos os usuários</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome} ({u.email})</option>
                ))}
              </select>
            </div>

            <div className="rl-filtro-grupo">
              <label htmlFor="rl-tipoEvento">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Tipo de Evento
              </label>
              <select
                id="rl-tipoEvento"
                name="tipoEvento"
                value={filtros.tipoEvento}
                onChange={handleChange}
              >
                <option value="">Todos os tipos</option>
                <option value="LOGIN_SUCESSO">Login com Sucesso</option>
                <option value="LOGIN_FALHA_SENHA">Falha - Senha Incorreta</option>
                <option value="LOGIN_FALHA_EMAIL">Falha - Email Não Encontrado</option>
                <option value="LOGIN_FALHA_INATIVO">Falha - Usuário Inativo</option>
                <option value="LOGIN_FALHA_RATE_LIMIT">Falha - Rate Limit</option>
                <option value="LOGOUT">Logout</option>
              </select>
            </div>
          </div>

          {/* Mensagem */}
          {mensagem && (
            <div className={`rl-mensagem ${mensagem.tipo}`}>
              {mensagem.tipo === 'sucesso' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              )}
              <span>{mensagem.texto}</span>
            </div>
          )}

          {/* Info do Excel */}
          <div className="rl-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>
              O relatório Excel incluirá: resumo estatístico no topo, 
              todos os eventos de login com destaque visual por cores (verde = sucesso, vermelho = falha), 
              e alertas de IPs suspeitos.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="rl-footer">
          <button className="rl-btn-cancelar" onClick={onClose} disabled={gerando}>
            Cancelar
          </button>
          <button 
            className={`rl-btn-gerar ${gerando ? 'gerando' : ''}`} 
            onClick={handleGerar}
            disabled={gerando}
          >
            {gerando ? (
              <>
                <div className="rl-spinner"></div>
                Gerando...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Gerar Relatório Excel
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RelatorioLogin;