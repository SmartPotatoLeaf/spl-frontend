import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import plotsData from '@/data/plots.json';

interface AssignPlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionId: string;
  currentPlot?: string;
}

export default function AssignPlotModal({
  isOpen,
  onClose,
  predictionId,
  currentPlot,
}: AssignPlotModalProps) {
  const { t } = useTranslation();
  const [selectedPlot, setSelectedPlot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && currentPlot) {
      const plot = plotsData.find((p) => p.name === currentPlot);
      if (plot) {
        setSelectedPlot(plot.id);
      }
    } else if (!isOpen) {
      setSelectedPlot('');
    }
  }, [isOpen, currentPlot]);

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedPlot) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Assigning plot:', selectedPlot, 'to prediction:', predictionId);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-state-idle/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="bg-white border-b border-outline p-6 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-medium text-state-idle">
            {t('leaf.assignPlotModal.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-state-disabled hover:text-state-idle transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-state-disabled">{t('leaf.assignPlotModal.description')}</p>

          <div>
            <label className="block text-sm font-medium text-state-idle mb-2">
              {t('leaf.assignPlotModal.selectPlot')}
            </label>
            <select
              value={selectedPlot}
              onChange={(e) => setSelectedPlot(e.target.value)}
              className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">{t('leaf.assignPlotModal.selectPlaceholder')}</option>
              {plotsData.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.name}
                </option>
              ))}
            </select>
          </div>

          {plotsData.length === 0 && (
            <div className="bg-outline/10 border border-outline rounded-lg p-4 text-center">
              <p className="text-state-disabled text-sm mb-2">
                {t('leaf.assignPlotModal.noPlots')}
              </p>
              <a
                href="/plots"
                className="text-primary text-sm font-medium hover:underline"
              >
                {t('leaf.assignPlotModal.orCreateNew')}
              </a>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-outline text-state-idle rounded-lg hover:bg-outline/10 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedPlot || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t('common.loading') : t('leaf.assignPlotModal.assign')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
