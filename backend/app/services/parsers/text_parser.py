"""
Plain text document parser.
"""
import hashlib
from pathlib import Path
from typing import Dict, Any


class TextParser:
    """Parse plain text files."""
    
    def __init__(self):
        self.supported_extensions = [".txt", ".md", ".text"]
    
    def parse(self, file_path: str) -> Dict[str, Any]:
        """
        Parse a text file and extract content.
        
        Args:
            file_path: Path to the text file
            
        Returns:
            Dict containing extracted text and metadata
            
        Raises:
            ValueError: If file is not a text file or cannot be parsed
        """
        path = Path(file_path)
        
        if path.suffix.lower() not in self.supported_extensions:
            raise ValueError(f"Unsupported file type: {path.suffix}")
        
        if not path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        try:
            # Try UTF-8 first, then fall back to other encodings
            encodings = ['utf-8', 'utf-16', 'latin-1', 'cp1252']
            text_content = None
            used_encoding = None
            
            for encoding in encodings:
                try:
                    with open(file_path, 'r', encoding=encoding) as file:
                        text_content = file.read()
                    used_encoding = encoding
                    break
                except UnicodeDecodeError:
                    continue
            
            if text_content is None:
                raise ValueError("Could not decode file with any supported encoding")
            
            # Extract metadata
            metadata = {
                "file_name": path.name,
                "file_size": path.stat().st_size,
                "encoding": used_encoding,
                "num_lines": len(text_content.split('\n')),
                "num_characters": len(text_content),
            }
            
            # Calculate file hash for deduplication
            file_hash = self._calculate_file_hash(file_path)
            
            return {
                "text": text_content,
                "metadata": metadata,
                "file_hash": file_hash,
                "success": True,
                "error": None
            }
            
        except Exception as e:
            return {
                "text": "",
                "metadata": {},
                "file_hash": "",
                "success": False,
                "error": f"Failed to parse text file: {str(e)}"
            }
    
    def _calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA-256 hash of file for deduplication."""
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    
    def validate_file(self, file_path: str, max_size_mb: int = 10) -> Dict[str, Any]:
        """
        Validate text file before parsing.
        
        Args:
            file_path: Path to the text file
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
