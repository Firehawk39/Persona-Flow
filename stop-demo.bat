@echo off
echo ========================================
echo   PersonaFlow Demo - Stopping Services
echo ========================================
echo.

echo Stopping Ollama...
taskkill /F /IM ollama.exe 2>nul
if %errorlevel% == 0 (
    echo [OK] Ollama stopped
) else (
    echo [INFO] Ollama was not running
)

echo Stopping n8n...
taskkill /F /IM node.exe /FI "WINDOWTITLE eq n8n*" 2>nul
if %errorlevel% == 0 (
    echo [OK] n8n stopped
) else (
    echo [INFO] n8n was not running
)

echo Stopping ngrok...
taskkill /F /IM ngrok.exe 2>nul
if %errorlevel% == 0 (
    echo [OK] ngrok stopped
) else (
    echo [INFO] ngrok was not running
)

echo.
echo ========================================
echo   All services stopped!
echo ========================================
echo.
pause
