import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Footer from './Footer';
import Navbar from './Navbar';
import {
    HeroSection,
    ToolsPreviewSection,
    FeaturesSection,
    InfoBoxesSection,
    PPFDSection,
    FeedingSection,
    FeaturedGuidesSection,
    CostToolSection,
    FAQSection,
    BlogPreviewSection,
    ScrollToTopButton,
    BackgroundEffects
} from './LandingPage/index';
import './LandingPage.css';

export default function LandingPage() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { getBuilderUrl, t, language } = useSettings();
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: (e.clientX / window.innerWidth) - 0.5, y: (e.clientY / window.innerHeight) - 0.5 });
        };

        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleStartBuilding = () => {
        navigate(getBuilderUrl());
    };

    return (
        <div className="landing-container">
            <Helmet>
                <title>{t('landingTitle')} | GroWizard</title>
                <meta name="description" content={t('landingSubtitle')} />
                <link rel="canonical" href={`https://www.growizard.app/${language}`} />
                <link rel="alternate" hreflang="en" href="https://www.growizard.app/en" />
                <link rel="alternate" hreflang="tr" href="https://www.growizard.app/tr" />
                <link rel="alternate" hreflang="x-default" href="https://www.growizard.app/en" />
                <meta property="og:url" content={`https://www.growizard.app/${language}`} />
                <meta property="og:locale" content={language === 'tr' ? 'tr_TR' : 'en_US'} />
                {language === 'en' && <meta property="og:locale:alternate" content="tr_TR" />}
                {language === 'tr' && <meta property="og:locale:alternate" content="en_US" />}
            </Helmet>
            
            <BackgroundEffects mousePos={mousePos} />
            <Navbar />
            <HeroSection mousePos={mousePos} onStartBuilding={handleStartBuilding} />
            <ToolsPreviewSection />
            <FeaturesSection />
            <InfoBoxesSection />
            <PPFDSection />
            <FeedingSection />
            <FeaturedGuidesSection />
            <CostToolSection />
            <FAQSection />
            <BlogPreviewSection />
            <Footer />
            <ScrollToTopButton visible={showScrollTop} />
        </div>
    );
}
