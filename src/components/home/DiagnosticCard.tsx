import { useTranslation } from 'react-i18next';
import type { Diagnostic } from '@/types';

interface DiagnosticCardProps {
  diagnostic: Diagnostic;
}

export default function DiagnosticCard({ diagnostic }: DiagnosticCardProps) {
  const { t, i18n } = useTranslation();
  
  const statusColors = {
    healthy: 'bg-tag-healthy text-white',
    low: 'bg-tag-low text-state-idle',
    moderate: 'bg-tag-mid text-white',
    severe: 'bg-tag-severe text-white'
  };

  const statusColor = statusColors[diagnostic.status];

  const formatDate = (date: Date): string => {
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthKey = monthKeys[date.getMonth()];
    const monthName = t(`home.months.${monthKey}`);
    return `${date.getDate()} de ${monthName}, ${date.getFullYear()}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-confidence-high';
    if (confidence >= 0.6) return 'text-confidence-mid';
    return 'text-confidence-low';
  };

  const formattedDate = formatDate(diagnostic.predictedAt);

  return (
    <div className="bg-white rounded-lg border border-outline p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gray-200 rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-state-disabled">
            <i className="fas fa-leaf text-2xl sm:text-3xl opacity-20"></i>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-state-idle text-sm sm:text-base mb-2">
            {diagnostic.statusLabel === 'Sin rancha' 
              ? t('home.recentDiagnostics.healthyLeaf') 
              : t('home.recentDiagnostics.infectedLeaf')}
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-state-disabled mb-2">
            <span className="inline-flex items-center gap-1">
              <i className="far fa-calendar"></i>
              {formattedDate}
            </span>
            {diagnostic.hasLocation && diagnostic.location ? (
              <span className="inline-flex items-center gap-1">
                <i className="fas fa-map-marker-alt"></i>
                {diagnostic.location}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 italic">
                <i className="fas fa-map-marker-alt"></i>
                {t('home.recentDiagnostics.noPlotAssigned')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${statusColor}`}>
              {diagnostic.statusLabel}
            </span>
            <span className={`text-xs font-medium ${getConfidenceColor(diagnostic.confidence)}`}>
              {(diagnostic.confidence * 100).toFixed(0)}% {t('home.recentDiagnostics.confidence')}
            </span>
          </div>
        </div>

        <a
          href={`/leaf/${diagnostic.predictionId}`}
          className="text-state-idle text-sm font-normal hover:underline shrink-0 hidden sm:block"
        >
          {t('home.recentDiagnostics.viewDetails')}
        </a>
      </div>

      <a
        href={`/leaf/${diagnostic.predictionId}`}
        className="text-state-idle text-sm font-normal hover:underline mt-3 block sm:hidden"
      >
        {t('home.recentDiagnostics.viewDetails')}
      </a>
    </div>
  );
}
