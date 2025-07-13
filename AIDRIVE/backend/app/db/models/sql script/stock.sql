-- Stock Table Script
-- This table stores current stock levels and sensor data

USE shelf_management;

-- Drop table if exists
DROP TABLE IF EXISTS stock;

-- Create stock table
CREATE TABLE stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    current_stock INT DEFAULT 0,
    shelf_sensor_value FLOAT DEFAULT 0.0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_current_stock (current_stock)
);

-- Insert sample stock data
INSERT INTO stock (product_id, current_stock, shelf_sensor_value) VALUES
(1, 15, 0.75),
(2, 8, 0.60),
(3, 12, 0.80),
(4, 5, 0.40),
(5, 10, 0.70),
(6, 6, 0.50),
(7, 18, 0.85),
(8, 3, 0.30);

-- Show table structure
DESCRIBE stock;

-- Show sample data with product names
SELECT 
    s.id,
    p.name as product_name,
    p.category,
    s.current_stock,
    p.min_stock,
    p.max_stock,
    s.shelf_sensor_value,
    s.timestamp,
    CASE 
        WHEN s.current_stock < p.min_stock THEN 'LOW_STOCK'
        WHEN s.current_stock > p.max_stock THEN 'OVERSTOCKED'
        ELSE 'NORMAL'
    END as stock_status
FROM stock s
JOIN products p ON s.product_id = p.id
ORDER BY s.current_stock;

-- Show record count
SELECT COUNT(*) as total_stock_records FROM stock;

-- Show low stock alerts
SELECT 
    p.name as product_name,
    p.category,
    s.current_stock,
    p.min_stock,
    (p.min_stock - s.current_stock) as stock_needed
FROM stock s
JOIN products p ON s.product_id = p.id
WHERE s.current_stock < p.min_stock
ORDER BY (p.min_stock - s.current_stock) DESC;

-- Show stock levels by category
SELECT 
    p.category,
    COUNT(*) as total_products,
    AVG(s.current_stock) as avg_stock,
    SUM(s.current_stock) as total_stock
FROM stock s
JOIN products p ON s.product_id = p.id
GROUP BY p.category
ORDER BY total_stock DESC;