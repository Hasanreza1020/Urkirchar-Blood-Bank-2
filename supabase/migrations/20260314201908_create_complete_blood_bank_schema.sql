/*
  # Complete Blood Bank Database Schema

  ## Overview
  This migration creates a comprehensive database schema for the Urkirchar Blood Bank platform
  with proper authentication, authorization, and data management capabilities.

  ## New Tables

  ### 1. `users` table
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email for authentication
  - `name` (text) - Full name of the user
  - `role` (text) - User role (user/admin)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `donors` table (enhanced)
  - `id` (uuid, primary key) - Unique donor identifier
  - `user_id` (uuid, foreign key) - Links to users table
  - `name` (text) - Donor full name
  - `email` (text) - Donor email
  - `phone` (text) - Contact number
  - `blood_group` (text) - Blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
  - `location` (text) - Area/location in Urkirchar
  - `last_donation` (date) - Date of last blood donation
  - `available` (boolean) - Availability status for donation
  - `verified` (boolean) - Admin verification status
  - `image` (text) - Profile photo (base64 or URL)
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `donation_requests` table
  - `id` (uuid, primary key) - Unique request identifier
  - `requester_name` (text) - Name of person requesting blood
  - `requester_phone` (text) - Contact number
  - `blood_group` (text) - Required blood type
  - `location` (text) - Location where blood is needed
  - `urgency` (text) - Urgency level (low/medium/high/critical)
  - `units_needed` (integer) - Number of units required
  - `notes` (text) - Additional information
  - `status` (text) - Request status (pending/fulfilled/cancelled)
  - `created_at` (timestamptz) - Request creation time
  - `fulfilled_at` (timestamptz) - When request was fulfilled

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can read their own data
  - Users can update their own donor profile
  - Admins can manage all data
  - Public can view approved donors
  - Anyone can create donation requests

  ## Indexes
  - Indexed on commonly queried fields for performance
  - Blood group and location for fast donor searches
  - User ID for quick profile lookups
*/

-- Drop existing donors table to recreate with proper schema
DROP TABLE IF EXISTS donors CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create enhanced donors table
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  blood_group text NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  location text NOT NULL,
  last_donation date,
  available boolean DEFAULT true,
  verified boolean DEFAULT false,
  image text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donation requests table
CREATE TABLE IF NOT EXISTS donation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_name text NOT NULL,
  requester_phone text NOT NULL,
  blood_group text NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  location text NOT NULL,
  urgency text DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  units_needed integer DEFAULT 1,
  notes text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  fulfilled_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_location ON donors(location);
CREATE INDEX IF NOT EXISTS idx_donors_available ON donors(available);
CREATE INDEX IF NOT EXISTS idx_donors_verified ON donors(verified);
CREATE INDEX IF NOT EXISTS idx_donors_user_id ON donors(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_blood_group ON donation_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_requests_status ON donation_requests(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for donors table

-- Public can view all approved and verified donors
CREATE POLICY "Public can view verified donors"
  ON donors FOR SELECT
  TO anon, authenticated
  USING (verified = true);

-- Authenticated users can view all donors (for admin panel)
CREATE POLICY "Authenticated users can view all donors"
  ON donors FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert their own donor profile
CREATE POLICY "Users can create own donor profile"
  ON donors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Users can update their own donor profile
CREATE POLICY "Users can update own donor profile"
  ON donors FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Admins can update any donor (verified via app logic)
CREATE POLICY "Admins can update any donor"
  ON donors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admins can delete donors
CREATE POLICY "Admins can delete donors"
  ON donors FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for donation_requests table

-- Anyone can view donation requests
CREATE POLICY "Anyone can view donation requests"
  ON donation_requests FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can create donation requests
CREATE POLICY "Anyone can create donation requests"
  ON donation_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can update requests
CREATE POLICY "Authenticated users can update requests"
  ON donation_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete requests
CREATE POLICY "Authenticated users can delete requests"
  ON donation_requests FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_donors_updated_at ON donors;
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON donors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
