import { useState, useMemo } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import { PRESET_SETS } from '../data/presetSets';
import { 
    TENT_PRODUCTS, 
    LED_PRODUCTS,
    FAN_PRODUCTS,
    CARBON_FILTER_PRODUCTS,
    DUCTING_PRODUCTS,
    SUBSTRATE_PRODUCTS, 
    POT_PRODUCTS,
    TIMER_PRODUCTS,
    MONITORING_PRODUCTS,
    HANGER_PRODUCTS,
    VENTILATION_SETS,
    NUTRIENT_PRODUCTS
} from '../data/builderProducts';

// Helper function to find product by ID
const findProduct = (id, products) => products.find(p => p.id === id);

// Convert preset items to builder-compatible format
const convertPresetToBuilderItems = (preset) => {
    const items = {
        tent: [], // Tent product
        lighting: [],
        ventilation: [],
        environment: [],
        nutrients: [],
        monitoring: [],
        substrates: [],
        accessories: []
    };

    // Tent
    if (preset.items.tent) {
        const tentProduct = findProduct(preset.items.tent, TENT_PRODUCTS);
        if (tentProduct) {
            items.tent.push({
                id: tentProduct.id,
                name: tentProduct.fullName || tentProduct.name,
                brand: tentProduct.brand,
                price: tentProduct.price,
                dimensions: tentProduct.dimensions,
                quantity: 1
            });
        }
    }

    // Lighting
    if (preset.items.lighting) {
        preset.items.lighting.forEach(light => {
            const product = findProduct(light.id, LED_PRODUCTS);
            if (product) {
                items.lighting.push({
                    id: product.id,
                    name: product.fullName || product.name,
                    brand: product.brand,
                    type: product.type || 'LED',
                    price: product.price,
                    watts: product.watts || 0,
                    coverage: product.coverage || 0,
                    physicalWidth: product.physicalWidth || 1,
                    physicalDepth: product.physicalDepth || 1,
                    maxPPFD: product.maxPPFD || 0,
                    beamAngle: product.beamAngle || 120,
                    recommendedHeight: product.recommendedHeight || 18,
                    spectrum: product.spectrum,
                    efficiency: product.efficiency,
                    tier: product.tier,
                    features: product.features,
                    quantity: light.qty || 1
                });
            }
        });
    }

    // Ventilation (fan + filter + ducting OR set)
    if (preset.items.ventilation) {
        const { fan, filter, ducting, set: ventSetId } = preset.items.ventilation;
        
        // Check if using a complete ventilation set
        if (ventSetId) {
            const ventSet = findProduct(ventSetId, VENTILATION_SETS);
            if (ventSet) {
                items.ventilation.push({
                    id: ventSet.id,
                    name: ventSet.name,
                    price: ventSet.price,
                    quantity: 1,
                    type: 'set',
                    capacity: ventSet.capacity
                });
            }
        } else {
            // Individual components
            if (fan) {
                const fanProduct = findProduct(fan, FAN_PRODUCTS);
                if (fanProduct) {
                    items.ventilation.push({
                        id: fanProduct.id,
                        name: fanProduct.fullName || fanProduct.name,
                        price: fanProduct.price,
                        watts: fanProduct.specs?.wattage || 0,
                        cfm: fanProduct.specs?.cfm || 0,
                        quantity: 1,
                        type: 'fan'
                    });
                }
            }

            if (filter) {
                const filterProduct = findProduct(filter, CARBON_FILTER_PRODUCTS);
                if (filterProduct) {
                    items.ventilation.push({
                        id: filterProduct.id,
                        name: filterProduct.fullName || filterProduct.name,
                        price: filterProduct.price,
                        quantity: 1,
                        type: 'filter'
                    });
                }
            }

            if (ducting) {
                const ductProduct = findProduct(ducting, DUCTING_PRODUCTS);
                if (ductProduct) {
                    items.ventilation.push({
                        id: ductProduct.id,
                        name: ductProduct.fullName || ductProduct.name,
                        price: ductProduct.price,
                        quantity: 1,
                        type: 'ducting'
                    });
                }
            }
        }
    }

    // Substrates
    if (preset.items.substrate) {
        preset.items.substrate.forEach(sub => {
            const product = findProduct(sub.id, SUBSTRATE_PRODUCTS);
            if (product) {
                items.substrates.push({
                    id: product.id,
                    name: product.fullName || product.name,
                    price: product.price,
                    quantity: sub.qty || 1
                });
            }
        });
    }

    // Pots (go to accessories)
    if (preset.items.pots) {
        preset.items.pots.forEach(pot => {
            const product = findProduct(pot.id, POT_PRODUCTS);
            if (product) {
                items.accessories.push({
                    id: product.id,
                    name: product.fullName || product.name,
                    price: product.price,
                    quantity: pot.qty || 1,
                    type: 'pot'
                });
            }
        });
    }

    // Monitoring items
    if (preset.items.monitoring) {
        preset.items.monitoring.forEach(monId => {
            const product = findProduct(monId, MONITORING_PRODUCTS);
            if (product) {
                items.monitoring.push({
                    id: product.id,
                    name: product.fullName || product.name,
                    price: product.price,
                    quantity: 1
                });
            }
        });
    }

    // Other accessories (timers, hangers, etc.)
    if (preset.items.accessories) {
        preset.items.accessories.forEach(accId => {
            // Check in all accessory categories
            let product = findProduct(accId, TIMER_PRODUCTS);
            if (!product) product = findProduct(accId, HANGER_PRODUCTS);
            if (!product) product = findProduct(accId, DUCTING_PRODUCTS);
            
            if (product) {
                items.accessories.push({
                    id: product.id,
                    name: product.fullName || product.name,
                    price: product.price,
                    quantity: 1
                });
            }
        });
    }

    // Nutrients
    if (preset.items.nutrients) {
        preset.items.nutrients.forEach(nutId => {
            const product = findProduct(nutId, NUTRIENT_PRODUCTS);
            if (product) {
                items.nutrients.push({
                    id: product.id,
                    name: product.fullName || product.name,
                    brand: product.brand,
                    packaging: product.packaging,
                    category: product.category,
                    phase: product.phase,
                    price: product.price,
                    quantity: 1
                });
            }
        });
    }

    return items;
};

