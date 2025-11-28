import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function HeroSection({ mousePos, onStartBuilding }) {
    const { t } = useSettings();

    return (
        <section className="hero-section">
            <div className="hero-content fade-in-up">
                <div className="badge">{t('landingBadge')}</div>
                <h1 className="hero-title">
                    {t('landingTitle').split(' ').slice(0, 2).join(' ')} <br />
                    <span className="gradient-text">{t('landingTitle').split(' ').slice(2).join(' ')}</span>
                </h1>
                <p className="hero-subtitle">
                    {t('landingSubtitle')}
                </p>
                <button onClick={onStartBuilding} className="cta-button">
                    {t('landingCta')}
                    <span className="arrow">→</span>
                </button>
            </div>

            {/* 3D-like Visual Representation */}
            <div className="hero-visual" style={{
                transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`
            }}>
                <div className="tent-frame">
                    <div className="plant-icon">🌿</div>
                    <div className="light-beam" />
                </div>
            </div>
        </section>
    );
}
