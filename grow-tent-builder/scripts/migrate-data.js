/**
 * Migrate Data to Supabase
 * 
 * Bu script mevcut static JS verilerini Supabase'e taşır.
 * Run: node scripts/migrate-data.js
 * 
 * NOTE: blogData.js has been removed. Blog migration is now in migrate-blog.js
 * and blog data is managed directly in Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Import existing data
import { BIOBIZZ_PRODUCTS } from '../src/data/biobizzProducts.js';
import { CANNA_PRODUCTS } from '../src/data/cannaData.js';
import { ADVANCED_NUTRIENTS_DATA } from '../src/data/advancedNutrientsData.js';
import {
    TENT_PRODUCTS,
    LED_PRODUCTS,
    FAN_PRODUCTS,
    CARBON_FILTER_PRODUCTS,
    DUCTING_PRODUCTS,
    SUBSTRATE_PRODUCTS,
    MONITORING_PRODUCTS,
    TIMER_PRODUCTS,
    POT_PRODUCTS,
    HANGER_PRODUCTS,
    CO2_ODOR_PRODUCTS
} from '../src/data/builderProducts.js';
// blogPosts removed - now managed in Supabase directly

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials not found');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Brand mapping
const BRAND_SLUGS = {
    'BioBizz': 'biobizz',
    'CANNA': 'canna',
    'Advanced Nutrients': 'advanced-nutrients',
    'Secret Jardin': 'secret-jardin',
    'Mars Hydro': 'mars-hydro',
    'AC Infinity': 'ac-infinity',
    'Sonoff': 'sonoff',
    'TP-Link': 'tp-link',
    'Xiaomi': 'xiaomi',
    'Inkbird': 'inkbird'
};

// Category mapping
const CATEGORY_KEYS = {
    'base_nutrient': 'base_nutrients',
    'growth_enhancer': 'growth_enhancers',
    'bloom_booster': 'bloom_boosters',
    'root_stimulator': 'root_stimulators',
    'additive': 'additives',
    'substrate': 'substrates',
    'substrate_booster': 'substrates',
    'dry_fertilizer': 'additives',
    'ph_control': 'ph_control',
    'tent': 'tents',
    'lighting': 'lighting',
    'ventilation': 'ventilation',
    'monitoring': 'monitoring',
    'accessories': 'accessories'
};

async function getBrandId(brandName) {
    const slug = BRAND_SLUGS[brandName];
    if (!slug) return null;

    const { data } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', slug)
        .single();

    return data?.id || null;
}

async function getCategoryId(categoryKey) {
    const key = CATEGORY_KEYS[categoryKey] || categoryKey;

    const { data } = await supabase
        .from('categories')
        .select('id')
        .eq('key', key)
        .single();

    return data?.id || null;
}

async function insertBrand(name, slug, icon, color) {
    const { data, error } = await supabase
        .from('brands')
        .upsert({
            name,
            slug,
            icon,
            color,
            description: { en: name, tr: name },
            is_active: true
        }, { onConflict: 'slug' })
        .select()
        .single();

    if (error) console.error(`Brand insert error (${name}):`, error.message);
    return data?.id;
}

// ============================================
// MIGRATE BIOBIZZ PRODUCTS
// ============================================
async function migrateBioBizz() {
    console.log('\n🌿 BioBizz ürünleri migrate ediliyor...');

    const brandId = await getBrandId('BioBizz');
    if (!brandId) {
        console.error('❌ BioBizz brand not found');
        return;
    }

    let success = 0, failed = 0;

    for (const product of BIOBIZZ_PRODUCTS) {
        const categoryId = await getCategoryId(product.category_key);

        const { error } = await supabase.from('products').upsert({
            sku: product.id,
            brand_id: brandId,
            category_id: categoryId,
            name: { en: product.product_name, tr: product.product_name },
            description: { en: product.key_properties, tr: product.key_properties },
            function_detailed: { en: product.function_detailed, tr: product.function_detailed },
            key_properties: {
                en: product.key_properties,
                tr: product.key_properties,
                application_type: product.application_type,
                application_phases: product.application_phases,
                application_methods: product.application_methods
            },
            price: product.price || 0,
            available_packaging: product.available_packaging || [],
            compatible_media: product.compatible_media || ['soil'],
            icon: product.icon,
            product_type: product.category_key === 'substrate' ? 'substrate' : 'nutrient',
            is_active: true
        }, { onConflict: 'sku' });

        if (error) {
            console.error(`  ❌ ${product.product_name}: ${error.message}`);
            failed++;
        } else {
            success++;
        }
    }

    console.log(`  ✅ ${success} başarılı, ❌ ${failed} hatalı`);
}

// ============================================
// MIGRATE CANNA PRODUCTS
// ============================================
async function migrateCanna() {
    console.log('\n🌱 CANNA ürünleri migrate ediliyor...');

    const brandId = await getBrandId('CANNA');
    if (!brandId) {
        console.error('❌ CANNA brand not found');
        return;
    }

    let success = 0, failed = 0;

    // CANNA_PRODUCTS is a flat array
    for (const product of CANNA_PRODUCTS) {
        const categoryId = await getCategoryId(product.category_key || 'base_nutrients');

        const { error } = await supabase.from('products').upsert({
            sku: product.id,
            brand_id: brandId,
            category_id: categoryId,
            name: { en: product.product_name, tr: product.product_name },
            description: {
                en: product.key_properties || '',
                tr: product.key_properties || ''
            },
            function_detailed: {
                en: product.function_detailed || '',
                tr: product.function_detailed || ''
            },
            key_properties: {
                en: product.key_properties || '',
                tr: product.key_properties || '',
                system: product.system,
                paired_with: product.paired_with
            },
            price: product.price || 0,
            available_packaging: product.available_packaging || [],
            compatible_media: product.system ? [product.system] : ['soil'],
            icon: product.icon || '🌱',
            product_type: 'nutrient',
            specs: {
                system: product.system,
                dose_unit: product.dose_unit,
                color: product.color,
                tags: product.tags,
                category_key: product.category_key,
                function_key: product.function_key
            },
            images: product.image ? [product.image] : [],
            is_active: true
        }, { onConflict: 'sku' });

        if (error) {
            console.error(`  ❌ ${product.product_name}: ${error.message}`);
            failed++;
        } else {
            success++;
        }
    }

    console.log(`  ✅ ${success} başarılı, ❌ ${failed} hatalı`);
}

// ============================================
// MIGRATE ADVANCED NUTRIENTS PRODUCTS
// ============================================
async function migrateAdvancedNutrients() {
    console.log('\n🧪 Advanced Nutrients ürünleri migrate ediliyor...');

    const brandId = await getBrandId('Advanced Nutrients');
    if (!brandId) {
        console.error('❌ Advanced Nutrients brand not found');
        return;
    }

    let success = 0, failed = 0;

    // ADVANCED_NUTRIENTS_DATA is a flat array
    for (const product of ADVANCED_NUTRIENTS_DATA) {
        const categoryId = await getCategoryId(product.category_key || 'base_nutrients');

        const { error } = await supabase.from('products').upsert({
            sku: product.id,
            brand_id: brandId,
            category_id: categoryId,
            name: { en: product.product_name, tr: product.product_name },
            description: {
                en: product.key_properties || '',
                tr: product.key_properties || ''
            },
            function_detailed: {
                en: product.function_detailed || '',
                tr: product.function_detailed || ''
            },
            key_properties: {
                en: product.key_properties || '',
                tr: product.key_properties || ''
            },
            price: product.price || 0,
            available_packaging: product.available_packaging || [],
            compatible_media: ['coco', 'hydro'],
            icon: product.icon || '🧪',
            product_type: 'nutrient',
            specs: {
                dose_unit: product.dose_unit,
                color: product.color,
                schedule_default: product.schedule_default,
                schedule_coco_topshelf: product.schedule_coco_topshelf,
                schedule_coco_master: product.schedule_coco_master,
                schedule_hydro_master: product.schedule_hydro_master,
                ph_perfect: true,
                category_key: product.category_key
            },
            images: product.image ? [product.image] : [],
            is_active: true
        }, { onConflict: 'sku' });

        if (error) {
            console.error(`  ❌ ${product.product_name}: ${error.message}`);
            failed++;
        } else {
            success++;
        }
    }

    console.log(`  ✅ ${success} başarılı, ❌ ${failed} hatalı`);
}

// ============================================
// MIGRATE TENTS
// ============================================
async function migrateTents() {
    console.log('\n🏕️ Çadırlar migrate ediliyor...');

    let success = 0, failed = 0;

    for (const tent of TENT_PRODUCTS) {
        const brandId = await getBrandId(tent.brand);
        const categoryId = await getCategoryId('tents');

        const { error } = await supabase.from('products').upsert({
            sku: tent.id,
            brand_id: brandId,
            category_id: categoryId,
            name: { en: tent.fullName || tent.name, tr: tent.fullName || tent.name },
            description: {
                en: tent.features?.join('. ') || '',
                tr: tent.features?.join('. ') || ''
            },
            price: tent.price || 0,
            icon: '🏕️',
            product_type: 'tent',
            specs: {
                dimensions: tent.dimensions,
                dimensionsFt: tent.dimensionsFt,
                volume: tent.volume,
                weight: tent.weight,
                ventPorts: tent.ventPorts,
                hangingCapacity: tent.hangingCapacity,
                frameMaterial: tent.frameMaterial,
                fabricMaterial: tent.fabricMaterial,
                recommendedLighting: tent.recommendedLighting,
                recommendedExtraction: tent.recommendedExtraction,
                series: tent.series,
                tier: tent.tier
            },
            images: tent.image ? [tent.image] : [],
            is_active: true
        }, { onConflict: 'sku' });

        if (error) {
            console.error(`  ❌ ${tent.name}: ${error.message}`);
            failed++;
        } else {
            success++;
        }
    }

    console.log(`  ✅ ${success} başarılı, ❌ ${failed} hatalı`);
}

// ============================================
// MIGRATE LIGHTING
// ============================================
async function migrateLighting() {
    console.log('\n💡 Işıklar migrate ediliyor...');

    let success = 0, failed = 0;

    for (const light of LED_PRODUCTS) {
        const brandId = await getBrandId(light.brand);
        const categoryId = await getCategoryId('lighting');

        const { error } = await supabase.from('products').upsert({
            sku: light.id,
            brand_id: brandId,
            category_id: categoryId,
            name: { en: light.fullName || light.name, tr: light.fullName || light.name },
            description: {
                en: light.features?.join('. ') || '',
                tr: light.features?.join('. ') || ''
            },
            price: light.price || 0,
            icon: '💡',
            product_type: 'lighting',
            specs: {
                watts: light.watts,
                actualWatts: light.actualWatts,
                ppfd: light.ppfd,
                coverage: light.coverage,
                dimensions: light.dimensions,
                leds: light.leds,
                spectrum: light.spectrum,
                efficiency: light.efficiency,
                lifespan: light.lifespan,
                series: light.series,
                tier: light.tier
            },
            images: light.image ? [light.image] : [],
            is_active: true
        }, { onConflict: 'sku' });

        if (error) {
            console.error(`  ❌ ${light.name}: ${error.message}`);
            failed++;
        } else {
            success++;
        }
    }

    console.log(`  ✅ ${success} başarılı, ❌ ${failed} hatalı`);
}

// ============================================
// MIGRATE VENTILATION (Fans + Filters + Ducts)
// ============================================
async function migrateVentilation() {
    console.log('\n🌬️ Havalandırma ekipmanları migrate ediliyor...');

    let success = 0, failed = 0;
    const allVentilation = [...FAN_PRODUCTS, ...CARBON_FILTER_PRODUCTS, ...DUCTING_PRODUCTS];

    for (const item of allVentilation) {
        const brandId = await getBrandId(item.brand);
        const categoryId = await getCategoryId('ventilation');

        const { error } = await supabase.from('products').upsert({
            sku: item.id,
            brand_id: brandId,
            category_id: categoryId,
            name: { en: item.fullName || item.name, tr: item.fullName || item.name },
            description: {
                en: item.features?.join('. ') || '',
                tr: item.features?.join('. ') || ''
            },
            price: Math.round(item.price) || 0,
            icon: '🌬️',
            product_type: 'ventilation',
            specs: {
                type: item.type,
                cfm: item.cfm,
                diameter: item.diameter,
                noiseLevel: item.noiseLevel,
                watts: item.watts,
                dimensions: item.dimensions,
                series: item.series,
                tier: item.tier
            },
            is_active: true
        }, { onConflict: 'sku' });

        if (error) {
            console.error(`  ❌ ${item.name}: ${error.message}`);
            failed++;
        } else {
            success++;
        }
    }

    console.log(`  ✅ ${success} başarılı, ❌ ${failed} hatalı`);
}

// ============================================
// MIGRATE MONITORING & ACCESSORIES
// ============================================
async function migrateAccessories() {
    console.log('\n🔧 İzleme ve aksesuarlar migrate ediliyor...');

    let success = 0, failed = 0;
    const allItems = [
        ...MONITORING_PRODUCTS,
        ...TIMER_PRODUCTS,
        ...POT_PRODUCTS,
        ...HANGER_PRODUCTS,
        ...CO2_ODOR_PRODUCTS,
        ...SUBSTRATE_PRODUCTS
    ];

    for (const item of allItems) {
        const brandId = await getBrandId(item.brand);
        const categoryKey = item.type === 'pot' || item.type === 'hanger' ? 'accessories' : 'monitoring';
        const categoryId = await getCategoryId(categoryKey);

        const { error } = await supabase.from('products').upsert({
            sku: item.id,
            brand_id: brandId,
            category_id: categoryId,
            name: { en: item.fullName || item.name, tr: item.fullName || item.name },
            description: {
                en: item.features?.join('. ') || '',
                tr: item.features?.join('. ') || ''
            },
            price: item.price || 0,
            icon: item.type === 'pot' ? '🪴' : item.type === 'hanger' ? '🔗' : '📊',
            product_type: categoryKey,
            specs: {
                type: item.type,
                capacity: item.capacity,
                volume: item.volume,
                tier: item.tier
            },
            is_active: true
        }, { onConflict: 'sku' });

        if (error) {
            console.error(`  ❌ ${item.name}: ${error.message}`);
            failed++;
        } else {
            success++;
        }
    }

    console.log(`  ✅ ${success} başarılı, ❌ ${failed} hatalı`);
}

// ============================================
// MIGRATE BLOG POSTS
// ============================================
// NOTE: Blog migration has been moved to migrate-blog.js
// This function is kept but disabled as blogData.js has been removed
async function migrateBlogPosts() {
    console.log('\n📝 Blog migration skipped - use migrate-blog.js instead');
    console.log('  ℹ️ Blog posts are now managed directly in Supabase');
}

// ============================================
// MAIN MIGRATION
// ============================================
async function main() {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║     SUPABASE DATA MIGRATION BAŞLIYOR       ║');
    console.log('╚════════════════════════════════════════════╝');

    try {
        // Check existing brands
        const { data: brands } = await supabase.from('brands').select('*');
        console.log(`\n📋 Mevcut markalar: ${brands?.length || 0}`);

        // Add missing brands
        console.log('\n🏷️ Eksik markalar ekleniyor...');
        await insertBrand('Sonoff', 'sonoff', '🔌', '#FF6B35');
        await insertBrand('TP-Link', 'tp-link', '📶', '#4ECDC4');
        await insertBrand('Xiaomi', 'xiaomi', '📱', '#FF6B00');
        await insertBrand('Inkbird', 'inkbird', '🌡️', '#2E86AB');
        await insertBrand('Generic', 'generic', '📦', '#6B7280');

        // Run migrations
        await migrateBioBizz();
        await migrateCanna();
        await migrateAdvancedNutrients();
        await migrateTents();
        await migrateLighting();
        await migrateVentilation();
        await migrateAccessories();
        await migrateBlogPosts();

        // Final count
        const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: blogCount } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });

        console.log('\n╔════════════════════════════════════════════╗');
        console.log('║          MIGRATION TAMAMLANDI!             ║');
        console.log('╚════════════════════════════════════════════╝');
        console.log(`\n📊 Toplam ürün sayısı: ${count}`);
        console.log(`📝 Toplam blog yazısı: ${blogCount}`);

    } catch (error) {
        console.error('\n❌ Migration hatası:', error.message);
    }
}

main();
