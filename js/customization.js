// Script para personalização visual dos documentos
// Permite customizar cores e estilos dos relatórios, propostas e contratos

// Função para inicializar o painel de personalização
function initCustomizationPanel() {
    console.log('Inicializando painel de personalização...');
    
    // Adicionar CSS de personalização a todas as páginas
    if (!document.getElementById('customization-css')) {
        const link = document.createElement('link');
        link.id = 'customization-css';
        link.rel = 'stylesheet';
        link.href = 'css/customization.css';
        document.head.appendChild(link);
    }
    
    // Criar painel de personalização se não existir
    if (!document.getElementById('customizationPanel')) {
        // Criar botão de toggle
        const toggleButton = document.createElement('button');
        toggleButton.id = 'customizationToggle';
        toggleButton.innerHTML = '<i class="fas fa-paint-brush"></i>';
        toggleButton.title = 'Personalizar';
        document.body.appendChild(toggleButton);
        
        // Criar painel
        const panel = document.createElement('div');
        panel.id = 'customizationPanel';
        panel.innerHTML = `
            <h3>Personalização Visual</h3>
            
            <div class="customization-section">
                <h4>Temas Predefinidos</h4>
                <div class="theme-options">
                    <button class="btn btn-sm btn-outline-primary mb-2 me-2" data-theme="default">Padrão</button>
                    <button class="btn btn-sm btn-success mb-2 me-2" data-theme="theme-green">Verde</button>
                    <button class="btn btn-sm btn-primary mb-2 me-2" data-theme="theme-blue">Azul</button>
                    <button class="btn btn-sm btn-purple mb-2 me-2" data-theme="theme-purple">Roxo</button>
                    <button class="btn btn-sm btn-dark mb-2" data-theme="theme-dark">Escuro</button>
                </div>
            </div>
            
            <div class="customization-section">
                <h4>Cores Personalizadas</h4>
                <div class="color-option">
                    <label>Cor Principal:</label>
                    <input type="color" id="primaryColorPicker" value="#0a5c36" class="form-control form-control-color">
                </div>
                <div class="color-option">
                    <label>Cor Secundária:</label>
                    <input type="color" id="secondaryColorPicker" value="#f39c12" class="form-control form-control-color">
                </div>
                <div class="color-option">
                    <label>Cor de Destaque:</label>
                    <input type="color" id="accentColorPicker" value="#e74c3c" class="form-control form-control-color">
                </div>
            </div>
            
            <div class="customization-section">
                <h4>Fontes</h4>
                <div class="font-option">
                    <label>Fonte de Títulos:</label>
                    <select id="headingFontSelect" class="form-select">
                        <option value="'Montserrat', sans-serif">Montserrat</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Playfair Display', serif">Playfair Display</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                        <option value="'Raleway', sans-serif">Raleway</option>
                    </select>
                </div>
                <div class="font-option">
                    <label>Fonte de Texto:</label>
                    <select id="bodyFontSelect" class="form-select">
                        <option value="'Open Sans', sans-serif">Open Sans</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Lato', sans-serif">Lato</option>
                        <option value="'Nunito', sans-serif">Nunito</option>
                        <option value="'Source Sans Pro', sans-serif">Source Sans Pro</option>
                    </select>
                </div>
            </div>
            
            <div class="customization-section">
                <h4>Visualização</h4>
                <div class="preview-box p-3 border rounded">
                    <h5 class="preview-heading">Título de Exemplo</h5>
                    <p class="preview-text">Este é um texto de exemplo para visualizar as alterações de estilo.</p>
                    <div class="d-flex mt-2">
                        <div class="preview-primary p-2 me-2 text-white">Principal</div>
                        <div class="preview-secondary p-2 me-2 text-white">Secundária</div>
                        <div class="preview-accent p-2 text-white">Destaque</div>
                    </div>
                </div>
            </div>
            
            <div class="customization-section">
                <button id="applyCustomization" class="btn btn-primary w-100">Aplicar</button>
                <button id="resetCustomization" class="btn btn-outline-secondary w-100 mt-2">Restaurar Padrão</button>
            </div>
        `;
        document.body.appendChild(panel);
        
        // Adicionar eventos
        toggleButton.addEventListener('click', function() {
            panel.classList.toggle('open');
        });
        
        // Evento para temas predefinidos
        document.querySelectorAll('[data-theme]').forEach(button => {
            button.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                applyTheme(theme);
                updatePreview();
            });
        });
        
        // Eventos para color pickers
        document.getElementById('primaryColorPicker').addEventListener('input', function() {
            document.documentElement.style.setProperty('--primary-color', this.value);
            updatePreview();
        });
        
        document.getElementById('secondaryColorPicker').addEventListener('input', function() {
            document.documentElement.style.setProperty('--secondary-color', this.value);
            updatePreview();
        });
        
        document.getElementById('accentColorPicker').addEventListener('input', function() {
            document.documentElement.style.setProperty('--accent-color', this.value);
            updatePreview();
        });
        
        // Eventos para seletores de fonte
        document.getElementById('headingFontSelect').addEventListener('change', function() {
            document.documentElement.style.setProperty('--heading-font', this.value);
            updatePreview();
        });
        
        document.getElementById('bodyFontSelect').addEventListener('change', function() {
            document.documentElement.style.setProperty('--body-font', this.value);
            updatePreview();
        });
        
        // Botão aplicar
        document.getElementById('applyCustomization').addEventListener('click', function() {
            saveCustomization();
            alert('Personalização aplicada com sucesso!');
        });
        
        // Botão resetar
        document.getElementById('resetCustomization').addEventListener('click', function() {
            resetCustomization();
            updatePreview();
            alert('Personalização restaurada para o padrão!');
        });
        
        // Inicializar com configurações salvas
        loadCustomization();
        updatePreview();
    }
    
    console.log('Painel de personalização inicializado com sucesso!');
}

