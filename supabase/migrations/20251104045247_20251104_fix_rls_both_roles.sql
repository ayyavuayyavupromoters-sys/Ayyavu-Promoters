/*
  # Fix RLS to Allow Both Public and Authenticated Roles

  1. Security Update
    - Drop existing policies that only allow 'public' role
    - Add new policies that allow both 'public' and 'authenticated' roles
    - This ensures client-side queries work regardless of authentication state

  2. Changes
    - All policies now support both roles: public, authenticated
*/

DROP POLICY IF EXISTS "Enable read for all users" ON property_listings;
DROP POLICY IF EXISTS "Enable insert for all" ON property_listings;
DROP POLICY IF EXISTS "Enable update for all" ON property_listings;
DROP POLICY IF EXISTS "Enable delete for all" ON property_listings;

CREATE POLICY "Allow all to select"
  ON property_listings
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert"
  ON property_listings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update"
  ON property_listings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete"
  ON property_listings
  FOR DELETE
  USING (true);