import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

const USE_MOCK = true;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function mockLogin(email: string, password: string): Promise<AuthResponse> {
  await delay(800);
  
  if (email === 'test@example.com' && password === 'password123') {
    return {
      user: {
        id: BigInt(1),
        username: 'Usuario Test',
        email: 'test@example.com',
        role_id: 1,
      },
      token: 'mock-jwt-token-12345',
    };
  }
  
  throw new Error('Credenciales incorrectas');
}

async function mockRegister(data: RegisterData): Promise<AuthResponse> {
  await delay(1000);
  
  return {
    user: {
      id: BigInt(2),
      username: data.username,
      email: data.email,
      role_id: 1,
    },
    token: 'mock-jwt-token-67890',
  };
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (USE_MOCK) {
    return mockLogin(credentials.email, credentials.password);
  }
  
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }
  
  return response.json();
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  if (USE_MOCK) {
    return mockRegister(data);
  }
  
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error al registrarse');
  }
  
  return response.json();
}
