import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    name: str
    provider_name: str
    service_type: str  # guide, bike_rental, car_rental, camera_rental, workshop, cooking_class
    category: str      # guides, rentals, experiences, photographers, hotels
    description: str
    location: str
    city: str
    state: str
    price_amount: float
    price_unit: str = "per person"
    rating: float = 5.0
    reviews_count: int = 0
    is_verified: bool = True
    image_url: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    provider_name: Optional[str] = None
    service_type: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price_amount: Optional[float] = None
    price_unit: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    is_verified: Optional[bool] = None
    image_url: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None


class ServiceResponse(ServiceBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
