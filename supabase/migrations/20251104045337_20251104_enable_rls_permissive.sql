/*
  # Properly Enable RLS with Permissive Policies

  1. Enable RLS on property_listings
  2. Create permissive policies that allow all operations
  3. This allows both authenticated and unauthenticated users to access data
*/

ALTER TABLE property_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all" ON property_listings;
DROP POLICY IF EXISTS "insert_all" ON property_listings;
DROP POLICY IF EXISTS "update_all" ON property_listings;
DROP POLICY IF EXISTS "delete_all" ON property_listings;

CREATE POLICY "select_all" ON property_listings
  FOR SELECT
  USING (true);

CREATE POLICY "insert_all" ON property_listings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "update_all" ON property_listings
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "delete_all" ON property_listings
  FOR DELETE
  USING (true);