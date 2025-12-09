/**
 * Migrate Feeding Schedules and Preset Sets to Supabase
 * Run: node scripts/migrate-feeding-presets.js
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Import static data
import { FEEDING_SCHEDULE_DATA, SUBSTRATE_TYPES } from '../src/data/feedingScheduleData.js';
import { PRESET_SETS } from '../src/data/presetSets.js';

// ============================================
// MIGRATE FEEDING SCHEDULES
// ============================================
async function migrateFeedingSchedules() {
    console.log('\n📋 Besleme programları migrate ediliyor...');
    
    // Get BioBizz brand ID
    const { data: biobizzBrand } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', 'biobizz')
        .single();
    
    if (!biobizzBrand) {
        console.error('❌ BioBizz markası bulunamadı!');
        return;
    }
    
    // Transform feeding schedule data into Supabase format
    // Group products by substrate type
    const schedules = [
        {
            name: { en: 'BioBizz All-Mix Schedule', tr: 'BioBizz All-Mix Programı' },
            substrate_type: 'soil-allmix',
            brand_id: biobizzBrand.id,
            schedule_data: buildScheduleMatrix('allmix'),
            phases: {
                seedling: [1, 2],
                veg: [3, 4, 5, 6],
                flower: [7, 8, 9, 10],
                flush: [11],
                harvest: [12]
            },
            notes: {
                en: 'For heavily pre-fertilized All-Mix substrate. Lower dosages in early weeks.',
                tr: 'Ağır gübrelenmiş All-Mix substrat için. İlk haftalarda düşük dozaj.'
            },
            is_active: true
        },
        {
            name: { en: 'BioBizz Light-Mix / Coco Schedule', tr: 'BioBizz Light-Mix / Coco Programı' },
            substrate_type: 'soil-lightmix',
            brand_id: biobizzBrand.id,
            schedule_data: buildScheduleMatrix('lightmix'),
            phases: {
                seedling: [1, 2],
                veg: [3, 4, 5, 6],
                flower: [7, 8, 9, 10],
                flush: [11],
                harvest: [12]
            },
            notes: {
                en: 'For Light-Mix or Coco-Mix substrates. Standard dosages throughout.',
                tr: 'Light-Mix veya Coco-Mix substratlar için. Standart dozaj.'
            },
            is_active: true
        }
    ];
    
    let success = 0, failed = 0;
    
    for (const schedule of schedules) {
        const { error } = await supabase
            .from('feeding_schedules')
            .upsert(schedule, { onConflict: 'id' });
        
        if (error) {
            console.error(`  ❌ ${schedule.name.en}: ${error.message}`);
            failed++;
        } else {
            console.log(`  ✅ ${schedule.name.en}`);
            success++;
        }
    }
    
    console.log(`  📊 ${success} başarılı, ${failed} hatalı`);
}

// ============================================
// MIGRATE FEEDING SCHEDULE PRODUCTS
// ============================================
async function migrateFeedingScheduleProducts() {
    console.log('\n📋 Besleme programı ürünleri migrate ediliyor...');
    
    let success = 0, failed = 0;
    
    for (const product of FEEDING_SCHEDULE_DATA) {
        const { error } = await supabase
            .from('feeding_schedule_products')
            .upsert({
                id: product.id,
                product_name: product.product_name,
                category: product.category,
                dose_unit: product.dose_unit || 'ml/L',
                schedule_allmix: product.schedule_allmix || {},
                schedule_lightmix_coco: product.schedule_lightmix_coco || {},
                icon: product.icon || '🌱',
                is_active: true
            }, { onConflict: 'id' });
        
        if (error) {
            console.error(`  ❌ ${product.product_name}: ${error.message}`);
            failed++;
        } else {
            console.log(`  ✅ ${product.product_name}`);
            success++;
        }
    }
    
    console.log(`  📊 ${success} başarılı, ${failed} hatalı`);
}

// Build weekly schedule matrix
function buildScheduleMatrix(type) {
    const weeks = ['WK 1', 'WK 2', 'WK 3', 'WK 4', 'WK 5', 'WK 6', 'WK 7', 'WK 8', 'WK 9', 'WK 10', 'WK 11', 'WK 12'];
    const matrix = {};
    
    weeks.forEach((week, index) => {
        matrix[`week_${index + 1}`] = {};
        
        FEEDING_SCHEDULE_DATA.forEach(product => {
            let dose;
            
            if (type === 'allmix' && product.schedule_allmix) {
                dose = product.schedule_allmix[week];
            } else if (type === 'lightmix' && product.schedule_lightmix_coco) {
                dose = product.schedule_lightmix_coco[week];
            } else {
                dose = product.schedule?.[week];
            }
            
            if (dose !== undefined && dose !== 'N/A') {
                matrix[`week_${index + 1}`][product.id] = {
                    dose: dose,
                    unit: product.dose_unit
                };
            }
        });
    });
    
    return matrix;
}

// ============================================
// MIGRATE PRESET SETS
// ============================================
async function migratePresetSets() {
    console.log('\n🎁 Hazır setler migrate ediliyor...');
    
    let success = 0, failed = 0;
    
    for (const preset of PRESET_SETS) {
        // Transform items to products array
        const products = [];
        
        // Tent
        if (preset.items.tent) {
            products.push({ sku: preset.items.tent, quantity: 1, type: 'tent' });
        }
        
        // Lighting
        if (preset.items.lighting) {
            preset.items.lighting.forEach(light => {
                products.push({ sku: light.id, quantity: light.qty || 1, type: 'lighting' });
            });
        }
        
        // Ventilation
        if (preset.items.ventilation) {
            if (preset.items.ventilation.fan) {
                products.push({ sku: preset.items.ventilation.fan, quantity: 1, type: 'fan' });
            }
            if (preset.items.ventilation.filter) {
                products.push({ sku: preset.items.ventilation.filter, quantity: 1, type: 'filter' });
            }
            if (preset.items.ventilation.controller) {
                products.push({ sku: preset.items.ventilation.controller, quantity: 1, type: 'controller' });
            }
        }
        
        // Substrate
        if (preset.items.substrate) {
            preset.items.substrate.forEach(sub => {
                products.push({ sku: sub.id, quantity: sub.qty || 1, type: 'substrate' });
            });
        }
        
        // Pots
        if (preset.items.pots) {
            preset.items.pots.forEach(pot => {
                products.push({ sku: pot.id, quantity: pot.qty || 1, type: 'pot' });
            });
        }
        
        // Nutrients
        if (preset.items.nutrients) {
            preset.items.nutrients.forEach(nut => {
                products.push({ sku: nut, quantity: 1, type: 'nutrient' });
            });
        }
        
        // Monitoring
        if (preset.items.monitoring) {
            preset.items.monitoring.forEach(mon => {
                products.push({ sku: mon, quantity: 1, type: 'monitoring' });
            });
        }
        
        // Accessories
        if (preset.items.accessories) {
            preset.items.accessories.forEach(acc => {
                products.push({ sku: acc, quantity: 1, type: 'accessory' });
            });
        }
        
        const presetData = {
            name: preset.name,
            description: preset.description,
            tier: preset.tier || 'standard',
            tent_size: preset.tentSize,
            media_type: preset.mediaType,
            nutrient_brand: preset.nutrientBrand,
            plant_count: preset.plantCount,
            items: preset.items, // Store original items structure
            products: products,  // Also store normalized products array
            total_price: Math.round(preset.totalPrice || 0),
            image_url: preset.image,
            is_active: true,
            display_order: PRESET_SETS.indexOf(preset)
        };
        
        const { error } = await supabase
            .from('preset_sets')
            .upsert(presetData, { onConflict: 'id' });
        
        if (error) {
            console.error(`  ❌ ${preset.name.en}: ${error.message}`);
            failed++;
        } else {
            console.log(`  ✅ ${preset.name.en}`);
            success++;
        }
    }
    
    console.log(`  📊 ${success} başarılı, ${failed} hatalı`);
}

// ============================================
// MAIN
// ============================================
async function main() {
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║  FEEDING SCHEDULES & PRESET SETS MIGRATION        ║');
    console.log('╚════════════════════════════════════════════════════╝');
    
    try {
        await migrateFeedingScheduleProducts();
        await migrateFeedingSchedules();
        await migratePresetSets();
        
        // Final counts
        const { count: feedingProductsCount } = await supabase
            .from('feeding_schedule_products')
            .select('*', { count: 'exact', head: true });
        
        const { count: feedingCount } = await supabase
            .from('feeding_schedules')
            .select('*', { count: 'exact', head: true });
        
        const { count: presetCount } = await supabase
            .from('preset_sets')
            .select('*', { count: 'exact', head: true });
        
        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log('║              MIGRATION TAMAMLANDI!                 ║');
        console.log('╚════════════════════════════════════════════════════╝');
        console.log(`\n📊 Toplam besleme ürünleri: ${feedingProductsCount}`);
        console.log(`📊 Toplam besleme programı: ${feedingCount}`);
        console.log(`📊 Toplam hazır set: ${presetCount}`);
        
    } catch (error) {
        console.error('\n❌ Migration hatası:', error.message);
    }
}

main();
