-- Expiry Table Script
-- This table stores product expiry information and OCR data

USE shelf_management;

-- Drop table if exists
DROP TABLE IF EXISTS expiry;

-- Create expiry table
CREATE TABLE expiry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    expiry_date DATE NOT NULL,
    image_path VARCHAR(500),
    detected_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_created_at (created_at)
);

-- Insert sample expiry data
INSERT INTO expiry (product_id, expiry_date, detected_text) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Best before: 2024-01-15'),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Use by: 2024-01-10'),
(3, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'Expires: 2024-01-20'),
(4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Best before: 2024-01-12'),
(5, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'Use by: 2024-01-18'),
(6, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'Best before: 2024-01-16'),
(7, DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'Expires: 2024-01-19'),
(8, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'Use by: 2024-01-11');

-- Show table structure
DESCRIBE expiry;

-- Show sample data
SELECT 
    e.id,
    p.name as product_name,
    e.expiry_date,
    e.detected_text,
    DATEDIFF(e.expiry_date, CURDATE()) as days_until_expiry,
    e.created_at
FROM expiry e
JOIN products p ON e.product_id = p.id
ORDER BY e.expiry_date;

-- Show record count
SELECT COUNT(*) as total_expiry_records FROM expiry;

-- Show critical expiry alerts (3 days or less)
SELECT 
    p.name as product_name,
    e.expiry_date,
    DATEDIFF(e.expiry_date, CURDATE()) as days_until_expiry
FROM expiry e
JOIN products p ON e.product_id = p.id
WHERE DATEDIFF(e.expiry_date, CURDATE()) <= 3
ORDER BY e.expiry_date; 