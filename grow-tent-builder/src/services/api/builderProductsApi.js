/**
 * Builder Products API Service
 * Fetches all product categories from Supabase
 */

import { supabase, isSupabaseConfigured } from '../supabase';

// Cache for products by type
const productsCache = new Map();

/**
 * Transform Supabase product to app format
 */
const transformProduct = (product) => {
    const specs = product.specs || {};
    
    // Base product structure
    // Note: price is no longer in products table, it's in vendor_products
    const transformed = {
        id: product.sku,
        brand: specs.brand || '',
        series: specs.series || '',
        name: product.name?.en || product.name?.tr || product.sku,
        fullName: product.name?.en || product.name?.tr || product.sku,
        tier: specs.tier || 'standard',
        features: specs.features || [],
        image: product.images?.[0] || ''
    };
    
    // Add all specs back to the product
    Object.keys(specs).forEach(key => {
        if (!['brand', 'series', 'tier', 'features'].includes(key)) {
            transformed[key] = specs[key];
        }
    });
    
    return transformed;
};

/**
 * Fetch products by type
 * @param {string} productType - Product type (tent, light, fan, etc.)
 * @returns {Promise<Array>} Array of products
 */
export async function fetchProductsByType(productType) {
    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, returning empty array');
        return [];
    }

    // Check cache
    const cacheKey = `type_${productType}`;
    if (productsCache.has(cacheKey)) {
        return productsCache.get(cacheKey);
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('product_type', productType)
        .eq('is_active', true)
        .order('sku', { ascending: true });

    if (error) {
        console.error(`Error fetching ${productType} products:`, error);
        throw error;
    }

    const products = (data || []).map(transformProduct);
    productsCache.set(cacheKey, products);
    return products;
}

/**
 * Fetch all products
 * @returns {Promise<Array>} Array of all products
 */
export async function fetchAllProducts() {
    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, returning empty array');
        return [];
    }

    const cacheKey = 'all_products';
    if (productsCache.has(cacheKey)) {
        return productsCache.get(cacheKey);
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('product_type', { ascending: true })
        .order('sku', { ascending: true });

    if (error) {
        console.error('Error fetching all products:', error);
        throw error;
    }

    const products = (data || []).map(transformProduct);
    productsCache.set(cacheKey, products);
    return products;
}

/**
 * Fetch product by SKU/ID
 * @param {string} sku - Product SKU
 * @returns {Promise<Object|null>} Product object or null
 */
export async function fetchProductBySku(sku) {
    if (!isSupabaseConfigured()) {
        return null;
    }

    // Check cache first
    for (const [, products] of productsCache) {
        const found = products.find(p => p.id === sku);
        if (found) return found;
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('sku', sku)
        .maybeSingle();

    if (error) {
        console.error('Error fetching product:', error);
        return null;
    }

    return data ? transformProduct(data) : null;
}

// ============================================
// SPECIFIC PRODUCT TYPE FETCHERS
// ============================================

/**
 * Fetch tent products
 */
export async function fetchTentProducts() {
    return fetchProductsByType('tent');
}

/**
 * Fetch LED products
 */
export async function fetchLEDProducts() {
    return fetchProductsByType('lighting');
}

/**
 * Fetch fan products
 */
export async function fetchFanProducts() {
    return fetchProductsByType('ventilation');
}

/**
 * Fetch carbon filter products
 */
export async function fetchCarbonFilterProducts() {
    return fetchProductsByType('filter');
}

/**
 * Fetch ventilation sets
 */
export async function fetchVentilationSets() {
    return fetchProductsByType('ventilation_set');
}

/**
 * Fetch ducting products
 */
export async function fetchDuctingProducts() {
    return fetchProductsByType('ducting');
}

/**
 * Fetch substrate products
 */
export async function fetchSubstrateProducts() {
    return fetchProductsByType('substrate');
}

/**
 * Fetch pot products
 */
export async function fetchPotProducts() {
    return fetchProductsByType('pot');
}

/**
 * Fetch timer products
 */
export async function fetchTimerProducts() {
    return fetchProductsByType('timer');
}

/**
 * Fetch monitoring products
 */
export async function fetchMonitoringProducts() {
    return fetchProductsByType('monitoring');
}

/**
 * Fetch hanger products
 */
export async function fetchHangerProducts() {
    return fetchProductsByType('hanger');
}

/**
 * Fetch CO2/odor products
 */
export async function fetchCO2OdorProducts() {
    return fetchProductsByType('co2_odor');
}

/**
 * Fetch nutrient products
 */
export async function fetchNutrientProducts() {
    return fetchProductsByType('nutrient');
}

/**
 * Clear products cache
 */
export function clearProductsCache() {
    productsCache.clear();
}

/**
 * Preload all product categories (for faster initial load)
 */
export async function preloadAllProducts() {
    const productTypes = [
        'tent', 'light', 'fan', 'filter', 'ventilation_set',
        'ducting', 'substrate', 'pot', 'timer', 'monitoring',
        'hanger', 'co2_odor', 'nutrient'
    ];
    
    await Promise.all(productTypes.map(type => fetchProductsByType(type)));
}
