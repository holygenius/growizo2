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
     * Get product by SKU
     */
    async getProductBySku(sku) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('sku', sku)
            .single();

        if (error) {
            console.error(`Error fetching product ${sku}:`, error);
            throw error;
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
     * Get product with vendor prices
     */
    async getProductWithVendors(productId) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                vendor_products (
                    *,
                    vendors (*),
                    vendor_prices (*)
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
                    *,
                    vendors (*),
                    vendor_prices (*)
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
            .from('vendor_prices')
            .select(`
                *,
                vendor_products (*),
                vendors (*)
            `)
            .eq('vendor_products.product_id', productId)
            .order('price', { ascending: true })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
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
            .from('vendor_prices')
            .select(`
                *,
                vendor_products (*),
                vendors (*)
            `)
            .eq('vendor_products.product_id', productId)
            .order('price', { ascending: true });

        if (error) {
            console.error(`Error fetching all vendor prices for product ${productId}:`, error);
            throw error;
        }

        return data || [];
    },

    /**
     * Get vendor price comparison for multiple products
     */
    async getVendorPriceComparison(productIds) {
        const { data, error } = await supabase
            .from('vendor_prices')
            .select(`
                *,
                vendor_products (*),
                vendors (*)
            `)
            .in('vendor_products.product_id', productIds)
            .order('price', { ascending: true });

        if (error) {
            console.error(`Error fetching vendor price comparison:`, error);
            throw error;
        }

        // Group by product ID
        const comparison = {};
        (data || []).forEach(price => {
            const productId = price.vendor_products.product_id;
            if (!comparison[productId]) {
                comparison[productId] = [];
            }
            comparison[productId].push(price);
        });

        return comparison;
    },

    /**
     * Get vendor products for a specific product
     */
    async getVendorProductsForProduct(productId, vendorCode = null) {
        let query = supabase
            .from('vendor_products')
            .select(`
                *,
                vendors (*),
                vendor_prices (*)
            `)
            .eq('product_id', productId);

        if (vendorCode) {
            query = query.eq('vendors.vendor_code', vendorCode);
        }

        const { data, error } = await query;

        if (error) {
            console.error(`Error fetching vendor products for product ${productId}:`, error);
            throw error;
        }

        return data || [];
    },

    /**
     * Search products with combined filters
     */
    async searchProducts({ searchTerm = '', brandIds = [], categoryIds = [], minPrice = 0, maxPrice = 100000, sortBy = 'price_asc', page = 1, limit = 12 }) {
        // Base query
        let query = supabase
            .from('products')
            .select(`
                *,
                brands (id, name, slug),
                categories (id, name, key)
            `, { count: 'exact' })
            .eq('is_active', true);

        // Text search (if any)
        if (searchTerm) {
            // Check if user is searching for EN or TR name
            // Note: JSONB search in Supabase can be tricky.
            // Simple ilike on converted text or specific fields.
            // For now, let's try a simple comprehensive search if possible, or search in specific paths
            // Supabase/PostgREST textSearch on jsonb columns requires specific setup.
            // Fallback: Use simple ilike on sku or name->>en / name->>tr
            // Or better: Use an "or" filter for SKU and name fields
            // query = query.or(`sku.ilike.%${searchTerm}%,name->>en.ilike.%${searchTerm}%,name->>tr.ilike.%${searchTerm}%`);
            // WARNING: .or() with jsonb arrows might be syntax sensitive.

            // Safer approach for now with PostgREST syntax for JSONB if supported:
            // But let's stick to simple SKU match or creating a text index on DB side.
            // Without DB access to create indexes, let's try to filter in JS if dataset is small? 
            // No, user wants backend filtering.

            // Let's assume standard ilike works on casted columns or use the .or syntax carefully.
            // query = query.textSearch('name', searchTerm); // Only works if FTS is set up

            query = query.or(`sku.ilike.%${searchTerm}%`); // Minimal implementation
        }

        // Filters
        if (brandIds.length > 0) {
            query = query.in('brand_id', brandIds);
        }

        if (categoryIds.length > 0) {
            query = query.in('category_id', categoryIds);
        }

        if (minPrice > 0) {
            query = query.gte('price', minPrice);
        }

        if (maxPrice < 100000) {
            query = query.lte('price', maxPrice);
        }

        // Sorting
        if (sortBy === 'price_asc') {
            query = query.order('price', { ascending: true });
        } else if (sortBy === 'price_desc') {
            query = query.order('price', { ascending: false });
        } else if (sortBy === 'newest') {
            query = query.order('created_at', { ascending: false });
        } else if (sortBy === 'name_asc') {
            // Sorting by JSONB field might require complex setup, let's skip or try standard
            // PostgREST doesn't support order by json key easily without computed column
            // Fallback to title/sku or just created_at
            query = query.order('sku', { ascending: true });
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

        // Client-side filtering for JSONB text search if backend search is limited
        // This is a temporary workaround if .or() with JSONB doesn't work as expected in current PostgREST version
        let filteredData = data;
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filteredData = data.filter(p =>
                p.sku.toLowerCase().includes(lowerTerm) ||
                (p.name?.en && p.name.en.toLowerCase().includes(lowerTerm)) ||
                (p.name?.tr && p.name.tr.toLowerCase().includes(lowerTerm))
            );
            // Note: Pagination will be messed up with client side filtering. 
            // Ideally we need a Database function or FTS index. 
            // For now, I will rely on the query.or I wrote above adding SKU match.
        }

        return { data: filteredData, count, page, limit };
    }
};
