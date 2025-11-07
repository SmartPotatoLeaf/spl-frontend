import { Line, Doughnut } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useStore } from '@nanostores/react';
import type { ComparativeData } from '@/types';
import { dashboardStore, setComparativeData, setSelectedPlots, setComparativeFilters } from '@/stores';

interface DashboardComparativeViewProps {
  data: ComparativeData;
}

export default function DashboardComparativeView({ data }: DashboardComparativeViewProps) {
  const { t } = useTranslation();
  const { comparativeFilters } = useStore(dashboardStore);
  const { plot1, plot2 } = data;

  const handleReset = () => {
    setSelectedPlots(null, null);
    setComparativeData(null);
  };

  const handleDateChange = (key: 'dateFrom' | 'dateTo', value: string) => {
    setComparativeFilters({ [key]: value ? new Date(value) : undefined });
  };

  const handleSelectChange = (key: 'severity', value: string) => {
    setComparativeFilters({ [key]: value as any });
  };

  const handleResetFilters = () => {
    setComparativeFilters({ 
      dateFrom: undefined, 
      dateTo: undefined, 
      severity: 'all'
    });
  };

  const createTrendChartData = (plotData: typeof plot1) => ({
    labels: plotData.trendData.map(d => d.month),
    datasets: [
      {
        label: t('dashboard.categories.healthy'),
        data: plotData.trendData.map(d => d.healthy),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('dashboard.categories.low'),
        data: plotData.trendData.map(d => d.low),
        borderColor: '#F4B400',
        backgroundColor: 'rgba(244, 180, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('dashboard.categories.moderate'),
        data: plotData.trendData.map(d => d.moderate),
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('dashboard.categories.severe'),
        data: plotData.trendData.map(d => d.severe),
        borderColor: '#D32F2F',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  const createDistributionChartData = (summary: typeof plot1.summary) => ({
    labels: [
      t('dashboard.categories.healthy'),
      t('dashboard.categories.low'),
      t('dashboard.categories.moderate'),
      t('dashboard.categories.severe')
    ],
    datasets: [
      {
        data: [summary.healthy, summary.low, summary.moderate, summary.severe],
        backgroundColor: ['#4CAF50', '#A4C400', '#F4B400', '#D32F2F'],
        borderWidth: 0,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 10,
          font: { size: 10 },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-state-idle">{t('dashboard.comparative.comparisonTitle')}</h2>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i>
          {t('dashboard.comparative.selectOthers')}
        </button>
      </div>

      {/* Filtros comparativos */}
      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-state-idle">
            <i className="fas fa-filter"></i>
            <span className="font-medium">{t('dashboard.filters.title')}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="comp-filter-date-from" className="text-sm text-state-disabled whitespace-nowrap">
                <i className="fas fa-calendar mr-1"></i>
                {t('dashboard.filters.dateFrom')}
              </label>
              <input
                type="date"
                id="comp-filter-date-from"
                className="px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
                value={comparativeFilters.dateFrom ? comparativeFilters.dateFrom.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="comp-filter-date-to" className="text-sm text-state-disabled whitespace-nowrap">
                {t('dashboard.filters.dateTo')}
              </label>
              <input
                type="date"
                id="comp-filter-date-to"
                className="px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
                value={comparativeFilters.dateTo ? comparativeFilters.dateTo.toISOString().split('T')[0] : ''}
                onChange={(e) => handleDateChange('dateTo', e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="comp-filter-severity" className="text-sm text-state-disabled">
                {t('dashboard.filters.severity')}
              </label>
              <select
                id="comp-filter-severity"
                className="px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
                value={comparativeFilters.severity || 'all'}
                onChange={(e) => handleSelectChange('severity', e.target.value)}
              >
                <option value="all">{t('dashboard.filters.allSeverities')}</option>
                <option value="healthy">{t('dashboard.categories.healthy')}</option>
                <option value="low">{t('dashboard.categories.low')}</option>
                <option value="moderate">{t('dashboard.categories.moderate')}</option>
                <option value="severe">{t('dashboard.categories.severe')}</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors whitespace-nowrap"
            >
              <i className="fas fa-redo mr-2"></i>
              {t('dashboard.filters.resetFilters')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-outline p-6">
          <h3 className="text-lg font-semibold text-state-idle mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            {plot1.plotName}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-state-disabled mb-1">{t('dashboard.comparative.totalDiagnostics')}</p>
              <p className="text-2xl font-bold text-state-idle">{plot1.stats.summary.total}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-state-disabled mb-1">{t('dashboard.comparative.healthyPercentage')}</p>
              <p className="text-2xl font-bold text-tag-healthy">
                {plot1.stats.generalStats.healthyPercentage.toFixed(0)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-state-disabled mb-1">{t('dashboard.comparative.averageSeverity')}</p>
              <p className="text-2xl font-bold text-state-idle">
                {plot1.stats.severityAverage.value.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-state-disabled mb-1">{t('dashboard.comparative.infected')}</p>
              <p className="text-2xl font-bold text-error">
                {plot1.summary.low + plot1.summary.moderate + plot1.summary.severe}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-state-idle mb-3">{t('dashboard.comparative.trend')}</h4>
            <div className="h-[200px]">
              <Line data={createTrendChartData(plot1)} options={chartOptions} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-state-idle mb-3">{t('dashboard.comparative.distribution')}</h4>
            <div className="flex items-center gap-4">
              <div className="w-[120px] h-[120px] relative">
                <Doughnut data={createDistributionChartData(plot1.summary)} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-state-disabled">{t('dashboard.charts.total')}</span>
                  <span className="text-lg font-bold text-state-idle">{plot1.summary.total}</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tag-healthy"></div>
                    <span className="text-state-idle">{t('dashboard.categories.healthy')}</span>
                  </div>
                  <span className="font-medium">{plot1.summary.healthy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tag-low"></div>
                    <span className="text-state-idle">{t('dashboard.categories.low')}</span>
                  </div>
                  <span className="font-medium">{plot1.summary.low}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tag-mid"></div>
                    <span className="text-state-idle">{t('dashboard.categories.moderate')}</span>
                  </div>
                  <span className="font-medium">{plot1.summary.moderate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tag-severe"></div>
                    <span className="text-state-idle">{t('dashboard.categories.severe')}</span>
                  </div>
                  <span className="font-medium">{plot1.summary.severe}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-outline p-6">
          <h3 className="text-lg font-semibold text-state-idle mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tag-mid"></div>
            {plot2.plotName}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-state-disabled mb-1">{t('dashboard.comparative.totalDiagnostics')}</p>
              <p className="text-2xl font-bold text-state-idle">{plot2.stats.summary.total}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-state-disabled mb-1">{t('dashboard.comparative.healthyPercentage')}</p>
              <p className="text-2xl font-bold text-tag-healthy">
                {plot2.stats.generalStats.healthyPercentage.toFixed(0)}%
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-state-disabled mb-1">{t('dashboard.comparative.averageSeverity')}</p>
              <p className="text-2xl font-bold text-state-idle">
                {plot2.stats.severityAverage.value.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-state-disabled mb-1">{t('dashboard.comparative.infected')}</p>
              <p className="text-2xl font-bold text-error">
                {plot2.summary.low + plot2.summary.moderate + plot2.summary.severe}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-state-idle mb-3">{t('dashboard.comparative.trend')}</h4>
            <div className="h-[200px]">
              <Line data={createTrendChartData(plot2)} options={chartOptions} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-state-idle mb-3">{t('dashboard.comparative.distribution')}</h4>
            <div className="flex items-center gap-4">
              <div className="w-[120px] h-[120px] relative">
                <Doughnut data={createDistributionChartData(plot2.summary)} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-state-disabled">{t('dashboard.charts.total')}</span>
                  <span className="text-lg font-bold text-state-idle">{plot2.summary.total}</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tag-healthy"></div>
                    <span className="text-state-idle">{t('dashboard.categories.healthy')}</span>
                  </div>
                  <span className="font-medium">{plot2.summary.healthy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tag-low"></div>
                    <span className="text-state-idle">{t('dashboard.categories.low')}</span>
                  </div>
                  <span className="font-medium">{plot2.summary.low}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tag-mid"></div>
                    <span className="text-state-idle">{t('dashboard.categories.moderate')}</span>
                  </div>
                  <span className="font-medium">{plot2.summary.moderate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tag-severe"></div>
                    <span className="text-state-idle">{t('dashboard.categories.severe')}</span>
                  </div>
                  <span className="font-medium">{plot2.summary.severe}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
