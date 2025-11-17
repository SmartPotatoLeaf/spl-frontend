import type {Label} from "@/types/dashboard.ts";

export interface FeedbackCreate {
  comment: string
  correct_label_id: number
  prediction_id: number
}

export type FeedbackUpdate = Partial<Omit<FeedbackCreate, "prediction_id">>

export interface Feedback {
  id: number
  comment: string
  status: FeedbackStatus
  correct_label: Label
  prediction_id: number
  create_at: string
}

export interface FeedbackStatus {
  id: number
  name: string
  description: string
  create_at: string
}


