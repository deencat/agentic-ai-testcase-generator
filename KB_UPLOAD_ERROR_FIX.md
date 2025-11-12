# KB Upload Error Fix - November 12, 2025

## Issue
```
AttributeError: 'Settings' object has no attribute 'KB_ALLOWED_EXTENSIONS'
```

## Root Cause
The `KB_ALLOWED_EXTENSIONS` setting was missing from `app/core/config.py`.

## Fix Applied ✅

Added to `backend/app/core/config.py`:

```python
# Knowledge Base
KB_MAX_FILE_SIZE_MB: int = 5
KB_MAX_DOCUMENTS: int = 50
KB_ALLOWED_EXTENSIONS: str = ".pdf,.txt,.md"  # ← NEW

@property
def kb_allowed_extensions(self) -> List[str]:  # ← NEW
    """Parse KB allowed file extensions from comma-separated string."""
    return [ext.strip() for ext in self.KB_ALLOWED_EXTENSIONS.split(",")]
```

## How to Apply the Fix

### Step 1: Stop the Current Server
In the terminal running the server, press `CTRL+C`

### Step 2: Restart the Server
```powershell
cd C:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend
.\start.ps1
```

### Step 3: Test KB Upload Again
1. Go to http://127.0.0.1:8000/docs
2. Navigate to `POST /api/v1/knowledge-base`
3. Click "Try it out"
4. Upload a PDF or text file (max 5MB)
5. Optional: Set category (e.g., "System Guide")
6. Click "Execute"

## Expected Result ✅

Should return:
```json
{
  "id": "uuid-here",
  "doc_name": "your-file.pdf",
  "doc_type": ".pdf",
  "doc_category": "System Guide",
  "file_size": 12345,
  "file_hash": "sha256-hash-here",
  "is_active": true,
  "created_at": "2025-11-12T...",
  "updated_at": "2025-11-12T..."
}
```

## KB Configuration Summary

| Setting | Value | Description |
|---------|-------|-------------|
| `KB_MAX_FILE_SIZE_MB` | 5 | Maximum file size for KB documents |
| `KB_MAX_DOCUMENTS` | 50 | Maximum number of active KB documents |
| `KB_ALLOWED_EXTENSIONS` | `.pdf,.txt,.md` | Allowed file types for KB upload |

## Supported KB File Types
- ✅ **PDF** (`.pdf`) - Parsed with PyPDF2
- ✅ **Text** (`.txt`) - Parsed with multi-encoding support
- ✅ **Markdown** (`.md`) - Parsed as text

## Testing Checklist

After restarting the server, test:

1. **Upload PDF KB Document**
   - [ ] Upload succeeds
   - [ ] File hash calculated (SHA-256)
   - [ ] Document stored in database
   - [ ] Response includes all metadata

2. **Upload Text KB Document**
   - [ ] Upload succeeds (.txt or .md)
   - [ ] Text extracted correctly
   - [ ] Document stored with category

3. **Test File Size Limit**
   - [ ] Files >5MB rejected with error
   - [ ] Files ≤5MB accepted

4. **Test File Type Validation**
   - [ ] .pdf, .txt, .md accepted
   - [ ] Other types (.docx, .xlsx) rejected

5. **Test Deduplication**
   - [ ] Upload same file twice
   - [ ] Second upload rejected or reactivates existing

6. **Test Document Count Limit**
   - [ ] Can upload up to 50 documents
   - [ ] 51st upload rejected with error

## Next Steps After Fix

Once the server restarts successfully and KB upload works:

1. ✅ Test all KB endpoints via Swagger UI
2. ✅ Upload sample KB documents
3. ✅ Verify deduplication works
4. ✅ Test soft delete and reactivation
5. 🔄 Proceed to Week 4: Configuration Management

---

**Status:** ✅ Fix applied - Server restart required
**Date:** November 12, 2025
