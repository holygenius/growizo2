import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function FeaturesSection() {
    const { t } = useSettings();

    return (
        <section className="features-section">
            <div className="feature-card slide-in" style={{ transitionDelay: '0.1s' }}>
                <div className="feature-icon">💡</div>
                <h3>{t('landingPpfdTitle')}</h3>
                <p>{t('landingPpfdDesc')}</p>
            </div>
            <div className="feature-card slide-in" style={{ transitionDelay: '0.3s' }}>
                <div className="feature-icon">🌬️</div>
                <h3>{t('landingEnvTitle')}</h3>
                <p>{t('landingEnvDesc')}</p>
            </div>
        </section>
    );
}
