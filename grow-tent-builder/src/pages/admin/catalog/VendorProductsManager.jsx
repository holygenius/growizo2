import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Link2, ExternalLink, DollarSign, Package } from 'lucide-react';
import styles from '../Admin.module.css';

/**
 * VendorProductsManager - Manages vendor_products entries
 * Links products to vendors with price, URL, and stock information
 */

const VendorProductForm = ({ initialData, vendors, products, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        product_id: '',
        vendor_id: '',
        vendor_sku: '',
        vendor_product_name: '',
        barcode: '',
        price: '',
        currency: 'TRY',
        product_url: '',
        stock_quantity: 0,
        stock_status: 'in_stock',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                product_id: initialData.product_id || '',
                vendor_id: initialData.vendor_id || '',
                vendor_sku: initialData.vendor_sku || '',
                vendor_product_name: initialData.vendor_product_name || '',
                barcode: initialData.barcode || '',
                price: initialData.price || '',
                currency: initialData.currency || 'TRY',
                product_url: initialData.product_url || '',
                stock_quantity: initialData.stock_quantity || 0,
                stock_status: initialData.stock_status || 'in_stock',
                is_active: initialData.is_active ?? true
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSave = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                last_synced_at: new Date().toISOString()
            };

            if (initialData?.id) {
                await adminService.update('vendor_products', initialData.id, dataToSave);
            } else {
                await adminService.create('vendor_products', dataToSave);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving vendor product:', error);
            alert('Error saving vendor product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fill vendor product name when product is selected
    const handleProductChange = (productId) => {
        const product = products.find(p => p.id === productId);
        const productName = product?.name?.en || product?.name?.tr || product?.name || '';
        setFormData({ 
            ...formData, 
            product_id: productId,
            vendor_product_name: formData.vendor_product_name || productName
        });
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Vendor Product' : 'Link Product to Vendor'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Product *</label>
                    <select
                        value={formData.product_id}
                        onChange={e => handleProductChange(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                        disabled={!!initialData}
                    >
                        <option value="">Select Product...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name?.en || p.name?.tr || p.name} ({p.sku || 'No SKU'})</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Vendor *</label>
                    <select
                        value={formData.vendor_id}
                        onChange={e => setFormData({ ...formData, vendor_id: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                        disabled={!!initialData}
                    >
                        <option value="">Select Vendor...</option>
                        {vendors.map(v => (
                            <option key={v.id} value={v.id}>{v.name} ({v.vendor_code})</option>
                        ))}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Vendor SKU</label>
                    <input
                        type="text"
                        value={formData.vendor_sku}
                        onChange={e => setFormData({ ...formData, vendor_sku: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        placeholder="Vendor's product code"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Barcode</label>
                    <input
                        type="text"
                        value={formData.barcode}
                        onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        placeholder="Product barcode"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Product Name (at Vendor)</label>
                    <input
                        type="text"
                        value={formData.vendor_product_name}
                        onChange={e => setFormData({ ...formData, vendor_product_name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        placeholder="How vendor lists this product"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Product URL</label>
                    <input
                        type="url"
                        value={formData.product_url}
                        onChange={e => setFormData({ ...formData, product_url: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        placeholder="https://vendor.com/product/..."
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Price *</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                            required
                            placeholder="0.00"
                        />
                        <select
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                            style={{ width: '80px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        >
                            <option value="TRY">TRY</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Stock</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="number"
                            min="0"
                            value={formData.stock_quantity}
                            onChange={e => setFormData({ ...formData, stock_quantity: e.target.value })}
                            style={{ flex: 1, padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                            placeholder="0"
                        />
                        <select
                            value={formData.stock_status}
                            onChange={e => setFormData({ ...formData, stock_status: e.target.value })}
                            style={{ width: '140px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        >
                            <option value="in_stock">In Stock</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        Active (show this vendor option)
                    </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
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

export default function VendorProductsManager() {
    const [vendorProducts, setVendorProducts] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterVendor, setFilterVendor] = useState('');
    const [filterProduct, setFilterProduct] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            // Load vendor products with related data
            const { data: vpData } = await adminService.getAll('vendor_products', {
                orderBy: { column: 'created_at', ascending: false },
                select: `
                    *,
                    vendors (id, name, vendor_code, logo_url),
                    products (id, name, sku, image_url)
                `
            });

            // Load vendors for dropdown
            const { data: vendorsData } = await adminService.getAll('vendors', {
                orderBy: { column: 'name', ascending: true }
            });

            // Load products for dropdown
            const { data: productsData } = await adminService.getAll('products', {
                orderBy: { column: 'name', ascending: true }
            });

            setVendorProducts(vpData || []);
            setVendors(vendorsData || []);
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
        if (window.confirm('Are you sure you want to remove this product-vendor link?')) {
            try {
                await adminService.delete('vendor_products', id);
                loadData();
            } catch (error) {
                console.error('Error deleting vendor product:', error);
                alert('Error: ' + error.message);
            }
        }
    };

    // Filter
    const filteredItems = vendorProducts.filter(item => {
        if (filterVendor && item.vendor_id !== filterVendor) return false;
        if (filterProduct && item.product_id !== filterProduct) return false;
        return true;
    });

    const formatPrice = (price, currency) => {
        const symbols = { TRY: '₺', USD: '$', EUR: '€' };
        return `${symbols[currency] || ''}${parseFloat(price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    };

    const getStockBadge = (status) => {
        const styles_map = {
            'in_stock': { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981', text: 'In Stock' },
            'low_stock': { bg: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', text: 'Low Stock' },
            'out_of_stock': { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', text: 'Out of Stock' }
        };
        const s = styles_map[status] || styles_map['in_stock'];
        return (
            <span style={{ background: s.bg, color: s.color, padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                {s.text}
            </span>
        );
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                    <Link2 size={24} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Vendor Products
                </h2>
                <button
                    onClick={() => { setSelectedItem(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> Link Product
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <select
                    value={filterVendor}
                    onChange={e => setFilterVendor(e.target.value)}
                    style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem', minWidth: '180px' }}
                >
                    <option value="">All Vendors</option>
                    {vendors.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                </select>
                <select
                    value={filterProduct}
                    onChange={e => setFilterProduct(e.target.value)}
                    style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem', minWidth: '200px' }}
                >
                    <option value="">All Products</option>
                    {products.slice(0, 100).map(p => (
                        <option key={p.id} value={p.id}>{p.name?.en || p.name?.tr || p.name}</option>
                    ))}
                </select>
                {(filterVendor || filterProduct) && (
                    <button 
                        onClick={() => { setFilterVendor(''); setFilterProduct(''); }}
                        style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '0.5rem', cursor: 'pointer' }}
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {isEditing && (
                <VendorProductForm
                    initialData={selectedItem}
                    vendors={vendors}
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
                                <th>Vendor</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>URL</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    {vendorProducts.length === 0 
                                        ? 'No vendor products yet. Link a product to a vendor to show price comparisons.'
                                        : 'No items match the current filters.'}
                                </td></tr>
                            ) : filteredItems.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {item.products?.image_url ? (
                                                <img
                                                    src={item.products.image_url}
                                                    alt=""
                                                    style={{ width: '36px', height: '36px', objectFit: 'contain', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}
                                                />
                                            ) : (
                                                <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Package size={18} style={{ color: '#64748b' }} />
                                                </div>
                                            )}
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{item.products?.name?.en || item.products?.name?.tr || item.products?.name || 'Unknown'}</div>
                                                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.products?.sku || item.vendor_sku}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {item.vendors?.logo_url && (
                                                <img src={item.vendors.logo_url} alt="" style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
                                            )}
                                            <span>{item.vendors?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 600 }}>
                                            <DollarSign size={14} />
                                            {formatPrice(item.price, item.currency)}
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {getStockBadge(item.stock_status)}
                                            {item.stock_quantity > 0 && (
                                                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                                    ({item.stock_quantity})
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        {item.product_url ? (
                                            <a 
                                                href={item.product_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                                            >
                                                <ExternalLink size={14} />
                                                View
                                            </a>
                                        ) : (
                                            <span style={{ color: '#64748b' }}>-</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${item.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {item.is_active ? 'Active' : 'Hidden'}
                                        </span>
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
                <strong>Tip:</strong> Vendor products link your catalog products to specific vendors with prices.
                Users will see price comparisons from multiple vendors when viewing a product.
            </div>
        </div>
    );
}
