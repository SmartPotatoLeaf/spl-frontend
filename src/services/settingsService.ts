import type { 
  AppSettings, 
  ChangePasswordData, 
  UpdateProfileData,
  NotificationSettings,
  SecuritySettings,
  ActivityLog
} from '@/types/settings';

const USE_MOCK = true;
const MOCK_DELAY = 600;

// Mock data
const mockActivityLog: ActivityLog[] = [
  {
    id: '1',
    type: 'login',
    description: 'Inicio de sesión desde Chrome en Windows',
    timestamp: new Date('2025-11-06T10:30:00'),
    device: 'Chrome 119 - Windows 11',
    location: 'Lima, Perú',
  },
  {
    id: '2',
    type: 'password_change',
    description: 'Cambio de contraseña',
    timestamp: new Date('2025-10-20T15:45:00'),
    device: 'Firefox 120 - Windows 11',
    location: 'Lima, Perú',
  },
  {
    id: '3',
    type: 'login',
    description: 'Inicio de sesión desde Edge',
    timestamp: new Date('2025-10-18T08:15:00'),
    device: 'Edge 119 - Windows 11',
    location: 'Lima, Perú',
  },
];

export async function getUserSettings(): Promise<AppSettings> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    return {
      user: {
        username: 'juanperes2025',
        email: 'juan.peres2025@example.com',
        fullName: 'Juan Pérez',
        phone: '+51 987 654 321',
        location: 'Lima, Perú',
        role: 'Agricultor',
        registeredAt: new Date('2025-09-30'),
      },
      security: {
        lastPasswordChange: new Date('2025-10-20'),
        passwordStrength: 'strong',
        recentActivity: mockActivityLog,
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
        language: 'es-PE',
        dateFormat: 'dd/mm/yyyy',
        timezone: 'America/Lima',
        autoDetectTimezone: true,
      },
      appInfo: {
        version: '1.0.0',
        lastUpdate: new Date('2025-11-01'),
        changelog: [
          'Lanzamiento inicial de Smart Potato Leaf',
          'Sistema de diagnóstico con IA',
          'Gestión de parcelas y cultivos',
          'Dashboard con estadísticas en tiempo real',
          'Comparación de parcelas',
          'Historial de diagnósticos',
        ],
      },
    };
  }

  const response = await fetch('/api/settings');
  if (!response.ok) {
    throw new Error('Error al cargar configuración');
  }
  return response.json();
}

export async function updateProfile(data: UpdateProfileData): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    console.log('Perfil actualizado:', data);
    return;
  }

  const response = await fetch('/api/settings/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar perfil');
  }
}

export async function changePassword(data: ChangePasswordData): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    
    if (data.currentPassword !== 'password123') {
      throw new Error('Contraseña actual incorrecta');
    }
    
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }
    
    if (data.newPassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    
    console.log('Contraseña cambiada exitosamente');
    return;
  }

  const response = await fetch('/api/settings/password', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al cambiar contraseña');
  }
}

export async function updateNotifications(settings: NotificationSettings): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    console.log('Notificaciones actualizadas:', settings);
    return;
  }

  const response = await fetch('/api/settings/notifications', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar notificaciones');
  }
}

export async function updateAppearance(theme: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Tema actualizado:', theme);
    
    // Aplicar tema (SSR-safe: Only runs in browser from component event handlers)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    }
    
    return;
  }

  const response = await fetch('/api/settings/appearance', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar apariencia');
  }
}

export async function updateLanguage(language: string, dateFormat: string, timezone: string): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
    console.log('Idioma actualizado:', { language, dateFormat, timezone });
    return;
  }

  const response = await fetch('/api/settings/language', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language, dateFormat, timezone }),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar idioma');
  }
}

export function calculatePasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  if (password.length < 8) return 'weak';
  
  let strength = 0;
  
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength >= 4) return 'strong';
  if (strength >= 2) return 'medium';
  return 'weak';
}

export function getTimezones(): string[] {
  return [
    'America/Lima',
    'America/New_York',
    'America/Los_Angeles',
    'America/Mexico_City',
    'America/Bogota',
    'America/Santiago',
    'America/Buenos_Aires',
    'Europe/Madrid',
    'Europe/London',
  ];
}
