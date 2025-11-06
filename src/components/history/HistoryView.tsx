import { useTranslation } from 'react-i18next';
import HistoryFilters from './HistoryFilters';
import HistoryGrid from './HistoryGrid';
import type { PlotSummary } from '@/types';

interface HistoryViewProps {
  plots: PlotSummary[];
}

export default function HistoryView({ plots }: HistoryViewProps) {
  const { t } = useTranslation();

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
        <HistoryFilters plots={plots} />
        <HistoryGrid />
      </div>
    </div>
  );
}
