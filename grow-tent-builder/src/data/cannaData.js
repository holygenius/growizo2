// CANNA Feeding Schedule Data
// Comprehensive nutrient schedules for all CANNA growing systems
// Systems: AQUA, COCO, COGr, SUBSTRA, TERRA

// Growing Systems
export const CANNA_SYSTEMS = {
    AQUA: 'aqua',
    COCO: 'coco',
    COGR: 'cogr',
    SUBSTRA: 'substra',
    TERRA: 'terra'
};

// System Information
export const SYSTEM_INFO = {
    aqua: {
        id: 'aqua',
        name: 'CANNA AQUA',
        name_key: 'cannaAquaName',
        description_key: 'cannaAquaDesc',
        icon: '💧',
        color: '#0EA5E9',
        features: ['Recirculating Systems', 'pH Self-Regulating', 'NFT Compatible'],
        features_keys: ['cannaAquaFeature1', 'cannaAquaFeature2', 'cannaAquaFeature3']
    },
    coco: {
        id: 'coco',
        name: 'CANNA COCO',
        name_key: 'cannaCocoName',
        description_key: 'cannaCocoDesc',
        icon: '🥥',
        color: '#78350F',
        features: ['Coco Substrate', 'Combined A&B Formula', 'Organic Feel + Precision'],
        features_keys: ['cannaCocoFeature1', 'cannaCocoFeature2', 'cannaCocoFeature3']
    },
    cogr: {
        id: 'cogr',
        name: 'CANNA COGr',
        name_key: 'cannaCOGrName',
        description_key: 'cannaCOGrDesc',
        icon: '📦',
        color: '#92400E',
        features: ['Compressed Coco Slabs', 'Buffering Required', 'Expert Level'],
        features_keys: ['cannaCOGrFeature1', 'cannaCOGrFeature2', 'cannaCOGrFeature3']
    },
    substra: {
        id: 'substra',
        name: 'CANNA SUBSTRA',
        name_key: 'cannaSubstraName',
        description_key: 'cannaSubstraDesc',
        icon: '🔬',
        color: '#7C3AED',
        features: ['Run-to-Waste', 'Hard/Soft Water Versions', 'Inert Media'],
        features_keys: ['cannaSubstraFeature1', 'cannaSubstraFeature2', 'cannaSubstraFeature3']
    },
    terra: {
        id: 'terra',
        name: 'CANNA TERRA',
        name_key: 'cannaTerraName',
        description_key: 'cannaTerraDesc',
        icon: '🌱',
        color: '#15803D',
        features: ['Soil-Based', 'Indoor/Outdoor', 'Forgiving Medium'],
        features_keys: ['cannaTerraFeature1', 'cannaTerraFeature2', 'cannaTerraFeature3']
    }
};

// Plant-Specific Schedules Available per System
export const PLANT_SCHEDULES = {
    aqua: ['general', 'wasabi'],
    coco: ['general', 'basil', 'cucumber', 'tomatoes', 'orchids'],
    cogr: ['general'],
    substra: ['general'],
    terra: ['general', 'basil', 'grape']
};

// Plant Information
export const PLANT_INFO = {
    general: { name_key: 'plantGeneral', icon: '🌿' },
    wasabi: { name_key: 'plantWasabi', icon: '🌶️' },
    basil: { name_key: 'plantBasil', icon: '🌿' },
    cucumber: { name_key: 'plantCucumber', icon: '🥒' },
    tomatoes: { name_key: 'plantTomatoes', icon: '🍅' },
    orchids: { name_key: 'plantOrchids', icon: '🌸' },
    grape: { name_key: 'plantGrape', icon: '🍇' }
};

// Product Categories
export const PRODUCT_CATEGORIES = {
    base_nutrient: {
        name_key: 'catBaseNutrient',
        icon: '🌱',
        name: 'Base Nutrients',
        color: '#22C55E'
    },
    root_stimulator: {
        name_key: 'catRootStim',
        icon: '🌳',
        name: 'Root Stimulators',
        color: '#8B5CF6'
    },
    bloom_booster: {
        name_key: 'catBloomBooster',
        icon: '🌺',
        name: 'Bloom Boosters',
        color: '#EC4899'
    },
    enzyme: {
        name_key: 'catEnzyme',
        icon: '🔬',
        name: 'Enzymes',
        color: '#34D399'
    },
    booster: {
        name_key: 'catBooster',
        icon: '⚡',
        name: 'Boosters',
        color: '#F59E0B'
    },
    buffer: {
        name_key: 'catBuffer',
        icon: '⚗️',
        name: 'Buffering Agents',
        color: '#6366F1'
    }
};

