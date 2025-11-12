"""
KnowledgeBaseDocument model - Stores KB documents (User Guides, Manuals, etc.)
"""
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class KnowledgeBaseDocument(Base):
    """Knowledge Base document model for storing reference documentation."""
    
    __tablename__ = "knowledge_base_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Document Information
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # PDF, TXT
    file_size = Column(Integer, nullable=False)  # Size in bytes
    file_hash = Column(String(64), nullable=False, index=True)  # SHA-256 for deduplication
    
    # Document Classification
    doc_type = Column(String(100), nullable=True, index=True)  # system_guide, process, field_definition, etc.
    
    # Extracted Content
    extracted_text = Column(Text, nullable=True)
    extraction_status = Column(String(50), default="pending", nullable=False)  # pending, completed, failed
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="kb_documents")
    
    def __repr__(self):
        return f"<KnowledgeBaseDocument(id={self.id}, filename={self.filename}, doc_type={self.doc_type})>"
