import CrudService from "@/services/crud/CrudService.ts";
import {getToken} from "@/stores/authStore.ts";
import type {AuthResponse, LoginCredentials, RegisterRequest, User} from "@/types";
import {API_URL} from "astro:env/client";

let authService: AuthService = null!;


class AuthService extends CrudService<any> {
  constructor() {
    super(API_URL, {
      tokenProvider: getToken
    });

    console.log("baseURL", this.baseUrl)
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await this.httpPost("/auth/login", credentials)
  }

  async register(body: RegisterRequest): Promise<User> {
    return await this.httpPost("/users/", body)
  }

  protected getAuthToken(): string | null | undefined {
    return null;
  }
}

function instanceService() {
  if (!authService) {
    authService = new AuthService();
  }
}

export function login(credentials: LoginCredentials) {
  instanceService()
  return authService.login(credentials)
}

export function register(body: RegisterRequest) {
  instanceService()
  return authService.register(body)
}
