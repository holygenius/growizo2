import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import {
    CANNA_SYSTEMS,
    SYSTEM_INFO,
    PLANT_INFO,
    PRODUCT_CATEGORIES,
    DEFAULT_SELECTED_PRODUCTS,
    EC_NOTE
} from '../../data/cannaData';
import { productService } from '../../services/productService';
import { brandService } from '../../services/brandService';
import { supabase } from '../../services/supabase';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './CannaSchedule.module.css'; // Dedicated CANNA styles
import { motion, AnimatePresence } from 'framer-motion';

// System colors for cards
const SYSTEM_COLORS = {
    aqua: { primary: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    coco: { primary: '#92400e', bg: 'rgba(146, 64, 14, 0.15)' },
    cogr: { primary: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)' },
    substra: { primary: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    terra: { primary: '#78350f', bg: 'rgba(120, 53, 15, 0.15)' }
};

// Animation variants - used by framer-motion components

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    }
};

// System descriptions for info section
const SYSTEM_DESCRIPTIONS = {
    aqua: {
        title_key: 'cannaAquaTitle',
        features: [
            { icon: '🔄', text_key: 'cannaAquaFeature1' },
            { icon: '⚗️', text_key: 'cannaAquaFeature2' },
            { icon: '🎯', text_key: 'cannaAquaFeature3' }
        ]
    },
    coco: {
        title_key: 'cannaCocoTitle',
        features: [
            { icon: '🥥', text_key: 'cannaCocoFeature1' },
            { icon: '🧪', text_key: 'cannaCocoFeature2' },
            { icon: '🌱', text_key: 'cannaCocoFeature3' }
        ]
    },
    cogr: {
        title_key: 'cannaCOGrTitle',
        features: [
            { icon: '📦', text_key: 'cannaCOGrFeature1' },
            { icon: '⚗️', text_key: 'cannaCOGrFeature2' },
            { icon: '🎓', text_key: 'cannaCOGrFeature3' }
        ]
    },
    substra: {
        title_key: 'cannaSubstraTitle',
        features: [
            { icon: '🚿', text_key: 'cannaSubstraFeature1' },
            { icon: '💧', text_key: 'cannaSubstraFeature2' },
            { icon: '🔬', text_key: 'cannaSubstraFeature3' }
        ]
    },
    terra: {
        title_key: 'cannaTerraTitle',
        features: [
            { icon: '🌍', text_key: 'cannaTerraFeature1' },
            { icon: '🏠', text_key: 'cannaTerraFeature2' },
            { icon: '✨', text_key: 'cannaTerraFeature3' }
        ]
    }
};

