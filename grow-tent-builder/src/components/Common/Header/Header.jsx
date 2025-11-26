import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../../../context/SettingsContext';
import styles from './Header.module.css';

const Header = () => {
    const { language, setLanguage, getBuilderUrl, getLocalizedPath } = useSettings();
    const location = useLocation();
    const navigate = useNavigate();
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const t = {
        en: {
            home: "🏠 Home",
            builder: "Go To App 🚀",
            tools: "🛠️ Tools",
            blog: "📝 Blog",
            costCalc: "Electricity Cost Calculator",
            co2Calc: "CO₂ Calculator",
            unitConv: "Volume Converter",
            ppfdTool: "PPFD Heat Map"
        },
        tr: {
            home: "🏠 Ana Sayfa",
            builder: "Uygulamaya Git 🚀",
            tools: "🛠️ Araçlar",
            blog: "📝 Blog",
            costCalc: "Elektrik Maliyeti Hesaplayıcı",
            co2Calc: "CO₂ Hesaplayıcı",
            unitConv: "Hacim Çevirici",
            ppfdTool: "PPFD Isı Haritası"
        }
    }[language];

    // Helper to check active state ignoring language prefix
    const isActive = (path) => {
        const currentPath = location.pathname.replace(/^\/(en|tr)/, '') || '/';
        return currentPath === path;
    };

    const handleLanguageSwitch = () => {
        const newLang = language === 'en' ? 'tr' : 'en';
        const currentPath = location.pathname.replace(/^\/(en|tr)/, '');
        navigate(`/${newLang}${currentPath}`);
        setLanguage(newLang);
    };

    return (
        <nav className={styles.navWrapper}>
            <div className={styles.navContainer}>
                <Link to={getLocalizedPath('/')} className={styles.navLogo}>
                    🌱 <span className={styles.navLogoText}>GroWizard</span>
                </Link>

                {/* Desktop Menu */}
                <div className={styles.navLinks}>
                    <Link
                        to={getLocalizedPath('/')}
                        className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                    >
                        {t.home}
                    </Link>

                    <div
                        className={styles.dropdownContainer}
                        onMouseEnter={() => setIsToolsOpen(true)}
                        onMouseLeave={() => setIsToolsOpen(false)}
                    >
                        <span
                            className={`${styles.navLink} ${location.pathname.includes('/tools') ? styles.active : ''}`}
                        >
                            {t.tools} ▾
                        </span>
                        {isToolsOpen && (
                            <div className={styles.dropdownMenu}>
                                <Link to={getLocalizedPath('/tools/electricity-cost-calculator')} className={styles.dropdownItem}>{t.costCalc}</Link>
                                <Link to={getLocalizedPath('/tools/co2-calculator')} className={styles.dropdownItem}>{t.co2Calc}</Link>
                                <Link to={getLocalizedPath('/tools/unit-converter')} className={styles.dropdownItem}>{t.unitConv}</Link>
                                <Link to={getLocalizedPath('/tools/ppfd-heatmap')} className={styles.dropdownItem}>{t.ppfdTool}</Link>
                            </div>
                        )}
                    </div>

                    <Link
                        to={getLocalizedPath('/blog')}
                        className={`${styles.navLink} ${isActive('/blog') ? styles.active : ''}`}
                    >
                        {t.blog}
                    </Link>
                </div>

                <div className={styles.navRight}>
                    <button
                        onClick={handleLanguageSwitch}
                        className={styles.langBtn}
                    >
                        {language === 'en' ? 'TR' : 'EN'}
                    </button>
                    <Link
                        to={getBuilderUrl()}
                        className={styles.ctaButton}
                    >
                        {t.builder}
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className={styles.hamburger}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <Link
                        to={getLocalizedPath('/')}
                        className={`${styles.mobileLink} ${isActive('/') ? styles.active : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t.home}
                    </Link>

                    <div>
                        <div className={styles.mobileLink} style={{ opacity: 0.7 }}>{t.tools}</div>
                        <div className={styles.mobileTools}>
                            <Link
                                to={getLocalizedPath('/tools/electricity-cost-calculator')}
                                className={styles.mobileLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t.costCalc}
                            </Link>
                            <Link
                                to={getLocalizedPath('/tools/co2-calculator')}
                                className={styles.mobileLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t.co2Calc}
                            </Link>
                            <Link
                                to={getLocalizedPath('/tools/unit-converter')}
                                className={styles.mobileLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t.unitConv}
                            </Link>
                            <Link
                                to={getLocalizedPath('/tools/ppfd-heatmap')}
                                className={styles.mobileLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t.ppfdTool}
                            </Link>
                        </div>
                    </div>

                    <Link
                        to={getLocalizedPath('/blog')}
                        className={`${styles.mobileLink} ${isActive('/blog') ? styles.active : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {t.blog}
                    </Link>

                    <div className={styles.mobileActions}>
                        <button
                            onClick={() => {
                                handleLanguageSwitch();
                                setIsMobileMenuOpen(false);
                            }}
                            className={styles.langBtn}
                        >
                            {language === 'en' ? 'Switch to TR' : 'Switch to EN'}
                        </button>
                        <Link
                            to={getBuilderUrl()}
                            className={styles.ctaButton}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.builder}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
