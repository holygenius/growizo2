import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import styles from './OnboardingPrompt.module.css';

/**
 * Floating popup that appears when user hasn't completed onboarding
 * Shows in bottom-right corner with option to start or skip onboarding
 */
export default function OnboardingPrompt() {
    const { isNewUser, isAuthenticated, completeUserOnboarding } = useAuth();
    const { t, getOnboardingUrl } = useSettings();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Show popup after a short delay when user is authenticated and hasn't completed onboarding
        if (isAuthenticated && isNewUser) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isAuthenticated, isNewUser]);

    const handleStartOnboarding = () => {
        handleClose();
        navigate(getOnboardingUrl ? getOnboardingUrl() : '/en/onboarding');
    };

    const handleSkip = async () => {
        handleClose();
        // Mark onboarding as completed with skip flag
        await completeUserOnboarding({ skipped: true });
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.promptContainer} ${isClosing ? styles.closing : ''}`}>
            <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
                ×
            </button>

            <div className={styles.icon}>🌱</div>

            <h3 className={styles.title}>
                {t('onboardingPromptTitle') || 'Profilinizi Tamamlayın'}
            </h3>

            <p className={styles.message}>
                {t('onboardingPromptMessage') || 'Kişiselleştirilmiş öneriler almak için hızlı bir ayarlama yapalım.'}
            </p>

            <div className={styles.actions}>
                <button className={styles.primaryBtn} onClick={handleStartOnboarding}>
                    {t('onboardingPromptStart') || 'Başla'}
                </button>
                <button className={styles.secondaryBtn} onClick={handleSkip}>
                    {t('onboardingPromptSkip') || 'Şimdi Değil'}
                </button>
            </div>
        </div>
    );
}
