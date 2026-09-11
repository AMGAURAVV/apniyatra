import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.service import ServiceResponse
from app.schemas.place import PlaceResponse


class BookingBase(BaseModel):
    user_id: int
    service_id: Optional[int] = None
    place_id: Optional[int] = None
    booking_date: datetime.datetime
    travel_date: datetime.datetime
    travelers_count: int = 1
    total_amount: float
    currency: str = "INR"
    notes: Optional[str] = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    status: Optional[str] = None
    travel_date: Optional[datetime.datetime] = None
    travelers_count: Optional[int] = None
    notes: Optional[str] = None


class BookingResponse(BookingBase):
    id: int
    booking_reference: str
    status: str
    created_at: datetime.datetime
    service: Optional[ServiceResponse] = None
    place: Optional[PlaceResponse] = None

    model_config = ConfigDict(from_attributes=True)
