
import { useState, useMemo, useEffect } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { brandService } from '../services/brandService';
import { productService } from '../services/productService';

// Category Definitions
const BIOBIZZ_CATEGORIES = {
    substrate: { name: 'Substrat', icon: '🌱', order: 1 },
    substrate_booster: { name: 'Substrat Güçlendirici', icon: '💪', order: 2 },
    dry_fertilizer: { name: 'Kuru Gübre', icon: '🧪', order: 3 },
    base_nutrient: { name: 'Temel Besin', icon: '🧬', order: 4 },
    stimulator: { name: 'Stimülatör', icon: '⚡', order: 5 },
    booster: { name: 'Booster', icon: '🚀', order: 6 },
    activator: { name: 'Aktivatör', icon: '🔋', order: 7 },
    microorganisms: { name: 'Mikroorganizmalar', icon: '🦠', order: 8 },
    protector: { name: 'Koruyucu', icon: '🛡️', order: 9 },
    supplement: { name: 'Takviye', icon: '💊', order: 10 },
    ph_regulator: { name: 'pH Düzenleyici', icon: '⚖️', order: 11 }
};

const CANNA_CATEGORIES = {
    base_nutrient: { name_key: 'catBaseNutrient', icon: '🌱', name: 'Base Nutrients', color: '#22C55E' },
    root_stimulator: { name_key: 'catRootStim', icon: '🌳', name: 'Root Stimulators', color: '#8B5CF6' },
    bloom_booster: { name_key: 'catBloomBooster', icon: '🌺', name: 'Bloom Boosters', color: '#EC4899' },
    enzyme: { name_key: 'catEnzyme', icon: '🔬', name: 'Enzymes', color: '#34D399' },
    booster: { name_key: 'catBooster', icon: '⚡', name: 'Boosters', color: '#F59E0B' },
    buffer: { name_key: 'catBuffer', icon: '⚗️', name: 'Buffering Agents', color: '#6366F1' }
};

const AN_CATEGORIES = {
    base_nutrient: {
        name_key: 'catBaseNutrient', icon: '🌱', name: 'Temel Besinler', nameEn: 'BASE NUTRIENTS',
        description: 'Bitkinin ana büyüme ve çiçeklenme aşamaları için gerekli olan temel besin çözeltileri.', color: '#22C55E'
    },
    root_expanders: {
        name_key: 'catRootExpanders', icon: '🌳', name: 'Kök Genişleticiler', nameEn: 'ROOT EXPANDERS',
        description: 'Kök sistemi gelişimini destekleyen ürünler.', color: '#8B5CF6'
    },
    bigger_buds: {
        name_key: 'catBiggerBuds', icon: '🌺', name: 'Büyük Tomurcuklar', nameEn: 'BIGGER BUDS',
        description: 'Tomurcuk boyutunu ve ağırlığını artırmayı hedefleyen destekleyiciler.', color: '#EF4444'
    },
    bud_potency: {
        name_key: 'catBudPotency', icon: '💪', name: 'Tomurcuk Potansiyeli & Gövde Güçlendirici', nameEn: 'BUD POTENCY & STALK STRENGTHENER',
        description: 'Bitki gücünü, gövde yapısını ve tomurcuk potansiyelini destekleyen ürünler.', color: '#F59E0B'
    },
    grow_medium: {
        name_key: 'catGrowMedium', icon: '🍂', name: 'Büyüme Ortamı Düzenleyici', nameEn: 'GROW MEDIUM CONDITIONER',
        description: 'Yetiştirme ortamının koşullarını iyileştirmeyi amaçlayan ürünler.', color: '#34D399'
    },
    taste_terpene: {
        name_key: 'catTasteTerpene', icon: '🍬', name: 'Tomurcuk Tadı & Terpen Geliştirici', nameEn: 'BUD TASTE & TERPENE ENHANCEMENT',
        description: 'Mahsulün tadını ve aroma profilini (terpen) geliştirmeyi hedefleyen ürünler.', color: '#EC4899'
    }
};

