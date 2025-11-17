import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {setLogin} from '@/stores/authStore';
import {login, register} from '@/services/authService';
import type {LoginCredentials, RegisterData, RegisterRequest} from '@/types/auth';
import useQueryParam from "@/hooks/useQueryParam.ts";

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

export default function AuthForm({mode, onToggleMode}: AuthFormProps) {
  const {t} = useTranslation(),
    [isLoading, setLoading] = useState(false),
    [nextPage] = useQueryParam("next", "/home");

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

  // Funciones de validación con i18n
  const validateEmail = (email: string): string | undefined => {
    if (!email) return t('auth.validation.emailRequired');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t('auth.validation.emailInvalid');
    return undefined;
  };

  const validatePassword = (password: string, isRegister: boolean): string | undefined => {
    if (!password) return t('auth.validation.passwordRequired');

    if (isRegister) {
      if (password.length < 8) return t('auth.validation.passwordMin');
      if (!/[A-Z]/.test(password)) return t('auth.validation.passwordUppercase');
      if (!/[a-z]/.test(password)) return t('auth.validation.passwordLowercase');
      if (!/[0-9]/.test(password)) return t('auth.validation.passwordNumber');
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return t('auth.validation.passwordSpecial');
    }

    return undefined;
  };

  const validateUsername = (username: string): string | undefined => {
    if (!username) return t('auth.validation.usernameRequired');
    if (username.length < 3) return t('auth.validation.usernameMin');
    if (username.length > 20) return t('auth.validation.usernameMax');
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return t('auth.validation.usernameInvalid');
    return undefined;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));

    if (touchedFields.has(field)) {
      validateField(field, value);
    }
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouchedFields(prev => new Set(prev).add(field));
    validateField(field, formData[field]);
  };

  const validateField = (field: keyof typeof formData, value: string) => {
    const newErrors = {...errors};

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
            newErrors.confirmPassword = t('auth.validation.passwordsMismatch');
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;

      case 'confirmPassword':
        if (mode === 'register') {
          if (!value) {
            newErrors.confirmPassword = t('auth.validation.confirmPasswordRequired');
          } else if (value !== formData.password) {
            newErrors.confirmPassword = t('auth.validation.passwordsMismatch');
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
        newErrors.confirmPassword = t('auth.validation.confirmPasswordRequired');
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.validation.passwordsMismatch');
      }

      if (!acceptTerms) {
        newErrors.terms = t('auth.validation.termsRequired');
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
      setLoading(true);
      if (mode === 'login') {
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password,
        };
        const response = await login(credentials);
        setLogin(response.token);
        window.location.href = nextPage
      } else {
        const registerData: RegisterRequest = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };
        await register(registerData);
        onToggleMode()
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrors({submit: error instanceof Error ? error.message : t('auth.validation.unknownError')});
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
            {t('auth.login')}
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
            {t('auth.register')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 min-h-[420px] sm:min-h-[480px]">
        {mode === 'register' && (
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-state-idle mb-2">
              {t('auth.usernameLabel')}
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              placeholder={t('auth.usernamePlaceholder')}
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
            {mode === 'login' ? t('auth.emailOrUsername') : t('auth.emailLabel')}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder={mode === 'login' ? t('auth.emailOrUserPlaceholder') : t('auth.emailPlaceholder')}
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
            {t('auth.passwordLabel')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder={mode === 'login' ? t('auth.passwordPlaceholder') : t('auth.passwordPlaceholderRegister')}
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
                {t('auth.passwordStrength.minChars')}
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${
                /[A-Z]/.test(formData.password) ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i className={`fas ${/[A-Z]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                {t('auth.passwordStrength.uppercase')}
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${
                /[a-z]/.test(formData.password) ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i className={`fas ${/[a-z]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                {t('auth.passwordStrength.lowercase')}
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${
                /[0-9]/.test(formData.password) ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i className={`fas ${/[0-9]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                {t('auth.passwordStrength.number')}
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${
                /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-tag-healthy' : 'text-state-idle'
              }`}>
                <i
                  className={`fas ${/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'fa-check-circle' : 'fa-circle'}`}></i>
                {t('auth.passwordStrength.special')}
              </p>
            </div>
          )}
        </div>

        {mode === 'register' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-state-idle mb-2">
              {t('auth.confirmPasswordLabel')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder={t('auth.confirmPasswordPlaceholder')}
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
              {t('auth.forgotPassword')}
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
                      const newErrors = {...prev};
                      delete newErrors.terms;
                      return newErrors;
                    });
                  }
                }}
                className="mt-1 shrink-0"
              />
              <label htmlFor="terms" className="text-xs sm:text-sm text-state-idle">
                {t('auth.termsPrefix')}{' '}
                <a href="#" className="text-primary hover:underline">
                  {t('auth.termsLink')}
                </a>{' '}
                {t('auth.termsAnd')}{' '}
                <a href="#" className="text-primary hover:underline">
                  {t('auth.privacyLink')}
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-xs sm:text-sm text-error">{errors.terms}</p>
            )}
          </div>
        )}

        {mode === 'login' && (
          <div className="h-16 sm:h-[72px]"/>
        )}

        {errors.submit && (
          <div className="p-3 bg-error/10 border border-error rounded-lg">
            <p className="text-xs sm:text-sm text-error">{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={mode === "login" ? isLoading : isLoading || !acceptTerms}
          className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-primary text-white text-sm sm:text-base font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6"
        >
          {isLoading ? t('auth.loading') : mode === 'login' ? t('auth.login') : t('auth.register')}
        </button>

        {mode === 'login' && (
          <p className="text-center text-xs sm:text-sm text-state-idle mt-3 sm:mt-4">
            {t('auth.continueTermsPrefix')}{' '}
            <a href="#" className="text-primary hover:underline">
              {t('auth.termsLink')}
            </a>{' '}
            {t('auth.termsAnd')}{' '}
            <a href="#" className="text-primary hover:underline">
              {t('auth.privacyLink')}
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
