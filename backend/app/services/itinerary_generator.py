import json
import logging
import os
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.core.config import settings
from app.models.place import Place

logger = logging.getLogger(__name__)

# Pydantic Schemas for Structured JSON Output
class ActivityItem(BaseModel):
    time: str = Field(description="Time of activity (e.g. 09:00 AM)")
    place_name: str = Field(description="Name of monument, stepwell, or cultural spot")
    activity_type: str = Field(description="Type: Heritage Walk, Stepwell Exploration, Local Food, Craft Workshop")
    folklore_highlight: str = Field(description="Centuries-old oral folklore or legend tied to this spot")
    latitude: float = Field(description="GPS Latitude coordinate")
    longitude: float = Field(description="GPS Longitude coordinate")
    estimated_cost_inr: float = Field(description="Estimated ticket/food cost in Indian Rupees")
    insider_tip: str = Field(description="Local tip to avoid crowds or discover secret vantage points")


class DayPlan(BaseModel):
    day_number: int = Field(description="Day index starting at 1")
    theme: str = Field(description="Thematic focus for the day")
    schedule: List[ActivityItem] = Field(description="Ordered list of activities throughout the day")


class StructuredItinerary(BaseModel):
    destination: str
    trip_title: str
    duration_days: int
    budget_category: str
    estimated_total_cost_inr: float
    summary: str
    days: List[DayPlan]


def generate_fallback_itinerary(
    destination: str,
    days: int,
    budget: str,
    interests: List[str],
    available_places: List[Place]
) -> Dict[str, Any]:
    """
    Constructs an authentic domain-grounded itinerary if Gemini API is
    unavailable, offline, or lacks API credentials.
    """
    dest_places = [p for p in available_places if destination.lower() in p.city.lower()]
    if not dest_places:
        dest_places = available_places[:4]

    day_plans = []
    for day_idx in range(1, min(days + 1, 6)):
        activities = []
        p1 = dest_places[(day_idx * 2 - 2) % len(dest_places)] if dest_places else None
        p2 = dest_places[(day_idx * 2 - 1) % len(dest_places)] if dest_places else None

        if p1:
            activities.append({
                "time": "09:00 AM",
                "place_name": p1.name,
                "activity_type": p1.category,
                "folklore_highlight": p1.folklore_story or "Ancient legends tell of hidden passages beneath the sanctuary.",
                "latitude": p1.latitude,
                "longitude": p1.longitude,
                "estimated_cost_inr": 200.0,
                "insider_tip": "Arrive at sunrise for undisturbed photography and quiet contemplation."
            })
        if p2:
            activities.append({
                "time": "03:30 PM",
                "place_name": p2.name,
                "activity_type": p2.category,
                "folklore_highlight": p2.folklore_story or "Local artisans have handed down these oral techniques for generations.",
                "latitude": p2.latitude,
                "longitude": p2.longitude,
                "estimated_cost_inr": 150.0,
                "insider_tip": "Talk with senior temple guards or village potters to hear their personal lore."
            })

        day_plans.append({
            "day_number": day_idx,
            "theme": f"Day {day_idx}: {p1.category if p1 else 'Heritage'} & Local Stories",
            "schedule": activities
        })

    return {
        "destination": destination,
        "trip_title": f"The Cultural & Folklore Trail of {destination}",
        "duration_days": days,
        "budget_category": budget,
        "estimated_total_cost_inr": days * 1800.0,
        "summary": f"A curated {days}-day journey through {destination} uncovering forgotten stepwells, folklore legends, and living heritage.",
        "days": day_plans
    }


def generate_gemini_itinerary(
    destination: str,
    days: int,
    budget: str,
    interests: List[str],
    available_places: Optional[List[Place]] = None,
) -> Dict[str, Any]:
    """
    Calls Google's Gemini API with JSON mode and Pydantic schema enforcement to generate
    a structured day-by-day travel itinerary with heritage folklore and GPS coordinates.
    """
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")

    if not api_key:
        logger.info("GEMINI_API_KEY not set. Using domain-grounded fallback generator.")
        return generate_fallback_itinerary(
            destination=destination,
            days=days,
            budget=budget,
            interests=interests,
            available_places=available_places or []
        )

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        places_context = ""
        if available_places:
            places_context = "Ground the itinerary in these verified ApniYatra places:\n"
            for p in available_places[:10]:
                places_context += f"- {p.name} ({p.city}): lat {p.latitude}, lng {p.longitude}. Category: {p.category}. Folklore: {p.folklore_story}\n"

        prompt = f"""
You are the master local travel storyteller for 'ApniYatra', a local-first travel platform for India.
Create a rich {days}-day travel itinerary for {destination}.
Budget range: {budget}.
Traveler interests: {', '.join(interests) if interests else 'Heritage, Folklore, Hidden Gems'}.

{places_context}

CRITICAL REQUIREMENTS:
1. Every activity MUST feature authentic Indian oral folklore, myths, or historical legends passed down through centuries.
2. Include accurate real-world GPS coordinates (latitude, longitude) for each spot.
3. Keep timings realistic with time for local chai and interaction with artisans.
4. Output strict JSON matching the schema provided.
"""

        # Call Gemini API in JSON mode with structured schema
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=StructuredItinerary,
                temperature=0.7,
            ),
        )

        if response.text:
            parsed = json.loads(response.text)
            return parsed
        else:
            raise ValueError("Empty response from Gemini API")

    except Exception as e:
        logger.error(f"Error invoking Gemini API: {e}. Falling back to domain generator.")
        return generate_fallback_itinerary(
            destination=destination,
            days=days,
            budget=budget,
            interests=interests,
            available_places=available_places or []
        )
