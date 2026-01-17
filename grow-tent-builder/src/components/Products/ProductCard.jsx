
import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { ArrowRight, ShoppingBag, Eye, Star, Store } from 'lucide-react';
import styles from './Products.module.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
    const { language, formatPrice, t, getLocalizedPath } = useSettings();

    // Fallback image
    const displayImage = product.images?.[0]?.url || product.icon || '/images/placeholder-product.png';
    const productName = product.name[language] || product.name.en;
    const brandName = product.brands?.name || 'Unknown Brand';

    // Price display helper - uses price_range if available, falls back to price
    const renderPrice = () => {
        const priceRange = product.price_range;
        
        if (priceRange && priceRange.min_price !== null) {
            if (priceRange.min_price === priceRange.max_price) {
                return <span className={styles.price}>{formatPrice(priceRange.min_price)}</span>;
            }
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                    <span className={styles.price}>{formatPrice(priceRange.min_price)}</span>
                    <span style={{ color: '#64748b' }}>-</span>
                    <span className={styles.price} style={{ fontSize: '0.9em' }}>{formatPrice(priceRange.max_price)}</span>
                </div>
            );
        }
        
        // Fallback to product.price if exists
        if (product.price) {
            return <span className={styles.price}>{formatPrice(product.price)}</span>;
        }
        
        return <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{language === 'tr' ? 'Fiyat yok' : 'No price'}</span>;
    };

    // Vendor count display
    const vendorCount = product.price_range?.vendor_count || 0;

    // Compact view for smaller cards
    if (viewMode === 'compact') {
        return (
            <Link to={getLocalizedPath(`/products/${product.sku}`)} className={styles.cardCompact}>
                <div className={styles.cardCompactImage}>
                    <img
                        src={displayImage}
                        alt={productName}
                        onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%231e293b" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" fill="%23475569" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                    />
                </div>
                <div className={styles.cardCompactInfo}>
                    <span className={styles.cardCompactBrand}>{brandName}</span>
                    <h4 className={styles.cardCompactTitle}>{productName}</h4>
                    <div className={styles.cardCompactPrice}>{renderPrice()}</div>
                </div>
            </Link>
        );
    }

    return (
        <article className={styles.card}>
            {/* Badges */}
            <div className={styles.badgeContainer}>
                {product.is_featured && (
                    <span className={`${styles.badge} ${styles.badgeFeatured}`}>
                        <Star size={10} /> {t('featured') || 'Featured'}
                    </span>
                )}
                {product.discount > 0 && (
                    <span className={`${styles.badge} ${styles.badgeDiscount}`}>
                        -{product.discount}%
                    </span>
                )}
                {vendorCount > 0 && (
                    <span className={`${styles.badge}`} style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                        <Store size={10} /> {vendorCount} {language === 'tr' ? 'satıcı' : 'vendor'}{vendorCount > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Image Container */}
            <Link to={getLocalizedPath(`/products/${product.sku}`)} className={styles.imageWrapper}>
                <img
                    src={displayImage}
                    alt={productName}
                    className={styles.productImage}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%231e293b" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" fill="%23475569" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                />

                {/* Quick Actions Overlay */}
                <div className={styles.quickActions}>
                    <button className={styles.quickActionBtn} title={t('quickView') || 'Quick View'}>
                        <Eye size={18} />
                    </button>
                    <Link
                        to={getLocalizedPath(`/products/${product.sku}`)}
                        className={`${styles.quickActionBtn} ${styles.quickActionPrimary}`}
                        title={t('viewDetails') || 'View Details'}
                    >
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </Link>

            {/* Content */}
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <span className={styles.brand}>{brandName}</span>
                </div>

                <h3 className={styles.productTitle}>
                    <Link to={getLocalizedPath(`/products/${product.sku}`)}>
                        {productName}
                    </Link>
                </h3>

                {product.summary_description?.[language] && (
                    <p
                        className={styles.description}
                        dangerouslySetInnerHTML={{ __html: product.summary_description[language] }}
                    />
                )}

                <div className={styles.cardFooter}>
                    <div className={styles.priceBlock}>
                        {renderPrice()}
                    </div>
                    
                    <Link 
                        to={getLocalizedPath(`/products/${product.sku}`)} 
                        className={styles.cardBtn}
                    >
                        <ShoppingBag size={16} />
                        {t('viewProduct') || 'View'}
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
