import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { authStore, setUser } from '@/stores/authStore';
import { login, register } from '@/services/authService';
import type { LoginCredentials, RegisterData } from '@/types/auth';

interface AuthFormProps {
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  submit?: string;
}

const validateEmail = (email: string): string | undefined => {
  if (!email) return 'El email es requerido';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email inválido';
  return undefined;
};

const validatePassword = (password: string, isRegister: boolean): string | undefined => {
  if (!password) return 'La contraseña es requerida';
  
  if (isRegister) {
    if (password.length < 8) return 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(password)) return 'Debe incluir al menos una mayúscula';
    if (!/[a-z]/.test(password)) return 'Debe incluir al menos una minúscula';
    if (!/[0-9]/.test(password)) return 'Debe incluir al menos un número';
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Debe incluir al menos un carácter especial';
  }
  
  return undefined;
};

const validateUsername = (username: string): string | undefined => {
  if (!username) return 'El nombre de usuario es requerido';
  if (username.length < 3) return 'Mínimo 3 caracteres';
  if (username.length > 20) return 'Máximo 20 caracteres';
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Solo letras, números y guión bajo';
  return undefined;
};

export default function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const { isLoading } = useStore(authStore);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touchedFields.has(field)) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouchedFields(prev => new Set(prev).add(field));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof typeof formData, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'username':
        if (mode === 'register') {
          const usernameError = validateUsername(value);
          if (usernameError) {
            newErrors.username = usernameError;
          } else {
            delete newErrors.username;
          }
        }
        break;
      
      case 'email':
        const emailError = validateEmail(value);
        if (emailError) {
          newErrors.email = emailError;
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'password':
        const passwordError = validatePassword(value, mode === 'register');
        if (passwordError) {
          newErrors.password = passwordError;
        } else {
          delete newErrors.password;
        }
        
        if (mode === 'register' && formData.confirmPassword && touchedFields.has('confirmPassword')) {
          if (value !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;
      
      case 'confirmPassword':
        if (mode === 'register') {
          if (!value) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
          } else if (value !== formData.password) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password, mode === 'register');
    if (passwordError) newErrors.password = passwordError;

    if (mode === 'register') {
      const usernameError = validateUsername(formData.username);
      if (usernameError) newErrors.username = usernameError;

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      if (!acceptTerms) {
        newErrors.terms = 'Debes aceptar los términos y condiciones';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateAllFields();
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
              onBlur={() => handleBlur('username')}
              placeholder="Introduce tu nombre de usuario"
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 ${
                errors.username && touchedFields.has('username')
                  ? 'border-error focus:ring-error'
                  : 'border-outline focus:ring-primary'
              }`}
            />
            {errors.username && touchedFields.has('username') && (
              <p className="mt-1 text-xs sm:text-sm text-error">{errors.username}</p>
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
            onBlur={() => handleBlur('email')}
            placeholder={mode === 'login' ? 'Ingresa tu email o usuario' : 'Introduce tu correo electrónico'}
            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email && touchedFields.has('email')
                ? 'border-error focus:ring-error'
                : 'border-outline focus:ring-primary'
            }`}
          />
          {errors.email && touchedFields.has('email') && (
            <p className="mt-1 text-xs sm:text-sm text-error">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-state-idle mb-2">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder={mode === 'login' ? 'Ingresa tu contraseña' : 'Crea tu contraseña'}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password && touchedFields.has('password')
                  ? 'border-error focus:ring-error'
                  : 'border-outline focus:ring-primary'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-state-idle hover:text-primary transition-colors"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          {errors.password && touchedFields.has('password') && (
            <p className="mt-1 text-xs sm:text-sm text-error">{errors.password}</p>
          )}
          {mode === 'register' && formData.password && touchedFields.has('password') && (
            <div className="mt-2 space-y-1">
              <p className={`text-xs flex items-center gap-1.5 ${
                formData.password.length >= 8 ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i className={`fas ${formData.password.length >= 8 ? 'fa-check-circle' : 'fa-circle'}`}></i>
                Mínimo 8 caracteres
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${
                /[A-Z]/.test(formData.password) ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i className={`fas ${/[A-Z]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                Una letra mayúscula
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${
                /[a-z]/.test(formData.password) ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i className={`fas ${/[a-z]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                Una letra minúscula
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${
                /[0-9]/.test(formData.password) ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i className={`fas ${/[0-9]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                Un número
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${
                /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i className={`fas ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                Un carácter especial
              </p>
            </div>
          )}
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-state-idle mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Confirma tu contraseña"
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword && touchedFields.has('confirmPassword')
                    ? 'border-error focus:ring-error'
                    : 'border-outline focus:ring-primary'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-state-idle hover:text-primary transition-colors"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            {errors.confirmPassword && touchedFields.has('confirmPassword') && (
              <p className="mt-1 text-xs sm:text-sm text-error">{errors.confirmPassword}</p>
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
          <div className="mb-4 sm:mb-6">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  if (e.target.checked && errors.terms) {
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.terms;
                      return newErrors;
                    });
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
            {errors.terms && (
              <p className="mt-1 text-xs sm:text-sm text-error">{errors.terms}</p>
            )}
          </div>
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
