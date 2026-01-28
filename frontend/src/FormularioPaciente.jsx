import React from 'react';

function FormularioPaciente({ formData, onChange }) {
  const formatarCPF = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const limited = cleaned.substring(0, 11);
    
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    if (limited.length <= 9) return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  };

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return '';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const handleCPFChange = (e) => {
    const formatted = formatarCPF(e.target.value);
    onChange({
      target: {
        name: 'cpf',
        value: formatted
      }
    });
  };

  const handleDataNascimentoChange = (e) => {
    const data = e.target.value;
    const idade = calcularIdade(data);
    
    // Atualiza tanto a data quanto a idade
    onChange({
      target: {
        name: 'dataNascimento',
        value: data
      }
    });
    
    // Dispara evento separado para idade
    setTimeout(() => {
      onChange({
        target: {
          name: 'idade',
          value: idade
        }
      });
    }, 0);
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
          onChange={onChange}
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
              value="Convênio"
              checked={formData.convenio === 'Convênio'}
              onChange={onChange}
            />
            <span>Convênio</span>
          </label>
          <label className="opcao-check">
            <input
              type="radio"
              name="convenio"
              value="Particular"
              checked={formData.convenio === 'Particular'}
              onChange={onChange}
            />
            <span>Particular</span>
          </label>
          <label className="opcao-check">
            <input
              type="radio"
              name="convenio"
              value="SUS"
              checked={formData.convenio === 'SUS'}
              onChange={onChange}
            />
            <span>SUS</span>
          </label>
        </div>
      </div>

      <div className="campo">
        <label>NOME COMPLETO DO PACIENTE *</label>
        <input
          type="text"
          name="nomePaciente"
          value={formData.nomePaciente}
          onChange={onChange}
          placeholder="Nome completo"
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
        <label>DATA DE NASCIMENTO *</label>
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleDataNascimentoChange}
        />
        {formData.dataNascimento && (
          <small className="info-idade">
            📅 Idade: {formData.idade} anos
          </small>
        )}
      </div>
    </>
  );
}

export default FormularioPaciente;