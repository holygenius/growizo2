-- Fix Supabase Storage RLS Policies for product-images bucket
-- This script enables proper access to the product-images storage bucket

-- First, ensure RLS is enabled on the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional, but safer)
DROP POLICY IF EXISTS "Allow authenticated users to upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update product images" ON storage.objects;

-- Policy 1: Allow authenticated users to upload files to product-images bucket
CREATE POLICY "Allow authenticated users to upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Policy 2: Allow public read access to product images
CREATE POLICY "Allow public read access to product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Policy 3: Allow authenticated users to delete product images
CREATE POLICY "Allow authenticated users to delete product images" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to update product images
CREATE POLICY "Allow authenticated users to update product images" 
ON storage.objects FOR UPDATE 
WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
