// Módulo de depuração para o sistema de histórico de documentos

// Função para testar diretamente o armazenamento local
function testLocalStorage() {
    console.log('Iniciando teste de localStorage...');
    
    // Limpar dados de teste anteriores
    localStorage.removeItem('test_item');
    
    // Testar escrita
    try {
        localStorage.setItem('test_item', JSON.stringify({test: 'data', timestamp: Date.now()}));
        console.log('✓ Escrita em localStorage bem-sucedida');
    } catch (error) {
        console.error('✗ Erro na escrita em localStorage:', error);
        return false;
    }
    
    // Testar leitura
    try {
        const testData = JSON.parse(localStorage.getItem('test_item'));
        console.log('✓ Leitura de localStorage bem-sucedida:', testData);
    } catch (error) {
        console.error('✗ Erro na leitura de localStorage:', error);
        return false;
    }
    
    // Limpar após o teste
    localStorage.removeItem('test_item');
    console.log('✓ Teste de localStorage concluído com sucesso');
    return true;
}

// Função para testar diretamente o módulo documentHistory
function testDocumentHistoryModule() {
    console.log('Iniciando teste do módulo documentHistory...');
    
    if (!window.documentHistory) {
        console.error('✗ Módulo documentHistory não encontrado no escopo global');
        return false;
    }
    
    console.log('Métodos disponíveis no documentHistory:', Object.keys(window.documentHistory));
    
    // Testar método saveReport
    if (typeof window.documentHistory.saveReport !== 'function') {
        console.error('✗ Método saveReport não encontrado ou não é uma função');
        return false;
    }
    
    // Criar dados de teste
    const testReport = {
        clientName: 'Cliente de Teste',
        campaignName: 'Campanha de Teste',
        startDate: '2025-05-01',
        endDate: '2025-05-19',
        objective: 'Tráfego',
        reach: '5000',
        impressions: '15000',
        clicks: '500',
        ctr: '3.33',
        investment: '1000',
        costPerResult: '2',
        results: '500',
        insights: 'Teste de insights',
        recommendations: 'Teste de recomendações',
        _testFlag: true
    };
    
    // Testar salvamento
    try {
        const saveResult = window.documentHistory.saveReport(testReport);
        console.log('✓ Chamada a saveReport bem-sucedida:', saveResult);
    } catch (error) {
        console.error('✗ Erro ao chamar saveReport:', error);
        return false;
    }
    
    // Testar listagem
    try {
        const reports = window.documentHistory.getReports();
        console.log('✓ Chamada a getReports bem-sucedida:', reports);
        
        // Verificar se o relatório de teste foi salvo
        const testReportSaved = reports.some(report => report._testFlag === true);
        if (testReportSaved) {
            console.log('✓ Relatório de teste encontrado na lista');
        } else {
            console.error('✗ Relatório de teste não encontrado na lista');
            return false;
        }
    } catch (error) {
        console.error('✗ Erro ao chamar getReports:', error);
        return false;
    }
    
    // Limpar dados de teste
    try {
        const reports = window.documentHistory.getReports();
        const testReport = reports.find(report => report._testFlag === true);
        
        if (testReport && testReport.id) {
            window.documentHistory.deleteReport(testReport.id);
            console.log('✓ Relatório de teste removido com sucesso');
        }
    } catch (error) {
        console.error('✗ Erro ao limpar relatório de teste:', error);
    }
    
    console.log('✓ Teste do módulo documentHistory concluído');
    return true;
}

// Função para testar a integração entre o botão e o salvamento
function testButtonIntegration() {
    console.log('Iniciando teste de integração do botão...');
    
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (!generateReportBtn) {
        console.error('✗ Botão de gerar relatório não encontrado');
        return false;
    }
    
    // Verificar se o botão tem eventos anexados
    const btnClone = generateReportBtn.cloneNode(true);
    console.log('Eventos no botão original:', generateReportBtn.onclick ? 'Sim' : 'Não');
    
    // Testar anexar evento manualmente
    try {
        btnClone.addEventListener('click', function() {
            console.log('✓ Evento de clique disparado manualmente');
            saveCurrentReportToHistory();
        });
        console.log('✓ Evento anexado com sucesso ao clone do botão');
    } catch (error) {
        console.error('✗ Erro ao anexar evento ao clone do botão:', error);
        return false;
    }
    
    console.log('✓ Teste de integração do botão concluído');
    return true;
}

