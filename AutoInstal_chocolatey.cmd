@echo off
setlocal

echo Checking if Chocolatey is installed...

:: Check if Chocolatey is installed
choco -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Chocolatey not found. Installing Chocolatey...

    :: Install Chocolatey
    powershell -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command ^
    "Set-ExecutionPolicy Bypass -Scope Process; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
    
    IF %ERRORLEVEL% NEQ 0 (
        echo Error installing Chocolatey. Please install manually and try again.
        pause
        exit /b
    )
    echo Chocolatey installed successfully.

    :: Add Chocolatey to PATH for this session
    set "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
) ELSE (
    echo Chocolatey is already installed.
)

:: Call the next script
call AutoInstal_node_and_dependencies.cmd
