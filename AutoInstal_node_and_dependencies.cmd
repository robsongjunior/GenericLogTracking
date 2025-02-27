@echo off
setlocal

echo Checking if Node.js is installed...

:: Check if Node.js is installed
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js not found. Installing Node.js via Chocolatey...
    choco install -y nodejs
    IF %ERRORLEVEL% NEQ 0 (
        echo Error installing Node.js. Please install manually and try again.
        pause
        exit /b
    )
    echo Node.js installed successfully.
) ELSE (
    echo Node.js is already installed.
)

echo Installing project dependencies...

:: Install project dependencies via npm
npm install puppeteer archiver

echo Installation completed.
pause
