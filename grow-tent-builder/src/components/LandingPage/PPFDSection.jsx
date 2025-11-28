import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export default function PPFDSection() {
    const { t, getLocalizedPath } = useSettings();

    return (
        <section className="ppfd-section">
            <div className="section-header">
                <h2>🌈 {t('landingPpfdMapTitle')}</h2>
                <p>{t('landingPpfdMapDesc')}</p>
            </div>
            <div className="ppfd-visual-container">
                <div className="ppfd-card-3d">
                    <div className="ppfd-overlay">
                        <span className="ppfd-badge">3D Mode</span>
                    </div>
                    <div className="ppfd-placeholder-3d">
                        <div className="grid-floor"></div>
                        <div className="heat-cone"></div>
                    </div>
                </div>
                <div className="ppfd-card-2d">
                    <div className="ppfd-overlay">
                        <span className="ppfd-badge">2D Mode</span>
                    </div>
                    <div className="ppfd-placeholder-2d">
                        <div className="heat-circle c1"></div>
                        <div className="heat-circle c2"></div>
                        <div className="heat-circle c3"></div>
                    </div>
                </div>
            </div>
            <div className="center-btn">
                <Link to={getLocalizedPath('/tools/ppfd-heatmap')} className="cta-button secondary">
                    {t('landingPpfdTitle')} <span className="arrow">→</span>
                </Link>
            </div>
        </section>
    );
}
