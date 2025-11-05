import type { Plot } from './database';

/**
 * PlotSummary - Extiende Plot de database.ts con estadísticas calculadas
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
 * PlotDetail - Información completa de parcela con gráficos
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
  trendData: PlotTrendData;
  distributionData: PlotDistributionData;
}

/**
 * PlotTrendData - Gráfico de tendencia temporal (Chart.js line)
 */
export interface PlotTrendData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

/**
 * PlotDistributionData - Gráfico de distribución (Chart.js donut)
 */
export interface PlotDistributionData {
  healthy: number;
  low: number;
  moderate: number;
  severe: number;
}
