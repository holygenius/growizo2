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
    ScrollToTopButton
} from './LandingPage/index';
import './LandingPage.css';
import { BASE_URL, LANGUAGES, LOCALES } from '../config/constants';

export default function LandingPage() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { getBuilderUrl, t, language } = useSettings();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
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
                <link rel="canonical" href={`${BASE_URL}/${language}`} />
                <link rel="alternate" hreflang={LANGUAGES.EN} href={`${BASE_URL}/${LANGUAGES.EN}`} />
                <link rel="alternate" hreflang={LANGUAGES.TR} href={`${BASE_URL}/${LANGUAGES.TR}`} />
                <link rel="alternate" hreflang="x-default" href={`${BASE_URL}/${LANGUAGES.EN}`} />
                <meta property="og:url" content={`${BASE_URL}/${language}`} />
                <meta property="og:locale" content={LOCALES[language]} />
                {language === LANGUAGES.EN && <meta property="og:locale:alternate" content={LOCALES[LANGUAGES.TR]} />}
                {language === LANGUAGES.TR && <meta property="og:locale:alternate" content={LOCALES[LANGUAGES.EN]} />}
            </Helmet>
            
            <Navbar />
            <HeroSection onStartBuilding={handleStartBuilding} />
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
