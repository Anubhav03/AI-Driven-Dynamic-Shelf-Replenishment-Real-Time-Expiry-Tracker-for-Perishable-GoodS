from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class OCRExpiryBase(BaseModel):
    product_id: int
    expiry_date: date
    detected_text: Optional[str] = None
    image_path: Optional[str] = None
    quantity: Optional[int] = 1

class OCRExpiryCreate(OCRExpiryBase):
    pass

class OCRExpiryUpdate(BaseModel):
    product_id: Optional[int] = None
    expiry_date: Optional[date] = None
    detected_text: Optional[str] = None
    image_path: Optional[str] = None
    quantity: Optional[int] = None

class OCRExpiry(OCRExpiryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True 