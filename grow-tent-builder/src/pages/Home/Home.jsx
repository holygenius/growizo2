import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { Header, Footer } from '../../components/Common';
import styles from './Home.module.css';

/**
 * Home page component
 * Landing page with hero section and feature highlights
 */
const Home = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const { language, getBuilderUrl } = useSettings();
    const navigate = useNavigate();

    const translations = {
        en: {
            title: "Design Your Perfect Harvest",
            subtitle: "Advanced simulation for serious growers. Calculate PPFD, estimate costs, and optimize your environment before you buy.",
            cta: "Start Building Now"
        },
        tr: {
            title: "Mükemmel Hasadınızı Tasarlayın",
            subtitle: "Ciddi yetiştiriciler için gelişmiş simülasyon. PPFD hesaplayın, maliyetleri tahmin edin ve satın almadan önce ortamınızı optimize edin.",
            cta: "Hemen Başla"
        }
    };

    const t = translations[language];

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ 
                x: (e.clientX / window.innerWidth) - 0.5, 
                y: (e.clientY / window.innerHeight) - 0.5 
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleStartBuilding = () => {
        navigate(getBuilderUrl());
    };

    return (
        <div className={styles.homeContainer}>
            <Helmet>
                <title>{t.title} | GroWizard</title>
                <meta name="description" content={t.subtitle} />
            </Helmet>
            
            {/* Background Effects */}
            <div className={styles.homeBg}>
                <div 
                    className={`${styles.glowOrb} ${styles.orb1}`} 
                    style={{
                        transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`
                    }} 
                />
                <div 
                    className={`${styles.glowOrb} ${styles.orb2}`} 
                    style={{
                        transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`
                    }} 
                />
                <div className={styles.gridOverlay} />
            </div>

            <Header />

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={`${styles.heroContent} ${styles.fadeInUp}`}>
                    <div className={styles.badge}>🌱 Professional Grow Planner</div>
                    <h1 className={styles.heroTitle}>
                        {t.title.split(' ').slice(0, 2).join(' ')} <br />
                        <span className={styles.gradientText}>
                            {t.title.split(' ').slice(2).join(' ')}
                        </span>
                    </h1>
                    <p className={styles.heroSubtitle}>{t.subtitle}</p>
                    <button onClick={handleStartBuilding} className={styles.ctaButton}>
                        {t.cta}
                        <span>→</span>
                    </button>
                </div>

                {/* 3D Visual */}
                <div 
                    className={styles.heroVisual} 
                    style={{
                        transform: `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${mousePos.y * -5}deg)`
                    }}
                >
                    <div className={styles.tentFrame}>
                        <div className={styles.plantIcon}>🌿</div>
                        <div className={styles.lightBeam} />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
