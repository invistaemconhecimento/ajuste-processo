// script.js - Sistema de Consulta de Parâmetros de Flotação

// Variável global para armazenar os dados
let dadosFlotacao = [];

// Função para carregar os dados do arquivo JSON
async function carregarDados() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        dadosFlotacao = await response.json();
        
        // Ordenar os dados por teor para garantir busca eficiente
        dadosFlotacao.sort((a, b) => a.teor - b.teor);
        
        console.log(`Dados carregados: ${dadosFlotacao.length} registros`);
        return true;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        return false;
    }
}

// Função para encontrar os parâmetros com base no teor
function buscarParametros(teor) {
    if (!dadosFlotacao || dadosFlotacao.length === 0) {
        return null;
    }
    
    // Arredondar para uma casa decimal (mesmo formato dos dados)
    const teorArredondado = Math.round(teor * 10) / 10;
    
    // Buscar exato primeiro
    let registroEncontrado = dadosFlotacao.find(registro => registro.teor === teorArredondado);
    
    // Se não encontrou exato, buscar o mais próximo
    if (!registroEncontrado) {
        // Encontrar o registro com teor mais próximo
        registroEncontrado = dadosFlotacao.reduce((prev, curr) => {
            const prevDiff = Math.abs(prev.teor - teorArredondado);
            const currDiff = Math.abs(curr.teor - teorArredondado);
            return currDiff < prevDiff ? curr : prev;
        });
        
        // Verificar se a diferença é aceitável (até 0.2 de diferença)
        const diff = Math.abs(registroEncontrado.teor - teorArredondado);
        if (diff > 0.2) {
            console.warn(`Teor ${teor} não encontrado. Usando valor mais próximo: ${registroEncontrado.teor}`);
        }
    }
    
    return registroEncontrado;
}

