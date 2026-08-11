from fastapi import FastAPI

from app.routers import auth, properties


app = FastAPI(
    title="Hash4 API",
    description="Backend API for the Hash4 real estate platform",
    version="1.0.0",
)


app.include_router(properties.router)
app.include_router(auth.router)


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