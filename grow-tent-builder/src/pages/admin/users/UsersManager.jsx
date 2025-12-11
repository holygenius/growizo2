import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Shield, Users, UserCheck } from 'lucide-react';
import styles from '../Admin.module.css';
import TableFilter from '../components/TableFilter';
import { useAdmin } from '../../../context/AdminContext';

// Form for assigning/editing admin role
const AdminForm = ({ initialData, allUsers, existingAdminIds, onClose, onSuccess }) => {
    const { t } = useAdmin();
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        display_name: '',
        role: 'editor',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    // Filter out users who are already admins
    const availableUsers = allUsers.filter(u => !existingAdminIds.includes(u.id));

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleUserSelect = (userId) => {
        const selectedUser = allUsers.find(u => u.id === userId);
        if (selectedUser) {
            setFormData({
                ...formData,
                id: selectedUser.id,
                email: selectedUser.email,
                display_name: selectedUser.full_name || selectedUser.email.split('@')[0]
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData?.id) {
                await adminService.update('admin_users', initialData.id, {
                    display_name: formData.display_name,
                    role: formData.role,
                    is_active: formData.is_active
                });
            } else {
                await adminService.create('admin_users', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving admin:', error);
            alert(t('usersPage.errorSaving'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? t('usersPage.editUser') : t('usersPage.assignRole')}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {!initialData && (
                    <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('usersPage.selectUser')}</label>
                        <select
                            value={formData.id}
                            onChange={e => handleUserSelect(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                            required
                        >
                            <option value="">{t('usersPage.selectUserPlaceholder')}</option>
                            {availableUsers.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.full_name || user.email} ({user.email})
                                </option>
                            ))}
                        </select>
                        {availableUsers.length === 0 && (
                            <p style={{ color: '#f59e0b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                {t('usersPage.noAvailableUsers')}
                            </p>
                        )}
                    </div>
                )}

                {(initialData || formData.id) && (
                    <>
                        <div className={styles.inputGroup}>
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('usersPage.displayName')}</label>
                            <input
                                type="text"
                                value={formData.display_name || ''}
                                onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>{t('usersPage.role')}</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                            >
                                <option value="editor">{t('usersPage.roleEditor')}</option>
                                <option value="admin">{t('usersPage.roleAdmin')}</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                    style={{ width: '1.25rem', height: '1.25rem' }}
                                />
                                {t('usersPage.activeStatus')}
                            </label>
                        </div>
                    </>
                )}

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        {t('common.cancel')}
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading || (!initialData && !formData.id)} 
                        className={styles.actionBtn} 
                        style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none', opacity: (!initialData && !formData.id) ? 0.5 : 1 }}
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        {t('common.save')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function UsersManager() {
    const { t, showConfirm, addToast } = useAdmin();
    const [allUsers, setAllUsers] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'admins'
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [providerFilter, setProviderFilter] = useState('all');

    // Get unique providers
    const providers = useMemo(() => {
        const provs = [...new Set(allUsers.map(u => u.provider || 'email').filter(Boolean))];
        return provs.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }));
    }, [allUsers]);

    // Filter all users
    const filteredAllUsers = useMemo(() => {
        return allUsers.filter(user => {
            const matchesSearch = !searchTerm || 
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesProvider = providerFilter === 'all' || (user.provider || 'email') === providerFilter;
            return matchesSearch && matchesProvider;
        });
    }, [allUsers, searchTerm, providerFilter]);

    // Filter admin users
    const filteredAdminUsers = useMemo(() => {
        return adminUsers.filter(admin => {
            const matchesSearch = !searchTerm || 
                admin.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                admin.email?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
            return matchesSearch && matchesRole;
        });
    }, [adminUsers, searchTerm, roleFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersRes, adminsRes] = await Promise.all([
                adminService.getAll('users', { orderBy: { column: 'created_at', ascending: false } }),
                adminService.getAll('admin_users')
            ]);
            setAllUsers(usersRes.data || []);
            setAdminUsers(adminsRes.data || []);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleRevokeAdmin = async (id) => {
        const confirmed = await showConfirm(
            t('usersPage.confirmRevoke'),
            t('usersPage.confirmRevokeMessage')
        );
        if (confirmed) {
            try {
                await adminService.delete('admin_users', id);
                addToast(t('usersPage.accessRevoked'), 'success');
                loadData();
            } catch (error) {
                console.error('Error revoking admin:', error);
                addToast(t('common.error'), 'error');
            }
        }
    };

    const existingAdminIds = adminUsers.map(a => a.id);

    // Check if a user is an admin
    const isAdmin = (userId) => existingAdminIds.includes(userId);

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('tr-TR', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('usersPage.title')}</h2>
                <button
                    onClick={() => { setSelectedAdmin(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> {t('usersPage.assignRole')}
                </button>
            </div>

            {isEditing && (
                <AdminForm
                    initialData={selectedAdmin}
                    allUsers={allUsers}
                    existingAdminIds={existingAdminIds}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                    onClick={() => setActiveTab('all')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'all' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: activeTab === 'all' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: activeTab === 'all' ? '#60a5fa' : '#94a3b8',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500
                    }}
                >
                    <Users size={16} />
                    {t('usersPage.allUsers')} ({allUsers.length})
                </button>
                <button
                    onClick={() => setActiveTab('admins')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: activeTab === 'admins' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                        border: activeTab === 'admins' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: activeTab === 'admins' ? '#34d399' : '#94a3b8',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500
                    }}
                >
                    <Shield size={16} />
                    {t('usersPage.adminUsers')} ({adminUsers.length})
                </button>
            </div>

            {/* All Users Tab */}
            {activeTab === 'all' && (
                <>
                <TableFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={t('filter') + ' ' + t('users').toLowerCase() + '...'}
                    filters={[
                        {
                            key: 'provider',
                            label: t('usersPage.provider'),
                            value: providerFilter,
                            options: providers
                        }
                    ]}
                    onFilterChange={(key, value) => setProviderFilter(value)}
                    resultCount={filteredAllUsers.length}
                    totalCount={allUsers.length}
                />
                <div className={styles.panel}>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>{t('usersPage.name')}</th>
                                    <th>{t('usersPage.email')}</th>
                                    <th>{t('usersPage.provider')}</th>
                                    <th>{t('usersPage.registeredAt')}</th>
                                    <th>{t('usersPage.status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('common.loading')}</td></tr>
                                ) : filteredAllUsers.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('usersPage.noUsers')}</td></tr>
                                ) : filteredAllUsers.map(user => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: 600 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {user.avatar_url && (
                                                    <img 
                                                        src={user.avatar_url} 
                                                        alt="" 
                                                        style={{ width: 28, height: 28, borderRadius: '50%' }}
                                                    />
                                                )}
                                                {user.full_name || '-'}
                                            </div>
                                        </td>
                                        <td style={{ color: '#94a3b8' }}>{user.email}</td>
                                        <td>
                                            <span style={{ 
                                                textTransform: 'capitalize', 
                                                background: 'rgba(255,255,255,0.05)', 
                                                padding: '0.25rem 0.5rem', 
                                                borderRadius: '0.25rem',
                                                fontSize: '0.75rem'
                                            }}>
                                                {user.provider || 'email'}
                                            </span>
                                        </td>
                                        <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td>
                                            {isAdmin(user.id) ? (
                                                <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                                                    <Shield size={12} />
                                                    {t('usersPage.isAdmin')}
                                                </span>
                                            ) : (
                                                <span className={`${styles.badge} ${styles.badgeInfo}`}>
                                                    <UserCheck size={12} />
                                                    {t('usersPage.regularUser')}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
            )}

            {/* Admin Users Tab */}
            {activeTab === 'admins' && (
                <>
                <TableFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder={t('filter') + ' ' + t('usersPage.adminUsers').toLowerCase() + '...'}
                    filters={[
                        {
                            key: 'role',
                            label: t('usersPage.role'),
                            value: roleFilter,
                            options: [
                                { value: 'admin', label: t('usersPage.roleAdmin') },
                                { value: 'editor', label: t('usersPage.roleEditor') }
                            ]
                        }
                    ]}
                    onFilterChange={(key, value) => setRoleFilter(value)}
                    resultCount={filteredAdminUsers.length}
                    totalCount={adminUsers.length}
                />
                <div className={styles.panel}>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>{t('usersPage.name')}</th>
                                    <th>{t('usersPage.email')}</th>
                                    <th>{t('usersPage.role')}</th>
                                    <th>{t('usersPage.status')}</th>
                                    <th>{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>{t('common.loading')}</td></tr>
                                ) : filteredAdminUsers.length === 0 ? (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>{t('usersPage.noAdmins')}</td></tr>
                                ) : filteredAdminUsers.map(admin => (
                                    <tr key={admin.id}>
                                        <td style={{ fontWeight: 600 }}>{admin.display_name || '-'}</td>
                                        <td style={{ color: '#94a3b8' }}>{admin.email}</td>
                                        <td>
                                            <span className={`${styles.badge} ${admin.role === 'admin' ? styles.badgeSuccess : styles.badgeInfo}`}>
                                                <Shield size={12} />
                                                {admin.role === 'admin' ? t('usersPage.roleAdmin') : t('usersPage.roleEditor')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${admin.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                {admin.is_active ? t('usersPage.active') : t('usersPage.revoked')}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => { setSelectedAdmin(admin); setIsEditing(true); }}
                                                    className={styles.iconBtn}
                                                    style={{ width: '2rem', height: '2rem' }}
                                                    title={t('edit')}
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleRevokeAdmin(admin.id)}
                                                    className={styles.iconBtn}
                                                    style={{ width: '2rem', height: '2rem', color: '#f87171' }}
                                                    title={t('usersPage.revokeAccess')}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
            )}
        </div>
    );
}
