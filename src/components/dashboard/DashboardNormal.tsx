import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { dashboardStore, setDashboardData, setDashboardLoading, setDashboardError } from '@/stores';
import { getDashboardStats, getDashboardTrendData, getRecentDiagnostics } from '@/services/dashboardService';
import DashboardFilters from './DashboardFilters';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';

export default function DashboardNormal() {
  const { t } = useTranslation();
  const { stats, trendData, filters, isLoading, error } = useStore(dashboardStore);

  useEffect(() => {
    loadDashboardData();
  }, [filters]);

  const loadDashboardData = async () => {
    if (isLoading) return;
    
    try {
      setDashboardLoading(true);
      
      const [statsData, trendsData, diagnostics] = await Promise.all([
        getDashboardStats(filters),
        getDashboardTrendData(filters),
        getRecentDiagnostics(10),
      ]);
      
      setDashboardData(statsData, trendsData, diagnostics);
    } catch (err) {
      setDashboardError(err instanceof Error ? err.message : t('dashboard.errorMessage'));
    }
  };

  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-error mb-4"></i>
        <p className="text-error font-semibold mb-2">{t('dashboard.error')}</p>
        <p className="text-error text-sm mb-4">{error}</p>
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <i className="fas fa-redo"></i>
          {t('dashboard.retry')}
        </button>
      </div>
    );
  }

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-state-disabled">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardFilters />
      
      {stats && (
        <>
          <DashboardStats stats={stats} />
          <DashboardCharts trendData={trendData} summary={stats.summary} />
        </>
      )}
    </div>
  );
}
