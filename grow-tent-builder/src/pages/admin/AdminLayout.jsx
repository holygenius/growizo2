import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Navigate } from 'react-router-dom';
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
import styles from './Admin.module.css';

const AdminLayout = () => {
    const { user, signInWithGoogle, signOut, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className={styles.adminContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#fff' }}>Loading...</div>
            </div>
        );
    }

    // 1. Not Logged In -> Show Login Screen
    if (!user) {
        return (
            <div className={styles.adminContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={styles.panel} style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '3rem' }}>
                    <div className={styles.logoIcon} style={{ fontSize: '3rem', marginBottom: '1rem', display: 'inline-block' }}>🌿</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Portal</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Please sign in to access the dashboard.</p>

                    <button
                        onClick={signInWithGoogle}
                        className={styles.actionBtn}
                        style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: '#3b82f6' }}
                    >
                        Sign in with Google
                    </button>
                    <div style={{ marginTop: '1.5rem' }}>
                        <NavLink to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>
                            &larr; Return to Website
                        </NavLink>
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
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f87171' }}>Access Denied</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
                        User <strong>{user.email}</strong> does not have admin permissions.
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '2rem' }}>
                        If you believe this is an error, please contact the system administrator to add your UUID to the admin list.
                    </p>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '0.25rem', marginBottom: '2rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                        UUID: {user.id}
                    </div>

                    <button
                        onClick={signOut}
                        className={styles.actionBtn}
                        style={{ width: '100%', justifyContent: 'center', padding: '1rem', background: 'rgba(255,255,255,0.1)' }}
                    >
                        Sign Out
                    </button>
                    <div style={{ marginTop: '1.5rem' }}>
                        <NavLink to="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>
                            &larr; Return to Website
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }

    const navigation = [
        {
            section: 'Overview', items: [
                { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' }
            ]
        },
        {
            section: 'Catalog', items: [
                { name: 'Products', icon: Package, path: '/admin/products' },
                { name: 'Brands', icon: Store, path: '/admin/brands' },
                { name: 'Categories', icon: Tags, path: '/admin/categories' }
            ]
        },
        {
            section: 'Growth Systems', items: [
                { name: 'Feeding Schedules', icon: Calendar, path: '/admin/schedules' },
                { name: 'Schedule Products', icon: Tags, path: '/admin/schedule-products' },
                { name: 'Preset Sets', icon: Box, path: '/admin/presets' }
            ]
        },
        {
            section: 'Content & Users', items: [
                { name: 'Blog Posts', icon: FileText, path: '/admin/blog' },
                { name: 'Users', icon: Users, path: '/admin/users' }
            ]
        }
    ];

    const getPageTitle = () => {
        const currentPath = location.pathname;
        if (currentPath === '/admin') return 'Dashboard';

        for (const group of navigation) {
            const item = group.items.find(i => i.path === currentPath);
            if (item) return item.name;
        }
        return 'Admin Portal';
    };

    return (
        <div className={styles.adminContainer}>
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
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Super Admin</div>
                    </div>
                    <button
                        onClick={signOut}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.5rem' }}
                        title="Sign Out"
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
                        <p>Manage your grow empire efficiently.</p>
                    </div>

                    <div className={styles.actions}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search anything..."
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
                        <button className={styles.iconBtn}>
                            <Bell size={20} />
                        </button>
                        <button className={styles.iconBtn}>
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

export default AdminLayout;
