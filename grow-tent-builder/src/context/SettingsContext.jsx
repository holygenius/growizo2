import { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations';

const SettingsContext = createContext();

export const CURRENCIES = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    TRY: { symbol: '₺', rate: 32.50 }
};

export const UNITS = {
    IMPERIAL: { label: 'ft', factor: 1, area: 'sq ft', vol: 'cu ft' },
    METRIC: { label: 'cm', factor: 30.48, area: 'm²', vol: 'm³' }
};

// Detect browser language
const detectBrowserLanguage = () => {
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.toLowerCase().startsWith('tr')) {
        return 'tr';
    }
    return 'en';
};

// Load from localStorage or use defaults
const getInitialLanguage = () => {
    const saved = localStorage.getItem('language');
    return saved || detectBrowserLanguage();
};

const getInitialCurrency = () => {
    const saved = localStorage.getItem('currency');
    if (saved) return saved;
    const lang = getInitialLanguage();
    return lang === 'tr' ? 'TRY' : 'USD';
};

const getInitialUnitSystem = () => {
    const saved = localStorage.getItem('unitSystem');
    if (saved) return saved;
    const lang = getInitialLanguage();
    return lang === 'tr' ? 'METRIC' : 'IMPERIAL';
};

export function SettingsProvider({ children }) {
    const [language, setLanguageState] = useState(getInitialLanguage);
    const [currency, setCurrencyState] = useState(getInitialCurrency);
    const [unitSystem, setUnitSystemState] = useState(getInitialUnitSystem);

    const setLanguage = (lang) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);

        if (lang === 'tr') {
            setCurrency('TRY');
            setUnitSystem('METRIC');
        } else if (lang === 'en') {
            setCurrency('USD');
            setUnitSystem('IMPERIAL');
        }
    };

    const setCurrency = (curr) => {
        setCurrencyState(curr);
        localStorage.setItem('currency', curr);

        if (curr === 'EUR' || curr === 'TRY') {
            setUnitSystem('METRIC');
        } else if (curr === 'USD') {
            setUnitSystem('IMPERIAL');
        }
    };

    const setUnitSystem = (units) => {
        setUnitSystemState(units);
        localStorage.setItem('unitSystem', units);
    };

    const t = (key, params = {}) => {
        let text = translations[language][key] || key;
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        return text;
    };

    const formatPrice = (priceUSD) => {
        const { symbol, rate } = CURRENCIES[currency];
        return `${symbol}${(priceUSD * rate).toFixed(2)}`;
    };

    const formatUnit = (value, type = 'length') => {
        if (unitSystem === 'IMPERIAL') return value;
        if (type === 'length') return (value * 30.48).toFixed(0);
        if (type === 'area') return (value * 0.0929).toFixed(2);
        if (type === 'volume') return (value * 0.0283).toFixed(2);
        return value;
    };

    const getUnitLabel = (type = 'length') => {
        if (unitSystem === 'IMPERIAL') {
            if (type === 'length') return 'ft';
            if (type === 'area') return 'sq ft';
            if (type === 'volume') return 'cu ft';
        } else {
            if (type === 'length') return 'cm';
            if (type === 'area') return 'm²';
            if (type === 'volume') return 'm³';
        }
    };

    return (
        <SettingsContext.Provider value={{
            language, setLanguage,
            currency, setCurrency,
            unitSystem, setUnitSystem,
            t,
            formatPrice,
            formatUnit,
            getUnitLabel
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
