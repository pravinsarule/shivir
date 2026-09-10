-- Shivir Management System - PostgreSQL schema
-- Run with: psql -U postgres -d shibir_db -f sql/schema.sql
-- Safe to run more than once on an empty or existing development database.

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(30),
  city VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  is_reiki_skilled BOOLEAN NOT NULL DEFAULT FALSE,
  can_drive_4w BOOLEAN NOT NULL DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  mobile VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(150),
  area VARCHAR(100),
  category VARCHAR(50) NOT NULL DEFAULT 'Warm',
  designation VARCHAR(100),
  samaj VARCHAR(100),
  social_group VARCHAR(100),
  relationship_note TEXT,
  sourced_by_id INT REFERENCES users(id),
  met_by_id INT REFERENCES users(id),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_interactions (
  id SERIAL PRIMARY KEY,
  contact_id INT NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  notes TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'Meeting',
  interaction_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  requires_driver BOOLEAN NOT NULL DEFAULT FALSE,
  requires_reiki BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS demo_sessions (
  id SERIAL PRIMARY KEY,
  contact_id INT REFERENCES contacts(id),
  param_mitra_id INT REFERENCES users(id),
  session_type VARCHAR(100) NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  expected_crowd INT NOT NULL DEFAULT 0 CHECK (expected_crowd >= 0),
  location TEXT NOT NULL,
  area_type VARCHAR(50) NOT NULL DEFAULT 'Across Delhi',
  travel_buffer_minutes INT NOT NULL DEFAULT 90 CHECK (travel_buffer_minutes >= 0),
  status VARCHAR(30) NOT NULL DEFAULT 'HOLD',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT demo_sessions_time_order CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS booking_holds (
  id SERIAL PRIMARY KEY,
  session_id INT NOT NULL REFERENCES demo_sessions(id) ON DELETE CASCADE,
  param_mitra_id INT REFERENCES users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follow_ups (
  id SERIAL PRIMARY KEY,
  contact_id INT REFERENCES contacts(id),
  param_mitra_id INT REFERENCES users(id),
  demo_session_id INT REFERENCES demo_sessions(id),
  title VARCHAR(150) NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 15 CHECK (duration_minutes > 0),
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS card_books (
  id SERIAL PRIMARY KEY,
  param_mitra_id INT NOT NULL REFERENCES users(id),
  assigned_count INT NOT NULL DEFAULT 0 CHECK (assigned_count >= 0),
  given_count INT NOT NULL DEFAULT 0 CHECK (given_count >= 0),
  returned_count INT NOT NULL DEFAULT 0 CHECK (returned_count >= 0),
  in_hand_count INT NOT NULL DEFAULT 0 CHECK (in_hand_count >= 0),
  lost_count INT NOT NULL DEFAULT 0 CHECK (lost_count >= 0),
  CONSTRAINT card_books_one_per_mitra UNIQUE (param_mitra_id),
  CONSTRAINT card_books_balance CHECK (assigned_count = given_count + returned_count + in_hand_count + lost_count)
);

CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  token_number VARCHAR(50) NOT NULL UNIQUE,
  contact_id INT NOT NULL REFERENCES contacts(id),
  param_mitra_id INT REFERENCES users(id),
  card_type VARCHAR(50) NOT NULL DEFAULT 'Entry Card',
  card_number VARCHAR(50),
  amount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (amount >= 0),
  payment_mode VARCHAR(50) NOT NULL DEFAULT 'Complimentary',
  payment_status VARCHAR(30) NOT NULL DEFAULT 'Paid',
  card_collection_status VARCHAR(30) NOT NULL DEFAULT 'Collected',
  registered_name VARCHAR(120),
  verification_status VARCHAR(30) NOT NULL DEFAULT 'Not Verified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_links (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(40) NOT NULL UNIQUE,
  contact_id INT NOT NULL REFERENCES contacts(id),
  param_mitra_id INT REFERENCES users(id),
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 1),
  card_type VARCHAR(50) NOT NULL DEFAULT 'Entry Card',
  card_number VARCHAR(50),
  registered_name VARCHAR(120),
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  easebuzz_id VARCHAR(100),
  easebuzz_response JSONB,
  payment_url TEXT,
  registration_id INT REFERENCES registrations(id),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS duties (
  id SERIAL PRIMARY KEY,
  param_mitra_id INT REFERENCES users(id),
  title VARCHAR(150) NOT NULL,
  duty_type VARCHAR(50) NOT NULL DEFAULT 'Responsibility',
  due_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'Pending',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS meal_preferences (
  id SERIAL PRIMARY KEY,
  param_mitra_id INT NOT NULL UNIQUE REFERENCES users(id),
  standing_preference VARCHAR(50) NOT NULL DEFAULT 'Vegetarian',
  today_breakfast_opted BOOLEAN NOT NULL DEFAULT TRUE,
  today_lunch_opted BOOLEAN NOT NULL DEFAULT TRUE,
  daily_override_note VARCHAR(150),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Helpful indexes for the active dashboard, search, payment and verification paths.
CREATE INDEX IF NOT EXISTS idx_contacts_active_category ON contacts (category) WHERE is_archived = FALSE;
CREATE INDEX IF NOT EXISTS idx_contacts_search ON contacts (name, mobile);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_mitra_date ON demo_sessions (param_mitra_id, session_date);
CREATE INDEX IF NOT EXISTS idx_booking_holds_expiry ON booking_holds (status, expires_at);
CREATE INDEX IF NOT EXISTS idx_followups_mitra_due ON follow_ups (param_mitra_id, due_date);
CREATE INDEX IF NOT EXISTS idx_registrations_mitra_created ON registrations (param_mitra_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_contact ON registrations (contact_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_mitra_created ON payment_links (param_mitra_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_links_contact ON payment_links (contact_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON payment_links (status);

COMMIT;
