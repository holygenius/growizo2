-- Add missing fields to products table
-- This script adds the summary_description field to the products table

-- Add summary_description column (JSONB for multi-language support)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS summary_description jsonb DEFAULT '{}'::jsonb;

-- Update the column comment to document its purpose
COMMENT ON COLUMN public.products.summary_description IS 'Short product description for cards and listings (supports multi-language via JSONB)';

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'summary_description';
