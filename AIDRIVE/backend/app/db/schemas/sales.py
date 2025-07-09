from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SalesBase(BaseModel):
    product_id: int
    timestamp: Optional[datetime] = None
    quantity_sold: int

class SalesCreate(SalesBase):
    pass

class Sales(SalesBase):
    id: int

    class Config:
        from_attributes = True 