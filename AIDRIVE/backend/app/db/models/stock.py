from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from app.db.base import Base
from datetime import datetime

class Stock(Base):
    __tablename__ = "stock"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    current_stock = Column(Integer, default=0)
    shelf_sensor_value = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow) 