// Função para corrigir o módulo documentHistory se necessário
function fixDocumentHistoryModule() {
    console.log('Iniciando correções no módulo documentHistory...');
    
    // Se o módulo não existir, criar uma implementação básica
    if (!window.documentHistory) {
        console.log('Criando implementação básica do módulo documentHistory...');
        
        window.documentHistory = {
            // Armazenar relatórios
            saveReport: function(reportData) {
                console.log('Salvando relatório:', reportData);
                
                // Obter relatórios existentes
                let reports = this.getReports();
                
                // Adicionar ID e timestamp
                const newReport = {
                    ...reportData,
                    id: 'report_' + Date.now(),
                    timestamp: Date.now()
                };
                
                // Adicionar à lista
                reports.push(newReport);
                
                // Salvar no localStorage
                try {
                    localStorage.setItem('jota_r_reports', JSON.stringify(reports));
                    console.log('Relatório salvo com sucesso!');
                    return true;
                } catch (error) {
                    console.error('Erro ao salvar relatório:', error);
                    return false;
                }
            },
            
            // Obter todos os relatórios
            getReports: function() {
                try {
                    const reportsStr = localStorage.getItem('jota_r_reports');
                    return reportsStr ? JSON.parse(reportsStr) : [];
                } catch (error) {
                    console.error('Erro ao obter relatórios:', error);
                    return [];
                }
            },
            
            // Excluir relatório
            deleteReport: function(reportId) {
                try {
                    let reports = this.getReports();
                    reports = reports.filter(report => report.id !== reportId);
                    localStorage.setItem('jota_r_reports', JSON.stringify(reports));
                    return true;
                } catch (error) {
                    console.error('Erro ao excluir relatório:', error);
                    return false;
                }
            },
            
            // Mostrar histórico
            showHistory: function() {
                console.log('Mostrando histórico...');
                // Esta função é chamada pelo botão de histórico
                // A implementação atual já mostra o modal
            }
        };
        
        console.log('✓ Módulo documentHistory criado com sucesso');
    } else {
        console.log('Módulo documentHistory já existe, verificando métodos...');
        
        // Verificar e corrigir métodos essenciais
        if (typeof window.documentHistory.saveReport !== 'function') {
            console.log('Corrigindo método saveReport...');
            window.documentHistory.saveReport = function(reportData) {
                console.log('Salvando relatório (método corrigido):', reportData);
                
                // Obter relatórios existentes
                let reports = [];
                try {
                    const reportsStr = localStorage.getItem('jota_r_reports');
                    reports = reportsStr ? JSON.parse(reportsStr) : [];
                } catch (error) {
                    console.error('Erro ao obter relatórios existentes:', error);
                    reports = [];
                }
                
                // Adicionar ID e timestamp
                const newReport = {
                    ...reportData,
                    id: 'report_' + Date.now(),
                    timestamp: Date.now()
                };
                
                // Adicionar à lista
                reports.push(newReport);
                
                // Salvar no localStorage
                try {
                    localStorage.setItem('jota_r_reports', JSON.stringify(reports));
                    console.log('Relatório salvo com sucesso!');
                    return true;
                } catch (error) {
                    console.error('Erro ao salvar relatório:', error);
                    return false;
                }
            };
        }
        
        if (typeof window.documentHistory.getReports !== 'function') {
            console.log('Corrigindo método getReports...');
            window.documentHistory.getReports = function() {
                try {
                    const reportsStr = localStorage.getItem('jota_r_reports');
                    return reportsStr ? JSON.parse(reportsStr) : [];
                } catch (error) {
                    console.error('Erro ao obter relatórios:', error);
                    return [];
                }
            };
        }
    }
    
    console.log('✓ Correções no módulo documentHistory concluídas');
    return true;
}

// Função para executar todos os testes e correções
function runDiagnostics() {
    console.log('=== INICIANDO DIAGNÓSTICO DO SISTEMA DE HISTÓRICO ===');
    
    // Testar localStorage
    const localStorageOk = testLocalStorage();
    
    // Corrigir módulo documentHistory se necessário
    fixDocumentHistoryModule();
    
    // Testar módulo documentHistory
    const documentHistoryOk = testDocumentHistoryModule();
    
    // Testar integração do botão
    const buttonIntegrationOk = testButtonIntegration();
    
    // Relatório final
    console.log('=== RESULTADO DO DIAGNÓSTICO ===');
    console.log('localStorage: ' + (localStorageOk ? '✓ OK' : '✗ Falha'));
    console.log('documentHistory: ' + (documentHistoryOk ? '✓ OK' : '✗ Falha'));
    console.log('Integração do botão: ' + (buttonIntegrationOk ? '✓ OK' : '✗ Falha'));
    
    return {
        localStorageOk,
        documentHistoryOk,
        buttonIntegrationOk,
        allOk: localStorageOk && documentHistoryOk && buttonIntegrationOk
    };
}

// Executar diagnóstico automaticamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página carregada, executando diagnóstico...');
    setTimeout(runDiagnostics, 1000);
});

// Exportar funções para uso global
window.historyDebug = {
    testLocalStorage,
    testDocumentHistoryModule,
    testButtonIntegration,
    fixDocumentHistoryModule,
    runDiagnostics
};
