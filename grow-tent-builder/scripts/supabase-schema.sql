-- ============================================
-- GROW TENT BUILDER - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/liyjajmawgwrniywtyko/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. BRANDS (Markalar)
-- ============================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    icon VARCHAR(10),
    color VARCHAR(20),
    description JSONB DEFAULT '{}', -- {en: "...", tr: "..."}
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CATEGORIES (Kategoriler)
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(50) UNIQUE NOT NULL,
    name JSONB NOT NULL, -- {en: "Base Nutrients", tr: "Temel Besinler"}
    icon VARCHAR(10),
    parent_category_id UUID REFERENCES categories(id),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PRODUCTS (Ürünler)
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Basic Info
    name JSONB NOT NULL, -- {en: "Bio-Grow", tr: "Bio-Grow"}
    description JSONB DEFAULT '{}',
    function_detailed JSONB DEFAULT '{}',
    key_properties JSONB DEFAULT '{}',
    
    -- Pricing & Packaging
    price INTEGER DEFAULT 0, -- TL cinsinden (kuruş yok)
    available_packaging TEXT[] DEFAULT '{}',
    
    -- Product Specs (flexible JSONB for different product types)
    specs JSONB DEFAULT '{}', -- watts, dimensions, coverage, etc.
    
    -- Media Compatibility (for nutrients)
    compatible_media TEXT[] DEFAULT ARRAY['soil', 'coco', 'hydro'],
    
    -- Images
    images TEXT[] DEFAULT '{}',
    icon VARCHAR(10),
    
    -- Product Type
    product_type VARCHAR(50) DEFAULT 'general', -- nutrient, tent, light, fan, accessory, substrate
    
    -- Flags
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. FEEDING SCHEDULES (Besleme Programları)
-- ============================================
CREATE TABLE feeding_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name JSONB NOT NULL, -- {en: "BioBizz Soil Schedule", tr: "BioBizz Toprak Programı"}
    substrate_type VARCHAR(50) NOT NULL, -- soil, coco, hydro
    
    -- Weekly dosage matrix
    -- Format: { "week_1": { "product_sku": "2ml/L", ... }, "week_2": {...} }
    schedule_data JSONB NOT NULL,
    
    -- Growth phases mapping
    phases JSONB DEFAULT '{}', -- { "veg": [1,2,3,4], "flower": [5,6,7,8,9,10] }
    
    notes JSONB DEFAULT '{}', -- {en: "...", tr: "..."}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4b. FEEDING SCHEDULE PRODUCTS (Besleme Programı Ürünleri)
-- ============================================
CREATE TABLE feeding_schedule_products (
    id VARCHAR(100) PRIMARY KEY, -- product SKU/ID like 'bio-grow', 'root-juice'
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- base_nutrient, stimulator_root, bloom_booster, etc.
    dose_unit VARCHAR(20) DEFAULT 'ml/L',
    
    -- Weekly schedules for different substrate types
    schedule_allmix JSONB DEFAULT '{}', -- {"WK 1": 1, "WK 2": 2, ...}
    schedule_lightmix_coco JSONB DEFAULT '{}', -- {"WK 1": 1, "WK 2": 2, ...}
    
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. PRESET SETS (Hazır Setler)
-- ============================================
CREATE TABLE preset_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL, -- {en: "Starter Kit", tr: "Başlangıç Seti"}
    description JSONB DEFAULT '{}',
    tier VARCHAR(20) DEFAULT 'standard', -- entry, standard, premium
    
    -- Tent configuration
    tent_size JSONB DEFAULT '{}', -- {width: 120, depth: 120, height: 200, unit: 'cm'}
    media_type VARCHAR(50), -- all-mix, light-mix, coco-mix
    nutrient_brand VARCHAR(50), -- BioBizz, CANNA, Advanced Nutrients
    plant_count INTEGER DEFAULT 1,
    
    -- Products in this preset (original items structure)
    items JSONB DEFAULT '{}', -- Original structure with tent, lighting, ventilation, etc.
    
    -- Products in this preset (normalized array)
    -- Format: [{ "sku": "product-id", "quantity": 1, "type": "tent" }, ...]
    products JSONB NOT NULL DEFAULT '[]',
    
    -- Calculated totals (updated via trigger)
    total_price INTEGER DEFAULT 0,
    
    -- Display
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. BLOG POSTS
-- ============================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug JSONB NOT NULL, -- {en: "growing-tips", tr: "yetistirme-ipuclari"}
    title JSONB NOT NULL,
    excerpt JSONB DEFAULT '{}',
    content JSONB NOT NULL, -- Full markdown/HTML content
    
    -- Meta
    category VARCHAR(50),
    author VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    
    -- Media
    image_url TEXT,
    
    -- Interactive content
    quiz JSONB DEFAULT NULL, -- Quiz questions if any
    
    -- Publishing
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    
    -- SEO
    meta_title JSONB DEFAULT '{}',
    meta_description JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. USER BUILDS (Kullanıcı Yapılandırmaları) - Opsiyonel
-- ============================================
CREATE TABLE user_builds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100), -- Anonymous session tracking
    
    -- Tent configuration
    tent_size JSONB DEFAULT '{}', -- {width: 4, depth: 4, height: 7, unit: 'ft'}
    media_type VARCHAR(50),
    
    -- Selected items
    selected_items JSONB DEFAULT '{}', -- Full selection state
    
    -- Totals
    total_cost INTEGER DEFAULT 0,
    total_power INTEGER DEFAULT 0,
    
    -- Flags
    is_completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. ADMIN USERS (Admin Kullanıcıları)
