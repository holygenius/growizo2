import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../context/OnboardingContext';

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const [showTooltip, setShowTooltip] = useState(false);
    const { onboardingData, updateOnboarding, completeOnboarding } = useOnboarding();
    const navigate = useNavigate();

    const steps = [
        {
            question: "Hangi bitki türünü yetiştirmek istiyorsunuz?",
            field: "plantType",
            options: [
                { value: "tomato", label: "🍅 Domates", icon: "🍅" },
                { value: "pepper", label: "🌶️ Biber", icon: "🌶️" },
                { value: "herbs", label: "🌿 Otlar", icon: "🌿" },
                { value: "flowers", label: "🌺 Çiçek", icon: "🌺" }
            ],
            tooltip: "Seçtiğiniz bitkiye göre ışık ve besin gereksinimleri değişir; örneğin domates ve biber yüksek PPFD isterken, aromatik otlar daha düşük değerlerle yetinir."
        },
        {
            question: "Yetiştiricilik deneyiminiz nedir?",
            field: "experienceLevel",
            options: [
                { value: "beginner", label: "Yeni Başlayan", icon: "🌱" },
                { value: "intermediate", label: "Orta Seviye", icon: "🌿" },
                { value: "expert", label: "Uzman", icon: "🏆" }
            ],
            tooltip: "Yeni başlayanlar için otomatik sulama ve sabit LED kurulumları önerilir; uzman kullanıcılar hidroponik sistemleri tercih edebilir."
        },
        {
            question: "Çadır boyutu ne kadar olacak?",
            field: "tentSize",
            options: [
                { value: "60x60", label: "60×60 cm", icon: "📦" },
                { value: "80x80", label: "80×80 cm", icon: "📦" },
                { value: "100x100", label: "100×100 cm", icon: "📦" },
                { value: "120x120", label: "120×120 cm", icon: "📦" }
            ],
            tooltip: "Çadır boyutu arttıkça havalandırma kapasitesi ve ışık gücü doğru orantılı olarak artmalıdır."
        },
        {
            question: "Tercih ettiğiniz ışık türü nedir?",
            field: "lightPreference",
            options: [
                { value: "led", label: "LED", icon: "💡" },
                { value: "hps", label: "HPS", icon: "🔥" },
                { value: "cmh", label: "CMH", icon: "⚡" }
            ],
            tooltip: "LED'ler enerji verimliliği ve düşük ısı ile popülerdir, HPS'ler çiçeklenme döneminde yüksek yoğunluk sağlar."
        }
    ];

    const currentStepData = steps[currentStep - 1];
    const progress = (currentStep / steps.length) * 100;

    const handleSelect = (value) => {
        updateOnboarding(currentStepData.field, value);
        setShowTooltip(true);
    };

    const handleContinue = () => {
        setShowTooltip(false);
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
            navigate('/builder');
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
        navigate('/builder');
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            setShowTooltip(false);
        }
    };

    return (
        <div className="onboarding-container">
            {/* Background */}
            <div className="onboarding-bg">
                <div className="glow-orb orb-green" />
                <div className="grid-overlay" />
            </div>

            {/* Content */}
            <div className="onboarding-content">
                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }} />
                    <span className="progress-text">Adım {currentStep} / {steps.length}</span>
                </div>

                {/* Question */}
                <div className="question-container fade-in">
                    <h2 className="question-title">{currentStepData.question}</h2>

                    {/* Options */}
                    <div className="options-grid">
                        {currentStepData.options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`option-card ${onboardingData[currentStepData.field] === option.value ? 'selected' : ''
                                    }`}
                            >
                                <span className="option-icon">{option.icon}</span>
                                <span className="option-label">{option.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Tooltip */}
                    {showTooltip && (
                        <div className="tooltip-box fade-in">
                            <p>{currentStepData.tooltip}</p>
                            <button onClick={handleContinue} className="btn-continue">
                                Devam Et →
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="nav-buttons">
                    {currentStep > 1 && (
                        <button onClick={handleBack} className="btn-secondary">
                            ← Geri
                        </button>
                    )}
                    <button onClick={handleSkip} className="btn-skip">
                        Atla
                    </button>
                </div>
            </div>

            <style>{`
                .onboarding-container {
                    min-height: 100vh;
                    background: #0a0a0a;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .onboarding-bg {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                }

                .glow-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.3;
                }

                .orb-green {
                    width: 500px;
                    height: 500px;
                    background: #10b981;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .grid-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                    background-size: 50px 50px;
                }

                .onboarding-content {
                    max-width: 800px;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                }

                .progress-container {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 999px;
                    height: 8px;
                    margin-bottom: 3rem;
                    position: relative;
                    overflow: hidden;
                }

                .progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #10b981, #3b82f6);
                    border-radius: 999px;
                    transition: width 0.5s ease;
                }

                .progress-text {
                    position: absolute;
                    top: -30px;
                    right: 0;
                    font-size: 0.875rem;
                    color: #94a3b8;
                }

                .question-container {
                    text-align: center;
                }

                .question-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 3rem;
                    line-height: 1.3;
                }

                .options-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .option-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.15);
                    border-radius: 1rem;
                    padding: 2rem 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    color: #fff;
                }

                .option-card:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(16, 185, 129, 0.6);
                    transform: translateY(-5px);
                }

                .option-card.selected {
                    background: rgba(16, 185, 129, 0.2);
                    border-color: #10b981;
                }

                .option-icon {
                    font-size: 3rem;
                }

                .option-label {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #ffffff;
                }

                .tooltip-box {
                    background: rgba(16, 185, 129, 0.15);
                    border: 1px solid rgba(16, 185, 129, 0.4);
                    border-radius: 0.75rem;
                    padding: 1.5rem;
                    margin-top: 2rem;
                    text-align: center;
                    color: #ffffff;
                }

                .tooltip-box p {
                    line-height: 1.6;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                }

                .btn-continue {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 0.75rem 2rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    margin-top: 0.5rem;
                }

                .btn-continue:hover {
                    background: #059669;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .nav-buttons {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 3rem;
                }

                .btn-secondary, .btn-skip {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 1rem;
                }

                .btn-secondary:hover, .btn-skip:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .question-title {
                        font-size: 1.5rem;
                    }

                    .options-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }

                    .option-card {
                        flex-direction: row;
                        padding: 1rem;
                    }

                    .option-icon {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </div >
    );
}
