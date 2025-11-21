import React from 'react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
    const { language, setLanguage } = useSettings();

    return (
        <footer className="landing-footer">
            <div className="footer-content">
                <div className="footer-info">
                    <p>© 2025 GroWizard. All rights reserved.</p>
                </div>
                <div className="footer-lang-toggle">
                    <button
                        onClick={() => setLanguage('en')}
                        className={language === 'en' ? 'active' : ''}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLanguage('tr')}
                        className={language === 'tr' ? 'active' : ''}
                    >
                        TR
                    </button>
                </div>
            </div>
            <style>{`
        .landing-footer {
          background: rgba(15, 23, 42, 0.95);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 2rem 10%;
          position: relative;
          z-index: 10;
          margin-top: auto;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-info p {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .footer-lang-toggle {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.25rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-lang-toggle button {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 0.4rem 0.75rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .footer-lang-toggle button.active {
          background: #10b981;
          color: white;
        }

        .footer-lang-toggle button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
      `}</style>
        </footer>
    );
};

export default Footer;
