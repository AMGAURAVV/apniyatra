import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.service import Service
    from app.models.place import Place


class Booking(Base, TimestampMixin):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    booking_reference: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    
    # Foreign keys
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id: Mapped[Optional[int]] = mapped_column(ForeignKey("services.id", ondelete="SET NULL"), nullable=True, index=True)
    place_id: Mapped[Optional[int]] = mapped_column(ForeignKey("places.id", ondelete="SET NULL"), nullable=True, index=True)

    booking_date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    travel_date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    travelers_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="confirmed", index=True, nullable=False)  # pending, confirmed, completed, cancelled
    
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="bookings")
    service: Mapped[Optional["Service"]] = relationship("Service", back_populates="bookings")
    place: Mapped[Optional["Place"]] = relationship("Place", back_populates="bookings")
