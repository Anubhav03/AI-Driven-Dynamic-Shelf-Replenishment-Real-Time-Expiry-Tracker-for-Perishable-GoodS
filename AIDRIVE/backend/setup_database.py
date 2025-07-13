#!/usr/bin/env python3
"""
Database Setup Script for ShelfAI Backend
This script helps you connect the backend to MySQL database
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.db.base import Base
from app.db.database import engine

def test_mysql_connection():
    """Test MySQL connection"""
    try:
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ MySQL connection successful!")
            return True
    except OperationalError as e:
        print(f"❌ MySQL connection failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def create_tables():
    """Create all database tables"""
    try:
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False

def check_database_configuration():
    """Check MySQL database configuration"""
    print(f"📊 MySQL Database Configuration:")
    print(f"   Host: {settings.MYSQL_HOST}")
    print(f"   Port: {settings.MYSQL_PORT}")
    print(f"   Database: {settings.MYSQL_DATABASE}")
    print(f"   User: {settings.MYSQL_USER}")
    print(f"   URL: {settings.get_database_url}")

def main():
    """Main setup function"""
    print("🚀 ShelfAI MySQL Database Setup")
    print("=" * 40)
    
    # Check configuration
    check_database_configuration()
    print()
    
    # Test MySQL connection
    if not test_mysql_connection():
        print("\n🔧 Troubleshooting MySQL Connection:")
        print("1. Make sure MySQL server is running")
        print("2. Check your MySQL credentials in .env file")
        print("3. Ensure the database 'shelf_management' exists")
        print("4. Run the MySQL scripts we created earlier")
        return False
    
    print("\n📝 Creating tables...")
    if create_tables():
        print("\n✅ Database setup completed successfully!")
        print("\n🎯 Next steps:")
        print("1. Start the backend: uvicorn app.main:app --reload")
        print("2. Test the API: http://localhost:8000/docs")
        return True
    else:
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 