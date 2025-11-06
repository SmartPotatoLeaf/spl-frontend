import { useStore } from '@nanostores/react';
import { useTranslation } from 'react-i18next';
import { settingsStore, setTheme, setSettingsSaving, markSettingsSaved } from '@/stores/settingsStore';
import { updateAppearance } from '@/services/settingsService';
import { toast } from '@/stores/toastStore';
import type { Theme } from '@/types/settings';

export default function AppearanceSection() {
  const { t } = useTranslation();
  const { settings, isSaving } = useStore(settingsStore);
  const { theme } = settings.appearance;

  const handleThemeChange = async (newTheme: Theme) => {
    try {
      setSettingsSaving(true);
      setTheme(newTheme);
      await updateAppearance(newTheme);
      markSettingsSaved();
      toast.success(t('settings.appearanceSection.successTheme'));
    } catch (error) {
      toast.error(t('settings.appearanceSection.errorTheme'));
    } finally {
      setSettingsSaving(false);
    }
  };

  const themes: { value: Theme; label: string; icon: string; description: string }[] = [
    {
      value: 'light',
      label: t('settings.appearanceSection.light'),
      icon: 'fa-sun',
      description: t('settings.appearanceSection.lightDesc'),
    },
    {
      value: 'dark',
      label: t('settings.appearanceSection.dark'),
      icon: 'fa-moon',
      description: t('settings.appearanceSection.darkDesc'),
    },
    {
      value: 'system',
      label: t('settings.appearanceSection.system'),
      icon: 'fa-circle-half-stroke',
      description: t('settings.appearanceSection.systemDesc'),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-outline p-6">
      <h2 className="text-2xl font-bold text-state-idle mb-6">{t('settings.appearanceSection.title')}</h2>

      <div>
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.appearanceSection.theme')}</h3>
        <p className="text-sm text-state-disabled mb-6">
          {t('settings.appearanceSection.themeDesc')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map(themeOption => (
            <button
              key={themeOption.value}
              onClick={() => themeOption.value === 'light' && handleThemeChange(themeOption.value)}
              disabled={isSaving || themeOption.value !== 'light'}
              className={`relative p-6 border-2 rounded-lg text-left transition-all ${
                theme === themeOption.value
                  ? 'border-primary bg-primary/5'
                  : 'border-outline hover:border-primary/50'
              } ${(isSaving || themeOption.value !== 'light') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  theme === themeOption.value ? 'bg-primary text-white' : 'bg-gray-100 text-state-idle'
                }`}>
                  <i className={`fas ${themeOption.icon} text-2xl`}></i>
                </div>
                <div>
                  <p className="font-semibold text-state-idle">
                    {themeOption.label}
                    {themeOption.value !== 'light' && (
                      <span className="ml-2 text-xs text-state-disabled">({t('settings.appearanceSection.comingSoon')})</span>
                    )}
                  </p>
                  <p className="text-sm text-state-disabled mt-1">{themeOption.description}</p>
                </div>
              </div>
              {theme === themeOption.value && (
                <div className="absolute top-3 right-3">
                  <i className="fas fa-check-circle text-primary text-xl"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
