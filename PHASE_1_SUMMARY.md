# Phase 1 MVP - Executive Summary
## Agentic AI Test Case Generator

**Duration:** 12 Weeks  
**Team:** 2 Developers  
**Goal:** Deliver a workable MVP that reduces test case creation time from 15-30 minutes to <2 minutes  

---

## 🎯 Phase 1 MVP - What We're Building

### Core Product (Workable End-to-End Solution)

```
┌────────────────────────────────────────────────────────────┐
│                    USER WORKFLOW                           │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1️⃣ UPLOAD FILES                                          │
│     • Drag-and-drop PDF files (Jira exports)              │
│     • Drag-and-drop Excel files (Offer Master)            │
│     • Or enter text input directly                        │
│     • Batch processing (up to 10 files)                   │
│                                                            │
│  2️⃣ CONFIGURE LLM                                         │
│     • Select provider (Ollama, OpenRouter, Deepseek,     │
│       or Google Gemini)                                  │
│     • Choose model (llama3, mistral, GPT-4, gemini, etc.)│
│     • Enter API key (for cloud providers)                │
│     • Set parameters (temperature, max tokens)            │
│     • Test connection                                     │
│                                                            │
│  3️⃣ GENERATE TEST CASES                                   │
│     • Click big green "Generate" button                   │
│     • Watch real-time progress (Planner → Generator →     │
│       Executor)                                           │
│     • See agent status updates                            │
│     • Cancel if needed                                    │
│                                                            │
│  4️⃣ PREVIEW & EDIT                                        │
│     • View test cases in expandable cards                 │
│     • Filter by category, priority, system                │
│     • Sort by ID, priority, category                      │
│     • Edit any field inline (click to edit)               │
│     • Save changes                                        │
│                                                            │
│  5️⃣ EXPORT                                                │
│     • Select all or specific test cases                   │
│     • Download as Excel (.xlsx)                           │
│     • Download as Markdown (.md)                          │
│     • Success notification                                │
│                                                            │
└────────────────────────────────────────────────────────────┘

⏱️ Total Time: <5 minutes (vs 15-30 minutes manual)
```

---

## 🏗️ Technical Architecture

### Stack Overview

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND                                                │
│ Next.js 14 (App Router) + TypeScript                   │
│ Tailwind CSS + Shadcn/ui                               │
│ Zustand (State Management)                             │
│ Developer B: 12 weeks                                  │
└─────────────────────────────────────────────────────────┘
                    ↓ HTTP/HTTPS
┌─────────────────────────────────────────────────────────┐
│ BACKEND                                                 │
│ FastAPI (Python) + Async/Await                         │
│ SQLAlchemy ORM + Alembic Migrations                    │
│ LLM Integration (Ollama via httpx)                     │
│ Document Processing (PyPDF2, openpyxl)                 │
│ Developer A: 12 weeks                                  │
└─────────────────────────────────────────────────────────┘
                    ↓ SQL
┌─────────────────────────────────────────────────────────┐
│ DATABASE                                                │
│ PostgreSQL 15+ (Local)                                  │
│ Tables: projects, test_cases, files, configurations    │
└─────────────────────────────────────────────────────────┘
                    ↓ HTTP
┌─────────────────────────────────────────────────────────┐
│ LLM PROVIDERS                                           │
│ • Ollama (Local) - http://127.0.0.1:11434             │
│   Models: llama3, mistral, codellama, etc.             │
│ • OpenRouter (Cloud) - https://openrouter.ai          │
│   Models: GPT-4, Claude, Llama-3, Mixtral, etc.       │
│ • Deepseek (Cloud) - https://api.deepseek.com         │
│   Models: deepseek-chat, deepseek-coder               │
│ • Google Gemini (Cloud) - https://ai.google.dev       │
│   Models: gemini-pro, gemini-1.5-pro, gemini-flash    │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 Work Split Between 2 Developers

### Developer A - Backend Specialist (Backend + AI + Data)

