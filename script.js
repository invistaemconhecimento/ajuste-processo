// Dados da aplicação - em um cenário real, isto viria de um arquivo JSON externo
// Para simplificar, incluímos os dados diretamente aqui
const dadosFlotacao = [
  // ... (os mesmos dados do arquivo data.json acima)
  // Por limitação de espaço, incluímos apenas alguns exemplos aqui
  // No arquivo real, você usaria todos os 21 registros do data.json
  {
    "teor": 1.0,
    "taxa": "250 - 400",
    "ph_rougher": "9,7 - 10,2",
    "ph_cleaner": "11 - 11,5",
    "coletor": 31.0,
    "espumante": 10.0,
    "camada_rougher": "30 - 40",
    "ar_rougher": "08 - 12 NM³",
    "camada_cleaner": "20 - 40",
    "ar_cleaner": "06 - 10 NM³",
    "camada_jameson01": "450 - 500",
    "ar_jameson01": "150 - 170",
    "agua_lavagem_jameson01": "45 - 55",
    "pressao_jameson01": "140 - 155",
    "vacuo_jameson01": "-16",
    "camada_jameson02": "450 - 500",
    "ar_jameson02": "80 - 100",
    "agua_lavagem_jameson02": "25 - 45",
    "pressao_jameson02": "130 - 155",
    "vacuo_jameson02": "-16"
  },
  {
    "teor": 1.5,
    "taxa": "250 - 400",
    "ph_rougher": "9,7 - 10,2",
    "ph_cleaner": "11 - 11,5",
    "coletor": 34.7,
    "espumante": 13.7,
    "camada_rougher": "30 - 40",
    "ar_rougher": "08 - 12 NM³",
    "camada_cleaner": "20 - 40",
    "ar_cleaner": "06 - 10 NM³",
    "camada_jameson01": "450 - 500",
    "ar_jameson01": "170 - 220",
    "agua_lavagem_jameson01": "45 - 55",
    "pressao_jameson01": "140 - 155",
    "vacuo_jameson01": "-16",
    "camada_jameson02": "450 - 500",
    "ar_jameson02": "100 - 120",
    "agua_lavagem_jameson02": "25 - 45",
    "pressao_jameson02": "130 - 155",
    "vacuo_jameson02": "-16"
  },
  {
    "teor": 2.0,
    "taxa": "250 - 400",
    "ph_rougher": "9,7 - 10,2",
    "ph_cleaner": "11 - 11,5",
    "coletor": 37.2,
    "espumante": 16.2,
    "camada_rougher": "30 - 40",
    "ar_rougher": "08 - 12 NM³",
    "camada_cleaner": "20 - 40",
    "ar_cleaner": "06 - 10 NM³",
    "camada_jameson01": "450 - 500",
    "ar_jameson01": "300 - 360",
    "agua_lavagem_jameson01": "45 - 55",
    "pressao_jameson01": "140 - 155",
    "vacuo_jameson01": "-16",
    "camada_jameson02": "450 - 500",
    "ar_jameson02": "120 - 160",
    "agua_lavagem_jameson02": "25 - 45",
    "pressao_jameson02": "130 - 155",
    "vacuo_jameson02": "-16"
  },
  {
    "teor": 3.0,
    "taxa": "250 - 400",
    "ph_rougher": "9,7 - 10,2",
    "ph_cleaner": "11 - 11,5",
    "coletor": 40.6,
    "espumante": 19.6,
    "camada_rougher": "30 - 40",
    "ar_rougher": "08 - 12 NM³",
    "camada_cleaner": "20 - 40",
    "ar_cleaner": "06 - 10 NM³",
    "camada_jameson01": "450 - 500",
    "ar_jameson01": "300 - 360",
    "agua_lavagem_jameson01": "45 - 55",
    "pressao_jameson01": "140 - 155",
    "vacuo_jameson01": "-16",
    "camada_jameson02": "450 - 500",
    "ar_jameson02": "120 - 160",
    "agua_lavagem_jameson02": "25 - 45",
    "pressao_jameson02": "130 - 155",
    "vacuo_jameson02": "-16"
  }
];

// Função para encontrar os parâmetros com base no teor
function buscarParametros(teor) {
  // Encontrar o registro mais próximo do teor informado
  let registroEncontrado = null;
  
  for (let registro of dadosFlotacao) {
    if (registro.teor === teor) {
      registroEncontrado = registro;
      break;
    }
  }
  
  // Se não encontrou exato, buscar o mais próximo
  if (!registroEncontrado) {
    const teorArredondado = Math.round(teor * 10) / 10;
    
    for (let registro of dadosFlotacao) {
      if (registro.teor === teorArredondado) {
        registroEncontrado = registro;
        break;
      }
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
}

// Configurar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  const consultarBtn = document.getElementById('consultar-btn');
  const teorInput = document.getElementById('teor');
  const teorSlider = document.getElementById('teor-slider');
  const sliderValue = document.getElementById('slider-value');
  
  // Exibir resultados iniciais
  exibirResultados(parseFloat(teorInput.value));
  
  // Configurar o botão de consulta
  consultarBtn.addEventListener('click', function() {
    const teor = parseFloat(teorInput.value);
    
    // Validar o valor
    if (isNaN(teor) || teor < 1 || teor > 3) {
      alert('Por favor, insira um valor válido entre 1.0 e 3.0');
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
});
