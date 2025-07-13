from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class ManualExpiryBase(BaseModel):
    product_id: int
    expiry_date: date
    quantity: Optional[int] = 1

class ManualExpiryCreate(ManualExpiryBase):
    pass

class ManualExpiryUpdate(BaseModel):
    product_id: Optional[int] = None
    expiry_date: Optional[date] = None
    quantity: Optional[int] = None

class ManualExpiry(ManualExpiryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 