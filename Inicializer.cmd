@echo off
:: Check if the script is running as administrator
net session >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo This script needs to be run as administrator.
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo Starting the automated capture script...

REM Mudar o diretório de trabalho para o diretório do script
cd /d %~dp0

REM Execute the Node.js script
node TrackerTestLog.js

echo Script completed.
pause
exit
