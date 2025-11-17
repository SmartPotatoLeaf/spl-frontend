import type {Plot} from './database';

/**
 * PlotFormData - Datos para crear o editar una parcela
 */
export interface PlotFormData {
  name: string;
  description: string;
}

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


export interface PlotPaginatedRequest {
  "page": number,
  "limit": number,
  "labels"?: string[],
}

export interface PlotPaginatedResponse {
  total: number
  limit: number
  page: number,
  items: PlotDetailed[]
}

export interface PlotDetailed {
  id: number | null
  name: string
  description: string
  created_at: Date
  total_diagnosis: number
  last_diagnosis: Date
  healthy_diagnosis: number
}
