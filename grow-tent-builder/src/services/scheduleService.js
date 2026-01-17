import { supabase } from './supabase';

export const scheduleService = {
    /**
     * Get feeding schedules for a brand
     */
    async getFeedingSchedules(brandId) {
        const { data, error } = await supabase
            .from('feeding_schedules')
            .select('*')
            .eq('brand_id', brandId)
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching feeding schedules:', error);
            throw error;
        }

        return data;
    },

    /**
     * Get feeding schedule items with product details
     */
    async getScheduleItems(scheduleId) {
        const { data, error } = await supabase
            .from('feeding_schedule_items')
            .select(`
                *,
                products (
                    id,
                    sku,
                    name,
                    icon,
                    images
                )
            `)
            .eq('feeding_schedule_id', scheduleId)
            .eq('is_active', true)
            .order('week_number', { ascending: true })
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching schedule items:', error);
            throw error;
        }

        return data;
    },

    /**
     * Get all schedule items for a brand (grouped by schedule)
     */
    async getAllScheduleItemsForBrand(brandId) {
        // First get schedules
        const schedules = await this.getFeedingSchedules(brandId);
        
        if (!schedules || schedules.length === 0) {
            return [];
        }

        // Get items for all schedules
        const scheduleIds = schedules.map(s => s.id);
        const { data, error } = await supabase
            .from('feeding_schedule_items')
            .select(`
                *,
                products (
                    id,
                    sku,
                    name,
                    icon,
                    images
                ),
                feeding_schedules (
                    id,
                    name,
                    substrate_type
                )
            `)
            .in('feeding_schedule_id', scheduleIds)
            .eq('is_active', true)
            .order('week_number', { ascending: true });

        if (error) {
            console.error('Error fetching all schedule items:', error);
            throw error;
        }

        return data;
    },

    /**
     * Get schedule products for calculations (legacy support)
     * Now returns data from feeding_schedule_items with products
     */
    async getScheduleProducts() {
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
                )
            `)
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching schedule products:', error);
            throw error;
        }

        // Transform to legacy format if needed
        return data;
    }
};

