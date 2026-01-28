import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Icon from './Common/Icon';
import { UserMenu } from './Auth';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { language, setLanguage, getBuilderUrl, t, getLocalizedPath } = useSettings();
    const location = useLocation();
    const navigate = useNavigate();
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isFeedingOpen, setIsFeedingOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toolsTimeoutRef = useRef(null);
    const feedingTimeoutRef = useRef(null);

    // 300ms hover delay to prevent accidental dropdown opens
    const handleToolsMouseEnter = () => {
        if (toolsTimeoutRef.current) {
            clearTimeout(toolsTimeoutRef.current);
        }
        setIsToolsOpen(true);
    };

    const handleToolsMouseLeave = () => {
        toolsTimeoutRef.current = setTimeout(() => {
            setIsToolsOpen(false);
        }, 300);
    };

    const handleFeedingMouseEnter = () => {
        if (feedingTimeoutRef.current) {
            clearTimeout(feedingTimeoutRef.current);
        }
        setIsFeedingOpen(true);
    };

    const handleFeedingMouseLeave = () => {
        feedingTimeoutRef.current = setTimeout(() => {
            setIsFeedingOpen(false);
        }, 300);
    };

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
                        <Icon icon="carbon:plant" size={28} />
                        <span className={styles.navLogoText}>GroWizard</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className={styles.navLinks}>
                        <Link
                            to={getLocalizedPath('/products')}
                            className={`${styles.navLink} ${isActive('/products') || isActive('/urunler') ? styles.navLinkActive : ''}`}
                        >
                            {t('navProducts') || 'Store'}
                        </Link>

                        {/* Feeding Programs Dropdown */}
                        <div
                            className={styles.dropdownContainer}
                            onMouseEnter={handleFeedingMouseEnter}
                            onMouseLeave={handleFeedingMouseLeave}
                        >
                            <span
                                className={`${styles.navLink} ${location.pathname.includes('/feeding') ? styles.navLinkActive : ''}`}
                            >
                                {t('navFeedingPrograms')} <Icon icon="mdi:chevron-down" size={16} />
                            </span>
                            {isFeedingOpen && (
                                <div className={styles.dropdownMenu}>
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
                            )}
                        </div>

                        {/* Toolkit Dropdown */}
                        <div
                            className={styles.dropdownContainer}
                            onMouseEnter={handleToolsMouseEnter}
                            onMouseLeave={handleToolsMouseLeave}
                        >
                            <span
                                className={`${styles.navLink} ${location.pathname.includes('/tools') ? styles.navLinkActive : ''}`}
                            >
                                <Icon icon="mdi:toolbox" size={18} style={{ marginRight: 4 }} />
                                {t('navToolkit') || t('navTools')} <Icon icon="mdi:chevron-down" size={16} />
                            </span>
                            {isToolsOpen && (
                                <div className={styles.dropdownMenu}>
                                    <Link to={getLocalizedPath('/tools/electricity-cost-calculator')} className={styles.dropdownItem}>
                                        <Icon icon="mdi:lightning-bolt" size={18} /> {t('navCostCalc')}
                                    </Link>
                                    <Link to={getLocalizedPath('/tools/co2-calculator')} className={styles.dropdownItem}>
                                        <Icon icon="mdi:smog" size={18} /> {t('navCo2Calc')}
                                    </Link>
                                    <Link to={getLocalizedPath('/tools/unit-converter')} className={styles.dropdownItem}>
                                        <Icon icon="mdi:water" size={18} /> {t('navUnitConv')}
                                    </Link>
                                    <Link to={getLocalizedPath('/tools/ppfd-heatmap')} className={styles.dropdownItem}>
                                        <Icon icon="mdi:white-balance-sunny" size={18} /> {t('navPpfdTool')}
                                    </Link>
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
                        <Icon icon={isMobileMenuOpen ? "mdi:close" : "mdi:menu"} size={24} />
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

                        {/* Mobile Feeding Programs */}
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

                        {/* Mobile Toolkit */}
                        <div>
                            <div className={styles.mobileLink} style={{ opacity: 0.7 }}>{t('navToolkit') || t('navTools')}</div>
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
