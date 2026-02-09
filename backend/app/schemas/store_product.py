from pydantic import BaseModel
from typing import List, Optional

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    barcode: str
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    store_id: int

class Product(ProductBase):
    id: int
    store_id: int

    class Config:
        from_attributes = True

class StoreBase(BaseModel):
    name: str
    location: str
    image_url: Optional[str] = None

class StoreCreate(StoreBase):
    pass

class Store(StoreBase):
    id: int
    products: List[Product] = []

    class Config:
        from_attributes = True
