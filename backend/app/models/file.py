"""
File model - Represents uploaded files (PDF, Excel, text).
"""
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class File(Base):
    """File model for storing uploaded requirement files."""
    
    __tablename__ = "files"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # File Information
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # PDF, XLSX, TXT
    file_size = Column(Integer, nullable=False)  # Size in bytes
    file_path = Column(String(500), nullable=True)  # Path to stored file
    
    # Extracted Content
    extracted_text = Column(Text, nullable=True)
    extraction_status = Column(String(50), default="pending", nullable=False)  # pending, completed, failed
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    project = relationship("Project", back_populates="files")
    
    def __repr__(self):
        return f"<File(id={self.id}, filename={self.filename}, type={self.file_type})>"
