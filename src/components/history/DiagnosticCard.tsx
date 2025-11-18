import { useTranslation } from 'react-i18next';
import type { Diagnostic } from '@/types';

interface DiagnosticCardProps {
  diagnostic: Diagnostic;
  loadJsImage?: boolean
}

export default function DiagnosticCard({ diagnostic, loadJsImage }: DiagnosticCardProps) {
  const { t } = useTranslation();

  const formatDate = (date: Date): string => {
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const monthKey = monthKeys[date.getMonth()];
    const monthName = t(`history.months.${monthKey}`);
    return `${date.getDate()} de ${monthName}, ${date.getFullYear()}`;
  };

  const title = diagnostic.statusLabel === 'Sin rancha'
    ? t('history.card.healthyLeaf')
    : t('history.card.infectedLeaf');

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-tag-healthy text-white';
      case 'low': return 'bg-tag-low text-white';
      case 'moderate': return 'bg-tag-mid text-white';
      case 'severe': return 'bg-tag-severe text-white';
      default: return 'bg-state-disabled text-white';
    }
  };

  const hasValidImage = diagnostic.imageUrl && diagnostic.imageUrl !== '/placeholder.jpg',
    confidence = Math.max(diagnostic.presenceConfidence, diagnostic.absenceConfidence);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-confidence-high';
    if (confidence >= 0.6) return 'text-confidence-mid';
    return 'text-confidence-low';
  };

  return (
    <div className="bg-white rounded-lg border border-outline overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        {hasValidImage ? (
          <img
            src={diagnostic.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
            <i className="fas fa-leaf text-6xl text-gray-300 opacity-40"></i>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-state-idle mb-1">{title}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getBadgeColor(diagnostic.status)}`}>
              {diagnostic.statusLabel}
            </span>
            <span className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
              {(confidence * 100).toFixed(0)}% {t('history.card.confidence')}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {diagnostic.hasLocation && diagnostic.location ? (
            <div className="flex items-center gap-2 text-xs text-state-disabled">
              <i className="fas fa-map-marker-alt"></i>
              <span>{diagnostic.location}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-state-disabled">
              <i className="fas fa-map-marker-alt"></i>
              <span className="italic">{t('history.card.noPlotAssigned')}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-state-disabled">
            <i className="fas fa-calendar-alt"></i>
            <span>{formatDate(diagnostic.predictedAt)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-outline">
          <a
            href={`/diagnostics/${diagnostic.id}`}
            className="block w-full text-center py-2 rounded-lg bg-gray-50 text-state-idle text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            {t('history.card.viewDetails')}
          </a>
        </div>
      </div>
    </div>
  );
}
