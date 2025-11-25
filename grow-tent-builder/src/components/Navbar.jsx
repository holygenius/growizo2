import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
    const { language, setLanguage, getBuilderUrl, t } = useSettings();
    const location = useLocation();
    const [isToolsOpen, setIsToolsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>
                {`
                .nav-wrapper {
                    background: rgba(10, 10, 10, 0.8);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    padding: 1rem 0;
                }
                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .nav-logo {
                    text-decoration: none;
                    font-size: 1.5rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .nav-logo-text {
                    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .nav-links {
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                }
                .nav-link {
                    color: #94a3b8;
                    text-decoration: none;
                    font-size: 0.95rem;
                    font-weight: 500;
                    transition: color 0.2s;
                    cursor: pointer;
                }
                .nav-link.active {
                    color: white;
                }
                .dropdown-container {
                    position: relative;
                    padding: 1rem 0;
                    margin: -1rem 0;
                }
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1e293b;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.75rem;
                    padding: 0.5rem;
                    min-width: 220px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .dropdown-item {
                    color: #cbd5e1;
                    text-decoration: none;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    font-size: 0.9rem;
                    transition: background 0.2s, color 0.2s;
                    white-space: nowrap;
                    display: block;
                }
                .dropdown-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                }
                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }
                .lang-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    padding: 0.4rem 0.8rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .cta-button {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    text-decoration: none;
                    padding: 0.6rem 1.2rem;
                    border-radius: 0.75rem;
                    font-weight: 600;
                    font-size: 0.95rem;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                    transition: transform 0.2s;
                }
                .hamburger {
                    display: none;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                }
                
                /* Mobile Styles */
                @media (max-width: 768px) {
                    .nav-links, .nav-right {
                        display: none;
                    }
                    .hamburger {
                        display: block;
                    }
                    .mobile-menu {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: #0f172a;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        padding: 1rem;
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
                        animation: slideDown 0.3s ease-out;
                    }
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .mobile-link {
                        color: #cbd5e1;
                        text-decoration: none;
                        font-size: 1.1rem;
                        padding: 0.75rem;
                        border-radius: 0.5rem;
                        display: block;
                    }
                    .mobile-link:active, .mobile-link.active {
                        background: rgba(255, 255, 255, 0.05);
                        color: white;
                    }
                    .mobile-tools {
                        padding-left: 1rem;
                        display: flex;
                        flex-direction: column;
                        gap: 0.25rem;
                        border-left: 2px solid rgba(255, 255, 255, 0.1);
                        margin-left: 1rem;
                        margin-top: 0.5rem;
                    }
                    .mobile-actions {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 1rem;
                        padding-top: 1rem;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                    }
                }
                `}
            </style>
            <nav className="nav-wrapper">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        🌱 <span className="nav-logo-text">GroWizard</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="nav-links">
                        <Link
                            to="/"
                            className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        >
                            {t('navHome')}
                        </Link>

                        <div
                            className="dropdown-container"
                            onMouseEnter={() => setIsToolsOpen(true)}
                            onMouseLeave={() => setIsToolsOpen(false)}
                        >
                            <span
                                className={`nav-link ${location.pathname.includes('/tools') ? 'active' : ''}`}
                            >
                                {t('navTools')} ▾
                            </span>
                            {isToolsOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/tools/electricity-cost-calculator" className="dropdown-item">{t('navCostCalc')}</Link>
                                    <Link to="/tools/co2-calculator" className="dropdown-item">{t('navCo2Calc')}</Link>
                                    <Link to="/tools/unit-converter" className="dropdown-item">{t('navUnitConv')}</Link>
                                    <Link to="/tools/ppfd-heatmap" className="dropdown-item">{t('navPpfdTool')}</Link>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/blog"
                            className={`nav-link ${isActive('/blog') ? 'active' : ''}`}
                        >
                            {t('navBlog')}
                        </Link>
                    </div>

                    <div className="nav-right">
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                            className="lang-btn"
                        >
                            {language === 'en' ? 'TR' : 'EN'}
                        </button>
                        <Link
                            to={getBuilderUrl()}
                            className="cta-button"
                        >
                            {t('navBuilder')}
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="hamburger"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu">
                        <Link
                            to="/"
                            className={`mobile-link ${isActive('/') ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('navHome')}
                        </Link>

                        <div>
                            <div className="mobile-link" style={{ opacity: 0.7 }}>{t('navTools')}</div>
                            <div className="mobile-tools">
                                <Link
                                    to="/tools/electricity-cost-calculator"
                                    className="mobile-link"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('navCostCalc')}
                                </Link>
                                <Link
                                    to="/tools/co2-calculator"
                                    className="mobile-link"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('navCo2Calc')}
                                </Link>
                                <Link
                                    to="/tools/unit-converter"
                                    className="mobile-link"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('navUnitConv')}
                                </Link>
                                <Link
                                    to="/tools/ppfd-heatmap"
                                    className="mobile-link"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {t('navPpfdTool')}
                                </Link>
                            </div>
                        </div>

                        <Link
                            to="/blog"
                            className={`mobile-link ${isActive('/blog') ? 'active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t('navBlog')}
                        </Link>

                        <div className="mobile-actions">
                            <button
                                onClick={() => {
                                    setLanguage(language === 'en' ? 'tr' : 'en');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="lang-btn"
                            >
                                {language === 'en' ? t('switchToTr') : t('switchToEn')}
                            </button>
                            <Link
                                to={getBuilderUrl()}
                                className="cta-button"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t('navBuilder')}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
