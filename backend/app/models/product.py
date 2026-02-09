from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    price = Column(Float)
    barcode = Column(String, index=True)
    image_url = Column(String, nullable=True)
    store_id = Column(Integer, ForeignKey("stores.id"))

    store = relationship("Store", back_populates="products")
