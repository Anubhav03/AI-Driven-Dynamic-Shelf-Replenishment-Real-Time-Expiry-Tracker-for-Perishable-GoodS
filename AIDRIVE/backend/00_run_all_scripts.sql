-- Master Script to Run All Database Scripts
-- Execute this script to set up the complete database

-- Set up database
SOURCE 01_create_database.sql;

-- Create tables in order (due to foreign key dependencies)
SOURCE 02_create_products_table.sql;
SOURCE 03_create_expiry_table.sql;
SOURCE 04_create_stock_table.sql;
SOURCE 05_create_sales_table.sql;

-- Create views and procedures
SOURCE 06_create_views_and_procedures.sql;

-- Final verification
SELECT 'Database setup completed successfully!' as status;

-- Show all tables
SHOW TABLES;

-- Show record counts
SELECT 'Products' as table_name, COUNT(*) as record_count FROM products
UNION ALL
SELECT 'Expiry' as table_name, COUNT(*) as record_count FROM expiry
UNION ALL
SELECT 'Stock' as table_name, COUNT(*) as record_count FROM stock
UNION ALL
SELECT 'Sales' as table_name, COUNT(*) as record_count FROM sales;

-- Show summary
SELECT 'Setup Summary:' as info;
SELECT 
    'Total Products' as metric, COUNT(*) as value FROM products
UNION ALL
SELECT 'Low Stock Items', COUNT(*) FROM product_alerts WHERE alert_type = 'low_stock'
UNION ALL
SELECT 'Critical Expiry', COUNT(*) FROM product_alerts WHERE alert_type = 'expiry_critical'
UNION ALL
SELECT 'Warning Expiry', COUNT(*) FROM product_alerts WHERE alert_type = 'expiry_warning'; 