// Função para aplicar tema predefinido
function applyTheme(theme) {
    console.log('Aplicando tema:', theme);
    
    // Remover classes de tema anteriores
    document.body.classList.remove('theme-green', 'theme-blue', 'theme-purple', 'theme-dark');
    
    // Aplicar novo tema se não for o padrão
    if (theme !== 'default') {
        document.body.classList.add(theme);
    } else {
        // Restaurar cores padrão
        document.documentElement.style.setProperty('--primary-color', '#0a5c36');
        document.documentElement.style.setProperty('--secondary-color', '#f39c12');
        document.documentElement.style.setProperty('--accent-color', '#e74c3c');
        document.documentElement.style.setProperty('--text-color', '#333333');
        document.documentElement.style.setProperty('--background-color', '#ffffff');
        document.documentElement.style.setProperty('--light-background', '#f8f9fa');
        document.documentElement.style.setProperty('--border-color', '#dee2e6');
    }
    
    // Atualizar color pickers
    updateColorPickers();
}

// Função para atualizar color pickers com base nas variáveis CSS atuais
function updateColorPickers() {
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    
    document.getElementById('primaryColorPicker').value = primaryColor;
    document.getElementById('secondaryColorPicker').value = secondaryColor;
    document.getElementById('accentColorPicker').value = accentColor;
}

// Função para atualizar a visualização
function updatePreview() {
    const previewHeading = document.querySelector('.preview-heading');
    const previewText = document.querySelector('.preview-text');
    const previewPrimary = document.querySelector('.preview-primary');
    const previewSecondary = document.querySelector('.preview-secondary');
    const previewAccent = document.querySelector('.preview-accent');
    
    if (previewHeading && previewText) {
        previewHeading.style.fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--heading-font');
        previewHeading.style.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        
        previewText.style.fontFamily = getComputedStyle(document.documentElement).getPropertyValue('--body-font');
        previewText.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        
        previewPrimary.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        previewSecondary.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color');
        previewAccent.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    }
}

