import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AssignPlotModal from './AssignPlotModal';
import DeleteDiagnosticModal from './DeleteDiagnosticModal';
import IncorrectDiagnosticModal from './IncorrectDiagnosticModal';
import diagnosticsData from '@/data/diagnostics.json';

interface LeafResultProps {
  predictionId: string;
}

export default function LeafResult({ predictionId }: LeafResultProps) {
  const { t } = useTranslation();
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [showAssignPlot, setShowAssignPlot] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);

  useEffect(() => {
    const found = diagnosticsData.find((d) => d.predictionId === predictionId);
    setDiagnostic(found);
  }, [predictionId]);

  if (!diagnostic) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-state-disabled">{t('common.loading')}</p>
      </div>
    );
  }

  const handleExportReport = () => {
    console.log('Exporting report for:', predictionId);
  };

  const getSeverityColor = (status: string) => {
    const colors: Record<string, string> = {
      healthy: 'bg-tag-healthy',
      low: 'bg-tag-low',
      moderate: 'bg-tag-mid',
      severe: 'bg-tag-severe',
    };
    return colors[status] || 'bg-outline';
  };

  const getRecommendations = (status: string) => {
    const recommendations: Record<string, { treatment: string; nextSteps: string }> = {
      healthy: {
        treatment: 'No se requiere tratamiento químico. Mantener prácticas de monitoreo preventivo.',
        nextSteps:
          'Continuar con el monitoreo regular. Revisar cada 7 días. Asegurar buena ventilación y drenaje del cultivo.',
      },
      low: {
        treatment:
          'Aplicar fungicidas preventivos específicos para el tizón tardío. Consulte a un agrónomo para la selección del producto adecuado y la dosis correcta.',
        nextSteps:
          'Incrementar frecuencia de monitoreo a cada 3-5 días. Eliminar hojas afectadas para reducir propagación del inóculo.',
      },
      moderate: {
        treatment:
          'Aplicar fungicidas específicos para el tizón tardío. Consulte a un agrónomo para la selección del producto adecuado y la dosis correcta. Considere opciones como mancozeb o clorotalonil.',
        nextSteps:
          'Aumentar la frecuencia de monitoreo a cada 3-5 días. Eliminar y destruir las hojas y plantas severamente afectadas para reducir la propagación del inóculo.',
      },
      severe: {
        treatment:
          'Aplicar fungicidas sistémicos de alta eficacia inmediatamente. Consulte a un agrónomo para un plan de aplicación intensivo.',
        nextSteps:
          'Monitorear diariamente. Eliminar plantas severamente infectadas. Evaluar posible pérdida de cultivo y planificar replantación.',
      },
    };
    return recommendations[status] || recommendations.healthy;
  };

  const recommendations = getRecommendations(diagnostic.status);
  const hasValidImage = diagnostic.imageUrl && diagnostic.imageUrl !== '/placeholder.jpg';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <a
          href="/history"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t('leaf.backToHistory')}
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-outline overflow-hidden">
            <div className="relative aspect-video bg-outline/20">
              {hasValidImage ? (
                <img
                  src={diagnostic.imageUrl}
                  alt={t('leaf.title')}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
                  <i className="fas fa-leaf text-8xl text-gray-300 opacity-40"></i>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span
                  className={`${getSeverityColor(diagnostic.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {diagnostic.statusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-outline p-6">
            <h2 className="text-xl font-medium text-state-idle mb-4">
              {t('leaf.recommendations.title', { severity: diagnostic.statusLabel.toLowerCase() })}
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-primary mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="font-medium text-state-idle">
                    {t('leaf.recommendations.treatment')}
                  </h3>
                </div>
                <p className="text-state-idle/70 ml-7">{recommendations.treatment}</p>
              </div>
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-primary mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <h3 className="font-medium text-state-idle">
                    {t('leaf.recommendations.nextSteps')}
                  </h3>
                </div>
                <p className="text-state-idle/70 ml-7">{recommendations.nextSteps}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-outline p-6">
            <h2 className="text-lg font-medium text-state-idle mb-4">
              {t('leaf.actions.title')}
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowAssignPlot(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                {t('leaf.actions.assignPlot')}
              </button>

              <button
                onClick={handleExportReport}
                className="w-full flex items-center gap-3 px-4 py-3 bg-outline/20 hover:bg-outline/30 text-state-idle rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {t('leaf.actions.exportReport')}
              </button>

              <button
                onClick={() => setShowIncorrect(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-outline/20 hover:bg-outline/30 text-state-idle rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {t('leaf.actions.incorrectDiagnosis')}
              </button>

              <button
                onClick={() => setShowDelete(true)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-error/5 hover:bg-error/10 text-error rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                {t('leaf.actions.deleteDiagnosis')}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-outline p-6">
            <h2 className="text-lg font-medium text-state-idle mb-4">
              {t('leaf.details.title')}
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-state-disabled mb-1">
                  {t('leaf.details.confidenceLevel')}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-outline/30 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${diagnostic.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-state-idle">
                    {Math.round(diagnostic.confidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="border-t border-outline pt-3">
                <p className="text-sm text-state-disabled mb-1">
                  {t('leaf.details.estimatedSeverity')}
                </p>
                <p className="text-state-idle font-medium">{diagnostic.statusLabel}</p>
              </div>

              {diagnostic.status !== 'healthy' && (
                <div className="border-t border-outline pt-3">
                  <p className="text-sm text-state-disabled mb-1">
                    {t('leaf.details.infectedArea')}
                  </p>
                  <p className="text-state-idle font-medium">
                    {diagnostic.status === 'low'
                      ? '< 10%'
                      : diagnostic.status === 'moderate'
                        ? '10-30%'
                        : '> 30%'}
                  </p>
                </div>
              )}

              <div className="border-t border-outline pt-3">
                <p className="text-sm text-state-disabled mb-1">
                  {t('leaf.details.analysisTime')}
                </p>
                <p className="text-state-idle font-medium">
                  {new Date(diagnostic.predictedAt).toLocaleString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="border-t border-outline pt-3">
                <p className="text-sm text-state-disabled mb-1">{t('leaf.details.plot')}</p>
                <p className="text-state-idle font-medium">
                  {diagnostic.location || t('leaf.details.noPlot')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AssignPlotModal
        isOpen={showAssignPlot}
        onClose={() => setShowAssignPlot(false)}
        predictionId={predictionId}
        currentPlot={diagnostic.location}
      />

      <DeleteDiagnosticModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        predictionId={predictionId}
      />

      <IncorrectDiagnosticModal
        isOpen={showIncorrect}
        onClose={() => setShowIncorrect(false)}
        predictionId={predictionId}
        currentLabel={diagnostic.statusLabel}
      />
    </div>
  );
}
