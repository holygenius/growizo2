import React, { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within OnboardingProvider');
    }
    return context;
};

export const OnboardingProvider = ({ children }) => {
    const [onboardingData, setOnboardingData] = useState(() => {
        const saved = localStorage.getItem('onboardingData');
        return saved ? JSON.parse(saved) : {
            plantType: null,
            experienceLevel: null,
            tentSize: null,
            lightPreference: null,
            automationLevel: null,
            completed: false
        };
    });

    useEffect(() => {
        localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    }, [onboardingData]);

    const updateOnboarding = (field, value) => {
        setOnboardingData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const completeOnboarding = () => {
        setOnboardingData(prev => ({
            ...prev,
            completed: true
        }));
        localStorage.setItem('seenOnboarding', 'true');
    };

    const resetOnboarding = () => {
        setOnboardingData({
            plantType: null,
            experienceLevel: null,
            tentSize: null,
            lightPreference: null,
            automationLevel: null,
            completed: false
        });
        localStorage.removeItem('seenOnboarding');
    };

    const hasSeenOnboarding = () => {
        return localStorage.getItem('seenOnboarding') === 'true';
    };

    return (
        <OnboardingContext.Provider value={{
            onboardingData,
            updateOnboarding,
            completeOnboarding,
            resetOnboarding,
            hasSeenOnboarding
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export default OnboardingContext;
