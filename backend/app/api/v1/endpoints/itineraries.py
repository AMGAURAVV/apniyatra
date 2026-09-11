from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.place import Place
from app.schemas.itinerary import ItineraryRequest, ItineraryResponse
from app.services.itinerary_generator import generate_gemini_itinerary

router = APIRouter(prefix="/itineraries", tags=["AI Itinerary Generator"])


@router.post("/generate", response_model=ItineraryResponse)
def create_structured_itinerary(
    req: ItineraryRequest,
    db: Session = Depends(get_db),
):
    """
    Generates a structured day-by-day travel itinerary in JSON mode using Google's Gemini API,
    grounded in verified ApniYatra places, oral folklore legends, and exact GPS coordinates.
    """
    # Fetch available places in the destination to provide local context to Gemini
    available_places = (
        db.query(Place)
        .filter(Place.city.ilike(f"%{req.destination}%"))
        .all()
    )
    if not available_places:
        available_places = db.query(Place).limit(8).all()

    itinerary_dict = generate_gemini_itinerary(
        destination=req.destination,
        days=req.days,
        budget=req.budget,
        interests=req.interests or ["Heritage", "Folklore", "Hidden Gems"],
        available_places=available_places,
    )

    return itinerary_dict
