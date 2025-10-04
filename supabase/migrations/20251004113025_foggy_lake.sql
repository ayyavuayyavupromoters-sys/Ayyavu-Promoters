/*
  # Fix Admin Upload RLS Policy

  1. Security Updates
    - Update RLS policies to allow admin uploads
    - Ensure anonymous users can still submit properties for approval
    - Maintain security for regular user operations

  2. Changes
    - Modify INSERT policy to allow admin uploads with approved status
    - Keep existing policies for user operations
*/

-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Anonymous users can submit property listings" ON property_listings;
DROP POLICY IF EXISTS "Users can create their own property listings" ON property_listings;

-- Create new INSERT policy that allows both anonymous submissions and admin uploads
CREATE POLICY "Allow property submissions and admin uploads"
  ON property_listings
  FOR INSERT
  TO public
  WITH CHECK (
    -- Allow anonymous users to submit properties with pending status
    (
      auth.uid() IS NULL 
      AND title IS NOT NULL 
      AND description IS NOT NULL 
      AND price IS NOT NULL 
      AND area IS NOT NULL 
      AND location IS NOT NULL 
      AND property_type IS NOT NULL 
      AND contact_name IS NOT NULL 
      AND contact_phone IS NOT NULL 
      AND contact_email IS NOT NULL 
      AND status = 'pending'
      AND user_id IS NULL
    )
    OR
    -- Allow authenticated users to create their own properties
    (
      auth.uid() IS NOT NULL 
      AND auth.uid() = user_id
    )
    OR
    -- Allow admin uploads (properties with approved status and no user_id)
    (
      title IS NOT NULL 
      AND description IS NOT NULL 
      AND price IS NOT NULL 
      AND area IS NOT NULL 
      AND location IS NOT NULL 
      AND property_type IS NOT NULL 
      AND contact_name IS NOT NULL 
      AND contact_phone IS NOT NULL 
      AND contact_email IS NOT NULL 
      AND status = 'approved'
      AND user_id IS NULL
    )
  );