import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Icon from './Common/Icon';
import styles from './Footer.module.css';

const Footer = () => {
  const { t, getLocalizedPath } = useSettings();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}>
          <Link to={getLocalizedPath('/')} className={styles.footerLogo}>
            <Icon icon="mdi:leaf" size={20} /> GroWizard
          </Link>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} GroWizard
          </span>
        </div>

        <nav className={styles.footerLinks}>
          <Link to={getLocalizedPath('/products')}>{t('navProducts') || 'Products'}</Link>
          <Link to={getLocalizedPath('/blog')}>{t('navBlog') || 'Blog'}</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
