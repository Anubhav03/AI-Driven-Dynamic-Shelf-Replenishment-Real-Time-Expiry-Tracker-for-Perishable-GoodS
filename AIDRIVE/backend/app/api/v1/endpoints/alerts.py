from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.services.expiry_logic import get_expiry_alerts
from app.db.models.product import Product
from app.db.models.stock import Stock
from app.core.logger import logger

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK)
def get_alerts(db: Session = Depends(get_db)):
    try:
        alerts = get_expiry_alerts(db)
        # Add low-stock alerts
        products = db.query(Product).all()
        for product in products:
            stock = db.query(Stock).filter(Stock.product_id == product.id).order_by(Stock.timestamp.desc()).first()
            current_stock = getattr(stock, "current_stock", None)
            min_stock = getattr(product, "min_stock", None)
            if (
                current_stock is not None
                and min_stock is not None
                and int(current_stock) < int(min_stock)
            ):
                alerts.append({
                    "type": "low_stock",
                    "product_id": product.id,
                    "current_stock": current_stock,
                    "min_stock": min_stock
                })
        return alerts
    except Exception as e:
        logger.error(f"Failed to get alerts: {e}")
        raise HTTPException(status_code=500, detail="Failed to get alerts.")
