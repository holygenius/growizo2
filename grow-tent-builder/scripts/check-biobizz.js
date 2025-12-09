
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

async function checkBrands() {
    console.log('Checking brands in Supabase...');
    const { data: brands, error } = await supabase
        .from('brands')
        .select('*');

    if (error) {
        console.error('Error fetching brands:', error);
        return;
    }

    console.log('Found brands:', brands.map(b => ({ id: b.id, name: b.name, slug: b.slug })));

    const biobizz = brands.find(b => b.slug === 'biobizz' || b.name.toLowerCase().includes('biobizz'));
    if (biobizz) {
        console.log('✅ BioBizz found:', biobizz);
    } else {
        console.error('❌ BioBizz NOT found!');
    }
}

checkBrands();
