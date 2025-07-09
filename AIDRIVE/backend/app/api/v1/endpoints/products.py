from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.schemas.product import Product, ProductCreate, ProductUpdate
from app.db.models.product import Product as ProductModel
from app.dependencies import get_db
from app.core.logger import logger

router = APIRouter()

@router.get("/", response_model=List[Product])
def list_products(db: Session = Depends(get_db)):
    return db.query(ProductModel).all()

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    # Check for duplicate barcode
    if db.query(ProductModel).filter(ProductModel.barcode == product.barcode).first():
        logger.warning(f"Attempt to create duplicate barcode: {product.barcode}")
        raise HTTPException(status_code=409, detail="Product with this barcode already exists.")
    db_product = ProductModel(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        logger.error(f"Product not found: {product_id}")
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        logger.error(f"Product not found for update: {product_id}")
        raise HTTPException(status_code=404, detail="Product not found")
    # Check for duplicate barcode if changed
    if product.barcode and product.barcode != db_product.barcode:
        if db.query(ProductModel).filter(ProductModel.barcode == product.barcode).first():
            logger.warning(f"Attempt to update to duplicate barcode: {product.barcode}")
            raise HTTPException(status_code=409, detail="Product with this barcode already exists.")
    for key, value in product.dict(exclude_unset=True).items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        logger.error(f"Product not found for delete: {product_id}")
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return {"detail": "Deleted"}
