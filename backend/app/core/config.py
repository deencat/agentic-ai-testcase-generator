"""
Application configuration settings using Pydantic Settings.
Loads environment variables from .env file.
"""
from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path

# Get the backend directory path
BACKEND_DIR = Path(__file__).parent.parent.parent


class Settings(BaseSettings):
    """Application settings."""
    
    # Application Info
    APP_NAME: str = "Agentic AI Test Case Generator"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "agentic_testcase_generator_dev"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ENCRYPTION_KEY: str = "your-encryption-key-here-32-chars"
    
    # LLM Providers
    OLLAMA_BASE_URL: str = "http://127.0.0.1:11434"
    OPENROUTER_API_KEY: str = ""
    DEEPSEEK_API_KEY: str = ""
    GOOGLE_GEMINI_API_KEY: str = ""
    
    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 50
    TEMP_FILE_DIR: str = "./temp_uploads"
    ALLOWED_FILE_EXTENSIONS: str = ".pdf,.xlsx,.xls,.txt"
    
    @property
    def allowed_extensions(self) -> List[str]:
        """Parse allowed file extensions from comma-separated string."""
        return [ext.strip() for ext in self.ALLOWED_FILE_EXTENSIONS.split(",")]
    
    # Knowledge Base
    KB_MAX_FILE_SIZE_MB: int = 10  # Increased to 10MB for typical user guide PDFs
    KB_MAX_DOCUMENTS: int = 50
    KB_ALLOWED_EXTENSIONS: str = ".pdf,.txt,.md"
    
    @property
    def kb_allowed_extensions(self) -> List[str]:
        """Parse KB allowed file extensions from comma-separated string."""
        return [ext.strip() for ext in self.KB_ALLOWED_EXTENSIONS.split(",")]
    
    class Config:
        env_file = str(BACKEND_DIR / ".env")
        env_file_encoding = 'utf-8'
        case_sensitive = True


# Global settings instance
settings = Settings()
