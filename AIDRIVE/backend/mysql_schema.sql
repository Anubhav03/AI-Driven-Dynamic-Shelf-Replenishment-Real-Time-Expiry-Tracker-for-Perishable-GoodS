-- MySQL Database Schema for AI-Driven Shelf Replenishment System
-- Created based on SQLAlchemy models

-- Create database
CREATE DATABASE IF NOT EXISTS shelf_management;
USE shelf_management;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS expiry;
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

-- Create expiry table
CREATE TABLE expiry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    expiry_date DATE NOT NULL,
    image_path VARCHAR(500),
    detected_text TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_expiry_date (expiry_date)
);

-- Create stock table
CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    current_stock INT DEFAULT 0,
    shelf_sensor_value FLOAT DEFAULT 0.0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_timestamp (timestamp)
);

-- Create sales table
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    quantity_sold INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_timestamp (timestamp)
);

-- Insert sample data for testing
INSERT INTO products (name, barcode, category, min_stock, max_stock) VALUES
('Milk 1L', '1234567890123', 'Dairy', 10, 50),
('Bread White', '1234567890124', 'Bakery', 5, 30),
('Apples Red', '1234567890125', 'Fruits', 8, 40),
('Chicken Breast', '1234567890126', 'Meat', 3, 20),
('Tomatoes', '1234567890127', 'Vegetables', 6, 25);

-- Insert sample expiry data
INSERT INTO expiry (product_id, expiry_date, detected_text) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Best before: 2024-01-15'),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Use by: 2024-01-10'),
(3, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Expires: 2024-01-20'),
(4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Best before: 2024-01-12'),
(5, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'Use by: 2024-01-18');

-- Insert sample stock data
INSERT INTO stock (product_id, current_stock, shelf_sensor_value) VALUES
(1, 15, 0.75),
(2, 8, 0.60),
(3, 12, 0.80),
(4, 5, 0.40),
(5, 10, 0.70);

-- Insert sample sales data
INSERT INTO sales (product_id, quantity_sold) VALUES
(1, 5),
(2, 3),
(3, 4),
(4, 2),
(5, 6);

-- Create views for common queries
CREATE VIEW product_alerts AS
SELECT 
    p.id,
    p.name,
    p.barcode,
    p.category,
    s.current_stock,
    p.min_stock,
    e.expiry_date,
    DATEDIFF(e.expiry_date, CURDATE()) as days_until_expiry,
    CASE 
        WHEN s.current_stock < p.min_stock THEN 'low_stock'
        WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 3 THEN 'expiry_critical'
        WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 7 THEN 'expiry_warning'
        ELSE 'normal'
    END as alert_type
FROM products p
LEFT JOIN stock s ON p.id = s.product_id
LEFT JOIN expiry e ON p.id = e.product_id
WHERE s.current_stock < p.min_stock 
   OR DATEDIFF(e.expiry_date, CURDATE()) <= 7;

-- Create stored procedure for getting alerts
DELIMITER //
CREATE PROCEDURE GetAlerts()
BEGIN
    SELECT 
        p.id as product_id,
        p.name as product_name,
        p.barcode,
        p.category,
        s.current_stock,
        p.min_stock,
        e.expiry_date,
        DATEDIFF(e.expiry_date, CURDATE()) as days_until_expiry,
        CASE 
            WHEN s.current_stock < p.min_stock THEN 'low_stock'
            WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 3 THEN 'expiry_critical'
            WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 7 THEN 'expiry_warning'
            ELSE 'normal'
        END as alert_type
    FROM products p
    LEFT JOIN stock s ON p.id = s.product_id
    LEFT JOIN expiry e ON p.id = e.product_id
    WHERE s.current_stock < p.min_stock 
       OR DATEDIFF(e.expiry_date, CURDATE()) <= 7
    ORDER BY 
        CASE 
            WHEN s.current_stock < p.min_stock THEN 1
            WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 3 THEN 2
            WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 7 THEN 3
            ELSE 4
        END;
END //
DELIMITER ;

-- Create stored procedure for demand forecasting
DELIMITER //
CREATE PROCEDURE GetDemandForecast()
BEGIN
    SELECT 
        p.id,
        p.name,
        p.category,
        AVG(sa.quantity_sold) as avg_daily_sales,
        COUNT(sa.id) as sales_count,
        p.min_stock,
        p.max_stock,
        ROUND(AVG(sa.quantity_sold) * 7) as weekly_forecast,
        ROUND(AVG(sa.quantity_sold) * 30) as monthly_forecast
    FROM products p
    LEFT JOIN sales sa ON p.id = sa.product_id
    WHERE sa.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY p.id, p.name, p.category, p.min_stock, p.max_stock
    ORDER BY avg_daily_sales DESC;
END //
DELIMITER ;

-- Show table structure
DESCRIBE products;
DESCRIBE expiry;
DESCRIBE stock;
DESCRIBE sales;

-- Show sample data
SELECT 'Products' as table_name, COUNT(*) as record_count FROM products
UNION ALL
SELECT 'Expiry' as table_name, COUNT(*) as record_count FROM expiry
UNION ALL
SELECT 'Stock' as table_name, COUNT(*) as record_count FROM stock
UNION ALL
SELECT 'Sales' as table_name, COUNT(*) as record_count FROM sales;

-- Test the alerts view
SELECT * FROM product_alerts;

-- Test the stored procedures
CALL GetAlerts();
CALL GetDemandForecast(); 