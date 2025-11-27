import { useState, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { 
  FEEDING_SCHEDULE_DATA, 
  WEEK_LABELS, 
  PHASE_INFO, 
  DEFAULT_SELECTED_PRODUCTS,
  PRODUCT_CATEGORIES,
  SUBSTRATE_TYPES 
} from '../../data/feedingScheduleData';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './FeedingSchedule.module.css';

export default function FeedingSchedule() {
  const { t } = useSettings();
  const [selectedProducts, setSelectedProducts] = useState(DEFAULT_SELECTED_PRODUCTS);
  const [waterAmount, setWaterAmount] = useState(10); // Litre
  const [growType, setGrowType] = useState('indoor'); // indoor or outdoor
  const [substrate, setSubstrate] = useState('all-mix'); // all-mix, light-mix, coco-mix
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [highlightedWeek, setHighlightedWeek] = useState(null);

  // Seçilen ürünleri filtrele
  const activeProducts = useMemo(() => {
    return FEEDING_SCHEDULE_DATA.filter(product => 
      selectedProducts.includes(product.id) && product.schedule !== null
    );
  }, [selectedProducts]);

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
    setSelectedProducts(FEEDING_SCHEDULE_DATA.filter(p => p.schedule !== null).map(p => p.id));
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
    const phase = getPhaseForWeek(weekIndex);
    
    if (dose === null) {
      return <span className={styles.emptyCell}>—</span>;
    }
    
    if (typeof dose === 'string') {
      // FLUSH, HARVEST, STOP gibi özel değerler
      const specialClasses = {
        'FLUSH': styles.flushCell,
        'HARVEST': styles.harvestCell,
        'STOP': styles.stopCell,
        '✓': styles.checkCell
      };
      return (
        <span className={`${styles.specialCell} ${specialClasses[dose] || ''}`}>
          {dose}
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

  const content = (
    <div className={styles.container}>
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
            <span className={styles.brandLogoFallback} style={{display: 'none'}}>
              🌿 BioBizz
            </span>
          </div>
          <h1 className={styles.title}>
            {t('feedingScheduleTitle') || 'BioBizz Beslenme Programı'}
          </h1>
          <p className={styles.subtitle}>
            {t('feedingScheduleSubtitle') || 'İnteraktif beslenme planı oluşturucu'}
          </p>
          <div className={styles.headerFeatures}>
            <span className={styles.featureTag}>🌱 {t('organic') || 'Organik'}</span>
            <span className={styles.featureTag}>🇳🇱 {t('madeInHolland') || 'Hollanda\'da Üretildi'}</span>
            <span className={styles.featureTag}>♻️ {t('sustainable') || 'Sürdürülebilir'}</span>
          </div>
        </div>
      </div>

      {/* Substrate Selection */}
      <div className={styles.substrateSelector}>
        <h3 className={styles.substrateSelectorTitle}>
          {t('selectSubstrate') || 'Substrat Seçin'}
        </h3>
        <p className={styles.substrateSelectorDesc}>
          {t('substrateDesc') || 'Dozaj miktarları seçtiğiniz substrata göre otomatik ayarlanır.'}
        </p>
        <div className={styles.substrateOptions}>
          <button
            className={`${styles.substrateBtn} ${substrate === 'all-mix' ? styles.active : ''}`}
            onClick={() => setSubstrate('all-mix')}
          >
            <span className={styles.substrateName}>ALL·MIX®</span>
            <span className={styles.substrateInfo}>{t('heavilyFertilized') || 'Ağır Gübrelenmiş'}</span>
          </button>
          <button
            className={`${styles.substrateBtn} ${substrate === 'light-mix' ? styles.active : ''}`}
            onClick={() => setSubstrate('light-mix')}
          >
            <span className={styles.substrateName}>LIGHT·MIX®</span>
            <span className={styles.substrateInfo}>{t('lightlyFertilized') || 'Hafif Gübrelenmiş'}</span>
          </button>
          <button
            className={`${styles.substrateBtn} ${substrate === 'coco-mix' ? styles.active : ''}`}
            onClick={() => setSubstrate('coco-mix')}
          >
            <span className={styles.substrateName}>COCO·MIX™</span>
            <span className={styles.substrateInfo}>{t('unfertilized') || 'Gübresiz'}</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            {t('waterAmount') || 'Su Miktarı'}
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
            {t('growType') || 'Yetiştirme Tipi'}
          </label>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleBtn} ${growType === 'indoor' ? styles.active : ''}`}
              onClick={() => setGrowType('indoor')}
            >
              🏠 Indoor
            </button>
            <button
              className={`${styles.toggleBtn} ${growType === 'outdoor' ? styles.active : ''}`}
              onClick={() => setGrowType('outdoor')}
            >
              ☀️ Outdoor
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            {t('products') || 'Ürünler'}
          </label>
          <button 
            className={styles.productSelectorBtn}
            onClick={() => setShowProductSelector(!showProductSelector)}
          >
            {selectedProducts.length} {t('productSelected') || 'ürün seçili'}
            <span className={styles.dropdownArrow}>{showProductSelector ? '▲' : '▼'}</span>
          </button>
        </div>
      </div>

      {/* Product Selector Dropdown */}
      {showProductSelector && (
        <div className={styles.productSelector}>
          <div className={styles.productSelectorHeader}>
            <h3>{t('selectProducts') || 'Ürün Seçin'}</h3>
            <div className={styles.productSelectorActions}>
              <button onClick={selectAll} className={styles.actionBtn}>
                {t('selectAll') || 'Tümünü Seç'}
              </button>
              <button onClick={resetToDefault} className={styles.actionBtn}>
                {t('resetDefault') || 'Varsayılana Dön'}
              </button>
              <button onClick={() => setSelectedProducts([])} className={styles.actionBtn}>
                {t('clearAll') || 'Temizle'}
              </button>
            </div>
          </div>
          
          <div className={styles.productGrid}>
            {FEEDING_SCHEDULE_DATA.filter(p => p.schedule !== null).map(product => (
              <div
                key={product.id}
                className={`${styles.productCard} ${selectedProducts.includes(product.id) ? styles.selected : ''}`}
                onClick={() => toggleProduct(product.id)}
                style={{ borderColor: selectedProducts.includes(product.id) ? product.color : 'transparent' }}
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
                {product.function && (
                  <div className={styles.productFunction}>{product.function}</div>
                )}
                {product.short_desc && (
                  <div className={styles.productShortDesc}>{product.short_desc}</div>
                )}
                {product.benefits && product.benefits.length > 0 && (
                  <ul className={styles.productBenefits}>
                    {product.benefits.slice(0, 2).map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase Legend */}
      <div className={styles.phaseLegend}>
        {Object.entries(PHASE_INFO).map(([key, phase]) => (
          <div key={key} className={styles.phaseItem}>
            <span 
              className={styles.phaseColor} 
              style={{ backgroundColor: phase.color }}
            />
            <span className={styles.phaseLabel}>{phase.label}</span>
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
                {t('product') || 'Ürün'}
              </th>
              <th className={styles.unitHeader}>
                {t('unit') || 'Birim'}
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
                    {index < 2 && <div className={styles.weekPhase}>🌱</div>}
                    {index >= 2 && index < 6 && <div className={styles.weekPhase}>🌿</div>}
                    {index >= 6 && index < 10 && <div className={styles.weekPhase}>🌸</div>}
                    {index === 10 && <div className={styles.weekPhase}>💧</div>}
                    {index === 11 && <div className={styles.weekPhase}>✂️</div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {activeProducts.map(product => (
              <tr key={product.id} className={styles.productRow}>
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
              </tr>
            ))}
            
            {/* Totals Row */}
            {activeProducts.length > 0 && (
              <tr className={styles.totalsRow}>
                <td className={styles.totalsLabel} colSpan={2}>
                  <strong>📊 {t('totalForWater') || 'Toplam'} ({waterAmount}L {t('water') || 'su'})</strong>
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
            📝 {t('productNotes') || 'Ürün Notları'}
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
                    <span className={styles.foliarIcon}>🍃</span>
                    <strong>Yaprak Spreyi:</strong> {product.foliar_dose}
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
          💡 {t('usageTips') || 'Kullanım İpuçları'}
        </h3>
        <div className={styles.tipsList}>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>⚗️</span>
            <p>{t('tip1') || 'Ürünleri her zaman su ile karıştırın, asla birbiriyle doğrudan karıştırmayın.'}</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>🌡️</span>
            <p>{t('tip2') || 'İdeal pH aralığı toprak için 6.0-7.0, hidroponik için 5.5-6.5 arasındadır.'}</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>💧</span>
            <p>{t('tip3') || 'FLUSH haftasında sadece temiz su kullanın, besin vermeyin.'}</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>📏</span>
            <p>{t('tip4') || 'Dozajları bitkinizin tepkisine göre ayarlayın, her bitki farklıdır.'}</p>
          </div>
        </div>
      </div>

      {/* General Information Section */}
      <div className={styles.infoSection}>
        <h2 className={styles.infoSectionTitle}>
          📚 {t('generalInfoTitle') || 'Biobizz Besin Çizelgesi Genel Bilgileri'}
        </h2>

        {/* Application Fundamentals */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}>🌱</span>
            {t('applicationFundamentals') || 'Uygulama Temelleri'}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🛏️</div>
              <div className={styles.infoCardContent}>
                <h4>{t('substratePreparation') || 'Substrat Hazırlığı'}</h4>
                <p>{t('substratePreparationDetail') || 'Başlamadan önce Biobizz® substratlarını kullanarak sıcak bir yatak hazırlayın.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>📏</div>
              <div className={styles.infoCardContent}>
                <h4>{t('fertilizerStartTime') || 'Gübreye Başlama Zamanı'}</h4>
                <p>{t('fertilizerStartTimeDetail') || 'Fidanınız 10-15 cm uzunluğa ulaştığında veya 2-4 yaprağı olduğunda gübre kullanmaya başlayın.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>⏱️</div>
              <div className={styles.infoCardContent}>
                <h4>{t('vegetativeDuration') || 'Vejetatif Süre'}</h4>
                <p>{t('vegetativeDurationDetail') || 'Vejetatif aşama, gerektiği kadar sürebilir.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dosing and Safety */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}>⚖️</span>
            {t('dosingAndSafety') || 'Dozaj ve Güvenlik'}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>⚠️</div>
              <div className={styles.infoCardContent}>
                <h4>{t('dosingPrinciple') || 'Dozaj Prensibi'}</h4>
                <p>{t('dosingPrincipleDetail') || 'Her zaman mütevazı olmak daha iyidir, fazlasını eklemektense. Bir bitki çok az besinden ölmez, ancak aşırı dozdan hayatta kalamaz.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🔀</div>
              <div className={styles.infoCardContent}>
                <h4>{t('mixing') || 'Karıştırma'}</h4>
                <p>{t('mixingDetail') || 'Aynı sulama suyunda birden fazla gübreyi karıştırabilirsiniz.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Watering and pH */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}>💧</span>
            {t('wateringAndPH') || 'Sulama ve pH'}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🚿</div>
              <div className={styles.infoCardContent}>
                <h4>{t('wateringFrequency') || 'Sulama Sıklığı'}</h4>
                <p>{t('wateringFrequencyDetail') || 'Haftada 2-3 kez sulayın, suyun tahliye olmasına (run-off) gerek yoktur.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>📊</div>
              <div className={styles.infoCardContent}>
                <h4>{t('idealPHRange') || 'İdeal pH Aralığı'}</h4>
                <p>{t('idealPHRangeDetail') || 'pH değeri 6.2 ile 6.5 arasında idealdir. Kontrollü pH değeri 6.2 ile 6.3 arasında olmalıdır.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Calmag Usage */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}>🧪</span>
            {t('calmagUsage') || 'Calmag Kullanımı'}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🛡️</div>
              <div className={styles.infoCardContent}>
                <h4>{t('calmagPrevention') || 'Calmag Önleme'}</h4>
                <p>{t('calmagPreventionDetail') || 'Ters ozmoz (RO) veya çok yumuşak su ile yetiştirme yapılırken Calmag takviyesinin her sulamada kullanılması önerilir.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🩹</div>
              <div className={styles.infoCardContent}>
                <h4>{t('calmagDeficiency') || 'Calmag Eksiklik Düzeltme'}</h4>
                <p>{t('calmagDeficiencyDetail') || 'Kalsiyum/Magnezyum eksikliği belirtileri fark edildiğinde haftada bir kez kullanılması önerilir.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🎯</div>
              <div className={styles.infoCardContent}>
                <h4>{t('calmagPurpose') || 'Calmag Amacı'}</h4>
                <p>{t('calmagPurposeDetail') || 'Olası Ca ve Mg eksikliklerinden bitkiyi korumak için tasarlanmıştır.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Flexibility and Foliar */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}>🍃</span>
            {t('productFlexibility') || 'Ürün Esnekliği ve Yaprak Uygulaması'}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🔄</div>
              <div className={styles.infoCardContent}>
                <h4>{t('growthFertilizerFlexibility') || 'Büyüme Gübresi Esnekliği'}</h4>
                <p>{t('growthFertilizerFlexibilityDetail') || 'Vejetatif aşamada Bio·Grow®\'u Fish·Mix™ ile değiştirmek faydalıdır, ancak çiçeklenmeyi tetiklemek istendiğinde Bio·Grow®\'a geri dönülmelidir.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🌿</div>
              <div className={styles.infoCardContent}>
                <h4>{t('foliarApplication') || 'Yaprak Uygulaması (Foliar)'}</h4>
                <p>{t('foliarApplicationDetail') || 'Alg·A·Mic™, Acti·Vera® ve Fish·Mix™ çiçeklenmenin ikinci haftasına kadar haftada 1-3 kez yaprak spreyi olarak uygulanabilir.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>💉</div>
              <div className={styles.infoCardContent}>
                <h4>{t('foliarDosage') || 'Yaprak Uygulaması Dozajı'}</h4>
                <p>{t('foliarDosageDetail') || '1 veya 2 ürün kullanılırken dozaj her biri için 1-2 ml/L sudur. 3 ürün birden kullanılıyorsa, dozaj her biri için maksimum 1 ml/L sudur.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🌐</div>
              <div className={styles.infoCardContent}>
                <h4>{t('allSystems') || 'Tüm Sistemler'}</h4>
                <p>{t('allSystemsDetail') || 'Bio·Bloom™, Bio·Heaven™ ve Top·Max™ dahil birçok ürün tüm sistemler (toprak, hidroponik ve aeroponik) için geçerlidir.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🥥</div>
              <div className={styles.infoCardContent}>
                <h4>{t('cocoMixRequirements') || 'Coco Mix Gereksinimleri'}</h4>
                <p>{t('cocoMixRequirementsDetail') || 'Coco Mix üzerinde yetiştirme için pH ayarlaması yapmak ve bir enzim ürünü (örneğin Acti·Vera®) kullanmak esastır.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Notes */}
        <div className={styles.infoCategory}>
          <h3 className={styles.infoCategoryTitle}>
            <span className={styles.infoCategoryIcon}>🌍</span>
            {t('environmentalNotes') || 'Çevresel Notlar'}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>♻️</div>
              <div className={styles.infoCardContent}>
                <h4>{t('environmentalAttention') || 'Çevresel Dikkat'}</h4>
                <p>{t('environmentalAttentionDetail') || 'Bu Besin Çizelgesini kullandıktan sonra çevreyi düşünün.'}</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardIcon}>🌿</div>
              <div className={styles.infoCardContent}>
                <h4>{t('productFeatures') || 'Ürün Özellikleri'}</h4>
                <p>{t('productFeaturesDetail') || 'Ürünler %100 Turbasızdır (PEAT FREE) ve Düşük CO2 Ayak İzi\'ne sahiptir (LOW CO2 FOOTPRINT).'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {activeProducts.length === 0 && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🌱</span>
          <h3>{t('noProductsSelected') || 'Henüz ürün seçilmedi'}</h3>
          <p>{t('selectProductsPrompt') || 'Beslenme programınızı oluşturmak için yukarıdan ürün seçin.'}</p>
          <button 
            className={styles.selectProductsBtn}
            onClick={() => setShowProductSelector(true)}
          >
            {t('selectProducts') || 'Ürün Seç'}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      {content}
      <Footer />
    </div>
  );
}
