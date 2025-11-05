import { useEffect, useState } from 'react';
import { TrendChart, DistributionChart } from './PlotCharts';
import ChartModal from '@/components/shared/ChartModal';
import type { PlotDetail } from '@/types';
import { getPlotById } from '@/services/plotService';

interface PlotDetailViewProps {
  plotId: string;
}

type ChartType = 'trend' | 'distribution' | null;

export default function PlotDetailView({ plotId }: PlotDetailViewProps) {
  const [plot, setPlot] = useState<PlotDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChart, setExpandedChart] = useState<ChartType>(null);

  useEffect(() => {
    async function loadPlot() {
      try {
        setIsLoading(true);
        const data = await getPlotById(plotId);
        setPlot(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la parcela');
      } finally {
        setIsLoading(false);
      }
    }

    loadPlot();
  }, [plotId]);

  const formatDate = (date: Date): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const handleDownloadChart = (chartName: string) => {
    // TODO: Implementar descarga de gráfico
    console.log(`Descargar gráfico: ${chartName}`);
  };

  const handleExpandChart = (chartType: ChartType) => {
    setExpandedChart(chartType);
  };

  const handleCloseModal = () => {
    setExpandedChart(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-state-disabled">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (error || !plot) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-error mb-4"></i>
        <p className="text-error font-semibold">{error || 'Parcela no encontrada'}</p>
        <a href="/plots" className="inline-block mt-4 text-primary hover:underline">
          Volver a mis parcelas
        </a>
      </div>
    );
  }

  const healthyPercentage = plot.diagnosticsCount > 0 
    ? ((plot.healthyCount / plot.diagnosticsCount) * 100).toFixed(2)
    : '0.00';

  return (
    <div>
      <div className="mb-6">
        <a href="/plots" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <i className="fas fa-arrow-left"></i>
          Volver a mis parcelas
        </a>
        <h1 className="text-2xl sm:text-3xl font-bold text-state-idle">Detalles de la parcela</h1>
      </div>

      {/* Información de la parcela */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Columna izquierda */}
        <div className="bg-white rounded-lg border border-outline p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-state-disabled mb-1">Nombre</h3>
            <p className="text-base text-state-idle font-semibold">{plot.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-state-disabled mb-1">Descripción</h3>
            <p className="text-sm text-state-idle leading-relaxed">{plot.description}</p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="bg-white rounded-lg border border-outline p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-state-disabled mb-1">Número de diagnósticos</h3>
              <p className="text-2xl text-state-idle font-semibold">{plot.diagnosticsCount}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-state-disabled mb-1">Diagnósticos sin rancha</h3>
              <p className="text-2xl text-state-idle font-semibold">{plot.healthyCount} ({healthyPercentage}%)</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-state-disabled mb-1">Fecha de creación</h3>
              <p className="text-sm text-state-idle">{formatDate(plot.create_at)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-state-disabled mb-1">Último diagnóstico</h3>
              <p className="text-sm text-state-idle">
                {plot.lastDiagnosticDate ? formatDate(plot.lastDiagnosticDate) : 'Sin diagnósticos'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de diagnósticos */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-state-idle mb-6">Análisis de diagnósticos</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendencia de diagnósticos */}
          <div className="bg-white rounded-lg border border-outline p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-state-idle">Tendencia de diagnósticos</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownloadChart('tendencia')}
                  className="p-2 text-state-disabled hover:text-state-idle transition-colors"
                  title="Descargar"
                >
                  <i className="fas fa-download"></i>
                </button>
                <button 
                  onClick={() => handleExpandChart('trend')}
                  className="p-2 text-state-disabled hover:text-state-idle transition-colors"
                  title="Expandir"
                >
                  <i className="fas fa-expand-alt"></i>
                </button>
              </div>
            </div>
            <TrendChart data={plot.trendData} />
          </div>

          {/* Distribución de diagnósticos */}
          <div className="bg-white rounded-lg border border-outline p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-state-idle">Distribución de diagnósticos</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownloadChart('distribución')}
                  className="p-2 text-state-disabled hover:text-state-idle transition-colors"
                  title="Descargar"
                >
                  <i className="fas fa-download"></i>
                </button>
                <button 
                  onClick={() => handleExpandChart('distribution')}
                  className="p-2 text-state-disabled hover:text-state-idle transition-colors"
                  title="Expandir"
                >
                  <i className="fas fa-expand-alt"></i>
                </button>
              </div>
            </div>
            <DistributionChart data={plot.distributionData} />
          </div>
        </div>
      </div>

      {/* Modal de Tendencia */}
      <ChartModal
        isOpen={expandedChart === 'trend'}
        onClose={handleCloseModal}
        title="Tendencia de diagnósticos"
      >
        <div className="h-[600px]">
          {plot && <TrendChart data={plot.trendData} />}
        </div>
      </ChartModal>

      {/* Modal de Distribución */}
      <ChartModal
        isOpen={expandedChart === 'distribution'}
        onClose={handleCloseModal}
        title="Distribución de diagnósticos"
      >
        <div className="max-w-2xl mx-auto">
          {plot && <DistributionChart data={plot.distributionData} />}
        </div>
      </ChartModal>
    </div>
  );
}
