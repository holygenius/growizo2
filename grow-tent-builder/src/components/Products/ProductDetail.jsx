
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useSettings } from '../../context/SettingsContext';
import { ArrowLeft, Check, Copy, ShoppingCart, Tag, Share2, Info, ChevronRight, Package, Loader, Calendar, Droplets } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import styles from './Products.module.css';

// Spec key'lerini kullanıcı dostu formata çeviren helper
const formatSpecKey = (key, language) => {
    const keyMappings = {
        // Genel özellikler
        'color': { en: 'Color', tr: 'Renk' },
        'brand': { en: 'Brand', tr: 'Marka' },
        'tier': { en: 'Tier', tr: 'Seviye' },
        'phase': { en: 'Growth Phase', tr: 'Büyüme Fazı' },
        'category': { en: 'Category', tr: 'Kategori' },
        'packaging': { en: 'Packaging', tr: 'Ambalaj' },
        'size': { en: 'Size', tr: 'Boyut' },
        'type': { en: 'Type', tr: 'Tip' },

        // Dozaj ve beslenme
        'dose_unit': { en: 'Dose Unit', tr: 'Doz Birimi' },
        'dose unit': { en: 'Dose Unit', tr: 'Doz Birimi' },
        'dosage': { en: 'Dosage', tr: 'Dozaj' },
        'npk': { en: 'NPK Ratio', tr: 'NPK Oranı' },

        // pH
        'ph_perfect': { en: 'pH Perfect', tr: 'pH Perfect' },
        'ph perfect': { en: 'pH Perfect', tr: 'pH Perfect' },
        'ph_range': { en: 'pH Range', tr: 'pH Aralığı' },
        'ph range': { en: 'pH Range', tr: 'pH Aralığı' },

        // Kategori
        'category_key': { en: 'Category Type', tr: 'Kategori Tipi' },
        'category key': { en: 'Category Type', tr: 'Kategori Tipi' },

        // Program
        'schedule_default': { en: 'Default Schedule', tr: 'Varsayılan Program' },
        'schedule default': { en: 'Default Schedule', tr: 'Varsayılan Program' },

        // Fiziksel özellikler
        'volume': { en: 'Volume', tr: 'Hacim' },
        'weight': { en: 'Weight', tr: 'Ağırlık' },
        'dimensions': { en: 'Dimensions', tr: 'Boyutlar' },

        // Aydınlatma
        'wattage': { en: 'Wattage', tr: 'Watt' },
        'coverage': { en: 'Coverage Area', tr: 'Kapsama Alanı' },
        'spectrum': { en: 'Light Spectrum', tr: 'Işık Spektrumu' },
        'ppfd': { en: 'PPFD', tr: 'PPFD' },
        'lumens': { en: 'Lumens', tr: 'Lümen' },

        // Besin kategorileri
        'base_nutrient': { en: 'Base Nutrient', tr: 'Temel Besin' },
        'base': { en: 'Base', tr: 'Temel' },

        // Substrat
        'substrate_type': { en: 'Substrate Type', tr: 'Substrat Tipi' },
        'substrate type': { en: 'Substrate Type', tr: 'Substrat Tipi' },

        // Diğer
        'application': { en: 'Application', tr: 'Uygulama' },
        'usage': { en: 'Usage', tr: 'Kullanım' },
        'ingredients': { en: 'Ingredients', tr: 'İçerik' },
        'origin': { en: 'Origin', tr: 'Menşei' },
        'shelf_life': { en: 'Shelf Life', tr: 'Raf Ömrü' },
        'shelf life': { en: 'Shelf Life', tr: 'Raf Ömrü' },
    };

    const normalizedKey = key.toLowerCase().replace(/_/g, ' ');
    const mapping = keyMappings[normalizedKey] || keyMappings[key.toLowerCase()];

    if (mapping) {
        return mapping[language] || mapping.en;
    }

    // Fallback: Capitalize first letter of each word
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Spec değerlerini lokalize eden mapping
const valueMappings = {
    // Tier/Seviye
    'standard': { en: 'Standard', tr: 'Standart' },
    'premium': { en: 'Premium', tr: 'Premium' },
    'professional': { en: 'Professional', tr: 'Profesyonel' },
    'basic': { en: 'Basic', tr: 'Temel' },
    'advanced': { en: 'Advanced', tr: 'İleri Seviye' },

    // Phase/Faz
    'veg': { en: 'Vegetative', tr: 'Vejetatif' },
    'bloom': { en: 'Bloom/Flowering', tr: 'Çiçeklenme' },
    'flower': { en: 'Flowering', tr: 'Çiçeklenme' },
    'flowering': { en: 'Flowering', tr: 'Çiçeklenme' },
    'seedling': { en: 'Seedling', tr: 'Fide' },
    'clone': { en: 'Clone', tr: 'Klon' },
    'all': { en: 'All Phases', tr: 'Tüm Fazlar' },
    'grow': { en: 'Growth', tr: 'Büyüme' },

    // Category/Kategori
    'base': { en: 'Base Nutrient', tr: 'Temel Besin' },
    'supplement': { en: 'Supplement', tr: 'Takviye' },
    'additive': { en: 'Additive', tr: 'Katkı' },
    'booster': { en: 'Booster', tr: 'Güçlendirici' },
    'stimulant': { en: 'Stimulant', tr: 'Uyarıcı' },
    'enhancer': { en: 'Enhancer', tr: 'Artırıcı' },

    // Substrate
    'soil': { en: 'Soil', tr: 'Toprak' },
    'coco': { en: 'Coco', tr: 'Hindistan Cevizi' },
    'hydro': { en: 'Hydroponic', tr: 'Hidroponik' },
    'aero': { en: 'Aeroponic', tr: 'Aeroponik' },
};

// Kategori key'lerini lokalize eden mapping
const categoryMappings = {
    'root_expanders': { en: 'Root Expanders', tr: 'Kök Genişleticiler' },
    'base_nutrient': { en: 'Base Nutrient', tr: 'Temel Besin' },
    'bloom_boosters': { en: 'Bloom Boosters', tr: 'Çiçek Güçlendiriciler' },
    'supplements': { en: 'Supplements', tr: 'Takviyeler' },
    'additives': { en: 'Additives', tr: 'Katkılar' },
    'grow': { en: 'Grow', tr: 'Büyüme' },
    'bloom': { en: 'Bloom', tr: 'Çiçeklenme' },
    'micro': { en: 'Micro', tr: 'Mikro' },
    'ph_adjusters': { en: 'pH Adjusters', tr: 'pH Ayarlayıcılar' },
    'substrates': { en: 'Substrates', tr: 'Substratlar' },
    'lighting': { en: 'Lighting', tr: 'Aydınlatma' },
    'ventilation': { en: 'Ventilation', tr: 'Havalandırma' },
    'grow_tents': { en: 'Grow Tents', tr: 'Yetiştirme Kabinleri' },
    'nutrients': { en: 'Nutrients', tr: 'Besinler' },
    'stimulants': { en: 'Stimulants', tr: 'Uyarıcılar' },
    'enzymes': { en: 'Enzymes', tr: 'Enzimler' },
    'beneficial_bacteria': { en: 'Beneficial Bacteria', tr: 'Faydalı Bakteriler' },
    'organic': { en: 'Organic', tr: 'Organik' },
};

// Spec değerini kullanıcı dostu formata çeviren helper
const formatSpecValue = (value, key, language) => {
    // Null veya undefined kontrolü
    if (value === null || value === undefined) {
        return '-';
    }

    // Boolean değerler
    if (typeof value === 'boolean') {
        return value ? '✓' : '✗';
    }

    // Object değerler (schedule_default gibi)
    if (typeof value === 'object') {
        // Eğer localized object ise (en/tr key'leri varsa)
        if (value.en || value.tr) {
            return value[language] || value.en || '-';
        }
        // Diğer object'ler için - gösterme
        return null; // Bu spec'i tamamen atla
    }

    // Array değerler
    if (Array.isArray(value)) {
        return value.map(v => {
            const normalizedV = String(v).toLowerCase();
            const mapping = valueMappings[normalizedV];
            return mapping ? (mapping[language] || mapping.en) : v;
        }).join(', ');
    }

    // String değerler için valueMappings'den çeviri ara
    if (typeof value === 'string') {
        const normalizedValue = value.toLowerCase();

        // Renk değerleri için hex kod göster (çeviri yapma)
        if (key.toLowerCase().includes('color') && value.startsWith('#')) {
            return value;
        }

        // Kategori key'leri için categoryMappings kullan
        if (key.toLowerCase().includes('category')) {
            const normalizedCat = normalizedValue.replace(/ /g, '_');
            const catMapping = categoryMappings[normalizedCat] || categoryMappings[normalizedValue];
            if (catMapping) {
                return catMapping[language] || catMapping.en;
            }
        }

        // Genel değer çevirileri için valueMappings kullan
        const valueMapping = valueMappings[normalizedValue];
        if (valueMapping) {
            return valueMapping[language] || valueMapping.en;
        }

        // Fallback: Olduğu gibi döndür ama capitalize et
        if (value.length > 0 && !value.includes('/') && !value.includes('ml') && !value.includes('L')) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    }

    // Diğer tipler
    return String(value);
};

// Gösterilmemesi gereken spec key'leri
const hiddenSpecKeys = ['schedule_default', 'schedule default', 'id', 'created_at', 'updated_at'];

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language, t, formatPrice, getLocalizedPath } = useSettings();

    const [product, setProduct] = useState(null);
    const [vendorPrices, setVendorPrices] = useState([]);
    const [priceRange, setPriceRange] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    // Fetch Product with vendor prices
    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            console.log('Loading product with id/sku:', id);
            try {
                const data = await productService.getProductBySku(id);
                console.log('Product data received:', data);
                if (data) {
                    setProduct(data);

                    // Load vendor prices
                    const prices = await productService.getAllVendorPrices(data.id);
                    setVendorPrices(prices || []);

                    // Calculate price range
                    if (prices && prices.length > 0) {
                        const activePrices = prices.filter(p => p.is_active).map(p => p.price);
                        if (activePrices.length > 0) {
                            setPriceRange({
                                min: Math.min(...activePrices),
                                max: Math.max(...activePrices),
                                count: activePrices.length
                            });
                        }
                    }
                } else {
                    console.warn('Product not found for SKU:', id);
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
            <div className={styles.pageWrapper}>
                <Navbar />
                <div className={styles.loadingState} style={{ minHeight: '60vh' }}>
                    <Loader className={styles.spinner} size={48} />
                    <p>{t('loading') || 'Loading...'}</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.pageWrapper}>
                <Navbar />
                <div className={styles.emptyState} style={{ minHeight: '60vh' }}>
                    <Package size={64} strokeWidth={1} />
                    <h3>{t('productNotFound') || 'Product Not Found'}</h3>
                    <p>{t('productNotFoundDesc') || 'The product you are looking for does not exist or has been removed.'}</p>
                    <Link to={getLocalizedPath('/products')} className={styles.resetBtn}>
                        {t('backToProducts') || 'Back to Products'}
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const images = product.images && product.images.length > 0 ? product.images : [{ url: product.icon || '/images/placeholder-product.png', alt: product.name[language] }];
    const productName = product.name[language] || product.name.en;
    const description = product.description?.[language] || product.description?.en || '';
    const specs = product.specs || {};
    const brandName = product.brands?.name || '';

    return (
        <div className={styles.pageWrapper}>
            <Navbar />

            {/* Hero Banner */}
            <div className={styles.detailHeroBanner}>
                <div className={styles.heroContent}>
                    <nav className={styles.breadcrumb}>
                        <Link to={getLocalizedPath('/')}>{t('navHome') || 'Home'}</Link>
                        <ChevronRight size={14} />
                        <Link to={getLocalizedPath('/products')}>{t('navProducts') || 'Products'}</Link>
                        <ChevronRight size={14} />
                        <span>{productName}</span>
                    </nav>
                </div>
            </div>

            <div className={styles.detailContainer}>
                {/* Image Gallery */}
                <div className={styles.detailGallery}>
                    <div className={styles.detailMainImage}>
                        <img
                            src={images[activeImage].url}
                            alt={images[activeImage].alt || productName}
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%231e293b" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" fill="%23475569" text-anchor="middle" dy=".3em" font-size="20"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                        />
                        {product.discount > 0 && (
                            <span className={styles.detailImageBadge}>-{product.discount}% OFF</span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className={styles.detailThumbnails}>
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`${styles.detailThumb} ${activeImage === idx ? styles.detailThumbActive : ''}`}
                                >
                                    <img src={img.url} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className={styles.detailInfo}>
                    {brandName && (
                        <span className={styles.detailBrand}>{brandName}</span>
                    )}

                    <h1 className={styles.detailTitle}>{productName}</h1>

                    <div className={styles.detailMeta}>
                        <span className={styles.detailSku}>
                            <Tag size={14} /> SKU: {product.sku}
                        </span>
                        {product.is_featured && (
                            <span className={styles.detailFeaturedBadge}>★ {t('featured') || 'Featured'}</span>
                        )}
                    </div>

                    {/* Price Range from Vendors */}
                    <div className={styles.detailPriceBlock}>
                        {priceRange ? (
                            <>
                                {priceRange.min === priceRange.max ? (
                                    <span className={styles.detailPrice}>{formatPrice(priceRange.min)}</span>
                                ) : (
                                    <>
                                        <span className={styles.detailPrice}>{formatPrice(priceRange.min)}</span>
                                        <span className={styles.priceDevider}>-</span>
                                        <span className={styles.detailPrice}>{formatPrice(priceRange.max)}</span>
                                    </>
                                )}
                                <span className={styles.vendorCount}>
                                    ({priceRange.count} {language === 'tr' ? 'satıcı' : 'vendor'}{priceRange.count > 1 ? (language === 'tr' ? '' : 's') : ''})
                                </span>
                            </>
                        ) : (
                            <span style={{ color: '#94a3b8' }}>{language === 'tr' ? 'Fiyat bilgisi yok' : 'No price available'}</span>
                        )}
                    </div>

                    {/* Vendor Price List */}
                    {vendorPrices.length > 0 && (
                        <div className={styles.vendorPriceList}>
                            <h4 className={styles.vendorPriceTitle}>
                                {language === 'tr' ? 'Satıcı Fiyatları' : 'Vendor Prices'}
                            </h4>
                            {vendorPrices
                                .filter(vp => vp.is_active)
                                .sort((a, b) => a.price - b.price)
                                .map((vp, idx) => (
                                    <div key={vp.id} className={styles.vendorPriceRow} style={{
                                        background: idx === 0 ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {vp.vendors?.logo_url && (
                                                <img src={vp.vendors.logo_url} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                            )}
                                            <span style={{ fontWeight: idx === 0 ? 600 : 400 }}>
                                                {vp.vendors?.name || 'Unknown Vendor'}
                                            </span>
                                            {idx === 0 && (
                                                <span style={{
                                                    background: '#10b981',
                                                    color: '#fff',
                                                    padding: '0.125rem 0.5rem',
                                                    borderRadius: '1rem',
                                                    fontSize: '0.625rem',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {language === 'tr' ? 'En Ucuz' : 'Cheapest'}
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <span style={{
                                                fontWeight: 700,
                                                color: idx === 0 ? 'var(--color-primary)' : 'var(--text-primary)',
                                                fontSize: '1.125rem'
                                            }}>
                                                {formatPrice(vp.price)}
                                            </span>
                                            {vp.product_url && (
                                                <a
                                                    href={vp.product_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.buyButton}
                                                >
                                                    <ShoppingCart size={14} />
                                                    {language === 'tr' ? 'Satın Al' : 'Buy'}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* Short Desc */}
                    {(product.summary_description?.[language] || product.summary_description?.en) && (
                        <div
                            className={styles.detailSummary}
                            dangerouslySetInnerHTML={{ __html: product.summary_description?.[language] || product.summary_description?.en }}
                        />
                    )}

                    {/* Actions - Removed Add to Cart since we show vendor links */}
                    <div className={styles.detailActions}>
                        <button className={styles.detailShareBtn}>
                            <Share2 size={20} />
                            {language === 'tr' ? 'Paylaş' : 'Share'}
                        </button>
                    </div>

                    {/* Specs Preview */}
                    {Object.keys(specs).length > 0 && (
                        <div className={styles.detailSpecsPreview}>
                            <h4 className={styles.detailSpecsTitle}>{t('keySpecs') || 'Key Specifications'}</h4>
                            <div className={styles.detailSpecsGrid}>
                                {Object.entries(specs)
                                    .filter(([key]) => !hiddenSpecKeys.includes(key.toLowerCase()))
                                    .filter(([key, value]) => formatSpecValue(value, key, language) !== null)
                                    .slice(0, 6)
                                    .map(([key, value]) => (
                                        <div key={key} className={styles.detailSpecItem}>
                                            <span className={styles.detailSpecLabel}>{formatSpecKey(key, language)}</span>
                                            <span className={styles.detailSpecValue}>
                                                {key.toLowerCase().includes('color') && typeof value === 'string' && value.startsWith('#') && (
                                                    <span
                                                        className={styles.colorSwatch}
                                                        style={{ backgroundColor: value }}
                                                    />
                                                )}
                                                {formatSpecValue(value, key, language)}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Info Sections */}
            <div className={styles.detailSections}>
                {/* Description */}
                {description && (
                    <div className={styles.detailSection}>
                        <div className={styles.detailSectionHeader}>
                            <Info size={20} />
                            <h3>{t('productDescription') || 'Product Description'}</h3>
                        </div>
                        <div
                            className={styles.detailDescription}
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                )}

                {/* Full Specs */}
                {Object.keys(specs).length > 0 && (
                    <div className={styles.detailSection}>
                        <div className={styles.detailSectionHeader}>
                            <Tag size={20} />
                            <h3>{t('specifications') || 'Technical Specifications'}</h3>
                        </div>
                        <div className={styles.detailSpecsList}>
                            {Object.entries(specs)
                                .filter(([key]) => !hiddenSpecKeys.includes(key.toLowerCase()))
                                .filter(([key, value]) => formatSpecValue(value, key, language) !== null)
                                .map(([key, value]) => (
                                    <div key={key} className={styles.detailSpecRow}>
                                        <span className={styles.detailSpecRowLabel}>{formatSpecKey(key, language)}</span>
                                        <span className={styles.detailSpecRowValue}>
                                            {key.toLowerCase().includes('color') && typeof value === 'string' && value.startsWith('#') && (
                                                <span
                                                    className={styles.colorSwatch}
                                                    style={{ backgroundColor: value }}
                                                />
                                            )}
                                            {formatSpecValue(value, key, language)}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Feeding Schedule */}
                {specs.schedule_default && typeof specs.schedule_default === 'object' && Object.keys(specs.schedule_default).length > 0 && (
                    <div className={styles.detailSection}>
                        <div className={styles.detailSectionHeader}>
                            <Calendar size={20} />
                            <h3>{language === 'tr' ? 'Beslenme Programı' : 'Feeding Schedule'}</h3>
                        </div>
                        <div className={styles.feedingScheduleInfo}>
                            <Droplets size={16} />
                            <span>{language === 'tr' ? `Doz birimi: ${specs.dose_unit || 'ml/L'}` : `Dose unit: ${specs.dose_unit || 'ml/L'}`}</span>
                        </div>
                        <div className={styles.feedingScheduleTable}>
                            <div className={styles.feedingScheduleHeader}>
                                <div className={styles.feedingScheduleHeaderCell}>{language === 'tr' ? 'Hafta' : 'Week'}</div>
                                <div className={styles.feedingScheduleHeaderCell}>{language === 'tr' ? 'Dozaj' : 'Dosage'}</div>
                            </div>
                            <div className={styles.feedingScheduleBody}>
                                {Object.entries(specs.schedule_default)
                                    .sort((a, b) => {
                                        // WK 1, WK 2 gibi sıralama
                                        const numA = parseInt(a[0].replace(/\D/g, '')) || 0;
                                        const numB = parseInt(b[0].replace(/\D/g, '')) || 0;
                                        return numA - numB;
                                    })
                                    .map(([week, dosage]) => (
                                        <div key={week} className={styles.feedingScheduleRow}>
                                            <div className={styles.feedingScheduleCell}>
                                                <span className={styles.weekLabel}>
                                                    {language === 'tr' ? week.replace('WK', 'Hafta') : week}
                                                </span>
                                            </div>
                                            <div className={styles.feedingScheduleCell}>
                                                <span className={`${styles.dosageValue} ${dosage === 'N/A' ? styles.dosageNA : ''}`}>
                                                    {dosage === 'N/A'
                                                        ? (language === 'tr' ? 'Kullanılmaz' : 'N/A')
                                                        : dosage === 'Optional'
                                                            ? (language === 'tr' ? 'Opsiyonel' : 'Optional')
                                                            : `${dosage} ${specs.dose_unit || 'ml/L'}`
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <p className={styles.feedingScheduleNote}>
                            {language === 'tr'
                                ? '* Bu değerler önerilen dozajlardır. Bitkilerinizin ihtiyaçlarına göre ayarlayabilirsiniz.'
                                : '* These are recommended dosages. Adjust according to your plants\' needs.'}
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;
