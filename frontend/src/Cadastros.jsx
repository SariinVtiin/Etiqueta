import React, { useState } from 'react';
import './Cadastros.css';

function Cadastros({ tiposAlimentacao, setTiposAlimentacao, voltar }) {
  const [novoTipo, setNovoTipo] = useState('');

  const adicionarTipo = (e) => {
    e.preventDefault();
    if (novoTipo.trim()) {
      setTiposAlimentacao([...tiposAlimentacao, novoTipo.trim()]);
      setNovoTipo('');
    }
  };

  const removerTipo = (index) => {
    setTiposAlimentacao(tiposAlimentacao.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <div className="header-cadastro">
        <h1>Cadastros</h1>
        <button className="btn-voltar" onClick={voltar}>
          ← Voltar
        </button>
      </div>

      <div className="secao-cadastro">
        <h2>Tipos de Alimentação ({tiposAlimentacao.length})</h2>
        
        <form onSubmit={adicionarTipo} className="form-add">
          <input
            type="text"
            value={novoTipo}
            onChange={(e) => setNovoTipo(e.target.value)}
            placeholder="Digite o tipo (ex: Desjejum, Almoço...)"
          />
          <button type="submit">+ Adicionar</button>
        </form>

        <div className="lista-itens">
          {tiposAlimentacao.length === 0 ? (
            <p className="vazio">Nenhum tipo cadastrado</p>
          ) : (
            tiposAlimentacao.map((tipo, index) => (
              <div key={index} className="item">
                <span>{tipo}</span>
                <button onClick={() => removerTipo(index)}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="info-leitos">
        <h2>ℹ️ Informação sobre Leitos</h2>
        <p>Os leitos são organizados automaticamente por núcleo:</p>
        <ul>
          <li><strong>INTERNAÇÃO:</strong> Leitos 601 a 661</li>
          <li><strong>UTI PEDIÁTRICA:</strong> Leitos 501 a 515</li>
          <li><strong>UTI ADULTO:</strong> Leitos 541 a 556</li>
          <li><strong>UDT:</strong> Leitos 1 a 18</li>
          <li><strong>TMO:</strong> Leitos 301 a 314</li>
        </ul>
      </div>
    </div>
  );
}

export default Cadastros;