import { useMemo } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { useMultipleBuilderProducts } from '../hooks';

export default function MonitoringSelection() {
    const { state, dispatch } = useBuilder();
    const { t, language, formatPrice } = useSettings();
    const selectedMonitoring = state.selectedItems.monitoring;
    const selectedAccessories = state.selectedItems.accessories || [];

    // Load products from API
    const { products, loading, error } = useMultipleBuilderProducts(['monitoring', 'timer', 'hanger', 'pot']);

    // Combine monitoring and timer products
    const monitoringOptions = useMemo(() => {
        const monitoringItems = (products.monitoring || []).map(m => ({
            id: m.id,
            name: m.fullName || m.name,
            type: m.type || 'Sensor',
            price: m.price,
            description: m.features?.join(', ') || '',
            tier: m.tier
        }));
        const timerItems = (products.timer || []).map(t => ({
            id: t.id,
            name: t.fullName || t.name,
            type: 'Timer',
            price: t.price,
            description: t.features?.join(', ') || '',
            tier: t.tier
        }));
        return [...monitoringItems, ...timerItems];
    }, [products.monitoring, products.timer]);

    // Accessory products (hangers, pots, etc.)
    const accessoryOptions = useMemo(() => {
        const hangerItems = (products.hanger || []).map(h => ({
            id: h.id,
            name: h.name,
            type: 'Askı',
            price: h.price,
            description: h.capacity ? `${h.capacity}kg kapasiteli` : '',
            tier: h.tier
        }));
        const potItems = (products.pot || []).filter(p => p.type === 'fabric' || p.type === 'plastic').map(p => ({
            id: p.id,
            name: p.name,
            type: 'Saksı',
            price: p.price,
            description: p.volume ? `${p.volume}L` : '',
            tier: p.tier
        }));
        return [...hangerItems, ...potItems];
    }, [products.hanger, products.pot]);

    const handleToggleItem = (item, category = 'monitoring') => {
        const selectedList = category === 'monitoring' ? selectedMonitoring : selectedAccessories;
        const isSelected = selectedList.find(i => i.id === item.id);
        if (isSelected) {
            dispatch({ type: 'REMOVE_ITEM', payload: { category, itemId: item.id } });
        } else {
            dispatch({ type: 'ADD_ITEM', payload: { category, item } });
        }
    };

    const handleIncrementItem = (itemId, category) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: { category, itemId } });
    };

    const handleDecrementItem = (itemId, category) => {
        dispatch({ type: 'DECREMENT_ITEM', payload: { category, itemId } });
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const totalSelectedPrice = selectedMonitoring.reduce((sum, m) => sum + (m.price * (m.quantity || 1)), 0);
    const totalAccessoriesPrice = selectedAccessories.reduce((sum, a) => sum + (a.price * (a.quantity || 1)), 0);

    // Render product card with quantity controls
    const renderProductCard = (item, category, isSelected, currentQty) => (
        <div
            key={item.id}
            style={{
                padding: '1rem',
                background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                transition: 'all 0.2s ease'
            }}
        >
            <div 
                onClick={() => !isSelected && handleToggleItem(item, category)}
                style={{ cursor: !isSelected ? 'pointer' : 'default' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{item.name}</span>
                    <span style={{ fontSize: '0.75rem', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>{item.type}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {item.description}
                </div>
            </div>
            
            {/* Price and quantity controls */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem'
            }}>
                {/* Quantity control */}
                {isSelected ? (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        background: 'var(--bg-surface)',
                        borderRadius: '4px',
                        padding: '2px'
                    }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDecrementItem(item.id, category);
                            }}
                            style={{
                                width: '28px',
                                height: '28px',
                                border: 'none',
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >−</button>
                        <span style={{ 
                            minWidth: '28px', 
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                        }}>
                            {currentQty}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleIncrementItem(item.id, category);
                            }}
                            style={{
                                width: '28px',
                                height: '28px',
                                border: 'none',
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >+</button>
                    </div>
                ) : (
                    <div style={{ width: '90px' }}></div>
                )}

                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    {formatPrice(item.price * (isSelected ? currentQty : 1))}
                </div>

                <button
                    onClick={() => handleToggleItem(item, category)}
                    style={{
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        background: isSelected 
                            ? 'rgba(239, 68, 68, 0.2)' 
                            : 'rgba(16, 185, 129, 0.2)',
                        color: isSelected 
                            ? '#ef4444' 
                            : 'var(--color-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {isSelected ? (t('remove') || 'Kaldır') : (t('add') || 'Ekle')}
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('step6')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                {t('monitorDesc')}
            </p>

            {/* Show selected monitoring items */}
            {selectedMonitoring.length > 0 && (
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
                        ✓ {language === 'tr' ? 'Seçili İzleme Ekipmanları' : 'Selected Monitoring Equipment'} ({selectedMonitoring.length})
                    </div>
                    {selectedMonitoring.map((item, idx) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem 0',
                            borderBottom: idx < selectedMonitoring.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                        }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                {item.quantity > 1 && `${item.quantity}x `}{item.name}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                    {formatPrice(item.price * (item.quantity || 1))}
                                </span>
                                <button
                                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { category: 'monitoring', itemId: item.id } })}
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
                        justifyContent: 'flex-end',
                        fontSize: '0.875rem'
                    }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            {formatPrice(totalSelectedPrice)}
                        </span>
                    </div>
                </div>
            )}

            {/* Monitoring Products Section */}
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {language === 'tr' ? '📊 İzleme ve Ölçüm Ekipmanları' : '📊 Monitoring Equipment'}
            </h3>
            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-danger)', marginBottom: '2rem' }}>
                    {language === 'tr' ? 'Ürünler yüklenirken hata oluştu' : 'Error loading products'}
                </div>
            ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {monitoringOptions.map((item) => {
                    const selected = selectedMonitoring.find(i => i.id === item.id);
                    const currentQty = selected?.quantity || 1;
                    return renderProductCard(item, 'monitoring', !!selected, currentQty);
                })}
            </div>
            )}

            {/* Accessories Section */}
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {language === 'tr' ? '🛠️ Aksesuarlar' : '🛠️ Accessories'}
            </h3>

            {/* Show selected accessories summary */}
            {selectedAccessories.length > 0 && (
                <div style={{
                    marginBottom: '1.5rem',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
                    border: '2px solid #3b82f6',
                    borderRadius: 'var(--radius-md)',
                }}>
                    <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#3b82f6', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.75rem'
                    }}>
                        ✓ {language === 'tr' ? 'Seçili Aksesuarlar' : 'Selected Accessories'} ({selectedAccessories.length})
                    </div>
                    {selectedAccessories.map((item, idx) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem 0',
                            borderBottom: idx < selectedAccessories.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                        }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                {(item.quantity || 1) > 1 && `${item.quantity}x `}{item.name}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
                                    {formatPrice(item.price * (item.quantity || 1))}
                                </span>
                                <button
                                    onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { category: 'accessories', itemId: item.id } })}
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
                        justifyContent: 'flex-end',
                        fontSize: '0.875rem'
                    }}>
                        <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>
                            {formatPrice(totalAccessoriesPrice)}
                        </span>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {accessoryOptions.map((item) => {
                    const selected = selectedAccessories.find(i => i.id === item.id);
                    const currentQty = selected?.quantity || 1;
                    return renderProductCard(item, 'accessories', !!selected, currentQty);
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
                    {t('finish')} &rarr;
                </button>
            </div>
        </div>
    );
}
