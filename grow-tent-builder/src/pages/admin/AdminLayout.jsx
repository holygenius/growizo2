import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Tags,
    Users,
    FileText,
    Settings,
    LogOut,
    Store,
    Calendar,
    Box,
    Bell,
    Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin, AdminProvider } from '../../context/AdminContext';
import styles from './Admin.module.css';
import LanguageSwitcher from './components/LanguageSwitcher';
import { ToastContainer, ConfirmDialog } from './components/Toast';

const AdminLayoutContent = () => {
    const { user, signInWithGoogle, signOut, isAdmin, loading: authLoading } = useAuth();
    const { t } = useAdmin();
    const location = useLocation();

    if (authLoading) {
        return (
            <div className={styles.adminContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#fff' }}>{t('loading')}</div>
            </div>
        );
    }

    // 1. Not Logged In -> Show Login Screen
    if (!user) {
        return (
            <div className={styles.adminContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={styles.panel} style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem' }}>
                    <div className={styles.logoIcon} style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-block' }}>🌿</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('adminPortal')}</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{t('pleaseSignIn')}</p>

                    <button
                        onClick={signInWithGoogle}
                        className={styles.actionBtn}
                        style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: '#3b82f6' }}
                    >
                        {t('signInWithGoogle')}
                    </button>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <NavLink to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>
                            &larr; {t('returnToWebsite')}
                        </NavLink>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        );
    }

    // 2. Logged In but Not Admin -> Show Access Denied
    if (!isAdmin) {
        return (
            <div className={styles.adminContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={styles.panel} style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div style={{ color: '#f87171', marginBottom: '1rem' }}>
                        <LogOut size={48} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f87171' }}>{t('accessDenied')}</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                        <strong>{user.email}</strong> {t('noAdminPermissions')}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
                        {t('contactAdmin')}
                    </p>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '0.25rem', marginBottom: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                        UUID: {user.id}
                    </div>

                    <button
                        onClick={signOut}
                        className={styles.actionBtn}
                        style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: 'rgba(255,255,255,0.1)' }}
                    >
                        {t('signOut')}
                    </button>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <NavLink to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>
                            &larr; {t('returnToWebsite')}
                        </NavLink>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        );
    }

    const navigation = [
        {
            section: t('overview'), items: [
                { name: t('dashboard'), icon: LayoutDashboard, path: '/admin' }
            ]
        },
        {
            section: t('catalog'), items: [
                { name: t('products'), icon: Package, path: '/admin/products' },
                { name: t('brands'), icon: Store, path: '/admin/brands' },
                { name: t('categories'), icon: Tags, path: '/admin/categories' }
            ]
        },
        {
            section: t('growthSystems'), items: [
                { name: t('feedingSchedules'), icon: Calendar, path: '/admin/schedules' },
                { name: t('scheduleProducts'), icon: Tags, path: '/admin/schedule-products' },
                { name: t('presetSets'), icon: Box, path: '/admin/presets' }
            ]
        },
        {
            section: t('contentUsers'), items: [
                { name: t('blogPosts'), icon: FileText, path: '/admin/blog' },
                { name: t('users'), icon: Users, path: '/admin/users' }
            ]
        },
        {
            section: t('settings'), items: [
                { name: t('settings'), icon: Settings, path: '/admin/settings' }
            ]
        }
    ];

    const getPageTitle = () => {
        const currentPath = location.pathname;
        if (currentPath === '/admin') return t('dashboard');

        for (const group of navigation) {
            const item = group.items.find(i => i.path === currentPath);
            if (item) return item.name;
        }
        return t('adminPortal');
    };

    return (
        <div className={styles.adminContainer}>
            {/* Toast Notifications */}
            <ToastContainer />
            
            {/* Confirm Dialog */}
            <ConfirmDialog />

            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span className={styles.logoIcon}>🌿</span>
                    <span className={styles.brandName}>GroAdmin</span>
                </div>

                <nav style={{ flex: 1 }}>
                    {navigation.map((group, idx) => (
                        <div key={idx} className={styles.navSection}>
                            <div className={styles.navLabel}>{group.section}</div>
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                                    }
                                    end={item.path === '/admin'}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className={styles.userProfile}>
                    <div className={styles.userAvatar}>
                        {user ? user.email[0].toUpperCase() : 'A'}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {user ? user.email.split('@')[0] : 'Admin'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{t('superAdmin')}</div>
                    </div>
                    <button
                        onClick={signOut}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.5rem' }}
                        title={t('signOut')}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                {/* Top Header */}
                <header className={styles.topBar}>
                    <div className={styles.pageTitle}>
                        <h1>{getPageTitle()}</h1>
                        <p>{t('manageEmpire')}</p>
                    </div>

                    <div className={styles.actions}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder={t('searchAnything')}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '2rem',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    color: '#fff',
                                    outline: 'none',
                                    width: '250px'
                                }}
                            />
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
                        </div>
                        <LanguageSwitcher compact />
                        <button className={styles.iconBtn}>
                            <Bell size={20} />
                        </button>
                        <button className={styles.iconBtn} onClick={() => window.location.href = '/admin/settings'}>
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className={styles.fadeIn}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

// Wrap with AdminProvider
const AdminLayout = () => {
    return (
        <AdminProvider>
            <AdminLayoutContent />
        </AdminProvider>
    );
};

export default AdminLayout;
