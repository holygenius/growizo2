import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
    const { language, setLanguage } = useSettings();
    const location = useLocation();
    const [isToolsOpen, setIsToolsOpen] = useState(false);

    const t = {
        en: {
            home: "🏠 Home",
            builder: "Go To App 🚀",
            tools: "🛠️ Tools",
            blog: "📝 Blog",
            costCalc: "Electricity Cost Calculator",
            co2Calc: "CO₂ Calculator",
            unitConv: "Volume Converter"
        },
        tr: {
            home: "🏠 Ana Sayfa",
            builder: "Uygulamaya Git 🚀",
            tools: "🛠️ Araçlar",
            blog: "📝 Blog",
            costCalc: "Elektrik Maliyeti Hesaplayıcı",
            co2Calc: "CO₂ Hesaplayıcı",
            unitConv: "Hacim Çevirici"
        }
    }[language];

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={styles.nav}>
            <div style={styles.container}>
                <Link to="/" style={styles.logo}>
                    🌱 <span style={styles.logoText}>GroWizard</span>
                </Link>

                <div style={styles.links}>
                    <Link
                        to="/"
                        style={{ ...styles.link, ...(isActive('/') ? styles.activeLink : {}) }}
                    >
                        {t.home}
                    </Link>

                    <div
                        style={styles.dropdownContainer}
                        onMouseEnter={() => setIsToolsOpen(true)}
                        onMouseLeave={() => setIsToolsOpen(false)}
                    >
                        <span
                            style={{ ...styles.link, ...(location.pathname.includes('/tools') ? styles.activeLink : {}) }}
                        >
                            {t.tools} ▾
                        </span>
                        {isToolsOpen && (
                            <div style={styles.dropdownMenu}>
                                <Link to="/tools/electricity-cost-calculator" style={styles.dropdownItem}>{t.costCalc}</Link>
                                <Link to="/tools/co2-calculator" style={styles.dropdownItem}>{t.co2Calc}</Link>
                                <Link to="/tools/unit-converter" style={styles.dropdownItem}>{t.unitConv}</Link>
                            </div>
                        )}
                    </div>

                    <Link
                        to="/blog"
                        style={{ ...styles.link, ...(isActive('/blog') ? styles.activeLink : {}) }}
                    >
                        {t.blog}
                    </Link>
                </div>

                <div style={styles.rightSection}>
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                        style={styles.langBtn}
                    >
                        {language === 'en' ? 'TR' : 'EN'}
                    </button>
                    <Link
                        to="/builder"
                        style={styles.ctaButton}
                    >
                        {t.builder}
                    </Link>
                </div>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '1rem 0',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        textDecoration: 'none',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    logoText: {
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    links: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
    },
    link: {
        color: '#94a3b8',
        textDecoration: 'none',
        fontSize: '0.95rem',
        fontWeight: '500',
        transition: 'color 0.2s',
        cursor: 'pointer',
    },
    activeLink: {
        color: 'white',
    },
    dropdownContainer: {
        position: 'relative',
        padding: '1rem 0', // Increase hit area
        margin: '-1rem 0',
    },
    dropdownMenu: {
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1e293b',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.75rem',
        padding: '0.5rem',
        minWidth: '220px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
    },
    dropdownItem: {
        color: '#cbd5e1',
        textDecoration: 'none',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        fontSize: '0.9rem',
        transition: 'background 0.2s, color 0.2s',
        whiteSpace: 'nowrap',
        display: 'block'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    },
    langBtn: {
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        color: 'white',
        padding: '0.4rem 0.8rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    ctaButton: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        textDecoration: 'none',
        padding: '0.6rem 1.2rem',
        borderRadius: '0.75rem',
        fontWeight: '600',
        fontSize: '0.95rem',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        transition: 'transform 0.2s',
    }
};

export default Navbar;
