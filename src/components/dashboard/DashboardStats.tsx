import type { DashboardStats } from '@/types';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export default function DashboardStatsComponent({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-state-disabled mb-1">Diagnósticos totales</p>
            <p className="text-3xl sm:text-4xl font-bold text-state-idle">{stats.summary.total}</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-chart-line text-primary text-lg"></i>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${stats.weekStats.percentageChange >= 0 ? 'text-tag-healthy' : 'text-error'}`}>
          <i className={`fas fa-arrow-${stats.weekStats.percentageChange >= 0 ? 'up' : 'down'}`}></i>
          <span className="font-medium">{Math.abs(stats.weekStats.percentageChange)}%</span>
          <span className="text-state-disabled ml-1">vs semana anterior</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-state-disabled mb-1">Diagnósticos sin rancha</p>
            <p className="text-3xl sm:text-4xl font-bold text-state-idle">
              {stats.generalStats.healthyPercentage.toFixed(0)}%
            </p>
          </div>
          <div className="w-10 h-10 bg-tag-healthy/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-check-circle text-tag-healthy text-lg"></i>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${stats.generalStats.percentageChange >= 0 ? 'text-tag-healthy' : 'text-error'}`}>
          <i className={`fas fa-arrow-${stats.generalStats.percentageChange >= 0 ? 'up' : 'down'}`}></i>
          <span className="font-medium">{Math.abs(stats.generalStats.percentageChange)}%</span>
          <span className="text-state-disabled ml-1">vs mes anterior</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-state-disabled mb-1">Severidad promedio</p>
            <p className="text-3xl sm:text-4xl font-bold text-state-idle">
              {stats.severityAverage.value.toFixed(2)} / 3
            </p>
          </div>
          <div className="w-10 h-10 bg-tag-mid/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-tag-mid text-lg"></i>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${stats.severityAverage.change <= 0 ? 'text-tag-healthy' : 'text-error'}`}>
          <i className={`fas fa-arrow-${stats.severityAverage.change <= 0 ? 'down' : 'up'}`}></i>
          <span className="font-medium">{Math.abs(stats.severityAverage.change)}</span>
          <span className="text-state-disabled ml-1">vs mes anterior</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-state-disabled mb-1">Parcelas</p>
            <p className="text-3xl sm:text-4xl font-bold text-state-idle">{stats.totalPlots}</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-layer-group text-primary text-lg"></i>
          </div>
        </div>
        <p className="text-sm text-state-disabled">Total de parcelas registradas</p>
      </div>
    </div>
  );
}
