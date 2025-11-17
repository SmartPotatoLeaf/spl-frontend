import I18nProvider from '@/i18n/I18nProvider';
import AuthForm from './AuthForm';
import useQueryParam from '@/hooks/useQueryParam';
import {getToken} from "@/stores/authStore.ts";

export default function AuthPage() {
  const [mode, setMode] = useQueryParam<'login' | 'register'>(
    'mode',
    'login',
    (v): v is 'login' | 'register' => v === 'login' || v === 'register'
  );

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'register' : 'login'));
  };

  const token = getToken();
  if(token) {
    window.location.href = '/home';
  }

  return (
    <I18nProvider>
      <AuthForm mode={mode} onToggleMode={toggleMode} />
    </I18nProvider>
  );
}
