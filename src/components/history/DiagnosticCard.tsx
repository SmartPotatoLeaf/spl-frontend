import type { Diagnostic } from '@/types';

interface DiagnosticCardProps {
  diagnostic: Diagnostic;
}

export default function DiagnosticCard({ diagnostic }: DiagnosticCardProps) {
  const formatDate = (date: Date): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const title = diagnostic.statusLabel === 'Sin rancha' ? 'Hoja sana' : 'Hoja infectada';

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-tag-healthy text-white';
      case 'low': return 'bg-tag-low text-white';
      case 'moderate': return 'bg-tag-mid text-white';
      case 'severe': return 'bg-tag-severe text-white';
      default: return 'bg-state-disabled text-white';
    }
  };

  const hasValidImage = diagnostic.imageUrl && diagnostic.imageUrl !== '/placeholder.jpg';

  return (
    <div className="bg-white rounded-lg border border-outline overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100 relative">
        {hasValidImage ? (
          <img
            src={diagnostic.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
            <svg
              className="w-24 h-24 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17 8C17 10.76 14.76 13 12 13C9.24 13 7 10.76 7 8C7 5.24 9.24 3 12 3C14.76 3 17 5.24 17 8ZM12 11C13.66 11 15 9.66 15 8C15 6.34 13.66 5 12 5C10.34 5 9 6.34 9 8C9 9.66 10.34 11 12 11ZM12 14C8.13 14 5 17.13 5 21H19C19 17.13 15.87 14 12 14ZM12 16C14.76 16 17 18.24 17 21H7C7 18.24 9.24 16 12 16Z" />
              <path d="M20 2L22 4L20 6L18 4L20 2Z" opacity="0.5" />
              <path d="M4 18L2 20L4 22L6 20L4 18Z" opacity="0.5" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-state-idle mb-1">{title}</h3>
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getBadgeColor(diagnostic.status)}`}>
            {diagnostic.statusLabel}
          </span>
        </div>

        {diagnostic.hasLocation && diagnostic.location && (
          <div className="flex items-center gap-2 text-xs text-state-disabled">
            <i className="fas fa-map-marker-alt"></i>
            <span>{diagnostic.location}</span>
          </div>
        )}

        <div className="pt-3 border-t border-outline space-y-2">
          <p className="text-xs text-state-disabled">
            {formatDate(diagnostic.predictedAt)}
          </p>
          <a
            href={`/diagnostico/${diagnostic.predictionId}`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
          >
            Ver detalles
            <i className="fas fa-arrow-right text-xs"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
