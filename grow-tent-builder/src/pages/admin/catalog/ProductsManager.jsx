import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Search } from 'lucide-react';
import styles from '../Admin.module.css';
import ImageUploader from '../components/ImageUploader';
import TableFilter from '../components/TableFilter';
import KeyValueEditor from '../components/KeyValueEditor';
import LocalizedContentEditor from '../components/LocalizedContentEditor';
import { useAdmin } from '../../../context/AdminContext';
import { YesilGrowApiService } from '../../../services/ikasService';

// Suggested keys for product specs based on product type
const SPEC_SUGGESTIONS = {
    general: ['weight', 'dimensions', 'material', 'warranty', 'color'],
    tent: ['width', 'length', 'height', 'material', 'weight', 'waterproof', 'reflective_material'],
    light: ['watts', 'ppfd', 'coverage', 'spectrum', 'efficiency', 'lifespan', 'dimming', 'voltage'],
    fan: ['cfm', 'noise_level', 'speed_settings', 'diameter', 'power', 'voltage'],
    nutrient: ['npk_ratio', 'volume', 'ph_stable', 'organic', 'suitable_for'],
    substrate: ['volume', 'ph_range', 'composition', 'drainage', 'water_retention']
};

const ProductForm = ({ initialData, brands, categories, onClose, onSuccess }) => {
    const { t } = useAdmin();
    const [formData, setFormData] = useState({
        sku: '',
        brand_id: '',
        category_id: '',
        name: { en: '', tr: '' },
        description: { en: '', tr: '' },
        summary_description: { en: '', tr: '' },
        price: 0,
        product_type: 'general',
        specs: {},
        images: [], // Birden fazla görsel desteği
        is_active: true,
        is_featured: false
    });
    const [loading, setLoading] = useState(false);
    const [ikasProducts, setIkasProducts] = useState([]);
    const [showIkasSelector, setShowIkasSelector] = useState(false);
    const [ikasLoading, setIkasLoading] = useState(false);
    const [ikasSearch, setIkasSearch] = useState('');
    const [selectedIkasProduct, setSelectedIkasProduct] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const fetchIkasProducts = async () => {
        setIkasLoading(true);
        try {
            const yesilgrow = new YesilGrowApiService();
            const products = await yesilgrow.getProductsWithVendorInfo();
            setIkasProducts(products);
            console.log(`✅ Fetched ${products.length} products from IKAS`);
        } catch (error) {
            console.error('❌ Error fetching IKAS products:', error);
            alert('Error fetching IKAS products: ' + error.message);
        } finally {
            setIkasLoading(false);
        }
    };

    const filteredIkasProducts = useMemo(() => {
        if (!ikasSearch) return ikasProducts;
        return ikasProducts.filter(p =>
            p.name.toLowerCase().includes(ikasSearch.toLowerCase()) ||
            p.sku.toLowerCase().includes(ikasSearch.toLowerCase()) ||
            p.barcode.toLowerCase().includes(ikasSearch.toLowerCase())
        );
    }, [ikasProducts, ikasSearch]);

    const handleSelectIkasProduct = (product) => {
        setSelectedIkasProduct(product);
        
        // Görselleri diziye dönüştür (birden fazla görsel desteği)
        const images = product.images && product.images.length > 0 
            ? product.images.map(img => ({
                url: img.url,
                alt: img.altText || product.name
              }))
            : [];
        
        setFormData({
            ...formData,
            sku: product.sku || formData.sku,
            price: product.price || formData.price,
            name: {
                ...formData.name,
                en: product.name || formData.name.en,
                tr: product.name || formData.name.tr
            },
            description: {
                en: product.description || formData.description.en,
                tr: formData.description.tr
            },
            summary_description: {
                en: product.shortDescription || formData.summary_description.en,
                tr: formData.summary_description.tr
            },
            images: images, // Birden fazla görsel
            icon: images.length > 0 ? images[0].url : formData.icon, // İlk görsel icon olarak
            specs: {
                ...formData.specs,
                barcode: product.barcode,
                vendor_id: product.vendorProductId,
                vendor_sku: product.sku
            }
        });
        setShowIkasSelector(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await adminService.update('products', initialData.id, formData);
            } else {
                await adminService.create('products', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const currentSuggestions = SPEC_SUGGESTIONS[formData.product_type] || SPEC_SUGGESTIONS.general;

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Product' : 'New Product'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            {/* IKAS Selector Modal */}
            {showIkasSelector && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        padding: '2rem',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        width: '90%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ color: '#fff', margin: 0 }}>🛍️ Select Product from YesilGrow</h3>
                            <button onClick={() => setShowIkasSelector(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        {ikasProducts.length === 0 ? (
                            <button
                                type="button"
                                onClick={fetchIkasProducts}
                                disabled={ikasLoading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#3b82f6',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {ikasLoading ? <RefreshCw className="animate-spin" size={20} /> : <Plus size={20} />}
                                {ikasLoading ? 'Loading Products...' : 'Fetch YesilGrow Products'}
                            </button>
                        ) : (
                            <>
                                <div style={{ marginBottom: '1rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Search by name, SKU or barcode..."
                                        value={ikasSearch}
                                        onChange={e => setIkasSearch(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            borderRadius: '0.5rem',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '500px', overflow: 'auto' }}>
                                    {filteredIkasProducts.length === 0 ? (
                                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No products found</p>
                                    ) : (
                                        filteredIkasProducts.map((product, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => handleSelectIkasProduct(product)}
                                                style={{
                                                    padding: '1rem',
                                                    background: selectedIkasProduct?.vendorProductId === product.vendorProductId ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                                    border: selectedIkasProduct?.vendorProductId === product.vendorProductId ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                                onMouseLeave={e => e.currentTarget.style.background = selectedIkasProduct?.vendorProductId === product.vendorProductId ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)'}
                                            >
                                                {/* Görsel Preview */}
                                                {product.images && product.images.length > 0 && (
                                                    <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        {product.images.slice(0, 3).map((img, imgIdx) => (
                                                            <div key={imgIdx} style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                borderRadius: '0.375rem',
                                                                overflow: 'hidden',
                                                                background: '#0f172a',
                                                                border: '1px solid rgba(255,255,255,0.1)'
                                                            }}>
                                                                <img 
                                                                    src={img.url} 
                                                                    alt={img.altText}
                                                                    style={{ 
                                                                        width: '100%', 
                                                                        height: '100%', 
                                                                        objectFit: 'cover' 
                                                                    }}
                                                                    onError={(e) => {
                                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Crect fill="%23475569" width="50" height="50"/%3E%3Ctext x="50%25" y="50%25" fill="%2394a3b8" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                        {product.images.length > 3 && (
                                                            <div style={{
                                                                width: '50px',
                                                                height: '50px',
                                                                borderRadius: '0.375rem',
                                                                background: '#0f172a',
                                                                border: '1px solid rgba(255,255,255,0.1)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#94a3b8',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600
                                                            }}>
                                                                +{product.images.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div style={{ color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>{product.name}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '0.875rem', display: 'grid', gap: '0.25rem' }}>
                                                    <div>SKU: {product.sku}</div>
                                                    <div>Barcode: {product.barcode}</div>
                                                    <div>📸 Images: {product.images?.length || 0}</div>
                                                    <div style={{ color: '#10b981' }}>
                                                        💰 Price: {product.price}₺ | Stock: {product.stock}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* IKAS Selector Button */}
                {!initialData && (
                    <button
                        type="button"
                        onClick={() => {
                            setShowIkasSelector(true);
                            if (ikasProducts.length === 0) {
                                fetchIkasProducts();
                            }
                        }}
                        style={{
                            gridColumn: '1 / -1',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Plus size={20} /> 🛍️ Get Product from YesilGrow IKAS
                    </button>
                )}

                {selectedIkasProduct && (
                    <div style={{
                        gridColumn: '1 / -1',
                        padding: '1rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                        borderRadius: '0.5rem',
                        color: '#10b981',
                        fontSize: '0.875rem'
                    }}>
                        ✅ Selected from IKAS: <strong>{selectedIkasProduct.name}</strong>
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>SKU (Unique)</label>
                    <input
                        type="text"
                        value={formData.sku}
                        onChange={e => setFormData({ ...formData, sku: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <ImageUploader
                    label="Product Icon"
                    value={formData.icon}
                    onChange={url => setFormData({ ...formData, icon: url })}
                    bucket="product-images"
                    helpText="Upload product icon/thumbnail image"
                />

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Product Type</label>
                    <select
                        value={formData.product_type}
                        onChange={e => setFormData({ ...formData, product_type: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="general">General</option>
                        <option value="tent">Tent</option>
                        <option value="light">Light</option>
                        <option value="fan">Fan</option>
                        <option value="nutrient">Nutrient</option>
                        <option value="substrate">Substrate</option>
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Brand</label>
                    <select
                        value={formData.brand_id || ''}
                        onChange={e => setFormData({ ...formData, brand_id: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="">Select Brand...</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Category</label>
                    <select
                        value={formData.category_id || ''}
                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="">Select Category...</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name.en || c.key}</option>)}
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

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Price (TRY)</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                {/* Summary Description - Rich Text */}
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <LocalizedContentEditor
                        label="📝 Summary Description (Short)"
                        value={formData.summary_description || { en: '', tr: '' }}
                        onChange={summary_description => setFormData({ ...formData, summary_description })}
                        minHeight="150px"
                        placeholder={{ en: 'Write a brief product description...', tr: 'Kısa ürün açıklaması yazın...' }}
                        helpText="Used for product cards and listings (supports HTML formatting)"
                    />
                </div>

                {/* Full Description - Rich Text */}
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <LocalizedContentEditor
                        label="📖 Full Description (Detailed)"
                        value={formData.description || { en: '', tr: '' }}
                        onChange={description => setFormData({ ...formData, description })}
                        minHeight="300px"
                        placeholder={{ en: 'Write detailed product description with specifications...', tr: 'Ürün detaylarını açıklayın...' }}
                        helpText="Detailed description for product detail page (supports HTML formatting)"
                    />
                </div>

                {/* Specs Key-Value Editor */}
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <KeyValueEditor
                        key={initialData?.id || 'new'}
                        label="Product Specifications"
                        value={formData.specs || {}}
                        onChange={specs => setFormData({ ...formData, specs })}
                        keyPlaceholder="Spec name (e.g., watts)"
                        valuePlaceholder="Value (e.g., 600W)"
                        suggestedKeys={currentSuggestions}
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
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                            style={{ width: '1.25rem', height: '1.25rem' }}
                        />
                        Featured
                    </label>
                </div>

                {/* Birden fazla görsel yönetimi */}
                <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '1rem' }}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.75rem', fontWeight: 600 }}>
                        📸 Product Images ({formData.images?.length || 0})
                    </label>
                    
                    {/* Görsel listesi */}
                    {formData.images && formData.images.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                            {formData.images.map((img, idx) => (
                                <div key={idx} style={{
                                    position: 'relative',
                                    borderRadius: '0.375rem',
                                    overflow: 'hidden',
                                    background: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    aspectRatio: '1'
                                }}>
                                    <img 
                                        src={img.url} 
                                        alt={img.alt}
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover' 
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23475569" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" fill="%2394a3b8" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({
                                            ...formData,
                                            images: formData.images.filter((_, i) => i !== idx)
                                        })}
                                        style={{
                                            position: 'absolute',
                                            top: '0.25rem',
                                            right: '0.25rem',
                                            background: '#dc2626',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px'
                                        }}
                                        title="Görsel sil"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Görsel ekleme */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Görsel URL'sini yapıştır..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.target.value.trim()) {
                                    setFormData({
                                        ...formData,
                                        images: [...(formData.images || []), { url: e.target.value.trim(), alt: formData.name?.en || 'Product' }]
                                    });
                                    e.target.value = '';
                                }
                            }}
                            style={{ 
                                flex: 1, 
                                minWidth: '200px',
                                padding: '0.75rem', 
                                background: 'rgba(255,255,255,0.05)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                color: '#fff', 
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                const url = prompt('Görsel URL\'sini gir:');
                                if (url && url.trim()) {
                                    setFormData({
                                        ...formData,
                                        images: [...(formData.images || []), { url: url.trim(), alt: formData.name?.en || 'Product' }]
                                    });
                                }
                            }}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            + URL ile Ekle
                        </button>
                        
                        {/* File Upload Button */}
                        <input
                            type="file"
                            accept="image/*"
                            id="product-image-upload"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                try {
                                    const url = await adminService.uploadImage(file, 'product-images');
                                    setFormData({
                                        ...formData,
                                        images: [...(formData.images || []), { url, alt: formData.name?.en || 'Product' }]
                                    });
                                    e.target.value = '';
                                } catch (error) {
                                    alert('Upload failed: ' + error.message);
                                }
                            }}
                            style={{ display: 'none' }}
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById('product-image-upload').click()}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: '#10b981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <span>📤 Upload</span>
                        </button>
                    </div>
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

export default function ProductsManager() {
    const { t, showConfirm, addToast } = useAdmin();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = !searchTerm ||
                p.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBrand = brandFilter === 'all' || p.brand_id === brandFilter;
            const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
            const matchesType = typeFilter === 'all' || p.product_type === typeFilter;
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' && p.is_active) ||
                (statusFilter === 'inactive' && !p.is_active);
            return matchesSearch && matchesBrand && matchesCategory && matchesType && matchesStatus;
        });
    }, [products, searchTerm, brandFilter, categoryFilter, typeFilter, statusFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [prodData, brandData, catData] = await Promise.all([
                adminService.getAll('products', { limit: 50 }),
                adminService.getAll('brands'),
                adminService.getAll('categories')
            ]);
            setProducts(prodData.data);
            setBrands(brandData.data);
            setCategories(catData.data);
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
        const confirmed = await showConfirm(t('confirmDeleteProduct'));
        if (confirmed) {
            try {
                await adminService.delete('products', id);
                addToast(t('deletedSuccessfully'), 'success');
                loadData();
            } catch (error) {
                console.error('Error deleting product:', error);
                addToast(t('couldNotDelete'), 'error');
            }
        }
    };

    const getBrandName = (id) => {
        const b = brands.find(x => x.id === id);
        return b ? b.name : '-';
    };

    const getCategoryName = (id) => {
        const c = categories.find(x => x.id === id);
        return c ? (c.name?.en || c.key) : '-';
    };

    const productTypeOptions = [
        { value: 'general', label: 'General' },
        { value: 'tent', label: 'Tent' },
        { value: 'light', label: 'Light' },
        { value: 'fan', label: 'Fan' },
        { value: 'nutrient', label: 'Nutrient' },
        { value: 'substrate', label: 'Substrate' }
    ];

    const handleFilterChange = (key, value) => {
        switch (key) {
            case 'brand': setBrandFilter(value); break;
            case 'category': setCategoryFilter(value); break;
            case 'type': setTypeFilter(value); break;
            case 'status': setStatusFilter(value); break;
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('products')}</h2>
                <button
                    onClick={() => { setSelectedProduct(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> {t('addProduct')}
                </button>
            </div>

            <TableFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('filter') + ' ' + t('products').toLowerCase() + '...'}
                filters={[
                    {
                        key: 'brand',
                        label: t('brand'),
                        value: brandFilter,
                        options: [
                            { value: 'all', label: t('allBrands') || 'All Brands' },
                            ...brands.map(b => ({ value: b.id, label: b.name }))
                        ]
                    },
                    {
                        key: 'category',
                        label: t('category'),
                        value: categoryFilter,
                        options: [
                            { value: 'all', label: t('allCategories') || 'All Categories' },
                            ...categories.map(c => ({ value: c.id, label: c.name?.en || c.key }))
                        ]
                    },
                    {
                        key: 'type',
                        label: t('productType') || 'Product Type',
                        value: typeFilter,
                        options: [
                            { value: 'all', label: t('allTypes') || 'All Types' },
                            ...productTypeOptions
                        ]
                    },
                    {
                        key: 'status',
                        label: t('status'),
                        value: statusFilter,
                        options: [
                            { value: 'all', label: t('allStatus') || 'All Status' },
                            { value: 'active', label: t('active') || 'Active' },
                            { value: 'inactive', label: t('inactive') || 'Inactive' }
                        ]
                    }
                ]}
                onFilterChange={handleFilterChange}
                resultCount={filteredProducts.length}
                totalCount={products.length}
            />

            {isEditing && (
                <div className={styles.modalOverlay} onClick={() => setIsEditing(false)}>
                    <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {selectedProduct ? t('editProduct') : t('addProduct')}
                            </h2>
                            <button
                                className={styles.modalCloseBtn}
                                onClick={() => setIsEditing(false)}
                                title="Close"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <ProductForm
                                initialData={selectedProduct}
                                brands={brands}
                                categories={categories}
                                onClose={() => setIsEditing(false)}
                                onSuccess={loadData}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('sku')}</th>
                                <th>{t('name')}</th>
                                <th>{t('brand')}</th>
                                <th>{t('category')}</th>
                                <th>{t('price')}</th>
                                <th>{t('type')}</th>
                                <th>{t('status')}</th>
                                <th>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>{t('loading')}</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('noBuildsFound')}</td></tr>
                            ) : filteredProducts.map(product => (
                                <tr key={product.id}>
                                    <td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{product.sku}</td>
                                    <td style={{ fontWeight: 600 }}>{product.name?.en || 'No Name'}</td>
                                    <td>{getBrandName(product.brand_id)}</td>
                                    <td>{getCategoryName(product.category_id)}</td>
                                    <td>₺{product.price}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{product.product_type}</td>
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
