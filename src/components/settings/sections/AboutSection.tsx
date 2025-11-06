import { useStore } from '@nanostores/react';
import { useTranslation } from 'react-i18next';
import { settingsStore } from '@/stores/settingsStore';

export default function AboutSection() {
  const { t } = useTranslation();
  const { settings } = useStore(settingsStore);
  const { appInfo } = settings;

  const changelog = t('settings.aboutSection.changelog', { returnObjects: true }) as string[];

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-outline p-6 space-y-8">
      <h2 className="text-2xl font-bold text-state-idle">{t('settings.aboutSection.title')}</h2>

      {/* Información de la app */}
      <div className="pb-8 border-b border-outline">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <i className="fas fa-leaf text-4xl text-primary"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-state-idle">{t('settings.aboutSection.appName')}</h3>
            <p className="text-state-disabled mt-1">{t('settings.aboutSection.appDesc')}</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-state-disabled">{t('settings.aboutSection.version')} <span className="text-state-idle font-medium">{appInfo.version}</span></span>
              <span className="text-state-disabled">•</span>
              <span className="text-state-disabled">{t('settings.aboutSection.updated')} {formatDate(appInfo.lastUpdate)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-state-idle mb-3">{t('settings.aboutSection.whatsNew')}</h4>
          <ul className="space-y-2">
            {changelog.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <i className="fas fa-check text-primary mt-0.5"></i>
                <span className="text-state-idle">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Soporte */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.aboutSection.support')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="#"
            className="p-4 border border-outline rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-question-circle text-primary text-xl"></i>
              <div>
                <p className="font-medium text-state-idle">{t('settings.aboutSection.helpCenter')}</p>
                <p className="text-sm text-state-disabled">{t('settings.aboutSection.helpCenterDesc')}</p>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="p-4 border border-outline rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-bug text-primary text-xl"></i>
              <div>
                <p className="font-medium text-state-idle">{t('settings.aboutSection.reportBug')}</p>
                <p className="text-sm text-state-disabled">{t('settings.aboutSection.reportBugDesc')}</p>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="p-4 border border-outline rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-comment text-primary text-xl"></i>
              <div>
                <p className="font-medium text-state-idle">{t('settings.aboutSection.sendFeedback')}</p>
                <p className="text-sm text-state-disabled">{t('settings.aboutSection.sendFeedbackDesc')}</p>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="p-4 border border-outline rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-headset text-primary text-xl"></i>
              <div>
                <p className="font-medium text-state-idle">{t('settings.aboutSection.contactSupport')}</p>
                <p className="text-sm text-state-disabled">{t('settings.aboutSection.contactSupportDesc')}</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Legal */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.aboutSection.legal')}</h3>
        <div className="space-y-3">
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-state-idle">{t('settings.aboutSection.terms')}</span>
            <i className="fas fa-chevron-right text-state-disabled"></i>
          </a>
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-state-idle">{t('settings.aboutSection.privacy')}</span>
            <i className="fas fa-chevron-right text-state-disabled"></i>
          </a>
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-state-idle">{t('settings.aboutSection.licenses')}</span>
            <i className="fas fa-chevron-right text-state-disabled"></i>
          </a>
        </div>
      </div>

      {/* Equipo */}
      <div>
        <h3 className="text-lg font-semibold text-state-idle mb-4">{t('settings.aboutSection.team')}</h3>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <i className="fas fa-users text-4xl text-primary mb-4"></i>
          <p className="text-state-idle font-medium mb-2">{t('settings.aboutSection.developed')}</p>
          <p className="text-sm text-state-disabled">{t('settings.aboutSection.copyright')}</p>
          <p className="text-sm text-state-disabled mt-1">{t('settings.aboutSection.rights')}</p>
        </div>
      </div>
    </div>
  );
}
