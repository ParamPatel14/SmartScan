from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.database import Base

class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    image_url = Column(String, nullable=True)

    products = relationship("Product", back_populates="store")
