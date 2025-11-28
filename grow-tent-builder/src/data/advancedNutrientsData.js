// Advanced Nutrients Feeding Schedule Data
// Based on the provided briefing for Connoisseur and Sensi series

export const SUBSTRATE_TYPES = {
    COCO: 'coco',
    HYDRO: 'hydro'
};

export const RECIPES = {
    TOP_SHELF: 'top-shelf',
    MASTER: 'master'
};

export const BASE_NUTRIENT_OPTIONS = [
    { id: 'gmb-veg', label: 'Grow Micro Bloom (Vegetative)', products: ['gmb-grow', 'gmb-micro', 'gmb-bloom'], phase: 'vegetative', schedule_key: 'schedule_hydro_master' },
    { id: 'gmb-bloom', label: 'Grow Micro Bloom (Bloom)', products: ['gmb-grow', 'gmb-micro', 'gmb-bloom'], phase: 'flowering', schedule_key: 'schedule_hydro_master' },
    { id: 'sensi-grow', label: 'Sensi Grow', products: ['sensi-grow-a', 'sensi-grow-b'], phase: 'vegetative', schedule_key: 'schedule_hydro_master' },
    { id: 'sensi-bloom', label: 'Sensi Bloom', products: ['sensi-bloom-a', 'sensi-bloom-b'], phase: 'flowering', schedule_key: 'schedule_hydro_master' },
    { id: 'sensi-coco-grow', label: 'Sensi Coco Grow', products: ['sensi-coco-grow-a', 'sensi-coco-grow-b'], phase: 'vegetative', schedule_key: 'schedule_coco_master' },
    { id: 'sensi-coco-bloom', label: 'Sensi Coco Bloom', products: ['sensi-coco-bloom-a', 'sensi-coco-bloom-b'], phase: 'flowering', schedule_key: 'schedule_coco_master' },
    { id: 'conn-grow', label: 'Connoisseur Grow', products: ['conn-grow-a', 'conn-grow-b'], phase: 'vegetative', schedule_key: 'schedule_hydro_master' },
    { id: 'conn-bloom', label: 'Connoisseur Bloom', products: ['conn-bloom-a', 'conn-bloom-b'], phase: 'flowering', schedule_key: 'schedule_hydro_master' },
    { id: 'conn-coco-grow', label: 'Connoisseur Coco Grow', products: ['conn-coco-grow-a', 'conn-coco-grow-b'], phase: 'vegetative', schedule_key: 'schedule_coco_master' },
    { id: 'conn-coco-bloom', label: 'Connoisseur Coco Bloom', products: ['conn-coco-bloom-a', 'conn-coco-bloom-b'], phase: 'flowering', schedule_key: 'schedule_coco_master' },
    { id: 'sensi-terra-grow', label: 'Sensi Terra Grow', products: ['sensi-terra-grow'], phase: 'vegetative', schedule_key: 'schedule_hydro_master' },
    { id: 'sensi-terra-bloom', label: 'Sensi Terra Bloom', products: ['sensi-terra-bloom'], phase: 'flowering', schedule_key: 'schedule_hydro_master' },
    { id: 'iguana-grow', label: 'OG Organics Iguana Juice Grow', products: ['iguana-grow'], phase: 'vegetative', schedule_key: 'schedule_hydro_master' },
    { id: 'iguana-bloom', label: 'OG Organics Iguana Juice Bloom', products: ['iguana-bloom'], phase: 'flowering', schedule_key: 'schedule_hydro_master' },
    { id: 'jungle-veg', label: 'Jungle Juice (Vegetative)', products: ['jungle-grow', 'jungle-micro', 'jungle-bloom'], phase: 'vegetative', schedule_key: 'schedule_hydro_master' },
    { id: 'jungle-bloom', label: 'Jungle Juice (Bloom)', products: ['jungle-grow', 'jungle-micro', 'jungle-bloom'], phase: 'flowering', schedule_key: 'schedule_hydro_master' },
];

export const PRODUCT_CATEGORIES = {
    base_nutrient: { name_key: 'catBaseNutrient', icon: '🌱' },
    root_mass: { name_key: 'catRootMass', icon: '🌳' },
    bud_potency: { name_key: 'catBudPotency', icon: '💪' },
    bigger_buds: { name_key: 'catBiggerBuds', icon: '🌺' },
    taste_terpene: { name_key: 'catTasteTerpene', icon: '🍬' },
    plant_health: { name_key: 'catPlantHealth', icon: '🛡️' }, // Rhino Skin etc.
    crop_substrate: { name_key: 'catCropSubstrate', icon: '🍂' }, // Sensizym
    flush: { name_key: 'catFlush', icon: '🚿' }
};

