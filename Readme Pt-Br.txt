1. TrackerTestLog.js
Português
Descrição Básica:

O script TrackerTestLog.js utiliza o Puppeteer para automatizar um navegador Chrome ou Chromium. Ele realiza as seguintes funções:

Configuração de Logs:

Cria diretórios para armazenar capturas de tela (screenshots) e logs (logs).
Limpa quaisquer dados anteriores nesses diretórios para iniciar com uma estrutura limpa.
Escolha de Ambiente:

Insira uma URL personalizada.
Define as URLs de aplicação e filtro de rede com base na escolha do usuário.
Configuração do Puppeteer:

Inicializa o navegador Puppeteer com configurações específicas, como iniciar maximizado e desabilitar algumas funcionalidades de automação.
Navega para a URL especificada pelo usuário.
Captura de Logs:

Logs do Console: Registra todas as mensagens do console do navegador em tempo real.
Logs de Rede: Registra todas as requisições e respostas de rede que correspondem ao filtro especificado pelo usuário, ignorando requisições do tipo OPTIONS.
Captura de Screenshots:

Captura capturas de tela da página em intervalos definidos pelo usuário (padrão de 2 segundos).
Salva as capturas de tela na pasta screenshots com um timestamp no nome do arquivo.
Rotação de Logs:

Monitora o tamanho do arquivo de log de rede e cria novos arquivos de log quando o tamanho excede 200 KB para evitar que os logs fiquem excessivamente grandes.
Monitoramento do Navegador:

Monitora o encerramento do navegador e finaliza o script adequadamente, garantindo que todos os logs sejam salvos antes de sair.
Requisitos:

Instalação de Dependências:
Execute npm install no diretório do projeto para instalar todas as dependências necessárias definidas no package.json.
Instalação do Chromium/Chrome:
Certifique-se de que o Google Chrome ou Chromium está instalado no computador. O Puppeteer utilizará o executável especificado (C:\Program Files\Google\Chrome\Application\chrome.exe). Se estiver usando um caminho diferente, atualize o executablePath nas configurações do Puppeteer.