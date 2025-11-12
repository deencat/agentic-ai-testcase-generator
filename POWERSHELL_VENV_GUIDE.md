# PowerShell Virtual Environment Activation Guide
## Windows 10 - Quick Fix

---

## 🔥 Quick Solution (Recommended)

### Option 1: Fix PowerShell Execution Policy

```powershell
# 1. Open PowerShell as Administrator
# Right-click PowerShell icon → "Run as Administrator"

# 2. Set execution policy (one-time setup)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3. Type 'Y' and press Enter to confirm

# 4. Navigate to backend directory
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend

# 5. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 6. You should see (venv) in your prompt
# (venv) PS C:\...\backend>
```

### Option 2: Use the Automated Script

```powershell
# Navigate to project root
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator

# Run the PowerShell setup script
.\setup_backend.ps1
```

### Option 3: Use Command Prompt Instead

```cmd
# 1. Open Command Prompt (cmd.exe)
# Press Win+R, type 'cmd', press Enter

# 2. Navigate to backend
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend

# 3. Activate virtual environment
venv\Scripts\activate.bat

# 4. You should see (venv) in your prompt
# (venv) C:\...\backend>
```

---

## 🐛 Common Errors & Solutions

### Error 1: "Activate.ps1 cannot be loaded because running scripts is disabled"

**Error Message:**
```
.\venv\Scripts\Activate.ps1 : File C:\...\venv\Scripts\Activate.ps1 cannot be loaded because 
running scripts is disabled on this system.
```

**Solution A: Change Execution Policy (Recommended)**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try activating again
.\venv\Scripts\Activate.ps1
```

**Solution B: Bypass for This Session Only**
```powershell
# This only works for the current PowerShell window
powershell -ExecutionPolicy Bypass -File .\venv\Scripts\Activate.ps1
```

**Solution C: Use Command Prompt**
```cmd
# Switch to cmd.exe instead
venv\Scripts\activate.bat
```

---

### Error 2: "The system cannot find the path specified"

**Error Message:**
```
The system cannot find the path specified.
```

**Solution:**
```powershell
# Make sure you're in the correct directory
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend

# Verify venv folder exists
dir venv

# If venv doesn't exist, create it first
python -m venv venv

# Then activate
.\venv\Scripts\Activate.ps1
```

---

### Error 3: "Python is not recognized"

**Error Message:**
```
'python' is not recognized as an internal or external command
```

**Solution:**
```powershell
# Check if Python is installed
py --version

# If py works but python doesn't, use py instead
py -m venv venv

# Or add Python to PATH:
# 1. Search "Environment Variables" in Windows
# 2. Edit "Path" variable
# 3. Add Python installation directory (e.g., C:\Python310)
# 4. Restart PowerShell
```

---

### Error 4: Virtual environment activates but (venv) doesn't show

**Solution:**
```powershell
# Check if it's actually activated
python -c "import sys; print(sys.prefix)"

# If it shows ....\backend\venv, it's activated
# PowerShell might not show (venv) by default

# You can verify with:
where.exe python
# Should show: C:\...\backend\venv\Scripts\python.exe
```

---

## ✅ Step-by-Step: Complete Setup

### Step 1: Open PowerShell as Administrator

1. Click Start menu
2. Type "PowerShell"
3. Right-click "Windows PowerShell"
4. Select "Run as Administrator"
5. Click "Yes" on UAC prompt

### Step 2: Set Execution Policy (One-Time)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Type: Y
# Press: Enter
```

### Step 3: Navigate to Backend

```powershell
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend
```

### Step 4: Create Virtual Environment (if not exists)

```powershell
# Check if venv exists
if (!(Test-Path venv)) {
    python -m venv venv
    Write-Host "Virtual environment created"
}
```

### Step 5: Activate Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

**Success indicators:**
- You see `(venv)` at the start of your prompt
- Example: `(venv) PS C:\...\backend>`

### Step 6: Verify Activation

```powershell
# Check Python location
python -c "import sys; print(sys.executable)"
# Should show: C:\...\backend\venv\Scripts\python.exe

# Check pip location
pip --version
# Should show: ...from c:\...\backend\venv\lib\site-packages\pip
```

### Step 7: Install Dependencies

```powershell
# Upgrade pip first
python -m pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt
```

---

## 🎯 Alternative Solutions

### A. Use Command Prompt (Simplest)

```cmd
REM Open Command Prompt (not PowerShell)
cd c:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend
venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### B. Use Git Bash (If Installed)

```bash
cd /c/Users/andrechw/Documents/agentic-ai-testcase-generator/backend
source venv/Scripts/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### C. Use VS Code Integrated Terminal

1. Open VS Code
2. Open folder: `c:\Users\andrechw\Documents\agentic-ai-testcase-generator`
3. Open Terminal (Ctrl + `)
4. Select "Command Prompt" or "PowerShell" from dropdown
5. If PowerShell, run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
6. Then: `cd backend`
7. Then: `.\venv\Scripts\Activate.ps1`

---

## 📋 Verification Checklist

After activation, verify everything works:

```powershell
# ✅ Check 1: Virtual environment active
# You should see (venv) in your prompt

# ✅ Check 2: Python is from venv
python -c "import sys; print(sys.executable)"
# Expected: C:\...\backend\venv\Scripts\python.exe

# ✅ Check 3: Pip is from venv
pip --version
# Expected: ...from c:\...\backend\venv\lib\site-packages\pip

# ✅ Check 4: Dependencies installed
pip list
# Should show: fastapi, uvicorn, sqlalchemy, etc.

# ✅ Check 5: Can import app modules
python -c "from app.core.config import settings; print(settings.APP_NAME)"
# Expected: Agentic AI Test Case Generator
```

---

## 🚀 Ready to Continue?

Once your virtual environment is activated and dependencies are installed:

1. **Configure .env file**
   ```powershell
   cp .env.example .env
   notepad .env  # Edit with your database credentials
   ```

2. **Set up PostgreSQL database**
   ```sql
   -- In psql or pgAdmin:
   CREATE DATABASE agentic_testcase_generator_dev;
   ```

3. **Continue with Alembic setup**
   - See: `WEEK_1_2_CHECKLIST.md`
   - Or: `BACKEND_SETUP_COMPLETE.md`

---

## 💡 Pro Tips

### Tip 1: Add to PATH permanently
To avoid using `.\` prefix:
```powershell
$env:Path += ";C:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend\venv\Scripts"
```

### Tip 2: Create PowerShell alias
Add to your PowerShell profile:
```powershell
function Activate-Backend {
    Set-Location C:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend
    .\venv\Scripts\Activate.ps1
}
```

### Tip 3: Use Windows Terminal
Windows Terminal has better PowerShell support:
- Download from Microsoft Store
- Better color support
- Better Unicode support

---

## 🆘 Still Having Issues?

### Last Resort Solutions:

1. **Reinstall Python**
   - Download from: https://www.python.org/downloads/
   - ✅ Check "Add Python to PATH" during installation
   - Restart computer

2. **Use Conda/Anaconda Instead**
   ```bash
   conda create -n testcase python=3.10
   conda activate testcase
   pip install -r requirements.txt
   ```

3. **Use Docker**
   - Skip virtual environment entirely
   - Use containerized Python

---

**Need Help?** Check:
- `BACKEND_SETUP_COMPLETE.md` - Main setup guide
- `backend/WEEK_1_2_CHECKLIST.md` - Detailed checklist
- `backend/README.md` - Full documentation

---

**Last Updated:** November 10, 2025  
**For:** Windows 10 PowerShell Users  
**Status:** Complete Troubleshooting Guide ✅
