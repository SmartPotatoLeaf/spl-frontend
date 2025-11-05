import type { DashboardStats, Diagnostic } from '@/types';
import diagnosticsData from '@/data/diagnostics.json';

const USE_MOCK = true;

// Función helper para convertir fechas de string a Date
function parseDiagnostic(data: any): Diagnostic {
  return {
    ...data,
    predictionId: BigInt(data.predictionId),
    imageId: BigInt(data.imageId),
    labelId: BigInt(data.labelId),
    predictedAt: new Date(data.predictedAt),
    uploadedAt: new Date(data.uploadedAt),
  };
}

function mockGetDashboardStats(): Promise<DashboardStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        weekStats: {
          currentWeek: 12,
          percentageChange: 8.5
        },
        generalStats: {
          healthyPercentage: 78,
          percentageChange: 5.2
        },
        severityAverage: {
          value: 1.8,
          change: -0.3
        },
        summary: {
          healthy: 45,
          low: 18,
          moderate: 8,
          severe: 3
        }
      });
    }, 300);
  });
}

function mockGetRecentDiagnostics(): Promise<Diagnostic[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tomar los 5 más recientes del JSON
      const allDiagnostics = diagnosticsData.map(parseDiagnostic);
      const sorted = allDiagnostics.sort((a, b) => 
        b.predictedAt.getTime() - a.predictedAt.getTime()
      );
      resolve(sorted.slice(0, 5));
    }, 300);
  });
}

function mockGetAllDiagnostics(): Promise<Diagnostic[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allDiagnostics = diagnosticsData.map(parseDiagnostic);
      const sorted = allDiagnostics.sort((a, b) => 
        b.predictedAt.getTime() - a.predictedAt.getTime()
      );
      resolve(sorted);
    }, 300);
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK) {
    return mockGetDashboardStats();
  }
  const response = await fetch('/api/dashboard/stats');
  return response.json();
}

export async function getRecentDiagnostics(): Promise<Diagnostic[]> {
  if (USE_MOCK) {
    return mockGetRecentDiagnostics();
  }
  const response = await fetch('/api/dashboard/recent');
  return response.json();
}

export async function getAllDiagnostics(): Promise<Diagnostic[]> {
  if (USE_MOCK) {
    return mockGetAllDiagnostics();
  }
  const response = await fetch('/api/diagnostics/history');
  return response.json();
}
