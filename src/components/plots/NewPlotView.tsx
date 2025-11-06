import { useTranslation } from 'react-i18next';
import PlotFormWrapper from './PlotFormWrapper';

export default function NewPlotView() {
  const { t } = useTranslation();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <a href="/plots" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <i className="fas fa-arrow-left"></i>
          {t('plots.backToPlots')}
        </a>
        <h1 className="text-2xl sm:text-3xl font-bold text-state-idle mb-2">
          {t('plots.newPlot')}
        </h1>
        <p className="text-state-disabled">{t('plots.newPlotSubtitle')}</p>
      </div>

      <div className="bg-white rounded-lg border border-outline p-6">
        <PlotFormWrapper mode="create" />
      </div>
    </div>
  );
}
