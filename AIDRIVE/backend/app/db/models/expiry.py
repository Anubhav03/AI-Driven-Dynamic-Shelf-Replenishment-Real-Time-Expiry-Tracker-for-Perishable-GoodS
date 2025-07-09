from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.db.base import Base

class Expiry(Base):
    __tablename__ = "expiry"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    expiry_date = Column(Date, nullable=False)
    image_path = Column(String, nullable=True)
    detected_text = Column(String, nullable=True)
