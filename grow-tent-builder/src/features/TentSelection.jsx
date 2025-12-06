import { useState, useMemo, useEffect } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { useBuilderProducts } from '../hooks';

export default function TentSelection() {
    const { state, dispatch } = useBuilder();
    const { t, language, unitSystem, formatUnit, getUnitLabel, formatPrice } = useSettings();
    const { tentSize, selectedItems, selectedPreset } = state;

    // Load tent products from API
    const { products: tentProducts, loading, error } = useBuilderProducts('tent');

    // Convert tent products to presets format for display
    const tentPresets = useMemo(() => {
        return tentProducts.map(tent => ({
            id: tent.id,
            label: tent.name,
            brand: tent.brand,
            fullName: tent.fullName,
            width: tent.dimensionsFt?.width || tent.dimensions?.width / 30.48,
            depth: tent.dimensionsFt?.depth || tent.dimensions?.depth / 30.48,
            height: tent.dimensionsFt?.height || tent.dimensions?.height / 30.48,
            widthCm: tent.dimensions?.width,
            depthCm: tent.dimensions?.depth,
            heightCm: tent.dimensions?.height,
            price: tent.price,
            tier: tent.tier,
            features: tent.features
        }));
    }, [tentProducts]);

    const [custom, setCustom] = useState(false);

    // Use tentSize directly as the source of truth, with local state only for uncommitted custom dimensions
    const [customDims, setCustomDims] = useState({
        width: tentSize.width,
        depth: tentSize.depth,
        height: tentSize.height
    });

    // Check if there's a preset tent selected
    const selectedTentFromPreset = selectedItems.tent && selectedItems.tent.length > 0 
        ? selectedItems.tent[0] 
        : null;

    const handlePresetClick = (preset) => {
        setCustom(false);
        // Update tent size
        dispatch({ type: 'SET_TENT_SIZE', payload: { width: preset.width, depth: preset.depth, height: preset.height, unit: 'ft' } });
        
        // Also add/update the tent product in selectedItems
        const tentProduct = tentProducts.find(t => t.id === preset.id);
        if (tentProduct) {
            // Remove existing tent first
            if (selectedItems.tent.length > 0) {
                dispatch({ type: 'REMOVE_ITEM', payload: { category: 'tent', itemId: selectedItems.tent[0].id } });
            }
            // Add new tent
            dispatch({
                type: 'ADD_ITEM',
                payload: {
                    category: 'tent',
                    item: {
                        id: tentProduct.id,
                        name: tentProduct.fullName || tentProduct.name,
                        brand: tentProduct.brand,
                        price: tentProduct.price,
                        dimensions: tentProduct.dimensions,
                        quantity: 1
                    }
                }
            });
        }
    };

    const applyCustom = () => {
        // dims state is already stored in feet (converted in onChange handlers)
        // So we can directly dispatch without additional conversion
        dispatch({
            type: 'SET_TENT_SIZE',
            payload: {
                width: customDims.width,
                depth: customDims.depth,
                height: customDims.height,
                unit: 'ft'
            }
        });
        // Clear tent product for custom dimensions
        if (selectedItems.tent.length > 0) {
            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'tent', itemId: selectedItems.tent[0].id } });
        }
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleBackToPresets = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const unitLabel = getUnitLabel('length');
    const areaLabel = getUnitLabel('area');
    const volLabel = getUnitLabel('volume');

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('selectTent')}</h2>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                {t('tentDesc')}
            </p>

            {/* Show selected tent from preset if exists */}
            {selectedTentFromPreset && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))',
                    border: '2px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    <div style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--color-primary)', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem'
                    }}>
                        ✓ {language === 'tr' ? 'Seçili Kabin' : 'Selected Tent'}
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                {selectedTentFromPreset.name}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {selectedTentFromPreset.dimensions 
                                    ? `${selectedTentFromPreset.dimensions.width}x${selectedTentFromPreset.dimensions.depth}x${selectedTentFromPreset.dimensions.height} cm`
                                    : `${Math.round(tentSize.width * 30.48)}x${Math.round(tentSize.depth * 30.48)}x${Math.round(tentSize.height * 30.48)} cm`
                                }
                            </div>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            {formatPrice(selectedTentFromPreset.price)}
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                marginBottom: '2rem',
                padding: '0.75rem 1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
            }}>
                <strong style={{ color: 'var(--color-primary)' }}>ℹ️ {unitSystem === 'METRIC' ? 'Kısaltmalar' : 'Abbreviations'}:</strong>{' '}
                {unitSystem === 'METRIC'
                    ? 'G = Genişlik • D = Derinlik • Y = Yükseklik'
                    : 'W = Width • D = Depth • H = Height'
                }
            </div>

            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {language === 'tr' ? 'Kabin Seçenekleri' : 'Tent Options'}
            </h3>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-danger)' }}>
                    {language === 'tr' ? 'Ürünler yüklenirken hata oluştu' : 'Error loading products'}
                </div>
            ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {tentPresets.map((preset) => {
                    const isSelected = (selectedTentFromPreset && selectedTentFromPreset.id === preset.id) ||
                        (!selectedTentFromPreset && !custom &&
                        Math.abs(state.tentSize.width - preset.width) < 0.1 &&
                        Math.abs(state.tentSize.depth - preset.depth) < 0.1);

                    const area = preset.width * preset.depth;
                    const volume = preset.width * preset.depth * preset.height;

                    return (
                        <button
                            key={preset.id}
                            onClick={() => handlePresetClick(preset)}
                            className="card-interactive"
                            style={{
                                padding: '1.25rem',
                                background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                position: 'relative',
                                color: 'var(--text-primary)'
                            }}
                        >
                            {/* Tier badge */}
                            <span style={{
                                position: 'absolute',
                                top: '0.75rem',
                                right: '0.75rem',
                                fontSize: '0.65rem',
                                padding: '0.2rem 0.5rem',
                                background: preset.tier === 'pro' 
                                    ? 'rgba(234, 179, 8, 0.2)' 
                                    : preset.tier === 'standard'
                                        ? 'rgba(59, 130, 246, 0.2)'
                                        : 'rgba(16, 185, 129, 0.2)',
                                color: preset.tier === 'pro'
                                    ? '#EAB308'
                                    : preset.tier === 'standard'
                                        ? '#3B82F6'
                                        : 'var(--color-primary)',
                                borderRadius: 'var(--radius-sm)',
                                textTransform: 'uppercase'
                            }}>
                                {preset.tier}
                            </span>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {/* Brand & Name */}
                                <div style={{ marginBottom: '0.25rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{preset.brand}</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        {preset.label}
                                    </div>
                                </div>

                                {/* Dimensions */}
                                <div style={{
                                    fontSize: '0.9rem',
                                    color: 'var(--color-secondary)',
                                    fontWeight: '500'
                                }}>
                                    {preset.widthCm}x{preset.depthCm}x{preset.heightCm} cm
                                </div>

                                {/* Stats */}
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <span>{language === 'tr' ? 'Alan' : 'Area'}: {formatUnit(area, 'area')} {areaLabel}</span>
                                </div>

                                {/* Price */}
                                <div style={{ 
                                    marginTop: '0.5rem', 
                                    fontSize: '1.1rem', 
                                    fontWeight: 'bold', 
                                    color: 'var(--color-primary)' 
                                }}>
                                    {formatPrice(preset.price)}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
            )}

            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => setCustom(!custom)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        marginBottom: '1rem',
                        fontSize: '0.9rem'
                    }}
                >
                    {custom ? 'Hide Custom Dimensions' : t('customDim')}
                </button>

                {custom && (
                    <div className="fade-in glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('width')} ({unitLabel})</label>
                            <input
                                type="number"
                                name="width"
                                value={unitSystem === 'METRIC' ? (customDims.width * 30.48).toFixed(0) : customDims.width}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const ftValue = unitSystem === 'METRIC' ? val / 30.48 : val;
                                    setCustomDims(prev => ({ ...prev, width: ftValue }));
                                }}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('depth')} ({unitLabel})</label>
                            <input
                                type="number"
                                name="depth"
                                value={unitSystem === 'METRIC' ? (customDims.depth * 30.48).toFixed(0) : customDims.depth}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const ftValue = unitSystem === 'METRIC' ? val / 30.48 : val;
                                    setCustomDims(prev => ({ ...prev, depth: ftValue }));
                                }}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('height')} ({unitLabel})</label>
                            <input
                                type="number"
                                name="height"
                                value={unitSystem === 'METRIC' ? (customDims.height * 30.48).toFixed(0) : customDims.height}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    const ftValue = unitSystem === 'METRIC' ? val / 30.48 : val;
                                    setCustomDims(prev => ({ ...prev, height: ftValue }));
                                }}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <button
                                onClick={applyCustom}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-primary)',
                                    width: '100%'
                                }}
                            >
                                Apply Custom Dimensions
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button
                    onClick={handleBackToPresets}
                    style={{
                        padding: '0.75rem 2rem',
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    &larr; {language === 'tr' ? 'Hazır Setler' : 'Ready Sets'}
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
                        cursor: 'pointer',
                        border: 'none',
                        boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
                    }}
                >
                    {t('next')} &rarr;
                </button>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none'
};
