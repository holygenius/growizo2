import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Folder } from 'lucide-react';
import styles from '../Admin.module.css';

const CategoryForm = ({ initialData, categories, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        key: '',
        name: { en: '', tr: '' },
        icon: '',
        parent_category_id: null,
        display_order: 0,
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
                await adminService.update('categories', initialData.id, formData);
            } else {
                await adminService.create('categories', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error saving category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Category' : 'New Category'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Key (Unique ID)</label>
                    <input
                        type="text"
                        value={formData.key}
                        onChange={e => setFormData({ ...formData, key: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Icon (Emoji)</label>
                    <input
                        type="text"
                        value={formData.icon || ''}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="📁"
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Parent Category</label>
                    <select
                        value={formData.parent_category_id || ''}
                        onChange={e => setFormData({ ...formData, parent_category_id: e.target.value || null })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="">None (Top Level)</option>
                        {categories.filter(c => c.id !== initialData?.id).map(c => (
                            <option key={c.id} value={c.id}>
                                {c.icon} {c.name.en || c.key}
                            </option>
                        ))}
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ color: '#94a3b8' }}>Order:</label>
                        <input
                            type="number"
                            value={formData.display_order}
                            onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                            style={{ width: '80px', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        />
                    </div>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function CategoriesManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const { data } = await adminService.getAll('categories', { orderBy: { column: 'display_order', ascending: true } });
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await adminService.delete('categories', id);
                loadCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Could not delete category. It might contain sub-categories or products.');
            }
        }
    };

    // Helper to get parent name
    const getParentName = (id) => {
        const parent = categories.find(c => c.id === id);
        return parent ? (parent.name?.en || parent.key) : '-';
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Categories</h2>
                <button
                    onClick={() => { setSelectedCategory(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> Add Category
                </button>
            </div>

            {isEditing && (
                <CategoryForm
                    initialData={selectedCategory}
                    categories={categories}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadCategories}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Icon</th>
                                <th>Key</th>
                                <th>Name (EN)</th>
                                <th>Name (TR)</th>
                                <th>Parent</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : categories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.display_order}</td>
                                    <td><span style={{ fontSize: '1.5rem' }}>{category.icon}</span></td>
                                    <td style={{ color: '#94a3b8' }}>{category.key}</td>
                                    <td style={{ fontWeight: 600 }}>{category.name?.en || '-'}</td>
                                    <td>{category.name?.tr || '-'}</td>
                                    <td style={{ color: '#94a3b8', fontStyle: 'italic' }}>{getParentName(category.parent_category_id)}</td>
                                    <td>
                                        <span className={`${styles.badge} ${category.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {category.is_active ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => { setSelectedCategory(category); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
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
