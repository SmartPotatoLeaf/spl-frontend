import { useStore } from '@nanostores/react';
import { useTranslation } from 'react-i18next';
import { settingsStore, setCurrentSection } from '@/stores/settingsStore';
import type { SettingsSection } from '@/types/settings';
import {logout} from "@/stores";

interface MenuItem {
  section: SettingsSection;
  labelKey: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { section: 'account', labelKey: 'settings.accountSection.title', icon: 'fa-user' },
  { section: 'security', labelKey: 'settings.securitySection.title', icon: 'fa-shield-halved' },
  { section: 'notifications', labelKey: 'settings.notificationsSection.title', icon: 'fa-bell' },
  { section: 'appearance', labelKey: 'settings.appearanceSection.title', icon: 'fa-palette' },
  { section: 'language', labelKey: 'settings.languageSection.title', icon: 'fa-globe' },
  { section: 'about', labelKey: 'settings.aboutSection.title', icon: 'fa-circle-info' },
];

export default function SettingsSidebar() {
  const { t } = useTranslation();
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
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t border-outline">
        <a
          href="/auth"
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-error hover:bg-error/5 transition-colors"
        >
          <i className="fas fa-arrow-right-from-bracket w-5 text-center"></i>
          <span>{t('common.logout')}</span>
        </a>
      </div>
    </div>
  );
}
