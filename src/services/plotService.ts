import type { PlotSummary } from '@/types';

const USE_MOCK = true;

function mockGetAllPlots(): Promise<PlotSummary[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      resolve([
        {
          id: BigInt(1),
          name: 'Parcela A',
          description: 'Sector Norte - Variedad Canchan',
          create_at: new Date('2025-08-15'),
          updated_at: new Date('2025-10-25'),
          diagnosticsCount: 45,
          healthyCount: 32,
          infectedCount: 13,
          lastDiagnosticDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          variety: 'Canchan',
          sector: 'Sector Norte'
        },
        {
          id: BigInt(2),
          name: 'Parcela B',
          description: 'Sector Sur - Variedad Perricholi',
          create_at: new Date('2025-08-20'),
          updated_at: new Date('2025-10-24'),
          diagnosticsCount: 28,
          healthyCount: 20,
          infectedCount: 8,
          lastDiagnosticDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          variety: 'Perricholi',
          sector: 'Sector Sur'
        },
        {
          id: BigInt(3),
          name: 'Parcela C',
          description: 'Sector Este - Variedad Yungay',
          create_at: new Date('2025-08-25'),
          updated_at: new Date('2025-10-20'),
          diagnosticsCount: 15,
          healthyCount: 10,
          infectedCount: 5,
          lastDiagnosticDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
          variety: 'Yungay',
          sector: 'Sector Este'
        },
        {
          id: BigInt(4),
          name: 'Parcela D',
          description: 'Sector Oeste - Variedad Huayro',
          create_at: new Date('2025-09-01'),
          updated_at: new Date('2025-10-18'),
          diagnosticsCount: 12,
          healthyCount: 8,
          infectedCount: 4,
          lastDiagnosticDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
          variety: 'Huayro',
          sector: 'Sector Oeste'
        }
      ]);
    }, 300);
  });
}

export async function getAllPlots(): Promise<PlotSummary[]> {
  if (USE_MOCK) {
    return mockGetAllPlots();
  }
  const response = await fetch('/api/plots');
  return response.json();
}
