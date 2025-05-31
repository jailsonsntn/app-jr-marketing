// Funções de integração para salvar contratos no histórico

// Função para preencher o formulário de contrato a partir do histórico
function fillContractFormFromHistory(contractData) {
    // Preencher dados do cliente (contratante)
    if (contractData.clientName) document.getElementById('clientName').value = contractData.clientName;
    if (contractData.clientDocument) document.getElementById('clientDocument').value = contractData.clientDocument;
    if (contractData.clientAddress) document.getElementById('clientAddress').value = contractData.clientAddress;
    if (contractData.clientRepresentative) document.getElementById('clientRepresentative').value = contractData.clientRepresentative;
    if (contractData.clientEmail) document.getElementById('clientEmail').value = contractData.clientEmail;
    if (contractData.clientPhone) document.getElementById('clientPhone').value = contractData.clientPhone;
    
    // Preencher detalhes do contrato
    if (contractData.contractStartDate) document.getElementById('contractStartDate').value = contractData.contractStartDate;
    if (contractData.contractDuration) {
        const durationSelect = document.getElementById('contractDuration');
        
        // Verificar se o valor está entre as opções padrão
        const standardDurations = ['3', '6', '12', '24'];
        if (standardDurations.includes(contractData.contractDuration)) {
            durationSelect.value = contractData.contractDuration;
        } else {
            // Se for um valor personalizado
            durationSelect.value = 'custom';
            
            // Mostrar o campo de duração personalizada
            document.getElementById('customDurationRow').style.display = 'flex';
            document.getElementById('customDuration').value = contractData.contractDuration;
        }
    }
    
    if (contractData.paymentValue) document.getElementById('paymentValue').value = contractData.paymentValue;
    if (contractData.paymentMethod) document.getElementById('paymentMethod').value = contractData.paymentMethod;
    if (contractData.paymentDay) document.getElementById('paymentDay').value = contractData.paymentDay;
    if (contractData.contractType) document.getElementById('contractType').value = contractData.contractType;
    if (contractData.servicesScope) document.getElementById('servicesScope').value = contractData.servicesScope;
    if (contractData.additionalClauses) document.getElementById('additionalClauses').value = contractData.additionalClauses;
    
    // Mostrar mensagem de sucesso
    showHistoryLoadSuccessMessage();
}

// Função para salvar contrato no histórico quando gerado
function saveCurrentContractToHistory() {
    // Coletar dados do formulário
    const contractData = {
        // Dados do cliente (contratante)
        clientName: document.getElementById('clientName').value,
        clientDocument: document.getElementById('clientDocument').value,
        clientAddress: document.getElementById('clientAddress').value,
        clientRepresentative: document.getElementById('clientRepresentative').value,
        clientEmail: document.getElementById('clientEmail').value,
        clientPhone: document.getElementById('clientPhone').value,
        
        // Dados da contratada (já preenchidos no formulário)
        companyName: document.getElementById('companyName').value,
        companyDocument: document.getElementById('companyDocument').value,
        companyAddress: document.getElementById('companyAddress').value,
        companyRepresentative: document.getElementById('companyRepresentative').value,
        companyEmail: document.getElementById('companyEmail').value,
        companyPhone: document.getElementById('companyPhone').value,
        
        // Detalhes do contrato
        contractStartDate: document.getElementById('contractStartDate').value,
        contractDuration: document.getElementById('contractDuration').value === 'custom' ? 
            document.getElementById('customDuration').value : 
            document.getElementById('contractDuration').value,
        paymentValue: document.getElementById('paymentValue').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        paymentDay: document.getElementById('paymentDay').value,
        contractType: document.getElementById('contractType').value,
        servicesScope: document.getElementById('servicesScope').value,
        additionalClauses: document.getElementById('additionalClauses').value
    };
    
    // Salvar no histórico
    if (window.documentHistory && window.documentHistory.saveContract) {
        window.documentHistory.saveContract(contractData);
        console.log('Contrato salvo no histórico com sucesso!');
    } else {
        console.error('Módulo de histórico não encontrado');
    }
}

// Função para mostrar mensagem de sucesso ao carregar do histórico
function showHistoryLoadSuccessMessage() {
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>Documento carregado com sucesso!</strong> Os campos foram preenchidos a partir do histórico.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Inserir no topo do formulário
    const formCard = document.querySelector('.card-body');
    if (formCard) {
        formCard.insertBefore(alertDiv, formCard.firstChild);
    } else {
        document.body.insertBefore(alertDiv, document.body.firstChild);
    }
    
    // Configurar para desaparecer após 5 segundos
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 500);
    }, 5000);
}

// Adicionar evento ao botão de gerar contrato para salvar no histórico
document.addEventListener('DOMContentLoaded', function() {
    const generateContractBtn = document.getElementById('generateContractBtn');
    if (generateContractBtn) {
        // Preservar o evento original e adicionar o salvamento no histórico
        const originalClickHandler = generateContractBtn.onclick;
        generateContractBtn.onclick = function(event) {
            // Chamar o handler original primeiro
            if (originalClickHandler) {
                originalClickHandler.call(this, event);
            }
            
            // Depois salvar no histórico
            setTimeout(saveCurrentContractToHistory, 500);
        };
    }
});

// Exportar funções para uso global
window.fillContractFormFromHistory = fillContractFormFromHistory;
