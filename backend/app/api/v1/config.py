"""
Configuration API endpoints - Manage LLM and generation configurations.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.schemas.configuration import (
    ConfigurationCreate,
    ConfigurationUpdate,
    ConfigurationResponse,
    ConnectionTestRequest,
    ConnectionTestResponse
)
from app.services.configuration_service import configuration_service
from app.services.llm_connection_tester import llm_tester


router = APIRouter(prefix="/config", tags=["Configuration"])


@router.post(
    "",
    response_model=ConfigurationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Configuration",
    description="Create a new LLM and generation configuration for a project."
)
def create_configuration(
    config_data: ConfigurationCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new configuration with encrypted API key.
    
    - **project_id**: UUID of the project
    - **provider**: LLM provider (ollama, openrouter, deepseek, gemini)
    - **model**: Model name (e.g., llama3, gpt-4, deepseek-chat)
    - **base_url**: Custom base URL (optional, for Ollama)
    - **api_key**: API key for cloud providers (encrypted on storage)
    - **temperature**: Generation temperature (0.0-2.0)
    - **max_tokens**: Maximum tokens for generation
    - **kb_enabled**: Enable Knowledge Base context
    - **kb_threshold**: KB similarity threshold
    - **kb_max_docs**: Maximum KB documents to include
    """
    try:
        db_config = configuration_service.create_configuration(db, config_data)
        
        # Mask API key in response
        response = ConfigurationResponse.model_validate(db_config)
        if db_config.api_key_encrypted:
            # Decrypt then mask for display
            decrypted_key = configuration_service.decrypt_api_key(db_config.api_key_encrypted)
            response.api_key = configuration_service.mask_api_key(decrypted_key)
        
        return response
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create configuration: {str(e)}"
        )


@router.get(
    "/{config_id}",
    response_model=ConfigurationResponse,
    summary="Get Configuration",
    description="Retrieve a configuration by ID."
)
def get_configuration(
    config_id: UUID,
    db: Session = Depends(get_db)
):
    """Get configuration by ID (API key is masked in response)."""
    db_config = configuration_service.get_configuration(db, config_id)
    
    if not db_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Configuration with ID {config_id} not found"
        )
    
    # Mask API key in response
    response = ConfigurationResponse.model_validate(db_config)
    if db_config.api_key_encrypted:
        decrypted_key = configuration_service.decrypt_api_key(db_config.api_key_encrypted)
        response.api_key = configuration_service.mask_api_key(decrypted_key)
    
    return response


@router.get(
    "/project/{project_id}",
    response_model=ConfigurationResponse,
    summary="Get Project Configuration",
    description="Retrieve the active configuration for a project."
)
def get_project_configuration(
    project_id: UUID,
    db: Session = Depends(get_db)
):
    """Get active configuration for a project."""
    db_config = configuration_service.get_project_configuration(db, project_id)
    
    if not db_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No active configuration found for project {project_id}"
        )
    
    # Mask API key in response
    response = ConfigurationResponse.model_validate(db_config)
    if db_config.api_key_encrypted:
        decrypted_key = configuration_service.decrypt_api_key(db_config.api_key_encrypted)
        response.api_key = configuration_service.mask_api_key(decrypted_key)
    
    return response


@router.patch(
    "/{config_id}",
    response_model=ConfigurationResponse,
    summary="Update Configuration",
    description="Update configuration settings (all fields optional)."
)
def update_configuration(
    config_id: UUID,
    config_data: ConfigurationUpdate,
    db: Session = Depends(get_db)
):
    """
    Update configuration settings.
    
    - All fields are optional
    - API key will be re-encrypted if provided
    - Returns updated configuration with masked API key
    """
    db_config = configuration_service.update_configuration(db, config_id, config_data)
    
    if not db_config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Configuration with ID {config_id} not found"
        )
    
    # Mask API key in response
    response = ConfigurationResponse.model_validate(db_config)
    if db_config.api_key_encrypted:
        decrypted_key = configuration_service.decrypt_api_key(db_config.api_key_encrypted)
        response.api_key = configuration_service.mask_api_key(decrypted_key)
    
    return response


@router.delete(
    "/{config_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Configuration",
    description="Delete a configuration (soft delete by default)."
)
def delete_configuration(
    config_id: UUID,
    hard_delete: bool = False,
    db: Session = Depends(get_db)
):
    """
    Delete configuration.
    
    - **hard_delete**: If True, permanently delete. If False (default), soft delete (set is_active=False)
    """
    success = configuration_service.delete_configuration(db, config_id, hard_delete)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Configuration with ID {config_id} not found"
        )
    
    return None


@router.get(
    "",
    response_model=List[ConfigurationResponse],
    summary="List Configurations",
    description="List all configurations with optional project filter."
)
def list_configurations(
    project_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List configurations with optional project filter."""
    db_configs = configuration_service.list_configurations(
        db, 
        project_id=project_id,
        skip=skip,
        limit=limit
    )
    
    # Mask API keys in responses
    responses = []
    for db_config in db_configs:
        response = ConfigurationResponse.model_validate(db_config)
        if db_config.api_key_encrypted:
            decrypted_key = configuration_service.decrypt_api_key(db_config.api_key_encrypted)
            response.api_key = configuration_service.mask_api_key(decrypted_key)
        responses.append(response)
    
    return responses


@router.post(
    "/test-connection",
    response_model=ConnectionTestResponse,
    summary="Test LLM Connection",
    description="Test connection to an LLM provider without saving configuration."
)
async def test_connection(
    test_request: ConnectionTestRequest
):
    """
    Test connection to LLM provider.
    
    - **provider**: LLM provider to test (ollama, openrouter, deepseek, gemini)
    - **model**: Model name to test
    - **base_url**: Custom base URL (for Ollama)
    - **api_key**: API key (for cloud providers)
    
    Returns connection status, latency, and any error messages.
    """
    provider = test_request.provider.lower()
    
    # Test based on provider
    if provider == "ollama":
        result = await llm_tester.test_ollama_connection(
            test_request.base_url,
            test_request.model
        )
    elif provider == "openrouter":
        if not test_request.api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="API key is required for OpenRouter"
            )
        result = await llm_tester.test_openrouter_connection(
            test_request.api_key,
            test_request.model
        )
    elif provider == "deepseek":
        if not test_request.api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="API key is required for Deepseek"
            )
        result = await llm_tester.test_deepseek_connection(
            test_request.api_key,
            test_request.model
        )
    elif provider == "gemini":
        if not test_request.api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="API key is required for Google Gemini"
            )
        result = await llm_tester.test_gemini_connection(
            test_request.api_key,
            test_request.model
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported provider: {provider}"
        )
    
    return ConnectionTestResponse(
        success=result["success"],
        message=result["message"],
        provider=provider,
        model=test_request.model,
        latency_ms=result.get("latency_ms"),
        error=result.get("error")
    )
