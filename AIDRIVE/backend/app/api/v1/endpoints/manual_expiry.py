from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db
from app.db.models.manual_expiry import ManualExpiry
from app.db.models.product import Product
from app.db.schemas.manual_expiry import ManualExpiryCreate, ManualExpiryUpdate, ManualExpiry
from app.core.logger import logger

router = APIRouter()

@router.post("/", response_model=ManualExpiry, status_code=status.HTTP_201_CREATED)
def create_manual_expiry(expiry: ManualExpiryCreate, db: Session = Depends(get_db)):
    """Create a new manual expiry entry"""
    try:
        # Check if product exists
        product = db.query(Product).filter(Product.id == expiry.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        
        db_expiry = ManualExpiry(**expiry.dict())
        db.add(db_expiry)
        db.commit()
        db.refresh(db_expiry)
        return db_expiry
    except Exception as e:
        logger.error(f"Failed to create manual expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to create manual expiry")

@router.get("/", response_model=List[ManualExpiry])
def get_manual_expiries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all manual expiry entries"""
    try:
        expiries = db.query(ManualExpiry).offset(skip).limit(limit).all()
        return expiries
    except Exception as e:
        logger.error(f"Failed to get manual expiries: {e}")
        raise HTTPException(status_code=500, detail="Failed to get manual expiries")

@router.get("/{expiry_id}", response_model=ManualExpiry)
def get_manual_expiry(expiry_id: int, db: Session = Depends(get_db)):
    """Get a specific manual expiry entry"""
    try:
        expiry = db.query(ManualExpiry).filter(ManualExpiry.id == expiry_id).first()
        if not expiry:
            raise HTTPException(status_code=404, detail="Manual expiry not found")
        return expiry
    except Exception as e:
        logger.error(f"Failed to get manual expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to get manual expiry")

@router.put("/{expiry_id}", response_model=ManualExpiry)
def update_manual_expiry(expiry_id: int, expiry: ManualExpiryUpdate, db: Session = Depends(get_db)):
    """Update a manual expiry entry"""
    try:
        db_expiry = db.query(ManualExpiry).filter(ManualExpiry.id == expiry_id).first()
        if not db_expiry:
            raise HTTPException(status_code=404, detail="Manual expiry not found")
        
        update_data = expiry.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_expiry, field, value)
        
        db.commit()
        db.refresh(db_expiry)
        return db_expiry
    except Exception as e:
        logger.error(f"Failed to update manual expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to update manual expiry")

@router.delete("/{expiry_id}", status_code=status.HTTP_200_OK)
def delete_manual_expiry(expiry_id: int, db: Session = Depends(get_db)):
    """Delete a manual expiry entry"""
    try:
        expiry = db.query(ManualExpiry).filter(ManualExpiry.id == expiry_id).first()
        if not expiry:
            raise HTTPException(status_code=404, detail="Manual expiry not found")
        
        db.delete(expiry)
        db.commit()
        return {"message": "Manual expiry deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete manual expiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete manual expiry") 