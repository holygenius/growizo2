import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw } from 'lucide-react';
import styles from '../Admin.module.css';
import ImageUploader from '../components/ImageUploader';
import TableFilter from '../components/TableFilter';
import { useAdmin } from '../../../context/AdminContext';

const BrandForm = ({ initialData, onClose, onSuccess }) => {
    const { t, showConfirm, addToast } = useAdmin();
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        color: '#10b981',
        icon: '',
        website_url: '',
        is_active: true,
        description: { en: '', tr: '' },
        display_order: 0
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
                await adminService.update('brands', initialData.id, formData);
            } else {
                await adminService.create('brands', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving brand:', error);
            alert('Error saving brand');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? t('edit') + ' ' + t('brand') : t('add') + ' ' + t('brand')}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Slug</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <ImageUploader
                    label="Brand Logo"
                    value={formData.logo_url}
                    onChange={url => setFormData({ ...formData, logo_url: url })}
                    bucket="brand-images"
                />

                <ImageUploader
                    label="Brand Icon"
                    value={formData.icon}
                    onChange={url => setFormData({ ...formData, icon: url })}
                    bucket="brand-images"
                />

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Brand Color</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="color"
                            value={formData.color || '#000000'}
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                            style={{ width: '50px', height: '42px', padding: 0, border: 'none', background: 'transparent' }}
                        />
                        <input
                            type="text"
                            value={formData.color}
                            onChange={e => setFormData({ ...formData, color: e.target.value })}
                            style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Icon (Emoji)</label>
                    <input
                        type="text"
                        value={formData.icon || ''}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                        placeholder="🌿"
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Website URL</label>
                    <input
                        type="url"
                        value={formData.website_url || ''}
                        onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                {/* Description JSON Fields */}
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Description (English)</label>
                    <textarea
                        value={formData.description?.en || ''}
                        onChange={e => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                        rows={2}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Description (Turkish)</label>
                    <textarea
                        value={formData.description?.tr || ''}
                        onChange={e => setFormData({ ...formData, description: { ...formData.description, tr: e.target.value } })}
                        rows={2}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
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
                        Save Brand
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function BrandsManager() {
    const { t, showConfirm, addToast } = useAdmin();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredBrands = useMemo(() => {
        return brands.filter(brand => {
            const matchesSearch = !searchTerm || 
                brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.slug?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' && brand.is_active) ||
                (statusFilter === 'inactive' && !brand.is_active);
            return matchesSearch && matchesStatus;
        });
    }, [brands, searchTerm, statusFilter]);

    const loadBrands = async () => {
        setLoading(true);
        try {
            const { data } = await adminService.getAll('brands', { orderBy: { column: 'display_order', ascending: true } });
            setBrands(data);
        } catch (error) {
            console.error('Error loading brands:', error);
            addToast(t('errorLoading'), 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBrands();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = await showConfirm(t('confirmDeleteBrand'));
        if (confirmed) {
            try {
                await adminService.delete('brands', id);
                addToast(t('deletedSuccessfully'), 'success');
                loadBrands();
            } catch (error) {
                console.error('Error deleting brand:', error);
                addToast(t('couldNotDelete'), 'error');
            }
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('brands')}</h2>
                <button
                    onClick={() => { setSelectedBrand(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> {t('add')} {t('brand')}
                </button>
            </div>

            {isEditing && (
                <BrandForm
                    initialData={selectedBrand}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadBrands}
                />
            )}

            <TableFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('filter') + ' ' + t('brands').toLowerCase() + '...'}
                filters={[
                    {
                        key: 'status',
                        label: t('status'),
                        value: statusFilter,
                        options: [
                            { value: 'active', label: t('active') },
                            { value: 'inactive', label: t('hidden') }
                        ]
                    }
                ]}
                onFilterChange={(key, value) => setStatusFilter(value)}
                resultCount={filteredBrands.length}
                totalCount={brands.length}
            />

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('order')}</th>
                                <th>{t('icon')}</th>
                                <th>{t('name')}</th>
                                <th>{t('slug')}</th>
                                <th>{t('color')}</th>
                                <th>{t('status')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
                            ) : filteredBrands.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('noBuildsFound')}</td></tr>
                            ) : filteredBrands.map(brand => (
                                <tr key={brand.id}>
                                    <td>{brand.display_order}</td>
                                    <td><span style={{ fontSize: '1.5rem' }}>{brand.icon}</span></td>
                                    <td style={{ fontWeight: 600 }}>{brand.name}</td>
                                    <td style={{ color: '#94a3b8' }}>{brand.slug}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '1rem', height: '1rem', borderRadius: '50%', background: brand.color }}></div>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{brand.color}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${brand.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {brand.is_active ? t('active') : t('hidden')}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => { setSelectedBrand(brand); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title={t('edit')}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(brand.id)}
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
