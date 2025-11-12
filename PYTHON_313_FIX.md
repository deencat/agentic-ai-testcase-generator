# Python 3.13 Installation Fix Guide
## Pydantic Rust Compilation Error

---

## 🔥 Quick Fix (Choose One)

### **Option 1: Use Updated Requirements (Recommended)**

The `requirements.txt` has been updated with Python 3.13 compatible versions.

```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Upgrade pip first
python -m pip install --upgrade pip

# Try installing again with updated requirements
pip install -r requirements.txt

# If that still fails, try the flexible version requirements:
pip install -r requirements-py313.txt
```

### **Option 2: Install Pre-built Wheels Only**

```powershell
# Install packages that have pre-built wheels
pip install --only-binary :all: -r requirements.txt

# If some packages fail, install them one by one
pip install fastapi uvicorn[standard] sqlalchemy psycopg[binary] alembic
pip install pydantic>=2.6.0 pydantic-settings httpx
pip install PyPDF2 openpyxl python-dotenv aiofiles
pip install python-jose[cryptography] cryptography passlib[bcrypt]
pip install google-generativeai pytest pytest-asyncio
```

### **Option 3: Downgrade to Python 3.11 (Most Reliable)**

Python 3.13 is very new (released Oct 2024). Python 3.11 is more stable for production.

```powershell
# 1. Download Python 3.11 from:
# https://www.python.org/downloads/release/python-31110/

# 2. Install Python 3.11 (check "Add to PATH")

# 3. Delete old virtual environment
Remove-Item -Recurse -Force venv

# 4. Create new venv with Python 3.11
py -3.11 -m venv venv

# Or if py doesn't work:
C:\Python311\python.exe -m venv venv

# 5. Activate
.\venv\Scripts\Activate.ps1

# 6. Install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🔍 Understanding the Error

**What happened:**
- Python 3.13 is very new (released October 2024)
- Some packages (like `pydantic-core`) don't have pre-built wheels for Python 3.13 yet
- pip tries to build from source, which requires Rust compiler
- Rust isn't installed on your system, so it fails

**Why Rust?**
- `pydantic-core` is written in Rust for performance
- Pre-built wheels avoid needing Rust
- Python 3.11/3.12 have pre-built wheels available

---

## ✅ Recommended Solution Path

### **Best: Use Python 3.11 (Production-Ready)**

```powershell
# Step 1: Install Python 3.11.10
# Download from: https://www.python.org/ftp/python/3.11.10/python-3.11.10-amd64.exe
# During installation: ✅ Check "Add Python 3.11 to PATH"

# Step 2: Verify installation
py -3.11 --version
# Should show: Python 3.11.10

# Step 3: Navigate to backend
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend

# Step 4: Delete old venv (if exists)
if (Test-Path venv) { Remove-Item -Recurse -Force venv }

# Step 5: Create new venv with Python 3.11
py -3.11 -m venv venv

# Step 6: Activate
.\venv\Scripts\Activate.ps1

# Step 7: Verify Python version
python --version
# Should show: Python 3.11.10

# Step 8: Install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt
```

**Success indicators:**
- ✅ No Rust compilation errors
- ✅ All packages install successfully
- ✅ Installation completes in 2-3 minutes

---

## 🛠️ Alternative: Install Rust (If You Want Python 3.13)

If you really want to use Python 3.13, install Rust:

```powershell
# Step 1: Download Rust installer
# Visit: https://rustup.rs/
# Or direct download: https://win.rustup.rs/x86_64

# Step 2: Run rustup-init.exe
# Follow prompts, select default installation

# Step 3: Restart PowerShell

# Step 4: Verify Rust installation
rustc --version
cargo --version

