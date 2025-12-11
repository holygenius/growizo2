import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw } from 'lucide-react';
import styles from '../Admin.module.css';
import JsonEditor from '../components/JsonEditor';
import ImageUploader from '../components/ImageUploader';

const ProductForm = ({ initialData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        id: '', // SKU
        product_name: '',
        category: 'base_nutrient',
        dose_unit: 'ml/L',
        schedule_allmix: {},
        schedule_lightmix_coco: {},
        icon: '',
        is_active: true
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
                // Warning: PK changes are tricky, but here id is the key. 
                // Usually we shouldn't allow changing PK if it's used elsewhere.
                // Assuming ID (SKU) is constant for updates or we handle it carefully.
                // For simplicity, we use update with the *original* ID.
                await adminService.update('feeding_schedule_products', initialData.id, formData);
            } else {
                await adminService.create('feeding_schedule_products', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Schedule Product' : 'New Schedule Product'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>SKU / ID (Unique)</label>
                    <input
                        type="text"
                        value={formData.id}
                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                        disabled={!!initialData}
                        style={{ width: '100%', padding: '0.75rem', background: initialData ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: initialData ? '#64748b' : '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Product Name</label>
                    <input
                        type="text"
                        value={formData.product_name}
                        onChange={e => setFormData({ ...formData, product_name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Category</label>
                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="base_nutrient">Base Nutrient</option>
                        <option value="stimulator_root">Root Stimulator</option>
                        <option value="bloom_booster">Bloom Booster</option>
                        <option value="enzyme">Enzyme</option>
                        <option value="additive">Additive</option>
                        <option value="ph_control">pH Control</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Dose Unit</label>
                    <input
                        type="text"
                        value={formData.dose_unit}
                        onChange={e => setFormData({ ...formData, dose_unit: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <ImageUploader
                    label="Icon Image"
                    value={formData.icon}
                    onChange={url => setFormData({ ...formData, icon: url })}
                />

                <JsonEditor
                    label="Schedule (All-Mix / Soil)"
                    value={formData.schedule_allmix}
                    onChange={val => setFormData({ ...formData, schedule_allmix: val })}
                    height="200px"
                    helpText='Format: { "WK 1": 1, "WK 2": 2, ... }'
                />

                <JsonEditor
                    label="Schedule (Light-Mix / Coco)"
                    value={formData.schedule_lightmix_coco}
                    onChange={val => setFormData({ ...formData, schedule_lightmix_coco: val })}
                    height="200px"
                    helpText='Format: { "WK 1": 2, "WK 2": 4, ... }'
                />

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

export default function FeedingScheduleProductsManager() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data } = await adminService.getAll('feeding_schedule_products', { orderBy: { column: 'product_name', ascending: true } });
            setProducts(data);
        } catch (error) {
            console.error('Error loading schedule products:', error);
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
                await adminService.delete('feeding_schedule_products', id);
                loadData();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Schedule Products</h2>
                <button
                    onClick={() => { setSelectedProduct(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> Add Product
                </button>
            </div>

            {isEditing && (
                <ProductForm
                    initialData={selectedProduct}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Icon</th>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Unit</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No products found</td></tr>
                            ) : products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        {product.icon && (
                                            <img
                                                src={product.icon}
                                                alt=""
                                                style={{ width: '32px', height: '32px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}
                                            />
                                        )}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{product.product_name}</td>
                                    <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{product.id}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{product.category?.replace(/_/g, ' ')}</td>
                                    <td>{product.dose_unit}</td>
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
