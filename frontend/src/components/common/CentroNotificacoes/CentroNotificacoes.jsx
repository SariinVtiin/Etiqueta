// frontend/src/components/common/CentroNotificacoes/CentroNotificacoes.jsx
// ✅ LIMPO: Removido prop etiquetas e bloco de notificação de etiquetas pendentes
import React, { useState, useEffect, useCallback } from 'react';
import { listarPrescricoes } from '../../../services/api';
import './CentroNotificacoes.css';

function CentroNotificacoes({ isOpen, onClose }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarNotificacoes = useCallback(async () => {
    try {
      setCarregando(true);
      const novasNotificacoes = [];

      // 1. Verificar prescrições próximas de expirar (dentro de 3 horas até 9h do próximo dia)
      const hoje = new Date();
      const ontem = new Date(hoje);
      ontem.setDate(hoje.getDate() - 1);
      ontem.setHours(0, 0, 0, 0);

      const respostaOntem = await listarPrescricoes({
        dataInicio: ontem.toISOString().split('T')[0],
        dataFim: ontem.toISOString().split('T')[0],
        limit: 100
      });

      if (respostaOntem.prescricoes) {
        const prescricoesProximasExpirar = respostaOntem.prescricoes.filter(p => {
          const dataPrescricao = new Date(p.data_prescricao);
          const limite = new Date(dataPrescricao);
          limite.setDate(limite.getDate() + 1);
          limite.setHours(9, 0, 0, 0);

          const horasRestantes = (limite - hoje) / (1000 * 60 * 60);
          return horasRestantes > 0 && horasRestantes <= 3;
        });

        prescricoesProximasExpirar.forEach(p => {
          const dataPrescricao = new Date(p.data_prescricao);
          const limite = new Date(dataPrescricao);
          limite.setDate(limite.getDate() + 1);
          limite.setHours(9, 0, 0, 0);
          const minutosRestantes = Math.floor((limite - hoje) / (1000 * 60));

          novasNotificacoes.push({
            id: `expiracao-${p.id}`,
            tipo: 'urgente',
            titulo: '⏰ Prescrição próxima de expirar',
            mensagem: `Prescrição #${p.id} de ${p.nome_paciente} expira em ${minutosRestantes} minutos`,
            data: new Date(),
            acao: () => {}
          });
        });
      }

      // ✅ Removido: Bloco de "etiquetas pendentes de impressão" (sistema legado)

      // 2. Verificar prescrições criadas hoje
      const hojeStr = hoje.toISOString().split('T')[0];
      const respostaHoje = await listarPrescricoes({
        dataInicio: hojeStr,
        dataFim: hojeStr,
        limit: 100
      });

      if (respostaHoje.paginacao && respostaHoje.paginacao.total > 0) {
        novasNotificacoes.push({
          id: 'prescricoes-hoje',
          tipo: 'info',
          titulo: '📊 Resumo do dia',
          mensagem: `${respostaHoje.paginacao.total} prescrição(ões) criada(s) hoje`,
          data: new Date(),
          acao: () => {}
        });
      }

      // 3. Mensagem de boas-vindas se não houver notificações
      if (novasNotificacoes.length === 0) {
        novasNotificacoes.push({
          id: 'boas-vindas',
          tipo: 'info',
          titulo: '✅ Tudo em ordem!',
          mensagem: 'Não há alertas ou pendências no momento',
          data: new Date(),
          acao: () => {}
        });
      }

      setNotificacoes(novasNotificacoes);
    } catch (erro) {
      console.error('Erro ao carregar notificações:', erro);
      setNotificacoes([{
        id: 'erro',
        tipo: 'info',
        titulo: 'ℹ️ Informação',
        mensagem: 'Não foi possível carregar notificações',
        data: new Date(),
        acao: () => {}
      }]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      carregarNotificacoes();
    }
  }, [isOpen, carregarNotificacoes]);

  const formatarTempo = (data) => {
    const agora = new Date();
    const diff = agora - new Date(data);
    const minutos = Math.floor(diff / 60000);
    
    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `${minutos}m atrás`;
    
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `${horas}h atrás`;
    
    const dias = Math.floor(horas / 24);
    return `${dias}d atrás`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="notificacoes-overlay" onClick={onClose}></div>
      <div className="notificacoes-painel">
        <div className="notificacoes-header">
          <h3>🔔 Notificações</h3>
          <button className="btn-fechar-notificacoes" onClick={onClose}>✕</button>
        </div>

        <div className="notificacoes-conteudo">
          {carregando ? (
            <div className="notificacoes-loading">
              <div className="loading-spinner-small"></div>
              <p>Carregando notificações...</p>
            </div>
          ) : (
            <div className="notificacoes-lista">
              {notificacoes.map(notif => (
                <div 
                  key={notif.id} 
                  className={`notificacao-item ${notif.tipo}`}
                  onClick={notif.acao}
                >
                  <div className="notificacao-conteudo">
                    <strong>{notif.titulo}</strong>
                    <p>{notif.mensagem}</p>
                  </div>
                  <span className="notificacao-tempo">{formatarTempo(notif.data)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="notificacoes-footer">
          <button className="btn-atualizar-notificacoes" onClick={carregarNotificacoes}>
            🔄 Atualizar
          </button>
        </div>
      </div>
    </>
  );
}

export default CentroNotificacoes;