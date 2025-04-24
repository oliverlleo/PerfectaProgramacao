// Variáveis globais
let ordensServico = [];
let contadorOrdens = 1;
let dataGlobalSalva = '';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegação
    configurarNavegacao();
    
    // Configurar formulário
    configurarFormulario();
    
    // Configurar botões de exportação
    configurarExportacao();
    
    // Carregar ordens de serviço salvas
    carregarOrdensServico();
    
    // Carregar data global salva
    carregarDataGlobal();
    
    // Atualizar data atual
    atualizarDataAtual();
});

// Funções de navegação
function configurarNavegacao() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Mostrar seção correspondente
            const sectionId = this.getAttribute('data-section');
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                section.classList.remove('active-section');
            });
            
            document.getElementById(sectionId).classList.add('active-section');
            
            // Se for a seção de programação, atualizar a lista
            if (sectionId === 'programacao') {
                renderizarOrdensServico();
            }
        });
    });
}

// Funções de formulário
function configurarFormulario() {
    const ordensContainer = document.getElementById('ordens-container');
    const osForm = document.getElementById('os-form');
    
    // Configurar seleção de funcionários
    document.addEventListener('change', function(e) {
        if (e.target.name === 'funcionario') {
            atualizarCampoFuncionarios(e.target.closest('.ordem-item'));
        }
    });
    
    // Configurar botão de adicionar ordem
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-ordem')) {
            contadorOrdens++;
            const novaOrdem = document.createElement('div');
            novaOrdem.className = 'ordem-item';
            novaOrdem.innerHTML = `
                <button type="button" class="btn-remove-ordem">×</button>
                <form class="os-form">
                    <div class="form-group">
                        <label for="cliente${contadorOrdens}">Cliente:</label>
                        <input type="text" id="cliente${contadorOrdens}" name="cliente" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="endereco${contadorOrdens}">Endereço:</label>
                        <input type="text" id="endereco${contadorOrdens}" name="endereco" placeholder="Endereço completo" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="prestadores${contadorOrdens}">Prestadores do Serviço:</label>
                        <div class="select-funcionarios">
                            <div class="funcionarios-options">
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Lucas"> Lucas</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Rubens"> Rubens</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Felipe"> Felipe</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Dino"> Dino</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Javier"> Javier</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Carlos"> Carlos</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Alan"> Alan</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Pazzis"> Pazzis</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="João"> João</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Rey"> Rey</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Jonathan"> Jonathan</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Leonardo"> Leonardo</label>
                                <label><input type="checkbox" name="funcionario${contadorOrdens}" value="Yuzuk"> Yuzuk</label>
                            </div>
                            <input type="hidden" id="prestadores${contadorOrdens}" name="prestadores" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="servico${contadorOrdens}">Serviço a ser executado:</label>
                        <textarea id="servico${contadorOrdens}" name="servico" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Tipo de Serviço:</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="tipo${contadorOrdens}" value="fabrica" required> Serviço de Fábrica
                            </label>
                            <label>
                                <input type="radio" name="tipo${contadorOrdens}" value="instalacao" required> Instalação
                            </label>
                            <label>
                                <input type="radio" name="tipo${contadorOrdens}" value="manutencao" required> Manutenção
                            </label>
                        </div>
                    </div>
                </form>
            `;
            ordensContainer.appendChild(novaOrdem);
        }
        
        if (e.target.classList.contains('btn-remove-ordem')) {
            e.target.parentElement.remove();
        }
    });
    
    // Função para atualizar o campo oculto de prestadores
    function atualizarCampoFuncionarios(ordemItem) {
        if (!ordemItem) {
            // Para o primeiro formulário
            const checkboxes = document.querySelectorAll('input[name="funcionario"]:checked');
            const funcionariosSelecionados = Array.from(checkboxes).map(cb => cb.value);
            document.getElementById('prestadores').value = funcionariosSelecionados.join(', ');
        } else {
            // Para formulários adicionais
            const index = Array.from(document.querySelectorAll('.ordem-item')).indexOf(ordemItem) + 1;
            const checkboxes = ordemItem.querySelectorAll(`input[name="funcionario${index}"]:checked`);
            const funcionariosSelecionados = Array.from(checkboxes).map(cb => cb.value);
            ordemItem.querySelector(`#prestadores${index}`).value = funcionariosSelecionados.join(', ');
        }
    }
    
    // Configurar botão de cadastrar
    document.getElementById('btn-cadastrar').addEventListener('click', function() {
        // Atualizar todos os campos ocultos de prestadores antes de validar
        document.querySelectorAll('.ordem-item').forEach((ordemItem, index) => {
            if (index === 0) {
                atualizarCampoFuncionarios();
            } else {
                atualizarCampoFuncionarios(ordemItem);
            }
        });
        
        const formularios = document.querySelectorAll('.os-form');
        let ordensCadastradas = 0;
        
        // Usar a data global para todas as ordens de serviço
        const dataGlobal = document.getElementById('data-global').value;
        
        if (!dataGlobal) {
            alert('Por favor, informe a data da programação.');
            return;
        }
        
        // Salvar a data global no localStorage
        salvarDataGlobal(dataGlobal);
        
        formularios.forEach((form, index) => {
            // Obter dados do formulário
            const cliente = form.querySelector('[name="cliente"]').value;
            const endereco = form.querySelector('[name="endereco"]').value;
            const prestadores = form.querySelector('[name="prestadores"]').value;
            const servico = form.querySelector('[name="servico"]').value;
            
            // Verificar tipo de serviço
            let tipo = '';
            if (index === 0) {
                const tipoSelecionado = document.querySelector('input[name="tipo"]:checked');
                if (tipoSelecionado) {
                    tipo = tipoSelecionado.value;
                }
            } else {
                const tipoSelecionado = document.querySelector(`input[name="tipo${index+1}"]:checked`);
                if (tipoSelecionado) {
                    tipo = tipoSelecionado.value;
                }
            }
            
            // Verificar se todos os campos estão preenchidos
            if (cliente && endereco && prestadores && servico && tipo) {
                const ordemServico = {
                    id: Date.now() + Math.floor(Math.random() * 1000) + index, // ID único
                    cliente: cliente,
                    endereco: endereco,
                    prestadores: prestadores,
                    servico: servico,
                    data: dataGlobal, // Usar a mesma data para todas as ordens
                    tipo: tipo
                };
                
                // Adicionar ordem de serviço
                adicionarOrdemServico(ordemServico);
                ordensCadastradas++;
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
        });
        
        if (ordensCadastradas > 0) {
            // Limpar formulários
            limparFormularios();
            
            // Mostrar mensagem de sucesso
            alert(`${ordensCadastradas} ordem(ns) de serviço cadastrada(s) com sucesso!`);
        }
    });
    
    // Configurar botão de limpar
    document.getElementById('btn-limpar').addEventListener('click', function() {
        limparFormularios();
    });
}

