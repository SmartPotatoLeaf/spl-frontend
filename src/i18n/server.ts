import i18n from './config';
import type { Locale } from './astroUtils';

/**
 * Función helper para usar traducciones en componentes Astro SSR
 * @param locale - El locale detectado desde la URL o Astro.locals
 * @returns Función de traducción t()
 */
export function getTranslations(locale: Locale) {
  // Asegurar que i18next esté usando el idioma correcto
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
  
  return i18n.t.bind(i18n);
}
