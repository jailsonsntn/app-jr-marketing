// Variáveis globais
let contractData = {};
let clientSignaturePad;
let companySignaturePad;

// Elementos DOM
document.addEventListener('DOMContentLoaded', function() {
    // Botões
    const generateContractBtn = document.getElementById('generateContractBtn');
    const resetBtn = document.getElementById('resetBtn');
    const editContractBtn = document.getElementById('editContractBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const shareContractBtn = document.getElementById('shareContractBtn');
    const clearClientSignatureBtn = document.getElementById('clearClientSignature');
    const clearCompanySignatureBtn = document.getElementById('clearCompanySignature');
    
    // Eventos
    generateContractBtn.addEventListener('click', generateContract);
    resetBtn.addEventListener('click', resetForm);
    editContractBtn.addEventListener('click', editContract);
    downloadPdfBtn.addEventListener('click', downloadPDF);
    shareContractBtn.addEventListener('click', shareContract);
    
    // Inicializar pads de assinatura quando o contrato for gerado
    document.getElementById('contractPreview').addEventListener('display', function(e) {
        if (e.target.style.display !== 'none') {
            initSignaturePads();
        }
    });
    
    // Mostrar/ocultar campo de duração personalizada
    document.getElementById('contractDuration').addEventListener('change', function() {
        const customDurationRow = document.getElementById('customDurationRow');
        if (this.value === 'custom') {
            customDurationRow.style.display = 'flex';
            document.getElementById('customDuration').setAttribute('required', 'required');
        } else {
            customDurationRow.style.display = 'none';
            document.getElementById('customDuration').removeAttribute('required');
        }
    });
    
    // Limpar assinaturas
    if (clearClientSignatureBtn) {
        clearClientSignatureBtn.addEventListener('click', function() {
            if (clientSignaturePad) clientSignaturePad.clear();
        });
    }
    
    if (clearCompanySignatureBtn) {
        clearCompanySignatureBtn.addEventListener('click', function() {
            if (companySignaturePad) companySignaturePad.clear();
        });
    }
});

// Inicializar pads de assinatura
function initSignaturePads() {
    const clientCanvas = document.getElementById('clientSignature');
    const companyCanvas = document.getElementById('companySignature');
    
    if (clientCanvas && !clientSignaturePad) {
        clientSignaturePad = new SignaturePad(clientCanvas, {
            backgroundColor: 'rgb(249, 249, 249)',
            penColor: 'rgb(0, 0, 0)'
        });
    }
    
    if (companyCanvas && !companySignaturePad) {
        companySignaturePad = new SignaturePad(companyCanvas, {
            backgroundColor: 'rgb(249, 249, 249)',
            penColor: 'rgb(0, 0, 0)'
        });
    }
    
    // Ajustar tamanho dos canvas
    resizeCanvas(clientCanvas);
    resizeCanvas(companyCanvas);
    
    // Ajustar tamanho ao redimensionar a janela
    window.addEventListener('resize', function() {
        resizeCanvas(clientCanvas);
        resizeCanvas(companyCanvas);
    });
}

// Ajustar tamanho do canvas
function resizeCanvas(canvas) {
    if (!canvas) return;
    
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

// Coletar dados do formulário
function collectFormData() {
    // Dados da contratante
    contractData.clientName = document.getElementById('clientName').value;
    contractData.clientDocument = document.getElementById('clientDocument').value;
    contractData.clientAddress = document.getElementById('clientAddress').value;
    contractData.clientRepresentative = document.getElementById('clientRepresentative').value;
    contractData.clientEmail = document.getElementById('clientEmail').value;
    contractData.clientPhone = document.getElementById('clientPhone').value;
    
    // Dados da contratada (pré-preenchidos)
    contractData.companyName = document.getElementById('companyName').value;
    contractData.companyDocument = document.getElementById('companyDocument').value;
    contractData.companyAddress = document.getElementById('companyAddress').value;
    contractData.companyRepresentative = document.getElementById('companyRepresentative').value;
    contractData.companyEmail = document.getElementById('companyEmail').value;
    contractData.companyPhone = document.getElementById('companyPhone').value;
    
    // Detalhes do contrato
    contractData.contractStartDate = document.getElementById('contractStartDate').value;
    
    // Calcular data de término com base na duração
    const durationSelect = document.getElementById('contractDuration');
    let duration;
    
    if (durationSelect.value === 'custom') {
        duration = parseInt(document.getElementById('customDuration').value);
    } else {
        duration = parseInt(durationSelect.value);
    }
    
    contractData.contractDuration = duration;
    
    // Calcular data de término
    const startDate = new Date(contractData.contractStartDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);
    contractData.contractEndDate = endDate.toISOString().split('T')[0];
    
    // Formatação de datas para exibição
    contractData.formattedStartDate = formatDate(contractData.contractStartDate);
    contractData.formattedEndDate = formatDate(contractData.contractEndDate);
    
    // Outros detalhes
    contractData.paymentValue = parseFloat(document.getElementById('paymentValue').value) || 0;
    contractData.paymentMethod = document.getElementById('paymentMethod').value;
    contractData.paymentDay = parseInt(document.getElementById('paymentDay').value) || 1;
    contractData.contractType = document.getElementById('contractType').value;
    contractData.servicesScope = document.getElementById('servicesScope').value;
    contractData.additionalClauses = document.getElementById('additionalClauses').value;
    
    // Data de geração
    contractData.generationDate = new Date().toLocaleDateString('pt-BR');
    
    return contractData;
}

// Validar formulário
function validateForm() {
    const form = document.getElementById('contractForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    // Validação específica para duração personalizada
    const durationSelect = document.getElementById('contractDuration');
    if (durationSelect.value === 'custom') {
        const customDuration = document.getElementById('customDuration');
        if (!customDuration.value.trim() || parseInt(customDuration.value) < 1) {
            customDuration.classList.add('is-invalid');
            isValid = false;
        } else {
            customDuration.classList.remove('is-invalid');
        }
    }
    
    return isValid;
}

// Gerar contrato
function generateContract() {
    if (!validateForm()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Coletar dados do formulário
    collectFormData();
    
    // Mostrar área de visualização do contrato
    document.getElementById('contractPreview').style.display = 'block';
    
    // Gerar conteúdo do contrato
    generateContractContent();
    
    // Inicializar pads de assinatura
    setTimeout(() => {
        initSignaturePads();
    }, 100);
    
    // Rolar para a área do contrato
    document.getElementById('contractPreview').scrollIntoView({ behavior: 'smooth' });
}

// Gerar conteúdo do contrato
function generateContractContent() {
    const contractContent = document.getElementById('contractContent');
    
    // Estrutura do contrato
    contractContent.innerHTML = `
        <!-- Cabeçalho do Contrato -->
        <div class="contract-header">
            <h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE ${contractData.contractType.toUpperCase()}</h2>
            <p>Pelo presente instrumento particular, as partes abaixo qualificadas:</p>
        </div>
        
        <!-- Qualificação das Partes -->
        <div class="contract-section">
            <p><strong>CONTRATANTE:</strong> ${contractData.clientName}, ${contractData.clientDocument ? 'inscrito(a) no CNPJ/CPF sob o nº ' + contractData.clientDocument : ''}, com sede/endereço em ${contractData.clientAddress}, ${contractData.clientRepresentative ? 'neste ato representado(a) por ' + contractData.clientRepresentative : ''}, e-mail: ${contractData.clientEmail}, telefone: ${contractData.clientPhone}, doravante denominado(a) simplesmente CONTRATANTE;</p>
            
            <p><strong>CONTRATADA:</strong> ${contractData.companyName}, inscrito(a) no CPF sob o nº ${contractData.companyDocument}, com endereço em ${contractData.companyAddress}, neste ato representado(a) por ${contractData.companyRepresentative}, e-mail: ${contractData.companyEmail}, telefone: ${contractData.companyPhone}, doravante denominado(a) simplesmente CONTRATADA;</p>
            
            <p>Têm entre si, justo e contratado, o presente instrumento particular de prestação de serviços, que se regerá pelas cláusulas e condições seguintes:</p>
        </div>
        
        <!-- Cláusulas Contratuais -->
        <div class="contract-section">
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA PRIMEIRA - DO OBJETO</p>
                <p>O presente contrato tem por objeto a prestação de serviços de ${contractData.contractType} pela CONTRATADA à CONTRATANTE, conforme especificações abaixo:</p>
                <p>${contractData.servicesScope}</p>
            </div>
            
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA SEGUNDA - DO PRAZO</p>
                <p>O presente contrato terá vigência de ${contractData.contractDuration} meses, com início em ${contractData.formattedStartDate} e término em ${contractData.formattedEndDate}, podendo ser prorrogado mediante acordo entre as partes, através de termo aditivo.</p>
            </div>
            
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA TERCEIRA - DO PREÇO E FORMA DE PAGAMENTO</p>
                <p>Pela prestação dos serviços, a CONTRATANTE pagará à CONTRATADA o valor mensal de R$ ${contractData.paymentValue.toFixed(2)} (${valorPorExtenso(contractData.paymentValue)}), a ser pago até o dia ${contractData.paymentDay} de cada mês, através de ${contractData.paymentMethod}.</p>
                <p>Parágrafo Único: Em caso de atraso no pagamento, incidirá multa de 2% (dois por cento) sobre o valor devido, juros de mora de 1% (um por cento) ao mês e correção monetária pelo índice IPCA.</p>
            </div>
            
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA QUARTA - DAS OBRIGAÇÕES DA CONTRATADA</p>
                <p>São obrigações da CONTRATADA:</p>
                <p>a) Executar os serviços conforme especificações deste contrato, com profissionais capacitados;</p>
                <p>b) Manter sigilo sobre todas as informações a que tiver acesso em razão da prestação dos serviços;</p>
                <p>c) Prestar os esclarecimentos que forem solicitados pela CONTRATANTE;</p>
                <p>d) Responsabilizar-se por todos os custos necessários para execução dos serviços;</p>
                <p>e) Apresentar relatórios mensais das atividades realizadas, quando solicitado.</p>
            </div>
            
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA QUINTA - DAS OBRIGAÇÕES DA CONTRATANTE</p>
                <p>São obrigações da CONTRATANTE:</p>
                <p>a) Efetuar os pagamentos devidos nas condições estabelecidas neste contrato;</p>
                <p>b) Fornecer à CONTRATADA todas as informações necessárias para a execução dos serviços;</p>
                <p>c) Comunicar à CONTRATADA qualquer irregularidade na prestação dos serviços;</p>
                <p>d) Permitir acesso dos profissionais da CONTRATADA às suas dependências, quando necessário para execução dos serviços.</p>
            </div>
            
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA SEXTA - DA RESCISÃO</p>
                <p>O presente contrato poderá ser rescindido por qualquer das partes, mediante notificação prévia de 30 (trinta) dias.</p>
                <p>Parágrafo Primeiro: Em caso de rescisão antecipada por parte da CONTRATANTE, sem justa causa, esta deverá pagar à CONTRATADA multa equivalente a 2 (duas) mensalidades.</p>
                <p>Parágrafo Segundo: O contrato poderá ser rescindido imediatamente, sem necessidade de aviso prévio, em caso de descumprimento de qualquer cláusula contratual por qualquer das partes.</p>
            </div>
            
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA SÉTIMA - DA PROPRIEDADE INTELECTUAL</p>
                <p>Todo o conteúdo criado pela CONTRATADA em virtude da prestação de serviços objeto deste contrato será de propriedade da CONTRATANTE, após o pagamento integral dos valores devidos.</p>
            </div>
            
            ${contractData.additionalClauses ? `
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA OITAVA - DISPOSIÇÕES ADICIONAIS</p>
                <p>${contractData.additionalClauses}</p>
            </div>
            ` : ''}
            
            <div class="contract-clause">
                <p class="contract-clause-title">CLÁUSULA ${contractData.additionalClauses ? 'NONA' : 'OITAVA'} - DO FORO</p>
                <p>As partes elegem o Foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas ou litígios decorrentes deste contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
            </div>
        </div>
        
        <!-- Encerramento e Assinaturas -->
        <div class="contract-section">
            <p>E, por estarem assim justas e contratadas, as partes assinam o presente instrumento em 2 (duas) vias de igual teor e forma, na presença das testemunhas abaixo.</p>
            
            <div class="contract-date">
                <p>São Paulo, ${contractData.generationDate}</p>
            </div>
            
            <div class="contract-signature">
                <div>
                    <div class="signature-line">
                        <p>${contractData.clientName}</p>
                        <p>CONTRATANTE</p>
                    </div>
                </div>
                <div>
                    <div class="signature-line">
                        <p>${contractData.companyName}</p>
                        <p>CONTRATADA</p>
                    </div>
                </div>
            </div>
            
            <div class="contract-signature" style="margin-top: 60px;">
                <div>
                    <div class="signature-line">
                        <p>Testemunha 1</p>
                        <p>CPF:</p>
                    </div>
                </div>
                <div>
                    <div class="signature-line">
                        <p>Testemunha 2</p>
                        <p>CPF:</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Rodapé do Contrato -->
        <div class="contract-footer">
            <p>Contrato gerado por Jota R Marketing - ${contractData.generationDate}</p>
        </div>
    `;
}

// Editar contrato
function editContract() {
    document.getElementById('contractPreview').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Resetar formulário
function resetForm() {
    document.getElementById('contractForm').reset();
    document.getElementById('contractPreview').style.display = 'none';
    
    // Resetar o campo de duração personalizada
    document.getElementById('customDurationRow').style.display = 'none';
    document.getElementById('customDuration').removeAttribute('required');
}

// Baixar PDF
function downloadPDF() {
    // Mostrar mensagem de carregamento
    alert("Preparando o PDF para download...");
    
    const { jsPDF } = window.jspdf;
    const contractElement = document.getElementById('contractContent');
    
    // Configurar PDF com formato A4
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
    });
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // Margem de 10mm em cada lado
    const contentWidth = pageWidth - (margin * 2);
    
    // Adicionar assinaturas ao PDF se estiverem preenchidas
    if (clientSignaturePad && !clientSignaturePad.isEmpty()) {
        const clientSignatureImg = clientSignaturePad.toDataURL();
        const clientSignatureElement = document.createElement('img');
        clientSignatureElement.src = clientSignatureImg;
        clientSignatureElement.style.width = '150px';
        clientSignatureElement.style.height = 'auto';
        
        // Encontrar o elemento de assinatura do cliente e adicionar a imagem
        const clientSignatureLines = contractElement.querySelectorAll('.signature-line');
        if (clientSignatureLines.length > 0) {
            clientSignatureLines[0].appendChild(clientSignatureElement);
        }
    }
    
    if (companySignaturePad && !companySignaturePad.isEmpty()) {
        const companySignatureImg = companySignaturePad.toDataURL();
        const companySignatureElement = document.createElement('img');
        companySignatureElement.src = companySignatureImg;
        companySignatureElement.style.width = '150px';
        companySignatureElement.style.height = 'auto';
        
        // Encontrar o elemento de assinatura da empresa e adicionar a imagem
        const companySignatureLines = contractElement.querySelectorAll('.signature-line');
        if (companySignatureLines.length > 1) {
            companySignatureLines[1].appendChild(companySignatureElement);
        }
    }
    
    // Usar html2canvas para capturar o contrato como imagem
    html2canvas(contractElement, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calcular proporção para manter a relação de aspecto
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Dividir o conteúdo em múltiplas páginas
        let heightLeft = imgHeight;
        let position = margin; // Posição inicial (margem superior)
        let pageCount = 0;
        
        // Adicionar primeira página
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - (margin * 2));
        pageCount++;
        
        // Adicionar páginas adicionais se necessário
        while (heightLeft > 0) {
            pdf.addPage();
            pageCount++;
            
            // Calcular posição para a próxima parte da imagem
            position = margin - (pageHeight - (margin * 2)) * (pageCount - 1);
            
            pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - (margin * 2));
        }
        
        // Salvar PDF
        pdf.save(`Contrato_${contractData.clientName}_${contractData.generationDate}.pdf`);
        
        // Remover as imagens de assinatura do DOM após gerar o PDF
        const signatureImages = contractElement.querySelectorAll('.signature-line img');
        signatureImages.forEach(img => img.remove());
    });
}

