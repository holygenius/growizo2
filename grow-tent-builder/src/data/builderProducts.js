/**
 * Builder Products Data
 * Real product data for the grow tent builder system
 * Based on actual products from readytousesets.md
 */

// ============================================
// TENTS / GROW CABINETS
// ============================================
export const TENT_PRODUCTS = [
    // Secret Jardin Hydro Shoot Series
    {
        id: 'sj-hs40',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS40',
        fullName: 'Secret Jardin HS40 Bitki Yetiştirme Kabini',
        dimensions: { width: 40, depth: 40, height: 120, unit: 'cm' },
        dimensionsFt: { width: 1.31, depth: 1.31, height: 3.94, unit: 'ft' },
        volume: 0.2, // m³
        weight: 2.9, // kg
        price: 3168,
        ventPorts: [{ diameter: 150, count: 1 }],
        windows: [{ size: '30x20cm', type: 'mesh', removableCover: true }],
        waterTray: 'WT40',
        frameMaterial: 'Q195 Çelik ø16mm',
        fabricMaterial: '210D Mylar',
        recommendedExtraction: {
            cfl: 25, // m³/h
            led: 10  // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir su tepsisi',
            'Q195 çelik ø16mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi'
        ],
        image: '/images/products/tents/sj-hs40.jpg',
        tier: 'entry'
    },
    {
        id: 'sj-hs60',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS60',
        fullName: 'Secret Jardin HS60 Bitki Yetiştirme Kabini',
        dimensions: { width: 60, depth: 60, height: 160, unit: 'cm' },
        dimensionsFt: { width: 1.97, depth: 1.97, height: 5.25, unit: 'ft' },
        volume: 0.6, // m³
        weight: 4.5, // kg
        price: 4235,
        ventPorts: [
            { diameter: 150, count: 2, type: 'havalandırma' },
            { diameter: 75, count: 1, type: 'kablo' }
        ],
        windows: [{ size: '30x20cm', type: 'mesh', removableCover: true }],
        waterTray: 'WT60',
        hangingCapacity: { perPoint: 5, points: 2, includes: 'Işıklandırma ve filtre' },
        frameMaterial: 'Q195 Çelik ø16mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hps: 250, // W
            led: 200  // W
        },
        recommendedExtraction: {
            hps: { min: 100, max: 190 } // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir su tepsisi',
            'Q195 çelik ø16mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '2x Askı noktası (her biri 5kg)'
        ],
        image: '/images/products/tents/sj-hs60.jpg',
        tier: 'entry'
    },
    {
        id: 'sj-hs100',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS100',
        fullName: 'Secret Jardin HS100 Bitki Yetiştirme Kabini',
        dimensions: { width: 100, depth: 100, height: 200, unit: 'cm' },
        dimensionsFt: { width: 3.28, depth: 3.28, height: 6.56, unit: 'ft' },
        volume: 2.0, // m³
        weight: 7.2, // kg
        price: 7092,
        ventPorts: [
            { diameter: 180, count: 2, type: 'havalandırma' },
            { diameter: 75, count: 1, type: 'kablo' }
        ],
        windows: [{ size: '30x20cm', type: 'mesh', removableCover: true }],
        waterTray: 'WT100',
        hangingCapacity: { perPoint: 5, points: 2, includes: 'Işıklandırma ve filtre' },
        frameMaterial: 'Q195 Çelik ø16mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hps: 400, // W
            led: 300  // W
        },
        recommendedExtraction: {
            hps: 240, // m³/h
            led: 120  // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir su tepsisi',
            'Q195 çelik ø16mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '2x Askı noktası (her biri 5kg)'
        ],
        image: '/images/products/tents/sj-hs100.jpg',
        tier: 'standard'
    },
    {
        id: 'sj-hs120',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS120',
        fullName: 'Secret Jardin HS120 Bitki Yetiştirme Kabini',
        dimensions: { width: 120, depth: 120, height: 200, unit: 'cm' },
        dimensionsFt: { width: 3.94, depth: 3.94, height: 6.56, unit: 'ft' },
        volume: 2.9, // m³
        weight: 8.5, // kg
        price: 7346,
        ventPorts: [
            { diameter: 230, count: 2, type: 'havalandırma' },
            { diameter: 75, count: 1, type: 'kablo' }
        ],
        windows: [{ size: '30x20cm', type: 'mesh', removableCover: true }],
        waterTray: 'WT120',
        hangingCapacity: { perPoint: 15, points: 2, includes: 'Işıklandırma ve filtre' },
        frameMaterial: 'Q195 Çelik ø16mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hps: 600, // W
            led: 600  // 2x 300W
        },
        recommendedExtraction: {
            hps: 345, // m³/h
            led: 175  // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir su tepsisi',
            'Q195 çelik ø16mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '2x Askı noktası (her biri 15kg)'
        ],
        image: '/images/products/tents/sj-hs120.jpg',
        tier: 'standard'
    },
    {
        id: 'sj-hs150',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS150',
        fullName: 'Secret Jardin HS150 Bitki Yetiştirme Kabini',
        dimensions: { width: 150, depth: 150, height: 200, unit: 'cm' },
        dimensionsFt: { width: 4.92, depth: 4.92, height: 6.56, unit: 'ft' },
        volume: 4.5, // m³
        weight: 11.1, // kg
        price: 9071,
        ventPorts: [
            { diameter: 230, count: 2, type: 'havalandırma' },
            { diameter: 75, count: 1, type: 'kablo' }
        ],
        waterTray: 'WT150',
        hangingCapacity: { perPoint: 10, points: 2, includes: 'Işıklandırma ve filtre' },
        frameMaterial: 'Q195 Çelik ø19mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hps: 1000, // W
            led: 800   // 2x 400W
        },
        recommendedExtraction: {
            hps: { extraction: 540, intake: 270 }, // m³/h
            led: 270  // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir su tepsisi',
            'Q195 çelik ø19mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '2x Askı noktası (her biri 10kg)'
        ],
        image: '/images/products/tents/sj-hs150.jpg',
        tier: 'pro'
    },
    {
        id: 'sj-hs120x240',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS240W',
        fullName: 'Secret Jardin HS240W Bitki Yetiştirme Kabini',
        dimensions: { width: 240, depth: 120, height: 200, unit: 'cm' },
        dimensionsFt: { width: 7.87, depth: 3.94, height: 6.56, unit: 'ft' },
        volume: 5.8, // m³
        weight: 14.1, // kg
        price: 12635,
        ventPorts: [
            { diameter: 280, count: 2, type: 'havalandırma' },
            { diameter: 75, count: 1, type: 'kablo' }
        ],
        waterTray: 'WT240W',
        hangingCapacity: { perPoint: 5, points: 3, includes: 'Işıklandırma ve filtre' },
        frameMaterial: 'Q195 Çelik ø16mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hps: 1200, // 2x 600W
            led: 1200  // 4x 300W
        },
        recommendedExtraction: {
            hps: { extraction: 690, intake: 345 }, // m³/h
            led: 345  // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir su tepsisi',
            'Q195 çelik ø16mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '3x Askı noktası (her biri 5kg)',
            'Büyüme ve çiçeklenme için uygun'
        ],
        image: '/images/products/tents/sj-hs120x240.jpg',
        tier: 'pro'
    },
    {
        id: 'sj-hs240',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS240',
        fullName: 'Secret Jardin HS240 Bitki Yetiştirme Kabini',
        dimensions: { width: 240, depth: 240, height: 200, unit: 'cm' },
        dimensionsFt: { width: 7.87, depth: 7.87, height: 6.56, unit: 'ft' },
        volume: 11.5, // m³
        weight: 21, // kg
        price: 16338,
        ventPorts: [
            { diameter: 380, count: 2, type: 'havalandırma' },
            { diameter: 75, count: 1, type: 'kablo' }
        ],
        waterTray: '2x WT240W',
        hangingCapacity: { perPoint: 5, points: 5, includes: 'Işıklandırma ve filtre' },
        frameMaterial: 'Q195 Çelik ø16mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hps: 2400, // 4x 600W
            led: 2400  // 6x 400W
        },
        recommendedExtraction: {
            hps: { extraction: 1380, intake: 690 }, // m³/h
            led: { extraction: 690, intake: 380 }   // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir 2x su tepsisi',
            'Q195 çelik ø16mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '5x Askı noktası (her biri 5kg)'
        ],
        image: '/images/products/tents/sj-hs240.jpg',
        tier: 'pro'
    },
    {
        id: 'sj-hs300w',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS300W',
        fullName: 'Secret Jardin HS300W Bitki Yetiştirme Kabini',
        dimensions: { width: 300, depth: 150, height: 200, unit: 'cm' },
        dimensionsFt: { width: 9.84, depth: 4.92, height: 6.56, unit: 'ft' },
        volume: 9.0, // m³
        weight: 18.4, // kg
        price: 15544,
        ventPorts: [
            { diameter: 380, count: 2, type: 'havalandırma' },
            { diameter: 75, count: 1, type: 'kablo' }
        ],
        waterTray: 'WT300',
        hangingCapacity: { perPoint: 10, points: 3, includes: 'Işıklandırma ve filtre' },
        frameMaterial: 'Q195 Çelik ø19mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hps: 2000, // 2x 1000W
            led: 1800  // 4x 450W
        },
        recommendedExtraction: {
            hps: { extraction: 1080, intake: 540 }, // m³/h
            led: { extraction: 540, intake: 270 }   // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir su tepsisi',
            'Q195 çelik ø19mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '3x Askı noktası (her biri 10kg)'
        ],
        image: '/images/products/tents/sj-hs300w.jpg',
        tier: 'pro'
    },
    {
        id: 'sj-hs300',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS300',
        fullName: 'Secret Jardin HS300 Bitki Yetiştirme Kabini',
        dimensions: { width: 300, depth: 300, height: 200, unit: 'cm' },
        dimensionsFt: { width: 9.84, depth: 9.84, height: 6.56, unit: 'ft' },
        volume: 18.0, // m³
        weight: 28.8, // kg
        price: 20749,
        ventPorts: [
            { diameter: 380, count: 2, type: 'havalandırma' },
            { diameter: 75, count: 1, type: 'kablo' }
        ],
        waterTray: '2x WT300W',
        hangingCapacity: { perPoint: 10, points: 5, includes: 'Işıklandırma ve filtre bar' },
        frameMaterial: 'Q195 Çelik ø19mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hps: 4000, // 4x 1000W
            led: 2400  // 4x 600W
        },
        recommendedExtraction: {
            hps: { extraction: 2160, intake: 1180 }, // m³/h
            led: { extraction: 1180, intake: 540 }   // m³/h
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir 2x su tepsisi',
            'Q195 çelik ø19mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '5x Askı noktası (her biri 10kg)'
        ],
        image: '/images/products/tents/sj-hs300.jpg',
        tier: 'commercial'
    },
    {
        id: 'sj-hs480w',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS480W',
        fullName: 'Secret Jardin HS480W Bitki Yetiştirme Kabini',
        dimensions: { width: 480, depth: 240, height: 200, unit: 'cm' },
        dimensionsFt: { width: 15.75, depth: 7.87, height: 6.56, unit: 'ft' },
        volume: 22.4, // m³
        weight: 24.5, // kg
        price: 34813,
        revision: 'R2.00',
        ventPorts: [
            { diameter: 380, count: 4, type: 'havalandırma' },
            { diameter: 75, count: 4, type: 'kablo', model: 'CF7D' }
        ],
        waterTray: '4x WT240W',
        hangingCapacity: { perPoint: 5, points: 10, length: 120, includes: 'Aydınlatma tutucu askı demiri ve filtre askısı' },
        frameMaterial: 'Q195 Çelik ø19mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hpsIntense: 4800, // 8x 600W yoğun
            hps: 3200,        // 8x 400W normal
            led: 3200
        },
        recommendedExtraction: {
            hps: { extraction: 2750, intake: 1350 }, // m³/h - her 30-60 saniyede
            led: { extraction: 1650, intake: 800 }   // m³/h - her 1-2 dakikada
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir 4x su tepsisi',
            'Q195 çelik ø19mm iskelet',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '10x Askı noktası (her biri 5kg, 120cm uzunluk)'
        ],
        image: '/images/products/tents/sj-hs480w.jpg',
        tier: 'commercial'
    },
    {
        id: 'sj-hs600w',
        brand: 'Secret Jardin',
        series: 'Hydro Shoot',
        name: 'HS600W',
        fullName: 'Secret Jardin HS600W Bitki Yetiştirme Kabini',
        dimensions: { width: 600, depth: 300, height: 200, unit: 'cm' },
        dimensionsFt: { width: 19.69, depth: 9.84, height: 6.56, unit: 'ft' },
        volume: 35.0, // m³
        weight: 26.5, // kg
        price: 58409,
        revision: 'R2.00',
        ventPorts: [
            { diameter: 380, count: 4, type: 'havalandırma' },
            { diameter: 75, count: 4, type: 'kablo', model: 'CF7D' }
        ],
        waterTray: '4x WT300W',
        hangingCapacity: { perPoint: 5, points: 10, length: 150, includes: 'Aydınlatma tutucu demir ve filtre askısı' },
        frameMaterial: 'Q195 Çelik ø19mm',
        fabricMaterial: '210D Mylar',
        recommendedLighting: {
            hpsIntense: 8000, // 8x 1000W yoğun
            hps: 4800,        // 8x 600W normal
            led: 4800
        },
        recommendedExtraction: {
            hps: { extraction: 4205, intake: 2103 }, // m³/h - her 30-60 saniyede
            led: { extraction: 2105, intake: 1053 }  // m³/h - her 1-2 dakikada
        },
        features: [
            '210D Güçlü Mylar kumaş',
            'Su geçirmez çıkarılabilir 4x su tepsisi',
            'Q195 çelik ø19mm iskelet (güçlendirilmiş)',
            '8mm güçlü fermuarlı açma',
            '15 dakikada kurulum',
            'Işık geçirmez kapı sistemi',
            '10x Askı noktası (her biri 5kg, 150cm uzunluk)',
            'Profesyonel ticari kullanım için ideal'
        ],
        image: '/images/products/tents/sj-hs600w.jpg',
        tier: 'commercial'
    },
    // Pure Tent Series
    {
        id: 'pure-60',
        brand: 'Pure Tent',
        series: 'Basic',
        name: '60x60',
        fullName: 'Pure Tent 60x60x160 Bitki Yetiştirme Kabini',
        dimensions: { width: 60, depth: 60, height: 160, unit: 'cm' },
        dimensionsFt: { width: 1.97, depth: 1.97, height: 5.25, unit: 'ft' },
        price: 650,
        features: ['600D kumaş', 'Ekonomik seçenek', 'Kolay kurulum'],
        image: '/images/products/tents/pure-60.jpg',
        tier: 'budget'
    },
    // Generic Tents
    {
        id: 'generic-60x60x180',
        brand: 'Generic',
        series: 'Standard',
        name: '60x60x180',
        fullName: '60x60x180cm Bitki Yetiştirme Kabini',
        dimensions: { width: 60, depth: 60, height: 180, unit: 'cm' },
        dimensionsFt: { width: 1.97, depth: 1.97, height: 5.91, unit: 'ft' },
        price: 550,
        features: ['Temel özellikler', 'Ekonomik'],
        image: '/images/products/tents/generic-60.jpg',
        tier: 'budget'
    },
    {
        id: 'generic-80x80x180',
        brand: 'Generic',
        series: 'Standard',
        name: '80x80x180',
        fullName: '80x80x180cm Bitki Yetiştirme Kabini',
        dimensions: { width: 80, depth: 80, height: 180, unit: 'cm' },
        dimensionsFt: { width: 2.62, depth: 2.62, height: 5.91, unit: 'ft' },
        price: 750,
        features: ['Orta boy', 'Ekonomik'],
        image: '/images/products/tents/generic-80.jpg',
        tier: 'budget'
    },
    {
        id: 'generic-100x100x200',
        brand: 'Generic',
        series: 'Standard',
        name: '100x100x200',
        fullName: '100x100x200cm Bitki Yetiştirme Kabini',
        dimensions: { width: 100, depth: 100, height: 200, unit: 'cm' },
        dimensionsFt: { width: 3.28, depth: 3.28, height: 6.56, unit: 'ft' },
        price: 950,
        features: ['Standart boy', 'İyi değer'],
        image: '/images/products/tents/generic-100.jpg',
        tier: 'budget'
    }
];

