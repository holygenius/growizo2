import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw } from 'lucide-react';
import styles from '../Admin.module.css';
import JsonEditor from '../components/JsonEditor';
import { useAdmin } from '../../../context/AdminContext';

const ScheduleForm = ({ initialData, brands, onClose, onSuccess }) => {
    const { t } = useAdmin();
    const [formData, setFormData] = useState({
        brand_id: '',
        name: { en: '', tr: '' },
        substrate_type: 'soil',
        schedule_data: {},
        phases: { veg: [], flower: [] },
        notes: { en: '', tr: '' },
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
                await adminService.update('feeding_schedules', initialData.id, formData);
            } else {
                await adminService.create('feeding_schedules', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Error saving schedule');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? t('edit') : t('add')} {t('feedingSchedules')}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('brand')}</label>
                    <select
                        value={formData.brand_id || ''}
                        onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    >
                        <option value="">{t('selectBrand')}</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('substrateType')}</label>
                    <select
                        value={formData.substrate_type}
                        onChange={e => setFormData({ ...formData, substrate_type: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="soil">{t('soil')}</option>
                        <option value="coco">{t('coco')}</option>
                        <option value="hydro">{t('hydro')}</option>
                        <option value="all-mix">{t('allMix')}</option>
                        <option value="light-mix">{t('lightMix')}</option>
                    </select>
                </div>

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

                <JsonEditor
                    label={t('scheduleData')}
                    value={formData.schedule_data}
                    onChange={val => setFormData({ ...formData, schedule_data: val })}
                    height="300px"
                    helpText='Format: { "week_1": { "product_sku": "2ml/L" }, ... }'
                />

                <JsonEditor
                    label={t('phases')}
                    value={formData.phases}
                    onChange={val => setFormData({ ...formData, phases: val })}
                    height="150px"
                    helpText='Format: { "veg": [1,2], "flower": [3,4,5,6] }'
                />

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
        </div>
    );
};

export default function FeedingSchedulesManager() {
    const { t, showConfirm, addToast } = useAdmin();
    const [schedules, setSchedules] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [schedData, brandData] = await Promise.all([
                adminService.getAll('feeding_schedules'),
                adminService.getAll('brands')
            ]);
            setSchedules(schedData.data);
            setBrands(brandData.data);
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
        const confirmed = await showConfirm(
            t('confirmDeleteSchedule'),
            t('confirmDelete')
        );
        if (confirmed) {
            try {
                await adminService.delete('feeding_schedules', id);
                addToast(t('deletedSuccessfully'), 'success');
                loadData();
            } catch (error) {
                console.error('Error deleting schedule:', error);
                addToast(t('errorDeleting'), 'error');
            }
        }
    };

    const getBrandName = (id) => {
        const b = brands.find(x => x.id === id);
        return b ? b.name : '-';
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('feedingSchedules')}</h2>
                <button
                    onClick={() => { setSelectedSchedule(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> {t('add')}
                </button>
            </div>

            {isEditing && (
                <ScheduleForm
                    initialData={selectedSchedule}
                    brands={brands}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('name')}</th>
                                <th>{t('brand')}</th>
                                <th>{t('substrateType')}</th>
                                <th>{t('status')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
                            ) : schedules.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('noSchedulesFound')}</td></tr>
                            ) : schedules.map(schedule => (
                                <tr key={schedule.id}>
                                    <td style={{ fontWeight: 600 }}>{schedule.name?.en || 'No Name'}</td>
                                    <td>{getBrandName(schedule.brand_id)}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{schedule.substrate_type}</td>
                                    <td>
                                        <span className={`${styles.badge} ${schedule.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {schedule.is_active ? t('active') : t('hidden')}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => { setSelectedSchedule(schedule); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(schedule.id)}
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
