from datetime import date, timedelta
from app.db.models.expiry import Expiry
from app.db.models.product import Product
from app.db.models.stock import Stock
from app.utils.date_utils import days_until

def get_expiry_alerts(db):
    alerts = []
    expiry_items = db.query(Expiry).all()
    for item in expiry_items:
        days_left = days_until(item.expiry_date)
        if days_left < 3:
            alerts.append({
                "type": "expiry",
                "product_id": item.product_id,
                "expiry_date": item.expiry_date,
                "days_left": days_left
            })
    return alerts

def apply_discount_logic(db):
    # Example: mark products with <3 days to expiry for discount
    expiry_items = db.query(Expiry).all()
    for item in expiry_items:
        if days_until(item.expiry_date) < 3:
            # Here you could update a discount flag or similar
            pass