// ============================================
// LED LIGHTING
// ============================================
export const LED_PRODUCTS = [
    {
        id: 'led-100w-board',
        brand: 'Generic',
        name: '100W LED Bitki Yetiştirme Lambası',
        type: 'LED',
        watts: 100,
        price: 450,
        coverage: 4, // sq ft
        coverageCm: { width: 60, depth: 60 },
        physicalWidth: 1, // ft
        physicalDepth: 1,
        maxPPFD: 800,
        beamAngle: 120,
        recommendedHeight: 12, // inches
        spectrum: 'Full-Spectrum',
        features: ['Samsung LM301B', 'Meanwell Driver'],
        tier: 'entry'
    },
    {
        id: 'led-120w-board',
        brand: 'Generic',
        name: '120W LED Bitki Yetiştirme Lambası',
        type: 'LED',
        watts: 120,
        price: 550,
        coverage: 4,
        coverageCm: { width: 60, depth: 60 },
        physicalWidth: 1.2,
        physicalDepth: 1,
        maxPPFD: 900,
        beamAngle: 120,
        recommendedHeight: 14,
        spectrum: 'Full-Spectrum',
        features: ['Samsung LM301H', 'Meanwell Driver'],
        tier: 'entry'
    },
    {
        id: 'rosette-200w',
        brand: 'Ro',
        name: '200W Full-Spectrum LED',
        type: 'LED',
        watts: 200,
        price: 1200,
        coverage: 6,
        coverageCm: { width: 75, depth: 75 },
        physicalWidth: 1.5,
        physicalDepth: 1.2,
        maxPPFD: 1200,
        beamAngle: 120,
        recommendedHeight: 16,
        spectrum: 'Full-Spectrum',
        features: ['Samsung LM301H', 'Osram 660nm', 'Dimmer'],
        tier: 'standard'
    },
    {
        id: 'rosette-mkii-200w',
        brand: 'Ro',
        name: '200W Full-Spectrum LED',
        type: 'LED',
        watts: 200,
        price: 1400,
        coverage: 6,
        coverageCm: { width: 75, depth: 75 },
        physicalWidth: 1.5,
        physicalDepth: 1.2,
        maxPPFD: 1300,
        beamAngle: 120,
        recommendedHeight: 16,
        spectrum: 'Full-Spectrum',
        features: ['Samsung LM301H EVO', 'Osram 660nm', 'Dimmer', 'Daisy Chain'],
        tier: 'standard'
    },
    {
        id: 'led-240w',
        brand: 'Generic',
        name: '240W Full-Spectrum LED Bitki Yetiştirme Lambası',
        type: 'LED',
        watts: 240,
        price: 850,
        coverage: 9,
        coverageCm: { width: 90, depth: 90 },
        physicalWidth: 2,
        physicalDepth: 1,
        maxPPFD: 1500,
        beamAngle: 120,
        recommendedHeight: 18,
        spectrum: 'Full-Spectrum',
        features: ['Samsung LM301B', 'Meanwell Driver'],
        tier: 'standard'
    },
    {
        id: 'rosa-400w',
        brand: 'Rosa',
        name: '400W Full-Spectrum LED',
        type: 'LED',
        watts: 400,
        price: 2200,
        coverage: 12,
        coverageCm: { width: 100, depth: 100 },
        physicalWidth: 2.5,
        physicalDepth: 2,
        maxPPFD: 2000,
        beamAngle: 120,
        recommendedHeight: 20,
        spectrum: 'Full-Spectrum',
        features: ['Samsung LM301H', 'Osram 660nm', 'UV-IR', 'Dimmer'],
        tier: 'pro'
    },
    {
        id: 'led-480w',
        brand: 'Generic',
        name: '480W Full-Spectrum LED Bitki Yetiştirme Lambası',
        type: 'LED',
        watts: 480,
        price: 1600,
        coverage: 16,
        coverageCm: { width: 120, depth: 120 },
        physicalWidth: 3,
        physicalDepth: 3,
        maxPPFD: 2200,
        beamAngle: 120,
        recommendedHeight: 24,
        spectrum: 'Full-Spectrum',
        features: ['Bar Style', 'Samsung LM301B', 'Meanwell Driver'],
        tier: 'standard'
    },
    {
        id: 'coral-600w',
        brand: 'CRA',
        name: '600W Full-Spectrum IP67 LED',
        type: 'LED',
        watts: 600,
        price: 3500,
        coverage: 20,
        coverageCm: { width: 135, depth: 135 },
        physicalWidth: 3.5,
        physicalDepth: 3,
        maxPPFD: 2400,
        beamAngle: 120,
        recommendedHeight: 28,
        spectrum: 'Full-Spectrum',
        features: ['IP67 Su Geçirmez', 'Samsung LM301H', 'Osram', 'Dimmer', 'Daisy Chain'],
        tier: 'pro'
    },
    {
        id: 'led-720w',
        brand: 'Generic',
        name: '720W Full-Spectrum LED Bitki Yetiştirme Lambası',
        type: 'LED',
        watts: 720,
        price: 2400,
        coverage: 25,
        coverageCm: { width: 150, depth: 150 },
        physicalWidth: 4,
        physicalDepth: 3.5,
        maxPPFD: 2600,
        beamAngle: 120,
        recommendedHeight: 30,
        spectrum: 'Full-Spectrum',
        features: ['8-Bar Design', 'Samsung LM301B'],
        tier: 'pro'
    },
    {
        id: 'led-960w',
        brand: 'Generic',
        name: '960W Full-Spectrum LED Bitki Yetiştirme Lambası',
        type: 'LED',
        watts: 960,
        price: 3200,
        coverage: 36,
        coverageCm: { width: 180, depth: 180 },
        physicalWidth: 4.5,
        physicalDepth: 4,
        maxPPFD: 2800,
        beamAngle: 120,
        recommendedHeight: 36,
        spectrum: 'Full-Spectrum',
        features: ['10-Bar Design', 'Samsung LM301H', 'Dimmer'],
        tier: 'pro'
    },
    // Harvest Master Series
    {
        id: 'hm-rio-1000',
        brand: 'Harvest Master',
        name: 'Rio 1000',
        fullName: 'Harvest Master Rio 1000 Full-Spectrum LED',
        type: 'LED',
        watts: 1000,
        price: 29850,
        coverage: 25, // 150x150cm vejetatif = ~25 sq ft
        coverageCm: { width: 150, depth: 150, flowering: { width: 120, depth: 120 } },
        physicalWidth: 3.48, // 106cm = 3.48 ft
        physicalDepth: 3.48,
        maxPPFD: 2400, // Merkez PPFD @45cm - PPF 2800'den hesaplanan
        ppf: 2800, // μmol/s
        beamAngle: 120,
        recommendedHeight: 18, // 45cm = ~18 inch (min asma yüksekliği)
        hangingHeightRange: { min: 45, max: 90, unit: 'cm' },
        spectrum: 'Full-Spectrum',
        spectrumDetails: ['3000K Beyaz', '5000K Beyaz', '660nm Kırmızı', 'UV', 'IR'],
        ledChips: 'Samsung 281',
        efficiency: 2.8, // μmol/J
        hpsEquivalent: 1500,
        driver: 'Endüstriyel sınıf bütünleşik sürücü',
        inputVoltage: 'AC 90-305V',
        frequency: '50/60 Hz',
        dimming: '0-10V',
        cooling: 'Pasif (Fansız)',
        ipRating: 'IP65',
        weight: { net: 10.32, gross: 11.82, unit: 'kg' },
        operatingTemp: { min: -20, max: 40, unit: '°C' },
        lifespan: 54000, // saat
        warranty: 3, // yıl
        noiseLevel: 0, // dB
        features: [
            '8-Bar Design',
            'Samsung 281 LED',
            '0-10V Dimmer',
            'IP65 Su/Toz Geçirmez',
            'Pasif Soğutma (Sessiz)',
            'UV + IR',
            '3 Yıl Garanti',
            '54.000 Saat Ömür'
        ],
        tier: 'pro'
    },
    {
        id: 'hm-rio-720',
        brand: 'Harvest Master',
        name: 'Rio 720',
        fullName: 'Harvest Master Rio 720 Full-Spectrum LED',
        type: 'LED',
        watts: 720,
        price: 23730,
        coverage: 16, // 122x122cm vejetatif = ~16 sq ft
        coverageCm: { width: 122, depth: 122, flowering: { width: 107, depth: 107 } },
        physicalWidth: 3.48, // 106cm = 3.48 ft
        physicalDepth: 3.48,
        maxPPFD: 1750, // Merkez PPFD @45cm - PPF 2016'dan hesaplanan
        ppf: 2016, // μmol/s
        beamAngle: 120,
        recommendedHeight: 18, // 45cm = ~18 inch (min asma yüksekliği)
        hangingHeightRange: { min: 45, max: 90, unit: 'cm' },
        spectrum: 'Full-Spectrum',
        spectrumDetails: ['3000K Beyaz', '5000K Beyaz', '660nm Kırmızı', 'UV', 'IR'],
        ledChips: 'Samsung 281',
        efficiency: 2.8, // μmol/J
        hpsEquivalent: 1200,
        driver: 'Bütünleşik, endüstriyel sınıf sürücü',
        inputVoltage: 'AC 90-305V',
        inputCurrent: '6.0A@120V / 3.0A@240V / 2.6A@277V',
        frequency: '50/60 Hz',
        dimming: '0-10V',
        cooling: 'Pasif (Fansız)',
        ipRating: 'IP65',
        weight: { net: 9.2, gross: 10.7, unit: 'kg' },
        operatingTemp: { min: -20, max: 40, unit: '°C' },
        lifespan: 54000, // saat
        warranty: 3, // yıl
        noiseLevel: 0, // dB
        features: [
            '6-Bar Design',
            'Samsung 281 LED',
            '0-10V Dimmer',
            'IP65 Su/Toz Geçirmez',
            'Pasif Soğutma (Sessiz)',
            'UV + IR',
            '3 Yıl Garanti',
            '54.000 Saat Ömür'
        ],
        tier: 'pro'
    },
    // Mars Hydro Series
    {
        id: 'mh-fc4800',
        brand: 'Mars Hydro',
        name: 'FC-4800',
        fullName: 'Mars Hydro FC-4800 Full-Spectrum LED',
        type: 'LED',
        watts: 480,
        price: 42692,
        coverage: 25, // 150x150cm vejetatif = ~25 sq ft
        coverageCm: { width: 150, depth: 150, flowering: { width: 120, depth: 120 } },
        physicalWidth: 2.76, // 84cm = 2.76 ft
        physicalDepth: 2.76,
        physicalHeight: 0.26, // 8cm
        maxPPFD: 1450, // Merkez PPFD @30cm - PPF/alan*faktör hesabı
        ppf: 1368, // μmol/s
        beamAngle: 120,
        recommendedHeight: 12, // 30cm = ~12 inch (min asma yüksekliği)
        hangingHeightRange: { min: 30, max: 40, unit: 'cm' },
        spectrum: 'Full-Spectrum',
        spectrumDetails: ['2800-3000K Sarı', '4800-5000K Beyaz', '650-665nm Kırmızı'],
        ledChips: 'Samsung LM301H EVO',
        efficiency: 2.85, // μmol/J
        hpsEquivalent: 750,
        driver: '0-10V Destekli Endüstriyel Sürücü',
        inputVoltage: 'AC 100-277V',
        frequency: '50/60 Hz',
        dimming: '10-100% Manuel',
        cooling: 'Pasif (Fansız)',
        ipRating: 'IP65',
        weight: { net: 7.3, unit: 'kg' },
        operatingTemp: { min: -20, max: 35, unit: '°C' },
        lifespan: 50000, // saat
        noiseLevel: 0, // dB
        features: [
            'Samsung LM301H EVO',
            'Manuel Dimmer (%10-100)',
            'IP65 Su/Toz Geçirmez',
            'Pasif Soğutma (Sessiz)',
            '2.85 μmol/J Verimlilik',
            '50.000 Saat Ömür'
        ],
        tier: 'pro'
    },
    {
        id: 'mh-fc6500',
        brand: 'Mars Hydro',
        name: 'FC-6500',
        fullName: 'Mars Hydro FC-6500 Full-Spectrum LED',
        type: 'LED',
        watts: 730,
        price: 58492,
        coverage: 36, // 180x180cm vejetatif = ~36 sq ft
        coverageCm: { width: 180, depth: 180, flowering: { width: 150, depth: 150 } },
        physicalWidth: 3.76, // 114.5cm = 3.76 ft
        physicalDepth: 3.67, // 112cm = 3.67 ft
        physicalHeight: 0.26, // 8cm
        maxPPFD: 1850, // Merkez PPFD @30cm - PPF/alan*faktör hesabı
        ppf: 1997, // μmol/s
        beamAngle: 120,
        recommendedHeight: 12, // 30cm = ~12 inch (min asma yüksekliği)
        hangingHeightRange: { min: 30, max: 45, unit: 'cm' },
        spectrum: 'Full-Spectrum',
        spectrumDetails: ['2800-3000K Sarı', '4800-5000K Beyaz', '650-665nm Kırmızı'],
        ledChips: 'Samsung LM301H EVO',
        efficiency: 2.8, // μmol/J
        hpsEquivalent: 1000,
        driver: '0-10V Destekli Endüstriyel Sürücü',
        inputVoltage: 'AC 100-277V',
        frequency: '50/60 Hz',
        dimming: '10-100% Manuel',
        cooling: 'Pasif (Fansız)',
        ipRating: 'IP65',
        weight: { net: 9.8, unit: 'kg' },
        operatingTemp: { min: -20, max: 35, unit: '°C' },
        lifespan: 50000, // saat
        noiseLevel: 0, // dB
        features: [
            'Samsung LM301H EVO',
            'Manuel Dimmer (%10-100)',
            'IP65 Su/Toz Geçirmez',
            'Pasif Soğutma (Sessiz)',
            '2.8 μmol/J Verimlilik',
            '50.000 Saat Ömür'
        ],
        tier: 'pro'
    },
    {
        id: 'mh-fc1000w',
        brand: 'Mars Hydro',
        name: 'FC-1000W',
        fullName: 'Mars Hydro FC-1000W Full-Spectrum LED',
        type: 'LED',
        watts: 1000,
        price: 84712,
        coverage: 25, // 150x150cm vejetatif = ~25 sq ft
        coverageCm: { width: 150, depth: 150, flowering: { width: 120, depth: 120 } },
        physicalWidth: 3.74, // 114cm = 3.74 ft
        physicalDepth: 3.67, // 112cm = 3.67 ft
        physicalHeight: 0.32, // 9.88cm
        maxPPFD: 2450, // Merkez PPFD @30cm - PPF/alan*faktör hesabı
        ppf: 2810, // μmol/s
        beamAngle: 120,
        recommendedHeight: 12, // 30cm = ~12 inch (min asma yüksekliği)
        hangingHeightRange: { min: 30, max: 45, unit: 'cm' },
        spectrum: 'Full-Spectrum',
        spectrumDetails: ['2800-3000K Sarı', '4800-5000K Beyaz', '660-665nm Kırmızı'],
        ledChips: 'Samsung LM301H EVO',
        efficiency: 2.8, // μmol/J
        hpsEquivalent: 1500,
        driver: '0-10V Destekli Endüstriyel Sürücü',
        inputVoltage: 'AC 100-277V',
        frequency: '50/60 Hz',
        dimming: '10-100% Manuel',
        cooling: 'Pasif (Fansız)',
        ipRating: 'IP65',
        weight: { net: 12.5, unit: 'kg' },
        operatingTemp: { min: -20, max: 35, unit: '°C' },
        lifespan: 50000, // saat
        noiseLevel: 0, // dB
        features: [
            'Samsung LM301H EVO',
            'Manuel Dimmer (%10-100)',
            'IP65 Su/Toz Geçirmez',
            'Pasif Soğutma (Sessiz)',
            '2.8 μmol/J Verimlilik',
            '50.000 Saat Ömür'
        ],
        tier: 'pro'
    }
];

