from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, favorites, properties


app = FastAPI(
    title="Hash4 API",
    description="Backend API for the Hash4 real estate platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads",
)

app.include_router(properties.router)
app.include_router(auth.router)
app.include_router(favorites.router)

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