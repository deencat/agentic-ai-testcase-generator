"""
Pydantic schemas for File model.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from uuid import UUID


class FileBase(BaseModel):
    """Base schema for File."""
    file_name: str
    file_type: str
    file_size: int
    file_path: str
    extracted_text: Optional[str] = None


class FileCreate(FileBase):
    """Schema for creating a File."""
    project_id: UUID


class FileUpdate(BaseModel):
    """Schema for updating a File."""
    file_name: Optional[str] = None
    extracted_text: Optional[str] = None


class FileInDB(FileBase):
    """Schema for File in database."""
    id: UUID
    project_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class FileResponse(FileInDB):
    """Schema for File API response."""
    pass
