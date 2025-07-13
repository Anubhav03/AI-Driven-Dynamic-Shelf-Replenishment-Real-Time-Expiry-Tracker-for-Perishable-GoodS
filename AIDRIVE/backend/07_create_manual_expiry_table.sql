-- Create manual_expiry table for manual expiry entries
CREATE TABLE IF NOT EXISTS manual_expiry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    expiry_date DATE NOT NULL,
    quantity INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_created_at (created_at)
);

-- Insert sample manual expiry data for testing
INSERT INTO manual_expiry (product_id, expiry_date, quantity) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 10),
(2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 5),
(3, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 8),
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 12),
(5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 6);

-- Verify the table creation
SELECT 
    'manual_expiry' as table_name,
    COUNT(*) as record_count
FROM manual_expiry; 