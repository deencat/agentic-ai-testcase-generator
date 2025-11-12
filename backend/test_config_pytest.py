"""
Playwright Test Suite for Configuration API
Using pytest-playwright for proper test reporting
"""
import os
import pytest
from playwright.sync_api import Page, APIRequestContext, expect
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = "http://127.0.0.1:8000"


@pytest.fixture(scope="session")
def api_key():
    """Get OpenRouter API key from environment."""
    key = os.getenv("OPENROUTER_API_KEY")
    assert key is not None, "OPENROUTER_API_KEY not found in .env file"
    return key


@pytest.fixture(scope="session")
def project_id(api_request_context: APIRequestContext):
    """Create a test project and return its ID."""
    response = api_request_context.post(
        f"{BASE_URL}/api/v1/projects",
        data={
            "name": "Playwright Test Project",
            "description": "Testing configuration API with pytest-playwright"
        }
    )
    assert response.ok, f"Project creation failed: {response.status}"
    project_data = response.json()
    return project_data["id"]


@pytest.fixture(scope="function")
def config_id(api_request_context: APIRequestContext, project_id, api_key):
    """Create a configuration for each test and clean up after."""
    # Create configuration
    response = api_request_context.post(
        f"{BASE_URL}/api/v1/config",
        data={
            "project_id": project_id,
            "provider": "openrouter",
            "model": "deepseek/deepseek-r1",
            "api_key": api_key,
            "temperature": 0.7,
            "max_tokens": 2000,
            "kb_enabled": True,
            "kb_threshold": 0.8,
            "kb_max_docs": 5
        }
    )
    assert response.status == 201, f"Config creation failed: {response.status}"
    config_data = response.json()
    config_id = config_data["id"]
    
    yield config_id
    
    # Cleanup: Delete configuration after test
    api_request_context.delete(f"{BASE_URL}/api/v1/config/{config_id}")


class TestHealthEndpoint:
    """Test health check endpoint."""
    
    def test_health_check(self, api_request_context: APIRequestContext):
        """Test that health endpoint returns 200."""
        response = api_request_context.get(f"{BASE_URL}/api/v1/health")
        assert response.ok
        data = response.json()
        assert "status" in data
        assert "app_name" in data
        assert data["app_name"] == "Agentic AI Test Case Generator"


class TestConnectionTesting:
    """Test LLM connection testing endpoints."""
    
    def test_openrouter_connection_success(self, api_request_context: APIRequestContext, api_key):
        """Test successful OpenRouter connection."""
        response = api_request_context.post(
            f"{BASE_URL}/api/v1/config/test-connection",
            data={
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1",
                "api_key": api_key
            }
        )
        assert response.ok
        data = response.json()
        assert data["success"] is True
        assert data["provider"] == "openrouter"
        assert data["model"] == "deepseek/deepseek-r1"
        assert "latency_ms" in data
    
    def test_openrouter_connection_invalid_key(self, api_request_context: APIRequestContext):
        """Test OpenRouter connection with invalid API key."""
        response = api_request_context.post(
            f"{BASE_URL}/api/v1/config/test-connection",
            data={
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1",
                "api_key": "invalid-key"
            }
        )
        assert response.ok
        data = response.json()
        assert data["success"] is False
        assert "error" in data


