import React, { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';
import './FeaturesSection.css';

export default function FeaturesSection() {
    const { t } = useSettings();
    const [activeIndex, setActiveIndex] = useState(0);

    const features = [
        {
            icon: 'mdi:view-dashboard',
            title: t('featureBuilderTitle'),
            desc: t('featureBuilderDesc'),
            color: '#22c55e'
        },
        {
            icon: 'mdi:lightbulb-on',
            title: t('featurePPFDTitle'),
            desc: t('featurePPFDDesc'),
            color: '#fbbf24'
        },
        {
            icon: 'mdi:flash',
            title: t('featureEnergyTitle'),
            desc: t('featureEnergyDesc'),
            color: '#3b82f6'
        },
        {
            icon: 'mdi:check-decagram',
            title: t('featureCompatTitle'),
            desc: t('featureCompatDesc'),
            color: '#a855f7'
        }
    ];

    // Auto-advance every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <section className="features-section">
            <div className="spotlight-content" key={activeIndex}>
                <div 
                    className="spotlight-icon-circle"
                    style={{ '--glow-color': features[activeIndex].color }}
                >
                    <Icon icon={features[activeIndex].icon} size={50} />
                </div>
                <div className="spotlight-text">
                    <h3>{features[activeIndex].title}</h3>
                    <p>{features[activeIndex].desc}</p>
                </div>
            </div>

            <div className="deck-dots">
                {features.map((_, idx) => (
                    <button 
                        key={idx} 
                        className={`deck-dot ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Go to feature ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
