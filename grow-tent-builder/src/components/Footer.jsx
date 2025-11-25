import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { language, setLanguage, getBuilderUrl, t } = useSettings();

  return (
    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">🌱 GroWizard</div>
          <p>{t('footerRights')}</p>
        </div>

        <div className="footer-links">
          <Link to="/">{t('footerHome')}</Link>
          <Link to={getBuilderUrl()}>{t('footerBuilder')}</Link>
          <Link to="/tools">{t('footerTools')}</Link>
          <Link to="/blog">{t('footerBlog')}</Link>
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
          /* slightly more compact footer */
          padding: 1.25rem 10%;
          position: relative;
          z-index: 10;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .footer-brand {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .footer-logo {
            font-weight: 800;
            color: #10b981;
            font-size: 1.1rem;
        }

        .footer-brand p {
          color: #64748b;
          font-size: 0.875rem;
          margin: 0;
        }

        .footer-links {
            display: flex;
            gap: 1.5rem;
        }

        .footer-links a {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.2s;
        }

        .footer-links a:hover {
            color: #10b981;
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
