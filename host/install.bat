echo Setting up
@echo off

MKDIR %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host

REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\shutdown.extension.host" /ve /t REG_SZ /d "%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json" /f

@echo { > %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json
@echo   "name": "shutdown.extension.host", >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json
@echo   "description": "Chrome Shutdown-Extension host app.", >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json
@echo   "path": "shutdown.extension.host.exe", >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json
@echo   "type": "stdio", >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json
@echo   "allowed_origins": [ >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json
@echo     "chrome-extension://idgamnlndapgniioemkenjilnljoakoj/" >>%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json
@echo   ] >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json
@echo } >> %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\shutdown.extension.host.json

copy shutdown.extension.host.exe %LOCALAPPDATA%\Chrome-Shutdown-Extension-Host
echo Setup Complete
pause