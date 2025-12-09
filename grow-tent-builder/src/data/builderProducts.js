/**
 * Builder Products Data
 * Contains all product categories for the tent builder
 */

// ============================================
// TENT PRODUCTS
// ============================================
export const TENT_PRODUCTS = [
  {
    id: 'secret-jardin-ds90',
    brand: 'Secret Jardin',
    series: 'Dark Street',
    name: 'DS90',
    fullName: 'Secret Jardin Dark Street 90x90x170cm',
    price: 8500,
    tier: 'standard',
    dimensions: { width: 90, depth: 90, height: 170 },
    dimensionsFt: { width: 3, depth: 3, height: 5.6 },
    volume: 1.377,
    weight: 15,
    ventPorts: 4,
    frameMaterial: '16mm steel tubes',
    fabricMaterial: '210D Mylar',
    hangingCapacity: '30kg',
    recommendedLighting: '200-400W LED',
    recommendedExtraction: '200-400 CFM',
    features: [
      'Kaliteli çelik çerçeve',
      '210D yansıtıcı iç kaplama',
      'Çoklu havalandırma portları',
      'Su geçirmez taban'
    ],
    image: '/images/tents/secret-jardin-ds90.jpg'
  },
  {
    id: 'secret-jardin-ds120',
    brand: 'Secret Jardin',
    series: 'Dark Street',
    name: 'DS120',
    fullName: 'Secret Jardin Dark Street 120x120x200cm',
    price: 11500,
    tier: 'standard',
    dimensions: { width: 120, depth: 120, height: 200 },
    dimensionsFt: { width: 4, depth: 4, height: 6.6 },
    volume: 2.88,
    weight: 20,
    ventPorts: 6,
    frameMaterial: '19mm steel tubes',
    fabricMaterial: '210D Mylar',
    hangingCapacity: '50kg',
    recommendedLighting: '400-600W LED',
    recommendedExtraction: '400-600 CFM',
    features: [
      'Güçlendirilmiş çelik çerçeve',
      '210D yansıtıcı iç kaplama',
      'Geniş havalandırma seçenekleri',
      'Dayanıklı su geçirmez taban'
    ],
    image: '/images/tents/secret-jardin-ds120.jpg'
  }
];

// ============================================
// LED PRODUCTS
// ============================================
export const LED_PRODUCTS = [
  {
    id: 'mars-hydro-ts1000',
    brand: 'Mars Hydro',
    series: 'TS Series',
    name: 'TS 1000',
    fullName: 'Mars Hydro TS 1000 LED Grow Light',
    price: 6500,
    tier: 'entry',
    watts: 150,
    actualWatts: 140,
    ppfd: 525,
    coverage: { veg: '3x3', flower: '2x2' },
    spectrum: 'Full Spectrum 3000K-6500K',
    efficiency: '2.3 μmol/J',
    dimmable: true,
    lifespan: '50000 hours',
    warranty: '3 years',
    features: [
      'Sunlike tam spektrum',
      'Samsung LM301B LED çipleri',
      'Pasif soğutma',
      'Dimmer kontrol'
    ],
    image: '/images/lights/mars-hydro-ts1000.jpg'
  },
  {
    id: 'mars-hydro-ts3000',
    brand: 'Mars Hydro',
    series: 'TS Series',
    name: 'TS 3000',
    fullName: 'Mars Hydro TS 3000 LED Grow Light',
    price: 16500,
    tier: 'premium',
    watts: 450,
    actualWatts: 425,
    ppfd: 963,
    coverage: { veg: '5x5', flower: '4x4' },
    spectrum: 'Full Spectrum 3000K-6500K',
    efficiency: '2.5 μmol/J',
    dimmable: true,
    lifespan: '50000 hours',
    warranty: '5 years',
    features: [
      'Güçlü tam spektrum',
      'Samsung LM301B LED çipleri',
      'Gelişmiş soğutma',
      'Dimmer kontrol',
      'Daisy chain özelliği'
    ],
    image: '/images/lights/mars-hydro-ts3000.jpg'
  }
];

