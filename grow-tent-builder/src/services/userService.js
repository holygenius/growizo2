import supabase, { isSupabaseConfigured } from './supabase';

// Helper: Wrap promise with timeout to prevent hanging
const withTimeout = (promise, ms = 10000, fallbackValue = { data: null, error: { message: 'Query timeout' } }) => {
    const timeout = new Promise((resolve) => {
        setTimeout(() => {
            console.warn(`⏱️ userService: Query timed out after ${ms}ms`);
            resolve(fallbackValue);
        }, ms);
    });
    return Promise.race([promise, timeout]);
};

export const userService = {
    // ============================================
    // USER ONBOARDING
    // ============================================

    /**
     * Get user's onboarding status
     * @param {string} userId - User UUID
     * @returns {Promise<{data: {created_at: string, onboarding_completed: boolean}|null, error: Error|null}>}
     */
    async getUserOnboardingStatus(userId) {
        if (!isSupabaseConfigured()) {
            return { data: null, error: new Error('Supabase not configured') };
        }

        try {
            const result = await withTimeout(
                supabase
                    .from('users')
                    .select('created_at, onboarding_completed')
                    .eq('id', userId)
                    .maybeSingle()
            );

            return { data: result.data, error: result.error };
        } catch (error) {
            console.error('userService.getUserOnboardingStatus error:', error);
            return { data: null, error };
        }
    },

    /**
     * Check if user needs onboarding (hasn't completed onboarding yet)
     * @param {string} userId - User UUID
     * @returns {Promise<boolean>}
     */
    async isNewUser(userId) {
        const { data, error } = await this.getUserOnboardingStatus(userId);

        if (error || !data) {
            return false;
        }

        // User needs onboarding if onboarding_completed is false
        return !data.onboarding_completed;
    },

    /**
     * Mark onboarding as completed and save user preferences
     * @param {string} userId - User UUID
     * @param {object} onboardingData - User preferences from onboarding
     * @returns {Promise<{success: boolean, error: Error|null}>}
     */
    async completeOnboarding(userId, onboardingData = {}) {
        if (!isSupabaseConfigured()) {
            console.warn('Skipping onboarding save; Supabase not configured.');
            return { success: false, error: new Error('Supabase not configured') };
        }

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    onboarding_completed: true,
                    onboarding_data: {
                        ...onboardingData,
                        completedAt: new Date().toISOString()
                    }
                })
                .eq('id', userId);

            if (error) {
                console.error('userService.completeOnboarding error:', error);
                return { success: false, error };
            }

            return { success: true, error: null };
        } catch (error) {
            console.error('userService.completeOnboarding exception:', error);
            return { success: false, error };
        }
    },

    // ============================================
    // ADMIN STATUS
    // ============================================

    /**
     * Check if user is an active admin
     * @param {string} userId - User UUID
     * @returns {Promise<boolean>}
     */
    async checkAdminStatus(userId) {
        if (!userId || !isSupabaseConfigured()) {
            return false;
        }

        try {
            const result = await withTimeout(
                supabase
                    .from('admin_users')
                    .select('id')
                    .eq('id', userId)
                    .eq('is_active', true)
                    .maybeSingle()
            );

            return !!result.data && !result.error;
        } catch (error) {
            console.error('userService.checkAdminStatus error:', error);
            return false;
        }
    },

    /**
     * Log admin panel access
     * @param {string} adminId - Admin user UUID
     * @param {string} adminEmail - Admin email
     * @param {string} action - Action type ('login', 'logout', 'access')
     * @param {object} metadata - Additional metadata
     * @returns {Promise<{success: boolean, error: Error|null}>}
     */
    async logAdminAccess(adminId, adminEmail, action, metadata = {}) {
        if (!adminId || !isSupabaseConfigured()) {
            return { success: false, error: new Error('Invalid params or Supabase not configured') };
        }

        try {
            const { error } = await supabase
                .from('admin_access_logs')
                .insert({
                    admin_id: adminId,
                    admin_email: adminEmail,
                    action,
                    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
                    metadata
                });

            if (error) {
                console.error('userService.logAdminAccess error:', error);
                return { success: false, error };
            }

            return { success: true, error: null };
        } catch (error) {
            console.error('userService.logAdminAccess exception:', error);
            return { success: false, error };
        }
    },

    // ============================================
    // USER BUILDS (existing functionality)
    // ============================================

    /**
     * Save a new build
     */
    async saveBuild(userId, name, buildState) {
        if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
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
                        is_completed: true
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

    /**
     * Get all builds for the current user
     */
    async getUserBuilds() {
        if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
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

    /**
     * Delete a build
     */
    async deleteBuild(buildId) {
        if (!supabase) return { error: new Error('Supabase not initialized') };
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
