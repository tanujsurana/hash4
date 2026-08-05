from fastapi import FastAPI

from app.database import Base, engine
from app.routes import properties

# Importing models registers them with Base.metadata.
from app import models  # noqa: F401


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Hash4 API",
    description="Backend API for the Hash4 real estate platform",
    version="1.0.0",
)


app.include_router(properties.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to Hash4 API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }