import type {Image, Prediction} from './database';
import type {AuthUser} from './auth';

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PredictionResult {
  prediction: Prediction;
  image: Image;
  recommendations: string[];
}

export interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  currentPrediction: PredictionResult | null;
  upload: UploadState;
}