// ============================================
// VENTILATION - FANS
// ============================================
export const FAN_PRODUCTS = [
    // Soler & Palau TD Silent Series
    {
        id: 'sp-td160',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'TD-160 Silent',
        fullName: 'Soler&Palau TD-160 Silent Sessiz Fan',
        type: 'Inline Fan',
        diameter: 100, // mm
        cfm: 180,
        m3h: 160,
        watts: 25,
        noise: 26, // dB
        price: 1200,
        features: ['Ultra sessiz', 'Çift hızlı', 'Termal koruma'],
        tier: 'standard'
    },
    {
        id: 'sp-td250',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'TD-250 Silent',
        fullName: 'Soler&Palau TD-250 Silent Sessiz Fan',
        type: 'Inline Fan',
        diameter: 100,
        cfm: 240,
        m3h: 240,
        watts: 30,
        noise: 28,
        price: 1500,
        features: ['Ultra sessiz', 'Çift hızlı', 'Termal koruma'],
        tier: 'standard'
    },
    {
        id: 'sp-td350',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'TD-350 Silent',
        fullName: 'Soler&Palau TD-350 Silent Sessiz Fan',
        type: 'Inline Fan',
        diameter: 125,
        cfm: 350,
        m3h: 350,
        watts: 40,
        noise: 30,
        price: 1800,
        features: ['Ultra sessiz', 'Çift hızlı', 'Termal koruma'],
        tier: 'pro'
    },
    {
        id: 'sp-td500',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'TD-500 Silent',
        fullName: 'Soler&Palau TD-500 Silent Sessiz Fan',
        type: 'Inline Fan',
        diameter: 150,
        cfm: 500,
        m3h: 500,
        watts: 55,
        noise: 32,
        price: 2200,
        features: ['Ultra sessiz', 'Çift hızlı', 'Termal koruma'],
        tier: 'pro'
    },
    // Mini Axial Fans
    {
        id: 'mini-axial-100',
        brand: 'Generic',
        name: 'Mini Aksiyel Fan 100mm',
        type: 'Axial Fan',
        diameter: 100,
        cfm: 100,
        m3h: 100,
        watts: 15,
        noise: 35,
        price: 250,
        features: ['Giriş fanı', 'Kompakt'],
        tier: 'entry'
    },
    {
        id: 'mini-axial-125',
        brand: 'Generic',
        name: 'Mini Aksiyel Fan 125mm',
        type: 'Axial Fan',
        diameter: 125,
        cfm: 160,
        m3h: 160,
        watts: 20,
        noise: 38,
        price: 300,
        features: ['Giriş fanı', 'Kompakt'],
        tier: 'entry'
    },
    {
        id: 'mini-axial-150',
        brand: 'Generic',
        name: 'Mini Aksiyel Fan 150mm',
        type: 'Axial Fan',
        diameter: 150,
        cfm: 300,
        m3h: 300,
        watts: 25,
        noise: 40,
        price: 350,
        features: ['Giriş fanı', 'Güçlü'],
        tier: 'standard'
    },
    // S&P Silent Series (New Additions)
    {
        id: 'sp-td160-mini',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'S&P TD-160 Silent Mini',
        fullName: 'S&P TD-160 Silent Mini - 100 mm/180 m3/s Sessiz Fan',
        type: 'Inline Fan',
        diameter: 100,
        cfm: 105, // ~180 m3/h
        m3h: 180,
        watts: 29,
        price: 3976.05,
        features: ['Ultra sessiz', '2 kademeli hız', 'Yüksek basınç', 'Sızdırmazlık'],
        tier: 'pro'
    },
    {
        id: 'sp-td250-silent',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'S&P TD-250 Silent',
        fullName: 'S&P TD-250 Silent - 100 mm/240 m3 Sessiz Fan',
        type: 'Inline Fan',
        diameter: 100,
        cfm: 141, // ~240 m3/h
        m3h: 240,
        price: 7566.78,
        features: ['Ultra sessiz', '2 kademeli hız', 'Yüksek basınç'],
        tier: 'pro'
    },
    {
        id: 'sp-td350-silent',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'S&P TD-350 Silent',
        fullName: 'S&P TD-350 Silent - 125 mm/380 m3 Sessiz Fan',
        type: 'Inline Fan',
        diameter: 125,
        cfm: 223, // ~380 m3/h
        m3h: 380,
        price: 8155.40,
        features: ['Ultra sessiz', '2 kademeli hız', 'Yüksek basınç'],
        tier: 'pro'
    },
    {
        id: 'sp-td500-silent',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'S&P TD-500 Silent',
        fullName: 'S&P TD-500 Silent - 150 mm/580 m3 Sessiz Fan',
        type: 'Inline Fan',
        diameter: 150,
        cfm: 341, // ~580 m3/h
        m3h: 580,
        price: 9911.42,
        features: ['Ultra sessiz', '2 kademeli hız', 'Yüksek basınç'],
        tier: 'pro'
    },
    {
        id: 'sp-td800-silent',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'S&P TD-800 Silent',
        fullName: 'S&P TD-800 Silent - 200 mm/880 m3 Sessiz Fan',
        type: 'Inline Fan',
        diameter: 200,
        cfm: 517, // ~880 m3/h
        m3h: 880,
        price: 10766.47,
        features: ['Ultra sessiz', '2 kademeli hız', 'Yüksek basınç'],
        tier: 'commercial'
    },
    {
        id: 'sp-td1000-silent',
        brand: 'Soler&Palau',
        series: 'TD Silent',
        name: 'S&P TD-1000 Silent',
        fullName: 'S&P TD-1000 Silent - 200 mm/1100 m3 Sessiz Fan',
        type: 'Inline Fan',
        diameter: 200,
        cfm: 647, // ~1100 m3/h
        m3h: 1100,
        price: 11417.86,
        features: ['Ultra sessiz', '2 kademeli hız', 'Yüksek basınç'],
        tier: 'commercial'
    }
];

