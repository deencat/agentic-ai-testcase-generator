# PostgreSQL Installation Guide for Windows 10
## Complete Step-by-Step Instructions

---

## 📥 **Step 1: Download PostgreSQL**

### **Recommended Version: PostgreSQL 18.x (Latest) or 17.x (Stable)**

**Download Link:**
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

**For PostgreSQL 18 Beta (Latest):**
- Visit: https://www.postgresql.org/download/windows/
- Click "Download the installer" by EDB
- Select PostgreSQL 18 Beta for Windows x86-64

**For PostgreSQL 17 (Latest Stable - Recommended):**
- Visit: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- Select Version: PostgreSQL 17.x
- Operating System: Windows x86-64
- File size: ~350-400 MB

**Note:** PostgreSQL 17 is recommended for production use. PostgreSQL 18 is in beta (released November 2024).

---

## 🛠️ **Step 2: Install PostgreSQL**

### **Installation Steps:**

1. **Run the installer** (`postgresql-18.x-windows-x64.exe` or `postgresql-17.x-windows-x64.exe`)
   - Right-click → "Run as Administrator" (recommended)

2. **Setup Wizard - Click "Next"**

3. **Installation Directory** (Default is fine)
   ```
   C:\Program Files\PostgreSQL\18
   ```
   (Or `C:\Program Files\PostgreSQL\17` for version 17)
   - Click "Next"

4. **Select Components** - Select these:
   - ✅ **PostgreSQL Server** (Required - the database engine)
   - ✅ **Command Line Tools** (Required - includes psql)
   - ⚠️ **pgAgent** (Optional - job scheduling agent, you can uncheck this)
   - ⚠️ **Stack Builder** (Optional - downloads additional tools, you can uncheck this)
   
   **Note:** pgAdmin 4 is NO LONGER bundled with PostgreSQL 18/17. You'll install it separately (see Step 3b below).
   
   - Click "Next"

5. **Data Directory** (Default is fine)
   ```
   C:\Program Files\PostgreSQL\18\data
   ```
   (Or `\PostgreSQL\17\data` for version 17)
   - Click "Next"

6. **Password for PostgreSQL superuser (postgres)** ⚠️ **IMPORTANT**
   - Enter password: `password` (or your own)
   - Re-enter password: `password`
   - **Remember this password!** You'll need it for the database connection
   - Click "Next"

7. **Port** (Default is fine)
   ```
   5432
   ```
   - Click "Next"

8. **Locale** (Default is fine)
   - Click "Next"

9. **Summary** - Review settings
   - Click "Next"

10. **Installation** - Wait 2-3 minutes
    - Installation in progress...
    - Click "Next" when complete

11. **Completing Setup**
    - ✅ Uncheck "Launch Stack Builder at exit" (unless you need it)
    - Click "Finish"

---

## 🖥️ **Step 3a: Install pgAdmin 4 (Separate Download)**

Since PostgreSQL 18/17 no longer includes pgAdmin 4, you need to install it separately:

### **Download pgAdmin 4:**

**Official Download:**
https://www.pgadmin.org/download/pgadmin-4-windows/

**Direct Link (Latest):**
- Download "pgadmin4-8.x-x64.exe" (current version as of Nov 2024)
- File size: ~150 MB

### **Install pgAdmin 4:**

1. **Run the installer** (`pgadmin4-x.x-x64.exe`)
   - Click "Next"

2. **Select Installation Directory** (Default is fine)
   ```
   C:\Program Files\pgAdmin 4
   ```
   - Click "Next"

3. **Ready to Install**
   - Click "Install"
   - Wait 1-2 minutes

4. **Complete**
   - Click "Finish"

**Alternative:** You can skip pgAdmin 4 and use only command-line tools (psql), but pgAdmin 4 is highly recommended for beginners.

---

## ✅ **Step 3b: Verify PostgreSQL Installation**

### **Method 1: Check Windows Services**

```powershell
# Open PowerShell and check if PostgreSQL service is running
Get-Service -Name postgresql*

# You should see:
# Status: Running
# Name: postgresql-x64-18 (or postgresql-x64-17)
```

### **Method 2: Test psql Command**

```powershell
# Test psql connection
psql --version

# Should show something like:
# psql (PostgreSQL) 18.0 (or 17.x)
```

