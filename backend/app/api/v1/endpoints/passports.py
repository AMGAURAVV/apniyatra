from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.passport import YatraPassport, PassportStamp, PassportBadge
from app.models.user import User
from app.schemas.passport import (
    YatraPassportResponse,
    YatraPassportCreate,
    PassportStampCreate,
    PassportStampResponse,
    PassportBadgeCreate,
    PassportBadgeResponse,
)

router = APIRouter(prefix="/passports", tags=["Yatra Passports"])


@router.get("/user/{user_id}", response_model=YatraPassportResponse)
def get_user_passport(user_id: int, db: Session = Depends(get_db)):
    """Retrieve the digital Yatra Passport, journey stamps, and unlocked badges for a user."""
    passport = db.query(YatraPassport).filter(YatraPassport.user_id == user_id).first()
    if not passport:
        # Check if user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with id {user_id} not found"
            )
        # Create an initial passport for the user
        passport = YatraPassport(
            user_id=user_id,
            level_name="Explorer",
            level_number=1,
            xp_points=100,
            xp_next_level=500,
            cities_visited_count=0,
            places_explored_count=0,
            experiences_completed_count=0,
            gems_discovered_count=0,
        )
        db.add(passport)
        db.commit()
        db.refresh(passport)

    return passport


@router.get("/{passport_id}", response_model=YatraPassportResponse)
def get_passport_by_id(passport_id: int, db: Session = Depends(get_db)):
    """Retrieve passport directly by passport ID."""
    passport = db.query(YatraPassport).filter(YatraPassport.id == passport_id).first()
    if not passport:
        # Fallback to user_id check
        passport = db.query(YatraPassport).filter(YatraPassport.user_id == passport_id).first()
    if not passport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Passport with id {passport_id} not found"
        )
    return passport


@router.post("/{passport_id}/stamps", response_model=PassportStampResponse, status_code=status.HTTP_201_CREATED)
def add_passport_stamp(passport_id: int, stamp_in: PassportStampCreate, db: Session = Depends(get_db)):
    """Add a new visited location stamp to the user's Yatra Passport and award XP."""
    passport = db.query(YatraPassport).filter(YatraPassport.id == passport_id).first()
    if not passport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Passport with id {passport_id} not found"
        )

    stamp = PassportStamp(passport_id=passport_id, **stamp_in.model_dump())
    db.add(stamp)

    # Award 50 XP per stamp & increment places explored
    passport.xp_points += 50
    passport.places_explored_count += 1

    # Check for level up
    if passport.xp_points >= passport.xp_next_level:
        passport.level_number += 1
        passport.xp_next_level += 500
        if passport.level_number >= 5:
            passport.level_name = "Yatri Legend"
        elif passport.level_number >= 3:
            passport.level_name = "Master Sojourner"
        else:
            passport.level_name = "Heritage Wanderer"

    db.commit()
    db.refresh(stamp)
    return stamp


@router.post("/{passport_id}/badges", response_model=PassportBadgeResponse, status_code=status.HTTP_201_CREATED)
def add_passport_badge(passport_id: int, badge_in: PassportBadgeCreate, db: Session = Depends(get_db)):
    """Award a new badge to the traveler's passport."""
    passport = db.query(YatraPassport).filter(YatraPassport.id == passport_id).first()
    if not passport:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Passport with id {passport_id} not found"
        )

    badge = PassportBadge(passport_id=passport_id, **badge_in.model_dump())
    db.add(badge)
    db.commit()
    db.refresh(badge)
    return badge
