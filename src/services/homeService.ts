import type { DashboardStats, Diagnostic } from '@/types';

const USE_MOCK = true;

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
      const now = new Date();
      resolve([
        {
          predictionId: BigInt(1),
          imageId: BigInt(101),
          labelId: BigInt(1),
          imageUrl: '/placeholder.jpg',
          status: 'healthy',
          statusLabel: 'Sin rancha',
          confidence: 0.95,
          predictedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          uploadedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          location: 'Parcela A',
          hasLocation: true
        },
        {
          predictionId: BigInt(2),
          imageId: BigInt(102),
          labelId: BigInt(2),
          imageUrl: '/placeholder.jpg',
          status: 'low',
          statusLabel: 'Rancha leve',
          confidence: 0.87,
          predictedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          uploadedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          location: 'Parcela A',
          hasLocation: true
        },
        {
          predictionId: BigInt(3),
          imageId: BigInt(103),
          labelId: BigInt(4),
          imageUrl: '/placeholder.jpg',
          status: 'severe',
          statusLabel: 'Rancha severa',
          confidence: 0.92,
          predictedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          uploadedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          hasLocation: false
        },
        {
          predictionId: BigInt(4),
          imageId: BigInt(104),
          labelId: BigInt(3),
          imageUrl: '/placeholder.jpg',
          status: 'moderate',
          statusLabel: 'Rancha moderada',
          confidence: 0.89,
          predictedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          uploadedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
          hasLocation: false
        },
        {
          predictionId: BigInt(5),
          imageId: BigInt(105),
          labelId: BigInt(1),
          imageUrl: '/placeholder.jpg',
          status: 'healthy',
          statusLabel: 'Sin rancha',
          confidence: 0.96,
          predictedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          uploadedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          location: 'Parcela B',
          hasLocation: true
        }
      ]);
    }, 300);
  });
}

function mockGetAllDiagnostics(): Promise<Diagnostic[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const statuses: Array<{ status: 'healthy' | 'low' | 'moderate' | 'severe', label: string, labelId: number }> = [
        { status: 'healthy', label: 'Sin rancha', labelId: 1 },
        { status: 'low', label: 'Rancha leve', labelId: 2 },
        { status: 'moderate', label: 'Rancha moderada', labelId: 3 },
        { status: 'severe', label: 'Rancha severa', labelId: 4 }
      ];
      
      const parcelas = ['Parcela A', 'Parcela B', 'Parcela C', 'Parcela D'];
      
      const diagnostics: Diagnostic[] = [];
      const now = new Date();
      
      for (let i = 1; i <= 20; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const hasLocation = Math.random() > 0.3;
        const randomParcela = parcelas[Math.floor(Math.random() * parcelas.length)];
        const randomDaysAgo = Math.floor(Math.random() * 90);
        const date = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
        const confidence = 0.7 + Math.random() * 0.25;
        
        diagnostics.push({
          predictionId: BigInt(i),
          imageId: BigInt(100 + i),
          labelId: BigInt(randomStatus.labelId),
          imageUrl: '/placeholder.jpg',
          status: randomStatus.status,
          statusLabel: randomStatus.label,
          confidence: Math.round(confidence * 100) / 100,
          predictedAt: date,
          uploadedAt: date,
          location: hasLocation ? randomParcela : undefined,
          hasLocation
        });
      }
      
      resolve(diagnostics.sort((a, b) => b.predictedAt.getTime() - a.predictedAt.getTime()));
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
