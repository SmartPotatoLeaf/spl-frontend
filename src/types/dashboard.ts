import type { Prediction, Image, Label } from './database';

export type SeverityLevel = 'healthy' | 'low' | 'moderate' | 'severe';

/**
 * Diagnostic - Tipo de presentación compuesto de Prediction + Image + Label
 * Este tipo transforma los datos de database.ts para la UI
 */
export interface Diagnostic {
  // IDs de entidades de database.ts
  predictionId: bigint;
  imageId: bigint;
  labelId: bigint;
  
  // Datos transformados para presentación
  imageUrl: string; // Transformado de Image.filepath
  status: SeverityLevel; // Transformado de Label.name
  statusLabel: string; // Transformado de Label.name
  confidence: number; // De Prediction.confidence
  predictedAt: Date; // De Prediction.predicted_at
  uploadedAt: Date; // De Image.uploaded_at
  
  // Información adicional opcional
  location?: string; // De PlotImage si existe relación
  hasLocation: boolean;
}

export interface WeekStats {
  currentWeek: number;
  percentageChange: number;
}

export interface GeneralStats {
  healthyPercentage: number;
  percentageChange: number;
}

export interface SeverityAverage {
  value: number;
  change: number;
}

export interface DiagnosticSummary {
  healthy: number;
  low: number;
  moderate: number;
  severe: number;
}

export interface DashboardStats {
  weekStats: WeekStats;
  generalStats: GeneralStats;
  severityAverage: SeverityAverage;
  summary: DiagnosticSummary;
}
