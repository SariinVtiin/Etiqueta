// frontend/src/pages/GestaoImportacao/GestaoImportacao.jsx
// ============================================
// SALUSVITA TECH - IMPORTAR ACRÉSCIMOS
// Desenvolvido por FerMax Solution
// Prefixo CSS: ia- (importar acréscimos)
// ============================================
// CORRIGIDO: Usa api.js centralizado (sessionStorage + fetchAuth)
// CORRIGIDO: ModalAlerta em vez de alert/confirm
// ============================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obterEstatisticasAcrescimos,
  importarAcrescimos,
} from "../../services/api";
import ModalAlerta from "../../components/common/ModalAlerta/ModalAlerta";
import "./GestaoImportacao.css";

function GestaoImportacao() {
  const navigate = useNavigate();

  const [arquivo, setArquivo] = useState(null);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);

  // Modal de alerta/confirmação padronizado
  const [modalAlerta, setModalAlerta] = useState({
    visivel: false,
    titulo: "",
    mensagem: "",
    tipo: "info",
    onConfirmar: null,
  });

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const data = await obterEstatisticasAcrescimos();
      if (data?.sucesso) setEstatisticas(data.estatisticas);
    } catch (erro) {
      console.error("Erro ao carregar estatísticas:", erro);
    }
  };

  const mostrarAlerta = (titulo, mensagem, tipo = "info") => {
    setModalAlerta({
      visivel: true,
      titulo,
      mensagem,
      tipo,
      onConfirmar: () => setModalAlerta((prev) => ({ ...prev, visivel: false })),
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      const extensao = file.name.split(".").pop().toLowerCase();
      if (extensao !== "xlsx" && extensao !== "xls") {
        mostrarAlerta("Formato inválido", "Apenas arquivos .xlsx ou .xls são permitidos.", "erro");
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        mostrarAlerta("Arquivo muito grande", "Tamanho máximo permitido: 5MB.", "erro");
        e.target.value = "";
        return;
      }

      setArquivo(file);
      setResultado(null);
    }
  };

  const handleImportar = async () => {
    if (!arquivo) {
      mostrarAlerta("Nenhum arquivo", "Selecione um arquivo primeiro.", "erro");
      return;
    }

    // Confirmação via ModalAlerta
    setModalAlerta({
      visivel: true,
      titulo: "Confirmar importação",
      mensagem: `Esta ação irá:\n\n1. DESATIVAR todos os ${estatisticas?.ativos || 0} itens atuais\n2. IMPORTAR os novos itens da planilha\n\nPrescrições antigas continuarão com valores corretos.\n\nDeseja continuar?`,
      tipo: "confirmar",
      onConfirmar: async () => {
        setModalAlerta((prev) => ({ ...prev, visivel: false }));
        await executarImportacao();
      },
    });
  };

  const executarImportacao = async () => {
    setImportando(true);
    setResultado(null);

    try {
      const data = await importarAcrescimos(arquivo);

      if (data?.sucesso) {
        setResultado({
          tipo: "sucesso",
          mensagem: data.mensagem,
          detalhes: data.detalhes,
        });

        setArquivo(null);
        const input = document.querySelector('input[type="file"]');
        if (input) input.value = "";

        await carregarEstatisticas();
      } else {
        setResultado({
          tipo: "erro",
          mensagem: data?.erro || "Erro ao importar planilha",
        });
      }
    } catch (erro) {
      console.error("Erro ao importar:", erro);
      setResultado({
        tipo: "erro",
        mensagem: "Erro ao importar planilha: " + erro.message,
      });
    } finally {
      setImportando(false);
    }
  };

  const formatarData = (data) => {
    if (!data) return "Nunca";
    return new Date(data).toLocaleString("pt-BR");
  };

  return (
    <div className="importar-acrescimos-container">
      {/* Header padronizado */}
      <div className="ia-header">
        <button
          className="ia-btn-voltar"
          onClick={() => navigate("/admin/cadastros")}
        >
          ← Voltar
        </button>
        <div className="ia-header-text">
          <h1 className="ia-titulo">📥 Importar Acréscimos</h1>
          <p className="ia-subtitulo">
            Gerencie as importações de suplementos e acréscimos
          </p>
        </div>
      </div>

      <div className="card-importacao">
        <div className="card-body">
          {/* Estatísticas */}
          {estatisticas && (
            <div className="estatisticas-box">
              <div className="stat-item">
                <span className="stat-label">Total de Itens</span>
                <span className="stat-valor">{estatisticas.total || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Ativos</span>
                <span className="stat-valor ativo">
                  {estatisticas.ativos || 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Inativos</span>
                <span className="stat-valor inativo">
                  {estatisticas.inativos || 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Última Importação</span>
                <span className="stat-label" style={{ fontWeight: 600 }}>
                  {formatarData(estatisticas.ultima_importacao)}
                </span>
              </div>
            </div>
          )}

          {/* Upload de Arquivo */}
          <div className="upload-section">
            <label className="file-label">
              <input
                type="file"
                className="file-input"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
              <div className="file-button">
                📂 Clique para selecionar a planilha (.xlsx ou .xls)
              </div>
            </label>

            {arquivo && (
              <div className="arquivo-selecionado">
                <span className="arquivo-nome">📄 {arquivo.name}</span>
                <span className="arquivo-tamanho">
                  ({(arquivo.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
          </div>

          {/* Botão Importar */}
          <button
            className="btn-importar"
            onClick={handleImportar}
            disabled={!arquivo || importando}
          >
            {importando ? "⏳ Importando..." : "📥 Importar Planilha"}
          </button>

          {resultado && (
            <div className={`resultado-box ${resultado.tipo}`}>
              <div className="resultado-header">
                {resultado.tipo === "sucesso" ? "✅" : "❌"}{" "}
                {resultado.mensagem}
              </div>

              {resultado.detalhes && (
                <div className="resultado-detalhes">
                  <p>• Itens desativados: {resultado.detalhes.desativados}</p>
                  <p>• Itens importados: {resultado.detalhes.inseridos}</p>
                  <p>
                    • Data: {formatarData(resultado.detalhes.data_importacao)}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="instrucoes-box">
            <h3>📋 Instruções</h3>
            <ol>
              <li>
                A planilha deve ter as colunas: <code>nome_item</code>,{" "}
                <code>tipo_medida</code>, <code>quantidade_referencia</code>,{" "}
                <code>valor</code>
              </li>
              <li>Apenas arquivos .xlsx ou .xls são aceitos</li>
              <li>Tamanho máximo: 5MB</li>
              <li>
                A importação desativa itens antigos mas preserva o histórico
              </li>
              <li>Prescrições antigas continuam com valores corretos</li>
            </ol>
          </div>

          <div className="aviso-box">
            <strong>⚠️ IMPORTANTE:</strong>
            <p>
              Ao importar uma nova planilha, os itens atuais serão desativados e
              não aparecerão mais na seleção de novas prescrições.
            </p>
            <p>
              Porém, o histórico é preservado e prescrições antigas continuarão
              exibindo os valores corretos nos relatórios.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Alerta Padronizado */}
      <ModalAlerta
        visivel={modalAlerta.visivel}
        titulo={modalAlerta.titulo}
        mensagem={modalAlerta.mensagem}
        tipo={modalAlerta.tipo}
        onConfirmar={modalAlerta.onConfirmar}
        onCancelar={() => setModalAlerta((prev) => ({ ...prev, visivel: false }))}
      />
    </div>
  );
}

export default GestaoImportacao;