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
     * Get feeding schedule products (metadata for calculations)
     */
    async getScheduleProducts() {
        const { data, error } = await supabase
            .from('feeding_schedule_products')
            .select('*')
            .eq('is_active', true);

        if (error) {
            console.error('Error fetching schedule products:', error);
            throw error;
        }

        return data;
    }
};
