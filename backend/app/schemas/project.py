"""
Pydantic schemas for API request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# Project Schemas
class ProjectBase(BaseModel):
    """Base project schema."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    kb_enabled: bool = False


class ProjectCreate(ProjectBase):
    """Schema for creating a project."""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    kb_enabled: Optional[bool] = None


class ProjectResponse(ProjectBase):
    """Schema for project response."""
    id: UUID
    kb_document_count: int = 0
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    
    class Config:
        from_attributes = True


# Health Check Schema
class HealthCheckResponse(BaseModel):
    """Health check response schema."""
    status: str = "healthy"
    app_name: str
    version: str
    database: str = "connected"
