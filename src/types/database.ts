export interface Role {
  id: number;
  name: string;
  create_at: Date;
}

export interface User {
  id: bigint;
  username: string;
  email: string;
  role: string;
}

export interface FeedbackStatus {
  id: number;
  name: string;
  description: string;
}

export interface Label {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export interface RecommendationType {
  id: bigint;
  name: string;
  description: string;
}

export interface Recommendation {
  id: bigint;
  recommendation_type_id: bigint;
  description: string | null;
  label_id: number;
}

export interface MarkType {
  id: number;
  name: string;
  description: string;
  create_at: Date;
}

export interface Image {
  id: bigint;
  user_id: bigint;
  filepath: string | null;
  filename: string;
  uploaded_at: Date;
}

export interface Plot {
  id: bigint;
  user_id: bigint;
  name: string;
  description: string;
  create_at: Date;
  updated_at: Date;
}

export interface PlotImage {
  id: bigint;
  plot_id: bigint;
  image_id: bigint;
}

export interface Prediction {
  id: bigint;
  image_id: bigint;
  label_id: number;
  confidence: number;
  predicted_at: Date;
}

export interface PredictionMark {
  id: bigint;
  prediction_id: bigint;
  data: Record<string, any>;
  mark_type_id: number;
}

export interface UserFeedback {
  id: bigint;
  prediction_id: bigint;
  user_id: bigint;
  status_id: number;
  agrees: boolean | null;
  correct_label_id: number;
  comment: string | null;
  feedback_at: Date;
}
