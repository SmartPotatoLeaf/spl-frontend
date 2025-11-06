import { useStore } from '@nanostores/react';
import { dashboardStore, setDashboardFilters, plotsStore } from '@/stores';

export default function DashboardFilters() {
  const { filters } = useStore(dashboardStore);
  const { plots } = useStore(plotsStore);

  const handleFilterChange = (key: string, value: string) => {
    setDashboardFilters({ [key]: value === 'all' ? 'all' : value });
  };

  return (
    <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-state-idle">
          <i className="fas fa-filter"></i>
          <span className="font-medium">Filtros:</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label htmlFor="filter-date-from" className="text-sm text-state-disabled whitespace-nowrap">
              <i className="fas fa-calendar mr-1"></i>
              De
            </label>
            <input
              type="date"
              id="filter-date-from"
              className="px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
              value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-date-to" className="text-sm text-state-disabled whitespace-nowrap">
              A
            </label>
            <input
              type="date"
              id="filter-date-to"
              className="px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
              value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-severity" className="text-sm text-state-disabled">
              Severidad
            </label>
            <select
              id="filter-severity"
              className="px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
              value={filters.severity || 'all'}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="healthy">Sin rancha</option>
              <option value="low">Leve</option>
              <option value="moderate">Moderada</option>
              <option value="severe">Severa</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter-plot" className="text-sm text-state-disabled">
              Parcela
            </label>
            <select
              id="filter-plot"
              className="px-3 py-2 border border-outline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
              value={filters.plotId || 'all'}
              onChange={(e) => handleFilterChange('plotId', e.target.value)}
            >
              <option value="all">Todas</option>
              {plots.map(plot => (
                <option key={plot.id.toString()} value={plot.id.toString()}>
                  {plot.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setDashboardFilters({ 
                dateFrom: undefined, 
                dateTo: undefined, 
                severity: 'all', 
                plotId: 'all' 
              });
            }}
            className="px-4 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors whitespace-nowrap"
          >
            <i className="fas fa-redo mr-2"></i>
            Restablecer filtros
          </button>
        </div>
      </div>
    </div>
  );
}