function limparFormularios() {
    // Limpar primeiro formulário
    document.getElementById('os-form').reset();
    
    // Limpar checkboxes de funcionários
    document.querySelectorAll('input[name="funcionario"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Limpar campo oculto de prestadores
    document.getElementById('prestadores').value = '';
    
    // Remover formulários adicionais
    const ordensAdicionais = document.querySelectorAll('.ordem-item:not(:first-child)');
    ordensAdicionais.forEach(ordem => {
        ordem.remove();
    });
    
    // Resetar contador
    contadorOrdens = 1;
}

// Funções de armazenamento
function carregarOrdensServico() {
    const ordensServicoSalvas = localStorage.getItem('ordensServico');
    
    if (ordensServicoSalvas) {
        ordensServico = JSON.parse(ordensServicoSalvas);
        renderizarOrdensServico();
    }
}

function carregarDataGlobal() {
    const dataSalva = localStorage.getItem('dataGlobal');
    
    if (dataSalva) {
        dataGlobalSalva = dataSalva;
    }
}

function adicionarOrdemServico(os) {
    ordensServico.push(os);
    salvarOrdensServico();
    renderizarOrdensServico();
}

function salvarOrdensServico() {
    localStorage.setItem('ordensServico', JSON.stringify(ordensServico));
}

function salvarDataGlobal(data) {
    dataGlobalSalva = data;
    localStorage.setItem('dataGlobal', data);
}

// Funções de renderização
function renderizarOrdensServico() {
    const obrasExternasList = document.getElementById('obras-externas-list');
    const servicosFabricaList = document.getElementById('servicos-fabrica-list');
    const currentDateElement = document.getElementById('current-date');
    
    // Limpar listas
    obrasExternasList.innerHTML = '';
    servicosFabricaList.innerHTML = '';
    
    // Filtrar ordens por tipo
    const obrasExternas = ordensServico.filter(os => os.tipo === 'instalacao' || os.tipo === 'manutencao');
    const servicosFabrica = ordensServico.filter(os => os.tipo === 'fabrica');
    
    // Usar a data global para o cabeçalho
    if (ordensServico.length > 0) {
        // Usar a data da primeira ordem para o cabeçalho
        const dataString = ordensServico[0].data;
        const [ano, mes, dia] = dataString.split('-').map(num => parseInt(num, 10));
        const dataOrdem = new Date(ano, mes - 1, dia); // Mês em JavaScript é 0-indexed
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dataFormatada = dataOrdem.toLocaleDateString('pt-BR', options);
        
        // Capitalizar primeira letra
        const dataCapitalizada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        
        currentDateElement.textContent = dataCapitalizada;
    } else if (dataGlobalSalva) {
        // Se não houver ordens, mas tiver data global salva, usar a data salva
        const dataString = dataGlobalSalva;
        const [ano, mes, dia] = dataString.split('-').map(num => parseInt(num, 10));
        const dataSalva = new Date(ano, mes - 1, dia); // Mês em JavaScript é 0-indexed
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dataFormatada = dataSalva.toLocaleDateString('pt-BR', options);
        
        // Capitalizar primeira letra
        const dataCapitalizada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        
        currentDateElement.textContent = dataCapitalizada;
    } else {
        // Se não houver ordens nem data salva, usar a data atual
        const dataAtual = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dataFormatada = dataAtual.toLocaleDateString('pt-BR', options);
        
        // Capitalizar primeira letra
        const dataCapitalizada = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
        
        currentDateElement.textContent = dataCapitalizada;
    }
    
    // Renderizar obras externas
    if (obrasExternas.length === 0) {
        obrasExternasList.innerHTML = '<p class="empty-message">Nenhuma ordem de serviço de instalação ou manutenção cadastrada.</p>';
    } else {
        obrasExternas.forEach(os => {
            const card = criarCardObrasExternas(os);
            obrasExternasList.appendChild(card);
        });
    }
    
    // Renderizar serviços de fábrica
    if (servicosFabrica.length === 0) {
        servicosFabricaList.innerHTML = '<p class="empty-message">Nenhuma ordem de serviço de fábrica cadastrada.</p>';
    } else {
        servicosFabrica.forEach(os => {
            const card = criarCardServicosFabrica(os);
            servicosFabricaList.appendChild(card);
        });
    }
}

function criarCardObrasExternas(os) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    // Usar o endereço diretamente
    const enderecoFormatado = os.endereco;
    
    card.innerHTML = `
        <h4>${os.cliente}</h4>
        <p>${enderecoFormatado}</p>
        <div class="service-detail">
            <i class="fas fa-users"></i>
            <p>Equipe: ${os.prestadores}</p>
        </div>
        <div class="service-detail">
            <i class="fas fa-tools"></i>
            <p>Serviço: ${os.servico}</p>
        </div>
    `;
    
    return card;
}

