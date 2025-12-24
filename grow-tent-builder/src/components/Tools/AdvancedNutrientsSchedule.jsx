import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import { productService } from '../../services/productService';
import { brandService } from '../../services/brandService';
import { anScheduleService } from '../../services/anScheduleService';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './FeedingSchedule.module.css';
import { motion, AnimatePresence } from 'framer-motion';

// --- Constants moved from data file ---

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

export const PRODUCT_CATEGORIES = {
    base_nutrient: {
        name_key: 'catBaseNutrient',
        icon: '🌱',
        name: 'Temel Besinler',
        nameEn: 'BASE NUTRIENTS',
        description: 'Bitkinin ana büyüme ve çiçeklenme aşamaları için gerekli olan temel besin çözeltileri.',
        color: '#22C55E'
    },
    root_expanders: {
        name_key: 'catRootExpanders',
        icon: '🌳',
        name: 'Kök Genişleticiler',
        nameEn: 'ROOT EXPANDERS',
        description: 'Kök sistemi gelişimini destekleyen ürünler.',
        color: '#8B5CF6'
    },
    bigger_buds: {
        name_key: 'catBiggerBuds',
        icon: '🌺',
        name: 'Büyük Tomurcuklar',
        nameEn: 'BIGGER BUDS',
        description: 'Tomurcuk boyutunu ve ağırlığını artırmayı hedefleyen destekleyiciler.',
        color: '#EF4444'
    },
    bud_potency: {
        name_key: 'catBudPotency',
        icon: '💪',
        name: 'Tomurcuk Potansiyeli & Gövde Güçlendirici',
        nameEn: 'BUD POTENCY & STALK STRENGTHENER',
        description: 'Bitki gücünü, gövde yapısını ve tomurcuk potansiyelini destekleyen ürünler.',
        color: '#F59E0B'
    },
    grow_medium: {
        name_key: 'catGrowMedium',
        icon: '🍂',
        name: 'Büyüme Ortamı Düzenleyici',
        nameEn: 'GROW MEDIUM CONDITIONER',
        description: 'Yetiştirme ortamının koşullarını iyileştirmeyi amaçlayan ürünler.',
        color: '#34D399'
    },
    taste_terpene: {
        name_key: 'catTasteTerpene',
        icon: '🍬',
        name: 'Tomurcuk Tadı & Terpen Geliştirici',
        nameEn: 'BUD TASTE & TERPENE ENHANCEMENT',
        description: 'Mahsulün tadını ve aroma profilini (terpen) geliştirmeyi hedefleyen ürünler.',
        color: '#EC4899'
    }
};

export const BASE_NUTRIENT_OPTIONS = [
    {
        id: 'gmb',
        label: 'pH Perfect® Grow Micro Bloom',
        shortLabel: 'Grow Micro Bloom',
        products: ['gmb-grow', 'gmb-micro', 'gmb-bloom'],
        schedule_key: 'schedule_hydro_master',
        icon: '🧪',
        color: '#7C3AED',
        badge: '3-Part',
        description: 'Esnek 3 parçalı temel sistem - Tüm dönemler',
        image: '/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Grow-Micro-Bloom-1L.jpg'
    },
    {
        id: 'sensi',
        label: 'pH Perfect® Sensi Grow & Bloom',
        shortLabel: 'Sensi Grow & Bloom',
        products: ['sensi-grow-a', 'sensi-grow-b', 'sensi-bloom-a', 'sensi-bloom-b'],
        schedule_key: 'schedule_hydro_master',
        icon: '💧',
        color: '#2563EB',
        badge: 'Professional',
        description: 'pH Perfect teknolojisi ile profesyonel besin sistemi',
        image: '/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Sensi-Grow-Bloom-1L.png'
    },
    {
        id: 'sensi-coco',
        label: 'pH Perfect® Sensi Coco Grow & Bloom',
        shortLabel: 'Sensi Coco Grow & Bloom',
        products: ['sensi-coco-grow-a', 'sensi-coco-grow-b', 'sensi-coco-bloom-a', 'sensi-coco-bloom-b'],
        schedule_key: 'schedule_coco_master',
        icon: '🥥',
        color: '#0891B2',
        badge: 'Coco',
        description: 'Coco coir ortamları için özel formül',
        image: '/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Sensi-Coco-Grow-Bloom-1L.png'
    },
    {
        id: 'connoisseur',
        label: 'pH Perfect® Connoisseur® Grow & Bloom',
        shortLabel: 'Connoisseur Grow & Bloom',
        products: ['conn-grow-a', 'conn-grow-b', 'conn-bloom-a', 'conn-bloom-b'],
        schedule_key: 'schedule_hydro_master',
        icon: '🏆',
        color: '#DC2626',
        badge: 'Premium',
        description: 'Üst düzey profesyonel besin serisi',
        image: '/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Connoisseur-Grow-Bloom-1L-v2.png'
    },
    {
        id: 'connoisseur-coco',
        label: 'pH Perfect® Connoisseur® Coco Grow & Bloom',
        shortLabel: 'Connoisseur Coco Grow & Bloom',
        products: ['conn-coco-grow-a', 'conn-coco-grow-b', 'conn-coco-bloom-a', 'conn-coco-bloom-b'],
        schedule_key: 'schedule_coco_master',
        icon: '👑',
        color: '#B91C1C',
        badge: 'Premium Coco',
        description: 'Premium Coco ortamları için en üst düzey formül',
        image: '/images/advanced-nutrients/Advanced-Nutrients-pH-Perfect-Connoisseur-Coco-Grow-Bloom-1L.png'
    },
    {
        id: 'iguana',
        label: 'OG Organics™ Iguana Juice® Grow & Bloom',
        shortLabel: 'Iguana Juice Grow & Bloom',
        products: ['iguana-grow', 'iguana-bloom'],
        schedule_key: 'schedule_hydro_master',
        icon: '🦎',
        color: '#16A34A',
        badge: 'Organic',
        description: '100% Organik sertifikalı besin serisi',
        image: '/images/advanced-nutrients/OG-Organics-Iguana-Juice-Grow-Bloom-Advanced-Nutrients-1L-EU.jpg'
    },
    {
        id: 'jungle',
        label: 'Jungle Juice® Grow Micro Bloom',
        shortLabel: 'Jungle Juice GMB',
        products: ['jungle-grow', 'jungle-micro', 'jungle-bloom'],
        schedule_key: 'schedule_hydro_master',
        icon: '🌴',
        color: '#059669',
        badge: 'Budget',
        description: 'Ekonomik 3 parçalı temel sistem',
        image: '/images/advanced-nutrients/Advanced-Nutrients-Jungle-Juice-GMB-1L-300x243-v2.jpg'
    },
];

