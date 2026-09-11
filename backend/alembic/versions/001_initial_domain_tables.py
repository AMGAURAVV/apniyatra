"""Initial migration creating ApniYatra domain tables

Revision ID: 001_initial_domain_tables
Revises: 
Create Date: 2026-09-11 19:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_domain_tables'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=30), nullable=True),
        sa.Column('avatar_url', sa.String(length=512), nullable=True),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='traveler'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. places table (with folklore & GPS coordinates)
    op.create_table(
        'places',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('folklore_story', sa.Text(), nullable=True),
        sa.Column('history_summary', sa.Text(), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('best_time_to_visit', sa.String(length=150), nullable=True),
        sa.Column('entry_fee', sa.String(length=100), nullable=True),
        sa.Column('is_hidden_gem', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('image_url', sa.String(length=1024), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_places_id'), 'places', ['id'], unique=False)
    op.create_index(op.f('ix_places_name'), 'places', ['name'], unique=False)
    op.create_index(op.f('ix_places_slug'), 'places', ['slug'], unique=True)
    op.create_index(op.f('ix_places_city'), 'places', ['city'], unique=False)
    op.create_index(op.f('ix_places_category'), 'places', ['category'], unique=False)
    op.create_index(op.f('ix_places_is_hidden_gem'), 'places', ['is_hidden_gem'], unique=False)

    # 3. services table (guides, bike/car rentals, workshops)
    op.create_table(
        'services',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('provider_name', sa.String(length=255), nullable=False),
        sa.Column('service_type', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('location', sa.String(length=255), nullable=False),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('state', sa.String(length=100), nullable=False),
        sa.Column('price_amount', sa.Float(), nullable=False),
        sa.Column('price_unit', sa.String(length=50), nullable=False, server_default='per person'),
        sa.Column('rating', sa.Float(), nullable=False, server_default='5.0'),
        sa.Column('reviews_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_verified', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('image_url', sa.String(length=1024), nullable=True),
        sa.Column('contact_phone', sa.String(length=50), nullable=True),
        sa.Column('contact_email', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_services_id'), 'services', ['id'], unique=False)
    op.create_index(op.f('ix_services_name'), 'services', ['name'], unique=False)
    op.create_index(op.f('ix_services_city'), 'services', ['city'], unique=False)
    op.create_index(op.f('ix_services_category'), 'services', ['category'], unique=False)
    op.create_index(op.f('ix_services_service_type'), 'services', ['service_type'], unique=False)
    op.create_index(op.f('ix_services_is_verified'), 'services', ['is_verified'], unique=False)

    # 4. bookings table
    op.create_table(
        'bookings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('booking_reference', sa.String(length=50), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('service_id', sa.Integer(), nullable=True),
        sa.Column('place_id', sa.Integer(), nullable=True),
        sa.Column('booking_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('travel_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('travelers_count', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('total_amount', sa.Float(), nullable=False),
        sa.Column('currency', sa.String(length=10), nullable=False, server_default='INR'),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='confirmed'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['place_id'], ['places.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_bookings_id'), 'bookings', ['id'], unique=False)
    op.create_index(op.f('ix_bookings_booking_reference'), 'bookings', ['booking_reference'], unique=True)
    op.create_index(op.f('ix_bookings_user_id'), 'bookings', ['user_id'], unique=False)
    op.create_index(op.f('ix_bookings_status'), 'bookings', ['status'], unique=False)

    # 5. yatra_passports table
    op.create_table(
        'yatra_passports',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('level_name', sa.String(length=100), nullable=False, server_default='Explorer'),
        sa.Column('level_number', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('xp_points', sa.Integer(), nullable=False, server_default='100'),
        sa.Column('xp_next_level', sa.Integer(), nullable=False, server_default='500'),
        sa.Column('cities_visited_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('places_explored_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('experiences_completed_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('gems_discovered_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_yatra_passports_id'), 'yatra_passports', ['id'], unique=False)
    op.create_index(op.f('ix_yatra_passports_user_id'), 'yatra_passports', ['user_id'], unique=True)

    # 6. passport_stamps table
    op.create_table(
        'passport_stamps',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('passport_id', sa.Integer(), nullable=False),
        sa.Column('place_id', sa.Integer(), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('location_name', sa.String(length=255), nullable=False),
        sa.Column('highlight_story', sa.Text(), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('stamped_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['passport_id'], ['yatra_passports.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['place_id'], ['places.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_passport_stamps_id'), 'passport_stamps', ['id'], unique=False)
    op.create_index(op.f('ix_passport_stamps_passport_id'), 'passport_stamps', ['passport_id'], unique=False)

    # 7. passport_badges table
    op.create_table(
        'passport_badges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('passport_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('icon', sa.String(length=20), nullable=False, server_default='🧭'),
        sa.Column('description', sa.String(length=255), nullable=False),
        sa.Column('earned', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('unlocked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['passport_id'], ['yatra_passports.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_passport_badges_id'), 'passport_badges', ['id'], unique=False)
    op.create_index(op.f('ix_passport_badges_passport_id'), 'passport_badges', ['passport_id'], unique=False)


def downgrade() -> None:
    op.drop_table('passport_badges')
    op.drop_table('passport_stamps')
    op.drop_table('yatra_passports')
    op.drop_table('bookings')
    op.drop_table('services')
    op.drop_table('places')
    op.drop_table('users')
