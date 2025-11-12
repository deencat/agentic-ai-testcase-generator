"""
LLM Connection Testing Service - Tests connectivity to LLM providers.
"""
import httpx
import time
from typing import Dict, Any, Optional

from app.core.config import settings


class LLMConnectionTester:
    """Service for testing LLM provider connections."""
    
    async def test_ollama_connection(
        self, 
        base_url: str, 
        model: str
    ) -> Dict[str, Any]:
        """Test connection to Ollama."""
        start_time = time.time()
        
        try:
            # Use the provided base_url or default from settings
            url = base_url or settings.OLLAMA_BASE_URL
            
            # Test 1: Check if Ollama is running
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{url}/api/tags")
                
                if response.status_code != 200:
                    return {
                        "success": False,
                        "message": "Ollama server not responding",
                        "error": f"HTTP {response.status_code}"
                    }
                
                # Test 2: Check if model is available
                models_data = response.json()
                available_models = [m["name"] for m in models_data.get("models", [])]
                
                if model not in available_models:
                    return {
                        "success": False,
                        "message": f"Model '{model}' not found in Ollama",
                        "error": f"Available models: {', '.join(available_models)}"
                    }
                
                # Test 3: Quick generation test
                test_response = await client.post(
                    f"{url}/api/generate",
                    json={
                        "model": model,
                        "prompt": "Test",
                        "stream": False
                    }
                )
                
                if test_response.status_code != 200:
                    return {
                        "success": False,
                        "message": "Model generation test failed",
                        "error": f"HTTP {test_response.status_code}"
                    }
                
                latency_ms = (time.time() - start_time) * 1000
                
                return {
                    "success": True,
                    "message": f"Successfully connected to Ollama with model '{model}'",
                    "latency_ms": round(latency_ms, 2)
                }
        
        except httpx.ConnectError:
            return {
                "success": False,
                "message": "Cannot connect to Ollama server",
                "error": f"Ensure Ollama is running at {url}"
            }
        except httpx.TimeoutException:
            return {
                "success": False,
                "message": "Connection timeout",
                "error": "Ollama server took too long to respond"
            }
        except Exception as e:
            return {
                "success": False,
                "message": "Unexpected error during connection test",
                "error": str(e)
            }
    
    async def test_openrouter_connection(
        self, 
        api_key: str, 
        model: str
    ) -> Dict[str, Any]:
        """Test connection to OpenRouter."""
        start_time = time.time()
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": "Test"}],
                        "max_tokens": 10
                    }
                )
                
                if response.status_code == 401:
                    return {
                        "success": False,
                        "message": "Invalid API key",
                        "error": "Authentication failed"
                    }
                
                if response.status_code != 200:
                    error_data = response.json() if response.text else {}
                    return {
                        "success": False,
                        "message": "OpenRouter API error",
                        "error": error_data.get("error", {}).get("message", f"HTTP {response.status_code}")
                    }
                
                latency_ms = (time.time() - start_time) * 1000
                
                return {
                    "success": True,
                    "message": f"Successfully connected to OpenRouter with model '{model}'",
                    "latency_ms": round(latency_ms, 2)
                }
        
        except httpx.TimeoutException:
            return {
                "success": False,
                "message": "Connection timeout",
                "error": "OpenRouter API took too long to respond"
            }
        except Exception as e:
            return {
                "success": False,
                "message": "Unexpected error during connection test",
                "error": str(e)
            }
    
    async def test_deepseek_connection(
        self, 
        api_key: str, 
        model: str
    ) -> Dict[str, Any]:
        """Test connection to Deepseek."""
        start_time = time.time()
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    "https://api.deepseek.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": "Test"}],
                        "max_tokens": 10
                    }
                )
                
                if response.status_code == 401:
                    return {
                        "success": False,
                        "message": "Invalid API key",
                        "error": "Authentication failed"
                    }
                
                if response.status_code != 200:
                    error_data = response.json() if response.text else {}
                    return {
                        "success": False,
                        "message": "Deepseek API error",
                        "error": error_data.get("error", {}).get("message", f"HTTP {response.status_code}")
                    }
                
                latency_ms = (time.time() - start_time) * 1000
                
                return {
                    "success": True,
                    "message": f"Successfully connected to Deepseek with model '{model}'",
                    "latency_ms": round(latency_ms, 2)
                }
        
        except httpx.TimeoutException:
            return {
                "success": False,
                "message": "Connection timeout",
                "error": "Deepseek API took too long to respond"
            }
        except Exception as e:
            return {
                "success": False,
                "message": "Unexpected error during connection test",
                "error": str(e)
            }
    
    async def test_gemini_connection(
        self, 
        api_key: str, 
        model: str
    ) -> Dict[str, Any]:
        """Test connection to Google Gemini."""
        start_time = time.time()
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}",
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [{"parts": [{"text": "Test"}]}]
                    }
                )
                
                if response.status_code == 401 or response.status_code == 403:
                    return {
                        "success": False,
                        "message": "Invalid API key",
                        "error": "Authentication failed"
                    }
                
                if response.status_code != 200:
                    error_data = response.json() if response.text else {}
                    return {
                        "success": False,
                        "message": "Gemini API error",
                        "error": error_data.get("error", {}).get("message", f"HTTP {response.status_code}")
                    }
                
                latency_ms = (time.time() - start_time) * 1000
                
                return {
                    "success": True,
                    "message": f"Successfully connected to Google Gemini with model '{model}'",
                    "latency_ms": round(latency_ms, 2)
                }
        
        except httpx.TimeoutException:
            return {
                "success": False,
                "message": "Connection timeout",
                "error": "Gemini API took too long to respond"
            }
        except Exception as e:
            return {
                "success": False,
                "message": "Unexpected error during connection test",
                "error": str(e)
            }


# Global tester instance
llm_tester = LLMConnectionTester()
