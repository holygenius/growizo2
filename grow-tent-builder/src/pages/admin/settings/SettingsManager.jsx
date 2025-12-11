import React from 'react';
import { Globe, Moon, Sun, Bell, Save, RefreshCw } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import styles from '../Admin.module.css';

const SettingsManager = () => {
    const { t, language, setLanguage, addToast } = useAdmin();

    const handleSave = () => {
        addToast(t('savedSuccessfully'), 'success');
    };

    return (
        <div>
            <div className={styles.topBar} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('generalSettings')}</h2>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
                {/* Language Settings */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>
                            <Globe size={20} style={{ marginRight: '0.5rem' }} />
                            {t('language')}
                        </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setLanguage('en')}
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '1.5rem',
                                background: language === 'en' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                                border: language === 'en' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '1rem',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>🇬🇧</span>
                            <span style={{ fontWeight: 600 }}>{t('english')}</span>
                        </button>
                        <button
                            onClick={() => setLanguage('tr')}
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '1.5rem',
                                background: language === 'tr' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                                border: language === 'tr' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '1rem',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>🇹🇷</span>
                            <span style={{ fontWeight: 600 }}>{t('turkish')}</span>
                        </button>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>
                            <Bell size={20} style={{ marginRight: '0.5rem' }} />
                            {t('notifications')}
                        </h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '1rem',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}>
                            <input type="checkbox" defaultChecked style={{ width: '1.25rem', height: '1.25rem' }} />
                            <div>
                                <div style={{ color: '#fff', fontWeight: 500 }}>{t('enableNotifications')}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                                    {language === 'tr' ? 'Yeni etkinlikler için bildirim al' : 'Receive notifications for new activities'}
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* App Info */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>
                            {language === 'tr' ? 'Uygulama Bilgisi' : 'App Information'}
                        </h3>
                    </div>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: '#94a3b8' }}>{language === 'tr' ? 'Versiyon' : 'Version'}</span>
                            <span style={{ color: '#fff', fontFamily: 'monospace' }}>1.0.0</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ color: '#94a3b8' }}>{language === 'tr' ? 'Ortam' : 'Environment'}</span>
                            <span style={{ color: '#10b981', fontFamily: 'monospace' }}>Production</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
                            <span style={{ color: '#94a3b8' }}>{language === 'tr' ? 'Son Güncelleme' : 'Last Updated'}</span>
                            <span style={{ color: '#fff' }}>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Export/Import */}
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>
                            {t('exportData')} / {t('importData')}
                        </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            className={styles.actionBtn}
                            style={{ 
                                flexDirection: 'row', 
                                padding: '0.75rem 1.5rem', 
                                height: 'auto',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}
                            onClick={() => addToast(language === 'tr' ? 'JSON olarak dışa aktarıldı' : 'Exported as JSON', 'success')}
                        >
                            {t('exportAsJson')}
                        </button>
                        <button
                            className={styles.actionBtn}
                            style={{ 
                                flexDirection: 'row', 
                                padding: '0.75rem 1.5rem', 
                                height: 'auto',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}
                            onClick={() => addToast(language === 'tr' ? 'CSV olarak dışa aktarıldı' : 'Exported as CSV', 'success')}
                        >
                            {t('exportAsCsv')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