// -------------------------------------

// Info section data
const NUTRIENT_SERIES = [
    {
        id: 'connoisseur',
        name: 'pH Perfect® Connoisseur®',
        badge: 'Premium',
        color: '#DC2626',
        descriptionKey: 'anConnoisseurDesc',
        features: ['pH Perfect', 'Coco & Hydro', 'Top Shelf & Master']
    },
    {
        id: 'sensi',
        name: 'pH Perfect® Sensi',
        badge: 'Professional',
        color: '#2563EB',
        descriptionKey: 'anSensiDesc',
        features: ['pH Perfect', '2-Part System', 'Coco']
    },
    {
        id: 'iguana',
        name: 'OG Organics™ Iguana Juice®',
        badge: 'Organic',
        color: '#16A34A',
        descriptionKey: 'anIguanaDesc',
        features: ['CDFA Certified', '100% Organic', 'Vegan']
    },
    {
        id: 'gmb',
        name: 'pH Perfect® Grow/Micro/Bloom',
        badge: '3-Part',
        color: '#7C3AED',
        descriptionKey: 'anGMBDesc',
        features: ['3-Part System', 'Flexible Ratios', 'All Media']
    }
];

const PRO_TIPS_KEYS = [
    'anProTip1',
    'anProTip2',
    'anProTip3',
    'anProTip4',
    'anProTip5',
    'anProTip6'
];

const LIFECYCLE_PHASES = [
    {
        id: 'vegetative',
        icon: '🌿',
        titleKey: 'anGrowCycle',
        durationKey: 'anVegetative',
        durationWeeks: 4,
        light: '18/6',
        color: '#22C55E',
        descriptionKey: 'anGrowCycleDesc'
    },
    {
        id: 'flowering',
        icon: '🌸',
        titleKey: 'anBloomCycle',
        durationKey: 'anFlowering',
        durationWeeks: 8,
        light: '12/12',
        color: '#EC4899',
        descriptionKey: 'anBloomCycleDesc'
    },
    {
        id: 'flush',
        icon: '💧',
        titleKey: 'anFlushPeriod',
        durationKey: 'anLastWeek',
        light: '12/12',
        color: '#6B7280',
        descriptionKey: 'anFlushPeriodDesc'
    }
];

const SUPPLEMENT_CATEGORIES = [
    { icon: '🌳', titleKey: 'anRootDevelopers', descriptionKey: 'anRootDevelopersDesc' },
    { icon: '🌺', titleKey: 'anBudEnlargersTitle', descriptionKey: 'anBudEnlargersDesc' },
    { icon: '🍬', titleKey: 'anFlavorEnhancersTitle', descriptionKey: 'anFlavorEnhancersDesc' },
    { icon: '🛡️', titleKey: 'anPlantHealthTitle', descriptionKey: 'anPlantHealthDesc' }
];

