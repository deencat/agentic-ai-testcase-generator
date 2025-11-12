# Backend Development Checklist - Week 1-2
## Foundation & Setup

**Current Date:** November 10, 2025  
**Status:** Week 1 - Day 3  
**Developer:** Backend Specialist (Developer A)

---

## 📋 Week 1 Tasks (November 7-10, 2025)

### Day 1-2: Environment Setup ✅ COMPLETED

- [x] Create backend directory structure
- [x] Set up Python project files
- [x] Create requirements.txt with all dependencies
- [x] Create .env.example file
- [x] Create .gitignore file
- [x] Set up core configuration (config.py)
- [x] Set up database connection (database.py)

### Day 3: Database Models ✅ COMPLETED

- [x] Create Project model with KB flags
- [x] Create TestCase model with KB fields
- [x] Create File model
- [x] Create Configuration model with KB settings
- [x] Create KnowledgeBaseDocument model (NEW)
- [x] Create models __init__.py

### Day 3-4: Pydantic Schemas & API Endpoints ✅ IN PROGRESS

- [x] Create project schemas (ProjectCreate, ProjectResponse, etc.)
- [x] Create health check endpoint
- [x] Create project CRUD endpoints
- [x] Set up API router
- [x] Create main FastAPI application
- [x] Configure CORS middleware

### Day 4-5: Setup & Testing 🔄 NEXT

- [ ] Create virtual environment
- [ ] Install all dependencies
- [ ] Create .env file from template
- [ ] Set up PostgreSQL database
- [ ] Initialize Alembic
- [ ] Create initial migration
- [ ] Run migration
- [ ] Start FastAPI server
- [ ] Test endpoints with Swagger UI
- [ ] Write basic tests

---

## 🚀 Quick Start Commands

### 1. Set Up Virtual Environment

```bash
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend

# Create virtual environment
python -m venv venv

# Activate (Windows bash)
source venv/Scripts/activate

# Verify activation
which python
```

### 2. Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

### 3. Configure Environment

```bash
# Copy .env template
cp .env.example .env

# Edit .env file
# Update these values:
# - DATABASE_URL
# - POSTGRES_USER
# - POSTGRES_PASSWORD
# - SECRET_KEY
# - ENCRYPTION_KEY
```

### 4. Set Up Database

```bash
# Option 1: Using psql command line
psql -U postgres
CREATE DATABASE agentic_testcase_generator_dev;
\q

# Option 2: Using pgAdmin
# - Open pgAdmin
# - Right-click Databases > Create > Database
# - Name: agentic_testcase_generator_dev
# - Save
```

### 5. Initialize Alembic

```bash
# Initialize Alembic (creates alembic directory)
alembic init alembic

# Edit alembic.ini
# Line 58: sqlalchemy.url = (leave empty, we use env.py)

# Edit alembic/env.py
# Add these imports at top:
# from app.core.config import settings
# from app.models import Base
# 
# Update config.set_main_option:
# config.set_main_option('sqlalchemy.url', settings.DATABASE_URL)
# 
# Update target_metadata:
# target_metadata = Base.metadata
```

### 6. Create and Run Migration

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration with KB support"

# Review the migration file in alembic/versions/

# Run migration
alembic upgrade head

# Verify tables created
psql -U postgres -d agentic_testcase_generator_dev
\dt
# Should see: projects, test_cases, files, configurations, knowledge_base_documents
\q
```

### 7. Start the Server

```bash
# Method 1: Using uvicorn (recommended for development)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Method 2: Using Python
python -m app.main

# Server should start at: http://localhost:8000
```

### 8. Test the API

```bash
# Open browser and visit:
# - Swagger UI: http://localhost:8000/docs
# - ReDoc: http://localhost:8000/redoc
# - Health Check: http://localhost:8000/api/v1/health

# Test with curl:
curl http://localhost:8000/api/v1/health

# Create a test project:
curl -X POST "http://localhost:8000/api/v1/projects" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"My first project","kb_enabled":false}'

