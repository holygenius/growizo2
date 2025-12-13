import React, { useState, useCallback } from 'react';
import styles from './AdminProductImport.module.css';
import { YesilGrowApiService } from '../../services/ikasService';
import { importService } from '../../services/importService';

/**
 * AdminProductImport Component
 * Handles importing and matching products from vendor APIs (YesilGrow via IKAS)
 */
export const AdminProductImport = () => {
    const [importState, setImportState] = useState({
        status: 'idle', // idle, loading, filtering, importing, completed, error
        vendorProducts: [],
        filteredProducts: [],
        searchTerm: '',
        selectedProducts: new Set(),
        importResult: null,
        error: null,
        progress: {
            current: 0,
            total: 0,
        },
    });

    const yesilgrowService = new YesilGrowApiService();

    /**
     * Fetch products from YesilGrow API
     */
    const handleFetchProducts = useCallback(async () => {
        setImportState(prev => ({
            ...prev,
            status: 'loading',
            error: null,
        }));

        try {
            console.log('🔄 Fetching YesilGrow products...');
            const products = await yesilgrowService.getProductsWithVendorInfo();

            setImportState(prev => ({
                ...prev,
                status: 'filtering',
                vendorProducts: products,
                filteredProducts: products,
                progress: {
                    current: 0,
                    total: products.length,
                },
            }));

            console.log(`✅ Fetched ${products.length} products from YesilGrow`);
        } catch (error) {
            console.error('❌ Error fetching products:', error);
            setImportState(prev => ({
                ...prev,
                status: 'error',
                error: error.message,
            }));
        }
    }, [yesilgrowService]);

    /**
     * Filter products based on search term
     */
    const handleSearch = useCallback((searchTerm) => {
        setImportState(prev => {
            const filtered = prev.vendorProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
            );

            return {
                ...prev,
                searchTerm,
                filteredProducts: filtered,
            };
        });
    }, []);

    /**
     * Toggle product selection
     */
    const handleToggleProduct = useCallback((productId) => {
        setImportState(prev => {
            const selected = new Set(prev.selectedProducts);
            if (selected.has(productId)) {
                selected.delete(productId);
            } else {
                selected.add(productId);
            }
            return {
                ...prev,
                selectedProducts: selected,
            };
        });
    }, []);

    /**
     * Select all filtered products
     */
    const handleSelectAll = useCallback(() => {
        setImportState(prev => {
            const selected = new Set(prev.filteredProducts.map((_, idx) => idx));
            return {
                ...prev,
                selectedProducts: selected,
            };
        });
    }, []);

    /**
     * Deselect all products
     */
    const handleDeselectAll = useCallback(() => {
        setImportState(prev => ({
            ...prev,
            selectedProducts: new Set(),
        }));
    }, []);

    /**
     * Import selected products
     */
    const handleImportProducts = useCallback(async () => {
        if (importState.selectedProducts.size === 0) {
            alert('Lütfen en az bir ürün seçiniz');
            return;
        }

        setImportState(prev => ({
            ...prev,
            status: 'importing',
            error: null,
        }));

        try {
            const selectedProductsList = importState.filteredProducts.filter(
                (_, idx) => importState.selectedProducts.has(idx)
            );

            console.log(`🔄 Importing ${selectedProductsList.length} products...`);

            const result = await importService.importVendorProducts(
                'yesilgrow',
                'YesilGrow',
                selectedProductsList,
                'YesilGrow - Grow tent supplies vendor'
            );

            setImportState(prev => ({
                ...prev,
                status: 'completed',
                importResult: result,
                selectedProducts: new Set(),
            }));

            console.log('✅ Import completed:', result);
        } catch (error) {
            console.error('❌ Error importing products:', error);
            setImportState(prev => ({
                ...prev,
                status: 'error',
                error: error.message,
            }));
        }
    }, [importState.selectedProducts, importState.filteredProducts]);

    /**
     * Reset import state
     */
    const handleReset = useCallback(() => {
        setImportState({
            status: 'idle',
            vendorProducts: [],
            filteredProducts: [],
            searchTerm: '',
            selectedProducts: new Set(),
            importResult: null,
            error: null,
            progress: {
                current: 0,
                total: 0,
            },
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>🛍️ Ürün İçeri Aktarma</h2>
                <p>YesilGrow'dan ürünleri seçip içeri aktarın ve fiyatlarını kaydedin</p>
            </div>

            {/* Status Messages */}
            {importState.error && (
                <div className={styles.error}>
                    <span>❌ Hata: {importState.error}</span>
                </div>
            )}

            {importState.importResult && (
                <div className={styles.success}>
                    <h3>✅ İçeri Aktarma Tamamlandı</h3>
                    <p>Toplam: {importState.importResult.totalProducts}</p>
                    <p>Eşleştirildi: {importState.importResult.matchedProducts}</p>
                    <p>Atlandı: {importState.importResult.skippedProducts}</p>
                    {importState.importResult.errors.length > 0 && (
                        <p style={{ color: '#ff6b6b' }}>Hatalar: {importState.importResult.errors.length}</p>
                    )}
                </div>
            )}

            {/* Control Buttons */}
            <div className={styles.controls}>
                <button
                    onClick={handleFetchProducts}
                    disabled={importState.status === 'loading'}
                    className={styles.button}
                >
                    {importState.status === 'loading' ? '⏳ Yükleniyor...' : '📥 Ürünleri Getir'}
                </button>

                {importState.status !== 'idle' && (
                    <>
                        <button
                            onClick={handleReset}
                            className={`${styles.button} ${styles.buttonSecondary}`}
                        >
                            🔄 Sıfırla
                        </button>
                    </>
                )}
            </div>

            {/* Product Filtering and Selection */}
            {importState.filteredProducts.length > 0 && (
                <div className={styles.filterSection}>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Ürün adı, SKU veya barkod ile ara..."
                            value={importState.searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.selectionControls}>
                        <button onClick={handleSelectAll} className={styles.buttonSmall}>
                            Tümünü Seç ({importState.filteredProducts.length})
                        </button>
                        <button onClick={handleDeselectAll} className={styles.buttonSmall}>
                            Seçimi Kaldır
                        </button>
                        <span className={styles.selectionCount}>
                            {importState.selectedProducts.size} seçildi
                        </span>
                    </div>

                    {/* Product List */}
                    <div className={styles.productList}>
                        {importState.filteredProducts.map((product, idx) => (
                            <div
                                key={idx}
                                className={`${styles.productItem} ${
                                    importState.selectedProducts.has(idx) ? styles.selected : ''
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={importState.selectedProducts.has(idx)}
                                    onChange={() => handleToggleProduct(idx)}
                                    className={styles.checkbox}
                                />
                                <div className={styles.productInfo}>
                                    <h4>{product.name}</h4>
                                    <p>SKU: {product.sku}</p>
                                    <p>Barkod: {product.barcode}</p>
                                </div>
                                <div className={styles.productPrice}>
                                    <p className={styles.price}>{product.price.toFixed(2)} ₺</p>
                                    <p className={styles.stock}>Stok: {product.stock}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Import Button */}
                    <div className={styles.importActions}>
                        <button
                            onClick={handleImportProducts}
                            disabled={importState.selectedProducts.size === 0 || importState.status === 'importing'}
                            className={`${styles.button} ${styles.buttonPrimary}`}
                        >
                            {importState.status === 'importing'
                                ? '⏳ İçeri Aktarılıyor...'
                                : `✅ ${importState.selectedProducts.size} Ürünü İçeri Aktar`}
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {importState.status !== 'idle' && importState.filteredProducts.length === 0 && importState.status !== 'loading' && (
                <div className={styles.emptyState}>
                    <p>Hiç ürün bulunamadı. Lütfen farklı bir arama terimi deneyin.</p>
                </div>
            )}

            {/* Loading State */}
            {importState.status === 'loading' && (
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>YesilGrow'dan ürünler getiriliyor...</p>
                </div>
            )}
        </div>
    );
};

export default AdminProductImport;
