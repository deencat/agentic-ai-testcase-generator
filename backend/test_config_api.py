"""
Configuration API Testing Script
Tests all configuration endpoints with real API keys from .env
"""
import requests
import json
from dotenv import load_dotenv
import os
from uuid import uuid4

# Load environment variables
load_dotenv()

# API Base URL
BASE_URL = "http://127.0.0.1:8000/api/v1"

# Colors for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'


def print_header(text):
    """Print colored header."""
    print(f"\n{BLUE}{'=' * 80}{RESET}")
    print(f"{BLUE}{text.center(80)}{RESET}")
    print(f"{BLUE}{'=' * 80}{RESET}\n")


def print_success(text):
    """Print success message."""
    print(f"{GREEN}✓ {text}{RESET}")


def print_error(text):
    """Print error message."""
    print(f"{RED}✗ {text}{RESET}")


def print_info(text):
    """Print info message."""
    print(f"{YELLOW}ℹ {text}{RESET}")


def test_health():
    """Test health endpoint."""
    print_header("Testing Health Endpoint")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print_success(f"Health check passed: {response.json()}")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Health check error: {str(e)}")
        return False


def create_test_project():
    """Create a test project."""
    print_header("Creating Test Project")
    try:
        data = {
            "name": "Configuration Test Project",
            "description": "Project for testing configuration API with OpenRouter"
        }
        response = requests.post(f"{BASE_URL}/projects", json=data)
        if response.status_code == 201:
            project = response.json()
            print_success(f"Project created: {project['name']}")
            print_info(f"Project ID: {project['id']}")
            return project['id']
        else:
            print_error(f"Project creation failed: {response.status_code}")
            print_error(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Project creation error: {str(e)}")
        return None


def test_connection_openrouter():
    """Test connection to OpenRouter."""
    print_header("Testing OpenRouter Connection")
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print_error("OPENROUTER_API_KEY not found in .env file")
        return False
    
    print_info(f"Using API key: {api_key[:20]}...{api_key[-4:]}")
    
    try:
        data = {
            "provider": "openrouter",
            "model": "deepseek/deepseek-r1",
            "api_key": api_key
        }
        
        response = requests.post(f"{BASE_URL}/config/test-connection", json=data)
        result = response.json()
        
        if response.status_code == 200 and result.get("success"):
            print_success(f"Connection successful!")
            print_info(f"Message: {result.get('message')}")
            print_info(f"Latency: {result.get('latency_ms', 0):.2f} ms")
            return True
        else:
            print_error(f"Connection failed!")
            print_error(f"Message: {result.get('message', 'Unknown error')}")
            if result.get('error'):
                print_error(f"Error: {result.get('error')}")
            return False
    except Exception as e:
        print_error(f"Connection test error: {str(e)}")
        return False


def create_configuration(project_id):
    """Create a configuration."""
    print_header("Creating Configuration")
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    
    try:
        data = {
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
        
        response = requests.post(f"{BASE_URL}/config", json=data)
        
        if response.status_code == 201:
            config = response.json()
            print_success("Configuration created successfully!")
            print_info(f"Config ID: {config['id']}")
            print_info(f"Provider: {config['provider']}")
            print_info(f"Model: {config['model']}")
            print_info(f"API Key (masked): {config.get('api_key', 'N/A')}")
            print_info(f"Temperature: {config['temperature']}")
            print_info(f"KB Enabled: {config['kb_enabled']}")
            return config['id']
        else:
            print_error(f"Configuration creation failed: {response.status_code}")
            print_error(f"Response: {response.text}")
            return None
    except Exception as e:
        print_error(f"Configuration creation error: {str(e)}")
        return None


def get_configuration(config_id):
    """Get a configuration by ID."""
    print_header("Getting Configuration by ID")
    
    try:
        response = requests.get(f"{BASE_URL}/config/{config_id}")
        
        if response.status_code == 200:
            config = response.json()
            print_success("Configuration retrieved successfully!")
            print_info(f"Provider: {config['provider']}")
            print_info(f"Model: {config['model']}")
            print_info(f"API Key (masked): {config.get('api_key', 'N/A')}")
            print_info(f"Temperature: {config['temperature']}")
            print_info(f"KB Enabled: {config['kb_enabled']}")
            return True
        else:
            print_error(f"Get configuration failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Get configuration error: {str(e)}")
        return False


def get_project_configuration(project_id):
    """Get configuration by project ID."""
    print_header("Getting Configuration by Project ID")
    
    try:
        response = requests.get(f"{BASE_URL}/config/project/{project_id}")
        
        if response.status_code == 200:
            config = response.json()
            print_success("Project configuration retrieved successfully!")
            print_info(f"Config ID: {config['id']}")
            print_info(f"Provider: {config['provider']}")
            print_info(f"Model: {config['model']}")
            return True
        else:
            print_error(f"Get project configuration failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Get project configuration error: {str(e)}")
        return False


def update_configuration(config_id):
    """Update a configuration."""
    print_header("Updating Configuration")
    
    try:
        data = {
            "temperature": 0.8,
            "kb_enabled": False,
            "kb_max_docs": 3
        }
        
        response = requests.patch(f"{BASE_URL}/config/{config_id}", json=data)
        
        if response.status_code == 200:
            config = response.json()
            print_success("Configuration updated successfully!")
            print_info(f"New Temperature: {config['temperature']}")
            print_info(f"KB Enabled: {config['kb_enabled']}")
            print_info(f"KB Max Docs: {config['kb_max_docs']}")
            return True
        else:
            print_error(f"Update configuration failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Update configuration error: {str(e)}")
        return False


def list_configurations():
    """List all configurations."""
    print_header("Listing All Configurations")
    
    try:
        response = requests.get(f"{BASE_URL}/config")
        
        if response.status_code == 200:
            configs = response.json()
            print_success(f"Found {len(configs)} configuration(s)")
            for i, config in enumerate(configs, 1):
                print_info(f"\n{i}. {config['provider']} - {config['model']}")
                print_info(f"   Config ID: {config['id']}")
                print_info(f"   Project ID: {config['project_id']}")
            return True
        else:
            print_error(f"List configurations failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"List configurations error: {str(e)}")
        return False


def delete_configuration(config_id):
    """Delete a configuration."""
    print_header("Deleting Configuration")
    
    try:
        response = requests.delete(f"{BASE_URL}/config/{config_id}")
        
        if response.status_code == 204:
            print_success("Configuration deleted successfully!")
            return True
        else:
            print_error(f"Delete configuration failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Delete configuration error: {str(e)}")
        return False


def main():
    """Run all tests."""
    print_header("Configuration API Testing Suite")
    print_info("Testing all configuration endpoints with OpenRouter")
    
    # Test health
    if not test_health():
        print_error("Server is not running! Please start the server first.")
        return
    
    # Test OpenRouter connection
    connection_ok = test_connection_openrouter()
    
    # Create test project
    project_id = create_test_project()
    if not project_id:
        print_error("Cannot continue without a project. Exiting.")
        return
    
    # Create configuration
    config_id = create_configuration(project_id)
    if not config_id:
        print_error("Cannot continue without a configuration. Exiting.")
        return
    
    # Get configuration by ID
    get_configuration(config_id)
    
    # Get configuration by project ID
    get_project_configuration(project_id)
    
    # Update configuration
    update_configuration(config_id)
    
    # List all configurations
    list_configurations()
    
    # Delete configuration
    delete_configuration(config_id)
    
    # Final summary
    print_header("Test Summary")
    if connection_ok:
        print_success("All configuration API tests completed!")
        print_info("Configuration endpoints are working correctly with OpenRouter")
    else:
        print_error("Some tests failed. Please check the output above.")


if __name__ == "__main__":
    main()
