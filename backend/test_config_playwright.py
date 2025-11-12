"""
Playwright API Testing for Configuration Endpoints
Tests all configuration APIs with browser automation and API context
"""
import asyncio
import os
from playwright.async_api import async_playwright
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# API Base URL
BASE_URL = "http://127.0.0.1:8000"

# Colors for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
CYAN = '\033[96m'
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


def print_json(data, title="Response"):
    """Print formatted JSON."""
    print(f"{CYAN}{title}:{RESET}")
    print(json.dumps(data, indent=2))


async def test_health_endpoint(api_context):
    """Test health endpoint."""
    print_header("Test 1: Health Check Endpoint")
    
    try:
        response = await api_context.get(f"{BASE_URL}/api/v1/health")
        data = await response.json()
        
        if response.ok:
            print_success("Health endpoint is working")
            print_json(data, "Health Status")
            return True
        else:
            print_error(f"Health check failed with status {response.status}")
            return False
    except Exception as e:
        print_error(f"Health check error: {str(e)}")
        return False


async def create_test_project(api_context):
    """Create a test project."""
    print_header("Test 2: Create Test Project")
    
    try:
        payload = {
            "name": "Playwright Test Project",
            "description": "Testing configuration API with Playwright and OpenRouter"
        }
        
        print_info(f"Creating project: {payload['name']}")
        
        response = await api_context.post(
            f"{BASE_URL}/api/v1/projects",
            data=payload
        )
        
        data = await response.json()
        
        if response.status == 201:
            print_success("Project created successfully!")
            print_json(data, "Project Details")
            print_info(f"Project ID: {data['id']}")
            return data['id']
        else:
            print_error(f"Project creation failed with status {response.status}")
            print_json(data, "Error Response")
            return None
    except Exception as e:
        print_error(f"Project creation error: {str(e)}")
        return None


async def test_openrouter_connection(api_context):
    """Test OpenRouter connection."""
    print_header("Test 3: Test OpenRouter Connection")
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print_error("OPENROUTER_API_KEY not found in .env file")
        return False
    
    print_info(f"Using API key: {api_key[:20]}...{api_key[-4:]}")
    print_info("Testing model: deepseek/deepseek-r1")
    
    try:
        payload = {
            "provider": "openrouter",
            "model": "deepseek/deepseek-r1",
            "api_key": api_key
        }
        
        response = await api_context.post(
            f"{BASE_URL}/api/v1/config/test-connection",
            data=payload
        )
        
        data = await response.json()
        
        if response.ok and data.get("success"):
            print_success("OpenRouter connection successful!")
            print_info(f"Message: {data.get('message')}")
            print_info(f"Latency: {data.get('latency_ms', 0):.2f} ms")
            print_json(data, "Connection Test Result")
            return True
        else:
            print_error("OpenRouter connection failed!")
            print_error(f"Message: {data.get('message', 'Unknown error')}")
            if data.get('error'):
                print_error(f"Error: {data.get('error')}")
            print_json(data, "Error Response")
            return False
    except Exception as e:
        print_error(f"Connection test error: {str(e)}")
        return False


async def create_configuration(api_context, project_id):
    """Create a configuration."""
    print_header("Test 4: Create Configuration")
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    
    try:
        payload = {
            "project_id": project_id,
            "provider": "openrouter",
            "model": "deepseek/deepseek-r1",
            "api_key": api_key,
            "temperature": 0.7,
            "max_tokens": 2000,
            "kb_enabled": True,
            "kb_threshold": 0.8,
            "kb_max_docs": 5,
            "kb_settings": None
        }
        
        print_info("Creating configuration with KB enabled")
        
        response = await api_context.post(
            f"{BASE_URL}/api/v1/config",
            data=payload
        )
        
        data = await response.json()
        
        if response.status == 201:
            print_success("Configuration created successfully!")
            print_info(f"Config ID: {data['id']}")
            print_info(f"Provider: {data['provider']}")
            print_info(f"Model: {data['model']}")
            print_info(f"API Key (masked): {data.get('api_key', 'N/A')}")
            print_info(f"Temperature: {data['temperature']}")
            print_info(f"KB Enabled: {data['kb_enabled']}")
            print_info(f"KB Threshold: {data['kb_threshold']}")
            print_json(data, "Configuration Details")
            return data['id']
        else:
            print_error(f"Configuration creation failed with status {response.status}")
            print_json(data, "Error Response")
            return None
    except Exception as e:
        print_error(f"Configuration creation error: {str(e)}")
        return None


