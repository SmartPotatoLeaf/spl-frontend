import { useStore } from '@nanostores/react';
import { settingsStore, setCurrentSection } from '@/stores/settingsStore';
import type { SettingsSection } from '@/types/settings';

interface MenuItem {
  section: SettingsSection;
  label: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { section: 'account', label: 'Cuenta', icon: 'fa-user' },
  { section: 'security', label: 'Seguridad', icon: 'fa-shield-halved' },
  { section: 'notifications', label: 'Notificaciones', icon: 'fa-bell' },
  { section: 'appearance', label: 'Apariencia', icon: 'fa-palette' },
  { section: 'language', label: 'Idioma y región', icon: 'fa-globe' },
  { section: 'about', label: 'Acerca de', icon: 'fa-circle-info' },
];

export default function SettingsSidebar() {
  const { currentSection } = useStore(settingsStore);

  return (
    <div className="bg-white rounded-lg border border-outline p-4 lg:w-64">
      <nav className="space-y-1">
        {menuItems.map(item => (
          <button
            key={item.section}
            onClick={() => setCurrentSection(item.section)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentSection === item.section
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-state-idle hover:bg-gray-50'
            }`}
          >
            <i className={`fas ${item.icon} w-5 text-center`}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t border-outline">
        <a
          href="/home"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-error hover:bg-error/5 transition-colors"
        >
          <i className="fas fa-arrow-right-from-bracket w-5 text-center"></i>
          <span>Salir</span>
        </a>
      </div>
    </div>
  );
}
