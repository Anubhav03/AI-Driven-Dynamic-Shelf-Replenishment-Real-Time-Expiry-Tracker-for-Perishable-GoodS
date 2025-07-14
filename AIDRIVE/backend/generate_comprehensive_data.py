#!/usr/bin/env python3
"""
Comprehensive Data Generator for Shelf Management System
Generates test data for products, stock, expiry, manual expiry, and sales tables
Skips OCR expiry table as requested
"""

import random
from datetime import datetime, timedelta, date
import mysql.connector
from mysql.connector import Error

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_password',  # Update with your MySQL password
    'database': 'shelf_management'
}

# Product data with realistic information
PRODUCTS_DATA = [
    {'name': 'Milk', 'barcode': '1000001', 'category': 'Dairy', 'min_stock': 10, 'max_stock': 100, 'unit_price': 2.50},
    {'name': 'Bread', 'barcode': '1000002', 'category': 'Bakery', 'min_stock': 5, 'max_stock': 50, 'unit_price': 1.80},
    {'name': 'Apple', 'barcode': '1000003', 'category': 'Fruit', 'min_stock': 20, 'max_stock': 200, 'unit_price': 3.20},
    {'name': 'Chicken', 'barcode': '1000004', 'category': 'Meat', 'min_stock': 5, 'max_stock': 30, 'unit_price': 8.50},
    {'name': 'Tomato', 'barcode': '1000005', 'category': 'Vegetable', 'min_stock': 10, 'max_stock': 100, 'unit_price': 2.00},
    {'name': 'Yogurt', 'barcode': '1000006', 'category': 'Dairy', 'min_stock': 10, 'max_stock': 100, 'unit_price': 4.50},
    {'name': 'Banana', 'barcode': '1000007', 'category': 'Fruit', 'min_stock': 20, 'max_stock': 200, 'unit_price': 1.20},
    {'name': 'Ground Beef', 'barcode': '1000008', 'category': 'Meat', 'min_stock': 5, 'max_stock': 30, 'unit_price': 12.00},
    {'name': 'Eggs', 'barcode': '1000009', 'category': 'Dairy', 'min_stock': 10, 'max_stock': 100, 'unit_price': 3.00},
    {'name': 'Orange Juice', 'barcode': '1000010', 'category': 'Beverage', 'min_stock': 10, 'max_stock': 100, 'unit_price': 2.80},
    {'name': 'Cheese', 'barcode': '1000011', 'category': 'Dairy', 'min_stock': 5, 'max_stock': 50, 'unit_price': 5.50},
    {'name': 'Potato', 'barcode': '1000012', 'category': 'Vegetable', 'min_stock': 15, 'max_stock': 150, 'unit_price': 1.50},
    {'name': 'Orange', 'barcode': '1000013', 'category': 'Fruit', 'min_stock': 25, 'max_stock': 250, 'unit_price': 2.50},
    {'name': 'Pork', 'barcode': '1000014', 'category': 'Meat', 'min_stock': 5, 'max_stock': 25, 'unit_price': 9.00},
    {'name': 'Onion', 'barcode': '1000015', 'category': 'Vegetable', 'min_stock': 10, 'max_stock': 80, 'unit_price': 1.80}
]

def connect_to_database():
    """Establish database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("Successfully connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def clear_existing_data(cursor):
    """Clear existing data from tables in correct order"""
    print("Clearing existing data...")
    tables = ['sales', 'manual_expiry', 'expiry', 'stock', 'products']
    for table in tables:
        try:
            cursor.execute(f"DELETE FROM {table}")
            print(f"Cleared {table} table")
        except Error as e:
            print(f"Error clearing {table}: {e}")

def insert_products(cursor):
    """Insert product data"""
    print("Inserting products...")
    for i, product in enumerate(PRODUCTS_DATA, 1):
        sql = """
        INSERT INTO products (id, name, barcode, category, min_stock, max_stock) 
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (i, product['name'], product['barcode'], product['category'], 
                 product['min_stock'], product['max_stock'])
        cursor.execute(sql, values)
    print(f"Inserted {len(PRODUCTS_DATA)} products")

