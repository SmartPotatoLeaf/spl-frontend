import { useTranslation } from 'react-i18next';
import PlotsGrid from './PlotsGrid';

export default function PlotsListView() {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-state-idle mb-2">
            {t('plots.title')}
          </h1>
          <p className="text-state-disabled">{t('plots.subtitle')}</p>
        </div>
        <a
          href="/plots/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          <i className="fas fa-plus"></i>
          {t('plots.addPlot')}
        </a>
      </div>

      <PlotsGrid />
    </>
  );
}
