#!/usr/bin/env python3
"""
Populate Sample Data for ShelfAI Backend
This script adds sample products to the database
"""

import os
import sys
from datetime import datetime, timedelta

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.database import SessionLocal
from app.db.models.product import Product as ProductModel
from app.db.models.expiry import Expiry as ExpiryModel
from app.db.models.stock import Stock as StockModel
from app.db.models.sales import Sales as SalesModel

def create_sample_products():
    """Create sample products"""
    db = SessionLocal()
    
    try:
        # Check if products already exist
        existing_products = db.query(ProductModel).count()
        if existing_products > 0:
            print(f"✅ Database already has {existing_products} products")
            return True
        
        # Sample products data
        sample_products = [
            {
                "name": "Milk 1L",
                "barcode": "1234567890123",
                "category": "Dairy",
                "min_stock": 10,
                "max_stock": 50
            },
            {
                "name": "Bread White",
                "barcode": "1234567890124",
                "category": "Bakery",
                "min_stock": 5,
                "max_stock": 30
            },
            {
                "name": "Apples Red",
                "barcode": "1234567890125",
                "category": "Fruits",
                "min_stock": 8,
                "max_stock": 40
            },
            {
                "name": "Chicken Breast",
                "barcode": "1234567890126",
                "category": "Meat",
                "min_stock": 3,
                "max_stock": 20
            },
            {
                "name": "Tomatoes",
                "barcode": "1234567890127",
                "category": "Vegetables",
                "min_stock": 6,
                "max_stock": 25
            },
            {
                "name": "Yogurt Greek",
                "barcode": "1234567890128",
                "category": "Dairy",
                "min_stock": 4,
                "max_stock": 25
            },
            {
                "name": "Bananas",
                "barcode": "1234567890129",
                "category": "Fruits",
                "min_stock": 10,
                "max_stock": 35
            },
            {
                "name": "Ground Beef",
                "barcode": "1234567890130",
                "category": "Meat",
                "min_stock": 2,
                "max_stock": 15
            }
        ]
        
        # Create products
        for product_data in sample_products:
            product = ProductModel(**product_data)
            db.add(product)
        
        db.commit()
        print(f"✅ Created {len(sample_products)} sample products")
        return True
        
    except Exception as e:
        print(f"❌ Error creating products: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_sample_expiry():
    """Create sample expiry data"""
    db = SessionLocal()
    
    try:
        # Check if expiry data already exists
        existing_expiry = db.query(ExpiryModel).count()
        if existing_expiry > 0:
            print(f"✅ Database already has {existing_expiry} expiry records")
            return True
        
        # Get all products
        products = db.query(ProductModel).all()
        if not products:
            print("❌ No products found. Create products first.")
            return False
        
        # Create expiry data for each product
        for i, product in enumerate(products):
            expiry_date = datetime.now().date() + timedelta(days=i+1)
            expiry_data = {
                "product_id": product.id,
                "expiry_date": expiry_date,
                "detected_text": f"Best before: {expiry_date}"
            }
            expiry = ExpiryModel(**expiry_data)
            db.add(expiry)
        
        db.commit()
        print(f"✅ Created {len(products)} expiry records")
        return True
        
    except Exception as e:
        print(f"❌ Error creating expiry data: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_sample_stock():
    """Create sample stock data"""
    db = SessionLocal()
    
    try:
        # Check if stock data already exists
        existing_stock = db.query(StockModel).count()
        if existing_stock > 0:
            print(f"✅ Database already has {existing_stock} stock records")
            return True
        
        # Get all products
        products = db.query(ProductModel).all()
        if not products:
            print("❌ No products found. Create products first.")
            return False
        
        # Create stock data for each product
        stock_levels = [15, 8, 12, 5, 10, 6, 18, 3]  # Different stock levels
        
        for i, product in enumerate(products):
            stock_data = {
                "product_id": product.id,
                "current_stock": stock_levels[i % len(stock_levels)],
                "shelf_sensor_value": 0.5 + (i * 0.1)
            }
            stock = StockModel(**stock_data)
            db.add(stock)
        
        db.commit()
        print(f"✅ Created {len(products)} stock records")
        return True
        
    except Exception as e:
        print(f"❌ Error creating stock data: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_sample_sales():
    """Create sample sales data"""
    db = SessionLocal()
    
    try:
        # Check if sales data already exists
        existing_sales = db.query(SalesModel).count()
        if existing_sales > 0:
            print(f"✅ Database already has {existing_sales} sales records")
            return True
        
        # Get all products
        products = db.query(ProductModel).all()
        if not products:
            print("❌ No products found. Create products first.")
            return False
        
        # Create sales data for each product
        quantities = [5, 3, 4, 2, 6, 2, 8, 1]  # Different quantities
        
        for i, product in enumerate(products):
            sales_data = {
                "product_id": product.id,
                "quantity_sold": quantities[i % len(quantities)],
                "timestamp": datetime.now() - timedelta(days=i)
            }
            sales = SalesModel(**sales_data)
            db.add(sales)
        
        db.commit()
        print(f"✅ Created {len(products)} sales records")
        return True
        
    except Exception as e:
        print(f"❌ Error creating sales data: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def main():
    """Main function to populate all sample data"""
    print("🚀 Populating Sample Data for ShelfAI")
    print("=" * 40)
    
    # Step 1: Create products
    print("\n📦 Step 1: Creating sample products...")
    if not create_sample_products():
        return False
    
    # Step 2: Create expiry data
    print("\n📅 Step 2: Creating sample expiry data...")
    if not create_sample_expiry():
        return False
    
    # Step 3: Create stock data
    print("\n📊 Step 3: Creating sample stock data...")
    if not create_sample_stock():
        return False
    
    # Step 4: Create sales data
    print("\n💰 Step 4: Creating sample sales data...")
    if not create_sample_sales():
        return False
    
    print("\n🎉 Sample data population completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend: uvicorn app.main:app --reload")
    print("2. Test the API: http://localhost:8000/docs")
    print("3. Check products: http://localhost:8000/api/v1/products/")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 