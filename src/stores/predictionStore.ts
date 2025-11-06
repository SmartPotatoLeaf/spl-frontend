import { map } from 'nanostores';
import type { Prediction, Image } from '@/types';

export interface PredictionState {
  current: {
    prediction: Prediction;
    image: Image;
  } | null;
  history: Array<{
    prediction: Prediction;
    image: Image;
  }>;
  isProcessing: boolean;
}

export const predictionStore = map<PredictionState>({
  current: null,
  history: [],
  isProcessing: false,
});

export function setCurrentPrediction(prediction: Prediction, image: Image) {
  const currentPrediction = { prediction, image };
  
  predictionStore.setKey('current', currentPrediction);
  
  const history = predictionStore.get().history;
  predictionStore.setKey('history', [...history, currentPrediction]);
}

export function setProcessing(isProcessing: boolean) {
  predictionStore.setKey('isProcessing', isProcessing);
}

export function clearPrediction() {
  predictionStore.setKey('current', null);
}
