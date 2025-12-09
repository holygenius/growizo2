import { supabase } from './supabase';

export const brandService = {
    /**
     * Get all active brands ordered by display_order
     */
    async getBrands() {
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching brands:', error);
            throw error;
        }

        return data;
    },

    /**
     * Get brand by slug
     */
    async getBrandBySlug(slug) {
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error(`Error fetching brand ${slug}:`, error);
            throw error;
        }

        return data;
    }
};
