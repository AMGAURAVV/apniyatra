import os
import sys
import pytest
from unittest.mock import patch, MagicMock

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import Settings
from app.core.database import create_db_engine, check_db_connection
from fastapi.testclient import TestClient
from app.main import app


def test_database_url_normalization():
    """Verify postgres:// is automatically normalized to postgresql://."""
    s1 = Settings(DATABASE_URL="postgres://user:secret123@db.example.com:5432/mydb")
    assert s1.DATABASE_URL == "postgresql://user:secret123@db.example.com:5432/mydb"

    s2 = Settings(DATABASE_URL="postgresql://user:secret123@db.example.com:5432/mydb")
    assert s2.DATABASE_URL == "postgresql://user:secret123@db.example.com:5432/mydb"

    s3 = Settings(DATABASE_URL="")
    assert s3.DATABASE_URL == "postgresql://postgres:postgres@localhost:5432/apniyatra_db"


def test_engine_creation_dialects():
    """Verify engine creation correctly configures SQLite and PostgreSQL."""
    # SQLite
    sqlite_engine = create_db_engine("sqlite:///:memory:")
    assert sqlite_engine.dialect.name == "sqlite"

    # PostgreSQL
    pg_engine = create_db_engine("postgresql://user:pass@localhost:5432/testdb")
    assert pg_engine.dialect.name == "postgresql"
    assert pg_engine.pool.size() == 10


def test_check_db_connection_success():
    """Verify check_db_connection returns connected=True for a working engine."""
    with patch("app.core.database.engine", create_db_engine("sqlite:///:memory:")):
        res = check_db_connection()
        assert res["connected"] is True
        assert res["dialect"] == "sqlite"
        assert res["error"] is None
        assert res["latency_ms"] >= 0


def test_check_db_connection_credential_redaction():
    """Verify that credentials and passwords are redacted from database error messages."""
    fake_url = "postgresql://secret_user:super_secret_password@127.0.0.1:5433/fakename"
    failing_engine = create_db_engine(fake_url)
    with patch("app.core.database.engine", failing_engine):
        res = check_db_connection()
        assert res["connected"] is False
        assert "super_secret_password" not in str(res["error"])


def test_health_endpoints():
    """Verify health endpoints execute and return valid json without crashing."""
    client = TestClient(app)

    # /health should always return 200 with status info
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert "database" in data
    assert "environment" in data
