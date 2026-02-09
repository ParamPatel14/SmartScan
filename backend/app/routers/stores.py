from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.store import Store
from app.schemas.store_product import Store as StoreSchema

router = APIRouter(prefix="/stores", tags=["stores"])

@router.get("/", response_model=List[StoreSchema])
def get_stores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stores = db.query(Store).offset(skip).limit(limit).all()
    return stores

@router.get("/{store_id}", response_model=StoreSchema)
def get_store(store_id: int, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()
    if store is None:
        raise HTTPException(status_code=404, detail="Store not found")
    return store
