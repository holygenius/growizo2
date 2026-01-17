import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Link } from 'lucide-react';
import styles from '../Admin.module.css';

/**
 * FeedingScheduleItemsManager - Manages feeding_schedule_items
 * Links products to feeding schedules with week numbers and dose amounts
 * 
 * Updated: Uses new schema with feeding_schedule_items table
 */

const ItemForm = ({ initialData, schedules, products, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        feeding_schedule_id: '',
        product_id: '',
        week_number: 1,
        dose_amount: '',
        dose_unit: 'ml/L',
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                feeding_schedule_id: initialData.feeding_schedule_id || '',
                product_id: initialData.product_id || '',
                week_number: initialData.week_number || 1,
                dose_amount: initialData.dose_amount || '',
                dose_unit: initialData.dose_unit || 'ml/L',
                notes: initialData.notes || ''
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSave = {
                ...formData,
                dose_amount: parseFloat(formData.dose_amount) || 0
            };
            
            if (initialData?.id) {
                await adminService.update('feeding_schedule_items', initialData.id, dataToSave);
            } else {
                await adminService.create('feeding_schedule_items', dataToSave);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving schedule item:', error);
            alert('Error saving schedule item: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Schedule Item' : 'New Schedule Item'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Feeding Schedule *</label>
                    <select
                        value={formData.feeding_schedule_id}
                        onChange={e => setFormData({ ...formData, feeding_schedule_id: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    >
                        <option value="">Select Schedule...</option>
                        {schedules.map(s => (
                            <option key={s.id} value={s.id}>{s.name?.en || s.name} ({s.brands?.name || 'No Brand'})</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Product *</label>
                    <select
                        value={formData.product_id}
                        onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    >
                        <option value="">Select Product...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name?.en || p.name?.tr || p.name} ({p.sku || 'No SKU'})</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Week Number *</label>
                    <input
                        type="number"
                        min="1"
                        max="52"
                        value={formData.week_number}
                        onChange={e => setFormData({ ...formData, week_number: parseInt(e.target.value) || 1 })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Dose Amount</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.dose_amount}
                        onChange={e => setFormData({ ...formData, dose_amount: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Dose Unit</label>
                    <select
                        value={formData.dose_unit}
                        onChange={e => setFormData({ ...formData, dose_unit: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="ml/L">ml/L</option>
                        <option value="g/L">g/L</option>
                        <option value="ml/10L">ml/10L</option>
                        <option value="drops/L">drops/L</option>
                    </select>
                </div>

                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Notes</label>
                    <textarea
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem', resize: 'vertical' }}
                    />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Item
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function FeedingScheduleProductsManager() {
    const [items, setItems] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterSchedule, setFilterSchedule] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            // Load schedule items with related data
            const { data: itemsData } = await adminService.getAll('feeding_schedule_items', { 
                orderBy: { column: 'week_number', ascending: true },
                select: `
                    *,
                    feeding_schedules:feeding_schedule_id (id, name, brands:brand_id (id, name)),
                    products:product_id (id, name, sku, icon)
                `
            });
            
            // Load schedules for dropdown (with brand info)
            const { data: schedulesData } = await adminService.getAll('feeding_schedules', { 
                orderBy: { column: 'created_at', ascending: false },
                select: `*, brands:brand_id (id, name)`
            });
            
            // Load products for dropdown
            const { data: productsData } = await adminService.getAll('products', { 
                orderBy: { column: 'sku', ascending: true } 
            });

            setItems(itemsData || []);
            setSchedules(schedulesData || []);
            setProducts(productsData || []);
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
        if (window.confirm('Are you sure you want to delete this schedule item?')) {
            try {
                await adminService.delete('feeding_schedule_items', id);
                loadData();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    // Filter items by schedule
    const filteredItems = filterSchedule 
        ? items.filter(item => item.feeding_schedule_id === filterSchedule)
        : items;

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                    <Link size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Schedule Items
                </h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={filterSchedule}
                        onChange={e => setFilterSchedule(e.target.value)}
                        style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="">All Schedules</option>
                        {schedules.map(s => (
                            <option key={s.id} value={s.id}>{s.name?.en || s.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => { setSelectedItem(null); setIsEditing(true); }}
                        className={styles.actionBtn}
                        style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                    >
                        <Plus size={20} /> Add Item
                    </button>
                </div>
            </div>

            {isEditing && (
                <ItemForm
                    initialData={selectedItem}
                    schedules={schedules}
                    products={products}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Schedule</th>
                                <th>Week</th>
                                <th>Dose</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No schedule items found</td></tr>
                            ) : filteredItems.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {item.products?.icon && (
                                                <img
                                                    src={item.products.icon}
                                                    alt=""
                                                    style={{ width: '32px', height: '32px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}
                                                />
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{item.products?.name?.en || item.products?.name || 'Unknown'}</div>
                                                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.products?.sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{item.feeding_schedules?.name?.en || item.feeding_schedules?.name || 'Unknown'}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.feeding_schedules?.brands?.name || ''}</div>
                                    </td>
                                    <td>
                                        <span className={styles.badge} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                                            Week {item.week_number}
                                        </span>
                                    </td>
                                    <td>
                                        {item.dose_amount ? `${item.dose_amount} ${item.dose_unit || 'ml/L'}` : '-'}
                                    </td>
                                    <td style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.notes || '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => { setSelectedItem(item); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
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
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                <strong>Tip:</strong> Schedule items link products to feeding schedules with specific week numbers and dosages.
                Use the filter to view items for a specific schedule.
            </div>
        </div>
    );
}