def insert_stock(cursor):
    """Insert stock data for each product"""
    print("Inserting stock data...")
    for i in range(1, len(PRODUCTS_DATA) + 1):
        current_stock = random.randint(20, 80)  # Realistic stock levels
        sql = """
        INSERT INTO stock (product_id, current_stock, timestamp) 
        VALUES (%s, %s, NOW())
        """
        cursor.execute(sql, (i, current_stock))
    print(f"Inserted stock data for {len(PRODUCTS_DATA)} products")

def insert_expiry_data(cursor):
    """Insert expiry data (legacy table)"""
    print("Inserting expiry data...")
    expiry_records = []
    for i in range(1, len(PRODUCTS_DATA) + 1):
        # Generate 2-5 expiry records per product
        num_records = random.randint(2, 5)
        for _ in range(num_records):
            days_from_now = random.randint(-5, 30)  # Some expired, some future
            expiry_date = date.today() + timedelta(days=days_from_now)
            quantity = random.randint(1, 20)
            expiry_records.append((i, expiry_date, quantity))
    
    sql = "INSERT INTO expiry (product_id, expiry_date, quantity) VALUES (%s, %s, %s)"
    cursor.executemany(sql, expiry_records)
    print(f"Inserted {len(expiry_records)} expiry records")

def insert_manual_expiry_data(cursor):
    """Insert manual expiry data"""
    print("Inserting manual expiry data...")
    manual_expiry_records = []
    for i in range(1, len(PRODUCTS_DATA) + 1):
        # Generate 1-3 manual expiry records per product
        num_records = random.randint(1, 3)
        for _ in range(num_records):
            days_from_now = random.randint(-3, 21)  # Some expired, some future
            expiry_date = date.today() + timedelta(days=days_from_now)
            quantity = random.randint(1, 15)
            manual_expiry_records.append((i, expiry_date, quantity))
    
    sql = "INSERT INTO manual_expiry (product_id, expiry_date, quantity) VALUES (%s, %s, %s)"
    cursor.executemany(sql, manual_expiry_records)
    print(f"Inserted {len(manual_expiry_records)} manual expiry records")

def insert_sales_data(cursor):
    """Insert 1000 sales records"""
    print("Inserting sales data...")
    sales_records = []
    
    # Generate 1000 sales records
    for _ in range(1000):
        product_id = random.randint(1, len(PRODUCTS_DATA))
        quantity_sold = random.randint(1, 10)
        unit_price = PRODUCTS_DATA[product_id - 1]['unit_price']
        total_amount = quantity_sold * unit_price
        
        # Generate timestamp within last 90 days
        days_ago = random.randint(0, 90)
        hours_ago = random.randint(0, 23)
        minutes_ago = random.randint(0, 59)
        timestamp = datetime.now() - timedelta(days=days_ago, hours=hours_ago, minutes=minutes_ago)
        
        sales_records.append((product_id, timestamp, quantity_sold, unit_price, total_amount))
    
    sql = """
    INSERT INTO sales (product_id, timestamp, quantity_sold, unit_price, total_amount) 
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.executemany(sql, sales_records)
    print(f"Inserted {len(sales_records)} sales records")

def generate_sql_file():
    """Generate SQL file with all the data"""
    print("Generating SQL file...")
    
    sql_content = """-- Comprehensive Test Data for Shelf Management System
-- Generated on: """ + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + """

USE shelf_management;

-- Clear existing data
DELETE FROM sales;
DELETE FROM manual_expiry;
DELETE FROM expiry;
DELETE FROM stock;
DELETE FROM products;

