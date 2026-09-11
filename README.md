# ApniYatra — Monorepo

ApniYatra is a local-first travel platform for India, celebrating authentic cultural heritage, oral folklore legends, verified local guides, and community transport services.

This repository is organized as a modern fullstack monorepo:
- **`backend/`**: FastAPI service with SQLAlchemy 2.0 and Alembic migrations targeting PostgreSQL.
- **`frontend/`**: Next.js (App Router, Tailwind CSS, TypeScript) with ApniYatra's warm heritage visual aesthetic.
- **`docker-compose.yml`**: Local PostgreSQL 16 container with health check and persistent storage.

---

## Repository Structure

```
ApniYatra/
├── docker-compose.yml              # Local PostgreSQL 16 service
├── .env.example                    # Global environment reference
├── .gitignore                      # Git ignore rules for Python, Node, Docker
├── README.md                       # Documentation & run instructions
│
├── backend/                        # FastAPI Backend
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic Settings & environment loader
│   │   │   └── database.py         # SQLAlchemy engine, sessionmaker & get_db
│   │   ├── models/                 # SQLAlchemy 2.0 ORM Models
│   │   │   ├── base.py             # DeclarativeBase & TimestampMixin
│   │   │   ├── user.py             # User model
│   │   │   ├── place.py            # Place model (heritage folklore & GPS coordinates)
│   │   │   ├── service.py          # Service model (guides, rentals, workshops)
│   │   │   ├── booking.py          # Booking reservation model
│   │   │   └── passport.py         # YatraPassport, PassportStamp, PassportBadge
│   │   ├── schemas/                # Pydantic validation & serialization schemas
│   │   ├── api/v1/                 # Endpoints (/places, /services, /bookings, /passports, /users, /seed)
│   │   └── main.py                 # FastAPI application & CORS configuration
│   ├── alembic/                    # Database migration environment
│   │   ├── env.py                  # Alembic runtime metadata configuration
│   │   └── versions/               # Initial migration scripts
│   ├── alembic.ini                 # Alembic configuration file
│   ├── requirements.txt            # Python dependencies
│   └── seed.py                     # Standalone database seeding script
│
└── frontend/                       # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx          # Root layout with Fraunces & Inter fonts
    │   │   ├── page.tsx            # Home page (Hero, folklore spotlight, services, passport preview)
    │   │   ├── places/             # Places directory with GPS coordinates & folklore reader modal
    │   │   ├── services/           # Marketplace (guides, bike/car rentals, workshops) + booking modal
    │   │   ├── passport/           # Digital Yatra Passport dashboard (XP level, journey stamps, badges)
    │   │   ├── bookings/           # Bookings history & digital voucher viewer
    │   │   └── globals.css         # ApniYatra theme design tokens & styles
    │   ├── components/             # Reusable UI (Navbar, Footer, FolkloreModal, BookingModal)
    │   └── lib/                    # API client (api.ts) & types (types.ts)
    ├── package.json
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## Domain Data Models

1. **`User`** (`users`):
   - `id`, `email`, `full_name`, `hashed_password`, `phone`, `avatar_url`, `role` (`traveler`, `guide`, `admin`), `is_active`, timestamps.
2. **`Place`** (`places`):
   - `id`, `name`, `slug`, `city`, `state`, `category` (*Hidden Stepwell*, *Fort*, *Artisan Community*, *Sacred Ghat*).
   - **Heritage Folklore**: `folklore_story` (rich oral folklore passed down across generations), `history_summary`.
   - **GPS Coordinates**: `latitude`, `longitude` (exact float GPS coordinates with Google Maps links).
   - `best_time_to_visit`, `entry_fee`, `is_hidden_gem`, `image_url`, `tags`, timestamps.
3. **`Service`** (`services`):
   - `id`, `name`, `provider_name`, `service_type` (`guide`, `bike_rental`, `car_rental`, `camera_rental`, `cooking_class`).
   - `category`, `description`, `location`, `city`, `state`.
   - `price_amount`, `price_unit` (`per person`, `per day`, `per session`).
   - `rating`, `reviews_count`, `is_verified`, `image_url`, `contact_phone`, `contact_email`, timestamps.
4. **`Booking`** (`bookings`):
   - `id`, `booking_reference` (e.g. `AY-2026-XXXX`), `user_id`, `service_id`, `place_id`, `booking_date`, `travel_date`, `travelers_count`, `total_amount`, `currency`, `status`, `notes`, timestamps.
5. **`YatraPassport`** (`yatra_passports`):
   - `id`, `user_id`, `level_name`, `level_number`, `xp_points`, `xp_next_level`, `cities_visited_count`, `places_explored_count`, `experiences_completed_count`, `gems_discovered_count`.
   - **`PassportStamp`** (`passport_stamps`): `passport_id`, `city`, `location_name`, `highlight_story`, `latitude`, `longitude`, `stamped_at`.
   - **`PassportBadge`** (`passport_badges`): `passport_id`, `name`, `icon`, `description`, `earned`, `unlocked_at`.

---

## Quickstart Guide

### 1. Start Local PostgreSQL Database

Run Docker Compose from the project root:

```bash
docker compose up -d
```

Verify that the database is running:
```bash
docker compose ps
```
The PostgreSQL service will be available on `localhost:5432` with credentials `postgres:postgres` and database name `apniyatra_db`.

---

### 2. Set Up & Run the FastAPI Backend

Navigate into `backend/`:

```bash
cd backend

# (Optional) Create and activate a Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations with Alembic
alembic upgrade head

# Seed initial ApniYatra domain data (Users, Places with folklore, Services, Passport)
python seed.py

# Start the FastAPI dev server
uvicorn app.main:app --reload --port 8000
```

The interactive Swagger UI documentation is available at:
- **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

### 3. Set Up & Run the Next.js Frontend

Navigate into `frontend/`:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **`/`**: Explore home page, featured folklore stories, verified services, and passport preview.
- **`/places`**: Heritage catalog with GPS coordinate badges, filters (Hidden Gems, Stepwells, Forts), and folklore modal.
- **`/services`**: Marketplace for local guides and vehicle rentals with booking modal.
- **`/passport`**: Gamified Yatra Passport with XP progression bar, stamped coordinates, and badges.
- **`/bookings`**: Traveler reservation vouchers and reference codes.
