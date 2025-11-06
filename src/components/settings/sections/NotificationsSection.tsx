import { useStore } from '@nanostores/react';
import { settingsStore, setNotifications, setSettingsSaving, markSettingsSaved } from '@/stores/settingsStore';
import { updateNotifications } from '@/services/settingsService';
import { toast } from '@/stores/toastStore';

export default function NotificationsSection() {
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
      toast.success('Notificaciones actualizadas');
    } catch (error) {
      toast.error('Error al actualizar notificaciones');
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
      toast.success('Frecuencia actualizada');
    } catch (error) {
      toast.error('Error al actualizar frecuencia');
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
      <h2 className="text-2xl font-bold text-state-idle">Notificaciones</h2>

      {/* Notificaciones por email */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">Notificaciones por email</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">Resumen semanal de diagnósticos</p>
              <p className="text-sm text-state-disabled">Recibe un resumen cada semana</p>
            </div>
            <Toggle
              checked={notifications.email.weeklyReport}
              onChange={() => handleToggle('email', 'weeklyReport', !notifications.email.weeklyReport)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">Alertas críticas</p>
              <p className="text-sm text-state-disabled">Notificaciones de severidad alta</p>
            </div>
            <Toggle
              checked={notifications.email.criticalAlerts}
              onChange={() => handleToggle('email', 'criticalAlerts', !notifications.email.criticalAlerts)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">Recordatorios de parcelas</p>
              <p className="text-sm text-state-disabled">Recordatorios de parcelas sin revisar</p>
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
        <h3 className="text-lg font-semibold text-state-idle mb-4">Notificaciones en la app</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">Sonido activado</p>
              <p className="text-sm text-state-disabled">Reproducir sonido al recibir notificación</p>
            </div>
            <Toggle
              checked={notifications.inApp.sound}
              onChange={() => handleToggle('inApp', 'sound', !notifications.inApp.sound)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">Mostrar en badge</p>
              <p className="text-sm text-state-disabled">Mostrar contador de notificaciones</p>
            </div>
            <Toggle
              checked={notifications.inApp.badge}
              onChange={() => handleToggle('inApp', 'badge', !notifications.inApp.badge)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-state-idle font-medium">Notificaciones de sistema</p>
              <p className="text-sm text-state-disabled">Mostrar notificaciones del sistema operativo</p>
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
        <h3 className="text-lg font-semibold text-state-idle mb-4">Frecuencia</h3>
        <div className="space-y-3">
          {[
            { value: 'realtime', label: 'Tiempo real', description: 'Recibe notificaciones inmediatamente' },
            { value: 'daily', label: 'Resumen diario', description: 'Una notificación por día' },
            { value: 'weekly', label: 'Resumen semanal', description: 'Una notificación por semana' },
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