-- Insert Products
"""
    
    # Add products
    for i, product in enumerate(PRODUCTS_DATA, 1):
        sql_content += f"INSERT INTO products (id, name, barcode, category, min_stock, max_stock) VALUES ({i}, '{product['name']}', '{product['barcode']}', '{product['category']}', {product['min_stock']}, {product['max_stock']});\n"
    
    # Add stock
    sql_content += "\n-- Insert Stock Data\n"
    for i in range(1, len(PRODUCTS_DATA) + 1):
        current_stock = random.randint(20, 80)
        sql_content += f"INSERT INTO stock (product_id, current_stock, timestamp) VALUES ({i}, {current_stock}, NOW());\n"
    
    # Add expiry data
    sql_content += "\n-- Insert Expiry Data (Legacy)\n"
    for i in range(1, len(PRODUCTS_DATA) + 1):
        num_records = random.randint(2, 5)
        for _ in range(num_records):
            days_from_now = random.randint(-5, 30)
            expiry_date = date.today() + timedelta(days=days_from_now)
            quantity = random.randint(1, 20)
            sql_content += f"INSERT INTO expiry (product_id, expiry_date, quantity) VALUES ({i}, '{expiry_date}', {quantity});\n"
    
    # Add manual expiry data
    sql_content += "\n-- Insert Manual Expiry Data\n"
    for i in range(1, len(PRODUCTS_DATA) + 1):
        num_records = random.randint(1, 3)
        for _ in range(num_records):
            days_from_now = random.randint(-3, 21)
            expiry_date = date.today() + timedelta(days=days_from_now)
            quantity = random.randint(1, 15)
            sql_content += f"INSERT INTO manual_expiry (product_id, expiry_date, quantity) VALUES ({i}, '{expiry_date}', {quantity});\n"
    
    # Add sales data
    sql_content += "\n-- Insert Sales Data (1000 records)\n"
    for _ in range(1000):
        product_id = random.randint(1, len(PRODUCTS_DATA))
        quantity_sold = random.randint(1, 10)
        unit_price = PRODUCTS_DATA[product_id - 1]['unit_price']
        total_amount = quantity_sold * unit_price
        days_ago = random.randint(0, 90)
        timestamp = datetime.now() - timedelta(days=days_ago)
        sql_content += f"INSERT INTO sales (product_id, timestamp, quantity_sold, unit_price, total_amount) VALUES ({product_id}, '{timestamp.strftime('%Y-%m-%d %H:%M:%S')}', {quantity_sold}, {unit_price}, {total_amount:.2f});\n"
    
    # Write to file
    with open('comprehensive_test_data.sql', 'w') as f:
        f.write(sql_content)
    
    print("SQL file 'comprehensive_test_data.sql' generated successfully!")

def main():
    """Main function to run the data generation"""
    print("=== Comprehensive Data Generator for Shelf Management System ===")
    print("This script will generate test data for all tables except OCR expiry")
    
    # Option 1: Direct database insertion
    connection = connect_to_database()
    if connection:
        try:
            cursor = connection.cursor()
            
            # Clear existing data
            clear_existing_data(cursor)
            
            # Insert data in correct order
            insert_products(cursor)
            insert_stock(cursor)
            insert_expiry_data(cursor)
            insert_manual_expiry_data(cursor)
            insert_sales_data(cursor)
            
            # Commit changes
            connection.commit()
            print("\n=== Data generation completed successfully! ===")
            print("Summary:")
            print(f"- {len(PRODUCTS_DATA)} products inserted")
            print(f"- Stock data for {len(PRODUCTS_DATA)} products")
            print(f"- Multiple expiry records per product")
            print(f"- Multiple manual expiry records per product")
            print(f"- 1000 sales records inserted")
            
        except Error as e:
            print(f"Error during data generation: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
                print("Database connection closed")
    
    # Option 2: Generate SQL file
    print("\nGenerating SQL file as backup...")
    generate_sql_file()
    
    print("\n=== Script completed! ===")
    print("You can now run the generated SQL file or use the direct database insertion")

if __name__ == "__main__":
    main() 