function criarCardServicosFabrica(os) {
    const card = document.createElement('div');
    card.className = 'service-card';
    
    card.innerHTML = `
        <h4>${os.cliente}</h4>
        <div class="service-detail">
            <i class="fas fa-clipboard-list"></i>
            <p>Serviço: ${os.servico}</p>
        </div>
        <div class="service-detail">
            <i class="fas fa-users"></i>
            <p>Equipe: ${os.prestadores}</p>
        </div>
    `;
    
    return card;
}

// Funções de data
function atualizarDataAtual() {
    // Não vamos mais usar a data atual, pois agora usamos a data de cada ordem de serviço
    // Esta função permanece apenas para compatibilidade
}

// Funções de exportação
function configurarExportacao() {
    document.getElementById('btn-export-pdf').addEventListener('click', exportarPDF);
    document.getElementById('btn-export-jpeg').addEventListener('click', exportarJPEG);
    document.getElementById('btn-export-text').addEventListener('click', exportarTexto);
    document.getElementById('btn-limpar-dados').addEventListener('click', limparDados);
    document.getElementById('btn-gerar-os').addEventListener('click', gerarOrdensServicoPDF);
}

// Função para limpar todos os dados armazenados
function limparDados() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        // Limpar o localStorage
        localStorage.removeItem('ordensServico');
        localStorage.removeItem('dataGlobal');
        
        // Resetar o array de ordens e a data global
        ordensServico = [];
        dataGlobalSalva = '';
        
        // Atualizar a interface
        renderizarOrdensServico();
        
        // Mostrar mensagem de confirmação
        alert('Todos os dados foram removidos com sucesso!');
    }
}

