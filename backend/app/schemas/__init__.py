from app.schemas.user import UserBase, UserCreate, UserUpdate, UserResponse
from app.schemas.auth import Token, TokenPayload, LoginRequest, RegisterRequest
from app.schemas.place import PlaceBase, PlaceCreate, PlaceUpdate, PlaceResponse
from app.schemas.service import ServiceBase, ServiceCreate, ServiceUpdate, ServiceResponse
from app.schemas.booking import BookingBase, BookingCreate, BookingUpdate, BookingResponse
from app.schemas.passport import (
    PassportStampBase,
    PassportStampCreate,
    PassportStampResponse,
    PassportBadgeBase,
    PassportBadgeCreate,
    PassportBadgeResponse,
    YatraPassportBase,
    YatraPassportCreate,
    YatraPassportUpdate,
    YatraPassportResponse,
)
from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
    RecommendedPlaceItem,
)
from app.schemas.itinerary import (
    ItineraryRequest,
    ItineraryResponse,
    ItineraryDay,
    ItineraryActivity,
)

__all__ = [
    "UserBase", "UserCreate", "UserUpdate", "UserResponse",
    "Token", "TokenPayload", "LoginRequest", "RegisterRequest",
    "PlaceBase", "PlaceCreate", "PlaceUpdate", "PlaceResponse",
    "ServiceBase", "ServiceCreate", "ServiceUpdate", "ServiceResponse",
    "BookingBase", "BookingCreate", "BookingUpdate", "BookingResponse",
    "PassportStampBase", "PassportStampCreate", "PassportStampResponse",
    "PassportBadgeBase", "PassportBadgeCreate", "PassportBadgeResponse",
    "YatraPassportBase", "YatraPassportCreate", "YatraPassportUpdate", "YatraPassportResponse",
    "RecommendationRequest", "RecommendationResponse", "RecommendedPlaceItem",
    "ItineraryRequest", "ItineraryResponse", "ItineraryDay", "ItineraryActivity",
]
