
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

import {
    AQUA_SCHEDULES,
    COCO_SCHEDULES,
    COGR_SCHEDULES,
    SUBSTRA_SCHEDULES,
    TERRA_SCHEDULES,
    PLANT_INFO,
    SYSTEM_INFO
} from '../src/data/cannaData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials not found');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SYSTEM_SCHEDULES = {
    aqua: AQUA_SCHEDULES,
    coco: COCO_SCHEDULES,
    cogr: COGR_SCHEDULES,
    substra: SUBSTRA_SCHEDULES,
    terra: TERRA_SCHEDULES
};

async function getBrandId() {
    const { data } = await supabase.from('brands').select('id').eq('slug', 'canna').single();
    if (!data) throw new Error('CANNA brand not found');
    return data.id;
}

async function migrateCannaSchedules() {
    const brandId = await getBrandId();
    console.log(`🌿 Migrating CANNA schedules (Brand ID: ${brandId})...`);

    let count = 0;

    for (const [system, schedules] of Object.entries(SYSTEM_SCHEDULES)) {
        console.log(`  Processing system: ${system}`);

        for (const [plantKey, schedule] of Object.entries(schedules)) {
            const plantNameEn = schedule.plant_type || plantKey;

            const scheduleName = {
                en: `CANNA ${system.toUpperCase()} - ${plantNameEn}`,
                tr: `CANNA ${system.toUpperCase()} - ${plantKey}`
            };

            const scheduleData = {
                weeks: schedule.weeks,
                products: schedule.products,
                stages: schedule.stages,
                ec_range: schedule.ec_range,
                products_hard_water: schedule.products_hard_water,
                products_soft_water: schedule.products_soft_water,
                plant_key: plantKey,
                system_key: system
            };

            // Using insert instead of upsert
            const { error } = await supabase.from('feeding_schedules').insert({
                brand_id: brandId,
                name: scheduleName,
                substrate_type: system,
                schedule_data: scheduleData,
                phases: schedule.phases || {},
                notes: schedule.notes || [],
                is_active: true
            });

            if (error) {
                console.error(`❌ Error migrating ${system}/${plantKey}:`, error);
            } else {
                count++;
            }
        }
    }

    console.log(`✅ Successfully migrated ${count} schedules.`);
}

async function run() {
    try {
        const brandId = await getBrandId();
        // Clear existing CANNA schedules to prevent duplicates
        const { error: deleteError } = await supabase
            .from('feeding_schedules')
            .delete()
            .eq('brand_id', brandId);

        if (deleteError) {
            console.error('Error clearing old schedules:', deleteError);
            return;
        }

        await migrateCannaSchedules();
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

run();
