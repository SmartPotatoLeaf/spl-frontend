import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang === 'en' || savedLang === 'es-PE') {
      return savedLang;
    }
  }
  return 'es-PE';
};

export const languageStore = atom<string>(getInitialLanguage());
export const isLanguageMenuOpen = atom<boolean>(false);

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = useStore(languageStore);
  const isOpen = useStore(isLanguageMenuOpen);

  useEffect(() => {
    const lang = i18n.language === 'en' ? 'en' : 'es-PE';
    languageStore.set(lang);
  }, [i18n.language]);

  const handleLanguageChange = async (newLang: string) => {
    try {
      await i18n.changeLanguage(newLang);
      localStorage.setItem('i18nextLng', newLang);
      languageStore.set(newLang);
      isLanguageMenuOpen.set(false);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => isLanguageMenuOpen.set(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Change language"
      >
        <span className="font-semibold text-state-idle text-sm">
          {currentLang === 'es-PE' ? 'ES' : 'EN'}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => isLanguageMenuOpen.set(false)}
          ></div>

          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-outline z-20 overflow-hidden">
            <button
              onClick={() => handleLanguageChange('es-PE')}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              style={currentLang === 'es-PE' ? { backgroundColor: 'rgba(97, 162, 83, 0.05)' } : {}}
            >
              <span className="font-semibold text-state-idle">Español</span>
              {currentLang === 'es-PE' && (
                <i className="fas fa-check" style={{ color: 'var(--color-primary)' }}></i>
              )}
            </button>

            <button
              onClick={() => handleLanguageChange('en')}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
              style={currentLang === 'en' ? { backgroundColor: 'rgba(97, 162, 83, 0.05)' } : {}}
            >
              <span className="font-semibold text-state-idle">English</span>
              {currentLang === 'en' && (
                <i className="fas fa-check" style={{ color: 'var(--color-primary)' }}></i>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