// Compartilhar contrato
function shareContract() {
    // Simulação de compartilhamento (em uma aplicação real, isso seria implementado com APIs de compartilhamento)
    const shareOptions = `
        <div class="modal fade" id="shareModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Compartilhar Contrato</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Link para compartilhamento:</label>
                            <input type="text" class="form-control" value="https://jota-r-marketing.com/contrato/temp-link" readonly>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-success" type="button">
                                <i class="fab fa-whatsapp me-2"></i>Enviar via WhatsApp
                            </button>
                            <button class="btn btn-primary" type="button">
                                <i class="far fa-envelope me-2"></i>Enviar por E-mail
                            </button>
                            <button class="btn btn-secondary" type="button">
                                <i class="far fa-copy me-2"></i>Copiar Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao corpo do documento
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = shareOptions;
    document.body.appendChild(modalContainer);
    
    // Mostrar modal
    const shareModal = new bootstrap.Modal(document.getElementById('shareModal'));
    shareModal.show();
}

// Formatar data (YYYY-MM-DD para DD/MM/YYYY)
function formatDate(dateString) {
    if (!dateString) return '';
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Converter valor numérico para extenso
function valorPorExtenso(valor) {
    if (valor === 0) return 'zero reais';
    
    const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const dezenas = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const dezenasEspeciais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
    
    // Arredondar para duas casas decimais e separar parte inteira e decimal
    const valorArredondado = Math.round(valor * 100) / 100;
    const parteInteira = Math.floor(valorArredondado);
    const parteDecimal = Math.round((valorArredondado - parteInteira) * 100);
    
    // Função para converter números até 999
    function converterGrupo(numero) {
        if (numero === 0) return '';
        
        let resultado = '';
        
        // Centenas
        if (numero >= 100) {
            if (numero === 100) {
                return 'cem';
            }
            resultado += centenas[Math.floor(numero / 100)] + ' e ';
            numero %= 100;
        }
        
        // Dezenas e unidades
        if (numero >= 10 && numero < 20) {
            resultado += dezenasEspeciais[numero - 10];
        } else {
            if (numero >= 20) {
                resultado += dezenas[Math.floor(numero / 10)];
                numero %= 10;
                
                if (numero > 0) {
                    resultado += ' e ';
                }
            }
            
            if (numero > 0) {
                resultado += unidades[numero];
            }
        }
        
        return resultado;
    }
    
    // Converter parte inteira
    let resultado = '';
    
    if (parteInteira === 0) {
        resultado = 'zero';
    } else {
        const bilhoes = Math.floor(parteInteira / 1000000000);
        const milhoes = Math.floor((parteInteira % 1000000000) / 1000000);
        const milhares = Math.floor((parteInteira % 1000000) / 1000);
        const unidades = parteInteira % 1000;
        
        if (bilhoes > 0) {
            resultado += converterGrupo(bilhoes) + ' bilh' + (bilhoes === 1 ? 'ão' : 'ões');
            if (milhoes > 0 || milhares > 0 || unidades > 0) resultado += ' ';
        }
        
        if (milhoes > 0) {
            resultado += converterGrupo(milhoes) + ' milh' + (milhoes === 1 ? 'ão' : 'ões');
            if (milhares > 0 || unidades > 0) resultado += ' ';
        }
        
        if (milhares > 0) {
            resultado += converterGrupo(milhares) + ' mil';
            if (unidades > 0) resultado += ' ';
        }
        
        if (unidades > 0) {
            resultado += converterGrupo(unidades);
        }
    }
    
    // Adicionar "reais"
    resultado += ' ' + (parteInteira === 1 ? 'real' : 'reais');
    
    // Adicionar parte decimal (centavos)
    if (parteDecimal > 0) {
        resultado += ' e ' + converterGrupo(parteDecimal) + ' centavo' + (parteDecimal === 1 ? '' : 's');
    }
    
    return resultado;
}
