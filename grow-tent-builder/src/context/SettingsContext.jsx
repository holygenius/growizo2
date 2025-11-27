import { createContext, useContext, useState } from 'react';
import { translations } from '../utils/translations_fixed';

const SettingsContext = createContext();
// Trigger HMR update

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

    // We need to access navigation, but this provider is inside Router in App.jsx
    // So we can't use useNavigate here directly if it's wrapping the Router.
    // However, usually SettingsProvider wraps App content.
    // Let's assume we will move BrowserRouter UP in App.jsx to wrap SettingsProvider,
    // OR we will handle the URL sync in a separate component inside Router.
    // For now, let's provide the helper functions.

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

        if (typeof text === 'string') {
            Object.keys(params).forEach(param => {
                text = text.replace(`{${param}}`, params[param]);
            });
        }

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

    const getBuilderUrl = () => {
        // Return localized URL
        return language === 'tr' ? `/${language}/olusturucu` : `/${language}/builder`;
    };

    // URL path mappings for TR
    const pathMappings = {
        '/onboarding': '/baslangic',
        '/builder': '/olusturucu',
        '/blog': '/yazilar',
        '/tools': '/araclar',
        '/tools/electricity-cost-calculator': '/araclar/elektrik-maliyet-hesaplayici',
        '/tools/unit-converter': '/araclar/birim-donusturucu',
        '/tools/co2-calculator': '/araclar/co2-hesaplayici',
        '/tools/ppfd-heatmap': '/araclar/ppfd-isi-haritasi',
        '/feeding/biobizz': '/beslenme/biobizz'
    };

    const getLocalizedPath = (path) => {
        // Ensure path starts with /
        const cleanPath = path.startsWith('/') ? path : `/${path}`;

        // If Turkish, use localized paths
        if (language === 'tr' && pathMappings[cleanPath]) {
            return `/${language}${pathMappings[cleanPath]}`;
        }

        return `/${language}${cleanPath}`;
    };

    return (
        <SettingsContext.Provider value={{
            language, setLanguage,
            currency, setCurrency,
            unitSystem, setUnitSystem,
            t,
            formatPrice,
            formatUnit,
            getUnitLabel,
            getBuilderUrl,
            getLocalizedPath
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
