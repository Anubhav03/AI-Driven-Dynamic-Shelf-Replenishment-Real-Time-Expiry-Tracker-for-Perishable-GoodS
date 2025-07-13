-- Products Table Script
-- This table stores product information

USE shelf_management;

-- Drop table if exists
DROP TABLE IF EXISTS products;

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    barcode VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    min_stock INT DEFAULT 0,
    max_stock INT DEFAULT 100,
    INDEX idx_barcode (barcode),
    INDEX idx_category (category)
);

-- Insert sample products data
INSERT INTO products (name, barcode, category, min_stock, max_stock) VALUES
('Milk 1L', '1234567890123', 'Dairy', 10, 50),
('Bread White', '1234567890124', 'Bakery', 5, 30),
('Apples Red', '1234567890125', 'Fruits', 8, 40),
('Chicken Breast', '1234567890126', 'Meat', 3, 20),
('Tomatoes', '1234567890127', 'Vegetables', 6, 25),
('Yogurt Greek', '1234567890128', 'Dairy', 4, 25),
('Bananas', '1234567890129', 'Fruits', 10, 35),
('Ground Beef', '1234567890130', 'Meat', 2, 15);

-- Show table structure
DESCRIBE products;

-- Show sample data
SELECT * FROM products;

-- Show record count
SELECT COUNT(*) as total_products FROM products; 