import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user_optional
from app.models.booking import Booking
from app.models.service import Service
from app.models.place import Place
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdate

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("/", response_model=List[BookingResponse])
def list_bookings(
    user_id: Optional[int] = Query(None, description="Filter bookings by user ID"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (pending, confirmed, cancelled, completed)"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """List bookings with optional user and status filters."""
    query = db.query(Booking)

    # If authenticated traveler requests their own bookings, apply user filter
    target_user_id = user_id or (current_user.id if current_user else None)
    if target_user_id:
        query = query.filter(Booking.user_id == target_user_id)

    if status_filter:
        query = query.filter(Booking.status.ilike(status_filter))

    return query.order_by(Booking.created_at.desc()).offset(offset).limit(limit).all()


@router.get("/{booking_reference_or_id}", response_model=BookingResponse)
def get_booking(booking_reference_or_id: str, db: Session = Depends(get_db)):
    """Retrieve details for a specific booking by ID or reference code."""
    if booking_reference_or_id.isdigit():
        booking = db.query(Booking).filter(Booking.id == int(booking_reference_or_id)).first()
    else:
        booking = db.query(Booking).filter(Booking.booking_reference == booking_reference_or_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking '{booking_reference_or_id}' not found",
        )
    return booking


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """
    Create a new booking reservation for a guide, rental, or place experience.
    Generates an official ApniYatra reference code (AY-2026-XXXXXX).
    """
    effective_user_id = current_user.id if current_user else booking_in.user_id
    user = db.query(User).filter(User.id == effective_user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {effective_user_id} does not exist",
        )

    # Validate service or place
    calculated_amount = booking_in.total_amount
    if booking_in.service_id:
        service = db.query(Service).filter(Service.id == booking_in.service_id).first()
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Service with id {booking_in.service_id} does not exist",
            )
        # If total_amount was not specified or zero, compute from unit price
        if calculated_amount <= 0:
            calculated_amount = service.price_amount * booking_in.travelers_count

    if booking_in.place_id:
        place = db.query(Place).filter(Place.id == booking_in.place_id).first()
        if not place:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Place with id {booking_in.place_id} does not exist",
            )

    # Generate unique reservation reference code
    ref_code = f"AY-2026-{uuid.uuid4().hex[:6].upper()}"

    new_booking = Booking(
        booking_reference=ref_code,
        user_id=effective_user_id,
        service_id=booking_in.service_id,
        place_id=booking_in.place_id,
        booking_date=booking_in.booking_date or datetime.datetime.now(datetime.timezone.utc),
        travel_date=booking_in.travel_date,
        travelers_count=booking_in.travelers_count,
        total_amount=calculated_amount,
        currency=booking_in.currency or "INR",
        status="confirmed",
        notes=booking_in.notes,
    )
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking


@router.patch("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db),
):
    """Update booking details or change status (e.g. cancelled, completed)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with id {booking_id} not found",
        )

    for field, value in booking_update.model_dump(exclude_unset=True).items():
        setattr(booking, field, value)

    db.commit()
    db.refresh(booking)
    return booking
