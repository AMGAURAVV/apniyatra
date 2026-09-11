import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict


class PlaceBase(BaseModel):
    name: str
    slug: str
    state: str
    city: str
    category: str
    description: str
    folklore_story: Optional[str] = None
    history_summary: Optional[str] = None
    latitude: float
    longitude: float
    best_time_to_visit: Optional[str] = None
    entry_fee: Optional[str] = None
    is_hidden_gem: bool = False
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None


class PlaceCreate(PlaceBase):
    pass


class PlaceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    folklore_story: Optional[str] = None
    history_summary: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    best_time_to_visit: Optional[str] = None
    entry_fee: Optional[str] = None
    is_hidden_gem: Optional[bool] = None
    image_url: Optional[str] = None
    tags: Optional[List[str]] = None


class PlaceResponse(PlaceBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
