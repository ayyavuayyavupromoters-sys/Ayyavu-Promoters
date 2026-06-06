-- Add missing RLS policies for admin panel operations.
-- The admin panel uses a client-side password (no Supabase Auth), so all
-- DB calls arrive as the anon role. Without these policies, UPDATE/DELETE
-- are silently blocked, and SELECT can't see pending/rejected rows.

-- Allow anon users to SELECT all property_listings (admin needs to see all statuses)
CREATE POLICY "Anon can read all property listings"
  ON public.property_listings FOR SELECT
  TO anon
  USING (true);

-- Allow anon users to UPDATE any property listing (admin edits)
CREATE POLICY "Anon can update any property listing"
  ON public.property_listings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anon users to DELETE any property listing (admin deletes)
CREATE POLICY "Anon can delete any property listing"
  ON public.property_listings FOR DELETE
  TO anon
  USING (true);
