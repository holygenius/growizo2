/**
 * Migration Script: Builder Products to Supabase
 * 
 * Migrates all product categories from builderProducts.js to Supabase products table
 * 
 * Run: node scripts/migrate-builder-products.js
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import {
    TENT_PRODUCTS,
    LED_PRODUCTS,
    FAN_PRODUCTS,
    CARBON_FILTER_PRODUCTS,
    VENTILATION_SETS,
    DUCTING_PRODUCTS,
    SUBSTRATE_PRODUCTS,
    POT_PRODUCTS,
    TIMER_PRODUCTS,
    MONITORING_PRODUCTS,
    HANGER_PRODUCTS,
    CO2_ODOR_PRODUCTS,
    NUTRIENT_PRODUCTS
} from '../src/data/builderProducts.js';

// Supabase client
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Product type mapping
const PRODUCT_TYPES = {
    tent: 'tent',
    led: 'light',
    fan: 'fan',
    filter: 'filter',
    ventilation_set: 'ventilation_set',
    ducting: 'ducting',
    substrate: 'substrate',
    pot: 'pot',
    timer: 'timer',
    monitoring: 'monitoring',
    hanger: 'hanger',
    co2_odor: 'co2_odor',
    nutrient: 'nutrient'
};

// Helper to create name JSONB
const createName = (product) => {
    if (product.fullName) {
        return { en: product.fullName, tr: product.fullName };
    }
    if (product.name && typeof product.name === 'object') {
        return product.name;
    }
    return { en: product.name || product.id, tr: product.name || product.id };
};

// Helper to create specs JSONB based on product type
const createSpecs = (product, productType) => {
    const specs = {};
    
    // Common specs
    if (product.brand) specs.brand = product.brand;
    if (product.series) specs.series = product.series;
    if (product.tier) specs.tier = product.tier;
    if (product.features) specs.features = product.features;
    
    // Tent-specific
    if (productType === 'tent') {
        if (product.dimensions) specs.dimensions = product.dimensions;
        if (product.dimensionsFt) specs.dimensionsFt = product.dimensionsFt;
        if (product.volume) specs.volume = product.volume;
        if (product.weight) specs.weight = product.weight;
        if (product.ventPorts) specs.ventPorts = product.ventPorts;
        if (product.windows) specs.windows = product.windows;
        if (product.waterTray) specs.waterTray = product.waterTray;
        if (product.frameMaterial) specs.frameMaterial = product.frameMaterial;
        if (product.fabricMaterial) specs.fabricMaterial = product.fabricMaterial;
        if (product.hangingCapacity) specs.hangingCapacity = product.hangingCapacity;
        if (product.recommendedLighting) specs.recommendedLighting = product.recommendedLighting;
        if (product.recommendedExtraction) specs.recommendedExtraction = product.recommendedExtraction;
    }
    
    // LED-specific
    if (productType === 'light') {
        if (product.watts) specs.watts = product.watts;
        if (product.coverage) specs.coverage = product.coverage;
        if (product.ppf) specs.ppf = product.ppf;
        if (product.maxPPFD) specs.maxPPFD = product.maxPPFD;
        if (product.efficiency) specs.efficiency = product.efficiency;
        if (product.spectrum) specs.spectrum = product.spectrum;
        if (product.dimmable !== undefined) specs.dimmable = product.dimmable;
        if (product.beamAngle) specs.beamAngle = product.beamAngle;
        if (product.physicalWidth) specs.physicalWidth = product.physicalWidth;
        if (product.physicalDepth) specs.physicalDepth = product.physicalDepth;
        if (product.hangHeight) specs.hangHeight = product.hangHeight;
        if (product.recommendedHeight) specs.recommendedHeight = product.recommendedHeight;
        if (product.lifespan) specs.lifespan = product.lifespan;
        if (product.warranty) specs.warranty = product.warranty;
        if (product.ip) specs.ip = product.ip;
        if (product.ledCount) specs.ledCount = product.ledCount;
        if (product.ledType) specs.ledType = product.ledType;
        if (product.driver) specs.driver = product.driver;
    }
    
    // Fan-specific
    if (productType === 'fan') {
        if (product.specs) {
            specs.cfm = product.specs.cfm;
            specs.wattage = product.specs.wattage;
            specs.diameter = product.specs.diameter;
            specs.noiseLevel = product.specs.noiseLevel;
            specs.speedControl = product.specs.speedControl;
        }
        if (product.diameter) specs.diameter = product.diameter;
    }
    
    // Filter-specific
    if (productType === 'filter') {
        if (product.specs) {
            specs.cfm = product.specs.cfm;
            specs.diameter = product.specs.diameter;
            specs.carbonType = product.specs.carbonType;
            specs.lifespan = product.specs.lifespan;
        }
        if (product.diameter) specs.diameter = product.diameter;
    }
    
    // Ventilation set-specific
    if (productType === 'ventilation_set') {
        if (product.includes) specs.includes = product.includes;
        if (product.capacity) specs.capacity = product.capacity;
        if (product.diameter) specs.diameter = product.diameter;
    }
    
    // Ducting-specific
    if (productType === 'ducting') {
        if (product.diameter) specs.diameter = product.diameter;
        if (product.length) specs.length = product.length;
        if (product.material) specs.material = product.material;
    }
    
    // Substrate-specific
    if (productType === 'substrate') {
        if (product.type) specs.substrateType = product.type;
        if (product.volume) specs.volume = product.volume;
        if (product.ingredients) specs.ingredients = product.ingredients;
        if (product.ph) specs.ph = product.ph;
        if (product.ec) specs.ec = product.ec;
    }
    
    // Pot-specific
    if (productType === 'pot') {
        if (product.capacity) specs.capacity = product.capacity;
        if (product.type) specs.potType = product.type;
        if (product.material) specs.material = product.material;
        if (product.dimensions) specs.dimensions = product.dimensions;
    }
    
    // Timer-specific
    if (productType === 'timer') {
        if (product.type) specs.timerType = product.type;
        if (product.outlets) specs.outlets = product.outlets;
        if (product.maxLoad) specs.maxLoad = product.maxLoad;
    }
    
    // Monitoring-specific
    if (productType === 'monitoring') {
        if (product.type) specs.monitoringType = product.type;
        if (product.measures) specs.measures = product.measures;
        if (product.connectivity) specs.connectivity = product.connectivity;
        if (product.accuracy) specs.accuracy = product.accuracy;
    }
    
    // Hanger-specific
    if (productType === 'hanger') {
        if (product.capacity) specs.capacity = product.capacity;
        if (product.adjustable !== undefined) specs.adjustable = product.adjustable;
        if (product.length) specs.length = product.length;
    }
    
    // CO2/Odor-specific
    if (productType === 'co2_odor') {
        if (product.type) specs.productSubType = product.type;
        if (product.coverage) specs.coverage = product.coverage;
    }
    
    // Nutrient-specific
    if (productType === 'nutrient') {
        if (product.packaging) specs.packaging = product.packaging;
        if (product.category) specs.category = product.category;
        if (product.phase) specs.phase = product.phase;
        if (product.application) specs.application = product.application;
        if (product.npk) specs.npk = product.npk;
    }
    
    return specs;
};

// Generic migration function for any product array
async function migrateProducts(products, productType, categoryName) {
    console.log(`\n📦 ${categoryName} migrate ediliyor...`);
    
    let success = 0, failed = 0, skipped = 0;
    
    for (const product of products) {
        const sku = product.id;
        
        // Check if already exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('sku', sku)
            .maybeSingle();
        
        if (existing) {
            skipped++;
            continue;
        }
        
        const productData = {
            sku: sku,
            name: createName(product),
            description: product.description ? 
                (typeof product.description === 'object' ? product.description : { en: product.description, tr: product.description }) 
                : {},
            price: Math.round(product.price || 0),
            product_type: productType,
            specs: createSpecs(product, productType),
            images: product.image ? [product.image] : [],
            is_active: true,
            is_featured: product.featured || false
        };
        
        const { error } = await supabase
            .from('products')
            .insert(productData);
        
        if (error) {
            console.error(`  ❌ ${sku}: ${error.message}`);
            failed++;
        } else {
            success++;
        }
    }
    
    console.log(`  ✅ ${success} eklendi, ⏭️ ${skipped} zaten var, ❌ ${failed} hatalı`);
    return { success, skipped, failed };
}

// ============================================
// MAIN
// ============================================
async function main() {
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║     BUILDER PRODUCTS MIGRATION TO SUPABASE         ║');
    console.log('╚════════════════════════════════════════════════════╝');
    
    const results = {
        total: { success: 0, skipped: 0, failed: 0 }
    };
    
    try {
        // Migrate all product categories
        const migrations = [
            { products: TENT_PRODUCTS, type: 'tent', name: 'Çadırlar (Tents)' },
            { products: LED_PRODUCTS, type: 'light', name: 'LED Aydınlatmalar' },
            { products: FAN_PRODUCTS, type: 'fan', name: 'Fanlar' },
            { products: CARBON_FILTER_PRODUCTS, type: 'filter', name: 'Karbon Filtreler' },
            { products: VENTILATION_SETS, type: 'ventilation_set', name: 'Havalandırma Setleri' },
            { products: DUCTING_PRODUCTS, type: 'ducting', name: 'Boru/Ducting' },
            { products: SUBSTRATE_PRODUCTS, type: 'substrate', name: 'Substratlar' },
            { products: POT_PRODUCTS, type: 'pot', name: 'Saksılar' },
            { products: TIMER_PRODUCTS, type: 'timer', name: 'Zamanlayıcılar' },
            { products: MONITORING_PRODUCTS, type: 'monitoring', name: 'Monitörler' },
            { products: HANGER_PRODUCTS, type: 'hanger', name: 'Askılar' },
            { products: CO2_ODOR_PRODUCTS, type: 'co2_odor', name: 'CO2/Koku Ürünleri' },
            { products: NUTRIENT_PRODUCTS, type: 'nutrient', name: 'Besin Ürünleri' }
        ];
        
        for (const { products, type, name } of migrations) {
            if (products && products.length > 0) {
                const result = await migrateProducts(products, type, name);
                results.total.success += result.success;
                results.total.skipped += result.skipped;
                results.total.failed += result.failed;
            } else {
                console.log(`\n⚠️ ${name}: Boş veya tanımsız`);
            }
        }
        
        // Get final count
        const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });
        
        console.log('\n╔════════════════════════════════════════════════════╗');
        console.log('║              MIGRATION TAMAMLANDI!                 ║');
        console.log('╚════════════════════════════════════════════════════╝');
        console.log(`\n📊 Yeni eklenen: ${results.total.success}`);
        console.log(`📊 Zaten mevcut: ${results.total.skipped}`);
        console.log(`📊 Hatalı: ${results.total.failed}`);
        console.log(`📊 Toplam ürün sayısı: ${count}`);
        
    } catch (error) {
        console.error('Migration hatası:', error);
        process.exit(1);
    }
}

main();
