import React from 'react';
import { Globe } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import styles from '../Admin.module.css';

/**
 * Language Switcher Component for Admin Panel
 */
const LanguageSwitcher = ({ compact = false }) => {
    const { language, setLanguage, t } = useAdmin();

    if (compact) {
        return (
            <button
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className={styles.iconBtn}
                title={t('language')}
                style={{ position: 'relative' }}
            >
                <Globe size={20} />
                <span style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    background: '#3b82f6',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '1px 3px',
                    lineHeight: 1
                }}>
                    {language}
                </span>
            </button>
        );
    }

    return (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '0.5rem',
            padding: '0.25rem'
        }}>
            <button
                onClick={() => setLanguage('en')}
                style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: language === 'en' ? '#3b82f6' : 'transparent',
                    color: language === 'en' ? '#fff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                }}
            >
                EN
            </button>
            <button
                onClick={() => setLanguage('tr')}
                style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: 'none',
                    background: language === 'tr' ? '#3b82f6' : 'transparent',
                    color: language === 'tr' ? '#fff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                }}
            >
                TR
            </button>
        </div>
    );
};

export default LanguageSwitcher;
