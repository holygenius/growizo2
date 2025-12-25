import { commonTranslations } from './common.js';
import { builderTranslations } from './builder.js';
import { toolsTranslations } from './tools.js';
import { feedingTranslations } from './feeding.js';
import { navigationTranslations } from './navigation.js';
import { landingTranslations } from './landing.js';
import { onboardingTranslations } from './onboarding.js';
import { errorTranslations } from './errors.js';
import { adminTranslations } from './admin.js';
import { productTranslations } from './products.js';

/**
 * Merges translation objects for a given language.
 * @param {string} lang - The language code ('en' or 'tr')
 * @returns {Object} - Merged translations for the language
 */
const mergeTranslations = (lang) => ({
  ...commonTranslations[lang],
  ...builderTranslations[lang],
  ...toolsTranslations[lang],
  ...feedingTranslations[lang],
  ...navigationTranslations[lang],
  ...landingTranslations[lang],
  ...onboardingTranslations[lang],
  ...errorTranslations[lang],
  ...adminTranslations[lang],
  ...productTranslations[lang],
});

export const translations = {
  en: mergeTranslations('en'),
  tr: mergeTranslations('tr'),
};

// Export individual domain translations for selective imports
export {
  commonTranslations,
  builderTranslations,
  toolsTranslations,
  feedingTranslations,
  navigationTranslations,
  landingTranslations,
  onboardingTranslations,
  errorTranslations,
  adminTranslations,
  productTranslations,
};
