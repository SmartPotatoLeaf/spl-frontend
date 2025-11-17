import type {User} from './database';

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type RegisterRequest = Omit<RegisterData, 'confirmPassword'>;


/**
 * AuthUser - Subconjunto de User de database.ts para sesión
 * Omite campos sensibles como password_hash
 */
export type AuthUser = Omit<User, 'password_hash' | 'created_at' | 'updated_at'>;

export interface AuthResponse {
  token: string;
  type: string;
}
