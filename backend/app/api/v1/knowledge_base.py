"""
Knowledge Base document upload and management endpoints.
"""
from pathlib import Path
from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.models.knowledge_base_document import KnowledgeBaseDocument
from app.schemas.knowledge_base import (
    KnowledgeBaseDocumentResponse,
    KnowledgeBaseDocumentListResponse
)
from app.services.parsers import PDFParser, TextParser

router = APIRouter()

# Initialize parsers
pdf_parser = PDFParser()
text_parser = TextParser()


def get_kb_parser(file_extension: str):
    """Get appropriate parser for KB documents."""
    ext = file_extension.lower()
    if ext == ".pdf":
        return pdf_parser
    elif ext in [".txt", ".md", ".text"]:
        return text_parser
    else:
        return None


@router.post("/knowledge-base", response_model=KnowledgeBaseDocumentResponse)
async def upload_kb_document(
    file: UploadFile = File(...),
    category: Optional[str] = Query(None, description="Document category (e.g., system_guide, process, user_manual)"),
    db: Session = Depends(get_db)
):
    """
    Upload a Knowledge Base document.
    
    Args:
        file: Uploaded KB document (PDF or text)
        category: Optional document category
        db: Database session
        
    Returns:
        Created KB document record
    """
    # Validate file extension
    file_extension = Path(file.filename).suffix
    kb_allowed_extensions = settings.KB_ALLOWED_EXTENSIONS.split(',')
    
    if file_extension.lower() not in kb_allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_extension} not allowed for KB documents. Allowed: {kb_allowed_extensions}"
        )
    
    # Validate file size
    file_content = await file.read()
    file_size_mb = len(file_content) / (1024 * 1024)
    
    if file_size_mb > settings.KB_MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File size {file_size_mb:.2f}MB exceeds maximum {settings.KB_MAX_FILE_SIZE_MB}MB"
        )
    
    # Check document count limit
    active_count = db.query(KnowledgeBaseDocument).filter(
        KnowledgeBaseDocument.is_active == True
    ).count()
    
    if active_count >= settings.KB_MAX_DOCUMENTS:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum number of KB documents ({settings.KB_MAX_DOCUMENTS}) reached"
        )
    
    # Save file temporarily
    temp_dir = Path(settings.TEMP_FILE_DIR) / "kb"
    temp_dir.mkdir(parents=True, exist_ok=True)
    temp_file_path = temp_dir / file.filename
    
    with open(temp_file_path, "wb") as buffer:
        buffer.write(file_content)
    
    try:
        # Get parser and parse file
        parser = get_kb_parser(file_extension)
        if not parser:
            temp_file_path.unlink()
            raise HTTPException(
                status_code=400,
                detail=f"No parser available for {file_extension}"
            )
        
        # Parse file
        parse_result = parser.parse(str(temp_file_path))
        if not parse_result["success"]:
            temp_file_path.unlink()
            raise HTTPException(
                status_code=400,
                detail=f"Failed to parse KB document: {parse_result['error']}"
            )
        
        file_hash = parse_result["file_hash"]
        extracted_text = parse_result["text"]
        
        # Check for duplicate (by file hash)
        existing_doc = db.query(KnowledgeBaseDocument).filter(
            KnowledgeBaseDocument.file_hash == file_hash
        ).first()
        
        if existing_doc:
            temp_file_path.unlink()
            if existing_doc.is_active:
                raise HTTPException(
                    status_code=400,
                    detail=f"Duplicate document already exists: {existing_doc.filename}"
                )
            else:
                # Reactivate existing document
                existing_doc.is_active = True
                db.commit()
                db.refresh(existing_doc)
                return existing_doc
        
        # Get or create default project (for now, use project_id from first project or create one)
        # TODO: Accept project_id as parameter in Phase 2
        from app.models.project import Project
        default_project = db.query(Project).first()
        if not default_project:
            default_project = Project(name="Default Project", description="Auto-created for KB documents")
            db.add(default_project)
            db.commit()
            db.refresh(default_project)
        
        # Create KB document record
        kb_document = KnowledgeBaseDocument(
            project_id=default_project.id,
            filename=file.filename,
            file_type=file_extension,
            doc_type=category or "general",
            file_size=len(file_content),
            file_hash=file_hash,
            extracted_text=extracted_text,
            extraction_status="completed",
            is_active=True
        )
        
        db.add(kb_document)
        db.commit()
        db.refresh(kb_document)
        
        # Clean up temp file
        temp_file_path.unlink()
        
        return kb_document
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up on error
        if temp_file_path.exists():
            temp_file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error processing KB document: {str(e)}")


