// src/services/relatorios.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Exportar prescrições para Excel
 */
export const exportarParaExcel = (prescricoes, filtros = {}) => {
  try {
    // Preparar dados para o Excel
    const dadosExcel = prescricoes.map(p => ({
      'ID': p.id,
      'Data': new Date(p.data_prescricao).toLocaleDateString('pt-BR'),
      'Hora': new Date(p.data_prescricao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      'Paciente': p.nome_paciente,
      'CPF': p.cpf,
      'Mãe': p.nome_mae,
      'Código Atendimento': p.codigo_atendimento,
      'Convênio': p.convenio,
      'Idade': p.idade,
      'Setor': p.nucleo,
      'Leito': p.leito,
      'Refeição': p.tipo_alimentacao,
      'Dieta': p.dieta,
      'Restrições': Array.isArray(p.restricoes) ? p.restricoes.join(', ') : (p.restricoes || ''),
      'Sem Principal': p.sem_principal ? 'Sim' : 'Não',
      'Descrição Sem Principal': p.descricao_sem_principal || '',
      'Obs. Exclusão': p.obs_exclusao || '',
      'Obs. Acréscimo': p.obs_acrescimo || '',
      'Status': p.status
    }));

    // Criar workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dadosExcel);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 5 },   // ID
      { wch: 12 },  // Data
      { wch: 8 },   // Hora
      { wch: 30 },  // Paciente
      { wch: 15 },  // CPF
      { wch: 30 },  // Mãe
      { wch: 18 },  // Código
      { wch: 12 },  // Convênio
      { wch: 6 },   // Idade
      { wch: 20 },  // Setor
      { wch: 8 },   // Leito
      { wch: 15 },  // Refeição
      { wch: 20 },  // Dieta
      { wch: 30 },  // Restrições
      { wch: 12 },  // Sem Principal
      { wch: 25 },  // Desc. Sem Principal
      { wch: 25 },  // Obs. Exclusão
      { wch: 25 },  // Obs. Acréscimo
      { wch: 10 }   // Status
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
 * Exportar prescrições para PDF
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
      p.leito,
      p.nucleo,
      p.tipo_alimentacao,
      p.dieta,
      Array.isArray(p.restricoes) ? p.restricoes.join(', ') : (p.restricoes || '-'),
      p.status
    ]);

    // Criar tabela
    doc.autoTable({
      startY: yPos,
      head: [['Data', 'Paciente', 'Leito', 'Setor', 'Refeição', 'Dieta', 'Restrições', 'Status']],
      body: dadosTabela,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 123, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: yPos }
    });

    // Rodapé
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.text(
        `Página ${i} de ${totalPaginas}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        'Sistema de Etiquetas Hospitalares - CONFEDERAL VIGILÂNCIA',
        14,
        doc.internal.pageSize.height - 10
      );
    }

    // Gerar nome do arquivo
    const dataArquivo = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `prescricoes_${dataArquivo}.pdf`;

    // Fazer download
    doc.save(nomeArquivo);

    return { sucesso: true, mensagem: 'Relatório PDF gerado com sucesso!' };
  } catch (erro) {
    console.error('Erro ao exportar para PDF:', erro);
    return { sucesso: false, erro: 'Erro ao gerar relatório PDF' };
  }
};

/**
 * Exportar relatório detalhado em PDF (uma prescrição por página)
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

      const restricoes = Array.isArray(p.restricoes) ? p.restricoes.join(', ') : (p.restricoes || 'Nenhuma');
      doc.text(`Restrições: ${restricoes}`, 14, yPos);
      yPos += 10;

      // Observações
      if (p.sem_principal || p.obs_exclusao || p.obs_acrescimo) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('OBSERVAÇÕES', 14, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        if (p.sem_principal) {
          doc.setFont(undefined, 'bold');
          doc.text(`⚠️ SEM PRINCIPAL: ${p.descricao_sem_principal || ''}`, 14, yPos);
          doc.setFont(undefined, 'normal');
          yPos += 6;
        }

        if (p.obs_exclusao) {
          doc.text(`Exclusão: ${p.obs_exclusao}`, 14, yPos);
          yPos += 6;
        }

        if (p.obs_acrescimo) {
          doc.text(`Acréscimo: ${p.obs_acrescimo}`, 14, yPos);
          yPos += 6;
        }
      }

      // Rodapé
      doc.setFontSize(8);
      doc.text('Sistema de Etiquetas Hospitalares - CONFEDERAL VIGILÂNCIA', 105, 280, { align: 'center' });
    });

    // Gerar nome do arquivo
    const dataArquivo = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `prescricoes_detalhado_${dataArquivo}.pdf`;

    // Fazer download
    doc.save(nomeArquivo);

    return { sucesso: true, mensagem: 'Relatório detalhado gerado com sucesso!' };
  } catch (erro) {
    console.error('Erro ao exportar relatório detalhado:', erro);
    return { sucesso: false, erro: 'Erro ao gerar relatório detalhado' };
  }
};