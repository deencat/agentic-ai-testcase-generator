# API Testing Guide

## Testing Best Practices: Playwright vs pytest

### ✅ **Recommended: pytest + requests for API Testing**

**Why pytest + requests is the right choice:**
- **Faster**: No browser overhead, tests complete in ~5 seconds vs 20+ seconds
- **Simpler**: Direct HTTP calls without complex async browser automation
- **Industry Standard**: Most REST API test suites use pytest + requests/httpx
- **Better Error Messages**: Clear HTTP response errors, no browser timeouts
- **CI/CD Friendly**: No headless browser dependencies in containers
- **Professional**: Clean, maintainable test code

**When to use pytest + requests:**
- ✅ Testing REST API endpoints (GET, POST, PATCH, DELETE)
- ✅ Validating JSON responses
- ✅ Checking HTTP status codes
- ✅ Testing authentication and authorization
- ✅ Integration testing with database
- ✅ API contract testing
- ✅ Performance testing (response times)

### 🌐 **Use Playwright Only For:**
- Browser UI testing (e.g., Swagger UI visual verification)
- End-to-end user workflows with browser interaction
- Screenshot/video capture for documentation
- Testing JavaScript-heavy frontend applications
- Cross-browser compatibility testing

---

## Test Suite Overview

### Current Test File: `test_api_config.py`

**21 Tests - All Passing ✅**

#### Test Classes:

1. **TestHealthEndpoint** (3 tests)
   - Health check returns 200
   - Response has required fields
   - Response format validation

2. **TestConnectionTesting** (4 tests)
   - OpenRouter connection success
   - OpenRouter connection with invalid key
   - Connection test missing API key
   - Connection test with invalid provider

3. **TestConfigurationCRUD** (10 tests)
   - Create configuration success
   - Create with invalid project ID
   - Get configuration by ID
   - Get configuration not found
   - Get configuration by project
   - Update configuration
   - Update configuration not found
   - List configurations
   - List configurations with filter
   - Delete configuration

4. **TestKnowledgeBaseSettings** (2 tests)
   - KB settings in config
   - KB threshold valid range

5. **TestOpenAPIDocumentation** (2 tests)
   - OpenAPI JSON available
   - Docs endpoint available

---

## Running Tests

### Run All Tests with HTML Report
```bash
pytest test_api_config.py -v --html=test-report.html --self-contained-html
```

### Run Specific Test Class
```bash
pytest test_api_config.py::TestConnectionTesting -v
```

### Run Tests with Specific Marker
```bash
pytest -m api -v
pytest -m integration -v
```

### Run Tests and Show Print Statements
```bash
pytest test_api_config.py -v -s
```

### Run Tests with Coverage
```bash
pytest test_api_config.py --cov=app --cov-report=html
```

---

## Test Fixtures

### Session-Scoped Fixtures (Run Once)
- **`api_key`**: Loads OpenRouter API key from `.env` file
- **`session`**: Creates a `requests.Session` for all tests
- **`project_id`**: Creates a test project once, reused across tests

### Function-Scoped Fixtures (Run Per Test)
- **`config_id`**: Creates a configuration for each test, automatically cleans up after

### Fixture Usage Example:
```python
def test_example(session, project_id, config_id):
    # session: requests.Session with base headers
    # project_id: UUID of test project
    # config_id: UUID of test configuration (auto-cleaned up)
    response = session.get(f"{BASE_URL}/api/v1/config/{config_id}")
    assert response.status_code == 200
```

---

## Test Execution Results

### Latest Test Run (11/12/2025 10:29 PM)
```
Platform: Windows 10
Python: 3.13.3
Pytest: 8.4.2

21 passed in 5.09s ✅

Test Breakdown:
- TestHealthEndpoint: 3/3 passed ✅
- TestConnectionTesting: 4/4 passed ✅
- TestConfigurationCRUD: 10/10 passed ✅
- TestKnowledgeBaseSettings: 2/2 passed ✅
- TestOpenAPIDocumentation: 2/2 passed ✅
```

**HTML Report:** `test-report.html` (viewable in browser)

---

## Environment Setup

### Required Environment Variables (`.env`)
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

### Required Dependencies
```bash
pip install pytest pytest-html requests python-dotenv
```

---

## Test Organization

### File Structure:
```
backend/
├── test_api_config.py          # Main API test suite (pytest + requests)
├── test_config_api.py          # Simple Python script (manual testing)
├── test_config_playwright.py   # Playwright automation (UI testing only)
├── test-report.html            # Latest HTML test report
├── pytest.ini                  # Pytest configuration
└── .env                        # Environment variables
```

### Recommended Approach:
1. **Use `test_api_config.py`** for all API testing (21 tests, fast, reliable)
2. **Use `test_config_api.py`** for quick manual verification during development
3. **Use `test_config_playwright.py`** only for Swagger UI visual testing

---

## Comparison: Test Suite Performance

| Test Suite | Tool | Duration | Tests | Status | Use Case |
|------------|------|----------|-------|--------|----------|
| `test_api_config.py` | pytest + requests | 5.09s | 21 | ✅ All Pass | **Production API testing** |
| `test_config_playwright.py` | Playwright | 23.45s | 10 | ✅ All Pass | UI/browser testing only |
| `test_config_pytest.py` | pytest-playwright | 3.56s | 14 | ❌ 12 errors | ❌ Deprecated |

**Conclusion:** `test_api_config.py` is the **fastest, most reliable, and professional** approach.

---

## Continuous Integration (CI/CD)

### GitHub Actions Example:
```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.13'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-html requests python-dotenv
      
      - name: Run tests
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
        run: |
          pytest test_api_config.py -v --html=test-report.html --self-contained-html
      
      - name: Upload test report
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: test-report.html
```

---

## Next Steps

### Week 5-6: LLM Integration Testing
When implementing Week 5-6 LLM Integration features, continue using the same pattern:
- Create `test_api_llm.py` with pytest + requests
- Test LLM provider connections
- Test prompt generation
- Test response parsing
- Test error handling

### Example Test Structure for Week 5:
```python
@pytest.mark.api
class TestLLMIntegration:
    """Test LLM integration endpoints."""
    
    def test_generate_test_cases(self, session, config_id):
        """Test generating test cases with LLM."""
        response = session.post(
            f"{BASE_URL}/api/v1/llm/generate",
            json={
                "config_id": config_id,
                "prompt": "Generate test cases for login function"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "test_cases" in data
```

---

## Summary

✅ **Use pytest + requests** for all REST API testing
❌ **Avoid Playwright** for pure API testing
🌐 **Use Playwright** only for browser/UI testing (Swagger UI verification)

**Current Status:**
- ✅ 21 API tests passing
- ✅ Fast execution (~5 seconds)
- ✅ Professional HTML reports
- ✅ Clean, maintainable code
- ✅ CI/CD ready

**Test Report:** Open `test-report.html` in your browser to see detailed results with pass/fail status, execution times, and error details.
