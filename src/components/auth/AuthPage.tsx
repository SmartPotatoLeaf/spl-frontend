import { useState } from 'react';
import I18nProvider from '@/i18n/I18nProvider';
import AuthForm from './AuthForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <I18nProvider>
      <AuthForm mode={mode} onToggleMode={toggleMode} />
    </I18nProvider>
  );
}
