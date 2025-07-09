from pydantic import BaseModel
from typing import Optional
from datetime import date

class ExpiryBase(BaseModel):
    product_id: int
    expiry_date: date
    image_path: Optional[str] = None
    detected_text: Optional[str] = None

class ExpiryCreate(ExpiryBase):
    pass

class Expiry(ExpiryBase):
    id: int

    class Config:
        from_attributes = True