// ============================================
// FAN PRODUCTS
// ============================================
export const FAN_PRODUCTS = [
  {
    id: 'ac-infinity-cloudline-t4',
    brand: 'AC Infinity',
    series: 'Cloudline',
    name: 'T4',
    fullName: 'AC Infinity Cloudline T4 4" Inline Fan',
    price: 4500,
    tier: 'standard',
    type: 'inline',
    diameter: '4"',
    specs: {
      cfm: 205,
      wattage: 32,
      diameter: '4"',
      noiseLevel: '32 dB',
      speedControl: true
    },
    features: [
      'PWM motor kontrolü',
      'Düşük gürültü',
      'Yüksek CFM',
      '10 hız seviyesi'
    ],
    image: '/images/fans/ac-infinity-t4.jpg'
  },
  {
    id: 'ac-infinity-cloudline-t6',
    brand: 'AC Infinity',
    series: 'Cloudline',
    name: 'T6',
    fullName: 'AC Infinity Cloudline T6 6" Inline Fan',
    price: 6500,
    tier: 'premium',
    type: 'inline',
    diameter: '6"',
    specs: {
      cfm: 350,
      wattage: 50,
      diameter: '6"',
      noiseLevel: '38 dB',
      speedControl: true
    },
    features: [
      'PWM motor kontrolü',
      'Düşük gürültü',
      'Yüksek CFM',
      '10 hız seviyesi',
      'Uzaktan kumanda hazır'
    ],
    image: '/images/fans/ac-infinity-t6.jpg'
  }
];

// ============================================
// CARBON FILTER PRODUCTS
// ============================================
export const CARBON_FILTER_PRODUCTS = [
  {
    id: 'ac-infinity-filter-4',
    brand: 'AC Infinity',
    series: 'Standard',
    name: '4" Filter',
    fullName: 'AC Infinity 4" Carbon Filter',
    price: 2500,
    tier: 'standard',
    type: 'filter',
    diameter: '4"',
    specs: {
      cfm: 200,
      diameter: '4"',
      carbonType: 'Australian Activated Carbon',
      lifespan: '18-24 months'
    },
    features: [
      'Avustralya aktif karbonu',
      '1.8 inch karbon kalınlığı',
      'Değiştirilebilir karbon',
      'Pre-filtre dahil'
    ],
    image: '/images/filters/ac-infinity-4.jpg'
  },
  {
    id: 'ac-infinity-filter-6',
    brand: 'AC Infinity',
    series: 'Standard',
    name: '6" Filter',
    fullName: 'AC Infinity 6" Carbon Filter',
    price: 3500,
    tier: 'premium',
    type: 'filter',
    diameter: '6"',
    specs: {
      cfm: 400,
      diameter: '6"',
      carbonType: 'Australian Activated Carbon',
      lifespan: '18-24 months'
    },
    features: [
      'Avustralya aktif karbonu',
      '1.8 inch karbon kalınlığı',
      'Değiştirilebilir karbon',
      'Pre-filtre dahil',
      'Gelişmiş koku kontrolü'
    ],
    image: '/images/filters/ac-infinity-6.jpg'
  }
];

// ============================================
// VENTILATION SETS
// ============================================
export const VENTILATION_SETS = [
  {
    id: 'ac-infinity-ventilation-set-4',
    brand: 'AC Infinity',
    name: '4" Ventilation Set',
    fullName: 'AC Infinity 4" Complete Ventilation Set',
    price: 7500,
    tier: 'standard',
    diameter: '4"',
    capacity: 205,
    includes: ['T4 Inline Fan', '4" Carbon Filter', '15ft Ducting', 'Clamps'],
    features: [
      'Komple havalandırma çözümü',
      'Uyumlu bileşenler',
      'Kolay kurulum',
      'Tüm bağlantı parçaları dahil'
    ],
    image: '/images/sets/ac-infinity-set-4.jpg'
  }
];

