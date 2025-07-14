#!/usr/bin/env python3
"""
Complete Database Setup Script for ShelfAI Backend
This script sets up the database, creates tables, and populates sample data
"""

import os
import sys
import subprocess

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully!")
            if result.stdout:
                print(result.stdout)
            return True
        else:
            print(f"❌ {description} failed!")
            if result.stderr:
                print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Error running {description}: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Complete Database Setup for ShelfAI")
    print("=" * 50)
    
    # Step 1: Install dependencies
    print("\n📦 Step 1: Installing dependencies...")
    if not run_command("pip install -r requirements.txt", "Installing Python dependencies"):
        print("⚠️ Some dependencies may not be installed. Continuing...")
    
    # Step 2: Test database connection
    print("\n🔌 Step 2: Testing database connection...")
    if not run_command("python test_database.py", "Testing database connection"):
        print("❌ Database connection failed. Please check MySQL configuration.")
        return False
    
    # Step 3: Populate sample data
    print("\n📊 Step 3: Populating sample data...")
    if not run_command("python sample_data_script.py", "Populating sample data"):
        print("❌ Sample data population failed.")
        return False
    
    print("\n🎉 Database setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend: uvicorn app.main:app --reload")
    print("2. Test the API: http://localhost:8000/docs")
    print("3. Check products: http://localhost:8000/api/v1/products/")
    print("4. Check alerts: http://localhost:8000/api/v1/alerts/")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 