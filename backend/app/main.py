from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.core.database import engine
from app.models import Base

# Create tables on startup if database is available
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Notice: Database connection deferred ({e}). Run migrations with 'alembic upgrade head'.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set up CORS
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to ApniYatra API — Your journey. Your India.",
        "docs": "/docs",
        "version": settings.VERSION,
        "api_v1": settings.API_V1_STR,
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
    }


# Mount API V1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)
