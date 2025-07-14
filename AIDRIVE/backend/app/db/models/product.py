from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    barcode = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), nullable=True)
    min_stock = Column(Integer, default=0)
    max_stock = Column(Integer, default=100)
