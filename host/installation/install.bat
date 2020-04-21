echo Setting up
@echo off

set IS_NODE_INSTALLED=0
where node.exe >nul 2>&1 && SET IS_NODE_INSTALLED=1 

MKDIR %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host

REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\shutdown.extension.host" /ve /t REG_SZ /d "%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json" /f

@echo { > %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json
@echo   "name": "shutdown.extension.host", >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json
@echo   "description": "Chrome Shutdown-Extension host app.", >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json
@echo   "path": "run.bat", >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json
@echo   "type": "stdio", >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json
@echo   "allowed_origins": [ >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json
REM you can change ID here with "chrome-extension://YOUR-ID-HERE/""
@echo     "chrome-extension://heanibacideokneklnfomdlokppmcaam/" >>%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json
@echo   ] >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json
@echo } >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.chrome.json

copy host.js %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host

@echo @echo off > %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\run.bat
if %IS_NODE_INSTALLED%==0 (
    @echo Coping installers node build
    @echo "%~dp0node.exe" "%~dp0host.js" >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\run.bat

    if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
        copy node-64.exe "%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\node.exe"
    ) else (
        copy node-86.exe "%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\node.exe"
    )
) else (
    @echo Using systems node
    @echo "node" "%~dp0host.js" >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\run.bat
)

echo Setup complete, installed in %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host
pause