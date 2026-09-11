from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    places,
    services,
    bookings,
    passports,
    users,
    itineraries,
    seed,
)

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(places.router)
api_router.include_router(services.router)
api_router.include_router(bookings.router)
api_router.include_router(passports.router)
api_router.include_router(itineraries.router)
api_router.include_router(users.router)
api_router.include_router(seed.router)
