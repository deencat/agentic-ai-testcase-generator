# Knowledge Base Feature Implementation Summary
## Agentic AI Test Case Generator - Phase 1 MVP Enhancement

**Document Version:** 1.0  
**Date:** November 7, 2025  
**Feature:** Knowledge Base (KB) Document Integration  
**Expected Impact:** +40-60% test case quality improvement  
**Total Estimated Time:** ~12-16 hours (split between 2 developers over Weeks 2-6)  

---

## 📋 EXECUTIVE SUMMARY

The Knowledge Base feature allows QA Engineers to upload system documentation (User Guides, Operational Manuals, Process Documentation) that AI agents reference during test case generation. This results in significantly more specific and accurate test cases with:

- **Exact field names** from system documentation
- **Specific menu paths** (e.g., "Home → Subscription Preview → Dashboard")
- **Business validation rules** from documented procedures
- **KB compliance scoring** to ensure test cases match KB-documented procedures

### Key Benefits
- ✅ **+40-60% test case quality improvement** (specificity, accuracy)
- ✅ **+50% field name accuracy** (from KB documentation)
- ✅ **+30% cross-system consistency** (from KB procedures)
- ✅ **92%+ KB compliance score** target for generated test cases

---

## 📅 IMPLEMENTATION TIMELINE

### Week-by-Week Breakdown

| Week | Developer A (Backend) | Developer B (Frontend) | Hours |
|------|----------------------|------------------------|-------|
| **Week 2** | KB database schema design | - | 1 hour |
| **Week 3** | KB upload API + parsing | KB upload UI components | 4-6 hours |
| **Week 4** | KB management APIs | KB state management + toggle | 2-3 hours |
| **Week 5** | KB context builder + agent integration | KB status indicators | 2-3 hours |
| **Week 6** | KB compliance scoring | KB progress + notifications | 1-2 hours |
| **Week 7** | - | KB references display in cards | 1-2 hours |
| **Week 8** | - | KB filtering and sorting | 1 hour |
| **Week 10** | - | KB export options | 1 hour |
| **Week 11** | KB-specific tests | KB UI tests | 2-3 hours |
| **TOTAL** | **9-11 hours** | **7-9 hours** | **16-20 hours** |

**Note:** Work is spread across weeks 2-11, with the heaviest lift in Weeks 3-6.

---

## 🎯 FEATURE COMPONENTS

### 1. Database Layer (Week 2)

#### New Table: `knowledge_base_documents`

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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Updated Tables

```sql
-- projects table
ALTER TABLE projects ADD COLUMN (
    knowledge_base_enabled BOOLEAN DEFAULT TRUE
);

-- configurations table
ALTER TABLE configurations ADD COLUMN (
    kb_context_enabled BOOLEAN DEFAULT TRUE,
    kb_relevance_threshold FLOAT DEFAULT 0.75,
    max_kb_documents INT DEFAULT 5
);
```

---

### 2. Backend APIs (Weeks 3-4)

#### A. KB Upload API (Week 3: 4-6 hours)

**Endpoint:** `POST /api/v1/knowledge-base`

```python
# Implementation Steps:
1. Accept multipart/form-data with PDF/text file
2. Validate file (max 5MB, PDF/text only)
3. Extract text using PyPDF2 (reuse existing PDFParser)
4. Calculate SHA-256 hash for deduplication
5. Check if hash exists (duplicate prevention)
6. Store in knowledge_base_documents table
7. Return metadata (docId, name, type, size)
```

**Request:**
```http
POST /api/v1/knowledge-base
Content-Type: multipart/form-data

file: CRM_User_Guide.pdf
docType: "system_guide"
```

**Response:**
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

#### B. KB Management APIs (Week 4: 2-3 hours)

**List KB Documents:** `GET /api/v1/knowledge-base`
- Filter by docType, isActive
- Return array of KB documents with metadata

**Delete KB Document:** `DELETE /api/v1/knowledge-base/{docId}`
- Remove document from database
- Return success confirmation

