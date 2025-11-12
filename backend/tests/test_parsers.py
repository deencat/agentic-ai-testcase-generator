"""
Test script for file upload and parsing functionality.
Run this script to test the parsers before integrating with the API.
"""
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.services.parsers import PDFParser, ExcelParser, TextParser


def test_pdf_parser():
    """Test PDF parser with a sample file."""
    print("\n=== Testing PDF Parser ===")
    parser = PDFParser()
    
    # You would need a sample PDF file here
    # For now, just show that the parser is initialized
    print(f"✓ PDF Parser initialized")
    print(f"  Supported extensions: {parser.supported_extensions}")


def test_excel_parser():
    """Test Excel parser with a sample file."""
    print("\n=== Testing Excel Parser ===")
    parser = ExcelParser()
    
    print(f"✓ Excel Parser initialized")
    print(f"  Supported extensions: {parser.supported_extensions}")


def test_text_parser():
    """Test Text parser with a sample file."""
    print("\n=== Testing Text Parser ===")
    parser = TextParser()
    
    print(f"✓ Text Parser initialized")
    print(f"  Supported extensions: {parser.supported_extensions}")


if __name__ == "__main__":
    print("=" * 60)
    print("File Parser Test Script")
    print("=" * 60)
    
    test_pdf_parser()
    test_excel_parser()
    test_text_parser()
    
    print("\n" + "=" * 60)
    print("✓ All parsers initialized successfully!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Test parsers with actual files")
    print("2. Test file upload API endpoint")
    print("3. Verify files are stored in temp_uploads directory")
