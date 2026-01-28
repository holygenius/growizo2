import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SettingsContextValue, Language, Theme } from '../types';
import { translations } from '../utils/translations/index.js';

const initialState: SettingsContextValue = {
  language: 'en',
  theme: 'dark',
  measurements: 'imperial',
  currency: 'USD',
  setLanguage: () => {},
  setTheme: () => {},
  setMeasurements: () => {},
  setCurrency: () => {},
  t: (key: string) => key,
  getLocalizedPath: (path: string) => `/en${path}`,
  getBuilderUrl: () => '/en/grow-tent-builder',
  getUnitLabel: () => 'ft',
  formatUnit: (value: number) => value.toFixed(1),
  toggleTheme: () => {},
  formatPrice: (price: number) => `$${price.toFixed(2)}`,
  unitSystem: 'IMPERIAL',
  setUnitSystem: () => {}
};

const SettingsContext = createContext<SettingsContextValue>(initialState);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [measurements, setMeasurementsState] = useState<'metric' | 'imperial'>('imperial');
  const [currency, setCurrencyState] = useState('USD');

  // Persist settings
  useEffect(() => {
    const savedLang = localStorage.getItem('growizard-language') as Language;
    const savedTheme = localStorage.getItem('growizard-theme') as Theme;
    const savedMeasurements = localStorage.getItem('growizard-measurements') as 'metric' | 'imperial';
    const savedCurrency = localStorage.getItem('growizard-currency');

    if (savedLang && (savedLang === 'en' || savedLang === 'tr')) {
      setLanguageState(savedLang);
    }
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
      setThemeState(savedTheme);
    }
    if (savedMeasurements && (savedMeasurements === 'metric' || savedMeasurements === 'imperial')) {
      setMeasurementsState(savedMeasurements);
    }
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('growizard-theme', theme);
  }, [theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('growizard-language', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setMeasurements = (system: 'metric' | 'imperial') => {
    setMeasurementsState(system);
    localStorage.setItem('growizard-measurements', system);
  };

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('growizard-currency', newCurrency);
  };

  const t = (key: string): string => {
    const langTranslations = translations[language] || translations.en;
    return langTranslations[key] || key;
  };

  const getLocalizedPath = (path: string): string => {
    // Prefix path with current language
    return `/${language}${path}`;
  };

  const getBuilderUrl = (): string => {
    // Return localized builder path
    const builderPaths: Record<Language, string> = {
      en: '/en/grow-tent-builder',
      tr: '/tr/bitki-yetistirme-kabini-olusturucu'
    };
    return builderPaths[language];
  };

  const getUnitLabel = (dimension: 'length' | 'volume' | 'area'): string => {
    // Return unit label based on measurement system
    const unitLabels: Record<'metric' | 'imperial', Record<string, string>> = {
      imperial: { length: 'ft', volume: 'gal', area: 'sq ft' },
      metric: { length: 'm', volume: 'L', area: 'sq m' }
    };
    return unitLabels[measurements][dimension] || unitLabels[measurements].length;
  };

  const toggleTheme = (): void => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatUnit = (value: number, dimension: 'length' | 'volume' | 'area'): string => {
    // Convert and format based on measurement system
    if (measurements === 'metric') {
      // Convert from imperial to metric
      let metricValue = value;
      if (dimension === 'length') {
        metricValue = value * 0.3048; // ft to m
      } else if (dimension === 'area') {
        metricValue = value * 0.0929; // sq ft to sq m
      } else if (dimension === 'volume') {
        metricValue = value * 3.785; // gal to L
      }
      return metricValue.toFixed(1);
    }
    return value.toFixed(1);
  };

  // Legacy unit system (uppercase for compatibility)
  const [unitSystem, setUnitSystemState] = useState<'METRIC' | 'IMPERIAL'>('IMPERIAL');

  const setUnitSystem = (system: 'METRIC' | 'IMPERIAL'): void => {
    setUnitSystemState(system);
    // Also sync with measurements
    if (system === 'METRIC') {
      setMeasurementsState('metric');
    } else {
      setMeasurementsState('imperial');
    }
  };

  const value: SettingsContextValue = {
    language,
    theme,
    measurements,
    currency,
    setLanguage,
    setTheme,
    setMeasurements,
    setCurrency,
    t,
    getLocalizedPath,
    getBuilderUrl,
    getUnitLabel,
    formatUnit,
    toggleTheme,
    formatPrice,
    unitSystem,
    setUnitSystem
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export default SettingsContext;
