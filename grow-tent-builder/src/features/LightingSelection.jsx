import { useState } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import LightPlacementCanvas from '../components/LightPlacementCanvas';

const LIGHT_OPTIONS = [
    { id: 'led-100', name: 'Quantum Board 100W LED', type: 'LED', watts: 100, price: 85, coverage: 4, physicalWidth: 1, physicalDepth: 1 }, // ~30x30cm
    { id: 'led-240', name: 'Quantum Board 240W LED', type: 'LED', watts: 240, price: 180, coverage: 9, physicalWidth: 2, physicalDepth: 1 }, // ~60x30cm
    { id: 'led-480', name: 'Bar Style 480W LED', type: 'LED', watts: 480, price: 420, coverage: 16, physicalWidth: 3, physicalDepth: 3 }, // ~90x90cm
    { id: 'led-650', name: 'Bar Style 650W LED', type: 'LED', watts: 650, price: 600, coverage: 25, physicalWidth: 3.6, physicalDepth: 3.6 }, // ~110x110cm
    { id: 'hps-600', name: '600W HPS Kit', type: 'HPS', watts: 600, price: 150, coverage: 16, physicalWidth: 1.6, physicalDepth: 1 }, // ~50x30cm
    { id: 'hps-1000', name: '1000W DE HPS Kit', type: 'HPS', watts: 1000, price: 220, coverage: 25, physicalWidth: 2.3, physicalDepth: 1.1 }, // ~70x35cm
];

export default function LightingSelection() {
    const { state, dispatch } = useBuilder();
    const { t, formatPrice, formatUnit, getUnitLabel } = useSettings();
    const { tentSize, selectedItems } = state;
    const selectedLights = selectedItems.lighting;
    const [conflictError, setConflictError] = useState(null);

    const area = tentSize.width * tentSize.depth;
    const totalCoverage = selectedLights.reduce((sum, light) => sum + (light.coverage * (light.quantity || 1)), 0);
    const remainingCoverage = Math.max(0, area - totalCoverage);
    const isCovered = totalCoverage >= area;
    const recommendedWatts = area * 30;

    const checkConflict = (light) => {
        // Check if light dimensions exceed tent dimensions
        // We check both orientations (portrait/landscape)
        const lightW = light.physicalWidth;
        const lightD = light.physicalDepth;
        const tentW = tentSize.width;
        const tentD = tentSize.depth;

        // Check normal orientation
        const fitsNormal = lightW <= tentW && lightD <= tentD;
        // Check rotated orientation
        const fitsRotated = lightW <= tentD && lightD <= tentW;

        if (!fitsNormal && !fitsRotated) {
            return {
                hasConflict: true,
                message: `Warning: ${light.name} (${light.physicalWidth}x${light.physicalDepth}ft) is too large for your tent (${tentW}x${tentD}ft)!`
            };
        }
        return { hasConflict: false };
    };

    const handleToggleItem = (item) => {
        const isSelected = selectedLights.find(i => i.id === item.id);

        if (isSelected) {
            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'lighting', itemId: item.id } });
            setConflictError(null);
        } else {
            const conflict = checkConflict(item);
            if (conflict.hasConflict) {
                setConflictError(conflict.message);
                // Auto-clear error after 3 seconds
                setTimeout(() => setConflictError(null), 4000);
                return; // Prevent adding
            }

            dispatch({ type: 'ADD_ITEM', payload: { category: 'lighting', item } });
            setConflictError(null);
        }
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const areaLabel = getUnitLabel('area');

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>💡 {t('step2')}</h2>

            {conflictError && (
                <div className="fade-in" style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#ff5252',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>
                    {conflictError}
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1rem',
                padding: '1.5rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${isCovered ? 'var(--color-primary)' : 'rgba(255, 82, 82, 0.5)'}`
            }}>
                <InfoBox label={t('yourSpace')} value={`${formatUnit(area, 'area')} ${areaLabel}`} />
                <InfoBox label={t('recPower')} value={`~${recommendedWatts}W`} />
                <InfoBox
                    label={t('remainingCoverage')}
                    value={`${formatUnit(remainingCoverage, 'area')} ${areaLabel}`}
                    highlight={!isCovered}
                    success={isCovered}
                />
            </div>

            {selectedLights.length > 0 && <LightPlacementCanvas />}

            {isCovered && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.75rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-primary)',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                }}>
                    ✓ {t('fullycovered')}
                </div>
            )}

            {!isCovered && remainingCoverage > 0 && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.75rem',
                    background: 'rgba(255, 82, 82, 0.1)',
                    border: '1px solid #ff5252',
                    borderRadius: 'var(--radius-md)',
                    color: '#ff5252',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                }}>
                    ⚠ {t('needMoreLight')}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {LIGHT_OPTIONS.map((item) => {
                    const selectedItem = selectedLights.find(i => i.id === item.id);
                    const isSelected = !!selectedItem;
                    const quantity = selectedItem?.quantity || 0;
                    const isBestFit = Math.abs(item.coverage - area) < 5;

                    return (
                        <div
                            key={item.id}
                            style={{
                                padding: '1rem',
                                background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                borderRadius: 'var(--radius-md)',
                                position: 'relative',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isBestFit && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '10px',
                                    background: 'var(--color-primary)',
                                    color: '#000',
                                    fontSize: '0.75rem',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontWeight: 'bold'
                                }}>
                                    {t('bestFit')}
                                </div>
                            )}
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                {item.watts}W • {formatUnit(item.coverage, 'area')} {areaLabel} {t('coverage')}
                            </div>
                            <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: '1rem' }}>{formatPrice(item.price)}</div>

                            {!isSelected ? (
                                <button
                                    onClick={() => handleToggleItem(item)}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        background: 'var(--color-primary)',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: 'var(--radius-sm)',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    + Add
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch({ type: 'DECREMENT_ITEM', payload: { category: 'lighting', itemId: item.id } });
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            background: 'var(--bg-surface)',
                                            color: 'var(--text-primary)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-sm)',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        −
                                    </button>
                                    <div style={{
                                        padding: '0.5rem 1rem',
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--color-primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontWeight: 'bold',
                                        minWidth: '60px',
                                        textAlign: 'center'
                                    }}>
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch({ type: 'INCREMENT_ITEM', payload: { category: 'lighting', itemId: item.id } });
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            background: 'var(--color-primary)',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: 'var(--radius-sm)',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                <button
                    onClick={handleNext}
                    style={{
                        padding: '0.75rem 2rem',
                        background: 'var(--color-primary)',
                        color: '#000',
                        fontWeight: 'bold',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    {t('next')} &rarr;
                </button>
            </div>
        </div>
    );
}

function InfoBox({ label, value, highlight, success }) {
    let borderColor = 'var(--border-color)';
    let labelColor = 'var(--text-secondary)';

    if (success) {
        borderColor = 'var(--color-primary)';
        labelColor = 'var(--color-primary)';
    } else if (highlight) {
        borderColor = '#ff5252';
        labelColor = '#ff5252';
    }

    return (
        <div style={{
            padding: '1rem',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${borderColor}`,
            textAlign: 'center'
        }}>
            <div style={{ fontSize: '0.75rem', color: labelColor, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {label}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {value}
            </div>
        </div>
    );
}