# Step 5: Try installing requirements again
pip install -r requirements.txt
```

**Note:** This takes 10-15 minutes and requires ~1.5GB disk space.

---

## 📊 Python Version Compatibility Matrix

| Python Version | Status | Recommendation |
|---------------|--------|----------------|
| 3.13 | 🟡 New (Oct 2024) | Not recommended yet |
| 3.12 | ✅ Stable | Good for development |
| **3.11** | ✅ **LTS** | **Best for production** |
| 3.10 | ✅ Stable | Still good |
| 3.9 | 🟡 Old | Works but outdated |

**For this project, use Python 3.11.x** ✅

---

## 🚀 Step-by-Step: Complete Setup with Python 3.11

### 1. Download Python 3.11

```
https://www.python.org/ftp/python/3.11.10/python-3.11.10-amd64.exe
```

### 2. Install Python 3.11

- ✅ Check "Add Python 3.11 to PATH"
- ✅ Check "Install for all users" (optional)
- Click "Install Now"

### 3. Verify Installation

```powershell
# Open new PowerShell window
py -3.11 --version
# Output: Python 3.11.10
```

### 4. Clean Up Old Virtual Environment

```powershell
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend
Remove-Item -Recurse -Force venv
```

### 5. Create New Virtual Environment

```powershell
py -3.11 -m venv venv
```

### 6. Activate Virtual Environment

```powershell
# Set execution policy if needed
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Activate
.\venv\Scripts\Activate.ps1

# Verify
python --version
# Should show: Python 3.11.10
```

### 7. Install Dependencies

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed fastapi-0.109.0 uvicorn-0.27.0 sqlalchemy-2.0.25 ...
```

### 8. Verify Installation

```powershell
# Check installed packages
pip list

# Test imports
python -c "from fastapi import FastAPI; print('FastAPI OK')"
python -c "from sqlalchemy import create_engine; print('SQLAlchemy OK')"
python -c "from pydantic import BaseModel; print('Pydantic OK')"
```

---

## ✅ Verification Checklist

After installation, verify:

```powershell
# ✅ 1. Python version is 3.11.x
python --version

# ✅ 2. Virtual environment is activated
# Should see (venv) in prompt

# ✅ 3. Pip is up to date
pip --version

# ✅ 4. FastAPI installed
pip show fastapi

# ✅ 5. Can import modules
python -c "import fastapi, sqlalchemy, pydantic; print('All OK')"

# ✅ 6. Can run app
python -c "from app.core.config import settings; print(settings.APP_NAME)"
```

---

## 🆘 Still Having Issues?

### Issue: "py -3.11 not found"

**Solution:**
```powershell
# Find Python installation
where.exe python

# Use full path
C:\Python311\python.exe -m venv venv
```

### Issue: "Multiple Python versions conflict"

**Solution:**
```powershell
# Use py launcher to select version
py -0  # List all Python versions
py -3.11 -m venv venv  # Use specific version
```

### Issue: "Permission denied"

**Solution:**
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → "Run as Administrator"
```

---

## 📝 Quick Reference Commands

```powershell
# Check Python versions installed
py -0

# Use specific Python version
py -3.11 -m venv venv

# Activate venv
.\venv\Scripts\Activate.ps1

# Deactivate venv
deactivate

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Clear pip cache
pip cache purge
```

---

## 🎯 Summary

**Problem:** Python 3.13 is too new, packages need Rust to compile

**Best Solution:** Use Python 3.11 (production-ready, has pre-built wheels)

**Steps:**
1. Install Python 3.11.10
2. Delete old venv
3. Create new venv with Python 3.11
4. Install requirements

**Time:** 15 minutes total

---

**Need Help?** Check:
- `BACKEND_SETUP_COMPLETE.md` - Main setup guide
- `POWERSHELL_VENV_GUIDE.md` - PowerShell activation help
- `backend/WEEK_1_2_CHECKLIST.md` - Detailed checklist

---

**Last Updated:** November 10, 2025  
**Issue:** Python 3.13 Pydantic Rust Compilation Error  
**Status:** Resolved - Use Python 3.11 ✅
