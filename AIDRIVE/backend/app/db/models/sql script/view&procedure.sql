-- Views and Stored Procedures Script
-- This script creates useful views and procedures for the shelf management system

USE shelf_management;

-- Drop existing views and procedures
DROP VIEW IF EXISTS product_alerts;
DROP VIEW IF EXISTS inventory_summary;
DROP PROCEDURE IF EXISTS GetAlerts;
DROP PROCEDURE IF EXISTS GetDemandForecast;
DROP PROCEDURE IF EXISTS GetInventoryStatus;

-- Create product alerts view
CREATE VIEW product_alerts AS
SELECT 
    p.id,
    p.name,
    p.barcode,
    p.category,
    s.current_stock,
    p.min_stock,
    p.max_stock,
    e.expiry_date,
    DATEDIFF(e.expiry_date, CURDATE()) as days_until_expiry,
    CASE 
        WHEN s.current_stock < p.min_stock THEN 'low_stock'
        WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 3 THEN 'expiry_critical'
        WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 7 THEN 'expiry_warning'
        ELSE 'normal'
    END as alert_type,
    CASE 
        WHEN s.current_stock < p.min_stock THEN (p.min_stock - s.current_stock)
        ELSE 0
    END as stock_needed
FROM products p
LEFT JOIN stock s ON p.id = s.product_id
LEFT JOIN expiry e ON p.id = e.product_id
WHERE s.current_stock < p.min_stock 
   OR DATEDIFF(e.expiry_date, CURDATE()) <= 7;

-- Create inventory summary view
CREATE VIEW inventory_summary AS
SELECT 
    p.category,
    COUNT(p.id) as total_products,
    SUM(s.current_stock) as total_stock,
    AVG(s.current_stock) as avg_stock,
    COUNT(CASE WHEN s.current_stock < p.min_stock THEN 1 END) as low_stock_count,
    COUNT(CASE WHEN s.current_stock > p.max_stock THEN 1 END) as overstocked_count
FROM products p
LEFT JOIN stock s ON p.id = s.product_id
GROUP BY p.category;

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
        END as alert_type,
        CASE 
            WHEN s.current_stock < p.min_stock THEN (p.min_stock - s.current_stock)
            ELSE 0
        END as stock_needed
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
        ROUND(AVG(sa.quantity_sold) * 30) as monthly_forecast,
        CASE 
            WHEN ROUND(AVG(sa.quantity_sold) * 7) > p.max_stock THEN 'INCREASE_MAX_STOCK'
            WHEN ROUND(AVG(sa.quantity_sold) * 7) < p.min_stock THEN 'DECREASE_MIN_STOCK'
            ELSE 'OPTIMAL'
        END as recommendation
    FROM products p
    LEFT JOIN sales sa ON p.id = sa.product_id
    WHERE sa.timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY p.id, p.name, p.category, p.min_stock, p.max_stock
    ORDER BY avg_daily_sales DESC;
END //
DELIMITER ;

-- Create stored procedure for inventory status
DELIMITER //
CREATE PROCEDURE GetInventoryStatus()
BEGIN
    SELECT 
        p.name as product_name,
        p.category,
        s.current_stock,
        p.min_stock,
        p.max_stock,
        e.expiry_date,
        DATEDIFF(e.expiry_date, CURDATE()) as days_until_expiry,
        CASE 
            WHEN s.current_stock < p.min_stock THEN 'LOW_STOCK'
            WHEN s.current_stock > p.max_stock THEN 'OVERSTOCKED'
            WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 3 THEN 'EXPIRY_CRITICAL'
            WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 7 THEN 'EXPIRY_WARNING'
            ELSE 'NORMAL'
        END as status
    FROM products p
    LEFT JOIN stock s ON p.id = s.product_id
    LEFT JOIN expiry e ON p.id = e.product_id
    ORDER BY 
        CASE 
            WHEN s.current_stock < p.min_stock THEN 1
            WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 3 THEN 2
            WHEN DATEDIFF(e.expiry_date, CURDATE()) <= 7 THEN 3
            WHEN s.current_stock > p.max_stock THEN 4
            ELSE 5
        END;
END //
DELIMITER ;

-- Test the views
SELECT 'Product Alerts View:' as info;
SELECT * FROM product_alerts LIMIT 5;

SELECT 'Inventory Summary View:' as info;
SELECT * FROM inventory_summary;

-- Test the stored procedures
SELECT 'Testing GetAlerts() procedure:' as info;
CALL GetAlerts();

SELECT 'Testing GetDemandForecast() procedure:' as info;
CALL GetDemandForecast();

SELECT 'Testing GetInventoryStatus() procedure:' as info;
CALL GetInventoryStatus();

-- Show all created objects
SELECT 'Views created:' as info;
SHOW FULL TABLES WHERE Table_type = 'VIEW';

SELECT 'Procedures created:' as info;
SHOW PROCEDURE STATUS WHERE Db = 'shelf_management';