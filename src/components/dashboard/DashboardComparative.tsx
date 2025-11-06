import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { dashboardStore, plotsStore, setSelectedPlots, setComparativeData, setComparativeLoading } from '@/stores';
import { getComparativeData } from '@/services/dashboardService';
import { toast } from '@/stores';
import DashboardComparativeView from './DashboardComparativeView';

export default function DashboardComparative() {
  const { selectedPlots, comparativeData, isLoadingComparative } = useStore(dashboardStore);
  const { plots } = useStore(plotsStore);
  
  const [localPlot1, setLocalPlot1] = useState<string>('');
  const [localPlot2, setLocalPlot2] = useState<string>('');

  const handleCompare = async () => {
    if (!localPlot1 || !localPlot2) {
      toast.warning('Selecciona dos parcelas', 'Debes seleccionar ambas parcelas para comparar');
      return;
    }

    if (localPlot1 === localPlot2) {
      toast.error('Parcelas duplicadas', 'Debes seleccionar dos parcelas diferentes');
      return;
    }

    try {
      setComparativeLoading(true);
      setSelectedPlots(localPlot1, localPlot2);
      
      const data = await getComparativeData(localPlot1, localPlot2);
      setComparativeData(data);
    } catch (err) {
      toast.error('Error al comparar', err instanceof Error ? err.message : 'Error al obtener datos');
      setComparativeData(null);
    }
  };

  if (comparativeData && selectedPlots[0] && selectedPlots[1]) {
    return <DashboardComparativeView data={comparativeData} />;
  }

  return (
    <div className="bg-white rounded-lg border border-outline p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-balance-scale text-3xl text-primary"></i>
          </div>
          <h2 className="text-2xl font-bold text-state-idle mb-2">Comparar parcelas</h2>
          <p className="text-state-disabled">
            Selecciona dos parcelas para ver una comparación detallada de sus diagnósticos
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="plot1" className="block text-sm font-medium text-state-idle mb-2">
                Primera parcela
              </label>
              <select
                id="plot1"
                value={localPlot1}
                onChange={(e) => setLocalPlot1(e.target.value)}
                className="w-full px-4 py-3 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={isLoadingComparative}
              >
                <option value="">Seleccionar parcela...</option>
                {plots.map(plot => (
                  <option key={plot.id.toString()} value={plot.id.toString()}>
                    {plot.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="plot2" className="block text-sm font-medium text-state-idle mb-2">
                Segunda parcela
              </label>
              <select
                id="plot2"
                value={localPlot2}
                onChange={(e) => setLocalPlot2(e.target.value)}
                className="w-full px-4 py-3 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={isLoadingComparative}
              >
                <option value="">Seleccionar parcela...</option>
                {plots.map(plot => (
                  <option 
                    key={plot.id.toString()} 
                    value={plot.id.toString()}
                    disabled={plot.id.toString() === localPlot1}
                  >
                    {plot.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={!localPlot1 || !localPlot2 || isLoadingComparative}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:bg-state-disabled disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoadingComparative ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Cargando comparación...
              </>
            ) : (
              <>
                <i className="fas fa-balance-scale"></i>
                Comparar parcelas
              </>
            )}
          </button>
        </div>

        {plots.length === 0 && (
          <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-state-disabled text-sm">
              No hay parcelas registradas. Agrega parcelas para poder compararlas.
            </p>
          </div>
        )}

        {plots.length === 1 && (
          <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-state-disabled text-sm">
              Necesitas al menos dos parcelas para poder hacer una comparación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
