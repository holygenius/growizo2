import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const UpdatePrompt = ({ updateSW }) => {
    const [show, setShow] = useState(false);
    const { language } = useSettings();

    const translations = {
        en: {
            title: '🎉 New Update Available!',
            message: 'A new version of GroWizard is ready. Update now for the latest features and improvements.',
            update: 'Update Now',
            later: 'Later'
        },
        tr: {
            title: '🎉 Yeni Güncelleme Mevcut!',
            message: 'GroWizard\'ın yeni bir versiyonu hazır. En son özellikler ve iyileştirmeler için şimdi güncelleyin.',
            update: 'Şimdi Güncelle',
            later: 'Sonra'
        }
    };

    const t = translations[language];

    useEffect(() => {
        // Show prompt when component mounts (triggered by service worker)
        setShow(true);
    }, []);

    const handleUpdate = () => {
        setShow(false);
        updateSW(true); // This will reload the page with new content
    };

    const handleLater = () => {
        setShow(false);
    };

    if (!show) return null;

    return (
        <>
            <div className="update-prompt-overlay" onClick={handleLater} />
            <div className="update-prompt">
                <div className="update-icon">🚀</div>
                <h3>{t.title}</h3>
                <p>{t.message}</p>
                <div className="update-actions">
                    <button onClick={handleUpdate} className="btn-update">
                        {t.update}
                    </button>
                    <button onClick={handleLater} className="btn-later">
                        {t.later}
                    </button>
                </div>
            </div>

            <style>{`
        .update-prompt-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 9998;
          animation: fadeIn 0.3s ease;
        }

        .update-prompt {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 1rem;
          padding: 1.5rem;
          max-width: 400px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          z-index: 9999;
          animation: slideUp 0.4s ease;
          color: white;
        }

        .update-icon {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 1rem;
          animation: bounce 1s infinite;
        }

        .update-prompt h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .update-prompt p {
          color: #cbd5e1;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .update-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-update, .btn-later {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-update {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-update:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .btn-later {
          background: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-later:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .update-prompt {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
          }

          .update-actions {
            flex-direction: column;
          }
        }
      `}</style>
        </>
    );
};

export default UpdatePrompt;
