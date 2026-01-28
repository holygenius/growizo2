import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { UserMenu } from './Auth';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { language, setLanguage, getBuilderUrl, t, getLocalizedPath } = useSettings();
    const location = useLocation();
    const navigate = useNavigate();
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

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
        <>
            <nav className={styles.navWrapper}>
                <div className={styles.navContainer}>
                    <Link to={getLocalizedPath('/')} className={styles.navLogo}>
                        🌱 <span className={styles.navLogoText}>GroWizard</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className={styles.navLinks}>
                        <Link
                            to={getLocalizedPath('/products')}
                            className={`${styles.navLink} ${isActive('/products') || isActive('/urunler') ? styles.navLinkActive : ''}`}
                        >
                            {t('navProducts') || 'Store'}
                        </Link>

                        <div
                            className={styles.dropdownContainer}
                            onMouseEnter={() => setIsToolsOpen(true)}
                            onMouseLeave={() => setIsToolsOpen(false)}
                        >
                            <span
                                className={`${styles.navLink} ${location.pathname.includes('/tools') || location.pathname.includes('/feeding') ? styles.navLinkActive : ''}`}
                            >
                                {t('navTools')} ▾
                            </span>
                            {isToolsOpen && (
                                <div className={styles.dropdownMenu}>
                                    <div className={styles.dropdownSection}>
                                        <span className={styles.dropdownSectionTitle}>{t('navFeedingPrograms')}</span>
                                        <Link to={getLocalizedPath('/feeding/advanced-nutrients')} className={styles.dropdownItem}>
                                            <img src="/images/advanced-nutrients-logo.png" alt="Advanced Nutrients" className={styles.brandIcon} /> {t('anFeedingScheduleTitle')}
                                        </Link>
                                        <Link to={getLocalizedPath('/feeding/biobizz')} className={styles.dropdownItem}>
                                            <img src="/images/cropped-Biobizz-Icon-Brown-Texture-180x180.jpg" alt="BioBizz" className={styles.brandIcon} /> {t('navBiobizz')}
                                        </Link>
                                        <Link to={getLocalizedPath('/feeding/canna')} className={styles.dropdownItem}>
                                            <img src="/images/canna-logo.svg" alt="CANNA" className={styles.brandIcon} /> {t('navCanna')}
                                        </Link>
                                    </div>
                                    <div className={styles.dropdownDivider} />
                                    <Link to={getLocalizedPath('/tools/electricity-cost-calculator')} className={styles.dropdownItem}>⚡ {t('navCostCalc')}</Link>
                                    <Link to={getLocalizedPath('/tools/co2-calculator')} className={styles.dropdownItem}>🌫️ {t('navCo2Calc')}</Link>
                                    <Link to={getLocalizedPath('/tools/unit-converter')} className={styles.dropdownItem}>💧 {t('navUnitConv')}</Link>
                                    <Link to={getLocalizedPath('/tools/ppfd-heatmap')} className={styles.dropdownItem}>☀️ {t('navPpfdTool')}</Link>
                                </div>
                            )}
                        </div>

                        <Link
                            to={getLocalizedPath('/blog')}
                            className={`${styles.navLink} ${isActive('/blog') ? styles.navLinkActive : ''}`}
                        >
                            {t('navBlog')}
                        </Link>
                    </div>

                    <div className={styles.navRight}>
                        <UserMenu />
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
                            {t('navBuilder')}
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
            </nav>

            {/* Mobile Menu - Outside nav for proper z-index */}
            {isMobileMenuOpen && (
                <>
                    <div className={styles.mobileOverlay} onClick={() => setIsMobileMenuOpen(false)} />
                    <div className={styles.mobileMenu}>
                        <Link
                            to={getLocalizedPath('/products')}
                            className={`${styles.mobileLink} ${isActive('/products') || isActive('/urunler') ? styles.mobileLinkActive : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('navProducts') || 'Store'}
                        </Link>

                        <div>
                            <div className={styles.mobileLink} style={{ opacity: 0.7 }}>{t('navTools')}</div>
                            <div className={styles.mobileTools}>
                                <Link
                                    to={getLocalizedPath('/tools/electricity-cost-calculator')}
                                    className={styles.mobileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('navCostCalc')}
                                </Link>
                                <Link
                                    to={getLocalizedPath('/tools/co2-calculator')}
                                    className={styles.mobileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('navCo2Calc')}
                                </Link>
                                <Link
                                    to={getLocalizedPath('/tools/unit-converter')}
                                    className={styles.mobileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('navUnitConv')}
                                </Link>
                                <Link
                                    to={getLocalizedPath('/tools/ppfd-heatmap')}
                                    className={styles.mobileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('navPpfdTool')}
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Feeding Schedules */}
                        <div>
                            <div className={styles.mobileLink} style={{ opacity: 0.7 }}>{t('navFeedingPrograms')}</div>
                            <div className={styles.mobileTools}>
                                <Link
                                    to={getLocalizedPath('/feeding/advanced-nutrients')}
                                    className={styles.mobileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <img src="/images/advanced-nutrients-logo.png" alt="Advanced Nutrients" className={styles.brandIconMobile} /> {t('anFeedingScheduleTitle')}
                                </Link>
                                <Link
                                    to={getLocalizedPath('/feeding/biobizz')}
                                    className={styles.mobileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <img src="/images/cropped-Biobizz-Icon-Brown-Texture-180x180.jpg" alt="BioBizz" className={styles.brandIconMobile} /> {t('navBiobizz')}
                                </Link>
                                <Link
                                    to={getLocalizedPath('/feeding/canna')}
                                    className={styles.mobileLink}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <img src="/images/canna-logo.svg" alt="CANNA" className={styles.brandIconMobile} /> {t('navCanna')}
                                </Link>
                            </div>
                        </div>

                        <Link
                            to={getLocalizedPath('/blog')}
                            className={`${styles.mobileLink} ${isActive('/blog') ? styles.mobileLinkActive : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('navBlog')}
                        </Link>

                        <div className={styles.mobileActions}>
                            <UserMenu />
                            <button
                                onClick={() => {
                                    handleLanguageSwitch();
                                    setIsMobileMenuOpen(false);
                                }}
                                className={styles.langBtn}
                            >
                                {language === 'en' ? t('switchToTr') : t('switchToEn')}
                            </button>
                            <Link
                                to={getBuilderUrl()}
                                className={styles.ctaButton}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t('navBuilder')}
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Navbar;
