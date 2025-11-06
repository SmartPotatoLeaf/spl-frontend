import { map } from 'nanostores';
import type { 
  AppSettings, 
  SettingsSection,
  Theme,
  Language,
  DateFormat,
  NotificationSettings,
  UserProfile,
  SecuritySettings,
  AppInfo
} from '@/types/settings';

export interface SettingsState {
  currentSection: SettingsSection;
  settings: AppSettings;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang === 'en' || savedLang === 'es-PE') {
      return savedLang;
    }
  }
  return 'es-PE';
};

const defaultSettings: AppSettings = {
  user: {
    username: '',
    email: '',
    fullName: undefined,
    phone: undefined,
    location: undefined,
    role: 'user',
    registeredAt: new Date(),
  },
  security: {
    lastPasswordChange: null,
    passwordStrength: 'medium',
    recentActivity: [],
  },
  notifications: {
    email: {
      weeklyReport: true,
      criticalAlerts: true,
      plotReminders: true,
    },
    inApp: {
      sound: true,
      badge: true,
      system: true,
    },
    frequency: 'realtime',
  },
  appearance: {
    theme: 'light',
  },
  language: {
    language: getInitialLanguage(), // Leer desde localStorage
    dateFormat: 'dd/mm/yyyy',
    timezone: 'America/Lima',
    autoDetectTimezone: true,
  },
  appInfo: {
    version: '1.0.0',
    lastUpdate: new Date('2025-11-01'),
    changelog: [
      'Lanzamiento inicial',
      'Sistema de diagnóstico de rancha',
      'Gestión de parcelas',
      'Dashboard con estadísticas',
    ],
  },
};

export const settingsStore = map<SettingsState>({
  currentSection: 'account',
  settings: defaultSettings,
  isLoading: false,
  isSaving: false,
  hasUnsavedChanges: false,
});

export function setCurrentSection(section: SettingsSection) {
  settingsStore.setKey('currentSection', section);
}

export function setSettings(settings: Partial<AppSettings>) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', { ...current, ...settings });
  settingsStore.setKey('hasUnsavedChanges', true);
}

export function setTheme(theme: Theme) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', {
    ...current,
    appearance: { ...current.appearance, theme },
  });
  settingsStore.setKey('hasUnsavedChanges', true);
}

export function setLanguage(language: Language) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', {
    ...current,
    language: { ...current.language, language },
  });
  settingsStore.setKey('hasUnsavedChanges', true);
}

export function setDateFormat(dateFormat: DateFormat) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', {
    ...current,
    language: { ...current.language, dateFormat },
  });
  settingsStore.setKey('hasUnsavedChanges', true);
}

export function setTimezone(timezone: string, autoDetect: boolean) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', {
    ...current,
    language: { 
      ...current.language, 
      timezone,
      autoDetectTimezone: autoDetect,
    },
  });
  settingsStore.setKey('hasUnsavedChanges', true);
}

export function setNotifications(notifications: Partial<NotificationSettings>) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', {
    ...current,
    notifications: { 
      ...current.notifications,
      ...notifications,
    },
  });
  settingsStore.setKey('hasUnsavedChanges', true);
}

export function updateUserProfile(profile: Partial<UserProfile>) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', {
    ...current,
    user: { ...current.user, ...profile },
  });
  settingsStore.setKey('hasUnsavedChanges', true);
}

export function updateSecuritySettings(security: Partial<SecuritySettings>) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', {
    ...current,
    security: { ...current.security, ...security },
  });
  settingsStore.setKey('hasUnsavedChanges', true);
}

export function setSettingsLoading(isLoading: boolean) {
  settingsStore.setKey('isLoading', isLoading);
}

export function setSettingsSaving(isSaving: boolean) {
  settingsStore.setKey('isSaving', isSaving);
}

export function markSettingsSaved() {
  settingsStore.setKey('hasUnsavedChanges', false);
  settingsStore.setKey('isSaving', false);
}

export function loadUserSettings(user: UserProfile, security: SecuritySettings) {
  const current = settingsStore.get().settings;
  settingsStore.setKey('settings', {
    ...current,
    user,
    security,
  });
}

export function loadAllSettings(settings: AppSettings) {
  settingsStore.setKey('settings', settings);
  settingsStore.setKey('hasUnsavedChanges', false);
}

export function resetSettings() {
  settingsStore.setKey('settings', defaultSettings);
  settingsStore.setKey('hasUnsavedChanges', false);
}
