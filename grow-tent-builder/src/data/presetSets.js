/**
 * Preset Sets Data
 * Pre-configured complete grow setups for different tiers
 */

export const PRESET_SETS = [
  {
    id: 'entry-small-biobizz',
    name: {
      en: 'Entry Small Setup - BioBizz',
      tr: 'Giriş Seviye Küçük Set - BioBizz'
    },
    description: {
      en: 'Perfect starter kit for beginners. Includes everything you need for 2-3 plants.',
      tr: 'Yeni başlayanlar için mükemmel başlangıç seti. 2-3 bitki için ihtiyacınız olan her şey dahil.'
    },
    tier: 'entry',
    tentSize: {
      width: 90,
      depth: 90,
      height: 170,
      unit: 'cm'
    },
    mediaType: 'light-mix',
    nutrientBrand: 'BioBizz',
    plantCount: 2,
    items: {
      tent: 'secret-jardin-ds90',
      lighting: [
        { id: 'mars-hydro-ts1000', qty: 1 }
      ],
      ventilation: {
        fan: 'ac-infinity-cloudline-t4',
        filter: 'ac-infinity-filter-4'
      },
      substrate: [
        { id: 'biobizz-lightmix-50l', qty: 2 }
      ],
      pots: [
        { id: 'fabric-pot-11l', qty: 2 }
      ],
      nutrients: [
        'biobizz-biogrow-1l',
        'biobizz-biobloom-1l'
      ],
      monitoring: [
        'xiaomi-temp-humidity'
      ],
      accessories: [
        'rope-hanger-pair',
        'sonoff-s26'
      ]
    },
    totalPrice: 23635,
    image: '/images/presets/entry-small.jpg'
  },
  {
    id: 'standard-medium-biobizz',
    name: {
      en: 'Standard Medium Setup - BioBizz',
      tr: 'Standart Orta Boy Set - BioBizz'
    },
    description: {
      en: 'Well-balanced setup for 4-6 plants with quality components.',
      tr: '4-6 bitki için kaliteli bileşenlerle dengeli bir kurulum.'
    },
    tier: 'standard',
    tentSize: {
      width: 120,
      depth: 120,
      height: 200,
      unit: 'cm'
    },
    mediaType: 'all-mix',
    nutrientBrand: 'BioBizz',
    plantCount: 4,
    items: {
      tent: 'secret-jardin-ds120',
      lighting: [
        { id: 'mars-hydro-ts3000', qty: 1 }
      ],
      ventilation: {
        fan: 'ac-infinity-cloudline-t6',
        filter: 'ac-infinity-filter-6',
        controller: 'ac-infinity-controller-69'
      },
      substrate: [
        { id: 'biobizz-allmix-50l', qty: 3 }
      ],
      pots: [
        { id: 'fabric-pot-19l', qty: 4 }
      ],
      nutrients: [
        'biobizz-biogrow-1l',
        'biobizz-biobloom-1l'
      ],
      monitoring: [
        'inkbird-wifi-monitor'
      ],
      accessories: [
        'rope-hanger-pair',
        'tp-link-kasa',
        'ona-gel-1l'
      ]
    },
    totalPrice: 42330,
    image: '/images/presets/standard-medium.jpg'
  },
  {
    id: 'premium-large-biobizz',
    name: {
      en: 'Premium Large Setup - BioBizz',
      tr: 'Premium Büyük Set - BioBizz'
    },
    description: {
      en: 'Professional setup with top-tier equipment for serious growers. Supports 6-9 plants.',
      tr: 'Profesyonel yetiştiriciler için en üst seviye ekipmanlarla kurulum. 6-9 bitki kapasiteli.'
    },
    tier: 'premium',
    tentSize: {
      width: 150,
      depth: 150,
      height: 200,
      unit: 'cm'
    },
    mediaType: 'all-mix',
    nutrientBrand: 'BioBizz',
    plantCount: 6,
    items: {
      tent: 'secret-jardin-ds150',
      lighting: [
        { id: 'mars-hydro-ts3000', qty: 2 }
      ],
      ventilation: {
        fan: 'ac-infinity-cloudline-t8',
        filter: 'ac-infinity-filter-8',
        controller: 'ac-infinity-controller-69-pro'
      },
      substrate: [
        { id: 'biobizz-allmix-50l', qty: 5 }
      ],
      pots: [
        { id: 'fabric-pot-19l', qty: 6 }
      ],
      nutrients: [
        'biobizz-biogrow-1l',
        'biobizz-biobloom-1l'
      ],
      monitoring: [
        'inkbird-wifi-monitor',
        'inkbird-co2-monitor'
      ],
      accessories: [
        'rope-hanger-pair',
        'tp-link-kasa',
        'ona-gel-1l'
      ]
    },
    totalPrice: 68500,
    image: '/images/presets/premium-large.jpg'
  },
  {
    id: 'entry-canna-coco',
    name: {
      en: 'Entry Coco Setup - CANNA',
      tr: 'Giriş Seviye Coco Set - CANNA'
    },
    description: {
      en: 'Beginner-friendly coco coir setup with CANNA nutrients. Great for learning hydroponics.',
      tr: 'Yeni başlayanlar için coco lif kurulumu CANNA besinleri ile. Hidroponik öğrenmek için harika.'
    },
    tier: 'entry',
    tentSize: {
      width: 90,
      depth: 90,
      height: 170,
      unit: 'cm'
    },
    mediaType: 'coco-mix',
    nutrientBrand: 'CANNA',
    plantCount: 2,
    items: {
      tent: 'secret-jardin-ds90',
      lighting: [
        { id: 'mars-hydro-ts1000', qty: 1 }
      ],
      ventilation: {
        fan: 'ac-infinity-cloudline-t4',
        filter: 'ac-infinity-filter-4'
      },
      substrate: [
        { id: 'biobizz-cocomix-50l', qty: 2 }
      ],
      pots: [
        { id: 'fabric-pot-11l', qty: 2 }
      ],
      nutrients: [
        'canna-coco-a-1l',
        'canna-coco-b-1l'
      ],
      monitoring: [
        'xiaomi-temp-humidity'
      ],
      accessories: [
        'rope-hanger-pair',
        'sonoff-s26'
      ]
    },
    totalPrice: 24100,
    image: '/images/presets/entry-coco.jpg'
  },
  {
    id: 'standard-advanced-nutrients',
    name: {
      en: 'Standard Setup - Advanced Nutrients',
      tr: 'Standart Set - Advanced Nutrients'
    },
    description: {
      en: 'pH Perfect technology setup with Advanced Nutrients for hassle-free growing.',
      tr: 'Advanced Nutrients ile pH Perfect teknolojisi, sorunsuz yetiştirme.'
    },
    tier: 'standard',
    tentSize: {
      width: 120,
      depth: 120,
      height: 200,
      unit: 'cm'
    },
    mediaType: 'coco-mix',
    nutrientBrand: 'Advanced Nutrients',
    plantCount: 4,
    items: {
      tent: 'secret-jardin-ds120',
      lighting: [
        { id: 'mars-hydro-ts3000', qty: 1 }
      ],
      ventilation: {
        fan: 'ac-infinity-cloudline-t6',
        filter: 'ac-infinity-filter-6'
      },
      substrate: [
        { id: 'biobizz-cocomix-50l', qty: 3 }
      ],
      pots: [
        { id: 'fabric-pot-19l', qty: 4 }
      ],
      nutrients: [
        'advanced-sensi-grow-a-1l',
        'advanced-sensi-grow-b-1l',
        'advanced-sensi-bloom-a-1l',
        'advanced-sensi-bloom-b-1l'
      ],
      monitoring: [
        'inkbird-wifi-monitor'
      ],
      accessories: [
        'rope-hanger-pair',
        'tp-link-kasa',
        'ona-gel-1l'
      ]
    },
    totalPrice: 45800,
    image: '/images/presets/standard-advanced.jpg'
  }
];
