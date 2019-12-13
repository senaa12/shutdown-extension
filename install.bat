echo Setting up
@echo off

MKDIR C:\\sena

REG ADD "HKCU\Software\Google\Chrome\NativeMessagingHosts\sena.test.app" /ve /t REG_SZ /d "C:\\sena\\sena.test.app.json" /f

@echo { > C:\sena\sena.test.app.json
@echo   "name": "sena.test.app", >> C:\sena\sena.test.app.json
@echo   "description": "Netflix Autoplay Host App", >> C:\sena\sena.test.app.json
@echo   "path": "C:\\sena\\shutdown.bat", >> C:\sena\sena.test.app.json
@echo   "type": "stdio", >> C:\sena\sena.test.app.json
@echo   "allowed_origins": [ >> C:\sena\sena.test.app.json
@echo     "chrome-extension://cmjdonahhpghnpcocbmkfhplfgjccjfe/" >> C:\sena\sena.test.app.json
@echo   ] >> C:\sena\sena.test.app.json
@echo } >> C:\sena\sena.test.app.json

@echo @echo off >> C:\sena\shutdown.bat
@echo pause >> C:\sena\shutdown.bat

echo Setup Complete
pause