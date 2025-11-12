# Simple Server Start Script for Windows
# This script starts the FastAPI server without auto-reload to avoid Windows multiprocessing issues

Write-Host "Starting FastAPI Server (without auto-reload)..." -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Green

# Activate virtual environment (if not already activated)
if (-not $env:VIRTUAL_ENV) {
    Write-Host "Activating virtual environment..." -ForegroundColor Yellow
    & ".\venv\Scripts\Activate.ps1"
}

Write-Host "`nStarting server at http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "API Documentation: http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host "Note: Auto-reload is disabled. Restart manually after code changes." -ForegroundColor Gray
Write-Host "=" * 60 -ForegroundColor Green
Write-Host ""

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