@router.get("/knowledge-base", response_model=KnowledgeBaseDocumentListResponse)
def list_kb_documents(
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    """
    List all Knowledge Base documents.
    
    Args:
        is_active: Optional filter by active status
        category: Optional filter by category
        db: Database session
        
    Returns:
        List of KB documents with counts
    """
    query = db.query(KnowledgeBaseDocument)
    
    if is_active is not None:
        query = query.filter(KnowledgeBaseDocument.is_active == is_active)
    
    if category:
        query = query.filter(KnowledgeBaseDocument.doc_category == category)
    
    documents = query.order_by(KnowledgeBaseDocument.created_at.desc()).all()
    
    # Get counts
    total_count = db.query(KnowledgeBaseDocument).count()
    active_count = db.query(KnowledgeBaseDocument).filter(
        KnowledgeBaseDocument.is_active == True
    ).count()
    
    return KnowledgeBaseDocumentListResponse(
        documents=documents,
        total_count=total_count,
        active_count=active_count
    )


@router.get("/knowledge-base/{doc_id}", response_model=KnowledgeBaseDocumentResponse)
def get_kb_document(
    doc_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get a specific Knowledge Base document.
    
    Args:
        doc_id: UUID of the KB document
        db: Database session
        
    Returns:
        KB document record
    """
    kb_document = db.query(KnowledgeBaseDocument).filter(
        KnowledgeBaseDocument.id == doc_id
    ).first()
    
    if not kb_document:
        raise HTTPException(status_code=404, detail="KB document not found")
    
    return kb_document


@router.delete("/knowledge-base/{doc_id}")
def delete_kb_document(
    doc_id: UUID,
    hard_delete: bool = Query(False, description="Permanently delete (true) or deactivate (false)"),
    db: Session = Depends(get_db)
):
    """
    Delete or deactivate a Knowledge Base document.
    
    Args:
        doc_id: UUID of the KB document
        hard_delete: If True, permanently delete; if False, just deactivate
        db: Database session
        
    Returns:
        Success message
    """
    kb_document = db.query(KnowledgeBaseDocument).filter(
        KnowledgeBaseDocument.id == doc_id
    ).first()
    
    if not kb_document:
        raise HTTPException(status_code=404, detail="KB document not found")
    
    if hard_delete:
        # Permanently delete
        db.delete(kb_document)
        db.commit()
        return {"message": "KB document permanently deleted", "doc_id": str(doc_id)}
    else:
        # Soft delete (deactivate)
        kb_document.is_active = False
        db.commit()
        return {"message": "KB document deactivated", "doc_id": str(doc_id)}


@router.patch("/knowledge-base/{doc_id}", response_model=KnowledgeBaseDocumentResponse)
def update_kb_document(
    doc_id: UUID,
    filename: Optional[str] = Query(None, description="New document filename"),
    doc_type: Optional[str] = Query(None, description="New document type/category"),
    is_active: Optional[bool] = Query(None, description="Active status"),
    db: Session = Depends(get_db)
):
    """
    Update a Knowledge Base document.
    
    Args:
        doc_id: UUID of the KB document
        filename: Optional new document filename
        doc_type: Optional new document type/category
        is_active: Optional active status
        db: Database session
        
    Returns:
        Updated KB document record
    """
    kb_document = db.query(KnowledgeBaseDocument).filter(
        KnowledgeBaseDocument.id == doc_id
    ).first()
    
    if not kb_document:
        raise HTTPException(status_code=404, detail="KB document not found")
    
    # Update fields if provided
    if filename is not None:
        kb_document.filename = filename
    if doc_type is not None:
        kb_document.doc_type = doc_type
    if is_active is not None:
        kb_document.is_active = is_active
    
    db.commit()
    db.refresh(kb_document)
    
    return kb_document
