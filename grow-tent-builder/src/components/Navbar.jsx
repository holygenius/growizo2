import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Navbar = () => {
    const { language, setLanguage } = useSettings();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: '/', label: { en: 'Home', tr: 'Ana Sayfa' } },
        { path: '/builder', label: { en: 'Builder', tr: 'Oluşturucu' } },
        { path: '/tools', label: { en: 'Tools', tr: 'Araçlar' } },
        { path: '/blog', label: { en: 'Blog', tr: 'Blog' } },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    🌱 GrowBuilder
                </Link>

                {/* Desktop Menu */}
                <div className="navbar-links desktop-only">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                        >
                            {link.label[language]}
                        </Link>
                    ))}
                </div>

                <div className="navbar-actions">
                    <div className="lang-toggle">
                        <button
                            className={language === 'en' ? 'active' : ''}
                            onClick={() => setLanguage('en')}
                        >
                            EN
                        </button>
                        <button
                            className={language === 'tr' ? 'active' : ''}
                            onClick={() => setLanguage('tr')}
                        >
                            TR
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="mobile-menu-btn" onClick={toggleMenu}>
                        <span className="hamburger">☰</span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.label[language]}
                        </Link>
                    ))}
                </div>
            )}

            <style>{`
                .navbar {
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    padding: 1rem 0;
                }

                .navbar-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .navbar-logo {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #10b981;
                    text-decoration: none;
                    background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .navbar-links {
                    display: flex;
                    gap: 2rem;
                }

                .nav-link {
                    color: #94a3b8;
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.2s;
                    font-size: 0.95rem;
                }

                .nav-link:hover, .nav-link.active {
                    color: #10b981;
                }

                .navbar-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .lang-toggle {
                    display: flex;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.25rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .lang-toggle button {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    cursor: pointer;
                    font-size: 0.75rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .lang-toggle button.active {
                    background: #10b981;
                    color: white;
                }

                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                }

                .mobile-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: #0a0a0a;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .mobile-nav-link {
                    color: #94a3b8;
                    text-decoration: none;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                }

                .mobile-nav-link.active {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                }

                @media (max-width: 768px) {
                    .desktop-only {
                        display: none;
                    }
                    .mobile-menu-btn {
                        display: block;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
