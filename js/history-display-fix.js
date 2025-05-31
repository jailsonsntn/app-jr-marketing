// Correção da leitura do histórico após migração
// Este script corrige a exibição dos relatórios no histórico

// Função para corrigir a exibição do histórico
function fixHistoryDisplay() {
    console.log('Corrigindo exibição do histórico...');
    
    // Sobrescrever a função showHistory do objeto documentHistory
    const originalShowHistory = documentHistory.showHistory;
    
    documentHistory.showHistory = function() {
        console.log('DocumentHistory: Mostrando modal de histórico (função corrigida)...');
        
        // Obter todos os documentos
        const reports = this.getReports();
        console.log('Relatórios encontrados:', reports);
        
        // Criar conteúdo do modal
        let modalContent = '';
        
        if (!reports || reports.length === 0) {
            modalContent = '<p class="text-center">Nenhum relatório salvo.</p>';
        } else {
            // Criar lista de relatórios
            modalContent = '<div class="list-group mt-3">';
            
            reports.forEach(doc => {
                const title = doc.clientName ? `${doc.clientName} - ${doc.campaignName || 'Sem nome'}` : 'Relatório sem nome';
                const subtitle = doc.startDate && doc.endDate ? `Período: ${doc.startDate} a ${doc.endDate}` : 'Sem período definido';
                const timestamp = doc.timestamp || Date.now();
                
                modalContent += `
                    <div class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${title}</h5>
                            <small>${this.formatDate(timestamp)}</small>
                        </div>
                        <p class="mb-1">${subtitle}</p>
                        <div class="d-flex justify-content-end mt-2">
                            <button class="btn btn-sm btn-outline-primary me-2 load-document" data-type="report" data-id="${doc.id}">
                                <i class="fas fa-file-import me-1"></i> Carregar
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-document" data-type="report" data-id="${doc.id}">
                                <i class="fas fa-trash-alt me-1"></i> Excluir
                            </button>
                        </div>
                    </div>
                `;
            });
            
            modalContent += '</div>';
        }
        
        // Criar modal
        const modalHtml = `
            <div class="modal fade" id="historyModal" tabindex="-1" aria-labelledby="historyModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="historyModalLabel">Histórico de Relatórios</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${modalContent}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('historyModal'));
        modal.show();
        
        // Adicionar eventos aos botões
        this.addHistoryButtonEvents();
    };
    
    // Sobrescrever a função addHistoryButtonEvents para garantir que os eventos funcionem
    documentHistory.addHistoryButtonEvents = function() {
        console.log('DocumentHistory: Adicionando eventos aos botões do histórico (função corrigida)...');
        
        // Botões de carregar documento
        document.querySelectorAll('.load-document').forEach(button => {
            button.addEventListener('click', (event) => {
                const type = event.currentTarget.getAttribute('data-type');
                const id = event.currentTarget.getAttribute('data-id');
                console.log(`DocumentHistory: Carregando ${type} com ID ${id}...`);
                
                // Fechar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('historyModal'));
                modal.hide();
                
                // Carregar documento
                this.loadDocument(type, id);
            });
        });
        
        // Botões de excluir documento
        document.querySelectorAll('.delete-document').forEach(button => {
            button.addEventListener('click', (event) => {
                const type = event.currentTarget.getAttribute('data-type');
                const id = event.currentTarget.getAttribute('data-id');
                console.log(`DocumentHistory: Excluindo ${type} com ID ${id}...`);
                
                // Confirmar exclusão
                if (confirm('Tem certeza que deseja excluir este documento?')) {
                    // Excluir documento
                    if (type === 'report') {
                        this.deleteReport(id);
                    }
                    
                    // Fechar modal atual
                    const modal = bootstrap.Modal.getInstance(document.getElementById('historyModal'));
                    modal.hide();
                    
                    // Reabrir modal com lista atualizada
                    setTimeout(() => {
                        this.showHistory();
                    }, 300);
                }
            });
        });
    };
    
    // Adicionar função para carregar relatório
    documentHistory.loadDocument = function(type, id) {
        console.log(`DocumentHistory: Carregando documento do tipo ${type} com ID ${id}...`);
        
        if (type === 'report') {
            const reports = this.getReports();
            const report = reports.find(r => r.id === id);
            
            if (report) {
                console.log('DocumentHistory: Relatório encontrado, carregando dados...', report);
                
                // Preencher formulário com dados do relatório
                document.getElementById('clientName').value = report.clientName || '';
                document.getElementById('campaignName').value = report.campaignName || '';
                document.getElementById('startDate').value = report.startDate || '';
                document.getElementById('endDate').value = report.endDate || '';
                
                // Selecionar objetivo
                const objectiveSelect = document.getElementById('objective');
                for (let i = 0; i < objectiveSelect.options.length; i++) {
                    if (objectiveSelect.options[i].value === report.objective) {
                        objectiveSelect.selectedIndex = i;
                        break;
                    }
                }
                
                document.getElementById('reach').value = report.reach || '';
                document.getElementById('impressions').value = report.impressions || '';
                document.getElementById('clicks').value = report.clicks || '';
                document.getElementById('ctr').value = report.ctr || '';
                document.getElementById('investment').value = report.investment || '';
                document.getElementById('cpr').value = report.cpr || '';
                document.getElementById('results').value = report.results || '';
                document.getElementById('observations').value = report.observations || '';
                document.getElementById('recommendations').value = report.recommendations || '';
                
                // Mostrar mensagem de sucesso
                alert('Relatório carregado com sucesso!');
            } else {
                console.error('DocumentHistory: Relatório não encontrado!');
                alert('Erro: Relatório não encontrado!');
            }
        }
    };
    
    console.log('Correção da exibição do histórico concluída!');
}

// Executar correção quando o script for carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando correção da exibição do histórico...');
    fixHistoryDisplay();
});