function exportarPDF() {
    const jsPDF = window.jspdf.jsPDF;
    const reportContent = document.getElementById('report-content');
    const reportHeader = document.querySelector('.report-header');
    
    // Criar PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Adicionar título
    pdf.setFontSize(18);
    pdf.text('Programação de Trabalho', 105, 15, { align: 'center' });
    
    // Adicionar data
    pdf.setFontSize(12);
    pdf.text(document.getElementById('current-date').textContent, 105, 25, { align: 'center' });
    
    // Capturar conteúdo como imagem
    html2canvas(reportContent).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Adicionar imagem ao PDF
        const imgWidth = 190;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 35, imgWidth, imgHeight);
        
        // Salvar PDF
        pdf.save('programacao_trabalho.pdf');
    });
}

function exportarJPEG() {
    const reportContent = document.getElementById('report-content');
    const reportHeader = document.querySelector('.report-header');
    
    // Criar elemento temporário para capturar tudo junto
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.left = '-9999px';
    tempElement.style.background = 'white';
    tempElement.style.padding = '20px';
    
    // Clonar elementos
    const headerClone = reportHeader.cloneNode(true);
    const contentClone = reportContent.cloneNode(true);
    
    tempElement.appendChild(headerClone);
    tempElement.appendChild(contentClone);
    document.body.appendChild(tempElement);
    
    // Capturar como imagem
    html2canvas(tempElement).then(canvas => {
        // Converter para JPEG
        const imgData = canvas.toDataURL('image/jpeg');
        
        // Criar link para download
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'programacao_trabalho.jpg';
        link.click();
        
        // Remover elemento temporário
        document.body.removeChild(tempElement);
    });
}

function exportarTexto() {
    const currentDate = document.getElementById('current-date').textContent;
    const obrasExternas = ordensServico.filter(os => os.tipo === 'instalacao' || os.tipo === 'manutencao');
    const servicosFabrica = ordensServico.filter(os => os.tipo === 'fabrica');
    
    let texto = `🗓 *Programação ${currentDate}*\n\n`;
    
    // Adicionar obras externas
    texto += `🏗 *Serviço Externo*\n`;
    if (obrasExternas.length === 0) {
        texto += "Nenhum serviço externo cadastrado.\n";
    } else {
        obrasExternas.forEach(os => {
            texto += `*${os.cliente}*\n`;
            texto += `${os.endereco}\n`;
            texto += `Equipe: ${os.prestadores}\n`;
            texto += `Serviço: ${os.servico}\n\n`;
        });
    }
    
    // Adicionar serviços de fábrica
    texto += `\n⚙ *Serviço Interno*\n`;
    if (servicosFabrica.length === 0) {
        texto += "Nenhum serviço interno cadastrado.\n";
    } else {
        servicosFabrica.forEach(os => {
            texto += `*${os.cliente}*\n`;
            texto += `Serviço: ${os.servico}\n`;
            texto += `Equipe: ${os.prestadores}\n\n`;
        });
    }
    
    // Copiar para área de transferência
    navigator.clipboard.writeText(texto)
        .then(() => {
            alert('Texto copiado para a área de transferência! Você pode colar no WhatsApp.');
        })
        .catch(err => {
            console.error('Erro ao copiar texto: ', err);
            
            // Fallback para navegadores que não suportam clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Texto copiado para a área de transferência! Você pode colar no WhatsApp.');
        });
}