// Função para salvar personalização
function saveCustomization() {
    const customization = {
        primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
        secondaryColor: getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim(),
        accentColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
        headingFont: getComputedStyle(document.documentElement).getPropertyValue('--heading-font').trim(),
        bodyFont: getComputedStyle(document.documentElement).getPropertyValue('--body-font').trim(),
        theme: document.body.classList.contains('theme-green') ? 'theme-green' :
               document.body.classList.contains('theme-blue') ? 'theme-blue' :
               document.body.classList.contains('theme-purple') ? 'theme-purple' :
               document.body.classList.contains('theme-dark') ? 'theme-dark' : 'default'
    };
    
    localStorage.setItem('jota_r_customization', JSON.stringify(customization));
    console.log('Personalização salva:', customization);
    
    // Aplicar personalização a todos os documentos
    applyCustomizationToDocuments();
}

// Função para carregar personalização
function loadCustomization() {
    const customizationStr = localStorage.getItem('jota_r_customization');
    if (customizationStr) {
        try {
            const customization = JSON.parse(customizationStr);
            console.log('Carregando personalização:', customization);
            
            // Aplicar tema
            if (customization.theme) {
                applyTheme(customization.theme);
            }
            
            // Aplicar cores personalizadas
            if (customization.primaryColor) {
                document.documentElement.style.setProperty('--primary-color', customization.primaryColor);
            }
            
            if (customization.secondaryColor) {
                document.documentElement.style.setProperty('--secondary-color', customization.secondaryColor);
            }
            
            if (customization.accentColor) {
                document.documentElement.style.setProperty('--accent-color', customization.accentColor);
            }
            
            // Aplicar fontes
            if (customization.headingFont) {
                document.documentElement.style.setProperty('--heading-font', customization.headingFont);
                document.getElementById('headingFontSelect').value = customization.headingFont;
            }
            
            if (customization.bodyFont) {
                document.documentElement.style.setProperty('--body-font', customization.bodyFont);
                document.getElementById('bodyFontSelect').value = customization.bodyFont;
            }
            
            // Atualizar color pickers
            updateColorPickers();
            
            console.log('Personalização carregada com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar personalização:', error);
        }
    } else {
        console.log('Nenhuma personalização salva encontrada.');
    }
}

// Função para resetar personalização
function resetCustomization() {
    // Remover classes de tema
    document.body.classList.remove('theme-green', 'theme-blue', 'theme-purple', 'theme-dark');
    
    // Restaurar valores padrão
    document.documentElement.style.setProperty('--primary-color', '#0a5c36');
    document.documentElement.style.setProperty('--secondary-color', '#f39c12');
    document.documentElement.style.setProperty('--accent-color', '#e74c3c');
    document.documentElement.style.setProperty('--text-color', '#333333');
    document.documentElement.style.setProperty('--background-color', '#ffffff');
    document.documentElement.style.setProperty('--light-background', '#f8f9fa');
    document.documentElement.style.setProperty('--border-color', '#dee2e6');
    document.documentElement.style.setProperty('--heading-font', "'Montserrat', sans-serif");
    document.documentElement.style.setProperty('--body-font', "'Open Sans', sans-serif");
    
    // Atualizar seletores
    document.getElementById('headingFontSelect').value = "'Montserrat', sans-serif";
    document.getElementById('bodyFontSelect').value = "'Open Sans', sans-serif";
    
    // Atualizar color pickers
    updateColorPickers();
    
    // Remover do localStorage
    localStorage.removeItem('jota_r_customization');
    
    console.log('Personalização resetada para o padrão.');
}

// Função para aplicar personalização a todos os documentos
function applyCustomizationToDocuments() {
    // Adicionar classe custom-document aos containers de documentos
    document.querySelectorAll('.report-container, .proposal-container, .contract-container').forEach(container => {
        container.classList.add('custom-document');
    });
    
    // Aplicar estilos ao relatório gerado
    if (document.getElementById('reportOutput')) {
        document.getElementById('reportOutput').classList.add('custom-document');
    }
    
    console.log('Personalização aplicada a todos os documentos.');
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando personalização...');
    initCustomizationPanel();
    
    // Adicionar fontes do Google se ainda não estiverem carregadas
    if (!document.getElementById('google-fonts')) {
        const link = document.createElement('link');
        link.id = 'google-fonts';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Open+Sans:wght@400;600&family=Roboto:wght@400;500;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;500;700&family=Raleway:wght@400;500;700&family=Lato:wght@400;700&family=Nunito:wght@400;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap';
        document.head.appendChild(link);
    }
});
