from datetime import date, timedelta
from app.db.models.expiry import Expiry
from app.db.models.manual_expiry import ManualExpiry
from app.db.models.ocr_expiry import OCRExpiry
from app.db.models.product import Product
from app.db.models.stock import Stock
from app.utils.date_utils import days_until

def get_expiry_alerts(db):
    """Get expiry alerts from all expiry tables (legacy, manual, and OCR)"""
    alerts = []
    
    # Get alerts from legacy expiry table
    expiry_items = db.query(Expiry).all()
    for item in expiry_items:
        days_left = days_until(item.expiry_date)
        if days_left < 3:
            alerts.append({
                "type": "expiry",
                "product_id": item.product_id,
                "expiry_date": item.expiry_date,
                "days_left": days_left,
                "source": "legacy"
            })
    
    # Get alerts from manual expiry table
    manual_expiry_items = db.query(ManualExpiry).all()
    for item in manual_expiry_items:
        days_left = days_until(item.expiry_date)
        if days_left < 3:
            alerts.append({
                "type": "expiry",
                "product_id": item.product_id,
                "expiry_date": item.expiry_date,
                "days_left": days_left,
                "quantity": item.quantity,
                "source": "manual"
            })
    
    # Get alerts from OCR expiry table
    ocr_expiry_items = db.query(OCRExpiry).all()
    for item in ocr_expiry_items:
        days_left = days_until(item.expiry_date)
        if days_left < 3:
            alerts.append({
                "type": "expiry",
                "product_id": item.product_id,
                "expiry_date": item.expiry_date,
                "days_left": days_left,
                "quantity": item.quantity,
                "detected_text": item.detected_text,
                "image_path": item.image_path,
                "source": "ocr"
            })
    
    return alerts

def apply_discount_logic(db):
    """Example: mark products with <3 days to expiry for discount"""
    # Check all expiry tables
    expiry_items = db.query(Expiry).all()
    manual_expiry_items = db.query(ManualExpiry).all()
    ocr_expiry_items = db.query(OCRExpiry).all()
    
    for item in expiry_items:
        if days_until(item.expiry_date) < 3:
            # Here you could update a discount flag or similar
            pass
    
    for item in manual_expiry_items:
        if days_until(item.expiry_date) < 3:
            # Apply discount logic for manual entries
            pass
    
    for item in ocr_expiry_items:
        if days_until(item.expiry_date) < 3:
            # Apply discount logic for OCR entries
            pass
