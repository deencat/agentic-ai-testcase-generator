"""
PDF document parser using PyPDF2.
"""
import hashlib
from pathlib import Path
from typing import Dict, Any
import PyPDF2


class PDFParser:
    """Parse PDF files and extract text content."""
    
    def __init__(self):
        self.supported_extensions = [".pdf"]
    
    def parse(self, file_path: str) -> Dict[str, Any]:
        """
        Parse a PDF file and extract text content.
        
        Args:
            file_path: Path to the PDF file
            
        Returns:
            Dict containing extracted text and metadata
            
        Raises:
            ValueError: If file is not a PDF or cannot be parsed
        """
        path = Path(file_path)
        
        if path.suffix.lower() not in self.supported_extensions:
            raise ValueError(f"Unsupported file type: {path.suffix}")
        
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # Extract metadata
                metadata = {
                    "num_pages": len(pdf_reader.pages),
                    "file_name": path.name,
                    "file_size": path.stat().st_size,
                }
                
                # Extract text from all pages
                text_content = []
                for page_num, page in enumerate(pdf_reader.pages, start=1):
                    page_text = page.extract_text()
                    if page_text:
                        text_content.append(f"--- Page {page_num} ---\n{page_text}")
                
                full_text = "\n\n".join(text_content)
                
                # Calculate file hash for deduplication
                file_hash = self._calculate_file_hash(file_path)
                
                return {
                    "text": full_text,
                    "metadata": metadata,
                    "file_hash": file_hash,
                    "success": True,
                    "error": None
                }
                
        except PyPDF2.errors.PdfReadError as e:
            return {
                "text": "",
                "metadata": {},
                "file_hash": "",
                "success": False,
                "error": f"Failed to read PDF: {str(e)}"
            }
        except Exception as e:
            return {
                "text": "",
                "metadata": {},
                "file_hash": "",
                "success": False,
                "error": f"Unexpected error parsing PDF: {str(e)}"
            }
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA-256 hash of file for deduplication."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    
    def validate_file(self, file_path: str, max_size_mb: int = 50) -> Dict[str, Any]:
        """
        Validate PDF file before parsing.
        
        Args:
            file_path: Path to the PDF file
            max_size_mb: Maximum file size in MB
            
        Returns:
            Dict with validation result
        """
        path = Path(file_path)
        
        if not path.exists():
            return {"valid": False, "error": "File not found"}
        
        if path.suffix.lower() not in self.supported_extensions:
            return {"valid": False, "error": f"Invalid file type: {path.suffix}"}
        
        file_size_mb = path.stat().st_size / (1024 * 1024)
        if file_size_mb > max_size_mb:
            return {"valid": False, "error": f"File too large: {file_size_mb:.2f}MB (max: {max_size_mb}MB)"}
        
        return {"valid": True, "error": None}
