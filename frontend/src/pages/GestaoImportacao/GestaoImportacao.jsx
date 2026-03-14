// frontend/src/pages/GestaoImportacao/GestaoImportacao.jsx
// ============================================
// SALUSVITA TECH - IMPORTAR ACRÉSCIMOS
// Desenvolvido por FerMax Solution
// ============================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GestaoImportacao.css";

function GestaoImportacao() {
  const navigate = useNavigate();

  const [arquivo, setArquivo] = useState(null);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);

  // Base URL configurável (CRA)
  const API_BASE =
    process.env.REACT_APP_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3001";

  // Helper padrão com Bearer token
  const apiFetch = async (path, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    };

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const msg =
        (data && (data.erro || data.message)) ||
        `Erro HTTP ${res.status} ao chamar ${path}`;
      throw new Error(msg);
    }

    return data;
  };

  useEffect(() => {
    carregarEstatisticas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const data = await apiFetch("/api/acrescimos/estatisticas");
      if (data?.sucesso) setEstatisticas(data.estatisticas);
    } catch (erro) {
      console.error("Erro ao carregar estatísticas:", erro);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      const extensao = file.name.split(".").pop().toLowerCase();
      if (extensao !== "xlsx" && extensao !== "xls") {
        alert("Apenas arquivos .xlsx ou .xls são permitidos!");
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Arquivo muito grande! Máximo: 5MB");
        e.target.value = "";
        return;
      }

      setArquivo(file);
      setResultado(null);
    }
  };

  const handleImportar = async () => {
    if (!arquivo) {
      alert("Selecione um arquivo primeiro!");
      return;
    }

    const confirmacao = window.confirm(
      `ATENÇÃO!\n\n` +
        `Esta ação irá:\n` +
        `1. DESATIVAR todos os ${estatisticas?.ativos || 0} itens atuais\n` +
        `2. IMPORTAR os novos itens da planilha\n\n` +
        `Prescrições antigas continuarão com valores corretos.\n\n` +
        `Deseja continuar?`,
    );

    if (!confirmacao) return;

    setImportando(true);
    setResultado(null);

    try {
      const formData = new FormData();
      formData.append("arquivo", arquivo);

      const data = await apiFetch("/api/acrescimos/importar", {
        method: "POST",
        body: formData,
      });

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
    </div>
  );
}

export default GestaoImportacao;