import {useTranslation} from 'react-i18next';
import HistoryFilters from './HistoryFilters';
import HistoryGrid from './HistoryGrid';
import type {Diagnostic, Plot, PlotSummary} from '@/types';
import {useStore} from "@nanostores/react";
import {historyStore, setDiagnostics} from "@/stores";
import {useEffect, useState} from "react";
import Loader from "@/components/shared/Loader";
import {filterDiagnostics} from "@/services/diagnosticsService.ts";
import {getDashboardFilters} from "@/services/dashboardService.ts";
import {setPlots, setTotal} from "@/stores/historyStore.ts";
import {BLOB_URL} from "astro:env/client";

interface HistoryViewProps {
}

export default function HistoryView() {
  const {t} = useTranslation();

  const {filters, itemsPerPage} = useStore(historyStore),
    [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeFilters() {
      try {
        const filters = await getDashboardFilters();

        setPlots(filters.plots.map((plot: Plot) => ({id: plot.id, name: plot.name})));
      } catch (e) {

      }
    }

    initializeFilters()
  }, []);

  function toISODate(date: string) {
    if (!date)
      return undefined

    return new Date(date).toISOString() || undefined;
  }

  useEffect(() => {
    async function loadDiagnostics() {
      try {
        setIsLoading(true);
        console.log(filters);
        const data = await filterDiagnostics({
          min_date: toISODate(filters.dateFrom),
          max_date: toISODate(filters.dateTo),
          labels: filters.severity !== "all" ? [
            filters.severity === "moderate" ? "mild" : filters.severity
          ] : undefined,
          page: filters.page,
          limit: itemsPerPage,
          item_fields: "$min",
          plot_ids: filters.plot !== "all" ? [
            (+filters.plot)
          ] : undefined
        })

        setTotal(data.total)

        const diagnostics: Diagnostic[] = data.items.map((d) => {
          const labelName = d.label.name === "mild" ? "moderate" : d.label.name;
          return {
            id: d.id,
            severity: d.severity,
            imageUrl: `${BLOB_URL}${d.image.filepath}`,
            status: labelName,
            predictedAt: new Date(d.predicted_at),
            presenceConfidence: d.presence_confidence,
            absenceConfidence: d.absence_confidence,
            hasLocation: false,
            statusLabel: t(`dashboard.categories.${labelName}`)
          }
        });
        setDiagnostics(diagnostics);
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false);
      }
    }

    loadDiagnostics();
  }, [filters])

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-state-idle">
          {t('history.title')}
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 bg-white text-state-idle border border-outline px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <i className="far fa-file-pdf"></i>
            {t('history.exportPDF')}
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 bg-white text-state-idle border border-outline px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <i className="far fa-file-excel"></i>
            {t('history.exportCSV')}
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-outline p-4 sm:p-6">
        <HistoryFilters/>
        {
          isLoading && <Loader text={t("common.loading")}/>
        }
        {
          !isLoading && <HistoryGrid/>
        }
      </div>
    </div>
  );
}
