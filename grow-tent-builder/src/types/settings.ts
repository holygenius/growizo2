// Settings State Types

export type Language = 'en' | 'tr';
export type Theme = 'light' | 'dark' | 'system';

export interface SettingsState {
  language: Language;
  theme: Theme;
  measurements: 'metric' | 'imperial';
  currency: string;
}

export type TranslationFunction = (key: string) => string;

export interface SettingsContextValue extends SettingsState {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setMeasurements: (system: 'metric' | 'imperial') => void;
  setCurrency: (currency: string) => void;
  t: TranslationFunction;
  getLocalizedPath: (path: string) => string;
  getBuilderUrl: () => string;
  getUnitLabel: (dimension: 'length' | 'volume' | 'area') => string;
  formatUnit: (value: number, dimension: 'length' | 'volume' | 'area') => string;
  toggleTheme: () => void;
  formatPrice: (price: number) => string;
  // Legacy unit system (uppercase for compatibility)
  unitSystem: 'METRIC' | 'IMPERIAL';
  setUnitSystem: (system: 'METRIC' | 'IMPERIAL') => void;
}
