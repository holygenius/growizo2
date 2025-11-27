// BioBizz Beslenme Programı Verileri
// Haftalık dozaj bilgileri ve uygulama talimatları
// Substrat bazlı iki farklı program: ALL·MIX ve LIGHT·MIX/COCO·MIX

// Substrat Tipleri
export const SUBSTRATE_TYPES = {
  ALL_MIX: 'all-mix',
  LIGHT_MIX: 'light-mix',
  COCO_MIX: 'coco-mix'
};

// Substrat Grupları (hangi programın kullanılacağını belirler)
export const SUBSTRATE_SCHEDULE_MAP = {
  'all-mix': 'SCHEDULE_ALLMIX',
  'light-mix': 'SCHEDULE_LIGHTMIX_COCOMIX',
  'coco-mix': 'SCHEDULE_LIGHTMIX_COCOMIX'
};

export const FEEDING_SCHEDULE_DATA = [
  {
    id: 'root-juice',
    product_name: 'Root·Juice™',
    category: 'STİMÜLATÖR (KÖK)',
    category_key: 'stimulator_root',
    dose_unit: 'ml/L su',
    application_type: 'Sulama (Su/Toprak/Hidroponik)',
    usage_phase: 'KÖKLENME (ROOTING)',
    color: '#8B5CF6', // Purple
    function: 'KÖK STİMÜLASYONU',
    short_desc: 'Güçlü kök gelişimi için',
    benefits: [
      'Birinci sınıf hümik asit ve deniz yosunundan elde edilmiştir',
      'Güçlü kök gelişimini teşvik eder',
      'Bitkiyi besinleri daha hızlı emmeye hazırlar'
    ],
    // Tüm substratlar için aynı dozaj
    schedule: {
      'WK 1': 4,
      'WK 2': 4,
      'WK 3': 'N/A',
      'WK 4': 'N/A',
      'WK 5': 'N/A',
      'WK 6': 'N/A',
      'WK 7': 'N/A',
      'WK 8': 'N/A',
      'WK 9': 'N/A',
      'WK 10': 'N/A',
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    }
  },
  {
    id: 'bio-grow',
    product_name: 'Bio·Grow®',
    category: 'TEMEL GÜBRE (NK)',
    category_key: 'base_nutrient',
    dose_unit: 'ml/L su',
    application_type: 'Sulama',
    usage_phase: 'BÜYÜME VE ÇİÇEKLENME (NUTRITION)',
    color: '#22C55E', // Green
    function: 'TEMEL BESLENME (Büyüme)',
    short_desc: 'Büyümeyi teşvik eden temel gübre',
    benefits: [
      '%100 organik şeker pancarı özünden (vinasse) elde edilmiştir',
      'Toprak mikropları için zengin bir gıda kaynağıdır',
      'B1, B2, C ve E vitaminlerini içerir'
    ],
    // ALL·MIX için düşük dozaj (ağır gübrelenmiş toprak)
    schedule_allmix: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 1,
      'WK 6': 1,
      'WK 7': 4,
      'WK 8': 4,
      'WK 9': 4,
      'WK 10': 4,
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    // LIGHT·MIX / COCO·MIX için yüksek dozaj
    schedule_lightmix_coco: {
      'WK 1': 2,
      'WK 2': 2,
      'WK 3': 2,
      'WK 4': 3,
      'WK 5': 3,
      'WK 6': 4,
      'WK 7': 4,
      'WK 8': 4,
      'WK 9': 4,
      'WK 10': 4,
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    // Varsayılan schedule (ALL·MIX bazlı)
    schedule: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 1,
      'WK 6': 1,
      'WK 7': 4,
      'WK 8': 4,
      'WK 9': 4,
      'WK 10': 4,
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    note: 'Vegetatif aşamada Fish·Mix™ ile değiştirilebilir, çiçeklenmeyi tetiklemek için Bio·Grow®\'a geçilmelidir.'
  },
  {
    id: 'fish-mix',
    product_name: 'Fish·Mix™',
    category: 'TEMEL GÜBRE (N)',
    category_key: 'base_nutrient',
    dose_unit: 'ml/L su',
    application_type: 'Sulama (veya Yaprak Spreyi)',
    usage_phase: 'BÜYÜME (NUTRITION)',
    color: '#06B6D4', // Cyan
    function: 'BESLENME / TOPRAK İYİLEŞTİRME',
    short_desc: 'Toprak kalitesini artıran gübre',
    benefits: [
      'Substrattaki tüm canlı organizmaların büyümesini hızlandırır',
      'Mikroorganizma ve faydalı bakteri üretimini teşvik eder',
      'Kötü kaliteli toprağı zengin, yağlı toprağa dönüştürür'
    ],
    // ALL·MIX için Indoor/Outdoor schedule (düşük dozaj)
    schedule_allmix_indoor: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 1,
      'WK 6': 1,
      'WK 7': 1,
      'WK 8': 1,
      'WK 9': 1,
      'WK 10': 'N/A',
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    schedule_allmix_outdoor: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 1,
      'WK 6': 1,
      'WK 7': 1,
      'WK 8': 1,
      'WK 9': 1,
      'WK 10': 'N/A',
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    // LIGHT·MIX / COCO·MIX için yüksek dozaj
    schedule_lightmix_coco_indoor: {
      'WK 1': 2,
      'WK 2': 2,
      'WK 3': 2,
      'WK 4': 3,
      'WK 5': 3,
      'WK 6': 4,
      'WK 7': 4,
      'WK 8': 4,
      'WK 9': 4,
      'WK 10': 'N/A',
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    schedule_lightmix_coco_outdoor: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 1,
      'WK 6': 1,
      'WK 7': 1,
      'WK 8': 1,
      'WK 9': 1,
      'WK 10': 'N/A',
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    // Varsayılan schedule (Indoor)
    schedule_indoor: {
      'WK 1': 2,
      'WK 2': 2,
      'WK 3': 2,
      'WK 4': 3,
      'WK 5': 3,
      'WK 6': 4,
      'WK 7': 4,
      'WK 8': 4,
      'WK 9': 4,
      'WK 10': 'N/A',
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    schedule_outdoor: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 1,
      'WK 6': 1,
      'WK 7': 1,
      'WK 8': 1,
      'WK 9': 1,
      'WK 10': 'N/A',
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    foliar_dose: 'Haftada 1-3 kez, çiçeklenmenin ikinci haftasına kadar 1-2 ml/L (diğer iki ürünle kullanılırsa maks. 1 ml/L).'
  },
  {
    id: 'bio-bloom',
    product_name: 'Bio·Bloom™',
    category: 'TEMEL GÜBRE (BLOOM)',
    category_key: 'base_nutrient',
    dose_unit: 'ml/L su',
    application_type: 'Sulama (Su/Toprak/Hidroponik)',
    usage_phase: 'ÇİÇEKLENME (BLOOMING)',
    color: '#EC4899', // Pink
    function: 'TEMEL BESLENME (Çiçeklenme)',
    short_desc: 'Çiçeklenme için temel gübre',
    benefits: [
      'Lezzetli meyvelere yol açan coşkulu çiçekler için',
      'Nitrojen, fosfor ve potasyumun optimum karışımını sunar',
      'Bağımsız çalışan bir gübredir',
      'Eser elementler içerir'
    ],
    schedule: {
      'WK 1': 1,
      'WK 2': 2,
      'WK 3': 2,
      'WK 4': 3,
      'WK 5': 3,
      'WK 6': 4,
      'WK 7': 4,
      'WK 8': 4,
      'WK 9': 4,
      'WK 10': 4,
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    }
  },
  {
    id: 'top-max',
    product_name: 'Top·Max™',
    category: 'STİMÜLATÖR (ÇİÇEKLENME)',
    category_key: 'stimulator_bloom',
    dose_unit: 'ml/L su',
    application_type: 'Sulama (Su/Toprak/Hidroponik)',
    usage_phase: 'ÇİÇEKLENME (BLOOMING STIMULATING)',
    color: '#F59E0B', // Amber
    function: 'ÇİÇEKLENME STİMÜLASYONU',
    short_desc: 'Çiçek boyutu ve ağırlığını artırır',
    benefits: [
      'Çiçeklenme güçlendiricisidir (boyut ve ağırlık)',
      'Besin alımını iyileştirir',
      'Daha tatlı, pürüzsüz tadım sağlayan ürünler yetiştirilmesini sağlar'
    ],
    schedule: {
      'WK 1': 1,
      'WK 2': 1,
      'WK 3': 1,
      'WK 4': 1,
      'WK 5': 1,
      'WK 6': 4,
      'WK 7': 4,
      'WK 8': 4,
      'WK 9': 4,
      'WK 10': 4,
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    }
  },
  {
    id: 'bio-heaven',
    product_name: 'Bio·Heaven™',
    category: 'BOOSTER (ENERJİ)',
    category_key: 'booster',
    dose_unit: 'ml/L su',
    application_type: 'Sulama (Su/Toprak/Hidroponik)',
    usage_phase: 'BÜYÜME VE ÇİÇEKLENME (BOOSTING)',
    color: '#EAB308', // Yellow
    function: 'ENERJİ GÜÇLENDİRME',
    short_desc: 'Enerji ve metabolizma desteği',
    benefits: [
      'Enerji takviyesi sağlar',
      'Nem tutma özelliğini iyileştirir',
      'Enzimatik aktiviteyi ve hızlı besin emilimini uyarır',
      'Toksinlerden kurtulmayı sağlar'
    ],
    schedule: {
      'WK 1': 2,
      'WK 2': 2,
      'WK 3': 2,
      'WK 4': 2,
      'WK 5': 3,
      'WK 6': 4,
      'WK 7': 4,
      'WK 8': 5,
      'WK 9': 5,
      'WK 10': 5,
      'WK 11': 5,
      'WK 12': 5
    }
  },
  {
    id: 'acti-vera',
    product_name: 'Acti·Vera™',
    category: 'AKTİVATÖR',
    category_key: 'activator',
    dose_unit: 'ml/L su',
    application_type: 'Sulama (veya Yaprak Spreyi)',
    usage_phase: 'BÜYÜME VE ÇİÇEKLENME (BOOSTING/PREVENTING)',
    color: '#84CC16', // Lime
    function: 'GÜÇLENDİRME / ÖNLEME',
    short_desc: 'Bağışıklık ve metabolizma aktivatörü',
    benefits: [
      'Hem içeriden hem dışarıdan daha güçlü ve daha sağlıklı bitkiler sağlar',
      'Bağışıklık sistemini korur ve aktive eder',
      'Çimlenmeyi ve bitki metabolizmasını artırır'
    ],
    schedule: {
      'WK 1': 2,
      'WK 2': 2,
      'WK 3': 2,
      'WK 4': 2,
      'WK 5': 3,
      'WK 6': 4,
      'WK 7': 4,
      'WK 8': 5,
      'WK 9': 5,
      'WK 10': 5,
      'WK 11': 5,
      'WK 12': 5
    },
    foliar_dose: 'Haftada 1-3 kez, çiçeklenmenin ikinci haftasına kadar 1-2 ml/L (diğer iki ürünle kullanılırsa maks. 1 ml/L).'
  },
  {
    id: 'alg-a-mic',
    product_name: 'Alg·A·Mic™',
    category: 'STİMÜLATÖR (CANLILIK)',
    category_key: 'stimulator_vitality',
    dose_unit: 'ml/L su',
    application_type: 'Sulama (veya Yaprak Spreyi)',
    usage_phase: 'BÜYÜME VE ÇİÇEKLENME (STIMULATING/PREVENTING)',
    color: '#14B8A6', // Teal
    function: 'CANLILIK/ÖNLEME',
    short_desc: 'Stres kurtarıcısı ve canlandırıcı',
    benefits: [
      'Aşırı besleme, eksiklikler, hastalıklar veya sıcaklık dalgalanmaları durumunda kurtarıcıdır',
      'Yeşil yaprakları garanti eder',
      'Düşük NPK seviyesine sahip canlandırıcı bir üründür'
    ],
    schedule: {
      'WK 1': 1,
      'WK 2': 2,
      'WK 3': 2,
      'WK 4': 3,
      'WK 5': 3,
      'WK 6': 4,
      'WK 7': 4,
      'WK 8': 4,
      'WK 9': 4,
      'WK 10': 4,
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    foliar_dose: 'Haftada 1-3 kez, çiçeklenmenin ikinci haftasına kadar 1-2 ml/L (diğer iki ürünle kullanılırsa maks. 1 ml/L).'
  },
  {
    id: 'microbes',
    product_name: 'Biobizz Microbes',
    category: 'AKTİF MİKROORGANİZMALAR',
    category_key: 'microorganisms',
    dose_unit: 'g/L su',
    application_type: 'Sulama (Toz Karışımı)',
    usage_phase: 'TÜM AŞAMALAR (NPK ALIMINI ARTIRMA)',
    color: '#A855F7', // Purple
    function: 'NPK AKIŞINI ARTIRMA',
    short_desc: 'Faydalı mikroorganizma konsantresi',
    benefits: [
      'Büyümeyi ve üretimi artıracak bakteri, mantar ve enzimlerin süper konsantre karışımıdır'
    ],
    schedule: {
      'WK 1': 0.4,
      'WK 2': 0.2,
      'WK 3': 0.2,
      'WK 4': 0.4,
      'WK 5': 0.4,
      'WK 6': 0.4,
      'WK 7': 0.2,
      'WK 8': 0.2,
      'WK 9': 0.2,
      'WK 10': 0.4,
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    note: 'Genellikle haftada bir kez uygulanır. Besin ihtiyacının yüksek olduğu dönemlerde (WK 2-3 ve WK 5-6) haftada iki kez uygulanabilir.'
  },
  {
    id: 'calmag',
    product_name: 'CALMAG',
    category: 'EK TAKVİYE (Ca/Mg)',
    category_key: 'supplement',
    dose_unit: 'ml/L su',
    application_type: 'Sulama (Su/Toprak/Hidroponik)',
    usage_phase: 'TÜM AŞAMALAR (SUPPLEMENT)',
    color: '#6366F1', // Indigo
    function: 'CA VE MG TAKVİYESİ',
    short_desc: 'Kalsiyum ve Magnezyum desteği',
    benefits: [
      'Olası Ca (Kalsiyum) ve Mg (Magnezyum) eksikliklerinden bitkiyi korumak için tasarlanmıştır',
      'Az gübrelenmiş substratlarda ve hidroponik sistemlerde kullanılabilir'
    ],
    schedule_prevention_substrate: {
      'WK 1-6': '0.3-0.8',
      'WK 6-8': '0.5-0.8',
      'WK 8-10': '0.8-1.2'
    },
    schedule_prevention_hydro_coco: {
      'WK 1-6': '0.5-0.8',
      'WK 6-8': '1-1.4',
      'WK 8-10': '1-1.4'
    },
    schedule: {
      'WK 1': 0.5,
      'WK 2': 0.5,
      'WK 3': 0.5,
      'WK 4': 0.5,
      'WK 5': 0.5,
      'WK 6': 0.8,
      'WK 7': 0.8,
      'WK 8': 1,
      'WK 9': 1,
      'WK 10': 1,
      'WK 11': 'FLUSH',
      'WK 12': 'HARVEST'
    },
    note: 'RO (ters ozmoz) veya çok yumuşak su kullanılırken her sulamada kullanılması, veya Ca/Mg eksikliği belirtileri fark edildiğinde haftada bir kez kullanılması önerilir.'
  },
  {
    id: 'leaf-coat',
    product_name: 'Leaf·Coat™',
    category: 'KORUYUCU / GÜÇLENDİRİCİ',
    category_key: 'protector',
    dose_unit: 'Kullanıma Hazır',
    application_type: 'Yaprak Spreyi',
    usage_phase: 'BÜYÜME VE ÇİÇEKLENME',
    color: '#10B981', // Emerald
    function: 'KORUYUCU',
    short_desc: 'Zararlılara karşı doğal koruma',
    benefits: [
      'İstenmeyen böceklere ve zararlı yaprak mantarlarına karşı koruma sağlar',
      'Kullanıma hazır bir üründür',
      'Pestisitlere karşı çevresel olarak dost bir alternatiftir'
    ],
    schedule: {
      'WK 1': '✓',
      'WK 2': '✓',
      'WK 3': '✓',
      'WK 4': '✓',
      'WK 5': '✓',
      'WK 6': '✓',
      'WK 7': '✓',
      'WK 8': '✓',
      'WK 9': '✓',
      'WK 10': 'STOP',
      'WK 11': 'N/A',
      'WK 12': 'HARVEST'
    },
    note: 'Su ile karıştırmaya gerek yoktur. Bir atomizörden doğrudan uygulanır. Haftada yaklaşık iki kez. Çiçeklenmenin bitimine iki hafta kala durdurulmalıdır.'
  },
  {
    id: 'bio-down',
    product_name: 'Bio·Down',
    category: 'ORGANİK pH DÜZENLEYİCİ (pH-)',
    category_key: 'ph_regulator',
    dose_unit: 'İhtiyaca Göre',
    application_type: 'Sulama/Hidroponik',
    usage_phase: 'BÜYÜME VE ÇİÇEKLENME',
    color: '#EF4444', // Red
    function: 'PH DÜZENLEME',
    short_desc: 'pH düşürücü',
    benefits: [
      'Besin karışımı pH düzenleyicisidir'
    ],
    schedule: null,
    note: 'Besin karışımının pH\'ını düşürmek gerektiğinde kullanılır (sitrik asit bazlı). Önce diğer Biobizz ürünleri karıştırılır, pH ölçülür ve istenen değere ulaşana kadar Bio·Down eklenip karıştırılır.'
  },
  {
    id: 'bio-up',
    product_name: 'Bio·Up',
    category: 'ORGANİK pH DÜZENLEYİCİ (pH+)',
    category_key: 'ph_regulator',
    dose_unit: 'İhtiyaca Göre',
    application_type: 'Sulama/Hidroponik',
    usage_phase: 'BÜYÜME VE ÇİÇEKLENME',
    color: '#3B82F6', // Blue
    function: 'PH DÜZENLEME',
    short_desc: 'pH yükseltici',
    benefits: [
      'Besin karışımı pH düzenleyicisidir'
    ],
    schedule: null,
    note: 'Besin karışımının pH\'ını yükseltmek gerektiğinde kullanılır (hümik asit bazlı). Önce diğer Biobizz ürünleri karıştırılır, pH ölçülür ve istenen değere ulaşana kadar Bio·Up eklenip karıştırılır.'
  }
];

// Substrat bilgileri
export const SUBSTRATE_INFO = {
  'all-mix': {
    name: 'All·Mix®',
    description: 'Ağır gübrelenmiş, iki hafta boyunca ek gübreye ihtiyaç duymaz. İlk kullanımda suyla nemlendirilir ve 36 saat bekletilir.',
    type: 'substrate'
  },
  'light-mix': {
    name: 'Light·Mix®',
    description: 'Tohum ve çelikler için ideal temel, köklenmeyi teşvik eder. Daha fazla kontrol isteyenler için uygundur.',
    type: 'substrate'
  },
  'coco-mix': {
    name: 'Coco·Mix™',
    description: 'Hidroponik dahil her türlü besinle uyumlu baz materyal.',
    type: 'substrate'
  },
  'worm-humus': {
    name: 'Worm·Humus™',
    description: 'Toprak iyileştiricidir. All·Mix®\'i tazelemek veya karıştırmak için kullanılır (ideal oran: %10-15 Worm·Humus™ ile %85-90 All·Mix®).',
    type: 'amendment'
  },
  'pre-mix': {
    name: 'Pre·Mix™',
    description: 'Başlangıç gübresi veya nakil (transplant) gübresi olarak herhangi bir toprak veya topraksız substrata karıştırılabilir.',
    type: 'amendment'
  }
};

// Hafta etiketleri
export const WEEK_LABELS = [
  'WK 1', 'WK 2', 'WK 3', 'WK 4', 'WK 5', 'WK 6',
  'WK 7', 'WK 8', 'WK 9', 'WK 10', 'WK 11', 'WK 12'
];

// Faz bilgileri
export const PHASE_INFO = {
  rooting: { weeks: [1, 2], label: 'Köklenme', color: '#8B5CF6' },
  vegetative: { weeks: [3, 4, 5, 6], label: 'Vejetatif', color: '#22C55E' },
  flowering: { weeks: [7, 8, 9, 10], label: 'Çiçeklenme', color: '#EC4899' },
  flush: { weeks: [11], label: 'Yıkama', color: '#6B7280' },
  harvest: { weeks: [12], label: 'Hasat', color: '#F59E0B' }
};

// Varsayılan seçili ürünler (temel set)
export const DEFAULT_SELECTED_PRODUCTS = [
  'bio-grow',
  'bio-bloom',
  'top-max',
  'root-juice'
];

// Kategori grupları
export const PRODUCT_CATEGORIES = {
  base_nutrient: { name: 'Temel Gübreler', icon: '🌱' },
  stimulator_root: { name: 'Kök Stimülatörü', icon: '🌳' },
  stimulator_bloom: { name: 'Çiçek Stimülatörü', icon: '🌸' },
  stimulator_vitality: { name: 'Canlılık Stimülatörü', icon: '✨' },
  booster: { name: 'Booster', icon: '⚡' },
  activator: { name: 'Aktivatör', icon: '🔋' },
  microorganisms: { name: 'Mikroorganizmalar', icon: '🦠' },
  supplement: { name: 'Takviye', icon: '💊' },
  protector: { name: 'Koruyucu', icon: '🛡️' },
  ph_regulator: { name: 'pH Düzenleyici', icon: '⚖️' }
};
