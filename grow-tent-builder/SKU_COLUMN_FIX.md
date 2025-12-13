# Product Creation Error Fix - SKU Column Length

## Problem
When trying to create a product, you're getting the error:
```
value too long for type character varying(10)
```

This occurs when submitting product data with a SKU (like a UUID: `f0e8e89e-88f9-4ab6-bc8f-ec5f991203fb` which is 36 characters), but the database column `products.sku` is limited to 10 characters.

## Root Cause
The `sku` column in your Supabase `products` table is defined as `VARCHAR(10)`, which is too small for:
- UUIDs (36 characters)
- Product codes longer than 10 characters
- IKAS vendor IDs

## Solution
Run the migration script to increase the SKU column size to 255 characters.

## Steps to Fix

### 1. Execute Migration Script in Supabase Console
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `scripts/fix-sku-column-length.sql`:

```sql
ALTER TABLE public.products 
ALTER COLUMN sku TYPE character varying(255);
```

5. Click **Run** button

### 2. Verify the Change
Run this verification query in the SQL Editor:

```sql
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'sku';
```

**Expected result:**
- `character_maximum_length` should now show `255` instead of `10`

### 3. Test Product Creation
Once the migration is complete, try creating a product again. The error should be resolved.

## What Was Changed
- **File**: `scripts/fix-sku-column-length.sql` (NEW)
- **File**: `scripts/supabase-schema.sql` (UPDATED)
- **Column**: `products.sku` changed from `character varying(10)` to `character varying(255)`

## Why This Length?
- **36 characters**: Minimum for UUIDs (IKAS vendor IDs)
- **255 characters**: Standard safe maximum for VARCHAR columns that need flexibility
- Won't cause performance issues for indexed columns like SKU

## Related Issues
This fix also applies to:
- IKAS product imports (which use vendor IDs as SKUs)
- Any future product creation with longer identifiers
- Bulk product uploads with custom SKUs

## Database Schema Update
The `scripts/supabase-schema.sql` file has been updated to document this column correctly for future deployments.
