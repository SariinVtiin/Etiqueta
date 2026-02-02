// frontend/src/pages/NovaPrescricao/NovaPrescricao.jsx
import React, { useState } from 'react';
import './NovaPrescricao.css';
import ModalConfirmacao from '../../components/common/ModalConfirmacao';
import FormularioPaciente from '../../components/forms/FormularioPaciente';
import { criarPrescricao, criarEtiqueta } from '../../services/api';

function NovaPrescricao({ nucleos, dietas, tiposAlimentacao, etiquetas, setEtiquetas, irParaCadastros, irParaImpressao, irParaPreview }) {
  const [formData, setFormData] = useState({
    cpf: '',
    codigoAtendimento: '',
    convenio: '',
    nomePaciente: '',
    nomeMae: '',
    dataNascimento: '',
    idade: '',
    nucleoSelecionado: '',
    leito: '',
    refeicoesSelecionadas: []
  });

  const [configRefeicoes, setConfigRefeicoes] = useState({});
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [dadosParaConfirmar, setDadosParaConfirmar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'nucleoSelecionado') {
      setFormData({
        ...formData,
        nucleoSelecionado: value,
        leito: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleRefeicaoToggle = (refeicao) => {
    const refeicoesAtuais = [...formData.refeicoesSelecionadas];
    const index = refeicoesAtuais.indexOf(refeicao);
    
    if (index > -1) {
      refeicoesAtuais.splice(index, 1);
      const novaConfig = { ...configRefeicoes };
      delete novaConfig[refeicao];
      setConfigRefeicoes(novaConfig);
    } else {
      refeicoesAtuais.push(refeicao);
      setConfigRefeicoes({
        ...configRefeicoes,
        [refeicao]: {
          dieta: '',
          restricoes: [],
          semPrincipal: false,
          descricaoSemPrincipal: '',
          obsExclusao: '',
          obsAcrescimo: ''
        }
      });
    }
    
    setFormData({
      ...formData,
      refeicoesSelecionadas: refeicoesAtuais
    });
  };

  const handleDietaRefeicao = (refeicao, dieta) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        dieta: dieta
      }
    });
  };

  const handleRestricaoRefeicao = (refeicao, restricao) => {
    const restricoesAtuais = configRefeicoes[refeicao].restricoes;
    const novasRestricoes = restricoesAtuais.includes(restricao)
      ? restricoesAtuais.filter(r => r !== restricao)
      : [...restricoesAtuais, restricao];
    
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        restricoes: novasRestricoes
      }
    });
  };

  const handleSemPrincipalToggle = (refeicao) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        semPrincipal: !configRefeicoes[refeicao].semPrincipal,
        descricaoSemPrincipal: ''
      }
    });
  };

  const handleDescricaoSemPrincipal = (refeicao, descricao) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        descricaoSemPrincipal: descricao
      }
    });
  };

  const handleObsExclusao = (refeicao, obs) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        obsExclusao: obs
      }
    });
  };

  const handleObsAcrescimo = (refeicao, obs) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        obsAcrescimo: obs
      }
    });
  };

  const adicionarEtiqueta = (e) => {
    e.preventDefault();
    
    if (!formData.cpf || !formData.codigoAtendimento || !formData.convenio || !formData.nomePaciente || !formData.nomeMae || !formData.dataNascimento || !formData.leito) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    if (formData.codigoAtendimento.length !== 7) {
      alert('O código de atendimento deve ter exatamente 7 dígitos!');
      return;
    }

    if (formData.refeicoesSelecionadas.length === 0) {
      alert('Selecione pelo menos uma refeição!');
      return;
    }

    for (const refeicao of formData.refeicoesSelecionadas) {
      if (!configRefeicoes[refeicao].dieta) {
        alert(`Selecione a dieta para ${refeicao}!`);
        return;
      }
    }

    const refeicoes = formData.refeicoesSelecionadas.map(refeicao => ({
      tipo: refeicao,
      dieta: configRefeicoes[refeicao].dieta,
      restricoes: configRefeicoes[refeicao].restricoes,
      semPrincipal: configRefeicoes[refeicao].semPrincipal,
      descricaoSemPrincipal: configRefeicoes[refeicao].descricaoSemPrincipal,
      obsExclusao: configRefeicoes[refeicao].obsExclusao,
      obsAcrescimo: configRefeicoes[refeicao].obsAcrescimo
    }));

    setDadosParaConfirmar({
      ...formData,
      refeicoes: refeicoes
    });

    setMostrarConfirmacao(true);
  };

  // ===================================================================
  // FUNÇÃO CORRIGIDA - confirmarAdicao
  // ===================================================================
  const confirmarAdicao = async () => {
    try {
      console.log('📋 Iniciando salvamento de prescrições e etiquetas...');
      
      // ETAPA 1: Criar as prescrições no banco de dados
      const promessasPrescricoes = dadosParaConfirmar.refeicoes.map(async (refeicao) => {
        // Converter data de DD/MM/AAAA para AAAA-MM-DD
        const partesData = dadosParaConfirmar.dataNascimento.split('/');
        const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

        const prescricao = {
          cpf: dadosParaConfirmar.cpf,
          codigoAtendimento: dadosParaConfirmar.codigoAtendimento,
          convenio: dadosParaConfirmar.convenio,
          nomePaciente: dadosParaConfirmar.nomePaciente,
          nomeMae: dadosParaConfirmar.nomeMae,
          dataNascimento: dataFormatada,
          idade: parseInt(dadosParaConfirmar.idade),
          nucleo: dadosParaConfirmar.nucleoSelecionado,
          leito: dadosParaConfirmar.leito,
          tipoAlimentacao: refeicao.tipo,
          dieta: refeicao.dieta,
          restricoes: refeicao.restricoes,
          semPrincipal: refeicao.semPrincipal || false,
          descricaoSemPrincipal: refeicao.descricaoSemPrincipal || '',
          obsExclusao: refeicao.obsExclusao || '',
          obsAcrescimo: refeicao.obsAcrescimo || ''
        };

        console.log('💾 Salvando prescrição:', prescricao);
        return await criarPrescricao(prescricao);
      });

      // Aguardar todas as prescrições serem salvas
      const resultadosPrescricoes = await Promise.all(promessasPrescricoes);
      console.log('✅ Prescrições salvas:', resultadosPrescricoes);

      // ETAPA 2: Criar etiquetas no banco de dados via API
      const promessasEtiquetas = dadosParaConfirmar.refeicoes.map(async (refeicao) => {
        const etiqueta = {
          leito: dadosParaConfirmar.leito,
          dieta: refeicao.dieta,
          obs1: refeicao.restricoes?.length > 0 ? refeicao.restricoes.join(', ') : null,
          obs2: refeicao.obsExclusao || null,
          obs3: refeicao.obsAcrescimo || null,
          usuario: dadosParaConfirmar.nomePaciente // ou use nome do usuário logado
        };

        console.log('🏷️ Criando etiqueta:', etiqueta);
        return await criarEtiqueta(etiqueta);
      });

      // Aguardar todas as etiquetas serem criadas
      const resultadosEtiquetas = await Promise.all(promessasEtiquetas);
      console.log('✅ Etiquetas criadas:', resultadosEtiquetas);

      // ETAPA 3: Atualizar a fila local de etiquetas (para exibição na interface)
      const novasEtiquetas = dadosParaConfirmar.refeicoes.map((refeicao, index) => ({
        // Usar o ID retornado pelo banco de dados se disponível
        id: resultadosEtiquetas[index]?.id || (Date.now() + Math.random()),
        cpf: dadosParaConfirmar.cpf,
        codigoAtendimento: dadosParaConfirmar.codigoAtendimento,
        convenio: dadosParaConfirmar.convenio,
        nomePaciente: dadosParaConfirmar.nomePaciente,
        nomeMae: dadosParaConfirmar.nomeMae,
        dataNascimento: dadosParaConfirmar.dataNascimento,
        idade: dadosParaConfirmar.idade,
        nucleo: dadosParaConfirmar.nucleoSelecionado,
        leito: dadosParaConfirmar.leito,
        tipoAlimentacao: refeicao.tipo,
        dieta: refeicao.dieta,
        restricoes: refeicao.restricoes,
        semPrincipal: refeicao.semPrincipal,
        descricaoSemPrincipal: refeicao.descricaoSemPrincipal,
        obsExclusao: refeicao.obsExclusao,
        obsAcrescimo: refeicao.obsAcrescimo,
        status_impressao: 'pendente' // Adicionar status
      }));

      setEtiquetas([...etiquetas, ...novasEtiquetas]);
      
      // Limpar formulário
      setFormData({
        cpf: '',
        codigoAtendimento: '',
        convenio: '',
        nomePaciente: '',
        nomeMae: '',
        dataNascimento: '',
        idade: '',
        nucleoSelecionado: '',
        leito: '',
        refeicoesSelecionadas: []
      });
      setConfigRefeicoes({});
      setMostrarConfirmacao(false);
      setDadosParaConfirmar(null);

      console.log('🎉 Processo concluído com sucesso!');
      alert(`✅ ${promessasPrescricoes.length} prescrição(ões) e ${promessasEtiquetas.length} etiqueta(s) salvas com sucesso!`);

      // Voltar foco para o início do formulário
      document.querySelector('input[name="cpf"]')?.focus();

    } catch (erro) {
      console.error('❌ Erro detalhado:', erro);
      
      // Mensagem de erro mais detalhada
      let mensagemErro = 'Erro desconhecido';
      
      if (erro.message) {
        mensagemErro = erro.message;
      }
      
      if (erro.response) {
        mensagemErro = `Erro do servidor: ${erro.response.statusText}`;
      }
      
      alert(`❌ Erro ao salvar: ${mensagemErro}\n\nVerifique o console (F12) para mais detalhes.`);
    }
  };

  const cancelarConfirmacao = () => {
    setMostrarConfirmacao(false);
    setDadosParaConfirmar(null);
  };

  const leitosDisponiveis = formData.nucleoSelecionado ? nucleos[formData.nucleoSelecionado] : [];

  // Filtrar dietas ativas
  const dietasFiltradas = dietas.filter(d => d.ativa);

  return (
    <div className="container">
      <div className="header-principal">
        <h1>Adicionar Etiquetas</h1>
        <div className="btn-group">
          <button className="btn-preview-layout" onClick={irParaPreview}>
            👁️ Preview Layout
          </button>
          <button className="btn-fila" onClick={irParaImpressao}>
            🖨️ Fila de Impressão {etiquetas.length > 0 && `(${etiquetas.length})`}
          </button>
          <button className="btn-cadastros" onClick={irParaCadastros}>
            ⚙️ Cadastros
          </button>
        </div>
      </div>

      <form className="formulario" onSubmit={adicionarEtiqueta}>
        <FormularioPaciente formData={formData} onChange={handleChange} />

        <div className="campo">
          <label>NÚCLEO *</label>
          <select
            name="nucleoSelecionado"
            value={formData.nucleoSelecionado}
            onChange={handleChange}
          >
            <option value="">Selecione o núcleo</option>
            {Object.keys(nucleos).map((nucleo, index) => (
              <option key={index} value={nucleo}>{nucleo}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>LEITO *</label>
          <select
            name="leito"
            value={formData.leito}
            onChange={handleChange}
            disabled={!formData.nucleoSelecionado}
          >
            <option value="">Selecione o leito</option>
            {leitosDisponiveis.map((leito, index) => (
              <option key={index} value={leito}>{leito}</option>
            ))}
          </select>
          {!formData.nucleoSelecionado && (
            <small className="aviso-erro">
              ⚠️ Selecione um núcleo primeiro
            </small>
          )}
        </div>

        <div className="campo">
          <label>REFEIÇÕES * (selecione uma ou mais)</label>
          <div className="opcoes-check">
            {tiposAlimentacao.map((tipo, index) => (
              <label key={index} className="opcao-check">
                <input
                  type="checkbox"
                  checked={formData.refeicoesSelecionadas.includes(tipo)}
                  onChange={() => handleRefeicaoToggle(tipo)}
                />
                <span>{tipo}</span>
              </label>
            ))}
          </div>
          {tiposAlimentacao.length === 0 && (
            <small className="aviso-erro">
              ⚠️ Nenhum tipo cadastrado. Vá em Cadastros para adicionar.
            </small>
          )}
        </div>

        {formData.refeicoesSelecionadas.map(refeicao => (
          <div key={refeicao} className="config-refeicao">
            <h3 className="titulo-refeicao">⚙️ Configurações para {refeicao}</h3>

            <div className="campo">
              <label>DIETA * (para {refeicao})</label>
              <div className="opcoes-check">
                {dietasFiltradas.map(dieta => (
                  <label key={dieta.id} className="opcao-check">
                    <input
                      type="radio"
                      name={`dieta-${refeicao}`}
                      checked={configRefeicoes[refeicao]?.dieta === dieta.nome}
                      onChange={() => handleDietaRefeicao(refeicao, dieta.nome)}
                    />
                    <span>{dieta.nome}</span>
                  </label>
                ))}
              </div>
              {dietasFiltradas.length === 0 && (
                <small className="aviso-erro">
                  ⚠️ Nenhuma dieta cadastrada. Vá em Cadastros → Dietas para adicionar.
                </small>
              )}
            </div>

            <div className="campo">
              <label>RESTRIÇÃO ALIMENTAR (para {refeicao})</label>
              <div className="opcoes-check">
                {['HPS', 'HPL', 'LAX', 'OBT', 'DM', 'IRC', 'CRUS', 'Pediatria', 'Restrita a Vitamina K'].map(restricao => (
                  <label key={restricao} className="opcao-check">
                    <input
                      type="checkbox"
                      checked={configRefeicoes[refeicao]?.restricoes.includes(restricao)}
                      onChange={() => handleRestricaoRefeicao(refeicao, restricao)}
                    />
                    <span>{restricao}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>SEM PRINCIPAL</label>
              <div className="campo-sem-principal">
                <label className="opcao-check-destaque">
                  <input
                    type="checkbox"
                    checked={configRefeicoes[refeicao]?.semPrincipal || false}
                    onChange={() => handleSemPrincipalToggle(refeicao)}
                  />
                  <span>Paciente NÃO quer o prato principal do cardápio</span>
                </label>
              </div>
              {configRefeicoes[refeicao]?.semPrincipal && (
                <input
                  type="text"
                  value={configRefeicoes[refeicao]?.descricaoSemPrincipal || ''}
                  onChange={(e) => handleDescricaoSemPrincipal(refeicao, e.target.value)}
                  placeholder="Descreva o que o paciente quer no lugar do principal"
                  style={{ marginTop: '10px' }}
                />
              )}
            </div>

            <div className="campo">
              <label>OBS EXCLUSÃO (o que NÃO quer)</label>
              <input
                type="text"
                value={configRefeicoes[refeicao]?.obsExclusao || ''}
                onChange={(e) => handleObsExclusao(refeicao, e.target.value)}
                placeholder="Ex: s/ leite, s/ açúcar"
              />
            </div>

            <div className="campo">
              <label>OBS ACRÉSCIMO (o que quer ALÉM do cardápio)</label>
              <input
                type="text"
                value={configRefeicoes[refeicao]?.obsAcrescimo || ''}
                onChange={(e) => handleObsAcrescimo(refeicao, e.target.value)}
                placeholder="Ex: c/ biscoito, c/ suco"
              />
            </div>
          </div>
        ))}

        <button type="submit" className="btn-adicionar">
          + Adicionar à Fila (Enter)
        </button>
      </form>

      {mostrarConfirmacao && dadosParaConfirmar && (
        <ModalConfirmacao
          dados={dadosParaConfirmar}
          onConfirmar={confirmarAdicao}
          onCancelar={cancelarConfirmacao}
        />
      )}
    </div>
  );
}

export default NovaPrescricao;