// CANNA Products Database
export const CANNA_PRODUCTS = [
    // === AQUA PRODUCTS ===
    {
        id: 'aqua-vega-a',
        product_name: 'CANNA AQUA VEGA A',
        system: 'aqua',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#22C55E',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descAquaVega',
        paired_with: 'aqua-vega-b',
        image: '/images/canna/prod-canna-aqua-vega.png.webp',
        short_info: { en: 'Recirculating growth nutrient.', tr: 'Devridaimli büyüme besini.' },
        tags: ['VEGA', 'Hydroponic', 'Growth']
    },
    {
        id: 'aqua-vega-b',
        product_name: 'CANNA AQUA VEGA B',
        system: 'aqua',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#22C55E',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descAquaVega',
        paired_with: 'aqua-vega-a',
        image: '/images/canna/prod-canna-aqua-vega.png.webp',
        short_info: { en: 'Recirculating growth nutrient.', tr: 'Devridaimli büyüme besini.' },
        tags: ['VEGA', 'Hydroponic', 'Growth']
    },
    {
        id: 'aqua-flores-a',
        product_name: 'CANNA AQUA FLORES A',
        system: 'aqua',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descAquaFlores',
        paired_with: 'aqua-flores-b',
        image: '/images/canna/prod-canna-aqua-flores.png.webp',
        short_info: { en: 'Recirculating bloom nutrient.', tr: 'Devridaimli çiçeklenme besini.' },
        tags: ['FLORES', 'Hydroponic', 'Bloom']
    },
    {
        id: 'aqua-flores-b',
        product_name: 'CANNA AQUA FLORES B',
        system: 'aqua',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descAquaFlores',
        paired_with: 'aqua-flores-a',
        image: '/images/canna/prod-canna-aqua-flores.png.webp',
        short_info: { en: 'Recirculating bloom nutrient.', tr: 'Devridaimli çiçeklenme besini.' },
        tags: ['FLORES', 'Hydroponic', 'Bloom']
    },

    // === COCO PRODUCTS ===
    {
        id: 'coco-a',
        product_name: 'CANNA COCO A',
        system: 'coco',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#78350F',
        function_key: 'funcBaseNutrientAll',
        description_key: 'descCoco',
        paired_with: 'coco-b',
        image: '/images/canna/prod-canna-coco-ab.png.webp',
        short_info: { en: 'Single nutrient blend.', tr: 'Tek besin karışımı.' },
        tags: ['Coco', 'A&B', 'AllPhases']
    },
    {
        id: 'coco-b',
        product_name: 'CANNA COCO B',
        system: 'coco',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#78350F',
        function_key: 'funcBaseNutrientAll',
        description_key: 'descCoco',
        paired_with: 'coco-a',
        image: '/images/canna/prod-canna-coco-ab.png.webp',
        short_info: { en: 'Single nutrient blend.', tr: 'Tek besin karışımı.' },
        tags: ['Coco', 'A&B', 'AllPhases']
    },

    // === COGr PRODUCTS ===
    {
        id: 'cogr-vega-a',
        product_name: 'CANNA COGr VEGA A',
        system: 'cogr',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#92400E',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descCOGrVega',
        paired_with: 'cogr-vega-b',
        image: '/images/canna/prod-canna-cogr-vega.png.webp',
        short_info: { en: 'Strong seedlings ensured.', tr: 'Güçlü filizler sağlar.' },
        tags: ['COGr', 'VEGA', 'Silicon']
    },
    {
        id: 'cogr-vega-b',
        product_name: 'CANNA COGr VEGA B',
        system: 'cogr',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#92400E',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descCOGrVega',
        paired_with: 'cogr-vega-a',
        image: '/images/canna/prod-canna-cogr-vega.png.webp',
        short_info: { en: 'Strong seedlings ensured.', tr: 'Güçlü filizler sağlar.' },
        tags: ['COGr', 'VEGA', 'Silicon']
    },
    {
        id: 'cogr-flores-a',
        product_name: 'CANNA COGr FLORES A',
        system: 'cogr',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descCOGrFlores',
        paired_with: 'cogr-flores-b',
        image: '/images/canna/prod-canna-cogr-flores.png.webp',
        short_info: { en: 'Stimulates fruit production.', tr: 'Meyve üretimini uyarır.' },
        tags: ['COGr', 'FLORES', 'FulvicAcid']
    },
    {
        id: 'cogr-flores-b',
        product_name: 'CANNA COGr FLORES B',
        system: 'cogr',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descCOGrFlores',
        paired_with: 'cogr-flores-a',
        image: '/images/canna/prod-canna-cogr-flores.png.webp',
        short_info: { en: 'Stimulates fruit production.', tr: 'Meyve üretimini uyarır.' },
        tags: ['COGr', 'FLORES', 'FulvicAcid']
    },
    {
        id: 'cogr-buffer-agent',
        product_name: 'COGr Buffering Agent',
        system: 'cogr',
        category_key: 'buffer',
        dose_unit: 'ml/L',
        color: '#6366F1',
        function_key: 'funcBuffer',
        description_key: 'descCOGrBuffer',
        image: '/images/canna/prod-canna-cogr-buffer-agent.png.webp',
        short_info: { en: 'Soaks & buffers slabs.', tr: 'Levhayı ıslatır, tamponlar.' },
        tags: ['COGr', 'Buffer', 'SlabPrep']
    },

    // === SUBSTRA PRODUCTS ===
    {
        id: 'substra-vega-a-hw',
        product_name: 'CANNA SUBSTRA VEGA A (Hard Water)',
        system: 'substra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#7C3AED',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descSubstraVega',
        water_type: 'hard',
        paired_with: 'substra-vega-b-hw',
        short_info: { en: 'Run-to-waste growth.', tr: 'Açık sistem büyüme besini.' },
        tags: ['SUBSTRA', 'HardWater', 'VEGA']
    },
    {
        id: 'substra-vega-b-hw',
        product_name: 'CANNA SUBSTRA VEGA B (Hard Water)',
        system: 'substra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#7C3AED',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descSubstraVega',
        water_type: 'hard',
        paired_with: 'substra-vega-a-hw',
        short_info: { en: 'Run-to-waste growth.', tr: 'Açık sistem büyüme besini.' },
        tags: ['SUBSTRA', 'HardWater', 'VEGA']
    },
    {
        id: 'substra-vega-a-sw',
        product_name: 'CANNA SUBSTRA VEGA A (Soft Water)',
        system: 'substra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#A78BFA',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descSubstraVega',
        water_type: 'soft',
        paired_with: 'substra-vega-b-sw',
        short_info: { en: 'Run-to-waste growth.', tr: 'Açık sistem büyüme besini.' },
        tags: ['SUBSTRA', 'SoftWater', 'VEGA']
    },
    {
        id: 'substra-vega-b-sw',
        product_name: 'CANNA SUBSTRA VEGA B (Soft Water)',
        system: 'substra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#A78BFA',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descSubstraVega',
        water_type: 'soft',
        paired_with: 'substra-vega-a-sw',
        short_info: { en: 'Run-to-waste growth.', tr: 'Açık sistem büyüme besini.' },
        tags: ['SUBSTRA', 'SoftWater', 'VEGA']
    },
    {
        id: 'substra-flores-a-hw',
        product_name: 'CANNA SUBSTRA FLORES A (Hard Water)',
        system: 'substra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descSubstraFlores',
        water_type: 'hard',
        paired_with: 'substra-flores-b-hw',
        short_info: { en: 'Run-to-waste bloom.', tr: 'Açık sistem çiçeklenme besini.' },
        tags: ['SUBSTRA', 'HardWater', 'FLORES']
    },
    {
        id: 'substra-flores-b-hw',
        product_name: 'CANNA SUBSTRA FLORES B (Hard Water)',
        system: 'substra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descSubstraFlores',
        water_type: 'hard',
        paired_with: 'substra-flores-a-hw',
        short_info: { en: 'Run-to-waste bloom.', tr: 'Açık sistem çiçeklenme besini.' },
        tags: ['SUBSTRA', 'HardWater', 'FLORES']
    },
    {
        id: 'substra-flores-a-sw',
        product_name: 'CANNA SUBSTRA FLORES A (Soft Water)',
        system: 'substra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#F472B6',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descSubstraFlores',
        water_type: 'soft',
        paired_with: 'substra-flores-b-sw',
        short_info: { en: 'Run-to-waste bloom.', tr: 'Açık sistem çiçeklenme besini.' },
        tags: ['SUBSTRA', 'SoftWater', 'FLORES']
    },
    {
        id: 'substra-flores-b-sw',
        product_name: 'CANNA SUBSTRA FLORES B (Soft Water)',
        system: 'substra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#F472B6',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descSubstraFlores',
        water_type: 'soft',
        paired_with: 'substra-flores-a-sw',
        short_info: { en: 'Run-to-waste bloom.', tr: 'Açık sistem çiçeklenme besini.' },
        tags: ['SUBSTRA', 'SoftWater', 'FLORES']
    },

    // === TERRA PRODUCTS ===
    {
        id: 'terra-vega',
        product_name: 'CANNA TERRA VEGA',
        system: 'terra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#15803D',
        function_key: 'funcBaseNutrientVeg',
        description_key: 'descTerraVega',
        image: '/images/canna/prod-canna-terra-vega.png.webp',
        short_info: { en: 'Soil-based growth nutrient.', tr: 'Toprak bazlı büyüme besini.' },
        tags: ['TERRA', 'Soil', 'Growth']
    },
    {
        id: 'terra-flores',
        product_name: 'CANNA TERRA FLORES',
        system: 'terra',
        category_key: 'base_nutrient',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcBaseNutrientBloom',
        description_key: 'descTerraFlores',
        image: '/images/canna/prod-canna-terra-flores.png.webp',
        short_info: { en: 'Soil-based bloom nutrient.', tr: 'Toprak bazlı çiçeklenme besini.' },
        tags: ['TERRA', 'Soil', 'Bloom']
    },

    // === UNIVERSAL ADDITIVES (work with all systems) ===
    {
        id: 'rhizotonic',
        product_name: 'RHIZOTONIC',
        system: 'all',
        category_key: 'root_stimulator',
        dose_unit: 'ml/L',
        color: '#8B5CF6',
        function_key: 'funcRootStim',
        description_key: 'descRhizotonic',
        image: '/images/canna/prod-additives-canna-rhizotonic.png.webp',
        short_info: { en: 'Supports root development.', tr: 'Kök oluşumunu destekler.' },
        tags: ['RootDev', 'StartPhase', 'Growth']
    },
    {
        id: 'cannazym',
        product_name: 'CANNAZYM',
        system: 'all',
        category_key: 'enzyme',
        dose_unit: 'ml/L',
        color: '#34D399',
        function_key: 'funcEnzymes',
        description_key: 'descCannazym',
        image: '/images/canna/prod-additives-cannazym.png.webp',
        short_info: { en: 'For substrate reuse.', tr: 'Substrat yeniden kullanımında.' },
        tags: ['Enzyme', 'SubstrateRenew', 'AllPhases']
    },
    {
        id: 'pk-13-14',
        product_name: 'PK 13/14',
        system: 'all',
        category_key: 'bloom_booster',
        dose_unit: 'ml/L',
        color: '#EC4899',
        function_key: 'funcBloomBooster',
        description_key: 'descPK1314',
        image: '/images/canna/prod-additives-canna-pk-1314.png.webp',
        short_info: { en: 'Develops mass & weight.', tr: 'Kütle, ağırlık geliştirir.' },
        tags: ['PK', 'MassBoost', 'Generative']
    },
    {
        id: 'cannaboost',
        product_name: 'CANNABOOST Accelerator',
        system: 'all',
        category_key: 'booster',
        dose_unit: 'ml/L',
        color: '#F59E0B',
        function_key: 'funcBooster',
        description_key: 'descCannaboost',
        image: '/images/canna/prod-additives-cannaboost.png.webp',
        short_info: { en: 'Extra flowering power.', tr: 'Ekstra çiçeklenme gücü.' },
        tags: ['BloomBoost', 'Accelerator', 'IntenseFlower']
    }
];

