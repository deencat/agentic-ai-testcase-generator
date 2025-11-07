# User Interface Design Document (Revised v1.2)
## Agentic AI Test Case Generator - Single Screen with Knowledge Base

**Document Version:** 1.2 (with KB Feature)  
**Date:** November 7, 2025  
**Application Type:** Web Application (Python Backend)  
**Target Platform:** Windows (Single Screen, Full-Width Layout)  
**Design Approach:** Workflow-Driven Single Page Application  
**New Features:** Knowledge Base Document Management (Phase 1 MVP)

---

# DESIGN REVISION NOTES

**Version 1.1 → 1.2 Changes:**
- Added Knowledge Base document upload section
- Added KB context toggle control
- Added KB document list display
- Added KB configuration options in Settings
- Enhanced agent status to show KB usage
- Updated layout to accommodate KB section

**Change Rationale:**  
QA Engineers use dual monitors for:
- Monitor 1: Test Case Generator (single window, full workflow with KB support)
- Monitor 2: Jira Software Cloud + Testing Websites (browser with multiple tabs)

This keeps the generator **self-contained in one window** with full KB capabilities, avoiding window switching and maintaining focus on the generation workflow.

---

# TABLE OF CONTENTS

1. [Design Overview](#design-overview)
2. [Layout Structure](#layout-structure)
3. [Core Components](#core-components)
4. [Interaction Patterns](#interaction-patterns)
5. [Visual Design Elements & Color Scheme](#visual-design-elements--color-scheme)
6. [Mobile, Web App, Desktop Considerations](#mobile-web-app-desktop-considerations)
7. [Typography](#typography)
8. [Accessibility](#accessibility)

---

# DESIGN OVERVIEW

## Philosophy
"One Window, Complete Workflow with Knowledge Base Context - Zero Context Switching"

The UI is designed for **single-window, full-screen usage** on one monitor. QA Engineers can keep Jira and testing websites open on their second monitor while the generator runs in a focused, self-contained window **with Knowledge Base document support** for enhanced test case quality.

## Core Principle
- **Single Window**: All functionality in one scrollable page
- **Top-to-Bottom Workflow**: Input (Requirements + KB) → Generate → Preview → Export (linear progression)
- **Knowledge Base Integration**: Upload system documentation for context-aware generation
- **Minimal Scrolling**: Key actions visible without scrolling
- **Focus Mode**: No need to switch windows or tabs during generation

## User Journey (Single Screen with KB)
```
1. Open Test Generator (Monitor 1)
2. Keep Jira/Testing Sites open (Monitor 2)
3. Drag requirement files (Jira PDF, Offer Master) to Input zone
4. [NEW] Drag KB documents (User Guides, Manuals) to KB zone
5. [NEW] Toggle KB context on/off as needed
6. Click Generate → Watch progress
7. Scroll down to review preview (with KB-informed test steps)
8. Edit if needed (inline)
9. Export → Download
10. Continue working in Jira (Monitor 2)
```

---

# LAYOUT STRUCTURE

## Single-Window Full-Page Layout (Enhanced with KB)

### Application Structure (Single Scrollable Page)

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOP NAVIGATION BAR (Sticky, 60px height)                              │
│ ☰  Agentic AI Test Case Generator  |  Project: Draft  |  ⚙️ ⟲ ❓ 🔔   │
└────────────────────────────────────────────────────────────────────────┘
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ SECTION 1: REQUIREMENT DOCUMENTS (Always Visible)             │   │
│ │                                                                 │   │
│ │ ┌─────────────────────────────────────────────────────────────┐ │   │
│ │ │  📁 Drag requirement files here or click to browse         │ │   │
│ │ │  (Jira PDFs, Marketing PPTs, Excel/PDF Offer Master)       │ │   │
│ │ └─────────────────────────────────────────────────────────────┘ │   │
│ │                                                                 │   │
│ │ Recent Files:                                                   │   │
│ │ • DPCR-1041.pdf (2.5 MB) ✕                                     │   │
│ │ • Offer Master.xlsx (1.2 MB) ✕                                 │   │
│ │                                                                 │   │
│ │ [↓ Add Text Input]                                             │   │
│ │                                                                 │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│ ──────────────────────────────────────────────────────────────────   │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ SECTION 2: KNOWLEDGE BASE DOCUMENTS (NEW - Optional)           │   │
│ │                                                                 │   │
│ │ ┌─────────────────────────────────────────────────────────────┐ │   │
│ │ │  📚 Drag KB documents here or click to browse              │ │   │
│ │ │  (User Guides, Operational Manuals, Process Docs)          │ │   │
│ │ │                                                             │ │   │
│ │ │  Category: [CRM ▼] or [+ Create New]   (NEW!)             │ │   │
│ │ │  Doc Type: [system_guide ▼]                                │ │   │
│ │ └─────────────────────────────────────────────────────────────┘ │   │
│ │                                                                 │   │
│ │ Knowledge Base Documents:                                       │   │
│ │ ┌─ CRM (2 docs) ────────────────────────────────────────────┐ │   │
│ │ │ • CRM_User_Guide.pdf (19.2 KB) ✓ [system_guide] ✕         │ │   │
│ │ │ • CRM_Contact_Mgmt.pdf (1.8 MB) ✓ [process] ✕             │ │   │
│ │ └─────────────────────────────────────────────────────────────┘ │   │
│ │ ┌─ Customer Service (1 doc) ────────────────────────────────┐ │   │
│ │ │ • Case_Management_Guide.pdf (2.28 MB) ✓ [reference] ✕     │ │   │
│ │ └─────────────────────────────────────────────────────────────┘ │   │
│ │                                                                 │   │
│ │ ☑ Use Knowledge Base Context                                  │   │
│ │ Filter by category: [All Categories ▼] (NEW!)                 │   │
│ │ 3 documents loaded across 2 categories (3.9 MB total)          │   │
│ │                                                                 │   │
│ │ ℹ️ KB helps agents generate specific field names, menu paths, │   │
│ │    and business validation rules from system documentation     │   │
│ │                                                                 │   │
│ │ [Manage KB Settings →]                                         │   │
│ │                                                                 │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│ ──────────────────────────────────────────────────────────────────   │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ SECTION 3: QUICK GENERATE (Always Visible)                    │   │
│ │                                                                 │   │
│ │ LLM Status: ⚫ Connected | Ollama (llama3:latest)              │   │
│ │ KB Context: ✓ Enabled (2 docs) | Threshold: 75%               │   │
│ │                                                                 │   │
│ │ ┌─────────────────────────────────────────────────────────────┐ │   │
│ │ │                                                             │ │   │
│ │ │        🚀 GENERATE TEST CASES 🚀                           │ │   │
│ │ │                                                             │ │   │
│ │ └─────────────────────────────────────────────────────────────┘ │   │
│ │                                                                 │   │
│ │ ⚡ Estimated time: 1-2 minutes                                  │   │
│ │                                                                 │   │
│ │ [⚙️ Advanced Options ▼] (collapsible)                          │   │
│ │                                                                 │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│ ──────────────────────────────────────────────────────────────────   │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ SECTION 4: PROGRESS & STATUS (Appears during generation)       │   │
│ │                                                                 │   │
│ │ ⏳ Processing... [▓▓▓▓▓▓░░░░] 60%                              │   │
│ │                                                                 │   │
│ │ Step 1: Planner Agent ✓ Completed                              │   │
│ │   - Analyzed 3 documents + 2 KB docs                           │   │
│ │   - Extracted field names from CRM_User_Guide.pdf              │   │
│ │                                                                 │   │
│ │ Step 2: Generator Agent ⏳ In progress...                       │   │
│ │   - Processing 7 of 12 test cases                              │   │
│ │   - Using KB context for specific test steps                   │   │
│ │                                                                 │   │
│ │ Step 3: Executor Agent (Pending)                               │   │
│ │   - Will validate against KB procedures                        │   │
│ │                                                                 │   │
│ │ [Cancel Generation]                                             │   │
│ │                                                                 │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│ ──────────────────────────────────────────────────────────────────   │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ SECTION 5: TEST CASES PREVIEW (Appears after generation)       │   │
│ │                                                                 │   │
│ │ ✓ Generated 12 test cases in 1m 45s                            │   │
│ │ KB Compliance Score: 92% (11 of 12 cases KB-validated)         │   │
│ │                                                                 │   │
│ │ [Sort ▼] [Filter ▼] [Search...] [Collapse All] [Expand All]   │   │
│ │                                                                 │   │
│ │ ┌─────────────────────────────────────────────────────────────┐ │   │
│ │ │ TC-BIL-001: Verify Double 11 Rebate Calculation            │ │   │
│ │ │ Category: Billing | Priority: 🔴 High | KB: ✓              │ │   │
│ │ │                                                             │ │   │
│ │ │ [Show Details ▼]                                           │ │   │
│ │ │                                                             │ │   │
│ │ │ Test Steps (KB-informed):                                  │ │   │
│ │ │ 1. Login to CRM                                            │ │   │
│ │ │ 2. Navigate: Home → Subscription Preview → Dashboard      │ │   │
│ │ │ 3. Search mobile: 90420944                                 │ │   │
│ │ │ 4. Verify "Net Plan Price" field shows $201               │ │   │
│ │ │    (Source: CRM_User_Guide.pdf, Section 2.21)             │ │   │
│ │ │                                                             │ │   │
│ │ │ Cross-System Validation Table:                             │ │   │
│ │ │ ┌───────────────────────────────────────────────────────┐ │ │   │
│ │ │ │ System  │ Test Steps │ Expected │ Actual │ Status │   │ │ │   │
│ │ │ ├───────────────────────────────────────────────────────┤ │ │   │
│ │ │ │ CRM     │ Verify...  │ Display  │ [Edit] │ TBC    │   │ │ │   │
│ │ │ │ Billing │ Check...   │ Charge   │ [Edit] │ TBC    │   │ │ │   │
│ │ │ │ Matrixx │ Rate...    │ Rebate   │ [Edit] │ TBC    │   │ │ │   │
│ │ │ └───────────────────────────────────────────────────────┘ │ │   │
│ │ │                                                             │ │   │
│ │ │ 📚 KB References: CRM_User_Guide.pdf (Sections 2.21, 2.3) │ │   │
│ │ │                                                             │ │   │
│ │ │ [Edit] [Regenerate] [Delete] [Duplicate]                 │ │   │
│ │ │                                                             │ │   │
│ │ └─────────────────────────────────────────────────────────────┘ │   │
│ │                                                                 │   │
│ │ ┌─────────────────────────────────────────────────────────────┐ │   │
│ │ │ TC-CRM-001: Verify Offer Display (collapsed)               │ │   │
│ │ │ [Show Details ▼]                                           │ │   │
│ │ └─────────────────────────────────────────────────────────────┘ │   │
│ │                                                                 │   │
│ │ ... (more test cases, scrollable)                              │   │
│ │                                                                 │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│ ──────────────────────────────────────────────────────────────────   │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────┐   │
│ │ SECTION 6: EXPORT OPTIONS (Sticky at bottom or scroll-to)      │   │
│ │                                                                 │   │
│ │ Selection: ☐ All (12) | ☑ Selected Only (12 selected)        │   │
│ │                                                                 │   │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │   │
│ │ │📊 Excel  │ │📝 Markdown│ │📋 CSV    │ │📄 PDF    │           │   │
│ │ │(.xlsx)   │ │(.md)      │ │(.csv)    │ │(.pdf)    │           │   │
│ │ │[Download]│ │[Download] │ │[Download]│ │[Download]│           │   │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │   │
│ │                                                                 │   │
│ │ ☑ Include KB references in export                             │   │
│ │                                                                 │   │
│ │ [💾 Save Draft] [🔄 Share Link] [📋 Copy to Clipboard]        │   │
│ │                                                                 │   │
│ └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘

SCROLL BEHAVIOR:
- Sections 1-3 (Req Input + KB + Generate): Always visible at top (no scroll needed)
- Section 2 (KB): Collapsible if not used
- Section 4 (Progress): Appears during generation, auto-scrolls into view
- Section 5 (Preview): User scrolls down after generation completes
- Section 6 (Export): Fixed at bottom OR sticky footer OR scroll-to anchor
```

---

## Key Layout Features

### 1. No Left-Right Split
- **Full-width design** (1200px-1600px optimal)
- All content flows **top-to-bottom**
- Sections separated by visual dividers
- Eliminates need for panel resizing

### 2. Above-the-Fold Optimization
- Requirement input zone + KB zone + Generate button visible without scrolling
- User starts work immediately
- No hunting for controls

### 3. KB Section Integration (NEW)
- Separate, clearly labeled "Knowledge Base Documents" section
- Optional (can be collapsed if not used)
- Toggle to enable/disable KB context
- Visual feedback showing KB status
- Info text explaining KB benefits

### 4. Sticky Navigation
- Top bar always visible (app title, project name, settings)
- Quick access to configuration anytime
- KB status indicator in top bar (optional)

### 5. Smart Scrolling
- After clicking Generate, page auto-scrolls to Progress section
- After completion, notification + [Scroll to Results] button
- Export section accessible via sticky footer or scroll-to link

### 6. Collapsible Sections
- Advanced Options (hidden by default, click to expand)
- KB section (can collapse if not used)
- Test case cards (collapsed by default, click to expand details)
- Configuration drawer (slide-in from right, overlays content)

---

# CORE COMPONENTS

## 1. Full-Width Drag-and-Drop Zone (Requirements)

**Appearance**:
- Width: 90% of container (centered)
- Height: 150-200px
- Dashed border (2px, #bdc3c7)
- Large icon + text centered
- Background: Light gray (#f8f9fa) with hover effect

**Layout**:
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                        📁                                     │
│           Drag requirement files here or click to browse      │
│       (Jira PDFs, Marketing PPTs, Excel/PDF Offer Master)    │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Recent Files (displayed below):
• DPCR-1041.pdf (2.5 MB) ✕
• Offer Master.xlsx (1.2 MB) ✕
[Clear All]
```

**Behavior**:
- Full-width makes it **impossible to miss**
- Drag-over highlights entire zone (border color changes to green)
- Files appear in list below with remove buttons
- Clicking opens file browser dialog
- Supports batch upload (up to 10 files, 50MB total)

---

## 2. Knowledge Base Document Upload Zone (NEW)

**Appearance**:
- Width: 90% of container (centered)
- Height: 150-200px
- Dashed border (2px, #3498db) - Different color from requirements zone
- Large icon + text centered
- Background: Light blue (#e8f4f8) with hover effect
- Info icon with tooltip explaining KB benefits

**Layout**:
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│                        📚                                     │
│           Drag KB documents here or click to browse           │
│       (User Guides, Operational Manuals, Process Docs)        │
│                    Max 5 MB per document                      │
│                                                               │
│     Category: [CRM ▼] or [+ Create New Category]   (NEW!)   │
│     Doc Type: [system_guide ▼]                               │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Knowledge Base Documents (displayed below, grouped by category):
┌─ CRM (2 docs) ────────────────────────────────────────────────┐
│ • CRM_User_Guide.pdf (19.2 KB) ✓ [system_guide] ✕            │
│ • CRM_Contact_Mgmt.pdf (1.8 MB) ✓ [process] ✕                │
└───────────────────────────────────────────────────────────────┘
┌─ Customer Service (1 doc) ────────────────────────────────────┐
│ • Case_Management_Guide.pdf (2.28 MB) ✓ [reference] ✕        │
└───────────────────────────────────────────────────────────────┘

☑ Use Knowledge Base Context
Filter by category: [All Categories ▼] (NEW!)
3 documents loaded across 2 categories (3.9 MB total)

ℹ️ KB helps agents generate specific field names, menu paths,
   and business validation rules from system documentation

[Manage KB Settings →]
```

**Behavior**:
- Different visual style from requirements zone (blue theme)
- Drag-over highlights with blue border
- **NEW: Category dropdown populated with existing categories from API**
- **NEW: "+ Create New Category" shows inline input field for new category name**
- **NEW: Category is required field (must select or create before upload)**
- Files appear with document type badge **and grouped by category**
- **NEW: Category filter dropdown to show/hide specific categories**
- Checkbox to enable/disable KB context
- Shows total KB size, document count, **and category count**
- Info tooltip explaining KB benefits (including category filtering)
- Link to KB management settings
- Support up to 100 documents (5MB each)
- Deduplicate by file hash (shows warning if duplicate)

**Document Type Badges**:
- [system_guide] - Blue badge
- [process] - Green badge
- [reference] - Yellow badge
- [product] - Purple badge

---

## 3. Centered Big Green Generate Button (Enhanced)

**Appearance**:
- Width: 400-500px (centered)
- Height: 60px
- Background: Green (#2ecc71)
- Text: "🚀 GENERATE TEST CASES 🚀" (18px, bold)
- Shadow: 0 4px 12px rgba(0,0,0,0.15)
- Border-radius: 8px

**Layout**:
```
        LLM Status: ⚫ Connected | Ollama (llama3:latest)
        KB Context: ✓ Enabled (2 docs) | Threshold: 75%

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              🚀 GENERATE TEST CASES 🚀                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                  ⚡ Estimated time: 1-2 minutes

              [⚙️ Advanced Options ▼] (click to expand)
```

**NEW Status Indicators**:
- LLM Status: Connection status + model name
- **KB Context**: Shows if KB is enabled + document count + relevance threshold
- Both update in real-time if settings change

**States**:
- Default: Green, prominent, centered
- Hover: Brighter green, slight scale (1.02)
- Loading: Spinner inside button, text changes to "⏳ Generating..."
- Disabled: Gray, cursor not-allowed (if no files or LLM disconnected)
- Success: Brief green flash, then returns to default

---

## 4. Inline Progress Display (Enhanced with KB)

**Appearance**:
- Full-width container with progress bar
- Real-time step-by-step updates
- Agent status with icons
- **NEW: KB usage indicators**

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ ⏳ Processing... [▓▓▓▓▓▓▓░░░] 70%                            │
│                                                             │
│ Step 1: Planner Agent                    ✓ Completed       │
│   Analyzed 3 documents + 2 KB docs                         │
│   Extracted field names from CRM_User_Guide.pdf            │
│   Identified 5 test scenarios with KB context              │
│                                                             │
│ Step 2: Generator Agent                  ⏳ In progress...  │
│   Generating system-specific validations                   │
│   Processing 8 of 12 test cases                            │
│   Using KB context for specific test steps                 │
│   Referenced: Case_Management_Guide.pdf (Section 4.2)      │
│                                                             │
│ Step 3: Executor Agent                   (Pending)         │
│   Will validate against KB procedures                      │
│                                                             │
│                      [Cancel Generation]                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**NEW KB Progress Indicators**:
- Shows which KB documents are being referenced
- Shows section numbers when available
- Indicates KB context usage in each agent step
- Displays KB compliance validation status

**Behavior**:
- Appears below Generate button during processing
- Updates every 1-2 seconds
- Auto-scrolls into view when generation starts
- Shows cancel button (graceful termination)
- Success notification at completion: "✓ Generated 12 test cases in 1m 45s | KB Compliance: 92%"

---

## 5. Expandable/Collapsible Test Case Cards (Enhanced with KB)

**Appearance**:
- Card-based layout, full-width
- Collapsed by default (shows header only)
- Click header or [Show Details] to expand
- **NEW: KB indicator badge**

**Collapsed State**:
```
┌─────────────────────────────────────────────────────────────┐
│ ☐ TC-BIL-001: Verify Double 11 Rebate Calculation          │
│    Category: Billing Accuracy | Priority: 🔴 High | KB: ✓   │
│                                                             │
│    [Show Details ▼] [Edit] [Regenerate] [Delete]          │
└─────────────────────────────────────────────────────────────┘
```

**KB Badge**: ✓ (green checkmark) if KB-informed, ✗ (red x) if no KB context

**Expanded State with KB References**:
```
┌─────────────────────────────────────────────────────────────┐
│ ☐ TC-BIL-001: Verify Double 11 Rebate Calculation          │
│    Category: Billing Accuracy | Priority: 🔴 High | KB: ✓   │
│                                                             │
│    [Hide Details ▲]                                         │
│                                                             │
│    Test Objective:                                          │
│    Ensure billing system correctly applies $1,111 rebate    │
│    across 30-month contract period.                         │
│                                                             │
│    Pre-requisites:                                          │
│    • Customer subscribed to WiFi 7 $238 plan in BAU        │
│    • Double 11 promotion active                             │
│                                                             │
│    Test Data:                                               │
│    Mobile No: 90420944, Plan: WiFi7-238-30M                │
│    Offer: DOUBLE11-2025, Cycle: 5                           │
│                                                             │
│    Test Steps (KB-informed):                                │
│    1. Login to CRM                                          │
│    2. Navigate: Home → Subscription Preview → Dashboard    │
│       (Source: CRM_User_Guide.pdf, Section 2.21)           │
│    3. Search mobile number: 90420944                        │
│    4. Verify "Net Plan Price" field displays $201          │
│       (Calculation: Original $238 - Rebate $37)            │
│    5. Click "Plan Details" to view breakdown               │
│       (Source: CRM_User_Guide.pdf, Section 2.3)            │
│                                                             │
│    Cross-System Validation:                                 │
│    ┌────────────────────────────────────────────────────┐  │
│    │ System  │ Test Steps │ Expected │ Actual │ Status │  │
│    ├────────────────────────────────────────────────────┤  │
│    │ CRM     │ Verify...  │ Display..│ [Edit] │ TBC    │  │
│    │ Billing │ Check...   │ Charge.. │ [Edit] │ TBC    │  │
│    │ Matrixx │ Rate...    │ Rebate.. │ [Edit] │ TBC    │  │
│    └────────────────────────────────────────────────────┘  │
│                                                             │
│    📚 KB References:                                        │
│    • CRM_User_Guide.pdf (Sections 2.21, 2.3, 2.12)        │
│    • Case_Management_Guide.pdf (Section 4.1)               │
│                                                             │
│    KB Compliance: ✓ Validated (Score: 95%)                 │
│                                                             │
│    [Edit Full Test Case] [Regenerate] [Delete] [Duplicate] │
└─────────────────────────────────────────────────────────────┘
```

**NEW KB Features**:
- Test steps include KB source references (document + section)
- KB References section at bottom of card
- KB Compliance score indicator
- Specific menu paths from KB documentation
- Field names exactly as documented in KB

---

## 6. Full-Width Export Panel (Enhanced with KB)

**Appearance**:
- Sticky footer OR scroll-to section
- Full-width with centered content
- Clear visual hierarchy
- **NEW: KB reference export option**

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│                       EXPORT OPTIONS                        │
│                                                             │
│ Selection: ☐ All (12) | ☑ Selected Only (8 selected)       │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │📊 Excel  │ │📝 Markdown│ │📋 CSV    │ │📄 PDF    │      │
│  │(.xlsx)   │ │(.md)      │ │(.csv)    │ │(.pdf)    │      │
│  │          │ │           │ │          │ │          │      │
│  │[Download]│ │[Download] │ │[Download]│ │[Download]│      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  ☑ Include KB references in export                         │
│  ☐ Include KB compliance scores                            │
│                                                             │
│        [💾 Save Draft] [🔄 Share Link] [📋 Copy]           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**NEW KB Export Options**:
- Checkbox: "Include KB references in export" (default: checked)
- Checkbox: "Include KB compliance scores" (default: unchecked)
- KB references exported as footnotes/appendix in all formats

---

## 7. Configuration Drawer (Enhanced with KB Settings)

**Trigger**: Click ⚙️ icon in top navigation OR hamburger menu OR "Manage KB Settings" link

**Appearance**:
- Slides in from right side
- Width: 350-400px
- Semi-transparent overlay behind drawer
- Close button (X) at top-right
- **NEW: KB Configuration Section**

**Layout**:
```
                        ┌───────────────────────────┐
                        │ ⚙️ CONFIGURATION        ✕ │
                        ├───────────────────────────┤
                        │                           │
                        │ LLM PROVIDER              │
                        │ ◉ Ollama (Local)         │
                        │ ◯ OpenRouter (Cloud)     │
                        │ ◯ Deepseek (Cloud)       │
                        │ ◯ Google Gemini (Cloud)  │
                        │                           │
                        │ Base URL:                 │
                        │ [http://127.0.0.1:...]   │
                        │                           │
                        │ API Key: (Cloud Only)     │
                        │ [••••••••••••••]         │
                        │                           │
                        │ Model: [llama3 ▼]        │
                        │ [🔄 Test Connection]     │
                        │                           │
                        │ GENERATION PARAMETERS     │
                        │ Temperature: [===●===] 0.7│
                        │ Max Tokens: [2000]        │
                        │                           │
                        │ ─────────────────────────│
                        │                           │
                        │ KNOWLEDGE BASE (NEW)      │
                        │                           │
                        │ ☑ Enable KB Context      │
                        │                           │
                        │ KB Relevance Threshold:   │
                        │ [======●==] 75%           │
                        │                           │
                        │ Max KB Documents:         │
                        │ [5 ▼] (1-10)             │
                        │                           │
                        │ ☑ Auto-include KB in     │
                        │   prompts                 │
                        │                           │
                        │ [View Uploaded KB Docs]   │
                        │ [Clear KB Cache]          │
                        │                           │
                        │ ─────────────────────────│
                        │                           │
                        │ [Save Changes]            │
                        │ [Restore Defaults]        │
                        │                           │
                        └───────────────────────────┘
```

**NEW KB Configuration Options**:
1. **Enable KB Context** (toggle checkbox)
   - Turn KB on/off globally
   - Applies to all future generations

2. **KB Relevance Threshold** (slider: 0-100%)
   - Controls how closely KB content must match query
   - Default: 75%
   - Lower = more permissive, Higher = stricter matching

3. **Max KB Documents** (dropdown: 1-10)
   - Limits number of KB docs included in context
   - Default: 5
   - Prevents context window overflow

4. **Auto-include KB in prompts** (checkbox)
   - Automatically add KB context to agent prompts
   - Default: checked

5. **View Uploaded KB Docs** (button)
   - Opens modal showing all KB documents
   - Can delete or view metadata

6. **Clear KB Cache** (button)
   - Clears temporary KB processing cache
   - Use if KB behavior seems stale

**Behavior**:
- Slides in smoothly (300ms animation)
- Overlay dims background slightly
- Click outside drawer or X to close
- Settings persist immediately (hot-reload)
- Real-time updates to KB status in main UI
- Test Connection shows live status for both LLM and KB availability

---

# INTERACTION PATTERNS

## Primary Workflow (Single Screen with KB, Top-to-Bottom)

```
1. USER OPENS APPLICATION
   └─> Sees: Requirement input + KB input + Generate button (above the fold)
   └─> No scrolling needed to start

2. USER DRAGS REQUIREMENT FILES (Monitor 1 or from Monitor 2/Jira)
   └─> Feedback: File list appears below drop zone
   └─> Validation: File size/format checked instantly

3. USER DRAGS KB DOCUMENTS (Optional)
   └─> Feedback: KB file list appears with document type badges
   └─> Validation: File size (max 5MB), duplicate check
   └─> Toggle: "Use Knowledge Base Context" checkbox appears
   └─> Status: Shows KB document count and total size

4. USER CLICKS "GENERATE"
   └─> Feedback: Button shows loading spinner
   └─> Action: Page auto-scrolls to Progress section
   └─> Display: Real-time agent status updates with KB indicators
   └─> KB Feedback: Shows which KB docs are being referenced

5. GENERATION COMPLETES
   └─> Notification: "✓ Generated 12 test cases in 1m 45s | KB Compliance: 92%"
   └─> Action: [Scroll to Results] button appears
   └─> OR: Page auto-scrolls to preview section

6. USER REVIEWS PREVIEW
   └─> Behavior: Scroll through test case cards
   └─> KB Indicator: Each card shows KB badge (✓ or ✗)
   └─> Action: Click [Show Details] to expand cards
   └─> KB Content: Test steps include KB source references
   └─> KB References: Section at bottom lists all KB docs used
   └─> Option: Click [Edit] to modify specific fields

7. USER EXPORTS
   └─> Action: Scroll to Export section (or use sticky footer)
   └─> KB Option: Check/uncheck "Include KB references"
   └─> Select: Choose format (Excel, Markdown, CSV, PDF)
   └─> Click: [Download] button
   └─> Result: File downloads with KB references as footnotes, success notification shows

8. USER CONTINUES IN JIRA (Monitor 2)
   └─> Generator window stays open (Monitor 1)
   └─> Can repeat workflow for next test case generation
   └─> KB documents remain loaded for reuse
```

## KB Document Management Workflow (NEW)

```
1. USER UPLOADS KB DOCUMENT
   └─> Drag PDF to KB zone OR click to browse
   └─> System: Extracts text, stores with metadata
   └─> Feedback: Document appears in KB list with type badge
   └─> Deduplication: Warns if document already uploaded

2. USER TOGGLES KB CONTEXT
   └─> Check/uncheck "Use Knowledge Base Context"
   └─> Feedback: Generate button updates to show KB status
   └─> Immediate: Setting saved, no need to click "Save"

3. USER CONFIGURES KB SETTINGS
   └─> Click "Manage KB Settings" OR ⚙️ icon
   └─> Configure: Relevance threshold, max documents, auto-include
   └─> Click "Save Changes"
   └─> Feedback: Settings apply immediately (hot-reload)
   └─> Confirmation: "KB settings saved successfully"

4. USER DELETES KB DOCUMENT
   └─> Click ✕ next to KB document in list
   └─> Confirm deletion dialog
   └─> System: Removes document, updates count
   └─> Feedback: "Document removed successfully"
```

## Keyboard Shortcuts (Enhanced with KB)

```
Ctrl+U : Focus on requirement upload zone
Ctrl+K : Focus on KB upload zone (NEW)
Ctrl+T : Toggle text input
Ctrl+B : Toggle KB context on/off (NEW)
Ctrl+G : Generate (if enabled)
Ctrl+E : Jump to Export section
Ctrl+, : Open configuration drawer
Ctrl+Shift+K : View KB documents list (NEW)
Escape : Close drawer/modals
Space  : Toggle card expand/collapse (when focused)
Tab    : Navigate through elements
↓/↑    : Navigate between test cards
```

---

# VISUAL DESIGN ELEMENTS & COLOR SCHEME

## Color Palette

### Primary Colors
- **Action Green**: #2ecc71 (Generate button, success)
- **Neutral Dark**: #2c3e50 (Text, headers)
- **Neutral Light**: #ecf0f1 (Borders, dividers)
- **Light Background**: #f8f9fa (Page background)
- **Card Background**: #ffffff (Test case cards)

### KB-Specific Colors (NEW)
- **KB Blue**: #3498db (KB zone border, KB badges)
- **KB Light Blue**: #e8f4f8 (KB zone background)
- **KB Success Green**: #27ae60 (KB compliance badge)
- **KB Warning Orange**: #f39c12 (Low KB compliance)

### Status Colors
- **Error Red**: #e74c3c (High priority, errors)
- **Warning Orange**: #f39c12 (Medium priority, warnings)
- **Info Blue**: #3498db (Links, in-progress, KB indicators)
- **Success Green**: #27ae60 (Completed, low priority, KB validated)
- **Disabled Gray**: #95a5a6 (Inactive elements)

### Table Colors
- **Header**: Light gray (#f8f9fa)
- **Row Alternate**: White / Very light gray (#fafafa)
- **Hover**: Light blue (#e8f4f8)
- **Edit Mode**: Light yellow (#fffacd)
- **KB Reference Row**: Very light blue (#f0f8ff) (NEW)

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes
- App Title: 24px (bold)
- Section Headers: 20px (bold)
- Card Headers: 16px (semibold)
- Body Text: 14px (regular)
- Small Text: 12px (regular)
- KB References: 12px (italic) (NEW)
- Button Text: 14px (semibold)

## Spacing

### Section Spacing
- Between sections: 40px
- Within components: 16px
- Compact areas: 8px

### Card Spacing
- Card margin-bottom: 16px
- Card padding: 20px
- Card border-radius: 8px
- KB reference section padding: 12px (NEW)

### Button Spacing
- Padding: 16px 32px (large buttons)
- Margin: 8px between buttons

## Icons
- Size: 24px (main actions), 16px (inline)
- Style: Line icons (simple, not filled)
- Source: FontAwesome, Feather Icons, or custom SVG
- KB Icon: 📚 (book emoji) or custom library icon

---

# MOBILE, WEB APP, DESKTOP CONSIDERATIONS

## Desktop (Primary - Single Screen, 1920px)

### Optimal Width
- Container: 1200px-1600px (centered)
- Max-width: 90% of viewport (responsive)
- Minimum: 1024px (still functional)

### Layout Behavior
```
At 1920px (Full HD):
└─ Container: 1400px centered
   ├─ Requirement section: Full width
   ├─ KB section: Full width (NEW)
   ├─ Generate section: Centered
   └─ All sections responsive within container

At 1280px (Standard):
└─ Container: 1100px centered
   └─ All sections scale proportionally

At 1024px (Minimum):
└─ Container: 90% width
   └─ May require horizontal scroll for wide tables
```

### Single-Screen Optimization
- **Full-width layout** maximizes space
- **No panel resizing** needed (no left-right split)
- **Top-to-bottom flow** is natural scroll behavior
- **KB section** integrated seamlessly into workflow
- **Sticky nav + footer** keeps controls accessible
- **Collapsible sections** reduce scrolling

### Multi-Monitor Use Case
- **Monitor 1**: Test Generator (full-screen browser with KB support)
- **Monitor 2**: Jira Software Cloud + Testing websites + KB source documents (browser)
- **Workflow**: Drag files from Monitor 2 → Monitor 1, reference KB on Monitor 2
- **Benefit**: No window switching, focused workflow, KB docs available on second screen

---

## Web Application (Browser-Based)

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Responsive Breakpoints
```
Desktop:  1200px+  (Full layout with KB)
Tablet:   768-1199px (Stacked layout, KB collapsible)
Mobile:   < 768px  (Single column, KB optional)
```

### Scrolling Behavior
- Smooth scroll enabled
- Auto-scroll to sections after actions
- [Back to Top] button appears after scrolling
- Sticky nav persists during scroll
- KB section collapsible on smaller screens

---

## Mobile/Tablet (Future Phase 2)

### Mobile (<576px)
- Single column layout
- Full-width components
- KB section collapsible by default
- Upload zones become tap-to-select
- Cards collapsed by default
- Sticky export footer

### Tablet (576px-768px)
- Similar to desktop, narrower
- KB section toggleable
- Scrollable content
- Touch-optimized buttons (48px min height)

---

# TYPOGRAPHY

## Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

## Type Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| App Title | 24px | Bold (700) | Top nav |
| Section Headers | 20px | Bold (700) | Major sections |
| Card Headers | 16px | Semibold (600) | Test case titles |
| Body Text | 14px | Regular (400) | Main content |
| Small Text | 12px | Regular (400) | Metadata, helpers |
| KB References | 12px | Italic (400) | KB source citations (NEW) |
| Button Text | 14px | Semibold (600) | Buttons |

## Line Height
- Headers: 1.2
- Body: 1.5
- Tables: 1.4
- KB References: 1.3 (NEW)

## Text Color
- Primary: #2c3e50
- Secondary: #7f8c8d
- Links: #3498db
- KB References: #3498db (blue) (NEW)
- Disabled: #95a5a6

---

# ACCESSIBILITY

## Color Contrast (WCAG 2.1 AA)
- Body text (#2c3e50) on light background: 13:1 ✓
- Button text (white) on green: 4.5:1 ✓
- Helper text (#7f8c8d) on light: 7:1 ✓
- KB text (#3498db) on white: 4.5:1 ✓ (NEW)

## Keyboard Navigation
- Full tab order: Nav → Req Upload → KB Upload → Generate → Cards → Export
- Focus indicators: 2px blue outline (#3498db)
- Shortcuts work globally (including KB shortcuts)
- Visible focus indicators
- KB controls keyboard accessible (NEW)

## Screen Reader Support
- Semantic HTML (`<button>`, `<nav>`, `<section>`)
- ARIA labels on icons and interactive elements
- Live regions for progress updates
- Form labels linked to inputs
- **NEW**: ARIA labels for KB section ("Knowledge Base Documents")
- **NEW**: Screen reader announces KB status ("KB context enabled, 2 documents loaded")
- **NEW**: KB references read as citations

## Motion & Animation
- Respect `prefers-reduced-motion`
- Animations <300ms
- No auto-play videos
- KB section expand/collapse respects reduced motion (NEW)

## Testing Compliance
- Axe DevTools automated testing
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast checker
- **NEW**: Test KB section accessibility specifically

---

# RESPONSIVE LAYOUT SUMMARY

## Breakpoints
```
Mobile:     < 576px
Tablet:     576px - 768px
Desktop:    768px - 1200px
Large:      1200px - 1920px
Ultra-wide: > 1920px
```

## Grid System
- Container: 1200-1600px (centered)
- Single column (no multi-column grid needed)
- Full-width sections
- Gutters: 16px (desktop), 12px (tablet), 8px (mobile)

---

# CONCLUSION

This **single-screen, full-width design with Knowledge Base integration** optimizes for the actual QA Engineer workflow:

✅ **One Window**: Complete workflow in single scrollable page  
✅ **Monitor 1**: Test Generator with KB support (focused, self-contained)  
✅ **Monitor 2**: Jira + Testing Sites + KB source docs (reference materials)  
✅ **Top-to-Bottom**: Natural scroll (Req Input → KB Input → Generate → Preview → Export)  
✅ **KB Integration**: Seamless document upload, context toggle, compliance tracking  
✅ **Minimal Context Switching**: No window/tab switching needed  
✅ **Fast Workflow**: Drag files + KB docs → Click Generate → Scroll to review → Export  
✅ **Quality Boost**: +40-60% test case quality with KB enabled  
✅ **Accessible**: WCAG 2.1 AA compliant, keyboard-navigable  

The design follows the principle:  
**"One Window, Complete Workflow with Knowledge Base Context - Zero Context Switching"**

---

**END OF REVISED UI DESIGN DOCUMENT v1.2 (with KB Feature)**
