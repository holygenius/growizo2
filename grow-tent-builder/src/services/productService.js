import { supabase } from './supabase';

export const productService = {
    /**
     * Get products by brand and optional category
     */
    async getProducts(brandId, categoryId = null) {
        let query = supabase
            .from('products')
            .select(`
                *,
                categories (
                    name,
                    key
                )
            `)
            .eq('brand_id', brandId)
            .eq('is_active', true);

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching products:', error);
            throw error;
        }

        return data;
    },

    /**
     * Get product by SKU or ID
     */
    async getProductBySku(skuOrId) {
        console.log('[productService] getProductBySku called with:', skuOrId);
        
        // First try by SKU (case-insensitive)
        let { data, error } = await supabase
            .from('products')
            .select(`
                *,
                brands (
                    id,
                    name,
                    logo_url
                ),
                categories (
                    id,
                    name,
                    key
                )
            `)
            .ilike('sku', skuOrId)
            .maybeSingle();

        console.log('[productService] SKU query result:', { data, error });

        // If not found by SKU, try by ID (for UUID format)
        if (!data && !error) {
            console.log('[productService] Trying by ID...');
            const idResult = await supabase
                .from('products')
                .select(`
                    *,
                    brands (
                        id,
                        name,
                        logo_url
                    ),
                    categories (
                        id,
                        name,
                        key
                    )
                `)
                .eq('id', skuOrId)
                .maybeSingle();
            
            data = idResult.data;
            error = idResult.error;
            console.log('[productService] ID query result:', { data, error });
        }

        if (error) {
            console.error(`[productService] Error fetching product ${skuOrId}:`, error);
            return null;
        }

        return data;
    },

    /**
     * Get products by type (e.g., 'tent', 'light')
     */
    async getProductsByType(type) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('product_type', type)
            .eq('is_active', true);

        if (error) {
            console.error(`Error fetching products of type ${type}:`, error);
            throw error;
        }

        return data;
    },

    /**
     * Get product with vendor prices (from vendor_products table)
     */
    async getProductWithVendors(productId) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                brands (*),
                categories (*),
                vendor_products (
                    id,
                    vendor_id,
                    vendor_sku,
                    vendor_product_name,
                    barcode,
                    price,
                    currency,
                    product_url,
                    stock_quantity,
                    stock_status,
                    is_active,
                    last_synced_at,
                    vendors (
                        id,
                        name,
                        vendor_code,
                        logo_url,
                        website_url
                    )
                )
            `)
            .eq('id', productId)
            .single();

        if (error) {
            console.error(`Error fetching product with vendors ${productId}:`, error);
            throw error;
        }

        return data;
    },

    /**
     * Get products by type with vendor pricing
     */
    async getProductsByTypeWithVendors(type) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                vendor_products (
                    id,
                    price,
                    currency,
                    product_url,
                    stock_status,
                    vendors (
                        id,
                        name,
                        vendor_code,
                        logo_url
                    )
                )
            `)
            .eq('product_type', type)
            .eq('is_active', true);

        if (error) {
            console.error(`Error fetching products of type ${type} with vendors:`, error);
            throw error;
        }

        return data;
    },

    /**
     * Get cheapest vendor price for a product
     */
    async getCheapestVendorPrice(productId) {
        const { data, error } = await supabase
            .from('vendor_products')
            .select(`
                *,
                vendors (*)
            `)
            .eq('product_id', productId)
            .eq('is_active', true)
            .order('price', { ascending: true })
            .limit(1)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error(`Error fetching cheapest price for product ${productId}:`, error);
            throw error;
        }

        return data || null;
    },

    /**
     * Get all vendor prices for a product
     */
    async getAllVendorPrices(productId) {
        const { data, error } = await supabase
            .from('vendor_products')
            .select(`
                *,
                vendors (*)
            `)
            .eq('product_id', productId)
            .eq('is_active', true)
            .order('price', { ascending: true });

        if (error) {
            console.error(`Error fetching all vendor prices for product ${productId}:`, error);
            throw error;
        }

        return data || [];
    },

    /**
     * Get price range for a product (min/max from all vendors)
     */
    async getProductPriceRange(productId) {
        const { data, error } = await supabase
            .from('vendor_products')
            .select('price')
            .eq('product_id', productId)
            .eq('is_active', true);

        if (error) {
            console.error(`Error fetching price range for product ${productId}:`, error);
            return { minPrice: null, maxPrice: null, vendorCount: 0 };
        }

        if (!data || data.length === 0) {
            return { minPrice: null, maxPrice: null, vendorCount: 0 };
        }

        const prices = data.map(d => d.price);
        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            vendorCount: data.length
        };
    },

    /**
     * Get products with price ranges (for listing pages)
     */
    async getProductsWithPriceRanges(filters = {}) {
        let query = supabase
            .from('products')
            .select(`
                *,
                brands (id, name, slug, logo_url),
                categories (id, name, key),
                vendor_products (price, is_active)
            `)
            .eq('is_active', true);

        if (filters.brandId) {
            query = query.eq('brand_id', filters.brandId);
        }
        if (filters.categoryId) {
            query = query.eq('category_id', filters.categoryId);
        }
        if (filters.productType) {
            query = query.eq('product_type', filters.productType);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching products with price ranges:', error);
            throw error;
        }

        // Calculate price ranges for each product
        return (data || []).map(product => {
            const activePrices = (product.vendor_products || [])
                .filter(vp => vp.is_active)
                .map(vp => vp.price);
            
            return {
                ...product,
                minPrice: activePrices.length > 0 ? Math.min(...activePrices) : null,
                maxPrice: activePrices.length > 0 ? Math.max(...activePrices) : null,
                vendorCount: activePrices.length,
                vendor_products: undefined // Remove raw data
            };
        });
    },

    /**
     * Get vendor price comparison for multiple products
     */
    async getVendorPriceComparison(productIds) {
        const { data, error } = await supabase
            .from('vendor_products')
            .select(`
                *,
                vendors (*)
            `)
            .in('product_id', productIds)
            .eq('is_active', true)
            .order('price', { ascending: true });

        if (error) {
            console.error('Error fetching vendor price comparison:', error);
            throw error;
        }

        // Group by product ID
        const comparison = {};
        (data || []).forEach(vp => {
            if (!comparison[vp.product_id]) {
                comparison[vp.product_id] = [];
            }
            comparison[vp.product_id].push(vp);
        });

        return comparison;
    },

    /**
     * Search products with combined filters
     * Returns products with price_range from vendor_products
     */
    async searchProducts({ searchTerm = '', brandIds = [], categoryIds = [], sortBy = 'newest', page = 1, limit = 12 }) {
        // Base query
        let query = supabase
            .from('products')
            .select(`
                *,
                brands (id, name, slug),
                categories (id, name, key),
                vendor_products (price, is_active)
            `, { count: 'exact' })
            .eq('is_active', true);

        // Text search
        if (searchTerm) {
            query = query.or(`sku.ilike.%${searchTerm}%`);
        }

        // Filters
        if (brandIds.length > 0) {
            query = query.in('brand_id', brandIds);
        }

        if (categoryIds.length > 0) {
            query = query.in('category_id', categoryIds);
        }

        // Sorting
        if (sortBy === 'newest') {
            query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'name_asc') {
            query = query.order('sku', { ascending: true });
        } else if (sortBy === 'name_desc') {
            query = query.order('sku', { ascending: false });
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error searching products:', error);
            throw error;
        }

        // Calculate price ranges and filter by search term
        let processedData = (data || []).map(product => {
            const activePrices = (product.vendor_products || [])
                .filter(vp => vp.is_active)
                .map(vp => vp.price);
            
            return {
                ...product,
                // Add price_range object for ProductCard
                price_range: activePrices.length > 0 ? {
                    min_price: Math.min(...activePrices),
                    max_price: Math.max(...activePrices),
                    vendor_count: activePrices.length
                } : null,
                // Legacy fields for backward compatibility
                minPrice: activePrices.length > 0 ? Math.min(...activePrices) : null,
                maxPrice: activePrices.length > 0 ? Math.max(...activePrices) : null,
                vendorCount: activePrices.length,
                vendor_products: undefined
            };
        });

        // Client-side text search for JSONB name fields
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            processedData = processedData.filter(p =>
                p.sku?.toLowerCase().includes(lowerTerm) ||
                p.name?.en?.toLowerCase().includes(lowerTerm) ||
                p.name?.tr?.toLowerCase().includes(lowerTerm)
            );
        }

        return { data: processedData, count, page, limit };
    }
};
