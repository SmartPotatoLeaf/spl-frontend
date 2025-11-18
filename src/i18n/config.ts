import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esTranslation from './locales/es-PE.json';
import enTranslation from './locales/en.json';

const resources = {
  'es-PE': {
    translation: esTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Integración con React
  .init({
    resources,
    fallbackLng: 'es-PE', // Idioma por defecto si no se detecta ninguno
    debug: false, // Modo debug para desarrollo

    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
