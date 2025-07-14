# Database Scripts for ShelfAI Backend

This directory contains scripts to set up and populate the database with sample data.

## 📋 Available Scripts

### 1. `test_database.py`
**Purpose**: Test database connection and table creation
**Usage**: `python test_database.py`
**What it does**:
- Tests MySQL connection
- Verifies all models can be imported
- Creates database tables
- Lists created tables

### 2. `sample_data_script.py`
**Purpose**: Populate database with comprehensive sample data
**Usage**: `python sample_data_script.py`
**What it does**:
- Creates 10 sample products (Dairy, Bakery, Fruits, Meat, Vegetables)
- Creates expiry records for all products
- Creates stock records with realistic levels
- Creates sales records (3-5 per product)
- Creates manual expiry records (first 5 products)
- Creates OCR expiry records (products 6-10)

### 3. `setup_database.py`
**Purpose**: Complete database setup (runs all scripts)
**Usage**: `python setup_database.py`
**What it does**:
- Installs dependencies
- Tests database connection
- Populates sample data
- Provides next steps

## 🚀 Quick Start

### Option 1: Complete Setup (Recommended)
```bash
python setup_database.py
```

### Option 2: Step by Step
```bash
# 1. Test database connection
python test_database.py

# 2. Populate sample data
python sample_data_script.py

# 3. Start the backend
uvicorn app.main:app --reload
```

## 📊 Sample Data Created

### Products (10 items)
- Milk 1L, Bread White, Apples Red, Chicken Breast, Tomatoes
- Yogurt Greek, Bananas, Ground Beef, Cheese Cheddar, Oranges

### Data Records
- **Expiry Records**: 10 records (one per product)
- **Stock Records**: 10 records with realistic stock levels
- **Sales Records**: 30-50 records (3-5 per product)
- **Manual Expiry**: 5 records (first 5 products)
- **OCR Expiry**: 5 records (products 6-10)

## 🔧 Troubleshooting

### Database Connection Issues
1. **MySQL not running**: Start MySQL service
2. **Wrong credentials**: Check `app/core/config.py`
3. **Database doesn't exist**: Create `shelf_management` database

### Import Errors
1. **Missing dependencies**: Run `pip install -r requirements.txt`
2. **Python path issues**: Make sure you're in the backend directory

### Table Creation Errors
1. **VARCHAR length issues**: Fixed in the updated models
2. **Permission issues**: Check MySQL user permissions

## 📈 API Endpoints to Test

After running the scripts, test these endpoints:

```bash
# Get all products
curl http://localhost:8000/api/v1/products/

# Get all alerts
curl http://localhost:8000/api/v1/alerts/

# Get demand forecast
curl http://localhost:8000/api/v1/forecast/

# Get expiry records
curl http://localhost:8000/api/v1/expiry/
```

## 🎯 Expected Results

After running the scripts successfully:
- ✅ Database connection working
- ✅ All tables created
- ✅ Sample data populated
- ✅ Backend starts without errors
- ✅ API endpoints return data

## 📝 Notes

- Scripts are idempotent (safe to run multiple times)
- Existing data won't be overwritten
- Random data is generated for realistic testing
- All String columns have proper VARCHAR lengths for MySQL 