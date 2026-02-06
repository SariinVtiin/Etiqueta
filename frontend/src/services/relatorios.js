// frontend/src/services/relatorios.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Exportar prescrições para Excel - ATUALIZADO COM TODOS OS CAMPOS DO BD
 */
export const exportarParaExcel = (prescricoes, filtros = {}) => {
  try {
    // Preparar dados para o Excel
    const dadosExcel = prescricoes.map(p => ({
      'ID': p.id,
      'Data Prescrição': new Date(p.data_prescricao).toLocaleDateString('pt-BR'),
      'Hora Prescrição': new Date(p.data_prescricao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      'CPF': p.cpf,
      'Código Atendimento': p.codigo_atendimento,
      'Convênio': p.convenio,
      'Nome Paciente': p.nome_paciente,
      'Nome Mãe': p.nome_mae,
      'Data Nascimento': p.data_nascimento ? new Date(p.data_nascimento).toLocaleDateString('pt-BR') : '',
      'Idade': p.idade,
      'Núcleo/Setor': p.nucleo,
      'Leito': p.leito,
      'Tipo Alimentação': p.tipo_alimentacao,
      'Dieta': p.dieta,
      'Restrições': Array.isArray(p.restricoes) ? p.restricoes.join(', ') : (p.restricoes || ''),
      'Sem Principal': p.sem_principal ? 'Sim' : 'Não',
      'Descrição Sem Principal': p.descricao_sem_principal || '',
      'Obs. Exclusão': p.obs_exclusao || '',
      'Obs. Acréscimo': p.obs_acrescimo || '',
      'IDs Acréscimos': p.acrescimos_ids || '',
      'Status': p.status,
      'Usuário ID': p.usuario_id || '',
      'Criado em': p.criado_em ? new Date(p.criado_em).toLocaleString('pt-BR') : '',
      'Atualizado em': p.atualizado_em ? new Date(p.atualizado_em).toLocaleString('pt-BR') : ''
    }));

    // Criar workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosExcel);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 5 },   // ID
      { wch: 12 },  // Data Prescrição
      { wch: 8 },   // Hora Prescrição
      { wch: 15 },  // CPF
      { wch: 18 },  // Código Atendimento
      { wch: 15 },  // Convênio
      { wch: 30 },  // Nome Paciente
      { wch: 30 },  // Nome Mãe
      { wch: 12 },  // Data Nascimento
      { wch: 6 },   // Idade
      { wch: 20 },  // Núcleo/Setor
      { wch: 8 },   // Leito
      { wch: 15 },  // Tipo Alimentação
      { wch: 20 },  // Dieta
      { wch: 30 },  // Restrições
      { wch: 12 },  // Sem Principal
      { wch: 25 },  // Descrição Sem Principal
      { wch: 25 },  // Obs. Exclusão
      { wch: 25 },  // Obs. Acréscimo
      { wch: 20 },  // IDs Acréscimos
      { wch: 10 },  // Status
      { wch: 10 },  // Usuário ID
      { wch: 18 },  // Criado em
      { wch: 18 }   // Atualizado em
    ];
    ws['!cols'] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Prescrições');

    // Gerar nome do arquivo
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `prescricoes_${dataAtual}.xlsx`;

    // Fazer download
    XLSX.writeFile(wb, nomeArquivo);

    return { sucesso: true, mensagem: 'Relatório Excel gerado com sucesso!' };
  } catch (erro) {
    console.error('Erro ao exportar para Excel:', erro);
    return { sucesso: false, erro: 'Erro ao gerar relatório Excel' };
  }
};

/**
 * Exportar prescrições para PDF - ATUALIZADO
 */