// ============================================
// VENTILATION - CARBON FILTERS
// ============================================
export const CARBON_FILTER_PRODUCTS = [
    {
        id: 'cf-150',
        brand: 'Mantar',
        name: 'Mantar Karbon Filtre 150m³',
        type: 'Carbon Filter',
        diameter: 100,
        capacity: 150, // m³/h
        price: 450,
        lifespan: '12-18 ay',
        features: ['RC 48 aktif karbon', 'Ön filtreli'],
        tier: 'entry'
    },
    {
        id: 'cf-190',
        brand: 'Mantar',
        name: 'Mantar Karbon Filtre 190m³',
        type: 'Carbon Filter',
        diameter: 100,
        capacity: 190,
        price: 550,
        lifespan: '12-18 ay',
        features: ['RC 48 aktif karbon', 'Ön filtreli'],
        tier: 'entry'
    },
    {
        id: 'cf-330',
        brand: 'Mantar',
        name: 'Mantar Aktif Karbon Filtre 330m³',
        type: 'Carbon Filter',
        diameter: 100,
        capacity: 330,
        price: 750,
        lifespan: '18-24 ay',
        features: ['RC 48 aktif karbon', 'Ön filtreli', 'Çift katmanlı'],
        tier: 'standard'
    },
    {
        id: 'cf-467',
        brand: 'Mantar',
        name: 'Mantar Karbon Filtre 467m³',
        type: 'Carbon Filter',
        diameter: 125,
        capacity: 467,
        price: 950,
        lifespan: '18-24 ay',
        features: ['RC 48 aktif karbon', 'Ön filtreli', 'Pro serisi'],
        tier: 'standard'
    },
    {
        id: 'cf-665',
        brand: 'Mantar',
        name: 'Mantar Karbon Filtre 665m³',
        type: 'Carbon Filter',
        diameter: 150,
        capacity: 665,
        price: 1200,
        lifespan: '18-24 ay',
        features: ['RC 48 aktif karbon', 'Ön filtreli', 'Endüstriyel'],
        tier: 'pro'
    },
    {
        id: 'cf-895',
        brand: 'Mantar',
        name: 'Mantar Karbon Filtre 895m³',
        type: 'Carbon Filter',
        diameter: 200,
        capacity: 895,
        price: 1600,
        lifespan: '24+ ay',
        features: ['RC 48 aktif karbon', 'Ön filtreli', 'Max serisi'],
        tier: 'pro'
    },
    // CAN-Lite Series
    {
        id: 'can-lite-1000',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 1000 m3/s 200 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 200,
        capacity: 1000,
        maxCapacity: 1100,
        price: 8578.50,
        dimensions: { length: 500, diameter: 300, unit: 'mm' },
        weight: 11, // kg
        features: ['1100 m³/h Maksimum Akış', 'Çelik Gövde', 'Lite Karbon'],
        tier: 'pro'
    },
    {
        id: 'can-lite-3500',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 3500 m3/s 315 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 315,
        capacity: 3500,
        maxCapacity: 3850,
        price: 20338.02,
        dimensions: { length: 100, diameter: 45, unit: 'cm' },
        weight: 33.5, // kg
        carbonWeight: 16.3, // kg
        carbonBed: 5, // cm
        features: ['3850 m³/h Teknik Kapasite', 'Çelik Gövde', 'Lite Karbon', '5cm Karbon Yatağı'],
        tier: 'commercial'
    },
    {
        id: 'can-lite-4500',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 4500 m3/s 315 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 315,
        capacity: 4500,
        maxCapacity: 4950,
        price: 23986.73,
        dimensions: { length: 100, diameter: 50, unit: 'cm' },
        weight: 36.5, // kg
        carbonWeight: 18.5, // kg
        carbonBed: 5, // cm
        features: ['4950 m³/h Teknik Kapasite', 'Çelik Gövde', 'Lite Karbon', '5cm Karbon Yatağı'],
        tier: 'commercial'
    },
    {
        id: 'can-lite-2500-315',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 2500 m3/s 315 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 250, // Flange is 250mm per specs
        capacity: 2500,
        price: 15727.95,
        dimensions: { length: 100, diameter: 35, unit: 'cm' },
        weight: 23, // kg
        features: ['2500 m³/h İdeal Akış', 'Çelik Gövde', '35cm Filtre Çapı'],
        tier: 'pro'
    },
    {
        id: 'can-lite-3000-250',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 3000 m3/s 250 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 250,
        capacity: 3000,
        maxCapacity: 3300,
        price: 16828.21,
        dimensions: { length: 100, diameter: 40, unit: 'cm' },
        weight: 26, // kg
        carbonWeight: 14.3, // kg
        carbonBed: 5, // cm
        features: ['3300 m³/h Teknik Kapasite', 'Çelik Gövde', 'Lite Karbon', '5cm Karbon Yatağı'],
        tier: 'pro'
    },
    {
        id: 'can-lite-3000-315',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 3000 m3/s 315 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 315,
        capacity: 3000,
        maxCapacity: 3300,
        price: 16828.21,
        dimensions: { length: 100, diameter: 40, unit: 'cm' },
        weight: 26, // kg
        carbonWeight: 14.3, // kg
        carbonBed: 5, // cm
        features: ['3300 m³/h Teknik Kapasite', 'Çelik Gövde', 'Lite Karbon', '5cm Karbon Yatağı'],
        tier: 'pro'
    },
    {
        id: 'can-lite-2500-250',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 2500 m3/s 250 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 250,
        capacity: 2500,
        maxCapacity: 2750,
        price: 15728.74,
        dimensions: { length: 100, diameter: 35, unit: 'cm' },
        weight: 24, // kg
        carbonWeight: 12.2, // kg
        carbonBed: 5, // cm
        features: ['2750 m³/h Teknik Kapasite', 'Çelik Gövde', 'Lite Karbon', '5cm Karbon Yatağı'],
        tier: 'pro'
    },
    {
        id: 'can-lite-1500',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 1500 m3/s 250 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 250,
        capacity: 1500,
        maxCapacity: 1650,
        price: 10426.50,
        dimensions: { length: 750, diameter: 300, unit: 'mm' },
        weight: 15.5, // kg
        features: ['1650 m³/h Maksimum Akış', 'Çelik Gövde', 'Model 1500'],
        tier: 'standard'
    },
    {
        id: 'can-lite-800',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 800 m3/s 200 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 200,
        capacity: 800,
        maxCapacity: 880,
        price: 6562.50,
        dimensions: { length: 33, diameter: 30, unit: 'cm' },
        weight: 5, // kg
        carbonWeight: 3.4, // kg
        carbonBed: 5, // cm
        features: ['880 m³/h Teknik Kapasite', 'Çelik Gövde', 'Granül Hafif RC Avustralya Karbonu'],
        tier: 'standard'
    },
    {
        id: 'can-lite-425',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 425 m3/s 125 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 125, // Flange 130mm -> mapped to 125mm
        capacity: 425,
        maxCapacity: 467,
        price: 3756.90,
        dimensions: { length: 60, diameter: 14.5, unit: 'cm' },
        weight: 2.2, // kg
        features: ['467 m³/h Teknik Kapasite', '130mm Flanş (133mm kanal önerilir)', 'Hafif Tasarım'],
        tier: 'entry'
    },
    {
        id: 'can-lite-300',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 300 m3/s 100 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 100, // Flange 106mm -> mapped to 100mm
        capacity: 300,
        maxCapacity: 330,
        price: 2937.90,
        dimensions: { length: 45, diameter: 14.5, unit: 'cm' },
        weight: 1.8, // kg
        features: ['330 m³/h Teknik Kapasite', '106mm Flanş (112mm kanal önerilir)', 'Hafif Tasarım'],
        tier: 'entry'
    },
    {
        id: 'can-lite-600',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 600 m3/s 150 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 150,
        capacity: 600,
        price: 5407.50,
        dimensions: { length: 47.5, diameter: 20, unit: 'cm' },
        weight: 4, // kg
        carbonWeight: 2.2, // kg
        features: ['600 m³/h Maksimum Akış', 'Çelik Gövde', '20cm Filtre Çapı'],
        tier: 'standard'
    },
    {
        id: 'can-lite-150',
        brand: 'CAN-Lite',
        name: 'CAN-Lite 150 m3/s 100 mm Karbon Filtre',
        type: 'Carbon Filter',
        diameter: 100, // Flange 106mm -> mapped to 100mm
        capacity: 150,
        maxCapacity: 165,
        price: 2089.50,
        dimensions: { length: 25, diameter: 14.5, unit: 'cm' },
        weight: 1.45, // kg
        features: ['165 m³/h Teknik Kapasite', '106mm Flanş (112mm kanal önerilir)', 'Hafif Tasarım'],
        tier: 'entry'
    }
];

