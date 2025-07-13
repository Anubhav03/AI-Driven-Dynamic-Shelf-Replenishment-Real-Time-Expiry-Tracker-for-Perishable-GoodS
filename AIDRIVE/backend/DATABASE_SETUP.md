# Database Setup Guide for ShelfAI Backend

## 🎯 Overview
This guide helps you connect the FastAPI backend to MySQL database.

## 📋 Prerequisites

### For MySQL:
1. **MySQL Server** installed and running
2. **Python packages**: `pymysql`, `cryptography`
3. **Database**: `shelf_management` database created

## 🔧 Setup Steps

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Configure MySQL Database
Create a `.env` file in the backend directory:
```env
# Database Configuration
DATABASE_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=shelf_management

# Application Settings
SECRET_KEY=your-secret-key-here
DEBUG=true
```

### Step 3: Set Up MySQL Database

1. **Start MySQL server**
2. **Create database**:
   ```sql
   CREATE DATABASE shelf_management;
   USE shelf_management;
   ```

3. **Run MySQL scripts** (from the scripts we created):
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

### Step 4: Test Database Connection
```bash
python setup_database.py
```

This script will:
- ✅ Check database configuration
- ✅ Test MySQL connection
- ✅ Create all tables
- ✅ Provide troubleshooting tips

### Step 5: Start the Backend
```bash
uvicorn app.main:app --reload
```

## 🧪 Testing the Connection

### 1. Check API Documentation
Visit: `http://localhost:8000/docs`

### 2. Test Endpoints
```bash
# Test products endpoint
curl http://localhost:8000/api/v1/products/

# Test alerts endpoint
curl http://localhost:8000/api/v1/alerts/

# Test forecast endpoint
curl http://localhost:8000/api/v1/forecast/
```

### 3. Check Database Tables
```sql
USE shelf_management;
SHOW TABLES;
SELECT * FROM products;
SELECT * FROM alerts;
```

## 🔍 Troubleshooting

### MySQL Connection Issues:
1. **"Access denied"**: Check username/password in `.env`
2. **"Can't connect"**: Ensure MySQL server is running
3. **"Database doesn't exist"**: Create the database first
4. **"Table doesn't exist"**: Run the setup script

### Common Solutions:
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Reset database
python setup_database.py

# Check logs
uvicorn app.main:app --reload --log-level debug
```

## 📊 Database Schema

### Tables:
- **products**: Product information
- **expiry**: Expiry dates and OCR data
- **stock**: Current stock levels
- **sales**: Sales transaction history

### Views:
- **product_alerts**: Real-time alerts
- **inventory_summary**: Category summaries

### Stored Procedures:
- **GetAlerts()**: Returns prioritized alerts
- **GetDemandForecast()**: Sales forecasting
- **GetInventoryStatus()**: Complete inventory status

## 🚀 Production Deployment

### Environment Variables:
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

### Security Best Practices:
1. Use strong passwords
2. Limit database user permissions
3. Enable SSL for MySQL connections
4. Use environment variables for secrets
5. Regular database backups

## ✅ Success Indicators

- ✅ Backend starts without errors
- ✅ API endpoints return data
- ✅ Database tables exist with sample data
- ✅ Frontend can connect to backend
- ✅ Alerts and forecasts work properly

---

**Need help?** Check the logs or run `python setup_database.py` for diagnostics. 