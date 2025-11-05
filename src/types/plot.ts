import type { Plot, PlotImage, Image, Prediction, Label } from './database';

/**
 * PlotSummary - Tipo de presentación que extiende Plot de database.ts
 * Añade campos calculados para mostrar estadísticas
 */
export interface PlotSummary extends Omit<Plot, 'user_id'> {
  diagnosticsCount: number;
  healthyCount: number;
  infectedCount: number;
  lastDiagnosticDate?: Date;
  variety?: string;
  sector?: string;
}

/**
 * PlotDetail - Información completa de parcela con imágenes recientes
 */
export interface PlotDetail extends PlotSummary {
  recentImages: Array<{
    id: bigint;
    filepath: string;
    filename: string;
    uploaded_at: Date;
    prediction?: {
      id: bigint;
      label: string;
      confidence: number;
      predicted_at: Date;
    };
  }>;
}
