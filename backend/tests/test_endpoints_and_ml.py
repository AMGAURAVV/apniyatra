import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.place import Place
from app.ml.recommender import ContentRecommender
from app.services.itinerary_generator import generate_gemini_itinerary
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token


def test_recommender():
    print("--- Testing ContentRecommender (Scikit-Learn TF-IDF + Cosine Similarity) ---")
    recommender = ContentRecommender()

    # Mock place entities
    p1 = Place(
        id=1,
        name="Panna Meena ka Kund",
        slug="panna-meena-ka-kund",
        city="Jaipur",
        state="Rajasthan",
        category="Hidden Stepwell",
        description="A symmetrical 16th-century stepwell near Amer with interlocking diamond staircases.",
        folklore_story="Ancient labyrinth steps designed to disorient invaders.",
        latitude=26.9854,
        longitude=75.8330,
        entry_fee="Free",
        is_hidden_gem=True,
        tags=["Stepwell", "Heritage", "Hidden Gem"],
    )

    p2 = Place(
        id=2,
        name="Amber Fort",
        slug="amber-fort",
        city="Jaipur",
        state="Rajasthan",
        category="Fort",
        description="Majestic Rajput hill fort with Sheesh Mahal mirror palace.",
        folklore_story="Royal architects illuminated the hall with concave convex mirrors and starlight.",
        latitude=26.9855,
        longitude=75.8513,
        entry_fee="₹100",
        is_hidden_gem=False,
        tags=["Fort", "Heritage", "Royal"],
    )

    p3 = Place(
        id=3,
        name="Sanapur Lake Coracle Ride",
        slug="sanapur-lake",
        city="Hampi",
        state="Karnataka",
        category="Hidden Lake",
        description="Boulder-ringed lake and coracle rides on the Tungabhadra basin.",
        folklore_story="Mythical monkey kingdom boulders of Kishkindha.",
        latitude=15.3550,
        longitude=76.4970,
        entry_fee="₹200",
        is_hidden_gem=True,
        tags=["Nature", "Adventure", "Lake"],
    )

    recommender.fit([p1, p2, p3])

    # Test recommendation for stepwell & heritage with budget
    recs = recommender.recommend(
        user_tags=["Stepwell", "Heritage"],
        max_budget=50.0,
        top_k=3,
    )

    assert len(recs) > 0, "Recommender should return results"
    top_rec = recs[0]
    print(f"Top Recommended: {top_rec['place'].name}")
    print(f"Match percentage: {top_rec['match_percentage']}%")
    print(f"Match reason: {top_rec['match_reason']}")
    print(f"Budget passed: {top_rec['budget_passed']}")

    assert top_rec["place"].name == "Panna Meena ka Kund", "Panna Meena Kund should rank highest for Stepwell + Heritage + Budget"
    print("Recommender test PASSED!")


def test_security():
    print("\n--- Testing Security (bcrypt & JWT) ---")
    plain = "Secr3tTraveler2026!"
    hashed = get_password_hash(plain)
    assert verify_password(plain, hashed), "Password verification should succeed"
    assert not verify_password("wrongpass", hashed), "Wrong password should fail"

    token = create_access_token(subject=42)
    payload = decode_token(token)
    assert payload is not None, "Token decoding should succeed"
    assert payload["sub"] == "42", "Subject should match user ID"
    print("Security test PASSED!")


def test_itinerary_generator():
    print("\n--- Testing Gemini Structured Itinerary Generator ---")
    p1 = Place(
        id=1,
        name="Panna Meena ka Kund",
        slug="panna-meena-ka-kund",
        city="Jaipur",
        state="Rajasthan",
        category="Hidden Stepwell",
        description="Symmetrical stepwell with interlocking steps.",
        folklore_story="Ancient labyrinth steps designed to disorient invaders.",
        latitude=26.9854,
        longitude=75.8330,
        entry_fee="Free",
        is_hidden_gem=True,
        tags=["Stepwell", "Heritage"],
    )

    itinerary = generate_gemini_itinerary(
        destination="Jaipur",
        days=2,
        budget="Budget",
        interests=["Heritage", "Stepwells"],
        available_places=[p1],
    )

    assert "destination" in itinerary, "Itinerary must contain destination"
    assert "days" in itinerary, "Itinerary must contain days array"
    assert len(itinerary["days"]) == 2, "Itinerary should have 2 days"
    for day in itinerary["days"]:
        assert "day_number" in day
        assert "schedule" in day
        for act in day["schedule"]:
            assert "folklore_highlight" in act
            assert "latitude" in act
            assert "longitude" in act

    print(f"Generated Itinerary Title: {itinerary.get('trip_title')}")
    print(f"Total Estimated Cost: INR {itinerary.get('estimated_total_cost_inr')}")
    print("Itinerary generator test PASSED!")


if __name__ == "__main__":
    test_recommender()
    test_security()
    test_itinerary_generator()
    print("\nALL BACKEND ML & AUTH TESTS PASSED SUCCESSFULLY!")
