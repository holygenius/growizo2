import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { PRESET_SETS } from '../data/presetSets';
import ElectricCostEstimator from '../components/ElectricCostEstimator';
import styles from './SummaryView.module.css';

export default function SummaryView() {
    const { state, dispatch } = useBuilder();
    const { t, language, formatPrice, formatUnit, getUnitLabel } = useSettings();
    const { tentSize, selectedItems, totals, selectedPreset, mediaType } = state;

    // Find preset info if a preset was selected
    const presetInfo = selectedPreset ? PRESET_SETS.find(p => p.id === selectedPreset) : null;

    const handleRestart = () => {
        if (window.confirm(t('restartConfirm'))) {
            dispatch({ type: 'RESET' });
        }
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const handleEditSet = () => {
        dispatch({ type: 'CLEAR_PRESET' });
        dispatch({ type: 'SET_STEP', payload: 1 });
    };

    const area = tentSize.width * tentSize.depth;
    const volume = tentSize.width * tentSize.depth * tentSize.height;
    const totalLightCoverage = selectedItems.lighting.reduce((acc, l) => acc + (l.coverage || 0), 0);
    const totalFanCFM = selectedItems.ventilation.filter(i => i.type === 'Inline Fan').reduce((acc, f) => acc + f.cfm, 0);

    const unitLabel = getUnitLabel('length');
    const areaLabel = getUnitLabel('area');
    const volLabel = getUnitLabel('volume');

    const warnings = [];
    if (selectedItems.lighting.length > 0 && totalLightCoverage < area) {
        warnings.push(t('warnLight', { cov: formatUnit(totalLightCoverage, 'area'), area: formatUnit(area, 'area'), unit: areaLabel }));
    }
    if (selectedItems.ventilation.length > 0 && totalFanCFM < totals.cfmRequired) {
        warnings.push(t('warnCFM', { cfm: totalFanCFM, req: totals.cfmRequired }));
    }

    const categories = [
        { key: 'tent', label: t('step1') },
        { key: 'lighting', label: t('step2') },
        { key: 'ventilation', label: t('step3') },
        { key: 'environment', label: t('step4') },
        { key: 'substrates', label: language === 'tr' ? 'Substrat' : 'Substrate' },
        { key: 'nutrients', label: t('step6') },
        { key: 'monitoring', label: t('step7') },
        { key: 'accessories', label: language === 'tr' ? 'Aksesuarlar' : 'Accessories' },
    ];

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('yourSetup')}</h2>

            {/* Preset Banner */}
            {presetInfo && (
                <div style={{ 
                    marginBottom: '2rem', 
                    padding: '1.5rem', 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
                    border: '1px solid rgba(16, 185, 129, 0.3)', 
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--color-primary)', 
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.25rem'
                        }}>
                            {language === 'tr' ? 'Seçilen Hazır Set' : 'Selected Preset'}
                        </div>
                        <div style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold',
                            color: 'var(--text-primary)'
                        }}>
                            {presetInfo.name[language]}
                        </div>
                        <div style={{ 
                            fontSize: '0.875rem', 
                            color: 'var(--text-secondary)',
                            marginTop: '0.25rem'
                        }}>
                            {presetInfo.description[language]}
                        </div>
                    </div>
                    <button
                        className="no-print"
                        onClick={handleEditSet}
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: 'transparent',
                            border: '1px solid var(--color-primary)',
                            color: 'var(--color-primary)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                    >
                        {language === 'tr' ? '✏️ Seti Düzenle' : '✏️ Customize Set'}
                    </button>
                </div>
            )}

            {warnings.length > 0 && (
                <div className="no-print" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255, 82, 82, 0.1)', border: '1px solid #ff5252', borderRadius: 'var(--radius-md)' }}>
                    <h3 style={{ color: '#ff5252', marginBottom: '0.5rem', fontSize: '1rem' }}>{t('compatWarn')}</h3>
                    <ul style={{ paddingLeft: '1.5rem', color: '#ff5252' }}>
                        {warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
            )}

            <p className="no-print" style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                {t('reviewDesc')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }} className={styles.summaryGrid}>
                <div>
                    <div style={{ marginBottom: '2rem', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('tentDetails')}</h3>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('dimensions')}</div>
                                <div style={{ fontWeight: 'bold' }}>
                                    {formatUnit(tentSize.width)}' x {formatUnit(tentSize.depth)}' x {formatUnit(tentSize.height)}' {unitLabel}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('area')}</div>
                                <div style={{ fontWeight: 'bold' }}>{formatUnit(area, 'area')} {areaLabel}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('volume')}</div>
                                <div style={{ fontWeight: 'bold' }}>{formatUnit(volume, 'volume')} {volLabel}</div>
                            </div>
                        </div>
                    </div>

                    {categories.map(cat => {
                        const items = selectedItems[cat.key];
                        if (items.length === 0) return null;

                        return (
                            <div key={cat.key} style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>{cat.label}</h3>
                                <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    {items.map((item, idx) => {
                                        const quantity = item.quantity || 1;
                                        const totalPrice = (item.price || 0) * quantity;
                                        // Support both name and product_name for nutrients
                                        const displayName = item.name || item.product_name || 'Unknown';

                                        return (
                                            <div key={idx} style={{
                                                padding: '1rem',
                                                borderBottom: idx < items.length - 1 ? '1px solid var(--border-color)' : 'none',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    <div style={{ fontWeight: '500' }}>
                                                        {quantity > 1 && <span style={{ color: 'var(--color-primary)', marginRight: '0.5rem' }}>{quantity}x</span>}
                                                        {displayName}
                                                        {item.selectedPackaging && <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>({item.selectedPackaging})</span>}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        {item.brand && <span>{item.brand} • </span>}
                                                        {item.type} {item.watts ? `• ${item.watts}W` : ''} {item.cfm ? `• ${item.cfm} CFM` : ''}
                                                        {quantity > 1 && item.price > 0 && <span style={{ marginLeft: '0.5rem' }}>({formatPrice(item.price)} each)</span>}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: 'bold' }}>{formatPrice(totalPrice)}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.summarySidebar}>
                    <div className={styles.summaryCard} style={{ maxWidth: '600px', margin: '0 auto', width: '100%', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1.5rem', padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', textAlign: 'center' }}>{t('totalEst')}</h3>

                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{t('equipCost')}</span>
                            <span style={{ fontWeight: 'bold' }}>{formatPrice(totals.cost)}</span>
                        </div>

                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{t('totalPower')}</span>
                            <span style={{ fontWeight: 'bold' }}>{totals.power}W</span>
                        </div>

                        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{t('estMonthly')}</span>
                            <span style={{ fontWeight: 'bold' }}>{formatPrice((totals.power * 18 * 30) / 1000 * 0.12)}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
                            {t('powerNote')}
                        </div>

                        <button
                            className="no-print"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--color-primary)',
                                color: '#000',
                                fontWeight: 'bold',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem',
                                fontSize: '1.1rem'
                            }}
                            onClick={() => window.print()}
                        >
                            {t('printPdf')}
                        </button>

                        <button
                            className="no-print"
                            onClick={handleRestart}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer'
                            }}
                        >
                            {t('startOver')}
                        </button>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <ElectricCostEstimator />
                    </div>
                </div>
            </div>

            <div className="no-print" style={{ marginTop: '2rem' }}>
                <button
                    onClick={handleBack}
                    style={{
                        padding: '0.75rem 2rem',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    &larr; {t('back')}
                </button>
            </div>
        </div>
    );
}
