from sqlalchemy import Column, Integer, Date, String, DateTime, ForeignKey
from app.db.base import Base
from datetime import datetime

class OCRExpiry(Base):
    __tablename__ = "ocr_expiry"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    expiry_date = Column(Date, nullable=False)
    detected_text = Column(String(1000), nullable=True)
    image_path = Column(String(500), nullable=True)
    quantity = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow) 