**Responsibilities:**
- ✅ FastAPI backend development
- ✅ PostgreSQL database design
- ✅ LLM integration (Ollama)
- ✅ AI agents (Planner, Generator, Executor)
- ✅ Document processing (PDF, Excel parsing)
- ✅ Export services (Excel, Markdown generation)
- ✅ API endpoints (RESTful + SSE for progress)
- ✅ Backend testing (unit + integration)

**Key Deliverables:**
1. Working API with Swagger documentation
2. Three AI agents generating test cases
3. Real-time progress via Server-Sent Events
4. Export to Excel and Markdown

---

### Developer B - Frontend Specialist (UI/UX + State + Integration)

**Responsibilities:**
- ✅ Next.js frontend development
- ✅ UI components (Shadcn/ui + Tailwind)
- ✅ State management (Zustand stores)
- ✅ User interactions (drag-drop, inline editing)
- ✅ API integration with backend
- ✅ Real-time progress display (SSE client)
- ✅ Responsive design and accessibility
- ✅ Frontend testing and polishing

**Key Deliverables:**
1. Single-screen, full-width UI
2. Drag-and-drop file upload
3. Configuration drawer
4. Test case preview with filters
5. Inline editing and export UI

---

## 📅 12-Week Timeline with Integration Points

```
┌────────────────────────────────────────────────────────────┐
│  Week 1-2: FOUNDATION & SETUP                              │
├────────────────────────────────────────────────────────────┤
│  Developer A                 │  Developer B                │
│  • Database schema           │  • Next.js setup            │
│  • SQLAlchemy models         │  • Shadcn/ui installation   │
│  • Basic API endpoints       │  • Page layouts             │
│  • CORS setup                │  • Zustand stores           │
│                              │                             │
│  🔗 Integration: Week 2 Friday (2-3 hours)                 │
│     ✅ Test API connection frontend ↔ backend              │
│     ✅ Align API contracts                                 │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Week 3-4: FILE UPLOAD & CONFIGURATION                     │
├────────────────────────────────────────────────────────────┤
│  Developer A                 │  Developer B                │
│  • File upload API           │  • Drag-drop upload         │
│  • PDF/Excel parsers         │  • Config drawer UI         │
│  • Config endpoints          │  • File list display        │
│  • API key encryption        │  • Config state management  │
│                              │                             │
│  🔗 Integration: Week 4 Friday (2-3 hours)                 │
│     ✅ Test file upload end-to-end                         │
│     ✅ Verify config save/load                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Week 5-6: LLM INTEGRATION & PROGRESS UI                   │
├────────────────────────────────────────────────────────────┤
│  Developer A                 │  Developer B                │
│  • Ollama client             │  • Generate button          │
│  • OpenRouter client         │  • Progress display         │
│  • Deepseek client           │  • SSE client (EventSource) │
│  • Google Gemini client      │  • Real-time updates        │
│  • Provider switching        │  • Auto-scroll              │
│  • Planner Agent             │  • API key input UI         │
│  • Generator Agent           │  • Provider selection UI    │
│  • Executor Agent            │                             │
│  • SSE endpoint              │                             │
│                              │                             │
│  🔗 Integration: Week 6 Friday (3-4 hours)                 │
│     ✅ Test generation workflow                            │
│     ✅ Verify real-time progress                           │
│     ✅ Optimize LLM prompts                                │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Week 7-8: TEST CASE MANAGEMENT                            │
├────────────────────────────────────────────────────────────┤
│  Developer A                 │  Developer B                │
│  • Enhanced PDF/Excel parsing│  • Test case cards          │
│  • Batch processing          │  • Preview UI               │
│  • Test case CRUD APIs       │  • Filters & sorting        │
│  • Query optimization        │  • State management         │
│                              │                             │
│  🔗 Integration: Week 8 Friday (2-3 hours)                 │
│     ✅ Test preview, filter, sort                          │
│     ✅ Verify performance                                  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Week 9-10: EXPORT & INLINE EDITING                        │
├────────────────────────────────────────────────────────────┤
│  Developer A                 │  Developer B                │
│  • Excel exporter            │  • Inline editing           │
│  • Markdown exporter         │  • Export UI                │
│  • Export API endpoint       │  • Format selection         │
│  • File streaming            │  • Download triggers        │
│                              │                             │
│  🔗 Integration: Week 10 Friday (3-4 hours)                │
│     ✅ Test complete MVP workflow                          │
│     ✅ Fix critical bugs                                   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Week 11: TESTING & BUG FIXES                              │
├────────────────────────────────────────────────────────────┤
│  Developer A                 │  Developer B                │
│  • Unit tests (70% coverage)│  • Manual testing           │
│  • Integration tests         │  • Accessibility testing    │
│  • Performance optimization  │  • UI polishing             │
│  • Bug fixes                 │  • Bug fixes                │
│                              │                             │
│  🤝 Joint Testing: End-to-end testing together             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Week 12: POLISH & DEPLOYMENT                              │
├────────────────────────────────────────────────────────────┤
│  Developer A                 │  Developer B                │
│  • API documentation         │  • User guide               │
│  • Deployment guide          │  • Demo video               │
│  • Backend deployment        │  • Frontend deployment      │
│  • README                    │  • README                   │
│                              │                             │
│  🚀 Final Deployment: Week 12 Friday - MVP LAUNCH          │
└────────────────────────────────────────────────────────────┘
```

