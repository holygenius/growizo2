import supabase from './supabase';

export const adminService = {
    // Generic CRUD
    async getAll(table, options = {}) {
        if (!supabase) throw new Error('Supabase client is not initialized');
        let query = supabase.from(table).select('*', { count: 'exact' });

        if (options.orderBy) {
            query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
        } else {
            query = query.order('created_at', { ascending: false });
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error, count } = await query;
        if (error) throw error;
        return { data, count };
    },

    async getById(table, id) {
        if (!supabase) throw new Error('Supabase client is not initialized');
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(table, data) {
        if (!supabase) throw new Error('Supabase client is not initialized');
        const { data: created, error } = await supabase
            .from(table)
            .insert([data])
            .select()
            .single();

        if (error) throw error;
        return created;
    },

    async update(table, id, data) {
        if (!supabase) throw new Error('Supabase client is not initialized');
        const { data: updated, error } = await supabase
            .from(table)
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updated;
    },

    async delete(table, id) {
        if (!supabase) throw new Error('Supabase client is not initialized');
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Specific Helpers
    async uploadImage(file, bucket = 'images') {
        if (!supabase) throw new Error('Supabase client is not initialized');
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    }
};
