// BioBizz Ürün Kataloğu
// Her ürünün hangi yetiştirme medyasıyla uyumlu olduğu belirtilmiştir

export const BIOBIZZ_PRODUCTS = [
  {
    id: 'biobizz-allmix',
    product_name: 'All·Mix®',
    brand: 'BioBizz',
    main_category: 'SUBSTRAT',
    category_key: 'substrate',
    function_detailed: 'Düzenli Beslenme (Heavily pre-fertilized)',
    application_type: 'Toprak/Substrat Karışımı (Katı)',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Blooming)'],
    application_methods: ['Düzenli Sulama'],
    key_properties: 'Yüksek oranda önceden gübrelenmiş topraktır ve zengin bir mikro aktif ekosistemi taklit eder.',
    available_packaging: ['20L', '50L'],
    compatible_media: ['soil'],
    price: 650,
    icon: '🌱'
  },
  {
    id: 'biobizz-lightmix',
    product_name: 'Light·Mix®',
    brand: 'BioBizz',
    main_category: 'SUBSTRAT',
    category_key: 'substrate',
    function_detailed: 'Köklenme ve Düzenli Beslenme (Rooting, Regular Nutrition)',
    application_type: 'Toprak/Substrat Karışımı (Katı)',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Blooming)'],
    application_methods: ['Düzenli Sulama'],
    key_properties: 'Fide, genç bitki ve çelikler için ideal temel sağlar; kök yapılarının hızla gelişmesini teşvik eden mikro aktiviteyi başlatır.',
    available_packaging: ['20L', '50L'],
    compatible_media: ['soil'],
    price: 550,
    icon: '🌿'
  },
  {
    id: 'biobizz-cocomix',
    product_name: 'Coco·Mix™',
    brand: 'BioBizz',
    main_category: 'SUBSTRAT',
    category_key: 'substrate',
    function_detailed: 'Köklenme ve Baz Materyal (Rooting, Base Material)',
    application_type: 'Hindistan Cevizi Lifi (Katı)',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Blooming)'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: '%100 organik hindistan cevizi lifinden yapılmıştır. Kayayı (rock wool) ikame etmek için hidroponik sistemlerde kullanılabilir ve havalandırmayı iyileştirir.',
    available_packaging: ['50L'],
    compatible_media: ['coco', 'hydro'],
    price: 450,
    icon: '🥥'
  },
  {
    id: 'biobizz-wormhumus',
    product_name: 'Worm·Humus™',
    brand: 'BioBizz',
    main_category: 'SUBSTRAT GÜÇLENDİRİCİ',
    category_key: 'substrate_booster',
    function_detailed: 'Köklenme ve Ek Beslenme (Rooting, Additional Nutrition)',
    application_type: 'Solucan Gübresi Kompostu (Katı)',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Blooming)'],
    application_methods: ['Düzenli Sulama', 'Karıştırma'],
    key_properties: '%100 saf, organik solucan dışkısından (vermicast) yapılmıştır. Besin açısından zengin toprak iyileştiricidir.',
    available_packaging: ['40L'],
    compatible_media: ['soil', 'coco'],
    price: 380,
    icon: '🪱'
  },
  {
    id: 'biobizz-premix',
    product_name: 'Pre·Mix™',
    brand: 'BioBizz',
    main_category: 'KURU GÜBRE / KATKI',
    category_key: 'dry_fertilizer',
    function_detailed: 'Beslenme (Nutrition)',
    application_type: 'Kuru Toz Gübre',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Blooming)'],
    application_methods: ['Substrata Karıştırma'],
    key_properties: 'Farklı organik gübre, kaya unu, eser element ve mantarları birleştirir. Transplant veya başlangıç gübresi olarak kullanılabilir.',
    available_packaging: ['5L', '25L'],
    compatible_media: ['soil', 'coco'],
    price: 420,
    icon: '🧪'
  },
  {
    id: 'biobizz-biogrow',
    product_name: 'Bio·Grow®',
    brand: 'BioBizz',
    main_category: 'TEMEL SIVI GÜBRE',
    category_key: 'base_nutrient',
    function_detailed: 'Büyüme Beslenmesi (Nutrition - Growing)',
    application_type: 'Sıvı',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Meyve üretimi sonuna kadar)'],
    application_methods: ['Düzenli Sulama', 'Sulama Sistemleri'],
    key_properties: '%100 Hollanda organik şeker pancarı özü (vinasse) bazlıdır. Substrattaki bakteriyel florayı aktive eder.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco'],
    price: 320,
    icon: '🌱'
  },
  {
    id: 'biobizz-fishmix',
    product_name: 'Fish·Mix™',
    brand: 'BioBizz',
    main_category: 'TEMEL SIVI GÜBRE',
    category_key: 'base_nutrient',
    function_detailed: 'Büyüme Beslenmesi (Nutrition - Growing)',
    application_type: 'Sıvı',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (İlk aşamalar)'],
    application_methods: ['Düzenli Sulama', 'Sulama Sistemleri', 'Yaprak Spreyi (Foliar)'],
    key_properties: 'Kuzey Denizi organik balık emülsiyonu ve Hollanda şeker pancarı özü içerir. Substrattaki mikroorganizma ve faydalı bakteri üretimini teşvik eder.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco'],
    price: 350,
    icon: '🐟'
  },
  {
    id: 'biobizz-biobloom',
    product_name: 'Bio·Bloom™',
    brand: 'BioBizz',
    main_category: 'TEMEL SIVI GÜBRE',
    category_key: 'base_nutrient',
    function_detailed: 'Çiçeklenme Beslenmesi (Nutrition - Blooming)',
    application_type: 'Sıvı',
    application_phases: ['ÇİÇEKLENME (Hasata kadar)'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: 'Azot, fosfor ve potasyumun optimum karışımını, enzimler ve amino asitlerle birleştirir. Çiçeklenme sürecini tetiklemeye yardımcı olur.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 340,
    icon: '🌸'
  },
  {
    id: 'biobizz-rootjuice',
    product_name: 'Root·Juice™',
    brand: 'BioBizz',
    main_category: 'STİMÜLATÖR',
    category_key: 'stimulator',
    function_detailed: 'Kök Stimülasyonu (Rooting Stimulating)',
    application_type: 'Sıvı',
    application_phases: ['KÖKLENME (İlk haftalar)'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: 'Humik asit ve deniz yosunundan yapılmış organik kök stimülatörü. Güçlü kök gelişimini teşvik eder ve besin emilimini hızlandırır.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 480,
    icon: '🌳'
  },
  {
    id: 'biobizz-topmax',
    product_name: 'Top·Max™',
    brand: 'BioBizz',
    main_category: 'STİMÜLATÖR',
    category_key: 'stimulator',
    function_detailed: 'Çiçeklenme Stimülasyonu (Blooming Stimulating)',
    application_type: 'Sıvı',
    application_phases: ['ÇİÇEKLENME (Tüm dönem boyunca)'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: 'Humik ve fulvik asitler içerir. Çiçek salkımlarının boyutunu ve ağırlığını artırır, besin alımını iyileştirir ve ürünün tadını tatlandırır.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 520,
    icon: '🌺'
  },
  {
    id: 'biobizz-bioheaven',
    product_name: 'Bio·Heaven™',
    brand: 'BioBizz',
    main_category: 'BOOSTER',
    category_key: 'booster',
    function_detailed: 'Enerji Güçlendirme (Boosting)',
    application_type: 'Sıvı',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Tüm dönem boyunca)'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: 'Amino asitler gibi biyolojik uyarıcılar içerir. Enzimatik aktiviteyi ve hızlı besin emilimini uyarır, bitkinin nem tutma yeteneğini artırır.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 580,
    icon: '⚡'
  },
  {
    id: 'biobizz-activera',
    product_name: 'Acti·Vera™',
    brand: 'BioBizz',
    main_category: 'AKTİVATÖR',
    category_key: 'activator',
    function_detailed: 'Bağışıklık Sistemi Güçlendirme ve Önleme (Boosting, Preventing)',
    application_type: 'Sıvı',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Tüm dönem boyunca)'],
    application_methods: ['Düzenli Sulama', 'Sulama Sistemleri', 'Yaprak Spreyi (Foliar)'],
    key_properties: "'Bir bitkiden bir bitki için' teorisiyle geliştirilmiş organik botanik aktivatördür. Bitkinin bağışıklık sistemini korur ve aktive eder. %100 vegandır.",
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 450,
    icon: '🌿'
  },
  {
    id: 'biobizz-algamic',
    product_name: 'Alg·A·Mic™',
    brand: 'BioBizz',
    main_category: 'STİMÜLATÖR',
    category_key: 'stimulator',
    function_detailed: 'Canlılık Stimülasyonu ve Önleme (Stimulating, Preventing)',
    application_type: 'Sıvı',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Tüm dönem boyunca)'],
    application_methods: ['Düzenli Sulama', 'Sulama Sistemleri', 'Yaprak Spreyi (Foliar)'],
    key_properties: 'Soğuk presleme yoluyla elde edilen yüksek kaliteli organik deniz yosunu konsantresinden yapılmıştır. Bitkilerin stresten kurtulmasına yardımcı olur.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 420,
    icon: '🌊'
  },
  {
    id: 'biobizz-microbes',
    product_name: 'Biobizz Microbes',
    brand: 'BioBizz',
    main_category: 'AKTİF MİKROORGANİZMALAR',
    category_key: 'microorganisms',
    function_detailed: 'NPK Akışını Artırma ve Protein Katalizörü',
    application_type: 'Toz (Süper konsantre)',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Tüm gelişim aşamaları)'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: 'Bakteri, enzim ve faydalı mantarlar (Trichoderma) konsorsiyumudur. Kök yüzeyini artırarak NPK ve mikro besinlerin alımını ve verimi iyileştirir.',
    available_packaging: ['150g'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 680,
    icon: '🦠'
  },
  {
    id: 'biobizz-leafcoat',
    product_name: 'Leaf·Coat™',
    brand: 'BioBizz',
    main_category: 'KORUYUCU / GÜÇLENDİRİCİ',
    category_key: 'protector',
    function_detailed: 'Önleme (Preventing)',
    application_type: 'Sprey (Kullanıma Hazır Sıvı)',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME (Çiçeklenmenin bitimine iki hafta kalana kadar)'],
    application_methods: ['Sadece Sprey (Atomizer)'],
    key_properties: 'Doğal lateksten yapılmış, böceklere ve zararlı yaprak mantarlarına karşı geçirgen, kendi kendini parçalayabilen bir bariyer oluşturur.',
    available_packaging: ['500ml Sprey', '500ml', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 380,
    icon: '🛡️'
  },
  {
    id: 'biobizz-calmag',
    product_name: 'CALMAG',
    brand: 'BioBizz',
    main_category: 'EK TAKVİYE',
    category_key: 'supplement',
    function_detailed: 'Kalsiyum ve Magnezyum Desteği (Ca Mg Supplement)',
    application_type: 'Sıvı',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: 'Kalsiyum ve Magnezyum eksikliklerini önlemek veya düzeltmek için tasarlanmıştır. %100 organik ve sertifikalı bir çözümdür. Özellikle RO veya çok yumuşak su kullanılırken önerilir.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 350,
    icon: '💊'
  },
  {
    id: 'biobizz-biodown',
    product_name: 'Bio·Down',
    brand: 'BioBizz',
    main_category: 'pH DÜZENLEYİCİ',
    category_key: 'ph_regulator',
    function_detailed: 'pH Düşürme (pH-)',
    application_type: 'Sıvı',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: 'Doğal olarak turunçgillerde bulunan sitrik asitten yapılmış sulu çözeltidir. Toprak mikro yaşamına zarar vermeden pH\'ı hızlı bir şekilde ayarlar.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 280,
    icon: '⬇️'
  },
  {
    id: 'biobizz-bioup',
    product_name: 'Bio·Up',
    brand: 'BioBizz',
    main_category: 'pH DÜZENLEYİCİ',
    category_key: 'ph_regulator',
    function_detailed: 'pH Yükseltme (pH+)',
    application_type: 'Sıvı',
    application_phases: ['VEGETATIF (Büyüme)', 'ÇİÇEKLENME'],
    application_methods: ['Düzenli Sulama', 'Hidroponik', 'Sulama Sistemleri'],
    key_properties: 'Doğal kaynaklardan elde edilen hümik asit bazlı bir formülasyondur. Toprak mikro yaşamına zarar vermeden pH\'ı hızlı bir şekilde ayarlar.',
    available_packaging: ['250ML', '500ML', '1L', '5L', '10L', '20L'],
    compatible_media: ['soil', 'coco', 'hydro'],
    price: 280,
    icon: '⬆️'
  }
];

