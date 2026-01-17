import supabase from './supabase';

export const adminService = {
    // Generic CRUD
    async getAll(table, options = {}) {
        if (!supabase) throw new Error('Supabase client is not initialized');

        // Support custom select queries with joins
        const selectQuery = options.select || '*';
        let query = supabase.from(table).select(selectQuery, { count: 'exact' });

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

        try {
            console.log(`📝 Creating ${table} with data:`, JSON.stringify(data, null, 2));

            const { data: created, error } = await supabase
                .from(table)
                .insert([data])
                .select()
                .single();

            if (error) {
                console.error(`❌ Create error for ${table}:`, error);
                console.error('Error details:', error.details || error.message);
                throw error;
            }
            return created;
        } catch (error) {
            console.error(`❌ Create exception:`, error);
            throw error;
        }
    },

    async update(table, id, data) {
        if (!supabase) throw new Error('Supabase client is not initialized');

        try {
            console.log(`✏️ Updating ${table}:`, JSON.stringify(data, null, 2));

            const { data: updated, error } = await supabase
                .from(table)
                .update(data)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error(`❌ Update error for ${table}:`, error);
                console.error('Error details:', error.details || error.message);
                throw error;
            }
            return updated;
        } catch (error) {
            console.error(`❌ Update exception:`, error);
            throw error;
        }
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

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
            const filePath = `${fileName}`;

            console.log(`📤 Uploading to bucket: ${bucket}, path: ${filePath}`);

            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            console.log('✅ Upload successful:', data);

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            console.log('🔗 Public URL:', publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('❌ Upload failed:', error);
            throw new Error(`Image upload failed: ${error.message}`);
        }
    },

    async listBucketFiles(bucket = 'images') {
        if (!supabase) throw new Error('Supabase client is not initialized');
        try {
            console.log(`📂 Listing files in bucket: ${bucket}`);
            const { data, error } = await supabase.storage
                .from(bucket)
                .list(null, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' }
                });

            if (error) throw error;

            // Generate public URLs for all files
            const filesWithUrls = data.map(file => {
                const { data: { publicUrl } } = supabase.storage
                    .from(bucket)
                    .getPublicUrl(file.name);
                return { ...file, publicUrl };
            });

            return filesWithUrls;
        } catch (error) {
            console.error('❌ List files failed:', error);
            throw new Error(`Failed to list files: ${error.message}`);
        }
    }
};
