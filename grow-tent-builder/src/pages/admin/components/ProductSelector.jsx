import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { Check } from 'lucide-react';
import styles from '../Admin.module.css';
import TableFilter from './TableFilter';
import { useAdmin } from '../../../context/AdminContext';

export default function ProductSelector({ onSelect, selectedSkus = [], onClose }) {
    const { t } = useAdmin();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prodData, brandData, catData] = await Promise.all([
                adminService.getAll('products'),
                adminService.getAll('brands'),
                adminService.getAll('categories')
            ]);
            setProducts(prodData.data || []);
            setBrands(brandData.data || []);
            setCategories(catData.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = !searchTerm ||
                p.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.name?.tr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesBrand = brandFilter === 'all' || p.brand_id === brandFilter;
            const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
            const matchesType = typeFilter === 'all' || p.product_type === typeFilter;

            return matchesSearch && matchesBrand && matchesCategory && matchesType;
        });
    }, [products, searchTerm, brandFilter, categoryFilter, typeFilter]);

    const productTypeOptions = [
        { value: 'general', label: t('general') },
        { value: 'tent', label: t('tent') },
        { value: 'light', label: t('light') },
        { value: 'fan', label: t('fan') },
        { value: 'nutrient', label: t('nutrient') },
        { value: 'substrate', label: t('substrate') }
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }} onClick={onClose}>
            <div style={{
                background: '#1e293b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                padding: '2rem',
                maxWidth: '1000px',
                width: '95%',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }} onClick={e => e.stopPropagation()}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>{t('selectProduct')}</h3>
                    <button onClick={onClose} className={styles.iconBtn} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <TableFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder={t('searchProductPlaceholder')}
                        resultCount={filteredProducts.length}
                        totalCount={products.length}
                        filters={[
                            {
                                key: 'brand',
                                label: t('brand'),
                                value: brandFilter,
                                options: brands.map(b => ({ value: b.id, label: b.name }))
                            },
                            {
                                key: 'category',
                                label: t('category'),
                                value: categoryFilter,
                                options: categories.map(c => ({ value: c.id, label: c.name?.en || c.key }))
                            },
                            {
                                key: 'type',
                                label: t('type'),
                                value: typeFilter,
                                options: productTypeOptions
                            }
                        ]}
                        onFilterChange={(key, value) => {
                            if (key === 'brand') setBrandFilter(value);
                            if (key === 'category') setCategoryFilter(value);
                            if (key === 'type') setTypeFilter(value);
                        }}
                    />
                </div>

                <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('loadingProducts')}</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                            {filteredProducts.map(product => {
                                const isSelected = selectedSkus.includes(product.sku);
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => !isSelected && onSelect(product)}
                                        style={{
                                            background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)',
                                            border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '0.5rem',
                                            padding: '1rem',
                                            cursor: isSelected ? 'default' : 'pointer',
                                            transition: 'all 0.2s',
                                            opacity: isSelected ? 0.7 : 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            position: 'relative'
                                        }}
                                        className={!isSelected ? styles.hoverCard : ''}
                                    >
                                        {isSelected && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '0.5rem',
                                                right: '0.5rem',
                                                background: '#10b981',
                                                color: '#fff',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 10
                                            }}>
                                                <Check size={12} />
                                            </div>
                                        )}

                                        <div style={{
                                            aspectRatio: '1',
                                            background: '#0f172a',
                                            borderRadius: '0.25rem',
                                            overflow: 'hidden',
                                            marginBottom: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {product.images?.[0]?.url || product.icon ? (
                                                <img
                                                    src={product.images?.[0]?.url || product.icon}
                                                    alt={product.name?.en}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{t('noImage')}</div>
                                            )}
                                        </div>

                                        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem', lineHeight: '1.2' }}>
                                            {product.name?.en || 'Unnamed'}
                                        </div>

                                        <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                                            {t('sku')}: {product.sku}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
