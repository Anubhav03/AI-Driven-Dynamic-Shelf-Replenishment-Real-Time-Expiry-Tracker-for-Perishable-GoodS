from sqlalchemy import Column, Integer, DateTime, ForeignKey
from app.db.base import Base
from datetime import datetime

class Sales(Base):
    __tablename__ = "sales"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    quantity_sold = Column(Integer, default=0) 