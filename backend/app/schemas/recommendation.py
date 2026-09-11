from typing import List, Optional
from pydantic import BaseModel
from app.schemas.place import PlaceResponse


class RecommendationRequest(BaseModel):
    user_tags: Optional[List[str]] = None
    query_text: Optional[str] = None
    max_budget: Optional[float] = None
    city: Optional[str] = None
    top_k: int = 5


class RecommendedPlaceItem(BaseModel):
    place: PlaceResponse
    similarity_score: float
    match_percentage: float
    estimated_cost: float
    matched_tags: List[str]
    match_reason: str
    budget_passed: bool


class RecommendationResponse(BaseModel):
    query_tags: List[str]
    max_budget: Optional[float] = None
    total_matches: int
    recommendations: List[RecommendedPlaceItem]
