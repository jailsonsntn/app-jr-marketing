// Integração entre Proposta e Contrato
// Este script gerencia a transferência de dados da proposta para o contrato

// Função para transferir dados da proposta para o contrato
function transferProposalToContract() {
    // Verificar se temos dados da proposta armazenados
    if (!proposalData || Object.keys(proposalData).length === 0) {
        alert('Erro: Não foi possível encontrar os dados da proposta.');
        return;
    }
    
    // Criar objeto com dados para o contrato
    const contractData = {
        // Dados do cliente
        clientName: proposalData.clientName,
        clientDocument: proposalData.clientDocument || '',
        clientAddress: '', // Não temos na proposta, deixar em branco
        clientRepresentative: '', // Não temos na proposta, deixar em branco
        clientEmail: '', // Usar contato se for email
        clientPhone: proposalData.clientContact || '', // Usar contato se for telefone
        
        // Dados do serviço
        contractType: getContractTypeFromServices(proposalData.services),
        servicesScope: generateServicesScopeFromProposal(proposalData),
        
        // Dados financeiros
        paymentValue: calculateMonthlyValueFromProposal(proposalData),
        
        // Outros dados
        contractStartDate: getTodayDate(),
        contractDuration: '6', // Padrão de 6 meses
        paymentMethod: 'Transferência Bancária', // Valor padrão
        paymentDay: '10' // Valor padrão (dia 10)
    };
    
    // Armazenar dados no localStorage para recuperar na página de contrato
    localStorage.setItem('proposalToContractData', JSON.stringify(contractData));
    
    // Redirecionar para a página de contrato
    window.location.href = 'contract.html?fromProposal=true';
}

// Função auxiliar para determinar o tipo de contrato com base nos serviços
function getContractTypeFromServices(services) {
    if (!services || services.length === 0) {
        return 'Marketing Digital';
    }
    
    // Verificar os títulos dos serviços para determinar o tipo mais adequado
    const serviceTypes = {
        'Marketing Digital': 0,
        'Gestão de Redes Sociais': 0,
        'Tráfego Pago': 0,
        'Criação de Conteúdo': 0,
        'Consultoria': 0
    };
    
    // Contar ocorrências de palavras-chave nos títulos dos serviços
    services.forEach(service => {
        const title = service.title.toLowerCase();
        
        if (title.includes('marketing')) serviceTypes['Marketing Digital']++;
        if (title.includes('rede') || title.includes('social') || title.includes('instagram')) serviceTypes['Gestão de Redes Sociais']++;
        if (title.includes('tráfego') || title.includes('anúncio') || title.includes('campanha')) serviceTypes['Tráfego Pago']++;
        if (title.includes('conteúdo') || title.includes('post') || title.includes('texto')) serviceTypes['Criação de Conteúdo']++;
        if (title.includes('consultoria') || title.includes('estratégia')) serviceTypes['Consultoria']++;
    });
    
    // Encontrar o tipo com maior contagem
    let maxCount = 0;
    let contractType = 'Marketing Digital'; // Tipo padrão
    
    for (const [type, count] of Object.entries(serviceTypes)) {
        if (count > maxCount) {
            maxCount = count;
            contractType = type;
        }
    }
    
    // Se tiver vários tipos diferentes, usar "Pacote Completo"
    const uniqueTypes = Object.values(serviceTypes).filter(count => count > 0).length;
    if (uniqueTypes >= 3) {
        contractType = 'Pacote Completo';
    }
    
    return contractType;
}

// Função para gerar a descrição dos serviços a partir da proposta
function generateServicesScopeFromProposal(proposalData) {
    if (!proposalData.services || proposalData.services.length === 0) {
        return 'Prestação de serviços de marketing digital conforme proposta comercial.';
    }
    
    let servicesScope = 'Prestação dos seguintes serviços:\n\n';
    
    // Adicionar cada serviço da proposta
    proposalData.services.forEach((service, index) => {
        servicesScope += `${index + 1}. ${service.title}: ${service.description}\n`;
    });
    
    // Adicionar informações sobre tráfego pago, se aplicável
    if (proposalData.adInvestment && parseFloat(proposalData.adInvestment) > 0) {
        servicesScope += `\nGerenciamento de campanhas de tráfego pago com investimento diário sugerido de R$ ${parseFloat(proposalData.adInvestment).toFixed(2)}.`;
    }
    
    // Adicionar objetivos do cliente
    if (proposalData.objectives && proposalData.objectives.length > 0) {
        servicesScope += `\n\nObjetivos a serem alcançados:\n`;
        proposalData.objectives.forEach((objective, index) => {
            servicesScope += `- ${objective}\n`;
        });
    }
    
    // Adicionar observações adicionais
    if (proposalData.additionalNotes) {
        servicesScope += `\nObservações adicionais: ${proposalData.additionalNotes}`;
    }
    
    return servicesScope;
}

// Função para calcular o valor mensal com base na proposta
function calculateMonthlyValueFromProposal(proposalData) {
    if (!proposalData.services || proposalData.services.length === 0) {
        return 0;
    }
    
    // Somar os valores de todos os serviços
    let totalValue = 0;
    proposalData.services.forEach(service => {
        totalValue += parseFloat(service.price) || 0;
    });
    
    // Aplicar desconto, se houver
    if (proposalData.discountPercentage && parseFloat(proposalData.discountPercentage) > 0) {
        const discountRate = parseFloat(proposalData.discountPercentage) / 100;
        totalValue = totalValue * (1 - discountRate);
    }
    
    return totalValue.toFixed(2);
}

// Função para obter a data atual no formato YYYY-MM-DD
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Adicionar evento ao botão de gerar contrato
document.addEventListener('DOMContentLoaded', function() {
    const generateContractBtn = document.getElementById('generateContractBtn');
    if (generateContractBtn) {
        generateContractBtn.addEventListener('click', transferProposalToContract);
    }
});
