import { useStore } from '@nanostores/react';
import { useTranslation } from 'react-i18next';
import { homeStore } from '@/stores';
import StatsCard from './StatsCard';
import DiagnosticCard from './DiagnosticCard';
import SummaryChart from './SummaryChart';

export default function HomeDashboard() {
  const { t } = useTranslation();
  const { stats, recentDiagnostics, isLoading } = useStore(homeStore);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-state-disabled">{t('home.loadingData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title={t('home.stats.weeklyDiagnostics')}
          value={stats.weekStats.currentWeek}
          change={stats.weekStats.percentageChange}
          icon="fa-chart-line"
        />
        <StatsCard
          title={t('home.stats.healthyLeaves')}
          value={`${stats.generalStats.healthyPercentage}%`}
          change={stats.generalStats.percentageChange}
          icon="fa-leaf"
          iconColor="text-tag-healthy"
        />
        <StatsCard
          title={t('home.stats.averageSeverity')}
          value={stats.severityAverage.value.toFixed(1)}
          change={stats.severityAverage.change}
          icon="fa-exclamation-triangle"
          iconColor="text-tag-mid"
        />
        <StatsCard
          title={t('home.stats.totalDiagnostics')}
          value={
            stats.summary.healthy +
            stats.summary.low +
            stats.summary.moderate +
            stats.summary.severe
          }
          icon="fa-clipboard-check"
        />
      </div>

      {/* Recent Diagnostics and Summary Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-state-idle">
              {t('home.recentDiagnostics.title')}
            </h2>
            <a
              href="/history"
              className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-2"
            >
              {t('home.recentDiagnostics.viewAll')}
              <i className="fas fa-arrow-right text-xs"></i>
            </a>
          </div>

          {recentDiagnostics.length > 0 ? (
            <div className="space-y-3">
              {recentDiagnostics.map((diagnostic) => (
                <DiagnosticCard key={diagnostic.id.toString()} diagnostic={diagnostic} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-outline p-8 text-center">
              <i className="fas fa-inbox text-4xl text-state-disabled mb-3"></i>
              <p className="text-state-disabled">{t('home.recentDiagnostics.empty')}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <SummaryChart summary={stats.summary} />
        </div>
      </div>
    </div>
  );
}
