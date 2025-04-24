/**
 * Gerador de Ordens de Serviço em PDF
 * 
 * Este script gera documentos PDF para ordens de serviço usando apenas JavaScript,
 * sem dependências de Python ou outros servidores.
 */

// Função para gerar PDF de ordem de serviço
function gerarPDFOrdemServico(ordem) {
    // Verificar se é uma ordem válida
    if (!ordem || !ordem.cliente || !ordem.endereco || !ordem.servico) {
        console.error('Ordem de serviço inválida:', ordem);
        return null;
    }
    
    // Criar novo documento PDF
    const jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Configurações de página
    const pageWidth = 210;  // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Adicionar logo da Perfecta
    try {
        // Usar o logo do site
        const logoImg = document.querySelector('.logo');
        if (logoImg) {
            // Capturar logo como imagem
            html2canvas(logoImg).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                // Adicionar logo ao PDF
                pdf.addImage(imgData, 'PNG', margin, margin, 30, 15);
                
                // Continuar com o resto do documento
                continuarGeracaoPDF(pdf, ordem, pageWidth, pageHeight, margin, contentWidth);
            });
        } else {
            // Se não conseguir capturar o logo, continuar sem ele
            continuarGeracaoPDF(pdf, ordem, pageWidth, pageHeight, margin, contentWidth);
        }
    } catch (error) {
        console.error('Erro ao adicionar logo:', error);
        // Continuar sem o logo
        continuarGeracaoPDF(pdf, ordem, pageWidth, pageHeight, margin, contentWidth);
    }
    
    return pdf;
}

// Função para continuar a geração do PDF após tentativa de adicionar o logo
function continuarGeracaoPDF(pdf, ordem, pageWidth, pageHeight, margin, contentWidth) {
    // Título principal
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('ORDEM DE SERVIÇO', pageWidth / 2, margin + 10, { align: 'center' });
    
    // Tabela de remetente
    pdf.setFontSize(12);
    pdf.setDrawColor(0);
    pdf.setFillColor(240, 240, 240);
    
    // Cabeçalho da tabela remetente
    let yPos = margin + 20;
    pdf.rect(margin, yPos, contentWidth, 10, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.text('REMETENTE', margin + 5, yPos + 6);
    
    // Conteúdo da tabela remetente
    yPos += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.rect(margin, yPos, contentWidth, 50, 'S');
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERFECTA ESQUADRIAS LTDA ME', margin + 5, yPos + 8);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Rua: Capitão Bento Mascarenhas Jequitinhonha, 2455 – Jardim América', margin + 5, yPos + 16);
    pdf.text('Sorocaba/SP', margin + 5, yPos + 22);
    pdf.text('Telefone: (15) 3327-5866', margin + 5, yPos + 30);
    pdf.text('E-mail: mariana@perfectaesquadrias.com.br', margin + 5, yPos + 38);
    
    // Formatar data
    const dataFormatada = formatarDataPorExtenso(ordem.data);
    pdf.text(`Local e Data: ${dataFormatada}`, margin + 5, yPos + 46);
    
    // Tabela de destinatário
    yPos += 60;
    pdf.setFont('helvetica', 'bold');
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos, contentWidth, 10, 'F');
    pdf.text('DESTINATÁRIO', margin + 5, yPos + 6);
    
    // Conteúdo da tabela destinatário
    yPos += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.rect(margin, yPos, contentWidth, 25, 'S');
    
    pdf.text(`Para: ${ordem.cliente}`, margin + 5, yPos + 8);
    pdf.text(`Endereço: ${ordem.endereco}`, margin + 5, yPos + 16);
    
    // Serviço a ser executado
    yPos += 35;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Serviço a ser executado:', margin, yPos);
    
    // Quebrar texto longo em múltiplas linhas
    pdf.setFont('helvetica', 'normal');
    const servicoLinhas = pdf.splitTextToSize(ordem.servico, contentWidth);
    pdf.text(servicoLinhas, margin, yPos + 8);
    
    // Calcular nova posição Y após o texto do serviço
    yPos += 8 + (servicoLinhas.length * 7);
    
    // Adicionar prestadores de serviço se disponível
    if (ordem.prestadores) {
        yPos += 10;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Prestadores do Serviço:', margin, yPos);
        pdf.setFont('helvetica', 'normal');
        pdf.text(ordem.prestadores, margin, yPos + 8);
        yPos += 15;
    }
    
    // Assinatura
    yPos = 240;
    pdf.setFont('helvetica', 'bold');
    pdf.text('ASSINATURA DO RESPONSÁVEL', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 20;
    pdf.line(pageWidth / 2 - 40, yPos, pageWidth / 2 + 40, yPos);
    
    // Rodapé com data
    yPos += 15;
    pdf.text(dataFormatada, pageWidth / 2, yPos, { align: 'center' });
    
    // Salvar PDF
    const nomeArquivo = `OS_${ordem.cliente.replace(/\s+/g, '_')}_${ordem.id}.pdf`;
    pdf.save(nomeArquivo);
}

