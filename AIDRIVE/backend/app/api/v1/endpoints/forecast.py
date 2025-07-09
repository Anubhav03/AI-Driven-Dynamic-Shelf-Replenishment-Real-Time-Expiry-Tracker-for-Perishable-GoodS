from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.db.models.product import Product
from app.services.forecast_model import predict_demand
from app.core.logger import logger

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK)
def get_forecast(db: Session = Depends(get_db)):
    try:
        products = db.query(Product).all()
        forecasts = []
        for product in products:
            # In real use, pass real features
            forecast = predict_demand({"product_id": product.id})
            forecasts.append({"product_id": product.id, "forecast": forecast})
        return forecasts
    except Exception as e:
        logger.error(f"Failed to get forecast: {e}")
        raise HTTPException(status_code=500, detail="Failed to get forecast.")
