import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';

export default function ProgressTracker() {
    const { state, dispatch } = useBuilder();
    const { t } = useSettings();
    const { currentStep } = state;

    const steps = [
        { num: 1, key: 'step1' },
        { num: 2, key: 'step2' },
        { num: 3, key: 'step3' },
        { num: 4, key: 'step4' },
        { num: 5, key: 'step5_media' },
        { num: 6, key: 'step6' },
        { num: 7, key: 'step7' },
        { num: 8, key: 'step8' }
    ];

    const progress = (currentStep / steps.length) * 100;

    return (
        <>
            {/* Mobile Progress Bar */}
            <div className="mobile-progress no-print" style={{
                display: 'none',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-primary)' }}>
                        {t(steps[currentStep - 1].key)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {currentStep} / {steps.length}
                    </span>
                </div>
                <div style={{
                    width: '100%',
                    height: '6px',
                    background: 'var(--bg-surface)',
                    borderRadius: '999px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                        transition: 'width 0.3s ease',
                        borderRadius: '999px'
                    }} />
                </div>
            </div>

            {/* Desktop Progress Tracker */}
            <div className="desktop-progress no-print" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                position: 'relative'
            }}>
                {steps.map((step, idx) => {
                    const isActive = currentStep === step.num;
                    const isCompleted = currentStep > step.num;
                    const isClickable = currentStep > step.num;

                    return (
                        <div
                            key={step.num}
                            onClick={() => isClickable && dispatch({ type: 'SET_STEP', payload: step.num })}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flex: 1,
                                position: 'relative',
                                cursor: isClickable ? 'pointer' : 'default',
                                zIndex: 1
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: isActive || isCompleted ? 'var(--color-primary)' : 'var(--bg-surface)',
                                border: `2px solid ${isActive ? 'var(--color-primary)' : isCompleted ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                color: isActive || isCompleted ? '#000' : 'var(--text-muted)',
                                transition: 'all 0.3s ease',
                                boxShadow: isActive ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none'
                            }}>
                                {isCompleted ? '✓' : step.num}
                            </div>
                            <span style={{
                                marginTop: '0.5rem',
                                fontSize: '0.75rem',
                                color: isActive ? 'var(--color-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                                fontWeight: isActive ? '600' : '400',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {t(step.key)}
                            </span>
                            {idx < steps.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '50%',
                                    width: 'calc(100% - 40px)',
                                    height: '2px',
                                    background: isCompleted ? 'var(--color-primary)' : 'var(--border-color)',
                                    zIndex: -1,
                                    transition: 'background 0.3s ease'
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-progress {
                        display: block !important;
                    }
                    .desktop-progress {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
}
