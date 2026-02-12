import React, { useState, useEffect } from 'react';
import './ModalEditarPrescricao.css';

function ModalEditarPrescricao({ prescricao, onSalvar, onCancelar, nucleos, dietas }) {
  const [formData, setFormData] = useState({
    cpf: '',
    codigoAtendimento: '',
    convenio: '',
    nomePaciente: '',
    nomeMae: '',
    dataNascimento: '',
    idade: '',
    nucleo: '',
    leito: '',
    tipoAlimentacao: '',
    dieta: '',
    restricoes: [],
    semPrincipal: false,
    descricaoSemPrincipal: '',
    obsExclusao: '',
    obsAcrescimo: ''
  });

  const [salvando, setSalvando] = useState(false);

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

  // Preencher formulário com dados da prescrição
  useEffect(() => {
    if (prescricao) {
      // Converter data de AAAA-MM-DD para DD/MM/AAAA
      const dataObj = new Date(prescricao.data_nascimento);
      const dia = String(dataObj.getDate() + 1).padStart(2, '0');
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      const ano = dataObj.getFullYear();
      const dataFormatada = `${dia}/${mes}/${ano}`;

      setFormData({
        cpf: prescricao.cpf || '',
        codigoAtendimento: prescricao.codigo_atendimento || '',
        convenio: prescricao.convenio || '',
        nomePaciente: prescricao.nome_paciente || '',
        nomeMae: prescricao.nome_mae || '',
        dataNascimento: dataFormatada,
        idade: String(prescricao.idade || ''),
        nucleo: prescricao.nucleo || '',
        leito: prescricao.leito || '',
        tipoAlimentacao: prescricao.tipo_alimentacao || '',
        dieta: prescricao.dieta || '',
        restricoes: prescricao.restricoes || [],
        semPrincipal: prescricao.sem_principal || false,
        descricaoSemPrincipal: prescricao.descricao_sem_principal || '',
        obsExclusao: prescricao.obs_exclusao || '',
        obsAcrescimo: prescricao.obs_acrescimo || ''
      });
    }
  }, [prescricao]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDataNascimentoChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    
    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    if (valor.length >= 5) {
      valor = valor.substring(0, 5) + '/' + valor.substring(5, 9);
    }
    
    setFormData({ ...formData, dataNascimento: valor });
    
    if (valor.length === 10) {
      const [dia, mes, ano] = valor.split('/');
      const dataNasc = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      const idade = hoje.getFullYear() - dataNasc.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNasc = dataNasc.getMonth();
      
      const idadeFinal = (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < dataNasc.getDate())) 
        ? idade - 1 
        : idade;
      
      setFormData(prev => ({ ...prev, idade: String(idadeFinal) }));
    }
  };

  const toggleRestricao = (restricao) => {
    const novasRestricoes = formData.restricoes.includes(restricao)
      ? formData.restricoes.filter(r => r !== restricao)
      : [...formData.restricoes, restricao];
    
    setFormData({ ...formData, restricoes: novasRestricoes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nomePaciente || !formData.nucleo || !formData.leito || !formData.dieta) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    
    setSalvando(true);
    
    try {
      // Converter data de DD/MM/AAAA para AAAA-MM-DD
      const [dia, mes, ano] = formData.dataNascimento.split('/');
      const dataFormatada = `${ano}-${mes}-${dia}`;
      
      const dadosAtualizados = {
        ...formData,
        dataNascimento: dataFormatada,
        idade: parseInt(formData.idade)
      };
      
      await onSalvar(dadosAtualizados);
    } catch (erro) {
      console.error('Erro ao salvar:', erro);
      alert('Erro ao salvar prescrição: ' + erro.message);
    } finally {
      setSalvando(false);
    }
  };

  // ============================================
  // LEITOS ORDENADOS EM ORDEM CRESCENTE
  // ============================================
  const leitosDisponiveis = formData.nucleo && nucleos[formData.nucleo] 
    ? ordenarLeitosNatural(nucleos[formData.nucleo])
    : [];

  return (
    <div className="modal-overlay-editar">
      <div className="modal-content-editar">
        <div className="modal-header-editar">
          <h2>✏️ Editar Prescrição #{prescricao?.id}</h2>
          <button className="btn-fechar-modal" onClick={onCancelar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-editar">
          <div className="form-grid">
            {/* CPF */}
            <div className="campo">
              <label>CPF *</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                maxLength="14"
              />
            </div>

            {/* Código Atendimento */}
            <div className="campo">
              <label>Código de Atendimento *</label>
              <input
                type="text"
                name="codigoAtendimento"
                value={formData.codigoAtendimento}
                onChange={handleChange}
                placeholder="0000000"
                maxLength="7"
              />
            </div>

            {/* Convênio */}
            <div className="campo">
              <label>Convênio *</label>
              <select name="convenio" value={formData.convenio} onChange={handleChange}>
                <option value="">Selecione...</option>
                <option value="SUS">SUS</option>
                <option value="Convênio">Convênio</option>
                <option value="Particular">Particular</option>
              </select>
            </div>

            {/* Nome Paciente */}
            <div className="campo full-width">
              <label>Nome do Paciente *</label>
              <input
                type="text"
                name="nomePaciente"
                value={formData.nomePaciente}
                onChange={handleChange}
                placeholder="Nome completo"
              />
            </div>

            {/* Nome Mãe */}
            <div className="campo full-width">
              <label>Nome da Mãe *</label>
              <input
                type="text"
                name="nomeMae"
                value={formData.nomeMae}
                onChange={handleChange}
                placeholder="Nome completo da mãe"
              />
            </div>

            {/* Data Nascimento */}
            <div className="campo">
              <label>Data de Nascimento *</label>
              <input
                type="text"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleDataNascimentoChange}
                placeholder="DD/MM/AAAA"
                maxLength="10"
              />
              {formData.idade && (
                <small className="info-idade">Idade: {formData.idade} anos</small>
              )}
            </div>

            {/* Núcleo */}
            <div className="campo">
              <label>Núcleo/Setor *</label>
              <select name="nucleo" value={formData.nucleo} onChange={handleChange}>
                <option value="">Selecione...</option>
                {Object.keys(nucleos).map(nucleo => (
                  <option key={nucleo} value={nucleo}>{nucleo}</option>
                ))}
              </select>
            </div>

            {/* Leito - AGORA COM ORDENAÇÃO */}
            <div className="campo">
              <label>Leito *</label>
              <select name="leito" value={formData.leito} onChange={handleChange}>
                <option value="">Selecione...</option>
                {leitosDisponiveis.map(leito => (
                  <option key={leito} value={leito}>{leito}</option>
                ))}
              </select>
            </div>

            {/* Tipo Alimentação */}
            <div className="campo">
              <label>Tipo de Alimentação *</label>
              <input
                type="text"
                name="tipoAlimentacao"
                value={formData.tipoAlimentacao}
                onChange={handleChange}
                placeholder="Ex: Almoço, Jantar"
              />
            </div>

            {/* Dieta */}
            <div className="campo full-width">
              <label>Dieta *</label>
              <select name="dieta" value={formData.dieta} onChange={handleChange}>
                <option value="">Selecione...</option>
                {dietas.map(dieta => (
                  <option key={dieta.id} value={dieta.nome}>{dieta.nome}</option>
                ))}
              </select>
            </div>

            {/* Restrições */}
            <div className="campo full-width">
              <label>Restrições</label>
              <div className="restricoes-grid">
                {['HPS', 'DM', 'IRC', 'Alergia', 'Intolerância'].map(restricao => (
                  <label key={restricao} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.restricoes.includes(restricao)}
                      onChange={() => toggleRestricao(restricao)}
                    />
                    <span>{restricao}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sem Principal */}
            <div className="campo full-width">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="semPrincipal"
                  checked={formData.semPrincipal}
                  onChange={handleChange}
                />
                <span>Sem Principal</span>
              </label>
              {formData.semPrincipal && (
                <input
                  type="text"
                  name="descricaoSemPrincipal"
                  value={formData.descricaoSemPrincipal}
                  onChange={handleChange}
                  placeholder="Descrição do que substituirá o principal"
                  style={{ marginTop: '8px' }}
                />
              )}
            </div>

            {/* Observação Exclusão */}
            <div className="campo full-width">
              <label>Observação Exclusão</label>
              <input
                type="text"
                name="obsExclusao"
                value={formData.obsExclusao}
                onChange={handleChange}
                placeholder="Ex: s/ leite, s/ açúcar"
              />
            </div>

            {/* Observação Acréscimo */}
            <div className="campo full-width">
              <label>Observação Acréscimo</label>
              <input
                type="text"
                name="obsAcrescimo"
                value={formData.obsAcrescimo}
                onChange={handleChange}
                placeholder="Ex: c/ suco, c/ biscoito"
              />
            </div>
          </div>

          <div className="modal-footer-editar">
            <button 
              type="button" 
              className="btn-cancelar-modal" 
              onClick={onCancelar}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-salvar-modal"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : '✓ Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEditarPrescricao;