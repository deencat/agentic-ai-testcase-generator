# Start FastAPI Server Script
# Run this from the backend directory

Write-Host "Starting FastAPI server..." -ForegroundColor Cyan
Write-Host ""

# Check if in backend directory
if (!(Test-Path "app\main.py")) {
    Write-Host "❌ Error: Not in backend directory!" -ForegroundColor Red
    Write-Host "Please run this from: backend\" -ForegroundColor Yellow
    exit 1
}

# Check if virtual environment is activated
if ($env:VIRTUAL_ENV) {
    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Virtual environment not activated" -ForegroundColor Yellow
    Write-Host "Activating..." -ForegroundColor Yellow
    & .\venv\Scripts\Activate.ps1
}

Write-Host ""
Write-Host "🚀 Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "📚 API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
