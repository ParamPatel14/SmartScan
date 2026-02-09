from fastapi import FastAPI
from sqlalchemy import text
from app.routers import health
from app.db.database import engine

app = FastAPI(title="My Backend API")

app.include_router(health.router)

@app.on_event("startup")
def startup_db_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("Database connection successful!")
    except Exception as e:
        print(f"Database connection failed: {e}")