# List projects:
curl http://localhost:8000/api/v1/projects
```

---

## 📊 Week 1 Progress Tracker

| Task Category | Status | Progress |
|--------------|--------|----------|
| Directory Structure | ✅ Done | 100% |
| Configuration Files | ✅ Done | 100% |
| Database Models | ✅ Done | 100% |
| Pydantic Schemas | ✅ Done | 100% |
| API Endpoints | ✅ Done | 100% |
| FastAPI App | ✅ Done | 100% |
| Environment Setup | 🔄 Next | 0% |
| Database Migration | 🔄 Next | 0% |
| Server Running | 🔄 Next | 0% |
| Testing | 🔄 Next | 0% |

**Overall Week 1 Progress: 60%** ✅

---

## 📅 Week 2 Tasks (November 11-14, 2025)

### Day 1-2: Alembic Setup & Migration

- [ ] Configure Alembic properly
- [ ] Create comprehensive initial migration
- [ ] Test migration up/down
- [ ] Verify all tables and relationships
- [ ] Create seed data script (optional)

### Day 3-4: Testing & Documentation

- [ ] Write unit tests for models
- [ ] Write API endpoint tests
- [ ] Test database operations
- [ ] Update API documentation
- [ ] Create example requests/responses

### Day 5: Integration Prep

- [ ] Verify CORS settings
- [ ] Test from frontend (mock requests)
- [ ] Create API contract document
- [ ] Prepare demo for Friday integration
- [ ] Document known issues

---

## ✅ Week 2 Friday Deliverables

By **November 14, 2025 (Friday)**, you should have:

1. **✅ FastAPI Server Running**
   - Accessible at http://localhost:8000
   - Swagger UI working at /docs

2. **✅ Database Operational**
   - PostgreSQL with all tables created
   - Migrations working
   - Can create/read/update/delete projects

3. **✅ API Endpoints Functional**
   - Health check: `GET /api/v1/health`
   - Create project: `POST /api/v1/projects`
   - List projects: `GET /api/v1/projects`
   - Get project: `GET /api/v1/projects/{id}`
   - Update project: `PUT /api/v1/projects/{id}`
   - Delete project: `DELETE /api/v1/projects/{id}`

4. **✅ CORS Configured**
   - Frontend (http://localhost:3000) can call backend
   - No CORS errors

5. **✅ Documentation Ready**
   - README.md complete
   - API contracts defined
   - Example requests documented

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution:**
```bash
# Make sure virtual environment is activated
source venv/Scripts/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 2: Database connection fails
**Solution:**
```bash
# Check PostgreSQL is running
# Windows: Check Services
# Linux/Mac: systemctl status postgresql

# Verify .env settings
cat .env | grep DATABASE_URL

# Test connection
psql -U postgres -d agentic_testcase_generator_dev
```

### Issue 3: Alembic migration fails
**Solution:**
```bash
# Drop and recreate database
psql -U postgres
DROP DATABASE agentic_testcase_generator_dev;
CREATE DATABASE agentic_testcase_generator_dev;
\q

# Re-run migration
alembic upgrade head
```

### Issue 4: CORS errors
**Solution:**
```python
# Check app.main.py CORS settings
# Ensure http://localhost:3000 is in allowed origins

# Update .env if needed
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## 📞 Integration Session Prep (Friday, Nov 14)

### Before the Session

- [ ] Server running and stable
- [ ] All endpoints tested via Swagger
- [ ] Database has sample data
- [ ] Prepare demo script
- [ ] Document any blockers

### During the Session (2-3 hours)

1. **Demo (30 min)**
   - Show backend running
   - Demo health check
   - Demo project CRUD
   - Show database tables

2. **Integration Testing (90 min)**
   - Frontend calls backend health endpoint
   - Frontend creates a project
   - Frontend lists projects
   - Debug any issues together

3. **Planning (30 min)**
   - Review Week 3-4 tasks
   - Align on file upload API contracts
   - Discuss KB upload approach
   - Schedule next sync

---

## 🎯 Success Criteria

**Week 1-2 is successful if:**

✅ Backend server runs without errors  
✅ All database tables exist  
✅ Health check returns 200 OK  
✅ Can create and list projects via API  
✅ Frontend can connect to backend  
✅ No critical blockers  
✅ Ready for Week 3-4 file upload work  

---

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Docs](https://docs.sqlalchemy.org/en/20/)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
- [Pydantic V2 Docs](https://docs.pydantic.dev/latest/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

**Last Updated:** November 10, 2025  
**Status:** Code Complete - Ready for Setup ✅  
**Next Action:** Run setup commands above
