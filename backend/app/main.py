from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.config import ALLOWED_ORIGINS
from app.routes.weatherRoutes import router

app = FastAPI(
    title="Weather Explorer API",
    description="Fetch, store, and retrieve historical weather data via Open-Meteo and AWS S3",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


handler = Mangum(app)
