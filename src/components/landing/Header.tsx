import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '../layout/Logo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur z-50 border-b border-outline">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group">
            <Logo width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-lg sm:text-xl font-bold hidden sm:inline" style={{ color: 'var(--color-primary)' }}>
              SmartPotatoLeaf
            </span>
          </a>

          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="/auth"
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              className="px-4 sm:px-6 py-2 font-semibold border-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('landing.header.login')}
            </a>
            <a
              href="/auth?mode=register"
              style={{ backgroundColor: 'var(--color-primary)' }}
              className="px-4 sm:px-6 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
            >
              {t('landing.header.register')}
            </a>
          </div>

          <div className="flex sm:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-state-idle`}></i>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-outline animate-fade-in-up">
            <div className="flex flex-col gap-2">
              <a
                href="/auth"
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                className="px-4 py-2 font-semibold border-2 rounded-lg hover:bg-gray-50 transition-colors text-center w-full"
              >
                {t('landing.header.login')}
              </a>
              <a
                href="/auth?mode=register"
                style={{ backgroundColor: 'var(--color-primary)' }}
                className="px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-all text-center w-full"
              >
                {t('landing.header.register')}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
