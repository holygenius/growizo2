-- =====================================================
-- Create brand-images bucket for brand logos/icons
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-images', 'brand-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Brand Images Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Brand Images Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Brand Images Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Brand Images Authenticated Delete" ON storage.objects;

-- 3. Create access policies for brand-images bucket

-- Public read access for everyone
CREATE POLICY "Brand Images Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-images');

-- Authenticated users can upload
CREATE POLICY "Brand Images Authenticated Upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'brand-images' AND auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Brand Images Authenticated Update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'brand-images' AND auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Brand Images Authenticated Delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'brand-images' AND auth.role() = 'authenticated');

-- =====================================================
-- IMPORTANT: Also add your UUID to admin_users table
-- =====================================================

-- Add yourself as admin (replace with your actual email if different)
INSERT INTO admin_users (id, email, role, is_active)
VALUES ('11653139-fda7-4a02-a63b-075f316195fd', '90yigit@gmail.com', 'super_admin', true)
ON CONFLICT (id) DO UPDATE SET is_active = true, role = 'super_admin';

-- Verify admin was added
SELECT * FROM admin_users WHERE id = '11653139-fda7-4a02-a63b-075f316195fd';
