import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import Icon from '../Common/Icon';
import './FeaturesSection.css';

export default function FeaturesSection() {
    const { t } = useSettings();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const features = useMemo(() => [
        {
            id: 'builder',
            icon: 'mdi:view-dashboard',
            color: '#22c55e',
            bgColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 0.2)',
            cardBg: 'rgba(6, 78, 59, 0.4)',
            cardBorder: 'rgba(34, 197, 94, 0.2)',
            cardShadow: 'rgba(34, 197, 94, 0.2)',
            glowColor: 'rgba(34, 197, 94, 0.3)',
            title: t('featureBuilderTitle'),
            desc: t('featureBuilderDesc'),
            visual: 'builder'
        },
        {
            id: 'ppfd',
            icon: 'mdi:lightbulb-on',
            color: '#fbbf24',
            bgColor: 'rgba(251, 191, 36, 0.1)',
            borderColor: 'rgba(251, 191, 36, 0.2)',
            cardBg: 'rgba(75, 58, 6, 0.4)',
            cardBorder: 'rgba(251, 191, 36, 0.2)',
            cardShadow: 'rgba(251, 191, 36, 0.2)',
            glowColor: 'rgba(251, 191, 36, 0.3)',
            title: t('featurePPFDTitle'),
            desc: t('featurePPFDDesc'),
            visual: 'ppfd'
        },
        {
            id: 'energy',
            icon: 'mdi:flash',
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.2)',
            cardBg: 'rgba(30, 58, 138, 0.4)',
            cardBorder: 'rgba(59, 130, 246, 0.2)',
            cardShadow: 'rgba(59, 130, 246, 0.2)',
            glowColor: 'rgba(59, 130, 246, 0.3)',
            title: t('featureEnergyTitle'),
            desc: t('featureEnergyDesc'),
            visual: 'energy'
        },
        {
            id: 'compat',
            icon: 'mdi:check-decagram',
            color: '#a855f7',
            bgColor: 'rgba(168, 85, 247, 0.1)',
            borderColor: 'rgba(168, 85, 247, 0.2)',
            cardBg: 'rgba(88, 28, 135, 0.4)',
            cardBorder: 'rgba(168, 85, 247, 0.2)',
            cardShadow: 'rgba(168, 85, 247, 0.2)',
            glowColor: 'rgba(168, 85, 247, 0.3)',
            title: t('featureCompatTitle'),
            desc: t('featureCompatDesc'),
            visual: 'compat'
        }
    ], [t]);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, features.length]);

    const currentFeature = features[currentIndex];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % features.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
        setIsAutoPlaying(false);
    };

    const renderVisual = () => {
        switch (currentFeature.visual) {
            case 'builder':
                return (
                    <div className="feature-visual">
                        <div className="builder-dashed-border" />
                        <div className="builder-grid">
                            <div className="builder-box filled" />
                            <div className="builder-box filled" />
                            <div className="builder-box filled" />
                            <div className="builder-box empty" />
                        </div>
                    </div>
                );
            case 'ppfd':
                return (
                    <div className="feature-visual">
                        <div className="ppfd-glow" />
                        <div className="ppfd-grid">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="ppfd-cell" />
                            ))}
                        </div>
                        <div className="ppfd-value">950</div>
                    </div>
                );
            case 'energy':
                return (
                    <div className="feature-visual energy-visual">
                        {[40, 70, 50, 80, 60].map((h, i) => (
                            <div key={i} className="energy-bar-container">
                                <div 
                                    className="energy-bar-fill"
                                    style={{ height: `${h}%` }}
                                />
                            </div>
                        ))}
                    </div>
                );
            case 'compat':
                return (
                    <div className="feature-visual compat-visual">
                        <div className="compat-item">
                            <Icon icon="mdi:check-circle" size={16} />
                            <span>Voltage Match</span>
                        </div>
                        <div className="compat-item">
                            <Icon icon="mdi:check-circle" size={16} />
                            <span>Dimensions OK</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <section className="features-section">
            <div className="features-container">
                <div 
                    className="carousel-container"
                    style={{
                        backgroundColor: currentFeature.cardBg,
                        borderColor: currentFeature.cardBorder,
                        boxShadow: `0 25px 50px -12px ${currentFeature.cardShadow}`
                    }}
                >
                    <div className="carousel-grid">
                        {/* Left Side: Content */}
                        <div className="content-side">
                            <div 
                                className="icon-circle"
                                style={{ 
                                    backgroundColor: currentFeature.bgColor,
                                    color: currentFeature.color
                                }}
                            >
                                <Icon icon={currentFeature.icon} size={28} />
                            </div>
                            
                            <div className="text-content">
                                <h2>{currentFeature.title}</h2>
                                <p>{currentFeature.desc}</p>
                            </div>

                            {/* Navigation Controls */}
                            <div className="nav-controls">
                                <button 
                                    className="nav-btn"
                                    onClick={prevSlide}
                                    aria-label="Previous feature"
                                >
                                    <Icon icon="mdi:chevron-left" size={24} />
                                </button>
                                
                                <div className="progress-dots">
                                    {features.map((feature, idx) => (
                                        <button
                                            key={idx}
                                            className={`dot ${idx === currentIndex ? 'active' : ''}`}
                                            style={{ 
                                                backgroundColor: idx === currentIndex ? feature.color : undefined
                                            }}
                                            onClick={() => {
                                                setCurrentIndex(idx);
                                                setIsAutoPlaying(false);
                                            }}
                                            aria-label={`Go to ${feature.title}`}
                                        />
                                    ))}
                                </div>

                                <button 
                                    className="nav-btn"
                                    onClick={nextSlide}
                                    aria-label="Next feature"
                                >
                                    <Icon icon="mdi:chevron-right" size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Right Side: Visual Preview */}
                        <div className="visual-side">
                            <div className="visual-content">
                                <div 
                                    className="visual-inner"
                                    style={{
                                        borderColor: currentFeature.borderColor,
                                    }}
                                >
                                    {renderVisual()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
