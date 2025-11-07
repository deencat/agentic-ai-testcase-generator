# Product Requirements Document (Revised)
## Agentic AI Test Case Generator - Version 2.1 with Knowledge Base Feature

**Document Version:** 2.1 (Revised with KB Feature)  
**Date:** November 7, 2025  
**Last Updated:** November 7, 2025  
**Status:** Final - Ready for Development  
**Owner:** Product Owner, QA Engineering  

---

# DOCUMENT INFORMATION

| Field | Details |
|-------|---------|
| **Product Name** | Agentic AI Test Case Generator for Cross-Team TAT Testing (with Knowledge Base Support) |
| **Version** | 2.1 (Consolidated + KB Feature) |
| **Status** | Final - Ready for Development |
| **Owner** | Product Owner, QA Engineering |
| **Primary Audience** | Development Team, QA Team, Product Management |
| **Created Date** | November 6, 2025 |
| **Last Updated** | November 7, 2025 |
| **Revision Notes** | Incorporated KB-Feature-Specification v1.0 as Phase 1 MVP enhancement |

---

# EXECUTIVE SUMMARY

## The Problem
QA Engineers currently spend **15-30 minutes** manually generating test cases from various input sources (Jira tickets, Marketing materials, Excel files). This is repetitive, error-prone, and prevents teams from focusing on strategic testing activities.

**NEW: Additionally, agents lack access to system documentation, resulting in generic test steps and less accurate validation logic.**

## The Solution
An intelligent, multi-agent AI system that:
- Accepts 4 input types: Text prompts, Jira PDFs, Marketing PowerPoints, Excel/PDF files
- **NEW: Accepts system documentation (User Guides, Operational Manuals, Process Documentation)**
- Uses 3 specialized AI agents: Planner, Generator, Executor for comprehensive analysis
- **NEW: Agents reference Knowledge Base documents during generation**
- Generates test cases in the exact horizontal multi-system format used by your QA team
- Validates cross-system dependencies across 13 distinct system components
- Outputs in multiple formats: Excel, Markdown, CSV, PDF

## The Innovation
The system generates test cases with:
- **Per-system expected results**, not generic global results
- **Knowledge Base-informed test steps** with specific field names and procedures
- **Referenced validation logic** from documented system procedures
- Horizontal multi-system format with per-system validation rows

This matches your actual UAT format where each system (CRM, Billing, Network, Mobile App, etc.) has its own validation row with specific expected outcomes, plus field names and procedures from actual system documentation.

## Expected Impact
- **80% reduction** in test case generation time: from 15-30 min to 2 min
- **95% quality**: generated test cases require minimal manual edits
- **100% coverage** of input document types (requirements + knowledge base)
- **40-60% improvement** in test case quality with KB feature enabled
- **Immediate usability**: output matches your UAT spreadsheet format exactly

---

# TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Product Vision](#product-vision)
4. [Objectives and Success Metrics](#objectives-and-success-metrics)
5. [Target Users](#target-users)
6. [Product Scope](#product-scope)
7. [User Stories](#user-stories)
8. [Functional Requirements](#functional-requirements)
9. [Non-Functional Requirements](#non-functional-requirements)
10. [Technical Architecture](#technical-architecture)
11. [System Components & Glossary](#system-components--glossary)
12. [Enhanced Test Case Format](#enhanced-test-case-format)
13. [Knowledge Base Feature Specification](#knowledge-base-feature-specification-new)
14. [Enhanced Agent Instructions](#enhanced-agent-instructions)
15. [Dependencies & Assumptions](#dependencies--assumptions)
16. [Risks & Mitigations](#risks--mitigations)
17. [Testing Strategy](#testing-strategy)
18. [Release Plan](#release-plan)
19. [Appendices](#appendices)

---

# PROBLEM STATEMENT

## Current Pain Points
1. **Manual Test Case Creation**: QA Engineers spend significant time manually generating end-to-end TAT test cases from user requirements
2. **Cross-Team Coordination**: Multiple development teams (Web, CRM, Billing, Matrixx, Provisioning, MIS, and 7 more systems) require consistent test cases for cross-validation
3. **Multiple Input Formats**: Requirements arrive in various formats (Jira PDF exports, PowerPoint presentations, Excel/PDF offer master files, text descriptions)
4. **Lack of System Documentation Context**: Agents generate generic test steps without access to actual system procedures, field names, and business logic
5. **Time-Consuming Process**: Manual test case generation is repetitive, error-prone, and resource-intensive
6. **Inconsistent Quality**: Human-generated test cases vary in structure, completeness, and coverage
7. **Complex Multi-System Testing**: UAT requires validation across 13 system components with cross-system dependencies

## Business Impact
- Delayed release cycles due to test case preparation bottlenecks
- Inconsistent test coverage across teams
- Increased risk of missed edge cases and integration issues
- Test steps that don't match actual system procedures
- Reduced QA team productivity and morale
- Manual reformatting of test cases to match team standards

## Root Cause Analysis
The core issue is that test case generation requires **specialized knowledge across multiple domains**:
1. Understanding telecommunications offer structures (plans, charges, rebates)
2. Mapping features to affected systems
3. Identifying cross-system dependencies and validation points
4. Formatting output to match QA team standards
5. **NEW: Knowing exact system procedures, field names, and business validation rules**

This knowledge work is currently performed manually by experienced QA Engineers, representing a significant time investment with high variability.

---

# PRODUCT VISION

Build an intelligent, agentic AI system that automatically generates industry-standard, comprehensive end-to-end test cases from multiple input sources **and system documentation** in the exact format used by your QA team, enabling QA teams to focus on strategic testing activities rather than manual documentation.

## Core Principles
1. **Multi-Agent Expertise**: Specialized agents for planning, generation, and validation (similar to Playwright test agents)
2. **Format Fidelity**: Output matches actual UAT format with horizontal multi-system layout
3. **Knowledge Base Integration**: NEW - Agents reference system documentation for accurate procedures and field names
4. **Configurable Intelligence**: Support local (Ollama) and cloud (OpenRouter, Deepseek, Google Gemini) LLMs with hot-reload
5. **Cross-System Intelligence**: Understands 13 distinct system components and their dependencies
6. **User-Friendly Interface**: Python/Web-based with drag-and-drop input, real-time configuration, instant results

---

# OBJECTIVES AND SUCCESS METRICS

## Business Objectives

| Metric | Current State | Target | Timeline |
|--------|---------------|--------|----------|
| Generation Time per Case | 15-30 minutes | 2 minutes | Month 3 |
| Time Savings | - | 80% reduction | Month 3 |
| Quality (acceptable cases) | 70% manual | 95% minimal edits | Month 2 |
| Team Adoption Rate | 0% | 80% | Month 3 |
| Input Coverage | - | 100% (Jira, PPT, Excel, text, KB) | Month 2 |
| System Coverage | - | 100% (13 systems) | Month 3 |
| Format Fidelity | - | 100% (matches UAT format) | Month 2 |
| **NEW: Test Quality with KB** | Baseline | +40-60% improvement | Month 2 |
| **NEW: Field Accuracy** | Generic | +50% specificity | Month 2 |
| User Satisfaction | NPS - | 8-10 | Month 3 |

---

# TARGET USERS

## Primary Users
- **QA Engineers (10-15 people)**
  - Generate and review test cases for various telecom services and offers
  - Daily users of the tool
  - Skill level: Intermediate (understand test concepts, telecom domain)

- **Test Leads (2-3 people)**
  - Oversee test case quality and coverage across teams
  - Monitor adoption and provide feedback
  - Review complex cross-team scenarios

## Secondary Users
- **Development Teams** (50 developers across 13 systems)
  - Reference test cases for implementation validation
  - Suggest improvements or corrections

- **Product Managers** (3-5 people)
  - Review test coverage for new features
  - Use test cases to validate requirements

- **Business Analysts** (2-3 people)
  - Validate that requirements are correctly captured in test scenarios
  - Create input documents (Jira tickets, offer specs)

---

# PRODUCT SCOPE

## Phase 1 (MVP) - In Scope

### 1. Input Processing
- [x] Multi-format input processing (text, PDF, PPTX, Excel)
- [x] Batch processing (up to 10 files simultaneously)
- [x] Document parsing (text extraction, structure preservation)
- **[NEW] Knowledge Base document upload and storage**

### 2. Agentic AI Architecture
- [x] Planner Agent - analyzes requirements, identifies test scenarios, maps to teams
- [x] Generator Agent - creates detailed test cases in standard format
- [x] Executor Agent - validates completeness and cross-system consistency
- **[NEW] KB context integration into all three agents**

### 3. LLM Integration
- [x] Ollama support (local LLM via HTTP)
- [x] OpenRouter support (cloud LLM aggregator via HTTPS)
- [x] Deepseek support (cloud LLM via HTTPS)
- [x] Google Gemini API support (cloud LLM via HTTPS)
- [x] Hot-reload configuration (changes apply immediately, no restart)
- [x] Connection testing (validate LLM availability before generation)
- **[NEW] KB context configuration options**

### 4. Test Case Output Generation
- [x] Horizontal multi-system format (per-system validation columns)
- [x] Cross-system dependency mapping (explicit validation points)
- [x] Per-system expected results (not generic global results)
- [x] Test case categorization (by team, type, priority)
- **[NEW] KB references in test case output**

### 5. Export Formats
- [x] Excel (.xlsx) export for test management tools
- [x] Markdown (.md) export for Git version control
- [x] CSV export for Jira import
- [x] PDF export for stakeholder review

### 6. User Interface
- [x] Web application using Python backend (Next.js + FastAPI + PostgreSQL)
- [x] Drag-and-drop file upload
- [x] Real-time preview pane
- [x] Inline editing capability
- [x] Configuration management UI
- **[NEW] Knowledge Base document management section**
- **[NEW] KB context toggle on/off**
- **[NEW] KB document list display**

### 7. Knowledge Base Feature (NEW)
- [x] Accept system documentation uploads (PDF, text, etc.)
- [x] Store KB documents with metadata
- [x] Display list of uploaded KB documents
- [x] Toggle KB context on/off for generation
- [x] KB context inclusion in agent prompts
- [x] Configuration options for KB (relevance threshold, max documents)
- [x] Basic KB retrieval (Phase 1) + semantic search (Phase 2)

## Phase 2 - Enhancement
- [ ] PowerPoint and Excel parsing (direct, not PDF)
- [ ] CSV and PDF export enhancements
- [ ] Advanced hot-reload features
- [ ] Batch processing UI improvements
- [ ] Performance optimization
- [ ] Additional cloud LLM providers (as needed)
- [ ] Vector embeddings for KB semantic search
- [ ] Hybrid BM25 + semantic retrieval

## Out of Scope (Phase 3+)
- [ ] Test execution or automation
- [ ] Jira API direct integration
- [ ] Real-time collaboration features
- [ ] Version control for test cases
- [ ] AI model training or fine-tuning
- [ ] Mobile application
- [ ] Multi-language support

---

# USER STORIES

## Epic 1: Input Processing

**US-1.1** As a QA Engineer, I want to upload a Jira-exported PDF, so that the system can extract user requirements and generate test cases.
- Acceptance Criteria: System accepts PDFs up to 100 pages, extracts all text content

**US-1.2** As a QA Engineer, I want to upload Marketing PowerPoint presentations as PDF, so that offer details are incorporated into test scenarios.
- Acceptance Criteria: Extract slide content, maintain table structures, identify key specifications

**US-1.3** As a QA Engineer, I want to upload Excel/PDF Offer Master files, so that product specifications are accurately reflected in test cases.
- Acceptance Criteria: Parse tabular data, extract headers and relationships, handle merged cells

**US-1.4** As a QA Engineer, I want to enter text prompts describing test scenarios, so that I can quickly generate test cases without formal documentation.
- Acceptance Criteria: Support up to 10,000 characters, provide character count indicator

**US-1.5** As a QA Engineer, I want to upload multiple files simultaneously, so that test cases consider all relevant requirements together.
- Acceptance Criteria: Accept up to 10 files per batch, max 50MB total, process in order

**US-1.6** (NEW) As a QA Engineer, I want to upload system documentation (User Guides, CRM manuals, Case Management guides), so that test cases reference actual system procedures.
- Acceptance Criteria: Accept PDF/text documents, extract and store content, make available to agents during generation

**US-1.7** (NEW) As a QA Engineer, I want to toggle Knowledge Base context on/off, so that I can compare generated test cases with and without KB.
- Acceptance Criteria: Checkbox to enable/disable KB context, retains setting across sessions

**US-1.8** (NEW) As a QA Engineer, I want to see which KB documents are loaded, so that I understand what context is available to the agents.
- Acceptance Criteria: Display list of uploaded KB documents with name, size, upload date

## Epic 2: AI Test Case Generation

**US-2.1** As a QA Engineer, I want the AI to generate test cases with proper structure (ID, description, steps, expected results), so that they meet industry standards.
- Acceptance Criteria: Follow ISO/IEC/IEEE 29119 standard format, include all required fields

**US-2.2** As a QA Engineer, I want the AI to identify cross-team dependencies, so that integration test scenarios are comprehensive.
- Acceptance Criteria: Map dependencies between CRM, Billing, Matrixx, Network, and other systems

**US-2.3** As a QA Engineer, I want the AI to generate both positive and negative test scenarios, so that edge cases are covered.
- Acceptance Criteria: Include normal operation and error conditions, boundary cases

**US-2.4** As a QA Engineer, I want the AI to extract data points from input files, so that test data is realistic and relevant.
- Acceptance Criteria: Extract charge codes, plan codes, offer codes, mobile numbers, contract periods

**US-2.5** As a Test Lead, I want the AI to categorize test cases by team (CRM, Billing, Network, etc.), so that distribution is efficient.
- Acceptance Criteria: Organize by affected system, provide team-specific filtering

**US-2.6** As a QA Engineer, I want the AI to generate per-system expected results (not generic), so that validation is specific to each system component.
- Acceptance Criteria: Each system has its own validation row with specific expected outcomes

**US-2.7** (NEW) As a QA Engineer, I want test steps to include specific field names and menu paths from KB documents, so that I can execute them exactly in the system.
- Acceptance Criteria: Reference exact field names, menu paths, and buttons from KB documentation

**US-2.8** (NEW) As a QA Engineer, I want expected results to reference business rules from KB documentation, so that validation is accurate and consistent.
- Acceptance Criteria: Include specific values, validation rules, and constraints from KB procedures

## Epic 3: LLM Configuration

**US-3.1** As a QA Engineer, I want to configure the LLM provider (Ollama/OpenRouter/Deepseek/Gemini) via UI, so that I can switch between local and cloud models.
- Acceptance Criteria: Radio buttons for provider selection (Ollama, OpenRouter, Deepseek, Google Gemini), model name input, API key field (for cloud providers), endpoint configuration

**US-3.2** As a QA Engineer, I want to specify model parameters (temperature, max tokens), so that I can control generation quality.
- Acceptance Criteria: Temperature slider 0.0-2.0, token input 100-8000, save/apply buttons

**US-3.3** As a System Administrator, I want configuration changes to apply immediately, so that users don't lose work during restarts.
- Acceptance Criteria: Hot-reload mechanism, no application restart required, <1 second application time

**US-3.4** As a QA Engineer, I want to test the LLM connection before generating test cases, so that I can troubleshoot connectivity issues.
- Acceptance Criteria: Connection test button, status indicator, success/error messages

**US-3.5** (NEW) As a QA Engineer, I want to configure KB context settings (enable/disable, relevance threshold, max documents), so that I can fine-tune KB behavior.
- Acceptance Criteria: Configuration options in Settings, immediate application when saved

## Epic 4: Output Management

**US-4.1** As a QA Engineer, I want to export test cases to Excel format, so that they can be imported into test management tools.
- Acceptance Criteria: XLSX format, one test case per row, all fields included, cell formatting

**US-4.2** As a QA Engineer, I want to export test cases to Markdown, so that they can be version-controlled in Git.
- Acceptance Criteria: MD format, hierarchical headers, code blocks for data, Git-compatible

**US-4.3** As a QA Engineer, I want to preview generated test cases before export, so that I can make adjustments if needed.
- Acceptance Criteria: Formatted preview pane, inline editing, save/discard buttons

**US-4.4** As a QA Engineer, I want to edit generated test cases inline, so that minor corrections don't require regeneration.
- Acceptance Criteria: Text field editing, save changes, regenerate option for single cases

**US-4.5** (NEW) As a QA Engineer, I want to see which KB documents influenced each test case, so that I understand the source of information.
- Acceptance Criteria: KB reference notes in test case output where applicable

---

# FUNCTIONAL REQUIREMENTS

## FR-1: Multi-Format Input Processing

### FR-1.1: PDF File Support
- System SHALL accept PDF files from Jira exports and Marketing materials
- Extract text content using PyPDF2 or PyMuPDF
- Preserve document structure and formatting context
- Handle multi-page documents up to 100 pages
- Support scanned PDFs with OCR (Phase 2)

### FR-1.2: PowerPoint Processing
- System SHALL accept PowerPoint files converted to PDF
- Extract slide content and speaker notes
- Maintain table and list structures
- Identify key-value pairs in specifications
- Support direct PPTX files (Phase 2)

### FR-1.3: Excel Processing
- System SHALL accept Excel files (XLSX, CSV) and Excel-to-PDF conversions
- Parse tabular data structures
- Extract column headers and data relationships
- Handle merged cells and formulas
- Support up to 1000 rows per file

### FR-1.4: Text Input
- System SHALL accept plain text input via UI text area
- Support up to 10,000 characters
- Allow copy-paste from various sources
- Provide character count indicator
- Validate non-empty input

### FR-1.5: Batch Processing
- System SHALL support batch processing of multiple files
- Accept up to 10 files per batch
- Maximum combined size 50MB
- Process files in order of upload
- Show progress for each file

### FR-1.6: Knowledge Base Document Upload (NEW)
- System SHALL accept system documentation PDFs (User Guides, Operational Manuals)
- Extract and store full text content
- Support up to 100 documents per project
- Maximum 5 MB per document
- Store metadata (name, type, upload date)
- Deduplicate documents using file hash

---

## FR-2: Agentic AI Architecture with KB Context

### FR-2.1: Planner Agent Responsibilities (Enhanced)

The **Planner Agent** SHALL:

1. **System Component Identification**
   - Parse input documents to identify which of the 13 systems are affected
   - Example: Changing mobile plan offer affects CRM subscription, Billing charges, Network service tier, Mobile App display, MIS reporting

2. **Cross-System Dependency Mapping**
   - Identify validation checkpoints between systems
   - Map 7+ predefined cross-system dependencies (CRM→Billing, etc.)

3. **Test Data Extraction**
   - Extract specific values from input documents (plan codes, charge codes, offer codes, etc.)

4. **Knowledge Base Integration** (NEW)
   - Reference KB documents to identify exact system procedures for each workflow
   - Extract specific field names and menu paths from KB
   - Understand business validation rules documented in KB
   - Map documented cross-system workflows from KB

5. **BAU Pre-requisite Identification**
   - Determine what setup is required in Business As Usual before migration/testing

6. **Test Scenario Categorization**
   - Assign test cases to 14 categories with KB awareness

### FR-2.2: Generator Agent Responsibilities (Enhanced)

The **Generator Agent** SHALL:

1. **Generate Multi-System Test Cases**
   - For each test scenario, create test case with per-system validation
   - Use horizontal table format

2. **Include Realistic Test Data**
   - Use extracted values from Planner Agent
   - Generate example mobile numbers, use actual charge codes

3. **Define Per-System Expected Results**
   - **NEW: Reference KB-documented procedures for specific field values**
   - Include specific monetary amounts, contract periods

4. **Add Cross-System Validation Steps**
   - Include steps that verify consistency across systems

5. **Include Negative Test Cases**
   - Test for missing data scenarios, incorrect charge scenarios

6. **Generate Jira Integration Placeholders**
   - Add placeholder links for Jira issues

7. **Knowledge Base Integration** (NEW)
   - Use KB documentation for realistic test steps
   - Include exact menu paths from KB (e.g., "Home → Subscription Preview → Details")
   - Use specific field names as documented in KB
   - Reference exact system messages/confirmations from KB
   - Create system-specific validation based on KB procedures

### FR-2.3: Executor Agent Responsibilities (Enhanced)

The **Executor Agent** SHALL:

1. **Validate All Affected Systems Have Expected Results**
   - Check that every system has a row in the validation table
   - Flag if missing systems

2. **Cross-System Consistency Checks**
   - Verify that expected results are logically consistent
   - **NEW: Verify against KB-documented procedures**

3. **Test Data Realism Validation**
   - Validate charge codes, plan codes, mobile number format, monetary amounts

4. **Knowledge Base Compliance** (NEW)
   - Verify test steps match KB documented procedures
   - Verify field names exist in KB documentation
   - Verify business logic aligns with KB documented rules
   - Generate KB compliance score

5. **BAU Pre-requisites Clarity**
   - Ensure pre-requisites are actionable and clear

6. **Jira Integration Completeness**
   - Ensure Jira issue link placeholders are present

### FR-2.4: Agent Communication
- Agents SHALL communicate via structured artifacts (JSON-based)
- Maintain context across agent interactions
- Log agent decisions for transparency
- **NEW: Include KB references in agent communication**

---

## FR-3: LLM Integration and Configuration

### FR-3.1: Ollama Support (Local LLM)
- System SHALL support Ollama local LLM integration
- Connect via HTTP API (default http://127.0.0.1:11434/api)
- Support models: llama3, llama3.1, mistral, codellama, etc.
- Allow custom base URL configuration
- Validate connection on configuration save
- Support offline operation with pre-downloaded models

### FR-3.2: OpenRouter Support (Cloud LLM Aggregator)
- System SHALL support OpenRouter cloud LLM integration
- Connect via HTTPS API (https://openrouter.ai/api/v1)
- Require API key authentication
- Support models: GPT-4, Claude, Llama-3, Mixtral, Gemini, etc.
- Display model availability and pricing if applicable
- Validate API key before enabling

### FR-3.3: Deepseek Support (Cloud LLM)
- System SHALL support Deepseek cloud LLM integration
- Connect via HTTPS API (https://api.deepseek.com)
- Require API key authentication
- Support models: deepseek-chat, deepseek-coder
- Validate API key before enabling

### FR-3.4: Google Gemini API Support (Cloud LLM)
- System SHALL support Google Gemini API integration
- Connect via HTTPS API (https://generativelanguage.googleapis.com)
- Require API key authentication
- Support models: gemini-pro, gemini-1.5-pro, gemini-flash
- Validate API key before enabling
- Handle Google-specific authentication and request formats

### FR-3.5: Configuration Management
- System SHALL provide UI for LLM configuration (provider, model, parameters)
- Support provider selection (Ollama, OpenRouter, Deepseek, Google Gemini)
- Support temperature setting (0.0-2.0)
- Support max tokens setting (100-8000)
- Conditional API key input (visible only for cloud providers)
- Implement hot-reload (changes apply without restart)
- Provide connection test functionality for all providers

### FR-3.4: Knowledge Base Configuration (NEW)
- System SHALL provide KB configuration options in Settings
- Enable/disable KB context (toggle)
- Set KB relevance threshold (0.0-1.0)
- Set maximum KB documents to reference (1-10)
- Auto-include KB in prompts (toggle)
- All changes apply immediately

---

## FR-4: Output Generation (Enhanced with KB)

### FR-4.1: Horizontal Multi-System Format
- System SHALL generate test cases in horizontal multi-system format
- Each system gets its own validation row
- Columns: System Component | Test Steps | Expected Result | Actual Result | Pass/Fail | Remarks | Jira Issue
- **NEW: Include KB reference notes where applicable**

### FR-4.2: Per-System Expected Results
- System SHALL generate specific expected results for each system
- **NEW: Expected results based on KB-documented procedures and business rules**
- Not generic global results

### FR-4.3: Cross-System Dependency Mapping
- System SHALL explicitly identify cross-system validation points
- Include steps that verify consistency across systems

### FR-4.4: Test Case Structure
- System SHALL follow ISO/IEC/IEEE 29119 standard format
- Include all required fields: ID, Name, Objective, Steps, Expected Results, etc.

---

## FR-5: Export Formats

### FR-5.1: Excel Export
- System SHALL export test cases to Excel (.xlsx) format
- One test case per row
- All fields included with proper formatting

### FR-5.2: Markdown Export
- System SHALL export test cases to Markdown (.md) format
- Hierarchical structure with headers
- Git-compatible format

### FR-5.3: CSV Export
- System SHALL export test cases to CSV format
- Comma-separated values with proper escaping

### FR-5.4: PDF Export
- System SHALL export test cases to PDF format
- Professional formatting suitable for stakeholder review

---

## FR-6: User Interface

### FR-6.1: Input Section
- Drag-and-drop file upload zone (full-width, 150-200px height)
- Display list of uploaded files
- File size and count display
- **NEW: Separate "Knowledge Base" upload section**
- **NEW: Toggle "Use Knowledge Base Context"**
- **NEW: Display KB document count and total size**

### FR-6.2: Generation Section
- Large, prominent "Generate Test Cases" button (400-500px wide, 60px height)
- LLM status indicator (Connected/Disconnected)
- Real-time progress display during generation
- Progress bar and agent status updates

### FR-6.3: Preview Section
- Expandable/collapsible test case cards
- Display horizontal multi-system validation tables
- Inline editing capability for all fields
- [Edit] [Regenerate] [Delete] [Duplicate] actions per card

### FR-6.4: Export Section
- Full-width export options panel
- Format selection (Excel, Markdown, CSV, PDF)
- [Download] button for each format
- [Save Draft] and [Share Link] options
- Selection toggle: "All" or "Selected Only"

### FR-6.5: Configuration Section
- Slide-in drawer from right side (350-400px width)
- LLM provider selection (Ollama/OpenRouter/Deepseek/Gemini) via radio buttons
- Model selection and base URL input
- Conditional API key input field (show only for cloud providers)
- Temperature and max tokens sliders
- Connection test button for all providers
- **NEW: KB configuration options (enable, threshold, max documents)**
- [Save Changes] [Restore Defaults] buttons

---

## FR-7: Knowledge Base Management (NEW)

### FR-7.1: KB Document Upload
- API endpoint: `POST /api/v1/knowledge-base`
- Accept PDF files and text documents
- Extract and store full text content
- **NEW: Accept category selection (dropdown with existing categories or create new)**
- Store metadata: name, type, category, description, file size, upload date
- Deduplicate using file hash (SHA-256)
- Validate file size (max 5 MB per document)
- **NEW: Category must be provided (required field)**

### FR-7.1a: KB Category Management (NEW)
- API endpoint: `GET /api/v1/knowledge-base/categories`
- Return list of all unique categories from existing KB documents
- Used to populate category dropdown in upload UI
- Categories are user-defined strings (e.g., 'CRM', 'Billing', 'Network')
- Support creating new categories during upload

### FR-7.2: KB Document Listing
- API endpoint: `GET /api/v1/knowledge-base`
- Display uploaded KB documents with metadata (including category)
- **NEW: Group documents by category in UI**
- Filter by document type (system_guide, process, reference, product)
- **NEW: Filter by category (single or multiple categories)**
- Filter by active status
- Sort by upload date (newest first)

### FR-7.3: KB Document Deletion
- API endpoint: `DELETE /api/v1/knowledge-base/{docId}`
- Remove KB document from system
- Confirm deletion before removing

### FR-7.4: KB Document Integration with Generation
- Update `POST /api/v1/generate` endpoint
- Accept parameter: `useKnowledgeBase` (boolean)
- Accept parameter: `kbDocIds` (array of selected KB document IDs) **OR**
- **NEW: Accept parameter: `kbCategories` (array of categories to filter KB docs)**
- **NEW: Filter KB documents by categories for relevant context only**
- Pass KB context to agents during generation
- **Benefits of category filtering:**
  - Reduces irrelevant context (only CRM docs for CRM test cases)
  - Stays within token limits (2-3 relevant docs vs 10 total docs)
  - Improves test case precision and KB compliance score

### FR-7.5: KB Search Capability (Phase 2)
- API endpoint: `POST /api/v1/knowledge-base/search`
- Semantic search using vector embeddings
- Return relevant excerpts with relevance scores
- Configurable result limit and threshold

---

# NON-FUNCTIONAL REQUIREMENTS

## Performance Requirements

| Metric | Target | Notes |
|--------|--------|-------|
| Generation time (single file) | < 2 minutes | From upload to preview |
| Generation time (batch, 10 files) | < 30 seconds per file | 50MB batch |
| Configuration reload | < 1 second | Hot-reload |
| UI responsiveness | < 100ms | For all interactions |
| File parsing | 1-2 seconds per file | PDF, Excel, PPTX |
| **KB document parsing** | 1-2 seconds per doc | Extract and store |
| **KB retrieval** | < 100ms | For context passing to agents |
| Export generation | < 10 seconds | For all formats |
| Memory usage | < 1 GB | During processing |
| Storage capacity | 500 MB min | For 100 KB documents @ 5MB each |

## Scalability Requirements
- Support up to 100 KB documents per project
- Support batch processing of 10 files (50MB total)
- Support generation of 100+ test cases from single batch
- Concurrent users: 1-2 initially (MVP)
- Vector storage (Phase 2): 10,000+ embeddings per project

## Reliability Requirements
- Error handling for corrupted/invalid files
- Graceful fallback for LLM connection failures
- Configuration persistence across sessions
- **KB document storage resilience**
- Automatic retry for transient LLM API errors

## Security Requirements
- Encrypt sensitive data (API keys) using AES-256
- Validate file types and sizes
- Sanitize user inputs
- No direct internet access required (can run offline with local Ollama)
- Internal-only deployment (no public web hosting)

## Usability Requirements
- Intuitive single-screen workflow
- Minimal training required (< 5 minutes)
- Clear error messages and recovery steps
- **KB context indicator showing what documents are loaded**
- Tooltips for configuration options

## Accessibility Requirements (WCAG 2.1 Level AA)
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios >= 4.5:1
- Focus indicators visible on all interactive elements
- Alternative text for icons/buttons

---

# KNOWLEDGE BASE FEATURE SPECIFICATION (NEW)

## Overview
The Knowledge Base feature allows QA Engineers to upload system documentation, user guides, and operational manuals that AI agents reference during test case generation. This significantly improves test case quality by providing agents with exact system procedures, field names, and business validation rules.

## Expected Quality Improvements

| Metric | Current | With KB | Improvement |
|--------|---------|---------|-------------|
| Test Steps Specificity | Generic | Specific field names | +40% |
| Field Name Accuracy | ~60% | ~90% | +50% |
| Business Logic Compliance | ~70% | ~95% | +60% |
| Cross-System Consistency | ~75% | ~90% | +30% |

## Supported Document Types
1. **System User Guides** - CRM, Case Management, Network systems
2. **Operational Manuals** - Step-by-step procedures
3. **Process Documentation** - Business workflows, validation rules
4. **Reference Materials** - Data dictionaries, field specifications
5. **Product Information** - Telecom offers, plan details, VAS features

## Implementation Timeline
- **Phase 1 (MVP)**: Basic KB upload, storage, retrieval, agent integration (1-2 days)
- **Phase 2 (Enhancement)**: Vector embeddings, semantic search (1-2 weeks)
- **Phase 3 (Optional)**: Fine-tuning, automatic relationship detection

## Database Changes
New table: `knowledge_base_documents`
- doc_id (UUID, primary key)
- project_id (UUID, foreign key, optional for project-specific KB)
- doc_name (VARCHAR)
- doc_type (ENUM: system_guide, process, reference, product)
- category (VARCHAR - user-defined, e.g., 'CRM', 'Billing', 'Network') **NEW**
- content (TEXT - extracted from PDF)
- file_size (INTEGER)
- file_hash (VARCHAR - SHA-256 for deduplication)
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
- content_vector (Phase 2 - for semantic search)

Updated: `projects` table
- Add: knowledge_base_enabled (BOOLEAN, default TRUE)
- Add: kb_search_depth (INT, 0-3, default 1)

Updated: `configurations` table
- Add: kb_context_enabled (BOOLEAN, default TRUE)
- Add: kb_relevance_threshold (FLOAT, 0.0-1.0, default 0.75)
- Add: max_kb_documents (INT, 1-10, default 5)

---

# TECHNICAL ARCHITECTURE

**Backend**: Python FastAPI (async for LLM calls)  
**Frontend**: Next.js 14 (App Router) + React + Tailwind CSS + Shadcn/ui  
**Database**: PostgreSQL 15+ (local development)  
**State Management**: Zustand (lightweight, Copilot-friendly)  
**LLM Integration**: Ollama (local), OpenRouter, Deepseek, Google Gemini API (cloud)  

See **Software-Requirements-Specification.md** for complete technical details.

---

# SYSTEM COMPONENTS & GLOSSARY

[See original PRD Section 11 for complete glossary - 50+ terms defined, 13 system components, 14+ charge codes]

---

# ENHANCED TEST CASE FORMAT

[See original PRD Section 12 for complete format specification]

---

# ENHANCED AGENT INSTRUCTIONS

## Planner Agent (Updated with KB)

**Knowledge Base Context Responsibility:**
- Reference KB documents to identify exact system procedures
- Extract specific field names and menu paths
- Understand business validation rules documented in KB
- Map documented cross-system workflows

**Output**: Enhanced test plan with KB references

## Generator Agent (Updated with KB)

**Knowledge Base Context Responsibility:**
- Use KB documentation for realistic test steps
- Include exact menu paths from KB
- Use specific field names as documented
- Reference exact system messages/confirmations
- Create system-specific validation based on KB procedures

**Example Enhancement**:
- Before KB: "Verify rebate calculation"
- After KB: "Home → Subscription Preview → Dashboard → Verify Net Plan Price shows $201 (Original $238 - Rebate $37)"

## Executor Agent (Updated with KB)

**Knowledge Base Compliance Checks:**
- Verify test steps match KB-documented procedures
- Verify field names exist in KB documentation
- Verify business logic aligns with KB-documented rules
- Generate KB compliance score (target: 80%+)

---

# DEPENDENCIES & ASSUMPTIONS

## External Dependencies
- Ollama (local LLM) - if using local mode
- OpenRouter API (cloud LLM aggregator) - if using cloud mode
- Deepseek API (cloud LLM) - if using Deepseek mode
- Google Gemini API (cloud LLM) - if using Gemini mode
- PostgreSQL 15+ (for local development)
- Python 3.10+ with FastAPI, SQLAlchemy, PyPDF2, etc.
- Node.js 20+ with Next.js, React, Tailwind CSS

## Assumptions
- QA team has access to Jira and Marketing materials
- System documentation (User Guides, Operational Manuals) will be provided
- API keys available for selected cloud LLM providers (OpenRouter, Deepseek, or Gemini)
- Users have Windows/Mac/Linux with 1GB+ RAM
- Internet not required (works offline with local Ollama)

## Constraints
- Budget: Open-source tools preferred
- Timeline: MVP delivery in 3 months (12 weeks)
- Team: 1-2 developers, 1 product owner
- Hardware: Standard developer laptops (no GPU required)
- File size: Max 50MB batch, 100 pages per PDF, 5MB per KB doc
- LLM context: Manage token limits with chunking (Phase 2)

---

# RISKS & MITIGATIONS

## Technical Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| LLM hallucination with KB context | Medium | Executor Agent validates against KB rules |
| KB context window overflow | Medium | Document chunking, semantic search (Phase 2) |
| PDF parsing failures | Low | Error handling, OCR fallback (Phase 2) |
| Performance impact from KB | Low | Async retrieval, caching strategy |
| KB storage growth | Low | File size limits (5MB), doc limit (100) |
| KB deduplication failures | Low | SHA-256 hashing before storage |

## Business Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Low user adoption | Medium | Early feedback loop, training materials |
| Generated test cases miss edge cases | Medium | Comprehensive executor validation |
| Quality not meeting 95% target | Medium | Adjust agent prompts, add KB references |
| Inconsistent KB documentation | Low | Validation process before upload |

## Implementation Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Scope creep beyond Phase 1 | Medium | Strict acceptance criteria, feature gates |
| LLM API costs (OpenRouter) | Low | Use local Ollama by default |
| Complex cross-system logic | Medium | Detailed agent instructions, examples |

---

# TESTING STRATEGY

## Test Types

1. **Unit Tests** (Week 5-6)
   - Document parsers (PDF, Excel, text, **KB documents**)
   - Agent functions individually
   - Export formatters
   - Configuration manager
   - **KB document storage and retrieval**
   - **KB context integration**

2. **Integration Tests** (Week 7-8)
   - Agent collaboration flow
   - **KB context in agent prompts**
   - LLM API interactions
   - Hot-reload configuration
   - Export to multiple formats

3. **End-to-End Tests** (Week 8-9)
   - Full workflow: File upload → **KB upload** → Generation → Export
   - Multiple file types in sequence
   - Configuration changes mid-process
   - **KB context toggle on/off**
   - Error handling and recovery

4. **User Acceptance Tests** (Week 9-10)
   - QA team validates generated test cases
   - Compare with manual test cases
   - **Verify KB references in output**
   - Review format accuracy
   - Validate cross-system dependencies
   - Target: 95% acceptable cases

5. **Performance Tests** (Week 10-11)
   - Single file: < 2 minutes
   - Batch (10 files): < 30 seconds per file
   - KB document parsing: 1-2 seconds
   - Config reload: < 1 second
   - Memory: < 1 GB

## Test Data Strategy

**Sample Files:**
- 5 Jira PDF exports (varying sizes 5-50 pages)
- 3 Marketing PowerPoint PDFs (offer specifications)
- 5 Excel Offer Master files
- 10 text prompts (varying complexity)
- **3 Sample KB documents** (CRM Guide, Case Mgmt Guide, Backend Guide)
- Edge cases: corrupted PDFs, empty files, malformed Excel, invalid KB docs

---

# RELEASE PLAN

## Phase 1 (MVP) - Weeks 1-12, Months 1-3

### Deliverables
- Core agentic AI framework (Planner, Generator, Executor)
- PDF and text input support
- Ollama integration (local LLM)
- OpenRouter, Deepseek, Google Gemini API integration (cloud LLMs)
- **Knowledge Base document upload, storage, and agent integration**
- Horizontal multi-system test case format
- Basic Excel, Markdown export
- Python/Web GUI with preview/edit
- Documentation

### Weekly Breakdown
- **Weeks 1-2**: Core Architecture
- **Weeks 3-4**: Document Processing (**+ KB Upload**)
- **Weeks 5-6**: LLM Integration (**+ KB Context Integration**)
- **Weeks 7-8**: Agent Orchestration (**+ KB-enhanced Agents**)
- **Weeks 9-10**: Export & Testing (**+ KB Feature Testing**)
- **Weeks 11-12**: Deployment & Polish

### Success Criteria
- [x] 80% reduction in generation time (15-30 min → 2 min)
- [x] 95% quality (acceptable cases with minimal edits)
- [x] 100% input coverage (files + text + **KB docs**)
- [x] **+40-60% test case quality improvement with KB enabled**
- [x] 100% format fidelity (matches UAT spreadsheet)
- [x] Hotreload without restart

## Phase 2 (Enhancement) - Months 4-6
- OpenRouter integration (cloud LLM)
- Vector embeddings for KB semantic search
- Hybrid BM25 + semantic retrieval
- PowerPoint direct parsing (not PDF)
- Performance optimization
- Advanced batch processing UI

## Phase 3 (Advanced Features) - Months 7-9+
- **Future**: Custom templates, multi-language support, collaboration features

---

# APPENDICES

[See original PRD Appendices for:
- Example Input-Output Mapping
- Playwright Agents Inspiration
- Charge Code Examples
- Implementation Guidelines
- Document Usage Notes for development and product teams]

---

# DOCUMENT APPROVAL & VERSION HISTORY

| Version | Date | Status | Author | Notes |
|---------|------|--------|--------|-------|
| 1.0 | Nov 6, 2025 | Final | Product Owner | Original consolidated PRD |
| 2.0 | Nov 6, 2025 | Final | Product Owner | Consolidated with UAT addendum |
| 2.1 | Nov 7, 2025 | Final | Product Owner | Incorporated KB Feature Specification |

---

**END OF REVISED PRODUCT REQUIREMENTS DOCUMENT v2.1**

This document is your primary reference for building the system. All sections have been updated to reflect the Knowledge Base feature as a Phase 1 MVP enhancement.

---
