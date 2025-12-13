import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { LogIn, LogOut, Eye, RefreshCw, Monitor, Globe } from 'lucide-react';
import styles from '../Admin.module.css';
import TableFilter from '../components/TableFilter';
import { useAdmin } from '../../../context/AdminContext';

export default function AdminLogsManager() {
    const { t } = useAdmin();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('all');

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch = !searchTerm ||
                log.admin_email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesAction = actionFilter === 'all' || log.action === actionFilter;
            return matchesSearch && matchesAction;
        });
    }, [logs, searchTerm, actionFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAll('admin_access_logs', { 
                orderBy: 'created_at',
                orderDir: 'desc',
                limit: 100 
            });
            setLogs(res.data || []);
        } catch (error) {
            console.error('Error loading logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('tr-TR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'login': return <LogIn size={16} className={styles.textSuccess} />;
            case 'logout': return <LogOut size={16} className={styles.textDanger} />;
            case 'access': return <Eye size={16} className={styles.textInfo} />;
            default: return <Monitor size={16} />;
        }
    };

    const getActionLabel = (action) => {
        switch (action) {
            case 'login': return t('logsPage.actionLogin') || 'Login';
            case 'logout': return t('logsPage.actionLogout') || 'Logout';
            case 'access': return t('logsPage.actionAccess') || 'Access';
            default: return action;
        }
    };

    const getBrowserInfo = (userAgent) => {
        if (!userAgent) return '-';
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Other';
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('logsPage.title') || 'Access Logs'}</h2>
                <button
                    onClick={loadData}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}
                >
                    <RefreshCw size={20} /> {t('common.refresh') || 'Refresh'}
                </button>
            </div>

            <TableFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={t('logsPage.filterPlaceholder') || 'Filter by email...'}
                filters={[
                    {
                        key: 'action',
                        label: t('logsPage.action') || 'Action',
                        value: actionFilter,
                        options: [
                            { value: 'all', label: t('common.all') || 'All' },
                            { value: 'login', label: t('logsPage.actionLogin') || 'Login' },
                            { value: 'logout', label: t('logsPage.actionLogout') || 'Logout' },
                            { value: 'access', label: t('logsPage.actionAccess') || 'Access' }
                        ]
                    }
                ]}
                onFilterChange={(key, value) => setActionFilter(value)}
                resultCount={filteredLogs.length}
                totalCount={logs.length}
            />

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('logsPage.datetime') || 'Date & Time'}</th>
                                <th>{t('logsPage.admin') || 'Admin'}</th>
                                <th>{t('logsPage.action') || 'Action'}</th>
                                <th>{t('logsPage.browser') || 'Browser'}</th>
                                <th>{t('logsPage.details') || 'Details'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('common.loading') || 'Loading...'}</td></tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('logsPage.noLogs') || 'No logs found'}</td></tr>
                            ) : filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td style={{ color: '#94a3b8', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                        {formatDate(log.created_at)}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {log.admin_email || '-'}
                                    </td>
                                    <td>
                                        <span style={{ 
                                            display: 'inline-flex', 
                                            alignItems: 'center', 
                                            gap: '0.5rem',
                                            padding: '0.25rem 0.75rem',
                                            background: log.action === 'login' 
                                                ? 'rgba(16, 185, 129, 0.1)' 
                                                : log.action === 'logout' 
                                                    ? 'rgba(239, 68, 68, 0.1)' 
                                                    : 'rgba(59, 130, 246, 0.1)',
                                            color: log.action === 'login' 
                                                ? '#10b981' 
                                                : log.action === 'logout' 
                                                    ? '#ef4444' 
                                                    : '#3b82f6',
                                            borderRadius: '0.25rem',
                                            fontSize: '0.875rem'
                                        }}>
                                            {getActionIcon(log.action)}
                                            {getActionLabel(log.action)}
                                        </span>
                                    </td>
                                    <td style={{ color: '#94a3b8' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Globe size={14} />
                                            {getBrowserInfo(log.user_agent)}
                                        </span>
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.75rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {log.metadata?.path || '-'}
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
