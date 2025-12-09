/**
 * BioBizz Feeding Schedule Data
 * Contains weekly dosage information for BioBizz products
 * 
 * Note: Schedule values can be:
 * - Numeric (e.g., 1, 2, 3) - ml/L dosage
 * - 'N/A' - Not applicable for this week
 * - 'Optional' - Can be used if desired
 * - 'As needed' - Use based on pH measurements
 */

// Substrate types
export const SUBSTRATE_TYPES = {
  ALL_MIX: 'all-mix',
  LIGHT_MIX: 'light-mix',
  COCO_MIX: 'coco-mix'
};

// Week labels
export const WEEK_LABELS = [
  'WK 1', 'WK 2', 'WK 3', 'WK 4', 'WK 5', 'WK 6',
  'WK 7', 'WK 8', 'WK 9', 'WK 10', 'WK 11', 'WK 12'
];

// BioBizz Products with feeding schedules
export const FEEDING_SCHEDULE_DATA = [
  {
    id: 'root-juice',
    product_name: 'Root·Juice',
    category: 'stimulator_root',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 'N/A',
      'WK 6': 'N/A',
      'WK 7': 'N/A',
      'WK 8': 'N/A',
      'WK 9': 'N/A',
      'WK 10': 'N/A',
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 'N/A',
      'WK 6': 'N/A',
      'WK 7': 'N/A',
      'WK 8': 'N/A',
      'WK 9': 'N/A',
      'WK 10': 'N/A',
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'bio-grow',
    product_name: 'Bio·Grow',
    category: 'base_nutrient',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 2,
      'WK 8': 2,
      'WK 9': 2,
      'WK 10': 2,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 2,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 2,
      'WK 8': 2,
      'WK 9': 2,
      'WK 10': 2,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'bio-bloom',
    product_name: 'Bio·Bloom',
    category: 'base_nutrient',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 'N/A',
      'WK 4': 'N/A',
      'WK 5': 'N/A',
      'WK 6': 'N/A',
      'WK 7': 2,
      'WK 8': 2,
      'WK 9': 3,
      'WK 10': 4,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 'N/A',
      'WK 4': 'N/A',
      'WK 5': 'N/A',
      'WK 6': 'N/A',
      'WK 7': 2,
      'WK 8': 2,
      'WK 9': 3,
      'WK 10': 4,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'bio-heaven',
    product_name: 'Bio·Heaven',
    category: 'stimulator_vitality',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 'N/A',
      'WK 4': 'N/A',
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 2,
      'WK 8': 3,
      'WK 9': 3,
      'WK 10': 3,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 'N/A',
      'WK 4': 2,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 2,
      'WK 8': 3,
      'WK 9': 3,
      'WK 10': 3,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'top-max',
    product_name: 'Top·Max',
    category: 'bloom_booster',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 'N/A',
      'WK 4': 'N/A',
      'WK 5': 'N/A',
      'WK 6': 'N/A',
      'WK 7': 1,
      'WK 8': 1,
      'WK 9': 1,
      'WK 10': 1,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 'N/A',
      'WK 4': 'N/A',
      'WK 5': 'N/A',
      'WK 6': 'N/A',
      'WK 7': 1,
      'WK 8': 1,
      'WK 9': 1,
      'WK 10': 1,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'alg-a-mic',
    product_name: 'Alg·A·Mic',
    category: 'stimulator_vitality',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 2,
      'WK 8': 2,
      'WK 9': 2,
      'WK 10': 2,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 2,
      'WK 8': 2,
      'WK 9': 2,
      'WK 10': 2,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'acti-vera',
    product_name: 'Acti·Vera',
    category: 'protector',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 2,
      'WK 8': 2,
      'WK 9': 2,
      'WK 10': 2,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 2,
      'WK 8': 2,
      'WK 9': 2,
      'WK 10': 2,
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'fish-mix',
    product_name: 'Fish·Mix',
    category: 'activator',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 'N/A',
      'WK 8': 'N/A',
      'WK 9': 'N/A',
      'WK 10': 'N/A',
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 2,
      'WK 6': 2,
      'WK 7': 'N/A',
      'WK 8': 'N/A',
      'WK 9': 'N/A',
      'WK 10': 'N/A',
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'leaf-coat',
    product_name: 'Leaf·Coat',
    category: 'protector',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 'Optional',
      'WK 4': 'Optional',
      'WK 5': 'Optional',
      'WK 6': 'Optional',
      'WK 7': 'Optional',
      'WK 8': 'Optional',
      'WK 9': 'Optional',
      'WK 10': 'Optional',
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 'N/A',
      'WK 2': 'N/A',
      'WK 3': 'Optional',
      'WK 4': 'Optional',
      'WK 5': 'Optional',
      'WK 6': 'Optional',
      'WK 7': 'Optional',
      'WK 8': 'Optional',
      'WK 9': 'Optional',
      'WK 10': 'Optional',
      'WK 11': 'N/A',
      'WK 12': 'N/A'
    }
  },
  {
    id: 'bio-ph-minus',
    product_name: 'Bio·pH⁻',
    category: 'ph_regulator',
    dose_unit: 'ml/L',
    schedule_allmix: {
      'WK 1': 'As needed',
      'WK 2': 'As needed',
      'WK 3': 'As needed',
      'WK 4': 'As needed',
      'WK 5': 'As needed',
      'WK 6': 'As needed',
      'WK 7': 'As needed',
      'WK 8': 'As needed',
      'WK 9': 'As needed',
      'WK 10': 'As needed',
      'WK 11': 'As needed',
      'WK 12': 'N/A'
    },
    schedule_lightmix_coco: {
      'WK 1': 'As needed',
      'WK 2': 'As needed',
      'WK 3': 'As needed',
      'WK 4': 'As needed',
      'WK 5': 'As needed',
      'WK 6': 'As needed',
      'WK 7': 'As needed',
      'WK 8': 'As needed',
      'WK 9': 'As needed',
      'WK 10': 'As needed',
      'WK 11': 'As needed',
      'WK 12': 'N/A'
    }
  }
];

