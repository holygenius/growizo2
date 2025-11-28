import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import {
    ADVANCED_NUTRIENTS_DATA,
    WEEK_LABELS,
    PHASE_INFO,
    BASE_NUTRIENT_OPTIONS
} from '../../data/advancedNutrientsData';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './FeedingSchedule.module.css'; // Reusing styles for consistency
import { motion, AnimatePresence } from 'framer-motion';

export default function AdvancedNutrientsSchedule() {
    const { t } = useSettings();
    const [selectedBaseNutrientId, setSelectedBaseNutrientId] = useState(BASE_NUTRIENT_OPTIONS[0].id);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [waterAmount, setWaterAmount] = useState(10); // Litre
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [highlightedWeek, setHighlightedWeek] = useState(null);

    // Get current base nutrient option
    const currentBaseNutrient = useMemo(() => {
        return BASE_NUTRIENT_OPTIONS.find(opt => opt.id === selectedBaseNutrientId) || BASE_NUTRIENT_OPTIONS[0];
    }, [selectedBaseNutrientId]);

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
        for (const [, phase] of Object.entries(PHASE_INFO)) {
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

    const content = (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className={styles.header} style={{ background: 'linear-gradient(135deg, #1a472a 0%, #0d1f12 100%)' }}>
                <div className={styles.headerContent}>
                    <div className={styles.brandBadge}>
                        <h2>🌱 {t('landingFeedingTitle')}</h2>
                    </div>
                    <h1 className={styles.title}>
                        {t('anFeedingScheduleTitle')}
                    </h1>
                    <p className={styles.subtitle}>
                        {t('anFeedingScheduleSubtitle')}
                    </p>
                    <div className={styles.headerFeatures}>
                        <span className={styles.featureTag}>🏆 {t('phPerfect')}</span>
                        <span className={styles.featureTag}>🔬 {t('scientific')}</span>
                        <span className={styles.featureTag}>💯 {t('guaranteed')}</span>
                    </div>
                </div>
            </div>

            {/* Controls Container */}
            <div className={styles.controls} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>

                {/* Base Nutrient Selection */}
                <div className={styles.controlGroup} style={{ gridColumn: 'span 2' }}>
                    <label className={styles.controlLabel}>{t('selectRecipe')} (Base Nutrient)</label>
                    <select
                        className={styles.selectInput}
                        value={selectedBaseNutrientId}
                        onChange={(e) => setSelectedBaseNutrientId(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            fontSize: '1.1rem',
                            cursor: 'pointer'
                        }}
                    >
                        {BASE_NUTRIENT_OPTIONS.map(opt => (
                            <option key={opt.id} value={opt.id} style={{ background: '#1a1a1a' }}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Water Amount */}
                <div className={styles.controlGroup}>
                    <label className={styles.controlLabel}>
                        {t('waterAmount')}
                    </label>
                    <div className={styles.waterInput}>
                        <input
                            type="number"
                            value={waterAmount}
                            onChange={(e) => setWaterAmount(Math.max(1, parseFloat(e.target.value) || 1))}
                            min="1"
                            max="1000"
                            className={styles.numberInput}
                        />
                        <span className={styles.inputUnit}>L</span>
                    </div>
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
                                <button onClick={selectAllAdditives} className={styles.actionBtn}>
                                    {t('selectAll')}
                                </button>
                                <button onClick={resetToDefault} className={styles.actionBtn}>
                                    {t('resetDefault')}
                                </button>
                                <button onClick={() => setSelectedProducts(currentBaseNutrient.products)} className={styles.actionBtn}>
                                    {t('clearAll')}
                                </button>
                            </div>
                        </div>

                        <div className={styles.productGrid}>
                            {ADVANCED_NUTRIENTS_DATA.map(product => {
                                const isBase = product.category_key === 'base_nutrient';
                                const isCurrentBase = currentBaseNutrient.products.includes(product.id);

                                // Hide base nutrients that are not the current selection
                                if (isBase && !isCurrentBase) return null;

                                return (
                                    <motion.div
                                        key={product.id}
                                        className={`${styles.productCard} ${selectedProducts.includes(product.id) ? styles.selected : ''} ${isCurrentBase ? styles.locked : ''}`}
                                        onClick={() => toggleProduct(product.id)}
                                        style={{
                                            borderColor: selectedProducts.includes(product.id) ? product.color : 'transparent',
                                            opacity: isBase && !isCurrentBase ? 0.5 : 1
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className={styles.productCardHeader}>
                                            <span
                                                className={styles.productColorDot}
                                                style={{ backgroundColor: product.color }}
                                            />
                                            <span className={styles.productName}>{product.product_name}</span>
                                            {selectedProducts.includes(product.id) && (
                                                <span className={styles.checkmark}>✓</span>
                                            )}
                                        </div>
                                        {product.function_key && (
                                            <div className={styles.productFunction}>{t(product.function_key)}</div>
                                        )}
                                    </motion.div>
                                );
                            })}
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
                            {WEEK_LABELS.map((week, index) => {
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
                                        {WEEK_LABELS.map((week, index) => {
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
                                {WEEK_LABELS.map((week, index) => {
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
