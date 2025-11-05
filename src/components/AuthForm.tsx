import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { authStore, setUser } from '@/stores/authStore';
import { login, register } from '@/services/authService';
import type { LoginCredentials, RegisterData } from '@/types/auth';

interface AuthFormProps {
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

export default function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const { isLoading } = useStore(authStore);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateLogin = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Mínimo 3 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = mode === 'login' ? validateLogin() : validateRegister();
    if (!isValid) return;

    try {
      if (mode === 'login') {
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password,
        };
        const response = await login(credentials);
        setUser(response.user);
      } else {
        const registerData: RegisterData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };
        const response = await register(registerData);
        setUser(response.user);
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Error desconocido' });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-outline/30 rounded-lg p-1 mb-6 sm:mb-8">
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] bg-primary rounded-lg transition-transform duration-300 ease-in-out ${
            mode === 'register' ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        <div className="relative flex">
          <button
            type="button"
            onClick={() => mode === 'register' && onToggleMode()}
            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base transition-colors duration-300 ${
              mode === 'login'
                ? 'text-white'
                : 'text-state-idle hover:text-state-idle/70'
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => mode === 'login' && onToggleMode()}
            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium text-sm sm:text-base transition-colors duration-300 ${
              mode === 'register'
                ? 'text-white'
                : 'text-state-idle hover:text-state-idle/70'
            }`}
          >
            Registrarse
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 min-h-[420px] sm:min-h-[480px]">
        {mode === 'register' && (
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-state-idle mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Introduce tu nombre de usuario"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-error">{errors.username}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-state-idle mb-2">
            {mode === 'login' ? 'Email o usuario' : 'Correo electrónico'}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder={mode === 'login' ? 'Ingresa tu email o usuario' : 'Introduce tu correo electrónico'}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-state-idle mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={mode === 'login' ? 'Ingresa tu contraseña' : 'Crea tu contraseña'}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-error">{errors.password}</p>
          )}
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-state-idle mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Confirma tu contraseña"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {mode === 'login' && (
          <div className="text-right mb-4 sm:mb-6">
            <a href="#" className="text-xs sm:text-sm text-primary hover:underline">
              Olvidé mi contraseña
            </a>
          </div>
        )}

        {mode === 'register' && (
          <div className="flex items-start gap-2 mb-4 sm:mb-6">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (errors.terms) {
                  setErrors(prev => ({ ...prev, terms: '' }));
                }
              }}
              className="mt-1 shrink-0"
            />
            <label htmlFor="terms" className="text-xs sm:text-sm text-state-idle">
              Acepto los{' '}
              <a href="#" className="text-primary hover:underline">
                Términos de servicio
              </a>{' '}
              y la{' '}
              <a href="#" className="text-primary hover:underline">
                Política de privacidad
              </a>
            </label>
          </div>
        )}
        {errors.terms && (
          <p className="text-xs sm:text-sm text-error mb-3 sm:mb-4">{errors.terms}</p>
        )}

        {mode === 'login' && (
          <div className="h-16 sm:h-[72px]" />
        )}

        {errors.submit && (
          <div className="p-3 bg-error/10 border border-error rounded-lg">
            <p className="text-xs sm:text-sm text-error">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-primary text-white text-sm sm:text-base font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6"
        >
          {isLoading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
        </button>

        {mode === 'login' && (
          <p className="text-center text-xs sm:text-sm text-state-idle mt-3 sm:mt-4">
            Al continuar, aceptas los{' '}
            <a href="#" className="text-primary hover:underline">
              Términos de servicio
            </a>{' '}
            y la{' '}
            <a href="#" className="text-primary hover:underline">
              Política de privacidad
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