**If "psql is not recognized":**
```powershell
# Add PostgreSQL to PATH (adjust version number as needed)
$env:Path += ";C:\Program Files\PostgreSQL\18\bin"

# For PostgreSQL 17:
# $env:Path += ";C:\Program Files\PostgreSQL\17\bin"

# Or permanently add to PATH:
# 1. Search "Environment Variables" in Windows
# 2. Edit "Path" under System variables
# 3. Add: C:\Program Files\PostgreSQL\18\bin (or \17\bin)
# 4. Restart PowerShell
```

---

## 🗃️ **Step 4: Create Database**

### **Method A: Using psql (Command Line)**

```powershell
# Connect to PostgreSQL as postgres user
psql -U postgres

# Enter your password when prompted (the one you set during installation)

# You should see:
# postgres=#

# Create the database
CREATE DATABASE agentic_testcase_generator_dev;

# Verify database created
\l

# You should see 'agentic_testcase_generator_dev' in the list

# Exit psql
\q
```

### **Method B: Using pgAdmin 4 (GUI - Easier for beginners)**

1. **Open pgAdmin 4**
   - Start Menu → pgAdmin 4
   - Or double-click pgAdmin 4 desktop icon (if created during installation)

2. **Set Master Password** (first time only)
   - pgAdmin 4 will open in your web browser
   - Enter a master password for pgAdmin (can be same as postgres password)
   - Click "OK"

3. **Add New Server Connection**
   - Since pgAdmin 4 was installed separately, you need to register your PostgreSQL server
   - Right-click "Servers" in left panel → "Register" → "Server..."
   
4. **General Tab:**
   - Name: `PostgreSQL 18 Local` (or `PostgreSQL 17 Local`)
   - Click "Connection" tab

5. **Connection Tab:**
   - Host name/address: `localhost`
   - Port: `5432`
   - Maintenance database: `postgres`
   - Username: `postgres`
   - Password: `password` (the one you set during PostgreSQL installation)
   - ✅ Check "Save password"
   - Click "Save"

6. **Create Database**
   - Expand "Servers" → "PostgreSQL 18 Local" → Right-click "Databases"
   - Select "Create" → "Database..."
   - Database name: `agentic_testcase_generator_dev`
   - Owner: `postgres` (default)
   - Click "Save"

7. **Verify Database**
   - Expand "Databases"
   - You should see "agentic_testcase_generator_dev"

---

## 🔧 **Step 5: Update .env File (If Needed)**

Your `.env` file already looks good, but verify these settings:

```powershell
# Open .env file
notepad C:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend\.env
```

**Verify these lines match your PostgreSQL setup:**

```env
# If you used password "password" during installation, this is correct:
DATABASE_URL=postgresql://postgres:password@localhost:5432/agentic_testcase_generator_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=agentic_testcase_generator_dev
```

**If you used a different password, update it:**

```env
# Replace YOUR_PASSWORD with the actual password you set
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/agentic_testcase_generator_dev
POSTGRES_PASSWORD=YOUR_PASSWORD
```

---

## ✅ **Step 6: Test Database Connection**

```powershell
# Navigate to backend directory
cd C:\Users\andrechw\Documents\agentic-ai-testcase-generator\backend

# Activate virtual environment (if not already activated)
.\venv\Scripts\Activate.ps1

# Test database connection with Python
python -c "from app.core.config import settings; print(f'Database URL: {settings.DATABASE_URL}')"

# Test actual connection
python -c "from app.core.database import engine; conn = engine.connect(); print('✅ Database connection successful!'); conn.close()"
```

**Expected output:**
```
✅ Database connection successful!
```

**If you see an error:**
- Check PostgreSQL service is running
- Verify password in `.env` matches installation password
- Ensure database was created: `psql -U postgres -l`

---

## 🎯 **Troubleshooting Common Issues**

### **Issue 1: "psql: command not found"**

**Solution:**
```powershell
# Add PostgreSQL bin to PATH (adjust version as needed)
$env:Path += ";C:\Program Files\PostgreSQL\18\bin"

# For PostgreSQL 17:
# $env:Path += ";C:\Program Files\PostgreSQL\17\bin"

# Test again
psql --version
```

### **Issue 2: "psql: error: connection refused"**

**Solution:**
```powershell
# Check if PostgreSQL service is running
Get-Service postgresql*

# If not running, start it (adjust service name for your version):
Start-Service postgresql-x64-18
# Or for PostgreSQL 17:
# Start-Service postgresql-x64-17

# Or use Services app:
# Press Win+R → services.msc → Find PostgreSQL → Right-click → Start
```

### **Issue 3: "password authentication failed"**

