import supabase from './supabase';

export const userService = {
    // Save a new build
    async saveBuild(userId, name, buildState) {
        try {
            const { data, error } = await supabase
                .from('user_builds')
                .insert([
                    {
                        user_id: userId,
                        name: name,
                        tent_size: buildState.tentSize,
                        media_type: buildState.mediaType,
                        selected_items: buildState.selectedItems,
                        total_cost: buildState.totals.cost,
                        total_power: buildState.totals.power,
                        is_completed: true // Assuming saved builds are "completed" or at least valid snapshots
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error saving build:', error);
            return { data: null, error };
        }
    },

    // Get all builds for the current user
    async getUserBuilds() {
        try {
            const { data, error } = await supabase
                .from('user_builds')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error fetching builds:', error);
            return { data: null, error };
        }
    },

    // Delete a build
    async deleteBuild(buildId) {
        try {
            const { error } = await supabase
                .from('user_builds')
                .delete()
                .eq('id', buildId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Error deleting build:', error);
            return { error };
        }
    }
};
