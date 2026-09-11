from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class ItineraryRequest(BaseModel):
    destination: str
    days: int = 3
    budget: str = "Moderate"
    interests: Optional[List[str]] = ["Heritage", "Folklore", "Architecture"]


class ItineraryActivity(BaseModel):
    time: str
    place_name: str
    activity_type: str
    folklore_highlight: str
    latitude: float
    longitude: float
    estimated_cost_inr: float
    insider_tip: str


class ItineraryDay(BaseModel):
    day_number: int
    theme: str
    schedule: List[ItineraryActivity]


class ItineraryResponse(BaseModel):
    destination: str
    trip_title: str
    duration_days: int
    budget_category: str
    estimated_total_cost_inr: float
    summary: str
    days: List[ItineraryDay]
