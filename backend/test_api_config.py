"""
Configuration API Test Suite - Pure Pytest + Requests
Professional API testing without browser overhead
"""
import os
import pytest
import requests
from dotenv import load_dotenv
from uuid import UUID

# Load environment variables
load_dotenv()

# Base URL
BASE_URL = "http://127.0.0.1:8000"


# ==================== Fixtures ====================

@pytest.fixture(scope="session")
def api_key():
    """Get OpenRouter API key from environment."""
    key = os.getenv("OPENROUTER_API_KEY")
    assert key is not None, "OPENROUTER_API_KEY not found in .env file"
    return key


@pytest.fixture(scope="session")
def session():
    """Create a requests session for all tests."""
    with requests.Session() as s:
        s.headers.update({"Content-Type": "application/json"})
        yield s


@pytest.fixture(scope="session")
def project_id(session):
    """Create a test project and return its ID."""
    response = session.post(
        f"{BASE_URL}/api/v1/projects",
        json={
            "name": "API Test Project",
            "description": "Testing configuration API with pytest"
        }
    )
    assert response.status_code == 201, f"Project creation failed: {response.status_code}"
    project_data = response.json()
    project_id = project_data["id"]
    
    # Validate UUID format
    assert UUID(project_id), "Project ID is not a valid UUID"
    
    yield project_id
    
    # Note: Projects persist for potential future tests


