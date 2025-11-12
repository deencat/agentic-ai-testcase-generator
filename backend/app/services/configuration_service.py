"""
Configuration Service - Handles configuration CRUD operations with encryption.
"""
from sqlalchemy.orm import Session
from cryptography.fernet import Fernet
from typing import Optional, List
from uuid import UUID
import base64
import os

from app.models.configuration import Configuration
from app.schemas.configuration import ConfigurationCreate, ConfigurationUpdate
from app.core.config import settings


class ConfigurationService:
    """Service for managing configuration with API key encryption."""
    
    def __init__(self):
        """Initialize encryption cipher."""
        # Use encryption key from settings (32 bytes base64 encoded)
        key = settings.ENCRYPTION_KEY.encode()
        # Ensure key is 32 bytes for Fernet
        if len(key) < 32:
            key = key.ljust(32, b'0')
        else:
            key = key[:32]
        self.cipher = Fernet(base64.urlsafe_b64encode(key))
    
    def encrypt_api_key(self, api_key: str) -> str:
        """Encrypt API key using Fernet (AES-256)."""
        if not api_key:
            return None
        encrypted = self.cipher.encrypt(api_key.encode())
        return encrypted.decode()
    
    def decrypt_api_key(self, encrypted_key: str) -> str:
        """Decrypt API key."""
        if not encrypted_key:
            return None
        decrypted = self.cipher.decrypt(encrypted_key.encode())
        return decrypted.decode()
    
    def mask_api_key(self, api_key: Optional[str]) -> Optional[str]:
        """Mask API key for display (show last 4 chars only)."""
        if not api_key:
            return None
        if len(api_key) <= 4:
            return "****"
        return f"****{api_key[-4:]}"
    
    def create_configuration(
        self, 
        db: Session, 
        config_data: ConfigurationCreate
    ) -> Configuration:
        """Create a new configuration with encrypted API key."""
        # Encrypt API key if provided
        encrypted_key = None
        if config_data.api_key:
            encrypted_key = self.encrypt_api_key(config_data.api_key)
        
        # Create configuration
        db_config = Configuration(
            project_id=config_data.project_id,
            provider=config_data.provider,
            model=config_data.model,
            base_url=config_data.base_url,
            api_key_encrypted=encrypted_key,
            temperature=config_data.temperature,
            max_tokens=config_data.max_tokens,
            kb_enabled=config_data.kb_enabled,
            kb_threshold=config_data.kb_threshold,
            kb_max_docs=config_data.kb_max_docs,
            kb_settings=config_data.kb_settings,
            is_active=True
        )
        
        db.add(db_config)
        db.commit()
        db.refresh(db_config)
        
        return db_config
    
    def get_configuration(
        self, 
        db: Session, 
        config_id: UUID
    ) -> Optional[Configuration]:
        """Get configuration by ID."""
        return db.query(Configuration).filter(
            Configuration.id == config_id,
            Configuration.is_active == True
        ).first()
    
    def get_project_configuration(
        self, 
        db: Session, 
        project_id: UUID
    ) -> Optional[Configuration]:
        """Get active configuration for a project."""
        return db.query(Configuration).filter(
            Configuration.project_id == project_id,
            Configuration.is_active == True
        ).first()
    
    def update_configuration(
        self, 
        db: Session, 
        config_id: UUID, 
        config_data: ConfigurationUpdate
    ) -> Optional[Configuration]:
        """Update configuration with encrypted API key."""
        db_config = self.get_configuration(db, config_id)
        if not db_config:
            return None
        
        # Update fields
        update_dict = config_data.model_dump(exclude_unset=True)
        
        # Handle API key encryption
        if "api_key" in update_dict:
            api_key = update_dict.pop("api_key")
            if api_key:
                update_dict["api_key_encrypted"] = self.encrypt_api_key(api_key)
            else:
                update_dict["api_key_encrypted"] = None
        
        # Apply updates
        for key, value in update_dict.items():
            setattr(db_config, key, value)
        
        db.commit()
        db.refresh(db_config)
        
        return db_config
    
    def delete_configuration(
        self, 
        db: Session, 
        config_id: UUID, 
        hard_delete: bool = False
    ) -> bool:
        """Delete configuration (soft or hard delete)."""
        db_config = db.query(Configuration).filter(
            Configuration.id == config_id
        ).first()
        
        if not db_config:
            return False
        
        if hard_delete:
            db.delete(db_config)
        else:
            db_config.is_active = False
        
        db.commit()
        return True
    
    def get_decrypted_api_key(
        self, 
        db: Session, 
        config_id: UUID
    ) -> Optional[str]:
        """Get decrypted API key for internal use (LLM calls)."""
        db_config = self.get_configuration(db, config_id)
        if not db_config or not db_config.api_key_encrypted:
            return None
        return self.decrypt_api_key(db_config.api_key_encrypted)
    
    def list_configurations(
        self, 
        db: Session, 
        project_id: Optional[UUID] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Configuration]:
        """List configurations with optional project filter."""
        query = db.query(Configuration).filter(Configuration.is_active == True)
        
        if project_id:
            query = query.filter(Configuration.project_id == project_id)
        
        return query.offset(skip).limit(limit).all()


# Global service instance
configuration_service = ConfigurationService()