// Função para exibir os resultados
function exibirResultados(teor) {
    const resultadosContainer = document.querySelector('.results-container');
    const teorValueElement = document.getElementById('teor-value');
    const statusTextElement = document.getElementById('status-text');
    const statusDot = document.querySelector('.status-dot');
    
    // Atualizar o teor exibido
    teorValueElement.textContent = `${teor}%`;
    
    // Verificar se os dados foram carregados
    if (dadosFlotacao.length === 0) {
        resultadosContainer.innerHTML = `
            <div class="error-message">
                <h3><i class="fas fa-exclamation-triangle"></i> Dados não carregados</h3>
                <p>Os parâmetros de flotação ainda não foram carregados.</p>
                <p>Por favor, aguarde ou recarregue a página.</p>
            </div>
        `;
        statusTextElement.textContent = "Aguardando dados";
        statusDot.style.backgroundColor = "#f39c12";
        return;
    }
    
    // Buscar os parâmetros
    const parametros = buscarParametros(teor);
    
    if (!parametros) {
        resultadosContainer.innerHTML = `
            <div class="error-message">
                <h3><i class="fas fa-exclamation-triangle"></i> Teor não encontrado</h3>
                <p>Não foram encontrados parâmetros para o teor informado (${teor}%).</p>
                <p>Por favor, insira um valor entre 1.0 e 3.0.</p>
            </div>
        `;
        statusTextElement.textContent = "Teor não encontrado";
        statusDot.style.backgroundColor = "#e74c3c";
        return;
    }
    
    // Atualizar status
    statusTextElement.textContent = "Dados carregados com sucesso";
    statusDot.style.backgroundColor = "#2ecc71";
    
    // Formatando os valores para exibição
    const coletorFormatado = parametros.coletor.toFixed(1);
    const espumanteFormatado = parametros.espumante.toFixed(1);
    
    // Construir o HTML dos resultados
    resultadosContainer.innerHTML = `
        <div class="result-card">
            <h3><i class="fas fa-flask"></i> Dosagem de Reagentes</h3>
            <ul class="parameter-list">
                <li class="parameter-item">
                    <span class="parameter-name">Taxa (t):</span>
                    <span class="parameter-value">${parametros.taxa}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Teor Alimentação:</span>
                    <span class="parameter-value">${parametros.teor}%</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Coletor (g/t):</span>
                    <span class="parameter-value">${coletorFormatado}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Espumante (g/t):</span>
                    <span class="parameter-value">${espumanteFormatado}</span>
                </li>
            </ul>
        </div>
        
        <div class="result-card">
            <h3><i class="fas fa-tint"></i> Flotação Rougher</h3>
            <ul class="parameter-list">
                <li class="parameter-item">
                    <span class="parameter-name">pH Rougher:</span>
                    <span class="parameter-value">${parametros.ph_rougher}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Camada (mm):</span>
                    <span class="parameter-value">${parametros.camada_rougher}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">AR (NM³):</span>
                    <span class="parameter-value">${parametros.ar_rougher}</span>
                </li>
            </ul>
        </div>
        
        <div class="result-card">
            <h3><i class="fas fa-filter"></i> Flotação Cleaner/Scavenger</h3>
            <ul class="parameter-list">
                <li class="parameter-item">
                    <span class="parameter-name">pH Cleaner:</span>
                    <span class="parameter-value">${parametros.ph_cleaner}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Camada:</span>
                    <span class="parameter-value">${parametros.camada_cleaner}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">AR (NM³):</span>
                    <span class="parameter-value">${parametros.ar_cleaner}</span>
                </li>
            </ul>
        </div>
        
        <div class="result-card">
            <h3><i class="fas fa-compress-arrows-alt"></i> Jameson 01</h3>
            <ul class="parameter-list">
                <li class="parameter-item">
                    <span class="parameter-name">Camada (mm):</span>
                    <span class="parameter-value">${parametros.camada_jameson01}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">AR (NM³):</span>
                    <span class="parameter-value">${parametros.ar_jameson01}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Água de lavagem (m³):</span>
                    <span class="parameter-value">${parametros.agua_lavagem_jameson01}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Pressão (kPa):</span>
                    <span class="parameter-value">${parametros.pressao_jameson01}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Vácuo:</span>
                    <span class="parameter-value">${parametros.vacuo_jameson01}</span>
                </li>
            </ul>
        </div>
        
        <div class="result-card">
            <h3><i class="fas fa-compress-arrows-alt"></i> Jameson 02</h3>
            <ul class="parameter-list">
                <li class="parameter-item">
                    <span class="parameter-name">Camada (mm):</span>
                    <span class="parameter-value">${parametros.camada_jameson02}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">AR (NM³):</span>
                    <span class="parameter-value">${parametros.ar_jameson02}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Água de lavagem (m³):</span>
                    <span class="parameter-value">${parametros.agua_lavagem_jameson02}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Pressão (kPa):</span>
                    <span class="parameter-value">${parametros.pressao_jameson02}</span>
                </li>
                <li class="parameter-item">
                    <span class="parameter-name">Vácuo:</span>
                    <span class="parameter-value">${parametros.vacuo_jameson02}</span>
                </li>
            </ul>
        </div>
    `;
    
    // Adicionar aviso se estiver usando um valor aproximado
    const teorArredondado = Math.round(teor * 10) / 10;
    if (parametros.teor !== teorArredondado) {
        const primeiroCard = resultadosContainer.querySelector('.result-card');
        if (primeiroCard) {
            const aviso = document.createElement('div');
            aviso.className = 'aproximation-warning';
            aviso.innerHTML = `
                <p><i class="fas fa-info-circle"></i> 
                <strong>Aviso:</strong> Teor ${teor}% não encontrado. 
                Exibindo parâmetros para o teor mais próximo: ${parametros.teor}%</p>
            `;
            aviso.style.cssText = `
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 10px 15px;
                margin-top: 10px;
                color: #856404;
                font-size: 0.9rem;
            `;
            primeiroCard.appendChild(aviso);
        }
    }
}

// Função para validar o teor
function validarTeor(teor) {
    if (isNaN(teor) || teor < 1 || teor > 3) {
        return {
            valido: false,
            mensagem: 'Por favor, insira um valor válido entre 1.0 e 3.0'
        };
    }
    
    return { valido: true, mensagem: '' };
}

