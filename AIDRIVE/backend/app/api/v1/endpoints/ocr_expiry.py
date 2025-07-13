from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.db.models.ocr_expiry import OCRExpiry
from app.db.models.product import Product
from app.db.schemas.ocr_expiry import OCRExpiryCreate, OCRExpiryUpdate, OCRExpiry
from app.core.logger import logger
import os
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=OCRExpiry, status_code=status.HTTP_201_CREATED)
def create_ocr_expiry(expiry: OCRExpiryCreate, db: Session = Depends(get_db)):
    """Create a new OCR expiry entry"""
    try:
        # Check if product exists
        product = db.query(Product).filter(Product.id == expiry.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        db_expiry = OCRExpiry(**expiry.dict())
        db.add(db_expiry)
        db.commit()
        db.refresh(db_expiry)
        return db_expiry
    except Exception as e:
        logger.error(f"Failed to create OCR expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to create OCR expiry")

@router.post("/upload", response_model=OCRExpiry, status_code=status.HTTP_201_CREATED)
async def upload_ocr_expiry(
    product_id: int,
    expiry_date: str,
    detected_text: str = None,
    quantity: int = 1,
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Upload OCR expiry entry with optional image file"""
    try:
        # Check if product exists
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Save image if provided
        image_path = None
        if file:
            # Create uploads directory if it doesn't exist
            upload_dir = "uploads/ocr_images"
            os.makedirs(upload_dir, exist_ok=True)
            
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"ocr_{product_id}_{timestamp}_{file.filename}"
            image_path = f"{upload_dir}/{filename}"
            
            # Save file
            with open(image_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
        
        # Create OCR expiry entry
        db_expiry = OCRExpiry(
            product_id=product_id,
            expiry_date=expiry_date,
            detected_text=detected_text,
            image_path=image_path,
            quantity=quantity
        )
        db.add(db_expiry)
        db.commit()
        db.refresh(db_expiry)
        return db_expiry
    except Exception as e:
        logger.error(f"Failed to upload OCR expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload OCR expiry")

@router.get("/", response_model=List[OCRExpiry])
def get_ocr_expiries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all OCR expiry entries"""
    try:
        expiries = db.query(OCRExpiry).offset(skip).limit(limit).all()
        return expiries
    except Exception as e:
        logger.error(f"Failed to get OCR expiries: {e}")
        raise HTTPException(status_code=500, detail="Failed to get OCR expiries")

@router.get("/{expiry_id}", response_model=OCRExpiry)
def get_ocr_expiry(expiry_id: int, db: Session = Depends(get_db)):
    """Get a specific OCR expiry entry"""
    try:
        expiry = db.query(OCRExpiry).filter(OCRExpiry.id == expiry_id).first()
        if not expiry:
            raise HTTPException(status_code=404, detail="OCR expiry not found")
        return expiry
    except Exception as e:
        logger.error(f"Failed to get OCR expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to get OCR expiry")

@router.put("/{expiry_id}", response_model=OCRExpiry)
def update_ocr_expiry(expiry_id: int, expiry: OCRExpiryUpdate, db: Session = Depends(get_db)):
    """Update an OCR expiry entry"""
    try:
        db_expiry = db.query(OCRExpiry).filter(OCRExpiry.id == expiry_id).first()
        if not db_expiry:
            raise HTTPException(status_code=404, detail="OCR expiry not found")
        
        update_data = expiry.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_expiry, field, value)
        
        db.commit()
        db.refresh(db_expiry)
        return db_expiry
    except Exception as e:
        logger.error(f"Failed to update OCR expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to update OCR expiry")

@router.delete("/{expiry_id}", status_code=status.HTTP_200_OK)
def delete_ocr_expiry(expiry_id: int, db: Session = Depends(get_db)):
    """Delete an OCR expiry entry"""
    try:
        expiry = db.query(OCRExpiry).filter(OCRExpiry.id == expiry_id).first()
        if not expiry:
            raise HTTPException(status_code=404, detail="OCR expiry not found")
        
        # Delete associated image file if it exists
        if expiry.image_path and os.path.exists(expiry.image_path):
            os.remove(expiry.image_path)
        
        db.delete(expiry)
        db.commit()
        return {"message": "OCR expiry deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete OCR expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete OCR expiry") 