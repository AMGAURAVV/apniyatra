import hashlib
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.passport import YatraPassport
from app.schemas.user import UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Users"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """List registered users."""
    return db.query(User).all()


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user profile by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return user


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new traveler or service provider."""
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email '{user_in.email}' already exists"
        )

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hash_password(user_in.password),
        phone=user_in.phone,
        avatar_url=user_in.avatar_url,
        role=user_in.role,
    )
    db.add(user)
    db.flush()

    # Automatically create YatraPassport for the new user
    passport = YatraPassport(
        user_id=user.id,
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
    db.refresh(user)
    return user
