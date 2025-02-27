const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const archiver = require('archiver'); // Importando o módulo archiver

// Caminhos dos navegadores
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

// Função para verificar a existência do arquivo
const checkIfFileExists = (filePath) => fs.existsSync(filePath);

// Caminho para o navegador
const browserPath = checkIfFileExists(chromePath) ? chromePath : edgePath;

// Diretórios e arquivos para logs
const logsDir = path.join(__dirname, 'logs');
const screenshotsDir = path.join(logsDir, 'screenshots'); // Agora dentro de 'logs'
const consoleLogFile = path.join(logsDir, 'console.log');
let networkLogFile = path.join(logsDir, 'network.log');
let networkLogIndex = 1;

// Função para limpar diretórios e criar estrutura de logs
const setupLogs = () => {
  if (fs.existsSync(logsDir)) {
    fs.rmSync(logsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(logsDir);
  if (fs.existsSync(screenshotsDir)) {
    fs.rmSync(screenshotsDir, { recursive: true, force: true });
  }
  fs.mkdirSync(screenshotsDir);
  fs.writeFileSync(consoleLogFile, '');
  fs.writeFileSync(networkLogFile, '');
};

// Função para capturar entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Função para rotacionar o arquivo de log de rede quando atingir 200 KB
const checkNetworkLogSize = () => {
  const stats = fs.statSync(networkLogFile);
  if (stats.size > 200 * 1024) {
    networkLogIndex += 1;
    networkLogFile = path.join(logsDir, `network-${networkLogIndex}.log`);
    fs.writeFileSync(networkLogFile, '');
  }
};

// Funções para sanitizar dados sensíveis
const sanitizeHeaders = (headers) => {
  const sanitizedHeaders = { ...headers };
  if (sanitizedHeaders.Authorization && sanitizedHeaders.Authorization.startsWith('Bearer')) {
    sanitizedHeaders.Authorization = 'Bearer [TOKEN REMOVIDO]';
  }
  return JSON.stringify(sanitizedHeaders);
};

const sanitizeBody = (body) => {
  try {
    const parsedBody = JSON.parse(body);
    if (parsedBody.password) {
      parsedBody.password = '***';
    }
    return JSON.stringify(parsedBody);
  } catch (error) {
    return body;
  }
};

// Função para gerar timestamp formatado no fuso horário de São Paulo
const getFormattedTimestamp = (forFilename = false) => {
  const date = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
  return forFilename ? date.replace(/[/\s:]/g, '-') : date;
};

// Função para compactar a pasta 'logs' em um arquivo zip
const createZipArchive = (sourceDir, outPath) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Arquivo zip criado: ${outPath} (${archive.pointer()} bytes)`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
};

(async () => {
  try {
    // Preparar diretórios de log
    setupLogs();

// ================================================
//         CONFIGURAÇÃO DO MONITORAMENTO
// ================================================

// Códigos de cor ANSI para amarelo e reset
const yellow = "\x1b[33m";
const reset = "\x1b[0m";

console.log("==================================================");

// Capturar a URL a ser monitorada
const appUrl = await question("-> Informe a URL que deseja monitorar: ");
console.log("--------------------------------------------------");

// Perguntar se deseja utilizar um filtro para as requisições de API
const filterInput = await question("-> Deseja aplicar um filtro de API?\n   Se sim, informe a URL do filtro (deixe em branco para monitorar todas): ");
const targetURL = filterInput ? filterInput : '';
console.log("--------------------------------------------------");

// Exibir informações iniciais de monitoramento com cor amarela
console.log(`\n${yellow}[INFO]${reset} Monitoramento iniciado para: ${appUrl}`);
if (targetURL) {
  console.log(`${yellow}[INFO]${reset} Filtro aplicado: ${targetURL}`);
} else {
  console.log(`${yellow}[INFO]${reset} Nenhum filtro de rede aplicado. Monitorando todas as requisições.`);
  console.log(`       (Observação: a ausência de um filtro de URL de API pode causar inconsistências na captura de requisições. Recomendamos informar a URL da API para manter um log mais organizado.)`);
}

console.log("==================================================\n");

// Solicitar intervalo para captura de screenshots
let screenshotInterval = await question("-> Informe o intervalo de captura de screenshots em segundos (padrão: 2): ");


    rl.close(); // Fechar a interface de entrada do usuário

    // Converter o intervalo para milissegundos
    screenshotInterval = screenshotInterval ? parseInt(screenshotInterval) * 1000 : 2000;

    // Configurações e inicialização do Puppeteer
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--start-maximized', '--remote-debugging-port=9222', '--disable-blink-features=AutomationControlled'],
      executablePath: browserPath
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    // Navegar para a URL especificada
    await page.goto(appUrl, { timeout: 0 });
    console.log('Navegador iniciado. Realize seus testes manualmente.');

    // Capturar logs do console em tempo real
    page.on('console', (msg) => {
      const timestamp = getFormattedTimestamp();
      const logEntry = `[${timestamp}] ${msg.type().toUpperCase()}: ${msg.text()}\n`;
      fs.appendFileSync(consoleLogFile, logEntry);
    });

    // Capturar atividades de rede com informações completas e timestamp em tempo real
    page.on('request', async (request) => {
      if (!targetURL || request.url().startsWith(targetURL)) {
        try {
          const timestamp = getFormattedTimestamp();
          const headers = sanitizeHeaders(request.headers());
          const method = request.method();
          const url = request.url();
          const postData = request.postData() ? `BODY: ${sanitizeBody(request.postData())}` : '';
          const logEntry = `[${timestamp}] [REQUEST] ${method} ${url} HEADERS: ${headers} ${postData}\n`;
          fs.appendFileSync(networkLogFile, logEntry);
          checkNetworkLogSize();
        } catch (error) {
          console.error(`Erro ao capturar requisição: ${error}`);
        }
      }
    });

    // Ignorar requisições OPTIONS na captura de respostas de rede
    page.on('response', async (response) => {
      if (response.request().method() === 'OPTIONS') {
        return; // Ignorar a resposta se for uma requisição OPTIONS
      }

      if (!targetURL || response.url().startsWith(targetURL)) {
        try {
          const timestamp = getFormattedTimestamp();
          const headers = sanitizeHeaders(response.headers());
          const status = response.status();
          const url = response.url();
          const contentType = response.headers()['content-type'];
          let responseBody = '';

          if (contentType && contentType.includes('application/json')) {
            responseBody = `BODY: ${sanitizeBody(await response.text())}`;
          } else if (contentType && contentType.startsWith('text/')) {
            responseBody = `BODY: ${await response.text()}`;
          } else {
            responseBody = '[CONTEÚDO BINÁRIO OMITIDO]';
          }

          const logEntry = `[${timestamp}] [RESPONSE] ${status} ${url} HEADERS: ${headers} ${responseBody}\n`;
          fs.appendFileSync(networkLogFile, logEntry);
          checkNetworkLogSize();
        } catch (error) {
          console.error(`Erro ao capturar resposta: ${error}`);
        }
      }
    });

    // Função para capturar screenshots recursivamente
    const captureScreenshots = async () => {
      const timestamp = getFormattedTimestamp(true); // Formato seguro para nome de arquivo
      const screenshotPath = path.join(screenshotsDir, `screenshot-${timestamp}.jpg`);
      try {
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot capturada: ${screenshotPath}`);
      } catch (err) {
        console.error(`Erro ao capturar screenshot: ${err}`);
      }
      setTimeout(captureScreenshots, screenshotInterval);
    };

    // Iniciar a captura recursiva de screenshots
    captureScreenshots();

    // Monitorar o fechamento do navegador e salvar logs antes de sair
    browser.on('disconnected', async () => {
      console.log('Navegador fechado. Salvando logs e criando arquivo compactado.');

      const zipFileName = 'LogsForSend.zip';
      const zipFilePath = path.join(__dirname, zipFileName);

      try {
        await createZipArchive(logsDir, zipFilePath);
        console.log(`Arquivo compactado criado com sucesso: ${zipFilePath}`);
      } catch (err) {
        console.error(`Erro ao criar arquivo zip: ${err}`);
      }

      console.log('Encerrando aplicação.');
      process.exit(0);
    });
  } catch (error) {
    console.error(`Erro no processo principal: ${error}`);
    process.exit(1);
  }
})();
