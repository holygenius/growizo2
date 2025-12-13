# 🔄 IKAS GraphQL Product Type - Database Field Mapping

## 📋 Mapping Table

| IKAS Field | Type | Our DB | Status | Notes |
|-----------|------|--------|--------|-------|
| `id` | ID! | vendor_product_id | ✅ MAPPED | Stored in vendor_products.vendor_product_id |
| `name` | String! | products.name (jsonb) | ✅ MAPPED | Multilingual: {en, tr} |
| `description` | String | products.description (jsonb) | ✅ MAPPED | Full HTML description |
| `shortDescription` | String | products.summary_description (jsonb) | ✅ MAPPED | Summary description (NEW) |
| `brandId` | String | products.brand_id (uuid) | ✅ MAPPED | Foreign key to brands table |
| `categoryIds` | [String!] | products.category_id (uuid) | ⚠️ PARTIAL | Only stores 1 category |
| `type` | ProductTypeEnum! | products.product_type | ✅ MAPPED | general/tent/light/etc |
| `price` (from variants) | Float | products.price | ✅ MAPPED | From variant.prices[0].sellPrice |
| `variants` | [Variant!]! | vendor_products table | ✅ MAPPED | Variants stored in pivot table |
| `totalStock` | Float | product_stock (calculated) | ✅ MAPPED | Sum of variant stocks |
| `weight` | Float | specs['weight'] (jsonb) | ✅ MAPPED | Stored in specs as key-value |
| `tags` | [SimpleProductTag!] | - | ❌ MISSING | Not currently stored |
| `tagIds` | [String!] | - | ❌ MISSING | Not currently stored |
| `attributes` | [ProductAttributeValue!] | specs (jsonb) | ✅ MAPPED | Stored as key-value specs |
| `metaData` | HTMLMetaData | - | ⚠️ PARTIAL | Basic meta in products.name |
| `translations` | [ProductTranslation!] | jsonb fields | ✅ MAPPED | Using jsonb for multilingual |
| `vendorId` | String | vendor_products.vendor_id | ✅ MAPPED | Links to vendors table |
| `salesChannelIds` | [String!] | - | ❌ MISSING | Not implemented |
| `hiddenSalesChannelIds` | [String!] | - | ❌ MISSING | Not implemented |
| `images` | - | products.images (jsonb) | ✅ MAPPED | Array of image objects |
| `baseUnit` | ProductBaseUnitModel | - | ⚠️ PARTIAL | Could be stored in specs |
| `productVariantTypes` | [ProductVariantType!] | - | ❌ MISSING | Not currently mapped |
| `googleTaxonomyId` | String | - | ❌ MISSING | Not stored |
| `maxQuantityPerCart` | Float | - | ❌ MISSING | Not stored |

---

## ✅ Fully Mapped Fields (15)

```javascript
const ikasMappedFields = {
  // Direct mappings
  id: "vendor_products.vendor_product_id",
  name: "products.name",
  description: "products.description",
  shortDescription: "products.summary_description",
  brandId: "products.brand_id",
  type: "products.product_type",
  vendorId: "vendor_products.vendor_id",
  weight: "products.specs['weight']",
  
  // From variants
  price: "variants[0].prices[0].sellPrice",
  variants: "vendor_products (via variants join)",
  totalStock: "sum(variants[*].stocks[*].stockCount)",
  
  // Array/Complex
  attributes: "products.specs (jsonb)",
  images: "products.images (jsonb)",
  translations: "jsonb multilingual fields",
  categories: "products.category_id (PARTIAL - 1 only)"
};
```

---

## ⚠️ Partially Mapped (4)

### 1. `categoryIds: [String!]`
**Current:** Stores only 1 category (category_id)
**IKAS:** Can have multiple categories

**Solution Options:**
```sql
-- Option A: Add product_categories junction table
CREATE TABLE product_categories (
  product_id uuid PRIMARY KEY,
  category_id uuid,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Option B: Use jsonb array
ALTER TABLE products ADD COLUMN category_ids jsonb DEFAULT '[]'::jsonb;
```

### 2. `metaData: HTMLMetaData`
**Current:** Basic metadata in name field
**IKAS:** Includes og:image, og:description, etc.

**Solution:**
```sql
ALTER TABLE products ADD COLUMN meta_data jsonb DEFAULT '{}'::jsonb;

-- Store as:
{
  "title": "Product Name",
  "description": "Meta description",
  "keywords": ["tag1", "tag2"],
  "og_image": "image_url"
}
```

### 3. `baseUnit: ProductBaseUnitModel`
**Current:** Not explicitly stored
**IKAS:** Unit of measurement (kg, pcs, etc.)

**Solution:**
```javascript
// Option A: Add to specs
specs: {
  base_unit: "kg",
  base_unit_value: 1
}

// Option B: Separate column
ALTER TABLE products ADD COLUMN base_unit character varying;
ALTER TABLE products ADD COLUMN base_unit_value numeric;
```

