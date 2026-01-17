-- ============================================
-- SEED DATA: Grow Tent Builder
-- Tarih: 2024-12-27
-- 
-- Çalıştırma sırası önemli (foreign key'ler)
-- ============================================

-- ============================================
-- 1. BRANDS (Markalar)
-- ============================================
INSERT INTO brands (id, name, slug, logo_url, icon, color, description, website_url, is_active, display_order) VALUES
('11111111-1111-1111-1111-111111111101', 'Advanced Nutrients', 'advanced-nutrients', 'https://yesilgrow.com/cdn/brands/advanced-nutrients.png', '🧪', '#00a651', '{"en": "Premium cannabis nutrients", "tr": "Premium besin çözümleri"}', 'https://advancednutrients.com', true, 1),
('11111111-1111-1111-1111-111111111102', 'CANNA', 'canna', 'https://yesilgrow.com/cdn/brands/canna.png', '🌱', '#00aa00', '{"en": "Dutch nutrient experts", "tr": "Hollanda besin uzmanları"}', 'https://canna.com', true, 2),
('11111111-1111-1111-1111-111111111103', 'BioBizz', 'biobizz', 'https://yesilgrow.com/cdn/brands/biobizz.png', '🍃', '#8bc34a', '{"en": "100% organic nutrients", "tr": "100% organik besinler"}', 'https://biobizz.com', true, 3),
('11111111-1111-1111-1111-111111111104', 'Secret Jardin', 'secret-jardin', 'https://yesilgrow.com/cdn/brands/secret-jardin.png', '🏕️', '#333333', '{"en": "Premium grow tents", "tr": "Premium yetiştirme çadırları"}', 'https://secretjardin.com', true, 4),
('11111111-1111-1111-1111-111111111105', 'Mars Hydro', 'mars-hydro', 'https://yesilgrow.com/cdn/brands/mars-hydro.png', '💡', '#ff6600', '{"en": "LED grow lights", "tr": "LED yetiştirme ışıkları"}', 'https://marshydro.com', true, 5),
('11111111-1111-1111-1111-111111111106', 'Spider Farmer', 'spider-farmer', 'https://yesilgrow.com/cdn/brands/spider-farmer.png', '🕷️', '#000000', '{"en": "High-efficiency LED lights", "tr": "Yüksek verimli LED ışıklar"}', 'https://spiderfarmer.com', true, 6),
('11111111-1111-1111-1111-111111111107', 'AC Infinity', 'ac-infinity', 'https://yesilgrow.com/cdn/brands/ac-infinity.png', '🌀', '#1a1a1a', '{"en": "Ventilation systems", "tr": "Havalandırma sistemleri"}', 'https://acinfinity.com', true, 7);

-- ============================================
-- 2. CATEGORIES (Kategoriler)
-- ============================================
INSERT INTO categories (id, key, name, icon, parent_category_id, display_order, is_active) VALUES
-- Ana kategoriler
('22222222-2222-2222-2222-222222222201', 'nutrients', '{"en": "Nutrients", "tr": "Besinler"}', '🧪', NULL, 1, true),
('22222222-2222-2222-2222-222222222202', 'grow_equipment', '{"en": "Grow Equipment", "tr": "Yetiştirme Ekipmanları"}', '🏠', NULL, 2, true),
('22222222-2222-2222-2222-222222222203', 'lighting', '{"en": "Lighting", "tr": "Aydınlatma"}', '💡', NULL, 3, true),
('22222222-2222-2222-2222-222222222204', 'climate_control', '{"en": "Climate Control", "tr": "İklim Kontrolü"}', '🌡️', NULL, 4, true),
('22222222-2222-2222-2222-222222222205', 'growing_media', '{"en": "Growing Media", "tr": "Yetiştirme Ortamı"}', '🌍', NULL, 5, true),

-- Alt kategoriler - Besinler
('22222222-2222-2222-2222-222222222211', 'base_nutrients', '{"en": "Base Nutrients", "tr": "Ana Besinler"}', '💧', '22222222-2222-2222-2222-222222222201', 1, true),
('22222222-2222-2222-2222-222222222212', 'additives', '{"en": "Additives & Boosters", "tr": "Katkılar ve Güçlendiriciler"}', '⚡', '22222222-2222-2222-2222-222222222201', 2, true),
('22222222-2222-2222-2222-222222222213', 'bloom_boosters', '{"en": "Bloom Boosters", "tr": "Çiçeklenme Güçlendiricileri"}', '🌸', '22222222-2222-2222-2222-222222222201', 3, true),

-- Alt kategoriler - Ekipman
('22222222-2222-2222-2222-222222222221', 'tents', '{"en": "Grow Tents", "tr": "Yetiştirme Çadırları"}', '🏕️', '22222222-2222-2222-2222-222222222202', 1, true),
('22222222-2222-2222-2222-222222222222', 'pots_containers', '{"en": "Pots & Containers", "tr": "Saksılar ve Kaplar"}', '🪴', '22222222-2222-2222-2222-222222222202', 2, true),

-- Alt kategoriler - Aydınlatma
('22222222-2222-2222-2222-222222222231', 'led_lights', '{"en": "LED Grow Lights", "tr": "LED Yetiştirme Işıkları"}', '💡', '22222222-2222-2222-2222-222222222203', 1, true),

-- Alt kategoriler - İklim
('22222222-2222-2222-2222-222222222241', 'fans_ventilation', '{"en": "Fans & Ventilation", "tr": "Fanlar ve Havalandırma"}', '🌀', '22222222-2222-2222-2222-222222222204', 1, true),
('22222222-2222-2222-2222-222222222242', 'carbon_filters', '{"en": "Carbon Filters", "tr": "Karbon Filtreler"}', '🔘', '22222222-2222-2222-2222-222222222204', 2, true);

-- ============================================
-- 3. VENDORS (Satıcılar)
-- ============================================
INSERT INTO vendors (id, name, vendor_code, logo_url, website_url, description, is_active) VALUES
('33333333-3333-3333-3333-333333333301', 'YesilGrow', 'YESILGROW', 'https://yesilgrow.com/logo.png', 'https://yesilgrow.com', 'Resmi YesilGrow mağazası', true),
('33333333-3333-3333-3333-333333333302', 'Trendyol', 'TRENDYOL', 'https://cdn.trendyol.com/logo.png', 'https://trendyol.com', 'Trendyol marketplace', true),
('33333333-3333-3333-3333-333333333303', 'Hepsiburada', 'HEPSIBURADA', 'https://cdn.hepsiburada.com/logo.png', 'https://hepsiburada.com', 'Hepsiburada marketplace', true),
('33333333-3333-3333-3333-333333333304', 'Amazon TR', 'AMAZON_TR', 'https://amazon.com.tr/logo.png', 'https://amazon.com.tr', 'Amazon Türkiye', true);

-- ============================================
-- 4. PRODUCTS (Ürünler)
-- ============================================

-- Advanced Nutrients Ürünleri
INSERT INTO products (id, sku, brand_id, category_id, name, description, summary_description, specs, images, icon, product_type, is_active, is_featured) VALUES
('44444444-4444-4444-4444-444444444401', 'AN-PH-PERFECT-GROW', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222211', 
 '{"en": "pH Perfect Grow", "tr": "pH Perfect Grow"}',
 '{"en": "Advanced 3-part base nutrient for vegetative growth with pH Perfect technology", "tr": "pH Perfect teknolojisi ile vejetatif büyüme için gelişmiş 3 parçalı ana besin"}',
 '{"en": "Automatic pH balancing for optimal nutrient uptake", "tr": "Optimum besin alımı için otomatik pH dengeleme"}',
 '{"npk": "1-0-4", "volume": "1L", "stage": "vegetative", "category_key": "base_nutrient"}',
 ARRAY['https://yesilgrow.com/cdn/products/an-ph-perfect-grow.jpg'],
 '🧪', 'nutrient', true, true),

('44444444-4444-4444-4444-444444444402', 'AN-PH-PERFECT-MICRO', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222211',
 '{"en": "pH Perfect Micro", "tr": "pH Perfect Micro"}',
 '{"en": "Essential micronutrients with pH Perfect technology", "tr": "pH Perfect teknolojisi ile temel mikro besinler"}',
 '{"en": "Complete micronutrient formula", "tr": "Tam mikro besin formülü"}',
 '{"npk": "2-0-0", "volume": "1L", "stage": "all", "category_key": "base_nutrient"}',
 ARRAY['https://yesilgrow.com/cdn/products/an-ph-perfect-micro.jpg'],
 '🧪', 'nutrient', true, true),

('44444444-4444-4444-4444-444444444403', 'AN-PH-PERFECT-BLOOM', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222211',
 '{"en": "pH Perfect Bloom", "tr": "pH Perfect Bloom"}',
 '{"en": "Flowering stage base nutrient with pH Perfect technology", "tr": "pH Perfect teknolojisi ile çiçeklenme aşaması ana besini"}',
 '{"en": "Maximize flower production", "tr": "Çiçek üretimini maksimize et"}',
 '{"npk": "0-5-4", "volume": "1L", "stage": "flowering", "category_key": "base_nutrient"}',
 ARRAY['https://yesilgrow.com/cdn/products/an-ph-perfect-bloom.jpg'],
 '🌸', 'nutrient', true, true),

('44444444-4444-4444-4444-444444444404', 'AN-BIG-BUD', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222213',
 '{"en": "Big Bud", "tr": "Big Bud"}',
 '{"en": "Powerful bloom booster for bigger, heavier flowers", "tr": "Daha büyük, daha ağır çiçekler için güçlü çiçeklenme güçlendirici"}',
 '{"en": "Increase flower size and weight", "tr": "Çiçek boyutunu ve ağırlığını artır"}',
 '{"npk": "0-15-35", "volume": "250ml", "stage": "flowering", "category_key": "bloom_booster"}',
 ARRAY['https://yesilgrow.com/cdn/products/an-big-bud.jpg'],
 '🌺', 'nutrient', true, true),

('44444444-4444-4444-4444-444444444405', 'AN-B52', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222212',
 '{"en": "B-52", "tr": "B-52"}',
 '{"en": "Vitamin B supplement for stress relief and root development", "tr": "Stres giderme ve kök gelişimi için B vitamini takviyesi"}',
 '{"en": "Reduce transplant shock and stress", "tr": "Nakil şokunu ve stresi azalt"}',
 '{"volume": "250ml", "stage": "all", "category_key": "additive"}',
 ARRAY['https://yesilgrow.com/cdn/products/an-b52.jpg'],
 '💊', 'nutrient', true, false),

-- CANNA Ürünleri
('44444444-4444-4444-4444-444444444411', 'CANNA-COCO-A', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222211',
 '{"en": "CANNA Coco A", "tr": "CANNA Coco A"}',
 '{"en": "Part A of 2-part coco nutrient system", "tr": "2 parçalı coco besin sisteminin A parçası"}',
 '{"en": "Designed specifically for coco coir", "tr": "Özellikle hindistan cevizi lifi için tasarlandı"}',
 '{"npk": "5-0-3", "volume": "1L", "stage": "all", "media": "coco", "category_key": "base_nutrient"}',
 ARRAY['https://yesilgrow.com/cdn/products/canna-coco-a.jpg'],
 '🥥', 'nutrient', true, true),

('44444444-4444-4444-4444-444444444412', 'CANNA-COCO-B', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222211',
 '{"en": "CANNA Coco B", "tr": "CANNA Coco B"}',
 '{"en": "Part B of 2-part coco nutrient system", "tr": "2 parçalı coco besin sisteminin B parçası"}',
 '{"en": "Complete nutrition with Part A", "tr": "A parçası ile tam beslenme"}',
 '{"npk": "0-4-2", "volume": "1L", "stage": "all", "media": "coco", "category_key": "base_nutrient"}',
 ARRAY['https://yesilgrow.com/cdn/products/canna-coco-b.jpg'],
 '🥥', 'nutrient', true, true),

('44444444-4444-4444-4444-444444444413', 'CANNA-PK-13-14', '11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222213',
 '{"en": "CANNA PK 13/14", "tr": "CANNA PK 13/14"}',
 '{"en": "Bloom stimulator with high phosphorus and potassium", "tr": "Yüksek fosfor ve potasyum içeren çiçeklenme uyarıcısı"}',
 '{"en": "Use in final flowering weeks", "tr": "Son çiçeklenme haftalarında kullan"}',
 '{"npk": "0-13-14", "volume": "250ml", "stage": "flowering", "category_key": "bloom_booster"}',
 ARRAY['https://yesilgrow.com/cdn/products/canna-pk-1314.jpg'],
 '⚡', 'nutrient', true, true),

-- BioBizz Ürünleri
('44444444-4444-4444-4444-444444444421', 'BIOBIZZ-BIOGROW', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222211',
 '{"en": "Bio-Grow", "tr": "Bio-Grow"}',
 '{"en": "100% organic fertilizer for vegetative growth", "tr": "Vejetatif büyüme için %100 organik gübre"}',
 '{"en": "Made from Dutch sugar beet", "tr": "Hollanda şeker pancarından yapılmış"}',
 '{"npk": "4-3-6", "volume": "1L", "stage": "vegetative", "organic": true, "category_key": "base_nutrient"}',
 ARRAY['https://yesilgrow.com/cdn/products/biobizz-biogrow.jpg'],
 '🌿', 'nutrient', true, true),

('44444444-4444-4444-4444-444444444422', 'BIOBIZZ-BIOBLOOM', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222211',
 '{"en": "Bio-Bloom", "tr": "Bio-Bloom"}',
 '{"en": "100% organic fertilizer for flowering", "tr": "Çiçeklenme için %100 organik gübre"}',
 '{"en": "Complete organic flowering nutrition", "tr": "Tam organik çiçeklenme beslenmesi"}',
 '{"npk": "2-7-4", "volume": "1L", "stage": "flowering", "organic": true, "category_key": "base_nutrient"}',
 ARRAY['https://yesilgrow.com/cdn/products/biobizz-biobloom.jpg'],
 '🌻', 'nutrient', true, true),

-- Grow Tents
('44444444-4444-4444-4444-444444444431', 'SJ-DARKROOM-120', '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222221',
 '{"en": "Dark Room 120x120x200", "tr": "Dark Room 120x120x200"}',
 '{"en": "Premium grow tent with 120x120x200cm dimensions", "tr": "120x120x200cm boyutlarında premium yetiştirme çadırı"}',
 '{"en": "Professional quality tent", "tr": "Profesyonel kalite çadır"}',
 '{"width": 120, "depth": 120, "height": 200, "material": "600D Oxford", "reflectivity": "95%"}',
 ARRAY['https://yesilgrow.com/cdn/products/sj-darkroom-120.jpg'],
 '🏕️', 'tent', true, true),

('44444444-4444-4444-4444-444444444432', 'SJ-DARKROOM-90', '11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222221',
 '{"en": "Dark Room 90x90x180", "tr": "Dark Room 90x90x180"}',
 '{"en": "Compact grow tent for small spaces", "tr": "Küçük alanlar için kompakt yetiştirme çadırı"}',
 '{"en": "Perfect for beginners", "tr": "Yeni başlayanlar için mükemmel"}',
 '{"width": 90, "depth": 90, "height": 180, "material": "600D Oxford", "reflectivity": "95%"}',
 ARRAY['https://yesilgrow.com/cdn/products/sj-darkroom-90.jpg'],
 '🏕️', 'tent', true, false),

-- LED Lights
('44444444-4444-4444-4444-444444444441', 'MH-TSW2000', '11111111-1111-1111-1111-111111111105', '22222222-2222-2222-2222-222222222231',
 '{"en": "Mars Hydro TSW 2000", "tr": "Mars Hydro TSW 2000"}',
 '{"en": "300W full spectrum LED grow light", "tr": "300W tam spektrum LED yetiştirme ışığı"}',
 '{"en": "Best value LED light", "tr": "En iyi değer LED ışık"}',
 '{"wattage": 300, "ppfd": 743, "coverage": "120x120cm", "spectrum": "full", "dimmer": true}',
 ARRAY['https://yesilgrow.com/cdn/products/mh-tsw2000.jpg'],
 '💡', 'light', true, true),

('44444444-4444-4444-4444-444444444442', 'SF-SE3000', '11111111-1111-1111-1111-111111111106', '22222222-2222-2222-2222-222222222231',
 '{"en": "Spider Farmer SE3000", "tr": "Spider Farmer SE3000"}',
 '{"en": "300W Samsung LM301B LED grow light", "tr": "300W Samsung LM301B LED yetiştirme ışığı"}',
 '{"en": "Premium efficiency LEDs", "tr": "Premium verimli LED''ler"}',
 '{"wattage": 300, "ppfd": 892, "coverage": "90x90cm", "spectrum": "full", "dimmer": true, "led_brand": "Samsung LM301B"}',
 ARRAY['https://yesilgrow.com/cdn/products/sf-se3000.jpg'],
 '💡', 'light', true, true),

-- Fans & Ventilation
('44444444-4444-4444-4444-444444444451', 'AC-CLOUDLINE-T6', '11111111-1111-1111-1111-111111111107', '22222222-2222-2222-2222-222222222241',
 '{"en": "CLOUDLINE T6", "tr": "CLOUDLINE T6"}',
 '{"en": "6-inch inline duct fan with smart controller", "tr": "Akıllı kontrolcülü 6 inç inline kanal fanı"}',
 '{"en": "Quiet and powerful ventilation", "tr": "Sessiz ve güçlü havalandırma"}',
 '{"diameter": 6, "cfm": 402, "noise": "32dB", "speed_control": true, "smart": true}',
 ARRAY['https://yesilgrow.com/cdn/products/ac-cloudline-t6.jpg'],
 '🌀', 'fan', true, true),

('44444444-4444-4444-4444-444444444452', 'AC-CLOUDLINE-T4', '11111111-1111-1111-1111-111111111107', '22222222-2222-2222-2222-222222222241',
 '{"en": "CLOUDLINE T4", "tr": "CLOUDLINE T4"}',
 '{"en": "4-inch inline duct fan with smart controller", "tr": "Akıllı kontrolcülü 4 inç inline kanal fanı"}',
 '{"en": "Perfect for small tents", "tr": "Küçük çadırlar için mükemmel"}',
 '{"diameter": 4, "cfm": 205, "noise": "28dB", "speed_control": true, "smart": true}',
 ARRAY['https://yesilgrow.com/cdn/products/ac-cloudline-t4.jpg'],
 '🌀', 'fan', true, false);

-- ============================================
-- 5. VENDOR_PRODUCTS (Satıcı Ürünleri - Fiyatlar)
-- ============================================
INSERT INTO vendor_products (id, product_id, vendor_id, vendor_sku, vendor_product_name, price, currency, product_url, stock_quantity, stock_status, is_active) VALUES
-- Advanced Nutrients - YesilGrow
('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'YG-AN-GROW-1L', 'pH Perfect Grow 1L', 549.00, 'TRY', 'https://yesilgrow.com/products/an-ph-perfect-grow', 25, 'in_stock', true),
('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', 'YG-AN-MICRO-1L', 'pH Perfect Micro 1L', 549.00, 'TRY', 'https://yesilgrow.com/products/an-ph-perfect-micro', 20, 'in_stock', true),
('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'YG-AN-BLOOM-1L', 'pH Perfect Bloom 1L', 549.00, 'TRY', 'https://yesilgrow.com/products/an-ph-perfect-bloom', 22, 'in_stock', true),
('55555555-5555-5555-5555-555555555504', '44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', 'YG-AN-BIGBUD-250', 'Big Bud 250ml', 399.00, 'TRY', 'https://yesilgrow.com/products/an-big-bud', 15, 'in_stock', true),
('55555555-5555-5555-5555-555555555505', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333301', 'YG-AN-B52-250', 'B-52 250ml', 349.00, 'TRY', 'https://yesilgrow.com/products/an-b52', 18, 'in_stock', true),

-- Advanced Nutrients - Trendyol (farklı fiyatlar)
('55555555-5555-5555-5555-555555555511', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333302', 'TY-AN-GROW', 'Advanced Nutrients pH Perfect Grow', 599.00, 'TRY', 'https://trendyol.com/an-grow', 10, 'in_stock', true),
('55555555-5555-5555-5555-555555555512', '44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333302', 'TY-AN-BIGBUD', 'Advanced Nutrients Big Bud', 449.00, 'TRY', 'https://trendyol.com/an-bigbud', 5, 'limited', true),

-- CANNA - YesilGrow
('55555555-5555-5555-5555-555555555521', '44444444-4444-4444-4444-444444444411', '33333333-3333-3333-3333-333333333301', 'YG-CANNA-COCO-A', 'CANNA Coco A 1L', 479.00, 'TRY', 'https://yesilgrow.com/products/canna-coco-a', 30, 'in_stock', true),
('55555555-5555-5555-5555-555555555522', '44444444-4444-4444-4444-444444444412', '33333333-3333-3333-3333-333333333301', 'YG-CANNA-COCO-B', 'CANNA Coco B 1L', 479.00, 'TRY', 'https://yesilgrow.com/products/canna-coco-b', 28, 'in_stock', true),
('55555555-5555-5555-5555-555555555523', '44444444-4444-4444-4444-444444444413', '33333333-3333-3333-3333-333333333301', 'YG-CANNA-PK', 'CANNA PK 13/14 250ml', 349.00, 'TRY', 'https://yesilgrow.com/products/canna-pk', 12, 'in_stock', true),

-- BioBizz - YesilGrow
('55555555-5555-5555-5555-555555555531', '44444444-4444-4444-4444-444444444421', '33333333-3333-3333-3333-333333333301', 'YG-BB-GROW', 'BioBizz Bio-Grow 1L', 329.00, 'TRY', 'https://yesilgrow.com/products/biobizz-biogrow', 40, 'in_stock', true),
('55555555-5555-5555-5555-555555555532', '44444444-4444-4444-4444-444444444422', '33333333-3333-3333-3333-333333333301', 'YG-BB-BLOOM', 'BioBizz Bio-Bloom 1L', 329.00, 'TRY', 'https://yesilgrow.com/products/biobizz-biobloom', 35, 'in_stock', true),

-- Grow Tents - YesilGrow
('55555555-5555-5555-5555-555555555541', '44444444-4444-4444-4444-444444444431', '33333333-3333-3333-3333-333333333301', 'YG-SJ-DR120', 'Secret Jardin Dark Room 120', 4299.00, 'TRY', 'https://yesilgrow.com/products/sj-darkroom-120', 5, 'in_stock', true),
('55555555-5555-5555-5555-555555555542', '44444444-4444-4444-4444-444444444432', '33333333-3333-3333-3333-333333333301', 'YG-SJ-DR90', 'Secret Jardin Dark Room 90', 3499.00, 'TRY', 'https://yesilgrow.com/products/sj-darkroom-90', 8, 'in_stock', true),

-- LED Lights - YesilGrow
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333301', 'YG-MH-TSW2000', 'Mars Hydro TSW 2000', 5999.00, 'TRY', 'https://yesilgrow.com/products/mh-tsw2000', 10, 'in_stock', true),
('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333301', 'YG-SF-SE3000', 'Spider Farmer SE3000', 7499.00, 'TRY', 'https://yesilgrow.com/products/sf-se3000', 6, 'in_stock', true),

-- Fans - YesilGrow
('55555555-5555-5555-5555-555555555561', '44444444-4444-4444-4444-444444444451', '33333333-3333-3333-3333-333333333301', 'YG-AC-T6', 'AC Infinity CLOUDLINE T6', 3299.00, 'TRY', 'https://yesilgrow.com/products/ac-cloudline-t6', 12, 'in_stock', true),
('55555555-5555-5555-5555-555555555562', '44444444-4444-4444-4444-444444444452', '33333333-3333-3333-3333-333333333301', 'YG-AC-T4', 'AC Infinity CLOUDLINE T4', 2499.00, 'TRY', 'https://yesilgrow.com/products/ac-cloudline-t4', 15, 'in_stock', true),

-- LED Lights - Amazon TR (farklı fiyatlar)
('55555555-5555-5555-5555-555555555571', '44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333304', 'AMZ-MH-TSW2000', 'Mars Hydro TSW 2000 LED', 6499.00, 'TRY', 'https://amazon.com.tr/mars-hydro-tsw2000', 3, 'limited', true),
('55555555-5555-5555-5555-555555555572', '44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333304', 'AMZ-SF-SE3000', 'Spider Farmer SE3000 LED', 7999.00, 'TRY', 'https://amazon.com.tr/spider-farmer-se3000', 2, 'limited', true);

-- ============================================
-- 6. FEEDING SCHEDULES (Besleme Programları)
-- ============================================
INSERT INTO feeding_schedules (id, brand_id, name, substrate_type, schedule_data, phases, notes, is_active) VALUES
('66666666-6666-6666-6666-666666666601', '11111111-1111-1111-1111-111111111101', 
 '{"en": "pH Perfect Sensi Grow Schedule", "tr": "pH Perfect Sensi Büyüme Programı"}',
 'soil',
 '{"weeks": 12, "type": "soil"}',
 '{"seedling": [1,2], "vegetative": [3,4,5], "transition": [6], "flowering": [7,8,9,10], "flush": [11,12]}',
 '{"en": "For soil growing with pH Perfect line", "tr": "pH Perfect serisi ile toprak yetiştiriciliği için"}',
 true),

('66666666-6666-6666-6666-666666666602', '11111111-1111-1111-1111-111111111102',
 '{"en": "CANNA Coco Schedule", "tr": "CANNA Coco Programı"}',
 'coco',
 '{"weeks": 10, "type": "coco"}',
 '{"seedling": [1], "vegetative": [2,3,4], "flowering": [5,6,7,8], "flush": [9,10]}',
 '{"en": "For coco coir with CANNA nutrients", "tr": "CANNA besinleri ile hindistan cevizi lifi için"}',
 true),

('66666666-6666-6666-6666-666666666603', '11111111-1111-1111-1111-111111111103',
 '{"en": "BioBizz Organic Schedule", "tr": "BioBizz Organik Program"}',
 'soil',
 '{"weeks": 12, "type": "organic_soil"}',
 '{"seedling": [1,2], "vegetative": [3,4,5,6], "flowering": [7,8,9,10], "flush": [11,12]}',
 '{"en": "100% organic growing schedule", "tr": "100% organik yetiştirme programı"}',
 true);

-- ============================================
-- 7. FEEDING SCHEDULE ITEMS (Program Ürün Bağlantıları)
-- ============================================
INSERT INTO feeding_schedule_items (id, feeding_schedule_id, product_id, week_number, phase, dose_amount, dose_unit, notes, sort_order, is_active) VALUES
-- Advanced Nutrients Schedule - Week 1-2 (Seedling)
('77777777-7777-7777-7777-777777777701', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444402', 1, 'seedling', 1.0, 'ml/L', '{"en": "Light feeding for seedlings", "tr": "Fideler için hafif besleme"}', 1, true),
('77777777-7777-7777-7777-777777777702', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', 1, 'seedling', 1.0, 'ml/L', '{}', 2, true),
('77777777-7777-7777-7777-777777777703', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444402', 2, 'seedling', 1.5, 'ml/L', '{}', 1, true),
('77777777-7777-7777-7777-777777777704', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', 2, 'seedling', 1.5, 'ml/L', '{}', 2, true),

-- Advanced Nutrients Schedule - Week 3-5 (Vegetative)
('77777777-7777-7777-7777-777777777711', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444402', 3, 'vegetative', 2.0, 'ml/L', '{}', 1, true),
('77777777-7777-7777-7777-777777777712', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', 3, 'vegetative', 2.0, 'ml/L', '{}', 2, true),
('77777777-7777-7777-7777-777777777713', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444405', 3, 'vegetative', 2.0, 'ml/L', '{"en": "Add B-52 for stress relief", "tr": "Stres giderme için B-52 ekle"}', 3, true),

-- Advanced Nutrients Schedule - Week 7-10 (Flowering)
('77777777-7777-7777-7777-777777777721', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444402', 7, 'flowering', 2.0, 'ml/L', '{}', 1, true),
('77777777-7777-7777-7777-777777777722', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444403', 7, 'flowering', 2.0, 'ml/L', '{}', 2, true),
('77777777-7777-7777-7777-777777777723', '66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444404', 7, 'flowering', 2.0, 'ml/L', '{"en": "Start Big Bud for flower boost", "tr": "Çiçek güçlendirmesi için Big Bud başlat"}', 3, true),

-- CANNA Schedule Items
('77777777-7777-7777-7777-777777777731', '66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444411', 1, 'seedling', 2.0, 'ml/L', '{"en": "Always use A+B together", "tr": "Her zaman A+B birlikte kullan"}', 1, true),
('77777777-7777-7777-7777-777777777732', '66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444412', 1, 'seedling', 2.0, 'ml/L', '{}', 2, true),
('77777777-7777-7777-7777-777777777733', '66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444411', 5, 'flowering', 4.0, 'ml/L', '{}', 1, true),
('77777777-7777-7777-7777-777777777734', '66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444412', 5, 'flowering', 4.0, 'ml/L', '{}', 2, true),
('77777777-7777-7777-7777-777777777735', '66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444413', 6, 'flowering', 1.5, 'ml/L', '{"en": "Add PK 13/14 in week 6", "tr": "6. haftada PK 13/14 ekle"}', 3, true),

-- BioBizz Schedule Items
('77777777-7777-7777-7777-777777777741', '66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444421', 3, 'vegetative', 2.0, 'ml/L', '{"en": "Organic veg feeding", "tr": "Organik vejetatif besleme"}', 1, true),
('77777777-7777-7777-7777-777777777742', '66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444421', 4, 'vegetative', 3.0, 'ml/L', '{}', 1, true),
('77777777-7777-7777-7777-777777777743', '66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444422', 7, 'flowering', 3.0, 'ml/L', '{"en": "Switch to Bio-Bloom", "tr": "Bio-Bloom''a geç"}', 1, true),
('77777777-7777-7777-7777-777777777744', '66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444422', 8, 'flowering', 4.0, 'ml/L', '{}', 1, true);

-- ============================================
-- 8. PRESET SETS (Hazır Setler)
-- ============================================
INSERT INTO preset_sets (id, name, description, tier, products, image_url, is_active, display_order, tent_size, media_type, nutrient_brand, plant_count) VALUES
('88888888-8888-8888-8888-888888888801',
 '{"en": "Beginner Starter Kit", "tr": "Başlangıç Seti"}',
 '{"en": "Everything you need to start growing", "tr": "Yetiştirmeye başlamak için ihtiyacınız olan her şey"}',
 'entry',
 '[{"sku": "SJ-DARKROOM-90", "quantity": 1}, {"sku": "MH-TSW2000", "quantity": 1}, {"sku": "AC-CLOUDLINE-T4", "quantity": 1}, {"sku": "BIOBIZZ-BIOGROW", "quantity": 1}, {"sku": "BIOBIZZ-BIOBLOOM", "quantity": 1}]',
 'https://yesilgrow.com/cdn/presets/beginner-kit.jpg',
 true, 1,
 '{"width": 90, "depth": 90, "height": 180}',
 'soil', 'BioBizz', 4),

('88888888-8888-8888-8888-888888888802',
 '{"en": "Pro Grower Bundle", "tr": "Pro Yetiştirici Paketi"}',
 '{"en": "Professional setup for serious growers", "tr": "Ciddi yetiştiriciler için profesyonel kurulum"}',
 'premium',
 '[{"sku": "SJ-DARKROOM-120", "quantity": 1}, {"sku": "SF-SE3000", "quantity": 1}, {"sku": "AC-CLOUDLINE-T6", "quantity": 1}, {"sku": "AN-PH-PERFECT-GROW", "quantity": 1}, {"sku": "AN-PH-PERFECT-MICRO", "quantity": 1}, {"sku": "AN-PH-PERFECT-BLOOM", "quantity": 1}, {"sku": "AN-BIG-BUD", "quantity": 1}]',
 'https://yesilgrow.com/cdn/presets/pro-bundle.jpg',
 true, 2,
 '{"width": 120, "depth": 120, "height": 200}',
 'coco', 'Advanced Nutrients', 6),

('88888888-8888-8888-8888-888888888803',
 '{"en": "CANNA Coco Complete", "tr": "CANNA Coco Komple Set"}',
 '{"en": "Complete coco growing setup with CANNA nutrients", "tr": "CANNA besinleri ile komple coco yetiştirme kurulumu"}',
 'standard',
 '[{"sku": "SJ-DARKROOM-120", "quantity": 1}, {"sku": "MH-TSW2000", "quantity": 1}, {"sku": "AC-CLOUDLINE-T6", "quantity": 1}, {"sku": "CANNA-COCO-A", "quantity": 2}, {"sku": "CANNA-COCO-B", "quantity": 2}, {"sku": "CANNA-PK-13-14", "quantity": 1}]',
 'https://yesilgrow.com/cdn/presets/canna-complete.jpg',
 true, 3,
 '{"width": 120, "depth": 120, "height": 200}',
 'coco', 'CANNA', 4);

-- ============================================
-- 9. BLOG POSTS (Blog Yazıları)
-- ============================================
INSERT INTO blog_posts (id, slug, title, excerpt, content, category, author, tags, image_url, is_published, published_at, meta_title, meta_description) VALUES
('99999999-9999-9999-9999-999999999901',
 '{"en": "complete-beginners-guide", "tr": "tam-baslangic-rehberi"}',
 '{"en": "Complete Beginner''s Guide to Indoor Growing", "tr": "İç Mekan Yetiştiriciliğine Tam Başlangıç Rehberi"}',
 '{"en": "Everything you need to know to start your first indoor grow", "tr": "İlk iç mekan yetiştiriciliğinize başlamak için bilmeniz gereken her şey"}',
 '{"en": "# Getting Started\n\nIndoor growing is an exciting hobby...", "tr": "# Başlarken\n\nİç mekan yetiştiriciliği heyecan verici bir hobi..."}',
 'guides',
 'GrowWizard Team',
 ARRAY['beginner', 'indoor', 'guide', 'setup'],
 'https://yesilgrow.com/cdn/blog/beginners-guide.jpg',
 true,
 NOW() - INTERVAL '7 days',
 '{"en": "Complete Indoor Growing Guide for Beginners", "tr": "Yeni Başlayanlar İçin Komple İç Mekan Yetiştirme Rehberi"}',
 '{"en": "Learn everything about indoor growing", "tr": "İç mekan yetiştiriciliği hakkında her şeyi öğrenin"}'),

('99999999-9999-9999-9999-999999999902',
 '{"en": "understanding-ph-ec", "tr": "ph-ec-anlamak"}',
 '{"en": "Understanding pH and EC in Hydroponics", "tr": "Hidroponik''te pH ve EC''yi Anlamak"}',
 '{"en": "Master the fundamentals of nutrient solution management", "tr": "Besin çözeltisi yönetiminin temellerinde ustalaşın"}',
 '{"en": "# pH and EC Basics\n\npH and EC are crucial...", "tr": "# pH ve EC Temelleri\n\npH ve EC çok önemli..."}',
 'nutrients',
 'GrowWizard Team',
 ARRAY['ph', 'ec', 'hydroponics', 'nutrients'],
 'https://yesilgrow.com/cdn/blog/ph-ec-guide.jpg',
 true,
 NOW() - INTERVAL '3 days',
 '{"en": "pH and EC Guide for Hydroponics", "tr": "Hidroponik için pH ve EC Rehberi"}',
 '{"en": "Learn about pH and EC management", "tr": "pH ve EC yönetimi hakkında bilgi edinin"}'),

('99999999-9999-9999-9999-999999999903',
 '{"en": "choosing-right-led", "tr": "dogru-led-secimi"}',
 '{"en": "How to Choose the Right LED Grow Light", "tr": "Doğru LED Yetiştirme Işığını Nasıl Seçersiniz"}',
 '{"en": "Compare LED technologies and find the perfect light for your setup", "tr": "LED teknolojilerini karşılaştırın ve kurulumunuz için mükemmel ışığı bulun"}',
 '{"en": "# LED Technology Overview\n\nModern LED grow lights...", "tr": "# LED Teknolojisine Genel Bakış\n\nModern LED yetiştirme ışıkları..."}',
 'equipment',
 'GrowWizard Team',
 ARRAY['led', 'lighting', 'equipment', 'comparison'],
 'https://yesilgrow.com/cdn/blog/led-guide.jpg',
 true,
 NOW() - INTERVAL '1 day',
 '{"en": "LED Grow Light Buying Guide", "tr": "LED Yetiştirme Işığı Satın Alma Rehberi"}',
 '{"en": "Find the best LED for your grow room", "tr": "Yetiştirme odanız için en iyi LED''i bulun"}');

-- ============================================
-- DONE! 
-- Toplam: 
--   7 marka
--   14 kategori
--   4 satıcı
--   16 ürün
--   24 satıcı-ürün bağlantısı (fiyatlar)
--   3 besleme programı
--   18 program-ürün bağlantısı
--   3 hazır set
--   3 blog yazısı
-- ============================================
