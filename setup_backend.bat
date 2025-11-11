@echo off
REM Quick start script for Windows
REM Backend setup for Agentic AI Test Case Generator

echo ================================================
echo Agentic AI Test Case Generator - Backend Setup
echo ================================================
echo.

REM Check Python version
echo Checking Python version...
python --version
echo.

REM Navigate to backend directory
cd backend

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo.

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip
echo.

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo ✅ .env file created. Please update with your database credentials.
) else (
    echo.
    echo ⚠️  .env file already exists. Skipping...
)

REM Create temp directory
echo.
echo Creating temp_uploads directory...
if not exist temp_uploads mkdir temp_uploads
echo.

echo ================================================
echo ✅ Backend setup complete!
echo ================================================
echo.
echo Next steps:
echo 1. Update .env file with your database credentials
echo 2. Create PostgreSQL database: agentic_testcase_generator_dev
echo 3. Initialize Alembic: alembic init alembic
echo 4. Create migration: alembic revision --autogenerate -m "Initial migration"
echo 5. Run migration: alembic upgrade head
echo 6. Start server: uvicorn app.main:app --reload
echo.
echo Access API docs at: http://localhost:8000/docs
echo ================================================
echo.
pause
