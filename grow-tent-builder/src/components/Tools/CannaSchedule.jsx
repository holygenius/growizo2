import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import {
    CANNA_PRODUCTS,
    CANNA_SYSTEMS,
    SYSTEM_INFO,
    PLANT_SCHEDULES,
    PLANT_INFO,
    PRODUCT_CATEGORIES,
    AQUA_SCHEDULES,
    COCO_SCHEDULES,
    COGR_SCHEDULES,
    SUBSTRA_SCHEDULES,
    TERRA_SCHEDULES,
    DEFAULT_SELECTED_PRODUCTS,
    getProductsBySystem,
    getScheduleBySystemAndPlant,
    getAvailablePlantsForSystem,
    EC_NOTE
} from '../../data/cannaData';
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
    const [selectedSystem, setSelectedSystem] = useState(CANNA_SYSTEMS.COCO);
    const [selectedPlant, setSelectedPlant] = useState('general');
    const [waterType, setWaterType] = useState('hard'); // For SUBSTRA system
    const [selectedProducts, setSelectedProducts] = useState(DEFAULT_SELECTED_PRODUCTS.coco);
    const [waterAmount, setWaterAmount] = useState(10);
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [highlightedWeek, setHighlightedWeek] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState(
        Object.keys(PRODUCT_CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    // currentSystemInfo removed - using SYSTEM_INFO directly

    // Get available plants for current system
    const availablePlants = useMemo(() => {
        return getAvailablePlantsForSystem(selectedSystem);
    }, [selectedSystem]);

    // Get current schedule
    const currentSchedule = useMemo(() => {
        return getScheduleBySystemAndPlant(selectedSystem, selectedPlant);
    }, [selectedSystem, selectedPlant]);

    // Get products for current system
    const systemProducts = useMemo(() => {
        return getProductsBySystem(selectedSystem);
    }, [selectedSystem]);

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
                            {language === 'tr' ? 'Profesyonel ' : 'Professional '}
                            <span className={styles.heroTitleHighlight}>
                                {language === 'tr' ? 'Beslenme Programı' : 'Feeding Schedule'}
                            </span>
                        </motion.h1>
                        
                        <motion.p 
                            className={styles.heroSubtitle}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {language === 'tr' 
                                ? 'AQUA, COCO, COGr, SUBSTRA ve TERRA sistemleri için profesyonel besin hesaplayıcı. Her bitkinin kendine özgü "parmak izi" vardır ve en iyi sonuçlar ancak bu gereksinimler karşılandığında elde edilebilir.'
                                : 'Professional nutrient calculator for AQUA, COCO, COGr, SUBSTRA and TERRA systems. Each plant has its own unique "fingerprint" and the best results can only be achieved when these requirements are met.'
                            }
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
                                    <span className={styles.heroStatLabel}>{language === 'tr' ? 'Sistem' : 'Systems'}</span>
                                </div>
                            </div>
                            <div className={styles.heroStatDivider} />
                            <div className={styles.heroStatItem}>
                                <div className={styles.heroStatIcon}>🌱</div>
                                <div className={styles.heroStatContent}>
                                    <span className={styles.heroStatValue}>7</span>
                                    <span className={styles.heroStatLabel}>{language === 'tr' ? 'Bitki Tipi' : 'Plant Types'}</span>
                                </div>
                            </div>
                            <div className={styles.heroStatDivider} />
                            <div className={styles.heroStatItem}>
                                <div className={styles.heroStatIcon}>🧪</div>
                                <div className={styles.heroStatContent}>
                                    <span className={styles.heroStatValue}>20+</span>
                                    <span className={styles.heroStatLabel}>{language === 'tr' ? 'Ürün' : 'Products'}</span>
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
                                {language === 'tr' ? 'Bitki Tipi Seçin' : 'Select Plant Type'}
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
                                {language === 'tr' ? 'Su Tipi' : 'Water Type'}
                            </label>
                            <div className={styles.waterTypeSelector}>
                                <motion.button
                                    className={`${styles.waterTypeBtn} ${waterType === 'hard' ? styles.selected : ''}`}
                                    onClick={() => setWaterType('hard')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    💎 {language === 'tr' ? 'Sert Su' : 'Hard Water'}
                                </motion.button>
                                <motion.button
                                    className={`${styles.waterTypeBtn} ${waterType === 'soft' ? styles.selected : ''}`}
                                    onClick={() => setWaterType('soft')}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    💧 {language === 'tr' ? 'Yumuşak Su' : 'Soft Water'}
                                </motion.button>
                            </div>
                        </div>
                    )}

                    {/* Product Selector Toggle */}
                    <div className={`${styles.controlGroup} ${styles.fullWidth}`}>
                        <label className={styles.controlLabel}>
                            {language === 'tr' ? 'Ürünleri Seç' : 'Select Products'}
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
                                        {language === 'tr' ? 'Ürünler' : 'Products'}
                                    </span>
                                    <span className={styles.productSelectorDesc}>
                                        {language === 'tr' ? 'Görüntülenecek ürünleri seçin' : 'Click to select products to display'}
                                    </span>
                                </div>
                            </div>
                            <span className={styles.productSelectorCount}>
                                {selectedProducts.length} {language === 'tr' ? 'seçili' : 'selected'}
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
                                        {language === 'tr' ? 'Tümünü Seç' : 'Select All'}
                                    </button>
                                    <button onClick={resetToDefault} className={styles.actionBtn}>
                                        {t('resetDefault')}
                                    </button>
                                    <button 
                                        onClick={() => setShowProductSelector(false)} 
                                        className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
                                    >
                                        ✓ {language === 'tr' ? 'Seçimi Tamamla' : 'Done'}
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
                        {language === 'tr' 
                            ? 'Dozajlar girilen su miktarına göre hesaplanır' 
                            : 'Dosages are calculated based on entered water amount'}
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
                                <span className={styles.ecLabel}>EC+ {language === 'tr' ? 'Aralığı' : 'Range'}:</span>
                                <span className={styles.ecValue}>
                                    {currentSchedule.ec_range.min} - {currentSchedule.ec_range.max} {currentSchedule.ec_range.unit}
                                </span>
                                <span className={styles.ecNote}>
                                    {language === 'tr' ? EC_NOTE.text_tr : EC_NOTE.text_en}
                                </span>
                            </div>
                        )}

                        {/* Stages Info Table - NEW */}
                        {currentSchedule?.stages && currentSchedule.stages.length > 0 && (
                            <motion.div 
                                className={styles.stagesInfoSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <h3 className={styles.stagesTitle}>
                                    📊 {language === 'tr' ? 'Aşama Detayları' : 'Stage Details'}
                                </h3>
                                <div className={styles.stagesTableWrapper}>
                                    <table className={styles.stagesTable}>
                                        <thead>
                                            <tr>
                                                <th>{language === 'tr' ? 'Aşama' : 'Stage'}</th>
                                                <th>{language === 'tr' ? 'Süre' : 'Duration'}</th>
                                                <th>💡 {language === 'tr' ? 'Işık' : 'Light'}</th>
                                                <th>EC+</th>
                                                <th>PPM+</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentSchedule.stages.map((stage, index) => (
                                                <tr key={index}>
                                                    <td className={styles.stageNameCell}>
                                                        <span className={styles.stageName}>{stage.name}</span>
                                                        {stage.description && (
                                                            <span className={styles.stageDesc}>{stage.description}</span>
                                                        )}
                                                    </td>
                                                    <td className={styles.stageDuration}>{stage.duration}</td>
                                                    <td className={styles.stageLight}>
                                                        {stage.light_hours ? `${stage.light_hours}h` : '—'}
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
                                        {language === 'tr' 
                                            ? (phase === 'rooting' ? 'Köklendirme' : 
                                               phase === 'vegetative' ? 'Vejetatif' : 
                                               phase === 'flowering' ? 'Çiçeklenme' : 
                                               phase === 'ripening' ? 'Olgunlaşma' : 
                                               phase === 'flush' ? 'Yıkama' : phase)
                                            : (phase.charAt(0).toUpperCase() + phase.slice(1))}
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.scheduleTable}>
                                <thead>
                                    <tr>
                                        <th className={styles.productHeader}>
                                            {language === 'tr' ? 'Ürün' : 'Product'}
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
                                                            ? (label.length > 15 ? label.substring(0, 15) + '...' : label)
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
                                                            {t(phase) || phase}
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

                {/* Plant-Specific Notes - Updated for new format */}
                {currentSchedule?.notes && currentSchedule.notes.length > 0 && (
                    <motion.div 
                        className={styles.notesSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3>📝 {language === 'tr' ? 'Önemli Notlar' : 'Important Notes'}</h3>
                        <ul className={styles.notesList}>
                            {currentSchedule.notes.map((note, index) => (
                                <li key={index} className={styles.noteItem}>
                                    {language === 'tr' ? note.tr : note.en}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {/* Special Requirements */}
                {currentSchedule?.special_requirements && (
                    <motion.div 
                        className={styles.requirementsSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3>{language === 'tr' ? 'Özel Gereksinimler' : 'Special Requirements'}</h3>
                        <div className={styles.requirementsList}>
                            {currentSchedule.special_requirements.map((req, index) => (
                                <div key={index} className={styles.requirementItem}>
                                    <span className={styles.requirementLabel}>{t(req.key) || req.key}:</span>
                                    <span className={styles.requirementValue}>{req.value}</span>
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
                    <h3>{language === 'tr' ? 'Kullanım İpuçları' : 'Usage Tips'}</h3>
                    <div className={styles.tipsList}>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>💧</span>
                            <span>{language === 'tr' 
                                ? 'Besin çözeltinizin pH değerini ölçtükten sonra karıştırın. Optimal aralık çoğu sistem için 5.8-6.2\'dir.'
                                : 'Always measure pH after mixing nutrients. Optimal range is 5.8-6.2 for most systems.'}</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>🌡️</span>
                            <span>{language === 'tr'
                                ? 'Besin çözeltisi sıcaklığını optimum emilim için 18-22°C arasında tutun.'
                                : 'Keep nutrient solution temperature between 18-22°C for optimal absorption.'}</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>📏</span>
                            <span>{language === 'tr'
                                ? 'Fide ve genç bitkiler için önerilen dozun %50\'si ile başlayın.'
                                : 'Start with 50% recommended dosage for seedlings and young plants.'}</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>🔄</span>
                            <span>{language === 'tr'
                                ? 'Şişeleri kullanmadan önce iyice çalkalayın. Besinleri suya ekleyin, suyu besinlere değil.'
                                : 'Shake bottles well before use. Add nutrients to water, not water to nutrients.'}</span>
                        </div>
                        <div className={styles.tipItem}>
                            <span className={styles.tipIcon}>📊</span>
                            <span>{language === 'tr'
                                ? 'EC seviyelerini düzenli olarak izleyin. Bitki tepkisine göre artırın veya azaltın.'
                                : 'Monitor EC levels regularly. Increase or decrease based on plant response.'}</span>
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
                        {language === 'tr' ? 'CANNA Besinleri Hakkında' : 'About CANNA Nutrients'}
                    </h2>
                    <p className={styles.sectionSubtitle}>
                        {language === 'tr' 
                            ? 'CANNA beslenme sistemlerinin arkasındaki bilimi öğrenin'
                            : 'Learn about the science behind CANNA nutrition systems'}
                    </p>

                    <div className={styles.infoCards}>
                        <motion.div 
                            className={styles.infoCard}
                            whileHover={{ y: -4 }}
                        >
                            <div className={styles.infoCardIcon}>🔬</div>
                            <h3 className={styles.infoCardTitle}>
                                {language === 'tr' ? 'Araştırma Tabanlı Formüller' : 'Research-Based Formulas'}
                            </h3>
                            <p className={styles.infoCardText}>
                                {language === 'tr'
                                    ? 'CANNA besinleri, her büyüme aşaması için optimal besin oranlarını sağlamak üzere kapsamlı bilimsel araştırmalar sonucu geliştirilmiştir.'
                                    : 'CANNA nutrients are developed through extensive scientific research, ensuring optimal nutrient ratios for each growth stage.'}
                            </p>
                        </motion.div>

                        <motion.div 
                            className={styles.infoCard}
                            whileHover={{ y: -4 }}
                        >
                            <div className={styles.infoCardIcon}>🎯</div>
                            <h3 className={styles.infoCardTitle}>
                                {language === 'tr' ? 'Hassas Dozlama' : 'Precision Dosing'}
                            </h3>
                            <p className={styles.infoCardText}>
                                {language === 'tr'
                                    ? 'Her ürün hassas dozlama için tasarlanmıştır, tahmin yürütmeyi ortadan kaldırır ve her yetiştirme döngüsünde tutarlı sonuçlar sağlar.'
                                    : 'Each product is designed for precise dosing, eliminating guesswork and ensuring consistent results every grow cycle.'}
                            </p>
                        </motion.div>

                        <motion.div 
                            className={styles.infoCard}
                            whileHover={{ y: -4 }}
                        >
                            <div className={styles.infoCardIcon}>🌍</div>
                            <h3 className={styles.infoCardTitle}>
                                {language === 'tr' ? 'Premium Kalite' : 'Premium Quality'}
                            </h3>
                            <p className={styles.infoCardText}>
                                {language === 'tr'
                                    ? 'Tüm CANNA ürünleri yüksek kaliteli bileşenlerden üretilir ve maksimum saflık için sıkı kalite kontrolünden geçer.'
                                    : 'All CANNA products are made from high-grade ingredients and undergo strict quality control for maximum purity.'}
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
                                🧪 {language === 'tr' ? 'Besin Formülasyonları ve Katkı Maddeleri' : 'Nutrient Formulations & Additives'}
                            </h2>
                            <p className={styles.guideSectionSubtitle}>
                                {language === 'tr' 
                                    ? 'Tüm programlar, temel besinler ile bitki gelişiminin belirli aşamalarını desteklemek için tasarlanmış katkı maddelerinin stratejik kullanımına dayanır.'
                                    : 'All programs rely on base nutrients and strategic use of additives designed to support specific stages of plant development.'}
                            </p>
                        </div>

                        <div className={styles.additivesList}>
                            <motion.div className={styles.additiveItem} whileHover={{ x: 4 }}>
                                <div className={styles.additiveIcon} style={{'--additive-color-rgb': '139, 92, 246'}}>🌱</div>
                                <div className={styles.additiveContent}>
                                    <h4 className={styles.additiveName}>RHIZOTONIC</h4>
                                    <p className={styles.additiveDesc}>
                                        {language === 'tr'
                                            ? 'Güçlü bir kök sistemi oluşturmak için özellikle başlangıç ve köklenme evrelerinde kullanılır. Sağlıklı bir başlangıç, bitkinin genel performansı için temel oluşturur.'
                                            : 'Used especially during start and rooting phases to build a strong root system. A healthy start forms the foundation for overall plant performance.'}
                                    </p>
                                    <span className={styles.additiveUsage}>
                                        📅 {language === 'tr' ? 'Başlangıç & Köklenme Evresi' : 'Start & Rooting Phase'}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div className={styles.additiveItem} whileHover={{ x: 4 }}>
                                <div className={styles.additiveIcon} style={{'--additive-color-rgb': '34, 197, 94'}}>🔄</div>
                                <div className={styles.additiveContent}>
                                    <h4 className={styles.additiveName}>CANNAZYM</h4>
                                    <p className={styles.additiveDesc}>
                                        {language === 'tr'
                                            ? 'Kök ortamını temizleyen ve ölü kök materyalini parçalayan enzimler içerir. Genellikle tüm döngü boyunca kullanılır. Substratın yeniden kullanılması durumunda dozaj iki katına çıkarılmalıdır.'
                                            : 'Contains enzymes that clean the root environment and break down dead root material. Used throughout the entire cycle. Double the dosage when reusing substrate.'}
                                    </p>
                                    <span className={styles.additiveUsage}>
                                        📅 {language === 'tr' ? 'Tüm Döngü Boyunca' : 'Throughout Entire Cycle'}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div className={styles.additiveItem} whileHover={{ x: 4 }}>
                                <div className={styles.additiveIcon} style={{'--additive-color-rgb': '236, 72, 153'}}>💥</div>
                                <div className={styles.additiveContent}>
                                    <h4 className={styles.additiveName}>PK 13/14</h4>
                                    <p className={styles.additiveDesc}>
                                        {language === 'tr'
                                            ? 'Yüksek oranda fosfor (P) ve potasyum (K) içeren bir çiçeklenme uyarıcısıdır. Generatif dönemin ortasında, çiçek ve meyve gelişimini yoğun bir şekilde desteklemek için genellikle sadece bir hafta süreyle kullanılır.'
                                            : 'A flowering stimulator with high phosphorus (P) and potassium (K). Used for about one week in the middle of the generative period to intensively support flower and fruit development.'}
                                    </p>
                                    <span className={styles.additiveUsage}>
                                        📅 {language === 'tr' ? 'Generatif Evrenin Ortası (1 Hafta)' : 'Mid-Generative Phase (1 Week)'}
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div className={styles.additiveItem} whileHover={{ x: 4 }}>
                                <div className={styles.additiveIcon} style={{'--additive-color-rgb': '251, 191, 36'}}>⚡</div>
                                <div className={styles.additiveContent}>
                                    <h4 className={styles.additiveName}>CANNABOOST</h4>
                                    <p className={styles.additiveDesc}>
                                        {language === 'tr'
                                            ? 'Çiçeklenme ve meyve olgunlaşma sürecini hızlandıran ve kalitesini artıran bir katkı maddesidir. Çiçeklenme gücünü artırmak için generatif evre boyunca kullanılır.'
                                            : 'An additive that accelerates flowering and fruit ripening while improving quality. Used throughout the generative phase to enhance flowering power.'}
                                    </p>
                                    <span className={styles.additiveUsage}>
                                        📅 {language === 'tr' ? 'Generatif Evre Boyunca' : 'Throughout Generative Phase'}
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
                                {language === 'tr' ? 'pH Seviyeleri Hızlı Referans' : 'pH Levels Quick Reference'}
                            </h3>
                            <p className={styles.quickRefSubtitle}>
                                {language === 'tr' ? 'Sisteme göre önerilen pH aralıkları' : 'Recommended pH ranges by system'}
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
                            {language === 'tr' ? 'Stratejik Öneriler' : 'Strategic Insights'}
                        </h3>
                    </div>
                    <div className={styles.insightsList}>
                        <div className={styles.insightItem}>
                            <span className={styles.insightNumber}>1</span>
                            <p className={styles.insightText}>
                                {language === 'tr'
                                    ? <>Yetiştirme programları tarafından sunulan tablolar ve yönergeler, <span className={styles.insightHighlight}>"demir bir kanun değildir"</span>. Bu programlar, bilimsel temellere dayanan güçlü bir çerçeve sunar, ancak nihai başarı yetiştiricinin gözlem ve adaptasyon yeteneğine bağlıdır.</>
                                    : <>The tables and guidelines provided by growing programs are <span className={styles.insightHighlight}>"not iron law"</span>. These programs provide a strong scientifically-based framework, but ultimate success depends on the grower's observation and adaptation skills.</>}
                            </p>
                        </div>
                        <div className={styles.insightItem}>
                            <span className={styles.insightNumber}>2</span>
                            <p className={styles.insightText}>
                                {language === 'tr'
                                    ? <>Vejetatif evreden generatif evreye geçildiğinde besin ihtiyacı artar. EC değeri vejetatif evrede <span className={styles.insightHighlight}>0.7-1.3 mS/cm</span> aralığındayken, generatif evrenin zirvesinde <span className={styles.insightHighlight}>1.6-2.0 mS/cm</span> seviyelerine ulaşır.</>
                                    : <>Nutrient demand increases when transitioning from vegetative to generative phase. EC value ranges from <span className={styles.insightHighlight}>0.7-1.3 mS/cm</span> in vegetative phase to <span className={styles.insightHighlight}>1.6-2.0 mS/cm</span> at the peak of generative phase.</>}
                            </p>
                        </div>
                        <div className={styles.insightItem}>
                            <span className={styles.insightNumber}>3</span>
                            <p className={styles.insightText}>
                                {language === 'tr'
                                    ? <>Bitkinin yaprak rengi, büyüme hızı ve genel sağlığı, uygulanan programın doğruluğu hakkında <span className={styles.insightHighlight}>en iyi geri bildirimi</span> sağlar. Bitkinin verdiği sinyallere göre besin, su ve ışık rejimlerini hassas bir şekilde ayarlayın.</>
                                    : <>Plant leaf color, growth rate, and overall health provide the <span className={styles.insightHighlight}>best feedback</span> about the accuracy of your program. Fine-tune nutrient, water, and light regimes based on the signals your plant gives.</>}
                            </p>
                        </div>
                        <div className={styles.insightItem}>
                            <span className={styles.insightNumber}>4</span>
                            <p className={styles.insightText}>
                                {language === 'tr'
                                    ? <>Işık süresi, bitkilerin vejetatif büyümeden generatif faza geçişini tetikleyen en önemli çevresel sinyallerden biridir. Genel kural: Vejetatif için <span className={styles.insightHighlight}>18 saat</span>, çiçeklenme için <span className={styles.insightHighlight}>12 saat</span>.</>
                                    : <>Light duration is one of the most important environmental signals that triggers plants to transition from vegetative to generative phase. General rule: <span className={styles.insightHighlight}>18 hours</span> for vegetative, <span className={styles.insightHighlight}>12 hours</span> for flowering.</>}
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
                    <h3>{language === 'tr' ? 'Önemli Notlar' : 'Important Notes'}</h3>
                    <p>
                        {language === 'tr'
                            ? 'Tüm dozlar standart önerilere dayanmaktadır. Gerçek gereksinimler bitki genetiğine, çevre koşullarına ve büyüme aşamasına göre değişebilir. Bitkilerinizi her zaman izleyin ve buna göre ayarlayın. Şüpheniz varsa daha az besin kullanın - her zaman daha fazla ekleyebilirsiniz, ancak fazlasını çıkaramazsınız.'
                            : 'All dosages are based on standard recommendations. Actual requirements may vary based on plant genetics, environmental conditions, and growth stage. Always monitor your plants and adjust accordingly. When in doubt, use less nutrients - you can always add more, but you cannot remove excess.'}
                    </p>
                </motion.div>
            </motion.div>
            
            <Footer />
        </div>
    );
}
