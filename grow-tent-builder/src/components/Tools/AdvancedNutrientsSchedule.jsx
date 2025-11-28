import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import {
    ADVANCED_NUTRIENTS_DATA,
    WEEK_LABELS,
    PHASE_INFO,
    BASE_NUTRIENT_OPTIONS,
    PRODUCT_CATEGORIES
} from '../../data/advancedNutrientsData';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './FeedingSchedule.module.css'; // Reusing styles for consistency
import { motion, AnimatePresence } from 'framer-motion';

// Info section data
const NUTRIENT_SERIES = [
    {
        id: 'connoisseur',
        name: 'pH Perfect® Connoisseur®',
        badge: 'Premium',
        color: '#DC2626',
        description: 'Hem standart topraksız tarım hem de coco coir ortamları için özel olarak formüle edilmiş üst düzey besin serisi.',
        features: ['pH Perfect', 'Coco & Hydro', 'Top Shelf & Master']
    },
    {
        id: 'sensi',
        name: 'pH Perfect® Sensi',
        badge: 'Professional',
        color: '#2563EB',
        description: 'pH dengelemesini otomatikleştiren teknoloji ile donatılmış profesyonel seviye besin sistemi.',
        features: ['pH Perfect', '2-Part System', 'Coco Formülü']
    },
    {
        id: 'iguana',
        name: 'OG Organics™ Iguana Juice®',
        badge: 'Organic',
        color: '#16A34A',
        description: 'CDFA tarafından "Organik Girdi Malzemesi" olarak tescillenmiş, tamamen organik besin serisi.',
        features: ['CDFA Certified', '100% Organic', 'Vegan']
    },
    {
        id: 'gmb',
        name: 'pH Perfect® Grow/Micro/Bloom',
        badge: '3-Part',
        color: '#7C3AED',
        description: 'Esnek 3 parçalı temel sistem ile her aşamada tam kontrol sağlayan besin programı.',
        features: ['3-Part System', 'Flexible Ratios', 'All Media']
    }
];

const PRO_TIPS = [
    'Daha uzun vejetatif dönemler için 4. haftanın besleme programı tekrar edilebilir.',
    'Klonlar ve fideler için 1. haftanın oranları "ön-vejetatif" bir aşama olarak tekrarlanabilir.',
    'Uç yanığı gibi belirtiler gözlemlenirse, temel besin gücünün %25 oranında azaltılması önerilir.',
    'Her ürün eklendikten sonra suyun iyice karıştırılması gerekmektedir.',
    'Besin ihtiyacı bitki genetiği ve yetiştirme ortamına göre değişir.',
    'Coco coir ortamları en iyi sonucu, bol drenajla birlikte en az günde bir kez beslendiğinde verir.'
];

const LIFECYCLE_PHASES = [
    {
        id: 'vegetative',
        icon: '🌿',
        title: 'Büyüme Döngüsü',
        titleEn: 'Grow Cycle',
        duration: '~4 Hafta',
        light: '18/6',
        color: '#22C55E',
        description: 'Bitkinin vejetatif gelişimi için tasarlanmış dönem. Yaprak ve gövde gelişimi ön plandadır.'
    },
    {
        id: 'flowering',
        icon: '🌸',
        title: 'Çiçeklenme Döngüsü',
        titleEn: 'Bloom Cycle',
        duration: '~8 Hafta',
        light: '12/12',
        color: '#EC4899',
        description: 'Tomurcuklanma, çiçeklenme ve meyve gelişimi hedeflenir. En kritik dönemdir.'
    },
    {
        id: 'flush',
        icon: '💧',
        title: 'Yıkama Periyodu',
        titleEn: 'Flush Period',
        duration: 'Son Hafta',
        light: '12/12',
        color: '#6B7280',
        description: 'Besin uygulaması durdurulur veya Flawless Finish® gibi özel yıkama solüsyonu kullanılır.'
    }
];

const SUPPLEMENT_CATEGORIES = [
    { icon: '🌳', title: 'Kök Geliştiriciler', description: 'Güçlü kök sistemi için Voodoo Juice, Piranha, Tarantula gibi ürünler.' },
    { icon: '🌺', title: 'Tomurcuk Büyütücüler', description: 'Big Bud, Overdrive gibi çiçeklenme döneminde verim artırıcılar.' },
    { icon: '🍬', title: 'Aroma & Tat Artırıcılar', description: 'Bud Candy, Nirvana ile terpene profili ve tat optimizasyonu.' },
    { icon: '🛡️', title: 'Bitki Sağlığı', description: 'Rhino Skin, Bud Factor X ile strese karşı direnç ve koruma.' }
];

