import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Search } from 'lucide-react';
import styles from '../Admin.module.css';
import JsonEditor from '../components/JsonEditor';
import ImageUploader from '../components/ImageUploader';

const ProductForm = ({ initialData, brands, categories, onClose, onSuccess }) => {
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
    const [specsJson, setSpecsJson] = useState('{}');

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            setSpecsJson(JSON.stringify(initialData.specs || {}, null, 2));
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Parse specs JSON
            let updatedFormData = { ...formData };
            try {
                updatedFormData.specs = JSON.parse(specsJson);
            } catch (err) {
                alert('Invalid JSON in Specs field');
                setLoading(false);
                return;
            }

            if (initialData?.id) {
                await adminService.update('products', initialData.id, updatedFormData);
            } else {
                await adminService.create('products', updatedFormData);
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

                {/* Specs JSON */}
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Specs (JSON)</label>
                    <textarea
                        value={specsJson}
                        onChange={e => setSpecsJson(e.target.value)}
                        rows={5}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CA3AF', fontFamily: 'monospace', borderRadius: '0.5rem' }}
                    />
                    <small style={{ color: '#64748b' }}>Enter valid JSON for specs (e.g. watts, coverage, dimensions)</small>
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
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminService.delete('products', id);
                loadData();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Could not delete product.');
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

    const filteredProducts = products.filter(p =>
        p.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Products</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Filter products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '0.5rem',
                                padding: '0.75rem 0.75rem 0.75rem 2.25rem',
                                color: '#fff',
                                outline: 'none'
                            }}
                        />
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#64748b' }} />
                    </div>
                    <button
                        onClick={() => { setSelectedProduct(null); setIsEditing(true); }}
                        className={styles.actionBtn}
                        style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                    >
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

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
                                <th>SKU</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No products found</td></tr>
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