---

## 🔗 Integration Strategy

### Why Integration Sessions Every 2 Weeks?

**Problem:** Two developers working on separate codebases can easily drift apart
**Solution:** Regular 2-hour integration sessions every 2 weeks (Fridays)

### What Happens in Integration Sessions?

1. **Review Progress** (30 min)
   - Developer A demos backend progress
   - Developer B demos frontend progress
   - Discuss challenges and learnings

2. **Test Integration** (60 min)
   - Connect frontend to backend
   - Test new features end-to-end
   - Debug issues together
   - Fix API contract mismatches

3. **Plan Next Sprint** (30 min)
   - Discuss next 2 weeks' tasks
   - Clarify dependencies
   - Agree on API contracts
   - Schedule any ad-hoc meetings if needed

### Daily Communication

- **Daily Standup (15 min, Async):**
  - What did you complete yesterday?
  - What are you working on today?
  - Any blockers?

- **Code Reviews (Ongoing):**
  - Developer A reviews Developer B's PRs
  - Developer B reviews Developer A's PRs
  - Focus on integration impacts

---

## 📦 Phase 1 MVP Deliverables

### At the End of Week 12, You Will Have:

✅ **Working Application**
- Frontend deployed (e.g., Vercel/Netlify)
- Backend deployed (local server or cloud)
- Database running (PostgreSQL)
- Ollama configured (local LLM)

✅ **Complete Workflow**
- Upload files → Generate test cases → Preview → Edit → Export

✅ **Documentation**
- API documentation (Swagger UI)
- User guide (how to use the app)
- Deployment guide (setup instructions)
- Demo video (3-5 minutes)

✅ **Quality Assurance**
- Unit test coverage ≥70%
- No critical bugs
- Performance targets met (<2 min generation)
- Accessible (WCAG 2.1 AA)

---

## 🚫 What's NOT in Phase 1 (Deferred to Phase 2)

The following features are **intentionally excluded** from Phase 1 to ensure we deliver a **workable MVP on time**:

❌ **CSV and PDF Export** - Phase 2  
❌ **PowerPoint (PPTX) Direct Parsing** - Phase 2  
❌ **User Authentication & Multi-User Support** - Phase 2  
❌ **Jira API Direct Integration** - Phase 3  
❌ **Custom Templates** - Phase 3  
❌ **Mobile Application** - Phase 3  

**Rationale:** Focus on core test case generation workflow first. Additional export formats can be added incrementally in future phases without impacting the MVP.

---

## 📊 Success Metrics (Measured at Week 12)

### Functional Metrics
- ✅ **Generation Time:** <2 minutes for single file (15-30 pages)
- ✅ **Test Quality:** 95% of generated test cases acceptable with minimal edits
- ✅ **Input Coverage:** Supports PDF, Excel, and text input
- ✅ **Export Formats:** Excel and Markdown working

