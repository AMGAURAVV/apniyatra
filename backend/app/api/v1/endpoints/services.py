from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceResponse, ServiceUpdate

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("/", response_model=List[ServiceResponse])
def get_services(
    category: Optional[str] = Query(None, description="Category (guides, rentals, experiences, hotels)"),
    service_type: Optional[str] = Query(None, description="Service type (guide, bike_rental, car_rental, etc.)"),
    city: Optional[str] = Query(None, description="City location"),
    is_verified: Optional[bool] = Query(None, description="Verified providers only"),
    q: Optional[str] = Query(None, description="Search term in title, provider or description"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """List local guides, rentals (bike, car, camera), and cultural experiences."""
    query = db.query(Service)

    if category:
        query = query.filter(Service.category.ilike(f"%{category}%"))
    if service_type:
        query = query.filter(Service.service_type.ilike(f"%{service_type}%"))
    if city:
        query = query.filter(Service.city.ilike(f"%{city}%"))
    if is_verified is not None:
        query = query.filter(Service.is_verified == is_verified)
    if q:
        query = query.filter(
            or_(
                Service.name.ilike(f"%{q}%"),
                Service.provider_name.ilike(f"%{q}%"),
                Service.description.ilike(f"%{q}%"),
            )
        )

    return query.offset(offset).limit(limit).all()


@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a specific local service."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with id {service_id} not found"
        )
    return service


@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(service_in: ServiceCreate, db: Session = Depends(get_db)):
    """Register a new service provider or local experience."""
    new_service = Service(**service_in.model_dump())
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service
