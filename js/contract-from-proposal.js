// Integração para receber dados da proposta no contrato
// Este script gerencia o preenchimento automático do contrato a partir dos dados da proposta

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos vindo da página de proposta
    const urlParams = new URLSearchParams(window.location.search);
    const fromProposal = urlParams.get('fromProposal');
    
    if (fromProposal === 'true') {
        // Tentar recuperar os dados da proposta do localStorage
        const proposalDataJson = localStorage.getItem('proposalToContractData');
        
        if (proposalDataJson) {
            try {
                const proposalData = JSON.parse(proposalDataJson);
                
                // Preencher o formulário de contrato com os dados da proposta
                fillContractFormFromProposal(proposalData);
                
                // Exibir mensagem de sucesso
                showProposalImportMessage();
                
                // Limpar os dados do localStorage após uso
                // localStorage.removeItem('proposalToContractData');
            } catch (error) {
                console.error('Erro ao processar dados da proposta:', error);
            }
        }
    }
});

// Função para preencher o formulário de contrato com os dados da proposta
function fillContractFormFromProposal(data) {
    // Preencher dados do cliente
    if (data.clientName) document.getElementById('clientName').value = data.clientName;
    if (data.clientDocument) document.getElementById('clientDocument').value = data.clientDocument;
    if (data.clientAddress) document.getElementById('clientAddress').value = data.clientAddress;
    if (data.clientRepresentative) document.getElementById('clientRepresentative').value = data.clientRepresentative;
    if (data.clientEmail) document.getElementById('clientEmail').value = data.clientEmail;
    if (data.clientPhone) document.getElementById('clientPhone').value = data.clientPhone;
    
    // Preencher detalhes do contrato
    if (data.contractStartDate) document.getElementById('contractStartDate').value = data.contractStartDate;
    if (data.contractDuration) {
        const durationSelect = document.getElementById('contractDuration');
        
        // Verificar se o valor está entre as opções padrão
        const standardDurations = ['3', '6', '12', '24'];
        if (standardDurations.includes(data.contractDuration)) {
            durationSelect.value = data.contractDuration;
        } else {
            // Se for um valor personalizado
            durationSelect.value = 'custom';
            
            // Mostrar o campo de duração personalizada
            document.getElementById('customDurationRow').style.display = 'flex';
            document.getElementById('customDuration').value = data.contractDuration;
        }
    }
    
    if (data.paymentValue) document.getElementById('paymentValue').value = data.paymentValue;
    if (data.paymentMethod) document.getElementById('paymentMethod').value = data.paymentMethod;
    if (data.paymentDay) document.getElementById('paymentDay').value = data.paymentDay;
    if (data.contractType) document.getElementById('contractType').value = data.contractType;
    if (data.servicesScope) document.getElementById('servicesScope').value = data.servicesScope;
}

// Função para exibir mensagem de importação bem-sucedida
function showProposalImportMessage() {
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>Dados importados com sucesso!</strong> Os campos foram preenchidos automaticamente com base na proposta.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;
    
    // Inserir no topo do formulário
    const formCard = document.querySelector('.card-body');
    formCard.insertBefore(alertDiv, formCard.firstChild);
    
    // Configurar para desaparecer após 5 segundos
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 5000);
}
