import { useState } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { BIOBIZZ_PRODUCTS, PRODUCT_CATEGORIES, getProductsByMedia, groupProductsByCategory } from '../data/biobizzProducts';

export default function NutrientSelection() {
    const { state, dispatch } = useBuilder();
    const { t, formatPrice } = useSettings();
    const { selectedItems, mediaType } = state;
    const selectedNutrients = selectedItems.nutrients;
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectedPackaging, setSelectedPackaging] = useState({});

    const handleToggleItem = (item) => {
        const packaging = selectedPackaging[item.id] || item.available_packaging[0];
        const itemWithPackaging = { ...item, selectedPackaging: packaging };
        
        const isSelected = selectedNutrients.find(i => i.id === item.id);
        if (isSelected) {
            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'nutrients', itemId: item.id } });
        } else {
            dispatch({ type: 'ADD_ITEM', payload: { category: 'nutrients', item: itemWithPackaging } });
        }
    };

    const handlePackagingChange = (itemId, packaging) => {
        setSelectedPackaging(prev => ({ ...prev, [itemId]: packaging }));
        
        // Eğer ürün zaten seçiliyse, paketlemeyi güncelle
        const existingItem = selectedNutrients.find(i => i.id === itemId);
        if (existingItem) {
            const updatedItem = { ...existingItem, selectedPackaging: packaging };
            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'nutrients', itemId } });
            dispatch({ type: 'ADD_ITEM', payload: { category: 'nutrients', item: updatedItem } });
        }
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handleBack = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    // Filter options based on global mediaType
    const filteredProducts = getProductsByMedia(mediaType);
    const groupedProducts = groupProductsByCategory(filteredProducts);

    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('step6')}</h2>

            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                {t('nutesDesc')}
            </p>

            {/* BioBizz marka göstergesi */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginBottom: '2rem',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
                <span style={{ fontSize: '1.25rem' }}>🌿</span>
                <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>BioBizz</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {t('organicProducts') || 'Organik Ürünler'}
                </span>
            </div>

            {/* Kategorilere göre gruplandırılmış ürünler */}
            <div style={{ marginBottom: '2rem' }}>
                {Object.entries(groupedProducts).map(([categoryKey, products]) => {
                    const category = PRODUCT_CATEGORIES[categoryKey];
                    const isExpanded = expandedCategories[categoryKey] !== false; // Varsayılan olarak açık

                    return (
                        <div key={categoryKey} style={{ marginBottom: '1rem' }}>
                            {/* Kategori başlığı */}
                            <div
                                onClick={() => toggleCategory(categoryKey)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    background: 'var(--bg-surface)',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    marginBottom: isExpanded ? '0.75rem' : 0,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.25rem' }}>{category?.icon || '📦'}</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                        {category?.name || categoryKey}
                                    </span>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        background: 'var(--bg-card)', 
                                        padding: '2px 8px', 
                                        borderRadius: '12px', 
                                        color: 'var(--text-muted)' 
                                    }}>
                                        {products.length}
                                    </span>
                                </div>
                                <span style={{ 
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                    color: 'var(--text-muted)'
                                }}>
                                    ▼
                                </span>
                            </div>

                            {/* Ürün kartları */}
                            {isExpanded && (
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                                    gap: '1rem' 
                                }}>
                                    {products.map((item) => {
                                        const isSelected = selectedNutrients.find(i => i.id === item.id);
                                        const currentPackaging = selectedPackaging[item.id] || item.available_packaging[0];

                                        return (
                                            <div
                                                key={item.id}
                                                className="card-interactive"
                                                style={{
                                                    padding: '1rem',
                                                    background: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-card)',
                                                    border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                                    borderRadius: 'var(--radius-md)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {/* Ürün başlığı */}
                                                <div 
                                                    onClick={() => handleToggleItem(item)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                        <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                                                        <div style={{ flex: 1 }}>
                                                            <span style={{ 
                                                                fontWeight: 'bold', 
                                                                color: isSelected ? 'var(--color-primary)' : 'var(--text-primary)',
                                                                fontSize: '0.95rem'
                                                            }}>
                                                                {item.product_name}
                                                            </span>
                                                        </div>
                                                        {isSelected && (
                                                            <span style={{ 
                                                                color: 'var(--color-primary)', 
                                                                fontSize: '1.25rem' 
                                                            }}>
                                                                ✓
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Fonksiyon */}
                                                    <div style={{ 
                                                        fontSize: '0.8rem', 
                                                        color: 'var(--color-primary)', 
                                                        marginBottom: '0.5rem',
                                                        opacity: 0.9
                                                    }}>
                                                        {item.function_detailed}
                                                    </div>

                                                    {/* Açıklama */}
                                                    <div style={{ 
                                                        fontSize: '0.8rem', 
                                                        color: 'var(--text-secondary)', 
                                                        marginBottom: '0.75rem',
                                                        lineHeight: 1.4
                                                    }}>
                                                        {item.key_properties.length > 120 
                                                            ? item.key_properties.substring(0, 120) + '...' 
                                                            : item.key_properties}
                                                    </div>
                                                </div>

                                                {/* Paketleme seçimi */}
                                                <div style={{ marginBottom: '0.75rem' }}>
                                                    <div style={{ 
                                                        fontSize: '0.7rem', 
                                                        color: 'var(--text-muted)', 
                                                        marginBottom: '0.25rem' 
                                                    }}>
                                                        {t('packaging') || 'Ambalaj'}:
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                        {item.available_packaging.map(pkg => (
                                                            <button
                                                                key={pkg}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handlePackagingChange(item.id, pkg);
                                                                }}
                                                                style={{
                                                                    padding: '0.25rem 0.5rem',
                                                                    fontSize: '0.7rem',
                                                                    background: currentPackaging === pkg 
                                                                        ? 'var(--color-primary)' 
                                                                        : 'var(--bg-surface)',
                                                                    color: currentPackaging === pkg 
                                                                        ? '#000' 
                                                                        : 'var(--text-secondary)',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                {pkg}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Fiyat */}
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center' 
                                                }}>
                                                    <div style={{ 
                                                        color: 'var(--color-primary)', 
                                                        fontWeight: 'bold',
                                                        fontSize: '1.1rem'
                                                    }}>
                                                        {formatPrice(item.price)}
                                                    </div>
                                                    <button
                                                        onClick={() => handleToggleItem(item)}
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
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Seçilen ürünler özeti */}
            {selectedNutrients.length > 0 && (
                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
                            {t('selectedProducts') || 'Seçilen Ürünler'} ({selectedNutrients.length})
                        </span>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                            {formatPrice(selectedNutrients.reduce((sum, item) => sum + (item.price || 0), 0))}
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedNutrients.map(item => (
                            <span 
                                key={item.id}
                                style={{
                                    padding: '0.25rem 0.5rem',
                                    background: 'var(--bg-card)',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                }}
                            >
                                {item.icon} {item.product_name}
                                {item.selectedPackaging && (
                                    <span style={{ opacity: 0.7 }}>({item.selectedPackaging})</span>
                                )}
                            </span>
                        ))}
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
