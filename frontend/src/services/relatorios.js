// frontend/src/services/relatorios.js
import * as XLSX from 'xlsx-js-style';
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

/**
 * Gerar Mapa de Refeição em Excel (v2)
 * Com cores no leito, bordas por paciente, tipo de dieta nas refeições, e data de consumo
 */
export const gerarMapaRefeicao = (prescricoes, filtros = {}) => {
  try {
    if (!prescricoes || prescricoes.length === 0) {
      return { sucesso: false, erro: 'Nenhuma prescrição para gerar mapa.' };
    }

    const ORDEM_REFEICOES = ['Merenda', 'Jantar', 'Ceia', 'Desjejum', 'Colação', 'Almoço'];

    // Cores por núcleo/setor para a célula do leito
    const CORES_NUCLEO = {
      'INTERNAÇÃO':      'D5F5E3',  // verde claro
      'UTI ADULTO':      'FADBD8',  // vermelho claro
      'UTI PEDIÁTRICA':  'FCF3CF',  // amarelo claro
      'UDT':             'D6EAF8',  // azul claro
      'TMO':             'E8DAEF',  // roxo claro
    };
    const COR_PADRAO = 'F2F3F4'; // cinza claro (para setores não mapeados)

    // =============================================
    // 1. AGRUPAR prescrições por paciente + data
    // =============================================
    const grupos = {};

    prescricoes.forEach(p => {
      const dataStr = new Date(p.data_prescricao).toLocaleDateString('pt-BR');
      const chave = `${p.cpf}_${dataStr}`;

      if (!grupos[chave]) {
        grupos[chave] = {
          data: dataStr,
          cpf: p.cpf,
          leito: p.leito || '',
          nucleo: p.nucleo || '',
          nomePaciente: p.nome_paciente || '',
          idade: p.idade || '',
          convenio: p.convenio || '',
          codigoAtendimento: p.codigo_atendimento || '',
          refeicoes: {}
        };
      }

      const tipoRefeicao = p.tipo_alimentacao || '';
      grupos[chave].refeicoes[tipoRefeicao] = {
        dieta: p.dieta || '',
        restricoes: Array.isArray(p.restricoes)
          ? p.restricoes
          : (p.restricoes ? (typeof p.restricoes === 'string' ? JSON.parse(p.restricoes) : []) : []),
        semPrincipal: p.sem_principal,
        descricaoSemPrincipal: p.descricao_sem_principal || '',
        obsExclusao: p.obs_exclusao || '',
        obsAcrescimo: p.obs_acrescimo || '',
        acrescimosIds: p.acrescimos_ids || '',
        itensEspeciaisIds: p.itens_especiais_ids || '',
        temAcompanhante: p.tem_acompanhante,
        tipoAcompanhante: p.tipo_acompanhante || ''
      };

      if (p.leito) grupos[chave].leito = p.leito;
      if (p.nucleo) grupos[chave].nucleo = p.nucleo;
    });

    // =============================================
    // 2. MONTAR DADOS
    // =============================================
    const wb = XLSX.utils.book_new();

    // Cabeçalho (agora com Data Consumo)
    const COLUNAS = [
      'Data Consumo',      // A
      'Leito',             // B
      'Cond. Nutricional', // C
      'Convênio',          // D
      'Restrições',        // E
      '',                  // F (gap)
      'Merenda',           // G
      'Jantar',            // H
      'Ceia',              // I
      'Desjejum',          // J
      'Colação',           // K
      'Almoço'             // L
    ];

    const linhas = [COLUNAS];

    // Metadados de estilo: para cada linha, guardar info de formatação
    // formato: { linhaIdx, tipo: 'cabecalho' | 'linha1' | 'linha2' | 'acomp' | 'vazio', nucleo, inicioBloco, fimBloco }
    const metaLinhas = [{ tipo: 'cabecalho' }];

    // Ordenar por núcleo + leito
    const gruposOrdenados = Object.values(grupos).sort((a, b) => {
      const nucleoComp = (a.nucleo || '').localeCompare(b.nucleo || '');
      if (nucleoComp !== 0) return nucleoComp;
      return (parseInt(a.leito) || 0) - (parseInt(b.leito) || 0);
    });

    gruposOrdenados.forEach(grupo => {
      const refeicaoKeys = Object.keys(grupo.refeicoes);
      const primeiraDieta = refeicaoKeys.length > 0
        ? grupo.refeicoes[refeicaoKeys[0]].dieta
        : '';

      // Coletar restrições
      const todasRestricoes = new Set();
      const restricoesPorRefeicao = {};
      let todasObsExclusao = [];
      let todosAcrescimos = [];

      refeicaoKeys.forEach(tipo => {
        const ref = grupo.refeicoes[tipo];
        if (ref.restricoes && ref.restricoes.length > 0) {
          ref.restricoes.forEach(r => todasRestricoes.add(r));
        }
        if (ref.semPrincipal && ref.descricaoSemPrincipal) {
          todasRestricoes.add(ref.descricaoSemPrincipal);
        }
        const restricoesMeal = [];
        if (ref.restricoes && ref.restricoes.length > 0) restricoesMeal.push(...ref.restricoes);
        if (ref.obsExclusao) restricoesMeal.push(ref.obsExclusao);
        restricoesPorRefeicao[tipo] = restricoesMeal.join(', ');
        if (ref.obsExclusao) todasObsExclusao.push(ref.obsExclusao);
        if (ref.obsAcrescimo) todosAcrescimos.push(ref.obsAcrescimo);
      });

      const restricoesTexto = Array.from(todasRestricoes).join(', ');
      const inicioBloco = linhas.length; // índice da linha1

      // ── LINHA 1: Data + Leito + Dieta + Convênio + Restrições + Refeições ──
      const linha1 = [
        grupo.data,                                     // Data Consumo
        `${grupo.nucleo} ${grupo.leito}`.trim(),        // Leito
        primeiraDieta,                                   // Cond. Nutricional
        grupo.convenio,                                  // Convênio
        restricoesTexto,                                 // Restrições
        '',                                              // gap
      ];

      ORDEM_REFEICOES.forEach(tipoRef => {
        if (grupo.refeicoes[tipoRef]) {
          const ref = grupo.refeicoes[tipoRef];
          let descricao = `${tipoRef} Paciente`;

          if (grupo.convenio && grupo.convenio.toUpperCase() !== 'SUS') {
            descricao = `${tipoRef} Pac. ${grupo.convenio}`;
          } else if (grupo.convenio && grupo.convenio.toUpperCase() === 'SUS') {
            descricao = `${tipoRef} Paciente SUS`;
          }

          if (ref.itensEspeciaisIds && ref.itensEspeciaisIds.length > 0) {
            descricao = `${tipoRef} Pac. c/sachê`;
          }

          // Adicionar tipo da dieta na célula da refeição
          if (ref.dieta) {
            descricao += `\n${ref.dieta}`;
          }

          linha1.push(descricao);
        } else {
          linha1.push('-');
        }
      });

      linhas.push(linha1);
      metaLinhas.push({ tipo: 'linha1', nucleo: grupo.nucleo });

      // ── LINHA 2: Nome.Idade + Acréscimos + Restrições por refeição ──
      const linha2 = [
        '',                                               // Data (vazio na linha2)
        `${grupo.nomePaciente}.${grupo.idade}a`,          // Nome
        '',                                               // vazio
        todosAcrescimos.join(', '),                       // Acréscimos
        todasObsExclusao.join(', '),                      // Obs Exclusão
        '',                                               // gap
      ];

      ORDEM_REFEICOES.forEach(tipoRef => {
        linha2.push(grupo.refeicoes[tipoRef] ? (restricoesPorRefeicao[tipoRef] || '') : '');
      });

      linhas.push(linha2);
      metaLinhas.push({ tipo: 'linha2', nucleo: grupo.nucleo });

      // ── LINHA ACOMPANHANTE (se houver) ──
      const temAcomp = refeicaoKeys.some(tipo => grupo.refeicoes[tipo].temAcompanhante);
      if (temAcomp) {
        const tipoAcomp = refeicaoKeys
          .map(tipo => grupo.refeicoes[tipo].tipoAcompanhante)
          .find(t => t) || 'adulto';

        const linhaAcomp = [
          '',
          `ACOMP. ${grupo.nucleo} ${grupo.leito}`.trim(),
          'Normal',
          grupo.convenio,
          `Acompanhante ${tipoAcomp}`,
          '',
        ];

        ORDEM_REFEICOES.forEach(tipoRef => {
          linhaAcomp.push(
            (grupo.refeicoes[tipoRef] && grupo.refeicoes[tipoRef].temAcompanhante)
              ? `${tipoRef} Acomp.\nNormal`
              : '-'
          );
        });

        linhas.push(linhaAcomp);
        metaLinhas.push({ tipo: 'acomp', nucleo: grupo.nucleo });
      }

      const fimBloco = linhas.length - 1; // índice da última linha do bloco

      // Guardar início/fim do bloco nas metaLinhas correspondentes
      for (let i = inicioBloco; i <= fimBloco; i++) {
        metaLinhas[i].inicioBloco = inicioBloco;
        metaLinhas[i].fimBloco = fimBloco;
      }
    });

    // =============================================
    // 3. CRIAR WORKSHEET
    // =============================================
    const ws = XLSX.utils.aoa_to_sheet(linhas);

    // Largura das colunas
    ws['!cols'] = [
      { wch: 12 },  // Data Consumo
      { wch: 16 },  // Leito
      { wch: 18 },  // Cond. Nutricional
      { wch: 12 },  // Convênio
      { wch: 25 },  // Restrições
      { wch: 2 },   // gap
      { wch: 24 },  // Merenda
      { wch: 24 },  // Jantar
      { wch: 24 },  // Ceia
      { wch: 24 },  // Desjejum
      { wch: 24 },  // Colação
      { wch: 24 },  // Almoço
    ];

    // =============================================
    // 4. APLICAR ESTILOS
    // =============================================
    const totalCols = COLUNAS.length; // 12 colunas (A-L)
    const colLetras = ['A','B','C','D','E','F','G','H','I','J','K','L'];

    // -- Estilo do Cabeçalho (linha 1) --
    const estiloCabecalho = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11, name: 'Arial' },
      fill: { fgColor: { rgb: '0D9488' } },  // teal do sistema
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        top:    { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left:   { style: 'thin', color: { rgb: '000000' } },
        right:  { style: 'thin', color: { rgb: '000000' } },
      }
    };

    for (let c = 0; c < totalCols; c++) {
      const celRef = colLetras[c] + '1';
      if (ws[celRef]) {
        ws[celRef].s = estiloCabecalho;
      }
    }

    // -- Estilos por linha de dados --
    for (let r = 1; r < metaLinhas.length; r++) {
      const meta = metaLinhas[r];
      const rowNum = r + 1; // Excel é 1-indexed e já temos cabeçalho na 1

      // Determinar cor do leito
      const corNucleo = CORES_NUCLEO[meta.nucleo] || COR_PADRAO;

      // Determinar se é linha de borda superior/inferior do bloco
      const ehTopBloco = (r === meta.inicioBloco);
      const ehBottomBloco = (r === meta.fimBloco);

      for (let c = 0; c < totalCols; c++) {
        const celRef = colLetras[c] + rowNum;
        if (!ws[celRef]) {
          ws[celRef] = { t: 's', v: '' };
        }

        // Estilo base
        const estilo = {
          font: { sz: 10, name: 'Arial' },
          alignment: { vertical: 'center', wrapText: true },
          border: {}
        };

        // === BORDAS EXTERNAS DO BLOCO ===
        // Borda superior no topo do bloco
        if (ehTopBloco) {
          estilo.border.top = { style: 'medium', color: { rgb: '333333' } };
        }
        // Borda inferior no fundo do bloco
        if (ehBottomBloco) {
          estilo.border.bottom = { style: 'medium', color: { rgb: '333333' } };
        }
        // Borda esquerda na primeira coluna
        if (c === 0) {
          estilo.border.left = { style: 'medium', color: { rgb: '333333' } };
        }
        // Borda direita na última coluna
        if (c === totalCols - 1) {
          estilo.border.right = { style: 'medium', color: { rgb: '333333' } };
        }

        // Bordas internas finas
        if (!estilo.border.top) {
          estilo.border.top = { style: 'thin', color: { rgb: 'CCCCCC' } };
        }
        if (!estilo.border.bottom) {
          estilo.border.bottom = { style: 'thin', color: { rgb: 'CCCCCC' } };
        }
        if (!estilo.border.left) {
          estilo.border.left = { style: 'thin', color: { rgb: 'CCCCCC' } };
        }
        if (!estilo.border.right) {
          estilo.border.right = { style: 'thin', color: { rgb: 'CCCCCC' } };
        }

        // === COR DA CÉLULA DO LEITO (coluna B = index 1) ===
        if (c === 1) {
          estilo.fill = { fgColor: { rgb: corNucleo } };
          estilo.font = { ...estilo.font, bold: true };
        }

        // === ESTILOS POR TIPO DE LINHA ===
        if (meta.tipo === 'linha1') {
          // Linha 1: dados principais - fonte normal
          if (c >= 6) { // colunas de refeição
            estilo.alignment.horizontal = 'center';
          }
        } else if (meta.tipo === 'linha2') {
          // Linha 2: nome/detalhes - fonte menor, itálico
          estilo.font = { ...estilo.font, sz: 9, italic: true, color: { rgb: '555555' } };
          if (c === 1) { // nome do paciente
            estilo.font = { ...estilo.font, bold: true, italic: false, color: { rgb: '000000' } };
            estilo.fill = { fgColor: { rgb: corNucleo } };
          }
        } else if (meta.tipo === 'acomp') {
          // Linha acompanhante: fundo amarelo claro
          estilo.fill = { fgColor: { rgb: 'FFF9C4' } };
          estilo.font = { ...estilo.font, sz: 9, italic: true };
          if (c === 1) {
            estilo.font = { ...estilo.font, bold: true };
          }
          if (c >= 6) {
            estilo.alignment.horizontal = 'center';
          }
        }

        ws[celRef].s = estilo;
      }
    }

    // Altura das linhas (para wrapText funcionar bem)
    ws['!rows'] = [];
    for (let r = 0; r < linhas.length; r++) {
      if (r === 0) {
        ws['!rows'].push({ hpt: 30 }); // cabeçalho mais alto
      } else {
        ws['!rows'].push({ hpt: 28 }); // linhas de dados
      }
    }

    // =============================================
    // 5. GERAR ARQUIVO
    // =============================================
    XLSX.utils.book_append_sheet(wb, ws, 'Mapa de Refeição');

    const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeArquivo = `mapa_refeicao_${dataAtual}.xlsx`;
    XLSX.writeFile(wb, nomeArquivo);

    return { sucesso: true, mensagem: 'Mapa de refeição gerado com sucesso!' };
  } catch (erro) {
    console.error('Erro ao gerar mapa de refeição:', erro);
    return { sucesso: false, erro: 'Erro ao gerar mapa de refeição' };
  }
};