-- ============================================
CREATE TABLE admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'editor', -- admin, editor
    display_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES (Performans için)
-- ============================================
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_sku ON products(sku);

CREATE INDEX idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);

CREATE INDEX idx_feeding_schedules_brand ON feeding_schedules(brand_id);
CREATE INDEX idx_feeding_schedules_substrate ON feeding_schedules(substrate_type);

CREATE INDEX idx_feeding_schedule_products_category ON feeding_schedule_products(category);
CREATE INDEX idx_feeding_schedule_products_active ON feeding_schedule_products(is_active);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feeding_schedules_updated_at BEFORE UPDATE ON feeding_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feeding_schedule_products_updated_at BEFORE UPDATE ON feeding_schedule_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preset_sets_updated_at BEFORE UPDATE ON preset_sets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_builds_updated_at BEFORE UPDATE ON user_builds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_schedule_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE preset_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (Herkes okuyabilir)
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read feeding_schedules" ON feeding_schedules FOR SELECT USING (is_active = true);
CREATE POLICY "Public read feeding_schedule_products" ON feeding_schedule_products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read preset_sets" ON preset_sets FOR SELECT USING (is_active = true);
CREATE POLICY "Public read published blog_posts" ON blog_posts FOR SELECT USING (is_published = true);

-- USER BUILDS (Herkes kendi session'ını oluşturabilir)
CREATE POLICY "Anyone can create builds" ON user_builds FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read builds" ON user_builds FOR SELECT USING (true);
CREATE POLICY "Anyone can update builds" ON user_builds FOR UPDATE USING (true);

-- ADMIN POLICIES (Helper function)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can do everything
CREATE POLICY "Admin full access brands" ON brands FOR ALL USING (is_admin());
CREATE POLICY "Admin full access categories" ON categories FOR ALL USING (is_admin());
CREATE POLICY "Admin full access products" ON products FOR ALL USING (is_admin());
CREATE POLICY "Admin full access feeding_schedules" ON feeding_schedules FOR ALL USING (is_admin());
CREATE POLICY "Admin full access feeding_schedule_products" ON feeding_schedule_products FOR ALL USING (is_admin());
CREATE POLICY "Admin full access preset_sets" ON preset_sets FOR ALL USING (is_admin());
CREATE POLICY "Admin full access blog_posts" ON blog_posts FOR ALL USING (is_admin());
CREATE POLICY "Admin read admin_users" ON admin_users FOR SELECT USING (is_admin());

-- ============================================
-- INITIAL DATA - Categories
-- ============================================
INSERT INTO categories (key, name, icon, display_order) VALUES
('base_nutrients', '{"en": "Base Nutrients", "tr": "Temel Besinler"}', '🌱', 1),
('growth_enhancers', '{"en": "Growth Enhancers", "tr": "Büyüme Destekleyiciler"}', '📈', 2),
('bloom_boosters', '{"en": "Bloom Boosters", "tr": "Çiçek Destekleyiciler"}', '🌸', 3),
('root_stimulators', '{"en": "Root Stimulators", "tr": "Kök Uyarıcılar"}', '🌿', 4),
('additives', '{"en": "Additives", "tr": "Katkılar"}', '⚗️', 5),
('ph_control', '{"en": "pH Control", "tr": "pH Kontrol"}', '🧪', 6),
('substrates', '{"en": "Substrates", "tr": "Yetiştirme Ortamları"}', '🪴', 7),
('tents', '{"en": "Grow Tents", "tr": "Yetiştirme Çadırları"}', '🏕️', 10),
('lighting', '{"en": "Lighting", "tr": "Aydınlatma"}', '💡', 11),
('ventilation', '{"en": "Ventilation", "tr": "Havalandırma"}', '🌬️', 12),
('monitoring', '{"en": "Monitoring", "tr": "İzleme"}', '📊', 13),
('accessories', '{"en": "Accessories", "tr": "Aksesuarlar"}', '🔧', 14);

-- ============================================
-- INITIAL DATA - Brands
-- ============================================
INSERT INTO brands (name, slug, icon, color, description, display_order) VALUES
('BioBizz', 'biobizz', '🌿', '#22C55E', '{"en": "Organic nutrient solutions", "tr": "Organik besin çözümleri"}', 1),
('CANNA', 'canna', '🌱', '#16A34A', '{"en": "Professional nutrient systems", "tr": "Profesyonel besin sistemleri"}', 2),
('Advanced Nutrients', 'advanced-nutrients', '🧪', '#7C3AED', '{"en": "pH Perfect technology", "tr": "pH Perfect teknolojisi"}', 3),
('Secret Jardin', 'secret-jardin', '🏕️', '#F59E0B', '{"en": "Premium grow tents", "tr": "Premium yetiştirme çadırları"}', 4),
('Mars Hydro', 'mars-hydro', '💡', '#EF4444', '{"en": "LED grow lights", "tr": "LED yetiştirme ışıkları"}', 5),
('AC Infinity', 'ac-infinity', '🌬️', '#3B82F6', '{"en": "Ventilation systems", "tr": "Havalandırma sistemleri"}', 6);

-- ============================================
-- DONE! 
-- ============================================
-- Tables created successfully!
-- Now run the migration script to import existing product data.
