#!/usr/bin/env python3
"""
Database Test Script for ShelfAI Backend
This script tests database connection and table creation
"""

import os
import sys

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_database_connection():
    """Test database connection"""
    try:
        from app.db.database import SessionLocal
        from sqlalchemy import text
        
        db = SessionLocal()
        
        # Test basic connection
        result = db.execute(text("SELECT 1 as test")).fetchone()
        print(f"✅ Database connection successful: {result}")
        
        # Test database name
        db_name = db.execute(text("SELECT DATABASE()")).fetchone()
        print(f"✅ Connected to database: {db_name[0]}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_table_creation():
    """Test if tables can be created"""
    try:
        from app.db.database import engine
        from app.db.base import Base
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
        
        # List created tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"✅ Created tables: {tables}")
        
        return True
        
    except Exception as e:
        print(f"❌ Table creation failed: {e}")
        return False

def test_model_imports():
    """Test if all models can be imported"""
    try:
        from app.db.models.product import Product
        from app.db.models.expiry import Expiry
        from app.db.models.stock import Stock
        from app.db.models.sales import Sales
        from app.db.models.manual_expiry import ManualExpiry
        from app.db.models.ocr_expiry import OCRExpiry
        
        print("✅ All models imported successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Model import failed: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Database Test Script for ShelfAI")
    print("=" * 40)
    
    # Test 1: Model imports
    print("\n📦 Test 1: Model imports...")
    if not test_model_imports():
        return False
    
    # Test 2: Database connection
    print("\n🔌 Test 2: Database connection...")
    if not test_database_connection():
        return False
    
    # Test 3: Table creation
    print("\n🏗️ Test 3: Table creation...")
    if not test_table_creation():
        return False
    
    print("\n🎉 All tests passed! Database is ready.")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 