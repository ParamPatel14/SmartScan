from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.product import Product
from app.schemas.store_product import Product as ProductSchema

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[ProductSchema])
def get_products(
    store_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Product)
    if store_id:
        query = query.filter(Product.store_id == store_id)
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/search", response_model=List[ProductSchema])
def search_products(
    q: str = Query(..., min_length=1),
    store_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.name.ilike(f"%{q}%"))
    if store_id:
        query = query.filter(Product.store_id == store_id)
    return query.all()

@router.get("/barcode/{barcode}", response_model=ProductSchema)
def get_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.barcode == barcode).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{product_id}", response_model=ProductSchema)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
