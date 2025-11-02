/*
  # Fix RLS for Unauthenticated Access

  1. Security Updates
    - Drop existing policies
    - Add new policies with explicit unauthenticated access for SELECT
    - Keep INSERT/UPDATE/DELETE open for admin

  2. Changes
    - Allow all roles (including unauthenticated) to SELECT all properties
    - Keep public access for all other operations
*/

DROP POLICY IF EXISTS "Public can read all property listings" ON property_listings;
DROP POLICY IF EXISTS "Public can insert property listings" ON property_listings;
DROP POLICY IF EXISTS "Public can update property listings" ON property_listings;

CREATE POLICY "Enable read for all users"
  ON property_listings
  FOR SELECT
  TO public, authenticated
  USING (true);

CREATE POLICY "Enable insert for all"
  ON property_listings
  FOR INSERT
  TO public, authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for all"
  ON property_listings
  FOR UPDATE
  TO public, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for all"
  ON property_listings
  FOR DELETE
  TO public, authenticated
  USING (true);