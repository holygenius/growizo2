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
};
