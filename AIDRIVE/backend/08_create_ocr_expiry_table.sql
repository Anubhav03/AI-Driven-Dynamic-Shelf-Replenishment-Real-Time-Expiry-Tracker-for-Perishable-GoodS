-- Create ocr_expiry table for OCR expiry entries
CREATE TABLE IF NOT EXISTS ocr_expiry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    expiry_date DATE NOT NULL,
    detected_text VARCHAR(500),
    image_path VARCHAR(255),
    quantity INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_expiry_date (expiry_date),
    INDEX idx_created_at (created_at)
);

-- Insert sample OCR expiry data for testing
INSERT INTO ocr_expiry (product_id, expiry_date, detected_text, image_path, quantity) VALUES
(6, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'Exp: 2024-01-19', '/images/ocr_samples/cream_cheese.jpg', 4),
(7, DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'Exp: 2024-01-21', '/images/ocr_samples/sour_cream.jpg', 3),
(8, DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'Exp: 2024-01-30', '/images/ocr_samples/mozzarella.jpg', 7),
(9, DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'Exp: 2024-02-05', '/images/ocr_samples/cottage_cheese.jpg', 5),
(10, DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'Exp: 2024-02-10', '/images/ocr_samples/heavy_cream.jpg', 4);

-- Verify the table creation
SELECT 
    'ocr_expiry' as table_name,
    COUNT(*) as record_count
FROM ocr_expiry; 