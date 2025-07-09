from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StockBase(BaseModel):
    product_id: int
    current_stock: int
    shelf_sensor_value: float
    timestamp: Optional[datetime] = None

class StockCreate(StockBase):
    pass

class Stock(StockBase):
    id: int

    class Config:
        from_attributes = True 