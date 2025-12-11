import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw } from 'lucide-react';
import styles from '../Admin.module.css';
import JsonEditor from '../components/JsonEditor';
import ImageUploader from '../components/ImageUploader';

const PresetForm = ({ initialData, onClose, onSuccess }) => {
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
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Preset Set' : 'New Preset Set'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
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
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Tier</label>
                    <select
                        value={formData.tier}
                        onChange={e => setFormData({ ...formData, tier: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="entry">Entry Level</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Total Price (Override)</label>
                    <input
                        type="number"
                        value={formData.total_price}
                        onChange={e => setFormData({ ...formData, total_price: parseInt(e.target.value) })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <ImageUploader
                    label="Main Image"
                    value={formData.image_url}
                    onChange={url => setFormData({ ...formData, image_url: url })}
                />

                <JsonEditor
                    label="Tent Size Configuration"
                    value={formData.tent_size}
                    onChange={val => setFormData({ ...formData, tent_size: val })}
                    height="120px"
                    helpText='Format: { "width": 120, "depth": 120, "height": 200, "unit": "cm" }'
                />

                <JsonEditor
                    label="Included Products List"
                    value={formData.products}
                    onChange={val => setFormData({ ...formData, products: val })}
                    height="200px"
                    helpText='Format: [{ "sku": "ABC", "quantity": 1 }, ...]'
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
                        Save Set
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function PresetSetsManager() {
    const [presets, setPresets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(null);

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
        if (window.confirm('Are you sure you want to delete this preset set?')) {
            try {
                await adminService.delete('preset_sets', id);
                loadData();
            } catch (error) {
                console.error('Error deleting preset:', error);
            }
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Preset Sets</h2>
                <button
                    onClick={() => { setSelectedPreset(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> Add Set
                </button>
            </div>

            {isEditing && (
                <PresetForm
                    initialData={selectedPreset}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Tier</th>
                                <th>Dimensions</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : presets.length === 0 ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No presets found</td></tr>
                            ) : presets.map(preset => (
                                <tr key={preset.id}>
                                    <td style={{ fontWeight: 600 }}>{preset.name?.en || 'No Name'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{preset.tier}</td>
                                    <td>{preset.tent_size ? `${preset.tent_size.width}x${preset.tent_size.depth}cm` : '-'}</td>
                                    <td>₺{preset.total_price}</td>
                                    <td>
                                        <span className={`${styles.badge} ${preset.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {preset.is_active ? 'Active' : 'Hidden'}
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
