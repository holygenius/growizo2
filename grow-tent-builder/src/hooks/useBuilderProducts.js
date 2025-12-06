/**
 * useBuilderProducts Hook
 * 
 * React hook to access builder products from Supabase
 * Handles loading state and caching
 */

import { useState, useEffect, useCallback } from 'react';
import {
    fetchTentProducts,
    fetchLEDProducts,
    fetchFanProducts,
    fetchCarbonFilterProducts,
    fetchVentilationSets,
    fetchDuctingProducts,
    fetchSubstrateProducts,
    fetchPotProducts,
    fetchTimerProducts,
    fetchMonitoringProducts,
    fetchHangerProducts,
    fetchCO2OdorProducts,
    fetchNutrientProducts,
    preloadAllProducts
} from '../services/api/builderProductsApi';

// Global cache to share data across hook instances
const globalCache = {
    tent: null,
    lighting: null,
    light: null, // alias for lighting
    ventilation: null,
    fan: null, // alias for ventilation
    filter: null,
    ventilationSet: null,
    ducting: null,
    substrate: null,
    pot: null,
    timer: null,
    monitoring: null,
    hanger: null,
    co2Odor: null,
    nutrient: null,
    allLoaded: false
};

// Fetch function mapping
const fetchFunctions = {
    tent: fetchTentProducts,
    lighting: fetchLEDProducts,
    light: fetchLEDProducts, // alias
    ventilation: fetchFanProducts,
    fan: fetchFanProducts, // alias
    filter: fetchCarbonFilterProducts,
    ventilationSet: fetchVentilationSets,
    ducting: fetchDuctingProducts,
    substrate: fetchSubstrateProducts,
    pot: fetchPotProducts,
    timer: fetchTimerProducts,
    monitoring: fetchMonitoringProducts,
    hanger: fetchHangerProducts,
    co2Odor: fetchCO2OdorProducts,
    nutrient: fetchNutrientProducts
};

/**
 * Hook to load specific product type
 * @param {string} productType - Type of product to load
 * @returns {{ products: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useBuilderProducts(productType) {
    const [products, setProducts] = useState(globalCache[productType] || []);
    const [loading, setLoading] = useState(!globalCache[productType]);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        // Return cached data if available
        if (globalCache[productType]) {
            setProducts(globalCache[productType]);
            setLoading(false);
            return;
        }

        const fetchFn = fetchFunctions[productType];
        if (!fetchFn) {
            setError(new Error(`Unknown product type: ${productType}`));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await fetchFn();
            globalCache[productType] = data;
            setProducts(data);
        } catch (err) {
            console.error(`Error loading ${productType} products:`, err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [productType]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(async () => {
        globalCache[productType] = null;
        await fetchData();
    }, [productType, fetchData]);

    return { products, loading, error, refetch };
}

/**
 * Hook to load multiple product types at once
 * @param {string[]} productTypes - Array of product types to load
 * @returns {{ products: Object, loading: boolean, error: Error|null }}
 */
export function useMultipleBuilderProducts(productTypes) {
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadAll() {
            try {
                setLoading(true);
                setError(null);

                const results = {};
                await Promise.all(
                    productTypes.map(async (type) => {
                        if (globalCache[type]) {
                            results[type] = globalCache[type];
                        } else {
                            const fetchFn = fetchFunctions[type];
                            if (fetchFn) {
                                const data = await fetchFn();
                                globalCache[type] = data;
                                results[type] = data;
                            }
                        }
                    })
                );

                setProducts(results);
            } catch (err) {
                console.error('Error loading products:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadAll();
    }, [productTypes.join(',')]);

    return { products, loading, error };
}

/**
 * Hook to preload all products
 * Useful for app initialization
 */
export function usePreloadProducts() {
    const [loading, setLoading] = useState(!globalCache.allLoaded);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (globalCache.allLoaded) {
            setLoading(false);
            return;
        }

        async function loadAll() {
            try {
                await preloadAllProducts();
                
                // Update global cache
                globalCache.tent = await fetchTentProducts();
                globalCache.light = await fetchLEDProducts();
                globalCache.fan = await fetchFanProducts();
                globalCache.filter = await fetchCarbonFilterProducts();
                globalCache.ventilationSet = await fetchVentilationSets();
                globalCache.ducting = await fetchDuctingProducts();
                globalCache.substrate = await fetchSubstrateProducts();
                globalCache.pot = await fetchPotProducts();
                globalCache.timer = await fetchTimerProducts();
                globalCache.monitoring = await fetchMonitoringProducts();
                globalCache.hanger = await fetchHangerProducts();
                globalCache.co2Odor = await fetchCO2OdorProducts();
                globalCache.nutrient = await fetchNutrientProducts();
                
                globalCache.allLoaded = true;
            } catch (err) {
                console.error('Error preloading products:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadAll();
    }, []);

    return { loading, error, isReady: globalCache.allLoaded };
}

/**
 * Get cached products synchronously (for non-React code)
 * Returns empty array if not loaded
 */
export function getCachedProducts(productType) {
    return globalCache[productType] || [];
}

/**
 * Clear product cache
 */
export function clearProductCache() {
    Object.keys(globalCache).forEach(key => {
        if (key !== 'allLoaded') {
            globalCache[key] = null;
        }
    });
    globalCache.allLoaded = false;
}
