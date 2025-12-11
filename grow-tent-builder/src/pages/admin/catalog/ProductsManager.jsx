import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Search } from 'lucide-react';
import styles from '../Admin.module.css';
import ImageUploader from '../components/ImageUploader';
import TableFilter from '../components/TableFilter';
import KeyValueEditor from '../components/KeyValueEditor';
import { useAdmin } from '../../../context/AdminContext';

// Suggested keys for product specs based on product type
const SPEC_SUGGESTIONS = {
    general: ['weight', 'dimensions', 'material', 'warranty', 'color'],
    tent: ['width', 'length', 'height', 'material', 'weight', 'waterproof', 'reflective_material'],
    light: ['watts', 'ppfd', 'coverage', 'spectrum', 'efficiency', 'lifespan', 'dimming', 'voltage'],
    fan: ['cfm', 'noise_level', 'speed_settings', 'diameter', 'power', 'voltage'],
    nutrient: ['npk_ratio', 'volume', 'ph_stable', 'organic', 'suitable_for'],
    substrate: ['volume', 'ph_range', 'composition', 'drainage', 'water_retention']
};

const ProductForm = ({ initialData, brands, categories, onClose, onSuccess }) => {
    const { t } = useAdmin();
    const [formData, setFormData] = useState({
        sku: '',
        brand_id: '',
        category_id: '',
        name: { en: '', tr: '' },
        description: { en: '', tr: '' },
        price: 0,
        product_type: 'general',
        specs: {},
        is_active: true,
        is_featured: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await adminService.update('products', initialData.id, formData);
            } else {
                await adminService.create('products', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const currentSuggestions = SPEC_SUGGESTIONS[formData.product_type] || SPEC_SUGGESTIONS.general;

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Product' : 'New Product'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>SKU (Unique)</label>
                    <input
                        type="text"
                        value={formData.sku}
                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <ImageUploader
                    label="Product Icon"
                    value={formData.icon}
                    onChange={url => setFormData({ ...formData, icon: url })}
                />

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Product Type</label>
                    <select
                        value={formData.product_type}
                        onChange={e => setFormData({ ...formData, product_type: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="general">General</option>
                        <option value="tent">Tent</option>
                        <option value="light">Light</option>
                        <option value="fan">Fan</option>
                        <option value="nutrient">Nutrient</option>
                        <option value="substrate">Substrate</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Brand</label>
                    <select
                        value={formData.brand_id || ''}
                        onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="">Select Brand...</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Category</label>
                    <select
                        value={formData.category_id || ''}
                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="">Select Category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name.en || c.key}</option>)}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Name (English)</label>
                    <input
                        type="text"
                        value={formData.name?.en || ''}
                        onChange={e => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Name (Turkish)</label>
                    <input
                        type="text"
                        value={formData.name?.tr || ''}
                        onChange={e => setFormData({ ...formData, name: { ...formData.name, tr: e.target.value } })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Price (TRY)</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                {/* Specs Key-Value Editor */}
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <KeyValueEditor
                        key={initialData?.id || 'new'}
                        label="Product Specifications"
                        value={formData.specs || {}}
                        onChange={specs => setFormData({ ...formData, specs })}
                        keyPlaceholder="Spec name (e.g., watts)"
                        valuePlaceholder="Value (e.g., 600W)"
                        suggestedKeys={currentSuggestions}
                    />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        Active
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        Featured
                    </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Product
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function ProductsManager() {
    const { t, showConfirm, addToast } = useAdmin();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = !searchTerm ||
                p.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBrand = brandFilter === 'all' || p.brand_id === brandFilter;
            const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
            const matchesType = typeFilter === 'all' || p.product_type === typeFilter;
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' && p.is_active) ||
                (statusFilter === 'inactive' && !p.is_active);
            return matchesSearch && matchesBrand && matchesCategory && matchesType && matchesStatus;
        });
    }, [products, searchTerm, brandFilter, categoryFilter, typeFilter, statusFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prodData, brandData, catData] = await Promise.all([
                adminService.getAll('products', { limit: 50 }),
                adminService.getAll('brands'),
                adminService.getAll('categories')
            ]);
            setProducts(prodData.data);
            setBrands(brandData.data);
            setCategories(catData.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = await showConfirm(t('confirmDeleteProduct'));
        if (confirmed) {
            try {
                await adminService.delete('products', id);
                addToast(t('deletedSuccessfully'), 'success');
                loadData();
            } catch (error) {
                console.error('Error deleting product:', error);
                addToast(t('couldNotDelete'), 'error');
            }
        }
    };

    const getBrandName = (id) => {
        const b = brands.find(x => x.id === id);
        return b ? b.name : '-';
    };

    const getCategoryName = (id) => {
        const c = categories.find(x => x.id === id);
        return c ? (c.name?.en || c.key) : '-';
    };

    const productTypeOptions = [
        { value: 'general', label: 'General' },
        { value: 'tent', label: 'Tent' },
        { value: 'light', label: 'Light' },
        { value: 'fan', label: 'Fan' },
        { value: 'nutrient', label: 'Nutrient' },
        { value: 'substrate', label: 'Substrate' }
    ];

    const handleFilterChange = (key, value) => {
        switch (key) {
            case 'brand': setBrandFilter(value); break;
            case 'category': setCategoryFilter(value); break;
            case 'type': setTypeFilter(value); break;
            case 'status': setStatusFilter(value); break;
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('products')}</h2>
                <button
                    onClick={() => { setSelectedProduct(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> {t('addProduct')}
                </button>
            </div>

            <TableFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('filter') + ' ' + t('products').toLowerCase() + '...'}
                filters={[
                    {
                        key: 'brand',
                        label: t('brand'),
                        value: brandFilter,
                        options: [
                            { value: 'all', label: t('allBrands') || 'All Brands' },
                            ...brands.map(b => ({ value: b.id, label: b.name }))
                        ]
                    },
                    {
                        key: 'category',
                        label: t('category'),
                        value: categoryFilter,
                        options: [
                            { value: 'all', label: t('allCategories') || 'All Categories' },
                            ...categories.map(c => ({ value: c.id, label: c.name?.en || c.key }))
                        ]
                    },
                    {
                        key: 'type',
                        label: t('productType') || 'Product Type',
                        value: typeFilter,
                        options: [
                            { value: 'all', label: t('allTypes') || 'All Types' },
                            ...productTypeOptions
                        ]
                    },
                    {
                        key: 'status',
                        label: t('status'),
                        value: statusFilter,
                        options: [
                            { value: 'all', label: t('allStatus') || 'All Status' },
                            { value: 'active', label: t('active') || 'Active' },
                            { value: 'inactive', label: t('inactive') || 'Inactive' }
                        ]
                    }
                ]}
                onFilterChange={handleFilterChange}
                resultCount={filteredProducts.length}
                totalCount={products.length}
            />

            {isEditing && (
                <ProductForm
                    initialData={selectedProduct}
                    brands={brands}
                    categories={categories}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('sku')}</th>
                                <th>{t('name')}</th>
                                <th>{t('brand')}</th>
                                <th>{t('category')}</th>
                                <th>{t('price')}</th>
                                <th>{t('type')}</th>
                                <th>{t('status')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('noBuildsFound')}</td></tr>
                            ) : filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{product.sku}</td>
                                    <td style={{ fontWeight: 600 }}>{product.name?.en || 'No Name'}</td>
                                    <td>{getBrandName(product.brand_id)}</td>
                                    <td>{getCategoryName(product.category_id)}</td>
                                    <td>₺{product.price}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{product.product_type}</td>
                                    <td>
                                        <span className={`${styles.badge} ${product.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {product.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => { setSelectedProduct(product); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem', color: '#f87171' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
