import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardStore, plotsStore, setSelectedPlots, setComparativeData, setComparativeLoading } from '@/stores';
import { getComparativeData } from '@/services/dashboardService';
import { toast } from '@/stores';
import DashboardComparativeView from './DashboardComparativeView';

export default function DashboardComparative() {
  const { t } = useTranslation();
  const { selectedPlots, comparativeData, comparativeFilters, isLoadingComparative } = useStore(dashboardStore);
  const { plots } = useStore(plotsStore);
  
  const [localPlot1, setLocalPlot1] = useState<string>('');
  const [localPlot2, setLocalPlot2] = useState<string>('');

  useEffect(() => {
    if (comparativeData && selectedPlots[0] && selectedPlots[1]) {
      loadComparativeData();
    }
  }, [comparativeFilters]);

  const loadComparativeData = async () => {
    if (!selectedPlots[0] || !selectedPlots[1]) return;
    
    try {
      setComparativeLoading(true);
      const data = await getComparativeData(selectedPlots[0], selectedPlots[1], comparativeFilters);
      setComparativeData(data);
    } catch (err) {
      toast.error(t('dashboard.comparative.errorComparison'), err instanceof Error ? err.message : t('dashboard.comparative.errorComparisonMessage'));
    }
  };

  const handleCompare = async () => {
    if (!localPlot1 || !localPlot2) {
      toast.warning(t('dashboard.comparative.warningTitle'), t('dashboard.comparative.warningSelectTwo'));
      return;
    }

    if (localPlot1 === localPlot2) {
      toast.error(t('dashboard.comparative.errorDuplicateTitle'), t('dashboard.comparative.errorDuplicate'));
      return;
    }

    try {
      setComparativeLoading(true);
      setSelectedPlots(localPlot1, localPlot2);
      
      const data = await getComparativeData(localPlot1, localPlot2, comparativeFilters);
      setComparativeData(data);
    } catch (err) {
      toast.error(t('dashboard.comparative.errorComparison'), err instanceof Error ? err.message : t('dashboard.comparative.errorComparisonMessage'));
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
          <h2 className="text-2xl font-bold text-state-idle mb-2">{t('dashboard.comparative.title')}</h2>
          <p className="text-state-disabled">
            {t('dashboard.comparative.subtitle')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="plot1" className="block text-sm font-medium text-state-idle mb-2">
                {t('dashboard.comparative.firstPlot')}
              </label>
              <select
                id="plot1"
                value={localPlot1}
                onChange={(e) => setLocalPlot1(e.target.value)}
                className="w-full px-4 py-3 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={isLoadingComparative}
              >
                <option value="">{t('dashboard.comparative.selectPlot')}</option>
                {plots.map(plot => (
                  <option key={plot.id.toString()} value={plot.id.toString()}>
                    {plot.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="plot2" className="block text-sm font-medium text-state-idle mb-2">
                {t('dashboard.comparative.secondPlot')}
              </label>
              <select
                id="plot2"
                value={localPlot2}
                onChange={(e) => setLocalPlot2(e.target.value)}
                className="w-full px-4 py-3 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                disabled={isLoadingComparative}
              >
                <option value="">{t('dashboard.comparative.selectPlot')}</option>
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
                {t('common.loading')}
              </>
            ) : (
              <>
                <i className="fas fa-balance-scale"></i>
                {t('dashboard.comparative.compareButton')}
              </>
            )}
          </button>
        </div>

        {plots.length === 0 && (
          <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-state-disabled text-sm">
              {t('plots.empty.subtitle')}
            </p>
          </div>
        )}

        {plots.length === 1 && (
          <div className="mt-6 text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-state-disabled text-sm">
              {t('dashboard.comparative.warningSelectTwo')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
