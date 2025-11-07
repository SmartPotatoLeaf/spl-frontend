import { useStore } from '@nanostores/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardStore, setDashboardMode, plotsStore, setPlotsData, setPlotsLoading } from '@/stores';
import { getAllPlots } from '@/services/plotService';
import DashboardNormal from './DashboardNormal';
import DashboardComparative from './DashboardComparative';

export default function DashboardView() {
  const { t } = useTranslation();
  const { mode } = useStore(dashboardStore);
  const { plots } = useStore(plotsStore);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (plots.length === 0) {
      loadPlots();
    }
  }, []);

  const loadPlots = async () => {
    try {
      setPlotsLoading(true);
      const plotsData = await getAllPlots();
      setPlotsData(plotsData);
    } catch (err) {
      console.error('Error loading plots:', err);
    }
  };

  const handleModeChange = (newMode: 'normal' | 'comparative') => {
    if (newMode === mode) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setDashboardMode(newMode);
      setIsTransitioning(false);
    }, 300);
  };

  const handleExportPDF = () => {
    console.log('Exporting dashboard to PDF...');
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-state-idle">
            {t('dashboard.title')}
          </h1>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center justify-center gap-2 bg-white text-state-idle border border-outline px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <i className="far fa-file-pdf"></i>
            {t('history.exportPDF')}
          </button>
        </div>
        
        <div className="relative bg-white rounded-lg border border-outline p-1.5 inline-flex gap-1">
          <div
            className={`
              absolute top-1.5 h-[calc(100%-12px)] bg-primary rounded-md transition-all duration-300 ease-in-out
              ${mode === 'normal' ? 'left-1.5 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'}
            `}
          />
          
          <button
            onClick={() => handleModeChange('normal')}
            disabled={isTransitioning}
            className={`
              relative z-10 px-6 sm:px-8 py-2 rounded-md font-medium transition-colors duration-300
              ${mode === 'normal' 
                ? 'text-white' 
                : 'text-state-idle hover:text-primary'
              }
              disabled:cursor-not-allowed
            `}
          >
            {t('dashboard.modes.normal')}
          </button>
          
          <button
            onClick={() => handleModeChange('comparative')}
            disabled={isTransitioning}
            className={`
              relative z-10 px-6 sm:px-8 py-2 rounded-md font-medium transition-colors duration-300
              ${mode === 'comparative' 
                ? 'text-white' 
                : 'text-state-idle hover:text-primary'
              }
              disabled:cursor-not-allowed
            `}
          >
            {t('dashboard.modes.comparative')}
          </button>
        </div>
      </div>

      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {mode === 'normal' ? <DashboardNormal /> : <DashboardComparative />}
      </div>
    </div>
  );
}
