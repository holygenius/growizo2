import React, { useState, useRef } from 'react';
import { adminService } from '../../../services/adminService';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import styles from '../Admin.module.css';

const ImageUploader = ({ label, value, onChange, bucket = 'images', helpText }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const [showGallery, setShowGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const [loadingGallery, setLoadingGallery] = useState(false);

    const loadGallery = async () => {
        setLoadingGallery(true);
        try {
            const files = await adminService.listBucketFiles(bucket);
            setGalleryImages(files || []);
        } catch (error) {
            console.error('Error loading gallery:', error);
            setError('Failed to load library images');
        } finally {
            setLoadingGallery(false);
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const publicUrl = await adminService.uploadImage(file, bucket);
            onChange(publicUrl);
        } catch (err) {
            console.error('Upload failed:', err);
            setError('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleClear = () => {
        onChange('');
    };

    return (
        <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ display: 'block', color: '#94a3b8' }}>{label}</label>
                <button
                    type="button"
                    onClick={handleOpenGallery}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        textDecoration: 'underline'
                    }}
                >
                    Select from Library
                </button>
            </div>

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
                        maxWidth: '800px',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: '#fff' }}>Select Image</h3>
                            <button onClick={() => setShowGallery(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <div style={{
                            flex: 1,
                            overflow: 'auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '1rem',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.2)',
                            borderRadius: '0.5rem'
                        }}>
                            {loadingGallery ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                    <Loader2 className="animate-spin" size={32} />
                                    <div>Loading library...</div>
                                </div>
                            ) : galleryImages.length === 0 ? (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                    No images found in {bucket}
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
                                            border: value === file.publicUrl ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                                            transition: 'transform 0.2s',
                                        }}
                                        className={styles.galleryItem}
                                    >
                                        <img
                                            src={file.publicUrl}
                                            alt={file.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: 'rgba(0,0,0,0.7)',
                                            color: '#fff',
                                            fontSize: '0.7rem',
                                            padding: '0.25rem',
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
                    </div>
                </div>
            )}

            <div style={{
                border: `2px dashed ${error ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '0.5rem',
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.2)',
                position: 'relative',
                transition: 'border-color 0.2s'
            }}>
                {value ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={value}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '0.5rem', display: 'block' }}
                        />
                        <button
                            type="button"
                            onClick={handleClear}
                            style={{
                                position: 'absolute',
                                top: '-10px',
                                right: '-10px',
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            <X size={14} />
                        </button>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                            {value}
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {uploading ? (
                            <Loader2 size={32} className="animate-spin" style={{ color: '#3b82f6' }} />
                        ) : (
                            <Upload size={32} style={{ color: '#64748b' }} />
                        )}
                        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>
                            {uploading ? 'Uploading...' : 'Click or drop image here'}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            Supports JPG, PNG, WEBP, GIF
                        </span>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>

            {error && <small style={{ color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{error}</small>}
            {helpText && !error && <small style={{ color: '#64748b', marginTop: '0.25rem', display: 'block' }}>{helpText}</small>}
        </div>
    );
};

export default ImageUploader;
