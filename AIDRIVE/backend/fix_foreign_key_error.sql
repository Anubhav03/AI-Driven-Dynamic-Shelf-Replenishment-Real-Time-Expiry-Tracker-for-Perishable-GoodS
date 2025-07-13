-- Fix Foreign Key Error Script
-- This script checks existing data and inserts in correct order

-- ===========================================
-- STEP 1: Check existing products
-- ===========================================
SELECT 
    'EXISTING PRODUCTS' as info,
    COUNT(*) as total_products
FROM products;

-- Show existing product IDs
SELECT 
    id,
    name,
    barcode
FROM products
ORDER BY id;

-- ===========================================
-- STEP 2: Insert products if none exist
-- ===========================================
INSERT INTO products (name, barcode, category, min_stock, max_stock) VALUES
-- Dairy Products
('Fresh Milk', 'MLK001', 'Dairy', 10, 100),
('Greek Yogurt', 'YOG002', 'Dairy', 5, 50),
('Cheddar Cheese', 'CHS003', 'Dairy', 8, 80),
('Organic Eggs', 'EGG004', 'Dairy', 12, 120),
('Butter', 'BTR005', 'Dairy', 6, 60),
('Cream Cheese', 'CRM006', 'Dairy', 4, 40),
('Sour Cream', 'SCR007', 'Dairy', 3, 30),
('Mozzarella', 'MOZ008', 'Dairy', 7, 70),
('Cottage Cheese', 'COT009', 'Dairy', 5, 50),
('Heavy Cream', 'HCR010', 'Dairy', 4, 40),
('Organic Milk', 'OMLK011', 'Dairy', 8, 80),
('Vanilla Yogurt', 'VYOG012', 'Dairy', 6, 60),
('Blue Cheese', 'BCHS013', 'Dairy', 4, 40),
('Feta Cheese', 'FCHS014', 'Dairy', 3, 30),
('Ricotta Cheese', 'RCHS015', 'Dairy', 5, 50);

-- ===========================================
-- STEP 3: Insert stock data
-- ===========================================
INSERT INTO stock (product_id, current_stock, shelf_sensor_value, timestamp) VALUES
-- Critical: Out of stock (0 items)
(1, 0, 0.0, NOW()),
(2, 0, 0.0, NOW()),

-- Warning: Low stock (below min_stock)
(3, 3, 0.3, NOW()),  -- min_stock is 8, current is 3
(4, 2, 0.2, NOW()),  -- min_stock is 12, current is 2
(5, 1, 0.1, NOW()),  -- min_stock is 6, current is 1

-- Normal stock levels
(6, 8, 0.8, NOW()),  -- min_stock is 4, current is 8
(7, 6, 0.6, NOW()),  -- min_stock is 3, current is 6
(8, 15, 0.75, NOW()), -- min_stock is 7, current is 15
(9, 12, 0.6, NOW()),  -- min_stock is 5, current is 12
(10, 10, 0.5, NOW()), -- min_stock is 4, current is 10

-- Additional test cases
(11, 0, 0.0, NOW()),  -- Out of stock
(12, 2, 0.2, NOW()),  -- Low stock
(13, 1, 0.1, NOW()),  -- Low stock
(14, 0, 0.0, NOW()),  -- Out of stock
(15, 3, 0.3, NOW());  -- Low stock

-- ===========================================
-- STEP 4: Insert legacy expiry data
-- ===========================================
INSERT INTO expiry (product_id, expiry_date, image_path, detected_text) VALUES
-- Critical: Expiring in 1-3 days
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '/images/expiry_samples/milk.jpg', 'Exp: 2024-01-15'),
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '/images/expiry_samples/yogurt.jpg', 'Exp: 2024-01-16'),
(3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '/images/expiry_samples/cheese.jpg', 'Exp: 2024-01-17'),

-- Expired items
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), '/images/expiry_samples/eggs.jpg', 'Exp: 2024-01-13'),
(5, DATE_SUB(CURDATE(), INTERVAL 2 DAY), '/images/expiry_samples/butter.jpg', 'Exp: 2024-01-12'),

-- Warning: Expiring in 4-7 days
(6, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '/images/expiry_samples/cream_cheese.jpg', 'Exp: 2024-01-20'),
(7, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '/images/expiry_samples/sour_cream.jpg', 'Exp: 2024-01-21'),

-- Normal: Expiring in 10+ days
(8, DATE_ADD(CURDATE(), INTERVAL 15 DAY), '/images/expiry_samples/mozzarella.jpg', 'Exp: 2024-01-30'),
(9, DATE_ADD(CURDATE(), INTERVAL 20 DAY), '/images/expiry_samples/cottage_cheese.jpg', 'Exp: 2024-02-05'),
(10, DATE_ADD(CURDATE(), INTERVAL 25 DAY), '/images/expiry_samples/heavy_cream.jpg', 'Exp: 2024-02-10');

-- ===========================================
-- STEP 5: Insert manual expiry data
-- ===========================================
INSERT INTO manual_expiry (product_id, expiry_date, quantity) VALUES
-- Critical: Expiring in 1-3 days
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 15),
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 5),
(3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 8),

-- Expired items
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 12),
(5, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 6),

-- Warning: Expiring in 4-7 days
(6, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 4),
(7, DATE_ADD(CURDATE(), INTERVAL 6 DAY), 3),

-- Normal: Expiring in 10+ days
(8, DATE_ADD(CURDATE(), INTERVAL 15 DAY), 7),
(9, DATE_ADD(CURDATE(), INTERVAL 20 DAY), 5),
(10, DATE_ADD(CURDATE(), INTERVAL 25 DAY), 4),

-- Additional test cases for comprehensive testing
(11, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 8),
(12, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 6),
(13, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 4),
(14, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 3),
(15, DATE_ADD(CURDATE(), INTERVAL 8 DAY), 5);

-- ===========================================
-- STEP 6: Verification
-- ===========================================
SELECT 
    'DATA INSERTION COMPLETE' as status,
    (SELECT COUNT(*) FROM products) as products_count,
    (SELECT COUNT(*) FROM stock) as stock_count,
    (SELECT COUNT(*) FROM expiry) as expiry_count,
    (SELECT COUNT(*) FROM manual_expiry) as manual_expiry_count;

-- Show all products with their data
SELECT 
    p.id,
    p.name,
    s.current_stock,
    p.min_stock,
    CASE 
        WHEN s.current_stock = 0 THEN '🔴 OUT OF STOCK'
        WHEN s.current_stock < p.min_stock THEN '🟡 LOW STOCK'
        ELSE '🟢 NORMAL STOCK'
    END as stock_status
FROM products p
LEFT JOIN stock s ON p.id = s.product_id
ORDER BY p.id; 