import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBuilder } from '../context/BuilderContext';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { Trash2, FolderOpen, Package, User, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from './ProfilePage.module.css';

import { useSettings } from '../context/SettingsContext';

const ProfilePage = () => {
    const { user, signOut } = useAuth();
    const { dispatch } = useBuilder();
    const { getBuilderUrl } = useSettings();
    const navigate = useNavigate();
    const [savedBuilds, setSavedBuilds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadBuilds();
        }
    }, [user]);

    const loadBuilds = async () => {
        setLoading(true);
        const { data } = await userService.getUserBuilds();
        if (data) {
            setSavedBuilds(data);
        }
        setLoading(false);
    };

    const handleLoadBuild = (build) => {
        dispatch({
            type: 'LOAD_BUILD',
            payload: {
                tentSize: build.tent_size,
                mediaType: build.media_type,
                selectedItems: build.selected_items
            }
        });
        navigate(getBuilderUrl());
    };

    const handleDeleteBuild = async (id) => {
        if (window.confirm('Bu seti silmek istediğinizden emin misiniz?')) {
            await userService.deleteBuild(id);
            loadBuilds();
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (!user) {
        return (
            <>
                <Navbar />
                <div className={styles.pageContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className={styles.emptyState}>
                        <h2 className={styles.emptyTitle}>Profili görüntülemek için lütfen giriş yapın</h2>
                        <button
                            onClick={() => navigate('/')}
                            className={styles.ctaBtn}
                        >
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Safely get user avatar and name
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Grower';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <>
            <Navbar />
            <div className={styles.pageContainer}>
                {/* Header Section */}
                <div className={styles.profileHeader}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={userName}
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <span>{userInitial}</span>
                            )}
                        </div>
                        <div className={styles.userDetails}>
                            <h1>{userName}</h1>
                            <p className={styles.userEmail}>{user.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className={styles.signOutBtn}
                    >
                        <LogOut size={20} />
                        Çıkış Yap
                    </button>
                </div>

                {/* Saved Builds Section */}
                <div>
                    <div className={styles.sectionHeader}>
                        <Package className={styles.iconBox} style={{ background: 'none', width: 'auto', height: 'auto', color: '#4ade80' }} size={32} />
                        <h2 className={styles.sectionTitle}>Kaydedilen Setler</h2>
                        <span className={styles.countBadge}>
                            {savedBuilds.length}
                        </span>
                    </div>

                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <p style={{ color: '#9ca3af' }}>Setleriniz yükleniyor...</p>
                        </div>
                    ) : savedBuilds.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Package className={styles.emptyIcon} />
                            <h3 className={styles.emptyTitle}>Henüz kaydedilmiş set yok</h3>
                            <p className={styles.emptyText}>Hayalinizdeki yetiştirme kurulumunu oluşturmaya başlayın ve buraya kaydedin.</p>
                            <button
                                onClick={() => navigate(getBuilderUrl())}
                                className={styles.ctaBtn}
                            >
                                Oluşturucuya Git
                            </button>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {savedBuilds.map((build) => (
                                <div
                                    key={build.id}
                                    className={styles.buildCard}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.iconBox}>
                                            <Package size={24} />
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBuild(build.id)}
                                            className={styles.deleteBtn}
                                            title="Seti Sil"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <h3 className={styles.cardTitle}>{build.name}</h3>

                                    <div className={styles.cardDetails}>
                                        <div className={styles.detailRow}>
                                            <span>Boyut:</span>
                                            <span className={styles.detailValue}>
                                                {build.tent_size.width}x{build.tent_size.depth}x{build.tent_size.height} {build.tent_size.unit}
                                            </span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Maliyet:</span>
                                            <span className={styles.costValue}>
                                                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(build.total_cost)}
                                            </span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Tarih:</span>
                                            <span>{new Date(build.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleLoadBuild(build)}
                                        className={styles.loadBtn}
                                    >
                                        <FolderOpen size={18} />
                                        Seti Yükle
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;
