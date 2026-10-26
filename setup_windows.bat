@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo =========================================================
echo     NEXUSFORENSE - PREPARACION DEL PROYECTO
 echo =========================================================
where python >nul 2>&1
if errorlevel 1 (
 echo ERROR: Instala Python 3.11 o superior y marca Add Python to PATH.
 pause
 exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
 echo ERROR: Instala Node.js 20 o superior.
 pause
 exit /b 1
)
echo [1/4] Creando entorno virtual...
python -m venv backend\.venv
if errorlevel 1 goto error
echo [2/4] Instalando dependencias Python...
backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
if errorlevel 1 goto error
echo [3/4] Creando credenciales locales...
backend\.venv\Scripts\python.exe scripts\bootstrap_env.py
if errorlevel 1 goto error
echo [4/4] Instalando dependencias React...
cd frontend
call npm install
if errorlevel 1 goto error
cd ..
echo.
echo PREPARACION COMPLETADA.
echo Revisa CREDENCIALES_LOCALES.txt y ejecuta iniciar_web.bat
pause
exit /b 0
:error
echo ERROR: Revisa los mensajes anteriores.
pause
exit /b 1
