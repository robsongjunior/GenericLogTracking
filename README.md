# 📊 Monitoramento de Atividades de Navegação
Este projeto realiza o monitoramento de atividades de navegação em uma URL específica, capturando logs de rede e gerando screenshots automaticamente, além de arquivar os logs para envio posterior. O código utiliza o Puppeteer para simular o navegador e capturar informações detalhadas das interações com a página monitorada.

## ⚙️ Instalação
Para começar, siga as etapas abaixo para configurar o ambiente:

### Instalação do Chocolatey
🚀 Primeiramente, execute o script `AutoInstal_chocolatey.cmd`. Ele instalará o Chocolatey, um gerenciador de pacotes para o Windows.

### Instalação do Node.js e Dependências
🌐 Após o Chocolatey estar instalado, execute o script `AutoInstal_node_and_dependencies.cmd`. Este script irá instalar o Node.js e as dependências necessárias para o projeto.

### Inicialização do Monitoramento
🖥️ Para iniciar o monitoramento, execute o script `Inicializer.cmd`. Ele iniciará o código principal e começará o monitoramento da URL configurada.

## 🔍 Funcionalidade do Código
O código tem como objetivo monitorar a atividade de uma URL específica em tempo real, capturando tanto os logs de rede quanto as screenshots da página. O fluxo de execução pode ser dividido nas seguintes etapas:

### 🗂️ Estrutura de Pastas
Após rodar o monitoramento, as seguintes pastas e arquivos serão criados:

- **logs/**: Diretório principal onde todos os logs e screenshots serão armazenados.
- **console.log**: Registra as mensagens do console do navegador.
- **network.log**: Registra todas as requisições e respostas de rede.
- **screenshots/**: Pasta onde as screenshots serão salvas.

### 🖥️ Como Funciona o Monitoramento

#### Captura de URL e Filtros
O script solicita ao usuário a URL que deseja monitorar. Você também pode aplicar um filtro para monitorar apenas as requisições de uma API específica.

#### Captura de Logs de Console e Rede
O código captura todos os logs do console do navegador, assim como as requisições e respostas de rede. Esses logs são armazenados nos arquivos `console.log` e `network.log`.

#### Captura de Screenshots
O script solicita um intervalo de tempo para capturar as screenshots da página. As imagens são salvas na pasta `screenshots/` com timestamps, permitindo acompanhar as mudanças na interface da aplicação.

#### Arquivamento dos Logs
Quando o navegador for fechado, os logs e screenshots serão compactados em um arquivo ZIP chamado `LogsForSend.zip` e estarão prontos para envio.

## 📁 Pastas e Arquivos Gerados
A estrutura de diretórios após a execução do monitoramento será:

- **logs/screenshots/**: Contém as imagens capturadas.
  - `screenshot-<timestamp>.jpg`
- **logs/console.log**: Registra todos os logs do console capturados do navegador.
- **logs/network.log**: Armazena todas as requisições e respostas de rede com informações detalhadas.

## 🚀 Uso
- Execute os scripts na ordem indicada para configurar o ambiente.
- Quando rodar o `Inicializer.cmd`, o monitoramento será iniciado. O usuário será solicitado a inserir a URL da página e opções de filtro.
- O código monitorará as atividades de rede e salvará as screenshots automaticamente. Quando o navegador for fechado, todos os logs serão compactados e prontos para envio.

## 🛠️ Requisitos
- **Node.js**: O script requer o Node.js instalado no ambiente.
- **Puppeteer**: Biblioteca usada para controlar o navegador e capturar logs e screenshots.

## 🤝 Contribuição
Se você quiser contribuir para o projeto, sinta-se à vontade para abrir pull requests com melhorias ou sugestões. Toda contribuição é bem-vinda!

