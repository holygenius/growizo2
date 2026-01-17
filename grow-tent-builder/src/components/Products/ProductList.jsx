
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { useSettings } from '../../context/SettingsContext';
import ProductFilter from './ProductFilter';
import ProductCard from './ProductCard';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Loader, Package, ChevronRight, Grid3X3, LayoutGrid, SlidersHorizontal, X } from 'lucide-react';
import styles from './Products.module.css';

const ProductList = () => {
    const { t, language, getLocalizedPath } = useSettings();
    const [searchParams, setSearchParams] = useSearchParams();

    // Data State
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    // UI State
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    // Filter State
    const [filters, setFilters] = useState({
        searchTerm: searchParams.get('q') || '',
        brandIds: searchParams.get('brands')?.split(',').filter(Boolean) || [],
        categoryIds: searchParams.get('categories')?.split(',').filter(Boolean) || [],
        minPrice: Number(searchParams.get('minPrice')) || 0,
        maxPrice: Number(searchParams.get('maxPrice')) || 100000,
        sortBy: searchParams.get('sort') || 'price_asc',
        page: Number(searchParams.get('page')) || 1
    });

    // View State
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compact'
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Helper to update URL params
    const updateUrlParams = (newFilters) => {
        const params = {};
        if (newFilters.searchTerm) params.q = newFilters.searchTerm;
        if (newFilters.brandIds?.length) params.brands = newFilters.brandIds.join(',');
        if (newFilters.categoryIds?.length) params.categories = newFilters.categoryIds.join(',');
        if (newFilters.minPrice > 0) params.minPrice = newFilters.minPrice;
        if (newFilters.maxPrice < 100000) params.maxPrice = newFilters.maxPrice;
        if (newFilters.sortBy !== 'price_asc') params.sort = newFilters.sortBy;
        if (newFilters.page > 1) params.page = newFilters.page;
        setSearchParams(params);
    };

    // Initialize Metadata (Brands, Categories)
    useEffect(() => {
        const loadMetadata = async () => {
            try {
                const [brandsData, catsData] = await Promise.all([
                    adminService.getAll('brands'),
                    adminService.getAll('categories')
                ]);
                setBrands(brandsData.data);
                setCategories(catsData.data);
            } catch (err) {
                console.error("Failed to load metadata", err);
            }
        };
        loadMetadata();
    }, []);

    // Load Products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const result = await productService.searchProducts({
                    searchTerm: filters.searchTerm,
                    brandIds: filters.brandIds,
                    categoryIds: filters.categoryIds,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    sortBy: filters.sortBy,
                    page: filters.page,
                    limit: 12
                });
                console.log('[ProductList] Products loaded:', result.data?.map(p => ({ sku: p.sku, name: p.name?.en })));
                setProducts(result.data);
                setTotalCount(result.count);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(timer);
    }, [filters]);

    const handleFilterChange = (updatedFilters) => {
        const isPageChange = Object.keys(updatedFilters).length === 1 && updatedFilters.page;
        const newFilters = {
            ...filters,
            ...updatedFilters,
            page: isPageChange ? updatedFilters.page : 1
        };
        setFilters(newFilters);
        updateUrlParams(newFilters);
    };

    // Get active filter count
    const activeFilterCount = [
        filters.searchTerm,
        filters.brandIds.length > 0,
        filters.categoryIds.length > 0,
        filters.minPrice > 0 || filters.maxPrice < 100000
    ].filter(Boolean).length;

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            
            {/* Hero Banner */}
            <div className={styles.heroBanner}>
                <div className={styles.heroOverlay}></div>
                <div className={styles.heroContent}>
                    <nav className={styles.breadcrumb}>
                        <Link to={getLocalizedPath('/')}>{t('navHome') || 'Home'}</Link>
                        <ChevronRight size={14} />
                        <span>{t('navProducts') || 'Products'}</span>
                    </nav>
                    <h1 className={styles.heroTitle}>
                        <Package className={styles.heroIcon} />
                        {t('allProducts') || 'All Products'}
                    </h1>
                    <p className={styles.heroSubtitle}>
                        {t('productsDescription') || 'Discover premium growing equipment and nutrients for your indoor garden'}
                    </p>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.pageLayout}>
                    {/* Desktop Sidebar Filters */}
                    <aside className={styles.sidebar}>
                        <ProductFilter
                            onFilterChange={handleFilterChange}
                            brands={brands}
                            categories={categories}
                            initialFilters={filters}
                        />
                    </aside>

                    {/* Mobile Filter Overlay */}
                    {mobileFilterOpen && (
                        <div className={styles.mobileFilterOverlay} onClick={() => setMobileFilterOpen(false)}>
                            <div className={styles.mobileFilterPanel} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.mobileFilterHeader}>
                                    <h3>{t('filters') || 'Filters'}</h3>
                                    <button onClick={() => setMobileFilterOpen(false)} className={styles.closeFilterBtn}>
                                        <X size={20} />
                                    </button>
                                </div>
                                <ProductFilter
                                    onFilterChange={(f) => { handleFilterChange(f); }}
                                    brands={brands}
                                    categories={categories}
                                    initialFilters={filters}
                                    isMobile={true}
                                />
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <main className={styles.mainContent}>
                        {/* Toolbar */}
                        <div className={styles.toolbar}>
                            <div className={styles.toolbarLeft}>
                                {/* Mobile Filter Button */}
                                <button 
                                    className={styles.mobileFilterBtn}
                                    onClick={() => setMobileFilterOpen(true)}
                                >
                                    <SlidersHorizontal size={18} />
                                    {t('filters') || 'Filters'}
                                    {activeFilterCount > 0 && (
                                        <span className={styles.filterBadge}>{activeFilterCount}</span>
                                    )}
                                </button>

                                <div className={styles.resultCount}>
                                    {loading ? (
                                        <span className={styles.loadingText}>{t('loading') || 'Loading...'}</span>
                                    ) : (
                                        <span>
                                            <strong className={styles.countHighlight}>{products.length}</strong>
                                            {' '}{t('of') || 'of'}{' '}
                                            <strong className={styles.countHighlight}>{totalCount}</strong>
                                            {' '}{t('productsLabel') || 'products'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.toolbarRight}>
                                {/* View Toggle */}
                                <div className={styles.viewToggle}>
                                    <button 
                                        className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        title={t('gridView') || 'Grid view'}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button 
                                        className={`${styles.viewBtn} ${viewMode === 'compact' ? styles.viewBtnActive : ''}`}
                                        onClick={() => setViewMode('compact')}
                                        title={t('compactView') || 'Compact view'}
                                    >
                                        <Grid3X3 size={18} />
                                    </button>
                                </div>

                                {/* Sort */}
                                <div className={styles.sortGroup}>
                                    <label>{t('sortBy') || 'Sort'}:</label>
                                    <select
                                        className={styles.sortSelect}
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                                    >
                                        <option value="price_asc">{t('priceLowToHigh') || 'Price: Low to High'}</option>
                                        <option value="price_desc">{t('priceHighToLow') || 'Price: High to Low'}</option>
                                        <option value="newest">{t('newestFirst') || 'Newest First'}</option>
                                        <option value="name_asc">{t('nameAz') || 'Name: A-Z'}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Tags */}
                        {activeFilterCount > 0 && (
                            <div className={styles.activeFilters}>
                                {filters.searchTerm && (
                                    <span className={styles.filterTag}>
                                        "{filters.searchTerm}"
                                        <button onClick={() => handleFilterChange({ searchTerm: '' })}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.brandIds.length > 0 && (
                                    <span className={styles.filterTag}>
                                        {filters.brandIds.length} {t('brandsSelected') || 'brands'}
                                        <button onClick={() => handleFilterChange({ brandIds: [] })}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.categoryIds.length > 0 && (
                                    <span className={styles.filterTag}>
                                        {filters.categoryIds.length} {t('categoriesSelected') || 'categories'}
                                        <button onClick={() => handleFilterChange({ categoryIds: [] })}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                )}
                                <button 
                                    className={styles.clearAllBtn}
                                    onClick={() => handleFilterChange({ 
                                        searchTerm: '', 
                                        minPrice: 0, 
                                        maxPrice: 100000, 
                                        brandIds: [], 
                                        categoryIds: [] 
                                    })}
                                >
                                    {t('clearAll') || 'Clear All'}
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {loading ? (
                            <div className={styles.loadingState}>
                                <Loader className={styles.spinner} size={48} />
                                <p>{t('loadingProducts') || 'Loading products...'}</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Package size={64} strokeWidth={1} />
                                <h3>{t('noProductsFound') || 'No products found'}</h3>
                                <p>{t('tryDifferentFilters') || 'Try adjusting your filters or search terms'}</p>
                                <button
                                    onClick={() => handleFilterChange({ 
                                        searchTerm: '', 
                                        minPrice: 0, 
                                        maxPrice: 100000, 
                                        brandIds: [], 
                                        categoryIds: [] 
                                    })}
                                    className={styles.resetBtn}
                                >
                                    {t('clearFilters') || 'Clear All Filters'}
                                </button>
                            </div>
                        ) : (
                            <div className={`${styles.grid} ${viewMode === 'compact' ? styles.gridCompact : ''}`}>
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalCount > 12 && !loading && (
                            <div className={styles.pagination}>
                                <button
                                    onClick={() => handleFilterChange({ page: Math.max(1, filters.page - 1) })}
                                    disabled={filters.page === 1}
                                    className={styles.pageBtn}
                                >
                                    ← {t('prev') || 'Prev'}
                                </button>
                                
                                <div className={styles.pageNumbers}>
                                    {Array.from({ length: Math.min(5, Math.ceil(totalCount / 12)) }, (_, i) => {
                                        const totalPages = Math.ceil(totalCount / 12);
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (filters.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (filters.page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = filters.page - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handleFilterChange({ page: pageNum })}
                                                className={`${styles.pageNum} ${filters.page === pageNum ? styles.pageNumActive : ''}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handleFilterChange({ page: filters.page + 1 })}
                                    disabled={filters.page >= Math.ceil(totalCount / 12)}
                                    className={styles.pageBtn}
                                >
                                    {t('next') || 'Next'} →
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductList;
