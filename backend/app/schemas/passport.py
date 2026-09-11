import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class PassportStampBase(BaseModel):
    city: str
    location_name: str
    highlight_story: str
    latitude: float
    longitude: float
    place_id: Optional[int] = None


class PassportStampCreate(PassportStampBase):
    pass


class PassportStampResponse(PassportStampBase):
    id: int
    passport_id: int
    stamped_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class PassportBadgeBase(BaseModel):
    name: str
    icon: str
    description: str
    earned: bool = False
    unlocked_at: Optional[datetime.datetime] = None


class PassportBadgeCreate(PassportBadgeBase):
    pass


class PassportBadgeResponse(PassportBadgeBase):
    id: int
    passport_id: int

    model_config = ConfigDict(from_attributes=True)


class YatraPassportBase(BaseModel):
    user_id: int
    level_name: str = "Explorer"
    level_number: int = 1
    xp_points: int = 100
    xp_next_level: int = 500
    cities_visited_count: int = 0
    places_explored_count: int = 0
    experiences_completed_count: int = 0
    gems_discovered_count: int = 0


class YatraPassportCreate(YatraPassportBase):
    pass


class YatraPassportUpdate(BaseModel):
    level_name: Optional[str] = None
    level_number: Optional[int] = None
    xp_points: Optional[int] = None
    xp_next_level: Optional[int] = None
    cities_visited_count: Optional[int] = None
    places_explored_count: Optional[int] = None
    experiences_completed_count: Optional[int] = None
    gems_discovered_count: Optional[int] = None


class YatraPassportResponse(YatraPassportBase):
    id: int
    created_at: datetime.datetime
    stamps: List[PassportStampResponse] = []
    badges: List[PassportBadgeResponse] = []

    model_config = ConfigDict(from_attributes=True)
