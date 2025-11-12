"""
Configuration model - Stores LLM and generation settings.
"""
from sqlalchemy import Column, String, Float, Integer, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Configuration(Base):
    """Configuration model for LLM and generation settings."""
    
    __tablename__ = "configurations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # LLM Provider Settings
    provider = Column(String(50), nullable=False, default="ollama")  # ollama, openrouter, deepseek, gemini
    model = Column(String(100), nullable=False, default="llama3")
    base_url = Column(String(255), nullable=True)
    api_key_encrypted = Column(Text, nullable=True)  # Encrypted API key
    
    # Generation Parameters
    temperature = Column(Float, default=0.7, nullable=False)
    max_tokens = Column(Integer, default=2000, nullable=False)
    
    # Knowledge Base Settings
    kb_enabled = Column(Boolean, default=False, nullable=False)
    kb_threshold = Column(Float, default=0.7, nullable=False)  # Similarity threshold
    kb_max_docs = Column(Integer, default=5, nullable=False)  # Max KB docs to include
    kb_settings = Column(JSON, nullable=True)  # Additional KB settings
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="configurations")
    
    def __repr__(self):
        return f"<Configuration(id={self.id}, provider={self.provider}, model={self.model})>"