// ============================================
// DUCTING PRODUCTS
// ============================================
export const DUCTING_PRODUCTS = [
  {
    id: 'ducting-4-15ft',
    brand: 'Generic',
    name: '4" Ducting 15ft',
    fullName: '4" Aluminum Ducting 15ft',
    price: 350,
    tier: 'standard',
    type: 'ducting',
    diameter: '4"',
    length: '15ft',
    material: 'Aluminum',
    features: [
      'Esnek alüminyum',
      'Işık geçirmez',
      'Kolay kesilebilir',
      'Isıya dayanıklı'
    ]
  },
  {
    id: 'ducting-6-25ft',
    brand: 'Generic',
    name: '6" Ducting 25ft',
    fullName: '6" Aluminum Ducting 25ft',
    price: 550,
    tier: 'standard',
    type: 'ducting',
    diameter: '6"',
    length: '25ft',
    material: 'Aluminum',
    features: [
      'Esnek alüminyum',
      'Işık geçirmez',
      'Kolay kesilebilir',
      'Isıya dayanıklı'
    ]
  }
];

// ============================================
// SUBSTRATE PRODUCTS
// ============================================
export const SUBSTRATE_PRODUCTS = [
  {
    id: 'biobizz-allmix-50l',
    brand: 'BioBizz',
    name: 'All-Mix 50L',
    fullName: 'BioBizz All-Mix 50L',
    price: 650,
    tier: 'premium',
    type: 'soil',
    volume: '50L',
    ingredients: ['Peat moss', 'Perlite', 'Worm castings', 'Pre-fertilized'],
    ph: '6.2-6.5',
    ec: '2.0-2.4',
    features: [
      'Organik toprak karışımı',
      'Önceden gübrelenmiş',
      'Zengin mikrobiyoloji',
      '4 hafta besin rezervi'
    ]
  },
  {
    id: 'biobizz-lightmix-50l',
    brand: 'BioBizz',
    name: 'Light-Mix 50L',
    fullName: 'BioBizz Light-Mix 50L',
    price: 550,
    tier: 'standard',
    type: 'soil',
    volume: '50L',
    ingredients: ['Peat moss', 'Perlite', 'Light fertilization'],
    ph: '6.0-6.2',
    ec: '1.0-1.5',
    features: [
      'Hafif toprak karışımı',
      'Kolay kontrol edilebilir beslenme',
      'Fide ve genç bitkiler için ideal',
      'Hızlı büyüme'
    ]
  }
];

// ============================================
// POT PRODUCTS
// ============================================
export const POT_PRODUCTS = [
  {
    id: 'fabric-pot-11l',
    brand: 'Generic',
    name: '11L Fabric Pot',
    fullName: '11L Fabric Pot (3 gallon)',
    price: 85,
    tier: 'standard',
    type: 'pot',
    capacity: '11L',
    material: 'Fabric',
    dimensions: { diameter: 25, height: 30 },
    features: [
      'Hava budama',
      'Mükemmel drenaj',
      'Kök sağlığı',
      'Yeniden kullanılabilir'
    ]
  },
  {
    id: 'fabric-pot-19l',
    brand: 'Generic',
    name: '19L Fabric Pot',
    fullName: '19L Fabric Pot (5 gallon)',
    price: 95,
    tier: 'standard',
    type: 'pot',
    capacity: '19L',
    material: 'Fabric',
    dimensions: { diameter: 30, height: 35 },
    features: [
      'Hava budama',
      'Mükemmel drenaj',
      'Kök sağlığı',
      'Yeniden kullanılabilir'
    ]
  }
];

// ============================================
// TIMER PRODUCTS
// ============================================
export const TIMER_PRODUCTS = [
  {
    id: 'sonoff-s26',
    brand: 'Sonoff',
    name: 'S26',
    fullName: 'Sonoff S26 Smart Plug',
    price: 350,
    tier: 'standard',
    type: 'timer',
    outlets: 1,
    maxLoad: '16A',
    features: [
      'WiFi kontrol',
      'Uygulama kontrolü',
      'Zamanlama özellikleri',
      'Ses kontrolü (Alexa, Google)',
      'Enerji monitörü'
    ]
  },
  {
    id: 'tp-link-kasa',
    brand: 'TP-Link',
    name: 'Kasa Smart',
    fullName: 'TP-Link Kasa Smart Plug',
    price: 450,
    tier: 'premium',
    type: 'timer',
    outlets: 1,
    maxLoad: '16A',
    features: [
      'WiFi kontrol',
      'Kasa uygulaması',
      'Gelişmiş zamanlama',
      'Ses kontrolü (Alexa, Google)',
      'Enerji izleme',
      'Away mode'
    ]
  }
];

