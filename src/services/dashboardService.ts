import type {DashboardSummaryRequest, DashboardSummaryResponse, DiagnosisSummaryFilters} from '@/types';
import CrudService from "@/services/crud/CrudService.ts";
import {API_URL} from "astro:env/client";
import {getToken, logout} from "@/stores/authStore.ts";

let service: DashboardService = null!

class DashboardService extends CrudService<any> {
  constructor() {
    super(`${API_URL}/dashboard/`, {
      tokenProvider: getToken,
      tokenRemover: logout
    })
  }

  async getSummary(filters: DashboardSummaryRequest): Promise<DashboardSummaryResponse> {
    return this.httpPost("/summary/", filters)
  }

  async getFilters(): Promise<DiagnosisSummaryFilters> {
    return this.httpGet("/filters/")
  }
}

function instantiateService() {
  if (!service) {
    service = new DashboardService();
  }
}

export function getDashboardFilters(): Promise<DiagnosisSummaryFilters> {
  instantiateService()
  return service.getFilters()
}

export function getDashboardSummary(filters: DashboardSummaryRequest): Promise<DashboardSummaryResponse> {
  instantiateService()
  return service.getSummary(filters)
}