### Technical Metrics
- ✅ **Test Coverage:** ≥70% for backend code
- ✅ **API Uptime:** 99% during working hours
- ✅ **Page Load Time:** <3 seconds
- ✅ **Export Time:** <5 seconds for 100 test cases

### User Experience Metrics
- ✅ **Onboarding Time:** New users productive within 15 minutes
- ✅ **Workflow Time:** Complete workflow <5 minutes (upload → export)
- ✅ **Accessibility:** WCAG 2.1 AA compliant

---

## 🎯 Critical Success Factors

### 1. Clear Communication
- **Daily standups** (15 min, async or quick call)
- **Integration sessions** (every 2 weeks, Fridays)
- **Shared documentation** (API contracts, decisions)

### 2. Early Integration Testing
- Don't wait until Week 12 to test integration
- Test each feature end-to-end immediately after development
- Fix integration issues early (they compound over time)

### 3. Use AI Tools Effectively
- **Cursor IDE:** AI-powered code completion and generation
- **GitHub Copilot:** AI pair programmer
- **Leverage for:** Boilerplate code, API endpoints, components, documentation

### 4. Focus on MVP
- **Resist perfectionism:** Ship a workable product, not a perfect one
- **Defer features:** If a feature isn't critical for MVP, push to Phase 2
- **Iterate:** Get feedback early, improve in future phases

### 5. Manage Scope
- **No scope creep:** Politely defer new feature requests to Phase 2
- **Phase 1 scope is locked:** Only bug fixes and critical adjustments allowed
- **Document Phase 2 features:** Keep a backlog for future work

---

## 🚀 Next Steps

### Week 1 Monday - Kickoff Meeting (2 hours)
1. **Review this plan** with both developers
2. **Assign roles:** Developer A (Backend), Developer B (Frontend)
3. **Set up communication channels:**
   - Slack/Discord for daily standups
   - Zoom/Meet for integration sessions
   - GitHub for code reviews
4. **Create GitHub repository:**
   - Monorepo structure: `frontend/` and `backend/`
   - Set up branches: `main`, `develop`, `feature/*`
   - Create GitHub Projects board (Kanban)
5. **Set up development environments:**
   - Install Python 3.10+, Node.js 18+
   - Install PostgreSQL 15+
   - Install Ollama (if available)
   - Install Cursor IDE
6. **Schedule integration sessions:**
   - Week 2 Friday 2:00 PM
   - Week 4 Friday 2:00 PM
   - Week 6 Friday 2:00 PM
   - Week 8 Friday 2:00 PM
   - Week 10 Friday 2:00 PM

### Week 1 Tuesday - Start Development
- Developer A: Begin database schema design
- Developer B: Initialize Next.js project

---

## 📞 Support & Escalation

### Blockers Resolution
- **Immediate blockers (same day):** Discuss on Slack/Discord
- **Daily blockers (1 day):** Schedule quick call (15-30 min)
- **Major blockers (>2 days):** Escalate to Product Owner

### Contact Information
- **Product Owner:** [Name] - [Email]
- **QA Lead:** [Name] - [Email]
- **IT Lead:** [Name] - [Email]

---

## 📚 Full Documentation

For detailed information, refer to:
1. **PROJECT_MANAGEMENT_PLAN.md** - Comprehensive 12-week plan (AI Agent Development Optimized)
   - *Includes all developer work split information, AI prompts, and best practices*
2. **PRD-Consolidated-V2.md** - Product requirements
3. **Software-Requirements-Spec.md** - Technical specifications
4. **UI-Design-Single-Screen.md** - UI/UX design guidelines
5. **KB_FEATURE_IMPLEMENTATION_SUMMARY.md** - Knowledge Base feature details

---

**🎉 Congratulations on embarking on this project!**

With clear work split, regular integration, and focused MVP scope, you're set up for success. Remember:

- **Communicate early and often**
- **Test integration points immediately**
- **Focus on delivering a workable MVP**
- **Use AI tools (Cursor, Copilot) to accelerate development**
- **Celebrate milestones together**

**Good luck! 🚀**

---

**Document Version:** 1.0  
**Date:** November 7, 2025  
**Status:** Final - Ready for Kickoff

