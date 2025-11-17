import CrudService from "@/services/crud/CrudService.ts";
import {API_URL} from "astro:env/client";
import {getToken} from "@/stores/authStore.ts";
import type {Recommendation} from "@/types/recommendations.ts";

let service: RecommendationsService = null!

export class RecommendationsService extends CrudService<any> {
  constructor() {
    super(`${API_URL}/recommendation/`, {
      tokenProvider: getToken
    });
  }

  async getRecommendationsForSeverity(percentage: number): Promise<Recommendation[]> {
    return this.httpGet(`/severity/${percentage}`)
  }
}


function instantiateService() {
  {
    if (!service) {
      service = new RecommendationsService();
    }
  }
}

export function getRecommendationsForSeverity(severity: number) {
  instantiateService();
  return service.getRecommendationsForSeverity(severity);
}
