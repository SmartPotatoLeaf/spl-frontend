import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {getUser} from '@/services/userService';
import type {UserFromAPI} from '@/services/userService';

export default function AccountSection() {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos del usuario');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const formatDate = (date: Date): string => {
    const months = t('settings.accountSection.months', { returnObjects: true }) as string[];
    return `${date.getDate()} ${t('settings.accountSection.of')} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-outline p-6">
        <div className="flex items-center justify-center min-h-96">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-state-disabled">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white rounded-lg border border-outline p-6">
        <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-error mb-4"></i>
          <p className="text-error font-semibold">{error || 'Usuario no encontrado'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-outline p-6">
      <h2 className="text-2xl font-bold text-state-idle mb-6">{t('settings.accountSection.title')}</h2>

      {/* Avatar y datos básicos */}
      <div className="flex items-start gap-6 mb-8 pb-8 border-b border-outline">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <i className="fas fa-user text-3xl text-primary"></i>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold text-state-idle mb-4">{t('settings.accountSection.basicInfo')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-state-disabled">{t('settings.accountSection.username')}</label>
              <p className="text-state-idle font-medium">{user.username}</p>
            </div>
            <div>
              <label className="text-sm text-state-disabled">{t('settings.accountSection.email')}</label>
              <p className="text-state-idle font-medium">{user.email}</p>
            </div>

            <div>
              <label className="text-sm text-state-disabled">{t('settings.accountSection.registeredAt')}</label>
              <p className="text-state-idle font-medium">{formatDate(new Date(user.created_at))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