**Solution:**
- Double-check the password you entered during installation
- Update `.env` file with correct password
- Try resetting PostgreSQL password:
  ```powershell
  # Open PostgreSQL command as postgres
  psql -U postgres
  # Change password
  ALTER USER postgres PASSWORD 'newpassword';
  ```

### **Issue 4: "database does not exist"**

**Solution:**
```powershell
# Create the database
psql -U postgres -c "CREATE DATABASE agentic_testcase_generator_dev;"

# Verify
psql -U postgres -l
```

---

## 📋 **Quick Reference Commands**

### **Check PostgreSQL Status:**
```powershell
Get-Service postgresql*
```

### **Start PostgreSQL:**
```powershell
Start-Service postgresql-x64-18
# Or for version 17: Start-Service postgresql-x64-17
```

### **Stop PostgreSQL:**
```powershell
Stop-Service postgresql-x64-18
# Or for version 17: Stop-Service postgresql-x64-17
```

### **Connect to PostgreSQL:**
```powershell
psql -U postgres
```

### **List Databases:**
```powershell
psql -U postgres -l
```

### **Create Database:**
```powershell
psql -U postgres -c "CREATE DATABASE agentic_testcase_generator_dev;"
```

### **Drop Database (careful!):**
```powershell
psql -U postgres -c "DROP DATABASE agentic_testcase_generator_dev;"
```

---

## ✅ **Verification Checklist**

After installation, verify:

- [ ] PostgreSQL service is running
- [ ] `psql --version` works
- [ ] Can connect with `psql -U postgres`
- [ ] Database `agentic_testcase_generator_dev` exists
- [ ] `.env` file has correct password
- [ ] Python can connect to database

---

## 🚀 **Next Steps After PostgreSQL Installation**

Once PostgreSQL is installed and database is created:

1. **Initialize Alembic** (database migrations)
2. **Create database tables** (via migrations)
3. **Start FastAPI server**
4. **Test API endpoints**

See: `BACKEND_SETUP_COMPLETE.md` for detailed next steps

---

## 📚 **Useful PostgreSQL Tools**

### **pgAdmin 4** (Separate installation required)
- GUI tool for managing databases
- View tables, run queries, manage users
- Start Menu → pgAdmin 4
- Opens in web browser (runs as local web server)
- Download: https://www.pgadmin.org/download/

### **psql** (Command line - Included with PostgreSQL)
- Fast, powerful command-line interface
- Good for scripts and automation
- Already installed with PostgreSQL

### **DBeaver** (Third-party, optional)
- Universal database tool
- Alternative to pgAdmin 4
- Download: https://dbeaver.io/download/

### **Azure Data Studio** (Third-party, optional)
- Modern database tool from Microsoft
- Supports PostgreSQL via extensions
- Download: https://docs.microsoft.com/en-us/sql/azure-data-studio/download

---

## 💡 **Pro Tips**

1. **Keep pgAdmin 4 handy** - Very useful for viewing data during development

2. **Set PostgreSQL to auto-start:**
   - Services → postgresql-x64-18 (or 17) → Properties → Startup type: Automatic

3. **Backup your data regularly:**
   ```powershell
   pg_dump -U postgres agentic_testcase_generator_dev > backup.sql
   ```

4. **Monitor database size:**
   ```sql
   SELECT pg_size_pretty(pg_database_size('agentic_testcase_generator_dev'));
   ```

---

## 📌 **Important Notes for PostgreSQL 18**

### **PostgreSQL 18 is Beta (Released November 2024)**
- Currently in beta testing phase
- Final release expected in 2025
- Use PostgreSQL 17 for production environments
- PostgreSQL 18 beta is fine for development/testing

### **Key Changes in PostgreSQL 18:**
- pgAdmin 4 is NO LONGER bundled (separate download required)
- Improved performance and new features
- Better JSON handling
- Enhanced security features

### **Recommended Versions:**
- **For Production:** PostgreSQL 17.x (Latest Stable)
- **For Development:** PostgreSQL 18.x or 17.x (Both work fine)
- **For This Project:** PostgreSQL 17.x or 18.x (Both fully compatible)

---

**Installation Time:** 15-20 minutes (including pgAdmin 4)  
**Difficulty:** Easy  
**Recommended for:** Local development ✅

---

**Last Updated:** November 10, 2025  
**For:** Windows 10 PostgreSQL 18/17 Installation  
**Status:** Complete Installation Guide ✅
