import {useStore} from '@nanostores/react';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {
  markSettingsSaved,
  setDateFormat,
  setLanguage,
  setSettingsSaving,
  setTimezone,
  settingsStore
} from '@/stores/settingsStore';
import {getTimezones, updateLanguage} from '@/services/settingsService';
import {toast} from '@/stores/toastStore';
import type {DateFormat, Language} from '@/types/settings';

export default function LanguageSection() {
  const { t, i18n } = useTranslation();
  const { settings, isSaving } = useStore(settingsStore);
  const { dateFormat, timezone, autoDetectTimezone } = settings.language;

  // Usar el idioma actual de i18next en lugar del store
  const currentLanguage = i18n.language as Language;

  const [localTimezone, setLocalTimezone] = useState(timezone);
  const [autoDetect, setAutoDetect] = useState(autoDetectTimezone);

  const handleLanguageChange = async (newLanguage: Language) => {
    try {
      setSettingsSaving(true);

      // Cambiar el idioma en i18next
      await i18n.changeLanguage(newLanguage);

      // Actualizar el store
      setLanguage(newLanguage);

      await updateLanguage(newLanguage, dateFormat, timezone);
      markSettingsSaved();
      toast.success(t('settings.languageSection.successLanguage'));

      // Recargar la página después de 500ms para que se vea el toast
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error(t('settings.languageSection.errorLanguage'));
      setSettingsSaving(false);
    }
  };

  const handleDateFormatChange = async (newFormat: DateFormat) => {
    try {
      setSettingsSaving(true);
      setDateFormat(newFormat);
      await updateLanguage(currentLanguage, newFormat, timezone);
      markSettingsSaved();
      toast.success(t('settings.languageSection.successDate'));
    } catch (error) {
      toast.error(t('settings.languageSection.errorDate'));
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleTimezoneChange = async () => {
    try {
      setSettingsSaving(true);
      setTimezone(localTimezone, autoDetect);
      await updateLanguage(currentLanguage, dateFormat, localTimezone);
      markSettingsSaved();
      toast.success(t('settings.languageSection.successTimezone'));
    } catch (error) {
      toast.error(t('settings.languageSection.errorTimezone'));
    } finally {
      setSettingsSaving(false);
    }
  };

  const timezones = getTimezones();
  const now = new Date();

  return (
    <div className="bg-white rounded-lg border border-outline p-6 space-y-8">
      <h2 className="text-2xl font-bold text-state-idle">{t('settings.languageSection.title')}</h2>

      {/* Idioma */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.languageSection.interface')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleLanguageChange('es-PE')}
            disabled={isSaving}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              currentLanguage === 'es-PE'
                ? 'border-primary bg-primary/5'
                : 'border-outline hover:border-primary/50'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-state-idle">{t('settings.languageSection.spanish')}</p>
                <p className="text-sm text-state-disabled">{t('settings.languageSection.spanishDefault')}</p>
              </div>
              {currentLanguage === 'es-PE' && <i className="fas fa-check-circle text-primary text-xl"></i>}
            </div>
          </button>

          <button
            onClick={() => handleLanguageChange('en')}
            disabled={isSaving}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              currentLanguage === 'en'
                ? 'border-primary bg-primary/5'
                : 'border-outline hover:border-primary/50'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-state-idle">{t('settings.languageSection.english')}</p>
              </div>
              {currentLanguage === 'en' && <i className="fas fa-check-circle text-primary text-xl"></i>}
            </div>
          </button>
        </div>
      </div>

      {/* Formato de fecha */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.languageSection.dateFormat')}</h3>
        <div className="space-y-3">
          {[
            { value: 'dd/mm/yyyy', label: 'DD/MM/AAAA', example: now.toLocaleDateString('es-PE') },
            { value: 'mm/dd/yyyy', label: 'MM/DD/AAAA', example: now.toLocaleDateString('en-US') },
            { value: 'yyyy-mm-dd', label: 'AAAA-MM-DD', example: now.toISOString().split('T')[0] },
          ].map(format => (
            <label
              key={format.value}
              className="flex items-center justify-between p-4 border border-outline rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="dateFormat"
                  value={format.value}
                  checked={dateFormat === format.value}
                  onChange={() => handleDateFormatChange(format.value as DateFormat)}
                  disabled={isSaving}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <div>
                  <p className="text-state-idle font-medium">{format.label}</p>
                  <p className="text-sm text-state-disabled">{t('settings.languageSection.example')}: {format.example}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Zona horaria */}
      <div>
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.languageSection.timezone')}</h3>

        <div className="mb-4">
          <label className="flex items-center gap-3 p-4 border border-outline rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={e => setAutoDetect(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary rounded"
            />
            <div>
              <p className="text-state-idle font-medium">{t('settings.languageSection.autoDetect')}</p>
              <p className="text-sm text-state-disabled">{t('settings.languageSection.autoDetectDesc')}</p>
            </div>
          </label>
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-state-idle mb-2">
            {t('settings.languageSection.manualSelection')}
          </label>
          <select
            id="timezone"
            value={localTimezone}
            onChange={e => setLocalTimezone(e.target.value)}
            disabled={autoDetect}
            className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleTimezoneChange}
          disabled={isSaving || (localTimezone === timezone && autoDetect === autoDetectTimezone)}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving && <i className="fas fa-spinner fa-spin"></i>}
          {t('settings.languageSection.saveTimezone')}
        </button>
      </div>
    </div>
  );
}
