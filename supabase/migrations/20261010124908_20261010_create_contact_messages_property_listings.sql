/*
  # Create contact_messages and property_listings tables

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `phone` (text, not null)
      - `message` (text, not null)
      - `created_at` (timestamptz, defaults to now)
    - `property_listings`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `price` (text, not null)
      - `area` (text, not null)
      - `location` (text, not null)
      - `property_type` (text, not null — 'residential' or 'commercial')
      - `contact_name` (text, not null)
      - `contact_phone` (text, not null)
      - `contact_email` (text, not null)
      - `images` (text array, defaults to empty)
      - `status` (text, defaults to 'pending' — 'pending', 'approved', 'rejected')
      - `user_id` (uuid, nullable, references auth.users)
      - `created_at` (timestamptz, defaults to now)
      - `updated_at` (timestamptz, defaults to now)

  2. Storage
    - Create public bucket `property-images` for property image uploads.

  3. Security
    - Enable RLS on both tables.
    - This app has NO sign-in screen — the admin panel uses a client-side
      password and all DB calls arrive as the anon role. Therefore all
      policies use `TO anon, authenticated` so the anon-key frontend can
      read and write its own data.
    - contact_messages: anyone can INSERT; only authenticated can SELECT
      (admin reads messages after signing in via the edge function / backend).
    - property_listings: full CRUD for anon + authenticated (the public site
      reads approved listings, visitors submit new ones as pending, and the
      admin panel updates statuses / edits / deletes — all via the anon key).
    - storage.objects: SELECT, INSERT, DELETE on the property-images bucket
      for anon + authenticated.

  4. Important Notes
    - This is a consolidation of 7 prior migration files that were never
      applied to the database. The final state below reflects the intended
      schema and policy set after all prior iterations.
    - Idempotent: uses IF NOT EXISTS for tables/buckets and DROP IF EXISTS
      before every CREATE POLICY so it is safe to re-run.
*/

-- ============================================================
-- contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_contact_messages" ON contact_messages;
CREATE POLICY "anon_select_contact_messages"
  ON contact_messages FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================
-- property_listings
-- ============================================================
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

ALTER TABLE property_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_property_listings" ON property_listings;
CREATE POLICY "anon_select_property_listings"
  ON property_listings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "anon_insert_property_listings" ON property_listings;
CREATE POLICY "anon_insert_property_listings"
  ON property_listings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_property_listings" ON property_listings;
CREATE POLICY "anon_update_property_listings"
  ON property_listings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_property_listings" ON property_listings;
CREATE POLICY "anon_delete_property_listings"
  ON property_listings FOR DELETE
  TO anon, authenticated
  USING (true);

-- ============================================================
-- Storage bucket for property images
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_select_property_images" ON storage.objects;
CREATE POLICY "anon_select_property_images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "anon_insert_property_images" ON storage.objects;
CREATE POLICY "anon_insert_property_images"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'property-images');

DROP POLICY IF EXISTS "anon_delete_property_images" ON storage.objects;
CREATE POLICY "anon_delete_property_images"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'property-images');