async def get_configuration_by_id(api_context, config_id):
    """Get configuration by ID."""
    print_header("Test 5: Get Configuration by ID")
    
    try:
        print_info(f"Retrieving config ID: {config_id}")
        
        response = await api_context.get(f"{BASE_URL}/api/v1/config/{config_id}")
        data = await response.json()
        
        if response.ok:
            print_success("Configuration retrieved successfully!")
            print_info(f"Provider: {data['provider']}")
            print_info(f"Model: {data['model']}")
            print_info(f"API Key (masked): {data.get('api_key', 'N/A')}")
            print_json(data, "Configuration Details")
            return True
        else:
            print_error(f"Get configuration failed with status {response.status}")
            print_json(data, "Error Response")
            return False
    except Exception as e:
        print_error(f"Get configuration error: {str(e)}")
        return False


async def get_project_configuration(api_context, project_id):
    """Get configuration by project ID."""
    print_header("Test 6: Get Configuration by Project ID")
    
    try:
        print_info(f"Retrieving config for project: {project_id}")
        
        response = await api_context.get(f"{BASE_URL}/api/v1/config/project/{project_id}")
        data = await response.json()
        
        if response.ok:
            print_success("Project configuration retrieved successfully!")
            print_info(f"Config ID: {data['id']}")
            print_info(f"Provider: {data['provider']}")
            print_info(f"Model: {data['model']}")
            print_json(data, "Configuration Details")
            return True
        else:
            print_error(f"Get project configuration failed with status {response.status}")
            print_json(data, "Error Response")
            return False
    except Exception as e:
        print_error(f"Get project configuration error: {str(e)}")
        return False


async def update_configuration(api_context, config_id):
    """Update configuration."""
    print_header("Test 7: Update Configuration")
    
    try:
        payload = {
            "temperature": 0.9,
            "kb_enabled": False,
            "kb_max_docs": 3
        }
        
        print_info("Updating temperature, KB enabled, and KB max docs")
        
        response = await api_context.patch(
            f"{BASE_URL}/api/v1/config/{config_id}",
            data=payload
        )
        
        data = await response.json()
        
        if response.ok:
            print_success("Configuration updated successfully!")
            print_info(f"New Temperature: {data['temperature']}")
            print_info(f"KB Enabled: {data['kb_enabled']}")
            print_info(f"KB Max Docs: {data['kb_max_docs']}")
            print_json(data, "Updated Configuration")
            return True
        else:
            print_error(f"Update configuration failed with status {response.status}")
            print_json(data, "Error Response")
            return False
    except Exception as e:
        print_error(f"Update configuration error: {str(e)}")
        return False


async def list_configurations(api_context):
    """List all configurations."""
    print_header("Test 8: List All Configurations")
    
    try:
        response = await api_context.get(f"{BASE_URL}/api/v1/config")
        data = await response.json()
        
        if response.ok:
            print_success(f"Found {len(data)} configuration(s)")
            for i, config in enumerate(data, 1):
                print_info(f"\n{i}. {config['provider']} - {config['model']}")
                print_info(f"   Config ID: {config['id']}")
                print_info(f"   Project ID: {config['project_id']}")
                print_info(f"   Active: {config['is_active']}")
            print_json(data, "All Configurations")
            return True
        else:
            print_error(f"List configurations failed with status {response.status}")
            print_json(data, "Error Response")
            return False
    except Exception as e:
        print_error(f"List configurations error: {str(e)}")
        return False