// Configurar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', async function() {
    const consultarBtn = document.getElementById('consultar-btn');
    const teorInput = document.getElementById('teor');
    const teorSlider = document.getElementById('teor-slider');
    const sliderValue = document.getElementById('slider-value');
    const statusTextElement = document.getElementById('status-text');
    const statusDot = document.querySelector('.status-dot');
    
    // Atualizar status para "Carregando dados"
    statusTextElement.textContent = "Carregando dados...";
    statusDot.style.backgroundColor = "#f39c12";
    
    // Carregar dados do JSON
    const dadosCarregados = await carregarDados();
    
    if (dadosCarregados) {
        // Exibir resultados iniciais
        const teorInicial = parseFloat(teorInput.value);
        exibirResultados(teorInicial);
        
        // Configurar o botão de consulta
        consultarBtn.addEventListener('click', function() {
            const teor = parseFloat(teorInput.value);
            
            // Validar o valor
            const validacao = validarTeor(teor);
            if (!validacao.valido) {
                alert(validacao.mensagem);
                teorInput.focus();
                return;
            }
            
            // Atualizar o slider para corresponder ao valor
            teorSlider.value = teor * 10;
            sliderValue.textContent = teor.toFixed(1);
            
            // Exibir resultados
            exibirResultados(teor);
        });
        
        // Configurar o slider
        teorSlider.addEventListener('input', function() {
            const teor = parseFloat(teorSlider.value) / 10;
            sliderValue.textContent = teor.toFixed(1);
            teorInput.value = teor.toFixed(1);
        });
        
        // Configurar o slider para mudar resultados ao soltar
        teorSlider.addEventListener('change', function() {
            const teor = parseFloat(teorSlider.value) / 10;
            exibirResultados(teor);
        });
        
        // Permitir Enter no campo de entrada
        teorInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                consultarBtn.click();
            }
        });
        
        // Adicionar evento de input em tempo real para validação
        teorInput.addEventListener('input', function() {
            const valor = parseFloat(this.value);
            if (isNaN(valor)) return;
            
            // Limitar valor entre 1.0 e 3.0
            if (valor < 1) this.value = 1.0;
            if (valor > 3) this.value = 3.0;
            
            // Atualizar slider se valor for válido
            if (valor >= 1 && valor <= 3) {
                teorSlider.value = valor * 10;
                sliderValue.textContent = valor.toFixed(1);
            }
        });
        
        // Adicionar botões de incremento/decremento rápido
        const inputGroup = document.querySelector('.input-group');
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'quick-buttons';
        buttonsContainer.style.cssText = `
            display: flex;
            gap: 10px;
            margin-top: 10px;
            flex-wrap: wrap;
        `;
        
        const teoresRapidos = [1.0, 1.5, 2.0, 2.5, 3.0];
        teoresRapidos.forEach(teorRapido => {
            const button = document.createElement('button');
            button.textContent = `${teorRapido}%`;
            button.style.cssText = `
                padding: 8px 15px;
                background-color: #ecf0f1;
                border: 1px solid #bdc3c7;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 500;
            `;
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = '#3498db';
                button.style.color = 'white';
                button.style.borderColor = '#2980b9';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = '#ecf0f1';
                button.style.color = 'inherit';
                button.style.borderColor = '#bdc3c7';
            });
            button.addEventListener('click', () => {
                teorInput.value = teorRapido;
                teorSlider.value = teorRapido * 10;
                sliderValue.textContent = teorRapido.toFixed(1);
                exibirResultados(teorRapido);
            });
            buttonsContainer.appendChild(button);
        });
        
        inputGroup.appendChild(buttonsContainer);
        
    } else {
        // Erro ao carregar dados
        statusTextElement.textContent = "Erro ao carregar dados";
        statusDot.style.backgroundColor = "#e74c3c";
        
        const resultadosContainer = document.querySelector('.results-container');
        resultadosContainer.innerHTML = `
            <div class="error-message">
                <h3><i class="fas fa-exclamation-triangle"></i> Erro ao carregar dados</h3>
                <p>Não foi possível carregar os parâmetros de flotação.</p>
                <p>Verifique se o arquivo data.json está acessível e tente recarregar a página.</p>
                <button id="tentar-novamente" style="
                    margin-top: 15px;
                    padding: 10px 20px;
                    background-color: #3498db;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    <i class="fas fa-redo"></i> Tentar Novamente
                </button>
            </div>
        `;
        
        // Adicionar evento ao botão de tentar novamente
        document.getElementById('tentar-novamente')?.addEventListener('click', async function() {
            statusTextElement.textContent = "Tentando carregar dados...";
            statusDot.style.backgroundColor = "#f39c12";
            
            const dadosCarregados = await carregarDados();
            if (dadosCarregados) {
                const teorInicial = parseFloat(teorInput.value);
                exibirResultados(teorInicial);
            }
        });
    }
    
    // Adicionar estilo CSS dinâmico para avisos
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            grid-column: 1 / -1;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 10px;
            padding: 25px;
            text-align: center;
            color: #721c24;
        }
        
        .error-message h3 {
            color: #721c24;
            margin-bottom: 15px;
        }
        
        .error-message p {
            margin-bottom: 10px;
        }
        
        .aproximation-warning i {
            margin-right: 8px;
        }
        
        @media (max-width: 768px) {
            .quick-buttons {
                justify-content: center;
            }
            
            .quick-buttons button {
                flex: 1;
                min-width: 80px;
            }
        }
    `;
    document.head.appendChild(style);
});
