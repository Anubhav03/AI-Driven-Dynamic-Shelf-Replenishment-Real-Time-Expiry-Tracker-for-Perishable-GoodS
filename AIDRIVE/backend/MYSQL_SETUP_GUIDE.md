# MySQL Setup Guide for ShelfAI Backend

## 🎯 Quick Start

### Step 1: Test MySQL Connection
```bash
python test_mysql_connection.py
```

### Step 2: Configure MySQL
```bash
python mysql_config.py
```

### Step 3: Start Backend
```bash
uvicorn app.main:app --reload
```

## 📋 Prerequisites

1. **MySQL Server** installed and running
2. **Python packages**: `pymysql`, `cryptography`
3. **MySQL user** with proper permissions

## 🔧 Detailed Setup

### 1. Install MySQL Dependencies
```bash
pip install pymysql cryptography
```

### 2. Configure MySQL Password
Edit `mysql_config.py` and `test_mysql_connection.py`:
```python
'password': 'your_mysql_password_here',  # Set your actual MySQL password
```

### 3. Test MySQL Connection
```bash
python test_mysql_connection.py
```

**Expected Output:**
```
🚀 MySQL Connection Test
==============================
🔍 Testing MySQL connection...
Host: localhost
Port: 3306
User: root
✅ MySQL connection successful!
MySQL Version: 8.0.xx
✅ Database 'shelf_management' exists
🎉 MySQL is ready for use!
```

### 4. Configure Backend for MySQL
```bash
python mysql_config.py
```

This will:
- ✅ Create `.env` file with MySQL settings
- ✅ Test MySQL connection
- ✅ Create database if needed
- ✅ Set up SQLAlchemy tables

### 5. Load Sample Data (Optional)
```bash
# Run the master script
mysql -u root -p < 00_run_all_scripts.sql

# Or run individual scripts
mysql -u root -p < 01_create_database.sql
mysql -u root -p < 02_create_products_table.sql
mysql -u root -p < 03_create_expiry_table.sql
mysql -u root -p < 04_create_stock_table.sql
mysql -u root -p < 05_create_sales_table.sql
mysql -u root -p < 06_create_views_and_procedures.sql
```

### 6. Start the Backend
```bash
uvicorn app.main:app --reload
```

## 🧪 Testing

### Test API Endpoints
```bash
# Test products
curl http://localhost:8000/api/v1/products/

# Test alerts
curl http://localhost:8000/api/v1/alerts/

# Test forecast
curl http://localhost:8000/api/v1/forecast/
```

### Check Database
```sql
-- Connect to MySQL
mysql -u root -p

-- Use database
USE shelf_management;

-- Check tables
SHOW TABLES;

-- Check sample data
SELECT * FROM products;
SELECT * FROM alerts;
```

## 🔍 Troubleshooting

### MySQL Connection Issues:

#### 1. "Access denied for user 'root'"
```bash
# Reset MySQL root password
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

#### 2. "Can't connect to MySQL server"
```bash
# Start MySQL service
# Windows
net start mysql

# Linux/Mac
sudo service mysql start
# or
sudo systemctl start mysql
```

#### 3. "Database doesn't exist"
```sql
CREATE DATABASE shelf_management;
USE shelf_management;
```

### Python Issues:

#### 1. "ModuleNotFoundError: No module named 'pymysql'"
```bash
pip install pymysql cryptography
```

#### 2. "ImportError: No module named 'app'"
```bash
# Make sure you're in the backend directory
cd backend
python mysql_config.py
```

## 📊 Configuration Files

### .env File (Auto-generated)
```env
# MySQL Database Configuration
DATABASE_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=shelf_management

# Application Settings
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=true
API_V1_STR=/api/v1
PROJECT_NAME=ShelfAI Backend
```

### Database URL Format
```
mysql+pymysql://username:password@host:port/database
```

## 🚀 Production Deployment

### Environment Variables
```env
DATABASE_TYPE=mysql
MYSQL_HOST=your_production_host
MYSQL_PORT=3306
MYSQL_USER=your_production_user
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=shelf_management
SECRET_KEY=your_secure_secret_key
DEBUG=false
```

### Security Best Practices
1. Use strong passwords
2. Create dedicated MySQL user (not root)
3. Limit database permissions
4. Enable SSL connections
5. Regular backups

## ✅ Success Checklist

- [ ] MySQL server is running
- [ ] `python test_mysql_connection.py` succeeds
- [ ] `python mysql_config.py` completes without errors
- [ ] `.env` file is created with MySQL settings
- [ ] Backend starts: `uvicorn app.main:app --reload`
- [ ] API endpoints return data
- [ ] Database tables exist with sample data

## 🆘 Getting Help

### Common Commands
```bash
# Test MySQL connection
python test_mysql_connection.py

# Configure MySQL
python mysql_config.py

# Check database
mysql -u root -p -e "USE shelf_management; SHOW TABLES;"

# Start backend
uvicorn app.main:app --reload

# Check logs
uvicorn app.main:app --reload --log-level debug
```

### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
uvicorn app.main:app --reload --log-level debug
```

---

**Need more help?** Check the logs or run the test scripts for diagnostics. 