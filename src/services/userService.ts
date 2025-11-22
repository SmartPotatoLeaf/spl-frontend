import CrudService from "@/services/crud/CrudService.ts";
import { getToken } from "@/stores/authStore.ts";
import { API_URL } from "astro:env/client";

export interface UserFromAPI {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

let userService: UserService = null!;

class UserService extends CrudService<any> {
  constructor() {
    super(API_URL, {
      tokenProvider: getToken
    });
  }

  async getUser(): Promise<UserFromAPI> {
    return await this.httpGet('/users');
  }

  protected getAuthToken(): string | null | undefined {
    return getToken();
  }
}

function instanceService() {
  if (!userService) {
    userService = new UserService();
  }
}

export function getUser() {
  instanceService();
  return userService.getUser();
}
