import { useMemo } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { useMultipleBuilderProducts } from '../hooks';

export default function VentilationSelection() {
    const { state, dispatch } = useBuilder();
    const { t, language, formatPrice } = useSettings();
    const { totals, selectedItems } = state;
    const selectedVentilation = selectedItems.ventilation;

    // Load ventilation products from API
    const { products, loading, error } = useMultipleBuilderProducts(['fan', 'filter', 'ventilationSet']);

    // Convert products to display format
    const inlineFanOptions = useMemo(() => {
        return (products.fan || []).map(fan => ({
            id: fan.id,
            name: fan.fullName || fan.name,
            type: 'Inline Fan',
            cfm: fan.specs?.cfm || fan.capacity || 0,
            watts: fan.specs?.wattage || 0,
            price: fan.price,
            tier: fan.tier,
            brand: fan.brand
        }));
    }, [products.fan]);

    const ventilationSetOptions = useMemo(() => {
        return (products.ventilationSet || []).map(set => ({
            id: set.id,
            name: set.name,
            type: 'set',
            cfm: set.capacity || 0,
            watts: 0,
            price: set.price,
            tier: set.tier,
            includes: set.includes
        }));
    }, [products.ventilationSet]);

    const filterOptions = useMemo(() => {
        return (products.filter || []).map(filter => ({
            id: filter.id,
            name: filter.name,
            type: 'filter',
            capacity: filter.capacity,
            price: filter.price,
            tier: filter.tier
        }));
    }, [products.filter]);

    const handleToggleItem = (item) => {
        const isSelected = selectedVentilation.find(i => i.id === item.id);
        if (isSelected) {
            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'ventilation', itemId: item.id } });
        } else {
            dispatch({ type: 'ADD_ITEM', payload: { category: 'ventilation', item } });
        }
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    // Calculate total from selected
    const selectedFanCFM = selectedVentilation
        .filter(i => i.type === 'Inline Fan' || i.type === 'set' || i.type === 'fan')
        .reduce((acc, i) => acc + (i.cfm || i.capacity || 0), 0);
    
    const totalSelectedPrice = selectedVentilation.reduce((sum, v) => sum + (v.price * (v.quantity || 1)), 0);

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('step3')}</h2>

            {/* Show selected ventilation summary */}
            {selectedVentilation.length > 0 && (
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
                        marginBottom: '0.75rem'
                    }}>
                        ✓ {language === 'tr' ? 'Seçili Havalandırma' : 'Selected Ventilation'} ({selectedVentilation.length})
                    </div>
                    {selectedVentilation.map((item, idx) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem 0',
                            borderBottom: idx < selectedVentilation.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                        }}>
                            <div>
                                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                    {item.quantity > 1 && `${item.quantity}x `}{item.name}
                                </span>
                                {(item.cfm || item.capacity) && (
                                    <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {item.cfm || item.capacity} m³/h
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                    {formatPrice(item.price * (item.quantity || 1))}
                                </span>
                                <button
                                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { category: 'ventilation', itemId: item.id } })}
                                    style={{
                                        background: 'rgba(255,82,82,0.2)',
                                        border: 'none',
                                        color: '#ff5252',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                    <div style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem'
                    }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                            {language === 'tr' ? 'Toplam Kapasite' : 'Total Capacity'}: {selectedFanCFM} m³/h
                        </span>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            {formatPrice(totalSelectedPrice)}
                        </span>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('reqCFM')}</div>
                    <div style={{ fontWeight: 'bold' }}>{totals.cfmRequired} CFM</div>
                </div>
                <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t('selFanPower')}</div>
                    <div style={{ fontWeight: 'bold', color: selectedFanCFM >= totals.cfmRequired ? 'var(--color-secondary)' : '#ff5252' }}>
                        {selectedFanCFM} m³/h
                    </div>
                </div>
            </div>

            {/* Ventilation Sets - Ready combos */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                    {language === 'tr' ? '🎁 Hazır Setler (Fan + Filtre)' : '🎁 Ready Sets (Fan + Filter)'}
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {ventilationSetOptions.map((item) => {
                        const isSelected = selectedVentilation.find(i => i.id === item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => handleToggleItem(item)}
                                style={{
                                    padding: '1rem',
                                    background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {item.cfm} m³/h {language === 'tr' ? 'kapasite' : 'capacity'}
                                </div>
                                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{formatPrice(item.price)}</div>
                            </div>
                        );
                    })}
                </div>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{t('inlineFans')}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {inlineFanOptions.map((item) => {
                        const isSelected = selectedVentilation.find(i => i.id === item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => handleToggleItem(item)}
                                style={{
                                    padding: '1rem',
                                    background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{item.brand}</div>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {item.cfm} m³/h • {item.watts}W
                                </div>
                                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{formatPrice(item.price)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Carbon Filters */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                    {language === 'tr' ? '🌫️ Karbon Filtreler' : '🌫️ Carbon Filters'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {filterOptions.map((item) => {
                        const isSelected = selectedVentilation.find(i => i.id === item.id);
                        return (
                            <div
                                key={item.id}
                                onClick={() => handleToggleItem(item)}
                                style={{
                                    padding: '1rem',
                                    background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{item.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {item.capacity} m³/h {language === 'tr' ? 'kapasite' : 'capacity'}
                                </div>
                                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{formatPrice(item.price)}</div>
                            </div>
                        );
                    })}
                </div>
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
