"""
Pydantic schemas for Knowledge Base Document model.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from uuid import UUID


class KnowledgeBaseDocumentBase(BaseModel):
    """Base schema for Knowledge Base Document."""
    filename: str
    file_type: str
    doc_type: Optional[str] = None
    file_size: int
    file_hash: str
    extracted_text: str


class KnowledgeBaseDocumentCreate(KnowledgeBaseDocumentBase):
    """Schema for creating a Knowledge Base Document."""
    pass


class KnowledgeBaseDocumentUpdate(BaseModel):
    """Schema for updating a Knowledge Base Document."""
    filename: Optional[str] = None
    doc_type: Optional[str] = None
    is_active: Optional[bool] = None


class KnowledgeBaseDocumentInDB(KnowledgeBaseDocumentBase):
    """Schema for Knowledge Base Document in database."""
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class KnowledgeBaseDocumentResponse(KnowledgeBaseDocumentInDB):
    """Schema for Knowledge Base Document API response."""
    pass


class KnowledgeBaseDocumentListResponse(BaseModel):
    """Schema for listing Knowledge Base Documents."""
    documents: list[KnowledgeBaseDocumentResponse]
    total_count: int
    active_count: int
