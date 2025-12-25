
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useSettings } from '../../context/SettingsContext';
import { ArrowLeft, Check, Copy, ShoppingCart, Tag, Share2, Info } from 'lucide-react';
import styles from './Products.module.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language, t, formatPrice, getLocalizedPath } = useSettings();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    // Fetch Product
    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const data = await productService.getProductBySku(id);
                if (data) {
                    setProduct(data);
                } else {
                    console.warn('Product not found');
                }
            } catch (error) {
                console.error('Error loading product details:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={styles.spinner} style={{ width: '4rem', height: '4rem' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
                    </svg>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Product Not Found</h2>
                <Link to={getLocalizedPath('/products')} className={styles.addToCartBtn} style={{ maxWidth: '200px' }}>
                    Back to Products
                </Link>
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : [{ url: product.icon || '/images/placeholder-product.png', alt: product.name[language] }];
    const productName = product.name[language] || product.name.en;
    const description = product.description[language] || product.description.en || '';
    const specs = product.specs || {};

    return (
        <div className={styles.container}>
            {/* Breadcrumb / Back */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#94a3b8',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    fontSize: '1rem'
                }}
            >
                <ArrowLeft size={20} />
                Back
            </button>

            {/* Main Content Grid */}
            <div className={styles.detailLayout}>

                {/* Image Gallery */}
                <div className={styles.gallery}>
                    <div className={styles.mainImageFrame}>
                        <img
                            src={images[activeImage].url}
                            alt={images[activeImage].alt || productName}
                        />
                        {product.discount > 0 && (
                            <div className={`${styles.badge} ${styles.badgeDiscount}`} style={{ top: '1rem', left: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                -{product.discount}% OFF
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className={styles.thumbs}>
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`${styles.thumbBtn} ${activeImage === idx ? styles.active : ''}`}
                                >
                                    <img src={img.url} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className={styles.detailInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        {product.brand_id && (
                            <span className={styles.brand} style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.1)' }}>
                                Featured Brand
                            </span>
                        )}
                        <span style={{ color: '#64748b', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Tag size={14} /> SKU: {product.sku}
                        </span>
                    </div>

                    <h1>{productName}</h1>

                    <div className={styles.detailPrice}>
                        {formatPrice(product.price)}
                    </div>

                    {/* Short Desc */}
                    <div
                        style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}
                        dangerouslySetInnerHTML={{ __html: product.summary_description?.[language] || product.summary_description?.en }}
                    />

                    {/* Actions */}
                    <div className={styles.actionRow}>
                        <button className={styles.addToCartBtn}>
                            <ShoppingCart size={20} />
                            {t('addToCart') || 'Add to Cart'}
                        </button>
                        <button style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', width: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Share2 size={20} />
                        </button>
                    </div>

                    {/* Specs Preview */}
                    <div className={styles.specGrid}>
                        {Object.entries(specs).slice(0, 6).map(([key, value]) => (
                            <div key={key} className={styles.specItem}>
                                <span className={styles.specLabel}>{key.replace(/_/g, ' ')}</span>
                                <span className={styles.specValue}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Info Tabs/Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                {/* Description */}
                <div>
                    <div className={styles.filterPanel}>
                        <h3 className={styles.filterHeader} style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                            <Info color="#10b981" />
                            {t('productDescription') || 'Product Description'}
                        </h3>
                        <div
                            style={{ color: '#cbd5e1', lineHeight: '1.8' }}
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                </div>

                {/* Full Specs */}
                <div>
                    <div className={styles.filterPanel}>
                        <h3 className={styles.filterHeader} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                            {t('specifications') || 'Specifications'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {Object.entries(specs).map(([key, value]) => (
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                    <span style={{ color: '#94a3b8', textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                                    <span style={{ color: 'white', fontWeight: '500' }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
