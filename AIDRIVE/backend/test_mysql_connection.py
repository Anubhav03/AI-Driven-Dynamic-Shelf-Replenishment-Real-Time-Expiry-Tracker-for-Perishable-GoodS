#!/usr/bin/env python3
"""
Simple MySQL Connection Test
Run this to test if MySQL is accessible
"""

import pymysql
import sys

def test_mysql_connection():
    """Test basic MySQL connection"""
    try:
        # Connection parameters
        connection_params = {
            'host': 'localhost',
            'port': 3306,
            'user': 'root',
            'password': 'january2023',  # Set your MySQL password here
            'charset': 'utf8mb4'
        }
        
        print("🔍 Testing MySQL connection...")
        print(f"Host: {connection_params['host']}")
        print(f"Port: {connection_params['port']}")
        print(f"User: {connection_params['user']}")
        
        # Try to connect
        connection = pymysql.connect(**connection_params)
        
        with connection.cursor() as cursor:
            # Test basic query
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"✅ MySQL connection successful!")
            if version:
                print(f"MySQL Version: {version[0]}")
            else:
                print("MySQL Version: Unknown")
            
            # Check if database exists
            cursor.execute("SHOW DATABASES LIKE 'shelf_management'")
            result = cursor.fetchone()
            
            if result:
                print("✅ Database 'shelf_management' exists")
            else:
                print("⚠️ Database 'shelf_management' does not exist")
                print("Creating database...")
                cursor.execute("CREATE DATABASE shelf_management")
                print("✅ Database 'shelf_management' created")
        
        connection.close()
        return True
        
    except pymysql.Error as e:
        print(f"❌ MySQL connection failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure MySQL server is running")
        print("2. Check if MySQL is installed")
        print("3. Verify your MySQL password")
        print("4. Try: mysql -u root -p")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main function"""
    print("🚀 MySQL Connection Test")
    print("=" * 30)
    
    success = test_mysql_connection()
    
    if success:
        print("\n🎉 MySQL is ready for use!")
        print("Next: Run python mysql_config.py")
    else:
        print("\n❌ MySQL connection failed")
        print("Please fix the issues above and try again")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 