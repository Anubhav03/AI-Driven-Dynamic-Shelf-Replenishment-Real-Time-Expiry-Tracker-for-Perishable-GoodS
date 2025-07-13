from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from app.db.schemas.expiry import Expiry, ExpiryCreate
from app.db.models.expiry import Expiry as ExpiryModel
from app.db.models.product import Product as ProductModel
from app.dependencies import get_db
from app.services.ocr_engine import extract_expiry_from_image
from app.core.logger import logger
import shutil
import os
from datetime import datetime

router = APIRouter()

@router.post("/manual", response_model=Expiry, status_code=status.HTTP_201_CREATED)
def add_expiry_manual(expiry: ExpiryCreate, db: Session = Depends(get_db)):
    # Check product exists
    if not db.query(ProductModel).filter(ProductModel.id == expiry.product_id).first():
        logger.error(f"Product not found for expiry: {expiry.product_id}")
        raise HTTPException(status_code=404, detail="Product not found")
    # Validate expiry_date
    if expiry.expiry_date < datetime.now().date():
        logger.warning(f"Attempt to add past expiry date: {expiry.expiry_date}")
        raise HTTPException(status_code=400, detail="Expiry date cannot be in the past.")
    db_expiry = ExpiryModel(**expiry.dict())
    db.add(db_expiry)
    db.commit()
    db.refresh(db_expiry)
    return db_expiry

@router.post("/scan", response_model=Expiry, status_code=status.HTTP_201_CREATED)
def scan_expiry(product_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Check product exists
    if not db.query(ProductModel).filter(ProductModel.id == product_id).first():
        logger.error(f"Product not found for expiry scan: {product_id}")
        raise HTTPException(status_code=404, detail="Product not found")
    # Save uploaded file
    upload_dir = "images/expiry_samples/"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename or "unknown.jpg")
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        expiry_date = extract_expiry_from_image(file_path)
        if not expiry_date:
            logger.warning(f"OCR failed to extract expiry date from {file.filename}")
            raise HTTPException(status_code=422, detail="Could not extract expiry date from image.")
        db_expiry = ExpiryModel(product_id=product_id, expiry_date=expiry_date, image_path=file_path, detected_text=None)
        db.add(db_expiry)
        db.commit()
        db.refresh(db_expiry)
        return db_expiry
    except Exception as e:
        logger.error(f"OCR scan failed: {e}")
        raise HTTPException(status_code=422, detail="OCR scan failed. Please upload a valid image.")

@router.get("/", response_model=List[Expiry])
def list_expiry(db: Session = Depends(get_db)):
    return db.query(ExpiryModel).all()
