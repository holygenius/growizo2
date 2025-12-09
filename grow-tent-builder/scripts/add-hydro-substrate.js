
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

async function addHydroSubstrate() {
    console.log('Fetching substrates category ID...');
    const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('key', 'substrates') // Correct key from list-categories.js
        .single();

    if (catError) {
        console.error('Error fetching category:', catError);
        return;
    }

    console.log(`Substrate Category ID: ${category.id}`);

    const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', 'generic')
        .single();

    if (brandError) {
        console.error('Error fetching Generic brand:', brandError);
        return;
    }

    const products = [
        {
            sku: 'clay-pebbles-10l',
            name: { en: 'Clay Pebbles 10L', tr: 'Kil Bilyesi 10L' },
            description: {
                en: 'Expanded clay pebbles for hydroponic systems. Provides excellent aeration and drainage.',
                tr: 'Hidroponik sistemler için genleşmiş kil bilyeleri. Mükemmel havalandırma ve drenaj sağlar.'
            },
            price: 250,
            category_id: category.id,
            brand_id: brand.id,
            product_type: 'substrate',
            specs: {
                type: 'hydro', // Crucial for MediaSelection.jsx filtering
                volume: 10,
                weight: '4kg'
            },
            is_active: true
        },
        {
            sku: 'clay-pebbles-45l',
            name: { en: 'Clay Pebbles 45L', tr: 'Kil Bilyesi 45L' },
            description: {
                en: 'Large bag of expanded clay pebbles for multiple systems.',
                tr: 'Birden fazla sistem için büyük boy kil bilyesi.'
            },
            price: 950,
            category_id: category.id,
            brand_id: brand.id,
            product_type: 'substrate',
            specs: {
                type: 'hydro',
                volume: 45,
                weight: '18kg'
            },
            is_active: true
        }
    ];

    console.log('Inserting Hydroponic Substrates...');
    const { error } = await supabase
        .from('products')
        .upsert(products, { onConflict: 'sku' });

    if (error) {
        console.error('Error inserting products:', error);
    } else {
        console.log('✅ Successfully added Clay Pebbles!');
    }
}

addHydroSubstrate();
