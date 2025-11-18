import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TransformComponent, TransformWrapper} from 'react-zoom-pan-pinch';
import AssignPlotModal from './AssignPlotModal';
import DeleteDiagnosticModal from './DeleteDiagnosticModal';
import IncorrectDiagnosticModal from './IncorrectDiagnosticModal';
import {getDiagnostic} from "@/services/diagnosticsService.ts";
import Loader from "@/components/shared/Loader";
import type {DiagnosisSummaryFilters} from "@/types";
import {getDashboardFilters} from "@/services/dashboardService.ts";
import {getRecommendationsForSeverity} from "@/services/recommendationsService.ts";
import type {Recommendation} from "@/types/recommendations.ts";
import {BLOB_URL} from "astro:env/client";

interface LeafResultProps {
  predictionId: string;
}

interface DiagnosticRecommendationProps {
  type: "preventive" | "monitoring" | "cultural" | "chemical_control" | "corrective",
  recommendations: Recommendation[]
}

export function DiagnosticRecommendation({type, recommendations}: DiagnosticRecommendationProps) {
  const {t} = useTranslation();

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-start gap-2 mb-3">
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
          {t(`leaf.recommendations.types.${type}`)}
        </h3>
      </div>
      <ul className="ml-7 space-y-2 list-disc list-inside text-state-idle/70">
        {recommendations.map(it => (
          <li key={it.id} className="leading-relaxed">
            {it.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

export const recommendationTypes = ["preventive", "monitoring", "cultural", "chemical_control", "corrective"] as const;

export default function LeafResult({predictionId}: LeafResultProps) {
  const {t} = useTranslation();
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [showAssignPlot, setShowAssignPlot] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [showMasks, setShowMasks] = useState(false);
  const [filters, setFilters] = useState<DiagnosisSummaryFilters>({
      labels: [],
      plots: [],
    }),
    [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await getDashboardFilters();
        setFilters(data);
      } catch (e) {
      }
    }

    loadFilters()
  }, [predictionId]);

  useEffect(() => {
    async function loadRecommendations() {
      if (!diagnostic)
        return;

      try {
        const data = await getRecommendationsForSeverity(diagnostic.affectedArea)
        setRecommendations(data)
      } catch (e) {
        setRecommendations([])
      }
    }

    loadRecommendations()
  }, [diagnostic]);

  useEffect(() => {
    async function loadDiagnostic() {
      try {
        const data = await getDiagnostic((+predictionId));
        let name = data.label.name,
          date = data.predicted_at;
        name = name === "mild" ? "moderate" : name;

        if (!date.endsWith("Z"))
          date += "Z";

        let feedbackName = data.feedback?.correct_label.id ?? "";

        const leafMask = data.marks.find(el => el.type.name === "leaf_mask"),
          lesionMask = data.marks.find(el => el.type.name === "lt_blg_lesion_mask");

        setDiagnostic(
          {
            status: name,
            statusLabel: t(`home.summaryChart.categories.${name}`),
            plotId: data.plot_id,
            confidence: data.presence_confidence,
            affectedArea: data.severity,
            predictedAt: date,
            feedback: {
              id: data.feedback?.id,
              correctLabel: feedbackName,
              comment: data.feedback?.comment ?? "",
            },
            imageUrl: `${BLOB_URL}${data.image.filepath}`,
            leafUrl: leafMask ? `${BLOB_URL}${leafMask.data.filepath}` : undefined,
            lesionUrl: lesionMask ? `${BLOB_URL}${lesionMask.data.filepath}` : undefined,
          }
        )
      } catch (e) {
        window.location.href = '/history';
      }
    }

    loadDiagnostic()
  }, [predictionId]);

  if (!diagnostic) {
    return <Loader text={t('common.loading')}/>;
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
          <div className="bg-white rounded-xl shadow-sm border border-outline overflow-hidden p-2">
            <div className="top-4 left-4">
                <span
                  className={`${getSeverityColor(diagnostic.status)} text-white px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {diagnostic.statusLabel}
                </span>
            </div>
            <div className="relative aspect-video bg-outline/20">
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit
              >
                {({zoomIn, zoomOut, resetTransform}) => (
                  <>
                    <div className="absolute top-4 left-4 z-10">
                      <button
                        onClick={() => setShowMasks(!showMasks)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-md ${
                          showMasks
                            ? 'bg-primary text-white'
                            : 'bg-white text-state-idle hover:bg-gray-50'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showMasks ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          )}
                        </svg>
                      </button>
                    </div>

                    <TransformComponent
                      wrapperClass="!w-full !h-full"
                      contentClass="!w-full !h-full"

                    >
                      {hasValidImage ? (
                        <div className="relative w-full h-full">
                          <img
                            src={diagnostic.imageUrl}
                            alt={t('leaf.title')}
                            className="w-full h-full object-contain"
                          />
                          {showMasks && (
                            <>
                              {diagnostic.leafUrl && (
                                <img
                                  src={diagnostic.leafUrl}
                                  alt="Leaf mask"
                                  className="absolute inset-0 w-full h-full object-contain opacity-50 mix-blend-multiply"
                                  style={{pointerEvents: 'none'}}
                                />
                              )}
                              {diagnostic.lesionUrl && (
                                <img
                                  src={diagnostic.lesionUrl}
                                  alt="Lesion mask"
                                  className="absolute inset-0 w-full h-full object-contain opacity-60 mix-blend-multiply"
                                  style={{pointerEvents: 'none'}}
                                />
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
                          <i className="fas fa-leaf text-8xl text-gray-300 opacity-40"></i>
                        </div>
                      )}
                    </TransformComponent>

                    <div className="absolute right-4 bottom-4 z-10 flex gap-2">
                      <button
                        onClick={() => zoomIn()}
                        className="p-2 bg-white hover:bg-gray-50 text-state-idle rounded-lg shadow-md transition-colors"
                        title={t('leaf.zoom.zoomIn')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => zoomOut()}
                        className="p-2 bg-white hover:bg-gray-50 text-state-idle rounded-lg shadow-md transition-colors"
                        title={t('leaf.zoom.zoomOut')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => resetTransform()}
                        className="p-2 bg-white hover:bg-gray-50 text-state-idle rounded-lg shadow-md transition-colors"
                        title={t('leaf.zoom.reset')}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </TransformWrapper>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-outline p-6">
            <h2 className="text-xl font-medium text-state-idle mb-4">
              {t('leaf.recommendations.title', {severity: diagnostic.statusLabel.toLowerCase()})}
            </h2>
            <div className="space-y-4">
              {!recommendations && <Loader text={t("common.loading")}/>}
              {
                recommendations && recommendationTypes.map(type => (
                  <DiagnosticRecommendation type={type}
                                            recommendations={recommendations.filter(it => it.type.name === type)}/>
                ))
              }
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
                      style={{width: `${diagnostic.confidence * 100}%`}}
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
                    {diagnostic.affectedArea.toFixed(2)} %
                  </p>
                </div>
              )}

              <div className="border-t border-outline pt-3">
                <p className="text-sm text-state-disabled mb-1">
                  {t('leaf.details.analysisTime')}
                </p>
                <p className="text-state-idle font-medium">
                  {new Date(diagnostic.predictedAt).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
        currentPlot={diagnostic.plotId}
        plots={filters.plots}
        onSubmit={(plot) => {
          setDiagnostic({...diagnostic, plotId: plot?.id})
        }}
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
        currentLabel={diagnostic.feedback.correctLabel}
        comment={diagnostic.feedback.comment}
        feedbackId={diagnostic.feedback.id}
        onSubmit={(data) => setDiagnostic({
          ...diagnostic,
          feedback: {
            id: data.id,
            correctLabel: data.correct_label.id,
            commend: data.comment,
          }
        })}
        severityOptions={
          filters.labels.map(el => ({
            value: el.id.toString(),
            labelKey: `leaf.details.severity.${el.name === "mild" ? "moderate" : el.name}`
          }))
        }
      />
    </div>
  );
}
