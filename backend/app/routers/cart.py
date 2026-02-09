from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.cart import Cart, CartItem
from app.models.user import User
from app.models.product import Product
from app.schemas.cart import Cart as CartSchema, CartItemCreate, CartItemUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])

def get_cart_total(cart: Cart):
    total = 0.0
    for item in cart.items:
        total += item.product.price * item.quantity
    return total

@router.get("/", response_model=CartSchema)
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    # Calculate total dynamically for the response
    cart.total_price = get_cart_total(cart)
    return cart

@router.post("/items", response_model=CartSchema)
def add_to_cart(
    item_in: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    # Check if product exists
    product = db.query(Product).filter(Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already in cart
    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item_in.product_id
    ).first()

    if cart_item:
        cart_item.quantity += item_in.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=item_in.product_id,
            quantity=item_in.quantity
        )
        db.add(cart_item)
    
    db.commit()
    db.refresh(cart)
    cart.total_price = get_cart_total(cart)
    return cart

@router.put("/items/{item_id}", response_model=CartSchema)
def update_cart_item(
    item_id: int,
    item_in: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    if item_in.quantity <= 0:
        db.delete(cart_item)
    else:
        cart_item.quantity = item_in.quantity
    
    db.commit()
    db.refresh(cart)
    cart.total_price = get_cart_total(cart)
    return cart

@router.delete("/items/{item_id}", response_model=CartSchema)
def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    cart_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    db.delete(cart_item)
    db.commit()
    db.refresh(cart)
    cart.total_price = get_cart_total(cart)
    return cart

@router.delete("/", response_model=CartSchema)
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        return CartSchema(id=0, user_id=current_user.id, items=[], total_price=0)

    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(cart)
    cart.total_price = 0.0
    return cart
