import React, { useEffect, useRef } from 'react';

function FormularioPaciente({ formData, onChange }) {
  
  // Usar ref para evitar dependências desnecessárias no useEffect
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

  // Formatar data de nascimento DD/MM/AAAA
  const formatarData = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    
    if (numeros.length <= 2) {
      return numeros;
    } else if (numeros.length <= 4) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    } else if (numeros.length <= 8) {
      return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
    }
    
    return valor;
  };

  // Calcular idade sempre que a data mudar
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
          onChangeRef.current({
            target: {
              name: 'idade',
              value: idade
            }
          });
        }
      } else if (formData.idade !== '') {
        onChangeRef.current({
          target: {
            name: 'idade',
            value: ''
          }
        });
      }
    } else if (formData.idade !== '') {
      onChangeRef.current({
        target: {
          name: 'idade',
          value: ''
        }
      });
    }
  }, [formData.dataNascimento, formData.idade]);

  const handleCPFChange = (e) => {
    const cpfFormatado = formatarCPF(e.target.value);
    onChange({
      target: {
        name: 'cpf',
        value: cpfFormatado
      }
    });
  };

  const handleDataNascimentoChange = (e) => {
    const dataFormatada = formatarData(e.target.value);
    onChange({
      target: {
        name: 'dataNascimento',
        value: dataFormatada
      }
    });
  };

  const handleCodigoChange = (e) => {
    const numeros = e.target.value.replace(/\D/g, '');
    if (numeros.length <= 7) {
      onChange({
        target: {
          name: 'codigoAtendimento',
          value: numeros
        }
      });
    }
  };

  return (
    <>
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
      </div>

      <div className="campo">
        <label>CÓDIGO DE ATENDIMENTO *</label>
        <input
          type="text"
          name="codigoAtendimento"
          value={formData.codigoAtendimento}
          onChange={handleCodigoChange}
          placeholder="0000000 (7 dígitos)"
          maxLength="7"
        />
        {formData.codigoAtendimento && formData.codigoAtendimento.length !== 7 && (
          <small className="aviso-erro">
            ⚠️ O código deve ter exatamente 7 dígitos
          </small>
        )}
      </div>

      <div className="campo">
        <label>CONVÊNIO * (selecione um)</label>
        <div className="opcoes-radio">
          <label className="opcao-check">
            <input
              type="radio"
              name="convenio"
              checked={formData.convenio === 'SUS'}
              onChange={() => onChange({ target: { name: 'convenio', value: 'SUS' } })}
            />
            <span>SUS</span>
          </label>
          <label className="opcao-check">
            <input
              type="radio"
              name="convenio"
              checked={formData.convenio === 'Convênio'}
              onChange={() => onChange({ target: { name: 'convenio', value: 'Convênio' } })}
            />
            <span>Convênio</span>
          </label>
          <label className="opcao-check">
            <input
              type="radio"
              name="convenio"
              checked={formData.convenio === 'Particular'}
              onChange={() => onChange({ target: { name: 'convenio', value: 'Particular' } })}
            />
            <span>Particular</span>
          </label>
        </div>
      </div>

      <div className="campo">
        <label>NOME DO PACIENTE *</label>
        <input
          type="text"
          name="nomePaciente"
          value={formData.nomePaciente}
          onChange={onChange}
          placeholder="Nome completo do paciente"
        />
      </div>

      <div className="campo">
        <label>NOME DA MÃE *</label>
        <input
          type="text"
          name="nomeMae"
          value={formData.nomeMae}
          onChange={onChange}
          placeholder="Nome completo da mãe"
        />
      </div>

      <div className="campo">
        <label>DATA DE NASCIMENTO * (DD/MM/AAAA)</label>
        <input
          type="text"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleDataNascimentoChange}
          placeholder="Ex: 25/06/1999"
        />
        {formData.dataNascimento && formData.dataNascimento.length === 10 && formData.idade !== '' && (
          <small className="info-idade">
            ✅ Idade: {formData.idade} anos
          </small>
        )}
        {formData.dataNascimento && formData.dataNascimento.length === 10 && formData.idade === '' && (
          <small className="aviso-erro">
            ⚠️ Data inválida
          </small>
        )}
      </div>
    </>
  );
}

export default FormularioPaciente;