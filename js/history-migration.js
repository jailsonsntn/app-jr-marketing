// Script para migração e unificação do histórico de documentos
// Este script resolve o problema de chaves diferentes no localStorage

// Função para migrar dados entre diferentes formatos de armazenamento
function migrateHistoryData() {
    console.log('Iniciando migração de dados do histórico...');
    
    // Verificar se existem dados no formato antigo (jotaRDocumentHistory)
    const oldFormatData = localStorage.getItem('jotaRDocumentHistory');
    
    // Verificar se existem dados no formato novo (jota_r_reports)
    const newReportsData = localStorage.getItem('jota_r_reports');
    
    if (oldFormatData) {
        console.log('Dados encontrados no formato antigo, iniciando migração...');
        try {
            // Converter dados do formato antigo
            const oldData = JSON.parse(oldFormatData);
            
            // Verificar se há relatórios no formato antigo
            if (oldData && oldData.reports && oldData.reports.length > 0) {
                console.log(`Encontrados ${oldData.reports.length} relatórios no formato antigo`);
                
                // Obter relatórios do formato novo (se existirem)
                let newReports = [];
                if (newReportsData) {
                    newReports = JSON.parse(newReportsData);
                }
                
                // Converter relatórios do formato antigo para o novo
                const migratedReports = oldData.reports.map(oldReport => {
                    return {
                        clientName: oldReport.clientName || '',
                        campaignName: oldReport.campaignName || '',
                        startDate: oldReport.startDate || '',
                        endDate: oldReport.endDate || '',
                        objective: oldReport.objective || '',
                        reach: oldReport.reach || '',
                        impressions: oldReport.impressions || '',
                        clicks: oldReport.clicks || '',
                        ctr: oldReport.ctr || '',
                        investment: oldReport.investment || '',
                        cpr: oldReport.costPerResult || '',
                        results: oldReport.results || '',
                        observations: oldReport.insights || '',
                        recommendations: oldReport.recommendations || '',
                        id: oldReport.id || ('migrated_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)),
                        timestamp: new Date(oldReport.createdAt).getTime() || Date.now(),
                        type: 'report'
                    };
                });
                
                // Verificar se há IDs duplicados
                const existingIds = newReports.map(report => report.id);
                const uniqueMigratedReports = migratedReports.filter(report => !existingIds.includes(report.id));
                
                console.log(`Adicionando ${uniqueMigratedReports.length} relatórios migrados ao formato novo`);
                
                // Combinar relatórios existentes com os migrados
                const combinedReports = [...newReports, ...uniqueMigratedReports];
                
                // Salvar no formato novo
                localStorage.setItem('jota_r_reports', JSON.stringify(combinedReports));
                
                console.log('Migração de relatórios concluída com sucesso!');
                return {
                    success: true,
                    message: `Migração concluída: ${uniqueMigratedReports.length} relatórios migrados.`
                };
            } else {
                console.log('Nenhum relatório encontrado no formato antigo para migrar.');
                return {
                    success: true,
                    message: 'Nenhum relatório encontrado para migrar.'
                };
            }
        } catch (error) {
            console.error('Erro durante a migração:', error);
            return {
                success: false,
                message: 'Erro durante a migração: ' + error.message
            };
        }
    } else {
        console.log('Nenhum dado encontrado no formato antigo, migração não necessária.');
        return {
            success: true,
            message: 'Migração não necessária.'
        };
    }
}

// Executar migração quando o script for carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Verificando necessidade de migração de dados...');
    const migrationResult = migrateHistoryData();
    
    if (migrationResult.success) {
        console.log('Resultado da migração:', migrationResult.message);
    } else {
        console.error('Falha na migração:', migrationResult.message);
    }
});
