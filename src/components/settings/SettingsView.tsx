import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { settingsStore, loadAllSettings, setSettingsLoading } from '@/stores/settingsStore';
import { getUserSettings } from '@/services/settingsService';
import SettingsSidebar from './SettingsSidebar';
import AccountSection from './sections/AccountSection';
import SecuritySection from './sections/SecuritySection';
import NotificationsSection from './sections/NotificationsSection';
import AppearanceSection from './sections/AppearanceSection';
import LanguageSection from './sections/LanguageSection';
import AboutSection from './sections/AboutSection';

export default function SettingsView() {
  const { currentSection, isLoading } = useStore(settingsStore);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setSettingsLoading(true);
        const data = await getUserSettings();
        loadAllSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar configuración');
      } finally {
        setSettingsLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-state-disabled">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-error mb-4"></i>
        <p className="text-error font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      <SettingsSidebar />
      
      <div className="flex-1">
        {currentSection === 'account' && <AccountSection />}
        {currentSection === 'security' && <SecuritySection />}
        {currentSection === 'notifications' && <NotificationsSection />}
        {currentSection === 'appearance' && <AppearanceSection />}
        {currentSection === 'language' && <LanguageSection />}
        {currentSection === 'about' && <AboutSection />}
      </div>
    </div>
  );
}
