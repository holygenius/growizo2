import { useBuilder } from '../context/BuilderContext';
import { useSettings } from '../context/SettingsContext';

export default function ProgressTracker() {
    const { state, dispatch } = useBuilder();
    const { t } = useSettings();
    const { currentStep } = state;

    const steps = [
        { id: 1, label: t('step1') },
        { id: 2, label: t('step2') },
        { id: 3, label: t('step3') },
        { id: 4, label: t('step4') },
        { id: 5, label: t('step5_media') }, // New Step
        { id: 6, label: t('step6') },       // Was Step 5
        { id: 7, label: t('step7') },       // Was Step 6
        { id: 8, label: t('step8') },       // Was Step 7
    ];

    return (
        <div className="no-print" style={{ marginBottom: '3rem', overflowX: 'auto', padding: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', minWidth: '800px' }}>
                {/* Progress Line Background */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '0',
                    right: '0',
                    height: '4px',
                    background: 'var(--bg-surface)',
                    borderRadius: '2px',
                    zIndex: 0
                }}>
                    {/* Active Progress Line */}
                    <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        borderRadius: '2px',
                        boxShadow: '0 0 10px var(--color-primary-glow)'
                    }} />
                </div>

                {steps.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                        <div
                            key={step.id}
                            onClick={() => step.id < currentStep && dispatch({ type: 'SET_STEP', payload: step.id })}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                zIndex: 1,
                                cursor: step.id < currentStep ? 'pointer' : 'default',
                                position: 'relative',
                                minWidth: '80px'
                            }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                background: isActive || isCompleted ? 'var(--bg-app)' : 'var(--bg-surface)',
                                border: `2px solid ${isActive || isCompleted ? 'var(--color-primary)' : 'var(--bg-surface)'}`,
                                color: isActive || isCompleted ? 'var(--color-primary)' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                marginBottom: '0.75rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isActive ? '0 0 15px var(--color-primary-glow)' : 'none',
                                transform: isActive ? 'scale(1.1)' : 'scale(1)'
                            }}>
                                {isCompleted ? '✓' : step.id}
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                                fontWeight: isActive ? '600' : '400',
                                transition: 'color 0.3s ease',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textAlign: 'center'
                            }}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
