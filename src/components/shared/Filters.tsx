import {useTranslation} from "react-i18next";
import React from "react";

export interface FiltersOptions {
  dateFrom: string,
  dateTo: string,
  severity: string,
  plot: string,

  setDateFrom(date: string): void,

  setDateTo(date: string): void,

  setSeverity(severity: string): void,

  setPlot(plot: string): void,

  applyFilters(ev: React.FormEvent): void,

  resetFilters(): void,

  plots: { id: number, name: string }[],
}

export interface FiltersProps {
  options: FiltersOptions;
}

export default function Filters({options}: FiltersProps) {
  const {t} = useTranslation(),
    {dateFrom,
      plot,
      setPlot,
      dateTo,
      severity,
      setDateFrom,
      setDateTo,
      setSeverity,
      applyFilters,
      resetFilters,
      plots,} = options;
  return (
    <form onSubmit={applyFilters} className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="dateFrom" className="text-xs text-state-disabled font-medium">
            {t('history.filters.dateFrom')}
          </label>
          <div className="relative">
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-outline rounded-lg text-sm text-state-idle focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <i
              className="far fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-state-disabled pointer-events-none"></i>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dateTo" className="text-xs text-state-disabled font-medium">
            {t('history.filters.dateTo')}
          </label>
          <div className="relative">
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-outline rounded-lg text-sm text-state-idle focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <i
              className="far fa-calendar absolute right-3 top-1/2 -translate-y-1/2 text-state-disabled pointer-events-none"></i>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="severity" className="text-xs text-state-disabled font-medium">
            {t('history.filters.severity')}
          </label>
          <div className="relative">
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full px-3 py-2 border border-outline rounded-lg text-sm text-state-idle focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="all">{t('history.severityOptions.all')}</option>
              <option value="healthy">{t('history.severityOptions.healthy')}</option>
              <option value="low">{t('history.severityOptions.low')}</option>
              <option value="moderate">{t('history.severityOptions.moderate')}</option>
              <option value="severe">{t('history.severityOptions.severe')}</option>
            </select>
            <i
              className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-state-disabled pointer-events-none text-xs"></i>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="plot" className="text-xs text-state-disabled font-medium">
            {t('history.filters.plot')}
          </label>
          <div className="relative">
            <select
              id="plot"
              value={plot}
              onChange={(e) => setPlot(e.target.value)}
              className="w-full px-3 py-2 border border-outline rounded-lg text-sm text-state-idle focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="all">{t('history.filters.allPlots')}</option>
              {plots.map((p) => (
                <option key={p.id.toString()} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <i
              className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-state-disabled pointer-events-none text-xs"></i>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors"
        >
          <i className="fas fa-filter text-xs"></i>
          {t('history.filters.applyFilters')}
        </button>

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-2 text-state-idle text-sm hover:underline"
        >
          <i className="fas fa-redo text-xs"></i>
          {t('history.filters.resetFilters')}
        </button>
      </div>
    </form>
  )
}
