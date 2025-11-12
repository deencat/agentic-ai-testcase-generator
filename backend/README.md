# Agentic AI Test Case Generator - Backend

FastAPI backend for AI-powered test case generation with Knowledge Base integration.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── health.py
│   │       └── projects.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── project.py
│   │   ├── test_case.py
│   │   ├── file.py
│   │   ├── configuration.py
│   │   └── knowledge_base_document.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── project.py
│   ├── services/
│   ├── __init__.py
│   └── main.py
├── tests/
├── alembic/
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Python 3.10 or higher
- PostgreSQL 15 or higher
- pip (Python package manager)

### 2. Environment Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (bash):
source venv/Scripts/activate

# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Setup

```bash
# Install PostgreSQL (if not already installed)
# Download from: https://www.postgresql.org/download/

# Create database
psql -U postgres
CREATE DATABASE agentic_testcase_generator_dev;
\q
```

### 4. Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
# Update DATABASE_URL, POSTGRES_USER, POSTGRES_PASSWORD
```

### 5. Database Migration

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial migration with KB support"

# Run migrations
alembic upgrade head
```

### 6. Run the Application

```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or use Python directly
python -m app.main
```

### 7. Access the API

- **API Documentation (Swagger):** http://localhost:8000/docs
- **Alternative Docs (ReDoc):** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/api/v1/health

## API Endpoints

### Health Check
- `GET /api/v1/health` - Check API and database status

### Projects
- `POST /api/v1/projects` - Create a new project
- `GET /api/v1/projects` - List all projects
- `GET /api/v1/projects/{project_id}` - Get project details
- `PUT /api/v1/projects/{project_id}` - Update project
- `DELETE /api/v1/projects/{project_id}` - Delete project (soft delete)

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_api.py
```

### Code Formatting

```bash
# Format code with Black
black app/

# Check with Flake8
flake8 app/

# Type checking with mypy
mypy app/
```

## Database Models

### Project
- Organizes test case generation sessions
- Contains KB enable/disable flag

### TestCase
- Stores generated test cases
- Includes KB references and compliance scores

### File
- Uploaded requirement files (PDF, Excel, text)

### Configuration
- LLM provider settings
- KB configuration options

### KnowledgeBaseDocument
- User guides, manuals, and reference docs
- Supports deduplication via file hash

## Week 1-2 Deliverables

✅ FastAPI server running  
✅ PostgreSQL database with all tables (including KB)  
✅ Basic API endpoints (`/health`, `/projects`)  
✅ Swagger UI documentation  
✅ CORS configured for frontend  
✅ Ready for Week 2 Friday integration  

## Next Steps (Week 3-4)

- Implement file upload endpoints
- Add PDF/Excel parsers
- Create KB document upload API
- Add configuration endpoints
- Implement API key encryption

## Tech Stack

- **Framework:** FastAPI 0.104+
- **Database:** PostgreSQL 15+ with SQLAlchemy 2.0
- **Migration:** Alembic
- **Validation:** Pydantic 2.5+
- **HTTP Client:** httpx (for LLM APIs)
- **Document Processing:** PyPDF2, openpyxl
- **Testing:** pytest, pytest-asyncio

## Environment Variables

See `.env.example` for all available configuration options.

## Contributing

1. Create feature branch from `develop`
2. Make changes with tests
3. Run tests and linting
4. Submit PR for review

## License

Proprietary - All rights reserved

---

**Version:** 1.0.0  
**Last Updated:** November 10, 2025  
**Status:** Week 1-2 Foundation Complete ✅
