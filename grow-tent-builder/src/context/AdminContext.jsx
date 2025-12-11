import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminTranslations } from '../utils/translations/admin';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
    // Get initial language from localStorage or browser
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('adminLanguage');
        if (saved && (saved === 'en' || saved === 'tr')) return saved;
        // Detect from browser
        const browserLang = navigator.language?.split('-')[0];
        return browserLang === 'tr' ? 'tr' : 'en';
    });

    // Persist language choice
    useEffect(() => {
        localStorage.setItem('adminLanguage', language);
    }, [language]);

    // Translation function - supports dot notation (e.g., 'users.title')
    const t = useCallback((key, fallback = null) => {
        // First try flat key
        let translation = adminTranslations[language]?.[key];
        if (translation !== undefined) return translation;
        
        // Try dot notation (e.g., 'users.title' -> translations.users.title)
        if (key.includes('.')) {
            const keys = key.split('.');
            let value = adminTranslations[language];
            for (const k of keys) {
                value = value?.[k];
            }
            if (value !== undefined) return value;
        }
        
        // Fallback to English if Turkish missing
        if (language !== 'en') {
            let enTranslation = adminTranslations.en?.[key];
            if (enTranslation !== undefined) return enTranslation;
            
            // Try dot notation in English
            if (key.includes('.')) {
                const keys = key.split('.');
                let value = adminTranslations.en;
                for (const k of keys) {
                    value = value?.[k];
                }
                if (value !== undefined) return value;
            }
        }
        
        // Return fallback or key itself
        return fallback || key;
    }, [language]);

    // Toggle language
    const toggleLanguage = useCallback(() => {
        setLanguage(prev => prev === 'en' ? 'tr' : 'en');
    }, []);

    // Sidebar collapsed state (for UX improvement)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Toast notifications state
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState(null);

    const showConfirm = useCallback((message, onConfirm, onCancel = null) => {
        return new Promise((resolve) => {
            setConfirmDialog({
                message,
                onConfirm: () => {
                    setConfirmDialog(null);
                    if (onConfirm) onConfirm();
                    resolve(true);
                },
                onCancel: () => {
                    setConfirmDialog(null);
                    if (onCancel) onCancel();
                    resolve(false);
                }
            });
        });
    }, []);

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t,
        sidebarCollapsed,
        setSidebarCollapsed,
        toasts,
        addToast,
        removeToast,
        confirmDialog,
        showConfirm
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

export default AdminContext;
