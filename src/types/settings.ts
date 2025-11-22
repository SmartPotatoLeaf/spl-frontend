export type SettingsSection =
  | 'account'
  | 'security'
  | 'appearance'
  | 'language'
  | 'about';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'es-PE' | 'en';
export type DateFormat = 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd';

export interface UserProfile {
  username: string;
  email: string;
  fullName?: string;
  phone?: string;
  location?: string;
  role: string;
  registeredAt: Date;
}

export interface SecuritySettings {
  lastPasswordChange: Date | null;
  passwordStrength: 'weak' | 'medium' | 'strong';
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'login' | 'password_change' | 'profile_update';
  description: string;
  timestamp: Date;
  device?: string;
  location?: string;
}

export interface NotificationSettings {
  email: {
    weeklyReport: boolean;
    criticalAlerts: boolean;
    plotReminders: boolean;
  };
  inApp: {
    sound: boolean;
    badge: boolean;
    system: boolean;
  };
  frequency: 'realtime' | 'daily' | 'weekly';
}

export interface AppearanceSettings {
  theme: Theme;
}

export interface LanguageSettings {
  language: Language;
  dateFormat: DateFormat;
  timezone: string;
  autoDetectTimezone: boolean;
}

export interface AppInfo {
  version: string;
  lastUpdate: Date;
  changelog: string[];
}

export interface AppSettings {
  user: UserProfile;
  security: SecuritySettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  language: LanguageSettings;
  appInfo: AppInfo;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  fullName: string;
  phone: string;
  location: string;
}
