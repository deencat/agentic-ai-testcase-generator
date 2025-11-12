"""
File upload and management endpoints.
"""
import os
import shutil
from pathlib import Path
from typing import List
from uuid import UUID
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.models.file import File as FileModel
from app.models.project import Project
from app.schemas.file import FileResponse, FileCreate
from app.services.parsers import PDFParser, ExcelParser, TextParser

router = APIRouter()

# Initialize parsers
pdf_parser = PDFParser()
excel_parser = ExcelParser()
text_parser = TextParser()


def get_parser(file_extension: str):
    """Get appropriate parser based on file extension."""
    ext = file_extension.lower()
    if ext == ".pdf":
        return pdf_parser
    elif ext in [".xlsx", ".xls"]:
        return excel_parser
    elif ext in [".txt", ".md", ".text"]:
        return text_parser
    else:
        return None


@router.post("/upload", response_model=List[FileResponse])
async def upload_files(
    project_id: UUID = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload and parse multiple files.
    
    Args:
        project_id: UUID of the project
        files: List of uploaded files
        db: Database session
        
    Returns:
        List of created file records
    """
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Validate total file size
    total_size = sum(file.size for file in files if file.size)
    max_total_size = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if total_size > max_total_size:
        raise HTTPException(
            status_code=400,
            detail=f"Total file size exceeds {settings.MAX_UPLOAD_SIZE_MB}MB"
        )
    
    # Validate number of files
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed per upload")
    
    uploaded_files = []
    temp_dir = Path(settings.TEMP_FILE_DIR)
    temp_dir.mkdir(exist_ok=True)
    
    for upload_file in files:
        try:
            # Validate file extension
            file_extension = Path(upload_file.filename).suffix
            if file_extension.lower() not in settings.ALLOWED_FILE_EXTENSIONS.split(','):
                raise HTTPException(
                    status_code=400,
                    detail=f"File type {file_extension} not allowed"
                )
            
            # Save file temporarily
            file_path = temp_dir / f"{project_id}_{upload_file.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(upload_file.file, buffer)
            
            # Get parser and validate
            parser = get_parser(file_extension)
            if not parser:
                file_path.unlink()  # Delete temp file
                raise HTTPException(
                    status_code=400,
                    detail=f"No parser available for {file_extension}"
                )
            
            # Validate file
            validation = parser.validate_file(str(file_path))
            if not validation["valid"]:
                file_path.unlink()  # Delete temp file
                raise HTTPException(status_code=400, detail=validation["error"])
            
            # Parse file
            parse_result = parser.parse(str(file_path))
            if not parse_result["success"]:
                file_path.unlink()  # Delete temp file
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to parse {upload_file.filename}: {parse_result['error']}"
                )
            
            # Create file record
            file_record = FileModel(
                project_id=project_id,
                file_name=upload_file.filename,
                file_type=file_extension,
                file_size=file_path.stat().st_size,
                file_path=str(file_path),
                extracted_text=parse_result["text"]
            )
            
            db.add(file_record)
            db.commit()
            db.refresh(file_record)
            
            uploaded_files.append(file_record)
            
        except HTTPException:
            raise
        except Exception as e:
            # Clean up on error
            if file_path.exists():
                file_path.unlink()
            raise HTTPException(status_code=500, detail=f"Error processing {upload_file.filename}: {str(e)}")
    
    return uploaded_files


@router.get("/projects/{project_id}/files", response_model=List[FileResponse])
def get_project_files(
    project_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get all files for a project.
    
    Args:
        project_id: UUID of the project
        db: Database session
        
    Returns:
        List of file records
    """
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    files = db.query(FileModel).filter(FileModel.project_id == project_id).all()
    return files


@router.delete("/files/{file_id}")
def delete_file(
    file_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Delete a file.
    
    Args:
        file_id: UUID of the file
        db: Database session
        
    Returns:
        Success message
    """
    file_record = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete physical file
    file_path = Path(file_record.file_path)
    if file_path.exists():
        file_path.unlink()
    
    # Delete database record
    db.delete(file_record)
    db.commit()
    
    return {"message": "File deleted successfully"}