// ============================================
// MONITORING PRODUCTS
// ============================================
export const MONITORING_PRODUCTS = [
  {
    id: 'xiaomi-temp-humidity',
    brand: 'Xiaomi',
    name: 'Temp & Humidity',
    fullName: 'Xiaomi Temperature & Humidity Monitor 2',
    price: 250,
    tier: 'entry',
    type: 'monitoring',
    measures: ['Temperature', 'Humidity'],
    connectivity: 'Bluetooth',
    accuracy: { temperature: '±0.3°C', humidity: '±3%' },
    features: [
      'E-ink ekran',
      'Bluetooth bağlantı',
      'Xiaomi Home uygulaması',
      '1 yıl pil ömrü',
      'Veri geçmişi'
    ]
  },
  {
    id: 'inkbird-wifi-monitor',
    brand: 'Inkbird',
    name: 'WiFi Monitor',
    fullName: 'Inkbird WiFi Temperature & Humidity Monitor',
    price: 850,
    tier: 'premium',
    type: 'monitoring',
    measures: ['Temperature', 'Humidity', 'VPD'],
    connectivity: 'WiFi',
    accuracy: { temperature: '±0.5°C', humidity: '±3%' },
    features: [
      'WiFi bağlantı',
      'Mobil uygulama',
      'Alarm bildirimleri',
      'Veri kaydı',
      'VPD hesaplama',
      'Grafik görüntüleme'
    ]
  }
];

// ============================================
// HANGER PRODUCTS
// ============================================
export const HANGER_PRODUCTS = [
  {
    id: 'rope-hanger-pair',
    brand: 'Generic',
    name: 'Rope Hangers',
    fullName: 'Adjustable Rope Hangers (Pair)',
    price: 150,
    tier: 'standard',
    type: 'hanger',
    capacity: '30kg pair',
    adjustable: true,
    length: '1.5m',
    features: [
      'Ayarlanabilir yükseklik',
      'Kolay kullanım',
      'Güvenli kilit mekanizması',
      'Metal kancalar'
    ]
  }
];

// ============================================
// CO2 / ODOR PRODUCTS
// ============================================
export const CO2_ODOR_PRODUCTS = [
  {
    id: 'ona-gel-1l',
    brand: 'ONA',
    name: 'ONA Gel 1L',
    fullName: 'ONA Gel Odor Neutralizer 1L',
    price: 450,
    tier: 'standard',
    type: 'odor',
    coverage: '100-150 sq ft',
    features: [
      'Doğal koku nötralizörü',
      '4-6 hafta dayanıklılık',
      'Çeşitli kokular',
      'Güvenli kullanım'
    ]
  }
];

// ============================================
// NUTRIENT PRODUCTS (from builder context)
// ============================================
export const NUTRIENT_PRODUCTS = [
  {
    id: 'biobizz-biogrow-1l',
    brand: 'BioBizz',
    name: 'Bio-Grow 1L',
    fullName: 'BioBizz Bio-Grow 1L',
    price: 320,
    tier: 'standard',
    type: 'nutrient',
    category: 'base',
    phase: 'veg',
    packaging: '1L',
    application: 'Liquid fertilizer',
    features: [
      'Organik büyüme gübresi',
      'Vegetatif faz',
      'Tüm substratlar',
      'Kolay uygulanabilir'
    ]
  },
  {
    id: 'biobizz-biobloom-1l',
    brand: 'BioBizz',
    name: 'Bio-Bloom 1L',
    fullName: 'BioBizz Bio-Bloom 1L',
    price: 340,
    tier: 'standard',
    type: 'nutrient',
    category: 'base',
    phase: 'flower',
    packaging: '1L',
    application: 'Liquid fertilizer',
    features: [
      'Organik çiçeklenme gübresi',
      'Çiçeklenme fazı',
      'Tüm substratlar',
      'Zengin içerik'
    ]
  }
];