export default function AdvancedNutrientsSchedule() {
    const { t } = useSettings();
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
    const [vegWeeks, setVegWeeks] = useState(4); // Varsayılan 4 vej haftası

    // Dinamik hafta etiketleri oluştur
    const dynamicWeekLabels = useMemo(() => {
        const labels = [];
        // Vejetatif haftalar
        for (let i = 1; i <= vegWeeks; i++) {
            labels.push(`Grow W${i}`);
        }
        // Çiçeklenme haftaları (sabit 8 hafta)
        for (let i = 1; i <= 8; i++) {
            labels.push(`Bloom W${i}`);
        }
        return labels;
    }, [vegWeeks]);

    // Toplam hafta sayısı
    const totalWeeks = vegWeeks + 8;

    // Hafta ekle/çıkar fonksiyonları
    const addVegWeek = () => {
        if (vegWeeks < 4) { // Max 4 vej = toplam 12 hafta
            setVegWeeks(prev => prev + 1);
        }
    };

    const removeVegWeek = () => {
        if (vegWeeks > 0) { // Min 0 vej = toplam 8 hafta
            setVegWeeks(prev => prev - 1);
        }
    };

    // Dinamik faz bilgisi
    const getDynamicPhaseInfo = useMemo(() => {
        return {
            vegetative: { weeks: Array.from({ length: vegWeeks }, (_, i) => i + 1), label_key: 'phaseLabelVeg', color: '#22C55E' },
            flowering: { weeks: Array.from({ length: 7 }, (_, i) => vegWeeks + i + 1), label_key: 'phaseLabelFlower', color: '#EC4899' },
            flush: { weeks: [totalWeeks], label_key: 'phaseLabelFlush', color: '#6B7280' }
        };
    }, [vegWeeks, totalWeeks]);

    // Get current base nutrient option
    const currentBaseNutrient = useMemo(() => {
        return BASE_NUTRIENT_OPTIONS.find(opt => opt.id === selectedBaseNutrientId) || BASE_NUTRIENT_OPTIONS[0];
    }, [selectedBaseNutrientId]);

    // Group products by category
    const productsByCategory = useMemo(() => {
        const grouped = {};
        Object.keys(PRODUCT_CATEGORIES).forEach(catKey => {
            grouped[catKey] = ADVANCED_NUTRIENTS_DATA.filter(p => p.category_key === catKey);
        });
        return grouped;
    }, []);

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
        const allBaseNutrientIds = new Set(BASE_NUTRIENT_OPTIONS.flatMap(opt => opt.products));

        setSelectedProducts(prev => {
            // Keep existing additives (products not in any base nutrient list)
            const additives = prev.filter(id => !allBaseNutrientIds.has(id));
            // Add new base nutrient products
            return [...currentBaseNutrient.products, ...additives];
        });
    }, [currentBaseNutrient]);

    // Filter and translate selected products
    const activeProducts = useMemo(() => {
        return ADVANCED_NUTRIENTS_DATA.filter(product =>
            selectedProducts.includes(product.id)
        ).map(product => ({
            ...product,
            category: t(product.category_key),
            dose_unit: product.dose_unit === 'ml/L' ? 'ml/L' : t(product.dose_unit),
            function: t(product.function_key),
        }));
    }, [selectedProducts, t]);

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
        const additives = ADVANCED_NUTRIENTS_DATA
            .filter(p => p.category_key !== 'base_nutrient')
            .map(p => p.id);
        setSelectedProducts([...currentBaseNutrient.products, ...additives]);
    };

    // Reset to default (Base + Essentials)
    const resetToDefault = () => {
        // Default additives could be defined, for now just Base + Voodoo + B52 + Big Bud + Overdrive + Flush
        const defaultAdditives = ['voodoo-juice', 'b-52', 'big-bud', 'overdrive', 'flawless-finish'];
        setSelectedProducts([...currentBaseNutrient.products, ...defaultAdditives]);
    };

    // Get schedule based on current selection
    const getSchedule = (product) => {
        // If it's a base nutrient, use its default schedule
        if (product.category_key === 'base_nutrient') {
            return product.schedule_default || null;
        }

        // If it's an additive, use the key from the selected base nutrient option
        // e.g., 'schedule_hydro_master'
        const scheduleKey = currentBaseNutrient.schedule_key;

        // Fallback: try other keys if specific one missing (e.g. if hydro_master missing, try coco_master)
        // But for now, let's stick to the mapped key.
        return product[scheduleKey] || product.schedule_default || null;
    };

    // Calculate dose for a specific week - dinamik hafta desteği
    const calculateDoseForWeek = (product, weekLabel) => {
        const schedule = getSchedule(product);
        if (!schedule) return null;

        // Dinamik hafta etiketini orijinal schedule'daki etikete eşle
        let mappedLabel = weekLabel;
        
        // Eğer eklenen vej haftasıysa (Grow W5, W6, vb.), Grow W4'ün değerini kullan
        if (weekLabel.startsWith('Grow W')) {
            const weekNum = parseInt(weekLabel.replace('Grow W', ''));
            if (weekNum > 4) {
                mappedLabel = 'Grow W4';
            }
        }

        const dose = schedule[mappedLabel];
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

    // Get phase info for a week index - dinamik faz bilgisi kullan
    const getPhaseForWeek = (weekIndex) => {
        const weekNum = weekIndex + 1;
        for (const [, phase] of Object.entries(getDynamicPhaseInfo)) {
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
        Object.entries(PRODUCT_CATEGORIES).forEach(([catKey, category]) => {
            const productsInCat = ADVANCED_NUTRIENTS_DATA.filter(
                p => p.category_key === catKey && selectedProducts.includes(p.id)
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
    }, [selectedProducts]);

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
                        Profesyonel <span className={styles.heroTitleHighlight}>Besleme Programı</span>
                    </motion.h1>
                    
                    <motion.p 
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        pH Perfect® teknolojisi ile donatılmış, bilimsel formülasyonlarla 
                        maksimum verim için tasarlanmış interaktif besin hesaplayıcı
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
                                <span className={styles.heroStatValue}>{totalWeeks}</span>
                                <span className={styles.heroStatLabel}>Haftalık Program</span>
                            </div>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStatItem}>
                            <span className={styles.heroStatIcon}>🧪</span>
                            <div className={styles.heroStatContent}>
                                <span className={styles.heroStatValue}>{Object.keys(PRODUCT_CATEGORIES).length}</span>
                                <span className={styles.heroStatLabel}>Ürün Kategorisi</span>
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
                            <span>Otomatik pH Dengesi</span>
                        </div>
                        <div className={styles.heroFeatureItem}>
                            <span className={styles.heroFeatureIcon}>🎯</span>
                            <span>Hassas Dozaj</span>
                        </div>
                        <div className={styles.heroFeatureItem}>
                            <span className={styles.heroFeatureIcon}>🏆</span>
                            <span>%100 Garanti</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Controls Container */}
            <div className={styles.controls}>

                {/* Base Nutrient Selection - Modern Card Style */}
                <div className={`${styles.controlGroup} ${styles.fullWidth}`}>
                    <label className={styles.controlLabel}>{t('selectRecipe')} (Base Nutrient)</label>
                    <motion.div
                        className={styles.baseNutrientSelector}
                        onClick={() => setShowBaseNutrientSelector(!showBaseNutrientSelector)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        style={{ '--selected-color': currentBaseNutrient.color }}
                    >
                        <div className={styles.baseNutrientSelected}>
                            <span className={styles.baseNutrientIcon}>{currentBaseNutrient.icon}</span>
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
                    <button
                        className={styles.productSelectorBtn}
                        onClick={() => setShowProductSelector(!showProductSelector)}
                    >
                        {selectedProducts.length} {t('productSelected')}
                        <motion.span
                            className={styles.dropdownArrow}
                            animate={{ rotate: showProductSelector ? 180 : 0 }}
                        >
                            ▼
                        </motion.span>
                    </button>
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
                            <h3>🌱 Temel Besin Seçimi</h3>
                            <p>Yetiştirme ortamınıza ve aşamanıza uygun temel besini seçin</p>
                        </div>
                        <div className={styles.baseNutrientGrid}>
                            {BASE_NUTRIENT_OPTIONS.map((option, index) => (
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
                                        <span className={styles.baseNutrientCardIcon}>{option.icon}</span>
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
                                    <h4 className={styles.baseNutrientCardName}>{option.shortLabel || option.label}</h4>
                                    <p className={styles.baseNutrientCardDesc}>{option.description}</p>
                                    <div className={styles.baseNutrientCardPhase}>
                                        {option.phase === 'vegetative' ? '🌿 Vejetatif' : '🌸 Çiçeklenme'}
                                    </div>
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
                                    ✓ Seçimi Tamamla
                                </button>
                            </div>
                        </div>

                        {/* Categorized Product Grid */}
                        <div className={styles.categoryContainer}>
                            {Object.entries(PRODUCT_CATEGORIES).map(([catKey, category]) => {
                                const productsInCategory = productsByCategory[catKey] || [];
                                
                                // Filtreleme: Base nutrient kategorisinde sadece seçili olanları göster
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
                                                                        <div className={styles.lockedBadge}>🔒 Temel</div>
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
                                    <h4>Seçili Ürünler</h4>
                                    <span className={styles.productSummaryCount}>
                                        {selectedProducts.length} ürün seçildi
                                    </span>
                                </div>
                            </div>
                            <motion.button
                                className={styles.productSummaryEditBtn}
                                onClick={() => setShowProductSelector(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span>✏️</span> Düzenle
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
                                                +{data.products.length - 3} daha
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
                {Object.entries(getDynamicPhaseInfo).map(([key, phase]) => (
                    <div key={key} className={styles.phaseItem}>
                        <span
                            className={styles.phaseColor}
                            style={{ backgroundColor: phase.color }}
                        />
                        <span className={styles.phaseLabel}>{t(phase.label_key)}</span>
                    </div>
                ))}
            </div>

            {/* Table Controls - Su Miktarı ve Hafta Kontrolleri */}
            <div className={styles.tableControls}>
                <div className={styles.tableControlsInner}>
                    {/* Su Miktarı Kontrolü */}
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

                    {/* Hafta Kontrolleri */}
                    <div className={styles.weekControl}>
                        <div className={styles.weekControlIcon}>📅</div>
                        <div className={styles.weekControlContent}>
                            <label className={styles.weekControlLabel}>Vejetatif Haftalar</label>
                            <div className={styles.weekControlButtons}>
                                <motion.button
                                    className={`${styles.weekBtn} ${styles.weekBtnMinus}`}
                                    onClick={removeVegWeek}
                                    disabled={vegWeeks <= 0}
                                    whileHover={{ scale: vegWeeks > 0 ? 1.1 : 1 }}
                                    whileTap={{ scale: vegWeeks > 0 ? 0.9 : 1 }}
                                >
                                    −
                                </motion.button>
                                <div className={styles.weekDisplay}>
                                    <span className={styles.weekCount}>{vegWeeks}</span>
                                    <span className={styles.weekSeparator}>/</span>
                                    <span className={styles.weekTotal}>{totalWeeks} hafta</span>
                                </div>
                                <motion.button
                                    className={`${styles.weekBtn} ${styles.weekBtnPlus}`}
                                    onClick={addVegWeek}
                                    disabled={vegWeeks >= 4}
                                    whileHover={{ scale: vegWeeks < 4 ? 1.1 : 1 }}
                                    whileTap={{ scale: vegWeeks < 4 ? 0.9 : 1 }}
                                >
                                    +
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Toplam Hafta Bilgisi */}
                    <div className={styles.weekInfo}>
                        <div className={styles.weekInfoItem}>
                            <span className={styles.weekInfoIcon}>🌱</span>
                            <span className={styles.weekInfoText}>Vej: {vegWeeks} hafta</span>
                        </div>
                        <div className={styles.weekInfoItem}>
                            <span className={styles.weekInfoIcon}>🌸</span>
                            <span className={styles.weekInfoText}>Çiçek: 8 hafta</span>
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
                            {dynamicWeekLabels.map((week, index) => {
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
                                                <span
                                                    className={styles.productDot}
                                                    style={{ backgroundColor: product.color }}
                                                />
                                                <div>
                                                    <div className={styles.productTitle}>{product.product_name}</div>
                                                    <div className={styles.productSubtitle}>{product.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.unitCell}>
                                            <span className={styles.unitBadge}>{product.dose_unit}</span>
                                        </td>
                                        {dynamicWeekLabels.map((week, index) => {
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
                                {dynamicWeekLabels.map((week, index) => {
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
                        🌱 Advanced Nutrients Besleme Rehberi
                    </h2>
                    <p className={styles.infoHeroDescription}>
                        Advanced Nutrients tarafından sunulan çeşitli bitki besin serilerine ait besleme programları ve temel ilkeleri. 
                        Hem organik hem de sentetik yetiştiricilik yöntemlerine yönelik, farklı uzmanlık seviyeleri ve 
                        yetiştirme ortamları için tasarlanmış ürün serileri.
                    </p>
                    <div className={styles.infoHeroStats}>
                        <div className={styles.infoHeroStat}>
                            <span className={styles.infoHeroStatValue}>{totalWeeks}</span>
                            <span className={styles.infoHeroStatLabel}>Haftalık Program</span>
                        </div>
                        <div className={styles.infoHeroStat}>
                            <span className={styles.infoHeroStatValue}>4+</span>
                            <span className={styles.infoHeroStatLabel}>Besin Serisi</span>
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
                <h3 className={styles.seriesSectionTitle}>Yaşam Döngüsü Fazları</h3>
                <div className={styles.lifecycleGrid}>
                    {LIFECYCLE_PHASES.map((phase, index) => (
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
                            <h4 className={styles.lifecycleTitle}>{phase.title}</h4>
                            <span className={styles.lifecycleDuration}>{phase.duration}</span>
                            <div className={styles.lifecycleLight}>
                                ☀️ Fotoperiyot: {phase.light}
                            </div>
                            <p className={styles.lifecycleDesc}>{phase.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Product Series */}
            <div className={styles.seriesSection}>
                <h3 className={styles.seriesSectionTitle}>Öne Çıkan Besin Serileri</h3>
                <div className={styles.seriesCards}>
                    {NUTRIENT_SERIES.map((series, index) => (
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
                            <p className={styles.seriesCardDesc}>{series.description}</p>
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
                {SUPPLEMENT_CATEGORIES.map((cat, index) => (
                    <motion.div
                        key={index}
                        className={styles.glassCard}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <div className={styles.glassCardIcon}>{cat.icon}</div>
                        <h4 className={styles.glassCardTitle}>{cat.title}</h4>
                        <p className={styles.glassCardText}>{cat.description}</p>
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
                    <h3 className={styles.proTipsTitle}>Profesyonel İpuçları</h3>
                </div>
                <div className={styles.proTipsList}>
                    {PRO_TIPS.map((tip, index) => (
                        <motion.div
                            key={index}
                            className={styles.proTipItem}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <span className={styles.proTipNumber}>{index + 1}</span>
                            <p className={styles.proTipText}>{tip}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Application Guidelines Accordion */}
            <div className={styles.accordion}>
                <h3 className={styles.seriesSectionTitle}>Uygulama Kılavuzu</h3>
                
                <motion.div className={styles.accordionItem} initial={false}>
                    <div 
                        className={styles.accordionHeader}
                        onClick={() => setOpenAccordion(openAccordion === 'dosage' ? null : 'dosage')}
                    >
                        <div className={styles.accordionHeaderLeft}>
                            <span className={styles.accordionIcon}>📏</span>
                            <span className={styles.accordionTitle}>Uygulama Oranları</span>
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
                                <p>Tüm ürünlerin dozajı <strong>litre başına mililitre (mL/L)</strong> olarak belirtilmiştir. Temel besinlerin oranları genellikle büyüme döneminin ilk haftalarında kademeli olarak artırılır. Yukarıdaki tabloda belirlediğiniz su miktarına göre toplam dozaj otomatik hesaplanmaktadır.</p>
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
                            <span className={styles.accordionTitle}>Hasat Öncesi Yıkama (Flush)</span>
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
                                <p>Çiçeklenme döneminin <strong>son haftası</strong> genellikle "Flush Periyodu" olarak adlandırılır. Bu dönemde ya besin uygulaması tamamen durdurulur ya da <strong>Flawless Finish®</strong> gibi özel bir yıkama solüsyonu kullanılır. Bu işlem, bitkide biriken mineralleri temizleyerek daha pürüzsüz bir son ürün elde edilmesini sağlar.</p>
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
                            <span className={styles.accordionTitle}>Coco Coir Özel Notları</span>
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
                                <p>Coco coir ortamları, en iyi sonucu <strong>bol drenajla birlikte en az günde bir kez beslendiğinde</strong> verir. Coco'nun doğal yapısı nedeniyle kalsiyum ve magnezyum tutma kapasitesi düşüktür, bu yüzden Sensi Coco veya Connoisseur Coco serileri bu eksikliği gidermek için özel olarak formüle edilmiştir.</p>
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
                            <span className={styles.accordionTitle}>Kişiselleştirme</span>
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
                                <p>Her bitki farklıdır! Besin ihtiyacının <strong>bitki genetiği ve yetiştirme ortamına</strong> göre değişeceği unutulmamalıdır. Resmi Advanced Nutrients hesaplayıcısı için <a href="https://www.advancednutrients.com/nutrient-calculator" target="_blank" rel="noopener noreferrer" style={{color: '#22c55e'}}>advancednutrients.com/nutrient-calculator</a> adresini ziyaret edebilirsiniz.</p>
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
                    <h3>Yetiştirici Garantisi</h3>
                    <p>Grower's Guarantee - %100 Para İadesi</p>
                </div>
                <div className={styles.guaranteeYear}>
                    <span className={styles.guaranteeYearValue}>1999</span>
                    <span className={styles.guaranteeYearLabel}>yılından beri</span>
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
            {content}
            <Footer />
        </div>
    );
}
