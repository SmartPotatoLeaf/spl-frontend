import type { PlotSummary, PlotDetail } from '@/types';
import plotsData from '@/data/plots.json';
import plotDetailsData from '@/data/plotDetails.json';

const USE_MOCK = true;

// Función helper para convertir fechas de string a Date
function parsePlot(data: any): PlotSummary {
  return {
    ...data,
    id: BigInt(data.id),
    create_at: new Date(data.create_at),
    updated_at: new Date(data.updated_at),
    lastDiagnosticDate: data.lastDiagnosticDate ? new Date(data.lastDiagnosticDate) : undefined,
  };
}

function mockGetAllPlots(): Promise<PlotSummary[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const plots = plotsData.map(parsePlot);
      resolve(plots);
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

function mockGetPlotDetail(plotId: string): Promise<PlotDetail> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const plotDetail = plotDetailsData.find(p => p.id === plotId);
      if (!plotDetail) {
        reject(new Error('Plot not found'));
        return;
      }

      // Parse dates and BigInt
      const parsed: PlotDetail = {
        ...plotDetail,
        id: BigInt(plotDetail.id),
        create_at: new Date(plotDetail.create_at),
        updated_at: new Date(plotDetail.updated_at),
        lastDiagnosticDate: plotDetail.lastDiagnosticDate 
          ? new Date(plotDetail.lastDiagnosticDate) 
          : undefined,
        recentImages: [],
        trendData: plotDetail.trendData,
        distributionData: plotDetail.distributionData,
      };

      resolve(parsed);
    }, 300);
  });
}

export async function getPlotById(plotId: string): Promise<PlotDetail> {
  if (USE_MOCK) {
    return mockGetPlotDetail(plotId);
  }
  const response = await fetch(`/api/plots/${plotId}`);
  return response.json();
}
