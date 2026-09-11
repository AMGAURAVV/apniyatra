from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.booking import Booking
    from app.models.passport import PassportStamp


class Place(Base, TimestampMixin):
    __tablename__ = "places"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    state: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    city: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)  # Hidden Stepwell, Fort, Lake, etc.
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Domain specific: Heritage Folklore & Oral History
    folklore_story: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    history_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Domain specific: Exact GPS Coordinates
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)

    best_time_to_visit: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    entry_fee: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_hidden_gem: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    tags: Mapped[Optional[dict]] = mapped_column(JSON, default=list, nullable=True)

    # Relationships
    bookings: Mapped[List["Booking"]] = relationship("Booking", back_populates="place")
    stamps: Mapped[List["PassportStamp"]] = relationship("PassportStamp", back_populates="place")
