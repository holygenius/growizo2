/**
 * Feeding Schedule API Service
 * Fetches feeding schedules and related data from Supabase
 */

import { supabase, isSupabaseConfigured } from '../supabase';

// Cache for feeding schedule data
let feedingScheduleCache = null;
let substrateMappingsCache = null;

/**
 * Fetch all feeding schedule items from Supabase
 * @returns {Promise<Array>} Array of feeding schedule items with products
 */
export async function fetchFeedingScheduleProducts() {
    if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured, returning empty array');
        return [];
    }

    // Return cached data if available
    if (feedingScheduleCache) {
        return feedingScheduleCache;
    }

    const { data, error } = await supabase
        .from('feeding_schedule_items')
        .select(`
            *,
            products (
                id,
                sku,
                name,
                icon,
                images,
                specs
            ),
            feeding_schedules (
                id,
                name,
                substrate_type,
                brand_id
            )
        `)
        .eq('is_active', true)
        .order('week_number', { ascending: true })
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('Error fetching feeding schedule items:', error);
        throw error;
    }

    // Cache the data
    feedingScheduleCache = data || [];
    return feedingScheduleCache;
}

/**
 * Fetch substrate type mappings
 * @returns {Promise<Object>} Substrate to schedule type mapping
 */
export async function fetchSubstrateMappings() {
    // Return cached data if available
    if (substrateMappingsCache) {
        return substrateMappingsCache;
    }

    // These mappings are static, so we return them directly
    // Could be moved to Supabase in the future if needed
    substrateMappingsCache = {
        'all-mix': 'SCHEDULE_ALLMIX',
        'light-mix': 'SCHEDULE_LIGHTMIX_COCOMIX',
        'coco-mix': 'SCHEDULE_LIGHTMIX_COCOMIX'
    };

    return substrateMappingsCache;
}

/**
 * Get substrate types
 * @returns {Object} Substrate type constants
 */
export function getSubstrateTypes() {
    return {
        ALL_MIX: 'all-mix',
        LIGHT_MIX: 'light-mix',
        COCO_MIX: 'coco-mix'
    };
}

/**
 * Get week labels
 * @returns {Array<string>} Array of week labels
 */
export function getWeekLabels() {
    return [
        'WK 1', 'WK 2', 'WK 3', 'WK 4', 'WK 5', 'WK 6',
        'WK 7', 'WK 8', 'WK 9', 'WK 10', 'WK 11', 'WK 12'
    ];
}

/**
 * Get phase info
 * @returns {Object} Phase information with weeks, labels, and colors
 */
export function getPhaseInfo() {
    return {
        rooting: { weeks: [1, 2], label_key: 'phaseLabelRooting', color: '#8B5CF6' },
        vegetative: { weeks: [3, 4, 5, 6], label_key: 'phaseLabelVeg', color: '#22C55E' },
        flowering: { weeks: [7, 8, 9, 10], label_key: 'phaseLabelFlower', color: '#EC4899' },
        flush: { weeks: [11], label_key: 'phaseLabelFlush', color: '#6B7280' },
        harvest: { weeks: [12], label_key: 'phaseLabelHarvest', color: '#F59E0B' }
    };
}

/**
 * Get default selected products
 * @returns {Array<string>} Array of default product IDs
 */
export function getDefaultSelectedProducts() {
    return ['bio-grow', 'bio-bloom', 'top-max', 'root-juice'];
}

/**
 * Get product categories
 * @returns {Object} Product category definitions
 */
export function getProductCategories() {
    return {
        base_nutrient: { name_key: 'catBaseNutrient', icon: '🌱' },
        stimulator_root: { name_key: 'catStimRoot', icon: '🌳' },
        stimulator_bloom: { name_key: 'catStimBloom', icon: '🌸' },
        stimulator_vitality: { name_key: 'catStimVitality', icon: '✨' },
        booster: { name_key: 'catBooster', icon: '⚡' },
        activator: { name_key: 'catActivator', icon: '🔋' },
        microorganisms: { name_key: 'catMicrobes', icon: '🦠' },
        supplement: { name_key: 'catSupplement', icon: '💊' },
        protector: { name_key: 'catProtector', icon: '🛡️' },
        ph_regulator: { name_key: 'catPhReg', icon: '⚖️' }
    };
}

/**
 * Get substrate info
 * @returns {Object} Substrate information
 */
export function getSubstrateInfo() {
    return {
        'all-mix': {
            name: 'All·Mix®',
            description_key: 'subDescAllMix',
            type: 'substrate'
        },
        'light-mix': {
            name: 'Light·Mix®',
            description_key: 'subDescLightMix',
            type: 'substrate'
        },
        'coco-mix': {
            name: 'Coco·Mix™',
            description_key: 'subDescCocoMix',
            type: 'substrate'
        },
        'worm-humus': {
            name: 'Worm·Humus™',
            description_key: 'subDescWormHumus',
            type: 'amendment'
        },
        'pre-mix': {
            name: 'Pre·Mix™',
            description_key: 'subDescPreMix',
            type: 'amendment'
        }
    };
}

/**
 * Clear cache (useful for development/testing)
 */
export function clearCache() {
    feedingScheduleCache = null;
    substrateMappingsCache = null;
}
