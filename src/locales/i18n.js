import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './en.json';
import de from './de.json';

i18n
  .use(LanguageDetector) // detect browser language
  .use(initReactI18next) // connect with react
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    lng: (typeof window !== 'undefined' && localStorage.getItem('i18nextLng')) || 'de',
    fallbackLng: 'de',
    interpolation: {
      escapeValue: false, // react already escapes
    },
  });

export default i18n;
