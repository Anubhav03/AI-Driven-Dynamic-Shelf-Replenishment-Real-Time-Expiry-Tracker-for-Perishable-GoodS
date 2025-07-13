#!/usr/bin/env python3
"""
MySQL Configuration for ShelfAI Backend
This script helps configure and test MySQL database connection
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_mysql_config():
    """Create MySQL configuration"""
    
    # MySQL Configuration
    mysql_config = {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': '',  # Set your MySQL password here
        'database': 'shelf_management',
        'charset': 'utf8mb4'
    }
    
    # Create .env file content
    env_content = f"""# MySQL Database Configuration
DATABASE_TYPE=mysql
MYSQL_HOST={mysql_config['host']}
MYSQL_PORT={mysql_config['port']}
MYSQL_USER={mysql_config['user']}
MYSQL_PASSWORD={mysql_config['password']}
MYSQL_DATABASE={mysql_config['database']}

# Application Settings
SECRET_KEY=your-secret-key-here-change-this-in-production
DEBUG=true
API_V1_STR=/api/v1
PROJECT_NAME=ShelfAI Backend
"""
    
    # Write .env file
    with open('.env', 'w') as f:
        f.write(env_content)
    
    print("✅ MySQL configuration created in .env file")
    return mysql_config

def test_mysql_connection(config):
    """Test MySQL connection"""
    try:
        # Create connection string
        connection_string = f"mysql+pymysql://{config['user']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"
        
        # Create engine
        engine = create_engine(
            connection_string,
            pool_pre_ping=True,
            pool_recycle=300,
            echo=True
        )
        
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

def create_database_if_not_exists(config):
    """Create database if it doesn't exist"""
    try:
        # Connect without specifying database
        connection_string = f"mysql+pymysql://{config['user']}:{config['password']}@{config['host']}:{config['port']}"
        engine = create_engine(connection_string)
        
        with engine.connect() as connection:
            # Create database if not exists
            connection.execute(text(f"CREATE DATABASE IF NOT EXISTS {config['database']}"))
            connection.execute(text(f"USE {config['database']}"))
            print(f"✅ Database '{config['database']}' is ready!")
            return True
            
    except Exception as e:
        print(f"❌ Failed to create database: {e}")
        return False

def setup_mysql_tables():
    """Set up MySQL tables using SQLAlchemy"""
    try:
        from app.core.config import settings
        from app.db.base import Base
        from app.db.database import engine
        
        print("Creating MySQL tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ MySQL tables created successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Failed to create tables: {e}")
        return False

def main():
    """Main configuration function"""
    print("🚀 MySQL Database Configuration for ShelfAI")
    print("=" * 50)
    
    # Step 1: Create configuration
    print("\n📝 Step 1: Creating MySQL configuration...")
    config = create_mysql_config()
    
    # Step 2: Test connection
    print("\n🔍 Step 2: Testing MySQL connection...")
    if not test_mysql_connection(config):
        print("\n🔧 Troubleshooting:")
        print("1. Make sure MySQL server is running")
        print("2. Check your MySQL password in mysql_config.py")
        print("3. Ensure MySQL user has proper permissions")
        print("4. Try: mysql -u root -p")
        return False
    
    # Step 3: Create database
    print("\n🗄️ Step 3: Creating database...")
    if not create_database_if_not_exists(config):
        return False
    
    # Step 4: Set up tables
    print("\n📊 Step 4: Creating tables...")
    if not setup_mysql_tables():
        return False
    
    print("\n🎉 MySQL configuration completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend: uvicorn app.main:app --reload")
    print("2. Test the API: http://localhost:8000/docs")
    print("3. Run MySQL scripts for sample data:")
    print("   mysql -u root -p < 00_run_all_scripts.sql")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 