import { useState } from 'react';
import AuthForm from './AuthForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <AuthForm mode={mode} onToggleMode={toggleMode} />
  );
}
