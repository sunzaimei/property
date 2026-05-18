from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import property, health
from app.services.seed_loader import SeedLoader


app = FastAPI(title="LandedIQ API", version="0.1.0", description="Singapore landed property due diligence platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    SeedLoader.load()


app.include_router(property.router, prefix="/api/property", tags=["property"])
app.include_router(health.router, tags=["health"])
