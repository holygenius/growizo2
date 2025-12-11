import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingCart,
    TrendingUp,
    Activity,
    Package,
    Calendar,
    Box,
    FileText
} from 'lucide-react';
import styles from './Admin.module.css';
import { adminService } from '../../services/adminService';
import { useAdmin } from '../../context/AdminContext';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
    <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: `${color}20`, color: color }}>
            <Icon size={24} />
        </div>
        <div>
            <div className={styles.statTitle}>{title}</div>
            <div className={styles.statValue}>
                {loading ? <span className="animate-pulse">...</span> : value}
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { t } = useAdmin();
    const [stats, setStats] = useState({
        products: 0,
        brands: 0,
        schedules: 0,
        presets: 0,
        blogPosts: 0,
        totalBuilds: 0
    });
    const [recentBuilds, setRecentBuilds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Parallel fetching for stats
                const [
                    products,
                    brands,
                    schedules,
                    presets,
                    blogPosts,
                    builds
                ] = await Promise.all([
                    adminService.getAll('products', { limit: 1 }), // Just need count
                    adminService.getAll('brands', { limit: 1 }),
                    adminService.getAll('feeding_schedules', { limit: 1 }),
                    adminService.getAll('preset_sets', { limit: 1 }),
                    adminService.getAll('blog_posts', { limit: 1 }),
                    adminService.getAll('user_builds', { limit: 5, orderBy: { column: 'created_at', ascending: false } })
                ]);

                setStats({
                    products: products.count,
                    brands: brands.count,
                    schedules: schedules.count,
                    presets: presets.count,
                    blogPosts: blogPosts.count,
                    totalBuilds: builds.count // Note: 'count' returned by getAll with {count: 'exact'} is total count
                });

                setRecentBuilds(builds.data);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            {/* Status Widgets */}
            <div className={styles.dashboardGrid} style={{ marginBottom: '2rem' }}>
                <StatCard
                    title={t('totalProducts')}
                    value={stats.products}
                    icon={Package}
                    color="#3b82f6"
                    loading={loading}
                />
                <StatCard
                    title={t('activeSchedules')}
                    value={stats.schedules}
                    icon={Calendar}
                    color="#10b981"
                    loading={loading}
                />
                <StatCard
                    title={t('presetKits')}
                    value={stats.presets}
                    icon={Box}
                    color="#f59e0b"
                    loading={loading}
                />
                <StatCard
                    title={t('userBuilds')}
                    value={stats.totalBuilds}
                    icon={ShoppingCart}
                    color="#8b5cf6"
                    loading={loading}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Builds Table */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>{t('recentUserBuilds')}</h3>
                        <button className={styles.actionBtn} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>
                            {t('viewAll')}
                        </button>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>{t('date')}</th>
                                    <th>{t('user')}</th>
                                    <th>{t('tentSize')}</th>
                                    <th>{t('cost')}</th>
                                    <th>{t('status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('loadingActivity')}</td></tr>
                                ) : recentBuilds.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('noBuildsFound')}</td></tr>
                                ) : (
                                    recentBuilds.map(build => (
                                        <tr key={build.id}>
                                            <td style={{ color: '#94a3b8' }}>
                                                {new Date(build.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ fontWeight: 500 }}>
                                                {build.session_id ? t('guestUser') : t('registeredUser')} <br />
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                    {build.session_id || build.user_id?.substring(0, 8)}...
                                                </span>
                                            </td>
                                            <td>
                                                {build.tent_size?.width}x{build.tent_size?.depth}cm
                                            </td>
                                            <td style={{ color: '#10b981' }}>
                                                ₺{build.total_cost?.toLocaleString()}
                                            </td>
                                            <td>
                                                <span className={`${styles.badge} ${build.is_completed ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                    {build.is_completed ? t('completed') : t('draft')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>{t('systemShortcuts')}</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button
                            className={styles.actionBtn}
                            style={{ padding: '1.5rem', flexDirection: 'column', gap: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
                            onClick={() => window.location.href = '/admin/products'}
                        >
                            <Package size={28} color="#60a5fa" />
                            <span>{t('addProduct')}</span>
                        </button>
                        <button
                            className={styles.actionBtn}
                            style={{ padding: '1.5rem', flexDirection: 'column', gap: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                            onClick={() => window.location.href = '/admin/schedules'}
                        >
                            <Calendar size={28} color="#34d399" />
                            <span>{t('updateSchedule')}</span>
                        </button>
                        <button
                            className={styles.actionBtn}
                            style={{ padding: '1.5rem', flexDirection: 'column', gap: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                            onClick={() => window.location.href = '/admin/blog'}
                        >
                            <FileText size={28} color="#fbbf24" />
                            <span>{t('writeBlogPost')}</span>
                        </button>
                        <button
                            className={styles.actionBtn}
                            style={{ padding: '1.5rem', flexDirection: 'column', gap: '0.75rem', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
                            onClick={() => window.location.href = '/admin/users'}
                        >
                            <Users size={28} color="#a78bfa" />
                            <span>{t('manageUsers')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
