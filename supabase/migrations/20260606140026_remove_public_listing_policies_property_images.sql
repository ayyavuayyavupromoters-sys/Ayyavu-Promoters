-- Remove redundant SELECT policies on the public bucket 'property-images'.
-- Public buckets serve objects via public URLs without any SELECT policy.
-- These policies only allow clients to LIST all files, which exposes more data than intended.

DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
