import time
import re
from typing import Generator, Dict, Any
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings


def create_db_engine(database_url: str) -> Engine:
    """Create a SQLAlchemy engine with parameters tailored to dialect and production requirements."""
    if database_url.startswith("sqlite"):
        return create_engine(
            database_url,
            connect_args={"check_same_thread": False},
            pool_pre_ping=True,
        )

    # PostgreSQL / Managed cloud DB (Neon, Supabase, Render, AWS RDS)
    return create_engine(
        database_url,
        pool_pre_ping=True,       # Detect disconnects before using connection
        pool_size=10,              # Base connections
        max_overflow=20,           # Burst connections
        pool_recycle=1800,         # Recycle connections older than 30 mins to avoid firewall drops
        pool_timeout=30,           # Max wait time for pool connection
        connect_args={"connect_timeout": 10},  # TCP connection timeout in seconds
    )


# Primary application engine
engine: Engine = create_db_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a SQLAlchemy database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> Dict[str, Any]:
    """Safely test live database connectivity using a fast query.
    
    Guarantees that database passwords or credentials are never leaked in error output.
    """
    start_time = time.time()
    try:
        with engine.connect() as conn:
            val = conn.execute(text("SELECT 1")).scalar()
            latency_ms = round((time.time() - start_time) * 1000, 2)
            return {
                "connected": val == 1,
                "dialect": engine.dialect.name,
                "latency_ms": latency_ms,
                "error": None,
            }
    except Exception as e:
        latency_ms = round((time.time() - start_time) * 1000, 2)
        # Redact any passwords or credentials that might appear in driver error messages
        raw_msg = str(e)
        sanitized_msg = re.sub(r"://([^:]+):([^@]+)@", r"://\1:***@", raw_msg)
        if "password" in sanitized_msg.lower():
            sanitized_msg = "Database authentication failed (invalid credentials or network failure)"
        elif "connection refused" in sanitized_msg.lower():
            sanitized_msg = "Connection refused: database server is unreachable at target host and port"

        dialect_name = getattr(engine.dialect, "name", "unknown") if hasattr(engine, "dialect") else "unknown"
        return {
            "connected": False,
            "dialect": dialect_name,
            "latency_ms": latency_ms,
            "error": sanitized_msg,
        }
