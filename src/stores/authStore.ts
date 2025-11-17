import {persistentMap} from "@nanostores/persistent";

export type AuthState = {
  token: string | undefined;
  isAuthenticated: 'true' | 'false';
}

export const authStore = persistentMap<AuthState>("auth:", {
  token: undefined,
  isAuthenticated: 'false',
});

export function getToken() {
  return authStore.get().token;
}

export function setLogin(token: string | undefined) {
  authStore.setKey('token', token);
  authStore.setKey('isAuthenticated', <any>(token !== null));
}


export function logout() {
  authStore.set({
    token: undefined,
    isAuthenticated: "false",
  });
}