export default function CannaSchedule() {
    const { t, language } = useSettings();

    // State
    // State
    const [selectedSystem, setSelectedSystem] = useState(CANNA_SYSTEMS.COCO);
    const [selectedPlant, setSelectedPlant] = useState('general');
    const [waterType, setWaterType] = useState('hard'); // For SUBSTRA system
    const [selectedProducts, setSelectedProducts] = useState(DEFAULT_SELECTED_PRODUCTS.coco || []);
    const [waterAmount, setWaterAmount] = useState(10);
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [highlightedWeek, setHighlightedWeek] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(PRODUCT_CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    const [products, setProducts] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch data
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const brand = await brandService.getBrandBySlug('canna');
                if (!brand) throw new Error('Brand not found');

                // Products
                const fetchedProducts = await productService.getProducts(brand.id);
                // Map mapping 
                const mappedProducts = fetchedProducts.map(p => ({
                    ...p,
                    id: p.sku, // Use SKU as ID to match legacy selection logic
                    _uuid: p.id,
                    system: p.specs?.system || 'all',
                    category_key: p.specs?.category_key || 'base_nutrient',
                    function_key: p.specs?.function_key || 'funcBaseNutrientVeg',
                    dose_unit: p.specs?.dose_unit || 'ml/L',
                    color: p.color || '#22C55E'
                }));
                setProducts(mappedProducts);

                // Schedules
                const { data: fetchedSchedules, error } = await supabase
                    .from('feeding_schedules')
                    .select('*')
                    .eq('brand_id', brand.id);

                if (error) throw error;
                setSchedules(fetchedSchedules);

            } catch (err) {
                console.error('Error loading CANNA data:', err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // currentSystemInfo removed - using SYSTEM_INFO directly

    // Get available plants for current system
    const availablePlants = useMemo(() => {
        if (!schedules.length) return ['general'];
        const plants = schedules
            .filter(s => s.substrate_type === selectedSystem)
            .map(s => s.schedule_data?.plant_key)
            .filter(Boolean);
        return [...new Set(plants)]; // Unique plants
    }, [selectedSystem, schedules]);

    // Get current schedule
    const currentSchedule = useMemo(() => {
        const schedule = schedules.find(s =>
            s.substrate_type === selectedSystem &&
            s.schedule_data?.plant_key === selectedPlant
        );
        return schedule ? schedule.schedule_data : null;
    }, [selectedSystem, selectedPlant, schedules]);

    // Get products for current system
    const systemProducts = useMemo(() => {
        return products.filter(p =>
            p.system === selectedSystem || p.system === 'all'
        );
    }, [selectedSystem, products]);

    // Group products by category
    const productsByCategory = useMemo(() => {
        const grouped = {};
        Object.keys(PRODUCT_CATEGORIES).forEach(catKey => {
            grouped[catKey] = systemProducts.filter(p => p.category_key === catKey);
        });
        return grouped;
    }, [systemProducts]);

    // Handle system change
    const handleSystemChange = (newSystem) => {
        setSelectedSystem(newSystem);
        setSelectedPlant('general');
        setSelectedProducts(DEFAULT_SELECTED_PRODUCTS[newSystem] || []);
    };

    // Handle plant change
    const handlePlantChange = (plant) => {
        setSelectedPlant(plant);
    };

    // Toggle product selection
    const toggleProduct = (productId) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    // Toggle category expansion
    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    // Select all products
    const selectAll = () => {
        const allProducts = systemProducts.map(p => p.id);
        setSelectedProducts(allProducts);
    };

    // Reset to default
    const resetToDefault = () => {
        setSelectedProducts(DEFAULT_SELECTED_PRODUCTS[selectedSystem] || []);
    };

    // Get active products with translations
    const activeProducts = useMemo(() => {
        return systemProducts.filter(product =>
            selectedProducts.includes(product.id)
        ).map(product => ({
            ...product,
            category: t(product.category_key) || product.category_key,
            function: t(product.function_key) || product.function_key,
        }));
    }, [selectedProducts, systemProducts, t]);

    // Get week labels from schedule - handle both week-based and stage-based formats
    const weekLabels = useMemo(() => {
        if (!currentSchedule) return [];

        // For week-based schedules (general plants)
        if (currentSchedule.weeks && currentSchedule.weeks.length > 0) {
            return currentSchedule.weeks;
        }

        // For stage-based schedules (specific plants like wasabi, orchids, etc.)
        if (currentSchedule.stages && currentSchedule.stages.length > 0) {
            return currentSchedule.stages.map(stage => stage.name);
        }

        return ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];
    }, [currentSchedule]);

    // Check if schedule is stage-based (non-week format)
    const isStageBasedSchedule = useMemo(() => {
        return currentSchedule && !currentSchedule.weeks && currentSchedule.stages;
    }, [currentSchedule]);

    // Get dose for a specific week/stage and product
    const getDoseForWeek = (productId, weekLabel) => {
        if (!currentSchedule) return null;

        let products = currentSchedule.products;

        // Handle SUBSTRA water type
        if (selectedSystem === 'substra') {
            products = waterType === 'hard'
                ? currentSchedule.products_hard_water
                : currentSchedule.products_soft_water;
        }

        if (!products || !products[productId]) return null;

        const dose = products[productId][weekLabel];
        return dose !== undefined ? dose : null;
    };

    // Calculate dose for cell
    const calculateDoseForWeek = (product, weekLabel) => {
        const dose = getDoseForWeek(product.id, weekLabel);
        if (dose === null) return null;
        return dose;
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
            <div className={styles.doseContent}>
                <span className={styles.doseValue}>{dose}</span>
                <span className={styles.doseUnit}>{product.dose_unit.split(' ')[0]}</span>
                <span className={styles.totalDose}>({totalDose.toFixed(1)})</span>
            </div>
        );
    };

    // Calculate total for a week
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

    // Get phase for week (simplified) - handles both phase object format and stage-based
    const getPhaseForWeek = (weekLabel) => {
        if (!currentSchedule) return null;

        // For stage-based schedules, extract phase from stage name
        if (isStageBasedSchedule) {
            const stageName = weekLabel.toLowerCase();
            if (stageName.includes('rooting') || stageName.includes('start')) return 'rooting';
            if (stageName.includes('vegetative') || stageName.includes('veg')) return 'vegetative';
            if (stageName.includes('generative') || stageName.includes('flower') || stageName.includes('gen')) return 'generative1';
            if (stageName.includes('final') || stageName.includes('recovery') || stageName.includes('dormancy')) return 'flush';
            return null;
        }

        if (!currentSchedule.phases) return null;

        for (const [range, phaseName] of Object.entries(currentSchedule.phases)) {
            const [start, end] = range.replace('W', '').split('-').map(n => parseInt(n.replace('W', '')));
            const weekNum = parseInt(weekLabel.replace('W', ''));

            if (end) {
                if (weekNum >= start && weekNum <= end) return phaseName;
            } else {
                if (weekNum === start) return phaseName;
            }
        }
        return null;
    };

    // Get stage info for display
    const getStageInfo = (stageName) => {
        if (!currentSchedule?.stages) return null;
        return currentSchedule.stages.find(s => s.name === stageName);
    };

    // Phase colors
    const phaseColors = {
        rooting: '#8B5CF6',
        vegetative: '#22C55E',
        flowering: '#EC4899',
        ripening: '#F59E0B',
        flush: '#6B7280',
        generative1: '#F59E0B',
        generative2: '#EC4899',
        generative3: '#EF4444'
    };

    return (
        <div className={styles.pageWrapper}>
            <Helmet>
                <title>{t('cannaFeedingScheduleTitle')} | GroWizard</title>
                <meta name="description" content={t('cannaFeedingScheduleDesc')} />
            </Helmet>
            <Navbar />

            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Hero Section */}
                <div className={styles.heroSection}>
                    <div className={styles.heroBackground}>
                        <div className={styles.heroGradient} />
                        <div className={styles.heroPattern} />
                    </div>
                    <div className={styles.heroContent}>
                        {/* CANNA Logo */}
                        <motion.div
                            className={styles.logoContainer}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        >
                            <img
                                src="/images/canna-logo.svg"
                                alt="CANNA"
                                className={styles.cannaLogo}
                            />
                        </motion.div>

                        <motion.h1
                            className={styles.heroTitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {t('cannaProfessional')} <span className={styles.heroTitleHighlight}>{t('cannaFeedingSchedule')}</span>
                        </motion.h1>

                        <motion.p
                            className={styles.heroSubtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {t('cannaHeroSubtitle')}
                        </motion.p>

                        <motion.div
                            className={styles.heroStats}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className={styles.heroStatItem}>
                                <div className={styles.heroStatIcon}>🔬</div>
                                <div className={styles.heroStatContent}>
                                    <span className={styles.heroStatValue}>5</span>
                                    <span className={styles.heroStatLabel}>{t('cannaSystems')}</span>
                                </div>
                            </div>
                            <div className={styles.heroStatDivider} />
                            <div className={styles.heroStatItem}>
                                <div className={styles.heroStatIcon}>🌱</div>
                                <div className={styles.heroStatContent}>
                                    <span className={styles.heroStatValue}>7</span>
                                    <span className={styles.heroStatLabel}>{t('cannaPlantTypes')}</span>
                                </div>
                            </div>
                            <div className={styles.heroStatDivider} />
                            <div className={styles.heroStatItem}>
                                <div className={styles.heroStatIcon}>🧪</div>
                                <div className={styles.heroStatContent}>
                                    <span className={styles.heroStatValue}>20+</span>
                                    <span className={styles.heroStatLabel}>{t('cannaProducts')}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* System Selection Cards - NEW FEATURE */}
                <motion.section
                    className={styles.systemInfoSection}
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <div className={styles.systemInfoGrid}>
                        {Object.values(SYSTEM_INFO).map((system) => (
                            <motion.div
                                key={system.id}
                                className={`${styles.systemCard} ${selectedSystem === system.id ? styles.selected : ''}`}
                                style={{ '--system-color': SYSTEM_COLORS[system.id]?.bg }}
                                variants={cardVariants}
                                onClick={() => handleSystemChange(system.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={styles.systemCardContent}>
                                    <span className={styles.systemCardIcon}>{system.icon}</span>
                                    <h3 className={styles.systemCardName}>{system.name}</h3>
                                    <p className={styles.systemCardDesc}>
                                        {system.features?.slice(0, 2).join(' • ')}
                                    </p>
                                    <div className={styles.systemCardFeatures}>
                                        {system.features?.slice(0, 2).map((feature, idx) => (
                                            <span key={idx} className={styles.systemFeatureTag}>
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {selectedSystem === system.id && (
                                    <motion.div
                                        className={styles.systemCardCheck}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        ✓
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Controls Section */}
                <div className={styles.controls}>
                    {/* Plant Type Selector (if available) */}
                    {availablePlants.length > 1 && (
                        <div className={`${styles.controlGroup} ${styles.fullWidth}`}>
                            <label className={styles.controlLabel}>
                                {t('cannaSelectPlantType')}
                            </label>
                            <div className={styles.plantSelector}>
                                {availablePlants.map(plant => (
                                    <motion.button
                                        key={plant}
                                        className={`${styles.plantBtn} ${selectedPlant === plant ? styles.selected : ''}`}
                                        onClick={() => handlePlantChange(plant)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span>{PLANT_INFO[plant]?.icon || '🌿'}</span>
                                        <span>{t(PLANT_INFO[plant]?.name_key) || plant}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Water Type for SUBSTRA */}
                    {selectedSystem === 'substra' && (
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel}>
                                {t('cannaWaterType')}
                            </label>
                            <div className={styles.waterTypeSelector}>
                                <motion.button
                                    className={`${styles.waterTypeBtn} ${waterType === 'hard' ? styles.selected : ''}`}
                                    onClick={() => setWaterType('hard')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    💎 {t('cannaHardWater')}
                                </motion.button>
                                <motion.button
                                    className={`${styles.waterTypeBtn} ${waterType === 'soft' ? styles.selected : ''}`}
                                    onClick={() => setWaterType('soft')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    💧 {t('cannaSoftWater')}
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {/* Product Selector Toggle */}
                    <div className={`${styles.controlGroup} ${styles.fullWidth}`}>
                        <label className={styles.controlLabel}>
                            {t('cannaSelectProducts')}
                        </label>
                        <motion.button
                            className={styles.productSelectorBtn}
                            onClick={() => setShowProductSelector(!showProductSelector)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className={styles.productSelectorSelected}>
                                <div className={styles.productSelectorIcon}>🧪</div>
                                <div className={styles.productSelectorInfo}>
                                    <span className={styles.productSelectorName}>
                                        {t('cannaProducts')}
                                    </span>
                                    <span className={styles.productSelectorDesc}>
                                        {t('cannaClickToSelect')}
                                    </span>
                                </div>
                            </div>
                            <span className={styles.productSelectorCount}>
                                {selectedProducts.length} {t('cannaSelected')}
                            </span>
                            <motion.span
                                className={styles.productSelectorArrow}
                                animate={{ rotate: showProductSelector ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                ▼
                            </motion.span>
                        </motion.button>
                    </div>
                </div>

                {/* Product Selector Dropdown */}
                <AnimatePresence>
                    {showProductSelector && (
                        <motion.div
                            className={styles.productSelector}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={styles.productSelectorHeader}>
                                <h3>{t('selectProducts')}</h3>
                                <div className={styles.productSelectorActions}>
                                    <button onClick={selectAll} className={styles.actionBtn}>
                                        {t('cannaSelectAll')}
                                    </button>
                                    <button onClick={resetToDefault} className={styles.actionBtn}>
                                        {t('resetDefault')}
                                    </button>
                                    <button
                                        onClick={() => setShowProductSelector(false)}
                                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                    >
                                        ✓ {t('cannaDone')}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.categoryContainer}>
                                {Object.entries(PRODUCT_CATEGORIES).map(([catKey, category]) => {
                                    const productsInCategory = productsByCategory[catKey] || [];
                                    if (productsInCategory.length === 0) return null;

                                    const isExpanded = expandedCategories[catKey];
                                    const selectedCount = productsInCategory.filter(p => selectedProducts.includes(p.id)).length;

                                    return (
                                        <motion.div
                                            key={catKey}
                                            className={styles.categorySection}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
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
                                                    </div>
                                                </div>
                                                <div className={styles.categoryHeaderRight}>
                                                    <span className={styles.categoryCount}>
                                                        {selectedCount}/{productsInCategory.length}
                                                    </span>
                                                    <motion.span
                                                        className={styles.categoryArrow}
                                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    >
                                                        ▼
                                                    </motion.span>
                                                </div>
                                            </motion.div>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {/* Category Description if available */}
                                                        <p className={styles.categoryDescription}>
                                                            {language === 'tr'
                                                                ? (category.description_tr || category.name)
                                                                : (category.description_en || category.name)
                                                            }
                                                        </p>

                                                        {/* Products Grid */}
                                                        <div className={styles.categoryProductGrid}>
                                                            {productsInCategory.map((product, index) => {
                                                                const isSelected = selectedProducts.includes(product.id);

                                                                return (
                                                                    <motion.div
                                                                        key={product.id}
                                                                        className={`${styles.productCard} ${isSelected ? styles.selected : ''}`}
                                                                        onClick={() => toggleProduct(product.id)}
                                                                        style={{
                                                                            borderColor: isSelected ? product.color : 'transparent',
                                                                            '--product-color': product.color
                                                                        }}
                                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                                                        whileHover={{ scale: 1.03, y: -2 }}
                                                                        whileTap={{ scale: 0.98 }}
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
                                                                        {product.short_info && (
                                                                            <div className={styles.productFunction}>
                                                                                {language === 'tr' ? product.short_info.tr : product.short_info.en}
                                                                            </div>
                                                                        )}
                                                                        {product.tags && product.tags.length > 0 && (
                                                                            <div className={styles.productTags}>
                                                                                {product.tags.slice(0, 3).map((tag, idx) => (
                                                                                    <span key={idx} className={styles.productTag}>
                                                                                        #{tag}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
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
                    )}
                </AnimatePresence>

                {/* Water Amount - Above Table */}
                <motion.div
                    className={styles.waterAmountSection}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className={styles.waterAmountLabel}>💧 {t('waterAmount')}</label>
                    <div className={styles.waterAmountInput}>
                        <input
                            type="number"
                            value={waterAmount}
                            onChange={(e) => setWaterAmount(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max="1000"
                            className={styles.numberInput}
                        />
                        <span className={styles.inputUnit}>L</span>
                    </div>
                    <span className={styles.waterAmountHint}>
                        {t('cannaWaterAmountHint')}
                    </span>
                </motion.div>

                {/* Schedule Table */}
                {activeProducts.length > 0 ? (
                    <motion.div
                        className={styles.tableContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* EC Range Info */}
                        {currentSchedule?.ec_range && (
                            <div className={styles.ecInfo}>
                                <span className={styles.ecLabel}>EC+ {t('cannaEcRange')}:</span>
                                <span className={styles.ecValue}>
                                    {currentSchedule.ec_range.min} - {currentSchedule.ec_range.max} {currentSchedule.ec_range.unit}
                                </span>
                                <span className={styles.ecNote}>
                                    {language === 'tr' ? EC_NOTE.text_tr : EC_NOTE.text_en}
                                </span>
                            </div>
                        )}

                        {/* Stages Info Table */}
                        {currentSchedule?.stages && currentSchedule.stages.length > 0 && (
                            <motion.div
                                className={styles.stagesInfoSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3 className={styles.stagesTitle}>
                                    📊 {t('cannaStageDetails')}
                                </h3>
                                <div className={styles.stagesTableWrapper}>
                                    <table className={styles.stagesTable}>
                                        <thead>
                                            <tr>
                                                <th>{t('cannaStage')}</th>
                                                <th>{t('cannaDuration')}</th>
                                                <th>💡 {t('cannaLight')}</th>
                                                <th>EC+</th>
                                                <th>PPM+</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentSchedule.stages.map((stage, index) => (
                                                <tr key={index}>
                                                    <td className={styles.stageNameCell}>
                                                        <span className={styles.stageName}>{t(stage.name_key) || stage.name}</span>
                                                        {(stage.description_key || stage.description) && (
                                                            <span className={styles.stageDesc}>{t(stage.description_key) || stage.description}</span>
                                                        )}
                                                    </td>
                                                    <td className={styles.stageDuration}>{stage.duration}</td>
                                                    <td className={styles.stageLight}>
                                                        {stage.light_hours_key ? t(stage.light_hours_key) : (stage.light_hours ? `${stage.light_hours}h` : '—')}
                                                    </td>
                                                    <td className={styles.stageEc}>{stage.ec_plus || '—'}</td>
                                                    <td className={styles.stagePpm}>{stage.ppm_plus || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* Phase Legend */}
                        <motion.div
                            className={styles.phaseLegend}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {Object.entries(phaseColors).slice(0, 5).map(([phase, color]) => (
                                <div key={phase} className={styles.phaseItem}>
                                    <div
                                        className={styles.phaseColor}
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className={styles.phaseLabel}>
                                        {phase === 'rooting' ? t('cannaPhaseRooting') :
                                            phase === 'vegetative' ? t('cannaPhaseVegetative') :
                                                phase === 'flowering' ? t('cannaPhaseFlowering') :
                                                    phase === 'ripening' ? t('cannaPhaseRipening') :
                                                        phase === 'flush' ? t('cannaPhaseFlush') :
                                                            phase === 'generative1' ? t('cannaPhaseGenerative1') :
                                                                phase === 'generative2' ? t('cannaPhaseGenerative2') :
                                                                    phase === 'generative3' ? t('cannaPhaseGenerative3') :
                                                                        (t(phase) || phase)}
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.scheduleTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.productHeader}>
                                            {t('cannaProducts')}
                                        </th>
                                        <th className={styles.unitHeader}>ml/L</th>
                                        {weekLabels.map((label, index) => {
                                            const phase = getPhaseForWeek(label);
                                            const stageInfo = isStageBasedSchedule ? getStageInfo(label) : null;

                                            return (
                                                <th
                                                    key={label}
                                                    className={`${styles.weekHeader} ${highlightedWeek === index ? styles.highlighted : ''} ${isStageBasedSchedule ? styles.stageHeader : ''}`}
                                                    style={{
                                                        borderTop: phase ? `3px solid ${phaseColors[phase] || '#6B7280'}` : undefined
                                                    }}
                                                    onMouseEnter={() => setHighlightedWeek(index)}
                                                    onMouseLeave={() => setHighlightedWeek(null)}
                                                >
                                                    <span className={styles.weekLabel}>
                                                        {isStageBasedSchedule
                                                            ? (stageInfo ? (t(stageInfo.name_key) || label) : label)
                                                            : label
                                                        }
                                                    </span>
                                                    {stageInfo && stageInfo.duration && (
                                                        <span className={styles.stageDurationLabel}>
                                                            {stageInfo.duration}
                                                        </span>
                                                    )}
                                                    {!isStageBasedSchedule && phase && (
                                                        <span
                                                            className={styles.phaseIndicator}
                                                            style={{ color: phaseColors[phase] }}
                                                        >
                                                            {phase === 'rooting' ? t('cannaPhaseRooting') :
                                                                phase === 'vegetative' ? t('cannaPhaseVegetative') :
                                                                    phase === 'flowering' ? t('cannaPhaseFlowering') :
                                                                        phase === 'ripening' ? t('cannaPhaseRipening') :
                                                                            phase === 'flush' ? t('cannaPhaseFlush') :
                                                                                phase === 'generative1' ? t('cannaPhaseGenerative1') :
                                                                                    phase === 'generative2' ? t('cannaPhaseGenerative2') :
                                                                                        phase === 'generative3' ? t('cannaPhaseGenerative3') :
                                                                                            (t(phase) || phase)}
                                                        </span>
                                                    )}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeProducts.map(product => (
                                        <tr key={product.id}>
                                            <td className={styles.productCell}>
                                                <div className={styles.productInfo}>
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.product_name}
                                                            className={styles.productTableImage}
                                                        />
                                                    ) : (
                                                        <span
                                                            className={styles.productDot}
                                                            style={{ backgroundColor: product.color }}
                                                        />
                                                    )}
                                                    <span className={styles.productNameCell}>{product.product_name}</span>
                                                </div>
                                            </td>
                                            <td className={styles.unitCell}>{product.dose_unit}</td>
                                            {weekLabels.map((week, index) => (
                                                <td
                                                    key={week}
                                                    className={`${styles.doseCell} ${highlightedWeek === index ? styles.highlighted : ''}`}
                                                    onMouseEnter={() => setHighlightedWeek(index)}
                                                    onMouseLeave={() => setHighlightedWeek(null)}
                                                >
                                                    {renderCell(product, week)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {/* Total Row */}
                                    <tr className={styles.totalRow}>
                                        <td className={styles.totalLabel} colSpan="2">
                                            {t('totalForWater')} ({waterAmount}L)
                                        </td>
                                        {weekLabels.map((week, index) => {
                                            const totals = calculateTotalForWeek(week);
                                            return (
                                                <td
                                                    key={week}
                                                    className={`${styles.totalCell} ${highlightedWeek === index ? styles.highlighted : ''}`}
                                                    onMouseEnter={() => setHighlightedWeek(index)}
                                                    onMouseLeave={() => setHighlightedWeek(null)}
                                                >
                                                    {Object.entries(totals).map(([unit, total]) => (
                                                        <div key={unit} className={styles.totalValue}>
                                                            {total.toFixed(1)} {unit.split('/')[0]}
                                                        </div>
                                                    ))}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <div className={styles.emptyState}>
                        <span className={styles.emptyIcon}>📋</span>
                        <h3>{t('noProductsSelected')}</h3>
                        <p>{t('selectProductsPrompt')}</p>
                    </div>
                )}

                {/* Plant-Specific Notes */}
                {currentSchedule?.notes && currentSchedule.notes.length > 0 && (
                    <motion.div
                        className={styles.notesSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3>📝 {t('cannaImportantNotes')}</h3>
                        <ul className={styles.notesList}>
                            {currentSchedule.notes.map((note, index) => (
                                <li key={index} className={styles.noteItem}>
                                    {note.key ? t(note.key) : (language === 'tr' ? note.tr : note.en)}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Special Requirements */}
                {currentSchedule?.special_requirements && currentSchedule.special_requirements.length > 0 && (
                    <motion.div
                        className={styles.requirementsSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3>{t('cannaSpecialRequirements')}</h3>
                        <div className={styles.requirementsList}>
                            {currentSchedule.special_requirements.map((req, index) => (
                                <div key={index} className={styles.requirementItem}>
                                    <span className={styles.requirementLabel}>
                                        {req.label_key ? t(req.label_key) : (t(req.key) || req.key)}:
                                    </span>
                                    <span className={styles.requirementValue}>
                                        {req.value_key ? t(req.value_key) : req.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Usage Tips */}
                <motion.div
                    className={styles.tipsSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3>{t('cannaUsageTips')}</h3>
                    <div className={styles.tipsList}>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>💧</span>
                            <span>{t('cannaTip1')}</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>🌡️</span>
                            <span>{t('cannaTip2')}</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>📏</span>
                            <span>{t('cannaTip3')}</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>🔄</span>
                            <span>{t('cannaTip4')}</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>📊</span>
                            <span>{t('cannaTip5')}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Educational Section */}
                <motion.section
                    className={styles.educationalSection}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <h2 className={styles.sectionTitle}>
                        {t('cannaEduTitle')}
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        {t('cannaEduSubtitle')}
                    </p>

                    <div className={styles.infoCards}>
                        <motion.div
                            className={styles.infoCard}
                            whileHover={{ y: -4 }}
                        >
                            <div className={styles.infoCardIcon}>🔬</div>
                            <h3 className={styles.infoCardTitle}>
                                {t('cannaEduResearchTitle')}
                            </h3>
                            <p className={styles.infoCardText}>
                                {t('cannaEduResearchText')}
                            </p>
                        </motion.div>

                        <motion.div
                            className={styles.infoCard}
                            whileHover={{ y: -4 }}
                        >
                            <div className={styles.infoCardIcon}>🎯</div>
                            <h3 className={styles.infoCardTitle}>
                                {t('cannaEduPrecisionTitle')}
                            </h3>
                            <p className={styles.infoCardText}>
                                {t('cannaEduPrecisionText')}
                            </p>
                        </motion.div>

                        <motion.div
                            className={styles.infoCard}
                            whileHover={{ y: -4 }}
                        >
                            <div className={styles.infoCardIcon}>🌍</div>
                            <h3 className={styles.infoCardTitle}>
                                {t('cannaEduQualityTitle')}
                            </h3>
                            <p className={styles.infoCardText}>
                                {t('cannaEduQualityText')}
                            </p>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Substrate Additives Section */}
                <motion.section
                    className={styles.additivesSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 }}
                >
                    <div className={styles.guideSection}>
                        <div className={styles.guideSectionHeader}>
                            <h2 className={styles.guideSectionTitle}>
                                🧪 {t('cannaAdditivesTitle')}
                            </h2>
                            <p className={styles.guideSectionSubtitle}>
                                {t('cannaAdditivesSubtitle')}
                            </p>
                        </div>

                        <div className={styles.additivesList}>
                            <motion.div className={styles.additiveItem} whileHover={{ x: 4 }}>
                                <div className={styles.additiveIcon} style={{ '--additive-color-rgb': '139, 92, 246' }}>🌱</div>
                                <div className={styles.additiveContent}>
                                    <h4 className={styles.additiveName}>RHIZOTONIC</h4>
                                    <p className={styles.additiveDesc}>
                                        {t('descRhizotonic')}
                                    </p>
                                    <span className={styles.additiveUsage}>
                                        📅 {t('usageStartRooting')}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div className={styles.additiveItem} whileHover={{ x: 4 }}>
                                <div className={styles.additiveIcon} style={{ '--additive-color-rgb': '34, 197, 94' }}>🔄</div>
                                <div className={styles.additiveContent}>
                                    <h4 className={styles.additiveName}>CANNAZYM</h4>
                                    <p className={styles.additiveDesc}>
                                        {t('descCannazym')}
                                    </p>
                                    <span className={styles.additiveUsage}>
                                        📅 {t('usageEntireCycle')}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div className={styles.additiveItem} whileHover={{ x: 4 }}>
                                <div className={styles.additiveIcon} style={{ '--additive-color-rgb': '236, 72, 153' }}>💥</div>
                                <div className={styles.additiveContent}>
                                    <h4 className={styles.additiveName}>PK 13/14</h4>
                                    <p className={styles.additiveDesc}>
                                        {t('descPK1314')}
                                    </p>
                                    <span className={styles.additiveUsage}>
                                        📅 {t('usageMidGen')}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div className={styles.additiveItem} whileHover={{ x: 4 }}>
                                <div className={styles.additiveIcon} style={{ '--additive-color-rgb': '251, 191, 36' }}>⚡</div>
                                <div className={styles.additiveContent}>
                                    <h4 className={styles.additiveName}>CANNABOOST</h4>
                                    <p className={styles.additiveDesc}>
                                        {t('descCannaboost')}
                                    </p>
                                    <span className={styles.additiveUsage}>
                                        📅 {t('usageGenPhase')}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* Quick Reference Panel */}
                <motion.div
                    className={styles.quickRefPanel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className={styles.quickRefHeader}>
                        <img src="/images/canna-logo.svg" alt="CANNA" className={styles.quickRefLogo} />
                        <div>
                            <h3 className={styles.quickRefTitle}>
                                {t('cannaQuickRefTitle')}
                            </h3>
                            <p className={styles.quickRefSubtitle}>
                                {t('cannaQuickRefSubtitle')}
                            </p>
                        </div>
                    </div>
                    <div className={styles.quickRefGrid}>
                        <div className={styles.quickRefItem}>
                            <div className={styles.quickRefItemIcon}>🌊</div>
                            <div className={styles.quickRefItemLabel}>AQUA</div>
                            <div className={styles.quickRefItemValue}>5.2 – 6.2</div>
                        </div>
                        <div className={styles.quickRefItem}>
                            <div className={styles.quickRefItemIcon}>🥥</div>
                            <div className={styles.quickRefItemLabel}>COCO</div>
                            <div className={styles.quickRefItemValue}>5.2 – 6.2</div>
                        </div>
                        <div className={styles.quickRefItem}>
                            <div className={styles.quickRefItemIcon}>🌱</div>
                            <div className={styles.quickRefItemLabel}>TERRA</div>
                            <div className={styles.quickRefItemValue}>5.8 – 6.2</div>
                        </div>
                        <div className={styles.quickRefItem}>
                            <div className={styles.quickRefItemIcon}>🧱</div>
                            <div className={styles.quickRefItemLabel}>COGr</div>
                            <div className={styles.quickRefItemValue}>5.8 – 6.2</div>
                        </div>
                        <div className={styles.quickRefItem}>
                            <div className={styles.quickRefItemIcon}>💧</div>
                            <div className={styles.quickRefItemLabel}>SUBSTRA</div>
                            <div className={styles.quickRefItemValue}>5.2 – 6.2</div>
                        </div>
                    </div>
                </motion.div>

                {/* Strategic Insights Section */}
                <motion.section
                    className={styles.insightsSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85 }}
                >
                    <div className={styles.insightsHeader}>
                        <span className={styles.insightsIcon}>💡</span>
                        <h3 className={styles.insightsTitle}>
                            {t('cannaInsightsTitle')}
                        </h3>
                    </div>
                    <div className={styles.insightsList}>
                        <div className={styles.insightItem}>
                            <span className={styles.insightNumber}>1</span>
                            <p className={styles.insightText}>
                                {t('cannaInsight1')}
                            </p>
                        </div>
                        <div className={styles.insightItem}>
                            <span className={styles.insightNumber}>2</span>
                            <p className={styles.insightText}>
                                {t('cannaInsight2')}
                            </p>
                        </div>
                        <div className={styles.insightItem}>
                            <span className={styles.insightNumber}>3</span>
                            <p className={styles.insightText}>
                                {t('cannaInsight3')}
                            </p>
                        </div>
                        <div className={styles.insightItem}>
                            <span className={styles.insightNumber}>4</span>
                            <p className={styles.insightText}>
                                {t('cannaInsight4')}
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Notes Section */}
                <motion.div
                    className={styles.notesSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                >
                    <h3>{t('cannaImportantNotes')}</h3>
                    <p>
                        {t('cannaGeneralNote')}
                    </p>
                </motion.div>
            </motion.div>

            <Footer />
        </div>
    );
}