// ============================================
// VENTILATION - FAN + FILTER SETS
// ============================================
export const VENTILATION_SETS = [
    {
        id: 'set-190',
        name: 'TD-160 Silent + Karbon Filtre Seti 190m³',
        includes: ['sp-td160', 'cf-190'],
        diameter: 100,
        capacity: 190,
        price: 1650,
        tier: 'entry'
    },
    {
        id: 'set-330',
        name: 'TD-250 Silent + Karbon Filtre Seti 330m³',
        includes: ['sp-td250', 'cf-330'],
        diameter: 100,
        capacity: 330,
        price: 2150,
        tier: 'standard'
    },
    {
        id: 'set-467',
        name: 'TD-350 Silent + Karbon Filtre Seti 467m³',
        includes: ['sp-td350', 'cf-467'],
        diameter: 125,
        capacity: 467,
        price: 2650,
        tier: 'standard'
    },
    {
        id: 'set-665',
        name: 'TD-500 Silent + Karbon Filtre Seti 665m³',
        includes: ['sp-td500', 'cf-665'],
        diameter: 150,
        capacity: 665,
        price: 3300,
        tier: 'pro'
    },
    {
        id: 'set-895',
        name: 'TD-Silent + Karbon Filtre Seti 895m³',
        includes: ['sp-td500', 'cf-895'],
        diameter: 200,
        capacity: 895,
        price: 3700,
        tier: 'pro'
    }
];

