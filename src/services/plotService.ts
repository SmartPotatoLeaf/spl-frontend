import type {Plot, PlotDetailed, PlotFormData, PlotPaginatedRequest, PlotPaginatedResponse, PlotSummary} from '@/types';
import plotsData from '@/data/plots.json';
import CrudService from "@/services/crud/CrudService.ts";
import {API_URL} from "astro:env/client";
import {getToken, logout} from "@/stores/authStore.ts";

let service: PlotService = null!

function instantiateService() {
  if (!service) {
    service = new PlotService();
  }
}

class PlotService extends CrudService<PlotSummary> {
  constructor() {
    super(`${API_URL}/plots/`, {
      tokenProvider: getToken,
      tokenRemover: logout
    });
  }

  async getPaginated(body: PlotPaginatedRequest): Promise<PlotPaginatedResponse> {
    return this.httpPost("detailed/", body)
  }

  async create(body: PlotFormData): Promise<Plot> {
    return this.httpPost("", body)
  }

  async update(id: number, body: Partial<PlotFormData>) {
    return this.httpPut(`${id}/`, body)
  }

  async delete(id: number): Promise<Plot> {
    return this.httpDelete(`${id}/`)
  }

  async getDetailed(id: number | null | string | undefined): Promise<PlotDetailed> {
    if (!id)
      return this.httpGet("/default/detailed/")

    return this.httpGet(`/detailed/${id}/`)
  }

  async assignToPredictions(plot: number, predictions: number[]) {
    return this.httpPost(`/${plot}/assign/`, {
      predictions_id: predictions
    })
  }

  async unassignPredictions(predictions: number[]) {
    return this.httpPost("/unassign/", {
      predictions_id: predictions
    })
  }
}

export function getPlots(body: PlotPaginatedRequest) {
  instantiateService()
  return service.getPaginated(body)
}

export function createPlot(body: PlotFormData) {
  instantiateService()
  return service.create(body)
}

export function updatePlot(id: number, body: Partial<PlotFormData>) {
  instantiateService()
  return service.update(id, body)
}

export function deletePlot(id: number) {
  instantiateService()
  return service.delete(id)
}

export function getDetailedPlot(id: number | null | string | undefined) {
  instantiateService()
  return service.getDetailed(id)
}

export function assignPlotToPredictions(plot: number | undefined | null, predictions: number[]) {
  instantiateService()
  if (!plot)
    return service.unassignPredictions(predictions)

  return service.assignToPredictions(plot, predictions)
}