export const exportarParaPDF = (prescricoes, filtros = {}) => {
  try {
    const doc = new jsPDF('landscape');
    
    // Título
    doc.setFontSize(18);
    doc.text('Relatório de Prescrições Hospitalares', 14, 20);
    
    // Subtítulo com data
    doc.setFontSize(11);
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Gerado em: ${dataAtual}`, 14, 28);

    // Informações de filtros (se houver)
    let yPos = 35;
    if (filtros.dataInicio || filtros.dataFim || filtros.setor || filtros.dieta || filtros.busca) {
      doc.setFontSize(10);
      doc.text('Filtros aplicados:', 14, yPos);
      yPos += 5;

      if (filtros.dataInicio) {
        doc.text(`• Data início: ${new Date(filtros.dataInicio).toLocaleDateString('pt-BR')}`, 14, yPos);
        yPos += 5;
      }
      if (filtros.dataFim) {
        doc.text(`• Data fim: ${new Date(filtros.dataFim).toLocaleDateString('pt-BR')}`, 14, yPos);
        yPos += 5;
      }
      if (filtros.setor) {
        doc.text(`• Setor: ${filtros.setor}`, 14, yPos);
        yPos += 5;
      }
      if (filtros.dieta) {
        doc.text(`• Dieta: ${filtros.dieta}`, 14, yPos);
        yPos += 5;
      }
      if (filtros.busca) {
        doc.text(`• Busca: ${filtros.busca}`, 14, yPos);
        yPos += 5;
      }
      yPos += 3;
    }

    // Preparar dados para a tabela
    const dadosTabela = prescricoes.map(p => [
      new Date(p.data_prescricao).toLocaleDateString('pt-BR'),
      p.nome_paciente,
      p.cpf,
      p.leito,
      p.nucleo,
      p.tipo_alimentacao,
      p.dieta,
      Array.isArray(p.restricoes) ? p.restricoes.join(', ') : (p.restricoes || '-'),
      p.status
    ]);

    // Adicionar tabela
    doc.autoTable({
      startY: yPos,
      head: [['Data', 'Paciente', 'CPF', 'Leito', 'Setor', 'Refeição', 'Dieta', 'Restrições', 'Status']],
      body: dadosTabela,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [13, 148, 136] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 10 }
    });

    // Salvar PDF
    const nomeArquivo = `prescricoes_${dataAtual.replace(/\//g, '-')}.pdf`;
    doc.save(nomeArquivo);

    return { sucesso: true, mensagem: 'Relatório PDF gerado com sucesso!' };
  } catch (erro) {
    console.error('Erro ao exportar para PDF:', erro);
    return { sucesso: false, erro: 'Erro ao gerar relatório PDF' };
  }
};

/**
 * Exportar relatório detalhado em PDF (uma prescrição por página) - ATUALIZADO
 */
export const exportarRelatorioDetalhado = (prescricoes) => {
  try {
    const doc = new jsPDF();

    prescricoes.forEach((p, index) => {
      if (index > 0) {
        doc.addPage();
      }

      let yPos = 20;

      // Cabeçalho
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('PRESCRIÇÃO DE ALIMENTAÇÃO', 105, yPos, { align: 'center' });
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`ID: ${p.id} | Data: ${new Date(p.data_prescricao).toLocaleDateString('pt-BR')} ${new Date(p.data_prescricao).toLocaleTimeString('pt-BR')}`, 105, yPos, { align: 'center' });
      yPos += 15;

      // Dados do Paciente
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('DADOS DO PACIENTE', 14, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Nome: ${p.nome_paciente}`, 14, yPos);
      yPos += 6;
      doc.text(`Nome da Mãe: ${p.nome_mae}`, 14, yPos);
      yPos += 6;
      doc.text(`CPF: ${p.cpf}`, 14, yPos);
      doc.text(`Idade: ${p.idade} anos`, 110, yPos);
      yPos += 6;
      if (p.data_nascimento) {
        doc.text(`Data Nascimento: ${new Date(p.data_nascimento).toLocaleDateString('pt-BR')}`, 14, yPos);
        yPos += 6;
      }
      doc.text(`Código Atendimento: ${p.codigo_atendimento}`, 14, yPos);
      doc.text(`Convênio: ${p.convenio}`, 110, yPos);
      yPos += 10;

      // Localização
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('LOCALIZAÇÃO', 14, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Setor: ${p.nucleo}`, 14, yPos);
      doc.text(`Leito: ${p.leito}`, 110, yPos);
      yPos += 10;

      // Prescrição
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('PRESCRIÇÃO ALIMENTAR', 14, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Refeição: ${p.tipo_alimentacao}`, 14, yPos);
      yPos += 6;
      doc.text(`Dieta: ${p.dieta}`, 14, yPos);
      yPos += 6;

      const restricoes = Array.isArray(p.restricoes) ? p.restricoes : 
                        (p.restricoes ? JSON.parse(p.restricoes) : []);
      
      if (restricoes.length > 0) {
        doc.text(`Restrições: ${restricoes.join(', ')}`, 14, yPos);
        yPos += 6;
      }

      if (p.sem_principal) {
        doc.text('Sem Principal: Sim', 14, yPos);
        yPos += 6;
        if (p.descricao_sem_principal) {
          doc.text(`Descrição: ${p.descricao_sem_principal}`, 14, yPos);
          yPos += 6;
        }
      }

      if (p.obs_exclusao) {
        yPos += 3;
        doc.setFont(undefined, 'bold');
        doc.text('Observação Exclusão:', 14, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        const linhasExclusao = doc.splitTextToSize(p.obs_exclusao, 180);
        doc.text(linhasExclusao, 14, yPos);
        yPos += (linhasExclusao.length * 5) + 3;
      }

      if (p.obs_acrescimo) {
        yPos += 3;
        doc.setFont(undefined, 'bold');
        doc.text('Observação Acréscimo:', 14, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        const linhasAcrescimo = doc.splitTextToSize(p.obs_acrescimo, 180);
        doc.text(linhasAcrescimo, 14, yPos);
        yPos += (linhasAcrescimo.length * 5) + 3;
      }

      // Rodapé
      yPos += 10;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Status: ${p.status || 'Ativo'} | Criado em: ${p.criado_em ? new Date(p.criado_em).toLocaleString('pt-BR') : 'N/A'}`, 14, yPos);
      if (p.atualizado_em) {
        yPos += 4;
        doc.text(`Atualizado em: ${new Date(p.atualizado_em).toLocaleString('pt-BR')}`, 14, yPos);
      }
    });

    // Salvar PDF
    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `prescricoes_detalhado_${dataAtual}.pdf`;
    doc.save(nomeArquivo);

    return { sucesso: true, mensagem: 'Relatório detalhado gerado com sucesso!' };
  } catch (erro) {
    console.error('Erro ao gerar relatório detalhado:', erro);
    return { sucesso: false, erro: 'Erro ao gerar relatório detalhado' };
  }
};