export const WEEK_LABELS = [
    'Grow W1', 'Grow W2', 'Grow W3', 'Grow W4',
    'Bloom W1', 'Bloom W2', 'Bloom W3', 'Bloom W4',
    'Bloom W5', 'Bloom W6', 'Bloom W7', 'Bloom W8'
];

export const PHASE_INFO = {
    vegetative: { weeks: [1, 2, 3, 4], label_key: 'phaseLabelVeg', color: '#22C55E' },
    flowering: { weeks: [5, 6, 7, 8, 9, 10, 11], label_key: 'phaseLabelFlower', color: '#EC4899' },
    flush: { weeks: [12], label_key: 'phaseLabelFlush', color: '#6B7280' }
};

export const ADVANCED_NUTRIENTS_DATA = [
    // --- Base Nutrients ---
    // Connoisseur Coco
    {
        id: 'conn-coco-grow-a',
        product_name: 'pH Perfect® Connoisseur® Coco Grow A',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DC2626',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 3, 'Grow W4': 4 }
    },
    {
        id: 'conn-coco-grow-b',
        product_name: 'pH Perfect® Connoisseur® Coco Grow B',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DC2626',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 3, 'Grow W4': 4 }
    },
    {
        id: 'conn-coco-bloom-a',
        product_name: 'pH Perfect® Connoisseur® Coco Bloom A',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DB2777',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    {
        id: 'conn-coco-bloom-b',
        product_name: 'pH Perfect® Connoisseur® Coco Bloom B',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DB2777',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    // Sensi Coco
    {
        id: 'sensi-coco-grow-a',
        product_name: 'pH Perfect® Sensi Coco Grow™ A',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#16A34A',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 3, 'Grow W4': 4 }
    },
    {
        id: 'sensi-coco-grow-b',
        product_name: 'pH Perfect® Sensi Coco Grow™ B',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#16A34A',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 3, 'Grow W4': 4 }
    },
    {
        id: 'sensi-coco-bloom-a',
        product_name: 'pH Perfect® Sensi Coco Bloom™ A',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#BE185D',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    {
        id: 'sensi-coco-bloom-b',
        product_name: 'pH Perfect® Sensi Coco Bloom™ B',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#BE185D',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    // Sensi (Hydro/Soil)
    {
        id: 'sensi-grow-a',
        product_name: 'pH Perfect® Sensi Grow™ A',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#059669',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 3, 'Grow W4': 4 }
    },
    {
        id: 'sensi-grow-b',
        product_name: 'pH Perfect® Sensi Grow™ B',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#059669',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 3, 'Grow W4': 4 }
    },
    {
        id: 'sensi-bloom-a',
        product_name: 'pH Perfect® Sensi Bloom™ A',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#9D174D',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    {
        id: 'sensi-bloom-b',
        product_name: 'pH Perfect® Sensi Bloom™ B',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#9D174D',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    // Connoisseur (Hydro/Soil) - NEW
    {
        id: 'conn-grow-a',
        product_name: 'pH Perfect® Connoisseur® Grow A',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DC2626',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 3, 'Grow W4': 4 }
    },
    {
        id: 'conn-grow-b',
        product_name: 'pH Perfect® Connoisseur® Grow B',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DC2626',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 3, 'Grow W4': 4 }
    },
    {
        id: 'conn-bloom-a',
        product_name: 'pH Perfect® Connoisseur® Bloom A',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DB2777',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    {
        id: 'conn-bloom-b',
        product_name: 'pH Perfect® Connoisseur® Bloom B',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DB2777',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    // Grow Micro Bloom (3-Part) - NEW
    {
        id: 'gmb-grow',
        product_name: 'pH Perfect® Grow',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#16A34A',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 4, 'Grow W4': 4, 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    {
        id: 'gmb-micro',
        product_name: 'pH Perfect® Micro',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#7C3AED',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 4, 'Grow W4': 4, 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    {
        id: 'gmb-bloom',
        product_name: 'pH Perfect® Bloom',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DC2626',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 4, 'Grow W4': 4, 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    // Sensi Terra - NEW
    {
        id: 'sensi-terra-grow',
        product_name: 'Sensi Terra™ Grow',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#16A34A',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 3, 'Grow W3': 5, 'Grow W4': 5 }
    },
    {
        id: 'sensi-terra-bloom',
        product_name: 'Sensi Terra™ Bloom',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#BE185D',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 3, 'Bloom W2': 5, 'Bloom W3': 5, 'Bloom W4': 5, 'Bloom W5': 5, 'Bloom W6': 5, 'Bloom W7': 3 }
    },
    // OG Organics Iguana Juice - NEW
    {
        id: 'iguana-grow',
        product_name: 'OG Organics™ Iguana Juice® Grow',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#65A30D',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 4, 'Grow W4': 4 }
    },
    {
        id: 'iguana-bloom',
        product_name: 'OG Organics™ Iguana Juice® Bloom',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#BE185D',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    // Jungle Juice - NEW
    {
        id: 'jungle-grow',
        product_name: 'Jungle Juice™ Grow',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#16A34A',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 4, 'Grow W4': 4, 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    {
        id: 'jungle-micro',
        product_name: 'Jungle Juice™ Micro',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#7C3AED',
        function_key: 'funcBaseNutrientVeg',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 4, 'Grow W4': 4, 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },
    {
        id: 'jungle-bloom',
        product_name: 'Jungle Juice™ Bloom',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#DC2626',
        function_key: 'funcBaseNutrientBloom',
        schedule_default: { 'Grow W1': 1, 'Grow W2': 2, 'Grow W3': 4, 'Grow W4': 4, 'Bloom W1': 4, 'Bloom W2': 4, 'Bloom W3': 4, 'Bloom W4': 4, 'Bloom W5': 4, 'Bloom W6': 4, 'Bloom W7': 4 }
    },

    // --- Root Mass ---
    {
        id: 'voodoo-juice',
        product_name: 'Voodoo Juice®',
        category_key: 'root_mass',
        dose_unit: 'ml/L',
        color: '#8B5CF6',
        function_key: 'funcRootStim',
        schedule_coco_topshelf: { 'Grow W1': 2, 'Grow W2': 2, 'Bloom W1': 2, 'Bloom W2': 2 },
        schedule_coco_master: { 'Grow W1': 2, 'Grow W2': 2, 'Bloom W1': 2, 'Bloom W2': 2 },
        schedule_hydro_master: { 'Grow W1': 2, 'Grow W2': 2, 'Bloom W1': 2, 'Bloom W2': 2 }
    },
    {
        id: 'piranha',
        product_name: 'Piranha®',
        category_key: 'root_mass',
        dose_unit: 'ml/L',
        color: '#A78BFA',
        function_key: 'funcRootFungi',
        schedule_coco_master: { 'Grow W1': 2, 'Grow W2': 2, 'Bloom W1': 2, 'Bloom W2': 2 },
        schedule_hydro_master: { 'Grow W1': 2, 'Grow W2': 2, 'Bloom W1': 2, 'Bloom W2': 2 }
    },
    {
        id: 'tarantula',
        product_name: 'Tarantula®',
        category_key: 'root_mass',
        dose_unit: 'ml/L',
        color: '#7C3AED',
        function_key: 'funcRootBacteria',
        schedule_coco_master: { 'Grow W1': 2, 'Grow W2': 2, 'Bloom W1': 2, 'Bloom W2': 2 },
        schedule_hydro_master: { 'Grow W1': 2, 'Grow W2': 2, 'Bloom W1': 2, 'Bloom W2': 2 }
    },

    // --- Bud Potency ---
    {
        id: 'b-52',
        product_name: 'B-52®',
        category_key: 'bud_potency',
        dose_unit: 'ml/L',
        color: '#F59E0B',
        function_key: 'funcVitaminBoost',
        schedule_coco_topshelf: { 'Grow W3': 2, 'Grow W4': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_coco_master: { 'Grow W1': 2, 'Grow W2': 2, 'Grow W3': 2, 'Grow W4': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_hydro_master: { 'Grow W1': 2, 'Grow W2': 2, 'Grow W3': 2, 'Grow W4': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 }
    },
    {
        id: 'rhino-skin',
        product_name: 'Rhino Skin®',
        category_key: 'plant_health',
        dose_unit: 'ml/L',
        color: '#64748B',
        function_key: 'funcSilica',
        schedule_coco_master: { 'Grow W3': 2, 'Grow W4': 2, 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2 },
        schedule_hydro_master: { 'Grow W3': 2, 'Grow W4': 2, 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2 }
    },
    {
        id: 'bud-factor-x',
        product_name: 'Bud Factor X®',
        category_key: 'bud_potency',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcResin',
        schedule_coco_master: { 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_hydro_master: { 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 }
    },

    // --- Bigger Buds ---
    {
        id: 'bud-ignitor',
        product_name: 'Bud Ignitor®',
        category_key: 'bigger_buds',
        dose_unit: 'ml/L',
        color: '#EF4444',
        function_key: 'funcEarlyFlower',
        schedule_coco_topshelf: { 'Bloom W1': 2, 'Bloom W2': 2 },
        schedule_coco_master: { 'Bloom W1': 2, 'Bloom W2': 2 },
        schedule_hydro_master: { 'Bloom W1': 2, 'Bloom W2': 2 }
    },
    {
        id: 'big-bud-coco',
        product_name: 'Big Bud Coco®',
        category_key: 'bigger_buds',
        dose_unit: 'ml/L',
        color: '#FCD34D',
        function_key: 'funcBloomBooster',
        schedule_coco_topshelf: { 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2 },
        schedule_coco_master: { 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2 }
    },
    {
        id: 'big-bud',
        product_name: 'Big Bud®',
        category_key: 'bigger_buds',
        dose_unit: 'ml/L',
        color: '#FCD34D',
        function_key: 'funcBloomBooster',
        schedule_hydro_master: { 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2 }
    },
    {
        id: 'overdrive',
        product_name: 'Overdrive®',
        category_key: 'bigger_buds',
        dose_unit: 'ml/L',
        color: '#D946EF',
        function_key: 'funcLateBloom',
        schedule_coco_topshelf: { 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_coco_master: { 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_hydro_master: { 'Bloom W6': 2, 'Bloom W7': 2 }
    },

    // --- Taste & Terpene ---
    {
        id: 'bud-candy',
        product_name: 'Bud Candy®',
        category_key: 'taste_terpene',
        dose_unit: 'ml/L',
        color: '#F472B6',
        function_key: 'funcCarbs',
        schedule_coco_topshelf: { 'Grow W1': 2, 'Grow W2': 2, 'Grow W3': 2, 'Grow W4': 2, 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_coco_master: { 'Grow W1': 2, 'Grow W2': 2, 'Grow W3': 2, 'Grow W4': 2, 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_hydro_master: { 'Grow W1': 2, 'Grow W2': 2, 'Grow W3': 2, 'Grow W4': 2, 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 }
    },
    {
        id: 'nirvana',
        product_name: 'Nirvana®',
        category_key: 'taste_terpene',
        dose_unit: 'ml/L',
        color: '#A3E635',
        function_key: 'funcOrganics',
        schedule_coco_master: { 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_hydro_master: { 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 }
    },

    // --- Crop Substrate / Enzymes ---
    {
        id: 'sensizym',
        product_name: 'Sensizym®',
        category_key: 'crop_substrate',
        dose_unit: 'ml/L',
        color: '#34D399',
        function_key: 'funcEnzymes',
        schedule_coco_master: { 'Grow W1': 2, 'Grow W2': 2, 'Grow W3': 2, 'Grow W4': 2, 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 },
        schedule_hydro_master: { 'Grow W1': 2, 'Grow W2': 2, 'Grow W3': 2, 'Grow W4': 2, 'Bloom W1': 2, 'Bloom W2': 2, 'Bloom W3': 2, 'Bloom W4': 2, 'Bloom W5': 2, 'Bloom W6': 2, 'Bloom W7': 2 }
    },

    // --- Flush ---
    {
        id: 'flawless-finish',
        product_name: 'Flawless Finish®',
        category_key: 'flush',
        dose_unit: 'ml/L',
        color: '#9CA3AF',
        function_key: 'funcFlush',
        schedule_coco_topshelf: { 'Bloom W8': 2 },
        schedule_coco_master: { 'Bloom W8': 2 },
        schedule_hydro_master: { 'Bloom W8': 2 }
    }
];

export const DEFAULT_SELECTED_PRODUCTS_COCO_TOPSHELF = [
    'conn-coco-grow-a', 'conn-coco-grow-b', 'conn-coco-bloom-a', 'conn-coco-bloom-b',
    'voodoo-juice', 'b-52', 'bud-ignitor', 'big-bud-coco', 'overdrive', 'bud-candy', 'flawless-finish'
];