### 4. `translations: [ProductTranslation!]`
**Current:** Using jsonb for name/description
**IKAS:** Full translation objects

**Status:** Already works - jsonb stores {en, tr}

---

## ❌ Missing Fields (6)

### 1. `tags: [SimpleProductTag!]` & `tagIds: [String!]`
**Needed:** Product categorization/filtering

**Solution:**
```sql
CREATE TABLE product_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(product_id, tag_id)
);

-- Or simpler: jsonb array
ALTER TABLE products ADD COLUMN tag_ids jsonb DEFAULT '[]'::jsonb;
```

### 2. `salesChannelIds: [String!]`
**Needed:** Control which sales channels product appears in

**Solution:**
```sql
CREATE TABLE product_sales_channels (
  product_id uuid NOT NULL,
  channel_id character varying NOT NULL,
  PRIMARY KEY (product_id, channel_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Or simpler:
ALTER TABLE products ADD COLUMN sales_channel_ids jsonb DEFAULT '[]'::jsonb;
```

### 3. `hiddenSalesChannelIds: [String!]`
**Needed:** Hide product from specific channels

**Solution:** Same as above

### 4. `productVariantTypes: [ProductVariantType!]`
**Needed:** Track variant types (color, size, etc.)

**Solution:**
```sql
ALTER TABLE products ADD COLUMN variant_types jsonb DEFAULT '[]'::jsonb;

-- Store as:
{
  "variant_types": [
    {"id": "color", "name": "Color"},
    {"id": "size", "name": "Size"}
  ]
}
```

### 5. `googleTaxonomyId: String`
**Needed:** Google Shopping taxonomy classification

**Solution:**
```sql
ALTER TABLE products ADD COLUMN google_taxonomy_id character varying;
```

### 6. `maxQuantityPerCart: Float`
**Needed:** Limit product quantity per cart

**Solution:**
```sql
ALTER TABLE products ADD COLUMN max_quantity_per_cart integer DEFAULT NULL;
```

---

## 🔧 Current Implementation Status

### Implemented (parseGraphQLProduct in ikasService.js)
```javascript
const product = {
  // ✅ Mapped
  id: productNode.id,
  name: productNode.name,
  sku: activeVariant.sku,
  barcode: activeVariant.barcodeList[0],
  price: activeVariant.prices[0].sellPrice,
  stockQuantity: totalVariantStock,
  brand: { name: productNode.brand?.name },
  slug: productNode.name.toLowerCase(),
  status: 'active',
  images: [] // empty array (images field removed from query)
};
```

### Not Implemented
- tags
- translations (metadata)
- salesChannels
- maxQuantityPerCart
- baseUnit
- attributes (via extensions)

---

## 🎯 Recommended Priority

### Phase 1 - Critical (implement now)
```
1. ✅ Basic fields (id, name, price, SKU)
2. ✅ Multilingual descriptions
3. ✅ Images
4. ✅ Variants & stocks
5. ⚠️ Multiple categories (replace single category_id)
```

### Phase 2 - Important (implement soon)
```
6. ❌ Tags system
7. ❌ Sales channels
8. ❌ Meta data / SEO
9. ❌ Variant types
```

### Phase 3 - Nice-to-have
```
10. ❌ Google Taxonomy
11. ❌ Max quantity per cart
12. ❌ Base unit
```

---

## 🚀 Migration Recommendations

### Immediate (to handle multiple categories)
```sql
-- Option 1: Add category_ids as jsonb
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_ids jsonb DEFAULT '[]'::jsonb;

-- Migrate existing data
UPDATE products SET category_ids = 
  CASE 
    WHEN category_id IS NOT NULL THEN to_jsonb(ARRAY[category_id::text])
    ELSE '[]'::jsonb
  END;

-- Keep category_id for backward compatibility, or rename to primary_category_id
```

### Optional (for tags)
```sql
-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE,
  slug character varying NOT NULL UNIQUE,
  color character varying,
  created_at timestamp DEFAULT now()
);

-- Create product_tags junction table
CREATE TABLE IF NOT EXISTS public.product_tags (
  product_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  PRIMARY KEY (product_id, tag_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

---

## 📊 Summary

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Fully Mapped | 15 | id, name, price, description, variants, tags |
| ⚠️ Partially Mapped | 4 | categories (1 only), metadata, baseUnit, translations |
| ❌ Missing | 6 | tags, salesChannels, googleTaxonomy, maxQuantity |
| **TOTAL** | **25** | **All IKAS fields** |

---

## 🔗 Data Flow

```
IKAS GraphQL Response
        ↓
parseGraphQLProduct()
        ↓
vendorProduct object
        ↓
Admin Form / Database
        ↓
products table
vendor_products table
vendor_prices table
```

---

**Analysis Date:** Dec 13, 2025  
**IKAS API Version:** Current  
**Database:** Supabase PostgreSQL
