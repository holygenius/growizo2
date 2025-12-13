-- Fix varchar column length issues in products table
-- Multiple columns were too restrictive for actual data

-- Step 1: Fix icon column - it stores full URLs (currently varchar(10), needs varchar(1000))
ALTER TABLE public.products 
ALTER COLUMN icon TYPE character varying(1000);

-- Step 2: Fix sku column - already done but verify it's varchar(255)
ALTER TABLE public.products 
ALTER COLUMN sku TYPE character varying(255);

-- Step 3: Verify all changes
-- Run this query to verify:
-- SELECT column_name, data_type, character_maximum_length 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' 
-- AND column_name IN ('sku', 'icon', 'product_type');
