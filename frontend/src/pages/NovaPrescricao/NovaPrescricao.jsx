// frontend/src/pages/NovaPrescricao/NovaPrescricao.jsx
import React, { useState } from 'react';
import './NovaPrescricao.css';
import ModalConfirmacao from '../../components/common/ModalConfirmacao';
import FormularioPaciente from '../../components/forms/FormularioPaciente';
import SeletorAcrescimos from '../../components/forms/SeletorAcrescimos';
import { criarPrescricao } from '../../services/api';

function NovaPrescricao({ 
  nucleos = {}, 
  dietas = [],
  restricoes = [],
  tiposAlimentacao = [], 
  etiquetas = [], 
  setEtiquetas, 
  irParaCadastros, 
  irParaImpressao, 
  irParaPreview 
}) {
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

  // ============================================
  // FUNÇÃO DE ORDENAÇÃO NATURAL DE LEITOS
  // ============================================
  const ordenarLeitosNatural = (leitos) => {
    return [...leitos].sort((a, b) => {
      // Extrai números e letras de cada leito
      const regex = /(\d+)|(\D+)/g;
      const aParts = String(a).match(regex) || [];
      const bParts = String(b).match(regex) || [];
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || '';
        const bPart = bParts[i] || '';
        
        // Se ambos forem números, comparar numericamente
        const aNum = parseInt(aPart);
        const bNum = parseInt(bPart);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          if (aNum !== bNum) {
            return aNum - bNum;
          }
        } else {
          // Comparação alfabética
          const comp = aPart.localeCompare(bPart);
          if (comp !== 0) {
            return comp;
          }
        }
      }
      
      return 0;
    });
  };

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
          acrescimosIds: []
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
        descricaoSemPrincipal: !configRefeicoes[refeicao].semPrincipal 
          ? configRefeicoes[refeicao].descricaoSemPrincipal 
          : ''
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

  const handleAcrescimosChange = (refeicao, acrescimosIds) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: {
        ...configRefeicoes[refeicao],
        acrescimosIds: acrescimosIds
      }
    });
  };

  const adicionarEtiqueta = (e) => {
    e.preventDefault();

    if (!formData.cpf || !formData.codigoAtendimento || !formData.convenio || 
        !formData.nomePaciente || !formData.nomeMae || !formData.dataNascimento || 
        !formData.nucleoSelecionado || !formData.leito) {
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
      acrescimosIds: configRefeicoes[refeicao].acrescimosIds
    }));

    setDadosParaConfirmar({
      ...formData,
      refeicoes: refeicoes
    });

    setMostrarConfirmacao(true);
  };

  const confirmarAdicao = async () => {
    try {
      const promessas = dadosParaConfirmar.refeicoes.map(async (refeicao) => {
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
          acrescimosIds: refeicao.acrescimosIds || []
        };

        return await criarPrescricao(prescricao);
      });

      await Promise.all(promessas);

      const novasEtiquetas = dadosParaConfirmar.refeicoes.map(refeicao => ({
        id: Date.now() + Math.random(),
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
        acrescimosIds: refeicao.acrescimosIds
      }));

      setEtiquetas([...etiquetas, ...novasEtiquetas]);
      
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

      alert(`✅ ${promessas.length} prescrição(ões) salva(s) com sucesso!`);

      document.querySelector('input[name="cpf"]')?.focus();

    } catch (erro) {
      console.error('Erro:', erro);
      alert(`❌ Erro: ${erro.message}`);
    }
  };

  const cancelarConfirmacao = () => {
    setMostrarConfirmacao(false);
    setDadosParaConfirmar(null);
  };

  // ============================================
  // LEITOS ORDENADOS EM ORDEM CRESCENTE
  // ============================================
  const leitosDisponiveis = formData.nucleoSelecionado 
    ? ordenarLeitosNatural(nucleos[formData.nucleoSelecionado] || [])
    : [];

  return (
    <div className="container">
      <div className="header-principal">
        <h1>Adicionar Etiquetas</h1>
      </div>

      <form className="formulario" onSubmit={adicionarEtiqueta}>
        <FormularioPaciente formData={formData} onChange={handleChange} />

        <div className="campo">
          <label>NÚCLEO *</label>
          <select name="nucleoSelecionado" value={formData.nucleoSelecionado} onChange={handleChange}>
            <option value="">Selecione o núcleo</option>
            {Object.keys(nucleos).map((nucleo, index) => (
              <option key={index} value={nucleo}>{nucleo}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label>LEITO *</label>
          <select name="leito" value={formData.leito} onChange={handleChange} disabled={!formData.nucleoSelecionado}>
            <option value="">Selecione o leito</option>
            {leitosDisponiveis.map((leito, index) => (
              <option key={index} value={leito}>{leito}</option>
            ))}
          </select>
          {!formData.nucleoSelecionado && (
            <small className="aviso-erro">⚠️ Selecione um núcleo primeiro</small>
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
            <small className="aviso-erro">⚠️ Nenhum tipo de refeição cadastrado</small>
          )}
        </div>

        {formData.refeicoesSelecionadas.map(refeicao => (
          <div key={refeicao} className="config-refeicao">
            <h3 className="titulo-refeicao">Configuração: {refeicao}</h3>
            
            <div className="campo">
              <label>DIETA * (para {refeicao})</label>
              <div className="opcoes-radio">
                <label className="opcao-check">
                  <input type="radio" name={`dieta-${refeicao}`} checked={configRefeicoes[refeicao]?.dieta === 'NORMAL'} onChange={() => handleDietaRefeicao(refeicao, 'NORMAL')} />
                  <span>NORMAL</span>
                </label>
                <label className="opcao-check">
                  <input type="radio" name={`dieta-${refeicao}`} checked={configRefeicoes[refeicao]?.dieta === 'LIQUIDA'} onChange={() => handleDietaRefeicao(refeicao, 'LIQUIDA')} />
                  <span>LIQUIDA</span>
                </label>
                <label className="opcao-check">
                  <input type="radio" name={`dieta-${refeicao}`} checked={configRefeicoes[refeicao]?.dieta === 'PASTOSA'} onChange={() => handleDietaRefeicao(refeicao, 'PASTOSA')} />
                  <span>PASTOSA</span>
                </label>
                <label className="opcao-check">
                  <input type="radio" name={`dieta-${refeicao}`} checked={configRefeicoes[refeicao]?.dieta === 'LIQUIDA PASTOSA'} onChange={() => handleDietaRefeicao(refeicao, 'LIQUIDA PASTOSA')} />
                  <span>LIQUIDA PASTOSA</span>
                </label>
              </div>
            </div>

            <div className="campo">
              <label>RESTRIÇÃO ALIMENTAR (para {refeicao})</label>
              <div className="opcoes-check">
                {restricoes.map(restricao => (
                  <label key={restricao.id} className="opcao-check">
                    <input 
                      type="checkbox" 
                      checked={configRefeicoes[refeicao]?.restricoes.includes(restricao.nome)} 
                      onChange={() => handleRestricaoRefeicao(refeicao, restricao.nome)} 
                    />
                    <span>{restricao.nome}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="campo">
              <label>SEM PRINCIPAL</label>
              <div className="campo-sem-principal">
                <label className="opcao-check-destaque">
                  <input type="checkbox" checked={configRefeicoes[refeicao]?.semPrincipal || false} onChange={() => handleSemPrincipalToggle(refeicao)} />
                  <span>Paciente NÃO quer o prato principal do cardápio</span>
                </label>
              </div>
              {configRefeicoes[refeicao]?.semPrincipal && (
                <input type="text" value={configRefeicoes[refeicao]?.descricaoSemPrincipal || ''} onChange={(e) => handleDescricaoSemPrincipal(refeicao, e.target.value)} placeholder="Descreva o que o paciente quer no lugar do principal" style={{ marginTop: '10px' }} />
              )}
            </div>

            <div className="campo">
              <label>OBS EXCLUSÃO (o que NÃO quer)</label>
              <input type="text" value={configRefeicoes[refeicao]?.obsExclusao || ''} onChange={(e) => handleObsExclusao(refeicao, e.target.value)} placeholder="Ex: s/ leite, s/ açúcar" />
            </div>

            <div className="campo">
              <label>ACRÉSCIMOS (o que quer ALÉM do cardápio)</label>
              <SeletorAcrescimos acrescimosSelecionados={configRefeicoes[refeicao]?.acrescimosIds || []} onChange={(ids) => handleAcrescimosChange(refeicao, ids)} refeicao={refeicao} />
            </div>
          </div>
        ))}

        <button type="submit" className="btn-adicionar">+ Adicionar à Fila (Enter)</button>
      </form>

      {mostrarConfirmacao && dadosParaConfirmar && (
        <ModalConfirmacao dados={dadosParaConfirmar} onConfirmar={confirmarAdicao} onCancelar={cancelarConfirmacao} />
      )}
    </div>
  );
}

export default NovaPrescricao;