**Create `KBService` class:**
```python
class KBService:
    async def upload_document(file: UploadFile, doc_type: str) -> KBDocumentResponse
    async def list_documents(doc_type: Optional[str], is_active: bool) -> List[KBDocumentResponse]
    async def delete_document(doc_id: str) -> bool
    async def get_document_content(doc_id: str) -> str
    def build_kb_context(kb_doc_ids: List[str], max_length: int) -> str
```

---

### 3. AI Agent Integration (Weeks 5-6)

#### A. KB Context Builder (Week 5: 2 hours)

```python
class KBContextBuilder:
    def build_context(self, kb_doc_ids: List[str], max_length: int = 5000) -> str:
        """
        Fetch KB documents, concatenate content, truncate if needed
        Returns: Formatted KB context string for LLM prompts
        """
        kb_docs = await self.fetch_documents(kb_doc_ids)
        combined_text = self._concatenate_documents(kb_docs)
        truncated_text = self._truncate_to_limit(combined_text, max_length)
        return self._format_for_prompt(truncated_text)
```

#### B. Enhanced Agent Prompts (Week 5-6: 2-3 hours)

**Planner Agent Enhancement:**
```
System Prompt Addition:

KNOWLEDGE BASE CONTEXT:
The following system documentation is available:
{KB_CONTENT}

INSTRUCTIONS:
- Reference KB documents to identify exact system procedures
- Extract specific field names and menu paths from KB
- Understand business validation rules from KB
- Map documented cross-system workflows
```

**Generator Agent Enhancement:**
```
System Prompt Addition:

KNOWLEDGE BASE PROVIDED:
{KB_CONTENT}

INSTRUCTIONS:
1. Use KB documentation for realistic test steps:
   - Include exact menu paths: e.g., "Home → Subscription Preview → Details"
   - Use specific field names as documented in KB
   - Reference exact system messages/confirmations

2. Example test step (with KB reference):
   OLD: "Verify offer display"
   NEW: "Navigate to Home → Subscription → Dashboard (CRM_UG, Sec 2.21)"
        "Verify 'Net Plan Price' field shows $201"
```

**Executor Agent Enhancement (Week 6: 1 hour):**
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

#### C. Update Generation API (Week 6: 1 hour)

```python
@router.post("/api/v1/generate")
async def generate_test_cases(
    fileIds: List[str],
    textInput: Optional[str],
    useKnowledgeBase: bool = False,  # NEW
    kbDocIds: List[str] = []  # NEW
):
    # Fetch KB document content if enabled
    kb_context = None
    if useKnowledgeBase and kbDocIds:
        kb_context = kb_service.build_kb_context(kbDocIds)
    
    # Pass KB context to agents
    test_plan = await planner_agent.plan(
        input_text=combined_input,
        kb_context=kb_context  # NEW
    )
    
    # ... continue generation with KB context
```

---

### 4. Frontend Components (Weeks 3-4, 7-8, 10)

#### A. KB Upload Zone Component (Week 3: 2-3 hours)

```typescript
// components/KBUploadZone.tsx
interface KBUploadZoneProps {
  onUpload: (file: File, type: string) => Promise<void>
  isLoading: boolean
  error?: string
}

Features:
- Drag-and-drop for PDF/text files
- Blue theme (differentiate from requirements zone)
- File type validation (max 5MB)
- Visual feedback
- Duplicate detection (show hash warning)
```

**UI Design:**
```
┌───────────────────────────────────────────────────────┐
│                        📚                             │
│      Drag KB documents here or click to browse       │
│    (User Guides, Operational Manuals, Process Docs)  │
│                 Max 5 MB per document                 │
└───────────────────────────────────────────────────────┘

Knowledge Base Documents:
• CRM_User_Guide.pdf (19.2 KB) ✓ [system_guide] ✕
• Case_Management_Guide.pdf (2.28 MB) ✓ [process] ✕

☑ Use Knowledge Base Context
2 documents loaded (2.3 MB total)
```

#### B. KB State Management (Week 4: 1-2 hours)

