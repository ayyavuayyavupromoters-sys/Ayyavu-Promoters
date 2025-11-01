/*
  # Contact Messages and Property Listings Schema

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `created_at` (timestamp)
    - `property_listings`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `price` (text)
      - `area` (text)
      - `location` (text)
      - `property_type` (text)
      - `contact_name` (text)
      - `contact_phone` (text)
      - `contact_email` (text)
      - `images` (text array)
      - `status` (text)
      - `user_id` (uuid)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access

  3. Storage
    - Create storage bucket for property images
*/

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create property_listings table
CREATE TABLE IF NOT EXISTS property_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price text NOT NULL,
  area text NOT NULL,
  location text NOT NULL,
  property_type text NOT NULL CHECK (property_type IN ('residential', 'commercial')),
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  images text[] DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_listings ENABLE ROW LEVEL SECURITY;

-- Contact messages policies
CREATE POLICY "Anyone can create contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Property listings policies - allow all public access for admin functionality
CREATE POLICY "Public can read all property listings"
  ON property_listings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert property listings"
  ON property_listings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update property listings"
  ON property_listings
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

CREATE POLICY "Anyone can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Anyone can delete property images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images');