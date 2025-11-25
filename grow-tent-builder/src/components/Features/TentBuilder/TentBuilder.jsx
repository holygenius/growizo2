import React from 'react';
import { useBuilder } from '../../../context/BuilderContext';
import styles from './TentBuilder.module.css';

/**
 * TentBuilder component - Main builder wizard container
 * Handles step navigation and renders the appropriate step component
 */
const TentBuilder = ({ children }) => {
    const { state, dispatch } = useBuilder();
    const { currentStep } = state;
    const totalSteps = 8;

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const handlePrev = () => {
        dispatch({ type: 'PREV_STEP' });
    };

    return (
        <div className={styles.tentBuilderContainer}>
            <div className={styles.builderContent}>
                {/* Step Indicator */}
                <div className={styles.stepIndicator}>
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <div
                            key={i}
                            className={`${styles.stepDot} ${
                                i + 1 === currentStep ? styles.active : ''
                            } ${i + 1 < currentStep ? styles.completed : ''}`}
                        />
                    ))}
                </div>

                {/* Step Content */}
                {children}

                {/* Navigation Buttons */}
                <div className={styles.navigationButtons}>
                    <button
                        className={`${styles.navButton} ${styles.prev}`}
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                    >
                        ← Previous
                    </button>
                    <button
                        className={`${styles.navButton} ${styles.next}`}
                        onClick={handleNext}
                        disabled={currentStep === totalSteps}
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TentBuilder;