class TestConfigurationCRUD:
    """Test configuration CRUD operations."""
    
    def test_create_configuration(self, api_request_context: APIRequestContext, project_id, api_key):
        """Test configuration creation."""
        response = api_request_context.post(
            f"{BASE_URL}/api/v1/config",
            data={
                "project_id": project_id,
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1",
                "api_key": api_key,
                "temperature": 0.7,
                "max_tokens": 2000,
                "kb_enabled": True,
                "kb_threshold": 0.8,
                "kb_max_docs": 5
            }
        )
        assert response.status == 201
        data = response.json()
        assert data["provider"] == "openrouter"
        assert data["model"] == "deepseek/deepseek-r1"
        assert data["temperature"] == 0.7
        assert data["kb_enabled"] is True
        assert data["kb_threshold"] == 0.8
        # API key should be masked
        assert data["api_key"] is not None
        assert "****" in data["api_key"]
        
        # Cleanup
        api_request_context.delete(f"{BASE_URL}/api/v1/config/{data['id']}")
    
    def test_get_configuration_by_id(self, api_request_context: APIRequestContext, config_id):
        """Test getting configuration by ID."""
        response = api_request_context.get(f"{BASE_URL}/api/v1/config/{config_id}")
        assert response.ok
        data = response.json()
        assert data["id"] == config_id
        assert data["provider"] == "openrouter"
        assert "api_key" in data
        assert "****" in data["api_key"]  # Should be masked
    
    def test_get_configuration_by_project(self, api_request_context: APIRequestContext, project_id, config_id):
        """Test getting configuration by project ID."""
        response = api_request_context.get(f"{BASE_URL}/api/v1/config/project/{project_id}")
        assert response.ok
        data = response.json()
        assert data["project_id"] == project_id
        assert data["provider"] == "openrouter"
    
    def test_update_configuration(self, api_request_context: APIRequestContext, config_id):
        """Test updating configuration."""
        response = api_request_context.patch(
            f"{BASE_URL}/api/v1/config/{config_id}",
            data={
                "temperature": 0.9,
                "kb_enabled": False,
                "kb_max_docs": 3
            }
        )
        assert response.ok
        data = response.json()
        assert data["temperature"] == 0.9
        assert data["kb_enabled"] is False
        assert data["kb_max_docs"] == 3
    
    def test_list_configurations(self, api_request_context: APIRequestContext, config_id):
        """Test listing configurations."""
        response = api_request_context.get(f"{BASE_URL}/api/v1/config")
        assert response.ok
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Check that our config is in the list
        config_ids = [c["id"] for c in data]
        assert config_id in config_ids
    
    def test_delete_configuration(self, api_request_context: APIRequestContext, project_id, api_key):
        """Test deleting configuration."""
        # Create a config to delete
        create_response = api_request_context.post(
            f"{BASE_URL}/api/v1/config",
            data={
                "project_id": project_id,
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1",
                "api_key": api_key,
                "temperature": 0.7,
                "max_tokens": 2000,
                "kb_enabled": False,
                "kb_threshold": 0.7,
                "kb_max_docs": 5
            }
        )
        assert create_response.status == 201
        config_data = create_response.json()
        config_id = config_data["id"]
        
        # Delete it
        delete_response = api_request_context.delete(f"{BASE_URL}/api/v1/config/{config_id}")
        assert delete_response.status == 204
        
        # Verify it's deleted (soft delete - should be inactive)
        get_response = api_request_context.get(f"{BASE_URL}/api/v1/config/{config_id}")
        # Should return 404 or show is_active=False
        assert not get_response.ok or get_response.json().get("is_active") is False


class TestSwaggerUI:
    """Test Swagger UI accessibility."""
    
    def test_swagger_ui_loads(self, page: Page):
        """Test that Swagger UI loads successfully."""
        page.goto(f"{BASE_URL}/docs")
        expect(page.locator(".swagger-ui")).to_be_visible(timeout=10000)
        assert "Swagger UI" in page.title()
    
    def test_configuration_endpoint_visible(self, page: Page):
        """Test that Configuration section is visible in Swagger UI."""
        page.goto(f"{BASE_URL}/docs")
        page.wait_for_selector(".swagger-ui", timeout=10000)
        
        # Look for Configuration tag
        config_section = page.locator("text=Configuration")
        expect(config_section).to_be_visible(timeout=5000)
    
    def test_openapi_json_available(self, api_request_context: APIRequestContext):
        """Test that OpenAPI JSON is accessible."""
        response = api_request_context.get(f"{BASE_URL}/openapi.json")
        assert response.ok
        data = response.json()
        assert "openapi" in data
        assert "paths" in data
        assert "/api/v1/config" in data["paths"]


class TestKnowledgeBaseSettings:
    """Test Knowledge Base configuration settings."""
    
    def test_kb_settings_in_config(self, api_request_context: APIRequestContext, project_id, api_key):
        """Test that KB settings are properly saved and retrieved."""
        response = api_request_context.post(
            f"{BASE_URL}/api/v1/config",
            data={
                "project_id": project_id,
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1",
                "api_key": api_key,
                "temperature": 0.7,
                "max_tokens": 2000,
                "kb_enabled": True,
                "kb_threshold": 0.85,
                "kb_max_docs": 7,
                "kb_settings": {"custom_option": "value"}
            }
        )
        assert response.status == 201
        data = response.json()
        assert data["kb_enabled"] is True
        assert data["kb_threshold"] == 0.85
        assert data["kb_max_docs"] == 7
        assert data["kb_settings"] is not None
        
        # Cleanup
        api_request_context.delete(f"{BASE_URL}/api/v1/config/{data['id']}")
    
    def test_kb_threshold_validation(self, api_request_context: APIRequestContext, project_id, api_key):
        """Test KB threshold validation (should be between 0.0 and 1.0)."""
        # Valid threshold
        response = api_request_context.post(
            f"{BASE_URL}/api/v1/config",
            data={
                "project_id": project_id,
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1",
                "api_key": api_key,
                "temperature": 0.7,
                "max_tokens": 2000,
                "kb_enabled": True,
                "kb_threshold": 0.5,
                "kb_max_docs": 5
            }
        )
        assert response.status == 201
        api_request_context.delete(f"{BASE_URL}/api/v1/config/{response.json()['id']}")


if __name__ == "__main__":
    # Run pytest with HTML report
    pytest.main([
        __file__,
        "-v",
        "--html=playwright-report.html",
        "--self-contained-html"
    ])