// Phase definitions for different schedule types
export const PHASE_INFO = {
    // Standard phases (general growing)
    standard: {
        rooting: { label_key: 'phaseRooting', color: '#8B5CF6', icon: '🌱' },
        vegetative: { label_key: 'phaseVegetative', color: '#22C55E', icon: '🌿' },
        generative1: { label_key: 'phaseGenerative1', color: '#F59E0B', icon: '🌼' },
        generative2: { label_key: 'phaseGenerative2', color: '#EC4899', icon: '🌸' },
        generative3: { label_key: 'phaseGenerative3', color: '#EF4444', icon: '🍎' },
        final: { label_key: 'phaseFinal', color: '#6B7280', icon: '🏁' }
    },
    // Wasabi specific (long cycle)
    wasabi: {
        rooting: { label_key: 'phaseRooting', color: '#8B5CF6', weeks: '3-5 weeks' },
        vegetative: { label_key: 'phaseVegetative', color: '#22C55E', weeks: '18-24 months' },
        final: { label_key: 'phaseFinal', color: '#6B7280', weeks: '2 weeks' }
    },
    // Orchid specific
    orchids: {
        start: { label_key: 'phaseStart', color: '#8B5CF6', weeks: '2-8 weeks' },
        vegetative: { label_key: 'phaseVegetative', color: '#22C55E', weeks: '18-52 weeks' },
        flowering: { label_key: 'phaseFlowering', color: '#EC4899', weeks: '4+ weeks' },
        recovery: { label_key: 'phaseRecovery', color: '#6B7280', weeks: 'Variable' }
    },
    // Grape specific
    grape: {
        budBreak: { label_key: 'phaseBudBreak', color: '#8B5CF6', weeks: '1 week' },
        vegetative: { label_key: 'phaseVegetative', color: '#22C55E', weeks: '1-2 weeks' },
        generative1: { label_key: 'phaseGenerative1', color: '#F59E0B', weeks: '2-4 weeks' },
        generative2: { label_key: 'phaseGenerative2', color: '#EC4899', weeks: '2 weeks' },
        generative3: { label_key: 'phaseGenerative3', color: '#EF4444', weeks: '2 weeks' },
        dormancy: { label_key: 'phaseDormancy', color: '#6B7280', weeks: 'Hold' }
    }
};

// =============================================
// FEEDING SCHEDULES BY SYSTEM AND PLANT
// =============================================

