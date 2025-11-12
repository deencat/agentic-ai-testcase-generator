# PowerShell Setup Script for Backend
# Agentic AI Test Case Generator

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Agentic AI Test Case Generator - Backend Setup" -ForegroundColor Cyan
Write-Host "PowerShell Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Python version
Write-Host "Checking Python version..." -ForegroundColor Yellow
python --version
Write-Host ""

# Navigate to backend directory
Set-Location backend

# Create virtual environment
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv
Write-Host ""

# Check if execution policy needs to be set
Write-Host "Checking PowerShell execution policy..." -ForegroundColor Yellow
$policy = Get-ExecutionPolicy -Scope CurrentUser
Write-Host "Current execution policy: $policy" -ForegroundColor Gray

if ($policy -eq "Restricted" -or $policy -eq "AllSigned") {
    Write-Host "Execution policy is restrictive. Attempting to set RemoteSigned..." -ForegroundColor Yellow
    try {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Host "✅ Execution policy set to RemoteSigned" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not set execution policy automatically." -ForegroundColor Red
        Write-Host "Please run PowerShell as Administrator and execute:" -ForegroundColor Yellow
        Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
        Write-Host ""
        Write-Host "Then run this script again." -ForegroundColor Yellow
        pause
        exit 1
    }
}
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to activate virtual environment" -ForegroundColor Red
    Write-Host "Try running PowerShell as Administrator" -ForegroundColor Yellow
    pause
    exit 1
}
Write-Host ""

# Upgrade pip
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
Write-Host ""

# Install dependencies
Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
pip install -r requirements.txt
Write-Host ""

# Create .env file if it doesn't exist
if (-Not (Test-Path .env)) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host "⚠️  Please update .env with your database credentials" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  .env file already exists. Skipping..." -ForegroundColor Yellow
}
Write-Host ""

# Create temp directory
Write-Host "Creating temp_uploads directory..." -ForegroundColor Yellow
if (-Not (Test-Path temp_uploads)) {
    New-Item -ItemType Directory -Path temp_uploads | Out-Null
    Write-Host "✅ temp_uploads directory created" -ForegroundColor Green
} else {
    Write-Host "temp_uploads directory already exists" -ForegroundColor Gray
}
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env file with your database credentials" -ForegroundColor White
Write-Host "2. Create PostgreSQL database: agentic_testcase_generator_dev" -ForegroundColor White
Write-Host "3. Initialize Alembic: alembic init alembic" -ForegroundColor White
Write-Host "4. Edit alembic/env.py (see WEEK_1_2_CHECKLIST.md)" -ForegroundColor White
Write-Host "5. Create migration: alembic revision --autogenerate -m 'Initial migration'" -ForegroundColor White
Write-Host "6. Run migration: alembic upgrade head" -ForegroundColor White
Write-Host "7. Start server: uvicorn app.main:app --reload" -ForegroundColor White
Write-Host ""
Write-Host "Access API docs at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Virtual environment is active. You can now run commands." -ForegroundColor Green
Write-Host "To deactivate later, run: deactivate" -ForegroundColor Gray
Write-Host ""
