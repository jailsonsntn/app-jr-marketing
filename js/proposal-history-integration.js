// Funções de integração para salvar propostas no histórico

// Função para preencher o formulário de proposta a partir do histórico
function fillProposalFormFromHistory(proposalData) {
    // Preencher campos do formulário
    if (proposalData.clientName) document.getElementById('clientName').value = proposalData.clientName;
    if (proposalData.clientContact) document.getElementById('clientContact').value = proposalData.clientContact;
    if (proposalData.clientSegment) document.getElementById('clientSegment').value = proposalData.clientSegment;
    if (proposalData.clientDocument) document.getElementById('clientDocument').value = proposalData.clientDocument;
    
    // Preencher objetivos
    if (proposalData.objectives && proposalData.objectives.length > 0) {
        // Marcar checkboxes de objetivos
        proposalData.objectives.forEach(objective => {
            const checkboxId = getObjectiveCheckboxId(objective);
            if (checkboxId) {
                document.getElementById(checkboxId).checked = true;
            }
        });
        
        // Preencher outros objetivos
        if (proposalData.otherObjectives) {
            document.getElementById('otherObjectives').value = proposalData.otherObjectives;
        }
    }
    
    // Preencher serviços
    if (proposalData.services && proposalData.services.length > 0) {
        // Limpar serviços existentes
        const serviceContainer = document.getElementById('servicesContainer');
        if (serviceContainer) {
            // Manter apenas o primeiro serviço (template)
            const firstService = serviceContainer.querySelector('.service-row');
            if (firstService) {
                while (serviceContainer.children.length > 1) {
                    serviceContainer.removeChild(serviceContainer.lastChild);
                }
                
                // Preencher o primeiro serviço
                const firstServiceInputs = firstService.querySelectorAll('input');
                if (firstServiceInputs.length >= 2 && proposalData.services.length > 0) {
                    firstServiceInputs[0].value = proposalData.services[0].title || '';
                    firstServiceInputs[1].value = proposalData.services[0].price || '';
                }
                
                // Adicionar serviços adicionais
                for (let i = 1; i < proposalData.services.length; i++) {
                    // Clonar o primeiro serviço
                    const newService = firstService.cloneNode(true);
                    const newServiceInputs = newService.querySelectorAll('input');
                    
                    if (newServiceInputs.length >= 2) {
                        newServiceInputs[0].value = proposalData.services[i].title || '';
                        newServiceInputs[1].value = proposalData.services[i].price || '';
                    }
                    
                    serviceContainer.appendChild(newService);
                }
            }
        }
    }
    
    // Preencher outros campos
    if (proposalData.validityDays) document.getElementById('validityDays').value = proposalData.validityDays;
    if (proposalData.paymentTerms) document.getElementById('paymentTerms').value = proposalData.paymentTerms;
    if (proposalData.deliveryTime) document.getElementById('deliveryTime').value = proposalData.deliveryTime;
    if (proposalData.additionalNotes) document.getElementById('additionalNotes').value = proposalData.additionalNotes;
    
    // Mostrar mensagem de sucesso
    showHistoryLoadSuccessMessage();
}

// Função auxiliar para obter o ID do checkbox de objetivo
function getObjectiveCheckboxId(objective) {
    const objectiveMap = {
        'Atrair mais leads': 'attractLeadsCheck',
        'Vender mais': 'sellMoreCheck',
        'Se posicionar no Instagram': 'instagramPositioningCheck',
        'Crescer com tráfego pago': 'paidTrafficCheck'
    };
    
    return objectiveMap[objective];
}

// Função para salvar proposta no histórico quando gerada
function saveCurrentProposalToHistory() {
    // Coletar dados do formulário
    const clientName = document.getElementById('clientName').value;
    const clientContact = document.getElementById('clientContact').value;
    const clientSegment = document.getElementById('clientSegment').value;
    const clientDocument = document.getElementById('clientDocument').value;
    
    // Coletar objetivos selecionados
    const objectives = [];
    if (document.getElementById('attractLeadsCheck').checked) objectives.push('Atrair mais leads');
    if (document.getElementById('sellMoreCheck').checked) objectives.push('Vender mais');
    if (document.getElementById('instagramPositioningCheck').checked) objectives.push('Se posicionar no Instagram');
    if (document.getElementById('paidTrafficCheck').checked) objectives.push('Crescer com tráfego pago');
    
    const otherObjectives = document.getElementById('otherObjectives').value;
    
    // Coletar serviços
    const services = [];
    const serviceRows = document.querySelectorAll('.service-row');
    serviceRows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        if (inputs.length >= 2 && inputs[0].value.trim() !== '') {
            services.push({
                title: inputs[0].value,
                price: inputs[1].value,
                description: '' // Não temos campo de descrição no formulário
            });
        }
    });
    
    // Coletar outros campos
    const validityDays = document.getElementById('validityDays').value;
    const paymentTerms = document.getElementById('paymentTerms').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    const additionalNotes = document.getElementById('additionalNotes').value;
    
    // Montar objeto de proposta
    const proposalData = {
        clientName,
        clientContact,
        clientSegment,
        clientDocument,
        objectives,
        otherObjectives,
        services,
        validityDays,
        paymentTerms,
        deliveryTime,
        additionalNotes
    };
    
    // Salvar no histórico
    if (window.documentHistory && window.documentHistory.saveProposal) {
        window.documentHistory.saveProposal(proposalData);
        console.log('Proposta salva no histórico com sucesso!');
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

// Adicionar evento ao botão de gerar proposta para salvar no histórico
document.addEventListener('DOMContentLoaded', function() {
    const generateProposalBtn = document.getElementById('generateProposalBtn');
    if (generateProposalBtn) {
        // Preservar o evento original e adicionar o salvamento no histórico
        const originalClickHandler = generateProposalBtn.onclick;
        generateProposalBtn.onclick = function(event) {
            // Chamar o handler original primeiro
            if (originalClickHandler) {
                originalClickHandler.call(this, event);
            }
            
            // Depois salvar no histórico
            setTimeout(saveCurrentProposalToHistory, 500);
        };
    }
});

// Exportar funções para uso global
window.fillProposalFormFromHistory = fillProposalFormFromHistory;
