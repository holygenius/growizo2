
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAN() {
    console.log('Checking Advanced Nutrients...');

    // 1. Check Brand
    const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .ilike('name', '%Advanced Nutrients%')
        .single();

    if (brandError) {
        console.error('Error finding brand:', brandError);
        // List all brands to see what's there
        const { data: allBrands } = await supabase.from('brands').select('name, id');
        console.log('Available brands:', allBrands);
        return;
    }

    if (!brand) {
        console.log('Brand "Advanced Nutrients" NOT found.');
        return;
    }

    console.log('Found Brand:', brand.name, 'ID:', brand.id);

    // 2. Check Products
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, product_type, category_id, specs, categories(key)')
        .eq('brand_id', brand.id);

    if (prodError) {
        console.error('Error finding products:', prodError);
        return;
    }

    console.log(`Found ${products.length} products for Advanced Nutrients.`);
    if (products.length > 0) {
        console.log('Sample products compatible_media check:');
        products.slice(0, 3).forEach(p => {
            console.log(`Product: ${p.name.en || p.name}, Specs keys: ${Object.keys(p.specs || {})}, compatible_media: ${p.specs?.compatible_media}`);
        });
    }
}

checkAN();
