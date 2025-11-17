import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TrendChart, DistributionChart} from './PlotCharts';
import ChartModal from '@/components/shared/ChartModal';
import type {PlotDetail, PlotDetailed} from '@/types';
import {getDetailedPlot} from '@/services/plotService';
import {getDashboardSummary} from "@/services/dashboardService.ts";
import Loader from "@/components/shared/Loader";

interface PlotDetailViewProps {
  plotId: string | number | null | undefined;
}

type ChartType = 'trend' | 'distribution' | null;

export default function PlotDetailView({plotId}: PlotDetailViewProps) {
  const {t} = useTranslation();
  const [plot, setPlot] = useState<PlotDetailed | null>(null),
    [chartData, setChartData] = useState({trend: null, distribution: null});
  const [isLoading, setIsLoading] = useState(true),
    [isSummaryLoading, setIsSummaryLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [expandedChart, setExpandedChart] = useState<ChartType>(null);

  useEffect(() => {
    async function loadPlot() {
      try {
        setIsLoading(true);
        const data = await getDetailedPlot(plotId);
        setPlot(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la parcela');
      } finally {
        setIsLoading(false);
      }
    }
    async function loadSummary() {
      try {
        setIsSummaryLoading(true);
        const data = await getDashboardSummary({
          plot_ids: plotId ? [(+plotId)] : [undefined],
        });

        const labelCount: any = {
          healthy: 0,
          low: 0,
          mild: 0,
          severe: 0,
        };

        data.labels_count.forEach(label => {
          labelCount[label.label.name] = label.count;
        })

        const labels = [],
          labelData: any = {
            healthy: {
              data: [],
              "borderColor": "#4CAF50",
              "backgroundColor": "rgba(76, 175, 80, 0.1)",
            },
            low: {
              data: [],
              "borderColor": "#A4C400",
              "backgroundColor": "rgba(164, 196, 0, 0.1)"
            },
            mild: {
              data: [],
              "borderColor": "#F4B400",
              "backgroundColor": "rgba(244, 180, 0, 0.1)"
            },
            severe: {
              data: [],
              "borderColor": "#D32F2F",
              "backgroundColor": "rgba(211, 47, 47, 0.1)"
            },
          };

        data.diagnosis_distribution.forEach(el => {
          labels.push(el.month)
          el.labels_count.forEach(it => {
            labelData[it.label.name].data.push(it.count)
          })
        });

        labelCount["moderate"] = labelCount.mild;

        setChartData({
          distribution: labelCount,
          trend: {
            labels: labels,
            datasets: Object.keys(labelData).map(el => ({
              ...labelData[el],
              label: t(`home.summaryChart.categories.${el === "mild" ? "moderate" : el}`),
            }))
          }
        })
      } catch (e) {

      }
      finally {
        setIsSummaryLoading(false);
      }
    }

    loadPlot();
    loadSummary();
  }, [plotId]);

  const formatDate = (date: Date | string): string => {
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    if (typeof date === 'string')
      date = new Date(date);
    const monthKey = monthKeys[date.getMonth()];
    const monthName = t(`plots.months.${monthKey}`);
    return `${date.getDate()} de ${monthName}, ${date.getFullYear()}`;
  };

  const handleDownloadChart = (chartName: string) => {
    console.log(`Descargar gráfico: ${chartName}`);
  };

  const handleExpandChart = (chartType: ChartType) => {
    setExpandedChart(chartType);
  };

  const handleCloseModal = () => {
    setExpandedChart(null);
  };

  if (isLoading) {
    return <Loader text={t('plots.loading')} />;
  }

  if (error || !plot) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-error mb-4"></i>
        <p className="text-error font-semibold">{error || t('plots.notFound')}</p>
        <a href="/plots" className="inline-block mt-4 text-primary hover:underline">
          {t('plots.backToPlots')}
        </a>
      </div>
    );
  }

  const healthyPercentage = plot.total_diagnosis > 0
    ? ((plot.healthy_diagnosis / plot.total_diagnosis) * 100).toFixed(2)
    : '0.00';

  return (
    <div>
      <div className="mb-6">
        <a href="/plots" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <i className="fas fa-arrow-left"></i>
          {t('plots.backToPlots')}
        </a>
        <h1 className="text-2xl sm:text-3xl font-bold text-state-idle">{t('plots.plotDetails')}</h1>
      </div>

      {/* Información de la parcela */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Columna izquierda */}
        <div className="bg-white rounded-lg border border-outline p-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-state-disabled mb-1">{t('plots.details.name')}</h3>
            <p className="text-base text-state-idle font-semibold">
              {plot.id ? plot.name : t('plots.default.name')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-state-disabled mb-1">{t('plots.details.description')}</h3>
            <p className="text-sm text-state-idle leading-relaxed">
              {plot.id ? plot.description : t('plots.default.description')}
            </p>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="bg-white rounded-lg border border-outline p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-state-disabled mb-1">{t('plots.details.diagnosticsCount')}</h3>
              <p className="text-2xl text-state-idle font-semibold">{plot.total_diagnosis}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-state-disabled mb-1">{t('plots.details.healthyCount')}</h3>
              <p className="text-2xl text-state-idle font-semibold">{plot.healthy_diagnosis} ({healthyPercentage}%)</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-state-disabled mb-1">{t('plots.details.createdAt')}</h3>
              <p className="text-sm text-state-idle">{formatDate(plot.created_at)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-state-disabled mb-1">{t('plots.details.lastDiagnostic')}</h3>
              <p className="text-sm text-state-idle">
                {plot.last_diagnosis ? formatDate(plot.last_diagnosis) : t('plots.details.noDiagnostics')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de diagnósticos */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-state-idle mb-6">{t('plots.details.analysis')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tendencia de diagnósticos */}
          <div className="bg-white rounded-lg border border-outline p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-state-idle">{t('plots.details.trendChart')}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadChart('tendencia')}
                  className="p-2 text-state-disabled hover:text-state-idle transition-colors"
                  title={t('plots.details.download')}
                >
                  <i className="fas fa-download"></i>
                </button>
                <button
                  onClick={() => handleExpandChart('trend')}
                  className="p-2 text-state-disabled hover:text-state-idle transition-colors"
                  title={t('plots.details.expand')}
                >
                  <i className="fas fa-expand-alt"></i>
                </button>
              </div>
            </div>
            {isSummaryLoading && <Loader text={t("common.loading")}/>}
            {!isSummaryLoading && chartData.trend && <TrendChart data={chartData.trend}/>}
          </div>

          {/* Distribución de diagnósticos */}
          <div className="bg-white rounded-lg border border-outline p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-state-idle">{t('plots.details.distributionChart')}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadChart('distribución')}
                  className="p-2 text-state-disabled hover:text-state-idle transition-colors"
                  title={t('plots.details.download')}
                >
                  <i className="fas fa-download"></i>
                </button>
                <button
                  onClick={() => handleExpandChart('distribution')}
                  className="p-2 text-state-disabled hover:text-state-idle transition-colors"
                  title={t('plots.details.expand')}
                >
                  <i className="fas fa-expand-alt"></i>
                </button>
              </div>
            </div>
            {isSummaryLoading && <Loader text={t("common.loading")}/>}
            {!isSummaryLoading && chartData.distribution && <DistributionChart data={chartData.distribution} />}
          </div>
        </div>
      </div>

      {/* Modal de Tendencia */}
      <ChartModal
        isOpen={expandedChart === 'trend'}
        onClose={handleCloseModal}
        title={t('plots.details.trendChart')}
      >
        <div className="h-[600px]">
          {isSummaryLoading && <Loader text={t("common.loading")}/>}
          {!isSummaryLoading && chartData.trend && <TrendChart data={chartData.trend} />}
        </div>
      </ChartModal>

      {/* Modal de Distribución */}
      <ChartModal
        isOpen={expandedChart === 'distribution'}
        onClose={handleCloseModal}
        title={t('plots.details.distributionChart')}
      >
        <div className="max-w-2xl mx-auto">
          {isSummaryLoading && <Loader text={t("common.loading")}/>}
          {!isSummaryLoading && chartData.distribution && <DistributionChart data={chartData.distribution} />}
        </div>
      </ChartModal>
    </div>
  );
}
