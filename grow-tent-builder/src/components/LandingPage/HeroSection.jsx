import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import './HeroSection.css';
import BloomingLeaves from './BloomingLeaves';

export default function HeroSection({ onStartBuilding }) {
    const { t } = useSettings();

    return (
        <section className="hero-section">
            <div className="hero-content animate-fade-in-up">
                <div className="hero-badge">
                    <span className="pulse-dot" />
                    {t('landingBadge')}
                </div>
                <h1 className="hero-title">
                    {t('landingTitle').split(' ').slice(0, 2).join(' ')} <br />
                    <span className="gradient-text">{t('landingTitle').split(' ').slice(2).join(' ')}</span>
                </h1>
                <p className="hero-subtitle">{t('landingSubtitle')}</p>
                <button onClick={onStartBuilding} className="cta-button animate-fade-in-up delay-100">
                    {t('landingCta')}
                    <span className="arrow">→</span>
                </button>
            </div>
            <BloomingLeaves />
        </section>
    );
}
