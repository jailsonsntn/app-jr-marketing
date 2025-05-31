// Solução direta para o histórico de relatórios
// Este script substitui completamente a lógica anterior com uma abordagem simplificada

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando solução direta para o histórico...');
    
    // Adicionar evento ao botão de histórico
    const historyButton = document.querySelector('button:contains("Histórico")');
    if (historyButton) {
        historyButton.addEventListener('click', showHistoryDirectly);
    } else {
        // Fallback para encontrar o botão por índice
        const buttons = document.querySelectorAll('button');
        if (buttons.length >= 3) {
            buttons[2].addEventListener('click', showHistoryDirectly);
        }
    }
    
    // Função para mostrar o histórico diretamente
    function showHistoryDirectly() {
        console.log('Mostrando histórico diretamente...');
        
        // Ler relatórios diretamente do localStorage
        let reports = [];
        try {
            const reportsStr = localStorage.getItem('jota_r_reports');
            if (reportsStr) {
                reports = JSON.parse(reportsStr);
                console.log('Relatórios encontrados:', reports);
            } else {
                console.log('Nenhum relatório encontrado no localStorage');
            }
        } catch (error) {
            console.error('Erro ao ler relatórios:', error);
        }
        
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
                const date = new Date(timestamp);
                const formattedDate = date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                
                modalContent += `
                    <div class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${title}</h5>
                            <small>${formattedDate}</small>
                        </div>
                        <p class="mb-1">${subtitle}</p>
                        <div class="d-flex justify-content-end mt-2">
                            <button class="btn btn-sm btn-outline-primary me-2 load-report" data-id="${doc.id}">
                                <i class="fas fa-file-import me-1"></i> Carregar
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-report" data-id="${doc.id}">
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
            <div class="modal fade" id="directHistoryModal" tabindex="-1" aria-labelledby="directHistoryModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="directHistoryModalLabel">Histórico de Relatórios</h5>
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
        
        // Remover modal anterior se existir
        const oldModal = document.getElementById('directHistoryModal');
        if (oldModal) {
            oldModal.remove();
        }
        
        // Adicionar modal ao DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('directHistoryModal'));
        modal.show();
        
        // Adicionar eventos aos botões
        addDirectHistoryButtonEvents();
    }
    
    // Adicionar eventos aos botões do histórico
    function addDirectHistoryButtonEvents() {
        console.log('Adicionando eventos aos botões do histórico...');
        
        // Botões de carregar relatório
        document.querySelectorAll('.load-report').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.currentTarget.getAttribute('data-id');
                console.log(`Carregando relatório com ID ${id}...`);
                
                // Fechar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('directHistoryModal'));
                modal.hide();
                
                // Carregar relatório
                loadReportDirectly(id);
            });
        });
        
        // Botões de excluir relatório
        document.querySelectorAll('.delete-report').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.currentTarget.getAttribute('data-id');
                console.log(`Excluindo relatório com ID ${id}...`);
                
                // Confirmar exclusão
                if (confirm('Tem certeza que deseja excluir este relatório?')) {
                    // Excluir relatório
                    deleteReportDirectly(id);
                    
                    // Fechar modal atual
                    const modal = bootstrap.Modal.getInstance(document.getElementById('directHistoryModal'));
                    modal.hide();
                    
                    // Reabrir modal com lista atualizada
                    setTimeout(() => {
                        showHistoryDirectly();
                    }, 300);
                }
            });
        });
    }
    
    // Carregar relatório diretamente
    function loadReportDirectly(id) {
        console.log(`Carregando relatório com ID ${id}...`);
        
        // Ler relatórios do localStorage
        try {
            const reportsStr = localStorage.getItem('jota_r_reports');
            if (reportsStr) {
                const reports = JSON.parse(reportsStr);
                const report = reports.find(r => r.id === id);
                
                if (report) {
                    console.log('Relatório encontrado, carregando dados...', report);
                    
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
                    console.error('Relatório não encontrado!');
                    alert('Erro: Relatório não encontrado!');
                }
            } else {
                console.error('Nenhum relatório encontrado no localStorage!');
                alert('Erro: Nenhum relatório encontrado!');
            }
        } catch (error) {
            console.error('Erro ao carregar relatório:', error);
            alert('Erro ao carregar relatório: ' + error.message);
        }
    }
    
    // Excluir relatório diretamente
    function deleteReportDirectly(id) {
        console.log(`Excluindo relatório com ID ${id}...`);
        
        // Ler relatórios do localStorage
        try {
            const reportsStr = localStorage.getItem('jota_r_reports');
            if (reportsStr) {
                let reports = JSON.parse(reportsStr);
                reports = reports.filter(report => report.id !== id);
                localStorage.setItem('jota_r_reports', JSON.stringify(reports));
                console.log('Relatório excluído com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao excluir relatório:', error);
            alert('Erro ao excluir relatório: ' + error.message);
        }
    }
    
    // Sobrescrever a função de salvamento de relatório para garantir compatibilidade
    window.saveReportToHistory = function(reportData) {
        console.log('Salvando relatório no histórico (função direta)...', reportData);
        
        // Obter relatórios existentes
        let reports = [];
        try {
            const reportsStr = localStorage.getItem('jota_r_reports');
            if (reportsStr) {
                reports = JSON.parse(reportsStr);
            }
        } catch (error) {
            console.error('Erro ao ler relatórios existentes:', error);
        }
        
        // Criar novo relatório com ID e timestamp
        const newReport = {
            ...reportData,
            id: 'report_' + Date.now(),
            timestamp: Date.now(),
            type: 'report'
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
    
    console.log('Solução direta para o histórico inicializada com sucesso!');
});

// Polyfill para o método contains em elementos
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Adicionar método contains para seleção por texto
HTMLElement.prototype.contains = function(text) {
    return this.textContent.includes(text);
};

// Adicionar método para seleção por texto
document.querySelector = (function(originalQuerySelector) {
    return function(selector) {
        if (typeof selector === 'string' && selector.includes(':contains(')) {
            const match = selector.match(/(.*):contains\((.*)\)(.*)/);
            if (match) {
                const [, before, text, after] = match;
                const elements = document.querySelectorAll(before);
                for (let i = 0; i < elements.length; i++) {
                    if (elements[i].textContent.includes(text.replace(/["']/g, ''))) {
                        return elements[i];
                    }
                }
                return null;
            }
        }
        return originalQuerySelector.call(this, selector);
    };
})(document.querySelector);