```typescript
// stores/useKBStore.ts
interface KBState {
  kbDocuments: KBDocument[]
  selectedKBIds: string[]
  kbEnabled: boolean
  kbRelevanceThreshold: number
  maxKBDocuments: number
  
  uploadKBDocument: (file: File, type: string) => Promise<void>
  deleteKBDocument: (docId: string) => void
  toggleKBContext: (enabled: boolean) => void
  updateKBSettings: (settings: Partial<KBConfig>) => void
}
```

#### C. KB Status Indicators (Week 5: 1 hour)

**Above Generate Button:**
```
LLM Status: ⚫ Connected | Ollama (llama3:latest)
KB Context: ✓ Enabled (2 docs) | Threshold: 75%
```

**In Progress Display:**
```
Step 1: Planner Agent ✓ Completed
  - Analyzed 3 documents + 2 KB docs
  - Extracted field names from CRM_User_Guide.pdf
```

#### D. KB References Display (Week 7: 1-2 hours)

```typescript
// components/KBReferencesSection.tsx
interface KBReferencesSectionProps {
  references: KBReference[]
  complianceScore: number
}

Display:
📚 KB References:
  • CRM_User_Guide.pdf (Sections 2.21, 2.3, 2.12)
  • Case_Management_Guide.pdf (Section 4.1)

KB Compliance: ✓ Validated (Score: 95%)
```

#### E. KB Export Options (Week 10: 1 hour)

```typescript
Export Panel:
☑ Include KB references in export (default: checked)
☐ Include KB compliance scores (default: unchecked)
```

---

### 5. Configuration Settings (Week 4)

**KB Configuration Options in Settings Drawer:**

```
KNOWLEDGE BASE (NEW)

☑ Enable KB Context

KB Relevance Threshold:
[======●==] 75%

Max KB Documents:
[5 ▼] (1-10)

☑ Auto-include KB in prompts

[View Uploaded KB Docs]
[Clear KB Cache]
```

---

## 🧪 TESTING STRATEGY (Week 11)

### Backend Tests (2-3 hours)

```python
# Unit Tests
def test_kb_document_upload()
def test_kb_document_deduplication()
def test_kb_document_deletion()
def test_kb_context_building()
def test_kb_context_truncation()
def test_kb_compliance_scoring()
def test_pdf_extraction()

# Integration Tests
def test_kb_upload_to_generation()
def test_kb_context_in_prompts()
def test_generation_with_kb()
def test_export_with_kb_references()
```

### Frontend Tests (1-2 hours)

```javascript
// UI Tests
test('KB upload zone drag and drop')
test('KB document list display')
test('KB toggle persistence')
test('KB settings save')
test('KB compliance badge display')
test('KB status indicators update')
test('KB export options')
```

### Sample KB Documents for Testing

1. **CRM_User_Guide_DT_Postpaid_20251015.pdf**
   - Sections: 2.21 Subscription Maintenance, 2.3 Subscription Contact
   
2. **Case_Management_User_Guide_POSTPAID.pdf**
   - Sections: 4.1 Create Case, 4.2 Task Assignment

3. **Backend_Operations_5G_Service.pdf**
   - Sections: Service initiation, equipment allocation

---

## 📊 SUCCESS METRICS

### Functional Metrics
- ✅ KB document upload working (PDF, text)
- ✅ KB documents stored with metadata
- ✅ KB toggle enables/disables context
- ✅ KB compliance score calculated (≥80% target)
- ✅ KB references displayed in test case output
- ✅ KB configuration options work
- ✅ No performance degradation (<10% overhead)

### Quality Metrics
- ✅ **+40-60% test case quality improvement** with KB enabled
- ✅ **+50% field name accuracy** (from KB documentation)
- ✅ **+30% cross-system consistency** (from KB procedures)
- ✅ **92%+ KB compliance score** for KB-validated test cases

### Performance Metrics
- ✅ KB document upload: 1-2 seconds (including parsing)
- ✅ KB retrieval for context: <100ms (in-memory cache)
- ✅ Generation time: <2 minutes (with or without KB)
- ✅ Performance impact: <10% overhead with KB

