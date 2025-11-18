import type {Plot} from "@/types/database.ts";

export type SeverityLevel = 'healthy' | 'low' | 'moderate' | 'severe';
export type DashboardMode = 'normal' | 'comparative';

/**
 * Diagnostic - Tipo de presentación para la UI
 * Combina datos de Prediction + Image + Label de database.ts transformados
 * para facilitar el renderizado en componentes
 */
export interface Diagnostic {
  // IDs de referencia a database.ts
  id: bigint;

  // Datos transformados para presentación
  imageUrl: string;
  status: SeverityLevel;
  severity: number
  statusLabel: string;
  presenceConfidence: number;
  absenceConfidence: number;
  predictedAt: Date;

  // Información adicional
  location?: string;
  hasLocation: boolean;
}

export interface WeekStats {
  currentMonth: number;
  percentageChange: number;
}

export interface GeneralStats {
  healthyPercentage: number;
  total: number;
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
  total: number;
}

export interface DashboardStats {
  weekStats: WeekStats;
  generalStats: GeneralStats;
  severityAverage: SeverityAverage;
  summary: DiagnosticSummary;
  totalPlots: number;
}

export interface TrendDataPoint {
  month: string;
  healthy: number;
  low: number;
  moderate: number;
  severe: number;
}

export interface DashboardFilters {
  dateFrom?: Date;
  dateTo?: Date;
  severity?: SeverityLevel | 'all';
  plotId?: string | 'all';
}

export interface ComparativePlotData {
  plotId: string;
  plotName: string;
  stats: DashboardStats;
  trendData: TrendDataPoint[];
  summary: DiagnosticSummary;
}

export interface ComparativeData {
  plot1: ComparativePlotData;
  plot2: ComparativePlotData;
}

export interface DashboardData {
  mode: DashboardMode;
  stats: DashboardStats;
  trendData: TrendDataPoint[];
  recentDiagnostics: Diagnostic[];
  filters: DashboardFilters;
  isLoading: boolean;
  error: string | null;
}


export interface DashboardSummaryRequest {
  min_date?: string
  max_date?: string
  plot_ids?: (number | undefined | null)[];
  labels?: string[];
}

export interface DashboardSummaryResponse {
  total: number
  plot_count: number
  mean_severity: number
  labels_count: LabelsCount[]
  diagnosis_distribution: DiagnosisSummaryDistribution[]
}

export interface DiagnosisSummaryDistribution {
  month: string;
  labels_count: LabelsCount[];
}

export interface LabelsCount {
  label: Label
  count: number
}

export interface Label {
  id: number
  name: string
}
export interface DiagnosisSummaryFilters {
  labels: Label[]
  plots: Plot[]
}


export interface DiagnosticResponse {
  id: number
  presence_confidence: number
  absence_confidence: number
  severity: number
  predicted_at: string
  plot_id: number
  image: Image
  label: Label
  marks: Mark[]
  feedback?: Feedback
}

export interface Image {
  id: number
  filepath: string
  filename: string
  uploaded_at: string
}

export interface Label {
  id: number
  name: string
  min: number
  max: number
  description: string
  created_at: string
  updated_at: string
}

export interface Mark {
  id: number
  data: Data
  type: Type
}

export interface Data extends Record<string, any> {

}

export interface Type {
  id: number
  name: string
  description: string
}

export interface Feedback {
  id: number
  comment: string
  status: Status
  correct_label: Label
  prediction_id: number
  create_at: string
}

export interface Status {
  id: number
  name: string
  description: string
  create_at: string
}
