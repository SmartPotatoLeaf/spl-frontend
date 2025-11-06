import type { 
  DashboardStats, 
  TrendDataPoint, 
  Diagnostic, 
  ComparativeData,
  DashboardFilters 
} from '@/types';
import diagnosticsData from '@/data/diagnostics.json';
import plotsData from '@/data/plots.json';

const USE_MOCK = true;

export async function getDashboardStats(filters?: DashboardFilters): Promise<DashboardStats> {
  if (USE_MOCK) {
    return mockGetDashboardStats(filters);
  }
  
  const response = await fetch('/api/dashboard/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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

export async function getComparativeData(plot1Id: string, plot2Id: string): Promise<ComparativeData> {
  if (USE_MOCK) {
    return mockGetComparativeData(plot1Id, plot2Id);
  }
  
  const response = await fetch(`/api/dashboard/compare?plot1=${plot1Id}&plot2=${plot2Id}`);
  
  if (!response.ok) throw new Error('Error al obtener datos comparativos');
  return response.json();
}

function mockGetDashboardStats(filters?: DashboardFilters): Promise<DashboardStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let diagnostics = [...diagnosticsData];
      
      if (filters?.plotId && filters.plotId !== 'all') {
        diagnostics = diagnostics.filter(d => d.location?.includes(filters.plotId!));
      }
      
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
          currentWeek: summary.total,
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
      const trendData: TrendDataPoint[] = [
        { month: 'Ene', healthy: 45, low: 12, moderate: 8, severe: 5 },
        { month: 'Feb', healthy: 52, low: 15, moderate: 10, severe: 8 },
        { month: 'Mar', healthy: 48, low: 18, moderate: 12, severe: 7 },
        { month: 'Abr', healthy: 55, low: 20, moderate: 15, severe: 10 },
        { month: 'May', healthy: 60, low: 18, moderate: 12, severe: 8 },
      ];
      
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

function mockGetComparativeData(plot1Id: string, plot2Id: string): Promise<ComparativeData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plot1 = plotsData.find(p => p.id === plot1Id);
      const plot2 = plotsData.find(p => p.id === plot2Id);
      
      if (!plot1 || !plot2) {
        throw new Error('Parcelas no encontradas');
      }
      
      const createPlotData = (plot: typeof plot1) => ({
        plotId: plot.id,
        plotName: plot.name,
        stats: {
          weekStats: {
            currentWeek: plot.diagnosticsCount,
            percentageChange: Math.random() * 20 - 10,
          },
          generalStats: {
            healthyPercentage: (plot.healthyCount / plot.diagnosticsCount) * 100,
            percentageChange: Math.random() * 10 - 5,
          },
          severityAverage: {
            value: 1.2 + Math.random() * 1.5,
            change: Math.random() * 0.4 - 0.2,
          },
          summary: {
            healthy: plot.healthyCount,
            low: Math.floor(plot.infectedCount * 0.3),
            moderate: Math.floor(plot.infectedCount * 0.4),
            severe: Math.floor(plot.infectedCount * 0.3),
            total: plot.diagnosticsCount,
          },
          totalPlots: 1,
        },
        trendData: [
          { month: 'Ene', healthy: 20, low: 5, moderate: 3, severe: 2 },
          { month: 'Feb', healthy: 25, low: 6, moderate: 4, severe: 3 },
          { month: 'Mar', healthy: 22, low: 7, moderate: 5, severe: 3 },
          { month: 'Abr', healthy: 28, low: 8, moderate: 6, severe: 4 },
          { month: 'May', healthy: 30, low: 7, moderate: 5, severe: 3 },
        ],
        summary: {
          healthy: plot.healthyCount,
          low: Math.floor(plot.infectedCount * 0.3),
          moderate: Math.floor(plot.infectedCount * 0.4),
          severe: Math.floor(plot.infectedCount * 0.3),
          total: plot.diagnosticsCount,
        },
      });
      
      const data: ComparativeData = {
        plot1: createPlotData(plot1),
        plot2: createPlotData(plot2),
      };
      
      resolve(data);
    }, 800);
  });
}
