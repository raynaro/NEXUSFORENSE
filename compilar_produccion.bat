@echo off
cd /d "%~dp0frontend"
call npm run build
if errorlevel 1 (
 echo ERROR al compilar.
 pause
 exit /b 1
)
echo Web compilada. Ejecuta backend\app.py y abre http://127.0.0.1:5000
pause