// Nutrient brands available in the builder
const NUTRIENT_BRANDS = [
    {
        id: 'biobizz',
        name: 'BioBizz',
        icon: '🌿',
        color: '#22C55E',
        description: { tr: 'Organik besin çözümleri', en: 'Organic nutrient solutions' },
        logo: '/images/cropped-Biobizz-Icon-Brown-Texture-180x180.jpg',
        mediaTypes: ['soil', 'coco', 'hydro']
    },
    {
        id: 'canna',
        name: 'CANNA',
        icon: '🌱',
        color: '#16A34A',
        description: { tr: 'Profesyonel besin sistemleri', en: 'Professional nutrient systems' },
        logo: '/images/canna-logo.svg',
        mediaTypes: ['soil', 'coco', 'hydro']
    },
    {
        id: 'advanced-nutrients',
        name: 'Advanced Nutrients',
        icon: '🧪',
        color: '#7C3AED',
        description: { tr: 'pH Perfect teknolojisi', en: 'pH Perfect technology' },
        logo: '/images/advanced-nutrients-logo.png',
        mediaTypes: ['soil', 'coco', 'hydro']
    }
];

export default function NutrientSelection() {
    const { state, dispatch } = useBuilder();
    const { t, formatPrice, language } = useSettings();
    const { selectedItems, mediaType, selectedPreset } = state;
    const selectedNutrients = selectedItems.nutrients;

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectedPackaging, setSelectedPackaging] = useState({});
    const [quantities, setQuantities] = useState({});

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Check if there are preset-selected nutrients
    const hasPresetNutrients = selectedPreset && selectedNutrients.length > 0;

    // Fetch products when brand changes
    useEffect(() => {
        async function loadProducts() {
            if (!selectedBrand) {
                setProducts([]);
                return;
            }

            setLoading(true);
            try {
                const brand = await brandService.getBrandBySlug(selectedBrand);
                if (!brand) return;

                const fetchedProducts = await productService.getProducts(brand.id);
                // Map to ensure compatibility with existing logic (using sku as id)
                const getLocalStr = (val) => {
                    if (!val) return '';
                    if (typeof val === 'string') return val;
                    if (typeof val === 'object') return val[language] || val.en || '';
                    return '';
                };

                const mapped = fetchedProducts.map(p => ({
                    ...p,
                    id: p.sku, // Map SKU to ID for consistency
                    _uuid: p.id,
                    system: p.specs?.system,       // Ensure specs properties are accessible
                    category_key: p.specs?.category_key || p.category?.key || 'base_nutrient', // Fallback
                    function_key: p.specs?.function_key,
                    function_detailed: getLocalStr(p.function_detailed),
                    key_properties: getLocalStr(p.key_properties),
                    compatible_media: p.specs?.compatible_media || p.compatible_media,
                    product_name: getLocalStr(p.name) || p.product_name || p.sku // Handle migration name format
                }));
                setProducts(mapped);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, [selectedBrand, language]);

    // Filter products
    const filteredProducts = useMemo(() => {
        if (!selectedBrand || !products.length) return [];

        switch (selectedBrand) {
            case 'biobizz':
                return products.filter(product =>
                    product.category_key !== 'substrate' &&
                    product.category_key !== 'substrate_booster' &&
                    product.compatible_media?.includes(mediaType)
                );
            case 'canna':
                const cSystemMap = { 'soil': 'terra', 'coco': 'coco', 'hydro': 'aqua' };
                const system = cSystemMap[mediaType] || 'terra';
                return products.filter(p => p.system === system || p.system === 'all');
            case 'advanced-nutrients':
                // Check compatible media. My migration added this.
                // Default to true if not specified (Advanced Nutrients is generally pH Perfect / Universal)
                return products.filter(p => !p.compatible_media || p.compatible_media.includes(mediaType));
            default:
                return [];
        }
    }, [selectedBrand, mediaType, products]);

    // Group products
    const groupedProducts = useMemo(() => {
        const grouped = {};
        const categories = selectedBrand === 'advanced-nutrients' ? AN_CATEGORIES :
            selectedBrand === 'canna' ? CANNA_CATEGORIES :
                BIOBIZZ_CATEGORIES;

        filteredProducts.forEach(product => {
            const category = product.category_key;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(product);
        });

        // Sort categories if they have order, otherwise by appearance or key
        const sortedCategories = Object.keys(grouped).sort((a, b) => {
            // BioBizz has explicit order
            const orderA = categories[a]?.order || 99;
            const orderB = categories[b]?.order || 99;
            return orderA - orderB;
        });

        const sortedGrouped = {};
        sortedCategories.forEach(category => {
            sortedGrouped[category] = grouped[category];
        });

        return sortedGrouped;
    }, [filteredProducts, selectedBrand]);

    const handleQuantityChange = (itemId, delta) => {
        const existingItem = selectedNutrients.find(i => i.id === itemId);
        // Use global quantity if exists (synchronization), otherwise local state or default 1
        const currentQty = existingItem ? existingItem.quantity : (quantities[itemId] || 1);
        const newQty = Math.max(1, currentQty + delta);

        setQuantities(prev => ({ ...prev, [itemId]: newQty }));

        // Update quantity in selected items if it exists
        if (existingItem) {
            const updatedItem = { ...existingItem, quantity: newQty };
            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'nutrients', itemId } });
            dispatch({ type: 'ADD_ITEM', payload: { category: 'nutrients', item: updatedItem } });
        }
    };

    const handleToggleItem = (item) => {
        const packaging = selectedPackaging[item.id] || (item.available_packaging ? item.available_packaging[0] : '1L');
        const quantity = quantities[item.id] || 1;
        const itemWithDetails = {
            ...item,
            selectedPackaging: packaging,
            quantity: quantity,
            brand: selectedBrand === 'biobizz' ? 'BioBizz' :
                selectedBrand === 'canna' ? 'CANNA' : 'Advanced Nutrients'
        };

        const isSelected = selectedNutrients.find(i => i.id === item.id);
        if (isSelected) {
            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'nutrients', itemId: item.id } });
        } else {
            dispatch({ type: 'ADD_ITEM', payload: { category: 'nutrients', item: itemWithDetails } });
        }
    };

    const handlePackagingChange = (itemId, packaging) => {
        setSelectedPackaging(prev => ({ ...prev, [itemId]: packaging }));

        const existingItem = selectedNutrients.find(i => i.id === itemId);
        if (existingItem) {
            const updatedItem = { ...existingItem, selectedPackaging: packaging };
            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'nutrients', itemId } });
            dispatch({ type: 'ADD_ITEM', payload: { category: 'nutrients', item: updatedItem } });
        }
    };

    const toggleCategory = (categoryKey) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryKey]: !prev[categoryKey]
        }));
    };

    // Get available brands based on media type
    const availableBrands = NUTRIENT_BRANDS.filter(brand =>
        brand.mediaTypes.includes(mediaType)
    );

    const getLocalStr = (val) => {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') return val[language] || val.en || '';
        return '';
    };

    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>{t('selectNutrients')}</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                {t('nutrientsDesc')}
            </p>

            {/* Selected Nutrients Summary */}
            {selectedNutrients.length > 0 && (
                <div style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)'
                }}>
                    <div style={{
                        fontWeight: 'bold',
                        color: 'var(--color-primary)',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <span>✓ {language === 'tr' ? 'Seçilen Besinler' : 'Selected Nutrients'} ({selectedNutrients.length})</span>
                        <span style={{ fontSize: '0.9rem' }}>
                            {formatPrice(selectedNutrients.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0))}
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {selectedNutrients.map(nutrient => (
                            <div
                                key={nutrient.id}
                                style={{
                                    background: 'var(--bg-card)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-primary)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontWeight: 'bold',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem'
                                        }}>
                                            {getLocalStr(nutrient.name) || getLocalStr(nutrient.product_name)}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--color-primary)',
                                            fontWeight: 'bold'
                                        }}>
                                            {nutrient.brand}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch({ type: 'REMOVE_ITEM', payload: { category: 'nutrients', itemId: nutrient.id } });
                                        }}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            color: '#ef4444',
                                            borderRadius: '4px',
                                            padding: '2px 6px',
                                            fontSize: '0.7rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)'
                                    }}>
                                        {nutrient.packaging || nutrient.selectedPackaging}
                                    </div>
                                    {/* Quantity control */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        background: 'var(--bg-surface)',
                                        borderRadius: '4px',
                                        padding: '2px'
                                    }}>
                                        <button
                                            onClick={() => {
                                                const newQty = Math.max(1, (nutrient.quantity || 1) - 1);
                                                const updatedItem = { ...nutrient, quantity: newQty };
                                                dispatch({ type: 'REMOVE_ITEM', payload: { category: 'nutrients', itemId: nutrient.id } });
                                                dispatch({ type: 'ADD_ITEM', payload: { category: 'nutrients', item: updatedItem } });
                                            }}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                border: 'none',
                                                background: 'var(--bg-card)',
                                                color: 'var(--text-primary)',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '1rem'
                                            }}
                                        >−</button>
                                        <span style={{
                                            minWidth: '24px',
                                            textAlign: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '0.85rem'
                                        }}>
                                            {nutrient.quantity || 1}
                                        </span>
                                        <button
                                            onClick={() => {
                                                const newQty = (nutrient.quantity || 1) + 1;
                                                const updatedItem = { ...nutrient, quantity: newQty };
                                                dispatch({ type: 'REMOVE_ITEM', payload: { category: 'nutrients', itemId: nutrient.id } });
                                                dispatch({ type: 'ADD_ITEM', payload: { category: 'nutrients', item: updatedItem } });
                                            }}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                border: 'none',
                                                background: 'var(--bg-card)',
                                                color: 'var(--text-primary)',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '1rem'
                                            }}
                                        >+</button>
                                    </div>
                                </div>
                                <div style={{
                                    color: 'var(--color-primary)',
                                    fontWeight: 'bold',
                                    fontSize: '0.875rem'
                                }}>
                                    {formatPrice((nutrient.price || 0) * (nutrient.quantity || 1))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <p style={{
                        marginTop: '1rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic'
                    }}>
                        {language === 'tr'
                            ? 'Bu besinler hazır setten gelmiştir. İsterseniz değiştirebilir veya ek ürünler ekleyebilirsiniz.'
                            : 'These nutrients came from your preset. You can modify or add more products.'}
                    </p>
                </div>
            )}

            {/* Brand Selection */}
            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                    marginBottom: '1rem',
                    color: 'var(--text-primary)',
                    fontSize: '1.1rem'
                }}>
                    {language === 'tr' ? '🏷️ Marka Seçin' : '🏷️ Select Brand'}
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1.5rem',
                    maxWidth: '900px'
                }}>
                    {availableBrands.map(brand => (
                        <div
                            key={brand.id}
                            onClick={() => setSelectedBrand(brand.id)}
                            style={{
                                padding: '1.5rem',
                                background: selectedBrand === brand.id
                                    ? `linear-gradient(145deg, ${brand.color}15, ${brand.color}08)`
                                    : 'var(--bg-card)',
                                border: `2px solid ${selectedBrand === brand.id ? brand.color : 'var(--border-color)'}`,
                                borderRadius: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: '1rem',
                                position: 'relative',
                                boxShadow: selectedBrand === brand.id
                                    ? `0 8px 32px ${brand.color}30`
                                    : '0 4px 12px rgba(0,0,0,0.1)',
                                transform: selectedBrand === brand.id ? 'translateY(-4px)' : 'translateY(0)'
                            }}
                        >
                            {selectedBrand === brand.id && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: brand.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    boxShadow: `0 4px 12px ${brand.color}50`
                                }}>✓</div>
                            )}
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '12px',
                                boxShadow: selectedBrand === brand.id
                                    ? `0 4px 20px ${brand.color}25, inset 0 2px 4px rgba(255,255,255,0.8)`
                                    : '0 4px 16px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.8)',
                                border: selectedBrand === brand.id
                                    ? `3px solid ${brand.color}`
                                    : '3px solid transparent',
                                transition: 'all 0.3s ease'
                            }}>
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        filter: selectedBrand === brand.id ? 'none' : 'grayscale(20%)',
                                        transition: 'filter 0.3s ease'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `<span style="font-size: 2.5rem">${brand.icon}</span>`;
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{
                                    fontWeight: '700',
                                    fontSize: '1.15rem',
                                    color: selectedBrand === brand.id ? brand.color : 'var(--text-primary)',
                                    marginBottom: '0.35rem',
                                    transition: 'color 0.3s ease'
                                }}>
                                    {brand.name}
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    lineHeight: '1.4'
                                }}>
                                    {brand.description[language] || brand.description.en}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Products by Category */}
            {selectedBrand && (
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        padding: '0.75rem 1rem',
                        background: `linear-gradient(135deg, ${NUTRIENT_BRANDS.find(b => b.id === selectedBrand)?.color}15, transparent)`,
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${NUTRIENT_BRANDS.find(b => b.id === selectedBrand)?.color}30`
                    }}>
                        <span style={{ fontSize: '1.25rem' }}>
                            {NUTRIENT_BRANDS.find(b => b.id === selectedBrand)?.icon}
                        </span>
                        <span style={{
                            fontWeight: 'bold',
                            color: NUTRIENT_BRANDS.find(b => b.id === selectedBrand)?.color
                        }}>
                            {NUTRIENT_BRANDS.find(b => b.id === selectedBrand)?.name}
                        </span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {language === 'tr' ? 'Ürünleri' : 'Products'}
                        </span>
                        {loading && <span style={{ marginLeft: '1rem' }}>⏳ ...</span>}
                    </div>

                    {Object.keys(groupedProducts).length === 0 ? (
                        <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            {loading ? (language === 'tr' ? 'Yükleniyor...' : 'Loading...') :
                                (language === 'tr'
                                    ? 'Bu medya tipi için ürün bulunamadı.'
                                    : 'No products found for this media type.')}
                        </div>
                    ) : (
                        Object.entries(groupedProducts).map(([categoryKey, categoryProducts]) => {
                            // Use appropriate category definition
                            const categories = selectedBrand === 'advanced-nutrients' ? AN_CATEGORIES :
                                selectedBrand === 'canna' ? CANNA_CATEGORIES :
                                    BIOBIZZ_CATEGORIES;
                            const category = categories[categoryKey];

                            const isExpanded = expandedCategories[categoryKey] !== false;

                            return (
                                <div key={categoryKey} style={{ marginBottom: '1rem' }}>
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
                                                {category?.name || category?.nameEn || categoryKey}
                                            </span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                background: 'var(--bg-card)',
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                color: 'var(--text-muted)'
                                            }}>
                                                {categoryProducts.length}
                                            </span>
                                        </div>
                                        <span style={{
                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease',
                                            color: 'var(--text-muted)'
                                        }}>▼</span>
                                    </div>

                                    {isExpanded && (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                            gap: '1rem'
                                        }}>
                                            {categoryProducts.map((item) => {
                                                const isSelected = selectedNutrients.find(i => i.id === item.id);
                                                const currentPackaging = selectedPackaging[item.id] ||
                                                    (item.available_packaging ? item.available_packaging[0] : '1L');
                                                // Prioritize selected quantity, fallback to local state
                                                const currentQty = isSelected ? isSelected.quantity : (quantities[item.id] || 1);

                                                return (
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
                                                            onClick={() => handleToggleItem(item)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                                <span style={{ fontSize: '1.5rem' }}>{item.icon || '🧪'}</span>
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
                                                                    <span style={{ color: 'var(--color-primary)', fontSize: '1.25rem' }}>✓</span>
                                                                )}
                                                            </div>

                                                            {item.function_detailed && (
                                                                <div style={{
                                                                    fontSize: '0.8rem',
                                                                    color: 'var(--color-primary)',
                                                                    marginBottom: '0.5rem',
                                                                    opacity: 0.9
                                                                }}>
                                                                    {item.function_detailed}
                                                                </div>
                                                            )}

                                                            {item.key_properties && (
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
                                                            )}
                                                        </div>

                                                        {/* Packaging selection */}
                                                        {item.available_packaging && (
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
                                                        )}

                                                        {/* Quantity and Price */}
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        }}>
                                                            {/* Quantity control */}
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
                                                                        handleQuantityChange(item.id, -1);
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
                                                                        handleQuantityChange(item.id, 1);
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

                                                            <div style={{
                                                                color: 'var(--color-primary)',
                                                                fontWeight: 'bold',
                                                                fontSize: '1rem'
                                                            }}>
                                                                {formatPrice((item.price || 0) * currentQty)}
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
                        })
                    )}
                </div>
            )}

            {/* No brand selected message */}
            {!selectedBrand && !hasPresetNutrients && (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    background: 'var(--bg-surface)',
                    borderRadius: '16px',
                    border: '2px dashed var(--border-color)'
                }}>
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>👆</span>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        {language === 'tr' ? 'Besin Markası Seçin' : 'Select Nutrient Brand'}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {language === 'tr'
                            ? 'Lütfen ürünleri görmek için yukarıdan bir marka seçin.'
                            : 'Please select a brand above to view products.'}
                    </p>
                </div>
            )}

            {/* Navigation Buttons */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '3rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '2rem'
            }}>
                <button
                    onClick={() => dispatch({ type: 'PREV_STEP' })}
                    style={{
                        padding: '0.75rem 2rem',
                        background: 'transparent',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <span>&larr;</span> {t('back')}
                </button>
                <button
                    onClick={() => dispatch({ type: 'NEXT_STEP' })}
                    style={{
                        padding: '0.75rem 2rem',
                        background: 'var(--color-primary)',
                        color: '#000',
                        fontWeight: 'bold',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {t('next')} <span>&rarr;</span>
                </button>
            </div>
        </div>
    );
}