---

## 🚀 DEPLOYMENT CHECKLIST

### Database Migration

```bash
# Create KB table
alembic revision --autogenerate -m "Add Knowledge Base feature"
alembic upgrade head
```

### Backend Deployment

- [ ] Install dependencies (PyPDF2 already included)
- [ ] Run database migration
- [ ] Verify KB API endpoints working
- [ ] Test with sample KB documents

### Frontend Deployment

- [ ] Build Next.js app with KB components
- [ ] Verify KB upload zone displays correctly
- [ ] Test KB toggle functionality
- [ ] Verify KB status indicators update

### Environment Variables (No new requirements)

KB feature uses existing:
- `DATABASE_URL` - for KB table storage
- `LLM_PROVIDER`, `LLM_MODEL` - same LLM integration

---

## 📝 IMPLEMENTATION NOTES

### Key Implementation Details

1. **KB Context Length Management (Phase 1)**
   - Max 5000 characters per generation
   - Simple truncation if exceeded
   - Phase 2: Semantic search + chunking

2. **KB Document Deduplication**
   - SHA-256 hash before storage
   - Check if hash exists
   - Warn user if duplicate detected

3. **KB Context Passing**
   - Build concatenated KB context string
   - Include in agent system prompts
   - Format: "KNOWLEDGE BASE CONTEXT: {kb_content}"

4. **KB Compliance Scoring**
   - 4 validation checks (25% each)
   - Bonus points for KB citations
   - Target: ≥80% for KB-validated test cases

### Common Pitfalls to Avoid

❌ **Don't:** Store KB documents as separate files on disk  
✅ **Do:** Store extracted text in PostgreSQL text field

❌ **Don't:** Include entire KB content in every LLM call  
✅ **Do:** Truncate to 5000 chars, cache retrieval

❌ **Don't:** Make KB context mandatory  
✅ **Do:** Allow toggle on/off for flexibility

❌ **Don't:** Show raw KB content to users  
✅ **Do:** Display formatted KB references with section numbers

---

## 💡 TIPS FOR USING CURSOR/COPILOT

### Prompt Examples

**For Backend:**
```
"Create a FastAPI endpoint that accepts PDF file upload, extracts text using 
PyPDF2, calculates SHA-256 hash, and stores in knowledge_base_documents table 
with validation for max 5MB file size"
```

**For Frontend:**
```
"Create a React component for KB document upload zone with drag-and-drop, 
blue theme styling, file size validation (max 5MB), and display uploaded 
documents with type badges like [system_guide] [process]"
```

**For Agent Integration:**
```
"Update the PlannerAgent system prompt to include a KNOWLEDGE BASE CONTEXT 
section that instructs the agent to extract specific field names and procedures 
from the provided KB documentation"
```

### Code Generation Shortcuts

1. **Backend:** Use Copilot to generate SQLAlchemy model from table DDL
2. **Frontend:** Use Cursor to generate Zustand store from interface
3. **Testing:** Use Copilot to generate test cases from function signatures
4. **API:** Use Cursor to generate FastAPI route from OpenAPI spec

---

## 📚 ADDITIONAL RESOURCES

### Reference Documentation

- [PRD v2.1 with KB](./documentation/PRD-Consolidated-V2-1-with-KB.md)
- [SRS v2.1 with KB](./documentation/Software-Requirements-Spec-V2-1-KB.md)
- [UI Design v1.2 with KB](./documentation/UI-Design-V1-2-with-KB.md)
- [Main Project Plan](./PROJECT_MANAGEMENT_PLAN.md)

### Phase 2 Enhancements (Optional)

- Vector embeddings for KB semantic search (pgvector)
- Hybrid BM25 + semantic retrieval
- KB document chunking for large documents
- Automatic relationship detection
- KB change tracking and versioning

---

**Document Prepared By:** AI Assistant (Cursor)  
**Date:** November 7, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation

**Questions? Contact Project Lead or refer to main PROJECT_MANAGEMENT_PLAN.md**

