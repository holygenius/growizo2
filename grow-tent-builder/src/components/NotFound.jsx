import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

export default function NotFound() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const { t } = useSettings();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="not-found-container">
      <Helmet>
        <title>{t('notFoundTitle')} | GroWizard</title>
        <meta name="description" content={t('notFoundDescription')} />
      </Helmet>

      <div
        className="flashlight"
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}% ${mousePos.y}%, rgba(16, 185, 129, 0.15) 0%, rgba(0, 0, 0, 0.98) 100%)`
        }}
      />

      <div className="content">
        <div className="icon">🔦</div>
        <h1>{t('notFoundHeadline')}</h1>
        <p>{t('notFoundSubtext')}</p>
        <p className="sub-text">{t('notFoundMessage')}</p>

        <Link to="/" className="home-btn">
          {t('notFoundButton')}
        </Link>
      </div>

      <style>{`
        .not-found-container {
          height: 100vh;
          width: 100vw;
          background-color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          color: #10b981;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .flashlight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 600px;
          padding: 2rem;
        }

        .icon {
          font-size: 5rem;
          margin-bottom: 1rem;
          animation: flicker 4s infinite;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
          font-weight: 800;
        }

        p {
          font-size: 1.5rem;
          color: #a7f3d0;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .sub-text {
          font-size: 1.1rem;
          color: #6ee7b7;
          margin-bottom: 2.5rem;
          opacity: 0.8;
        }

        .home-btn {
          display: inline-block;
          padding: 1rem 2rem;
          background: #10b981;
          color: #000;
          text-decoration: none;
          font-weight: bold;
          border-radius: 50px;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }

        .home-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
          background: #34d399;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          95% { opacity: 1; }
          96% { opacity: 0.3; }
          97% { opacity: 1; }
          98% { opacity: 0.5; }
          99% { opacity: 1; }
        }

        @media (max-width: 768px) {
          h1 { font-size: 2rem; }
          p { font-size: 1.2rem; }
        }
      `}</style>
    </div>
  );
}
