from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.models.store import Store
from app.models.product import Product

def seed_data():
    db = SessionLocal()
    
    # Check if data already exists
    if db.query(Store).first():
        print("Data already exists. Skipping seed.")
        db.close()
        return

    # Create Stores
    store1 = Store(name="SuperMart Downtown", location="123 Main St, City Center", image_url="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=1000")
    store2 = Store(name="FreshGrocer West", location="456 West Ave, Suburbia", image_url="https://images.unsplash.com/photo-1604719312566-b7cb0463d344?auto=format&fit=crop&q=80&w=1000")
    store3 = Store(name="TechZone Electronics", location="789 Tech Park, Innovation District", image_url="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1000")
    store4 = Store(name="Fashion Hub", location="101 Mall Rd, Shopping District", image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000")

    db.add_all([store1, store2, store3, store4])
    db.commit()
    db.refresh(store1)
    db.refresh(store2)
    db.refresh(store3)
    db.refresh(store4)

    # Create Products for SuperMart
    products1 = [
        Product(name="Organic Bananas", description="Fresh organic bananas from Ecuador", price=1.99, barcode="94011", image_url="https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=500", store_id=store1.id),
        Product(name="Whole Milk", description="1 Gallon Whole Milk", price=3.49, barcode="012345678905", image_url="https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=500", store_id=store1.id),
        Product(name="Sourdough Bread", description="Freshly baked sourdough bread", price=4.99, barcode="012345678906", image_url="https://images.unsplash.com/photo-1585476644321-b9a3d780b0c5?auto=format&fit=crop&q=80&w=500", store_id=store1.id),
        Product(name="Eggs (Dozen)", description="Large Grade A Eggs", price=5.29, barcode="012345678907", image_url="https://images.unsplash.com/photo-1582722878654-02fd23747037?auto=format&fit=crop&q=80&w=500", store_id=store1.id),
    ]

    # Create Products for FreshGrocer
    products2 = [
        Product(name="Avocados", description="Ripe Hass Avocados", price=1.50, barcode="012345678908", image_url="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=500", store_id=store2.id),
        Product(name="Orange Juice", description="100% Pure Orange Juice, No Pulp", price=4.49, barcode="012345678909", image_url="https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=500", store_id=store2.id),
        Product(name="Chicken Breast", description="Boneless Skinless Chicken Breast (per lb)", price=5.99, barcode="012345678910", image_url="https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=500", store_id=store2.id),
    ]

    # Create Products for TechZone
    products3 = [
        Product(name="USB-C Cable", description="2m Fast Charging USB-C Cable", price=12.99, barcode="012345678911", image_url="https://images.unsplash.com/photo-1618424181497-157f2c3de09e?auto=format&fit=crop&q=80&w=500", store_id=store3.id),
        Product(name="Wireless Mouse", description="Ergonomic Wireless Optical Mouse", price=24.99, barcode="012345678912", image_url="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=500", store_id=store3.id),
    ]

    # Create Products for Fashion Hub
    products4 = [
        Product(name="Cotton T-Shirt", description="100% Cotton Crew Neck T-Shirt", price=19.99, barcode="012345678913", image_url="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=500", store_id=store4.id),
        Product(name="Denim Jeans", description="Classic Fit Blue Jeans", price=49.99, barcode="012345678914", image_url="https://images.unsplash.com/photo-1542272617-08f08630329f?auto=format&fit=crop&q=80&w=500", store_id=store4.id),
    ]

    db.add_all(products1 + products2 + products3 + products4)
    db.commit()
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
