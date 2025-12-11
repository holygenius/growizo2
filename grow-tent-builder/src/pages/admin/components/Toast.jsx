import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import styles from '../Admin.module.css';

/**
 * Toast Notifications Component
 */
export const ToastContainer = () => {
    const { toasts, removeToast } = useAdmin();

    if (toasts.length === 0) return null;

    const icons = {
        success: <CheckCircle size={20} color="#10b981" />,
        error: <AlertCircle size={20} color="#ef4444" />,
        warning: <AlertTriangle size={20} color="#f59e0b" />,
        info: <Info size={20} color="#3b82f6" />
    };

    const bgColors = {
        success: 'rgba(16, 185, 129, 0.1)',
        error: 'rgba(239, 68, 68, 0.1)',
        warning: 'rgba(245, 158, 11, 0.1)',
        info: 'rgba(59, 130, 246, 0.1)'
    };

    const borderColors = {
        success: 'rgba(16, 185, 129, 0.3)',
        error: 'rgba(239, 68, 68, 0.3)',
        warning: 'rgba(245, 158, 11, 0.3)',
        info: 'rgba(59, 130, 246, 0.3)'
    };

    return (
        <div style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '400px'
        }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: bgColors[toast.type] || bgColors.info,
                        border: `1px solid ${borderColors[toast.type] || borderColors.info}`,
                        borderRadius: '0.75rem',
                        backdropFilter: 'blur(10px)',
                        animation: 'slideIn 0.3s ease'
                    }}
                >
                    {icons[toast.type] || icons.info}
                    <span style={{ flex: 1, color: '#fff', fontSize: '0.875rem' }}>
                        {toast.message}
                    </span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '0.25rem'
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

/**
 * Confirm Dialog Component
 */
export const ConfirmDialog = () => {
    const { confirmDialog, t } = useAdmin();

    if (!confirmDialog) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998
        }}>
            <div style={{
                background: 'rgba(20, 27, 45, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center'
            }}>
                <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1rem' }}>
                    {confirmDialog.message}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={confirmDialog.onCancel}
                        className={styles.actionBtn}
                        style={{ 
                            flexDirection: 'row', 
                            padding: '0.75rem 1.5rem', 
                            height: 'auto' 
                        }}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={confirmDialog.onConfirm}
                        className={styles.actionBtn}
                        style={{ 
                            flexDirection: 'row', 
                            padding: '0.75rem 1.5rem', 
                            height: 'auto',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none'
                        }}
                    >
                        {t('delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToastContainer;