export default function AdvancedNutrientsSchedule() {
    const { t, language } = useSettings();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Config state - loaded from database or defaults
    const [config, setConfig] = useState({
        weekLabels: WEEK_LABELS,
        phaseInfo: PHASE_INFO,
        productCategories: PRODUCT_CATEGORIES,
        baseNutrientOptions: BASE_NUTRIENT_OPTIONS,
        nutrientSeries: NUTRIENT_SERIES,
        lifecyclePhases: LIFECYCLE_PHASES,
        supplementCategories: SUPPLEMENT_CATEGORIES,
        proTipsKeys: PRO_TIPS_KEYS,
        defaultAdditives: ['voodoo-juice', 'b-52', 'big-bud', 'overdrive', 'flawless-finish']
    });
    
    const [selectedBaseNutrientId, setSelectedBaseNutrientId] = useState(BASE_NUTRIENT_OPTIONS[0].id);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [waterAmount, setWaterAmount] = useState(10); // Litre
    const [showProductSelector, setShowProductSelector] = useState(true); // Varsayılan olarak açık
    const [showBaseNutrientSelector, setShowBaseNutrientSelector] = useState(false);
    const [highlightedWeek, setHighlightedWeek] = useState(null);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(PRODUCT_CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    // Load config from database
    useEffect(() => {
        async function loadConfig() {
            try {
                const dbConfig = await anScheduleService.fetchConfig();
                if (dbConfig && Object.keys(dbConfig).length > 0) {
                    setConfig({
                        weekLabels: dbConfig.week_labels || WEEK_LABELS,
                        phaseInfo: dbConfig.phase_info || PHASE_INFO,
                        productCategories: dbConfig.product_categories || PRODUCT_CATEGORIES,
                        baseNutrientOptions: dbConfig.base_nutrient_options || BASE_NUTRIENT_OPTIONS,
                        nutrientSeries: dbConfig.nutrient_series || NUTRIENT_SERIES,
                        lifecyclePhases: dbConfig.lifecycle_phases || LIFECYCLE_PHASES,
                        supplementCategories: dbConfig.supplement_categories || SUPPLEMENT_CATEGORIES,
                        proTipsKeys: dbConfig.pro_tips_keys || PRO_TIPS_KEYS,
                        defaultAdditives: dbConfig.default_additives || ['voodoo-juice', 'b-52', 'big-bud', 'overdrive', 'flawless-finish']
                    });
                    // Update expanded categories if productCategories changed
                    if (dbConfig.product_categories) {
                        setExpandedCategories(
                            Object.keys(dbConfig.product_categories).reduce((acc, key) => ({ ...acc, [key]: true }), {})
                        );
                    }
                    // Update selected base nutrient if options changed
                    if (dbConfig.base_nutrient_options && dbConfig.base_nutrient_options.length > 0) {
                        setSelectedBaseNutrientId(dbConfig.base_nutrient_options[0].id);
                    }
                }
            } catch (err) {
                console.error('Error loading AN config from database:', err);
                // Keep using defaults
            }
        }
        loadConfig();
    }, []);

    // Fetch products
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // Get brand by slug
                const brand = await brandService.getBrandBySlug('advanced-nutrients');
                if (!brand) throw new Error('Brand not found');

                // Get products
                const data = await productService.getProducts(brand.id);

                // Map data to match expected structure
                const mappedProducts = data.map(p => ({
                    ...p,
                    id: p.sku, // Use SKU as ID to match local constants
                    _uuid: p.id, // Keep real UUID if needed
                    product_name: typeof p.name === 'object' ? (p.name[language] || p.name.en || p.name.tr) : p.name,
                    // Ensure category_key is available (from specs or inferred)
                    category_key: p.specs?.category_key || 'base_nutrient',
                    // Map other properties if needed
                    function_key: p.function_detailed?.en || 'funcBaseNutrientVeg', // Fallback or need real mapping
                    dose_unit: p.specs?.dose_unit || 'ml/L',
                    color: p.color || '#22C55E'
                }));

                setProducts(mappedProducts);
            } catch (err) {
                console.error('Error loading Advanced Nutrients data:', err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [language]);

    // Get current base nutrient option
    const currentBaseNutrient = useMemo(() => {
        return config.baseNutrientOptions.find(opt => opt.id === selectedBaseNutrientId) || config.baseNutrientOptions[0];
    }, [selectedBaseNutrientId, config.baseNutrientOptions]);

    // Group products by category
    const productsByCategory = useMemo(() => {
        const grouped = {};
        Object.keys(config.productCategories).forEach(catKey => {
            grouped[catKey] = products.filter(p => p.category_key === catKey);
        });
        return grouped;
    }, [products, config.productCategories]);

    // Toggle category expansion
    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    // Initialize selected products when base nutrient changes
    useEffect(() => {
        // Get IDs of all base nutrients (from all options) to remove them
        const allBaseNutrientIds = new Set(config.baseNutrientOptions.flatMap(opt => opt.products));

        setSelectedProducts(prev => {
            // Keep existing additives (products not in any base nutrient list)
            const additives = prev.filter(id => !allBaseNutrientIds.has(id));
            // Add new base nutrient products
            return [...currentBaseNutrient.products, ...additives];
        });
    }, [currentBaseNutrient]);

    // Filter and translate selected products
    const activeProducts = useMemo(() => {
        return products.filter(product =>
            selectedProducts.includes(product.id) || selectedProducts.includes(product.sku) // Handle ID vs SKU mismatch
        ).map(product => ({
            ...product,
            id: product.id || product.sku, // Ensure ID is available
            category: t(product.category_key),
            dose_unit: product.dose_unit === 'ml/L' ? 'ml/L' : t(product.dose_unit),
            // function mapping might need adjustment
            function: t(product.function_key || 'funcBaseNutrientVeg'),
        }));
    }, [selectedProducts, products, t]);

    // Toggle product selection
    const toggleProduct = (productId) => {
        // Prevent deselecting current base nutrient products
        if (currentBaseNutrient.products.includes(productId)) return;

        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Select all products (additives only, base is fixed)
    const selectAllAdditives = () => {
        const additives = products
            .filter(p => p.category_key !== 'base_nutrient')
            .map(p => p.id); // Assuming ID matches SKU
        setSelectedProducts([...currentBaseNutrient.products, ...additives]);
    };

    // Reset to default (Base + Essentials)
    const resetToDefault = () => {
        // Default additives from config
        setSelectedProducts([...currentBaseNutrient.products, ...config.defaultAdditives]);
    };

    // Get schedule based on current selection
    const getSchedule = (product) => {
        const specs = product.specs || {};

        // If it's a base nutrient, use its default schedule
        if (product.category_key === 'base_nutrient') {
            return specs.schedule_default || null;
        }

        // If it's an additive, use the key from the selected base nutrient option
        // e.g., 'schedule_hydro_master'
        const scheduleKey = currentBaseNutrient.schedule_key;

        // Fallback: try other keys if specific one missing
        return specs[scheduleKey] || specs.schedule_default || null;
    };

    // Calculate dose for a specific week
    const calculateDoseForWeek = (product, weekLabel) => {
        const schedule = getSchedule(product);
        if (!schedule) return null;

        const dose = schedule[weekLabel];
        if (dose === undefined) return null;
        return dose;
    };

    // Calculate total dose for a week
    const calculateTotalForWeek = (weekLabel) => {
        const totals = {};
        activeProducts.forEach(product => {
            const dose = calculateDoseForWeek(product, weekLabel);
            if (dose !== null && typeof dose === 'number') {
                const unit = product.dose_unit;
                if (!totals[unit]) totals[unit] = 0;
                totals[unit] += dose * waterAmount;
            }
        });
        return totals;
    };

    // Get phase info for a week index
    const getPhaseForWeek = (weekIndex) => {
        const weekNum = weekIndex + 1;
        for (const [, phase] of Object.entries(config.phaseInfo)) {
            if (phase.weeks.includes(weekNum)) {
                return phase;
            }
        }
        return null;
    };

    // Render cell content
    const renderCell = (product, weekLabel) => {
        const dose = calculateDoseForWeek(product, weekLabel);

        if (dose === null) {
            return <span className={styles.emptyCell}>—</span>;
        }

        if (typeof dose === 'string') {
            return <span className={styles.specialCell}>{dose}</span>;
        }

        const totalDose = dose * waterAmount;
        return (
            <div className={styles.doseCell}>
                <span className={styles.doseValue}>{dose}</span>
                <span className={styles.doseUnit}>{product.dose_unit.split(' ')[0]}</span>
                <span className={styles.totalDose}>({totalDose.toFixed(1)})</span>
            </div>
        );
    };

    // Get selected products summary by category
    const selectedProductsSummary = useMemo(() => {
        const summary = {};
        Object.entries(config.productCategories).forEach(([catKey, category]) => {
            const productsInCat = products.filter(
                p => p.category_key === catKey && (selectedProducts.includes(p.id) || selectedProducts.includes(p.sku))
            );
            if (productsInCat.length > 0) {
                summary[catKey] = {
                    category,
                    products: productsInCat,
                    count: productsInCat.length
                };
            }
        });
        return summary;
    }, [selectedProducts, products, config.productCategories]);

    const content = (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* New Hero Section */}
            <div className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    <div className={styles.heroGradient} />
                    <div className={styles.heroPattern} />
                </div>
                <div className={styles.heroContent}>
                    <motion.div
                        className={styles.heroBadge}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className={styles.heroBadgeIcon}>🧬</span>
                        <span>Advanced Nutrients</span>
                    </motion.div>

                    <motion.h1
                        className={styles.heroTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {t('anHeroTitle')}
                    </motion.h1>

                    <motion.p
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {t('anHeroSubtitle')}
                    </motion.p>

                    <motion.div
                        className={styles.heroStats}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className={styles.heroStatItem}>
                            <span className={styles.heroStatIcon}>🔬</span>
                            <div className={styles.heroStatContent}>
                                <span className={styles.heroStatValue}>12</span>
                                <span className={styles.heroStatLabel}>{t('anWeeklyProgram')}</span>
                            </div>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStatItem}>
                            <span className={styles.heroStatIcon}>🧪</span>
                            <div className={styles.heroStatContent}>
                                <span className={styles.heroStatValue}>{Object.keys(PRODUCT_CATEGORIES).length}</span>
                                <span className={styles.heroStatLabel}>{t('anProductCategory')}</span>
                            </div>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStatItem}>
                            <span className={styles.heroStatIcon}>⚗️</span>
                            <div className={styles.heroStatContent}>
                                <span className={styles.heroStatValue}>pH</span>
                                <span className={styles.heroStatLabel}>Perfect Tech</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.heroFeatures}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className={styles.heroFeatureItem}>
                            <span className={styles.heroFeatureIcon}>✨</span>
                            <span>{t('anAutoPHBalance')}</span>
                        </div>
                        <div className={styles.heroFeatureItem}>
                            <span className={styles.heroFeatureIcon}>🎯</span>
                            <span>{t('anPreciseDosage')}</span>
                        </div>
                        <div className={styles.heroFeatureItem}>
                            <span className={styles.heroFeatureIcon}>🏆</span>
                            <span>{t('anFullGuarantee')}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Controls Container */}
            <div className={styles.controls}>

                {/* Base Nutrient Selection - Modern Card Style */}
                <div className={`${styles.controlGroup} ${styles.fullWidth}`}>
                    <label className={styles.controlLabel}>{t('selectRecipe')} ({t('anBaseNutrient')})</label>
                    <motion.div
                        className={styles.baseNutrientSelector}
                        onClick={() => setShowBaseNutrientSelector(!showBaseNutrientSelector)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{ '--selected-color': currentBaseNutrient.color }}
                    >
                        <div className={styles.baseNutrientSelected}>
                            {currentBaseNutrient.image ? (
                                <img
                                    src={currentBaseNutrient.image}
                                    alt={currentBaseNutrient.label}
                                    className={styles.baseNutrientImage}
                                />
                            ) : (
                                <span className={styles.baseNutrientIcon}>{currentBaseNutrient.icon}</span>
                            )}
                            <div className={styles.baseNutrientInfo}>
                                <span className={styles.baseNutrientName}>{currentBaseNutrient.label}</span>
                                <span className={styles.baseNutrientDesc}>{currentBaseNutrient.description}</span>
                            </div>
                            <span className={styles.baseNutrientBadge} style={{ backgroundColor: `${currentBaseNutrient.color}20`, color: currentBaseNutrient.color }}>
                                {currentBaseNutrient.badge}
                            </span>
                        </div>
                        <motion.span
                            className={styles.baseNutrientArrow}
                            animate={{ rotate: showBaseNutrientSelector ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            ▼
                        </motion.span>
                    </motion.div>
                </div>

                {/* Product Selector Toggle */}
                <div className={styles.controlGroup}>
                    <label className={styles.controlLabel}>
                        {t('products')}
                    </label>
                    <motion.div
                        className={styles.productSelectorBtn}
                        onClick={() => setShowProductSelector(!showProductSelector)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <div className={styles.productSelectorSelected}>
                            <span className={styles.productSelectorIcon}>📦</span>
                            <div className={styles.productSelectorInfo}>
                                <span className={styles.productSelectorName}>{selectedProducts.length} {t('productSelected')}</span>
                                <span className={styles.productSelectorDesc}>
                                    {Object.keys(selectedProductsSummary).length} {t('anCategoriesSelected')}
                                </span>
                            </div>
                            <span className={styles.productSelectorCount}>{selectedProducts.length}</span>
                        </div>
                        <motion.span
                            className={styles.productSelectorArrow}
                            animate={{ rotate: showProductSelector ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            ▼
                        </motion.span>
                    </motion.div>
                </div>
            </div>

            {/* Base Nutrient Dropdown */}
            <AnimatePresence>
                {showBaseNutrientSelector && (
                    <motion.div
                        className={styles.baseNutrientDropdown}
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.baseNutrientDropdownHeader}>
                            <h3>🌱 {t('anBaseNutrientSelection')}</h3>
                            <p>{t('anSelectBaseNutrient')}</p>
                        </div>
                        <div className={styles.baseNutrientGrid}>
                            {config.baseNutrientOptions.map((option, index) => (
                                <motion.div
                                    key={option.id}
                                    className={`${styles.baseNutrientCard} ${selectedBaseNutrientId === option.id ? styles.selected : ''}`}
                                    onClick={() => {
                                        setSelectedBaseNutrientId(option.id);
                                        setShowBaseNutrientSelector(false);
                                    }}
                                    style={{ '--card-color': option.color }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2, delay: index * 0.02 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className={styles.baseNutrientCardHeader}>
                                        {option.image ? (
                                            <img
                                                src={option.image}
                                                alt={option.label}
                                                className={styles.baseNutrientCardImage}
                                            />
                                        ) : (
                                            <span className={styles.baseNutrientCardIcon}>{option.icon}</span>
                                        )}
                                        <span
                                            className={styles.baseNutrientCardBadge}
                                            style={{ backgroundColor: `${option.color}20`, color: option.color }}
                                        >
                                            {option.badge}
                                        </span>
                                        {selectedBaseNutrientId === option.id && (
                                            <motion.span
                                                className={styles.baseNutrientCardCheck}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            >
                                                ✓
                                            </motion.span>
                                        )}
                                    </div>
                                    <h4 className={styles.baseNutrientCardName}>{option.label}</h4>
                                    <p className={styles.baseNutrientCardDesc}>{option.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product Selector Dropdown */}
            <AnimatePresence mode="wait">
                {showProductSelector ? (
                    <motion.div
                        key="product-selector"
                        className={styles.productSelector}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.productSelectorHeader}>
                            <h3>{t('selectProducts')}</h3>
                            <div className={styles.productSelectorActions}>
                                <button onClick={selectAllAdditives} className={styles.actionBtn}>
                                    {t('selectAll')}
                                </button>
                                <button onClick={resetToDefault} className={styles.actionBtn}>
                                    {t('resetDefault')}
                                </button>
                                <button onClick={() => setSelectedProducts(currentBaseNutrient.products)} className={styles.actionBtn}>
                                    {t('clearAll')}
                                </button>
                                <button
                                    onClick={() => setShowProductSelector(false)}
                                    className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                >
                                    ✓ {t('anCompleteSelection')}
                                </button>
                            </div>
                        </div>

                        {/* Categorized Product Grid */}
                        <div className={styles.categoryContainer}>
                            {Object.entries(PRODUCT_CATEGORIES).map(([catKey, category]) => {
                                const productsInCategory = productsByCategory[catKey] || [];

                                // Filter: Only show selected base nutrients in base nutrient category
                                const visibleProducts = catKey === 'base_nutrient'
                                    ? productsInCategory.filter(p => currentBaseNutrient.products.includes(p.id))
                                    : productsInCategory;

                                if (visibleProducts.length === 0) return null;

                                const isExpanded = expandedCategories[catKey];
                                const selectedCount = visibleProducts.filter(p => selectedProducts.includes(p.id)).length;

                                return (
                                    <motion.div
                                        key={catKey}
                                        className={styles.categorySection}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {/* Category Header */}
                                        <motion.div
                                            className={styles.categoryHeader}
                                            onClick={() => toggleCategory(catKey)}
                                            style={{ '--category-color': category.color }}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className={styles.categoryHeaderLeft}>
                                                <span className={styles.categoryIcon}>{category.icon}</span>
                                                <div className={styles.categoryInfo}>
                                                    <h4 className={styles.categoryName}>{category.name}</h4>
                                                    <span className={styles.categoryNameEn}>{category.nameEn}</span>
                                                </div>
                                            </div>
                                            <div className={styles.categoryHeaderRight}>
                                                <span className={styles.categoryCount}>
                                                    {selectedCount}/{visibleProducts.length}
                                                </span>
                                                <motion.span
                                                    className={styles.categoryArrow}
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    ▼
                                                </motion.span>
                                            </div>
                                        </motion.div>

                                        {/* Category Description */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <p className={styles.categoryDescription}>
                                                        {category.description}
                                                    </p>

                                                    {/* Products Grid */}
                                                    <div className={styles.categoryProductGrid}>
                                                        {visibleProducts.map((product, index) => {
                                                            const isCurrentBase = currentBaseNutrient.products.includes(product.id);
                                                            const isSelected = selectedProducts.includes(product.id);

                                                            return (
                                                                <motion.div
                                                                    key={product.id}
                                                                    className={`${styles.productCard} ${isSelected ? styles.selected : ''} ${isCurrentBase ? styles.locked : ''}`}
                                                                    onClick={() => toggleProduct(product.id)}
                                                                    style={{
                                                                        borderColor: isSelected ? product.color : 'transparent',
                                                                        '--product-color': product.color
                                                                    }}
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                                                    whileHover={{ scale: isCurrentBase ? 1 : 1.03, y: isCurrentBase ? 0 : -2 }}
                                                                    whileTap={{ scale: isCurrentBase ? 1 : 0.98 }}
                                                                >
                                                                    {product.image && (
                                                                        <div className={styles.productImageContainer}>
                                                                            <img
                                                                                src={product.image}
                                                                                alt={product.product_name}
                                                                                className={styles.productImage}
                                                                                loading="lazy"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className={styles.productCardHeader}>
                                                                        <span
                                                                            className={styles.productColorDot}
                                                                            style={{ backgroundColor: product.color }}
                                                                        />
                                                                        <span className={styles.productName}>{product.product_name}</span>
                                                                        {isSelected && (
                                                                            <motion.span
                                                                                className={styles.checkmark}
                                                                                initial={{ scale: 0 }}
                                                                                animate={{ scale: 1 }}
                                                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                            >
                                                                                ✓
                                                                            </motion.span>
                                                                        )}
                                                                    </div>
                                                                    {product.function_key && (
                                                                        <div className={styles.productFunction}>{t(product.function_key)}</div>
                                                                    )}
                                                                    {isCurrentBase && (
                                                                        <div className={styles.lockedBadge}>🔒 {t('anBase')}</div>
                                                                    )}
                                                                </motion.div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    /* Product Selection Summary - When collapsed */
                    <motion.div
                        key="product-summary"
                        className={styles.productSummary}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.productSummaryHeader}>
                            <div className={styles.productSummaryTitle}>
                                <span className={styles.productSummaryIcon}>📋</span>
                                <div>
                                    <h4>{t('anSelectedProducts')}</h4>
                                    <span className={styles.productSummaryCount}>
                                        {selectedProducts.length} {t('anProductsSelected')}
                                    </span>
                                </div>
                            </div>
                            <motion.button
                                className={styles.productSummaryEditBtn}
                                onClick={() => setShowProductSelector(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>✏️</span> {t('anEdit')}
                            </motion.button>
                        </div>

                        <div className={styles.productSummaryGrid}>
                            {Object.entries(selectedProductsSummary).map(([catKey, data]) => (
                                <motion.div
                                    key={catKey}
                                    className={styles.productSummaryCategory}
                                    style={{ '--category-color': data.category.color }}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={styles.productSummaryCategoryHeader}>
                                        <span className={styles.productSummaryCategoryIcon}>{data.category.icon}</span>
                                        <span className={styles.productSummaryCategoryName}>{data.category.name}</span>
                                        <span className={styles.productSummaryCategoryCount}>{data.count}</span>
                                    </div>
                                    <div className={styles.productSummaryItems}>
                                        {data.products.slice(0, 3).map(product => (
                                            <span
                                                key={product.id}
                                                className={styles.productSummaryItem}
                                                style={{ borderColor: product.color }}
                                            >
                                                <span
                                                    className={styles.productSummaryDot}
                                                    style={{ backgroundColor: product.color }}
                                                />
                                                {product.product_name.replace(/[®™]/g, '')}
                                            </span>
                                        ))}
                                        {data.products.length > 3 && (
                                            <span className={styles.productSummaryMore}>
                                                +{data.products.length - 3} {t('anMore')}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Phase Legend */}
            <div className={styles.phaseLegend}>
                {Object.entries(PHASE_INFO).map(([key, phase]) => (
                    <div key={key} className={styles.phaseItem}>
                        <span
                            className={styles.phaseColor}
                            style={{ backgroundColor: phase.color }}
                        />
                        <span className={styles.phaseLabel}>{t(phase.label_key)}</span>
                    </div>
                ))}
            </div>

            {/* Table Controls - Water Amount */}
            <div className={styles.tableControls}>
                <div className={styles.tableControlsInner}>
                    {/* Water Amount Control */}
                    <div className={styles.waterControl}>
                        <div className={styles.waterControlIcon}>💧</div>
                        <div className={styles.waterControlContent}>
                            <label className={styles.waterControlLabel}>{t('waterAmount')}</label>
                            <div className={styles.waterControlInput}>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={waterAmount}
                                    onChange={(e) => setWaterAmount(Math.max(1, Math.min(100, Number(e.target.value))))}
                                    className={styles.waterInput}
                                />
                                <span className={styles.waterUnit}>L</span>
                            </div>
                        </div>
                    </div>

                    {/* Week Info */}
                    <div className={styles.weekInfo}>
                        <div className={styles.weekInfoItem}>
                            <span className={styles.weekInfoIcon}>🌱</span>
                            <span className={styles.weekInfoText}>{t('anVegetative')}: 4 {t('anWeeks')}</span>
                        </div>
                        <div className={styles.weekInfoItem}>
                            <span className={styles.weekInfoIcon}>🌸</span>
                            <span className={styles.weekInfoText}>{t('anFlowering')}: 8 {t('anWeeks')}</span>
                        </div>
                        <div className={styles.weekInfoItem}>
                            <span className={styles.weekInfoIcon}>📅</span>
                            <span className={styles.weekInfoText}>{t('anTotal')}: 12 {t('anWeeks')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.scheduleTable}>
                    <thead>
                        <tr>
                            <th className={styles.productHeader}>
                                {t('product')}
                            </th>
                            <th className={styles.unitHeader}>
                                {t('unit')}
                            </th>
                            {config.weekLabels.map((week, index) => {
                                const phase = getPhaseForWeek(index);
                                return (
                                    <th
                                        key={week}
                                        className={`${styles.weekHeader} ${highlightedWeek === index ? styles.highlighted : ''}`}
                                        style={{
                                            backgroundColor: phase ? `${phase.color}20` : 'transparent',
                                            borderTopColor: phase?.color
                                        }}
                                        onMouseEnter={() => setHighlightedWeek(index)}
                                        onMouseLeave={() => setHighlightedWeek(null)}
                                    >
                                        <div className={styles.weekLabel}>{week}</div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {activeProducts.map(product => {
                                // Only show product if it has a schedule for current selection
                                if (!getSchedule(product)) return null;

                                return (
                                    <motion.tr
                                        key={product.id}
                                        className={styles.productRow}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <td className={styles.productCell}>
                                            <div className={styles.productInfo}>
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.product_name}
                                                        className={styles.productCellImage}
                                                    />
                                                ) : (
                                                    <span
                                                        className={styles.productDot}
                                                        style={{ backgroundColor: product.color }}
                                                    />
                                                )}
                                                <div>
                                                    <div className={styles.productTitle}>{product.product_name}</div>
                                                    <div className={styles.productSubtitle}>{product.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.unitCell}>
                                            <span className={styles.unitBadge}>{product.dose_unit}</span>
                                        </td>
                                        {config.weekLabels.map((week, index) => {
                                            const phase = getPhaseForWeek(index);
                                            return (
                                                <td
                                                    key={week}
                                                    className={`${styles.doseCell} ${highlightedWeek === index ? styles.highlighted : ''}`}
                                                    style={{ backgroundColor: phase ? `${phase.color}08` : 'transparent' }}
                                                >
                                                    {renderCell(product, week)}
                                                </td>
                                            );
                                        })}
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>

                        {/* Totals Row */}
                        {activeProducts.length > 0 && (
                            <tr className={styles.totalsRow}>
                                <td className={styles.totalsLabel} colSpan={2}>
                                    <strong>📊 {t('totalForWater')} ({waterAmount}L {t('water')})</strong>
                                </td>
                                {config.weekLabels.map((week, index) => {
                                    const totals = calculateTotalForWeek(week);
                                    const phase = getPhaseForWeek(index);
                                    return (
                                        <td
                                            key={week}
                                            className={`${styles.totalsCell} ${highlightedWeek === index ? styles.highlighted : ''}`}
                                            style={{ backgroundColor: phase ? `${phase.color}15` : 'transparent' }}
                                        >
                                            {Object.entries(totals).map(([unit, total]) => (
                                                <div key={unit} className={styles.totalValue}>
                                                    {total.toFixed(1)} {unit.split(' ')[0]}
                                                </div>
                                            ))}
                                        </td>
                                    );
                                })}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ========================================
                GLASSMORPHIC INFO SECTIONS
               ======================================== */}

            {/* Info Hero Section */}
            <motion.div
                className={styles.infoHero}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className={styles.infoHeroContent}>
                    <h2 className={styles.infoHeroTitle}>
                        🌱 {t('anFeedingGuideTitle')}
                    </h2>
                    <p className={styles.infoHeroDescription}>
                        {t('anFeedingGuideDesc')}
                    </p>
                    <div className={styles.infoHeroStats}>
                        <div className={styles.infoHeroStat}>
                            <span className={styles.infoHeroStatValue}>12</span>
                            <span className={styles.infoHeroStatLabel}>{t('anWeeklyProgram')}</span>
                        </div>
                        <div className={styles.infoHeroStat}>
                            <span className={styles.infoHeroStatValue}>{BASE_NUTRIENT_OPTIONS.length}</span>
                            <span className={styles.infoHeroStatLabel}>{t('anNutrientSeries')}</span>
                        </div>
                        <div className={styles.infoHeroStat}>
                            <span className={styles.infoHeroStatValue}>pH</span>
                            <span className={styles.infoHeroStatLabel}>Perfect Tech</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Lifecycle Phases */}
            <div className={styles.lifecycleSection}>
                <h3 className={styles.seriesSectionTitle}>{t('anLifecyclePhasesTitle')}</h3>
                <div className={styles.lifecycleGrid}>
                    {config.lifecyclePhases.map((phase, index) => (
                        <motion.div
                            key={phase.id}
                            className={styles.lifecycleCard}
                            style={{ '--phase-color': phase.color }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className={styles.lifecycleIcon}>{phase.icon}</div>
                            <h4 className={styles.lifecycleTitle}>{t(phase.titleKey)}</h4>
                            <span className={styles.lifecycleDuration}>~{phase.durationWeeks || ''} {phase.durationWeeks ? t('anWeeks') : t(phase.durationKey)}</span>
                            <div className={styles.lifecycleLight}>
                                ☀️ {t('anPhotoperiod')}: {phase.light}
                            </div>
                            <p className={styles.lifecycleDesc}>{t(phase.descriptionKey)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Product Series */}
            <div className={styles.seriesSection}>
                <h3 className={styles.seriesSectionTitle}>{t('anFeaturedNutrientSeries')}</h3>
                <div className={styles.seriesCards}>
                    {config.nutrientSeries.map((series, index) => (
                        <motion.div
                            key={series.id}
                            className={styles.seriesCard}
                            style={{ '--series-color': series.color }}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className={styles.seriesCardHeader}>
                                <span className={styles.seriesCardBadge}>{series.badge}</span>
                            </div>
                            <h4 className={styles.seriesCardName}>{series.name}</h4>
                            <p className={styles.seriesCardDesc}>{t(series.descriptionKey)}</p>
                            <div className={styles.seriesCardFeatures}>
                                {series.features.map((feature, i) => (
                                    <span key={i} className={styles.seriesFeatureTag}>{feature}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Supplement Categories */}
            <div className={styles.glassGrid}>
                {config.supplementCategories.map((cat, index) => (
                    <motion.div
                        key={index}
                        className={styles.glassCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <div className={styles.glassCardIcon}>{cat.icon}</div>
                        <h4 className={styles.glassCardTitle}>{t(cat.titleKey)}</h4>
                        <p className={styles.glassCardText}>{t(cat.descriptionKey)}</p>
                    </motion.div>
                ))}
            </div>

            {/* Pro Tips Section */}
            <motion.div
                className={styles.proTipsSection}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.proTipsHeader}>
                    <div className={styles.proTipsIcon}>💡</div>
                    <h3 className={styles.proTipsTitle}>{t('anProTipsTitle')}</h3>
                </div>
                <div className={styles.proTipsList}>
                    {config.proTipsKeys.map((tipKey, index) => (
                        <motion.div
                            key={index}
                            className={styles.proTipItem}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <span className={styles.proTipNumber}>{index + 1}</span>
                            <p className={styles.proTipText}>{t(tipKey)}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Application Guidelines Accordion */}
            <div className={styles.accordion}>
                <h3 className={styles.seriesSectionTitle}>{t('anApplicationGuide')}</h3>

                <motion.div className={styles.accordionItem} initial={false}>
                    <div
                        className={styles.accordionHeader}
                        onClick={() => setOpenAccordion(openAccordion === 'dosage' ? null : 'dosage')}
                    >
                        <div className={styles.accordionHeaderLeft}>
                            <span className={styles.accordionIcon}>📏</span>
                            <span className={styles.accordionTitle}>{t('anApplicationRates')}</span>
                        </div>
                        <motion.span
                            className={styles.accordionArrow}
                            animate={{ rotate: openAccordion === 'dosage' ? 180 : 0 }}
                        >
                            ▼
                        </motion.span>
                    </div>
                    <AnimatePresence>
                        {openAccordion === 'dosage' && (
                            <motion.div
                                className={styles.accordionContent}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>{t('anApplicationRatesDesc')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div className={styles.accordionItem} initial={false}>
                    <div
                        className={styles.accordionHeader}
                        onClick={() => setOpenAccordion(openAccordion === 'flush' ? null : 'flush')}
                    >
                        <div className={styles.accordionHeaderLeft}>
                            <span className={styles.accordionIcon}>🚿</span>
                            <span className={styles.accordionTitle}>{t('anPreHarvestFlush')}</span>
                        </div>
                        <motion.span
                            className={styles.accordionArrow}
                            animate={{ rotate: openAccordion === 'flush' ? 180 : 0 }}
                        >
                            ▼
                        </motion.span>
                    </div>
                    <AnimatePresence>
                        {openAccordion === 'flush' && (
                            <motion.div
                                className={styles.accordionContent}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>{t('anPreHarvestFlushDesc')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div className={styles.accordionItem} initial={false}>
                    <div
                        className={styles.accordionHeader}
                        onClick={() => setOpenAccordion(openAccordion === 'coco' ? null : 'coco')}
                    >
                        <div className={styles.accordionHeaderLeft}>
                            <span className={styles.accordionIcon}>🥥</span>
                            <span className={styles.accordionTitle}>{t('anCocoNotes')}</span>
                        </div>
                        <motion.span
                            className={styles.accordionArrow}
                            animate={{ rotate: openAccordion === 'coco' ? 180 : 0 }}
                        >
                            ▼
                        </motion.span>
                    </div>
                    <AnimatePresence>
                        {openAccordion === 'coco' && (
                            <motion.div
                                className={styles.accordionContent}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>{t('anCocoNotesDesc')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div className={styles.accordionItem} initial={false}>
                    <div
                        className={styles.accordionHeader}
                        onClick={() => setOpenAccordion(openAccordion === 'customize' ? null : 'customize')}
                    >
                        <div className={styles.accordionHeaderLeft}>
                            <span className={styles.accordionIcon}>⚙️</span>
                            <span className={styles.accordionTitle}>{t('anCustomization')}</span>
                        </div>
                        <motion.span
                            className={styles.accordionArrow}
                            animate={{ rotate: openAccordion === 'customize' ? 180 : 0 }}
                        >
                            ▼
                        </motion.span>
                    </div>
                    <AnimatePresence>
                        {openAccordion === 'customize' && (
                            <motion.div
                                className={styles.accordionContent}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>{t('anCustomizationDesc')} <a href="https://www.advancednutrients.com/nutrient-calculator" target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e' }}>advancednutrients.com/nutrient-calculator</a></p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Guarantee Banner */}
            <motion.div
                className={styles.guaranteeBanner}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <span className={styles.guaranteeIcon}>🏆</span>
                <div className={styles.guaranteeContent}>
                    <h3>{t('anGrowerGuarantee')}</h3>
                    <p>{t('anGrowerGuaranteeDesc')}</p>
                </div>
                <div className={styles.guaranteeYear}>
                    <span className={styles.guaranteeYearValue}>1999</span>
                    <span className={styles.guaranteeYearLabel}>{t('anSince')}</span>
                </div>
            </motion.div>
        </motion.div>
    );

    return (
        <div className={styles.pageContainer}>
            <Helmet>
                <title>{t('anFeedingScheduleTitle')} | GroWizard</title>
            </Helmet>
            <Navbar />
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner} />
                    <p>{t('loading') || 'Loading...'}</p>
                </div>
            ) : (
                content
            )}
            <Footer />
        </div>
    );
}
