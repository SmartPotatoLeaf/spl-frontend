import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {Plot} from "@/types";
import {assignPlotToPredictions} from "@/services/plotService.ts";
import {toast} from "@/stores";

interface AssignPlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionId: string;
  currentPlot?: string;
  plots: Plot[]
}

export default function AssignPlotModal({
                                          isOpen,
                                          onClose,
                                          predictionId,
                                          currentPlot,
  plots,
                                        }: AssignPlotModalProps) {
  const {t} = useTranslation();
  const [selectedPlot, setSelectedPlot] = useState(currentPlot);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {

    if (isOpen && currentPlot) {
      const plot = plots.find((p) => p.id === (+currentPlot));
      if (plot) {
        setSelectedPlot(plot.id as any);
      }
    } else if (!isOpen) {
      setSelectedPlot('');
    }
  }, [isOpen, currentPlot, plots]);

  if (!isOpen) return null;

  const handleAssign = async () => {
    if (!selectedPlot) return;

    try {
      setIsSubmitting(true);
      // assign the plot to the prediction
       await assignPlotToPredictions((+selectedPlot), [+predictionId])
      toast.success(t("leaf.assignPlotModal.assignSuccess"))
    } catch (e) {
      toast.success(t("leaf.assignPlotModal.assignError"))
    } finally {
      setIsSubmitting(false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-state-idle/50 backdrop-blur-sm" onClick={onClose}/>

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
              {plots.map((plot) => (
                <option key={plot.id} value={plot.id}>
                  {plot.id ? plot.name : t("plots.default.name")}
                </option>
              ))}
            </select>
          </div>

          {plots.length === 0 && (
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
