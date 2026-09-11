import hashlib
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.place import Place
from app.models.service import Service
from app.models.user import User
from app.models.booking import Booking
from app.models.passport import YatraPassport, PassportStamp, PassportBadge

router = APIRouter(prefix="/seed", tags=["Database Seed"])


@router.post("/", status_code=status.HTTP_200_OK)
def seed_database(db: Session = Depends(get_db)):
    """Seed initial ApniYatra domain data: Users, Places (folklore & GPS), Services, Passports."""
    
    # Check if already seeded
    existing_place = db.query(Place).first()
    if existing_place:
        return {"status": "already_seeded", "message": "Database already contains seed data."}

    # 1. Create Default User (Gitin)
    sample_user = User(
        email="gitin@apniyatra.in",
        full_name="Gitin",
        hashed_password=hashlib.sha256(b"password123").hexdigest(),
        phone="+91 98765 43210",
        avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        role="traveler",
    )
    db.add(sample_user)
    db.flush()

    # 2. Seed Rich Places with Heritage Folklore & GPS Coordinates
    places_data = [
        {
            "name": "Panna Meena ka Kund",
            "slug": "panna-meena-ka-kund",
            "city": "Jaipur",
            "state": "Rajasthan",
            "category": "Hidden Stepwell",
            "description": "A symmetrical 16th-century stepwell near Amer with interlocking diamond staircases.",
            "folklore_story": "According to local oral folklore, no human can climb down and then climb back up on the exact same sequence of steps without becoming disoriented. Ancient guards utilized this geometric labyrinth during times of siege to confuse infiltrators in the dark.",
            "history_summary": "Constructed in the 16th century during the reign of Maharaja Man Singh I for local community gatherings and rainwater harvesting.",
            "latitude": 26.9854,
            "longitude": 75.8330,
            "best_time_to_visit": "Early morning (7 AM - 9 AM) or golden hour",
            "entry_fee": "Free",
            "is_hidden_gem": True,
            "image_url": "https://images.unsplash.com/photo-1516522184673-de15e930962f?q=80&w=1000&auto=format&fit=crop",
            "tags": ["Heritage", "Stepwell", "Architecture", "Hidden Gem"],
        },
        {
            "name": "Amber Fort",
            "slug": "amber-fort",
            "city": "Jaipur",
            "state": "Rajasthan",
            "category": "Fort",
            "description": "Perched on the rugged Aravalli hills, a majestic sandstone and marble citadel renowned for its Sheesh Mahal.",
            "folklore_story": "Legend says that when the royal architects designed the Sheesh Mahal (Hall of Mirrors), they arranged thousands of concave Belgian convex mirrors so that a single candle lit at night would illuminate the entire chamber like an open starry galaxy, designed to comfort the queen who was not permitted to sleep under the open sky.",
            "history_summary": "Built by Raja Man Singh I in 1592, the fort served as the primary residence of the Rajput Kachwaha rulers until Sawai Jai Singh II founded Jaipur.",
            "latitude": 26.9855,
            "longitude": 75.8513,
            "best_time_to_visit": "October to March, 8:00 AM - 5:30 PM",
            "entry_fee": "₹100 (Indians), ₹500 (Foreigners)",
            "is_hidden_gem": False,
            "image_url": "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop",
            "tags": ["Heritage", "Fort", "Royal", "Iconic"],
        },
        {
            "name": "Assi Ghat",
            "slug": "assi-ghat",
            "city": "Varanasi",
            "state": "Uttar Pradesh",
            "category": "Sacred Ghat",
            "description": "The southernmost ghat of Kashi where the holy river Assi meets the Ganges, vibrant with dawn subah-e-banaras.",
            "folklore_story": "Folklore and sacred texts in the Matsya Purana narrate that Goddess Durga tossed her sacred sword (Asi) here into the waters after vanquishing the demon duo Shumbha and Nishumbha. The drop of the divine blade cleaved the earth to carve the Assi river.",
            "history_summary": "Celebrated since Vedic times and mentioned by poet Tulsidas, who wrote the Ramcharitmanas near this spot.",
            "latitude": 25.2925,
            "longitude": 83.0076,
            "best_time_to_visit": "5:30 AM for dawn chants and yoga",
            "entry_fee": "Free",
            "is_hidden_gem": False,
            "image_url": "https://images.unsplash.com/photo-1561361058-c24cecae35ca?q=80&w=1200&auto=format&fit=crop",
            "tags": ["Spiritual", "Culture", "Sunrise", "Ganges"],
        },
        {
            "name": "Kumbhalgarh Fort Trails",
            "slug": "kumbhalgarh-fort-trails",
            "city": "Rajsamand",
            "state": "Rajasthan",
            "category": "Lesser-known Fort",
            "description": "The Mewar fortress with the second-longest continuous wall on earth stretching over 36 kilometers.",
            "folklore_story": "Local bards sing of Maharana Kumbha’s struggle to build the perimeter wall. Disheartened by repeated nighttime collapses, a saint advised a voluntary royal sacrifice. The saint began walking uphill, telling the king that wherever he halted, his head must be severed to bless the foundation.",
            "history_summary": "Constructed in the 15th century by Rana Kumbha, birthplace of legendary warrior Maharana Pratap.",
            "latitude": 25.1483,
            "longitude": 73.5844,
            "best_time_to_visit": "October to March",
            "entry_fee": "₹40 (Indians), ₹600 (Foreigners)",
            "is_hidden_gem": True,
            "image_url": "https://images.unsplash.com/photo-1713682995521-22ec819b50ac?q=80&w=1000&auto=format&fit=crop",
            "tags": ["Adventure", "Fort", "Trekking", "Hidden Gem"],
        },
        {
            "name": "Molela Terracotta Artisans Village",
            "slug": "molela-terracotta-artisans",
            "city": "Rajsamand",
            "state": "Rajasthan",
            "category": "Artisan Community",
            "description": "A tranquil village where generation after generation of potters hand-sculpt sacred votive terracotta plaques.",
            "folklore_story": "According to Molela folklore, an ancient blind potter received a divine vision from Lord Devnarayan instructing him to sculpt a plaque with clay from the Banas riverbed. As soon as he fired the terracotta plaque, his eyesight was miraculously restored.",
            "history_summary": "Over 800 years of unbroken terracotta craft tradition recognized with Geographical Indication (GI) status.",
            "latitude": 25.0700,
            "longitude": 73.8800,
            "best_time_to_visit": "Year round, 9:00 AM - 6:00 PM",
            "entry_fee": "Free",
            "is_hidden_gem": True,
            "image_url": "https://images.unsplash.com/photo-1768167444719-fa0759703ec5?q=80&w=1000&auto=format&fit=crop",
            "tags": ["Culture", "Craft", "Artisan", "Handmade"],
        },
        {
            "name": "Sanapur Lake",
            "slug": "sanapur-lake",
            "city": "Hampi",
            "state": "Karnataka",
            "category": "Hidden Lake",
            "description": "A boulder-ringed pristine lake on the hippi island side of Hampi, reachable by coracle ride.",
            "folklore_story": "Folklore ties the boulder-strewn terrain around Sanapur to Kishkindha, the mythical monkey kingdom in the Ramayana where Sugriva and Hanuman resided. The scattered giant boulders are said to be stones thrown playfully by the Vanara army.",
            "history_summary": "An ancient irrigation reservoir nestled in the boulder landscapes of the Tungabhadra basin.",
            "latitude": 15.3550,
            "longitude": 76.4970,
            "best_time_to_visit": "November to February for sunsets",
            "entry_fee": "Free (Coracle ride ₹100 - ₹200)",
            "is_hidden_gem": True,
            "image_url": "https://images.unsplash.com/photo-1652820331058-710073803085?q=80&w=1000&auto=format&fit=crop",
            "tags": ["Nature", "Lake", "Boulders", "Coracle"],
        }
    ]

    saved_places = []
    for p_data in places_data:
        place = Place(**p_data)
        db.add(place)
        saved_places.append(place)
    db.flush()

    # 3. Seed Services (Guides, Bike/Car Rentals, Cultural Experiences)
    services_data = [
        {
            "name": "Rajesh Kumar — Heritage Storyteller",
            "provider_name": "Rajesh Kumar",
            "service_type": "guide",
            "category": "guides",
            "description": "Government-licensed Rajasthan guide with 14 years uncovering secret courtyards and folklore.",
            "location": "Amer & Old City, Jaipur",
            "city": "Jaipur",
            "state": "Rajasthan",
            "price_amount": 800.0,
            "price_unit": "per person",
            "rating": 4.9,
            "reviews_count": 312,
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
            "contact_phone": "+91 94140 11223",
            "contact_email": "rajesh.heritage@apniyatra.in",
        },
        {
            "name": "Vikram Royal Enfield & Scooter Rentals",
            "provider_name": "Vikram Rentals",
            "service_type": "bike_rental",
            "category": "rentals",
            "description": "Well-maintained Royal Enfield Classic 350 and Honda Activa scooters with helmets and GPS mounts.",
            "location": "MI Road, Jaipur",
            "city": "Jaipur",
            "state": "Rajasthan",
            "price_amount": 400.0,
            "price_unit": "per day",
            "rating": 4.7,
            "reviews_count": 240,
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=400&auto=format&fit=crop",
            "contact_phone": "+91 98290 55443",
            "contact_email": "vikram.rentals@apniyatra.in",
        },
        {
            "name": "Desai Self-Drive SUV & Sedan Fleet",
            "provider_name": "Desai Self-Drive",
            "service_type": "car_rental",
            "category": "rentals",
            "description": "Clean, sanitized self-drive SUVs and compact cars with all-India permits and 24/7 roadside assistance.",
            "location": "Panchwati, Udaipur",
            "city": "Udaipur",
            "state": "Rajasthan",
            "price_amount": 1800.0,
            "price_unit": "per day",
            "rating": 4.6,
            "reviews_count": 118,
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=400&auto=format&fit=crop",
            "contact_phone": "+91 99280 66778",
            "contact_email": "desai.drive@apniyatra.in",
        },
        {
            "name": "FrameHire Professional Camera & Lens Rental",
            "provider_name": "FrameHire Studio",
            "service_type": "camera_rental",
            "category": "rentals",
            "description": "Sony A7 IV, Canon R6 and fast primes for capturing India's vivid heritage festivals and colors.",
            "location": "C-Scheme, Jaipur",
            "city": "Jaipur",
            "state": "Rajasthan",
            "price_amount": 900.0,
            "price_unit": "per day",
            "rating": 4.8,
            "reviews_count": 64,
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop",
            "contact_phone": "+91 98110 99887",
            "contact_email": "rentals@framehire.in",
        },
        {
            "name": "Sunita's Traditional Rajasthani Kitchen Workshop",
            "provider_name": "Sunita Sharma",
            "service_type": "cooking_class",
            "category": "experiences",
            "description": "Hands-on culinary class preparing Dal Baati Churma, Gatte ki Sabzi, and bajra rotis with organic spices.",
            "location": "Bani Park, Jaipur",
            "city": "Jaipur",
            "state": "Rajasthan",
            "price_amount": 1200.0,
            "price_unit": "per person",
            "rating": 4.9,
            "reviews_count": 301,
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400&auto=format&fit=crop",
            "contact_phone": "+91 94140 33445",
            "contact_email": "sunita.cooking@apniyatra.in",
        },
        {
            "name": "Imran Khan — Taj Mahal & Mughal Architecture Walk",
            "provider_name": "Imran Khan",
            "service_type": "guide",
            "category": "guides",
            "description": "Archaeological explorer specializing in calligraphy, marble inlay pietra dura, and lesser-known gardens.",
            "location": "Taj Ganj, Agra",
            "city": "Agra",
            "state": "Uttar Pradesh",
            "price_amount": 750.0,
            "price_unit": "per person",
            "rating": 4.9,
            "reviews_count": 268,
            "is_verified": True,
            "image_url": "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=400&auto=format&fit=crop",
            "contact_phone": "+91 98370 77665",
            "contact_email": "imran.taj@apniyatra.in",
        }
    ]

    for s_data in services_data:
        service = Service(**s_data)
        db.add(service)
    db.flush()

    # 4. Create Yatra Passport with Stamps and Badges for Gitin
    passport = YatraPassport(
        user_id=sample_user.id,
        level_name="Explorer",
        level_number=4,
        xp_points=680,
        xp_next_level=1000,
        cities_visited_count=8,
        places_explored_count=23,
        experiences_completed_count=7,
        gems_discovered_count=4,
    )
    db.add(passport)
    db.flush()

    # Add Journey Stamps
    stamps_data = [
        {
            "passport_id": passport.id,
            "city": "Jaipur",
            "location_name": "Panna Meena ka Kund & Amber Fort",
            "highlight_story": "Cracked the labyrinth staircase geometry of Panna Meena Kund and listened to royal mirror legends at Amber.",
            "latitude": 26.9854,
            "longitude": 75.8330,
            "place_id": saved_places[0].id,
        },
        {
            "passport_id": passport.id,
            "city": "Udaipur",
            "location_name": "Lake Pichola & Gangaur Ghat",
            "highlight_story": "Sunset wooden boat ride past Taj Lake Palace followed by evening Bagore ki Haveli folk dance.",
            "latitude": 24.5797,
            "longitude": 73.6800,
            "place_id": None,
        },
        {
            "passport_id": passport.id,
            "city": "Varanasi",
            "location_name": "Assi Ghat & Ganga Aarti",
            "highlight_story": "Dawn yoga as dawn broke over the Ganga, followed by hot kachori jalebi in old city alleys.",
            "latitude": 25.2925,
            "longitude": 83.0076,
            "place_id": saved_places[2].id,
        }
    ]

    for st_data in stamps_data:
        db.add(PassportStamp(**st_data))

    # Add Badges
    badges_data = [
        {"passport_id": passport.id, "name": "Heritage Explorer", "icon": "🏰", "description": "Visited 5+ historical monuments and forts", "earned": True},
        {"passport_id": passport.id, "name": "Hidden Gem Hunter", "icon": "🗺️", "description": "Discovered off-beat stepwells and ruins", "earned": True},
        {"passport_id": passport.id, "name": "Story Collector", "icon": "📜", "description": "Read and unlocked local folklore legends", "earned": True},
        {"passport_id": passport.id, "name": "Local Friend", "icon": "🤝", "description": "Booked services directly from local guides", "earned": True},
        {"passport_id": passport.id, "name": "Mountain Wanderer", "icon": "⛰️", "description": "Trek Himalayan and Aravalli mountain paths", "earned": False},
    ]

    for bg_data in badges_data:
        db.add(PassportBadge(**bg_data))

    db.commit()
    return {
        "status": "success",
        "message": "ApniYatra database successfully seeded with Users, Places (folklore & GPS), Services, and Passport data!",
        "user_id": sample_user.id,
        "places_seeded": len(places_data),
        "services_seeded": len(services_data),
    }
