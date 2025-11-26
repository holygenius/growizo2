import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';
import styles from './NotFound.module.css';

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const { t, getLocalizedPath } = useSettings();
  const [seedlings, setSeedlings] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Generate random positions for seedlings
    const newSeedlings = Array.from({ length: 2 }).map((_, i) => ({
      id: i,
      top: Math.random() * 80 + 10, // 10% to 90%
      left: Math.random() * 80 + 10,
      rotation: Math.random() * 30 - 15
    }));
    setSeedlings(newSeedlings);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={styles.notFoundContainer}>
      <Helmet>
        <title>{t('notFoundTitle')} | GroWizard</title>
        <meta name="description" content={t('notFoundDescription')} />
      </Helmet>

      {/* Seedlings (Hidden in dark, revealed by light) */}
      {seedlings.map((s) => (
        <img
          key={s.id}
          src="/images/tomato_seedling.png"
          alt="Tomato Seedling"
          className={styles.seedling}
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            transform: `translate(-50%, -50%) rotate(${s.rotation}deg)`,
            position: 'absolute',
            width: '150px',
            pointerEvents: 'none',
            zIndex: 1 // Below flashlight, above background
          }}
        />
      ))}

      {/* Flashlight Overlay */}
      <div
        className={styles.flashlight}
        style={{
          background: `radial-gradient(circle 250px at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(0, 0, 0, 0.98) 100%)`,
          zIndex: 2
        }}
      />

      <div className={styles.content} style={{ zIndex: 3 }}>
        <div className={styles.icon}>🔦</div>
        <h1 className={styles.title}>{t('notFoundHeadline')}</h1>
        <p className={styles.subtitle}>{t('notFoundSubtext')}</p>
        <p className={styles.subText}>{t('notFoundMessage')}</p>

        <Link to={getLocalizedPath('/')} className={styles.homeBtn}>
          {t('notFoundButton')}
        </Link>
      </div>
    </div>
  );
}
