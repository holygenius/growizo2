
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function checkSubstrates() {
    console.log('Fetching substrate category ID...');
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('key', 'substrate')
        .single();

    if (catError) {
        console.error('Error fetching category:', catError);
        return;
    }

    console.log(`Substrate Category ID: ${category.id}`);

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} substrate products.`);
    products.forEach(p => {
        console.log(`- ${p.name} (Type: ${p.specs?.type || p.type})`);
    });
}

checkSubstrates();
