// Funções de integração para salvar documentos no histórico

// Função para preencher o formulário de relatório a partir do histórico
function fillReportFormFromHistory(reportData) {
    // Preencher campos do formulário
    if (reportData.clientName) document.getElementById('clientName').value = reportData.clientName;
    if (reportData.campaignName) document.getElementById('campaignName').value = reportData.campaignName;
    if (reportData.startDate) document.getElementById('startDate').value = reportData.startDate;
    if (reportData.endDate) document.getElementById('endDate').value = reportData.endDate;
    if (reportData.objective) document.getElementById('objective').value = reportData.objective;
    if (reportData.reach) document.getElementById('reach').value = reportData.reach;
    if (reportData.impressions) document.getElementById('impressions').value = reportData.impressions;
    if (reportData.clicks) document.getElementById('clicks').value = reportData.clicks;
    if (reportData.ctr) document.getElementById('ctr').value = reportData.ctr;
    if (reportData.investment) document.getElementById('investment').value = reportData.investment;
    if (reportData.cpr) document.getElementById('cpr').value = reportData.cpr;
    if (reportData.results) document.getElementById('results').value = reportData.results;
    if (reportData.observations) document.getElementById('observations').value = reportData.observations;
    if (reportData.recommendations) document.getElementById('recommendations').value = reportData.recommendations;
    
    // Mostrar mensagem de sucesso
    showHistoryLoadSuccessMessage();
}

// Função para salvar relatório no histórico quando gerado
function saveCurrentReportToHistory() {
    console.log('Salvando relatório no histórico...');
    
    // Coletar dados do formulário
    const reportData = {
        clientName: document.getElementById('clientName').value,
        campaignName: document.getElementById('campaignName').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        objective: document.getElementById('objective').value,
        reach: document.getElementById('reach').value,
        impressions: document.getElementById('impressions').value,
        clicks: document.getElementById('clicks').value,
        ctr: document.getElementById('ctr').value,
        investment: document.getElementById('investment').value,
        cpr: document.getElementById('cpr').value,
        results: document.getElementById('results').value,
        observations: document.getElementById('observations').value,
        recommendations: document.getElementById('recommendations').value
    };
    
    // Salvar no histórico
    if (window.documentHistory && window.documentHistory.saveReport) {
        const result = window.documentHistory.saveReport(reportData);
        console.log('Relatório salvo no histórico com sucesso!', result);
        
        // Mostrar notificação de sucesso
        showSaveSuccessMessage();
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

// Função para mostrar mensagem de sucesso ao salvar no histórico
function showSaveSuccessMessage() {
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>Relatório salvo no histórico!</strong> Você pode acessá-lo a qualquer momento.
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

// Adicionar evento ao botão de gerar relatório para salvar no histórico
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando integração de histórico para relatórios...');
    
    // Adicionar evento ao botão de gerar relatório existente
    // NÃO substituir o botão para evitar conflitos com app.js
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        console.log('Botão de gerar relatório encontrado, adicionando evento...');
        
        // Adicionar evento diretamente sem substituir o botão
        generateReportBtn.addEventListener('click', function() {
            console.log('Evento de histórico para botão de gerar relatório acionado');
            
            // Salvar no histórico após um pequeno delay para garantir que o relatório foi gerado
            setTimeout(saveCurrentReportToHistory, 1000);
        });
    } else {
        console.warn('Botão de gerar relatório não encontrado');
    }
    
    // Adicionar evento ao botão de histórico existente
    const historyBtn = document.getElementById('historyBtn');
    if (historyBtn) {
        console.log('Botão de histórico encontrado, adicionando evento...');
        
        // Adicionar evento diretamente sem substituir o botão
        historyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão de histórico clicado');
            
            if (window.documentHistory && window.documentHistory.showHistory) {
                window.documentHistory.showHistory();
            } else {
                console.error('Módulo de histórico não encontrado');
            }
        });
    } else {
        console.warn('Botão de histórico não encontrado');
    }
});

// Exportar funções para uso global
window.fillReportFormFromHistory = fillReportFormFromHistory;
window.saveCurrentReportToHistory = saveCurrentReportToHistory;

// Adicionar um método direto para salvar o relatório atual
// Isso permite chamar a função diretamente de outros scripts
window.saveReportToHistory = function() {
    saveCurrentReportToHistory();
};
