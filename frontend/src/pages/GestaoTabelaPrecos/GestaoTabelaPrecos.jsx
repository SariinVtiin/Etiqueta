import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  atualizarPrecoFaturamento,
  criarPrecoFaturamento,
  listarRefeicoes,
  listarTabelaPrecos,
  togglePrecoFaturamento,
} from "../../services/api";
import "./GestaoTabelaPrecos.css";

const initialForm = {
  id: null,
  categoria: "paciente",
  chave_dieta: "",
  tipo_refeicao_id: "",
  valor: "",
  observacao: "",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

export default function GestaoTabelaPrecos() {
  const { tiposAlimentacao = [] } = useOutletContext() || {};
  const [precos, setPrecos] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [tiposRefeicao, setTiposRefeicao] = useState([]);

  const carregarPrecos = async () => {
    try {
      setCarregando(true);
      const resposta = await listarTabelaPrecos(true);
      setPrecos(resposta.precos || []);
    } catch (error) {
      console.error("Erro ao carregar tabela de preços:", error);
      alert(error.message || "Erro ao carregar tabela de preços.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPrecos();
    carregarTiposRefeicao();
  }, []);

  const precosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return precos;

    return precos.filter((item) =>
      [
        item.categoria,
        item.chave_dieta,
        item.tipo_refeicao_nome,
        item.observacao,
      ]
        .filter(Boolean)
        .some((valor) => String(valor).toLowerCase().includes(termo)),
    );
  }, [busca, precos]);

  const carregarTiposRefeicao = async () => {
    try {
      const resposta = await listarRefeicoes();
      setTiposRefeicao(resposta?.refeicoes || []);
    } catch (error) {
      console.error("Erro ao carregar tipos de refeição:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setForm(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSalvando(true);
      const payload = {
        categoria: form.categoria,
        chave_dieta: form.chave_dieta,
        tipo_refeicao_id: Number(form.tipo_refeicao_id),
        valor: Number(form.valor),
        observacao: form.observacao,
      };

      if (form.id) {
        await atualizarPrecoFaturamento(form.id, payload);
      } else {
        await criarPrecoFaturamento(payload);
      }

      resetForm();
      carregarPrecos();
    } catch (error) {
      console.error("Erro ao salvar preço:", error);
      alert(error.message || "Erro ao salvar preço.");
    } finally {
      setSalvando(false);
    }
  };

  const handleEditar = (item) => {
    setForm({
      id: item.id,
      categoria: item.categoria,
      chave_dieta: item.chave_dieta,
      tipo_refeicao_id: String(item.tipo_refeicao_id),
      valor: String(item.valor),
      observacao: item.observacao || "",
    });
  };

  const handleToggle = async (item) => {
    try {
      await togglePrecoFaturamento(
        item.id,
        !(item.ativo === 1 || item.ativo === true),
      );
      carregarPrecos();
    } catch (error) {
      console.error("Erro ao alterar status do preço:", error);
      alert(error.message || "Erro ao alterar status do preço.");
    }
  };

  const opcoesRefeicao =
    tiposRefeicao.length > 0 ? tiposRefeicao : tiposAlimentacao;

  return (
    <div className="gtp-page">
      <header className="gtp-header">
        <div>
          <h1>Tabela de Preços</h1>
          <p>Cadastre e ajuste os valores usados pelo faturamento analítico.</p>
        </div>
      </header>

      <section className="gtp-form-box">
        <form className="gtp-form" onSubmit={handleSubmit}>
          <label>
            <span>Categoria</span>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
            >
              <option value="paciente">Paciente</option>
              <option value="acompanhante">Acompanhante</option>
            </select>
          </label>

          <label>
            <span>Chave da dieta</span>
            <input
              name="chave_dieta"
              value={form.chave_dieta}
              onChange={handleChange}
              placeholder="Ex.: NORMAL ADULTO"
              required
            />
          </label>

          <label>
            <span>Tipo de refeição</span>
            <select
              name="tipo_refeicao_id"
              value={form.tipo_refeicao_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {opcoesRefeicao.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Valor</span>
            <input
              name="valor"
              type="number"
              min="0"
              step="0.0001"
              value={form.valor}
              onChange={handleChange}
              required
            />
          </label>

          <label className="gtp-col-span-2">
            <span>Observação</span>
            <input
              name="observacao"
              value={form.observacao}
              onChange={handleChange}
              placeholder="Opcional"
            />
          </label>

          <div className="gtp-form-actions gtp-col-span-2">
            <button
              type="submit"
              className="gtp-btn gtp-btn-primary"
              disabled={salvando}
            >
              {salvando
                ? "Salvando..."
                : form.id
                  ? "Atualizar preço"
                  : "Cadastrar preço"}
            </button>
            <button
              type="button"
              className="gtp-btn gtp-btn-secondary"
              onClick={resetForm}
            >
              Limpar
            </button>
          </div>
        </form>
      </section>

      <section className="gtp-table-box">
        <div className="gtp-toolbar">
          <input
            className="gtp-search"
            placeholder="Buscar por categoria, chave ou refeição"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {carregando ? (
          <div className="gtp-empty">Carregando tabela de preços...</div>
        ) : (
          <div className="gtp-table-wrapper">
            <table className="gtp-table">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Chave da dieta</th>
                  <th>Refeição</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Observação</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {precosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="gtp-empty-row">
                      Nenhum preço encontrado.
                    </td>
                  </tr>
                ) : (
                  precosFiltrados.map((item) => (
                    <tr key={item.id}>
                      <td>{item.categoria}</td>
                      <td>{item.chave_dieta}</td>
                      <td>{item.tipo_refeicao_nome}</td>
                      <td>{formatCurrency(item.valor)}</td>
                      <td>
                        <span
                          className={`gtp-badge ${item.ativo ? "is-active" : "is-inactive"}`}
                        >
                          {item.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td>{item.observacao || "-"}</td>
                      <td>
                        <div className="gtp-actions">
                          <button
                            className="gtp-btn-link"
                            type="button"
                            onClick={() => handleEditar(item)}
                          >
                            Editar
                          </button>
                          <button
                            className="gtp-btn-link"
                            type="button"
                            onClick={() => handleToggle(item)}
                          >
                            {item.ativo ? "Desativar" : "Ativar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
