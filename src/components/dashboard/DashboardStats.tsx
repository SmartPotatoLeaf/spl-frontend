import { useTranslation } from 'react-i18next';
import type { DashboardStats } from '@/types';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-state-disabled mb-1">{t('dashboard.stats.totalDiagnostics')}</p>
            <p className="text-3xl sm:text-4xl font-bold text-state-idle">{stats.summary.total}</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-primary text-lg"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-state-disabled mb-1">{t('dashboard.stats.healthyDiagnostics')}</p>
            <p className="text-3xl sm:text-4xl font-bold text-state-idle">
              {stats.generalStats.healthyPercentage}%
            </p>
          </div>
          <div className="w-10 h-10 bg-tag-healthy/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-check-circle text-tag-healthy text-lg"></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-state-disabled mb-1">{t('dashboard.stats.averageSeverity')}</p>
            <p className="text-3xl sm:text-4xl font-bold text-state-idle">
              {stats.severityAverage.value.toFixed(2)} / 3
            </p>
          </div>
          <div className="w-10 h-10 bg-tag-mid/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-tag-mid text-lg"></i>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-state-disabled mb-1">{t('dashboard.stats.totalPlots')}</p>
            <p className="text-3xl sm:text-4xl font-bold text-state-idle">{stats.totalPlots}</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-layer-group text-primary text-lg"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
