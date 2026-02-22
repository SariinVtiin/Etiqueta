import React, { useState, useEffect } from 'react';
import SeletorAcrescimos from '../SeletorAcrescimos';
import './ModalEditarPrescricao.css';

function ModalEditarPrescricao({ 
  prescricao, 
  onSalvar, 
  onCancelar, 
  nucleos, 
  dietas, 
  restricoes,        // ✅ Condições nutricionais dinâmicas do BD
  tiposAlimentacao   // ✅ NOVO: Tipos de alimentação dinâmicos
}) {
  // Proteção contra props undefined
  const nucleosSafe = nucleos || {};
  const dietasSafe = dietas || [];
  const restricoesSafe = restricoes || [];
  const tiposSafe = tiposAlimentacao || [];

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
    obsAcrescimo: '',
    acrescimosIds: []   // ✅ NOVO: IDs dos acréscimos selecionados
  });

  const [salvando, setSalvando] = useState(false);

  // ============================================
  // FUNÇÃO DE ORDENAÇÃO NATURAL DE LEITOS
  // ============================================
  const ordenarLeitosNatural = (leitos) => {
    if (!leitos || !Array.isArray(leitos)) return [];
    return [...leitos].sort((a, b) => {
      const regex = /(\d+)|(\D+)/g;
      const aParts = String(a).match(regex) || [];
      const bParts = String(b).match(regex) || [];
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || '';
        const bPart = bParts[i] || '';
        
        const aNum = parseInt(aPart);
        const bNum = parseInt(bPart);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          if (aNum !== bNum) return aNum - bNum;
        } else {
          const comp = aPart.localeCompare(bPart);
          if (comp !== 0) return comp;
        }
      }
      return 0;
    });
  };

  // ============================================
  // PREENCHER FORMULÁRIO COM DADOS DA PRESCRIÇÃO
  // ============================================
  useEffect(() => {
    if (prescricao) {
      // Converter data de AAAA-MM-DD para DD/MM/AAAA
      const dataObj = new Date(prescricao.data_nascimento);
      const dia = String(dataObj.getDate() + 1).padStart(2, '0');
      const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
      const ano = dataObj.getFullYear();
      const dataFormatada = `${dia}/${mes}/${ano}`;

      // Parsear acrescimos_ids (vem como JSON string do BD)
      let acrescimosIds = [];
      if (prescricao.acrescimos_ids) {
        try {
          acrescimosIds = typeof prescricao.acrescimos_ids === 'string'
            ? JSON.parse(prescricao.acrescimos_ids)
            : prescricao.acrescimos_ids;
        } catch (e) {
          console.error('Erro ao parsear acrescimos_ids:', e);
          acrescimosIds = [];
        }
      }

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
        obsAcrescimo: prescricao.obs_acrescimo || '',
        acrescimosIds: acrescimosIds
      });
    }
  }, [prescricao]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Se mudou o núcleo, limpar o leito
    if (name === 'nucleo') {
      setFormData(prev => ({
        ...prev,
        nucleo: value,
        leito: ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDataNascimentoChange = (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    
    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2);
    }
    if (valor.length >= 5) {
      valor = valor.substring(0, 5) + '/' + valor.substring(5, 9);
    }
    
    setFormData(prev => ({ ...prev, dataNascimento: valor }));
    
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
    
    setFormData(prev => ({ ...prev, restricoes: novasRestricoes }));
  };

  const handleAcrescimosChange = (ids) => {
    setFormData(prev => ({ ...prev, acrescimosIds: ids }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nomePaciente || !formData.nucleo || !formData.leito || !formData.dieta || !formData.tipoAlimentacao) {
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
  // LEITOS ORDENADOS
  // ============================================
  const leitosDisponiveis = formData.nucleo && nucleosSafe[formData.nucleo] 
    ? ordenarLeitosNatural(nucleosSafe[formData.nucleo])
    : [];

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="modal-overlay-editar">
      <div className="modal-content-editar">
        <div className="modal-header-editar">
          <h2>✏️ Editar Prescrição #{prescricao?.id}</h2>
          <button className="btn-fechar-modal" onClick={onCancelar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="form-editar">
          <div className="form-grid">

            {/* ===== DADOS DO PACIENTE ===== */}

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

            {/* ===== LOCALIZAÇÃO ===== */}

            {/* Núcleo */}
            <div className="campo">
              <label>Núcleo/Setor *</label>
              <select name="nucleo" value={formData.nucleo} onChange={handleChange}>
                <option value="">Selecione...</option>
                {Object.keys(nucleosSafe).map(nucleo => (
                  <option key={nucleo} value={nucleo}>{nucleo}</option>
                ))}
              </select>
            </div>

            {/* Leito */}
            <div className="campo">
              <label>Leito *</label>
              <select name="leito" value={formData.leito} onChange={handleChange} disabled={!formData.nucleo}>
                <option value="">Selecione...</option>
                {leitosDisponiveis.map(leito => (
                  <option key={leito} value={leito}>{leito}</option>
                ))}
              </select>
              {!formData.nucleo && (
                <small className="aviso-campo">⚠️ Selecione um núcleo primeiro</small>
              )}
            </div>

            {/* ===== ALIMENTAÇÃO ===== */}

            {/* Tipo Alimentação - ✅ AGORA SELECT DINÂMICO */}
            <div className="campo">
              <label>Tipo de Alimentação *</label>
              {tiposSafe.length > 0 ? (
                <select name="tipoAlimentacao" value={formData.tipoAlimentacao} onChange={handleChange}>
                  <option value="">Selecione...</option>
                    {tiposSafe.map((tipo, index) => {
                        const valor = typeof tipo === 'object' ? tipo.nome : tipo;
                        return <option key={index} value={valor}>{valor}</option>;
                    })}
                </select>
              ) : (
                <input
                  type="text"
                  name="tipoAlimentacao"
                  value={formData.tipoAlimentacao}
                  onChange={handleChange}
                  placeholder="Ex: Almoço, Jantar"
                />
              )}
            </div>

            {/* Dieta */}
            <div className="campo">
              <label>Dieta *</label>
              <select name="dieta" value={formData.dieta} onChange={handleChange}>
                <option value="">Selecione...</option>
                {dietasSafe.map(dieta => (
                  <option key={dieta.id} value={dieta.nome}>{dieta.nome}</option>
                ))}
              </select>
            </div>

            {/* Condições Nutricionais - ✅ DINÂMICAS DO BD */}
            <div className="campo full-width">
              <label>Condições Nutricionais</label>
              <div className="restricoes-grid">
                {restricoesSafe.length > 0 ? (
                  restricoesSafe.map(restricao => (
                    <label key={restricao.id || restricao.nome} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.restricoes.includes(restricao.nome)}
                        onChange={() => toggleRestricao(restricao.nome)}
                      />
                      <span>{restricao.nome}</span>
                    </label>
                  ))
                ) : (
                  <span className="aviso-campo">Nenhuma condição nutricional cadastrada</span>
                )}
              </div>
            </div>

            {/* Sem Principal */}
            <div className="campo full-width">
              <label className="checkbox-label checkbox-destaque">
                <input
                  type="checkbox"
                  name="semPrincipal"
                  checked={formData.semPrincipal}
                  onChange={handleChange}
                />
                <span>Paciente NÃO quer o prato principal do cardápio</span>
              </label>
              {formData.semPrincipal && (
                <input
                  type="text"
                  name="descricaoSemPrincipal"
                  value={formData.descricaoSemPrincipal}
                  onChange={handleChange}
                  placeholder="Descreva o que o paciente quer no lugar do principal"
                  className="input-sem-principal"
                  style={{ marginTop: '8px' }}
                />
              )}
            </div>

            {/* Observação Exclusão */}
            <div className="campo full-width">
              <label>OBS EXCLUSÃO (o que NÃO quer)</label>
              <input
                type="text"
                name="obsExclusao"
                value={formData.obsExclusao}
                onChange={handleChange}
                placeholder="Ex: s/ leite, s/ açúcar"
              />
            </div>

            {/* ✅ ACRÉSCIMOS - AGORA USA SeletorAcrescimos */}
            <div className="campo full-width">
              <label>ACRÉSCIMOS (o que quer ALÉM do cardápio)</label>
              <SeletorAcrescimos
                acrescimosSelecionados={formData.acrescimosIds}
                onChange={handleAcrescimosChange}
                refeicao={formData.tipoAlimentacao}
              />
            </div>

            {/* Observação Acréscimo (texto livre adicional) */}
            <div className="campo full-width">
              <label>Observação Acréscimo (texto livre)</label>
              <input
                type="text"
                name="obsAcrescimo"
                value={formData.obsAcrescimo}
                onChange={handleChange}
                placeholder="Ex: observações extras sobre acréscimos"
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