// ============================================
// DUCTING & ACCESSORIES
// ============================================
export const DUCTING_PRODUCTS = [
    {
        id: 'duct-102-2.5m',
        name: 'Esnek Alüminyum Hava Kanalı 102mm 2.5m',
        diameter: 102,
        length: 2.5,
        price: 120,
        tier: 'standard'
    },
    {
        id: 'duct-127-2.5m',
        name: 'Esnek Alüminyum Hava Kanalı 127mm 2.5m',
        diameter: 127,
        length: 2.5,
        price: 140,
        tier: 'standard'
    },
    {
        id: 'duct-152-2.5m',
        name: 'Esnek Alüminyum Hava Kanalı 152mm 2.5m',
        diameter: 152,
        length: 2.5,
        price: 160,
        tier: 'standard'
    },
    {
        id: 'duct-1.5m',
        name: 'Alüminyum Hava Kanalı 1.5m',
        diameter: 100,
        length: 1.5,
        price: 80,
        tier: 'entry'
    },
    {
        id: 'clamp-set',
        name: 'Kelepçe Seti (2 adet)',
        price: 25,
        tier: 'entry'
    },
    {
        id: 'duct-tape',
        name: 'Alüminyum Havalandırma Bandı',
        price: 35,
        tier: 'entry'
    },
    {
        id: 'filter-hanger-80',
        name: 'Karbon Filtre Askısı 80cm',
        price: 75,
        tier: 'standard'
    }
];

// ============================================
// SUBSTRATES / GROWING MEDIA
// ============================================
export const SUBSTRATE_PRODUCTS = [
    // Light Mix - Soil
    {
        id: 'biobizz-lightmix-20l',
        brand: 'BioBizz',
        name: 'Light Mix 20L',
        type: 'soil',
        volume: 20,
        price: 180,
        features: ['Hafif gübrelenmiş', 'Yeni başlayanlar için ideal'],
        tier: 'entry'
    },
    {
        id: 'plagron-lightmix-25l',
        brand: 'Plagron',
        name: 'Light Mix 25L',
        type: 'soil',
        volume: 25,
        price: 220,
        features: ['Hafif gübrelenmiş', 'Organik sertifikalı'],
        tier: 'entry'
    },
    {
        id: 'mantar-lightmix-50l',
        brand: 'Mantar',
        name: 'Light Mix 50L',
        type: 'soil',
        volume: 50,
        price: 350,
        features: ['Hafif gübrelenmiş', 'Premium kalite'],
        tier: 'standard'
    },
    {
        id: 'plagron-lightmix-50l',
        brand: 'Plagron',
        name: 'Light Mix 50L',
        type: 'soil',
        volume: 50,
        price: 380,
        features: ['Hafif gübrelenmiş', 'Profesyonel'],
        tier: 'standard'
    },
    {
        id: 'biobizz-lightmix-50l',
        brand: 'BioBizz',
        name: 'Light Mix 50L',
        type: 'soil',
        volume: 50,
        price: 400,
        features: ['100% Organik', 'Premium kalite'],
        tier: 'standard'
    },
    // Coco
    {
        id: 'mantar-cocomix-50l',
        brand: 'Mantar',
        name: 'Coco Mix 50L',
        type: 'coco',
        volume: 50,
        price: 320,
        features: ['Tamponlanmış', 'pH ayarlı'],
        tier: 'standard'
    },
    {
        id: 'plagron-cocos-50l',
        brand: 'Plagron',
        name: 'Cocos Premium 50L',
        type: 'coco',
        volume: 50,
        price: 380,
        features: ['RHP sertifikalı', 'Tamponlanmış'],
        tier: 'standard'
    },
    // Perlite
    {
        id: 'perlit-40l',
        brand: 'Generic',
        name: 'Perlit 40L',
        type: 'additive',
        volume: 40,
        price: 150,
        features: ['Havalandırma', 'Drenaj'],
        tier: 'entry'
    },
    {
        id: 'perlit-50l',
        brand: 'Generic',
        name: 'Perlit 50L',
        type: 'additive',
        volume: 50,
        price: 180,
        features: ['Havalandırma', 'Drenaj'],
        tier: 'standard'
    },
    {
        id: 'perlit-200l',
        brand: 'Generic',
        name: 'Perlit 200L',
        type: 'additive',
        volume: 200,
        price: 550,
        features: ['Toplu alım', 'Ekonomik'],
        tier: 'pro'
    }
];

// ============================================
// POTS / CONTAINERS
// ============================================
export const POT_PRODUCTS = [
    // Fabric Pots - Serapot
    {
        id: 'serapot-11l',
        brand: 'Serapot',
        name: 'Serapot 11L Kumaş Saksı',
        type: 'fabric',
        volume: 11,
        price: 45,
        features: ['Hava budaması', 'Yıkanabilir'],
        tier: 'standard'
    },
    {
        id: 'serapot-15l',
        brand: 'Serapot',
        name: 'Serapot 15L Kumaş Saksı',
        type: 'fabric',
        volume: 15,
        price: 55,
        features: ['Hava budaması', 'Yıkanabilir'],
        tier: 'standard'
    },
    {
        id: 'serapot-26l',
        brand: 'Serapot',
        name: 'Serapot 26L Kumaş Saksı',
        type: 'fabric',
        volume: 26,
        price: 75,
        features: ['Hava budaması', 'Yıkanabilir', 'Büyük bitkiler için'],
        tier: 'standard'
    },
    {
        id: 'serapot-38l',
        brand: 'Serapot',
        name: 'Serapot 38L Kumaş Saksı',
        type: 'fabric',
        volume: 38,
        price: 95,
        features: ['Hava budaması', 'Yıkanabilir', 'Tek bitki için'],
        tier: 'pro'
    },
    // Fabric Pots - Mantar
    {
        id: 'mantar-fabric-15l',
        brand: 'Mantar',
        name: 'Mantar Kumaş Saksı 15L',
        type: 'fabric',
        volume: 15,
        price: 40,
        features: ['Hava budaması', 'Ekonomik'],
        tier: 'entry'
    },
    {
        id: 'mantar-fabric-19l',
        brand: 'Mantar',
        name: 'Mantar Kumaş Saksı 19L',
        type: 'fabric',
        volume: 19,
        price: 50,
        features: ['Hava budaması', 'Popüler boyut'],
        tier: 'standard'
    },
    {
        id: 'mantar-fabric-26l',
        brand: 'Mantar',
        name: 'Mantar Kumaş Saksı 26L',
        type: 'fabric',
        volume: 26,
        price: 65,
        features: ['Hava budaması', 'Büyük bitkiler'],
        tier: 'standard'
    },
    // Plastic Pots
    {
        id: 'plastic-14l',
        brand: 'Generic',
        name: 'Siyah Kare Saksı 14L',
        type: 'plastic',
        volume: 14,
        price: 25,
        features: ['Dayanıklı', 'Ekonomik'],
        tier: 'entry'
    },
    {
        id: 'pot-tray',
        brand: 'Generic',
        name: 'Saksı Tablası',
        type: 'accessory',
        price: 15,
        tier: 'entry'
    }
];

// ============================================
// TIMERS
// ============================================
export const TIMER_PRODUCTS = [
    {
        id: 'timer-mechanical',
        brand: 'Generic',
        name: 'Mekanik Zaman Saati Timer',
        type: 'mechanical',
        outlets: 1,
        price: 50,
        features: ['15 dakika aralık', 'Kolay kullanım'],
        tier: 'entry'
    },
    {
        id: 'timer-digital',
        brand: 'Generic',
        name: 'Dijital Zaman Saati',
        type: 'digital',
        outlets: 1,
        price: 120,
        features: ['20 program', 'LCD ekran', 'Pil yedekli'],
        tier: 'standard'
    }
];

