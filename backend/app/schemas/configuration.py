"""
Configuration Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
from uuid import UUID
from datetime import datetime


class ConfigurationBase(BaseModel):
    """Base configuration schema."""
    
    # LLM Provider Settings
    provider: str = Field(..., description="LLM provider: ollama, openrouter, deepseek, gemini")
    model: str = Field(..., description="Model name (e.g., llama3, gpt-4, deepseek-chat)")
    base_url: Optional[str] = Field(None, description="Custom base URL (optional for Ollama)")
    api_key: Optional[str] = Field(None, description="API key for cloud providers")
    
    # Generation Parameters
    temperature: float = Field(0.7, ge=0.0, le=2.0, description="Temperature for generation (0.0-2.0)")
    max_tokens: int = Field(2000, ge=100, le=8000, description="Maximum tokens for generation")
    
    # Knowledge Base Settings
    kb_enabled: bool = Field(False, description="Enable Knowledge Base context")
    kb_threshold: float = Field(0.7, ge=0.0, le=1.0, description="KB similarity threshold")
    kb_max_docs: int = Field(5, ge=1, le=10, description="Maximum KB documents to include")
    kb_settings: Optional[Dict[str, Any]] = Field(None, description="Additional KB settings")
    
    @field_validator("provider")
    @classmethod
    def validate_provider(cls, v: str) -> str:
        """Validate LLM provider."""
        allowed_providers = ["ollama", "openrouter", "deepseek", "gemini"]
        if v.lower() not in allowed_providers:
            raise ValueError(f"Provider must be one of: {', '.join(allowed_providers)}")
        return v.lower()
    
    @field_validator("api_key")
    @classmethod
    def validate_api_key(cls, v: Optional[str], info) -> Optional[str]:
        """Validate API key for cloud providers."""
        provider = info.data.get("provider", "").lower()
        cloud_providers = ["openrouter", "deepseek", "gemini"]
        
        if provider in cloud_providers and not v:
            raise ValueError(f"API key is required for {provider}")
        return v


class ConfigurationCreate(ConfigurationBase):
    """Schema for creating a configuration."""
    project_id: UUID = Field(..., description="Project ID this configuration belongs to")


class ConfigurationUpdate(BaseModel):
    """Schema for updating a configuration (all fields optional)."""
    
    provider: Optional[str] = None
    model: Optional[str] = None
    base_url: Optional[str] = None
    api_key: Optional[str] = None
    temperature: Optional[float] = Field(None, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(None, ge=100, le=8000)
    kb_enabled: Optional[bool] = None
    kb_threshold: Optional[float] = Field(None, ge=0.0, le=1.0)
    kb_max_docs: Optional[int] = Field(None, ge=1, le=10)
    kb_settings: Optional[Dict[str, Any]] = None


class ConfigurationResponse(ConfigurationBase):
    """Schema for configuration response (excludes API key)."""
    
    id: UUID
    project_id: UUID
    api_key: Optional[str] = Field(None, description="API key (masked)")
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ConnectionTestRequest(BaseModel):
    """Schema for testing LLM connection."""
    
    provider: str = Field(..., description="LLM provider to test")
    model: str = Field(..., description="Model name to test")
    base_url: Optional[str] = Field(None, description="Custom base URL (for Ollama)")
    api_key: Optional[str] = Field(None, description="API key (for cloud providers)")


class ConnectionTestResponse(BaseModel):
    """Schema for connection test response."""
    
    success: bool
    message: str
    provider: str
    model: str
    latency_ms: Optional[float] = None
    error: Optional[str] = None
