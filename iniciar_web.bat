@echo off
cd /d "%~dp0"
if not exist "backend\.venv\Scripts\python.exe" (
 echo Primero ejecuta setup_windows.bat
 pause
 exit /b 1
)
if not exist "frontend\node_modules" (
 echo Primero ejecuta setup_windows.bat
 pause
 exit /b 1
)
start "NEXUSFORENSE - API FLASK" cmd /k "cd /d ""%~dp0backend"" && .venv\Scripts\python.exe app.py"
start "NEXUSFORENSE - WEB REACT" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"
timeout /t 4 /nobreak >nul
start "" http://127.0.0.1:5173
exit /b 0
