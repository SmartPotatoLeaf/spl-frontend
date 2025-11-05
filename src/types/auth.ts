export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: bigint;
  username: string;
  email: string;
  role_id: number;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
