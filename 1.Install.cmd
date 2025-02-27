@echo off
:: Check if the script is running as administrator
net session >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo This script needs to be run as administrator.
    echo Requesting administrator privileges...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

setlocal
echo Permissions verified. Starting installation process...

:: Call the next script
call AutoInstal_chocolatey.cmd
pause