// Kategori bilgileri
export const PRODUCT_CATEGORIES = {
  substrate: { name: 'Substrat', icon: '🌱', order: 1 },
  substrate_booster: { name: 'Substrat Güçlendirici', icon: '💪', order: 2 },
  dry_fertilizer: { name: 'Kuru Gübre', icon: '🧪', order: 3 },
  base_nutrient: { name: 'Temel Besin', icon: '🧬', order: 4 },
  stimulator: { name: 'Stimülatör', icon: '⚡', order: 5 },
  booster: { name: 'Booster', icon: '🚀', order: 6 },
  activator: { name: 'Aktivatör', icon: '🔋', order: 7 },
  microorganisms: { name: 'Mikroorganizmalar', icon: '🦠', order: 8 },
  protector: { name: 'Koruyucu', icon: '🛡️', order: 9 },
  supplement: { name: 'Takviye', icon: '💊', order: 10 },
  ph_regulator: { name: 'pH Düzenleyici', icon: '⚖️', order: 11 }
};

// Yardımcı fonksiyonlar
export const getProductsByMedia = (mediaType) => {
  return BIOBIZZ_PRODUCTS.filter(product => 
    product.compatible_media.includes(mediaType)
  );
};

export const getProductsByCategory = (categoryKey) => {
  return BIOBIZZ_PRODUCTS.filter(product => 
    product.category_key === categoryKey
  );
};

export const groupProductsByCategory = (products) => {
  const grouped = {};
  
  products.forEach(product => {
    const category = product.category_key;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(product);
  });
  
  // Kategorileri sırala
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    return (PRODUCT_CATEGORIES[a]?.order || 99) - (PRODUCT_CATEGORIES[b]?.order || 99);
  });
  
  const sortedGrouped = {};
  sortedCategories.forEach(category => {
    sortedGrouped[category] = grouped[category];
  });
  
  return sortedGrouped;
};
