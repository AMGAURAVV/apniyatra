from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from fastapi.responses import JSONResponse
from fastapi import status
from app.core.database import engine, check_db_connection
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
    db_status = check_db_connection()
    return {
        "status": "healthy" if db_status["connected"] else "degraded",
        "environment": settings.ENVIRONMENT,
        "database": {
            "connected": db_status["connected"],
            "dialect": db_status["dialect"],
            "latency_ms": db_status["latency_ms"],
            "error": db_status["error"] if not db_status["connected"] else None,
        },
    }


@app.get("/health/db", tags=["Health"])
def database_health_check():
    db_status = check_db_connection()
    if not db_status["connected"]:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "disconnected",
                "dialect": db_status["dialect"],
                "latency_ms": db_status["latency_ms"],
                "error": db_status["error"],
            },
        )
    return {
        "status": "connected",
        "dialect": db_status["dialect"],
        "latency_ms": db_status["latency_ms"],
    }


# Mount API V1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)
