#!/usr/bin/env python3
"""
Comprehensive Sample Data Script for ShelfAI Backend
This script creates sample data for all database tables without errors
"""

import os
import sys
from datetime import datetime, timedelta
import random

# Add the app directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_database_connection():
    """Test if database connection works"""
    try:
        from app.db.database import SessionLocal
        from sqlalchemy import text
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        print("✅ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("Please ensure MySQL is running and configured properly.")
        return False

def create_sample_products():
    """Create sample products"""
    from app.db.database import SessionLocal
    from app.db.models.product import Product as ProductModel
    
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
            },
            {
                "name": "Cheese Cheddar",
                "barcode": "1234567890131",
                "category": "Dairy",
                "min_stock": 3,
                "max_stock": 20
            },
            {
                "name": "Oranges",
                "barcode": "1234567890132",
                "category": "Fruits",
                "min_stock": 12,
                "max_stock": 45
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
    from app.db.database import SessionLocal
    from app.db.models.expiry import Expiry as ExpiryModel
    from app.db.models.product import Product as ProductModel
    
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
            expiry_date = datetime.now().date() + timedelta(days=random.randint(1, 30))
            expiry_data = {
                "product_id": product.id,
                "expiry_date": expiry_date,
                "detected_text": f"Best before: {expiry_date.strftime('%Y-%m-%d')}",
                "image_path": f"/images/expiry_{product.id}.jpg"
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
    from app.db.database import SessionLocal
    from app.db.models.stock import Stock as StockModel
    from app.db.models.product import Product as ProductModel
    
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
        for product in products:
            current_stock = random.randint(product.min_stock, product.max_stock)
            stock_data = {
                "product_id": product.id,
                "current_stock": current_stock,
                "shelf_sensor_value": round(random.uniform(0.1, 1.0), 2)
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
    from app.db.database import SessionLocal
    from app.db.models.sales import Sales as SalesModel
    from app.db.models.product import Product as ProductModel
    
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
        
        # Create sales data for each product (multiple records per product)
        for product in products:
            # Create 3-5 sales records per product
            for i in range(random.randint(3, 5)):
                sales_data = {
                    "product_id": product.id,
                    "quantity_sold": random.randint(1, 10),
                    "timestamp": datetime.now() - timedelta(days=random.randint(1, 30))
                }
                sales = SalesModel(**sales_data)
                db.add(sales)
        
        db.commit()
        print(f"✅ Created sales records for {len(products)} products")
        return True
        
    except Exception as e:
        print(f"❌ Error creating sales data: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_sample_manual_expiry():
    """Create sample manual expiry data"""
    from app.db.database import SessionLocal
    from app.db.models.manual_expiry import ManualExpiry as ManualExpiryModel
    from app.db.models.product import Product as ProductModel
    
    db = SessionLocal()
    
    try:
        # Check if manual expiry data already exists
        existing_manual = db.query(ManualExpiryModel).count()
        if existing_manual > 0:
            print(f"✅ Database already has {existing_manual} manual expiry records")
            return True
        
        # Get all products
        products = db.query(ProductModel).all()
        if not products:
            print("❌ No products found. Create products first.")
            return False
        
        # Create manual expiry data for some products
        for i, product in enumerate(products[:5]):  # Only first 5 products
            expiry_date = datetime.now().date() + timedelta(days=random.randint(1, 15))
            manual_expiry_data = {
                "product_id": product.id,
                "expiry_date": expiry_date,
                "quantity": random.randint(1, 5)
            }
            manual_expiry = ManualExpiryModel(**manual_expiry_data)
            db.add(manual_expiry)
        
        db.commit()
        print(f"✅ Created {min(5, len(products))} manual expiry records")
        return True
        
    except Exception as e:
        print(f"❌ Error creating manual expiry data: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_sample_ocr_expiry():
    """Create sample OCR expiry data"""
    from app.db.database import SessionLocal
    from app.db.models.ocr_expiry import OCRExpiry as OCRExpiryModel
    from app.db.models.product import Product as ProductModel
    
    db = SessionLocal()
    
    try:
        # Check if OCR expiry data already exists
        existing_ocr = db.query(OCRExpiryModel).count()
        if existing_ocr > 0:
            print(f"✅ Database already has {existing_ocr} OCR expiry records")
            return True
        
        # Get all products
        products = db.query(ProductModel).all()
        if not products:
            print("❌ No products found. Create products first.")
            return False
        
        # Create OCR expiry data for some products
        for i, product in enumerate(products[5:10]):  # Products 6-10
            expiry_date = datetime.now().date() + timedelta(days=random.randint(1, 20))
            ocr_expiry_data = {
                "product_id": product.id,
                "expiry_date": expiry_date,
                "detected_text": f"Exp: {expiry_date.strftime('%d/%m/%Y')}",
                "image_path": f"/uploads/ocr_{product.id}_{datetime.now().strftime('%Y%m%d')}.jpg",
                "quantity": random.randint(1, 3)
            }
            ocr_expiry = OCRExpiryModel(**ocr_expiry_data)
            db.add(ocr_expiry)
        
        db.commit()
        print(f"✅ Created {min(5, len(products)-5)} OCR expiry records")
        return True
        
    except Exception as e:
        print(f"❌ Error creating OCR expiry data: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def main():
    """Main function to populate all sample data"""
    print("🚀 Comprehensive Sample Data Population for ShelfAI")
    print("=" * 55)
    
    # Step 0: Test database connection
    print("\n🔍 Step 0: Testing database connection...")
    if not test_database_connection():
        return False
    
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
    
    # Step 5: Create manual expiry data
    print("\n✍️ Step 5: Creating sample manual expiry data...")
    if not create_sample_manual_expiry():
        return False
    
    # Step 6: Create OCR expiry data
    print("\n📷 Step 6: Creating sample OCR expiry data...")
    if not create_sample_ocr_expiry():
        return False
    
    print("\n🎉 Sample data population completed successfully!")
    print("\n📋 Database Summary:")
    try:
        from app.db.database import SessionLocal
        from app.db.models import Product, Expiry, Stock, Sales, ManualExpiry, OCRExpiry
        
        db = SessionLocal()
        print(f"   • Products: {db.query(Product).count()}")
        print(f"   • Expiry Records: {db.query(Expiry).count()}")
        print(f"   • Stock Records: {db.query(Stock).count()}")
        print(f"   • Sales Records: {db.query(Sales).count()}")
        print(f"   • Manual Expiry: {db.query(ManualExpiry).count()}")
        print(f"   • OCR Expiry: {db.query(OCRExpiry).count()}")
        db.close()
    except Exception as e:
        print(f"   • Error getting summary: {e}")
    
    print("\n🚀 Next steps:")
    print("1. Start the backend: uvicorn app.main:app --reload")
    print("2. Test the API: http://localhost:8000/docs")
    print("3. Check products: http://localhost:8000/api/v1/products/")
    print("4. Check alerts: http://localhost:8000/api/v1/alerts/")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 