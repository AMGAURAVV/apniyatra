"""
ApniYatra Standalone Database Seeder
Usage:
    python seed.py
"""
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine
from app.models import Base
from app.api.v1.endpoints.seed import seed_database

def run_seed():
    print("Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding ApniYatra domain data (Users, Places with folklore & GPS, Services, Passports)...")
        res = seed_database(db=db)
        print(f"Result: {res}")
    except Exception as e:
        print(f"Error during seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()
