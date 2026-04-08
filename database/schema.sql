-- eRide Database Schema
-- Run this in Supabase SQL Editor

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT CHECK (role IN ('rider', 'driver', 'admin')) DEFAULT 'rider',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  vehicle_type TEXT NOT NULL,
  vehicle_number TEXT NOT NULL,
  license_number TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_rides INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  area TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES drivers(id),
  pickup_location TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  pickup_lat DECIMAL(10,8),
  pickup_lng DECIMAL(11,8),
  drop_lat DECIMAL(10,8),
  drop_lng DECIMAL(11,8),
  ride_date DATE NOT NULL,
  ride_time TIME NOT NULL,
  vehicle_type TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  fare DECIMAL(10,2) DEFAULT 0,
  distance_km DECIMAL(10,2),
  eta INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  driver_id UUID REFERENCES drivers(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ride_date ON bookings(ride_date);
CREATE INDEX IF NOT EXISTS idx_feedback_driver ON feedback(driver_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Public access policies (for MVP without auth)
-- TODO: Update these policies when authentication is added

CREATE POLICY "Allow public read users" ON users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert users" ON users FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public read drivers" ON drivers FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert drivers" ON drivers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update drivers" ON drivers FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow public read bookings" ON bookings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert bookings" ON bookings FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON bookings FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow public read feedback" ON feedback FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public insert feedback" ON feedback FOR INSERT TO anon WITH CHECK (true);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION: Add missing columns to existing tables
-- ============================================================================

-- Add avg_rating to drivers if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='drivers' AND column_name='avg_rating') THEN
    ALTER TABLE drivers ADD COLUMN avg_rating DECIMAL(3,2) DEFAULT 0;
  END IF;
END $$;

-- Add total_ratings to drivers if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='drivers' AND column_name='total_ratings') THEN
    ALTER TABLE drivers ADD COLUMN total_ratings INTEGER DEFAULT 0;
  END IF;
END $$;
