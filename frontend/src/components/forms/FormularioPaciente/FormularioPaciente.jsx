// frontend/src/components/forms/FormularioPaciente/FormularioPaciente.jsx
// ✅ VERSÃO FINAL: Busca CPF + Validação código de atendimento
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { buscarPacientePorCPF, verificarCodigoAtendimento } from '../../../services/api';

function FormularioPaciente({ formData, onChange, convenios = [] }) {
  
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  
  // Estado para validação do código de atendimento
  const [verificandoCodigo, setVerificandoCodigo] = useState(false);
  const [codigoStatus, setCodigoStatus] = useState(null); // null, 'disponivel', 'duplicado'
  const [codigoMensagem, setCodigoMensagem] = useState('');
  const timerCodigoRef = useRef(null);
  
  const onChangeRef = useRef(onChange);
  
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  
  // Formatar CPF
  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return valor;
  };

  // Formatar data DD/MM/AAAA
  const formatarData = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    if (numeros.length <= 8) return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
    return valor;
  };

  // ============================================
  // BUSCA AUTOMÁTICA POR CPF
  // ============================================
  const buscarDadosPaciente = useCallback(async (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return;

    setBuscandoPaciente(true);
    setPacienteEncontrado(null);

    try {
      const resultado = await buscarPacientePorCPF(cpf);

      if (resultado && resultado.sucesso && resultado.paciente) {
        const paciente = resultado.paciente;
        setPacienteEncontrado(true);

        const camposParaPreencher = {
          codigoAtendimento: paciente.codigo_atendimento || '',
          convenio: paciente.convenio || '',
          nomePaciente: paciente.nome_paciente || '',
          nomeMae: paciente.nome_mae || '',
          dataNascimento: paciente.data_nascimento || '',
          idade: paciente.idade != null ? String(paciente.idade) : ''
        };

        Object.entries(camposParaPreencher).forEach(([name, value]) => {
          onChangeRef.current({ target: { name, value } });
        });

        // Código que veio do paciente já é dele, então está OK
        setCodigoStatus('disponivel');
        setCodigoMensagem('');

        console.log('✅ Paciente encontrado:', paciente.nome_paciente);
      } else {
        setPacienteEncontrado(false);
      }
    } catch (erro) {
      setPacienteEncontrado(false);
    } finally {
      setBuscandoPaciente(false);
    }
  }, []);

  // ============================================
  // VERIFICAÇÃO DO CÓDIGO DE ATENDIMENTO
  // ============================================
  const verificarCodigo = useCallback(async (codigo, cpfAtual) => {
    if (!codigo || codigo.length !== 7) {
      setCodigoStatus(null);
      setCodigoMensagem('');
      return;
    }

    setVerificandoCodigo(true);

    try {
      const resultado = await verificarCodigoAtendimento(codigo, cpfAtual);

      if (resultado && resultado.sucesso) {
        if (resultado.disponivel) {
          setCodigoStatus('disponivel');
          setCodigoMensagem('');
        } else {
          setCodigoStatus('duplicado');
          setCodigoMensagem(resultado.mensagem || 'Código já em uso por outro paciente');
        }
      }
    } catch (erro) {
      console.error('Erro ao verificar código:', erro);
      setCodigoStatus(null);
    } finally {
      setVerificandoCodigo(false);
    }
  }, []);

  // Calcular idade quando data mudar
  useEffect(() => {
    if (formData.dataNascimento && formData.dataNascimento.length === 10) {
      const partes = formData.dataNascimento.split('/');
      const dia = parseInt(partes[0]);
      const mes = parseInt(partes[1]);
      const ano = parseInt(partes[2]);
      
      if (dia && mes && ano && mes <= 12 && dia <= 31 && ano >= 1900 && ano <= new Date().getFullYear()) {
        const dataNasc = new Date(ano, mes - 1, dia);
        const hoje = new Date();
        
        let idade = hoje.getFullYear() - dataNasc.getFullYear();
        const mesAtual = hoje.getMonth();
        const mesNasc = dataNasc.getMonth();
        
        if (mesAtual < mesNasc || (mesAtual === mesNasc && hoje.getDate() < dataNasc.getDate())) {
          idade--;
        }
        
        if (idade >= 0 && formData.idade !== idade) {
          onChangeRef.current({ target: { name: 'idade', value: idade } });
        }
      } else if (formData.idade !== '') {
        onChangeRef.current({ target: { name: 'idade', value: '' } });
      }
    } else if (formData.idade !== '') {
      onChangeRef.current({ target: { name: 'idade', value: '' } });
    }
  }, [formData.dataNascimento, formData.idade]);

  // ============================================
  // HANDLERS
  // ============================================
  const handleCPFChange = (e) => {
    const cpfFormatado = formatarCPF(e.target.value);
    onChange({ target: { name: 'cpf', value: cpfFormatado } });

    const cpfLimpo = cpfFormatado.replace(/\D/g, '');
    if (cpfLimpo.length === 11) {
      buscarDadosPaciente(cpfFormatado);
    } else {
      setPacienteEncontrado(null);
      // Resetar validação do código quando muda o CPF
      setCodigoStatus(null);
      setCodigoMensagem('');
    }
  };

  const handleCodigoChange = (e) => {
    const numeros = e.target.value.replace(/\D/g, '');
    if (numeros.length <= 7) {
      onChange({ target: { name: 'codigoAtendimento', value: numeros } });

      // Limpar timer anterior (debounce)
      if (timerCodigoRef.current) {
        clearTimeout(timerCodigoRef.current);
      }

      // Verificar quando tiver 7 dígitos (com debounce de 500ms)
      if (numeros.length === 7) {
        timerCodigoRef.current = setTimeout(() => {
          verificarCodigo(numeros, formData.cpf);
        }, 500);
      } else {
        setCodigoStatus(null);
        setCodigoMensagem('');
      }
    }
  };

  const handleDataNascimentoChange = (e) => {
    const dataFormatada = formatarData(e.target.value);
    onChange({ target: { name: 'dataNascimento', value: dataFormatada } });
  };

  return (
    <>
      {/* CPF com busca automática */}
      <div className="campo">
        <label>CPF *</label>
        <input
          type="text"
          name="cpf"
          value={formData.cpf}
          onChange={handleCPFChange}
          placeholder="000.000.000-00"
          maxLength="14"
          autoFocus
        />
        {buscandoPaciente && (
          <small style={{ color: '#0d9488', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
            🔍 Buscando paciente...
          </small>
        )}
        {pacienteEncontrado === true && (
          <small style={{ color: '#059669', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
            ✅ Paciente encontrado! Dados preenchidos automaticamente.
          </small>
        )}
        {pacienteEncontrado === false && formData.cpf.replace(/\D/g, '').length === 11 && (
          <small style={{ color: '#d97706', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
            🆕 Novo paciente - preencha os dados abaixo.
          </small>
        )}
      </div>

      {/* Código de Atendimento com validação */}
      <div className="campo">
        <label>CÓDIGO DE ATENDIMENTO *</label>
        <input
          type="text"
          name="codigoAtendimento"
          value={formData.codigoAtendimento}
          onChange={handleCodigoChange}
          placeholder="0000000 (7 dígitos)"
          maxLength="7"
          style={codigoStatus === 'duplicado' ? { borderColor: '#dc2626', borderWidth: '2px' } : {}}
        />
        {formData.codigoAtendimento && formData.codigoAtendimento.length !== 7 && (
          <small className="aviso-erro">O código deve ter exatamente 7 dígitos</small>
        )}
        {verificandoCodigo && (
          <small style={{ color: '#0d9488', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
            🔍 Verificando código...
          </small>
        )}
        {codigoStatus === 'disponivel' && formData.codigoAtendimento.length === 7 && (
          <small style={{ color: '#059669', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
            ✅ Código disponível
          </small>
        )}
        {codigoStatus === 'duplicado' && (
          <small style={{ color: '#dc2626', fontWeight: 'bold', display: 'block', marginTop: '4px' }}>
            ❌ {codigoMensagem}
          </small>
        )}
      </div>

      {/* Convênio */}
      <div className="campo">
        <label>CONVÊNIO * (selecione um)</label>
        <div className="opcoes-radio">
          {convenios.length > 0 ? (
            convenios.map((conv) => (
              <label key={conv.id} className="opcao-check">
                <input
                  type="radio"
                  name="convenio"
                  checked={formData.convenio === conv.nome}
                  onChange={() => onChange({ target: { name: 'convenio', value: conv.nome } })}
                />
                <span>{conv.nome}</span>
              </label>
            ))
          ) : (
            <>
              <label className="opcao-check">
                <input type="radio" name="convenio" checked={formData.convenio === 'SUS'}
                  onChange={() => onChange({ target: { name: 'convenio', value: 'SUS' } })} />
                <span>SUS</span>
              </label>
              <label className="opcao-check">
                <input type="radio" name="convenio" checked={formData.convenio === 'Convênio'}
                  onChange={() => onChange({ target: { name: 'convenio', value: 'Convênio' } })} />
                <span>Convênio</span>
              </label>
              <label className="opcao-check">
                <input type="radio" name="convenio" checked={formData.convenio === 'Particular'}
                  onChange={() => onChange({ target: { name: 'convenio', value: 'Particular' } })} />
                <span>Particular</span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Nome do Paciente */}
      <div className="campo">
        <label>NOME DO PACIENTE *</label>
        <input type="text" name="nomePaciente" value={formData.nomePaciente}
          onChange={onChange} placeholder="Nome completo do paciente" disabled={buscandoPaciente} />
      </div>

      {/* Nome da Mãe */}
      <div className="campo">
        <label>NOME DA MÃE *</label>
        <input type="text" name="nomeMae" value={formData.nomeMae}
          onChange={onChange} placeholder="Nome completo da mãe" disabled={buscandoPaciente} />
      </div>

      {/* Data de Nascimento */}
      <div className="campo">
        <label>DATA DE NASCIMENTO * (DD/MM/AAAA)</label>
        <input type="text" name="dataNascimento" value={formData.dataNascimento}
          onChange={handleDataNascimentoChange} placeholder="Ex: 25/06/1999" disabled={buscandoPaciente} />
        {formData.dataNascimento && formData.dataNascimento.length === 10 && formData.idade !== '' && (
          <small className="info-idade">✅ Idade: {formData.idade} anos</small>
        )}
        {formData.dataNascimento && formData.dataNascimento.length === 10 && formData.idade === '' && (
          <small className="aviso-erro">Data inválida</small>
        )}
      </div>
    </>
  );
}

export default FormularioPaciente;