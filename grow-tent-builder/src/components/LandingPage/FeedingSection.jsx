import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';

export default function FeedingSection() {
    const { t, getLocalizedPath } = useSettings();

    return (
        <section className="feeding-section">
            <div className="section-header">
                <h2><Icon icon="mdi:leaf" size={24} /> {t('landingFeedingTitle')}</h2>
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
                    <div className="feeding-arrow"><Icon icon="mdi:arrow-right" size={20} /></div>
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
                    <div className="feeding-arrow"><Icon icon="mdi:arrow-right" size={20} /></div>
                </Link>

                <Link to={getLocalizedPath('/feeding/canna')} className="feeding-card canna">
                    <div className="feeding-icon-wrapper">
                        <img src="/images/canna-logo.svg" alt="CANNA" className="feeding-icon-img" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div className="feeding-content">
                        <h3>{t('cannaScheduleTitle')}</h3>
                        <p>{t('cannaScheduleSubtitle')}</p>
                        <span className="brand-tag">CANNA</span>
                    </div>
                    <div className="feeding-arrow"><Icon icon="mdi:arrow-right" size={20} /></div>
                </Link>
            </div>
        </section>
    );
}
