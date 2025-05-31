// Sistema de histórico de documentos para a Jota R Marketing
// Implementa armazenamento local de relatórios, propostas e contratos

// Namespace para o sistema de histórico
const documentHistory = {
    // Chaves para armazenamento no localStorage
    STORAGE_KEYS: {
        REPORTS: 'jota_r_reports',
        PROPOSALS: 'jota_r_proposals',
        CONTRACTS: 'jota_r_contracts'
    },
    
    // Salvar relatório no histórico
    saveReport: function(reportData) {
        console.log('DocumentHistory: Salvando relatório no histórico...', reportData);
        
        // Obter relatórios existentes
        const reports = this.getReports();
        
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
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(reports));
            console.log('DocumentHistory: Relatório salvo com sucesso!');
            return true;
        } catch (error) {
            console.error('DocumentHistory: Erro ao salvar relatório:', error);
            return false;
        }
    },
    
    // Obter todos os relatórios
    getReports: function() {
        console.log('DocumentHistory: Obtendo relatórios do histórico...');
        try {
            const reportsStr = localStorage.getItem(this.STORAGE_KEYS.REPORTS);
            const reports = reportsStr ? JSON.parse(reportsStr) : [];
            console.log('DocumentHistory: Relatórios obtidos:', reports);
            return reports;
        } catch (error) {
            console.error('DocumentHistory: Erro ao obter relatórios:', error);
            return [];
        }
    },
    
    // Excluir relatório
    deleteReport: function(reportId) {
        console.log('DocumentHistory: Excluindo relatório:', reportId);
        try {
            let reports = this.getReports();
            reports = reports.filter(report => report.id !== reportId);
            localStorage.setItem(this.STORAGE_KEYS.REPORTS, JSON.stringify(reports));
            console.log('DocumentHistory: Relatório excluído com sucesso!');
            return true;
        } catch (error) {
            console.error('DocumentHistory: Erro ao excluir relatório:', error);
            return false;
        }
    },
    
    // Salvar proposta no histórico
    saveProposal: function(proposalData) {
        console.log('DocumentHistory: Salvando proposta no histórico...', proposalData);
        
        // Obter propostas existentes
        const proposals = this.getProposals();
        
        // Criar nova proposta com ID e timestamp
        const newProposal = {
            ...proposalData,
            id: 'proposal_' + Date.now(),
            timestamp: Date.now(),
            type: 'proposal'
        };
        
        // Adicionar à lista
        proposals.push(newProposal);
        
        // Salvar no localStorage
        try {
            localStorage.setItem(this.STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
            console.log('DocumentHistory: Proposta salva com sucesso!');
            return true;
        } catch (error) {
            console.error('DocumentHistory: Erro ao salvar proposta:', error);
            return false;
        }
    },
    
    // Obter todas as propostas
    getProposals: function() {
        console.log('DocumentHistory: Obtendo propostas do histórico...');
        try {
            const proposalsStr = localStorage.getItem(this.STORAGE_KEYS.PROPOSALS);
            const proposals = proposalsStr ? JSON.parse(proposalsStr) : [];
            console.log('DocumentHistory: Propostas obtidas:', proposals);
            return proposals;
        } catch (error) {
            console.error('DocumentHistory: Erro ao obter propostas:', error);
            return [];
        }
    },
    
    // Excluir proposta
    deleteProposal: function(proposalId) {
        console.log('DocumentHistory: Excluindo proposta:', proposalId);
        try {
            let proposals = this.getProposals();
            proposals = proposals.filter(proposal => proposal.id !== proposalId);
            localStorage.setItem(this.STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
            console.log('DocumentHistory: Proposta excluída com sucesso!');
            return true;
        } catch (error) {
            console.error('DocumentHistory: Erro ao excluir proposta:', error);
            return false;
        }
    },
    
    // Salvar contrato no histórico
    saveContract: function(contractData) {
        console.log('DocumentHistory: Salvando contrato no histórico...', contractData);
        
        // Obter contratos existentes
        const contracts = this.getContracts();
        
        // Criar novo contrato com ID e timestamp
        const newContract = {
            ...contractData,
            id: 'contract_' + Date.now(),
            timestamp: Date.now(),
            type: 'contract'
        };
        
        // Adicionar à lista
        contracts.push(newContract);
        
        // Salvar no localStorage
        try {
            localStorage.setItem(this.STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
            console.log('DocumentHistory: Contrato salvo com sucesso!');
            return true;
        } catch (error) {
            console.error('DocumentHistory: Erro ao salvar contrato:', error);
            return false;
        }
    },
    
    // Obter todos os contratos
    getContracts: function() {
        console.log('DocumentHistory: Obtendo contratos do histórico...');
        try {
            const contractsStr = localStorage.getItem(this.STORAGE_KEYS.CONTRACTS);
            const contracts = contractsStr ? JSON.parse(contractsStr) : [];
            console.log('DocumentHistory: Contratos obtidos:', contracts);
            return contracts;
        } catch (error) {
            console.error('DocumentHistory: Erro ao obter contratos:', error);
            return [];
        }
    },
    
    // Excluir contrato
    deleteContract: function(contractId) {
        console.log('DocumentHistory: Excluindo contrato:', contractId);
        try {
            let contracts = this.getContracts();
            contracts = contracts.filter(contract => contract.id !== contractId);
            localStorage.setItem(this.STORAGE_KEYS.CONTRACTS, JSON.stringify(contracts));
            console.log('DocumentHistory: Contrato excluído com sucesso!');
            return true;
        } catch (error) {
            console.error('DocumentHistory: Erro ao excluir contrato:', error);
            return false;
        }
    },
    
    // Obter todos os documentos (relatórios, propostas e contratos)
    getAllDocuments: function() {
        console.log('DocumentHistory: Obtendo todos os documentos do histórico...');
        const reports = this.getReports();
        const proposals = this.getProposals();
        const contracts = this.getContracts();
        
        // Combinar todos os documentos
        const allDocuments = [
            ...reports,
            ...proposals,
            ...contracts
        ];
        
        // Ordenar por timestamp (mais recente primeiro)
        allDocuments.sort((a, b) => b.timestamp - a.timestamp);
        
        console.log('DocumentHistory: Todos os documentos obtidos:', allDocuments);
        return allDocuments;
    },
    
    // Formatar data para exibição
    formatDate: function(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
    },
    
    // Mostrar modal de histórico
    showHistory: function() {
        console.log('DocumentHistory: Mostrando modal de histórico...');
        
        // Obter todos os documentos
        const allDocuments = this.getAllDocuments();
        
        // Criar conteúdo do modal
        let modalContent = '';
        
        if (allDocuments.length === 0) {
            modalContent = '<p class="text-center">Nenhum documento salvo.</p>';
        } else {
            // Agrupar documentos por tipo
            const reports = allDocuments.filter(doc => doc.type === 'report');
            const proposals = allDocuments.filter(doc => doc.type === 'proposal');
            const contracts = allDocuments.filter(doc => doc.type === 'contract');
            
            // Criar abas para cada tipo de documento
            modalContent = `
                <ul class="nav nav-tabs" id="historyTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="reports-tab" data-bs-toggle="tab" data-bs-target="#reports" type="button" role="tab" aria-controls="reports" aria-selected="true">
                            Relatórios (${reports.length})
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="proposals-tab" data-bs-toggle="tab" data-bs-target="#proposals" type="button" role="tab" aria-controls="proposals" aria-selected="false">
                            Propostas (${proposals.length})
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="contracts-tab" data-bs-toggle="tab" data-bs-target="#contracts" type="button" role="tab" aria-controls="contracts" aria-selected="false">
                            Contratos (${contracts.length})
                        </button>
                    </li>
                </ul>
                <div class="tab-content" id="historyTabsContent">
                    <div class="tab-pane fade show active" id="reports" role="tabpanel" aria-labelledby="reports-tab">
                        ${this.createDocumentList(reports, 'report')}
                    </div>
                    <div class="tab-pane fade" id="proposals" role="tabpanel" aria-labelledby="proposals-tab">
                        ${this.createDocumentList(proposals, 'proposal')}
                    </div>
                    <div class="tab-pane fade" id="contracts" role="tabpanel" aria-labelledby="contracts-tab">
                        ${this.createDocumentList(contracts, 'contract')}
                    </div>
                </div>
            `;
        }
        
        // Criar modal
        const modalHtml = `
            <div class="modal fade" id="historyModal" tabindex="-1" aria-labelledby="historyModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="historyModalLabel">Histórico de Documentos</h5>
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
    },
    
    // Criar lista de documentos para exibição no modal
    createDocumentList: function(documents, type) {
        if (documents.length === 0) {
            return '<p class="text-center mt-3">Nenhum documento deste tipo salvo.</p>';
        }
        
        let listHtml = '<div class="list-group mt-3">';
        
        documents.forEach(doc => {
            let title = '';
            let subtitle = '';
            
            if (type === 'report') {
                title = doc.clientName ? `${doc.clientName} - ${doc.campaignName || 'Sem nome'}` : 'Relatório sem nome';
                subtitle = doc.startDate && doc.endDate ? `Período: ${doc.startDate} a ${doc.endDate}` : 'Sem período definido';
            } else if (type === 'proposal') {
                title = doc.clientName ? `${doc.clientName} - ${doc.clientSegment || 'Sem segmento'}` : 'Proposta sem nome';
                subtitle = doc.validityDays ? `Validade: ${doc.validityDays} dias` : 'Sem validade definida';
            } else if (type === 'contract') {
                title = doc.clientName ? `${doc.clientName} - ${doc.contractType || 'Sem tipo'}` : 'Contrato sem nome';
                subtitle = doc.contractStartDate ? `Início: ${doc.contractStartDate}` : 'Sem data de início definida';
            }
            
            listHtml += `
                <div class="list-group-item list-group-item-action">
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">${title}</h5>
                        <small>${this.formatDate(doc.timestamp)}</small>
                    </div>
                    <p class="mb-1">${subtitle}</p>
                    <div class="d-flex justify-content-end mt-2">
                        <button class="btn btn-sm btn-outline-primary me-2 load-document" data-type="${type}" data-id="${doc.id}">
                            <i class="fas fa-file-import me-1"></i> Carregar
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-document" data-type="${type}" data-id="${doc.id}">
                            <i class="fas fa-trash-alt me-1"></i> Excluir
                        </button>
                    </div>
                </div>
            `;
        });
        
        listHtml += '</div>';
        return listHtml;
    },
    
    // Adicionar eventos aos botões do modal de histórico
    addHistoryButtonEvents: function() {
        console.log('DocumentHistory: Adicionando eventos aos botões do histórico...');
        
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
                    this.deleteDocument(type, id);
                    
                    // Atualizar modal
                    this.showHistory();
                }
            });
        });
    },
    
    // Carregar documento
    loadDocument: function(type, id) {
        console.log(`DocumentHistory: Carregando documento do tipo ${type} com ID ${id}...`);
        
        let document = null;
        
        // Obter documento pelo tipo e ID
        if (type === 'report') {
            const reports = this.getReports();
            document = reports.find(report => report.id === id);
            
            // Preencher formulário de relatório
            if (document && window.fillReportFormFromHistory) {
                window.fillReportFormFromHistory(document);
            } else {
                console.error('DocumentHistory: Função fillReportFormFromHistory não encontrada');
                alert('Erro ao carregar relatório. Por favor, tente novamente.');
            }
        } else if (type === 'proposal') {
            const proposals = this.getProposals();
            document = proposals.find(proposal => proposal.id === id);
            
            // Preencher formulário de proposta
            if (document && window.fillProposalFormFromHistory) {
                window.fillProposalFormFromHistory(document);
            } else {
                console.error('DocumentHistory: Função fillProposalFormFromHistory não encontrada');
                alert('Erro ao carregar proposta. Por favor, tente novamente.');
            }
        } else if (type === 'contract') {
            const contracts = this.getContracts();
            document = contracts.find(contract => contract.id === id);
            
            // Preencher formulário de contrato
            if (document && window.fillContractFormFromHistory) {
                window.fillContractFormFromHistory(document);
            } else {
                console.error('DocumentHistory: Função fillContractFormFromHistory não encontrada');
                alert('Erro ao carregar contrato. Por favor, tente novamente.');
            }
        }
        
        if (!document) {
            console.error(`DocumentHistory: Documento do tipo ${type} com ID ${id} não encontrado`);
            alert('Documento não encontrado. Por favor, tente novamente.');
        }
    },
    
    // Excluir documento
    deleteDocument: function(type, id) {
        console.log(`DocumentHistory: Excluindo documento do tipo ${type} com ID ${id}...`);
        
        if (type === 'report') {
            this.deleteReport(id);
        } else if (type === 'proposal') {
            this.deleteProposal(id);
        } else if (type === 'contract') {
            this.deleteContract(id);
        }
    }
};

// Exportar para uso global
window.documentHistory = documentHistory;
