// Re-export all types
export * from './builder';
export * from './auth';
export * from './settings';

// Common types
export interface SelectOption {
  value: string;
  label: string;
}

export interface Translations {
  en: Record<string, string>;
  tr: Record<string, string>;
}