async def delete_configuration(api_context, config_id):
    """Delete configuration."""
    print_header("Test 9: Delete Configuration (Soft Delete)")
    
    try:
        print_info(f"Deleting config ID: {config_id}")
        
        response = await api_context.delete(f"{BASE_URL}/api/v1/config/{config_id}")
        
        if response.status == 204:
            print_success("Configuration deleted successfully!")
            return True
        else:
            print_error(f"Delete configuration failed with status {response.status}")
            return False
    except Exception as e:
        print_error(f"Delete configuration error: {str(e)}")
        return False


async def test_swagger_ui(page):
    """Test Swagger UI accessibility."""
    print_header("Test 10: Swagger UI Accessibility")
    
    try:
        print_info("Navigating to Swagger UI...")
        await page.goto(f"{BASE_URL}/docs")
        
        # Wait for Swagger UI to load
        await page.wait_for_selector(".swagger-ui", timeout=10000)
        
        print_success("Swagger UI loaded successfully!")
        
        # Get the page title
        title = await page.title()
        print_info(f"Page title: {title}")
        
        # Take a screenshot
        screenshot_path = "swagger_ui_screenshot.png"
        await page.screenshot(path=screenshot_path)
        print_info(f"Screenshot saved: {screenshot_path}")
        
        # Check for Configuration section
        config_section = await page.query_selector("text=Configuration")
        if config_section:
            print_success("Configuration section found in Swagger UI")
        else:
            print_info("Configuration section not immediately visible")
        
        return True
    except Exception as e:
        print_error(f"Swagger UI test error: {str(e)}")
        return False


async def run_tests():
    """Run all Playwright tests."""
    print_header("Playwright Configuration API Testing Suite")
    print_info("Testing all configuration endpoints with OpenRouter API")
    print_info("Using Playwright for browser automation and API context")
    
    async with async_playwright() as p:
        # Launch browser
        print_info("\nLaunching Chromium browser...")
        browser = await p.chromium.launch(headless=False)
        
        # Create browser context with API context
        context = await browser.new_context(base_url=BASE_URL)
        api_context = context.request
        
        # Create a new page for UI tests
        page = await context.new_page()
        
        try:
            # Test counters
            tests_passed = 0
            tests_failed = 0
            
            # Run all tests
            if await test_health_endpoint(api_context):
                tests_passed += 1
            else:
                tests_failed += 1
            
            project_id = await create_test_project(api_context)
            if project_id:
                tests_passed += 1
            else:
                tests_failed += 1
                print_error("Cannot continue without project ID")
                return
            
            if await test_openrouter_connection(api_context):
                tests_passed += 1
            else:
                tests_failed += 1
            
            config_id = await create_configuration(api_context, project_id)
            if config_id:
                tests_passed += 1
            else:
                tests_failed += 1
                print_error("Cannot continue without config ID")
                return
            
            if await get_configuration_by_id(api_context, config_id):
                tests_passed += 1
            else:
                tests_failed += 1
            
            if await get_project_configuration(api_context, project_id):
                tests_passed += 1
            else:
                tests_failed += 1
            
            if await update_configuration(api_context, config_id):
                tests_passed += 1
            else:
                tests_failed += 1
            
            if await list_configurations(api_context):
                tests_passed += 1
            else:
                tests_failed += 1
            
            if await delete_configuration(api_context, config_id):
                tests_passed += 1
            else:
                tests_failed += 1
            
            if await test_swagger_ui(page):
                tests_passed += 1
            else:
                tests_failed += 1
            
            # Summary
            print_header("Test Summary")
            total_tests = tests_passed + tests_failed
            print_info(f"Total Tests: {total_tests}")
            print_success(f"Passed: {tests_passed}")
            if tests_failed > 0:
                print_error(f"Failed: {tests_failed}")
            else:
                print_success("All tests passed! 🎉")
            
            print_info("\nKeeping browser open for 5 seconds...")
            await asyncio.sleep(5)
            
        finally:
            await browser.close()
            print_info("Browser closed")


if __name__ == "__main__":
    asyncio.run(run_tests())
