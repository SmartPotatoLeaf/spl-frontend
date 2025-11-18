import CrudService from "@/services/crud/CrudService.ts";
import type {Diagnostic, DiagnosticResponse} from "@/types";
import {API_URL} from "astro:env/client";
import type {DiagnosticFilterRequest, DiagnosticFilterResponse} from "@/types/diagnostics.ts";
import {getToken} from "@/stores/authStore.ts";

let service: DiagnosticsService = null!

class DiagnosticsService extends CrudService<Diagnostic> {
  constructor() {
    super(`${API_URL}/diagnostics/`, {
      tokenProvider: getToken
    });
  }

  async filter(body: DiagnosticFilterRequest): Promise<DiagnosticFilterResponse> {
    return this.httpPost("/filter/", body);
  }

  async loadBlob(path: string) {
    const data = await this.httpGet(`/blobs${path}`);
    return Buffer.from(data, "binary").toString("base64")
  }

  async getDiagnostic(id: number): Promise<DiagnosticResponse> {
    return this.httpGet(`/${id}/`,)
  }

  async delete(id: number): Promise<DiagnosticResponse> {
    return this.httpDelete(`/${id}/`);
  }

  async create(body: FormData): Promise<DiagnosticResponse> {
    const init: RequestInit = {method: 'POST'};
    if (body !== undefined) {
      init.body = body;
    }
    return this.request("/", init);
  }
}

function instantiateService() {
  if (!service) {
    service = new DiagnosticsService();
  }
}

export function filterDiagnostics(body: DiagnosticFilterRequest): Promise<DiagnosticFilterResponse> {
  instantiateService();
  return service.filter(body);
}

export function getDiagnostic(id: number): Promise<DiagnosticResponse> {
  instantiateService();
  return service.getDiagnostic(id);
}

export function deleteDiagnostic(id: number): Promise<DiagnosticResponse> {
  instantiateService();
  return service.delete(id);
}

export function createPrediction(file: FormData) {
  instantiateService();
  return service.create(file);
}
