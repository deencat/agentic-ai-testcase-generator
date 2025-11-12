"""
API v1 router - Combines all v1 endpoints.
"""
from fastapi import APIRouter

from app.api.v1 import health, projects, files, knowledge_base

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, prefix="/api/v1")
api_router.include_router(projects.router, prefix="/api/v1")
api_router.include_router(files.router, prefix="/api/v1")
api_router.include_router(knowledge_base.router, prefix="/api/v1")
