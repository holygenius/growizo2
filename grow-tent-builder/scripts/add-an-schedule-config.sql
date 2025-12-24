-- Advanced Nutrients Schedule Configuration Table
-- This table stores the configuration data for the AN schedule calculator
-- Previously hardcoded in AdvancedNutrientsSchedule.jsx

-- Create the configuration table
CREATE TABLE IF NOT EXISTS public.an_schedule_config (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    config_key character varying NOT NULL UNIQUE,
    config_value jsonb NOT NULL DEFAULT '{}'::jsonb,
    description character varying,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT an_schedule_config_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.an_schedule_config ENABLE ROW LEVEL SECURITY;

-- Allow read access for everyone (public data)
CREATE POLICY "Allow public read access on an_schedule_config" 
    ON public.an_schedule_config 
    FOR SELECT 
    USING (true);

-- Allow authenticated users to manage (for admin)
CREATE POLICY "Allow authenticated users to manage an_schedule_config" 
    ON public.an_schedule_config 
    FOR ALL 
    TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Insert default configurations

-- Week Labels
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('week_labels', '["Grow W1", "Grow W2", "Grow W3", "Grow W4", "Bloom W1", "Bloom W2", "Bloom W3", "Bloom W4", "Bloom W5", "Bloom W6", "Bloom W7", "Bloom W8"]', 'Week labels for the schedule table')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Phase Info
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('phase_info', '{
    "vegetative": { "weeks": [1, 2, 3, 4], "label_key": "phaseLabelVeg", "color": "#22C55E" },
    "flowering": { "weeks": [5, 6, 7, 8, 9, 10, 11], "label_key": "phaseLabelFlower", "color": "#EC4899" },
    "flush": { "weeks": [12], "label_key": "phaseLabelFlush", "color": "#6B7280" }
}', 'Phase definitions with week mappings')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Product Categories
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('product_categories', '{
    "base_nutrient": {
        "name_key": "catBaseNutrient",
        "icon": "🌱",
        "name": "Temel Besinler",
        "nameEn": "BASE NUTRIENTS",
        "description": "Bitkinin ana büyüme ve çiçeklenme aşamaları için gerekli olan temel besin çözeltileri.",
        "color": "#22C55E"
    },
    "root_expanders": {
        "name_key": "catRootExpanders",
        "icon": "🌳",
        "name": "Kök Genişleticiler",
        "nameEn": "ROOT EXPANDERS",
        "description": "Kök sistemi gelişimini destekleyen ürünler.",
        "color": "#8B5CF6"
    },
    "bigger_buds": {
        "name_key": "catBiggerBuds",
        "icon": "🌺",
        "name": "Büyük Tomurcuklar",
        "nameEn": "BIGGER BUDS",
        "description": "Tomurcuk boyutunu ve ağırlığını artırmayı hedefleyen destekleyiciler.",
        "color": "#EF4444"
    },
    "bud_potency": {
        "name_key": "catBudPotency",
        "icon": "💪",
        "name": "Tomurcuk Potansiyeli & Gövde Güçlendirici",
        "nameEn": "BUD POTENCY & STALK STRENGTHENER",
        "description": "Bitki gücünü, gövde yapısını ve tomurcuk potansiyelini destekleyen ürünler.",
        "color": "#F59E0B"
    },
    "grow_medium": {
        "name_key": "catGrowMedium",
        "icon": "🍂",
        "name": "Büyüme Ortamı Düzenleyici",
        "nameEn": "GROW MEDIUM CONDITIONER",
        "description": "Yetiştirme ortamının koşullarını iyileştirmeyi amaçlayan ürünler.",
        "color": "#34D399"
    },
    "taste_terpene": {
        "name_key": "catTasteTerpene",
        "icon": "🍬",
        "name": "Tomurcuk Tadı & Terpen Geliştirici",
        "nameEn": "BUD TASTE & TERPENE ENHANCEMENT",
        "description": "Mahsulün tadını ve aroma profilini (terpen) geliştirmeyi hedefleyen ürünler.",
        "color": "#EC4899"
    }
}', 'Product category definitions for AN schedule')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Base Nutrient Options
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('base_nutrient_options', '[
    {
        "id": "gmb",
        "label": "pH Perfect® Grow Micro Bloom",
        "shortLabel": "Grow Micro Bloom",
        "products": ["gmb-grow", "gmb-micro", "gmb-bloom"],
        "schedule_key": "schedule_hydro_master",
        "icon": "🧪",
        "color": "#7C3AED",
        "badge": "3-Part",
        "description": "Esnek 3 parçalı temel sistem - Tüm dönemler",
        "image": "/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Grow-Micro-Bloom-1L.jpg"
    },
    {
        "id": "sensi",
        "label": "pH Perfect® Sensi Grow & Bloom",
        "shortLabel": "Sensi Grow & Bloom",
        "products": ["sensi-grow-a", "sensi-grow-b", "sensi-bloom-a", "sensi-bloom-b"],
        "schedule_key": "schedule_hydro_master",
        "icon": "💧",
        "color": "#2563EB",
        "badge": "Professional",
        "description": "pH Perfect teknolojisi ile profesyonel besin sistemi",
        "image": "/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Sensi-Grow-Bloom-1L.png"
    },
    {
        "id": "sensi-coco",
        "label": "pH Perfect® Sensi Coco Grow & Bloom",
        "shortLabel": "Sensi Coco Grow & Bloom",
        "products": ["sensi-coco-grow-a", "sensi-coco-grow-b", "sensi-coco-bloom-a", "sensi-coco-bloom-b"],
        "schedule_key": "schedule_coco_master",
        "icon": "🥥",
        "color": "#0891B2",
        "badge": "Coco",
        "description": "Coco coir ortamları için özel formül",
        "image": "/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Sensi-Coco-Grow-Bloom-1L.png"
    },
    {
        "id": "connoisseur",
        "label": "pH Perfect® Connoisseur® Grow & Bloom",
        "shortLabel": "Connoisseur Grow & Bloom",
        "products": ["conn-grow-a", "conn-grow-b", "conn-bloom-a", "conn-bloom-b"],
        "schedule_key": "schedule_hydro_master",
        "icon": "🏆",
        "color": "#DC2626",
        "badge": "Premium",
        "description": "Üst düzey profesyonel besin serisi",
        "image": "/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Connoisseur-Grow-Bloom-1L-v2.png"
    },
    {
        "id": "connoisseur-coco",
        "label": "pH Perfect® Connoisseur® Coco Grow & Bloom",
        "shortLabel": "Connoisseur Coco Grow & Bloom",
        "products": ["conn-coco-grow-a", "conn-coco-grow-b", "conn-coco-bloom-a", "conn-coco-bloom-b"],
        "schedule_key": "schedule_coco_master",
        "icon": "👑",
        "color": "#B91C1C",
        "badge": "Premium Coco",
        "description": "Premium Coco ortamları için en üst düzey formül",
        "image": "/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Connoisseur-Coco-Grow-Bloom-1L.png"
    },
    {
        "id": "iguana",
        "label": "OG Organics™ Iguana Juice® Grow & Bloom",
        "shortLabel": "Iguana Juice Grow & Bloom",
        "products": ["iguana-grow", "iguana-bloom"],
        "schedule_key": "schedule_hydro_master",
        "icon": "🦎",
        "color": "#16A34A",
        "badge": "Organic",
        "description": "100% Organik sertifikalı besin serisi",
        "image": "/images/advanced-nutrients/OG-Organics-Iguana-Juice-Grow-Bloom-Advanced-Nutrients-1L-EU.jpg"
    },
    {
        "id": "jungle",
        "label": "Jungle Juice® Grow Micro Bloom",
        "shortLabel": "Jungle Juice GMB",
        "products": ["jungle-grow", "jungle-micro", "jungle-bloom"],
        "schedule_key": "schedule_hydro_master",
        "icon": "🌴",
        "color": "#059669",
        "badge": "Budget",
        "description": "Ekonomik 3 parçalı temel sistem",
        "image": "/images/advanced-nutrients/Advanced-Nutrients-Jungle-Juice-GMB-1L-300x243-v2.jpg"
    }
]', 'Base nutrient options/presets for AN schedule')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Nutrient Series (Info section data)
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('nutrient_series', '[
    {
        "id": "connoisseur",
        "name": "pH Perfect® Connoisseur®",
        "badge": "Premium",
        "color": "#DC2626",
        "descriptionKey": "anConnoisseurDesc",
        "features": ["pH Perfect", "Coco & Hydro", "Top Shelf & Master"]
    },
    {
        "id": "sensi",
        "name": "pH Perfect® Sensi",
        "badge": "Professional",
        "color": "#2563EB",
        "descriptionKey": "anSensiDesc",
        "features": ["pH Perfect", "2-Part System", "Coco"]
    },
    {
        "id": "iguana",
        "name": "OG Organics™ Iguana Juice®",
        "badge": "Organic",
        "color": "#16A34A",
        "descriptionKey": "anIguanaDesc",
        "features": ["CDFA Certified", "100% Organic", "Vegan"]
    },
    {
        "id": "gmb",
        "name": "pH Perfect® Grow/Micro/Bloom",
        "badge": "3-Part",
        "color": "#7C3AED",
        "descriptionKey": "anGMBDesc",
        "features": ["3-Part System", "Flexible Ratios", "All Media"]
    }
]', 'Nutrient series info for the info section')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Pro Tips
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('pro_tips_keys', '["anProTip1", "anProTip2", "anProTip3", "anProTip4", "anProTip5", "anProTip6"]', 'Translation keys for pro tips')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Lifecycle Phases
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('lifecycle_phases', '[
    {
        "id": "vegetative",
        "icon": "🌿",
        "titleKey": "anGrowCycle",
        "durationKey": "anVegetative",
        "durationWeeks": 4,
        "light": "18/6",
        "color": "#22C55E",
        "descriptionKey": "anGrowCycleDesc"
    },
    {
        "id": "flowering",
        "icon": "🌸",
        "titleKey": "anBloomCycle",
        "durationKey": "anFlowering",
        "durationWeeks": 8,
        "light": "12/12",
        "color": "#EC4899",
        "descriptionKey": "anBloomCycleDesc"
    },
    {
        "id": "flush",
        "icon": "💧",
        "titleKey": "anFlushPeriod",
        "durationKey": "anLastWeek",
        "light": "12/12",
        "color": "#6B7280",
        "descriptionKey": "anFlushPeriodDesc"
    }
]', 'Lifecycle phase definitions')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Supplement Categories
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('supplement_categories', '[
    { "icon": "🌳", "titleKey": "anRootDevelopers", "descriptionKey": "anRootDevelopersDesc" },
    { "icon": "🌺", "titleKey": "anBudEnlargersTitle", "descriptionKey": "anBudEnlargersDesc" },
    { "icon": "🍬", "titleKey": "anFlavorEnhancersTitle", "descriptionKey": "anFlavorEnhancersDesc" },
    { "icon": "🛡️", "titleKey": "anPlantHealthTitle", "descriptionKey": "anPlantHealthDesc" }
]', 'Supplement category definitions')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Default Selected Additives
INSERT INTO public.an_schedule_config (config_key, config_value, description) VALUES
('default_additives', '["voodoo-juice", "b-52", "big-bud", "overdrive", "flawless-finish"]', 'Default selected additive products')
ON CONFLICT (config_key) DO UPDATE SET config_value = EXCLUDED.config_value;

-- Update supabase-schema.sql for reference
COMMENT ON TABLE public.an_schedule_config IS 'Advanced Nutrients schedule configuration - stores week labels, phase info, product categories, base nutrient options, etc. Previously hardcoded in AdvancedNutrientsSchedule.jsx';
