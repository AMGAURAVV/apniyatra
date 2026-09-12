"""
ApniYatra Standalone Database Seeder
Usage:
    python seed.py
"""
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, check_db_connection
from app.models import Base
from app.api.v1.endpoints.seed import seed_database

def run_seed():
    print("Connecting to database...")
    db_status = check_db_connection()
    if not db_status["connected"]:
        print(f"[ERROR] Could not connect to database (Dialect: {db_status['dialect']})")
        print(f"[ERROR] Reason: {db_status['error']}")
        print("[TIP] Ensure DATABASE_URL is set in your environment or .env file.")
        sys.exit(1)

    print(f"Database connected successfully (Dialect: {db_status['dialect']}, Latency: {db_status['latency_ms']}ms).")
    print("Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding ApniYatra domain data (Users, Places with folklore & GPS, Services, Passports)...")
        res = seed_database(db=db)
        print(f"[SUCCESS] Seeding complete: {res}")
    except Exception as e:
        print(f"[ERROR] Seeding failed: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
