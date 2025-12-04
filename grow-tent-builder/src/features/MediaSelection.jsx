import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { SUBSTRATE_PRODUCTS } from '../data/builderProducts';

const MEDIA_OPTIONS = [
    { id: 'soil', nameKey: 'mediaSoil', descKey: 'mediaSoilDesc', icon: '🌱' },
    { id: 'coco', nameKey: 'mediaCoco', descKey: 'mediaCocoDesc', icon: '🥥' },
    { id: 'hydro', nameKey: 'mediaHydro', descKey: 'mediaHydroDesc', icon: '💧' },
];

// Filter substrate products by media type
const getSubstratesForMedia = (mediaType) => {
    if (!mediaType) return [];
    return SUBSTRATE_PRODUCTS.filter(s => s.type === mediaType);
};

export default function MediaSelection() {
    const { state, dispatch } = useBuilder();
    const { t, language, formatPrice } = useSettings();
    const { mediaType, selectedItems } = state;
    const selectedSubstrates = selectedItems.substrates || [];

    const availableSubstrates = getSubstratesForMedia(mediaType);

    const handleSelect = (id) => {
        dispatch({ type: 'SET_MEDIA_TYPE', payload: id });
    };

    const handleAddSubstrate = (substrate) => {
        const item = {
            id: substrate.id,
            name: substrate.name,
            price: substrate.price,
            volume: substrate.volume,
            brand: substrate.brand,
            quantity: 1
        };
        dispatch({ type: 'ADD_ITEM', payload: { category: 'substrates', item } });
    };

    const handleRemoveSubstrate = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { category: 'substrates', itemId: id } });
    };

    const handleNext = () => {
        if (mediaType) {
            dispatch({ type: 'NEXT_STEP' });
        }
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const totalSubstratePrice = selectedSubstrates.reduce((sum, s) => sum + (s.price * (s.quantity || 1)), 0);

    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('selectMedia')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                {t('mediaDesc')}
            </p>

            {/* Show selected substrates summary */}
            {selectedSubstrates.length > 0 && (
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
                        ✓ {language === 'tr' ? 'Seçili Substrat' : 'Selected Substrate'} ({selectedSubstrates.length})
                    </div>
                    {selectedSubstrates.map((item, idx) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem 0',
                            borderBottom: idx < selectedSubstrates.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                        }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                {item.quantity > 1 && `${item.quantity}x `}{item.name}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                                    {formatPrice(item.price * (item.quantity || 1))}
                                </span>
                                <button
                                    onClick={() => handleRemoveSubstrate(item.id)}
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
                            {formatPrice(totalSubstratePrice)}
                        </span>
                    </div>
                </div>
            )}

            {/* Media Type Selection */}
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                {language === 'tr' ? 'Yetiştirme Ortamı' : 'Growing Medium'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {MEDIA_OPTIONS.map(media => {
                    const isSelected = mediaType === media.id;
                    return (
                        <div
                            key={media.id}
                            onClick={() => handleSelect(media.id)}
                            className="card-interactive"
                            style={{
                                padding: '2rem',
                                background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                                {media.icon}
                            </div>
                            <h3 style={{ marginBottom: '0.5rem', color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                                {t(media.nameKey)}
                            </h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {t(media.descKey)}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Substrate Products */}
            {mediaType && availableSubstrates.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                        {language === 'tr' ? '🌿 Substrat Ürünleri' : '🌿 Substrate Products'}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                        {availableSubstrates.map(substrate => {
                            const selected = selectedSubstrates.find(s => s.id === substrate.id);
                            const currentQty = selected?.quantity || 1;
                            
                            return (
                                <div
                                    key={substrate.id}
                                    style={{
                                        padding: '1rem',
                                        background: selected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                                        border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        {substrate.brand}
                                    </div>
                                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{substrate.name}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                        {substrate.volume}L
                                    </div>
                                    
                                    {/* Quantity and Price Row */}
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        {/* Quantity control */}
                                        {selected ? (
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
                                                        dispatch({ 
                                                            type: 'DECREMENT_ITEM', 
                                                            payload: { 
                                                                category: 'substrates', 
                                                                itemId: substrate.id 
                                                            } 
                                                        });
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
                                                        dispatch({ 
                                                            type: 'INCREMENT_ITEM', 
                                                            payload: { 
                                                                category: 'substrates', 
                                                                itemId: substrate.id 
                                                            } 
                                                        });
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
                                            {formatPrice(substrate.price * (selected ? currentQty : 1))}
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (selected) {
                                                    handleRemoveSubstrate(substrate.id);
                                                } else {
                                                    handleAddSubstrate(substrate);
                                                }
                                            }}
                                            style={{
                                                padding: '0.4rem 0.8rem',
                                                fontSize: '0.8rem',
                                                background: selected 
                                                    ? 'rgba(239, 68, 68, 0.2)' 
                                                    : 'rgba(16, 185, 129, 0.2)',
                                                color: selected 
                                                    ? '#ef4444' 
                                                    : 'var(--color-primary)',
                                                border: 'none',
                                                borderRadius: 'var(--radius-sm)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {selected ? (t('remove') || 'Kaldır') : (t('add') || 'Ekle')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

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
                    disabled={!mediaType}
                    style={{
                        padding: '0.75rem 2rem',
                        background: mediaType ? 'var(--color-primary)' : 'var(--bg-surface)',
                        color: mediaType ? '#000' : 'var(--text-muted)',
                        fontWeight: 'bold',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1rem',
                        cursor: mediaType ? 'pointer' : 'not-allowed',
                        border: 'none',
                        boxShadow: mediaType ? '0 4px 14px 0 rgba(16, 185, 129, 0.39)' : 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {t('next')} &rarr;
                </button>
            </div>
        </div>
    );
}
