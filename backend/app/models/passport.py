import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.place import Place


class YatraPassport(Base, TimestampMixin):
    __tablename__ = "yatra_passports"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)

    level_name: Mapped[str] = mapped_column(String(100), default="Explorer", nullable=False)  # Explorer, Wanderer, Sojourner, Yatri
    level_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    xp_points: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    xp_next_level: Mapped[int] = mapped_column(Integer, default=500, nullable=False)

    # Aggregated Stats
    cities_visited_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    places_explored_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    experiences_completed_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    gems_discovered_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="passport")
    stamps: Mapped[List["PassportStamp"]] = relationship("PassportStamp", back_populates="passport", cascade="all, delete-orphan", order_by="PassportStamp.stamped_at.desc()")
    badges: Mapped[List["PassportBadge"]] = relationship("PassportBadge", back_populates="passport", cascade="all, delete-orphan")


class PassportStamp(Base, TimestampMixin):
    __tablename__ = "passport_stamps"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    passport_id: Mapped[int] = mapped_column(ForeignKey("yatra_passports.id", ondelete="CASCADE"), index=True, nullable=False)
    place_id: Mapped[Optional[int]] = mapped_column(ForeignKey("places.id", ondelete="SET NULL"), nullable=True)

    city: Mapped[str] = mapped_column(String(100), nullable=False)
    location_name: Mapped[str] = mapped_column(String(255), nullable=False)
    highlight_story: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    stamped_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    passport: Mapped["YatraPassport"] = relationship("YatraPassport", back_populates="stamps")
    place: Mapped[Optional["Place"]] = relationship("Place", back_populates="stamps")


class PassportBadge(Base, TimestampMixin):
    __tablename__ = "passport_badges"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    passport_id: Mapped[int] = mapped_column(ForeignKey("yatra_passports.id", ondelete="CASCADE"), index=True, nullable=False)

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    icon: Mapped[str] = mapped_column(String(20), default="🧭", nullable=False)  # Emoji or icon identifier
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    earned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    unlocked_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    passport: Mapped["YatraPassport"] = relationship("YatraPassport", back_populates="badges")
