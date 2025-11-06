import { useStore } from '@nanostores/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { settingsStore, updateSecuritySettings, setSettingsSaving, markSettingsSaved } from '@/stores/settingsStore';
import { changePassword, calculatePasswordStrength } from '@/services/settingsService';
import { toast } from '@/stores/toastStore';
import type { ChangePasswordData } from '@/types/settings';

export default function SecuritySection() {
  const { t } = useTranslation();
  const { settings, isSaving } = useStore(settingsStore);
  const { security } = settings;
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Nunca';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    return `Hace ${Math.floor(days / 30)} meses`;
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'text-error';
      case 'medium': return 'text-tag-mid';
      case 'strong': return 'text-tag-healthy';
      default: return 'text-state-disabled';
    }
  };

  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case 'weak': return 'Débil';
      case 'medium': return 'Media';
      case 'strong': return 'Fuerte';
      default: return 'Desconocida';
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('settings.securitySection.errorPasswordsMatch'));
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error(t('settings.securitySection.errorPasswordLength'));
      return;
    }

    try {
      setSettingsSaving(true);
      await changePassword(passwordData);
      
      const newStrength = calculatePasswordStrength(passwordData.newPassword);
      updateSecuritySettings({
        lastPasswordChange: new Date(),
        passwordStrength: newStrength,
      });
      
      markSettingsSaved();
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success(t('settings.securitySection.successPassword'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('settings.securitySection.errorPassword'));
    } finally {
      setSettingsSaving(false);
    }
  };

  const formatActivityDate = (date: Date): string => {
    return new Date(date).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-outline p-6 space-y-8">
      <h2 className="text-2xl font-bold text-state-idle">{t('settings.securitySection.title')}</h2>

      {/* Contraseña */}
      <div className="pb-8 border-b border-outline">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-state-idle">{t('settings.securitySection.password')}</h3>
            <p className="text-sm text-state-disabled mt-1">
              {t('settings.securitySection.passwordDesc')}
            </p>
          </div>
          {!showChangePassword && (
            <button
              onClick={() => setShowChangePassword(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              {t('settings.securitySection.changePassword')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm text-state-disabled">{t('settings.securitySection.lastChange')}</label>
            <p className="text-state-idle font-medium">{formatDate(security.lastPasswordChange)}</p>
          </div>
          <div>
            <label className="text-sm text-state-disabled">{t('settings.securitySection.strength')}</label>
            <p className={`font-medium ${getStrengthColor(security.passwordStrength)}`}>
              {getStrengthLabel(security.passwordStrength)}
            </p>
          </div>
        </div>

        {showChangePassword && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-state-idle mb-2">
                {t('settings.securitySection.currentPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('settings.securitySection.placeholderCurrent')}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-state-disabled hover:text-state-idle"
                >
                  <i className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-state-idle mb-2">
                {t('settings.securitySection.newPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('settings.securitySection.placeholderNew')}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-state-disabled hover:text-state-idle"
                >
                  <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-state-idle mb-2">
                {t('settings.securitySection.confirmPassword')}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('settings.securitySection.placeholderConfirm')}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-state-disabled hover:text-state-idle"
                >
                  <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleChangePassword}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving && <i className="fas fa-spinner fa-spin"></i>}
                {t('common.save')}
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                disabled={isSaving}
                className="px-6 py-2 border border-outline text-state-idle rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Registro de actividad */}
      <div>
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.securitySection.activityLog')}</h3>
        <div className="space-y-3">
          {security.recentActivity.map(activity => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                activity.type === 'login' ? 'bg-primary/10 text-primary' :
                activity.type === 'password_change' ? 'bg-tag-mid/10 text-tag-mid' :
                'bg-tag-healthy/10 text-tag-healthy'
              }`}>
                <i className={`fas ${
                  activity.type === 'login' ? 'fa-right-to-bracket' :
                  activity.type === 'password_change' ? 'fa-key' :
                  'fa-user-pen'
                }`}></i>
              </div>
              <div className="flex-1">
                <p className="text-state-idle font-medium">{activity.description}</p>
                <p className="text-sm text-state-disabled mt-1">
                  {formatActivityDate(activity.timestamp)}
                  {activity.location && ` • ${activity.location}`}
                </p>
                {activity.device && (
                  <p className="text-xs text-state-disabled mt-1">{activity.device}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
