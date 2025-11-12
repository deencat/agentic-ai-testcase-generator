#!/bin/bash
# Backend setup script for Week 1-2

echo "================================================"
echo "Agentic AI Test Case Generator - Backend Setup"
echo "================================================"
echo ""

# Check Python version
echo "Checking Python version..."
python --version

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo ""
echo "Activating virtual environment..."
source venv/Scripts/activate

# Upgrade pip
echo ""
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your database credentials."
else
    echo ""
    echo "⚠️  .env file already exists. Skipping..."
fi

# Create temp directory
echo ""
echo "Creating temp_uploads directory..."
mkdir -p temp_uploads

echo ""
echo "================================================"
echo "✅ Backend setup complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Create PostgreSQL database: agentic_testcase_generator_dev"
echo "3. Initialize Alembic: alembic init alembic"
echo "4. Create migration: alembic revision --autogenerate -m 'Initial migration'"
echo "5. Run migration: alembic upgrade head"
echo "6. Start server: uvicorn app.main:app --reload"
echo ""
echo "Access API docs at: http://localhost:8000/docs"
echo "================================================"
