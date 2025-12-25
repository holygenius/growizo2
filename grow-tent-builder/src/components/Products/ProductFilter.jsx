
import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Search, X, Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import styles from './Products.module.css';

const ProductFilter = ({
    onFilterChange,
    minPriceObj,
    maxPriceObj,
    brands,
    categories,
    initialFilters = {},
    isMobile = false
}) => {
    const { t, currency, formatPrice, language } = useSettings();
    const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedBrands, setSelectedBrands] = useState(initialFilters.brandIds || []);
    const [selectedCategories, setSelectedCategories] = useState(initialFilters.categoryIds || []);
    
    // Collapsible sections state
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        brands: true,
        price: true
    });

    // Initial max price setup (mock or passed prop)
    const MAX_PRICE_LIMIT = 50000;

    // Sync local state when filters prop changes (e.g. clear filters parent action)
    useEffect(() => {
        setSearchTerm(initialFilters.searchTerm || '');
        setPriceRange([
            initialFilters.minPrice > 0 ? initialFilters.minPrice : 0,
            initialFilters.maxPrice < 100000 ? initialFilters.maxPrice : MAX_PRICE_LIMIT
        ]);
        setSelectedBrands(initialFilters.brandIds || []);
        setSelectedCategories(initialFilters.categoryIds || []);
    }, [initialFilters]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);
        onFilterChange({ searchTerm: val });
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    const handlePriceAfterChange = (value) => {
        onFilterChange({ minPrice: value[0], maxPrice: value[1] });
    };

    const toggleBrand = (brandId) => {
        const newBrands = selectedBrands.includes(brandId)
            ? selectedBrands.filter(id => id !== brandId)
            : [...selectedBrands, brandId];
        setSelectedBrands(newBrands);
        onFilterChange({ brandIds: newBrands });
    };

    const toggleCategory = (catId) => {
        const newCats = selectedCategories.includes(catId)
            ? selectedCategories.filter(id => id !== catId)
            : [...selectedCategories, catId];
        setSelectedCategories(newCats);
        onFilterChange({ categoryIds: newCats });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setPriceRange([0, MAX_PRICE_LIMIT]);
        setSelectedBrands([]);
        setSelectedCategories([]);
        // Notify parent
        onFilterChange({
            searchTerm: '',
            minPrice: 0,
            maxPrice: MAX_PRICE_LIMIT,
            brandIds: [],
            categoryIds: []
        });
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const hasActiveFilters = searchTerm || selectedBrands.length > 0 || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < MAX_PRICE_LIMIT;

    return (
        <div className={`${styles.filterPanel} ${isMobile ? styles.filterPanelMobile : ''}`}>
            {/* Filter Header */}
            <div className={styles.filterHeader}>
                <h3 className={styles.filterHeaderTitle}>
                    <Filter size={18} />
                    {t('filters') || 'Filters'}
                </h3>
                {hasActiveFilters && (
                    <button onClick={clearFilters} className={styles.resetFiltersBtn}>
                        <RotateCcw size={14} />
                        {t('reset') || 'Reset'}
                    </button>
                )}
            </div>

            {/* Search */}
            <div className={styles.filterSearch}>
                <Search className={styles.searchIcon} size={18} />
                <input
                    type="text"
                    placeholder={t('searchProducts') || 'Search products...'}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
                {searchTerm && (
                    <button 
                        className={styles.clearSearchBtn}
                        onClick={() => { setSearchTerm(''); onFilterChange({ searchTerm: '' }); }}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Price Range Section */}
            <div className={styles.filterSection}>
                <button 
                    className={styles.filterSectionHeader}
                    onClick={() => toggleSection('price')}
                >
                    <span className={styles.filterSectionTitle}>{t('priceRange') || 'Price Range'}</span>
                    {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {expandedSections.price && (
                    <div className={styles.filterSectionContent}>
                        <div className={styles.sliderContainer}>
                            <Slider
                                range
                                min={0}
                                max={MAX_PRICE_LIMIT}
                                value={priceRange}
                                onChange={handlePriceChange}
                                onChangeComplete={handlePriceAfterChange}
                                styles={{
                                    track: { backgroundColor: '#10b981' },
                                    handle: { 
                                        borderColor: '#10b981', 
                                        backgroundColor: '#0d9668',
                                        opacity: 1,
                                        boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)'
                                    },
                                    rail: { backgroundColor: 'rgba(255,255,255,0.1)' }
                                }}
                            />
                        </div>
                        <div className={styles.priceInputs}>
                            <div className={styles.priceInputWrapper}>
                                <span className={styles.priceInputLabel}>{t('min') || 'Min'}</span>
                                <span className={styles.priceInputValue}>{formatPrice(priceRange[0])}</span>
                            </div>
                            <span className={styles.priceSeparator}>—</span>
                            <div className={styles.priceInputWrapper}>
                                <span className={styles.priceInputLabel}>{t('max') || 'Max'}</span>
                                <span className={styles.priceInputValue}>{formatPrice(priceRange[1])}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Categories Section */}
            {categories.length > 0 && (
                <div className={styles.filterSection}>
                    <button 
                        className={styles.filterSectionHeader}
                        onClick={() => toggleSection('categories')}
                    >
                        <span className={styles.filterSectionTitle}>
                            {t('categories') || 'Categories'}
                            {selectedCategories.length > 0 && (
                                <span className={styles.selectedCount}>{selectedCategories.length}</span>
                            )}
                        </span>
                        {expandedSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {expandedSections.categories && (
                        <div className={styles.filterSectionContent}>
                            <div className={styles.checkboxList}>
                                {categories.map(cat => (
                                    <label key={cat.id} className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                            className={styles.checkbox}
                                        />
                                        <span className={styles.checkboxCustom}></span>
                                        <span className={styles.checkboxText}>
                                            {cat.name[language] || cat.name.en || cat.key}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Brands Section */}
            {brands.length > 0 && (
                <div className={styles.filterSection}>
                    <button 
                        className={styles.filterSectionHeader}
                        onClick={() => toggleSection('brands')}
                    >
                        <span className={styles.filterSectionTitle}>
                            {t('brands') || 'Brands'}
                            {selectedBrands.length > 0 && (
                                <span className={styles.selectedCount}>{selectedBrands.length}</span>
                            )}
                        </span>
                        {expandedSections.brands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    
                    {expandedSections.brands && (
                        <div className={styles.filterSectionContent}>
                            <div className={styles.checkboxList}>
                                {brands.map(brand => (
                                    <label key={brand.id} className={styles.checkboxItem}>
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand.id)}
                                            onChange={() => toggleBrand(brand.id)}
                                            className={styles.checkbox}
                                        />
                                        <span className={styles.checkboxCustom}></span>
                                        <span className={styles.checkboxText}>{brand.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