@pytest.fixture(scope="function")
def config_id(session, project_id, api_key):
    """Create a configuration for each test and clean up after."""
    response = session.post(
        f"{BASE_URL}/api/v1/config",
        json={
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
    assert response.status_code == 201, f"Config creation failed: {response.status_code} - {response.text}"
    config_data = response.json()
    config_id = config_data["id"]
    
    yield config_id
    
    # Cleanup: Delete configuration after test
    session.delete(f"{BASE_URL}/api/v1/config/{config_id}")


# ==================== Test Classes ====================

@pytest.mark.api
class TestHealthEndpoint:
    """Test health check endpoint."""
    
    def test_health_check_returns_200(self, session):
        """Test that health endpoint returns 200 OK."""
        response = session.get(f"{BASE_URL}/api/v1/health")
        assert response.status_code == 200
    
    def test_health_check_has_required_fields(self, session):
        """Test that health response contains required fields."""
        response = session.get(f"{BASE_URL}/api/v1/health")
        data = response.json()
        
        assert "status" in data
        assert "app_name" in data
        assert "version" in data
        assert data["app_name"] == "Agentic AI Test Case Generator"
    
    def test_health_check_response_format(self, session):
        """Test health check response format is valid JSON."""
        response = session.get(f"{BASE_URL}/api/v1/health")
        assert response.headers["content-type"] == "application/json"
        # Should not raise exception
        data = response.json()
        assert isinstance(data, dict)


@pytest.mark.api
class TestConnectionTesting:
    """Test LLM connection testing endpoints."""
    
    def test_openrouter_connection_success(self, session, api_key):
        """Test successful OpenRouter connection with valid API key."""
        response = session.post(
            f"{BASE_URL}/api/v1/config/test-connection",
            json={
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1",
                "api_key": api_key
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert data["provider"] == "openrouter"
        assert data["model"] == "deepseek/deepseek-r1"
        assert "latency_ms" in data
        assert isinstance(data["latency_ms"], (int, float))
        assert data["latency_ms"] > 0
    
    def test_openrouter_connection_invalid_key(self, session):
        """Test OpenRouter connection with invalid API key."""
        response = session.post(
            f"{BASE_URL}/api/v1/config/test-connection",
            json={
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1",
                "api_key": "invalid-key-12345"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is False
        assert "error" in data
        assert data["error"] is not None
    
    def test_connection_missing_api_key(self, session):
        """Test connection test with missing API key for cloud provider."""
        response = session.post(
            f"{BASE_URL}/api/v1/config/test-connection",
            json={
                "provider": "openrouter",
                "model": "deepseek/deepseek-r1"
                # Missing api_key
            }
        )
        
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data
    
    def test_connection_invalid_provider(self, session):
        """Test connection test with invalid provider."""
        response = session.post(
            f"{BASE_URL}/api/v1/config/test-connection",
            json={
                "provider": "invalid-provider",
                "model": "some-model",
                "api_key": "fake-key"
            }
        )
        
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data


@pytest.mark.api
class TestConfigurationCRUD:
    """Test configuration CRUD operations."""
    
    def test_create_configuration_success(self, session, project_id, api_key):
        """Test successful configuration creation."""
        response = session.post(
            f"{BASE_URL}/api/v1/config",
            json={
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
        
        assert response.status_code == 201
        data = response.json()
        
        # Validate response structure
        assert "id" in data
        assert UUID(data["id"])  # Valid UUID
        assert data["provider"] == "openrouter"
        assert data["model"] == "deepseek/deepseek-r1"
        assert data["temperature"] == 0.7
        assert data["max_tokens"] == 2000
        assert data["kb_enabled"] is True
        assert data["kb_threshold"] == 0.8
        assert data["kb_max_docs"] == 5
        
        # API key should be masked
        assert "api_key" in data
        assert "****" in data["api_key"]
        assert api_key not in data["api_key"]  # Full key should not be exposed
        
        # Cleanup
        session.delete(f"{BASE_URL}/api/v1/config/{data['id']}")
    
    def test_create_configuration_invalid_project(self, session, api_key):
        """Test configuration creation with non-existent project ID."""
        fake_project_id = "00000000-0000-0000-0000-000000000000"
        
        response = session.post(
            f"{BASE_URL}/api/v1/config",
            json={
                "project_id": fake_project_id,
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
        
        assert response.status_code == 500  # Foreign key violation
        assert "detail" in response.json()
    
    def test_get_configuration_by_id(self, session, config_id):
        """Test retrieving configuration by ID."""
        response = session.get(f"{BASE_URL}/api/v1/config/{config_id}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["id"] == config_id
        assert data["provider"] == "openrouter"
        assert "api_key" in data
        assert "****" in data["api_key"]  # Should be masked
    
    def test_get_configuration_not_found(self, session):
        """Test getting non-existent configuration."""
        fake_id = "00000000-0000-0000-0000-000000000000"
        response = session.get(f"{BASE_URL}/api/v1/config/{fake_id}")
        
        assert response.status_code == 404
    
    def test_get_configuration_by_project(self, session, project_id, config_id):
        """Test retrieving configuration by project ID."""
        response = session.get(f"{BASE_URL}/api/v1/config/project/{project_id}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["project_id"] == project_id
        assert data["provider"] == "openrouter"
    
    def test_update_configuration(self, session, config_id):
        """Test updating configuration fields."""
        response = session.patch(
            f"{BASE_URL}/api/v1/config/{config_id}",
            json={
                "temperature": 0.9,
                "kb_enabled": False,
                "kb_max_docs": 3
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["temperature"] == 0.9
        assert data["kb_enabled"] is False
        assert data["kb_max_docs"] == 3
        # Other fields should remain unchanged
        assert data["provider"] == "openrouter"
        assert data["model"] == "deepseek/deepseek-r1"
    
    def test_update_configuration_not_found(self, session):
        """Test updating non-existent configuration."""
        fake_id = "00000000-0000-0000-0000-000000000000"
        response = session.patch(
            f"{BASE_URL}/api/v1/config/{fake_id}",
            json={"temperature": 0.5}
        )
        
        assert response.status_code == 404
    
    def test_list_configurations(self, session, config_id):
        """Test listing all configurations."""
        response = session.get(f"{BASE_URL}/api/v1/config")
        
        assert response.status_code == 200
        data = response.json()
        
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Check that our config is in the list
        config_ids = [c["id"] for c in data]
        assert config_id in config_ids
    
    def test_list_configurations_with_filter(self, session, project_id):
        """Test listing configurations with project filter."""
        response = session.get(
            f"{BASE_URL}/api/v1/config",
            params={"project_id": project_id}
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # All configs should belong to the specified project
        for config in data:
            assert config["project_id"] == project_id
    
    def test_delete_configuration(self, session, project_id, api_key):
        """Test deleting configuration (soft delete)."""
        # Create a config to delete
        create_response = session.post(
            f"{BASE_URL}/api/v1/config",
            json={
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
        assert create_response.status_code == 201
        config_data = create_response.json()
        config_id = config_data["id"]
        
        # Delete it
        delete_response = session.delete(f"{BASE_URL}/api/v1/config/{config_id}")
        assert delete_response.status_code == 204
        
        # Verify it's deleted (soft delete - should return 404)
        get_response = session.get(f"{BASE_URL}/api/v1/config/{config_id}")
        assert get_response.status_code == 404


@pytest.mark.api
class TestKnowledgeBaseSettings:
    """Test Knowledge Base configuration settings."""
    
    def test_kb_settings_in_config(self, session, project_id, api_key):
        """Test that KB settings are properly saved and retrieved."""
        response = session.post(
            f"{BASE_URL}/api/v1/config",
            json={
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
        
        assert response.status_code == 201
        data = response.json()
        
        assert data["kb_enabled"] is True
        assert data["kb_threshold"] == 0.85
        assert data["kb_max_docs"] == 7
        assert data["kb_settings"] is not None
        assert data["kb_settings"]["custom_option"] == "value"
        
        # Cleanup
        session.delete(f"{BASE_URL}/api/v1/config/{data['id']}")
    
    def test_kb_threshold_valid_range(self, session, project_id, api_key):
        """Test KB threshold accepts valid range (0.0 to 1.0)."""
        for threshold in [0.0, 0.5, 1.0]:
            response = session.post(
                f"{BASE_URL}/api/v1/config",
                json={
                    "project_id": project_id,
                    "provider": "openrouter",
                    "model": "deepseek/deepseek-r1",
                    "api_key": api_key,
                    "temperature": 0.7,
                    "max_tokens": 2000,
                    "kb_enabled": True,
                    "kb_threshold": threshold,
                    "kb_max_docs": 5
                }
            )
            
            assert response.status_code == 201
            data = response.json()
            assert data["kb_threshold"] == threshold
            
            # Cleanup
            session.delete(f"{BASE_URL}/api/v1/config/{data['id']}")


@pytest.mark.integration
class TestOpenAPIDocumentation:
    """Test OpenAPI documentation endpoints."""
    
    def test_openapi_json_available(self, session):
        """Test that OpenAPI JSON schema is accessible."""
        response = session.get(f"{BASE_URL}/openapi.json")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "openapi" in data
        assert "info" in data
        assert "paths" in data
        
        # Check that config endpoints are documented
        assert "/api/v1/config" in data["paths"]
        assert "/api/v1/config/{config_id}" in data["paths"]
        assert "/api/v1/config/test-connection" in data["paths"]
    
    def test_docs_endpoint_available(self, session):
        """Test that Swagger UI docs endpoint is accessible."""
        response = session.get(f"{BASE_URL}/docs")
        
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]


# ==================== Test Execution ====================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--html=test-report.html", "--self-contained-html"])
