import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Sincronizar i18next con el locale almacenado al montar
  useEffect(() => {
    const storedLocale = localStorage.getItem('i18nextLng');
    if (storedLocale && i18n.language !== storedLocale) {
      i18n.changeLanguage(storedLocale);
    }
  }, [i18n]);

  return (
    <footer className="bg-white border-t border-outline mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-state-idle font-medium">
              {t('footer.appName')}
            </p>
            <p className="text-xs text-state-disabled mt-1">
              {t('footer.description')}
            </p>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-sm text-state-disabled">
              © {currentYear} {t('footer.appName')}. {t('footer.copyright')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
