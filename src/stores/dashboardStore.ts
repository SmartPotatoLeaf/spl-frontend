import { map } from 'nanostores';
import type { 
  DashboardMode, 
  DashboardStats, 
  TrendDataPoint, 
  Diagnostic,
  DashboardFilters,
  ComparativeData
} from '@/types';

export interface DashboardState {
  mode: DashboardMode;
  stats: DashboardStats | null;
  trendData: TrendDataPoint[];
  recentDiagnostics: Diagnostic[];
  filters: DashboardFilters;
  isLoading: boolean;
  error: string | null;
  
  comparativeData: ComparativeData | null;
  selectedPlots: [string | null, string | null];
  comparativeFilters: DashboardFilters;
  isLoadingComparative: boolean;
}

export const dashboardStore = map<DashboardState>({
  mode: 'normal',
  stats: null,
  trendData: [],
  recentDiagnostics: [],
  filters: {
    dateFrom: undefined,
    dateTo: undefined,
    severity: 'all',
    plotId: 'all',
  },
  isLoading: false,
  error: null,
  
  comparativeData: null,
  selectedPlots: [null, null],
  comparativeFilters: {
    dateFrom: undefined,
    dateTo: undefined,
    severity: 'all',
  },
  isLoadingComparative: false,
});

export function setDashboardMode(mode: DashboardMode) {
  dashboardStore.setKey('mode', mode);
  
  if (mode === 'normal') {
    dashboardStore.setKey('selectedPlots', [null, null]);
    dashboardStore.setKey('comparativeData', null);
  }
}

export function setDashboardData(
  stats: DashboardStats,
  trendData: TrendDataPoint[],
  diagnostics: Diagnostic[]
) {
  dashboardStore.setKey('stats', stats);
  dashboardStore.setKey('trendData', trendData);
  dashboardStore.setKey('recentDiagnostics', diagnostics);
  dashboardStore.setKey('isLoading', false);
  dashboardStore.setKey('error', null);
}

export function setDashboardLoading(isLoading: boolean) {
  dashboardStore.setKey('isLoading', isLoading);
}

export function setDashboardError(error: string | null) {
  dashboardStore.setKey('error', error);
  dashboardStore.setKey('isLoading', false);
}

export function setDashboardFilters(filters: Partial<DashboardFilters>) {
  const currentFilters = dashboardStore.get().filters;
  dashboardStore.setKey('filters', { ...currentFilters, ...filters });
}

export function setComparativeFilters(filters: Partial<DashboardFilters>) {
  const currentFilters = dashboardStore.get().comparativeFilters;
  dashboardStore.setKey('comparativeFilters', { ...currentFilters, ...filters });
}

export function setSelectedPlots(plot1Id: string | null, plot2Id: string | null) {
  dashboardStore.setKey('selectedPlots', [plot1Id, plot2Id]);
}

export function setComparativeData(data: ComparativeData | null) {
  dashboardStore.setKey('comparativeData', data);
  dashboardStore.setKey('isLoadingComparative', false);
}

export function setComparativeLoading(isLoading: boolean) {
  dashboardStore.setKey('isLoadingComparative', isLoading);
}

export function resetDashboard() {
  dashboardStore.set({
    mode: 'normal',
    stats: null,
    trendData: [],
    recentDiagnostics: [],
    filters: {
      dateFrom: undefined,
      dateTo: undefined,
      severity: 'all',
      plotId: 'all',
    },
    isLoading: false,
    error: null,
    comparativeData: null,
    selectedPlots: [null, null],
    comparativeFilters: {
      dateFrom: undefined,
      dateTo: undefined,
      severity: 'all',
    },
    isLoadingComparative: false,
  });
}