// Phase information
export const PHASE_INFO = {
  rooting: {
    weeks: [1, 2],
    label: { en: 'Rooting', tr: 'Köklenme' },
    color: '#8B5CF6'
  },
  vegetative: {
    weeks: [3, 4, 5, 6],
    label: { en: 'Vegetative', tr: 'Vegetatif' },
    color: '#22C55E'
  },
  flowering: {
    weeks: [7, 8, 9, 10],
    label: { en: 'Flowering', tr: 'Çiçeklenme' },
    color: '#EC4899'
  },
  flush: {
    weeks: [11],
    label: { en: 'Flush', tr: 'Yıkama' },
    color: '#6B7280'
  },
  harvest: {
    weeks: [12],
    label: { en: 'Harvest', tr: 'Hasat' },
    color: '#F59E0B'
  }
};

// Product categories
export const PRODUCT_CATEGORIES = {
  base_nutrient: {
    name: { en: 'Base Nutrients', tr: 'Temel Besinler' },
    icon: '🌱'
  },
  stimulator_root: {
    name: { en: 'Root Stimulators', tr: 'Kök Uyarıcılar' },
    icon: '🌳'
  },
  stimulator_bloom: {
    name: { en: 'Bloom Stimulators', tr: 'Çiçek Uyarıcılar' },
    icon: '🌸'
  },
  stimulator_vitality: {
    name: { en: 'Vitality Stimulators', tr: 'Canlılık Arttırıcılar' },
    icon: '✨'
  },
  bloom_booster: {
    name: { en: 'Bloom Boosters', tr: 'Çiçek Güçlendiriciler' },
    icon: '⚡'
  },
  activator: {
    name: { en: 'Activators', tr: 'Aktivatörler' },
    icon: '🔋'
  },
  microorganisms: {
    name: { en: 'Microorganisms', tr: 'Mikroorganizmalar' },
    icon: '🦠'
  },
  supplement: {
    name: { en: 'Supplements', tr: 'Takviyeler' },
    icon: '💊'
  },
  protector: {
    name: { en: 'Protectors', tr: 'Koruyucular' },
    icon: '🛡️'
  },
  ph_regulator: {
    name: { en: 'pH Regulators', tr: 'pH Düzenleyiciler' },
    icon: '⚖️'
  }
};