// Get tent dimensions from preset
const getTentDimensions = (preset) => {
    const tent = findProduct(preset.items.tent, TENT_PRODUCTS);
    if (tent && tent.dimensionsFt) {
        return {
            width: tent.dimensionsFt.width,
            depth: tent.dimensionsFt.depth,
            height: tent.dimensionsFt.height,
            unit: 'ft'
        };
    }
    // Fallback: parse from tentSize string (e.g., "60x60x180")
    const [w, d, h] = preset.tentSize.split('x').map(Number);
    return {
        width: w / 30.48,
        depth: d / 30.48,
        height: h / 30.48,
        unit: 'ft'
    };
};

export default function PresetSetSelector() {
    const { dispatch } = useBuilder();
    const { language } = useSettings();
    
    const [selectedTier, setSelectedTier] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');

    // Filter presets
    const filteredPresets = useMemo(() => {
        return PRESET_SETS.filter(preset => {
            if (selectedTier !== 'all' && preset.tier !== selectedTier) return false;
            if (selectedBrand !== 'all' && preset.nutrientBrand !== selectedBrand) return false;
            return true;
        });
    }, [selectedTier, selectedBrand]);

    // Get unique brands
    const brands = useMemo(() => {
        const uniqueBrands = [...new Set(PRESET_SETS.map(p => p.nutrientBrand))];
        return uniqueBrands;
    }, []);

    const handleSelectPreset = (preset) => {
        const items = convertPresetToBuilderItems(preset);
        const tentDims = getTentDimensions(preset);
        
        dispatch({
            type: 'LOAD_PRESET',
            payload: {
                preset,
                tentDims,
                items,
                mediaType: preset.mediaType
            }
        });
    };

    const handleSkipToCustom = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const tierLabels = {
        entry: { en: 'Starter', tr: 'Başlangıç' },
        standard: { en: 'Standard', tr: 'Standart' },
        pro: { en: 'Professional', tr: 'Profesyonel' }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
                {language === 'tr' ? 'Hazır Set Seçin veya Özelleştirin' : 'Choose a Ready Set or Customize'}
            </h2>
            
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                {language === 'tr' 
                    ? 'Aşağıdaki hazır setlerden birini seçerek hızlıca başlayabilir veya kendi setinizi oluşturmak için "Özel Set Oluştur" butonuna tıklayabilirsiniz.'
                    : 'You can quickly start by selecting one of the ready sets below, or click "Create Custom Set" to build your own.'}
            </p>

            {/* Filters */}
            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginBottom: '2rem',
                flexWrap: 'wrap'
            }}>
                {/* Tier Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {language === 'tr' ? 'Seviye:' : 'Tier:'}
                    </label>
                    <select
                        value={selectedTier}
                        onChange={(e) => setSelectedTier(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="all">{language === 'tr' ? 'Tümü' : 'All'}</option>
                        <option value="entry">{tierLabels.entry[language]}</option>
                        <option value="standard">{tierLabels.standard[language]}</option>
                        <option value="pro">{tierLabels.pro[language]}</option>
                    </select>
                </div>

                {/* Brand Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {language === 'tr' ? 'Besin Markası:' : 'Nutrient Brand:'}
                    </label>
                    <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="all">{language === 'tr' ? 'Tümü' : 'All'}</option>
                        {brands.map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Preset Sets Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {filteredPresets.map(preset => (
                    <div
                        key={preset.id}
                        className="card-interactive glass-panel"
                        style={{
                            padding: '1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleSelectPreset(preset)}
                    >
                        {/* Header */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start',
                            marginBottom: '1rem'
                        }}>
                            <div>
                                <h3 style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: 'bold',
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.25rem'
                                }}>
                                    {preset.name[language]}
                                </h3>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
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
                                    borderRadius: 'var(--radius-sm)'
                                }}>
                                    {tierLabels[preset.tier][language]}
                                </span>
                            </div>
                            <div style={{
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                color: 'var(--color-primary)'
                            }}>
                                ₺{preset.totalPrice.toLocaleString()}
                            </div>
                        </div>

                        {/* Description */}
                        <p style={{ 
                            fontSize: '0.875rem', 
                            color: 'var(--text-secondary)',
                            marginBottom: '1rem',
                            lineHeight: '1.5'
                        }}>
                            {preset.description[language]}
                        </p>

                        {/* Specs */}
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(2, 1fr)', 
                            gap: '0.5rem',
                            fontSize: '0.8rem'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                color: 'var(--text-secondary)'
                            }}>
                                <span>📐</span>
                                <span>{preset.tentSize} cm</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                color: 'var(--text-secondary)'
                            }}>
                                <span>🌱</span>
                                <span>{preset.plantCount} {language === 'tr' ? 'bitki' : 'plant(s)'}</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                color: 'var(--text-secondary)'
                            }}>
                                <span>🧪</span>
                                <span>{preset.nutrientBrand}</span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                color: 'var(--text-secondary)'
                            }}>
                                <span>🌿</span>
                                <span>{preset.mediaType === 'soil' 
                                    ? (language === 'tr' ? 'Toprak' : 'Soil') 
                                    : preset.mediaType === 'coco' 
                                        ? (language === 'tr' ? 'Cocos' : 'Coco') 
                                        : preset.mediaType}
                                </span>
                            </div>
                        </div>

                        {/* Select Button */}
                        <button
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                padding: '0.75rem',
                                background: 'var(--color-primary)',
                                color: '#000',
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            {language === 'tr' ? 'Bu Seti Seç' : 'Select This Set'}
                        </button>
                    </div>
                ))}
            </div>

            {/* No results */}
            {filteredPresets.length === 0 && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem',
                    color: 'var(--text-secondary)'
                }}>
                    {language === 'tr' 
                        ? 'Seçilen filtrelerle eşleşen set bulunamadı.'
                        : 'No sets found matching the selected filters.'}
                </div>
            )}

            {/* Custom Set Button */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                marginTop: '2rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-color)'
            }}>
                <button
                    onClick={handleSkipToCustom}
                    style={{
                        padding: '1rem 2.5rem',
                        background: 'transparent',
                        color: 'var(--color-primary)',
                        border: '2px solid var(--color-primary)',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {language === 'tr' ? '🛠️ Özel Set Oluştur' : '🛠️ Create Custom Set'}
                </button>
            </div>
        </div>
    );
}

const selectStyle = {
    padding: '0.5rem 1rem',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    cursor: 'pointer',
    outline: 'none'
};
