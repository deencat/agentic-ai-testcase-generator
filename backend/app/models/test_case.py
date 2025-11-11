"""
TestCase model - Represents a generated test case.
"""
from sqlalchemy import Column, String, Integer, Text, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class TestCase(Base):
    """Test case model for storing generated test cases."""
    
    __tablename__ = "test_cases"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Test Case Identifiers
    test_case_id = Column(String(100), nullable=False, index=True)  # e.g., TC001
    title = Column(String(500), nullable=False)
    
    # Test Case Details
    category = Column(String(100), nullable=True, index=True)
    priority = Column(String(50), nullable=True, index=True)  # High, Medium, Low
    system = Column(String(100), nullable=True, index=True)   # CRM, Billing, etc.
    
    # Test Case Content
    preconditions = Column(Text, nullable=True)
    steps = Column(JSON, nullable=True)  # Array of step objects
    expected_result = Column(Text, nullable=True)
    test_data = Column(JSON, nullable=True)  # Test data as JSON
    
    # Knowledge Base Integration
    kb_references = Column(JSON, nullable=True)  # References to KB documents
    kb_compliance_score = Column(Integer, nullable=True)  # 0-100
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Agent that created this test case
    created_by_agent = Column(String(50), nullable=True)  # Planner, Generator, Executor
    
    # Relationships
    project = relationship("Project", back_populates="test_cases")
    
    def __repr__(self):
        return f"<TestCase(id={self.id}, test_case_id={self.test_case_id}, title={self.title})>"