// ============================================
// MONITORING & MEASUREMENT
// ============================================
export const MONITORING_PRODUCTS = [
    {
        id: 'hygro-basic',
        brand: 'Generic',
        name: 'Isı ve Nem Ölçer',
        type: 'sensor',
        price: 60,
        features: ['Sıcaklık', 'Nem'],
        tier: 'entry'
    },
    {
        id: 'hygro-mini',
        brand: 'Generic',
        name: 'Mini Isı Nem Ölçer',
        type: 'sensor',
        price: 45,
        features: ['Kompakt', 'Dijital'],
        tier: 'entry'
    },
    {
        id: 'hygro-co2',
        brand: 'Generic',
        name: 'Isı, Nem ve CO2 Ölçer',
        type: 'sensor',
        price: 280,
        features: ['Sıcaklık', 'Nem', 'CO2'],
        tier: 'pro'
    },
    {
        id: 'ph-pen',
        brand: 'Generic',
        name: 'pH Ölçüm Kalemi',
        type: 'tester',
        price: 150,
        features: ['0-14 pH', 'Otomatik kalibrasyon'],
        tier: 'standard'
    },
    {
        id: 'ph-pen-digital',
        brand: 'Generic',
        name: 'Dijital pH Ölçüm Kalemi',
        type: 'tester',
        price: 200,
        features: ['Yüksek hassasiyet', 'LCD ekran'],
        tier: 'standard'
    },
    {
        id: 'ec-pen',
        brand: 'Generic',
        name: 'TDS(EC) Ölçüm Kalemi',
        type: 'tester',
        price: 120,
        features: ['TDS/EC/PPM', 'Sıcaklık'],
        tier: 'standard'
    },
    {
        id: 'pipette-set',
        brand: 'Generic',
        name: 'Sıvı Ölçüm Pipeti (3 adet)',
        type: 'accessory',
        price: 25,
        features: ['1ml, 3ml, 5ml'],
        tier: 'entry'
    },
    {
        id: 'pipette-set-5',
        brand: 'Generic',
        name: 'Sıvı Ölçüm Pipeti (5 adet)',
        type: 'accessory',
        price: 40,
        features: ['Çeşitli boyutlar'],
        tier: 'standard'
    },
    {
        id: 'pipette-set-15',
        brand: 'Generic',
        name: 'Sıvı Ölçüm Pipeti (15 adet)',
        type: 'accessory',
        price: 80,
        features: ['Profesyonel set'],
        tier: 'pro'
    },
    {
        id: 'watering-can-1l',
        brand: 'Generic',
        name: 'Sıvı Ölçüm ve Sulama Kabı 1 Litre',
        type: 'accessory',
        price: 35,
        features: ['Ölçekli', 'Ergonomik'],
        tier: 'entry'
    }
];

// ============================================
// HANGERS & ACCESSORIES
// ============================================
export const HANGER_PRODUCTS = [
    {
        id: 'hanger-light-2',
        brand: 'Generic',
        name: 'Işık Askısı Hafif Yük (2 adet)',
        type: 'light',
        capacity: 15, // kg each
        quantity: 2,
        price: 60,
        tier: 'entry'
    },
    {
        id: 'hanger-light-4',
        brand: 'Generic',
        name: 'Işık Askısı Hafif Yük (4 adet)',
        type: 'light',
        capacity: 15,
        quantity: 4,
        price: 100,
        tier: 'standard'
    },
    {
        id: 'hanger-heavy-4',
        brand: 'Generic',
        name: 'Işık Askısı Ağır Yük (4 adet)',
        type: 'light',
        capacity: 30,
        quantity: 4,
        price: 140,
        tier: 'standard'
    },
    {
        id: 'hanger-light-8',
        brand: 'Generic',
        name: 'Işık Askısı Hafif Yük (8 adet)',
        type: 'light',
        capacity: 15,
        quantity: 8,
        price: 180,
        tier: 'pro'
    }
];

// ============================================
// CO2 & ODOR CONTROL
// ============================================
export const CO2_ODOR_PRODUCTS = [
    {
        id: 'co2-bag',
        brand: 'Mantar',
        name: 'Mantar Karbondioksit Torbası',
        type: 'co2',
        price: 180,
        lifespan: '6 ay',
        features: ['Doğal', 'Mantar bazlı'],
        tier: 'standard'
    },
    {
        id: 'ona-block',
        brand: 'Ona',
        name: 'Ona Block Polar Crystal 170g',
        type: 'odor',
        price: 120,
        lifespan: '4-6 hafta',
        features: ['Koku nötrleştirici', 'Doğal'],
        tier: 'standard'
    }
];

