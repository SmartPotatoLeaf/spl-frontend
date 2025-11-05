export type SeverityLevel = 'healthy' | 'low' | 'moderate' | 'severe';

/**
 * Diagnostic - Tipo de presentación para la UI
 * Combina datos de Prediction + Image + Label de database.ts transformados
 * para facilitar el renderizado en componentes
 */
export interface Diagnostic {
  // IDs de referencia a database.ts
  predictionId: bigint;
  imageId: bigint;
  labelId: bigint;
  
  // Datos transformados para presentación
  imageUrl: string;
  status: SeverityLevel;
  statusLabel: string;
  confidence: number;
  predictedAt: Date;
  uploadedAt: Date;
  
  // Información adicional
  location?: string;
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
