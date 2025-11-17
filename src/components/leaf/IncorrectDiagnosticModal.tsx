import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {createFeedback, updateFeedback} from "@/components/shared/feedbackService.ts";
import type {Feedback} from "@/types/feedback.ts";
import {toast} from "@/stores";

interface IncorrectDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionId: string;
  currentLabel: string;
  comment?: string;
  feedbackId?: number | string;
  severityOptions: {
    value: string;
    labelKey: string;
  }[];
  onSubmit?: (data: Feedback) => void;
}


export default function IncorrectDiagnosticModal({
                                                   isOpen,
                                                   onClose,
                                                   predictionId,
                                                   feedbackId,
                                                   currentLabel,
                                                   comment,
                                                   severityOptions,
                                                   onSubmit
                                                 }: IncorrectDiagnosticModalProps) {
  const {t} = useTranslation();
  const [correctLabel, setCorrectLabel] = useState(currentLabel ?? "");
  const [comments, setComments] = useState(comment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!isOpen) return null;
  const handleSubmit = async () => {
    if (!correctLabel) return;

    setIsSubmitting(true);
    try {
      const data = await (feedbackId ? updateFeedback((+feedbackId), {
        correct_label_id: +correctLabel,
        comment: comments
      }) : createFeedback({
        correct_label_id: +correctLabel,
        comment: comments!,
        prediction_id: +predictionId
      }));

      onSubmit && onSubmit(data);
      toast.success("")
    } catch (e) {
      toast.error("")
    } finally {
      setIsSubmitting(false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-state-idle/50 backdrop-blur-sm" onClick={onClose}/>

      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="sticky top-0 bg-white border-b border-outline p-6 flex items-center justify-between">
          <h2 className="text-xl font-medium text-state-idle">
            {t('leaf.incorrectModal.title')}
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
          <p className="text-state-disabled">{t('leaf.incorrectModal.description')}</p>

          <div>
            <label className="block text-sm font-medium text-state-idle mb-2">
              {t('leaf.incorrectModal.correctLabel')}
            </label>
            <select
              value={correctLabel}
              onChange={(e) => setCorrectLabel(e.target.value)}
              className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">{t('leaf.incorrectModal.selectLabel')}</option>
              {severityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-state-idle mb-2">
              {t('leaf.incorrectModal.comments')}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={t('leaf.incorrectModal.commentsPlaceholder')}
              rows={4}
              className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-outline text-state-idle rounded-lg hover:bg-outline/10 transition-colors disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!correctLabel || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? t('common.loading') : t('leaf.incorrectModal.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
