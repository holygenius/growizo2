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
    }
};
