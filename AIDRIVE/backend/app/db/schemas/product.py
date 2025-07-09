from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    name: str
    barcode: str
    category: Optional[str] = None
    min_stock: Optional[int] = 0
    max_stock: Optional[int] = 100

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True
