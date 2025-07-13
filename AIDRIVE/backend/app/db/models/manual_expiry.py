from sqlalchemy import Column, Integer, Date, DateTime, ForeignKey
from app.db.base import Base
from datetime import datetime

class ManualExpiry(Base):
    __tablename__ = "manual_expiry"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    expiry_date = Column(Date, nullable=False)
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow) 