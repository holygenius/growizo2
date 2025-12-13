import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useOnboarding } from '../context/OnboardingContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import styles from './Onboarding.module.css';

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showTooltip, setShowTooltip] = useState(false);
    const { onboardingData, updateOnboarding, completeOnboarding } = useOnboarding();
    const { getBuilderUrl, t } = useSettings();
    const { completeUserOnboarding, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const steps = [
        {
            questionKey: "onboardingQ1",
            field: "plantType",
            options: [
                { value: "herbs", labelKey: "onboardingQ1Opt1Label", detailKey: "onboardingQ1Opt1Detail", icon: "🌿" },
                { value: "vegetables", labelKey: "onboardingQ1Opt2Label", detailKey: "onboardingQ1Opt2Detail", icon: "🥬" },
                { value: "flowers", labelKey: "onboardingQ1Opt3Label", detailKey: "onboardingQ1Opt3Detail", icon: "🌺" }
            ],
            tooltips: {
                herbs: "onboardingQ1Tip1",
                vegetables: "onboardingQ1Tip2",
                flowers: "onboardingQ1Tip3"
            }
        },
        {
            questionKey: "onboardingQ2",
            field: "experienceLevel",
            options: [
                { value: "beginner", labelKey: "onboardingQ2Opt1Label", icon: "🌱" },
                { value: "intermediate", labelKey: "onboardingQ2Opt2Label", icon: "🌿" },
                { value: "expert", labelKey: "onboardingQ2Opt3Label", icon: "🏆" }
            ],
            tooltips: {
                beginner: "onboardingQ2Tip1",
                intermediate: "onboardingQ2Tip2",
                expert: "onboardingQ2Tip3"
            }
        },
        {
            questionKey: "onboardingQ3",
            field: "tentSize",
            options: [
                { value: "60x60", labelKey: "onboardingQ3Opt1Label", detailKey: "onboardingQ3Opt1Detail", icon: "📦" },
                { value: "100x100", labelKey: "onboardingQ3Opt2Label", detailKey: "onboardingQ3Opt2Detail", icon: "📦" },
                { value: "120x120", labelKey: "onboardingQ3Opt3Label", detailKey: "onboardingQ3Opt3Detail", icon: "📦" }
            ],
            tooltips: {
                "60x60": "onboardingQ3Tip1",
                "100x100": "onboardingQ3Tip2",
                "120x120": "onboardingQ3Tip3"
            }
        },
        {
            questionKey: "onboardingQ4",
            field: "lightPreference",
            options: [
                { value: "led", labelKey: "onboardingQ4Opt1Label", detailKey: "onboardingQ4Opt1Detail", icon: "💡" },
                { value: "hps", labelKey: "onboardingQ4Opt2Label", detailKey: "onboardingQ4Opt2Detail", icon: "🔥" },
                { value: "unsure", labelKey: "onboardingQ4Opt3Label", detailKey: "onboardingQ4Opt3Detail", icon: "❓" }
            ],
            tooltips: {
                led: "onboardingQ4Tip1",
                hps: "onboardingQ4Tip2",
                unsure: "onboardingQ4Tip3"
            }
        },
        {
            questionKey: "onboardingQ5",
            field: "automationLevel",
            options: [
                { value: "manual", labelKey: "onboardingQ5Opt1Label", detailKey: "onboardingQ5Opt1Detail", icon: "✋" },
                { value: "semi", labelKey: "onboardingQ5Opt2Label", detailKey: "onboardingQ5Opt2Detail", icon: "⚙️" },
                { value: "full", labelKey: "onboardingQ5Opt3Label", detailKey: "onboardingQ5Opt3Detail", icon: "🤖" }
            ],
            tooltips: {
                manual: "onboardingQ5Tip1",
                semi: "onboardingQ5Tip2",
                full: "onboardingQ5Tip3"
            }
        }
    ];

    const currentStepData = steps[currentStep - 1];
    const progress = (currentStep / steps.length) * 100;

    const [selectedTooltip, setSelectedTooltip] = useState('');

    const handleSelect = (value) => {
        updateOnboarding(currentStepData.field, value);
        setSelectedTooltip(t(currentStepData.tooltips[value]));
        setShowTooltip(true);
    };

    const handleContinue = () => {
        setShowTooltip(false);
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
            // Save onboarding data to database if user is authenticated
            if (isAuthenticated) {
                completeUserOnboarding({
                    plantType: onboardingData.plantType,
                    experienceLevel: onboardingData.experienceLevel,
                    tentSize: onboardingData.tentSize,
                    lightPreference: onboardingData.lightPreference,
                    automationLevel: onboardingData.automationLevel
                });
            }
            navigate(getBuilderUrl());
        }
    };

    // Auto-advance after 10 seconds
    React.useEffect(() => {
        if (showTooltip) {
            const timer = setTimeout(() => {
                handleContinue();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [showTooltip]);

    const handleSkip = () => {
        completeOnboarding();
        // Save partial onboarding data to database if user is authenticated
        if (isAuthenticated) {
            completeUserOnboarding({
                plantType: onboardingData.plantType,
                experienceLevel: onboardingData.experienceLevel,
                tentSize: onboardingData.tentSize,
                lightPreference: onboardingData.lightPreference,
                automationLevel: onboardingData.automationLevel,
                skipped: true
            });
        }
        navigate(getBuilderUrl());
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setShowTooltip(false);
        }
    };

    return (
        <div className={styles.onboardingContainer}>
            <Helmet>
                <title>{t('onboardingTitle')} | GroWizard</title>
            </Helmet>
            {/* Background */}
            <div className={styles.onboardingBg}>
                <div className={`${styles.glowOrb} ${styles.orbGreen}`} />
                <div className={styles.gridOverlay} />
            </div>

            {/* Content */}
            <div className={styles.onboardingContent}>
                {/* Progress Bar */}
                <div className={styles.progressContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }} />
                    <span className={styles.progressText}>{t('onboardingStep')} {currentStep} / {steps.length}</span>
                </div>

                {/* Question */}
                <div className={`${styles.questionContainer} ${styles.fadeIn}`}>
                    <h2 className={styles.questionTitle}>{t(currentStepData.questionKey)}</h2>

                    {/* Options */}
                    <div className={styles.optionsGrid}>
                        {currentStepData.options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`${styles.optionCard} ${onboardingData[currentStepData.field] === option.value ? styles.optionCardSelected : ''}`}
                            >
                                <span className={styles.optionIcon}>{option.icon}</span>
                                <div className={styles.optionText}>
                                    <span className={styles.optionLabel}>{t(option.labelKey)}</span>
                                    {option.detailKey && <span className={styles.optionDetail}>{t(option.detailKey)}</span>}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Tooltip */}
                    {showTooltip && (
                        <div className={`${styles.tooltipBox} ${styles.fadeIn}`}>
                            <p>{selectedTooltip}</p>
                            <button onClick={handleContinue} className={styles.btnContinue}>
                                {t('onboardingContinue')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className={styles.navButtons}>
                    {currentStep > 1 && (
                        <button onClick={handleBack} className={styles.btnSecondary}>
                            {t('onboardingBack')}
                        </button>
                    )}
                    <button onClick={handleSkip} className={styles.btnSkip}>
                        {t('onboardingSkip')}
                    </button>
                </div>
            </div>
        </div>
    );
}
