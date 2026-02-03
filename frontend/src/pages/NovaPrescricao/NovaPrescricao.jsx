import React, { useState } from 'react';
import './NovaPrescricao.css';
import ModalConfirmacao from '../../components/common/ModalConfirmacao';
import { criarPrescricao } from '../../services/api';

function NovaPrescricao({ nucleos, dietas, tiposAlimentacao, etiquetas, setEtiquetas, irParaCadastros, irParaImpressao, irParaPreview, isAdmin }) {
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

  // Formatação automática do CPF
  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 3) return numeros;
    if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
    if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
  };

  // Formatação automática da data de nascimento
  const formatarDataNascimento = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  };

  // Calcular idade automaticamente
  const calcularIdade = (dataNascimento) => {
    if (dataNascimento.length !== 10) return '';
    const [dia, mes, ano] = dataNascimento.split('/');
    const hoje = new Date();
    const nascimento = new Date(ano, mes - 1, dia);
    if (nascimento > hoje || isNaN(nascimento.getTime())) return '';
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNasc = nascimento.getMonth();
    if (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade >= 0 ? String(idade) : '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setFormData({ ...formData, cpf: formatarCPF(value) });
    } else if (name === 'dataNascimento') {
      const dataFormatada = formatarDataNascimento(value);
      const idade = calcularIdade(dataFormatada);
      setFormData({ ...formData, dataNascimento: dataFormatada, idade });
    } else if (name === 'nucleoSelecionado') {
      setFormData({ ...formData, nucleoSelecionado: value, leito: '' });
    } else {
      setFormData({ ...formData, [name]: value });
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
        [refeicao]: { dieta: '', restricoes: [], semPrincipal: false, descricaoSemPrincipal: '', obsExclusao: '', obsAcrescimo: '' }
      });
    }
    setFormData({ ...formData, refeicoesSelecionadas: refeicoesAtuais });
  };

  const handleDietaRefeicao = (refeicao, dieta) => {
    setConfigRefeicoes({ ...configRefeicoes, [refeicao]: { ...configRefeicoes[refeicao], dieta } });
  };

  const handleRestricaoRefeicao = (refeicao, restricao) => {
    const restricoesAtuais = configRefeicoes[refeicao]?.restricoes || [];
    const novasRestricoes = restricoesAtuais.includes(restricao)
      ? restricoesAtuais.filter(r => r !== restricao)
      : [...restricoesAtuais, restricao];
    setConfigRefeicoes({ ...configRefeicoes, [refeicao]: { ...configRefeicoes[refeicao], restricoes: novasRestricoes } });
  };

  const handleSemPrincipalToggle = (refeicao) => {
    setConfigRefeicoes({
      ...configRefeicoes,
      [refeicao]: { ...configRefeicoes[refeicao], semPrincipal: !configRefeicoes[refeicao]?.semPrincipal, descricaoSemPrincipal: '' }
    });
  };

  const handleDescricaoSemPrincipal = (refeicao, descricao) => {
    setConfigRefeicoes({ ...configRefeicoes, [refeicao]: { ...configRefeicoes[refeicao], descricaoSemPrincipal: descricao } });
  };

  const handleObsExclusao = (refeicao, obs) => {
    setConfigRefeicoes({ ...configRefeicoes, [refeicao]: { ...configRefeicoes[refeicao], obsExclusao: obs } });
  };

  const handleObsAcrescimo = (refeicao, obs) => {
    setConfigRefeicoes({ ...configRefeicoes, [refeicao]: { ...configRefeicoes[refeicao], obsAcrescimo: obs } });
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
      if (!configRefeicoes[refeicao]?.dieta) {
        alert(`Selecione a dieta para ${refeicao}!`);
        return;
      }
    }
    const refeicoes = formData.refeicoesSelecionadas.map(refeicao => ({
      tipo: refeicao,
      dieta: configRefeicoes[refeicao].dieta,
      restricoes: configRefeicoes[refeicao].restricoes || [],
      semPrincipal: configRefeicoes[refeicao].semPrincipal || false,
      descricaoSemPrincipal: configRefeicoes[refeicao].descricaoSemPrincipal || '',
      obsExclusao: configRefeicoes[refeicao].obsExclusao || '',
      obsAcrescimo: configRefeicoes[refeicao].obsAcrescimo || ''
    }));
    setDadosParaConfirmar({ ...formData, refeicoes });
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
          obsAcrescimo: refeicao.obsAcrescimo || ''
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
        obsAcrescimo: refeicao.obsAcrescimo
      }));
      setEtiquetas([...etiquetas, ...novasEtiquetas]);
      setFormData({ cpf: '', codigoAtendimento: '', convenio: '', nomePaciente: '', nomeMae: '', dataNascimento: '', idade: '', nucleoSelecionado: '', leito: '', refeicoesSelecionadas: [] });
      setConfigRefeicoes({});
      setMostrarConfirmacao(false);
      setDadosParaConfirmar(null);
      alert(`${promessas.length} prescrição(ões) salva(s) com sucesso!`);
    } catch (erro) {
      console.error('Erro ao salvar prescrições:', erro);
      alert(`Erro ao salvar prescrições: ${erro.message}`);
    }
  };

  const cancelarConfirmacao = () => {
    setMostrarConfirmacao(false);
    setDadosParaConfirmar(null);
  };

  const leitosDisponiveis = formData.nucleoSelecionado ? nucleos[formData.nucleoSelecionado] || [] : [];
  const restricoesDisponiveis = ['HPS', 'HPL', 'LAX', 'OBT', 'DM', 'IRC', 'CRUS', 'Pediatria', 'Restrita a Vitamina K'];

  return (
    <div className="np-page">
      {/* Header */}
      <header className="np-header">
        <div className="np-header-left">
          <div className="np-header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            </svg>
          </div>
          <div className="np-header-text">
            <h1>Nova Prescrição</h1>
            <p>Cadastre a prescrição alimentar do paciente</p>
          </div>
        </div>
        <div className="np-header-actions">
          <button type="button" className="np-btn-action" onClick={irParaPreview}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Preview</span>
          </button>
          <button type="button" className="np-btn-action np-btn-badge" onClick={irParaImpressao}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
            <span>Impressão</span>
            {etiquetas.length > 0 && <span className="np-badge-count">{etiquetas.length}</span>}
          </button>
          {isAdmin && (
            <button type="button" className="np-btn-action" onClick={irParaCadastros}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>Cadastros</span>
            </button>
          )}
        </div>
      </header>

      {/* Formulário */}
      <form className="np-form" onSubmit={adicionarEtiqueta}>
        
        {/* Seção: Identificação */}
        <section className="np-card">
          <div className="np-card-header">
            <div className="np-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
            </div>
            <h2>Identificação</h2>
          </div>
          <div className="np-card-body">
            <div className="np-row np-row-3">
              <div className="np-field">
                <label className="np-label">CPF *</label>
                <input type="text" className="np-input" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" maxLength="14" />
              </div>
              <div className="np-field">
                <label className="np-label">Código de Atendimento *</label>
                <input type="text" className="np-input" name="codigoAtendimento" value={formData.codigoAtendimento} onChange={handleChange} placeholder="0000000" maxLength="7" />
                {formData.codigoAtendimento && formData.codigoAtendimento.length !== 7 && (
                  <span className="np-hint np-error">Deve ter 7 dígitos</span>
                )}
              </div>
              <div className="np-field">
                <label className="np-label">Convênio *</label>
                <div className="np-convenio-group">
                  {['SUS', 'Convênio', 'Particular'].map(conv => (
                    <label key={conv} className={`np-convenio-btn ${formData.convenio === conv ? 'np-selected' : ''}`}>
                      <input type="radio" name="convenio" value={conv} checked={formData.convenio === conv} onChange={handleChange} />
                      <span>{conv}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Dados do Paciente */}
        <section className="np-card">
          <div className="np-card-header">
            <div className="np-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2>Dados do Paciente</h2>
          </div>
          <div className="np-card-body">
            <div className="np-row np-row-2">
              <div className="np-field">
                <label className="np-label">Nome do Paciente *</label>
                <input type="text" className="np-input" name="nomePaciente" value={formData.nomePaciente} onChange={handleChange} placeholder="Nome completo do paciente" />
              </div>
              <div className="np-field">
                <label className="np-label">Nome da Mãe *</label>
                <input type="text" className="np-input" name="nomeMae" value={formData.nomeMae} onChange={handleChange} placeholder="Nome completo da mãe" />
              </div>
            </div>
            <div className="np-row np-row-2">
              <div className="np-field">
                <label className="np-label">Data de Nascimento *</label>
                <input type="text" className="np-input" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} placeholder="DD/MM/AAAA" maxLength="10" />
                {formData.idade && <span className="np-hint np-success">Idade: {formData.idade} anos</span>}
                {formData.dataNascimento.length === 10 && !formData.idade && <span className="np-hint np-error">Data inválida</span>}
              </div>
              <div className="np-field" />
            </div>
          </div>
        </section>

        {/* Seção: Localização */}
        <section className="np-card">
          <div className="np-card-header">
            <div className="np-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/>
              </svg>
            </div>
            <h2>Localização</h2>
          </div>
          <div className="np-card-body">
            <div className="np-row np-row-2">
              <div className="np-field">
                <label className="np-label">Núcleo/Setor *</label>
                <select className="np-select" name="nucleoSelecionado" value={formData.nucleoSelecionado} onChange={handleChange}>
                  <option value="">Selecione o núcleo</option>
                  {Object.keys(nucleos).map(nucleo => (
                    <option key={nucleo} value={nucleo}>{nucleo}</option>
                  ))}
                </select>
              </div>
              <div className="np-field">
                <label className="np-label">Leito *</label>
                <select className="np-select" name="leito" value={formData.leito} onChange={handleChange} disabled={!formData.nucleoSelecionado}>
                  <option value="">Selecione o leito</option>
                  {leitosDisponiveis.map(leito => (
                    <option key={leito} value={leito}>{leito}</option>
                  ))}
                </select>
                {!formData.nucleoSelecionado && <span className="np-hint np-warning">Selecione um núcleo primeiro</span>}
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Refeições */}
        <section className="np-card">
          <div className="np-card-header">
            <div className="np-card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/>
              </svg>
            </div>
            <h2>Refeições</h2>
            <span className="np-card-hint">Selecione uma ou mais</span>
          </div>
          <div className="np-card-body">
            <div className="np-refeicoes">
              {tiposAlimentacao.map(tipo => (
                <label key={tipo} className={`np-refeicao ${formData.refeicoesSelecionadas.includes(tipo) ? 'np-selected' : ''}`}>
                  <input type="checkbox" checked={formData.refeicoesSelecionadas.includes(tipo)} onChange={() => handleRefeicaoToggle(tipo)} />
                  <div className="np-refeicao-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                    </svg>
                  </div>
                  <span>{tipo}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Configuração por Refeição */}
        {formData.refeicoesSelecionadas.map(refeicao => (
          <section key={refeicao} className="np-card np-card-config">
            <div className="np-card-header">
              <div className="np-card-icon np-icon-accent">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3m0 0v7"/>
                </svg>
              </div>
              <h2>Configuração: {refeicao}</h2>
            </div>
            <div className="np-card-body">
              {/* Dieta */}
              <div className="np-field">
                <label className="np-label">Dieta *</label>
                <div className="np-dietas">
                  {['NORMAL', 'LIQUIDA', 'PASTOSA', 'LIQUIDA PASTOSA'].map(dieta => (
                    <label key={dieta} className={`np-dieta ${configRefeicoes[refeicao]?.dieta === dieta ? 'np-selected' : ''}`}>
                      <input type="radio" name={`dieta-${refeicao}`} checked={configRefeicoes[refeicao]?.dieta === dieta} onChange={() => handleDietaRefeicao(refeicao, dieta)} />
                      <span>{dieta}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Restrições */}
              <div className="np-field">
                <label className="np-label">Restrições Alimentares</label>
                <div className="np-restricoes">
                  {restricoesDisponiveis.map(restricao => (
                    <label key={restricao} className={`np-restricao ${configRefeicoes[refeicao]?.restricoes?.includes(restricao) ? 'np-selected' : ''}`}>
                      <input type="checkbox" checked={configRefeicoes[refeicao]?.restricoes?.includes(restricao) || false} onChange={() => handleRestricaoRefeicao(refeicao, restricao)} />
                      <span>{restricao}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sem Principal */}
              <div className="np-field">
                <label className={`np-sem-principal ${configRefeicoes[refeicao]?.semPrincipal ? 'np-active' : ''}`}>
                  <input type="checkbox" checked={configRefeicoes[refeicao]?.semPrincipal || false} onChange={() => handleSemPrincipalToggle(refeicao)} />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  <span>Paciente NÃO quer o prato principal do cardápio</span>
                </label>
                {configRefeicoes[refeicao]?.semPrincipal && (
                  <input type="text" className="np-input np-input-yellow" value={configRefeicoes[refeicao]?.descricaoSemPrincipal || ''} onChange={(e) => handleDescricaoSemPrincipal(refeicao, e.target.value)} placeholder="Descreva o que o paciente quer no lugar" />
                )}
              </div>

              {/* Observações */}
              <div className="np-row np-row-2">
                <div className="np-field">
                  <label className="np-label np-label-red">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Exclusão (o que NÃO quer)
                  </label>
                  <input type="text" className="np-input" value={configRefeicoes[refeicao]?.obsExclusao || ''} onChange={(e) => handleObsExclusao(refeicao, e.target.value)} placeholder="Ex: s/ leite, s/ açúcar" />
                </div>
                <div className="np-field">
                  <label className="np-label np-label-green">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Acréscimo (o que quer ALÉM)
                  </label>
                  <input type="text" className="np-input" value={configRefeicoes[refeicao]?.obsAcrescimo || ''} onChange={(e) => handleObsAcrescimo(refeicao, e.target.value)} placeholder="Ex: c/ biscoito, c/ suco" />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Botão Submit */}
        <button type="submit" className="np-submit">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>Adicionar à Fila</span>
          <kbd>Enter</kbd>
        </button>
      </form>

      {/* Modal */}
      {mostrarConfirmacao && dadosParaConfirmar && (
        <ModalConfirmacao dados={dadosParaConfirmar} onConfirmar={confirmarAdicao} onCancelar={cancelarConfirmacao} />
      )}
    </div>
  );
}

export default NovaPrescricao;