import { supabase } from './supabase';

export const presetService = {
    /**
     * Get all preset sets
     */
    async getPresetSets() {
        const { data, error } = await supabase
            .from('preset_sets')
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching preset sets:', error);
            throw error;
        }

        return data;
    },

    /**
     * Get preset set by ID
     */
    async getPresetById(id) {
        const { data, error } = await supabase
            .from('preset_sets')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error fetching preset ${id}:`, error);
            throw error;
        }

        return data;
    }
};
