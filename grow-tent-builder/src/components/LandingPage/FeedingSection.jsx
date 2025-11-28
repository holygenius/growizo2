import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function FeedingSection() {
    const { t, getLocalizedPath } = useSettings();

    return (
        <section className="feeding-section">
            <div className="section-header">
                <h2>🌱 {t('landingFeedingTitle')}</h2>
                <p>{t('landingFeedingDesc')}</p>
            </div>
            <div className="feeding-grid">
                <Link to={getLocalizedPath('/tools/feeding-schedule')} className="feeding-card biobizz">
                    <div className="feeding-icon-wrapper">
                        <img
                            src="/images/cropped-Biobizz-Icon-Brown-Texture-180x180.jpg"
                            alt="BioBizz"
                            className="feeding-icon-img"
                        />
                    </div>
                    <div className="feeding-content">
                        <h3>{t('biobizzTitle')}</h3>
                        <p>{t('biobizzDesc')}</p>
                        <span className="brand-tag">BioBizz</span>
                    </div>
                    <div className="feeding-arrow">→</div>
                </Link>

                <Link to={getLocalizedPath('/feeding/advanced-nutrients')} className="feeding-card advanced-nutrients">
                    <div className="feeding-icon-wrapper">
                        <img src="/images/advanced-nutrients-logo.png" alt="Advanced Nutrients" className="feeding-icon-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div className="feeding-content">
                        <h3>{t('anFeedingScheduleTitle')}</h3>
                        <p>{t('anFeedingScheduleSubtitle')}</p>
                        <span className="brand-tag">Advanced Nutrients</span>
                    </div>
                    <div className="feeding-arrow">→</div>
                </Link>
            </div>
        </section>
    );
}
