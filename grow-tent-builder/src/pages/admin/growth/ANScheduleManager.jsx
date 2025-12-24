import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { brandService } from '../../../services/brandService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, ChevronDown, ChevronRight, Settings, Package, Calendar, Beaker } from 'lucide-react';
import styles from '../Admin.module.css';
import JsonEditor from '../components/JsonEditor';
import TableFilter from '../components/TableFilter';
import { useAdmin } from '../../../context/AdminContext';

// Week Labels for the schedule grid
const WEEK_LABELS = [
    'Grow W1', 'Grow W2', 'Grow W3', 'Grow W4',
    'Bloom W1', 'Bloom W2', 'Bloom W3', 'Bloom W4',
    'Bloom W5', 'Bloom W6', 'Bloom W7', 'Bloom W8'
];

// Schedule Editor Component for editing product schedule data
const ScheduleEditor = ({ product, onSave, onClose }) => {
    const { t, addToast } = useAdmin();
    const [scheduleData, setScheduleData] = useState({
        schedule_hydro_master: product.specs?.schedule_hydro_master || {},
        schedule_coco_master: product.specs?.schedule_coco_master || {},
        schedule_default: product.specs?.schedule_default || {},
        category_key: product.specs?.category_key || 'base_nutrient',
        dose_unit: product.specs?.dose_unit || 'ml/L'
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('hydro');

    const handleWeekChange = (scheduleType, weekLabel, value) => {
        const parsedValue = value === '' ? null : (isNaN(Number(value)) ? value : Number(value));
        setScheduleData(prev => ({
            ...prev,
            [scheduleType]: {
                ...prev[scheduleType],
                [weekLabel]: parsedValue
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedSpecs = {
                ...product.specs,
                ...scheduleData
            };
            await adminService.update('products', product.id, { specs: updatedSpecs });
            addToast(t('savedSuccessfully') || 'Saved successfully', 'success');
            onSave();
        } catch (error) {
            console.error('Error saving schedule:', error);
            addToast(t('errorSaving') || 'Error saving', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderScheduleGrid = (scheduleType) => {
        const schedule = scheduleData[scheduleType] || {};
        return (
            <div style={{ overflowX: 'auto' }}>
                <table className={styles.table} style={{ fontSize: '0.85rem' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Week</th>
                            <th style={{ width: '120px' }}>Dose ({scheduleData.dose_unit})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {WEEK_LABELS.map((weekLabel, idx) => (
                            <tr key={weekLabel} style={{ 
                                background: idx < 4 ? 'rgba(34, 197, 94, 0.1)' : idx === 11 ? 'rgba(107, 114, 128, 0.1)' : 'rgba(236, 72, 153, 0.1)' 
                            }}>
                                <td style={{ fontWeight: 500 }}>{weekLabel}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={schedule[weekLabel] ?? ''}
                                        onChange={e => handleWeekChange(scheduleType, weekLabel, e.target.value)}
                                        placeholder="N/A"
                                        style={{
                                            width: '80px',
                                            padding: '0.5rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '4px',
                                            color: '#fff',
                                            textAlign: 'center'
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>
                    <Beaker size={20} style={{ marginRight: '0.5rem' }} />
                    {product.name?.en || product.sku} - Schedule Editor
                </h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <div style={{ padding: '1rem' }}>
                {/* Meta Info */}
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Category Key</label>
                        <select
                            value={scheduleData.category_key}
                            onChange={e => setScheduleData({ ...scheduleData, category_key: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                        >
                            <option value="base_nutrient">Base Nutrient</option>
                            <option value="root_expanders">Root Expanders</option>
                            <option value="bigger_buds">Bigger Buds</option>
                            <option value="bud_potency">Bud Potency</option>
                            <option value="grow_medium">Grow Medium</option>
                            <option value="taste_terpene">Taste & Terpene</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Dose Unit</label>
                        <input
                            type="text"
                            value={scheduleData.dose_unit}
                            onChange={e => setScheduleData({ ...scheduleData, dose_unit: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                        />
                    </div>
                </div>

                {/* Schedule Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('hydro')}
                        style={{
                            padding: '0.5rem 1rem',
                            background: activeTab === 'hydro' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Hydro Master
                    </button>
                    <button
                        onClick={() => setActiveTab('coco')}
                        style={{
                            padding: '0.5rem 1rem',
                            background: activeTab === 'coco' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Coco Master
                    </button>
                    <button
                        onClick={() => setActiveTab('default')}
                        style={{
                            padding: '0.5rem 1rem',
                            background: activeTab === 'default' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Default
                    </button>
                </div>

                {/* Schedule Grid */}
                {activeTab === 'hydro' && renderScheduleGrid('schedule_hydro_master')}
                {activeTab === 'coco' && renderScheduleGrid('schedule_coco_master')}
                {activeTab === 'default' && renderScheduleGrid('schedule_default')}

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        {t('cancel') || 'Cancel'}
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={loading} 
                        className={styles.actionBtn} 
                        style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {t('save') || 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Config Editor Component
const ConfigEditor = ({ config, onSave, onClose }) => {
    const { t, addToast } = useAdmin();
    const [formData, setFormData] = useState({
        config_key: config?.config_key || '',
        config_value: config?.config_value || {},
        description: config?.description || '',
        is_active: config?.is_active ?? true
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (config?.id) {
                await adminService.update('an_schedule_config', config.id, formData);
            } else {
                await adminService.create('an_schedule_config', formData);
            }
            addToast(t('savedSuccessfully') || 'Saved successfully', 'success');
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving config:', error);
            addToast(t('errorSaving') || 'Error saving', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>
                    <Settings size={20} style={{ marginRight: '0.5rem' }} />
                    {config ? 'Edit Config' : 'New Config'}
                </h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1rem', display: 'grid', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Config Key</label>
                    <input
                        type="text"
                        value={formData.config_key}
                        onChange={e => setFormData({ ...formData, config_key: e.target.value })}
                        disabled={!!config}
                        style={{ width: '100%', padding: '0.75rem', background: config ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: config ? '#64748b' : '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Description</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <JsonEditor
                    label="Config Value"
                    value={formData.config_value}
                    onChange={val => setFormData({ ...formData, config_value: val })}
                    height="400px"
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function ANScheduleManager() {
    const { addToast, showConfirm } = useAdmin();
    const [activeView, setActiveView] = useState('products'); // 'products' | 'config'
    const [products, setProducts] = useState([]);
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingConfig, setEditingConfig] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Load AN products and configs
    const loadData = React.useCallback(async () => {
        setLoading(true);
        try {
            // Get Advanced Nutrients brand
            const brand = await brandService.getBrandBySlug('advanced-nutrients');
            if (brand) {
                // Get products for this brand
                const { data: productsData } = await adminService.getAll('products', {
                    filters: [{ column: 'brand_id', value: brand.id }]
                });
                setProducts(productsData || []);
            }

            // Get AN schedule configs
            const { data: configsData } = await adminService.getAll('an_schedule_config');
            setConfigs(configsData || []);
        } catch (error) {
            console.error('Error loading AN schedule data:', error);
            addToast('Error loading data', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = !searchTerm || 
                product.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.name?.tr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || 
                product.specs?.category_key === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, categoryFilter]);

    const handleDeleteConfig = async (id) => {
        const confirmed = await showConfirm('Are you sure you want to delete this config?', 'Confirm Delete');
        if (confirmed) {
            try {
                await adminService.delete('an_schedule_config', id);
                addToast('Deleted successfully', 'success');
                loadData();
            } catch (error) {
                console.error('Error deleting config:', error);
                addToast('Error deleting', 'error');
            }
        }
    };

    const getCategoryLabel = (key) => {
        const labels = {
            base_nutrient: 'Base Nutrient',
            root_expanders: 'Root Expanders',
            bigger_buds: 'Bigger Buds',
            bud_potency: 'Bud Potency',
            grow_medium: 'Grow Medium',
            taste_terpene: 'Taste & Terpene'
        };
        return labels[key] || key || '-';
    };

    const hasScheduleData = (product) => {
        const specs = product.specs || {};
        return !!(specs.schedule_hydro_master || specs.schedule_coco_master || specs.schedule_default);
    };

    return (
        <div>
            {/* Header */}
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                        <Beaker size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Advanced Nutrients Schedule
                    </h2>
                    <p style={{ color: '#94a3b8', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                        Manage AN product feeding schedules and configuration
                    </p>
                </div>
            </div>

            {/* View Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setActiveView('products')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: activeView === 'products' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    <Package size={18} />
                    Product Schedules
                </button>
                <button
                    onClick={() => setActiveView('config')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: activeView === 'config' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    <Settings size={18} />
                    Configuration
                </button>
            </div>

            {/* Editor Overlays */}
            {editingProduct && (
                <ScheduleEditor
                    product={editingProduct}
                    onSave={loadData}
                    onClose={() => setEditingProduct(null)}
                />
            )}

            {editingConfig && (
                <ConfigEditor
                    config={editingConfig === 'new' ? null : editingConfig}
                    onSave={loadData}
                    onClose={() => setEditingConfig(null)}
                />
            )}

            {/* Products View */}
            {activeView === 'products' && (
                <>
                    <TableFilter
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search products..."
                        filters={[
                            {
                                key: 'category',
                                label: 'Category',
                                value: categoryFilter,
                                options: [
                                    { value: 'base_nutrient', label: 'Base Nutrient' },
                                    { value: 'root_expanders', label: 'Root Expanders' },
                                    { value: 'bigger_buds', label: 'Bigger Buds' },
                                    { value: 'bud_potency', label: 'Bud Potency' },
                                    { value: 'grow_medium', label: 'Grow Medium' },
                                    { value: 'taste_terpene', label: 'Taste & Terpene' }
                                ]
                            }
                        ]}
                        onFilterChange={(key, value) => {
                            if (key === 'category') setCategoryFilter(value);
                        }}
                        resultCount={filteredProducts.length}
                        totalCount={products.length}
                    />

                    <div className={styles.panel}>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>SKU</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Schedule Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                                    ) : filteredProducts.length === 0 ? (
                                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No products found</td></tr>
                                    ) : filteredProducts.map(product => (
                                        <tr key={product.id}>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{product.sku}</td>
                                            <td style={{ fontWeight: 600 }}>{product.name?.en || product.name?.tr || '-'}</td>
                                            <td>{getCategoryLabel(product.specs?.category_key)}</td>
                                            <td>
                                                <span className={`${styles.badge} ${hasScheduleData(product) ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                    {hasScheduleData(product) ? '✓ Has Schedule' : '○ No Schedule'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => setEditingProduct(product)}
                                                    className={styles.actionBtn}
                                                    style={{ flexDirection: 'row', padding: '0.5rem 1rem', height: 'auto', fontSize: '0.85rem' }}
                                                >
                                                    <Calendar size={14} />
                                                    Edit Schedule
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Config View */}
            {activeView === 'config' && (
                <>
                    <div style={{ marginBottom: '1rem' }}>
                        <button
                            onClick={() => setEditingConfig('new')}
                            className={styles.actionBtn}
                            style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                        >
                            <Plus size={20} /> Add Config
                        </button>
                    </div>

                    <div className={styles.panel}>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Config Key</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                                    ) : configs.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No configs found. Run the migration script first.</td></tr>
                                    ) : configs.map(config => (
                                        <tr key={config.id}>
                                            <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{config.config_key}</td>
                                            <td style={{ color: '#94a3b8' }}>{config.description || '-'}</td>
                                            <td>
                                                <span className={`${styles.badge} ${config.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                    {config.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => setEditingConfig(config)}
                                                        className={styles.iconBtn}
                                                        style={{ width: '2rem', height: '2rem' }}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteConfig(config.id)}
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
                </>
            )}
        </div>
    );
}