// Função para formatar data no formato "Sorocaba, 30 de abril de 2025"
function formatarDataPorExtenso(dataString) {
    try {
        // Converter string de data para objeto Date
        const [ano, mes, dia] = dataString.split('-').map(num => parseInt(num, 10));
        
        // Meses em português
        const meses = [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];
        
        // Formatar data por extenso
        return `Sorocaba, ${dia} de ${meses[mes-1]} de ${ano}`;
    } catch (e) {
        console.error('Erro ao formatar data:', e);
        return dataString;
    }
}

// Função para gerar PDFs para todas as ordens de serviço (exceto fábrica)
function gerarOrdensServicoPDF() {
    // Filtrar apenas ordens que não são do tipo fábrica
    const ordensParaGerar = ordensServico.filter(os => os.tipo !== 'fabrica');
    
    if (ordensParaGerar.length === 0) {
        alert('Não há ordens de serviço de instalação ou manutenção para gerar documentos.');
        return;
    }
    
    // Mostrar mensagem de processamento
    alert(`Gerando ${ordensParaGerar.length} documento(s) de ordem de serviço.`);
    
    // Array para armazenar os links de download
    const downloadLinks = [];
    
    // Gerar PDF para cada ordem
    ordensParaGerar.forEach(ordem => {
        try {
            // Gerar PDF
            const pdf = gerarPDFOrdemServico(ordem);
            if (!pdf) return;
            
            // Nome do arquivo baseado no cliente
            const nomeArquivo = `OS_${ordem.cliente.replace(/\s+/g, '_')}_${ordem.id}.pdf`;
            
            // Adicionar informação para exibir link depois
            downloadLinks.push({
                cliente: ordem.cliente,
                id: ordem.id
            });
        } catch (error) {
            console.error(`Erro ao gerar PDF para ordem ${ordem.id}:`, error);
        }
    });
    
    // Se gerou algum PDF com sucesso
    if (downloadLinks.length > 0) {
        // Criar um elemento para mostrar mensagem de sucesso
        const downloadDiv = document.createElement('div');
        downloadDiv.className = 'download-links';
        downloadDiv.innerHTML = '<h4>Documentos gerados com sucesso!</h4>';
        downloadDiv.innerHTML += `<p>Foram gerados ${downloadLinks.length} documento(s) de ordem de serviço.</p>`;
        downloadDiv.innerHTML += '<p>Os arquivos foram salvos automaticamente na pasta de downloads do seu navegador.</p>';
        
        // Adicionar lista de documentos gerados
        const listaDocumentos = document.createElement('ul');
        downloadLinks.forEach(link => {
            const item = document.createElement('li');
            item.textContent = `OS - ${link.cliente}`;
            listaDocumentos.appendChild(item);
        });
        downloadDiv.appendChild(listaDocumentos);
        
        // Adicionar à página
        const reportContent = document.getElementById('report-content');
        
        // Verificar se já existe uma seção de downloads e removê-la
        const existingDownloads = document.querySelector('.download-links');
        if (existingDownloads) {
            existingDownloads.remove();
        }
        
        // Adicionar a nova seção de downloads
        reportContent.insertBefore(downloadDiv, reportContent.firstChild);
        
        alert(`${downloadLinks.length} documento(s) gerado(s) com sucesso! Os arquivos foram salvos na pasta de downloads.`);
    } else {
        alert('Não foi possível gerar nenhum documento.');
    }
}
