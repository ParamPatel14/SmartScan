from pydantic import BaseModel
from typing import List, Optional
from app.schemas.store_product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: int
    cart_id: int
    product: Product

    class Config:
        from_attributes = True

class CartBase(BaseModel):
    pass

class Cart(CartBase):
    id: int
    user_id: int
    items: List[CartItem] = []
    total_price: float = 0.0

    class Config:
        from_attributes = True