// AQUA System Schedules
export const AQUA_SCHEDULES = {
    general: {
        plant_type: 'General Fast-Growing Plant',
        weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
        phases: {
            'W1': 'rooting',
            'W2-W3': 'vegetative1',
            'W4-W5': 'vegetative2',
            'W6-W7': 'generative1',
            'W8': 'generative2',
            'W9-W10': 'generative3',
            'W11-W12': 'generative4'
        },
        stages: [
            { name: 'Start / rooting', name_key: 'stageRooting', duration: '<1 week', light_hours: 18, ec_plus: '0.7-1.1', ppm_plus: '520-810' },
            { name: 'Vegetative phase I', name_key: 'stageVeg1', duration: '0-3 weeks', light_hours: 18, ec_plus: '0.9-1.3', ppm_plus: '670-960' },
            { name: 'Vegetative phase II', name_key: 'stageVeg2', duration: '2-4 weeks', light_hours: 12, ec_plus: '1.2-1.6', ppm_plus: '890-1180' },
            { name: 'Generative Period I', name_key: 'stageGen1', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.4-1.8', ppm_plus: '1040-1330' },
            { name: 'Generative Period II', name_key: 'stageGen2', duration: '1 week', light_hours: 12, ec_plus: '1.6-2.0', ppm_plus: '1180-1480' },
            { name: 'Generative Period III', name_key: 'stageGen3', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.0-1.4', ppm_plus: '740-1040' },
            { name: 'Generative Period IV', name_key: 'stageGen4', duration: '1-2 weeks', light_hours: '10-12', ec_plus: '0.0', ppm_plus: '0' }
        ],
        products: {
            // Doses converted from ml/gallon to ml/L (÷3.785)
            'aqua-vega-a': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': null, 'W5': null },
            'aqua-vega-b': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': null, 'W5': null },
            'aqua-flores-a': { 'W4': 3, 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'aqua-flores-b': { 'W4': 3, 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'rhizotonic': { 'W1': 2.5, 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5 },
            'cannazym': { 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5, 'W11': 2.5 },
            'pk-13-14': { 'W8': 1.5 },
            'cannaboost': { 'W4': 2, 'W5': 2, 'W6': 2, 'W7': 4, 'W8': 4, 'W9': 4, 'W10': 4 }
        },
        ec_range: { min: 0.7, max: 2.0, unit: 'mS/cm' },
        notes: [
            { key: 'aquaNote1', en: 'This period varies depending on the species and number of plants per m². Mother plants remain in this phase until the end (6-12 months).', tr: 'Bu süre türe ve metrekareye düşen bitki sayısına göre değişir. Ana bitkiler bu aşamada sonuna kadar kalır (6-12 ay).' },
            { key: 'aquaNote2', en: 'The changeover from 18 to 12 hours varies depending on the variety. The rule of thumb is to change after 2 weeks.', tr: '18 saatten 12 saate geçiş çeşide göre değişir. Genel kural 2 hafta sonra değiştirmektir.' },
            { key: 'aquaNote3', en: 'Reduce hours of light if ripening goes too fast. Watch out for increasing Relative Humidity.', tr: 'Olgunlaşma çok hızlı giderse ışık saatlerini azaltın. Artan Bağıl Neme dikkat edin.' },
            { key: 'aquaNote4', en: 'Double CANNAZYM dosage to 5 ml/L if substrate is reused.', tr: 'Substrat yeniden kullanılıyorsa CANNAZYM dozunu 5 ml/L\'ye iki katına çıkarın.' },
            { key: 'aquaNote5', en: '2 ml/L standard. Increase to a maximum of 4 ml/L for extra flowering power.', tr: '2 ml/L standart. Ekstra çiçeklenme gücü için maksimum 4 ml/L\'ye çıkarın.' }
        ]
    },
    wasabi: {
        plant_type: 'Wasabi',
        stages: [
            { name: 'Start', name_key: 'stageStart', description: 'Formation of roots from the plugs', duration: '3-5 weeks', light_hours: 14, ec_plus: '0.3-0.9', ppm_plus: '200-560' },
            { name: 'Vegetative stage', name_key: 'stageVeg', description: 'Fast growth', duration: '18-24 months', light_hours: 14, ec_plus: '0.3-0.9', ppm_plus: '200-560' },
            { name: 'Final stage', name_key: 'stageFinal', description: 'Plants approaching size', duration: '2 weeks', light_hours: 12, ec_plus: '0.3-0.9', ppm_plus: '200-560' }
        ],
        products: {
            // Doses in ml/L (converted from ml/gallon)
            'rhizotonic': { 'Start': 2.6, 'Vegetative stage': 0.5, 'Final stage': null },
            'aqua-vega-a': { 'Start': 1.3, 'Vegetative stage': 1.3, 'Final stage': 1.3 },
            'aqua-vega-b': { 'Start': 1.3, 'Vegetative stage': 1.3, 'Final stage': 1.3 }
        },
        notes: [
            { key: 'wasabiNote1', en: 'Timing on stages is dependent on cropping method, whether flowering is included, and if the plant has to go through a dormant period based on winter temperatures.', tr: 'Aşamaların zamanlaması yetiştirme yöntemine, çiçeklenmenin dahil olup olmadığına ve bitkinin kış sıcaklıklarına göre dinlenme dönemine girmesi gerekip gerekmediğine bağlıdır.' },
            { key: 'wasabiNote2', en: 'Water temperatures should run 11-14°C, while air temperatures should be between 8-18°C for growth. Warmer periods require higher humidity levels.', tr: 'Su sıcaklığı 11-14°C, hava sıcaklığı büyüme için 8-18°C arasında olmalıdır. Sıcak dönemler daha yüksek nem seviyesi gerektirir.' },
            { key: 'wasabiNote3', en: 'Starting EC should be less than 0.1 or 100 ppm.', tr: 'Başlangıç EC değeri 0.1 veya 100 ppm\'den az olmalıdır.' },
            { key: 'wasabiNote4', en: 'This is a low light plant, while it can be grown under light cover (50%) in the mountains of Japan, it will need shade, approximately 50-80%, in other locations.', tr: 'Düşük ışıklı bir bitkidir, Japonya dağlarında %50 örtü altında yetiştirilebilirken, diğer yerlerde yaklaşık %50-80 gölge gerektirir.' },
            { key: 'wasabiNote5', en: 'Harvest when main plant rhizomes or stems are 15-20 cm long and about 1.25-2.5 cm thick.', tr: 'Ana bitki rizomu veya sapları 15-20 cm uzunluğunda ve yaklaşık 1.25-2.5 cm kalınlığında olduğunda hasat edin.' },
            { key: 'wasabiNote6', en: 'Higher temperatures can cause an increase in disease and general dieback of the plants.', tr: 'Yüksek sıcaklıklar hastalık artışına ve bitkilerin genel olarak solmasına neden olabilir.' }
        ],
        special_requirements: [
            { key: 'wasabiLight', value: '50-80% shade depending on latitude' },
            { key: 'wasabiWaterTemp', value: '11-14°C' },
            { key: 'wasabiAirTemp', value: '8-18°C' },
            { key: 'wasabiStartEC', value: '<0.1 mS/cm or 100 ppm' }
        ]
    }
};

// COCO System Schedules
export const COCO_SCHEDULES = {
    general: {
        plant_type: 'General Fast-Growing Plant',
        weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
        phases: {
            'W1': 'rooting',
            'W2-W3': 'vegetative1',
            'W4-W5': 'vegetative2',
            'W6-W7': 'generative1',
            'W8': 'generative2',
            'W9-W10': 'generative3',
            'W11-W12': 'generative4'
        },
        stages: [
            { name: 'Start / rooting', name_key: 'stageRooting', duration: '<1 week', light_hours: 18, ec_plus: '0.7-1.1', ppm_plus: '520-810' },
            { name: 'Vegetative phase I', name_key: 'stageVeg1', duration: '0-3 weeks', light_hours: 18, ec_plus: '0.9-1.3', ppm_plus: '670-960' },
            { name: 'Vegetative phase II', name_key: 'stageVeg2', duration: '2-4 weeks', light_hours: 12, ec_plus: '1.1-1.5', ppm_plus: '810-1110' },
            { name: 'Generative Period I', name_key: 'stageGen1', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.4-1.8', ppm_plus: '1040-1330' },
            { name: 'Generative Period II', name_key: 'stageGen2', duration: '1 week', light_hours: 12, ec_plus: '1.6-2.0', ppm_plus: '1180-1480' },
            { name: 'Generative Period III', name_key: 'stageGen3', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.0-1.4', ppm_plus: '740-1040' },
            { name: 'Generative Period IV', name_key: 'stageGen4', duration: '1-2 weeks', light_hours: '10-12', ec_plus: '0.0', ppm_plus: '0' }
        ],
        products: {
            // Doses in ml/L (converted from ml/gallon ÷3.785)
            'coco-a': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': 3.5, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'coco-b': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': 3.5, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'rhizotonic': { 'W1': 2.5, 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5 },
            'cannazym': { 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5, 'W11': 2.5 },
            'pk-13-14': { 'W8': 1.5 },
            'cannaboost': { 'W4': 2, 'W5': 2, 'W6': 2, 'W7': 4, 'W8': 4, 'W9': 4, 'W10': 4 }
        },
        ec_range: { min: 0.7, max: 2.2, unit: 'mS/cm' },
        notes: [
            { key: 'cocoNote1', en: 'This period varies depending on the species and number of plants per m². Mother plants remain in this phase until the end (6-12 months).', tr: 'Bu süre türe ve metrekareye düşen bitki sayısına göre değişir. Ana bitkiler bu aşamada sonuna kadar kalır (6-12 ay).' },
            { key: 'cocoNote2', en: 'The changeover from 18 to 12 hours varies depending on the variety. The rule of thumb is to change after 2 weeks.', tr: '18 saatten 12 saate geçiş çeşide göre değişir. Genel kural 2 hafta sonra değiştirmektir.' },
            { key: 'cocoNote3', en: 'Double CANNAZYM dosage to 5 ml/L if substrate is reused.', tr: 'Substrat yeniden kullanılıyorsa CANNAZYM dozunu 5 ml/L\'ye iki katına çıkarın.' },
            { key: 'cocoNote4', en: '2 ml/L standard. Increase to a maximum of 4 ml/L for extra flowering power.', tr: '2 ml/L standart. Ekstra çiçeklenme gücü için maksimum 4 ml/L\'ye çıkarın.' },
            { key: 'cocoNote5', en: 'pH: Recommended pH is between 5.5 and 6.2. Adding pH- can increase EC.', tr: 'pH: Önerilen pH 5.5 ile 6.2 arasındadır. pH- eklemek EC\'yi artırabilir.' }
        ]
    },
    basil: {
        plant_type: 'Basil',
        stages: [
            { name: 'Start', name_key: 'stageStart', description: 'Formation of roots', duration: '~1 week', light_hours: 11, ec_plus: '0.8-1.2', ppm_plus: '560-840' },
            { name: 'Vegetative stage', name_key: 'stageVeg', description: 'Fast growth', duration: '1-3 weeks', light_hours: 11, ec_plus: '1.1-1.5', ppm_plus: '840-1120' },
            { name: 'Generative stage 1', name_key: 'stageGen1', description: 'Continued growth', duration: '1-10 weeks', light_hours: 11, ec_plus: '1.2-1.6', ppm_plus: '840-1260' }
        ],
        products: {
            'coco-a': { 'Start': 2.4, 'Vegetative stage': 3, 'Generative stage 1': 3.3 },
            'coco-b': { 'Start': 2.4, 'Vegetative stage': 3, 'Generative stage 1': 3.3 },
            'rhizotonic': { 'Start': 2.5, 'Vegetative stage': 2.5, 'Generative stage 1': 2.5 },
            'cannazym': { 'Vegetative stage': 2.5, 'Generative stage 1': 2.5 }
        },
        notes: [
            { key: 'basilNote1', en: 'The recommended EC levels are based on a tap water EC of 0.0 mS/cm. If your tap water EC is 0.5 the recommended EC from the table should be 0.5 higher.', tr: 'Önerilen EC seviyeleri 0.0 mS/cm musluk suyu EC değerine dayanmaktadır. Musluk suyunuz 0.5 ise tablodaki önerilen EC 0.5 daha yüksek olmalıdır.' },
            { key: 'basilNote2', en: 'Maximum EC level is 2.8 mS/cm. Recommended pH 5.2-6.2.', tr: 'Maksimum EC seviyesi 2.8 mS/cm\'dir. Önerilen pH 5.2-6.2.' }
        ]
    },
    cucumber: {
        plant_type: 'Cucumber',
        stages: [
            { name: 'Start at Seedling', name_key: 'stageSeedling', description: 'Transplant, Formation of roots', duration: '~1 week', light_hours: 14, ec_plus: '1.0-1.2', ppm_plus: '700-840' },
            { name: 'Vegetative stage', name_key: 'stageVeg', description: 'Fast growth', duration: '1-3 weeks', light_hours: 14, ec_plus: '1.0-1.4', ppm_plus: '700-1120' },
            { name: 'Generative stage 1', name_key: 'stageGen1', description: 'Stagnation of Growth, first signs of fruit formation', duration: '1-2 weeks', light_hours: 14, ec_plus: '1.2-1.6', ppm_plus: '840-1120' },
            { name: 'Generative stage 2', name_key: 'stageGen2', description: 'All branches with small fruits', duration: '~1 week', light_hours: 14, ec_plus: '1.2-1.6', ppm_plus: '840-1120' },
            { name: 'Generative stage 3', name_key: 'stageGen3', description: 'Increase of fruit, size to crop end', duration: '2-3 weeks', light_hours: 14, ec_plus: '1.2-1.6', ppm_plus: '840-1120' }
        ],
        products: {
            'coco-a': { 'Start at Seedling': 2.4, 'Vegetative stage': 3.2, 'Generative stage 1': 3.2, 'Generative stage 2': 3.2, 'Generative stage 3': 3.2 },
            'coco-b': { 'Start at Seedling': 2.4, 'Vegetative stage': 3.2, 'Generative stage 1': 3.2, 'Generative stage 2': 3.2, 'Generative stage 3': 3.2 },
            'rhizotonic': { 'Start at Seedling': 2.5, 'Vegetative stage': 2.5, 'Generative stage 1': 2.5, 'Generative stage 2': 2.5, 'Generative stage 3': 2.5 },
            'cannazym': { 'Vegetative stage': 2.5, 'Generative stage 1': 2.5, 'Generative stage 2': 2.5, 'Generative stage 3': 2.5 }
        },
        notes: [
            { key: 'cucumberNote1', en: 'The recommended EC levels are based on a tap water EC of 0.0 mS/cm.', tr: 'Önerilen EC seviyeleri 0.0 mS/cm musluk suyu EC değerine dayanmaktadır.' },
            { key: 'cucumberNote2', en: 'Maximum EC level is 2.8 mS/cm. Recommended pH 5.2-6.2.', tr: 'Maksimum EC seviyesi 2.8 mS/cm\'dir. Önerilen pH 5.2-6.2.' }
        ]
    },
    tomatoes: {
        plant_type: 'Tomatoes',
        stages: [
            { name: 'Start', name_key: 'stageStart', description: 'Formation of roots', duration: '~1 week', light_hours: 14, ec_plus: '0.8-1.2', ppm_plus: '560-840' },
            { name: 'Vegetative stage', name_key: 'stageVeg', description: 'Fast growth', duration: '1-3 weeks', light_hours: 14, ec_plus: '1.2-1.6', ppm_plus: '840-1120' },
            { name: 'Generative stage 1', name_key: 'stageGen1', description: 'Stagnation of Growth, first signs of fruit formation', duration: '1-2 weeks', light_hours: 14, ec_plus: '1.2-1.8', ppm_plus: '840-1260' },
            { name: 'Generative stage 2', name_key: 'stageGen2', description: 'All branches with small fruits', duration: '~1 week', light_hours: 14, ec_plus: '1.2-1.8', ppm_plus: '840-1260' },
            { name: 'Generative stage 3', name_key: 'stageGen3', description: 'Increase in size', duration: '2-3 weeks', light_hours: 14, ec_plus: '1.2-1.8', ppm_plus: '840-1260' }
        ],
        products: {
            'coco-a': { 'Start': 2.4, 'Vegetative stage': 3.3, 'Generative stage 1': 3.4, 'Generative stage 2': 3.4, 'Generative stage 3': 3.4 },
            'coco-b': { 'Start': 2.4, 'Vegetative stage': 3.3, 'Generative stage 1': 3.4, 'Generative stage 2': 3.4, 'Generative stage 3': 3.4 },
            'rhizotonic': { 'Start': 2.5, 'Vegetative stage': 2.5, 'Generative stage 1': 2.5, 'Generative stage 2': 2.5, 'Generative stage 3': 2.5 },
            'cannazym': { 'Vegetative stage': 2.5, 'Generative stage 1': 2.5, 'Generative stage 2': 2.5, 'Generative stage 3': 2.5 }
        },
        notes: [
            { key: 'tomatoNote1', en: 'The recommended EC levels are based on a tap water EC of 0.0 mS/cm.', tr: 'Önerilen EC seviyeleri 0.0 mS/cm musluk suyu EC değerine dayanmaktadır.' },
            { key: 'tomatoNote2', en: 'Maximum EC level is 2.8 mS/cm. Recommended pH 5.2-6.2.', tr: 'Maksimum EC seviyesi 2.8 mS/cm\'dir. Önerilen pH 5.2-6.2.' }
        ]
    },
    orchids: {
        plant_type: 'Orchids',
        stages: [
            { name: 'Start', name_key: 'stageStart', description: 'Formation of roots into the medium (from cutting, division, or offset)', duration: '2-8 weeks', light_hours: 12, ec_plus: '0.6-0.8', ppm_plus: '600-770' },
            { name: 'Vegetative stage', name_key: 'stageVeg', description: 'Plant development', duration: '18-52 weeks', light_hours: 12, ec_plus: '0.8-1.0', ppm_plus: '770-840' },
            { name: 'Flower stage', name_key: 'stageFlower', description: 'Blooming period', duration: '4+ weeks', light_hours: 12, ec_plus: '0.8-1.0', ppm_plus: '770-840' },
            { name: 'Recovery stage', name_key: 'stageRecovery', description: 'Post-bloom recovery', duration: 'Variable (based on seasonality)', light_hours: 12, ec_plus: '0.8-1.0', ppm_plus: '770-840' }
        ],
        products: {
            'coco-a': { 'Start': 1.8, 'Vegetative stage': 2.5, 'Flower stage': 2.5, 'Recovery stage': 2.5 },
            'coco-b': { 'Start': 1.8, 'Vegetative stage': 2.5, 'Flower stage': 2.5, 'Recovery stage': 2.5 },
            'rhizotonic': { 'Start': 2.5, 'Vegetative stage': 2.5, 'Flower stage': 2.5, 'Recovery stage': 2.5 },
            'cannazym': { 'Vegetative stage': 2.4, 'Flower stage': 2.4, 'Recovery stage': 2.4 }
        },
        notes: [
            { key: 'orchidNote1', en: 'Use of this chart is designed for growers with some experience as the amount of variability between species is great (800+ General).', tr: 'Bu tablo biraz deneyimli yetiştiriciler için tasarlanmıştır çünkü türler arasındaki değişkenlik çok fazladır (800+ tür).' },
            { key: 'orchidNote2', en: 'Timing on stages is dependent on cropping method, container size, finish size, and most importantly variety.', tr: 'Aşamaların zamanlaması yetiştirme yöntemine, saksı boyutuna, bitiş boyutuna ve en önemlisi çeşide bağlıdır.' },
            { key: 'orchidNote3', en: 'Temperatures should range 21-30°C daytime with lower limit at night of 13-21°C.', tr: 'Sıcaklıklar gündüz 21-30°C, gece en düşük 13-21°C arasında olmalıdır.' },
            { key: 'orchidNote4', en: 'Overwatering is the leading cause of death and disease in Orchids. Water thoroughly with good quality water and allow the container to leach well.', tr: 'Aşırı sulama Orkidelerde ölüm ve hastalığın başlıca nedenidir. Kaliteli su ile iyice sulayın ve saksının iyi süzülmesine izin verin.' },
            { key: 'orchidNote5', en: 'Fertilize every other watering or less if plant seems \'pushed\'.', tr: 'Her iki sulamada bir veya bitki "zorlanmış" görünüyorsa daha az gübre verin.' }
        ],
        special_requirements: [
            { key: 'orchidDayTemp', value: '21-30°C' },
            { key: 'orchidNightTemp', value: '13-21°C' },
            { key: 'orchidWatering', value: 'Avoid overwatering - main cause of death' },
            { key: 'orchidFeeding', value: 'Every other watering unless plant is stressed' },
            { key: 'orchidStartEC', value: '<0.3 mS/cm water quality' }
        ]
    }
};

// COGr System Schedules
export const COGR_SCHEDULES = {
    general: {
        plant_type: 'General Fast-Growing Plant',
        weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
        phases: {
            'W1': 'rooting',
            'W2-W3': 'vegetative1',
            'W4-W5': 'vegetative2',
            'W6-W7': 'generative1',
            'W8': 'generative2',
            'W9-W10': 'generative3',
            'W11-W12': 'generative4'
        },
        stages: [
            { name: 'Start / rooting', name_key: 'stageRooting', duration: '<1 week', light_hours: 18, ec_plus: '0.7-1.1', ppm_plus: '520-810' },
            { name: 'Vegetative phase I', name_key: 'stageVeg1', duration: '0-3 weeks', light_hours: 18, ec_plus: '0.9-1.3', ppm_plus: '670-960' },
            { name: 'Vegetative phase II', name_key: 'stageVeg2', duration: '2-4 weeks', light_hours: 12, ec_plus: '1.2-1.6', ppm_plus: '890-1180' },
            { name: 'Generative Period I', name_key: 'stageGen1', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.4-1.8', ppm_plus: '1040-1330' },
            { name: 'Generative Period II', name_key: 'stageGen2', duration: '1 week', light_hours: 12, ec_plus: '1.6-2.0', ppm_plus: '1180-1480' },
            { name: 'Generative Period III', name_key: 'stageGen3', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.0-1.4', ppm_plus: '740-1040' },
            { name: 'Generative Period IV', name_key: 'stageGen4', duration: '1-2 weeks', light_hours: '10-12', ec_plus: '0.0', ppm_plus: '0' }
        ],
        products: {
            'cogr-vega-a': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': null },
            'cogr-vega-b': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': null },
            'cogr-flores-a': { 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'cogr-flores-b': { 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'rhizotonic': { 'W1': 2.5, 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5 },
            'cannazym': { 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5, 'W11': 2.5 },
            'pk-13-14': { 'W8': 1.5 },
            'cannaboost': { 'W4': 2, 'W5': 2, 'W6': 2, 'W7': 4, 'W8': 4, 'W9': 4, 'W10': 4 }
        },
        ec_range: { min: 0.7, max: 2.2, unit: 'mS/cm' },
        notes: [
            { key: 'cogrNote1', en: 'This period varies depending on the species and number of plants per m². Mother plants remain in this phase until the end (6-12 months).', tr: 'Bu süre türe ve metrekareye düşen bitki sayısına göre değişir. Ana bitkiler bu aşamada sonuna kadar kalır (6-12 ay).' },
            { key: 'cogrNote2', en: 'The changeover from 18 to 12 hours varies depending on the variety. The rule of thumb is to change after 2 weeks.', tr: '18 saatten 12 saate geçiş çeşide göre değişir. Genel kural 2 hafta sonra değiştirmektir.' },
            { key: 'cogrNote3', en: 'Double CANNAZYM dosage to 5 ml/L if substrate is reused.', tr: 'Substrat yeniden kullanılıyorsa CANNAZYM dozunu 5 ml/L\'ye iki katına çıkarın.' },
            { key: 'cogrNote4', en: '2 ml/L standard. Increase to a maximum of 4 ml/L for extra flowering power.', tr: '2 ml/L standart. Ekstra çiçeklenme gücü için maksimum 4 ml/L\'ye çıkarın.' },
            { key: 'cogrNote5', en: 'pH: Recommended pH is between 5.8 and 6.2. Adding pH- can increase EC.', tr: 'pH: Önerilen pH 5.8 ile 6.2 arasındadır. pH- eklemek EC\'yi artırabilir.' }
        ],
        buffer_note: {
            key: 'cogrBufferNote',
            en: 'COGr slabs must be buffered with COGr Buffer Agent before first use. This prepares the substrate for optimal nutrient uptake.',
            tr: 'COGr levhaları ilk kullanımdan önce COGr Buffer Agent ile tamponlanmalıdır. Bu, substratı optimum besin alımı için hazırlar.'
        }
    }
};

// SUBSTRA System Schedules
export const SUBSTRA_SCHEDULES = {
    general: {
        plant_type: 'General Fast-Growing Plant',
        weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
        phases: {
            'W1': 'rooting',
            'W2-W3': 'vegetative1',
            'W4-W5': 'vegetative2',
            'W6-W7': 'generative1',
            'W8': 'generative2',
            'W9-W10': 'generative3',
            'W11-W12': 'generative4'
        },
        stages: [
            { name: 'Start / rooting', name_key: 'stageRooting', duration: '<1 week', light_hours: 18, ec_plus: '0.7-1.1', ppm_plus: '520-810' },
            { name: 'Vegetative phase I', name_key: 'stageVeg1', duration: '0-3 weeks', light_hours: 18, ec_plus: '0.9-1.3', ppm_plus: '670-960' },
            { name: 'Vegetative phase II', name_key: 'stageVeg2', duration: '2-4 weeks', light_hours: 12, ec_plus: '1.2-1.6', ppm_plus: '890-1180' },
            { name: 'Generative Period I', name_key: 'stageGen1', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.4-1.8', ppm_plus: '1040-1330' },
            { name: 'Generative Period II', name_key: 'stageGen2', duration: '1 week', light_hours: 12, ec_plus: '1.6-2.0', ppm_plus: '1180-1480' },
            { name: 'Generative Period III', name_key: 'stageGen3', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.0-1.4', ppm_plus: '740-1040' },
            { name: 'Generative Period IV', name_key: 'stageGen4', duration: '1-2 weeks', light_hours: '10-12', ec_plus: '0.0', ppm_plus: '0' }
        ],
        products_hard_water: {
            'substra-vega-a-hw': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': null },
            'substra-vega-b-hw': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': null },
            'substra-flores-a-hw': { 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'substra-flores-b-hw': { 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'rhizotonic': { 'W1': 2.5, 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5 },
            'cannazym': { 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5, 'W11': 2.5 },
            'pk-13-14': { 'W8': 1.5 },
            'cannaboost': { 'W4': 2, 'W5': 2, 'W6': 2, 'W7': 4, 'W8': 4, 'W9': 4, 'W10': 4 }
        },
        products_soft_water: {
            'substra-vega-a-sw': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': null },
            'substra-vega-b-sw': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': null },
            'substra-flores-a-sw': { 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'substra-flores-b-sw': { 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'rhizotonic': { 'W1': 2.5, 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5 },
            'cannazym': { 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5, 'W11': 2.5 },
            'pk-13-14': { 'W8': 1.5 },
            'cannaboost': { 'W4': 2, 'W5': 2, 'W6': 2, 'W7': 4, 'W8': 4, 'W9': 4, 'W10': 4 }
        },
        ec_range: { min: 0.7, max: 2.4, unit: 'mS/cm' },
        notes: [
            { key: 'substraNote1', en: 'This period varies depending on the species and number of plants per m². Mother plants remain in this phase until the end (6-12 months).', tr: 'Bu süre türe ve metrekareye düşen bitki sayısına göre değişir. Ana bitkiler bu aşamada sonuna kadar kalır (6-12 ay).' },
            { key: 'substraNote2', en: 'The changeover from 18 to 12 hours varies depending on the variety. The rule of thumb is to change after 2 weeks.', tr: '18 saatten 12 saate geçiş çeşide göre değişir. Genel kural 2 hafta sonra değiştirmektir.' },
            { key: 'substraNote3', en: 'Reduce hours of light if ripening goes too fast. Watch out for increasing Relative Humidity.', tr: 'Olgunlaşma çok hızlı giderse ışık saatlerini azaltın. Artan Bağıl Neme dikkat edin.' },
            { key: 'substraNote4', en: 'Double CANNAZYM dosage to 5 ml/L if substrate is reused.', tr: 'Substrat yeniden kullanılıyorsa CANNAZYM dozunu 5 ml/L\'ye iki katına çıkarın.' },
            { key: 'substraNote5', en: 'pH: Recommended pH is between 5.2 and 6.2. Use pH- grow in vegetative phase, pH- bloom in generative phase.', tr: 'pH: Önerilen pH 5.2 ile 6.2 arasındadır. Vejetatif aşamada pH- grow, generatif aşamada pH- bloom kullanın.' }
        ]
    }
};

// TERRA System Schedules
export const TERRA_SCHEDULES = {
    general: {
        plant_type: 'General Fast-Growing Plant',
        weeks: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
        phases: {
            'W1': 'rooting',
            'W2-W3': 'vegetative1',
            'W4-W5': 'vegetative2',
            'W6-W7': 'generative1',
            'W8': 'generative2',
            'W9-W10': 'generative3',
            'W11-W12': 'generative4'
        },
        stages: [
            { name: 'Start / rooting', name_key: 'stageRooting', duration: '<1 week', light_hours: 18, ec_plus: '0.7-1.1', ppm_plus: '520-810' },
            { name: 'Vegetative phase I', name_key: 'stageVeg1', duration: '0-3 weeks', light_hours: 18, ec_plus: '0.9-1.3', ppm_plus: '670-960' },
            { name: 'Vegetative phase II', name_key: 'stageVeg2', duration: '2-4 weeks', light_hours: 12, ec_plus: '1.2-1.6', ppm_plus: '890-1180' },
            { name: 'Generative Period I', name_key: 'stageGen1', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.4-1.8', ppm_plus: '1040-1330' },
            { name: 'Generative Period II', name_key: 'stageGen2', duration: '1 week', light_hours: 12, ec_plus: '1.6-2.0', ppm_plus: '1180-1480' },
            { name: 'Generative Period III', name_key: 'stageGen3', duration: '2-3 weeks', light_hours: 12, ec_plus: '1.0-1.4', ppm_plus: '740-1040' },
            { name: 'Generative Period IV', name_key: 'stageGen4', duration: '1-2 weeks', light_hours: '10-12', ec_plus: '0.0', ppm_plus: '0' }
        ],
        products: {
            'terra-vega': { 'W1': 2, 'W2': 2.5, 'W3': 3, 'W4': 3, 'W5': null },
            'terra-flores': { 'W5': 3, 'W6': 3.5, 'W7': 4, 'W8': 4, 'W9': 3, 'W10': 2.5, 'W11': null },
            'rhizotonic': { 'W1': 2.5, 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5 },
            'cannazym': { 'W2': 2.5, 'W3': 2.5, 'W4': 2.5, 'W5': 2.5, 'W6': 2.5, 'W7': 2.5, 'W8': 2.5, 'W9': 2.5, 'W10': 2.5, 'W11': 2.5 },
            'pk-13-14': { 'W8': 1.5 },
            'cannaboost': { 'W4': 2, 'W5': 2, 'W6': 2, 'W7': 4, 'W8': 4, 'W9': 4, 'W10': 4 }
        },
        ec_range: { min: 0.7, max: 2.0, unit: 'mS/cm' },
        notes: [
            { key: 'terraNote1', en: 'This period varies depending on the species and number of plants per m². Mother plants remain in this phase until the end (6-12 months).', tr: 'Bu süre türe ve metrekareye düşen bitki sayısına göre değişir. Ana bitkiler bu aşamada sonuna kadar kalır (6-12 ay).' },
            { key: 'terraNote2', en: 'The changeover from 18 to 12 hours varies depending on the variety. The rule of thumb is to change after 2 weeks.', tr: '18 saatten 12 saate geçiş çeşide göre değişir. Genel kural 2 hafta sonra değiştirmektir.' },
            { key: 'terraNote3', en: 'Double CANNAZYM dosage to 5 ml/L if substrate is reused.', tr: 'Substrat yeniden kullanılıyorsa CANNAZYM dozunu 5 ml/L\'ye iki katına çıkarın.' },
            { key: 'terraNote4', en: '2 ml/L standard. Increase to a maximum of 4 ml/L for extra flowering power.', tr: '2 ml/L standart. Ekstra çiçeklenme gücü için maksimum 4 ml/L\'ye çıkarın.' },
            { key: 'terraNote5', en: 'pH: Recommended pH is between 5.8 and 6.2. Use pH- grow in vegetative phase, pH- bloom in generative phase.', tr: 'pH: Önerilen pH 5.8 ile 6.2 arasındadır. Vejetatif aşamada pH- grow, generatif aşamada pH- bloom kullanın.' }
        ]
    },
    basil: {
        plant_type: 'Basil',
        stages: [
            { name: 'Start', name_key: 'stageStart', description: 'Formation of roots', duration: '~1 week', light_hours: '8-12', ec_plus: '1.0-1.2', ppm_plus: '700-840' },
            { name: 'Vegetative stage 1', name_key: 'stageVeg1', description: 'Fast growth', duration: '2-16 weeks', light_hours: '8-14', ec_plus: '1.0-1.2', ppm_plus: '700-840' },
            { name: 'Final Stage', name_key: 'stageFinal', description: 'Pre-harvest', duration: '~2 weeks', light_hours: '8-14', ec_plus: '1.0-1.2', ppm_plus: '700-840' }
        ],
        products: {
            'terra-vega': { 'Start': 2.5, 'Vegetative stage 1': 3, 'Final Stage': 3 },
            'rhizotonic': { 'Start': 2.5, 'Vegetative stage 1': 2.5, 'Final Stage': 2.5 },
            'cannazym': { 'Vegetative stage 1': 2.5, 'Final Stage': 2.5 }
        },
        notes: [
            { key: 'basilTerraNote1', en: 'Timing on stages is dependent on cropping method, container size, finish size, and temperature.', tr: 'Aşamaların zamanlaması yetiştirme yöntemine, saksı boyutuna, bitiş boyutuna ve sıcaklığa bağlıdır.' },
            { key: 'basilTerraNote2', en: 'Constant feed only, no intermittent plain water applications.', tr: 'Sadece sürekli besleme, aralıklı sade su uygulaması yapmayın.' }
        ]
    },
    grape: {
        plant_type: 'Grape',
        stages: [
            { name: 'Start', name_key: 'stageStart', description: 'Bud Break, Formation of roots', duration: '~1 week', light_hours: 'Natural', ec_plus: '1.0-1.2', ppm_plus: '700-840' },
            { name: 'Vegetative stage 1', name_key: 'stageVeg1', description: 'Fast growth', duration: '1-2 weeks', light_hours: 'Natural', ec_plus: '1.0-1.2', ppm_plus: '700-840' },
            { name: 'Generative stage 1', name_key: 'stageGen1', description: 'Onset of Flowering', duration: '2-4 weeks', light_hours: 'Natural', ec_plus: '0.9-1.2', ppm_plus: '630-840' },
            { name: 'Generative stage 2', name_key: 'stageGen2', description: 'Fruit Set to Veraison', duration: '~2 weeks', light_hours: 'Natural', ec_plus: '0.6-0.7', ppm_plus: '420-490' },
            { name: 'Generative stage 3', name_key: 'stageGen3', description: 'To Veraison', duration: '~2 weeks', light_hours: 'Natural', ec_plus: '0.8-0.9', ppm_plus: '560-630' },
            { name: 'Harvest to dormancy', name_key: 'stageDormancy', description: 'Post-harvest hold', duration: 'Hold', light_hours: 'Natural', ec_plus: '-', ppm_plus: '-' }
        ],
        products: {
            'terra-vega': { 'Start': 2.5, 'Vegetative stage 1': 3, 'Generative stage 1': 2.5 },
            'terra-flores': { 'Generative stage 1': 2.5, 'Generative stage 2': 3, 'Generative stage 3': 3 },
            'rhizotonic': { 'Start': 2.5, 'Vegetative stage 1': 2.5, 'Generative stage 1': 2.5, 'Generative stage 2': 2.5, 'Generative stage 3': 2.5 },
            'cannazym': { 'Vegetative stage 1': 2.5, 'Generative stage 1': 2.5, 'Generative stage 2': 2.5, 'Generative stage 3': 2.5, 'Harvest to dormancy': 2.5 },
            'pk-13-14': { 'Generative stage 2': 1 },
            'cannaboost': { 'Generative stage 2': 2, 'Generative stage 3': 2 }
        },
        notes: [
            { key: 'grapeNote1', en: 'Timing on stages is dependent on variety.', tr: 'Aşamaların zamanlaması çeşide bağlıdır.' },
            { key: 'grapeNote2', en: 'Calcium can be the limiting factor, add a liquid Calcium source when necessary. This can be progressively seen as the fruit ripens.', tr: 'Kalsiyum sınırlayıcı faktör olabilir, gerektiğinde sıvı Kalsiyum kaynağı ekleyin. Bu, meyve olgunlaştıkça giderek daha fazla görülebilir.' },
            { key: 'grapeNote3', en: 'Proper pH control is essential to develop the taste.', tr: 'Tadı geliştirmek için uygun pH kontrolü esastır.' },
            { key: 'grapeNote4', en: 'This chart is for Peat based medium AND sandy loam mineral soils. In heavier clay soils use less fertilizer and more in sandy soils.', tr: 'Bu tablo Turba bazlı ortam VE kumlu tınlı mineral topraklar içindir. Ağır killi topraklarda daha az, kumlu topraklarda daha fazla gübre kullanın.' },
            { key: 'grapeNote5', en: 'Grapes like deep roots and sandy soils for heavy root systems. It is not advisable to grow grapes in containers long-term.', tr: 'Üzümler derin kökler ve ağır kök sistemleri için kumlu toprakları sever. Üzümleri uzun vadeli saksılarda yetiştirmek tavsiye edilmez.' }
        ],
        special_requirements: [
            { key: 'grapeCalcium', value: 'Calcium can be limiting - add liquid Ca source if needed' },
            { key: 'grapeContainer', value: 'Not recommended for long-term container growing' },
            { key: 'grapeLightHours', value: 'Natural day length' }
        ]
    }
};

// EC+ Note - applies to all schedules
export const EC_NOTE = {
    key: 'ecNote',
    text_en: 'EC+ values are calculated assuming tap water EC of 0.0 mS/cm. Add your tap water EC to the recommended values.',
    text_tr: 'EC+ değerleri şebeke suyunun EC değeri 0.0 mS/cm kabul edilerek hesaplanmıştır. Önerilen EC değerine kendi şebeke suyunuzun EC değerini ekleyin.'
};

// Default product selections per system
export const DEFAULT_SELECTED_PRODUCTS = {
    aqua: ['aqua-vega-a', 'aqua-vega-b', 'aqua-flores-a', 'aqua-flores-b', 'rhizotonic', 'cannazym'],
    coco: ['coco-a', 'coco-b', 'rhizotonic', 'cannazym'],
    cogr: ['cogr-vega-a', 'cogr-vega-b', 'cogr-flores-a', 'cogr-flores-b', 'rhizotonic', 'cannazym'],
    substra: ['substra-vega-a-hw', 'substra-vega-b-hw', 'substra-flores-a-hw', 'substra-flores-b-hw', 'rhizotonic', 'cannazym'],
    terra: ['terra-vega', 'terra-flores', 'rhizotonic', 'cannazym']
};

// Helper functions
export const getProductsBySystem = (system) => {
    if (system === 'all') {
        return CANNA_PRODUCTS;
    }
    return CANNA_PRODUCTS.filter(p => p.system === system || p.system === 'all');
};

export const getScheduleBySystemAndPlant = (system, plant) => {
    const scheduleMap = {
        aqua: AQUA_SCHEDULES,
        coco: COCO_SCHEDULES,
        cogr: COGR_SCHEDULES,
        substra: SUBSTRA_SCHEDULES,
        terra: TERRA_SCHEDULES
    };

    const systemSchedules = scheduleMap[system];
    if (!systemSchedules) return null;

    return systemSchedules[plant] || systemSchedules.general;
};

export const getAvailablePlantsForSystem = (system) => {
    return PLANT_SCHEDULES[system] || ['general'];
};
