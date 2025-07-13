-- Sales Table Script
-- This table stores sales transaction history

USE shelf_management;

-- Drop table if exists
DROP TABLE IF EXISTS sales;

-- Create sales table
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    quantity_sold INT DEFAULT 0,
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_quantity_sold (quantity_sold)
);

-- Insert sample sales data (last 30 days)
INSERT INTO sales (product_id, quantity_sold, unit_price, total_amount) VALUES
-- Milk sales
(1, 5, 2.50, 12.50),
(1, 3, 2.50, 7.50),
(1, 4, 2.50, 10.00),
(1, 2, 2.50, 5.00),
(1, 6, 2.50, 15.00),

-- Bread sales
(2, 3, 1.80, 5.40),
(2, 2, 1.80, 3.60),
(2, 4, 1.80, 7.20),
(2, 1, 1.80, 1.80),

-- Apples sales
(3, 4, 3.20, 12.80),
(3, 6, 3.20, 19.20),
(3, 3, 3.20, 9.60),
(3, 5, 3.20, 16.00),

-- Chicken sales
(4, 2, 8.50, 17.00),
(4, 1, 8.50, 8.50),
(4, 3, 8.50, 25.50),

-- Tomatoes sales
(5, 6, 2.00, 12.00),
(5, 4, 2.00, 8.00),
(5, 3, 2.00, 6.00),

-- Yogurt sales
(6, 2, 4.50, 9.00),
(6, 3, 4.50, 13.50),
(6, 1, 4.50, 4.50),

-- Bananas sales
(7, 8, 1.20, 9.60),
(7, 5, 1.20, 6.00),
(7, 6, 1.20, 7.20),

-- Ground Beef sales
(8, 1, 12.00, 12.00),
(8, 2, 12.00, 24.00);

-- Show table structure
DESCRIBE sales;

-- Show sample data with product names
SELECT 
    s.id,
    p.name as product_name,
    p.category,
    s.quantity_sold,
    s.unit_price,
    s.total_amount,
    s.timestamp
FROM sales s
JOIN products p ON s.product_id = p.id
ORDER BY s.timestamp DESC
LIMIT 10;

-- Show record count
SELECT COUNT(*) as total_sales_records FROM sales;

-- Show sales summary by product
SELECT 
    p.name as product_name,
    p.category,
    COUNT(s.id) as total_transactions,
    SUM(s.quantity_sold) as total_quantity_sold,
    SUM(s.total_amount) as total_revenue,
    AVG(s.quantity_sold) as avg_quantity_per_sale
FROM sales s
JOIN products p ON s.product_id = p.id
GROUP BY p.id, p.name, p.category
ORDER BY total_revenue DESC;

-- Show daily sales trend
SELECT 
    DATE(s.timestamp) as sale_date,
    COUNT(s.id) as total_transactions,
    SUM(s.quantity_sold) as total_quantity,
    SUM(s.total_amount) as total_revenue
FROM sales s
GROUP BY DATE(s.timestamp)
ORDER BY sale_date DESC
LIMIT 7;

-- Show top selling products
SELECT 
    p.name as product_name,
    SUM(s.quantity_sold) as total_quantity_sold,
    SUM(s.total_amount) as total_revenue
FROM sales s
JOIN products p ON s.product_id = p.id
GROUP BY p.id, p.name
ORDER BY total_quantity_sold DESC
LIMIT 5;
