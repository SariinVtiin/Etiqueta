import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ImportarAcrescimos.css";

function ImportarAcrescimos() {
  const navigate = useNavigate();

  const [arquivo, setArquivo] = useState(null);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);

  // ✅ Base URL configurável (CRA)
  const API_BASE =
    process.env.REACT_APP_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3001";

  // ✅ Helper padrão com Bearer token
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

    // tenta json sempre
    const data = await res.json().catch(() => null);

    // se backend retornar 401/403 etc
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
      <div className="card-importacao">
        <div className="card-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div>
              <h2>Importar Acréscimos</h2>
              <p className="card-descricao">
                Importe a planilha Excel com os itens de acréscimo disponíveis
                para prescrições
              </p>
            </div>

            {/* ✅ Voltar padrão (rota) */}
            <button
              className="btn-voltar"
              onClick={() => navigate("/admin/cadastros")}
            >
              ← Voltar
            </button>
          </div>
        </div>

        <div className="card-body">
          {estatisticas && (
            <div className="estatisticas-box">
              <div className="stat-item">
                <span className="stat-label">Total de Itens:</span>
                <span className="stat-valor">{estatisticas.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Ativos:</span>
                <span className="stat-valor ativo">{estatisticas.ativos}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Inativos (histórico):</span>
                <span className="stat-valor inativo">
                  {estatisticas.inativos}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Última Importação:</span>
                <span className="stat-valor">
                  {formatarData(estatisticas.ultima_importacao)}
                </span>
              </div>
            </div>
          )}

          <div className="upload-section">
            <label className="file-label">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={importando}
                className="file-input"
              />
              <span className="file-button">
                📁 Selecionar Planilha (.xlsx)
              </span>
            </label>

            {arquivo && (
              <div className="arquivo-selecionado">
                <span className="arquivo-nome">{arquivo.name}</span>
                <span className="arquivo-tamanho">
                  ({(arquivo.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleImportar}
            disabled={!arquivo || importando}
            className="btn-importar"
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

export default ImportarAcrescimos;
