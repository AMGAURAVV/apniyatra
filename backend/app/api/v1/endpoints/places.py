from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.place import Place
from app.schemas.place import PlaceCreate, PlaceResponse, PlaceUpdate
from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
    RecommendedPlaceItem,
)
from app.ml.recommender import get_recommender

router = APIRouter(prefix="/places", tags=["Places"])


@router.get("/", response_model=List[PlaceResponse])
def list_places(
    city: Optional[str] = Query(None, description="Filter by city name (e.g. Jaipur)"),
    state: Optional[str] = Query(None, description="Filter by state (e.g. Rajasthan)"),
    category: Optional[str] = Query(None, description="Filter by category (e.g. Hidden Stepwell)"),
    is_hidden_gem: Optional[bool] = Query(None, description="Filter for hidden gems only"),
    q: Optional[str] = Query(None, description="Search term in name, description, or folklore"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Retrieve verified heritage places with GPS coordinates and oral folklore stories."""
    query = db.query(Place)

    if city:
        query = query.filter(Place.city.ilike(f"%{city}%"))
    if state:
        query = query.filter(Place.state.ilike(f"%{state}%"))
    if category:
        query = query.filter(Place.category.ilike(f"%{category}%"))
    if is_hidden_gem is not None:
        query = query.filter(Place.is_hidden_gem == is_hidden_gem)
    if q:
        search_filter = or_(
            Place.name.ilike(f"%{q}%"),
            Place.description.ilike(f"%{q}%"),
            Place.folklore_story.ilike(f"%{q}%"),
            Place.city.ilike(f"%{q}%"),
        )
        query = query.filter(search_filter)

    return query.offset(offset).limit(limit).all()


@router.get("/folklore/feed", response_model=List[PlaceResponse])
def get_folklore_feed(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Curated feed of places with verified oral folklore and mythical history legends."""
    places = (
        db.query(Place)
        .filter(Place.folklore_story.isnot(None))
        .filter(Place.folklore_story != "")
        .limit(limit)
        .all()
    )
    return places


@router.post("/recommend", response_model=RecommendationResponse)
def get_place_recommendations(
    req: RecommendationRequest,
    db: Session = Depends(get_db),
):
    """
    Content-based recommendation engine using Scikit-Learn (TF-IDF + Cosine Similarity).
    Matches user tags, search query, and max budget against places.
    """
    all_places = db.query(Place).all()
    if not all_places:
        return {
            "query_tags": req.user_tags or [],
            "max_budget": req.max_budget,
            "total_matches": 0,
            "recommendations": [],
        }

    recommender = get_recommender()
    recommender.fit(all_places)

    recommendations_raw = recommender.recommend(
        user_tags=req.user_tags,
        query_text=req.query_text,
        max_budget=req.max_budget,
        city=req.city,
        top_k=req.top_k,
    )

    items: List[RecommendedPlaceItem] = []
    for item in recommendations_raw:
        items.append(
            RecommendedPlaceItem(
                place=PlaceResponse.model_validate(item["place"]),
                similarity_score=item["similarity_score"],
                match_percentage=item["match_percentage"],
                estimated_cost=item["estimated_cost"],
                matched_tags=item["matched_tags"],
                match_reason=item["match_reason"],
                budget_passed=item["budget_passed"],
            )
        )

    return {
        "query_tags": req.user_tags or [],
        "max_budget": req.max_budget,
        "total_matches": len(items),
        "recommendations": items,
    }


@router.get("/{place_id_or_slug}", response_model=PlaceResponse)
def get_place(place_id_or_slug: str, db: Session = Depends(get_db)):
    """Retrieve details for a single place by its database ID or slug."""
    if place_id_or_slug.isdigit():
        place = db.query(Place).filter(Place.id == int(place_id_or_slug)).first()
    else:
        place = db.query(Place).filter(Place.slug == place_id_or_slug).first()

    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Place '{place_id_or_slug}' not found",
        )
    return place


@router.post("/", response_model=PlaceResponse, status_code=status.HTTP_201_CREATED)
def create_place(place_in: PlaceCreate, db: Session = Depends(get_db)):
    """Register a new heritage place with folklore and GPS coordinates."""
    existing = db.query(Place).filter(Place.slug == place_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"A place with slug '{place_in.slug}' already exists.",
        )
    new_place = Place(**place_in.model_dump())
    db.add(new_place)
    db.commit()
    db.refresh(new_place)
    return new_place
