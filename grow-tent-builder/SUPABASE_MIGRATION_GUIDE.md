# Supabase Data Migration Guide

This guide explains how to add the required data to Supabase for the Grow Tent Builder application.

## Overview

The application uses Supabase as its backend database. The data is organized into several tables:

1. **brands** - Product brands (BioBizz, CANNA, Mars Hydro, etc.)
2. **categories** - Product categories (nutrients, lighting, ventilation, etc.)
3. **products** - All products (nutrients, tents, lights, fans, etc.)
4. **feeding_schedules** - Weekly feeding schedules for different substrate types
5. **feeding_schedule_products** - Individual products with their weekly dosages
6. **preset_sets** - Pre-configured complete grow setups
7. **blog_posts** - Blog articles and guides
8. **user_builds** - User-saved configurations
9. **admin_users** - Admin users for content management

## Data Files

The following data files have been created in `src/data/`:

### 1. builderProducts.js

Contains all builder product categories:
- **TENT_PRODUCTS** - Grow tents (Secret Jardin, etc.)
- **LED_PRODUCTS** - LED grow lights (Mars Hydro, etc.)
- **FAN_PRODUCTS** - Inline fans (AC Infinity, etc.)
- **CARBON_FILTER_PRODUCTS** - Carbon filters
- **VENTILATION_SETS** - Complete ventilation sets
- **DUCTING_PRODUCTS** - Aluminum ducting
- **SUBSTRATE_PRODUCTS** - Growing media (BioBizz All-Mix, Light-Mix, Coco-Mix)
- **POT_PRODUCTS** - Fabric pots
- **TIMER_PRODUCTS** - Smart plugs and timers
- **MONITORING_PRODUCTS** - Temperature and humidity monitors
- **HANGER_PRODUCTS** - Rope hangers
- **CO2_ODOR_PRODUCTS** - Odor control products
- **NUTRIENT_PRODUCTS** - Liquid nutrients

### 2. feedingScheduleData.js

Contains BioBizz feeding schedule data:
- **FEEDING_SCHEDULE_DATA** - Weekly dosages for each BioBizz product
- **SUBSTRATE_TYPES** - Available substrate types (All-Mix, Light-Mix, Coco-Mix)
- **PHASE_INFO** - Growth phase information (rooting, vegetative, flowering, flush, harvest)
- **PRODUCT_CATEGORIES** - Product category definitions

### 3. presetSets.js

Contains pre-configured complete grow setups:
- Entry-level setup with BioBizz (small tent, 2-3 plants)
- Standard setup with BioBizz (medium tent, 4-6 plants)
- Premium setup with BioBizz (large tent, 6-9 plants)
- Entry-level coco setup with CANNA
- Standard setup with Advanced Nutrients

## Migration Process

### Step 1: Setup Supabase Tables

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new`
3. Copy the entire contents of `scripts/supabase-schema.sql`
4. Paste into the SQL Editor
5. Click "Run" to create all tables, indexes, triggers, and RLS policies
6. Wait for the success message

### Step 2: Configure Environment Variables

Create a `.env.local` file in the project root with:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from:
`https://supabase.com/dashboard/project/YOUR_PROJECT_ID/settings/api`

### Step 3: Run Migration Scripts

Run the migration scripts in this order:

```bash
# 1. Migrate basic product data (BioBizz, CANNA, Advanced Nutrients)
node scripts/migrate-data.js

# 2. Migrate builder products (tents, lights, fans, etc.)
node scripts/migrate-builder-products.js

# 3. Migrate feeding schedules and preset sets
node scripts/migrate-feeding-presets.js

# 4. (Optional) Migrate blog posts if you have blog data
node scripts/migrate-blog.js
```

### Step 4: Verify Data

Check the Supabase dashboard to verify all data has been imported:

1. Go to Table Editor
2. Browse each table to verify records
3. Check that RLS policies are working by testing queries

## Data Structure

### Products Table

Each product has:
- `sku` - Unique product identifier
- `name` - Product name in multiple languages (JSONB)
- `description` - Product description (JSONB)
- `price` - Price in local currency (integer)
- `product_type` - tent, light, fan, filter, substrate, etc.
- `specs` - Product specifications (JSONB, varies by type)
- `images` - Array of image URLs
- `brand_id` - Reference to brands table
- `category_id` - Reference to categories table

### Feeding Schedule Products Table

Each feeding product has:
- `id` - Product identifier (e.g., 'bio-grow', 'root-juice')
- `product_name` - Display name
- `category` - Product category
- `dose_unit` - Unit of measurement (e.g., 'ml/L')
- `schedule_allmix` - Weekly dosages for All-Mix substrate (JSONB)
- `schedule_lightmix_coco` - Weekly dosages for Light-Mix/Coco (JSONB)

### Preset Sets Table

Each preset set has:
- `name` - Set name in multiple languages (JSONB)
- `description` - Set description (JSONB)
- `tier` - entry, standard, or premium
- `tent_size` - Tent dimensions (JSONB)
- `media_type` - Substrate type
- `nutrient_brand` - Brand of nutrients included
- `plant_count` - Number of plants
- `items` - Complete list of included products (JSONB)
- `products` - Normalized product array (JSONB)
- `total_price` - Total cost

## Adding New Data

### Adding a New Product

1. Add the product to the appropriate array in `builderProducts.js`
2. Run the migration script: `node scripts/migrate-builder-products.js`
3. The script will skip existing products and only add new ones

### Adding a New Preset Set

1. Add the preset to `PRESET_SETS` in `presetSets.js`
2. Run: `node scripts/migrate-feeding-presets.js`
3. Update the `totalPrice` based on included products

### Adding a New Feeding Schedule Product

1. Add the product to `FEEDING_SCHEDULE_DATA` in `feedingScheduleData.js`
2. Include both `schedule_allmix` and `schedule_lightmix_coco` objects
3. Run: `node scripts/migrate-feeding-presets.js`

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the schema creation SQL first
- Check that the table name matches exactly

### Error: "duplicate key value violates unique constraint"
- The product already exists
- Either delete the existing product or use upsert instead of insert

### Error: "permission denied for table"
- Check RLS policies
- Verify you're using the correct Supabase key (anon key for migrations)
- For admin operations, you may need the service_role key

### Products not showing in app
- Check that `is_active = true` for the products
- Verify RLS policies allow public read access
- Check that the product_type matches what the app expects

## API Integration

The app uses these API services:
- `builderProductsApi.js` - Fetches products by type
- `feedingScheduleApi.js` - Fetches feeding schedules and products
- `presetSetsApi.js` - Fetches preset sets

Each API has caching to improve performance. To clear cache during development:
```javascript
import { clearProductsCache } from './services/api/builderProductsApi';
clearProductsCache();
```

## Security

- All tables use Row Level Security (RLS)
- Public users can only read active records
- Write operations require admin authentication
- Admin users are managed in the `admin_users` table
- Service role key should never be exposed to the client

## Next Steps

After setting up the data:
1. Test the application locally
2. Verify all products display correctly
3. Test the feeding schedule calculator
4. Test preset set selection
5. Deploy to production
6. Update production Supabase with the same data

## Notes

- All prices are stored as integers (no decimals)
- All text content supports multiple languages (en, tr)
- Images should be stored in `/public/images/` or a CDN
- Product SKUs should be unique and URL-friendly
- Use lowercase with hyphens for IDs (e.g., 'mars-hydro-ts1000')
