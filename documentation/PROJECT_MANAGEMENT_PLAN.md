# Project Management Plan
## Agentic AI Test Case Generator with Knowledge Base Feature

**Document Version:** 2.1 (Week 4 Backend Complete)  
**Date:** November 7, 2025  
**Last Updated:** November 12, 2025 (Week 4 Backend Complete - Configuration & Testing)  
**Project Duration:** 12 Weeks (Phase 1 MVP with KB)  
**Team Size:** 2 AI Agent Developers (using Cursor IDE & GitHub Copilot)  
**Development Approach:** AI-Assisted Development  
**Key Enhancement:** Knowledge Base document integration for 40-60% quality improvement  

---

## 🤖 FOR AI AGENTS (Cursor/Copilot)

**This is the master document for AI-assisted development.**

### How AI Agents Should Use This Document:

1. **Starting a Task:**
   - Command: `@PROJECT_MANAGEMENT_PLAN.md Implement Week X [Task Name]`
   - AI reads full context including dependencies, risks, and success criteria
   - AI implements with complete understanding of project constraints

2. **During Implementation:**
   - Reference acceptance criteria for each task
   - Check integration points and dependencies
   - Follow the detailed technical specifications
   - Include error handling and testing as specified

3. **Code Review:**
   - Command: `@PROJECT_MANAGEMENT_PLAN.md Review against Week X acceptance criteria`
   - Verify implementation meets all success criteria

4. **Best Practices:**
   - ✅ Always read the entire week's section before implementing
   - ✅ Check dependencies before starting a task
   - ✅ Follow the exact file structure specified
   - ✅ Implement all acceptance criteria
   - ✅ Write tests as specified in each task

**Note:** All task details, acceptance criteria, and integration points are in this single document for complete AI context.  

---

# TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Project Scope & Objectives](#project-scope--objectives)
3. [Team Structure & Responsibilities](#team-structure--responsibilities)
4. [Phase 1 MVP Timeline (12 Weeks)](#phase-1-mvp-timeline-12-weeks)
5. [Work Split Strategy](#work-split-strategy)
6. [Integration Points & Milestones](#integration-points--milestones)
7. [Risk Management](#risk-management)
8. [Success Criteria](#success-criteria)
9. [Phase 2 Planning](#phase-2-planning-months-4-6)
10. [AI Development Best Practices](#ai-development-best-practices)
11. [Knowledge Base Feature Summary](#-knowledge-base-feature-summary)
12. [Appendix](#appendix)

---

# EXECUTIVE SUMMARY

## 📊 High-Level Timeline (Visual Overview)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         12-WEEK MVP TIMELINE                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Week 1-2:   🏗️  FOUNDATION & SETUP                                     │
│              ├─ Developer A: Database + Basic API + KB Schema          │
│              └─ Developer B: Next.js Setup + UI Shell                   │
│                                                                          │
│  Week 3-4:   📁 FILE UPLOAD & CONFIG                                    │
│              ├─ Developer A: File Upload API + KB Upload + Parsing     │
│              └─ Developer B: Drag-Drop UI + KB UI + Config Drawer      │
│                                                                          │
│  Week 5-6:   🤖 LLM INTEGRATION & PROGRESS UI                           │
│              ├─ Developer A: Ollama + OpenRouter/Deepseek + AI Agents  │
│              │               + KB Context + SSE                         │
│              └─ Developer B: Generate Button + Progress + KB Indicators│
│                                                                          │
│  Week 7-8:   📋 TEST CASE MANAGEMENT                                    │
│              ├─ Developer A: Enhanced Parsing + CRUD APIs               │
│              └─ Developer B: Preview Cards + KB Display + Filters      │
│                                                                          │
│  Week 9-10:  📤 EXPORT & EDITING                                        │
│              ├─ Developer A: Excel/Markdown Export + KB References     │
│              └─ Developer B: Inline Editing + Export UI + KB Options   │
│                                                                          │
│  Week 11:    🧪 TESTING & BUG FIXES                                     │
│              ├─ Developer A: Unit Tests + KB Tests + Optimization      │
│              └─ Developer B: Manual Testing + KB UI Tests + A11y       │
│                                                                          │
│  Week 12:    📚 POLISH & DEPLOYMENT                                     │
│              ├─ Developer A: API Docs + Deployment Guide                │
│              └─ Developer B: User Guide + Demo Video                    │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

🔗 Integration Points: Week 2, 4, 6, 8, 10 (Fridays, 2-4 hours)
```

## Project Goal
Build a workable MVP of an AI-powered test case generator that reduces test case creation time from 15-30 minutes to under 2 minutes.

## Phase 1 Deliverables (Workable Product with KB)
✅ **Complete End-to-End Workflow**:
- Upload PDF/Excel files or enter text input
- **NEW:** Upload Knowledge Base documents (User Guides, Manuals)
- **NEW:** Toggle KB context on/off for generation
- Generate test cases using AI agents (Planner → Generator → Executor) **with KB context**
- Preview and edit generated test cases **with KB references**
- Export to Excel and Markdown formats **with KB citations**

✅ **Core Technical Stack**:
- Frontend: Next.js 14 (App Router) with Tailwind + Shadcn/ui
- Backend: FastAPI (Python) with async LLM integration
- Database: PostgreSQL with SQLAlchemy ORM
- LLM: Ollama (local), OpenRouter, Deepseek, Google Gemini API (cloud)
- **NEW:** Knowledge Base document storage and retrieval

✅ **Minimum Viable Features**:
- File upload (PDF, Excel) with drag-and-drop
- **NEW:** KB document upload (PDF, text) - separate upload zone
- **NEW:** KB document management (list, delete, toggle)
- Text input support
- AI-powered test case generation with progress tracking
- **NEW:** KB-informed agent prompts (specific field names, procedures)
- Preview pane with inline editing
- **NEW:** KB compliance score display
- Export to Excel (.xlsx) and Markdown (.md) **with KB references**
- Configuration management for LLM settings
- **NEW:** KB configuration options (threshold, max docs)

✅ **Expected Quality Improvement**:
- **+40-60% test case quality** with KB enabled
- **+50% field name accuracy** (from KB documentation)
- **+30% cross-system consistency** (from KB procedures)
- **92%+ KB compliance score** target for generated test cases

## Team Allocation
- **Developer A** (Backend Focus): FastAPI, Database, LLM Integration, Document Processing
- **Developer B** (Frontend Focus): Next.js, UI Components, State Management, User Interactions

---

# PROJECT SCOPE & OBJECTIVES

## What's IN SCOPE (Phase 1 MVP)

### Core Functionality
1. **Multi-format Input Processing**
   - PDF file upload and parsing (Jira exports)
   - Excel file upload and parsing (Offer Master files)
   - Text input (direct prompt entry)
   - Batch processing (up to 10 files, 50MB total)

2. **AI Test Case Generation**
   - Planner Agent: Analyzes requirements, identifies test scenarios
   - Generator Agent: Creates detailed test cases in standard format
   - Executor Agent: Validates completeness and consistency
   - Real-time progress tracking with Server-Sent Events (SSE)

3. **LLM Integration**
   - Ollama support (local LLM) with connection testing
   - OpenRouter support (cloud LLM aggregator) with API key authentication
   - Deepseek support (cloud LLM) with API key authentication
   - Google Gemini API support (cloud LLM) with API key authentication
   - Configuration UI (provider, model, temperature, max tokens, API key)
   - Provider abstraction layer for seamless switching
   - Hot-reload configuration (no restart required)

4. **Test Case Management**
   - Preview pane with expandable/collapsible cards
   - Inline editing capability
   - Test case categorization (by team, type, priority)
   - Cross-system validation table display

5. **Export Capabilities**
   - Excel (XLSX) export with formatting
   - Markdown (MD) export for Git version control
   - File download with success notifications

6. **User Interface**
   - Single-screen, full-width layout
   - Drag-and-drop file upload
   - Configuration drawer (slide-in from right)
   - Progress indicators with agent status
   - Responsive design (1280px+ optimal)

### Technical Infrastructure
1. **Frontend Architecture**
   - Next.js 14 with App Router
   - React Server Components + Client Components
   - Zustand for state management
   - Shadcn/ui component library
   - Tailwind CSS for styling

2. **Backend Architecture**
   - FastAPI with async/await
   - SQLAlchemy ORM with Alembic migrations
   - PostgreSQL database (local)
   - Document processing (PyPDF2, openpyxl)
   - LLM integration (httpx for async HTTP)

3. **Database Schema**
   - Projects table
   - Test Cases table (with JSONB fields)
   - Files table
   - Configurations table

## What's OUT OF SCOPE (Phase 2+)

❌ CSV and PDF export - Phase 2  
❌ PowerPoint (PPTX) direct parsing - Phase 2  
❌ User authentication & multi-user support - Phase 2  
❌ Jira API direct integration - Phase 3  
❌ Test case version control - Phase 3  
❌ Custom templates - Phase 3  
❌ Mobile application - Phase 3  
❌ Multi-language support - Phase 3  

---

# TEAM STRUCTURE & RESPONSIBILITIES

## Developer A - Backend Specialist

### Primary Responsibilities
1. **Backend API Development** (FastAPI)
   - API endpoints design and implementation
   - Request/response handling
   - Error handling and validation
   - Background tasks for long-running operations

2. **Database Layer** (PostgreSQL + SQLAlchemy)
   - Database schema design
   - Alembic migrations
   - ORM models (Projects, TestCases, Files, Configurations)
   - Repository pattern implementation

3. **LLM Integration**
   - Ollama client implementation (httpx) - local LLM
   - OpenRouter client implementation - cloud LLM aggregator
   - Deepseek client implementation - cloud LLM
   - Google Gemini API client implementation - cloud LLM
   - Agent architecture (Planner, Generator, Executor)
   - Prompt engineering
   - Provider abstraction layer for seamless switching
   - API key authentication for cloud providers
   - Server-Sent Events (SSE) for progress tracking

4. **Document Processing**
   - PDF parsing (PyPDF2/PyMuPDF)
   - Excel parsing (openpyxl)
   - Text extraction and normalization
   - File validation

5. **Export Services**
   - Excel generation (openpyxl)
   - Markdown generation
   - File formatting and styling

### Tech Stack
- Python 3.13 ✅ **INSTALLED**
- FastAPI 0.109.0 ✅ **INSTALLED**
- SQLAlchemy 2.0.35+ ✅ **INSTALLED** (upgraded for Python 3.13 compatibility)
- PostgreSQL 18 ✅ **INSTALLED** (latest version)
- psycopg2-binary 2.9.11 ✅ **INSTALLED** (database driver)
- httpx (async HTTP client) ✅ **INSTALLED**
- PyPDF2, openpyxl ✅ **INSTALLED**
- pytest (testing) ✅ **INSTALLED**
- Alembic (database migrations) ✅ **CONFIGURED**

### Tools
- Cursor IDE
- GitHub Copilot
- Postman/Thunder Client (API testing)
- pgAdmin (database management)

---

## Developer B - Frontend Specialist

### Primary Responsibilities
1. **Frontend Application** (Next.js 14)
   - App Router setup and page routing
   - Server Components vs Client Components
   - Server Actions for data mutations
   - API integration with FastAPI backend

2. **UI Components** (Shadcn/ui + Tailwind)
   - Component library integration
   - Custom component development
   - Layout components (navigation, sections)
   - Form components (upload, config)

3. **State Management** (Zustand)
   - Global state stores (Generation, Config, TestCase, Export)
   - State persistence
   - Optimistic updates

4. **User Interactions**
   - Drag-and-drop file upload (react-dropzone)
   - Real-time progress display (EventSource/SSE)
   - Inline editing functionality
   - Export workflows

5. **UI/UX Implementation**
   - Responsive design (mobile, tablet, desktop)
   - Accessibility (WCAG 2.1 AA)
   - Keyboard navigation
   - Loading states and animations

### Tech Stack
- Next.js 14.2+
- React 18.3+
- TypeScript 5.3+
- Tailwind CSS 3.4+
- Shadcn/ui
- Zustand 4.5+
- React Hook Form 7.5+
- react-dropzone

### Tools
- Cursor IDE
- GitHub Copilot
- Browser DevTools
- React DevTools

---

# PHASE 1 MVP TIMELINE (12 WEEKS)

## Overview Timeline

```
Week 1-2:  Foundation & Setup
Week 3-4:  Backend Core + Frontend Shell
Week 5-6:  LLM Integration + UI Components
Week 7-8:  Document Processing + State Management
Week 9-10: Export + Inline Editing
Week 11:   Integration Testing & Bug Fixes
Week 12:   Polish, Documentation & Deployment
```

---

## Week 1-2: Foundation & Setup

### Objectives
- Set up development environment
- Initialize monorepo structure
- Establish database schema
- Create basic API and frontend shells

### Developer A Tasks (Backend Foundation + KB Schema)
**Week 1:**
- [x] Set up Python virtual environment ✅ **COMPLETED 11/11/2025**
- [x] Initialize FastAPI project structure ✅ **COMPLETED 11/11/2025**
  ```
  backend/
  ├── app/
  │   ├── api/
  │   ├── models/
  │   ├── schemas/
  │   ├── services/
  │   └── main.py
  ├── alembic/
  ├── tests/
  └── requirements.txt
  ```
- [x] Install dependencies (FastAPI, SQLAlchemy, psycopg2-binary, httpx, PyPDF2, etc.) ✅ **COMPLETED 11/11/2025**
  - **Note:** Using Python 3.13 with SQLAlchemy 2.0.35+ for compatibility
  - **Note:** Using psycopg2-binary instead of psycopg3
- [x] Set up PostgreSQL database (local) ✅ **COMPLETED 11/11/2025**
  - **PostgreSQL 18 installed**
  - **pgAdmin 4 installed separately**
- [x] Create `.env` file with database credentials ✅ **COMPLETED 11/11/2025**

**Week 2:**
- [x] Design database schema (ERD) **including KB table** ✅ **COMPLETED 11/11/2025**
- [x] Create SQLAlchemy models: ✅ **COMPLETED 11/11/2025**
  - `Project` model **with KB flags**
  - `TestCase` model (with JSONB fields)
  - `File` model
  - `Configuration` model **with KB settings**
  - **NEW: `KnowledgeBaseDocument` model**
- [x] Set up Alembic for migrations ✅ **COMPLETED 11/11/2025**
- [x] Create initial migration **with KB table** ✅ **COMPLETED 11/11/2025**
  - Migration ID: 034f2d802362_initial_migration_with_all_tables_and_
- [x] Implement basic API endpoints: ✅ **COMPLETED 11/11/2025**
  - `GET /api/v1/health` (health check)
  - `POST /api/v1/projects` (create project)
  - `GET /api/v1/projects` (list projects)
- [x] Set up CORS middleware ✅ **COMPLETED 11/11/2025**
- [ ] Create test fixtures **including sample KB documents** 🔄 **DEFERRED to Week 3**

**Deliverables:**
- ✅ FastAPI server running on `http://localhost:8000` **COMPLETED 11/11/2025**
- ✅ PostgreSQL database with tables created **(including knowledge_base_documents)** **COMPLETED 11/11/2025**
- ✅ Basic API endpoints functional **COMPLETED 11/11/2025**
- ✅ API documentation at `/docs` (Swagger UI) **COMPLETED 11/11/2025**
- ✅ KB database schema ready for Week 3-4 implementation **COMPLETED 11/11/2025**

**Implementation Notes:**
- **Python 3.13 Compatibility:** Successfully resolved SQLAlchemy compatibility issues by upgrading to 2.0.35+
- **PostgreSQL 18:** Latest version installed; pgAdmin 4 requires separate download
- **Database URL:** Password URL-encoded in .env file (@ symbol as %40)
- **Migration Success:** All 5 tables created successfully (projects, test_cases, files, configurations, knowledge_base_documents)
- **Server Status:** Running successfully with auto-reload enabled

---

### Developer B Tasks (Frontend Foundation)
**Week 1:**
- [ ] Initialize Next.js 14 project with TypeScript
  ```
  npx create-next-app@latest frontend --typescript --tailwind --app
  ```
- [ ] Install Shadcn/ui components
  ```
  npx shadcn@latest init
  ```
- [ ] Set up project structure:
  ```
  frontend/
  ├── app/
  │   ├── page.tsx (main dashboard)
  │   ├── generate/page.tsx
  │   ├── layout.tsx
  │   └── api/ (proxy routes)
  ├── components/
  ├── lib/
  ├── stores/
  └── types/
  ```
- [ ] Configure Tailwind CSS theme (colors, fonts)
- [ ] Set up ESLint and Prettier

**Week 2:**
- [ ] Create basic page layouts:
  - Dashboard page (`/`)
  - Generate page (`/generate`)
  - Layout component with navigation
- [ ] Implement top navigation bar (sticky)
- [ ] Add Shadcn/ui components:
  - Button
  - Card
  - Input
  - Drawer
  - Progress
- [ ] Set up Zustand stores (empty structure):
  - `useGenerationStore`
  - `useConfigStore`
  - `useTestCaseStore`
  - `useExportStore`
- [ ] Create API client utility (`lib/api.ts`)
- [ ] Test API connection to backend health endpoint

**Deliverables:**
- ✅ Next.js app running on `http://localhost:3000`
- ✅ Basic page structure with navigation
- ✅ Shadcn/ui components installed
- ✅ API client connected to backend

---

### Integration Point 1: Week 2 Friday ✅ **COMPLETED 11/11/2025**
**Joint Session (2-3 hours):**
- Review database schema together
- Align API endpoint contracts (request/response formats)
- Discuss data flow (frontend → backend → database)
- Set up shared TypeScript types (export from backend, import in frontend)
- Test end-to-end flow: Frontend calls backend API, backend returns data

**Success Criteria:**
- ✅ Frontend can fetch projects from backend **READY - Backend API functional**
- ✅ Data displays correctly in UI **PENDING - Week 2 Frontend tasks**
- ✅ No CORS errors **COMPLETED - CORS middleware configured**
- ✅ Both developers understand API contracts **READY - API documentation at /docs**

**Status:** Backend portion complete. Ready for frontend integration when Developer B completes Week 1-2 tasks.

---

## Week 3-4: Backend Core + Frontend Shell

### Objectives
- Implement file upload API
- Create document parsing services
- Build drag-and-drop UI
- Implement configuration management

### Developer A Tasks (Backend Core + KB Implementation)
**Week 3:**
- [x] Implement file upload endpoint: ✅ **COMPLETED 11/11/2025**
  - `POST /api/v1/upload` (multipart/form-data)
  - File validation (type, size)
  - Save files to temp storage
  - Store metadata in `files` table
- [x] Create document parsing services: ✅ **COMPLETED 11/11/2025**
  - `PDFParser` class (PyPDF2)
  - `ExcelParser` class (openpyxl)
  - `TextParser` class (basic text handling)
- [x] Extract text from uploaded files ✅ **COMPLETED 11/11/2025**
- [x] Store extracted text in database ✅ **COMPLETED 11/11/2025**
- [x] Return file metadata to frontend ✅ **COMPLETED 11/11/2025**
- **NEW: Implement KB document upload endpoint (4-6 hours)** ✅ **COMPLETED 11/12/2025**
  - [x] `POST /api/v1/knowledge-base` (multipart/form-data) ✅ **COMPLETED 11/12/2025**
  - [x] KB file validation (max 5MB, PDF/text only) ✅ **COMPLETED 11/12/2025**
  - [x] Extract text from KB PDFs (reuse `PDFParser`) ✅ **COMPLETED 11/12/2025**
  - [x] Calculate file hash (SHA-256) for deduplication ✅ **COMPLETED 11/12/2025**
  - [x] Store KB document in `knowledge_base_documents` table ✅ **COMPLETED 11/12/2025**
  - [x] Return KB metadata (docId, name, type, size) ✅ **COMPLETED 11/12/2025**

**Week 4:**
- [x] Implement configuration endpoints: ✅ **COMPLETED 11/12/2025**
  - [x] `POST /api/v1/config` (create configuration) **with KB settings** ✅ **COMPLETED 11/12/2025**
  - [x] `GET /api/v1/config/{config_id}` (get configuration by ID) ✅ **COMPLETED 11/12/2025**
  - [x] `GET /api/v1/config/project/{project_id}` (get configuration by project) ✅ **COMPLETED 11/12/2025**
  - [x] `PATCH /api/v1/config/{config_id}` (update configuration) ✅ **COMPLETED 11/12/2025**
  - [x] `DELETE /api/v1/config/{config_id}` (delete configuration - soft/hard) ✅ **COMPLETED 11/12/2025**
  - [x] `GET /api/v1/config` (list configurations with filters) ✅ **COMPLETED 11/12/2025**
  - [x] `POST /api/v1/config/test-connection` (test LLM connection) ✅ **COMPLETED 11/12/2025**
- [x] Create `ConfigurationService` class with full CRUD operations ✅ **COMPLETED 11/12/2025**
- [x] Implement encryption for API keys (AES-256 via Fernet) ✅ **COMPLETED 11/12/2025**
- [x] Implement API key masking (****last4 format) ✅ **COMPLETED 11/12/2025**
- [x] Add configuration validation (Pydantic schemas) ✅ **COMPLETED 11/12/2025**
- [x] Create `LLMConnectionTester` service (async implementation for all providers) ✅ **COMPLETED 11/12/2025**
  - [x] Test Ollama connection (local LLM) ✅ **COMPLETED 11/12/2025**
  - [x] Test OpenRouter connection (cloud LLM aggregator) ✅ **COMPLETED 11/12/2025**
  - [x] Test Deepseek connection (cloud LLM) ✅ **COMPLETED 11/12/2025**
  - [x] Test Google Gemini connection (cloud LLM) ✅ **COMPLETED 11/12/2025**
  - [x] Connection latency measurement (milliseconds) ✅ **COMPLETED 11/12/2025**
- **NEW: Implement KB management endpoints (2-3 hours)** ✅ **COMPLETED 11/12/2025**
  - [x] `GET /api/v1/knowledge-base` (list KB documents) ✅ **COMPLETED 11/12/2025**
  - [x] `GET /api/v1/knowledge-base/{docId}` (get single KB document) ✅ **COMPLETED 11/12/2025**
  - [x] `PATCH /api/v1/knowledge-base/{docId}` (update KB document) ✅ **COMPLETED 11/12/2025**
  - [x] `DELETE /api/v1/knowledge-base/{docId}` (delete KB document) ✅ **COMPLETED 11/12/2025**
  - [x] KB document listing with filters (category, isActive) ✅ **COMPLETED 11/12/2025**
  - [x] KB document deletion with soft/hard delete options ✅ **COMPLETED 11/12/2025**
  - [x] Tested with deduplication (file hash) ✅ **COMPLETED 11/12/2025**
- [x] Create professional API test suite ✅ **COMPLETED 11/12/2025**
  - [x] Implemented `test_api_config.py` with pytest + requests ✅ **COMPLETED 11/12/2025**
  - [x] 21 comprehensive API tests (all passing) ✅ **COMPLETED 11/12/2025**
  - [x] HTML test reports with pytest-html ✅ **COMPLETED 11/12/2025**
  - [x] Test execution time: ~5 seconds ✅ **COMPLETED 11/12/2025**
  - [x] Verified OpenRouter + Deepseek R1 connection ✅ **COMPLETED 11/12/2025**
- [x] Create testing documentation ✅ **COMPLETED 11/12/2025**
  - [x] `TESTING_GUIDE.md` (API testing best practices) ✅ **COMPLETED 11/12/2025**
  - [x] `WEEK_4_SUMMARY.md` (complete implementation summary) ✅ **COMPLETED 11/12/2025**

**Deliverables:**
- ✅ File upload API working **COMPLETED 11/11/2025**
- ✅ PDF and Excel parsing functional **COMPLETED 11/11/2025**
- ✅ **KB document upload API functional** **COMPLETED 11/12/2025**
- ✅ **KB document management APIs functional (list, get, update, delete)** **COMPLETED 11/12/2025**
- ✅ **KB document storage with deduplication (SHA-256)** **COMPLETED 11/12/2025**
- ✅ Configuration API endpoints ready **with KB settings (7 endpoints total)** **COMPLETED 11/12/2025**
- ✅ **API key encryption/decryption with AES-256 working** **COMPLETED 11/12/2025**
- ✅ **API key masking functional (****last4 format)** **COMPLETED 11/12/2025**
- ✅ **LLM connection testing for 4 providers working** **COMPLETED 11/12/2025**
- ✅ **Professional test suite: 21/21 tests passing** **COMPLETED 11/12/2025**
- ✅ **HTML test reports generated** **COMPLETED 11/12/2025**
- ✅ **Comprehensive testing documentation** **COMPLETED 11/12/2025**
- ✅ **OpenRouter + Deepseek R1 integration verified** **COMPLETED 11/12/2025**
- ✅ **Google Gemini API key configured in .env** **COMPLETED 11/12/2025**
- 🔄 Unit tests for parsers **and KB service** **(Deferred to Week 11)**

**Week 3-4 Backend Status:** ✅ **100% COMPLETE** - All file upload, KB document management, configuration, and testing features implemented and verified.

**Test Results:**
- **Test Suite:** `test_api_config.py`
- **Status:** 21/21 tests passing ✅
- **Duration:** ~5 seconds
- **Coverage:**
  - Health endpoint: 3/3 tests ✅
  - Connection testing: 4/4 tests ✅
  - Configuration CRUD: 10/10 tests ✅
  - Knowledge Base settings: 2/2 tests ✅
  - OpenAPI documentation: 2/2 tests ✅

**Security Features Implemented:**
- ✅ AES-256 API key encryption (Fernet)
- ✅ API key masking in responses (****last4)
- ✅ Secure decryption only for LLM API calls
- ✅ 32-byte encryption key from settings

**LLM Provider Support:**
- ✅ Ollama (local) - connection tester ready
- ✅ OpenRouter (cloud) - verified with Deepseek R1 model
- ✅ Deepseek (cloud) - connection tester ready
- ✅ Google Gemini (cloud) - API key configured, connection tester ready

**Documentation Created:**
- ✅ `backend/TESTING_GUIDE.md` - Best practices for API testing (pytest vs Playwright)
- ✅ `WEEK_4_SUMMARY.md` - Complete Week 4 implementation summary
- ✅ `backend/WEEK_4_CONFIGURATION_SUMMARY.md` - Configuration API documentation
- ✅ Updated Swagger UI with all configuration endpoints

---

### Developer B Tasks (Frontend Shell + KB UI)
**Week 3:**
- [ ] Implement drag-and-drop file upload:
  - Install `react-dropzone`
  - Create `FileUploadZone` component (requirements)
  - Handle file validation (client-side)
  - Display uploaded file list
  - Show file size and type
  - Add remove file functionality
- [ ] Create file upload state management:
  - Update `useGenerationStore` with file actions
  - Handle upload progress
  - Error handling
- [ ] Connect to backend upload API:
  - POST files to `/api/v1/upload`
  - Display success/error messages
  - Update UI with uploaded file metadata
- **NEW: Implement KB document upload UI (2-3 hours)**
  - [ ] Create `KBUploadZone` component (blue theme)
  - [ ] Separate drag-and-drop zone for KB docs
  - [ ] KB file validation (max 5MB, PDF/text)
  - [ ] Create `KBDocumentList` component
  - [ ] Display KB docs with type badges ([system_guide], [process], etc.)
  - [ ] Show document count and total size
  - [ ] Delete button with confirmation for KB docs

**Week 4:**
- [ ] Build configuration drawer:
  - Create `ConfigDrawer` component (Shadcn Sheet)
  - Slide-in from right animation
  - Form fields (provider, model, baseUrl, temperature, maxTokens, apiKey)
  - Radio buttons for provider selection (Ollama/OpenRouter/Deepseek/Gemini)
  - API key input field (for OpenRouter/Deepseek/Gemini)
  - Base URL input (for Ollama custom, OpenRouter, Deepseek)
  - Temperature slider
  - Max tokens input
  - **NEW: Add KB configuration section**
- [ ] Implement configuration state:
  - Update `useConfigStore` **with KB settings**
  - Load config from backend on mount
  - Save config to backend on submit
  - Test connection button
- [ ] Display connection status indicator
- **NEW: Implement KB state management (1-2 hours)**
  - [ ] Create `useKBStore` (Zustand)
  - [ ] KB document list state
  - [ ] KB context toggle state
  - [ ] KB settings (threshold, maxDocs)
  - [ ] Connect KB upload to backend (`POST /api/v1/knowledge-base`)
  - [ ] Connect KB list to backend (`GET /api/v1/knowledge-base`)
  - [ ] Connect KB delete to backend (`DELETE /api/v1/knowledge-base/{docId}`)
  - [ ] Create `KBToggle` component (checkbox: "Use Knowledge Base Context")

**Deliverables:**
- ✅ Drag-and-drop upload working (requirements + KB)
- ✅ Files upload to backend successfully
- ✅ **KB document upload, list, delete working in UI**
- ✅ **KB toggle functional**
- ✅ Configuration drawer functional **with KB settings**
- ✅ Settings persist in backend

---

### Integration Point 2: Week 4 Friday ✅ **BACKEND COMPLETE 11/12/2025**
**Joint Session (2-3 hours):**
- ✅ Test file upload end-to-end (drag file → backend → parse → return) **BACKEND READY**
- ✅ Verify configuration save/load flow **BACKEND READY**
- ✅ Review API response formats **COMPLETE - All 7 config endpoints documented**
- ✅ Discuss error handling strategy **COMPLETE - Comprehensive error handling implemented**
- Plan LLM integration approach (Developer A) and progress UI (Developer B)

**Success Criteria:**
- ✅ Files upload and parse successfully **BACKEND COMPLETE - Tested with KB uploads**
- ✅ Configuration saves and loads correctly **BACKEND COMPLETE - All CRUD operations working**
- ✅ Error messages display in UI **BACKEND READY - Proper HTTP status codes and error responses**
- ✅ Both developers aligned on next phase **READY - Backend fully tested and documented**

**Backend Status:** ✅ **COMPLETE**
- All APIs tested with professional test suite (21/21 passing)
- OpenRouter + Deepseek R1 integration verified
- Google Gemini API key configured
- Comprehensive documentation created
- Ready for frontend integration

**Frontend Status:** 🔄 **PENDING**
- Awaiting Developer B completion of Week 3-4 tasks
- All backend APIs ready for integration
- Swagger UI documentation available at http://127.0.0.1:8000/docs

---

## Week 5-6: LLM Integration + UI Components

### Objectives
- Implement Ollama client and AI agents
- Build generation workflow backend
- Create progress tracking UI
- Implement real-time updates with SSE

### Developer A Tasks (LLM Integration + KB Context)
**Week 5:**
- [ ] Create `LLMService` class:
  - Abstract base class for LLM providers
  - `OllamaClient` implementation (local LLM)
  - `OpenRouterClient` implementation (cloud LLM aggregator)
  - `DeepseekClient` implementation (cloud LLM)
  - `GeminiClient` implementation (Google Gemini API)
  - Async HTTP calls with httpx
  - API key authentication for cloud providers (OpenRouter, Deepseek, Gemini)
  - Error handling and retries
  - Timeout management
  - Provider abstraction layer for seamless switching
- [ ] Implement Planner Agent **with KB integration**:
  - Create `PlannerAgent` class
  - Design prompt template (system + user) **with KB context section**
  - Parse requirements from input text
  - Extract test data (plan codes, charge codes, etc.)
  - **NEW: Extract field names and procedures from KB documents**
  - Map cross-system dependencies
  - Return JSON test plan **with KB references**
- [ ] **NEW: Create `KBContextBuilder` utility (2 hours)**
  - [ ] Build concatenated KB context from selected documents
  - [ ] Limit context length (max 5000 chars for Phase 1)
  - [ ] Format KB content for LLM prompt inclusion
- [ ] Test Planner Agent with sample inputs **and KB documents**
- [ ] Store test plan in database (temporary storage)

**Week 6:**
- [ ] Implement Generator Agent **with KB integration**:
  - Create `GeneratorAgent` class
  - Design prompt template for test case generation **with KB context**
  - Generate test cases from test plan
  - Format to standard template (TC-XXX-001)
  - **NEW: Include KB-sourced menu paths and field names**
  - **NEW: Add KB references to test steps**
  - Create cross-system validation table (JSONB)
- [ ] Implement Executor Agent **with KB validation**:
  - Create `ExecutorAgent` class
  - Validate test case completeness
  - Check cross-system consistency
  - **NEW: Validate against KB-documented procedures**
  - **NEW: Calculate KB compliance score (target: ≥80%)**
  - Refine and improve test cases
- [ ] Create generation orchestration:
  - `GenerationService` class
  - Orchestrate Planner → Generator → Executor flow
  - **NEW: Pass KB context to all agents**
  - Implement background task
  - Store final test cases in database **with KB references**
- [ ] **NEW: Update generation API to accept KB parameters (1 hour)**
  - [ ] Accept `useKnowledgeBase` boolean
  - [ ] Accept `kbDocIds` array (selected KB document IDs)
  - [ ] Fetch KB document content from database
  - [ ] Build KB context and pass to agents

**Deliverables:**
- ✅ Ollama client working (local LLM)
- ✅ OpenRouter client working (cloud LLM aggregator)
- ✅ Deepseek client working (cloud LLM)
- ✅ Google Gemini API client working (cloud LLM)
- ✅ Provider switching functional (Ollama ↔ OpenRouter ↔ Deepseek ↔ Gemini)
- ✅ Three agents implemented and tested **with KB integration**
- ✅ **KB context builder functional**
- ✅ **KB compliance scoring working**
- ✅ Generation workflow functional **with KB-informed test cases**
- ✅ Test cases stored in database **with KB references**

---

### Developer B Tasks (UI Components + KB Indicators)
**Week 5:**
- [ ] Create "Generate" button component:
  - Large, prominent green button
  - Loading state with spinner
  - Disabled state
  - Success animation
  - **NEW: Update to show KB status above button**
- [ ] Implement text input area:
  - Collapsible section below file upload
  - Character counter (max 10,000)
  - Clear button
  - Save draft functionality
- [ ] Create "Generate Test Cases" workflow:
  - Validate inputs (at least one file or text)
  - **NEW: Check KB toggle state**
  - Call backend generation API **with KB parameters**
  - Handle loading state
  - Show progress UI when generation starts
- [ ] **NEW: Update Generate button status indicators (1 hour)**
  - [ ] Display LLM status (Connected/Disconnected, model name)
  - [ ] Display KB status (Enabled/Disabled, doc count, threshold)
  - [ ] Real-time updates when config changes

**Week 6:**
- [ ] Implement progress tracking UI **with KB indicators**:
  - Create `ProgressDisplay` component
  - Progress bar (0-100%)
  - Step indicators (Planner, Generator, Executor)
  - Real-time status messages
  - **NEW: Show KB usage messages (e.g., "Using KB context for specific test steps")**
  - **NEW: Display which KB documents are being referenced**
  - Cancel button
- [ ] Set up Server-Sent Events (SSE):
  - EventSource connection to backend
  - Listen for progress events
  - Update progress state in real-time
  - **NEW: Handle KB-specific progress events**
  - Handle connection errors
  - Close connection on completion
- [ ] Auto-scroll to progress section when generation starts
- [ ] **NEW: Add KB compliance notification (1 hour)**
  - [ ] Show completion message with KB compliance score
  - [ ] Success notification: "✓ Generated 12 test cases | KB Compliance: 92%"

**Deliverables:**
- ✅ Generate button with loading states **and KB status indicators**
- ✅ Text input functional
- ✅ Progress UI displays real-time updates **with KB indicators**
- ✅ **KB compliance score displayed on completion**
- ✅ SSE connection working **with KB events**

---

### Integration Point 3: Week 6 Friday
**Joint Session (3-4 hours):**
- Developer A: Implement SSE endpoint (`/api/v1/generate/{projectId}/stream`)
- Developer B: Connect SSE client to backend endpoint
- Test end-to-end generation flow:
  1. Upload file
  2. Click Generate
  3. Watch progress in real-time
  4. Verify test cases saved to database
- Debug any issues with async operations
- Optimize LLM prompt templates together

**Success Criteria:**
- ✅ Generate button triggers backend generation
- ✅ Progress updates in real-time via SSE
- ✅ Test cases appear in database after generation
- ✅ No blocking operations (async works correctly)

---

## Week 7-8: Document Processing + State Management

### Objectives
- Enhance document parsing for complex files
- Implement test case preview and management
- Build state management for test cases
- Add filtering and sorting

### Developer A Tasks (Enhanced Document Processing)
**Week 7:**
- [ ] Improve PDF parsing:
  - Handle multi-page PDFs (up to 100 pages)
  - Preserve table structures
  - Extract metadata (page numbers, headers)
  - Handle scanned PDFs (warn user if OCR needed)
- [ ] Improve Excel parsing:
  - Handle merged cells
  - Extract formulas (if relevant)
  - Support multiple sheets
  - Validate data types
- [ ] Create batch processing:
  - Process multiple files in sequence
  - Combine extracted text intelligently
  - Handle large file sizes (up to 50MB total)
- [ ] Optimize parsing performance

**Week 8:**
- [ ] Implement test case retrieval endpoints:
  - `GET /api/v1/projects/{projectId}/test-cases` (list all test cases for project)
  - `GET /api/v1/test-cases/{testCaseId}` (get single test case)
  - Query filters (category, priority, system)
  - Pagination support (if >100 test cases)
- [ ] Implement test case update endpoint:
  - `PATCH /api/v1/test-cases/{testCaseId}` (update specific fields)
  - Validation for updated fields
  - Return updated test case
- [ ] Implement test case delete endpoint:
  - `DELETE /api/v1/test-cases/{testCaseId}`
  - Soft delete vs hard delete (decide)

**Deliverables:**
- ✅ Complex PDF and Excel files parse correctly
- ✅ Batch processing works for 10 files
- ✅ Test case CRUD endpoints functional
- ✅ API performance optimized

---

### Developer B Tasks (Test Case Preview & Management + KB Display)
**Week 7:**
- [ ] Create test case preview section **with KB indicators**:
  - Create `TestCaseCard` component
  - Collapsible/expandable design
  - Show header when collapsed (ID, name, category, priority, **KB badge**)
  - Show full details when expanded (objective, preconditions, test data, validation table, **KB references**)
  - **NEW: Add KB badge (✓/✗) to card header**
- [ ] Implement test case list:
  - Fetch test cases from backend
  - Display in card grid/list
  - Collapse all / Expand all buttons
  - Loading states
  - Empty state (no test cases yet)
- [ ] Create cross-system validation table component:
  - Display table in horizontal format
  - Editable cells (inline editing)
  - Color-coded status
- [ ] **NEW: Add KB references display (1-2 hours)**
  - [ ] Create `KBReferencesSection` component
  - [ ] Display list of KB documents used (with section numbers)
  - [ ] Show KB compliance score badge
  - [ ] Format: "📚 KB References: CRM_User_Guide.pdf (Sections 2.21, 2.3)"

**Week 8:**
- [ ] Implement test case state management:
  - Update `useTestCaseStore`
  - Fetch test cases on mount
  - Select/deselect test cases (checkboxes)
  - Track expanded/collapsed state
  - Filter by category, priority, system, **KB status**
  - Sort by ID, priority, category, **KB compliance**
- [ ] Create filter and sort UI:
  - Dropdown filters (category, priority, **KB validated**)
  - Search input (by name or ID)
  - Sort dropdown (ID, priority, category, **KB compliance**)
  - Clear filters button
- [ ] Implement pagination (if needed):
  - Load more button
  - Infinite scroll (optional)
- [ ] **NEW: Add KB filtering (1 hour)**
  - [ ] Filter toggle: "Show only KB-validated test cases"
  - [ ] Sort by KB compliance score (high to low)

**Deliverables:**
- ✅ Test case cards display correctly **with KB badges and references**
- ✅ **KB compliance scores visible**
- ✅ **KB references formatted and clickable (Phase 2)**
- ✅ Expand/collapse works smoothly
- ✅ Filters and sorting functional **including KB filters**
- ✅ State management handles large datasets

---

### Integration Point 4: Week 8 Friday
**Joint Session (2-3 hours):**
- Test full flow: Generate → Preview → Filter → Sort
- Verify data consistency between backend and frontend
- Review performance with 50+ test cases
- Optimize database queries if needed (Developer A)
- Optimize rendering if needed (Developer B)
- Plan inline editing implementation

**Success Criteria:**
- ✅ Test cases load and display correctly
- ✅ Filters and sorting work
- ✅ Performance is acceptable (<1 second to load 100 test cases)
- ✅ No data inconsistencies

---

## Week 9-10: Export + Inline Editing

### Objectives
- Implement Excel and Markdown export
- Add inline editing for test cases
- Build export UI with format selection
- Finalize core MVP features

### Developer A Tasks (Export Services)
**Week 9:**
- [ ] Implement Excel export service:
  - Create `ExcelExporter` class
  - Use openpyxl library
  - Generate XLSX file from test cases
  - Format cells (headers, colors, borders)
  - Include horizontal validation table as separate sheet
  - Apply column widths and row heights
- [ ] Create export endpoint:
  - `POST /api/v1/export`
  - Accept format (excel, markdown)
  - Accept selectedIds (optional)
  - Generate file in memory or temp file
  - Return FileResponse (stream to client)
- [ ] Test Excel export with sample data

**Week 10:**
- [ ] Implement Markdown export service:
  - Create `MarkdownExporter` class
  - Generate .md file from test cases
  - Use hierarchical structure (headers)
  - Code blocks for test data
  - Table of contents with links
  - Support for multiple test cases in one file
- [ ] Optimize export performance (batch processing)
- [ ] Add export logging (track downloads)
- [ ] Test Markdown export with sample data
- [ ] Handle export errors gracefully

**Deliverables:**
- ✅ Excel export working
- ✅ Markdown export working
- ✅ Export endpoint optimized
- ✅ Files download correctly

---

### Developer B Tasks (Inline Editing + Export UI + KB Export Options)
**Week 9:**
- [ ] Implement inline editing:
  - Click on test case field to edit
  - Show input field or textarea
  - Save button (PATCH to backend)
  - Cancel button (revert changes)
  - Loading state during save
  - Success/error notifications
- [ ] Create editable components:
  - `EditableText` component (for short fields)
  - `EditableTextarea` component (for long fields)
  - `EditableTable` component (for validation table)
- [ ] Update test case state after edit:
  - Optimistic updates (update UI immediately)
  - Revert on error
  - Sync with backend response

**Week 10:**
- [ ] Build export section **with KB options**:
  - Create `ExportPanel` component
  - Sticky footer OR scroll-to section
  - Selection checkboxes (All / Selected)
  - Format selection buttons (Excel, Markdown)
  - **NEW: KB export options checkboxes**
  - Download buttons with icons
  - Success notifications
- [ ] Implement export functionality:
  - Call export API **with KB parameters**
  - Trigger browser download
  - Show loading state
  - Handle errors (network, file generation)
- [ ] Add export state management:
  - Update `useExportStore`
  - Track selected test cases
  - Track export status
  - **NEW: Track KB export options (includeKBRefs, includeKBScores)**
- [ ] **NEW: Add KB export options (1 hour)**
  - [ ] Checkbox: "Include KB references in export" (default: checked)
  - [ ] Checkbox: "Include KB compliance scores" (default: unchecked)
  - [ ] Pass options to export API
- [ ] Polish UI (animations, transitions, loading states)

**Deliverables:**
- ✅ Inline editing working
- ✅ Export panel functional **with KB export options**
- ✅ Excel and Markdown downloads work **with optional KB references**
- ✅ **KB references exported as footnotes/citations**
- ✅ UI polished and responsive

---

### Integration Point 5: Week 10 Friday
**Joint Session (3-4 hours):**
- Test complete MVP workflow end-to-end:
  1. Upload files (PDF, Excel)
  2. Configure LLM (Ollama)
  3. Generate test cases
  4. Watch progress
  5. Preview test cases
  6. Edit test cases inline
  7. Filter and sort
  8. Export to Excel and Markdown
- Identify and fix critical bugs
- Test error scenarios (invalid files, LLM timeout, etc.)
- Verify all integration points work smoothly

**Success Criteria:**
- ✅ MVP workflow is complete and functional
- ✅ No critical bugs
- ✅ Performance is acceptable
- ✅ Ready for testing phase

---

## Week 11: Integration Testing & Bug Fixes

### Objectives
- Comprehensive testing of all features
- Bug fixes and stability improvements
- Performance optimization
- Edge case handling

### Developer A Tasks (Backend Testing & Optimization + KB Tests)
- [ ] Write unit tests:
  - Document parsers (PDF, Excel)
  - AI agents (Planner, Generator, Executor)
  - Export services
  - **NEW: KB document upload, listing, deletion**
  - **NEW: KB context builder**
  - **NEW: KB compliance scorer**
  - Target: 70% code coverage
- [ ] Write integration tests:
  - API endpoints (upload, generate, export)
  - Database operations
  - LLM integration (mock responses)
  - **NEW: KB document upload → generation with KB → export with KB refs**
  - **NEW: KB context passing to agents**
- [ ] **NEW: KB-specific tests (2-3 hours)**
  - [ ] Test KB document deduplication (file hash)
  - [ ] Test KB context truncation (max 5000 chars)
  - [ ] Test generation with KB vs without KB
  - [ ] Test KB compliance scoring (target ≥80%)
  - [ ] Test with sample KB documents (CRM Guide, Case Mgmt Guide)
- [ ] Performance optimization:
  - Optimize database queries (add indexes if needed)
  - Optimize LLM prompts (reduce tokens)
  - Cache common configurations
  - **NEW: Optimize KB context retrieval (in-memory cache)**
- [ ] Error handling review:
  - Add try-catch blocks
  - Improve error messages
  - Log errors appropriately
  - **NEW: Handle KB document parse failures gracefully**
- [ ] Fix bugs identified during testing
- [ ] Code review and refactoring

### Developer B Tasks (Frontend Testing & Polishing + KB UI Tests)
- [ ] Manual testing:
  - Test all user flows **including KB upload → generation → preview**
  - Test edge cases (empty states, errors)
  - Test responsiveness (different screen sizes)
  - Test keyboard navigation
  - **NEW: Test KB toggle on/off behavior**
  - **NEW: Test KB document list display**
- [ ] Accessibility testing:
  - Run Axe DevTools
  - Fix accessibility issues
  - Ensure WCAG 2.1 AA compliance
  - **NEW: Test KB section accessibility (screen reader, keyboard)**
- [ ] Performance optimization:
  - Optimize re-renders (React.memo, useMemo)
  - Lazy load components
  - Optimize images
  - Code splitting
- [ ] UI polishing:
  - Fix alignment issues
  - Improve spacing and typography
  - Add animations and transitions
  - Improve error messages
  - **NEW: Polish KB zone styling (blue theme)**
  - **NEW: Polish KB badges and references display**
- [ ] **NEW: KB UI tests (1-2 hours)**
  - [ ] Test KB upload drag-and-drop
  - [ ] Test KB document deletion with confirmation
  - [ ] Test KB toggle persistence across sessions
  - [ ] Test KB status indicators update in real-time
  - [ ] Test KB compliance score display
  - [ ] Test KB export options checkboxes
- [ ] Fix bugs identified during testing
- [ ] Code review and refactoring

### Joint Tasks (Both Developers)
- [ ] End-to-end testing **with KB feature**:
  - Test complete workflow multiple times
  - Test with real Jira PDFs and Offer Master files
  - **NEW: Test with sample KB documents (CRM Guide, Case Mgmt Guide, Backend Guide)**
  - **NEW: Test generation with KB enabled vs disabled (compare quality)**
  - **NEW: Test KB compliance scoring (verify ≥80% target)**
  - Test with different LLM models (if available)
  - Test export with large datasets (50+ test cases) **with KB references**
- [ ] Cross-browser testing:
  - Chrome, Firefox, Edge, Safari
  - Fix browser-specific issues
  - **NEW: Test KB upload across browsers**
- [ ] Performance testing:
  - Measure generation time (target <2 minutes) **with and without KB**
  - **NEW: Measure KB document upload time (target 1-2 seconds)**
  - **NEW: Verify KB retrieval performance (<100ms)**
  - Measure export time (target <5 seconds)
  - Measure page load time (target <3 seconds)
- [ ] **NEW: KB feature validation (2-3 hours)**
  - [ ] Verify +40-60% quality improvement with KB
  - [ ] Test KB deduplication (upload same file twice)
  - [ ] Verify field name accuracy improves with KB
  - [ ] Verify cross-system consistency improves with KB
  - [ ] Test KB compliance scoring accuracy
- [ ] Create bug list and prioritize fixes
- [ ] Fix high-priority bugs together

**Deliverables:**
- ✅ All critical bugs fixed
- ✅ Test coverage ≥70%
- ✅ **KB feature fully functional and tested**
- ✅ **KB compliance scoring working (≥80% target)**
- ✅ **Sample KB documents provided for testing**
- ✅ Performance targets met
- ✅ Accessibility compliance
- ✅ Ready for deployment

---

## Week 12: Polish, Documentation & Deployment

### Objectives
- Finalize documentation
- Prepare deployment setup
- Create demo materials
- Final polish and review

### Developer A Tasks (Backend Documentation & Deployment)
- [ ] Write API documentation:
  - Update Swagger/OpenAPI documentation
  - Add endpoint descriptions and examples
  - Document request/response schemas
- [ ] Write deployment guide:
  - Setup instructions for PostgreSQL
  - Environment variables documentation
  - Ollama installation guide
  - Backend deployment steps
- [ ] Create Docker setup (optional):
  - Dockerfile for FastAPI backend
  - docker-compose.yml for backend + database
- [ ] Prepare production configuration:
  - Environment-specific settings
  - Database migration scripts
  - Backup strategy
- [ ] Write README for backend:
  - Installation instructions
  - Development setup
  - Testing instructions
  - Troubleshooting guide

### Developer B Tasks (Frontend Documentation & Deployment)
- [ ] Write user guide:
  - How to upload files
  - How to configure LLM
  - How to generate test cases
  - How to edit and export
  - FAQ section
- [ ] Create demo video:
  - Screen recording of complete workflow
  - Narration or captions
  - Highlight key features
  - 3-5 minutes duration
- [ ] Write deployment guide:
  - Build instructions
  - Environment variables
  - Frontend deployment steps (Vercel/Netlify)
- [ ] Prepare production build:
  - Optimize build configuration
  - Test production build locally
  - Ensure environment variables work
- [ ] Write README for frontend:
  - Installation instructions
  - Development setup
  - Component documentation
  - Troubleshooting guide

### Joint Tasks (Both Developers)
- [ ] Final polish:
  - UI/UX final review
  - Fix minor visual issues
  - Ensure consistent styling
  - Add loading states to all async operations
- [ ] Create project README:
  - Project overview
  - Tech stack
  - Architecture diagram
  - Setup instructions
  - Usage guide
- [ ] Prepare handover documentation:
  - Code structure overview
  - Key design decisions
  - Known limitations
  - Future enhancement ideas
- [ ] Demo preparation:
  - Prepare sample files for demo
  - Rehearse demo workflow
  - Prepare Q&A answers
- [ ] Final deployment:
  - Deploy backend to local server or cloud
  - Deploy frontend to Vercel/Netlify
  - Test deployed application
  - Share access with stakeholders

**Deliverables:**
- ✅ Complete documentation (API, user guide, deployment)
- ✅ Demo video ready
- ✅ Application deployed and accessible
- ✅ Handover materials complete
- ✅ MVP ready for use

---

# WORK SPLIT STRATEGY

## Parallel Work Streams

### Stream 1: Backend (Developer A)
```
Week 1-2:   Database + Basic API
Week 3-4:   File Upload + Document Parsing + Configuration API
Week 5-6:   LLM Integration + AI Agents + Generation Workflow
Week 7-8:   Enhanced Parsing + Test Case CRUD APIs
Week 9-10:  Export Services (Excel, Markdown)
Week 11:    Backend Testing + Bug Fixes
Week 12:    Documentation + Deployment
```

### Stream 2: Frontend (Developer B)
```
Week 1-2:   Next.js Setup + UI Shell + State Management
Week 3-4:   Drag-Drop Upload + KB Upload UI + Configuration Drawer
Week 5-6:   Generate Button + Progress UI + KB Indicators + SSE Integration
Week 7-8:   Test Case Preview + KB Display + Filters + Sorting
Week 9-10:  Inline Editing + Export UI + KB Export Options
Week 11:    Frontend Testing + KB UI Tests + Polishing
Week 12:    User Guide + Demo Video + Deployment
```

---

## 🎯 Weekly Goals Summary (Quick Reference for AI)

| Week | Developer A (Backend) | Developer B (Frontend) | Integration |
|------|----------------------|------------------------|-------------|
| 1-2 | ✅ Database + Basic API + KB Schema **COMPLETED 11/11/2025** | Next.js Setup + UI Shell | ✅ Week 2 Friday **Backend Ready** |
| 3-4 | File Upload + KB Upload + Parsing | Drag-Drop + KB UI + Config Drawer | ✅ Week 4 Friday |
| 5-6 | LLM (Ollama/OpenRouter/Deepseek) + AI Agents + KB Context | Generate Button + Progress + KB Indicators | ✅ Week 6 Friday |
| 7-8 | Enhanced Parsing + CRUD APIs | Preview Cards + KB Display + Filters | ✅ Week 8 Friday |
| 9-10 | Export Services (Excel/MD) + KB Refs | Inline Edit + Export UI + KB Options | ✅ Week 10 Friday |
| 11 | Testing + KB Tests + Optimization | Testing + KB UI Tests + Polishing | Joint Testing |
| 12 | Documentation + Deploy | User Guide + Demo Video | Joint Deployment |

**AI Agent Note:** Each week's tasks include specific acceptance criteria detailed in the weekly breakdown sections below.

**Week 1-2 Status:** ✅ Developer A tasks complete. FastAPI server running at http://localhost:8000 with all 5 database tables created.

## Communication & Coordination

### Daily Standups (15 minutes, Async or Quick Call)

**Format:** Slack/Discord message or Quick Video Call

**Template:**
- **What did you complete yesterday?**
- **What are you working on today?**
- **Any blockers or questions?**

**AI Agent Context:** When reporting progress, include which files were modified and acceptance criteria met.

---

### Integration Sessions (Every 2 Weeks - Friday Afternoon)

**Schedule:** Week 2, 4, 6, 8, 10 (2-4 hours each)

**Agenda Format:**

1. **Review Progress (30 min)**
   - Developer A demos backend progress
   - Developer B demos frontend progress
   - Discuss challenges and learnings

2. **Test Integration (60 min)**
   - Connect frontend to backend
   - Test new features end-to-end
   - Debug issues together
   - Fix API contract mismatches

3. **Plan Next Sprint (30 min)**
   - Discuss next 2 weeks' tasks
   - Clarify dependencies
   - Agree on API contracts
   - Schedule any ad-hoc meetings if needed

**AI Agent Note:** Before integration sessions, ensure all acceptance criteria from previous 2 weeks are verified.

---

### Code Reviews (Ongoing)

- Developer A reviews Developer B's pull requests
- Developer B reviews Developer A's pull requests
- Use GitHub Pull Requests

**Focus Areas:**
  - Code quality and best practices
  - Integration impacts
  - Performance considerations
  - Security (API keys, data validation)
  - Test coverage
  - **AI-Generated Code Review:** Ask Cursor to review against acceptance criteria

**AI Prompt for Code Review:**
```
@PROJECT_MANAGEMENT_PLAN.md Review this PR against Week X acceptance criteria.
Check for: completeness, error handling, tests, and integration points.
```

---

### Blockers & Escalation

#### Immediate Blockers (Resolve Same Day)
- Cannot connect frontend to backend → Check CORS, API endpoint, network
- API returns error → Check backend logs, request format
- Component not rendering → Check React DevTools, console errors
- **AI Help:** Ask Cursor to debug with full error context

#### Daily Blockers (Resolve Within 1 Day)
- Unclear API contract → Schedule quick call to discuss
- UI/UX question → Share screenshot, discuss approach
- Library issue → Research together, find alternative
- **AI Help:** Ask Cursor for alternative approaches

#### Major Blockers (Escalate to Product Owner)
- LLM integration not working after 2 days → Consider mock responses or simpler approach
- Performance targets not met → Discuss scope reduction or timeline extension
- One developer unavailable >2 days → Reassign critical tasks

**Escalation Path:**
1. AI agents attempt resolution (same day)
2. Human developers troubleshoot together (1 day)
3. Escalate to Product Owner (if blocker >1 day)
4. Escalate to QA Lead (if scope/requirements issue)
5. Escalate to IT Lead (if infrastructure issue)

---

### Shared Resources

- **Shared TypeScript Types**: Export from backend, import in frontend
- **API Contracts**: Document in Notion/Confluence or this document
- **Postman Collection**: Share API endpoints for testing
- **Figma/Wireframes**: Reference UI designs
- **AI Context Files**: All specifications in this document

---

# INTEGRATION POINTS & MILESTONES

## Integration Point 1: Week 2 Friday
**Focus:** API Contracts & Data Flow
- Review database schema
- Align API endpoint contracts
- Test basic API calls (frontend → backend)
- Resolve CORS issues
- Set up shared TypeScript types

**Duration:** 2-3 hours

**Success Criteria:**
- Frontend can fetch data from backend
- No CORS errors
- Both developers understand API contracts

---

## Integration Point 2: Week 4 Friday
**Focus:** File Upload & Configuration
- Test file upload end-to-end
- Verify configuration save/load
- Review error handling
- Plan LLM integration approach

**Duration:** 2-3 hours

**Success Criteria:**
- Files upload and parse successfully
- Configuration persists correctly
- Error messages display in UI

---

## Integration Point 3: Week 6 Friday
**Focus:** LLM Integration & Real-Time Progress
- Implement SSE endpoint (Developer A)
- Connect SSE client (Developer B)
- Test generation workflow end-to-end
- Optimize LLM prompts

**Duration:** 3-4 hours

**Success Criteria:**
- Generate button triggers backend generation
- Progress updates in real-time
- Test cases saved to database

---

## Integration Point 4: Week 8 Friday
**Focus:** Test Case Preview & Management
- Test generate → preview → filter → sort flow
- Verify data consistency
- Review performance
- Plan inline editing

**Duration:** 2-3 hours

**Success Criteria:**
- Test cases load and display correctly
- Filters and sorting work
- Performance is acceptable

---

## Integration Point 5: Week 10 Friday
**Focus:** Complete MVP Workflow
- Test end-to-end workflow (upload → generate → edit → export)
- Fix critical bugs
- Verify all features work together

**Duration:** 3-4 hours

**Success Criteria:**
- Complete workflow functional
- No critical bugs
- Ready for testing phase

---

# RISK MANAGEMENT

## Technical Risks

### Risk 1: LLM Integration Complexity
**Impact:** High | **Probability:** Medium

**Risk:**
- Ollama setup issues
- Slow LLM response times
- Prompt engineering challenges
- LLM output parsing errors

**Mitigation:**
- Start LLM integration early (Week 5)
- Use mock LLM responses for testing
- Create robust prompt templates
- Implement retry logic and timeouts
- Developer A to research Ollama best practices

**Contingency:**
- Use pre-defined test case templates as fallback
- Simplify agent architecture if needed

---

### Risk 2: Document Parsing Accuracy
**Impact:** High | **Probability:** Medium

**Risk:**
- Complex PDFs not parsing correctly
- Table structures lost in extraction
- Excel files with merged cells
- Large files causing timeouts

**Mitigation:**
- Test with real Jira PDFs early (Week 3)
- Use PyMuPDF as fallback if PyPDF2 fails
- Implement robust error handling
- Limit file sizes (50MB total)

**Contingency:**
- Provide text input as alternative
- Manual copy-paste from documents

---

### Risk 3: Performance Issues
**Impact:** Medium | **Probability:** Medium

**Risk:**
- Slow generation times (>2 minutes)
- UI freezing during operations
- Large datasets slow to render

**Mitigation:**
- Use async operations (FastAPI + Next.js)
- Implement background tasks
- Optimize database queries (indexes)
- Use React virtualization for large lists

**Contingency:**
- Reduce LLM max tokens
- Implement pagination

---

### Risk 4: Integration Issues Between Frontend & Backend
**Impact:** High | **Probability:** Low

**Risk:**
- API contract mismatches
- Data format inconsistencies
- CORS issues
- Authentication issues (future)

**Mitigation:**
- Define API contracts early (Week 2)
- Use TypeScript for type safety
- Regular integration sessions (every 2 weeks)
- Share Postman collection

**Contingency:**
- Daily communication on Slack
- Quick video calls to resolve blockers

---

## Project Management Risks

### Risk 5: Developer Availability
**Impact:** High | **Probability:** Low

**Risk:**
- One developer unavailable (sick, emergency)
- Time off during critical phase

**Mitigation:**
- Cross-training during integration sessions
- Document key decisions and code
- Use Git branching strategy
- Regular code reviews

**Contingency:**
- Other developer can pick up critical tasks
- Extend timeline by 1-2 weeks if needed

---

### Risk 6: Scope Creep
**Impact:** Medium | **Probability:** Medium

**Risk:**
- Stakeholders request additional features
- Perfectionism delays MVP delivery

**Mitigation:**
- Strictly follow Phase 1 scope (MVP only)
- Document Phase 2 features in backlog
- Set clear expectations with stakeholders
- Focus on "workable product" not "perfect product"

**Contingency:**
- Politely defer non-critical features to Phase 2
- Prioritize core workflow completion

---

### Risk 7: Learning Curve for New Technologies
**Impact:** Medium | **Probability:** Medium

**Risk:**
- Unfamiliarity with Next.js App Router
- FastAPI async operations complexity
- Ollama integration learning curve

**Mitigation:**
- Use Cursor AI and GitHub Copilot for assistance
- Allocate time for research and experimentation
- Share learnings during integration sessions
- Ask for help early (Slack, Stack Overflow)

**Contingency:**
- Use simpler alternatives if needed (e.g., REST instead of SSE)
- Extend timeline by 1 week if major blockers

---

# SUCCESS CRITERIA

## Phase 1 MVP Success Criteria (Week 12 Completion)

### Functional Completeness
✅ **Input Processing**
- Upload and parse PDF files (Jira exports)
- Upload and parse Excel files (Offer Master)
- Enter text input directly
- Batch processing (up to 10 files)
- **NEW: Upload and parse KB documents (PDF, text)**
- **NEW: KB document management (list, delete, deduplication)**

✅ **AI Generation**
- Three agents working (Planner, Generator, Executor)
- **NEW: All agents enhanced with KB context integration**
- Generate test cases in standard format
- **NEW: Generate with KB-informed field names and procedures**
- Real-time progress tracking **with KB indicators**
- **NEW: KB compliance scoring (≥80% target)**
- Cancel generation option

✅ **LLM Integration**
- Ollama connection working (local LLM)
- OpenRouter connection working (cloud LLM aggregator)
- Deepseek connection working (cloud LLM)
- Google Gemini API connection working (cloud LLM)
- Provider switching functional (Ollama ↔ OpenRouter ↔ Deepseek ↔ Gemini)
- Configuration UI functional with provider selection
- **NEW: KB configuration options (threshold, max docs)**
- Hot-reload configuration (no restart)
- Test connection feature for all providers
- **NEW: KB context toggle on/off**

✅ **Test Case Management**
- Preview test cases in cards
- **NEW: KB badges on test case cards (✓/✗)**
- Expand/collapse functionality
- Filter by category, priority, **KB validation status**
- Sort by ID, priority, **KB compliance score**
- Search by name or ID
- **NEW: KB references section in test case details**

✅ **Inline Editing**
- Edit any field inline
- Save changes to backend
- Optimistic updates
- Error handling

✅ **Export**
- Export to Excel (.xlsx) **with optional KB references**
- Export to Markdown (.md) **with optional KB references**
- Select all or selected only
- **NEW: KB export options (include refs, include scores)**
- Download files successfully

✅ **UI/UX**
- Single-screen, full-width layout
- Drag-and-drop file upload (requirements + KB)
- **NEW: Separate KB upload zone (blue theme)**
- Configuration drawer **with KB settings**
- Progress indicators **with KB usage display**
- **NEW: KB status indicators**
- Responsive design (1280px+)
- Accessible (WCAG 2.1 AA)

✅ **Knowledge Base Feature (NEW)**
- KB document upload and storage
- KB document listing with type badges
- KB context toggle (enable/disable)
- KB-informed agent prompts
- KB compliance scoring
- KB references in test case output
- KB export options

---

### Performance Metrics
✅ **Generation Time**
- Target: <2 minutes for single file (up to 20 pages)
- **NEW: <2 minutes with KB enabled (no degradation)**
- Batch: <30 seconds per file average
- Measured: Week 11 performance testing

✅ **KB Performance** (NEW)
- KB document upload: 1-2 seconds (including parsing)
- KB document parsing: 1-2 seconds per document
- KB retrieval for context: <100ms (in-memory cache)
- Performance impact: <10% overhead with KB
- Measured: Week 11 KB-specific testing

✅ **UI Responsiveness**
- Page load: <3 seconds
- Button clicks: <100ms response
- Export: <5 seconds for 100 test cases
- **NEW: KB status indicators update <100ms**
- Measured: Week 11 performance testing

✅ **Test Quality**
- 95% of generated test cases acceptable with minimal edits
- **NEW: +40-60% quality improvement with KB enabled**
- **NEW: +50% field name accuracy (from KB documentation)**
- **NEW: +30% cross-system consistency (from KB procedures)**
- **NEW: KB compliance score ≥80% for KB-validated test cases**
- Measured: Week 11 UAT with QA team

---

### Technical Quality
✅ **Code Quality**
- Unit test coverage ≥70%
- No critical bugs
- Code follows best practices
- Proper error handling

✅ **Documentation**
- API documentation (Swagger)
- User guide
- Deployment guide
- README files

✅ **Deployment**
- Backend deployed and accessible
- Frontend deployed and accessible
- Database migrations working
- Environment variables configured

---

### User Acceptance
✅ **Usability**
- QA Engineers can use without training
- Complete workflow takes <5 minutes (upload → generate → export)
- Error messages are clear and actionable

✅ **Demo**
- Demo video created (3-5 minutes)
- Stakeholders see working MVP
- Positive feedback from QA team

---

## Phase 1 Go-Live Checklist

### Week 12 Friday: MVP Launch
- [ ] All features functional
- [ ] All critical bugs fixed
- [ ] Performance targets met
- [ ] Documentation complete
- [ ] Demo video ready
- [ ] Deployed to production/staging environment
- [ ] User guide shared with QA team
- [ ] Training session scheduled (Week 13)
- [ ] Feedback collection plan in place
- [ ] Phase 2 backlog prioritized

---

# PHASE 2 PLANNING (Months 4-6)

## Out of Scope for Phase 1, In Scope for Phase 2

### Features
- CSV and PDF export
- PowerPoint (PPTX) direct parsing
- Advanced configuration (custom models, fine-tuning)
- Batch processing UI improvements
- Performance optimization
- Regenerate single test case
- Duplicate test case

### Infrastructure
- User authentication (JWT)
- Multi-user support
- Role-based access control (Admin, QA Lead, QA Engineer)
- Redis caching
- Celery for background tasks
- Docker containerization (production)
- CI/CD pipeline

### Timeline
- Phase 2 start: Week 13 (Month 4)
- Phase 2 end: Week 24 (Month 6)
- Duration: 12 weeks

---

# AI DEVELOPMENT BEST PRACTICES

## Effective AI Prompts for Implementation

### Good Prompts (Comprehensive Context)

**Example 1: Backend Task**
```
@PROJECT_MANAGEMENT_PLAN.md Implement Week 5 Backend Task: OpenRouter client.

Requirements:
- Create OpenRouterClient class inheriting from LLMService
- Location: backend/app/services/llm/openrouter_client.py
- Include async HTTP calls using httpx
- Add API key authentication via headers
- Implement proper error handling for: invalid API key, rate limits, timeouts
- Write unit tests with mocked responses
- Follow acceptance criteria in Week 5 section
```

**Example 2: Frontend Task**
```
@PROJECT_MANAGEMENT_PLAN.md Implement Week 4 Frontend Task: Configuration drawer with multi-provider support.

Requirements:
- Create ConfigDrawer component using Shadcn Sheet
- Radio buttons for Ollama/OpenRouter/Deepseek selection
- Conditional API key input (show only for cloud providers)
- Form validation and state management with Zustand
- Test connection button
- Follow UI design specifications in Week 4 section
```

### Bad Prompts (Missing Context)

❌ "Create OpenRouter client" - Too vague, missing context
❌ "Add configuration UI" - Doesn't reference specifications
❌ "Fix the bug" - No error details or context

---

## Tips for Success with AI Agent Development

### 1. Communicate Early & Often
- Don't wait for integration sessions to ask questions
- Share progress daily with file paths and acceptance criteria met
- Use AI to generate status updates

### 2. Use AI Tools Effectively
- **Cursor IDE:** For AI-powered code completion and generation
- **GitHub Copilot:** For AI pair programming
- **Leverage for:** Boilerplate code, API endpoints, components, tests, documentation

**AI Prompt Templates:**
- Generate: `@PROJECT_MANAGEMENT_PLAN.md Generate [component] with [requirements]`
- Review: `@PROJECT_MANAGEMENT_PLAN.md Review [code] against [criteria]`
- Debug: `@PROJECT_MANAGEMENT_PLAN.md Debug [error] in [context]`
- Test: `@PROJECT_MANAGEMENT_PLAN.md Write tests for [component] covering [scenarios]`

### 3. Test Integration Points Immediately
- Don't assume APIs work, test them immediately after implementation
- Use AI to generate integration tests
- Verify against success criteria before moving to next task

### 4. Document Decisions
- Keep a shared doc of key decisions and why
- AI can help generate documentation
- Update this plan if implementation differs significantly

### 5. Focus on MVP
- Resist perfectionism - ship a workable product first
- Defer non-critical features to Phase 2
- Use AI to identify what's "good enough" vs "perfect"

### 6. Leverage AI for Code Reviews
```
@PROJECT_MANAGEMENT_PLAN.md Review this implementation:
[paste code]

Check against Week X acceptance criteria:
- Completeness
- Error handling
- Tests
- Performance
- Security
```

---

## AI Agent Workflow Pattern

### For Each Task:

1. **Read Context**
   ```
   @PROJECT_MANAGEMENT_PLAN.md Show Week X [Developer A/B] tasks
   ```

2. **Understand Requirements**
   - Read full task description
   - Check dependencies
   - Review acceptance criteria
   - Note integration points

3. **Implement**
   ```
   @PROJECT_MANAGEMENT_PLAN.md Implement [specific task] following Week X specifications
   ```

4. **Test**
   ```
   @PROJECT_MANAGEMENT_PLAN.md Write tests for [task] covering acceptance criteria
   ```

5. **Review**
   ```
   @PROJECT_MANAGEMENT_PLAN.md Review implementation against Week X acceptance criteria
   ```

6. **Document**
   - Update acceptance criteria checkboxes
   - Note any deviations or decisions
   - Prepare for integration session

---

## Common AI Agent Pitfalls to Avoid

### ❌ Don't Do This:

1. **Implementing without context**
   - Bad: "Create a config page"
   - Good: "@PROJECT_MANAGEMENT_PLAN.md Implement Week 4 config drawer per specifications"

2. **Ignoring dependencies**
   - Always check "Depends on" in task descriptions
   - Verify prerequisite tasks are complete

3. **Skipping acceptance criteria**
   - Every task has specific acceptance criteria
   - AI should verify each criterion is met

4. **Not testing integrations**
   - Always test API endpoints immediately
   - Don't wait for integration sessions

5. **Forgetting error handling**
   - Every task specifies error scenarios
   - AI should implement comprehensive error handling

### ✅ Do This Instead:

1. Reference full context in every prompt
2. Check dependencies before starting
3. Implement all acceptance criteria
4. Test immediately after implementation
5. Include error handling and edge cases
6. Write tests as specified
7. Review against success criteria

---

# APPENDIX

## Tools & Resources

### Development Tools
- **Cursor IDE**: AI-powered code editor
- **GitHub Copilot**: AI pair programmer
- **Git**: Version control
- **GitHub**: Code hosting and collaboration
- **Postman/Thunder Client**: API testing
- **pgAdmin**: Database management

### Communication Tools
- **Slack/Discord**: Daily communication
- **Zoom/Google Meet**: Video calls for integration sessions
- **Notion/Confluence**: Documentation and planning

### Project Management
- **GitHub Projects**: Kanban board for tasks
- **Linear/Jira**: Issue tracking (optional)
- **Google Calendar**: Schedule integration sessions

---

## Contact & Escalation

### Project Stakeholders
- **Product Owner**: [Name/Email]
- **QA Lead**: [Name/Email]
- **IT Lead**: [Name/Email]

### Developer Team
- **Developer A** (Backend): [Name/Email]
- **Developer B** (Frontend): [Name/Email]

### Escalation Path
1. Developers resolve among themselves (daily)
2. Escalate to Product Owner (if blocker >1 day)
3. Escalate to QA Lead (if scope/requirements issue)
4. Escalate to IT Lead (if infrastructure issue)

---

## Change Request Process

If scope changes are requested:
1. Document change request (what, why, impact)
2. Estimate effort (hours, days)
3. Assess impact on timeline
4. Get approval from Product Owner
5. Update project plan
6. Communicate to stakeholders

**Note:** Phase 1 MVP scope is locked. New features go to Phase 2 backlog.

---

**END OF PROJECT MANAGEMENT PLAN v1.0**

**Next Steps:**
1. Review this plan with both developers (Week 1 Monday)
2. Set up development environments (Week 1 Days 1-2)
3. Create GitHub repository and project board (Week 1 Day 1)
4. Schedule first integration session (Week 2 Friday)
5. Begin Sprint 1 (Week 1-2) tasks

**Questions or Clarifications:**
Contact Product Owner or schedule kickoff meeting.

---

---

# 📚 KNOWLEDGE BASE FEATURE SUMMARY

The Knowledge Base (KB) feature has been integrated into Phase 1 MVP to improve test case quality by 40-60%. This section summarizes the KB-related tasks distributed across the 12-week timeline.

## What is the KB Feature?

Allows QA Engineers to upload system documentation (User Guides, Operational Manuals, Process Documentation) that AI agents reference during test case generation, resulting in:
- **Exact field names** from documentation
- **Specific menu paths** (e.g., "Home → Subscription Preview → Dashboard")
- **Business validation rules** from procedures
- **+40-60% quality improvement**

---

## Developer A: KB Backend Tasks (~9-11 hours total)

### Week 2: KB Database Schema (1 hour)
- Add `knowledge_base_documents` table with fields:
  - `id`, `name`, `type`, `size`, `content_text`, `file_hash`, `uploaded_at`, `is_active`
- Update `projects` table: add `use_kb`, `kb_doc_ids`
- Update `configurations` table: add `kb_threshold`, `kb_max_docs`

### Week 3: KB Upload API (4-6 hours)
- Create `POST /api/v1/knowledge-base` endpoint
- PDF/text extraction using PyPDF2
- File hash deduplication (SHA-256)
- Store KB document with metadata
- Return `docId`, `name`, `type`, `size`

### Week 4: KB Management APIs (2-3 hours)
- `GET /api/v1/knowledge-base` (list documents with filters)
- `DELETE /api/v1/knowledge-base/{docId}` (delete document)
- Create `KBService` class with methods:
  - `upload_document()`, `list_documents()`, `delete_document()`, `get_content()`

### Week 5: KB Context Builder (2 hours)
- Create `KBContextBuilder` utility class
- Build concatenated KB context from selected documents
- Limit context length (max 5000 chars Phase 1)
- Integrate KB context into Planner Agent prompt

### Week 6: KB Compliance Scoring (1 hour)
- Enhance Generator Agent with KB field name extraction
- Enhance Executor Agent with KB compliance validation
- Calculate KB compliance score (target ≥80%)
- Update `POST /api/v1/generate` to accept `useKnowledgeBase` and `kbDocIds`

### Week 11: KB Testing (2-3 hours)
- Unit tests for KB upload, deduplication, context building
- Integration tests for KB-enabled generation flow
- Test with sample KB documents (CRM Guide, Case Mgmt Guide, Backend Guide)
- Verify KB compliance scoring accuracy

**Total Backend Hours:** ~9-11 hours

---

## Developer B: KB Frontend Tasks (~7-9 hours total)

### Week 3: KB Upload UI (2-3 hours)
- Create `KBUploadZone` component with blue theme (distinct from requirements upload)
- Separate drag-and-drop zone for KB docs
- Create `KBDocumentList` component with type badges `[system_guide]`, `[process]`, etc.
- Display document count and total size

### Week 4: KB State Management (1-2 hours)
- Create `useKBStore` (Zustand) with state:
  - `kbDocuments[]`, `useKB`, `kbThreshold`, `kbMaxDocs`
- Connect KB APIs (upload, list, delete)
- Create `KBToggle` component (checkbox: "Use Knowledge Base Context")
- Persist KB toggle state across sessions

### Week 5: KB Status Indicators (1 hour)
- Display KB status above Generate button
- Show "KB Context: ✓ Enabled (2 docs) | Threshold: 75%"
- Real-time updates when config changes
- LLM status + KB status combined display

### Week 6: KB Progress Indicators (1 hour)
- Show KB usage in `ProgressDisplay` component
- Display which KB documents are being referenced
- Add KB compliance score notification on completion
- Format: "✓ Generated 12 test cases | KB Compliance: 92%"

### Week 7: KB References Display (1-2 hours)
- Create `KBReferencesSection` component in test case cards
- Display KB documents used with section numbers
- Show KB compliance score badge (✓ ≥80% / ⚠ <80%)
- Add KB badge (✓/✗) to card header
- Format: "📚 KB References: CRM_User_Guide.pdf (Sections 2.21, 2.3)"

### Week 8: KB Filtering (1 hour)
- Add filter toggle: "Show only KB-validated test cases"
- Add sort option: "KB Compliance Score (High to Low)"
- Update test case state management to support KB filters

### Week 10: KB Export Options (1 hour)
- Add checkboxes to `ExportPanel`:
  - "Include KB references in export" (default: checked)
  - "Include KB compliance scores" (default: unchecked)
- Pass KB options to export API
- KB references exported as footnotes/citations

### Week 11: KB UI Testing (1-2 hours)
- Test KB upload drag-and-drop (PDF, text)
- Test KB document deletion with confirmation
- Test KB toggle persistence across sessions
- Test KB status indicators real-time updates
- Test KB compliance score display

**Total Frontend Hours:** ~7-9 hours

---

## KB Integration Points

### Week 3 Integration
- Test KB upload end-to-end: drag file → backend parse → store → display in list

### Week 4 Integration
- Test KB toggle and settings: enable KB → generate → verify KB context passed to agents

### Week 6 Integration
- Test generation with KB vs without KB (compare quality improvement)

### Week 11 Integration
- Full KB feature validation: upload KB → generate → preview with refs → export with citations

---

## KB Success Criteria

### ✅ Functional
- KB documents upload and parse correctly (PDF, text)
- KB toggle enables/disables context in generation
- KB references appear in test case output
- KB compliance scoring works (≥80% target)
- KB export options functional

### ✅ Performance
- KB document upload: 1-2 seconds (including parsing)
- KB retrieval for context: <100ms (in-memory cache)
- Generation time: <2 minutes (with or without KB, <10% overhead)
- Performance impact: <10% overhead with KB enabled

### ✅ Quality
- +40-60% test case quality improvement with KB enabled
- +50% field name accuracy (from KB documentation)
- +30% cross-system consistency (from KB procedures)
- 92%+ KB compliance score for KB-validated test cases

---

## KB Resources for Testing

### Sample KB Documents (To Be Provided)
1. `CRM_User_Guide_DT_Postpaid_20251015.pdf`
2. `Case_Management_User_Guide_POSTPAID.pdf`
3. `Backend_Operations_5G_Service.pdf`

### Detailed KB Documentation
- [KB Feature Implementation Summary](./KB_FEATURE_IMPLEMENTATION_SUMMARY.md) - Comprehensive guide
- [Updated PRD v2.1](./documentation/PRD-Consolidated-V2-1-with-KB.md) - Requirements
- [Updated SRS v2.1](./documentation/Software-Requirements-Spec-V2-1-KB.md) - Technical specs
- [Updated UI Design v1.2](./documentation/UI-Design-V1-2-with-KB.md) - UI guidelines

---

**KB Feature Total Time Investment:** ~16-20 hours (spread across Weeks 2-11)
- Developer A: ~9-11 hours
- Developer B: ~7-9 hours

**Expected Impact:** +40-60% test case quality improvement, making this feature highly valuable for Phase 1 MVP.

---

# DOCUMENT CHANGE LOG

## Version 2.0 (November 7, 2025) - AI Agent Development Optimized
- **CONSOLIDATED:** Merged DEVELOPER_WORK_SPLIT.md into this document
- **ADDED:** AI Agent instructions and best practices section
- **ADDED:** Visual timeline (ASCII) in Executive Summary
- **ADDED:** Enhanced daily communication and blocker escalation guidelines
- **ADDED:** Weekly Goals Summary table for quick AI reference
- **ADDED:** KB Feature Summary section with detailed task breakdowns
- **ADDED:** Effective AI prompts and common pitfalls section
- **OPTIMIZED:** Document structure for AI agent comprehension
- **PURPOSE:** Single source of truth for AI-assisted development (Cursor/Copilot)

## Version 1.1 (November 7, 2025) - KB Integration
- Added Knowledge Base feature to Phase 1 MVP
- Updated all weekly tasks with KB integration
- Added OpenRouter/Deepseek to Phase 1 scope

## Version 1.0 (November 7, 2025) - Initial
- Original project management plan
- 12-week Phase 1 MVP timeline

---

**Document Prepared By:** AI Assistant (Cursor)  
**Date:** November 7, 2025  
**Version:** 2.0 (AI Agent Development Optimized)  
**Status:** Ready for AI Agent Implementation  
**Note:** This document consolidates all developer work split information. DEVELOPER_WORK_SPLIT.md has been archived.

