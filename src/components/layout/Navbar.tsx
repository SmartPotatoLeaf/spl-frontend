import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Logo from './Logo';

interface NavbarProps {
  activeRoute?: string;
}

export default function Navbar({ activeRoute = 'home' }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sincronizar i18next con el locale almacenado al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLocale = localStorage.getItem('i18nextLng');
      if (storedLocale && i18n.language !== storedLocale) {
        i18n.changeLanguage(storedLocale);
      }
    }
  }, [i18n]);

  const navItems = [
    { label: t('nav.home'), href: '/home', key: 'home' },
    { label: t('nav.upload'), href: '/upload', key: 'upload' },
    { label: t('nav.history'), href: '/history', key: 'history' },
    { label: t('nav.dashboard'), href: '/dashboard', key: 'dashboard' },
    { label: t('nav.plots'), href: '/plots', key: 'parcelas' },
  ];

  return (
    <nav className="bg-white border-b border-outline sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Nombre */}
          <a href="/home" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <Logo />
            <span className="text-lg sm:text-xl font-bold text-primary hidden sm:block">SmartPotatoLeaf</span>
          </a>

          {/* Navegación Central (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeRoute === item.key ? 'text-primary' : 'text-state-idle'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Settings */}
            <a href="/settings" className="p-2 text-state-idle hover:text-primary transition-colors">
              <i className="fas fa-cog text-lg"></i>
            </a>

            {/* Menú hamburguesa (Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-state-idle hover:text-primary transition-colors"
            >
              <i className="fas fa-bars text-lg"></i>
            </button>
          </div>
        </div>

        {/* Menú móvil expandible */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="py-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeRoute === item.key
                      ? 'bg-primary/10 text-primary'
                      : 'text-state-idle hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
