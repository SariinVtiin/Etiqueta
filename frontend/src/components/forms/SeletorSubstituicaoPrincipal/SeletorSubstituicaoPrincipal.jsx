import React, { useState, useEffect } from "react";
import { listarSubstituicoesPrincipal } from "../../../services/api";
import "./SeletorSubstituicaoPrincipal.css";

function SeletorSubstituicaoPrincipal({ itensSelecionados = [], onChange }) {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [abertas, setAbertas] = useState({});

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const resposta = await listarSubstituicoesPrincipal(false);
        if (resposta.sucesso) {
          setCategorias(
            resposta.categorias.filter((cat) => cat.itens && cat.itens.length > 0)
          );
        }
      } catch (err) {
        console.error("Erro ao carregar substituições:", err);
        setErro("Erro ao carregar opções");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const todosItens = categorias.flatMap((cat) =>
    (cat.itens || []).map((item) => ({
      ...item,
      nomeCompleto: `${cat.nome} ${item.nome}`,
    }))
  );

  const gerarDescricao = (ids) =>
    ids
      .map((id) => todosItens.find((item) => item.id === id)?.nomeCompleto)
      .filter(Boolean)
      .join(", ");

  const toggleAberta = (catId) => {
    setAbertas((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleItem = (itemId) => {
    const novosIds = itensSelecionados.includes(itemId)
      ? itensSelecionados.filter((id) => id !== itemId)
      : [...itensSelecionados, itemId];
    onChange(novosIds, gerarDescricao(novosIds));
  };

  // Conta quantos itens selecionados por categoria
  const contarSelecionados = (cat) =>
    (cat.itens || []).filter((item) => itensSelecionados.includes(item.id)).length;

  if (carregando) {
    return <div className="ssp-loading">Carregando opções...</div>;
  }

  if (erro) {
    return <div className="ssp-erro">{erro}</div>;
  }

  if (categorias.length === 0) {
    return <div className="ssp-vazio">Nenhuma opção cadastrada</div>;
  }

  return (
    <div className="ssp-wrapper">
      <div className="ssp-categorias">
        {categorias.map((cat) => {
          const aberta = abertas[cat.id];
          const qtdSel = contarSelecionados(cat);

          return (
            <div key={cat.id} className={`ssp-cat ${aberta ? "ssp-cat-aberta" : ""}`}>
              <button
                type="button"
                className={`ssp-cat-btn ${qtdSel > 0 ? "ssp-cat-btn-ativa" : ""}`}
                onClick={() => toggleAberta(cat.id)}
              >
                <span className="ssp-cat-seta">{aberta ? "▾" : "▸"}</span>
                <span className="ssp-cat-nome">{cat.nome}</span>
                {qtdSel > 0 && <span className="ssp-cat-badge">{qtdSel}</span>}
              </button>

              {aberta && (
                <div className="ssp-itens">
                  {(cat.itens || []).map((item) => {
                    const selecionado = itensSelecionados.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className={`ssp-item ${selecionado ? "ssp-item-ativo" : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={selecionado}
                          onChange={() => toggleItem(item.id)}
                        />
                        <span>{item.nome}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {itensSelecionados.length > 0 && (
        <div className="ssp-resumo">
          Substituição: <strong>{gerarDescricao(itensSelecionados)}</strong>
        </div>
      )}
    </div>
  );
}

export default SeletorSubstituicaoPrincipal;