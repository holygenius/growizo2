import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Store, ExternalLink, Package } from 'lucide-react';
import styles from '../Admin.module.css';

/**
 * VendorsManager - Manages vendor entries
 * Vendors are suppliers/retailers that sell products
 */

const VendorForm = ({ initialData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        vendor_code: '',
        description: '',
        website_url: '',
        logo_url: '',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                vendor_code: initialData.vendor_code || '',
                description: initialData.description || '',
                website_url: initialData.website_url || '',
                logo_url: initialData.logo_url || '',
                is_active: initialData.is_active ?? true
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await adminService.update('vendors', initialData.id, formData);
            } else {
                await adminService.create('vendors', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving vendor:', error);
            alert('Error saving vendor: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Vendor' : 'New Vendor'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Vendor Name *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                        placeholder="e.g., Trendyol, Hepsiburada"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Vendor Code *</label>
                    <input
                        type="text"
                        value={formData.vendor_code}
                        onChange={e => setFormData({ ...formData, vendor_code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                        placeholder="e.g., TRENDYOL, HEPSIBURADA"
                    />
                    <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Unique identifier (uppercase letters, numbers, underscore only)</small>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Website URL</label>
                    <input
                        type="url"
                        value={formData.website_url}
                        onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        placeholder="https://www.example.com"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Logo URL</label>
                    <input
                        type="url"
                        value={formData.logo_url}
                        onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        placeholder="https://www.example.com/logo.png"
                    />
                </div>

                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Description</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem', resize: 'vertical' }}
                        placeholder="Brief description of this vendor..."
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
                        Active (visible on site)
                    </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Vendor
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function VendorsManager() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [productCounts, setProductCounts] = useState({});

    const loadData = async () => {
        setLoading(true);
        try {
            // Load vendors
            const { data: vendorsData } = await adminService.getAll('vendors', { 
                orderBy: { column: 'name', ascending: true } 
            });
            setVendors(vendorsData || []);

            // Get product counts per vendor
            const { data: countsData } = await adminService.getAll('vendor_products', {
                select: 'vendor_id'
            });
            
            const counts = {};
            (countsData || []).forEach(item => {
                counts[item.vendor_id] = (counts[item.vendor_id] || 0) + 1;
            });
            setProductCounts(counts);
        } catch (error) {
            console.error('Error loading vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        const count = productCounts[id] || 0;
        const confirmMsg = count > 0 
            ? `This vendor has ${count} linked products. Are you sure you want to delete it? This will also remove all product links.`
            : 'Are you sure you want to delete this vendor?';
            
        if (window.confirm(confirmMsg)) {
            try {
                await adminService.delete('vendors', id);
                loadData();
            } catch (error) {
                console.error('Error deleting vendor:', error);
                alert('Error deleting vendor: ' + error.message);
            }
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                    <Store size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Vendors
                </h2>
                <button
                    onClick={() => { setSelectedVendor(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> Add Vendor
                </button>
            </div>

            {isEditing && (
                <VendorForm
                    initialData={selectedVendor}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Products</th>
                                <th>Website</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : vendors.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No vendors found. Add your first vendor to get started.</td></tr>
                            ) : vendors.map(vendor => (
                                <tr key={vendor.id}>
                                    <td>
                                        {vendor.logo_url ? (
                                            <img
                                                src={vendor.logo_url}
                                                alt=""
                                                style={{ width: '40px', height: '40px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}
                                            />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Store size={20} style={{ color: '#64748b' }} />
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{vendor.name}</div>
                                        {vendor.description && (
                                            <div style={{ color: '#64748b', fontSize: '0.75rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {vendor.description}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                                            {vendor.vendor_code}
                                        </code>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Package size={16} style={{ color: '#64748b' }} />
                                            <span>{productCounts[vendor.id] || 0}</span>
                                        </div>
                                    </td>
                                    <td>
                                        {vendor.website_url ? (
                                            <a 
                                                href={vendor.website_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                                            >
                                                <ExternalLink size={14} />
                                                Visit
                                            </a>
                                        ) : (
                                            <span style={{ color: '#64748b' }}>-</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${vendor.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {vendor.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => { setSelectedVendor(vendor); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vendor.id)}
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
                <strong>Tip:</strong> Vendors are retailers or suppliers that sell your products. 
                After adding vendors, you can link products to them with specific prices using the Vendor Products page.
            </div>
        </div>
    );
}