// ============================================
// NUTRIENT PRODUCTS (for presets)
// ============================================
export const NUTRIENT_PRODUCTS = [
    // BioBizz Liquid Nutrients
    {
        id: 'biobizz-grow-250ml',
        brand: 'BioBizz',
        name: 'Bio·Grow',
        fullName: 'BioBizz Bio·Grow 250ml',
        packaging: '250ml',
        category: 'base',
        phase: 'veg',
        compatible_media: ['soil', 'coco'],
        price: 120,
        tier: 'entry'
    },
    {
        id: 'biobizz-grow-500ml',
        brand: 'BioBizz',
        name: 'Bio·Grow',
        fullName: 'BioBizz Bio·Grow 500ml',
        packaging: '500ml',
        category: 'base',
        phase: 'veg',
        compatible_media: ['soil', 'coco'],
        price: 180,
        tier: 'standard'
    },
    {
        id: 'biobizz-grow-1l',
        brand: 'BioBizz',
        name: 'Bio·Grow',
        fullName: 'BioBizz Bio·Grow 1L',
        packaging: '1L',
        category: 'base',
        phase: 'veg',
        compatible_media: ['soil', 'coco'],
        price: 280,
        tier: 'standard'
    },
    {
        id: 'biobizz-bloom-250ml',
        brand: 'BioBizz',
        name: 'Bio·Bloom',
        fullName: 'BioBizz Bio·Bloom 250ml',
        packaging: '250ml',
        category: 'base',
        phase: 'bloom',
        compatible_media: ['soil', 'coco'],
        price: 120,
        tier: 'entry'
    },
    {
        id: 'biobizz-bloom-1l',
        brand: 'BioBizz',
        name: 'Bio·Bloom',
        fullName: 'BioBizz Bio·Bloom 1L',
        packaging: '1L',
        category: 'base',
        phase: 'bloom',
        compatible_media: ['soil', 'coco'],
        price: 290,
        tier: 'standard'
    },
    {
        id: 'biobizz-topmax-250ml',
        brand: 'BioBizz',
        name: 'Top·Max',
        fullName: 'BioBizz Top·Max 250ml',
        packaging: '250ml',
        category: 'booster',
        phase: 'bloom',
        compatible_media: ['soil', 'coco'],
        price: 150,
        tier: 'entry'
    },
    {
        id: 'biobizz-topmax-500ml',
        brand: 'BioBizz',
        name: 'Top·Max',
        fullName: 'BioBizz Top·Max 500ml',
        packaging: '500ml',
        category: 'booster',
        phase: 'bloom',
        compatible_media: ['soil', 'coco'],
        price: 220,
        tier: 'standard'
    },
    {
        id: 'biobizz-topmax-1l',
        brand: 'BioBizz',
        name: 'Top·Max',
        fullName: 'BioBizz Top·Max 1L',
        packaging: '1L',
        category: 'booster',
        phase: 'bloom',
        compatible_media: ['soil', 'coco'],
        price: 350,
        tier: 'standard'
    },
    {
        id: 'biobizz-rootjuice-250ml',
        brand: 'BioBizz',
        name: 'Root·Juice',
        fullName: 'BioBizz Root·Juice 250ml',
        packaging: '250ml',
        category: 'root',
        phase: 'veg',
        compatible_media: ['soil', 'coco'],
        price: 130,
        tier: 'entry'
    },

    // CANNA Terra Nutrients
    {
        id: 'canna-terra-vega-500ml',
        brand: 'CANNA',
        name: 'Terra Vega',
        fullName: 'CANNA Terra Vega 500ml',
        packaging: '500ml',
        category: 'base',
        phase: 'veg',
        compatible_media: ['soil'],
        price: 180,
        tier: 'entry'
    },
    {
        id: 'canna-terra-vega-1l',
        brand: 'CANNA',
        name: 'Terra Vega',
        fullName: 'CANNA Terra Vega 1L',
        packaging: '1L',
        category: 'base',
        phase: 'veg',
        compatible_media: ['soil'],
        price: 290,
        tier: 'standard'
    },
    {
        id: 'canna-terra-flores-500ml',
        brand: 'CANNA',
        name: 'Terra Flores',
        fullName: 'CANNA Terra Flores 500ml',
        packaging: '500ml',
        category: 'base',
        phase: 'bloom',
        compatible_media: ['soil'],
        price: 180,
        tier: 'entry'
    },
    {
        id: 'canna-terra-flores-1l',
        brand: 'CANNA',
        name: 'Terra Flores',
        fullName: 'CANNA Terra Flores 1L',
        packaging: '1L',
        category: 'base',
        phase: 'bloom',
        compatible_media: ['soil'],
        price: 290,
        tier: 'standard'
    },
    {
        id: 'canna-rhizotonic-250ml',
        brand: 'CANNA',
        name: 'Rhizotonic',
        fullName: 'CANNA Rhizotonic 250ml',
        packaging: '250ml',
        category: 'root',
        phase: 'veg',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 200,
        tier: 'entry'
    },
    {
        id: 'canna-rhizotonic-500ml',
        brand: 'CANNA',
        name: 'Rhizotonic',
        fullName: 'CANNA Rhizotonic 500ml',
        packaging: '500ml',
        category: 'root',
        phase: 'veg',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 350,
        tier: 'standard'
    },
    {
        id: 'canna-pk1314-250ml',
        brand: 'CANNA',
        name: 'PK 13/14',
        fullName: 'CANNA PK 13/14 250ml',
        packaging: '250ml',
        category: 'booster',
        phase: 'bloom',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 150,
        tier: 'entry'
    },
    {
        id: 'canna-boost-250ml',
        brand: 'CANNA',
        name: 'Boost Accelerator',
        fullName: 'CANNA Boost Accelerator 250ml',
        packaging: '250ml',
        category: 'booster',
        phase: 'bloom',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 280,
        tier: 'standard'
    },
    {
        id: 'canna-coco-ab-1l',
        brand: 'CANNA',
        name: 'Coco A+B Set',
        fullName: 'CANNA Coco A+B 1L Set',
        packaging: '2x1L',
        category: 'base',
        phase: 'all',
        compatible_media: ['coco'],
        price: 450,
        tier: 'standard'
    },

    // Terra Aquatica (TA) Nutrients
    {
        id: 'ta-pro-organic-grow-500ml',
        brand: 'Terra Aquatica',
        name: 'Pro Organic Grow',
        fullName: 'TA Pro Organic Grow 500ml',
        packaging: '500ml',
        category: 'base',
        phase: 'veg',
        compatible_media: ['soil', 'coco'],
        price: 180,
        tier: 'entry'
    },
    {
        id: 'ta-pro-organic-bloom-500ml',
        brand: 'Terra Aquatica',
        name: 'Pro Organic Bloom',
        fullName: 'TA Pro Organic Bloom 500ml',
        packaging: '500ml',
        category: 'base',
        phase: 'bloom',
        compatible_media: ['soil', 'coco'],
        price: 180,
        tier: 'entry'
    },
    {
        id: 'ta-dualpart-coco-grow-1l',
        brand: 'Terra Aquatica',
        name: 'DualPart Coco Grow',
        fullName: 'TA DualPart Coco Grow 1L',
        packaging: '1L',
        category: 'base',
        phase: 'veg',
        compatible_media: ['coco'],
        price: 250,
        tier: 'standard'
    },
    {
        id: 'ta-dualpart-coco-bloom-1l',
        brand: 'Terra Aquatica',
        name: 'DualPart Coco Bloom',
        fullName: 'TA DualPart Coco Bloom 1L',
        packaging: '1L',
        category: 'base',
        phase: 'bloom',
        compatible_media: ['coco'],
        price: 250,
        tier: 'standard'
    },
    {
        id: 'ta-proroots-60ml',
        brand: 'Terra Aquatica',
        name: 'Pro Roots',
        fullName: 'TA Pro Roots 60ml',
        packaging: '60ml',
        category: 'root',
        phase: 'veg',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 120,
        tier: 'entry'
    },
    {
        id: 'ta-tripart-grow-1l',
        brand: 'Terra Aquatica',
        name: 'TriPart Grow',
        fullName: 'TA TriPart Grow 1L',
        packaging: '1L',
        category: 'base',
        phase: 'veg',
        compatible_media: ['hydro', 'coco'],
        price: 200,
        tier: 'standard'
    },
    {
        id: 'ta-tripart-bloom-1l',
        brand: 'Terra Aquatica',
        name: 'TriPart Bloom',
        fullName: 'TA TriPart Bloom 1L',
        packaging: '1L',
        category: 'base',
        phase: 'bloom',
        compatible_media: ['hydro', 'coco'],
        price: 200,
        tier: 'standard'
    },
    {
        id: 'ta-tripart-micro-1l',
        brand: 'Terra Aquatica',
        name: 'TriPart Micro',
        fullName: 'TA TriPart Micro 1L',
        packaging: '1L',
        category: 'base',
        phase: 'all',
        compatible_media: ['hydro', 'coco'],
        price: 200,
        tier: 'standard'
    },

    // Advanced Nutrients
    {
        id: 'an-ph-perfect-grow-1l',
        brand: 'Advanced Nutrients',
        name: 'pH Perfect Grow',
        fullName: 'AN pH Perfect Grow 1L',
        packaging: '1L',
        category: 'base',
        phase: 'veg',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 350,
        tier: 'standard'
    },
    {
        id: 'an-ph-perfect-micro-1l',
        brand: 'Advanced Nutrients',
        name: 'pH Perfect Micro',
        fullName: 'AN pH Perfect Micro 1L',
        packaging: '1L',
        category: 'base',
        phase: 'all',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 350,
        tier: 'standard'
    },
    {
        id: 'an-ph-perfect-bloom-1l',
        brand: 'Advanced Nutrients',
        name: 'pH Perfect Bloom',
        fullName: 'AN pH Perfect Bloom 1L',
        packaging: '1L',
        category: 'base',
        phase: 'bloom',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 350,
        tier: 'standard'
    },
    {
        id: 'an-big-bud-500ml',
        brand: 'Advanced Nutrients',
        name: 'Big Bud',
        fullName: 'AN Big Bud 500ml',
        packaging: '500ml',
        category: 'booster',
        phase: 'bloom',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 400,
        tier: 'standard'
    },
    {
        id: 'an-connoisseur-grandmaster-pack',
        brand: 'Advanced Nutrients',
        name: 'Connoisseur GrandMaster Pack',
        fullName: 'AN Connoisseur GrandMaster Pack',
        packaging: 'Set',
        category: 'set',
        phase: 'all',
        compatible_media: ['soil', 'coco', 'hydro'],
        price: 2500,
        tier: 'pro'
    },
    {
        id: 'an-sensi-calmag-500ml',
        brand: 'Advanced Nutrients',
        name: 'Sensi Cal-Mag Xtra',
        fullName: 'AN Sensi Cal-Mag Xtra 500ml',
        packaging: '500ml',
        category: 'supplement',
        phase: 'all',
        compatible_media: ['coco', 'hydro'],
        price: 200,
        tier: 'standard'
    },

    // Other Brands
    {
        id: 'xtreme-mykos-454g',
        brand: 'Xtreme Gardening',
        name: 'Mykos',
        fullName: 'Xtreme Gardening Mykos 454g',
        packaging: '454g',
        category: 'root',
        phase: 'veg',
        compatible_media: ['soil', 'coco'],
        price: 280,
        tier: 'standard'
    },
    {
        id: 'organic-soil-heavens-set',
        brand: 'Organic Soil',
        name: 'Heavens Complete Set',
        fullName: 'Organic Soil Heavens Complete Set',
        packaging: 'Set',
        category: 'set',
        phase: 'all',
        compatible_media: ['soil'],
        price: 850,
        tier: 'pro'
    }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get tent by dimensions
 */
export function getTentByDimensions(width, depth, height) {
    return TENT_PRODUCTS.find(t =>
        t.dimensions.width === width &&
        t.dimensions.depth === depth &&
        t.dimensions.height === height
    );
}

/**
 * Get recommended LED for tent size
 */
export function getRecommendedLEDs(tentWidthCm, tentDepthCm) {
    const areaM2 = (tentWidthCm * tentDepthCm) / 10000;
    const recommendedWatts = areaM2 * 400; // ~400W per m²

    return LED_PRODUCTS.filter(led => {
        const ledWatts = led.watts;
        return ledWatts >= recommendedWatts * 0.7 && ledWatts <= recommendedWatts * 1.3;
    }).sort((a, b) => Math.abs(a.watts - recommendedWatts) - Math.abs(b.watts - recommendedWatts));
}

/**
 * Get recommended ventilation for tent volume
 */
export function getRecommendedVentilation(tentWidthCm, tentDepthCm, tentHeightCm) {
    const volumeM3 = (tentWidthCm * tentDepthCm * tentHeightCm) / 1000000;
    const requiredM3h = volumeM3 * 60; // Air exchange 1x per minute

    return VENTILATION_SETS.filter(set => set.capacity >= requiredM3h)
        .sort((a, b) => a.capacity - b.capacity);
}

/**
 * Get substrate amount for tent and pot setup
 */
export function getSubstrateAmount(potVolumeLiters, potCount) {
    return potVolumeLiters * potCount * 1.1; // 10% extra
}

/**
 * Calculate pot count for tent
 */
export function getRecommendedPotCount(tentWidthCm, tentDepthCm, potVolumeLiters) {
    const areaM2 = (tentWidthCm * tentDepthCm) / 10000;

    if (potVolumeLiters <= 15) {
        return Math.floor(areaM2 * 6); // 6 per m² for small pots
    } else if (potVolumeLiters <= 25) {
        return Math.floor(areaM2 * 4); // 4 per m²
    } else {
        return Math.floor(areaM2 * 2.5); // 2-3 per m² for large pots
    }
}

/**
 * All products grouped for easy access
 */
export const ALL_PRODUCTS = {
    tents: TENT_PRODUCTS,
    leds: LED_PRODUCTS,
    fans: FAN_PRODUCTS,
    carbonFilters: CARBON_FILTER_PRODUCTS,
    ventilationSets: VENTILATION_SETS,
    ducting: DUCTING_PRODUCTS,
    substrates: SUBSTRATE_PRODUCTS,
    pots: POT_PRODUCTS,
    timers: TIMER_PRODUCTS,
    monitoring: MONITORING_PRODUCTS,
    hangers: HANGER_PRODUCTS,
    co2Odor: CO2_ODOR_PRODUCTS,
    nutrients: NUTRIENT_PRODUCTS
};
