import type {
  ComparativeData,
  DashboardFilters,
  DashboardStats,
  DashboardSummaryRequest,
  DashboardSummaryResponse,
  DiagnosisSummaryFilters,
  Diagnostic,
  TrendDataPoint
} from '@/types';
import diagnosticsData from '@/data/diagnostics.json';
import plotsData from '@/data/plots.json';
import CrudService from "@/services/crud/CrudService.ts";
import {API_URL} from "astro:env/client";
import {getToken} from "@/stores/authStore.ts";

let service: DashboardService = null!

class DashboardService extends CrudService<any> {
  constructor() {
    super(`${API_URL}/dashboard/`, {
      tokenProvider: getToken
    })
  }

  async getSummary(filters: DashboardSummaryRequest): Promise<DashboardSummaryResponse> {
    return this.httpPost("/summary/", filters)
  }

  async getFilters(): Promise<DiagnosisSummaryFilters> {
    return this.httpGet("/filters/")
  }
}

function instantiateService() {
  if (!service) {
    service = new DashboardService();
  }
}

export function getDashboardFilters(): Promise<DiagnosisSummaryFilters> {
  instantiateService()
  return service.getFilters()
}

export function getDashboardSummary(filters: DashboardSummaryRequest): Promise<DashboardSummaryResponse> {
  instantiateService()
  return service.getSummary(filters)
}

const USE_MOCK = true;

export async function getDashboardStats(filters?: DashboardFilters): Promise<DashboardStats> {
  if (USE_MOCK) {
    return mockGetDashboardStats(filters);
  }

  const response = await fetch('/api/dashboard/stats', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(filters),
  });

  if (!response.ok) throw new Error('Error al obtener estadísticas del dashboard');
  return response.json();
}

export async function getDashboardTrendData(filters?: DashboardFilters): Promise<TrendDataPoint[]> {
  if (USE_MOCK) {
    return mockGetTrendData(filters);
  }

  const response = await fetch('/api/dashboard/trends', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(filters),
  });

  if (!response.ok) throw new Error('Error al obtener datos de tendencias');
  return response.json();
}

export async function getRecentDiagnostics(limit: number = 10): Promise<Diagnostic[]> {
  if (USE_MOCK) {
    return mockGetRecentDiagnostics(limit);
  }

  const response = await fetch(`/api/dashboard/diagnostics/recent?limit=${limit}`);

  if (!response.ok) throw new Error('Error al obtener diagnósticos recientes');
  return response.json();
}

