import { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../context/SettingsContext';
import {
  fetchFeedingScheduleProducts,
  getWeekLabels,
  getPhaseInfo,
  getDefaultSelectedProducts,
  getProductCategories,
  getSubstrateTypes
} from '../../services/api/feedingScheduleApi';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Icon from '../Common/Icon';
import styles from './FeedingSchedule.module.css';
import { motion, AnimatePresence } from 'framer-motion';

// Static constants from API
const WEEK_LABELS = getWeekLabels();
const PHASE_INFO = getPhaseInfo();
const DEFAULT_SELECTED_PRODUCTS = getDefaultSelectedProducts();
const PRODUCT_CATEGORIES = getProductCategories();
const SUBSTRATE_TYPES = getSubstrateTypes();

export default function FeedingSchedule() {
  const { t } = useSettings();
  const [feedingScheduleData, setFeedingScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(DEFAULT_SELECTED_PRODUCTS);
  const [waterAmount, setWaterAmount] = useState(10); // Litre
  const [growType, setGrowType] = useState('indoor'); // indoor or outdoor
  const [substrate, setSubstrate] = useState('all-mix'); // all-mix, light-mix, coco-mix
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [highlightedWeek, setHighlightedWeek] = useState(null);

  // Fetch feeding schedule data from Supabase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchFeedingScheduleProducts();
        setFeedingScheduleData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading feeding schedule:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Seçilen ürünleri filtrele ve çevir
  const activeProducts = useMemo(() => {
    return feedingScheduleData.filter(product =>
      selectedProducts.includes(product.id) && product.schedule !== null
    ).map(product => ({
      ...product,
      category: t(product.category_key),
      dose_unit: product.dose_unit === 'ml/L' ? 'ml/L' : t(product.dose_unit), // Handle special units if any
      function: t(product.function_key),
      short_desc: t(product.short_desc_key),
      benefits: t(product.benefits_key) || [],
      note: product.note_key ? t(product.note_key) : null,
      foliar_dose: product.foliar_dose_key ? t(product.foliar_dose_key) : null
    }));
  }, [selectedProducts, t, feedingScheduleData]);

  // Ürün seçimi toggle
  const toggleProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Tüm ürünleri seç
  const selectAll = () => {
    setSelectedProducts(feedingScheduleData.filter(p => p.schedule !== null).map(p => p.id));
  };

  // Varsayılana dön
  const resetToDefault = () => {
    setSelectedProducts(DEFAULT_SELECTED_PRODUCTS);
  };

  // Substrat tipine göre schedule seç
  const getScheduleForSubstrate = (product, growType) => {
    const isLightOrCoco = substrate === 'light-mix' || substrate === 'coco-mix';

    // Fish·Mix için özel logic
    if (product.id === 'fish-mix') {
      if (isLightOrCoco) {
        return growType === 'indoor'
          ? product.schedule_lightmix_coco_indoor || product.schedule_indoor
          : product.schedule_lightmix_coco_outdoor || product.schedule_outdoor;
      } else {
        return growType === 'indoor'
          ? product.schedule_allmix_indoor || product.schedule_indoor
          : product.schedule_allmix_outdoor || product.schedule_outdoor;
      }
    }

    // Bio·Grow için substrat bazlı schedule
    if (product.id === 'bio-grow') {
      if (isLightOrCoco) {
        return product.schedule_lightmix_coco || product.schedule;
      } else {
        return product.schedule_allmix || product.schedule;
      }
    }

    // Diğer ürünler için varsayılan schedule
    return product.schedule;
  };

  // Hafta için doz hesapla
  const calculateDoseForWeek = (product, weekLabel) => {
    let schedule = getScheduleForSubstrate(product, growType);

    if (!schedule) return null;

    const dose = schedule[weekLabel];
    if (dose === undefined || dose === 'N/A') return null;
    if (typeof dose === 'string') return dose; // FLUSH, HARVEST, etc.

    return dose;
  };

  // Toplam doz hesapla (belirli bir hafta için)
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

  // Faz rengini al
  const getPhaseForWeek = (weekIndex) => {
    const weekNum = weekIndex + 1;
    for (const [, phase] of Object.entries(PHASE_INFO)) {
      if (phase.weeks.includes(weekNum)) {
        return phase;
      }
    }
    return null;
  };

  // Hücre içeriği render
  const renderCell = (product, weekLabel, weekIndex) => {
    const dose = calculateDoseForWeek(product, weekLabel);

    if (dose === null) {
      return <span className={styles.emptyCell}>—</span>;
    }

    if (typeof dose === 'string') {
      // FLUSH, HARVEST, STOP gibi özel değerler - Çeviri ekle
      const translatedDose = dose === 'FLUSH' || dose === 'HARVEST' || dose === 'STOP'
        ? t(`phaseLabel${dose.charAt(0) + dose.slice(1).toLowerCase()}`)
        : dose;

      const specialClasses = {
        'FLUSH': styles.flushCell,
        'HARVEST': styles.harvestCell,
        'STOP': styles.stopCell,
        '✓': styles.checkCell
      };
      return (
        <span className={`${styles.specialCell} ${specialClasses[dose] || ''}`}>
          {translatedDose}
        </span>
      );
    }

    // Sayısal doz
    const totalDose = dose * waterAmount;
    return (
      <div className={styles.doseCell}>
        <span className={styles.doseValue}>{dose}</span>
        <span className={styles.doseUnit}>{product.dose_unit.split(' ')[0]}</span>
        <span className={styles.totalDose}>({totalDose.toFixed(1)})</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Helmet>
          <title>{t('feedingScheduleTitle')} | GroWizard</title>
        </Helmet>
        <Navbar />
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Icon icon="mdi:sprout" size={48} />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>{t('loading') || 'Yükleniyor...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Helmet>
          <title>{t('feedingScheduleTitle')} | GroWizard</title>
        </Helmet>
        <Navbar />
        <div className={styles.container} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Icon icon="mdi:alert" size={48} />
            <p style={{ marginTop: '1rem', color: 'var(--color-danger)' }}>{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const content = (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brandBadge}>
            <img
              src="https://www.biobizz.com/wp-content/themes/developer-developer/assets/img/logo/biobizz-logo.png"
              alt="BioBizz Logo"
              className={styles.brandLogoImg}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <span className={styles.brandLogoFallback} style={{ display: 'none' }}>
              🌿 BioBizz
            </span>
          </div>
          <h1 className={styles.title}>
            {t('feedingScheduleTitle')}
          </h1>
          <p className={styles.subtitle}>
            {t('feedingScheduleSubtitle')}
          </p>
          <div className={styles.headerFeatures}>
            <span className={styles.featureTag}><Icon icon="mdi:leaf" size={16} /> {t('organic')}</span>
            <span className={styles.featureTag}>🇳🇱 {t('madeInHolland')}</span>
            <span className={styles.featureTag}><Icon icon="mdi:recycle" size={16} /> {t('sustainable')}</span>
          </div>
        </div>
      </div>

      {/* Substrate Selection */}
      <div className={styles.substrateSelector}>
        <h3 className={styles.substrateSelectorTitle}>
          {t('selectSubstrate')}
        </h3>
        <p className={styles.substrateSelectorDesc}>
          {t('substrateDesc')}
        </p>
        <div className={styles.substrateOptions}>
          <button
            className={`${styles.substrateBtn} ${substrate === 'all-mix' ? styles.active : ''}`}
            onClick={() => setSubstrate('all-mix')}
          >
            <span className={styles.substrateName}>ALL·MIX®</span>
            <span className={styles.substrateInfo}>{t('heavilyFertilized')}</span>
          </button>
          <button
            className={`${styles.substrateBtn} ${substrate === 'light-mix' ? styles.active : ''}`}
            onClick={() => setSubstrate('light-mix')}
          >
            <span className={styles.substrateName}>LIGHT·MIX®</span>
            <span className={styles.substrateInfo}>{t('lightlyFertilized')}</span>
          </button>
          <button
            className={`${styles.substrateBtn} ${substrate === 'coco-mix' ? styles.active : ''}`}
            onClick={() => setSubstrate('coco-mix')}
          >
            <span className={styles.substrateName}>COCO·MIX™</span>
            <span className={styles.substrateInfo}>{t('unfertilized')}</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
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

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            {t('growType')}
          </label>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleBtn} ${growType === 'indoor' ? styles.active : ''}`}
              onClick={() => setGrowType('indoor')}
            >
              <Icon icon="mdi:home" size={16} /> Indoor
            </button>
            <button
              className={`${styles.toggleBtn} ${growType === 'outdoor' ? styles.active : ''}`}
              onClick={() => setGrowType('outdoor')}
            >
              <Icon icon="mdi:weather-sunny" size={16} /> Outdoor
            </button>
          </div>
        </div>

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
                <button onClick={selectAll} className={styles.actionBtn}>
                  {t('selectAll')}
                </button>
                <button onClick={resetToDefault} className={styles.actionBtn}>
                  {t('resetDefault')}
                </button>
                <button onClick={() => setSelectedProducts([])} className={styles.actionBtn}>
                  {t('clearAll')}
                </button>
              </div>
            </div>

            <div className={styles.productGrid}>
              {feedingScheduleData.filter(p => p.schedule !== null).map(product => (
                <motion.div
                  key={product.id}
                  className={`${styles.productCard} ${selectedProducts.includes(product.id) ? styles.selected : ''}`}
                  onClick={() => toggleProduct(product.id)}
                  style={{ borderColor: selectedProducts.includes(product.id) ? product.color : 'transparent' }}
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
                  {product.short_desc_key && (
                    <div className={styles.productShortDesc}>{t(product.short_desc_key)}</div>
                  )}
                  {product.benefits_key && (
                    <ul className={styles.productBenefits}>
                      {(t(product.benefits_key) || []).slice(0, 2).map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  )}
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
            <span className={styles.phaseWeeks}>
              (WK {phase.weeks[0]}{phase.weeks.length > 1 ? `-${phase.weeks[phase.weeks.length - 1]}` : ''})
            </span>
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
                    {index < 2 && <div className={styles.weekPhase}><Icon icon="mdi:sprout" size={14} /></div>}
                    {index >= 2 && index < 6 && <div className={styles.weekPhase}><Icon icon="mdi:grass" size={14} /></div>}
                    {index >= 6 && index < 10 && <div className={styles.weekPhase}><Icon icon="mdi:flower" size={14} /></div>}
                    {index === 10 && <div className={styles.weekPhase}><Icon icon="mdi:water" size={14} /></div>}
                    {index === 11 && <div className={styles.weekPhase}><Icon icon="mdi:content-cut" size={14} /></div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {activeProducts.map(product => (
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
                        {renderCell(product, week, index)}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </AnimatePresence>

            {/* Totals Row */}
            {activeProducts.length > 0 && (
              <tr className={styles.totalsRow}>
                <td className={styles.totalsLabel} colSpan={2}>
                  <strong><Icon icon="mdi:chart-bar" size={16} /> {t('totalForWater')} ({waterAmount}L {t('water')})</strong>
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

      {/* Product Notes */}
      {activeProducts.some(p => p.note || p.foliar_dose) && (
        <div className={styles.notesSection}>
          <h3 className={styles.notesTitle}>
            <Icon icon="mdi:note-edit" size={20} /> {t('productNotes')}
          </h3>
          <div className={styles.notesList}>
            {activeProducts.filter(p => p.note || p.foliar_dose).map(product => (
              <div key={product.id} className={styles.noteItem}>
                <div className={styles.noteHeader}>
                  <span
                    className={styles.noteDot}
                    style={{ backgroundColor: product.color }}
                  />
                  <strong>{product.product_name}</strong>
                </div>
                {product.note && (
                  <p className={styles.noteText}>{product.note}</p>
                )}
                {product.foliar_dose && (
                  <p className={styles.foliarNote}>
                    <span className={styles.foliarIcon}><Icon icon="mdi:leaf" size={16} /></span>
                    <strong>{t('foliarApplication')}:</strong> {product.foliar_dose}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className={styles.tipsSection}>
        <h3 className={styles.tipsTitle}>
          <Icon icon="mdi:lightbulb" size={20} /> {t('usageTips')}
        </h3>
        <div className={styles.tipsList}>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}><Icon icon="mdi:flask" size={20} /></span>
            <p>{t('tip1')}</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}><Icon icon="mdi:thermometer" size={20} /></span>
            <p>{t('tip2')}</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}><Icon icon="mdi:water" size={20} /></span>
            <p>{t('tip3')}</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}><Icon icon="mdi:ruler" size={20} /></span>
            <p>{t('tip4')}</p>
          </div>
        </div>
      </div>

      {/* General Information Section */}
      <div className={styles.infoSection}>
        <h2 className={styles.infoSectionTitle}>
          <Icon icon="mdi:book-open-variant" size={24} /> {t('generalInfoTitle')}
        </h2>

        {/* Application Fundamentals */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}><Icon icon="mdi:sprout" size={20} /></span>
            {t('applicationFundamentals')}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:bed" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('substratePreparation')}</h4>
                <p>{t('substratePreparationDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:ruler" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('fertilizerStartTime')}</h4>
                <p>{t('fertilizerStartTimeDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:timer" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('vegetativeDuration')}</h4>
                <p>{t('vegetativeDurationDetail')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dosing and Safety */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}><Icon icon="mdi:scale" size={20} /></span>
            {t('dosingAndSafety')}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:alert" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('dosingPrinciple')}</h4>
                <p>{t('dosingPrincipleDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:swap-horizontal" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('mixing')}</h4>
                <p>{t('mixingDetail')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watering and pH */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}><Icon icon="mdi:water" size={20} /></span>
            {t('wateringAndPH')}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:shower" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('wateringFrequency')}</h4>
                <p>{t('wateringFrequencyDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:chart-bar" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('idealPHRange')}</h4>
                <p>{t('idealPHRangeDetail')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calmag Usage */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}><Icon icon="mdi:flask" size={20} /></span>
            {t('calmagUsage')}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:shield" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('calmagPrevention')}</h4>
                <p>{t('calmagPreventionDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:bandage" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('calmagDeficiency')}</h4>
                <p>{t('calmagDeficiencyDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:target" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('calmagPurpose')}</h4>
                <p>{t('calmagPurposeDetail')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Flexibility and Foliar */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}><Icon icon="mdi:leaf" size={20} /></span>
            {t('productFlexibility')}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:refresh" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('growthFertilizerFlexibility')}</h4>
                <p>{t('growthFertilizerFlexibilityDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:grass" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('foliarApplication')}</h4>
                <p>{t('foliarApplicationDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:syringe" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('foliarDosage')}</h4>
                <p>{t('foliarDosageDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:web" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('allSystems')}</h4>
                <p>{t('allSystemsDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:coconut" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('cocoMixRequirements')}</h4>
                <p>{t('cocoMixRequirementsDetail')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Notes */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}><Icon icon="mdi:earth" size={20} /></span>
            {t('environmentalNotes')}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:recycle" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('environmentalAttention')}</h4>
                <p>{t('environmentalAttentionDetail')}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}><Icon icon="mdi:sprout" size={20} /></div>
              <div className={styles.infoCardContent}>
                <h4>{t('productFeatures')}</h4>
                <p>{t('productFeaturesDetail')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {activeProducts.length === 0 && (
        <div className={styles.emptyState}>
          <Icon icon="mdi:sprout" size={48} />
          <h3>{t('noProductsSelected')}</h3>
          <p>{t('selectProductsPrompt')}</p>
          <button
            className={styles.selectProductsBtn}
            onClick={() => setShowProductSelector(true)}
          >
            {t('selectProducts')}
          </button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>{t('feedingScheduleTitle')} | GroWizard</title>
      </Helmet>
      <Navbar />
      {content}
      <Footer />
    </div>
  );
}
