import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { X, Image as ImageIcon, Loader2, FolderOpen } from 'lucide-react';
import styles from '../Admin.module.css';

/**
 * GalleryPicker - Select images from existing bucket gallery (no upload)
 */
const GalleryPicker = ({ label, value, onChange, bucket = 'images', helpText }) => {
    const [showGallery, setShowGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadGallery = async () => {
        setLoading(true);
        setError(null);
        try {
            const files = await adminService.listBucketFiles(bucket);
            setGalleryImages(files || []);
        } catch (err) {
            console.error('Error loading gallery:', err);
            setError('Galeri yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenGallery = () => {
        setShowGallery(true);
        loadGallery();
    };

    const handleSelectImage = (url) => {
        onChange(url);
        setShowGallery(false);
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className={styles.inputGroup}>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{label}</label>

            {/* Gallery Modal */}
            {showGallery && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }} onClick={() => setShowGallery(false)}>
                    <div style={{
                        background: '#1e293b',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        width: '100%',
                        maxWidth: '900px',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#fff' }}>
                                <FolderOpen size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                Galeriden Seç - {bucket}
                            </h3>
                            <button 
                                onClick={() => setShowGallery(false)} 
                                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{
                            flex: 1,
                            overflow: 'auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                            gap: '0.75rem',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '0.5rem',
                            minHeight: '300px'
                        }}>
                            {loading ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                    <Loader2 className="animate-spin" size={32} style={{ animation: 'spin 1s linear infinite' }} />
                                    <div style={{ marginTop: '0.5rem' }}>Yükleniyor...</div>
                                </div>
                            ) : error ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#ef4444', padding: '2rem' }}>
                                    {error}
                                </div>
                            ) : galleryImages.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                    <ImageIcon size={48} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                                    <div>Bu klasörde görsel bulunamadı</div>
                                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Bucket: {bucket}</div>
                                </div>
                            ) : (
                                galleryImages.map((file, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleSelectImage(file.publicUrl)}
                                        style={{
                                            aspectRatio: '1',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            borderRadius: '0.5rem',
                                            overflow: 'hidden',
                                            border: value === file.publicUrl ? '3px solid #10b981' : '2px solid rgba(255,255,255,0.1)',
                                            transition: 'all 0.2s',
                                            background: '#0f172a'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <img
                                            src={file.publicUrl}
                                            alt={file.name}
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                objectFit: 'contain',
                                                background: '#0f172a'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div style={{
                                            display: 'none',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#64748b'
                                        }}>
                                            <ImageIcon size={24} />
                                        </div>
                                        {value === file.publicUrl && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '4px',
                                                right: '4px',
                                                background: '#10b981',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: '12px'
                                            }}>
                                                ✓
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'rgba(0,0,0,0.8)',
                                            color: '#fff',
                                            fontSize: '0.65rem',
                                            padding: '0.25rem 0.4rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {file.name}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '1rem'
                        }}>
                            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                                {galleryImages.length} görsel bulundu
                            </span>
                            <button
                                onClick={() => setShowGallery(false)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview / Select Button */}
            <div style={{
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.2)',
                position: 'relative'
            }}>
                {value ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={value}
                            alt="Selected"
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '150px', 
                                borderRadius: '0.5rem', 
                                display: 'block',
                                background: '#0f172a'
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleClear}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            <X size={12} />
                        </button>
                        <button
                            type="button"
                            onClick={handleOpenGallery}
                            style={{
                                marginTop: '0.75rem',
                                padding: '0.4rem 0.75rem',
                                background: 'rgba(59, 130, 246, 0.2)',
                                border: '1px solid #3b82f6',
                                borderRadius: '0.375rem',
                                color: '#3b82f6',
                                cursor: 'pointer',
                                fontSize: '0.75rem'
                            }}
                        >
                            Değiştir
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleOpenGallery}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            width: '100%',
                            padding: '1rem'
                        }}
                    >
                        <FolderOpen size={32} />
                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>Galeriden Seç</span>
                        <span style={{ fontSize: '0.75rem' }}>Mevcut görsellerden birini seçin</span>
                    </button>
                )}
            </div>

            {helpText && <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>{helpText}</small>}
        </div>
    );
};

export default GalleryPicker;
