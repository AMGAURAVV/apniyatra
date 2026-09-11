import os
import sys

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

# Create an in-memory SQLite engine for comprehensive endpoint testing
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

Base.metadata.create_all(bind=test_engine)

# Override get_db dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_api_suite():
    print("=== Testing FastAPI Endpoints ===")

    # 0. Seed test database
    db = TestingSessionLocal()
    seed_database(db=db)
    db.close()
    print("Seed database: OK")

    # 1. Test Auth: Register
    reg_payload = {
        "email": "traveler@apniyatra.in",
        "full_name": "Aarav Sharma",
        "password": "Password123!",
        "phone": "+91 9988776655",
        "role": "traveler",
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201, f"Register failed: {reg_res.text}"
    token_data = reg_res.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    assert token_data["user"]["email"] == reg_payload["email"]
    auth_token = token_data["access_token"]
    print("POST /api/v1/auth/register: OK (Status 201)")

    # 2. Test Auth: Login
    login_payload = {
        "email": "traveler@apniyatra.in",
        "password": "Password123!",
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    assert "access_token" in login_res.json()
    print("POST /api/v1/auth/login: OK (Status 200)")

    # 3. Test Auth: Me
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert me_res.status_code == 200, f"Me endpoint failed: {me_res.text}"
    assert me_res.json()["email"] == reg_payload["email"]
    print("GET /api/v1/auth/me: OK (Status 200)")

    # 4. Test Places Listing
    places_res = client.get("/api/v1/places/")
    assert places_res.status_code == 200
    places = places_res.json()
    assert len(places) > 0, "Places listing should return seeded places"
    sample_place = places[0]
    assert "latitude" in sample_place
    assert "longitude" in sample_place
    assert "folklore_story" in sample_place
    print(f"GET /api/v1/places/: OK (Returned {len(places)} places)")

    # 5. Test Places Folklore Feed
    folklore_res = client.get("/api/v1/places/folklore/feed")
    assert folklore_res.status_code == 200
    folklore_items = folklore_res.json()
    assert len(folklore_items) > 0
    assert all(p["folklore_story"] for p in folklore_items)
    print(f"GET /api/v1/places/folklore/feed: OK (Returned {len(folklore_items)} folklore stories)")

    # 6. Test Places ML Recommendations
    rec_payload = {
        "user_tags": ["Stepwell", "Heritage", "Hidden Gem"],
        "city": "Jaipur",
        "max_budget": 100.0,
        "top_k": 3,
    }
    rec_res = client.post("/api/v1/places/recommend", json=rec_payload)
    assert rec_res.status_code == 200, f"Recommendation failed: {rec_res.text}"
    rec_data = rec_res.json()
    assert rec_data["total_matches"] > 0
    print(f"POST /api/v1/places/recommend: OK (Matched {rec_data['total_matches']} places)")
    top_item = rec_data["recommendations"][0]
    print(f"   Top Match: {top_item['place']['name']} ({top_item['match_percentage']}%)")
    print(f"   Reason: {top_item['match_reason']}")

    # 7. Test Bookings: Create
    services_res = client.get("/api/v1/services/")
    assert services_res.status_code == 200
    services = services_res.json()
    first_service_id = services[0]["id"] if services else None

    booking_payload = {
        "user_id": me_res.json()["id"],
        "service_id": first_service_id,
        "place_id": sample_place["id"],
        "booking_date": "2026-03-12T10:00:00Z",
        "travel_date": "2026-03-20T09:00:00Z",
        "travelers_count": 2,
        "total_amount": 1600.0,
        "currency": "INR",
        "notes": "Testing automated booking endpoint",
    }
    create_bk_res = client.post(
        "/api/v1/bookings/",
        json=booking_payload,
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert create_bk_res.status_code == 201, f"Booking creation failed: {create_bk_res.text}"
    created_bk = create_bk_res.json()
    assert "booking_reference" in created_bk
    assert created_bk["booking_reference"].startswith("AY-2026-")
    booking_id = created_bk["id"]
    print(f"POST /api/v1/bookings/: OK (Created ref {created_bk['booking_reference']})")

    # 8. Test Bookings: List
    list_bk_res = client.get("/api/v1/bookings/")
    assert list_bk_res.status_code == 200
    assert len(list_bk_res.json()) > 0
    print("GET /api/v1/bookings/: OK")

    # 9. Test Bookings: Patch Status
    patch_res = client.patch(f"/api/v1/bookings/{booking_id}", json={"status": "completed"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "completed"
    print("PATCH /api/v1/bookings/{id}: OK (Updated status to completed)")

    # 10. Test Itineraries: Generate (Gemini API / Fallback)
    itin_payload = {
        "destination": "Jaipur",
        "days": 2,
        "budget": "Moderate",
        "interests": ["Heritage", "Stepwells", "Folklore"],
    }
    itin_res = client.post("/api/v1/itineraries/generate", json=itin_payload)
    assert itin_res.status_code == 200, f"Itinerary generation failed: {itin_res.text}"
    itin = itin_res.json()
    assert itin["destination"] == "Jaipur"
    assert len(itin["days"]) == 2
    print(f"POST /api/v1/itineraries/generate: OK (Title: '{itin['trip_title']}')")

    print("\nALL FASTAPI ENDPOINT TESTS PASSED WITH 100% SUCCESS!")


if __name__ == "__main__":
    test_api_suite()
