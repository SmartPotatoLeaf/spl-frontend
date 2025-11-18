import {useStore} from '@nanostores/react';
import {useTranslation} from 'react-i18next';
import {markSettingsSaved, setNotifications, setSettingsSaving, settingsStore} from '@/stores/settingsStore';
import {updateNotifications} from '@/services/settingsService';
import {toast} from '@/stores/toastStore';

export default function NotificationsSection() {
  const { t } = useTranslation();
  const { settings, isSaving } = useStore(settingsStore);
  const { notifications } = settings;

  const handleToggle = async (section: 'email' | 'inApp', key: string, value: boolean) => {
    const updated = {
      ...notifications,
      [section]: {
        ...notifications[section],
        [key]: value,
      },
    };

    try {
      setSettingsSaving(true);
      setNotifications(updated);
      await updateNotifications(updated);
      markSettingsSaved();
      toast.success(t('settings.notificationsSection.successUpdate'));
    } catch (error) {
      toast.error(t('settings.notificationsSection.errorUpdate'));
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleFrequencyChange = async (frequency: 'realtime' | 'daily' | 'weekly') => {
    const updated = { ...notifications, frequency };

    try {
      setSettingsSaving(true);
      setNotifications(updated);
      await updateNotifications(updated);
      markSettingsSaved();
      toast.success(t('settings.notificationsSection.successFrequency'));
    } catch (error) {
      toast.error(t('settings.notificationsSection.errorFrequency'));
    } finally {
      setSettingsSaving(false);
    }
  };

  const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-switch-on' : 'bg-switch-off'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-white rounded-lg border border-outline p-6 space-y-8">
      <h2 className="text-2xl font-bold text-state-idle">{t('settings.notificationsSection.title')}</h2>

      {/* Notificaciones por email */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.notificationsSection.emailNotifications')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">{t('settings.notificationsSection.weeklyReport')}</p>
              <p className="text-sm text-state-disabled">{t('settings.notificationsSection.weeklyReportDesc')}</p>
            </div>
            <Toggle
              checked={notifications.email.weeklyReport}
              onChange={() => handleToggle('email', 'weeklyReport', !notifications.email.weeklyReport)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">{t('settings.notificationsSection.criticalAlerts')}</p>
              <p className="text-sm text-state-disabled">{t('settings.notificationsSection.criticalAlertsDesc')}</p>
            </div>
            <Toggle
              checked={notifications.email.criticalAlerts}
              onChange={() => handleToggle('email', 'criticalAlerts', !notifications.email.criticalAlerts)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">{t('settings.notificationsSection.plotReminders')}</p>
              <p className="text-sm text-state-disabled">{t('settings.notificationsSection.plotRemindersDesc')}</p>
            </div>
            <Toggle
              checked={notifications.email.plotReminders}
              onChange={() => handleToggle('email', 'plotReminders', !notifications.email.plotReminders)}
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Notificaciones en la app */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.notificationsSection.inAppNotifications')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">{t('settings.notificationsSection.sound')}</p>
              <p className="text-sm text-state-disabled">{t('settings.notificationsSection.soundDesc')}</p>
            </div>
            <Toggle
              checked={notifications.inApp.sound}
              onChange={() => handleToggle('inApp', 'sound', !notifications.inApp.sound)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">{t('settings.notificationsSection.badge')}</p>
              <p className="text-sm text-state-disabled">{t('settings.notificationsSection.badgeDesc')}</p>
            </div>
            <Toggle
              checked={notifications.inApp.badge}
              onChange={() => handleToggle('inApp', 'badge', !notifications.inApp.badge)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">{t('settings.notificationsSection.systemNotifications')}</p>
              <p className="text-sm text-state-disabled">{t('settings.notificationsSection.systemNotificationsDesc')}</p>
            </div>
            <Toggle
              checked={notifications.inApp.system}
              onChange={() => handleToggle('inApp', 'system', !notifications.inApp.system)}
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Frecuencia */}
      <div>
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.notificationsSection.frequency')}</h3>
        <div className="space-y-3">
          {[
            { value: 'realtime', label: t('settings.notificationsSection.realtime'), description: t('settings.notificationsSection.realtimeDesc') },
            { value: 'daily', label: t('settings.notificationsSection.daily'), description: t('settings.notificationsSection.dailyDesc') },
            { value: 'weekly', label: t('settings.notificationsSection.weekly'), description: t('settings.notificationsSection.weeklyDesc') },
          ].map(option => (
            <label
              key={option.value}
              className="flex items-center gap-4 p-4 border border-outline rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="frequency"
                value={option.value}
                checked={notifications.frequency === option.value}
                onChange={() => handleFrequencyChange(option.value as any)}
                disabled={isSaving}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <p className="text-state-idle font-medium">{option.label}</p>
                <p className="text-sm text-state-disabled">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
