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
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [selectedPlot, setSelectedPlot] = useState('');
  const [newPlotName, setNewPlotName] = useState('');
  const [newPlotDescription, setNewPlotDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setMode('select');
      setSelectedPlot('');
      setNewPlotName('');
      setNewPlotDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAssignExisting = async () => {
    if (!selectedPlot) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Assigning plot:', selectedPlot, 'to prediction:', predictionId);
    setIsSubmitting(false);
    onClose();
  };

  const handleCreateAndAssign = async () => {
    if (!newPlotName.trim()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Creating plot:', { name: newPlotName, description: newPlotDescription });
    console.log('Assigning to prediction:', predictionId);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-state-idle/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-outline p-6 flex items-center justify-between">
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

        <div className="p-6 space-y-6">
          <p className="text-state-disabled">{t('leaf.assignPlotModal.description')}</p>

          <div className="flex gap-2 border-b border-outline">
            <button
              onClick={() => setMode('select')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                mode === 'select'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-state-disabled hover:text-state-idle'
              }`}
            >
              {t('leaf.assignPlotModal.selectPlot')}
            </button>
            <button
              onClick={() => setMode('create')}
              className={`px-4 py-2 border-b-2 transition-colors ${
                mode === 'create'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-state-disabled hover:text-state-idle'
              }`}
            >
              {t('leaf.assignPlotModal.orCreateNew')}
            </button>
          </div>

          {mode === 'select' ? (
            <div className="space-y-4">
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

              <button
                onClick={handleAssignExisting}
                disabled={!selectedPlot || isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('common.loading') : t('leaf.assignPlotModal.assign')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-state-idle mb-2">
                  {t('leaf.assignPlotModal.plotName')}
                </label>
                <input
                  type="text"
                  value={newPlotName}
                  onChange={(e) => setNewPlotName(e.target.value)}
                  placeholder={t('leaf.assignPlotModal.plotNamePlaceholder')}
                  className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-state-idle mb-2">
                  {t('leaf.assignPlotModal.plotDescription')}
                </label>
                <textarea
                  value={newPlotDescription}
                  onChange={(e) => setNewPlotDescription(e.target.value)}
                  placeholder={t('leaf.assignPlotModal.plotDescriptionPlaceholder')}
                  rows={3}
                  className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <button
                onClick={handleCreateAndAssign}
                disabled={!newPlotName.trim() || isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('common.loading') : t('leaf.assignPlotModal.create')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