export async function getComparativeData(plot1Id: string, plot2Id: string, filters?: DashboardFilters): Promise<ComparativeData> {
  if (USE_MOCK) {
    return mockGetComparativeData(plot1Id, plot2Id, filters);
  }

  const response = await fetch(`/api/dashboard/compare?plot1=${plot1Id}&plot2=${plot2Id}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(filters),
  });

  if (!response.ok) throw new Error('Error al obtener datos comparativos');
  return response.json();
}

function mockGetDashboardStats(filters?: DashboardFilters): Promise<DashboardStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let diagnostics = [...diagnosticsData];

      // Filtrar por fecha
      if (filters?.dateFrom) {
        diagnostics = diagnostics.filter(d => {
          const diagDate = new Date(d.predictedAt);
          return diagDate >= filters.dateFrom!;
        });
      }

      if (filters?.dateTo) {
        diagnostics = diagnostics.filter(d => {
          const diagDate = new Date(d.predictedAt);
          return diagDate <= filters.dateTo!;
        });
      }

      // Filtrar por parcela
      if (filters?.plotId && filters.plotId !== 'all') {
        // Buscar el nombre de la parcela por ID
        const plot = plotsData.find(p => p.id === filters.plotId);
        if (plot) {
          diagnostics = diagnostics.filter(d => d.location === plot.name);
        }
      }

      // Filtrar por severidad
      if (filters?.severity && filters.severity !== 'all') {
        diagnostics = diagnostics.filter(d => d.status === filters.severity);
      }

      const summary = {
        healthy: diagnostics.filter(d => d.status === 'healthy').length,
        low: diagnostics.filter(d => d.status === 'low').length,
        moderate: diagnostics.filter(d => d.status === 'moderate').length,
        severe: diagnostics.filter(d => d.status === 'severe').length,
        total: diagnostics.length,
      };

      const healthyPercentage = summary.total > 0
        ? (summary.healthy / summary.total) * 100
        : 0;

      const stats: DashboardStats = {
        weekStats: {
          currentMonth: summary.total,
          percentageChange: 12.5,
        },
        generalStats: {
          healthyPercentage: parseFloat(healthyPercentage.toFixed(2)),
          percentageChange: 5.3,
        },
        severityAverage: {
          value: 1.55,
          change: -0.2,
        },
        summary,
        totalPlots: plotsData.length,
      };

      resolve(stats);
    }, 500);
  });
}

function mockGetTrendData(filters?: DashboardFilters): Promise<TrendDataPoint[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let diagnostics = [...diagnosticsData];

      // Aplicar los mismos filtros que en las stats
      if (filters?.dateFrom) {
        diagnostics = diagnostics.filter(d => {
          const diagDate = new Date(d.predictedAt);
          return diagDate >= filters.dateFrom!;
        });
      }

      if (filters?.dateTo) {
        diagnostics = diagnostics.filter(d => {
          const diagDate = new Date(d.predictedAt);
          return diagDate <= filters.dateTo!;
        });
      }

      if (filters?.plotId && filters.plotId !== 'all') {
        const plot = plotsData.find(p => p.id === filters.plotId);
        if (plot) {
          diagnostics = diagnostics.filter(d => d.location === plot.name);
        }
      }

      if (filters?.severity && filters.severity !== 'all') {
        diagnostics = diagnostics.filter(d => d.status === filters.severity);
      }

      // Agrupar diagnósticos reales por mes
      const monthMap = new Map<string, { healthy: number; low: number; moderate: number; severe: number }>();
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      diagnostics.forEach(d => {
        const date = new Date(d.predictedAt);
        const monthKey = monthNames[date.getMonth()];

        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, {healthy: 0, low: 0, moderate: 0, severe: 0});
        }

        const monthData = monthMap.get(monthKey)!;
        monthData[d.status as keyof typeof monthData]++;
      });

      // Convertir a array de TrendDataPoint, ordenado por meses
      const trendData: TrendDataPoint[] = monthNames
        .map(month => ({
          month,
          healthy: monthMap.get(month)?.healthy || 0,
          low: monthMap.get(month)?.low || 0,
          moderate: monthMap.get(month)?.moderate || 0,
          severe: monthMap.get(month)?.severe || 0,
        }))
        .filter(point => point.healthy + point.low + point.moderate + point.severe > 0); // Solo meses con data

      resolve(trendData);
    }, 500);
  });
}

function mockGetRecentDiagnostics(limit: number): Promise<Diagnostic[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const diagnostics = diagnosticsData
        .slice(0, limit)
        .map(d => ({
          ...d,
          predictionId: BigInt(d.predictionId),
          imageId: BigInt(d.imageId),
          labelId: BigInt(d.labelId),
          status: d.status as 'healthy' | 'low' | 'moderate' | 'severe',
          predictedAt: new Date(d.predictedAt),
          uploadedAt: new Date(d.uploadedAt),
        }));

      resolve(diagnostics as Diagnostic[]);
    }, 500);
  });
}

function mockGetComparativeData(plot1Id: string, plot2Id: string, filters?: DashboardFilters): Promise<ComparativeData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plot1 = plotsData.find(p => p.id === plot1Id);
      const plot2 = plotsData.find(p => p.id === plot2Id);

      if (!plot1 || !plot2) {
        throw new Error('Parcelas no encontradas');
      }

      const createPlotData = (plot: typeof plot1) => {
        // Filtrar diagnósticos de esta parcela
        let plotDiagnostics = diagnosticsData.filter(d => d.location === plot.name);

        // Aplicar filtros de fecha
        if (filters?.dateFrom) {
          plotDiagnostics = plotDiagnostics.filter(d => {
            const diagDate = new Date(d.predictedAt);
            return diagDate >= filters.dateFrom!;
          });
        }

        if (filters?.dateTo) {
          plotDiagnostics = plotDiagnostics.filter(d => {
            const diagDate = new Date(d.predictedAt);
            return diagDate <= filters.dateTo!;
          });
        }

        // Aplicar filtro de severidad
        if (filters?.severity && filters.severity !== 'all') {
          plotDiagnostics = plotDiagnostics.filter(d => d.status === filters.severity);
        }

        const healthyCount = plotDiagnostics.filter(d => d.status === 'healthy').length;
        const lowCount = plotDiagnostics.filter(d => d.status === 'low').length;
        const moderateCount = plotDiagnostics.filter(d => d.status === 'moderate').length;
        const severeCount = plotDiagnostics.filter(d => d.status === 'severe').length;
        const totalCount = plotDiagnostics.length;

        // Agrupar diagnósticos reales por mes para esta parcela
        const monthMap = new Map<string, { healthy: number; low: number; moderate: number; severe: number }>();
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        plotDiagnostics.forEach(d => {
          const date = new Date(d.predictedAt);
          const monthKey = monthNames[date.getMonth()];

          if (!monthMap.has(monthKey)) {
            monthMap.set(monthKey, {healthy: 0, low: 0, moderate: 0, severe: 0});
          }

          const monthData = monthMap.get(monthKey)!;
          monthData[d.status as keyof typeof monthData]++;
        });

        // Convertir a array de TrendDataPoint
        const trendData: TrendDataPoint[] = monthNames
          .map(month => ({
            month,
            healthy: monthMap.get(month)?.healthy || 0,
            low: monthMap.get(month)?.low || 0,
            moderate: monthMap.get(month)?.moderate || 0,
            severe: monthMap.get(month)?.severe || 0,
          }))
          .filter(point => point.healthy + point.low + point.moderate + point.severe > 0);

        return {
          plotId: plot.id,
          plotName: plot.name,
          stats: {
            weekStats: {
              currentWeek: totalCount,
              percentageChange: Math.random() * 20 - 10,
            },
            generalStats: {
              healthyPercentage: totalCount > 0 ? (healthyCount / totalCount) * 100 : 0,
              percentageChange: Math.random() * 10 - 5,
            },
            severityAverage: {
              value: 1.2 + Math.random() * 1.5,
              change: Math.random() * 0.4 - 0.2,
            },
            summary: {
              healthy: healthyCount,
              low: lowCount,
              moderate: moderateCount,
              severe: severeCount,
              total: totalCount,
            },
            totalPlots: 1,
          },
          trendData,
          summary: {
            healthy: healthyCount,
            low: lowCount,
            moderate: moderateCount,
            severe: severeCount,
            total: totalCount,
          },
        };
      };

      const data: ComparativeData = {
        plot1: createPlotData(plot1),
        plot2: createPlotData(plot2),
      };

      resolve(data);
    }, 800);
  });
}
