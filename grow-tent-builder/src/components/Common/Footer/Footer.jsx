import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../../context/SettingsContext';
import styles from './Footer.module.css';

const Footer = () => {
  const { language, setLanguage, getBuilderUrl } = useSettings();

  return (
    <footer className={styles.landingFooter}>
      <div className={styles.footerContent}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>🌱 GroWizard</div>
          <p>© 2025 GroWizard. All rights reserved.</p>
        </div>

        <div className={styles.footerLinks}>
          <Link to="/">Home</Link>
          <Link to={getBuilderUrl()}>Builder</Link>
          <Link to="/tools">Tools</Link>
          <Link to="/blog">Blog</Link>
        </div>

        <div className={styles.footerLangToggle}>
          <button
            onClick={() => setLanguage('en')}
            className={language === 'en' ? styles.active : ''}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('tr')}
            className={language === 'tr' ? styles.active : ''}
          >
            TR
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
