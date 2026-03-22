@echo off
echo ========================================
echo   PersonaFlow Demo - Starting Services
echo ========================================
echo.

echo [1/4] Starting Ollama...
start "Ollama Server" cmd /k "echo Ollama Server Running && ollama serve"
timeout /t 3 /nobreak >nul

echo [2/4] Starting n8n...
start "n8n Workflow" cmd /k "echo n8n Workflow Engine Running && n8n start"
timeout /t 5 /nobreak >nul

echo [3/4] Starting ngrok tunnel...
start "ngrok Tunnel" cmd /k "echo ngrok Tunnel Running && ngrok http 5678"
timeout /t 3 /nobreak >nul

echo [4/4] All services started!
echo.
echo ========================================
echo   IMPORTANT: Copy ngrok URL
echo ========================================
echo.
echo 1. Check the "ngrok Tunnel" window
echo 2. Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
echo 3. Your webhook URL is: [ngrok-url]/webhook/demo-chat
echo.
echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. If ngrok URL changed, update Vercel:
echo    vercel env add NEXT_PUBLIC_DEMO_WEBHOOK_URL production
echo.
echo 2. Test your demo:
echo    Visit: https://personaflow-demo.vercel.app
echo.
echo 3. Share with interviewer:
echo    Send: https://personaflow-demo.vercel.app
echo.
echo ========================================
echo   To Stop All Services:
echo ========================================
echo.
echo Run: stop-demo.bat
echo.
pause
