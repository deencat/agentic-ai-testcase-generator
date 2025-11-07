# Software Requirements Specification (Revised)
## Agentic AI Test Case Generator - Version 2.1 with Knowledge Base Feature

**Document Version:** 2.1 (with KB Feature Integration)  
**Date:** November 7, 2025  
**Project:** Agentic AI Test Case Generator for Cross-Team TAT Testing  
**Tech Stack:** Next.js 14 (App Router) + FastAPI + PostgreSQL  
**Team:** 2 Developers (Junior + Mid), Using Copilot/Cursor  
**Status:** Ready for Development  

---

# EXECUTIVE SUMMARY

This SRS details the technical specifications for implementing the Agentic AI Test Case Generator **with integrated Knowledge Base feature** as a Phase 1 MVP enhancement.

**KEY ADDITIONS (v2.0 → v2.1):**
- Knowledge Base document upload and management system
- KB context integration into all three AI agents
- KB-aware UI components and workflows
- KB configuration options
- KB compliance validation
- Database schema updates for KB storage

**EXPECTED IMPACT:**
- +40-60% improvement in test case quality with KB enabled
- Specific field names and procedures from system documentation
- Referenced validation logic from actual system procedures

---

# SECTION 1: SYSTEM DESIGN

## Overall Architecture (Updated with KB)

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                          │
│  Next.js 14 (App Router) + React + Tailwind + Shadcn/ui   │
│                                                             │
│  NEW: KB Upload Zone, KB Toggle, KB References UI          │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND API SERVER                         │
│            FastAPI (Python 3.10+) - Async                   │
│  ┌──────────────┬──────────────────┬────────────────────┐   │
│  │ API Routes   │ LLM Service      │ KB Service (NEW)   │   │
│  │ /api/v1/*    │ (Ollama/OR)      │ /knowledge-base/*  │   │
│  │              │                  │ • Upload          │   │
│  │ NEW:         │ Generator Agent  │ • List            │   │
│  │ /api/v1/     │ with KB context  │ • Delete          │   │
│  │ knowledge-   │                  │ • Search (Phase 2)│   │
│  │ base/*       │ Executor Agent   │                   │   │
│  │              │ with KB validation                    │   │
│  └──────────────┴──────────────────┴────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                             │
│              PostgreSQL 15+ (Local)                         │
│  Tables: projects, test_cases, configurations, files        │
│  NEW: knowledge_base_documents                              │
│  UPDATED: projects (+ kb_enabled, kb_search_depth)          │
│  UPDATED: configurations (+ kb_context_enabled, etc.)       │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  • Ollama (http://127.0.0.1:11434) - Local LLM             │
│  • OpenRouter (https://openrouter.ai) - Cloud LLM          │
│  • Deepseek (https://api.deepseek.com) - Cloud LLM         │
└─────────────────────────────────────────────────────────────┘
```

---

# SECTION 2: ARCHITECTURE PATTERN

## Layered Architecture + Microkernel (Plugin-based LLM & KB)

### Layers

#### 1. Presentation Layer (Next.js Frontend - Enhanced with KB)

**Components:**
- Server Components: Static page shells, layouts, initial data
- Client Components: Interactive elements (drag-drop, buttons, forms)
  - **NEW**: KBUploadZone, KBDocumentList, KBToggle, KBSettings
- Shadcn/ui: Pre-built accessible components
- Tailwind CSS: Utility-first styling

#### 2. API Layer (FastAPI Backend - Enhanced with KB)

**Components:**
- Route Handlers: /api/v1/generate, /api/v1/upload, **NEW: /api/v1/knowledge-base/**
- Middleware: CORS, authentication, request validation
- Dependency Injection: Database sessions, LLM clients, **NEW: KB clients**
- Error Handling: Custom exception handlers

#### 3. Service Layer (Business Logic - Enhanced with KB)

**Existing Components:**
- Planner Agent → **ENHANCED: Uses KB to extract field names, procedures**
- Generator Agent → **ENHANCED: Uses KB for realistic test steps**
- Executor Agent → **ENHANCED: Validates against KB procedures**
- LLMService: Abstraction layer for Ollama/OpenRouter/Deepseek

**NEW Components:**
- KBService: Manages KB document upload, storage, retrieval
- KBContextBuilder: Builds context from KB documents for agents
- KBComplianceValidator: Validates test cases against KB rules

#### 4. Data Access Layer (SQLAlchemy ORM - Enhanced)

**Models:**
- Project, TestCase, File, Configuration
- **NEW: KnowledgeBaseDocument (full CRUD operations)**
- Repositories for each model
- Transaction management

#### 5. Data Layer (PostgreSQL)

**Tables:**
- projects, test_cases, files, configurations
- **NEW: knowledge_base_documents** (with metadata, type, content)

---

# SECTION 3: STATE MANAGEMENT (Enhanced with KB)

## Frontend State Management (Zustand)

### KB Store (NEW)

```typescript
interface KBState {
  // KB Documents
  kbDocuments: KBDocument[]
  selectedKBIds: string[]
  
  // KB Context Settings
  kbEnabled: boolean
  kbRelevanceThreshold: number // 0.0-1.0
  maxKBDocuments: number // 1-10
  autoIncludeKB: boolean
  
  // Actions
  uploadKBDocument: (file: File, type: string) => Promise<void>
  deleteKBDocument: (docId: string) => void
  toggleKBContext: (enabled: boolean) => void
  updateKBSettings: (settings: Partial<KBConfig>) => void
  selectKBDocuments: (docIds: string[]) => void
  getKBStatus: () => string
}
```

### Updated Generation Store (Enhanced)

```typescript
interface GenerationState {
  // ... existing fields ...
  
  // NEW KB Context
  useKB: boolean
  selectedKBDocs: KBDocument[]
  kbComplianceScore: number
  
  // ... actions including KB context passing ...
}
```

## Backend State Management

**Session Management:**
- Database session per request (context manager)
- **NEW: KB context cache (in-memory per request)**
- LLM client session (reusable)
- Background tasks for async generation

---

# SECTION 4: DATA FLOW (Enhanced with KB)

## KB Document Upload Flow (NEW)

```
User Drags KB File → Frontend (Client Component)
  ├─> Validate (size ≤ 5MB, type=PDF/text)
  └─> POST /api/v1/knowledge-base
       ↓
Backend (FastAPI)
  ├─> Receive multipart/form-data
  ├─> Extract text (PyPDF2 or raw text)
  ├─> Hash for deduplication (SHA-256)
  ├─> Create KnowledgeBaseDocument record
  ├─> Store metadata (name, type, size)
  └─> Return { docId, name, type, extractedLength }
       ↓
Frontend
  └─> Update KBStore.kbDocuments
      └─> Display in KB list with type badge
```

## Test Case Generation Flow with KB (Updated)

```
User Clicks Generate → Frontend
  └─> POST /api/v1/generate { 
       fileIds, textInput, 
       NEW: useKB=true, kbDocIds=[...] 
      }
       ↓
Backend (FastAPI)
  ├─> Create Project record in DB
  ├─> NEW: Fetch KB document content from DB
  ├─> Start BackgroundTask (async generation)
  ├─> Return { projectId, status: 'processing' }
  │
  └─> BackgroundTask:
       ├─> Fetch file + KB texts
       │
       ├─> Call PlannerAgent
       │    ├─> Input: file texts + KB context (NEW)
       │    ├─> Agent: "Reference KB for system procedures"
       │    ├─> Extract: scenarios + KB field names (NEW)
       │    └─> Emit SSE: KB usage indicators (NEW)
       │
       ├─> Call GeneratorAgent (for each scenario)
       │    ├─> Input: scenario + KB context (NEW)
       │    ├─> Agent: "Use KB for test step details"
       │    ├─> Output: specific menu paths from KB (NEW)
       │    └─> Emit SSE: KB references (NEW)
       │
       ├─> Call ExecutorAgent
       │    ├─> Input: test cases + KB rules (NEW)
       │    ├─> Validate: against KB procedures (NEW)
       │    ├─> Score: KB compliance ≥80% (NEW)
       │    └─> Emit SSE: KB compliance score (NEW)
       │
       ├─> Save test cases with KB references (NEW)
       └─> Emit SSE: completion with KB metrics
```

---

# SECTION 5: TECHNICAL STACK (Enhanced with KB)

## Frontend Stack (Same + KB Components)

- **Next.js 14.2+**: App Router, Server Components
- **React 18.3+**, **Tailwind CSS 3.4+**, **Shadcn/ui**
- **Zustand 4.5+** with new KB store
- **React Hook Form 7.5+**, **TanStack Query 5.0+**
- **react-dropzone**: For KB file uploads
- **NEW KB Components**: KBUploadZone, KBDocumentList, KBToggle, KBSettings

## Backend Stack (Same + KB Services)

- **FastAPI 0.110+**: Async web framework
- **SQLAlchemy 2.0+** + **psycopg3**: PostgreSQL ORM
- **PyPDF2 3.0+** or **PyMuPDF 1.24+**: PDF extraction
- **NEW KB Stack**:
  - KB document storage in PostgreSQL
  - Text extraction and hashing
  - Semantic search (Phase 2: embeddings via pgvector)

## Database Stack (Enhanced with KB)

- **PostgreSQL 15+** with pgvector extension (Phase 2)
- **Alembic 1.13+**: Migrations including KB schema

---

# SECTION 6: AUTHENTICATION & AUTHORIZATION (Phase 1: None, Phase 2: JWT)

### Current (Phase 1): Open Local Access

**KB Access:**
- All users can upload KB documents (no auth required)
- KB documents shared across project (admin configurable)
- No user-specific KB isolation

### Future (Phase 2): JWT + RBAC

**KB Access Levels:**
- Admin: Upload, delete, configure KB globally
- QA Lead: Upload, view, manage team KB
- QA Engineer: View, use KB, cannot delete

---

# SECTION 7: ROUTE DESIGN (Enhanced with KB)

## Frontend Routes (Next.js App Router - Same)

```
/                           → Homepage (Dashboard)
/generate                   → Test Case Generator (main application)
/projects                   → Projects List
/projects/[id]              → Project Details
/settings                   → Configuration Settings
```

## Backend API Routes (Enhanced with KB)

### NEW Knowledge Base Endpoints

```
POST   /api/v1/knowledge-base
  Multipart upload, PDF/text file
  Body: { file, docName, docType }
  Response: { docId, fileName, fileSize, uploadedAt }

GET    /api/v1/knowledge-base
  Query: ?docType=system_guide&isActive=true
  Response: [{ docId, fileName, fileSize, type, uploadedAt }]

DELETE /api/v1/knowledge-base/{docId}
  Response: { success: true }

POST   /api/v1/knowledge-base/search (Phase 2)
  Body: { query, limit: 5, threshold: 0.7 }
  Response: [{ docId, relevantText, relevanceScore, section }]
```

### Updated Generation Endpoint

```
POST /api/v1/generate
  NEW Query Parameter:
  - useKnowledgeBase: boolean (default: false)
  - kbDocIds: string[] (selected KB document IDs)
  
  Response includes:
  - projectId
  - kbContext: { docsUsed, complianceScore }
```

---

# SECTION 8: API DESIGN (Enhanced with KB)

## KB Document Upload API

### Request
```http
POST /api/v1/knowledge-base HTTP/1.1
Content-Type: multipart/form-data

Content-Disposition: form-data; name="file"; filename="CRM_User_Guide.pdf"
Content-Type: application/pdf

[binary data]
```

### Response
```json
{
  "success": true,
  "data": {
    "docId": "kb-001",
    "fileName": "CRM_User_Guide.pdf",
    "docType": "system_guide",
    "fileSize": 19230,
    "contentLength": 15000,
    "uploadedAt": "2025-11-07T12:00:00Z"
  }
}
```

## KB Document List API

### Request
```http
GET /api/v1/knowledge-base?docType=system_guide&isActive=true
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "docId": "kb-001",
      "fileName": "CRM_User_Guide.pdf",
      "docType": "system_guide",
      "fileSize": 19230,
      "uploadedAt": "2025-11-07T12:00:00Z",
      "isActive": true
    }
  ]
}
```

## KB Document Deletion API

### Request
```http
DELETE /api/v1/knowledge-base/kb-001
```

### Response
```json
{
  "success": true,
  "data": { "docId": "kb-001", "deletedAt": "2025-11-07T12:05:00Z" }
}
```

## Updated Generate with KB Context

### Request
```json
POST /api/v1/generate
{
  "fileIds": ["f7b8..."],
  "textInput": "Test Double 11 offer",
  "useKnowledgeBase": true,
  "kbDocIds": ["kb-001", "kb-002"]
}
```

### Response (Success)
```json
{
  "success": true,
  "data": {
    "projectId": "proj-123",
    "status": "processing",
    "kbContext": {
      "docsUsed": 2,
      "docNames": ["CRM_User_Guide.pdf", "Case_Management_Guide.pdf"],
      "estimatedTime": "1-2 minutes"
    }
  }
}
```

---

# SECTION 9: DATABASE DESIGN (Enhanced with KB)

## New Table: knowledge_base_documents

```sql
CREATE TABLE knowledge_base_documents (
    doc_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_name VARCHAR(255) NOT NULL,
    doc_type VARCHAR(50) NOT NULL CHECK (doc_type IN ('system_guide', 'process', 'reference', 'product')),
    doc_description TEXT,
    content TEXT NOT NULL,  -- Full extracted text
    file_size INTEGER NOT NULL,
    file_hash VARCHAR(64) UNIQUE,  -- SHA-256 for deduplication
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Phase 2 additions
    content_vector vector(1536),  -- OpenAI embedding dimension
    chunk_count INTEGER,
    indexed_at TIMESTAMP
);

CREATE INDEX idx_kb_doc_type ON knowledge_base_documents(doc_type);
CREATE INDEX idx_kb_doc_active ON knowledge_base_documents(is_active);
CREATE INDEX idx_kb_doc_hash ON knowledge_base_documents(file_hash);
CREATE INDEX idx_kb_doc_created ON knowledge_base_documents(created_at DESC);
CREATE INDEX idx_kb_doc_vector ON knowledge_base_documents USING ivfflat (content_vector vector_cosine_ops);  -- Phase 2
```

## Updated Table: projects

```sql
ALTER TABLE projects ADD COLUMN (
    knowledge_base_enabled BOOLEAN DEFAULT TRUE,
    kb_search_depth INT DEFAULT 1 CHECK (kb_search_depth >= 0 AND kb_search_depth <= 3)
);
```

## Updated Table: configurations

```sql
ALTER TABLE configurations ADD COLUMN (
    kb_context_enabled BOOLEAN DEFAULT TRUE,
    kb_relevance_threshold FLOAT DEFAULT 0.75 CHECK (kb_relevance_threshold >= 0.0 AND kb_relevance_threshold <= 1.0),
    max_kb_documents INT DEFAULT 5 CHECK (max_kb_documents >= 1 AND max_kb_documents <= 10)
);
```

## Sample KB Document Record

```json
{
  "doc_id": "kb-001",
  "doc_name": "CRM_User_Guide_DT_Postpaid_20251015.pdf",
  "doc_type": "system_guide",
  "doc_description": "CRM system user guide for postpaid service operations",
  "file_size": 19230,
  "file_hash": "a1b2c3d4e5f6...",
  "is_active": true,
  "created_at": "2025-11-07T12:00:00Z",
  "content_length": 15000,
  "chunk_count": null  // Phase 2
}
```

---

# SECTION 10: KB SERVICE IMPLEMENTATION

## KB Service Interface (Backend)

```python
class KBService:
    """Service for Knowledge Base document management and retrieval"""
    
    async def upload_document(
        self, 
        file: UploadFile, 
        doc_type: str
    ) -> KBDocumentResponse:
        """Upload and store KB document"""
        
    async def list_documents(
        self,
        doc_type: Optional[str] = None,
        is_active: bool = True
    ) -> List[KBDocumentResponse]:
        """List KB documents with optional filtering"""
        
    async def delete_document(self, doc_id: str) -> bool:
        """Delete KB document"""
        
    async def get_document_content(self, doc_id: str) -> str:
        """Retrieve full document content for agent context"""
        
    async def search_documents(
        self,
        query: str,
        limit: int = 5,
        threshold: float = 0.7
    ) -> List[KBSearchResult]:
        """Search KB documents (Phase 2: semantic)"""
        
    def build_kb_context(
        self,
        kb_doc_ids: List[str],
        max_length: int = 5000
    ) -> str:
        """Build concatenated KB context for agent prompts"""
```

## KB Context Integration in Agents

### Planner Agent (Enhanced Prompt)

```
System Prompt Update:
"You are a test planner with access to system documentation.

KNOWLEDGE BASE CONTEXT:
The following knowledge base documents are available:
1. CRM_User_Guide.pdf - Customer relationship management
2. Case_Management_Guide.pdf - Case and issue tracking

INSTRUCTIONS:
1. Reference KB documents to identify exact system procedures
2. Extract specific field names and menu paths from KB
3. Understand business validation rules from KB
4. Map documented cross-system workflows

For each test scenario, specify exact procedures from KB."
```

### Generator Agent (Enhanced Prompt)

```
System Prompt Update:
"You are a test case writer with system documentation available.

KNOWLEDGE BASE PROVIDED:
[Full content of selected KB docs]

INSTRUCTIONS:
1. Use KB documentation for realistic test steps:
   - Include exact menu paths: e.g., "Home → Subscription Preview → Details"
   - Use specific field names as documented in KB
   - Reference exact system messages/confirmations

2. Example test step (with KB reference):
   OLD: "Verify offer display"
   NEW: "Navigate to Home → Subscription → Dashboard (CRM_UG, Sec 2.21)"
        "Verify 'Net Plan Price' field shows $201"

3. Include KB section references in output"
```

### Executor Agent (Enhanced Validation)

```
Validation Checklist (NEW):
- ☐ Test steps match KB-documented procedures
- ☐ Field names exist in KB documentation
- ☐ Business logic aligns with KB rules
- ☐ Generate KB compliance score (target: ≥80%)

Score Calculation:
  - Each check: +25%
  - KB source citations present: +bonus
  - Final: KB Compliance: ✓ Validated (X%)
```

---

# SECTION 11: UI COMPONENTS (KB Features)

## Core KB Components (Frontend)

### 1. KBUploadZone Component

**Props:**
```typescript
interface KBUploadZoneProps {
  onUpload: (file: File, type: string) => Promise<void>
  isLoading: boolean
  error?: string
}
```

**Features:**
- Drag-and-drop for PDF/text files
- File type validation (max 5MB)
- Visual feedback with blue theme (differentiate from req files)
- Duplicate detection (show hash warning)

### 2. KBDocumentList Component

**Props:**
```typescript
interface KBDocumentListProps {
  documents: KBDocument[]
  onDelete: (docId: string) => void
  selectedIds: string[]
  onSelect: (docIds: string[]) => void
}
```

**Features:**
- List with type badges ([system_guide], [process], etc.)
- Document count and total size display
- Delete with confirmation
- Selection checkboxes for context inclusion

### 3. KBToggle Component

**Props:**
```typescript
interface KBToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  docCount: number
}
```

**Features:**
- Checkbox to enable/disable KB context
- Shows doc count when enabled
- Saves state immediately
- Real-time feedback to Generate button

### 4. KBSettings Component (in Configuration Drawer)

**Features:**
- Enable/disable KB context toggle
- KB relevance threshold slider (0-100%)
- Max KB documents dropdown (1-10)
- Auto-include KB in prompts checkbox
- View/delete KB documents button
- Clear KB cache button

---

# SECTION 12: PERFORMANCE REQUIREMENTS (Enhanced with KB)

| Metric | Target | Notes |
|--------|--------|-------|
| KB document upload | 1-2 sec | Extract & store |
| KB document parsing | 1-2 sec | PDF/text extraction |
| KB retrieval for context | <100ms | In-memory cache |
| KB indexing | <5 sec | After upload |
| Generation with KB | <2 min total | Same as without KB |
| Performance impact | <10% overhead | KB retrieval cached |
| Storage per KB doc | 5 MB max | Limit enforced |
| Max KB docs per project | 100 | Configurable |
| Context window usage | ~20-30% | For KB content |

---

# SECTION 13: SECURITY REQUIREMENTS (Enhanced with KB)

**KB Document Security:**
- No encryption required (internal documents only)
- Access control: Anyone can upload (Phase 1), Role-based (Phase 2)
- No sensitive data filtering required
- File type validation (PDF/text only)
- File size limits (5MB per document)

**Data Sanitization:**
- HTML/script tags stripped from KB text
- PDF extraction via safe library (PyPDF2)
- No execution of content (text only)

---

# SECTION 14: TESTING STRATEGY (Enhanced with KB)

## KB-Specific Tests

### Unit Tests
```python
test_kb_document_upload()          # Upload, validate, store
test_kb_document_deduplication()   # Hash check
test_kb_document_deletion()        # Delete with cleanup
test_kb_context_building()         # Concatenate KB content
test_kb_compliance_scoring()       # Validate test cases against KB
test_pdf_extraction()              # PyPDF2 parsing
```

### Integration Tests
```python
test_kb_upload_to_generation()     # Full KB flow
test_kb_context_in_prompts()       # Agents use KB
test_generation_with_kb()          # Full generation with KB
test_export_with_kb_references()   # KB refs in output
```

### UI Tests
```javascript
test_kb_upload_zone_drag_drop()   // Drag files
test_kb_document_list_display()    // Show/hide docs
test_kb_toggle_persistence()       // Enable/disable
test_kb_settings_save()            // Configuration
test_kb_compliance_badge()         // Display score
```

### Sample KB Documents for Testing
- CRM_User_Guide_DT_Postpaid_20251015.pdf
- Case_Management_User_Guide_POSTPAID.pdf
- Backend_Operations_5G_Guide.pdf

---

# SECTION 15: IMPLEMENTATION ROADMAP

## Phase 1 (MVP) - Weeks 2-3: KB Feature (~8-12 hours)

### Week 2
- **Backend (4-6 hours)**
  - Create knowledge_base_documents table
  - Implement KB upload API (POST /api/v1/knowledge-base)
  - Implement KB list/delete APIs
  - PDF text extraction with PyPDF2
  - File hash deduplication

- **Frontend (2-3 hours)**
  - Create KBUploadZone component
  - Create KBDocumentList component
  - Add KB section to input panel

### Week 3
- **Integration (2-3 hours)**
  - Connect KB to agent prompts
  - Update Planner, Generator, Executor agents
  - KB context passing to LLM

- **Testing (2-3 hours)**
  - Unit tests for KB service
  - Integration tests for full flow
  - UI tests for KB components
  - Test with sample KB documents

## Phase 2 (Enhancement) - Week 6+: Semantic Search (~1-2 weeks)

- Vector embeddings for KB documents
- Semantic search using pgvector
- Hybrid BM25 + semantic retrieval
- KB document chunking
- Improved relevance scoring

## Phase 3 (Optional): Advanced KB

- Fine-tuning LLM with KB content
- Automatic relationship detection
- Cross-document linking
- KB change tracking and versioning

---

# SECTION 16: DEPLOYMENT NOTES (KB Feature)

## Database Setup

```sql
-- Create KB table
CREATE TABLE knowledge_base_documents (...)

-- Create indexes
CREATE INDEX idx_kb_doc_type ON knowledge_base_documents(doc_type);
CREATE INDEX idx_kb_doc_hash ON knowledge_base_documents(file_hash);

-- Update existing tables
ALTER TABLE projects ADD COLUMN knowledge_base_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE configurations ADD COLUMN kb_context_enabled BOOLEAN DEFAULT TRUE;
```

## Environment Variables (No new requirements)

KB feature uses existing:
- `DATABASE_URL` - for KB table storage
- `LLM_PROVIDER`, `LLM_MODEL` - same LLM integration

## Migration Strategy

```bash
# Alembic migration
alembic revision --autogenerate -m "Add Knowledge Base feature"
alembic upgrade head
```

---

# SECTION 17: MONITORING & LOGGING (KB Feature)

## Log Points

```
[INFO] KB document uploaded: doc_id={}, file_size={}, hash={}
[INFO] KB document deleted: doc_id={}
[INFO] KB context built: selected_docs={}, total_chars={}
[DEBUG] Planner agent using KB context: num_docs={}
[DEBUG] Generator agent using KB context: doc_names={}
[DEBUG] Executor agent validating against KB: compliance_score={}
[ERROR] KB document parse failed: doc_id={}, error={}
```

## Metrics

- KB documents uploaded per day
- KB usage frequency (% of generations using KB)
- Average KB compliance score
- KB document size distribution
- Search performance (Phase 2)

---

# SECTION 18: KNOWN LIMITATIONS & FUTURE ENHANCEMENTS

## Phase 1 Limitations

- No semantic search (Phase 2)
- No user-specific KB isolation
- No KB versioning
- No automatic KB updates
- Single language (English)

## Phase 2 Enhancements

- Semantic search with embeddings
- Multi-language support
- KB versioning and change tracking
- Automatic KB chunking
- Role-based KB access control
- KB analytics dashboard

---

# SECTION 19: GLOSSARY (KB Additions)

- **KB (Knowledge Base)**: System documentation, user guides, operational manuals
- **KB Document**: Single PDF/text file stored in knowledge_base_documents table
- **KB Context**: Concatenated text from selected KB documents passed to agents
- **KB Compliance Score**: Percentage of test case validation checks against KB rules (target: ≥80%)
- **KB Relevance Threshold**: Configurable score (0-100%) for KB semantic search matching (Phase 2)
- **Document Type**: Category of KB document (system_guide, process, reference, product)
- **File Hash**: SHA-256 hash for KB document deduplication
- **Semantic Search**: Phase 2 feature using vector embeddings to find relevant KB content

---

# SECTION 20: APPENDICES

## A. KB Feature Acceptance Criteria

- [ ] KB upload accepts PDF and text files (max 5MB each)
- [ ] KB documents stored with metadata (name, type, size, hash)
- [ ] KB toggle enables/disables context for generation
- [ ] KB compliance score calculated for each test case (≥80% target)
- [ ] KB references displayed in test case output
- [ ] KB configuration options available in settings
- [ ] No performance degradation (<10% overhead)
- [ ] All KB features documented and tested

## B. Sample KB Documents Provided

1. **CRM_User_Guide_DT_Postpaid_20251015.pdf**
   - Contains: Customer profile, subscription management, billing operations
   - Sections referenced: 2.21 Subscription Maintenance, 2.3 Subscription Contact

2. **Case_Management_User_Guide_POSTPAID.pdf**
   - Contains: Case creation, task management, waiving/adjustment processes
   - Sections referenced: 4.1 Create Case, 4.2 Task Assignment

3. **Backend_Operations_5G_Service.pdf**
   - Contains: Service activation, equipment management, fulfillment procedures
   - Sections referenced: Service initiation, equipment allocation

## C. Frontend Implementation Checklist

```
[ ] Create KBUploadZone.tsx component
[ ] Create KBDocumentList.tsx component
[ ] Create KBToggle.tsx component
[ ] Update GenerateButton.tsx (show KB status)
[ ] Update TestCaseCard.tsx (show KB badge + references)
[ ] Update ExportPanel.tsx (KB export options)
[ ] Create useKBStore.ts (Zustand)
[ ] Add KB routes to API layer
[ ] Test with sample KB documents
[ ] Update UI design documentation
```

## D. Backend Implementation Checklist

```
[ ] Create KnowledgeBaseDocument model (SQLAlchemy)
[ ] Create knowledge_base_documents table (migration)
[ ] Implement KBService class
[ ] Create KB API routes (POST, GET, DELETE)
[ ] Implement PDF text extraction
[ ] Implement file hash deduplication
[ ] Update Planner Agent with KB prompt
[ ] Update Generator Agent with KB prompt
[ ] Update Executor Agent with KB validation
[ ] Add KB context building logic
[ ] Test with Cursor/Copilot assistance
```

---

**END OF SOFTWARE REQUIREMENTS SPECIFICATION v2.1 (with KB Feature)**

This document is production-ready for development. All KB features are fully specified and ready for implementation using Copilot/Cursor assistance.
