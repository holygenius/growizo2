import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';
import styles from './ProgressTracker.module.css';

export default function ProgressTracker() {
    const { state, dispatch } = useBuilder();
    const { t, language } = useSettings();
    const { currentStep } = state;

    const steps = [
        { num: 0, key: 'step0_preset', label: { en: 'Presets', tr: 'Hazır Setler' }, shortLabel: 'Preset' },
        { num: 1, key: 'step1_tent', label: { en: 'Environment', tr: 'Ortam' }, shortLabel: 'Environment' },
        { num: 2, key: 'step2_lighting', label: { en: 'Lighting', tr: 'Aydınlatma' }, shortLabel: 'Lighting' },
        { num: 3, key: 'step3_nutrients', label: { en: 'Nutrients', tr: 'Besinler' }, shortLabel: 'Nutrients' },
        { num: 4, key: 'step4_media', label: { en: 'Growing Media', tr: 'Yetiştirme Ortamı' }, shortLabel: 'Media' },
        { num: 5, key: 'step5_ventilation', label: { en: 'Ventilation', tr: 'Havalandırma' }, shortLabel: 'Ventilation' },
        { num: 6, key: 'step6_monitoring', label: { en: 'Monitoring', tr: 'İzleme' }, shortLabel: 'Monitoring' },
        { num: 7, key: 'step7_summary', label: { en: 'Summary', tr: 'Özet' }, shortLabel: 'Summary' }
    ];

    const currentStepIndex = steps.findIndex(s => s.num === currentStep);
    const progress = ((currentStep + 1) / steps.length) * 100;
    const strokeDashoffset = 283 - (283 * progress) / 100; // 283 = 2 * PI * 45 (circle radius)

    return (
        <>
            {/* Circular Progress Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '1.5rem',
                padding: '1rem 1.5rem',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: '0.75rem'
            }}>
                {/* Circular Progress */}
                <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                        {/* Background circle */}
                        <circle
                            cx="32"
                            cy="32"
                            r="45"
                            fill="none"
                            stroke="var(--border-color)"
                            strokeWidth="6"
                        />
                        {/* Progress circle with animation */}
                        <circle
                            cx="32"
                            cy="32"
                            r="45"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="283"
                            strokeDashoffset={strokeDashoffset}
                            style={{
                                transition: 'stroke-dashoffset 0.5s ease',
                                filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))'
                            }}
                        />
                    </svg>
                    {/* Percentage in center */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        color: 'var(--color-primary)'
                    }}>
                        {Math.round(progress)}%
                    </div>
                </div>

                {/* Step Info */}
                <div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.25rem'
                    }}>
                        {t('progress') || 'Progress'}
                    </div>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        marginBottom: '0.25rem'
                    }}>
                        {steps[currentStepIndex]?.shortLabel}
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                    }}>
                        {t('step_of', { current: currentStepIndex + 1, total: steps.length }) || `Step ${currentStepIndex + 1} of ${steps.length}`}
                    </div>
                </div>

                {/* Animated Dots */}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--color-primary)',
                            animation: `pulseDot 1.4s ease-in-out ${i * 0.2}s infinite`,
                            opacity: i === 0 ? 1 : 0.6
                        }} />
                    ))}
                </div>
            </div>

            {/* Desktop Progress Tracker - Dots */}
            <div className={`${styles.desktopProgress} no-print`} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                position: 'relative',
                gap: '0.5rem'
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
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: isActive || isCompleted ? 'var(--color-primary)' : 'var(--bg-surface)',
                                border: `2px solid ${isActive ? 'var(--color-primary)' : isCompleted ? 'var(--color-primary)' : 'var(--border-color)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: isActive || isCompleted ? '#000' : 'var(--text-muted)',
                                transition: 'all 0.3s ease',
                                boxShadow: isActive ? '0 0 0 4px rgba(16, 185, 129, 0.2)' : 'none'
                            }}>
                                {isCompleted ? '✓' : step.num + 1}
                            </div>
                            <span style={{
                                marginTop: '0.5rem',
                                fontSize: '0.65rem',
                                color: isActive ? 'var(--color-primary)' : isCompleted ? 'var(--text-secondary)' : 'var(--text-muted)',
                                fontWeight: isActive ? '600' : '400',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                maxWidth: '60px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {step.shortLabel}
                            </span>
                            {idx < steps.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '16px',
                                    left: '50%',
                                    width: 'calc(100% - 32px)',
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
        </>
    );
}
