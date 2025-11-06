/**
 * Utilidades para i18n de Astro
 * Estas funciones usan el sistema nativo de routing de Astro
 */

export type Locale = 'es-PE' | 'en';

export const defaultLocale: Locale = 'es-PE';
export const locales: Locale[] = ['es-PE', 'en'];

/**
 * Obtiene el locale desde una URL usando el routing de Astro
 */
export function getLocaleFromUrl(url: URL): Locale {
  const pathname = url.pathname;
  const segments = pathname.split('/').filter(Boolean);
  
  // Si la primera parte del path es un locale válido
  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    return segments[0] as Locale;
  }
  
  // Si no hay locale en la URL, usar el default
  return defaultLocale;
}

/**
 * Obtiene el locale desde localStorage (para cliente)
 */
export function getLocaleFromStorage(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  
  const stored = localStorage.getItem('i18nextLng');
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale;
  }
  
  return defaultLocale;
}

/**
 * Guarda el locale en localStorage
 */
export function saveLocaleToStorage(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('i18nextLng', locale);
}

/**
 * Construye una URL con el locale correcto
 */
export function getLocalizedUrl(path: string, locale: Locale): string {
  // Si es el locale por defecto, no agregar prefijo
  if (locale === defaultLocale) {
    return path;
  }
  
  // Agregar prefijo de locale
  return `/${locale}${path}`;
}
