import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Trash2, Edit2, Plus, X, Save, RefreshCw, Shield } from 'lucide-react';
import styles from '../Admin.module.css';

const UserForm = ({ initialData, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        id: '', // UUID from Auth
        email: '',
        display_name: '',
        role: 'editor',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Note: We cannot CREATE a new Auth user here easily without Admin API
            // So this form assumes we are adding an existing Auth user to the admin_users table
            // or editing an existing admin user.

            if (initialData?.id) {
                // Updating existing admin user
                await adminService.update('admin_users', initialData.id, {
                    display_name: formData.display_name,
                    role: formData.role,
                    is_active: formData.is_active
                });
            } else {
                // Creating new admin entry (requires valid Auth UUID)
                await adminService.create('admin_users', formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user. Ensure ID is a valid Supabase Auth UUID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.panel} style={{ marginBottom: '2rem' }}>
            <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>{initialData ? 'Edit Admin User' : 'Assign Admin Role'}</h3>
                <button onClick={onClose} className={styles.iconBtn}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.alert} style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '0.5rem', color: '#93c5fd', fontSize: '0.875rem' }}>
                        <strong>Note:</strong> To make a user an admin, they must first sign in to the app to have a User ID. Paste their ID below.
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>User UUID</label>
                    <input
                        type="text"
                        value={formData.id}
                        onChange={e => setFormData({ ...formData, id: e.target.value })}
                        disabled={!!initialData} // Cannot change ID once linked
                        style={{ width: '100%', padding: '0.75rem', background: initialData ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: initialData ? '#64748b' : '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Email (Reference)</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Display Name</label>
                    <input
                        type="text"
                        value={formData.display_name || ''}
                        onChange={e => setFormData({ ...formData, display_name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Role</label>
                    <select
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '0.5rem' }}
                    >
                        <option value="editor">Editor</option>
                        <option value="admin">Super Admin</option>
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
                        Active (Has Admin Access)
                    </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" onClick={onClose} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto' }}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className={styles.actionBtn} style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#10b981', color: '#fff', border: 'none' }}>
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                        Save User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default function UsersManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const { data } = await adminService.getAll('admin_users');
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Revoke admin access for this user?')) {
            try {
                await adminService.delete('admin_users', id);
                loadData();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>User Management</h2>
                <button
                    onClick={() => { setSelectedUser(null); setIsEditing(true); }}
                    className={styles.actionBtn}
                    style={{ flexDirection: 'row', padding: '0.75rem 1.5rem', height: 'auto', background: '#3b82f6', color: '#fff', border: 'none' }}
                >
                    <Plus size={20} /> Assign Role
                </button>
            </div>

            {isEditing && (
                <UserForm
                    initialData={selectedUser}
                    onClose={() => setIsEditing(false)}
                    onSuccess={loadData}
                />
            )}

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No admin users found</td></tr>
                            ) : users.map(user => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: 600 }}>{user.display_name || '-'}</td>
                                    <td style={{ color: '#94a3b8' }}>{user.email}</td>
                                    <td>
                                        <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeSuccess : styles.badgeInfo}`}>
                                            <Shield size={12} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${user.is_active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {user.is_active ? 'Active' : 'Revoked'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => { setSelectedUser(user); setIsEditing(true); }}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem' }}
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className={styles.iconBtn}
                                                style={{ width: '2rem', height: '2rem', color: '#f87171' }}
                                                title="Revoke Access"
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
        </div>
    );
}
