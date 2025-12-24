import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw } from 'lucide-react';
import styles from '../Admin.module.css';
import JsonEditor from '../components/JsonEditor';
import ImageUploader from '../components/ImageUploader';
import TableFilter from '../components/TableFilter';
import { useAdmin } from '../../../context/AdminContext';
import ProductSelector from '../components/ProductSelector';

const PresetForm = ({ initialData, onClose, onSuccess }) => {
    const { t } = useAdmin();
    const [formData, setFormData] = useState({
        name: { en: '', tr: '' },
        description: { en: '', tr: '' },
        tier: 'standard',
        tent_size: { width: 120, depth: 120, height: 200, unit: 'cm' },
        products: [],
        media_type: 'soil',
        image_url: '',
        is_active: true,
        display_order: 0,
        total_price: 0
    });
    const [loading, setLoading] = useState(false);
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
        loadAllProducts();
    }, [initialData]);

    const loadAllProducts = async () => {
        try {
            const { data } = await adminService.getAll('products');
            setAllProducts(data || []);
        } catch (error) {
            console.error('Error loading products lookup:', error);
        }
    };

    const handleAddProduct = (product) => {
        setFormData(prev => {
            const exists = prev.products.find(p => p.sku === product.sku);
            if (exists) return prev;
            return {
                ...prev,
                products: [...prev.products, { sku: product.sku, quantity: 1 }]
            };
        });
        // We can keep it open or close it. Let's keep it open for multi-select feel or close.
        // User might want to add multiple. Let's keep it open but maybe show a toast?
        // For now, let's just update state. The selector shows checked status.
    };

    const handleRemoveProduct = (sku) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.filter(p => p.sku !== sku)
        }));
    };

    const handleQuantityChange = (sku, qty) => {
        setFormData(prev => ({
            ...prev,
            products: prev.products.map(p =>
                p.sku === sku ? { ...p, quantity: parseInt(qty) || 1 } : p
            )
        }));
    };

    const getProductDetails = (sku) => {
        return allProducts.find(p => p.sku === sku) || { name: { en: sku }, sku };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await adminService.update('preset_sets', initialData.id, formData);
            } else {
                await adminService.create('preset_sets', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving preset:', error);
            alert('Error saving preset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? t('edit') : t('add')} {t('presetSets')}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('nameEn')}</label>
                    <input
                        type="text"
                        value={formData.name?.en || ''}
                        onChange={e => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('nameTr')}</label>
                    <input
                        type="text"
                        value={formData.name?.tr || ''}
                        onChange={e => setFormData({ ...formData, name: { ...formData.name, tr: e.target.value } })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('tier')}</label>
                    <select
                        value={formData.tier}
                        onChange={e => setFormData({ ...formData, tier: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="entry">{t('tierEntry')}</option>
                        <option value="standard">{t('tierStandard')}</option>
                        <option value="premium">{t('tierPremium')}</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('totalPrice')}</label>
                    <input
                        type="number"
                        value={formData.total_price}
                        onChange={e => setFormData({ ...formData, total_price: parseInt(e.target.value) })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <ImageUploader
                    label={t('mainImage')}
                    value={formData.image_url}
                    onChange={url => setFormData({ ...formData, image_url: url })}
                />

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '1rem', fontWeight: 600 }}>{t('tentSizeConfig')}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{t('width')}</label>
                            <input
                                type="number"
                                value={formData.tent_size?.width || 0}
                                onChange={e => setFormData({
                                    ...formData,
                                    tent_size: { ...formData.tent_size, width: parseInt(e.target.value) || 0 }
                                })}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.25rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{t('depth')}</label>
                            <input
                                type="number"
                                value={formData.tent_size?.depth || 0}
                                onChange={e => setFormData({
                                    ...formData,
                                    tent_size: { ...formData.tent_size, depth: parseInt(e.target.value) || 0 }
                                })}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.25rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{t('height')}</label>
                            <input
                                type="number"
                                value={formData.tent_size?.height || 0}
                                onChange={e => setFormData({
                                    ...formData,
                                    tent_size: { ...formData.tent_size, height: parseInt(e.target.value) || 0 }
                                })}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.25rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{t('unit')}</label>
                            <select
                                value={formData.tent_size?.unit || 'cm'}
                                onChange={e => setFormData({
                                    ...formData,
                                    tent_size: { ...formData.tent_size, unit: e.target.value }
                                })}
                                style={{ width: '100%', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.25rem' }}
                            >
                                <option value="cm">cm</option>
                                <option value="m">m</option>
                                <option value="inch">inch</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', fontWeight: 600 }}>{t('includedProducts')}</label>
                        <button
                            type="button"
                            onClick={() => setShowProductSelector(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                            }}
                        >
                            <Plus size={16} /> {t('addProduct')}
                        </button>
                    </div>

                    {formData.products.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', color: '#64748b' }}>
                            {t('noProductsAdded')}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {formData.products.map((item, index) => {
                                const details = getProductDetails(item.sku);
                                return (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.75rem',
                                        background: 'rgba(0,0,0,0.2)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '0.5rem'
                                    }}>
                                        <div style={{ width: '48px', height: '48px', background: '#0f172a', borderRadius: '0.25rem', overflow: 'hidden', flexShrink: 0 }}>
                                            {(details.images?.[0]?.url || details.icon) ? (
                                                <img src={details.images?.[0]?.url || details.icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '0.7rem' }}>N/A</div>
                                            )}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: '#fff', fontWeight: 500 }}>{details.name?.en || item.sku}</div>
                                            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{t('sku')}: {item.sku}</div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <label style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{t('quantity')}:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.sku, e.target.value)}
                                                style={{
                                                    width: '60px',
                                                    padding: '0.25rem',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    color: '#fff',
                                                    borderRadius: '0.25rem',
                                                    textAlign: 'center'
                                                }}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(item.sku)}
                                            style={{
                                                padding: '0.5rem',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: '#ef4444',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                            title="Remove"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        {t('active')}
                    </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        {t('cancel')}
                    </button>
                    <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {t('save')}
                    </button>
                </div>
            </form>

            {showProductSelector && (
                <ProductSelector
                    onClose={() => setShowProductSelector(false)}
                    onSelect={handleAddProduct}
                    selectedSkus={formData.products.map(p => p.sku)}
                />
            )}
        </div>
    );
};

export default function PresetSetsManager() {
    const { t, showConfirm, addToast } = useAdmin();
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tierFilter, setTierFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredPresets = useMemo(() => {
        return presets.filter(preset => {
            const matchesSearch = !searchTerm ||
                preset.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                preset.name?.tr?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTier = tierFilter === 'all' || preset.tier === tierFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && preset.is_active) ||
                (statusFilter === 'inactive' && !preset.is_active);
            return matchesSearch && matchesTier && matchesStatus;
        });
    }, [presets, searchTerm, tierFilter, statusFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data } = await adminService.getAll('preset_sets', { orderBy: { column: 'display_order', ascending: true } });
            setPresets(data);
        } catch (error) {
            console.error('Error loading presets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = await showConfirm(
            t('confirmDeletePreset'),
            t('confirmDelete')
        );
        if (confirmed) {
            try {
                await adminService.delete('preset_sets', id);
                addToast(t('deletedSuccessfully'), 'success');
                loadData();
            } catch (error) {
                console.error('Error deleting preset:', error);
                addToast(t('errorDeleting'), 'error');
            }
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('presetSets')}</h2>
                <button
                    onClick={() => { setSelectedPreset(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> {t('add')}
                </button>
            </div>

            {isEditing && (
                <PresetForm
                    initialData={selectedPreset}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <TableFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('filter') + ' ' + t('presetSets').toLowerCase() + '...'}
                filters={[
                    {
                        key: 'tier',
                        label: t('tier'),
                        value: tierFilter,
                        options: [
                            { value: 'entry', label: t('tierEntry') },
                            { value: 'standard', label: t('tierStandard') },
                            { value: 'premium', label: t('tierPremium') }
                        ]
                    },
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
                onFilterChange={(key, value) => {
                    if (key === 'tier') setTierFilter(value);
                    if (key === 'status') setStatusFilter(value);
                }}
                resultCount={filteredPresets.length}
                totalCount={presets.length}
            />

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('name')}</th>
                                <th>{t('tier')}</th>
                                <th>{t('dimensions')}</th>
                                <th>{t('price')}</th>
                                <th>{t('status')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
                            ) : filteredPresets.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('noPresetsFound')}</td></tr>
                            ) : filteredPresets.map(preset => (
                                <tr key={preset.id}>
                                    <td style={{ fontWeight: 600 }}>{preset.name?.en || 'No Name'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{preset.tier}</td>
                                    <td>{preset.tent_size ? `${preset.tent_size.width}x${preset.tent_size.depth}cm` : '-'}</td>
                                    <td>₺{preset.total_price}</td>
                                    <td>
                                        <span className={`${styles.badge} ${preset.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {preset.is_active ? t('active') : t('hidden')}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => { setSelectedPreset(preset); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(preset.id)}
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
