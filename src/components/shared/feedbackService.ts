import CrudService from "@/services/crud/CrudService.ts";
import type {Feedback, FeedbackCreate, FeedbackUpdate} from "@/types/feedback.ts";
import {API_URL} from "astro:env/client";
import {getToken, logout} from "@/stores/authStore.ts";

let service: FeedbackService = null!

export class FeedbackService extends CrudService<Feedback> {
  constructor() {
    super(`${API_URL}/feedbacks/`, {
      tokenProvider: getToken,
      tokenRemover: logout
    });
  }

  async create(body: FeedbackCreate): Promise<Feedback> {
    return this.httpPost("/", body)
  }

  async update(id: number, body: FeedbackUpdate): Promise<Feedback> {
    return this.httpPut(`/${id}`, body)
  }
}

function instantiateService() {
  if (!service) {
    service = new FeedbackService();
  }
}

export function createFeedback(body: FeedbackCreate): Promise<Feedback> {
  instantiateService();
  return service.create(body);
}

export function updateFeedback(id: number, body: FeedbackUpdate): Promise<Feedback> {
  instantiateService();
  return service.update(id, body);
}
