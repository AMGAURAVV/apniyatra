import os
import sys
import json

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db
from app.models.base import Base
from app.api.v1.endpoints.seed import seed_database

# In-memory SQLite engine
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
Base.metadata.create_all(bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# Seed
db = TestingSessionLocal()
seed_database(db)
db.close()

def test_endpoint_responses():
    """Verify each FastAPI endpoint responds with 200 OK and valid JSON format."""
    endpoints_to_test = [
        ("GET", "/", None, 200),
        ("GET", "/health", None, 200),
        ("GET", "/api/v1/places/", None, 200),
        ("GET", "/api/v1/places/folklore/feed", None, 200),
        ("GET", "/api/v1/services/", None, 200),
        ("GET", "/api/v1/passports/1", None, 200),
        ("GET", "/api/v1/bookings/", None, 200),
        (
            "POST",
            "/api/v1/places/recommend",
            {
                "user_tags": ["Stepwell", "Heritage"],
                "city": "Jaipur",
                "max_budget": 500.0,
                "top_k": 3,
            },
            200,
        ),
        (
            "POST",
            "/api/v1/itineraries/generate",
            {
                "destination": "Jaipur",
                "days": 2,
                "budget": "Moderate",
                "interests": ["Heritage", "Stepwells"],
            },
            200,
        ),
    ]

    print("\n" + "=" * 60)
    print("FASTAPI LIVE ENDPOINTS & JSON VALIDATION REPORT")
    print("=" * 60)

    for method, path, payload, expected_status in endpoints_to_test:
        if method == "GET":
            response = client.get(path)
        else:
            response = client.post(path, json=payload)

        # 1. Assert status code is 200 OK
        assert response.status_code == expected_status, (
            f"Expected {expected_status} for {method} {path}, got {response.status_code}: {response.text}"
        )

        # 2. Assert response header has application/json
        content_type = response.headers.get("content-type", "")
        assert "application/json" in content_type, f"Content-Type not JSON for {path}: {content_type}"

        # 3. Assert body parses as valid JSON
        data = response.json()
        assert data is not None, f"Response JSON data was None for {path}"

        # Summary line
        sample = json.dumps(data)
        if len(sample) > 80:
            sample = sample[:77] + "..."
        print(f"[PASSED] {method:4} {path:30} -> HTTP {response.status_code} OK | JSON: {sample}")

    print("=" * 60)
    print("ALL FASTAPI ENDPOINTS RETURNED 200 OK AND VALID JSON!\n")


if __name__ == "__main__":
    test_endpoint_responses()
