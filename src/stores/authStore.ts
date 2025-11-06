import { atom, map } from 'nanostores';
import type { AuthUser } from '@/types';

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const authStore = map<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

export function setUser(user: AuthUser | null) {
  authStore.setKey('user', user);
  authStore.setKey('isAuthenticated', user !== null);
}

export function setLoading(isLoading: boolean) {
  authStore.setKey('isLoading', isLoading);
}

export function logout() {
  authStore.set({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });
}
